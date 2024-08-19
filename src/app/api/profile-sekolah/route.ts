import { firestore } from "@/lib/firebase";
import * as yup from "yup";

export async function GET() {
  const profileSekolah = await firestore().collection("profile-sekolah").doc("profile").get();

  return Response.json({
    data: profileSekolah?.data(),
  },{
    status: 200,
  })
}

export async function POST(request: Request) {
  const updateProfileSchema = yup.object({
    visi: yup.string().required(),
    misi: yup.string().required(),
    profile_singkat: yup.string().required(),
    profile_lengkap: yup.string().required(),
    sejarah: yup.string().required(),
    tujuan: yup.string().required(),
  });
  const body = await request.json();
  try {
    await updateProfileSchema.validate(body, { abortEarly: false });
    await firestore().collection("profile-sekolah").doc("profile").set({
      visi: body.visi,
      misi: body.misi,
      profile_singkat: body.profile_singkat,
      profile_lengkap: body.profile_lengkap,
      sejarah: body.sejarah,
      tujuan: body.tujuan,
    });
    return Response.json({
      message: "Profile sekolah berhasil diupdate",
    },{
      status: 200,
    })


  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return Response.json({
        message: "Validation error",
        errors: error.errors,
      },{
        status: 400,
      })
    }else{
      return Response.json({
        message: "Internal Server Error",
      },{
        status: 500,
      })
    }
  }
}
