import { firestore, storage } from "@/lib/firebase";
import { getDownloadURL } from "firebase-admin/storage";
import { unstable_cache } from "next/cache";

export const getCachedAwards = unstable_cache(
  async () => {
    let awards = (await firestore().collection("prestasi").get()).docs;
    awards = await Promise.all(
      awards.map(async (award: any) => {
        const { foto, ...rest } = award.data();
        return {
          foto: foto
            ? await getDownloadURL(storage().bucket().file(foto))
            : null,
          id: award.id,
          ...rest,
        };
      })
    );

    return awards;
  },
  ["awards"],
  {
    revalidate: 3600,
    tags: ["awards"],
  }
);

export const getCachedPaginatedAwards = unstable_cache(
  async (page: number, pageSize: number) => {
    const cursor = (page - 1) * pageSize - 1;
    let snapshot;
    const all = await firestore()
      .collection("prestasi")
      .orderBy("created_at", "desc")
      .get();
    const pages = Math.ceil(all.size / pageSize);
    const lastVisible = all.docs[cursor];

    if (cursor >= 0) {
      snapshot = await firestore()
        .collection("prestasi")
        .orderBy("created_at", "desc")
        .startAfter(lastVisible)
        .limit(pageSize)
        .get();
    } else {
      snapshot = await firestore()
        .collection("prestasi")
        .orderBy("created_at", "desc")
        .limit(pageSize)
        .get();
    }

    const prestasi = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const { foto, ...rest } = doc.data();
        return {
          id: doc.id,
          foto: foto
            ? await getDownloadURL(storage().bucket().file(foto))
            : null,
          ...rest,
        };
      })
    );

    return {
      data: prestasi,
      page_total: pages,
    };
  },
  ["awards"],
  {
    revalidate: 3600,
    tags: ["awards"],
  }
);

export const getChachedDetailAward = unstable_cache(
  async (id: string) => {
    const prestasi = (
      await firestore().collection("prestasi").doc(id).get()
    ).data();
    if (!prestasi) {
      return null;
    }
    prestasi.foto = await getDownloadURL(
      storage().bucket().file(prestasi?.foto)
    );
    const date = new Date(prestasi.created_at._seconds * 1000);
    const options: any = { day: "numeric", month: "long", year: "numeric" };
    prestasi.created_at = date.toLocaleDateString("id-ID", options).split(" ");

    return prestasi;
  },
  ["awards"],
  {
    revalidate: 3600,
    tags: ["awards"],
  }
);
