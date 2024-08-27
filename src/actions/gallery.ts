import { firestore, storage } from "@/lib/firebase";
import { getDownloadURL } from "firebase-admin/storage";
import { unstable_cache } from "next/cache";

export const getCachedgallery = unstable_cache(
  async () => {
    const gallerySnapshot = (
      await firestore()
        .collection("gallery")
        .orderBy("created_at", "desc")
        .get()
    ).docs;
    const galleries = await Promise.all(
      gallerySnapshot.map(async (doc) => {
        const { foto, ...rest } = doc.data();
        return {
          id: doc.id,
          foto: await getDownloadURL(storage().bucket().file(foto)),
          ...rest,
        };
      })
    );
    return galleries;
  },
  ["gallery"],
  {
    revalidate: 3600,
    tags: ["gallery"],
  }
);
