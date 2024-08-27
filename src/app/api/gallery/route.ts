import { firestore } from "@/lib/firebase";
import { storage } from "firebase-admin";
import { getDownloadURL } from "firebase-admin/storage";
import * as yup from "yup";
import admin from "firebase-admin";
import { revalidateTag } from "next/cache";

export async function GET() {
  const berita = await firestore().collection("gallery").get();
  try {
    const mappedData = await Promise.all(
      berita.docs.map(async (doc) => {
        const { foto, ...rest } = doc.data();
        return {
          id: doc.id,
          ...rest,
          foto: foto
            ? await getDownloadURL(storage().bucket().file(foto))
            : null,
        };
      })
    );
    return Response.json(
      {
        data: mappedData,
        message: "Data gallery berhasil diambil",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return Response.json(
      {
        message: "Internal server error",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  const pegawaiSchema = yup.object({
    id: yup.string().nullable(),
    judul: yup.string().required("Judul tidak boleh kosong"),
    deskripsi: yup.string().required("Deskripsi tidak boleh kosong"),
    foto: yup.mixed().required("Foto tidak boleh kosong"),
  });

  const body = await request.formData();
  const payload = Object.fromEntries(body.entries());

  try {
    pegawaiSchema.validateSync(payload);
    const file = body.get("foto") as File | null;

    if (file) {
      const bucket = storage().bucket();
      const fileName = `${Date.now()}_${file.name}`;
      const fileRef = bucket.file(`gallery/${fileName}`);
      await fileRef.save(Buffer.from(await file.arrayBuffer()), {
        metadata: {
          contentType: file.type,
        },
      });
      payload.foto = `gallery/${fileName}`;
    }

    await firestore()
      .collection("gallery")
      .add({
        ...payload,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
    revalidateTag("gallery");
    return Response.json(
      {
        message: "Berhasil menambahkan gallery",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);
    if (error instanceof yup.ValidationError) {
      return new Response(
        JSON.stringify({
          message: "Validation error",
          errors: error.errors,
        }),
        {
          status: 400,
        }
      );
    }
    return new Response(
      JSON.stringify({
        message: "Internal server error",
      }),
      {
        status: 500,
      }
    );
  }
}
