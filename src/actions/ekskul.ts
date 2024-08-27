import { firestore, storage } from "@/lib/firebase";
import { getDownloadURL } from "firebase-admin/storage";
import { unstable_cache } from "next/cache";

export const getCachedEkskul = unstable_cache(async () => {
  let ekskuls: any = (await firestore().collection("ekstrakurikuler").get())
    .docs;
  ekskuls = await Promise.all(
    ekskuls.map(async (ekskul: any) => {
      const { thumbnail, ...rest } = ekskul.data();
      return {
        thumbnail: thumbnail
          ? await getDownloadURL(storage().bucket().file(thumbnail))
          : null,
        id: ekskul.id,
        ...rest,
      };
    })
  );
  return ekskuls;
},["ekskul"], { revalidate: 3600, tags: ["ekskul"] });
