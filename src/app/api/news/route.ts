import { firestore } from "@/lib/firebase";
import { storage } from "firebase-admin";
import { getDownloadURL } from "firebase-admin/storage";
import * as yup from "yup";
import admin from "firebase-admin";
import { revalidateTag } from "next/cache";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "0", 10);
  const size = parseInt(url.searchParams.get("size") || "10", 10);

  const cursor = page * size - 1;
  let snapshot;
  const all = await firestore()
    .collection("news")
    .orderBy("created_at", "desc")
    .get();
  const lastVisible = all.docs[cursor];

  try {
    if (cursor < 0) {
      snapshot = await firestore()
        .collection("news")
        .orderBy("created_at", "asc")
        .limit(size)
        .get();
    } else {
      snapshot = await firestore()
        .collection("news")
        .orderBy("created_at", "asc")
        .startAfter(lastVisible)
        .limit(size)
        .get();
    }

    const mappedData = await Promise.all(
      snapshot.docs.map(async (doc) => {
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
        pageCount: Math.ceil(all.size / size),
        rowCount: all.size,
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
