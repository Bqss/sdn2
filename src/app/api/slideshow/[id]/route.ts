import { firestore, storage } from "@/lib/firebase";
import { getDownloadURL } from "firebase-admin/storage";
import * as yup from "yup";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const detailSlideshow = await firestore()
    .collection("slideshow")
    .doc(params.id)
    .get();

  if (!detailSlideshow.exists) {
    return Response.json(
      {
        message: "Data slideshow tidak ditemukan",
      },
      {
        status: 404,
      }
    );
  } else {
    const { gambar, ...rest } = detailSlideshow.data() as any;
    return Response.json(
      {
        data: {
          id: detailSlideshow.id,
          gambar: gambar
            ? {
                file_path: gambar,
                preview: await getDownloadURL(storage().bucket().file(gambar)),
              }
            : null,
          ...rest,
        },
        message: "Berhasil mendapatkan data detail slideshow",
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

  const updateSlideshowSchema = yup.object({
    judul: yup.string().required(),
    deskripsi: yup.string().required(),
    is_active: yup.mixed().required(),
    order: yup.number().required(),
    gambar: yup.mixed().required(),
  });

  const oldData = await firestore()
    .collection("slideshow")
    .doc(params.id)
    .get();
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

  if(payload["gambar[file_path]"]) {
    payload["gambar"] = payload["gambar[file_path]"];
    delete payload["gambar[file_path]"];
    delete payload["gambar[preview]"];
  }

  try {
    await updateSlideshowSchema.validate(payload, { abortEarly: false });

    if (!payload["gambar[file_path]"]) {
      const file = body.get("gambar") as File | null;
      if (file) {
        const bucket = storage().bucket();
        const fileName = `${Date.now()}_${file.name}`;

        // Delete the old photo from storage
        const oldPhotoPath = oldData.data()?.gambar;
        if (oldPhotoPath) {
          const oldPhotoRef = storage().bucket().file(oldPhotoPath);
          await oldPhotoRef.delete();
        }

        const fileRef = bucket.file(`slideshow/${fileName}`);
        await fileRef.save(Buffer.from(await file.arrayBuffer()), {
          metadata: {
            contentType: file.type,
          },
        });
        payload.gambar = `slideshow/${fileName}`;
      }
    } 
    await firestore()
      .collection("slideshow")
      .doc(params.id)
      .set({
        ...payload,
      });
    return Response.json(
      {
        message: "Slideshow berhasil diupdate",
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
    .collection("slideshow")
    .doc(params.id)
    .get();
  if (!dataPegawai.exists) {
    return Response.json(
      {
        message: "Data slideshow tidak ditemukan",
        success: false,
      },
      {
        status: 404,
      }
    );
  }

  try {
    await firestore().collection("slideshow").doc(params.id).delete();
    await storage().bucket().file(dataPegawai.data()?.foto).delete();
    return Response.json({
      message: "Data slideshow berhasil dihapus",
      success: true,
    });
  } catch (error) {
    return Response.json({
      message: "Gagal menghapus data pegawai, server error",
      success: false,
    });
  }
}
