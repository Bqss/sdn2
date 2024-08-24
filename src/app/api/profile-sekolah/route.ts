import { firestore, storage } from "@/lib/firebase";
import { getDownloadURL } from "firebase-admin/storage";
import * as yup from "yup";

export async function GET() {
  const profileSekolah = await firestore()
    .collection("profile-sekolah")
    .doc("profile")
    .get();

    const { foto_kepsek, ...rest } = profileSekolah.data() as any ??{};

  const data = {
    foto_kepsek : foto_kepsek ? {
      preview: await getDownloadURL(storage().bucket().file(foto_kepsek)),
      file_path: foto_kepsek
    } : null,
    ...rest
  }

  return Response.json(
    {
      data,
    },
    {
      status: 200,
    }
  );
}

export async function POST(request: Request) {
  const updateProfileSchema = yup.object({
    sambutan_kepsek: yup
      .string()
      .required("Profil Singkat Sekolah tidak boleh kosong"),
    nama_kepsek: yup
      .string()
      .required("Nama Kepala Sekolah tidak boleh kosong"),
    foto_kepsek: yup.mixed().required("Foto Kepala Sekolah tidak boleh kosong"),
    profile_lengkap: yup
      .string()
      .required("Profil Lengkap Sekolah tidak boleh kosong"),
    visi: yup.string().required("Visi Sekolah tidak boleh kosong"),
    misi: yup.string().required("Misi Sekolah tidak boleh kosong"),
    tujuan: yup.string().required("Tujuan Sekolah tidak boleh kosong"),
    sejarah: yup.string().required("Sejarah Sekolah tidak boleh kosong"),
  });
  const body = await request.formData();
  const payload = Object.fromEntries(body.entries());
  const oldProfile = (
    await firestore().collection("profile-sekolah").doc("profile").get()
  ).data();

  if(payload['foto_kepsek[file_path]']){
    payload.foto_kepsek = payload['foto_kepsek[file_path]'];
    delete payload['foto_kepsek[file_path]']
    delete payload['foto_kepsek[preview]']
  }

  try {
    await updateProfileSchema.validate(payload, { abortEarly: false });
    if (typeof payload.foto_kepsek !== "string") {
      const file = body.get("foto_kepsek") as File | null;
      if (file) {
        const bucket = storage().bucket();
        const fileName = `${Date.now()}_${file.name}`;
        const fileRef = bucket.file(`pegawai/${fileName}`);
        await fileRef.save(Buffer.from(await file.arrayBuffer()), {
          metadata: {
            contentType: file.type,
          },
        });
        if(oldProfile?.foto_kepsek){
          await storage().bucket().file(oldProfile.foto_kepsek).delete();
        }

        payload.foto_kepsek = `pegawai/${fileName}`;
      }
    }

    await firestore().collection("profile-sekolah").doc("profile").set({
      visi: payload.visi,
      misi: payload.misi,
      nama_kepsek: payload.nama_kepsek,
      foto_kepsek: payload.foto_kepsek,
      sambutan_kepsek: payload.sambutan_kepsek,
      profile_lengkap: payload.profile_lengkap,
      sejarah: payload.sejarah,
      tujuan: payload.tujuan,
    });
    return Response.json(
      {
        message: "Profile sekolah berhasil diupdate",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error)
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
