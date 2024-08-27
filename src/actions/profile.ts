import { firestore, storage } from "@/lib/firebase";
import { getDownloadURL } from "firebase-admin/storage";
import { unstable_cache } from "next/cache";

export const getChachedProfile = unstable_cache(
  async () => {
    let profile = (await firestore().collection("profile-sekolah").doc("profile").get()).data();
    if(profile){
      profile.foto_kepsek = await getDownloadURL(storage().bucket().file(profile.foto_kepsek)) 
    }

    return profile;
  },
  ["profile"],
  { revalidate: 3600, tags: ["profile"] }
);
