import { firestore } from "@/lib/firebase";
import { storage } from "firebase-admin";
import { getDownloadURL } from "firebase-admin/storage";
import * as yup from "yup";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "0", 10);
    const size = parseInt(url.searchParams.get("size") || "10", 10);

    const cursor = page * size - 1;
    let snapshot;
    const all = await firestore().collection("slideshow").get();
    const lastVisible = all.docs[cursor];
    if (cursor < 0) {
      snapshot = await firestore().collection("slideshow").limit(size).get();
    } else {
      snapshot = await firestore()
        .collection("slideshow")
        .startAfter(lastVisible)
        .limit(size)
        .get();
    }

    const mappedData = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const { gambar, ...rest } = doc.data();
        return {
          id: doc.id,
          ...rest,
          gambar: gambar
            ? await getDownloadURL(storage().bucket().file(gambar))
            : null,
        };
      })
    );
    return Response.json(
      {
        data: mappedData,
        pageCount: Math.ceil(all.size / size),
        rowCount: all.size,
        message: "Data slideshow berhasil diambil",
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
    id: yup.string().nullable(),
    judul: yup.string().required(),
    deskripsi: yup.string().required(),
    is_active: yup.mixed().required(),
    order: yup.number().required(),
    gambar: yup.mixed().required(),
  });

  const body = await request.formData();
  const payload = Object.fromEntries(body.entries());
  try {
    pegawaiSchema.validateSync(payload);
    const file = body.get("gambar") as File | null;

    if (file) {
      const bucket = storage().bucket();
      const fileName = `${Date.now()}_${file.name}`;
      const fileRef = bucket.file(`slideshow/${fileName}`);

      // Upload the file to Firebase Storage
      await fileRef.save(Buffer.from(await file.arrayBuffer()), {
        metadata: {
          contentType: file.type,
        },
      });
      // Get the file URL
      payload.gambar = `slideshow/${fileName}`;
      payload.order = parseInt(payload.order.toString(), 10) as any;
    }
    // Add the file URL to the payload
    // Save the payload to Firestore
    console.log(payload);
    await firestore().collection("slideshow").add(payload);
    return new Response(null, { status: 200 });
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
