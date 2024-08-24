import { firestore, storage } from "@/lib/firebase";
import { getDownloadURL } from "firebase-admin/storage";
import Layout from "../_partials/layout";
import { Separator } from "@/components/ui/separator";
import NewsCard from "../_partials/NewsCard";
import Link from "next/link";
import Image from "next/image";

export default async function Page({ searchParams }: { searchParams: any }) {

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 6;

  const cursor = ((page - 1) * pageSize) - 1;
  let snapshot;
  const all = await firestore().collection("news").orderBy("created_at", "desc").get();
  const pages = Math.ceil(all.size / pageSize);
  const lastVisible = all.docs[cursor];

  if (cursor >= 0) {
    snapshot = await firestore().collection("news").orderBy("created_at", "desc").startAfter(lastVisible).limit(pageSize).get();
  } else {
    snapshot = await firestore().collection("news").orderBy("created_at", "desc").limit(pageSize).get();
  }

  const berita = await Promise.all(snapshot.docs.map(async (doc) => {
    const { thumbnail, ...rest } = doc.data();
    return {
      id: doc.id,
      thumbnail: thumbnail ? await getDownloadURL(storage().bucket().file(thumbnail)) : null,
      ...rest,
    };
  }));

  return (
    <Layout>
      <div className="relative overflow-hidden">
        <Image src={"/images/background-dark.png"} width={1440} height={900} className="absolute inset-0 w-full h-full object-cover filter brightness-150" alt="dark-bg" />
        <div className="py-26 container relative ">
          <h1 className="text-center font-bold text-2xl mt-8">Berita Terbaru</h1>
          <Separator className="w-20 bg-white mx-auto mt-3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 ">
            {berita.length > 0 ? berita.map((item, i) => <NewsCard key={item.id} delay={i * 0.05} data={JSON.stringify(item)} />) : (
              <div className="py-12 w-full border border-white rounded-lg mt-12">
                <div className="text-center">belum ada data berita yang ditambahkan</div>
              </div>
            )}
          </div>
        </div>
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {page > 1 && (
              <Link href={`/berita?page=${page - 1}`} className="px-4 py-2 bg-white text-blue-500 rounded-md hover:bg-blue-700 hover:text-white">Prev</Link>
            )}
            {Array.from({ length: pages }, (_, i) => i).map((item) => (
              <Link key={item} href={`/berita?page=${item + 1}`} className={`px-4 py-2 ${(item + 1) === page ? "bg-blue-500 text-white" : "bg-white text-blue-500"} rounded-md hover:bg-blue-700 hover:text-white`}>{item + 1}</Link>
            ))}
            {page < pages && (
              <Link href={`/berita?page=${page + 1}`} className="px-4 py-2 bg-white text-blue-500 rounded-md hover:bg-blue-700 hover:text-white">Next</Link>
            )}
          </div>
        )}

      </div>
    </Layout>
  );
}