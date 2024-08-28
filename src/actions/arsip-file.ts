import { firestore, storage } from "@/lib/firebase";
import { getDownloadURL } from "firebase-admin/storage";
import { unstable_cache } from "next/cache";

export const getCachedFiles = unstable_cache(
  async () => {
    const snapshot = await firestore().collection("arsip-file").get();
    const arsipFile = Promise.all(
      snapshot.docs.map(async (doc) => {
        const { file, ...rest } = doc.data();
        return {
          id: doc.id,
          file: await getDownloadURL(storage().bucket().file(file)),
          ...rest,
        };
      })
    );

    return arsipFile;
  },
  ["arsip-file"],
  {
    revalidate: 3600,
    tags: ["arsip-file"],
  }
);
