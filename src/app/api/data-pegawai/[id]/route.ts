import { firestore, storage } from "@/lib/firebase";
import { getDownloadURL } from "firebase-admin/storage";
import { revalidateTag } from "next/cache";
import * as yup from "yup";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const detailPegawai = await firestore()
    .collection("pegawai")
    .doc(params.id)
    .get();

  if (!detailPegawai.exists) {
    return Response.json(
      {
        message: "Data pegawai tidak ditemukan",
      },
      {
        status: 404,
      }
    );
  } else {
    const { foto, ...rest } = detailPegawai.data() as any;
    return Response.json(
      {
        data: {
          id: detailPegawai.id,
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

  const updateProfileSchema = yup.object({
    nama: yup.string().required(),
    jabatan: yup.string().required(),
    order: yup.number().required(),
    is_male: yup.string().required(),
    deskripsi: yup.string().nullable(),
    foto: yup.mixed().nullable(), 
  });

  const oldData = await firestore().collection("pegawai").doc(params.id).get();
  if (!oldData.exists) {
    return Response.json(
      {
        message: "Data pegawai tidak ditemukan",
      },
      {
        status: 404,
      }
    );
  }

  const body = await request.formData();
  const payload = Object.fromEntries(body.entries());

  try {
    await updateProfileSchema.validate(payload, { abortEarly: false });
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

        const fileRef = bucket.file(`pegawai/${fileName}`);
        await fileRef.save(Buffer.from(await file.arrayBuffer()), {
          metadata: {
            contentType: file.type,
          },
        });
        payload.foto = `pegawai/${fileName}`;
      }
    } else {
      payload.foto = payload["foto[file_path]"];
      delete payload["foto[file_path]"];
      delete payload["foto[preview]"];
    }

    const {order, ...restPayload} = payload;

    await firestore()
      .collection("pegawai")
      .doc(params.id)
      .set({
        order: parseInt(order.toString(), 10),
        ...restPayload,
      });
    revalidateTag("staff");
    return Response.json(
      {
        message: "Profile sekolah berhasil diupdate",
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

  const dataPegawai = await firestore().collection("pegawai").doc(params.id).get();
  if(!dataPegawai.exists){
    return Response.json({
      message: "Data pegawai tidak ditemukan",
      success: false,
    }, {
      status: 404
    });
  }

  try {
    await firestore().collection("pegawai").doc(params.id).delete();
    await storage().bucket().file(dataPegawai.data()?.foto).delete();
    revalidateTag("staff");
    return Response.json({
      message: "Data pegawai berhasil dihapus",
      success: true,
    });
  } catch (error) {
    return Response.json({
      message: "Gagal menghapus data pegawai, server error",
      success: false,
    });
  }
}
