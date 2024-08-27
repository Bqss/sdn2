import { firestore } from "@/lib/firebase";
import { storage } from "firebase-admin";
import { getDownloadURL } from "firebase-admin/storage";
import * as yup from "yup";
import admin from "firebase-admin";
import { revalidateTag } from "next/cache";

export async function GET() {
  const ekskul = await firestore().collection("ekstrakurikuler").get();

  try {
    const mappedData = await Promise.all(
      ekskul.docs.map(async (doc) => {
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
        message: "Data ekskul berhasil diambil",
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
    thumbnail: yup.mixed().required("Thumbnail harus diisi"),
    nama: yup.string().required("Nama ekstrakurikuler harus diisi"),
    deskripsi: yup.string().required("Deskripsi ekstrakurikuler harus diisi"),
  });

  const body = await request.formData();
  const payload = Object.fromEntries(body.entries());

  try {
    pegawaiSchema.validateSync(payload);
    const file = body.get("thumbnail") as File | null;

    if (file) {
      const bucket = storage().bucket();
      const fileName = `${Date.now()}_${file.name}`;
      const fileRef = bucket.file(`ekstrakurikuler/${fileName}`);
      // Upload the file to Firebase Storage
      await fileRef.save(Buffer.from(await file.arrayBuffer()), {
        metadata: {
          contentType: file.type,
        },
      });
      // Get the file URL
      payload.thumbnail = `ekstrakurikuler/${fileName}`;
    }

    // Add the file URL to the payload
    // Save the payload to Firestore
    await firestore()
      .collection("ekstrakurikuler")
      .add({
        ...payload,
      });
    revalidateTag("ekskul");
    return Response.json(
      {
        message: "Berhasil menambahkan ekstrakurikuler",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
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
