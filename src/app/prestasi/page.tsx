import { firestore, storage } from "@/lib/firebase";
import { getDownloadURL } from "firebase-admin/storage";
import Layout from "../_partials/layout";
import { Separator } from "@/components/ui/separator";
import NewsCard from "../_partials/NewsCard";
import Link from "next/link";
import PrestasiCard from "../_partials/PrestasiCard";

export default async function Page({ searchParams }: { searchParams: any }) {

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 6;

  const cursor = ((page - 1) * pageSize) - 1;
  let snapshot;
  const all = await firestore().collection("prestasi").orderBy("created_at", "desc").get();
  const pages = Math.ceil(all.size / pageSize);
  const lastVisible = all.docs[cursor];

  if (cursor >= 0) {
    snapshot = await firestore().collection("prestasi").orderBy("created_at", "desc").startAfter(lastVisible).limit(pageSize).get();
  } else {
    snapshot = await firestore().collection("prestasi").orderBy("created_at", "desc").limit(pageSize).get();
  }

  const prestasi = await Promise.all(snapshot.docs.map(async (doc) => {
    const { foto, ...rest } = doc.data();
    return {
      id: doc.id,
      foto: foto ? await getDownloadURL(storage().bucket().file(foto)) : null,
      ...rest,
    };
  }));

  return (
    <Layout>
      <div className="py-26 container">
        <h1 className="text-center font-bold text-2xl mt-8">Prestasi Terbaru</h1>
        <Separator className="w-20 bg-white mx-auto mt-3" />
        <div className="flex flex-col gap-8 mt-12">
          {prestasi.length > 0 ? prestasi.map((item) => <PrestasiCard key={item.id} data={JSON.stringify(item)} />) : 
          <div className="py-12 w-full border border-white rounded-lg mt-12">
            <div className="text-center">belum ada data prestasi yang ditambahkan</div>
          </div>
          }
        </div>
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {page > 1 && (
              <Link href={`/prestasi?page=${page - 1}`} className="px-4 py-2 bg-white text-blue-500 rounded-md hover:bg-blue-700 hover:text-white">Prev</Link>
            )}
            {Array.from({ length: pages }, (_, i) => i).map((item) => (
              <Link key={item} href={`/prestasi?page=${item + 1}`} className={`px-4 py-2 ${(item + 1) === page ? "bg-blue-500 text-white" : "bg-white text-blue-500"} rounded-md hover:bg-blue-700 hover:text-white`}>{item + 1}</Link>
            ))}
            {page < pages && (
              <Link href={`/prestasi?page=${page + 1}`} className="px-4 py-2 bg-white text-blue-500 rounded-md hover:bg-blue-700 hover:text-white">Next</Link>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}