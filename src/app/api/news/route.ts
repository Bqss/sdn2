import { firestore } from "@/lib/firebase";
import { storage } from "firebase-admin";
import { getDownloadURL } from "firebase-admin/storage";
import * as yup from "yup";
import admin from "firebase-admin";
import { revalidateTag } from "next/cache";

export async function GET() {
  const berita = await firestore().collection("news").orderBy("created_at","desc").get();

  try {
    const mappedData = await Promise.all(
      berita.docs.map(async (doc) => {
        const { thumbnail, ...rest } = doc.data();
        return {
          id: doc.id,
          ...rest,
          thumbnail: thumbnail
            ? await getDownloadURL(storage().bucket().file(thumbnail))
            : null,
        };
      })
    );
    return Response.json(
      {
        data: mappedData,
        message: "Data berita berhasil diambil",
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
    judul: yup.string().required("Judul harus diisi"),
    deskripsi: yup.string().required("Deskripsi "),
    content: yup.string().nullable("Content tidak boleh kosong"),
    thumbnail: yup.mixed().required("Thumbnail tidak boleh kosong"),
  });

  const body = await request.formData();
  const payload = Object.fromEntries(body.entries());

  try {
    pegawaiSchema.validateSync(payload);
    const file = body.get("thumbnail") as File | null;

    if (file) {
      const bucket = storage().bucket();
      const fileName = `${Date.now()}_${file.name}`;
      const fileRef = bucket.file(`news/${fileName}`);
      // Upload the file to Firebase Storage
      await fileRef.save(Buffer.from(await file.arrayBuffer()), {
        metadata: {
          contentType: file.type,
        },
      });
      // Get the file URL
      payload.thumbnail = `news/${fileName}`;
    }

    // Add the file URL to the payload
    // Save the payload to Firestore
    await firestore()
      .collection("news")
      .add({
        ...payload,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
    revalidateTag("news");
    return Response.json(
      {
        message: "Berhasil menambahkan berita",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error)
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
