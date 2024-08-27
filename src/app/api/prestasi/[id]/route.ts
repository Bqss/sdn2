import { firestore, storage } from "@/lib/firebase";
import { getDownloadURL } from "firebase-admin/storage";
import { revalidateTag } from "next/cache";
import * as yup from "yup";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const detailBerita = await firestore()
    .collection("prestasi")
    .doc(params.id)
    .get();

  if (!detailBerita.exists) {
    return Response.json(
      {
        message: "Data prestasi tidak ditemukan",
      },
      {
        status: 404,
      }
    );
  } else {
    const { foto, ...rest } = detailBerita.data() as any;
    return Response.json(
      {
        data: {
          id: detailBerita.id,
          foto: foto
            ? {
                file_path: foto,
                preview: await getDownloadURL(storage().bucket().file(foto)),
              }
            : null,
          ...rest,
        },
        message: "Berhasil mendapatkan data detail prestasi",
      },
      {
        status: 200,
      }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return Response.json(
      {
        success: false,
        message: "Request tidak valid",
      },
      {
        status: 400,
      }
    );
  }

  const updatePrestasiSchema = yup.object({
    foto: yup.mixed().required("Foto tidak boleh kosong"),
    judul: yup.string().required("Judul tidak boleh kosong"),
    skala: yup.string().required("Skala prestasi tidak boleh kosong"),
    peraih: yup.string().required("Peraih tidak boleh kosong"),
    penyelenggara: yup.string().required("Penyelenggara tidak boleh kosong"),
  });

  const oldData = await firestore().collection("prestasi").doc(params.id).get();
  if (!oldData.exists) {
    return Response.json(
      {
        message: "Data prestasi tidak ditemukan",
      },
      {
        status: 404,
      }
    );
  }

  const body = await request.formData();
  const payload = Object.fromEntries(body.entries());

  if (payload["foto[file_path]"]) {
    payload.foto = payload["foto[file_path]"];
    delete payload["foto[file_path]"];
    delete payload["foto[preview]"];
  }

  try {
    await updatePrestasiSchema.validate(payload, { abortEarly: false });
    if (typeof payload.foto !== "string") {
      const file = body.get("foto") as File | null;
      if (file) {
        const bucket = storage().bucket();
        const fileName = `${Date.now()}_${file.name}`;

        // Delete the old photo from storage
        const oldPhotoPath = oldData.data()?.foto;
        if (oldPhotoPath) {
          const oldPhotoRef = storage().bucket().file(oldPhotoPath);
          await oldPhotoRef.delete();
        }
        const fileRef = bucket.file(`prestasi/${fileName}`);
        await fileRef.save(Buffer.from(await file.arrayBuffer()), {
          metadata: {
            contentType: file.type,
          },
        });
        payload.foto = `prestasi/${fileName}`;
      }
    }

    await firestore()
      .collection("prestasi")
      .doc(params.id)
      .update({
        ...payload,
      });
    revalidateTag("awards");
    return Response.json(
      {
        message: "Prestasi berhasil diupdate",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    if (error instanceof yup.ValidationError) {
      return Response.json(
        {
          message: "Validation error",
          errors: error.errors,
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          message: "Internal Server Error",
        },
        {
          status: 500,
        }
      );
    }
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return Response.json(
      {
        message: "ID tidak ditemukan",
      },
      {
        status: 400,
      }
    );
  }

  const dataPegawai = await firestore()
    .collection("prestasi")
    .doc(params.id)
    .get();
  if (!dataPegawai.exists) {
    return Response.json(
      {
        message: "Data prestsi tidak ditemukan",
        success: false,
      },
      {
        status: 404,
      }
    );
  }

  try {
    await firestore().collection("prestasi").doc(params.id).delete();
    await storage().bucket().file(dataPegawai.data()?.foto).delete();
    revalidateTag("awards");
    return Response.json({
      message: "Prestasi berhasil dihapus",
      success: true,
    });
  } catch (error) {
    return Response.json({
      message: "Gagal menghapus prestasi, server error",
      success: false,
    });
  }
}
