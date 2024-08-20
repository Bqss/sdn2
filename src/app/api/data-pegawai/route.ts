import { firestore } from "@/lib/firebase";
import { storage } from "firebase-admin";
import { getDownloadURL } from "firebase-admin/storage";
import * as yup from "yup";

export async function GET() {
  const pegawaiSekolah = await firestore().collection("pegawai").get();

  try {
    const mappedData = await Promise.all(
      pegawaiSekolah.docs.map(async (doc) => {
        const { foto, ...rest } = doc.data();
        return {
          id: doc.id,
          ...rest,
          foto: foto ? await getDownloadURL(storage().bucket().file(foto)) : null,
        };
      })
    );
    return Response.json(
      {
        data: mappedData,
        message: "Data pegawai berhasil diambil",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err)
  }

}

  

export async function POST(request: Request) {
  const pegawaiSchema = yup.object({
    nama: yup.string().required(),
    jabatan: yup.string().required(),
    order: yup.number().required(),
    deskripsi: yup.string().required(),
    foto: yup.mixed().nullable(), 
  });

  const body = await request.formData();
  const payload = Object.fromEntries(body.entries());
  
  try {
    pegawaiSchema.validateSync(payload);
    const file = body.get("foto") as File | null;

    if (file) {
      const bucket = storage().bucket();
      const fileName = `${Date.now()}_${file.name}`;
      const fileRef = bucket.file(`pegawai/${fileName}`);

      // Upload the file to Firebase Storage
      await fileRef.save(Buffer.from(await file.arrayBuffer()), {
        metadata: {
          contentType: file.type,
        },
      });
      payload.foto = `pegawai/${fileName}`;
      payload.order = parseInt(payload.order.toString(), 10) as any;
    }

    await firestore().collection("pegawai").add(payload);

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
