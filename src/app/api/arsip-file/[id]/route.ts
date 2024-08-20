import { firestore, storage } from "@/lib/firebase";
import { getDownloadURL } from "firebase-admin/storage";
import * as yup from "yup";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const detailArsip = await firestore()
    .collection("arsip-file")
    .doc(params.id)
    .get();

  if (!detailArsip.exists) {
    return Response.json(
      {
        message: "Data arsip tidak ditemukan",
      },
      {
        status: 404,
      }
    );
  } else {
    const { file, ...rest } = detailArsip.data() as any;
    return Response.json(
      {
        data: {
          id: detailArsip.id,
          file: file
            ? {
                file_path: file,
                preview: await getDownloadURL(storage().bucket().file(file)),
              }
            : null,
          ...rest,
        },
        message: "Berhasil mendapatkan data detail arsip",
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

  const updateArsip = yup.object({
    nama: yup.string().required("Nama tidak boleh kosong"),
    file: yup.mixed().required("File tidak boleh kosong"),
    tag: yup.string().required("Tag tidak boleh kosong"),
  });

  const oldData = await firestore().collection("arsip-file").doc(params.id).get();
  if (!oldData.exists) {
    return Response.json(
      {
        message: "Data arsip tidak ditemukan",
      },
      {
        status: 404,
      }
    );
  }

  const body = await request.formData();
  const payload = Object.fromEntries(body.entries());

  if(payload["file[file_path]"]){
    payload.file = payload["file[file_path]"];
    delete payload["file[file_path]"];
    delete payload["file[preview]"];
  }

  try {
    await updateArsip.validate(payload, { abortEarly: false });
    if (!payload["file[file_path]"]) {
      const file = body.get("file") as File | null;
      if (file) {
        const bucket = storage().bucket();
        const fileName = `${Date.now()}_${file.name}`;

        // Delete the old photo from storage
        const oldFilePath = oldData.data()?.file;
        if (oldFilePath) {
          const oldPhotoRef = storage().bucket().file(oldFilePath);
          await oldPhotoRef.delete();
        }

        const fileRef = bucket.file(`arsip/${fileName}`);
        await fileRef.save(Buffer.from(await file.arrayBuffer()), {
          metadata: {
            contentType: file.type,
          },
        });
        payload.file = `arsip/${fileName}`;
      }
    } 

    await firestore()
      .collection("arsip-file")
      .doc(params.id)
      .update({
        ...payload,
      });
    return Response.json(
      {
        message: "Arsip berhasil diupdate",
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

  const dataPegawai = await firestore().collection("arsip-file").doc(params.id).get();
  if(!dataPegawai.exists){
    return Response.json({
      message: "Data arsip tidak ditemukan",
      success: false,
    }, {
      status: 404
    });
  }

  try {
    await firestore().collection("arsip-file").doc(params.id).delete();
    await storage().bucket().file(dataPegawai.data()?.file).delete();
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
