import { firestore, storage } from "@/lib/firebase";
import { getDownloadURL } from "firebase-admin/storage";
import { revalidateTag } from "next/cache";
import * as yup from "yup";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const detailBerita = await firestore()
    .collection("gallery")
    .doc(params.id)
    .get();

  if (!detailBerita.exists) {
    return Response.json(
      {
        message: "Data berita tidak ditemukan",
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
        message: "Berhasil mendapatkan data detail pegawai",
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

  const updateGallerySchema = yup.object({
    judul: yup.string().required("Judul harus diisi"),
    deskripsi: yup.string().nullable("Deskripsi "),
    content: yup.string().nullable("Content tidak boleh kosong"),
    foto: yup.mixed().required("Thumbnail tidak boleh kosong"),
  });

  const oldData = await firestore().collection("gallery").doc(params.id).get();
  if (!oldData.exists) {
    return Response.json(
      {
        message: "Data gallery tidak ditemukan",
      },
      {
        status: 404,
      }
    );
  }

  const body = await request.formData();
  const payload = Object.fromEntries(body.entries());

  if (payload["foto[file_path]"]) {
    payload.foto= payload["foto[file_path]"];
    delete payload["foto[file_path]"];
    delete payload["foto[preview]"];
  }

  try {
    await updateGallerySchema.validate(payload, { abortEarly: false });
    if (!payload["foto[file_path]"]) {
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
        const fileRef = bucket.file(`gallery/${fileName}`);
        await fileRef.save(Buffer.from(await file.arrayBuffer()), {
          metadata: {
            contentType: file.type,
          },
        });
        payload.foto = `gallery/${fileName}`;
      }
    }

    await firestore()
      .collection("gallery")
      .doc(params.id)
      .update({
        ...payload,
      });
    revalidateTag("gallery");
    return Response.json(
      {
        message: "Berita berhasil diupdate",
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
    .collection("gallery")
    .doc(params.id)
    .get();
  if (!dataPegawai.exists) {
    return Response.json(
      {
        message: "Data gallery tidak ditemukan",
        success: false,
      },
      {
        status: 404,
      }
    );
  }

  try {
    await firestore().collection("gallery").doc(params.id).delete();
    await storage().bucket().file(dataPegawai.data()?.foto).delete();
    revalidateTag("gallery");
    return Response.json({
      message: "Gallery berhasil dihapus",
      success: true,
    });
  } catch (error) {
    return Response.json({
      message: "Gagal menghapus gallery, server error",
      success: false,
    });
  }
}
