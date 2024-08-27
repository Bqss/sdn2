import { firestore, storage } from "@/lib/firebase";
import { getDownloadURL } from "firebase-admin/storage";
import { unstable_cache } from "next/cache";

export const getCachedSlideshows = unstable_cache(
  async () => {
    let slideshows: any = (await firestore().collection("slideshow").get()).docs;
    slideshows = await Promise.all(slideshows.map(async (slideshow: any) => {
      const { gambar, ...rest } = slideshow.data();
      return {
        gambar: await getDownloadURL(storage().bucket().file(gambar)),
        id: slideshow.id,
        ...rest
      }
    }));
    return slideshows;
  },
  ['slideshow'],
  { revalidate: 3600, tags: ['slideshow'] }
)