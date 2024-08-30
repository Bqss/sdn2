import { firestore } from "@/lib/firebase";
import { storage } from "firebase-admin";
import { getDownloadURL } from "firebase-admin/storage";
import { revalidateTag } from "next/cache";
import * as yup from "yup";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "0", 10);
  const size = parseInt(url.searchParams.get("size") || "10", 10);

  const cursor = page * size - 1;
  let snapshot;
  const all = await firestore().collection("arsip-file").get();
  const lastVisible = all.docs[cursor];
  try {
    if (cursor < 0) {
      snapshot = await firestore().collection("arsip-file").limit(size).get();
    } else {
      snapshot = await firestore()
        .collection("arsip-file")
        .startAfter(lastVisible)
        .limit(size)
        .get();
    }
    const mappedData = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const { file, ...rest } = doc.data();
        return {
          id: doc.id,
          file: {
            file_path: file,
            preview: await getDownloadURL(storage().bucket().file(file)),
          },
          ...rest,
        };
      })
    );
    return Response.json(
      {
        data: mappedData,
        message: "Data arsip file berhasil diambil",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
  }
}

export async function POST(request: Request) {
  const pegawaiSchema = yup.object({
    nama: yup.string().required("Nama tidak boleh kosong"),
    file: yup.mixed().required("File tidak boleh kosong"),
    tag: yup.string().required("Tag tidak boleh kosong"),
  });

  const body = await request.formData();
  const payload = Object.fromEntries(body.entries());

  try {
    pegawaiSchema.validateSync(payload);
    const file = body.get("file") as File | null;

    if (file) {
      const bucket = storage().bucket();
      const fileName = `${Date.now()}_${file.name}`;
      const fileRef = bucket.file(`arsip/${fileName}`);

      // Upload the file to Firebase Storage
      await fileRef.save(Buffer.from(await file.arrayBuffer()), {
        metadata: {
          contentType: file.type,
        },
      });

      // Get the file URL
      payload.file = `arsip/${fileName}`;
    }

    // Add the file URL to the payload
    // Save the payload to Firestore
    await firestore().collection("arsip-file").add(payload);
    revalidateTag("arsip-file");

    return Response.json(
      {
        message: "Data arsip file berhasil ditambahkan",
      },
      { status: 200 }
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
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    return new Response(
      JSON.stringify({
        message: "Internal server error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
