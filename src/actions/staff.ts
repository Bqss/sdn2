import { firestore, storage } from "@/lib/firebase";
import { getDownloadURL } from "firebase-admin/storage";
import { unstable_cache } from "next/cache";

export const getCachedStaff = unstable_cache(async() => {

  let pegawai = (await firestore().collection("pegawai").orderBy("order", "asc").get()).docs;
  pegawai = await Promise.all(pegawai.map(async (pegawai: any) => {
    const { foto, ...rest } = pegawai.data();
    return {
      foto: foto ? await getDownloadURL(storage().bucket().file(foto)) : null,
      id: pegawai.id,
      ...rest
    }
  }));
  return pegawai;
},['staff'],{ revalidate: 3600, tags: ['staff'] });