import { firestore, storage } from "@/lib/firebase";
import { getDownloadURL } from "firebase-admin/storage";
import { unstable_cache } from "next/cache";

export const getCachedNews = unstable_cache(
  async () => {
    let news: any = await firestore()
      .collection("news")
      .orderBy("created_at", "desc")
      .get();
    const newsTotal = news.size;
    if (newsTotal > 6) {
      news = news.docs.slice(0, 6);
    } else {
      news = news.docs;
    }
    news = await Promise.all(
      news.map(async (berita: any) => {
        const { thumbnail, ...rest } = berita.data();
        return {
          thumbnail: await getDownloadURL(storage().bucket().file(thumbnail)),
          id: berita.id,
          ...rest,
        };
      })
    );
    return news;
  },
  ["news"],
  { revalidate: 3600, tags: ["news"] }
);

export const getCachedPaginatedNews = unstable_cache(
  async (page: number, pageSize: number) => {
    const cursor = (page - 1) * pageSize - 1;
    let snapshot;
    const all = await firestore()
      .collection("news")
      .orderBy("created_at", "desc")
      .get();
    const pages = Math.ceil(all.size / pageSize);
    const lastVisible = all.docs[cursor];

    if (cursor >= 0) {
      snapshot = await firestore()
        .collection("news")
        .orderBy("created_at", "desc")
        .startAfter(lastVisible)
        .limit(pageSize)
        .get();
    } else {
      snapshot = await firestore()
        .collection("news")
        .orderBy("created_at", "desc")
        .limit(pageSize)
        .get();
    }

    const berita = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const { thumbnail, ...rest } = doc.data();
        return {
          id: doc.id,
          thumbnail: thumbnail
            ? await getDownloadURL(storage().bucket().file(thumbnail))
            : null,
          ...rest,
        };
      })
    );

    return {
      berita,
      total_pages: pages,
    };
  },
  ["news"],
  { revalidate: 3600, tags: ["news"] }
);

export const getCachedDetailNew = unstable_cache(
    async (id: string) => {
      const berita = (
        await firestore().collection("news").doc(id).get()
      ).data();
      if (!berita) {
        return null;
      }
      if (berita.thumbnail) {
        berita.thumbnail = await getDownloadURL(
          storage().bucket().file(berita.thumbnail)
        );
      }
      const date = new Date(berita.created_at._seconds * 1000);
      const options: any = { day: "numeric", month: "long", year: "numeric" };
      berita.created_at = date.toLocaleDateString("id-ID", options).split(" ");
      return berita;
    },
    [`news`],
    {
      revalidate: 3600,
      tags: [`news`],
    }
  );
