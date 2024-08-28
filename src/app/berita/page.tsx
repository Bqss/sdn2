import Layout from "../_partials/layout";
import { Separator } from "@/components/ui/separator";
import NewsCard from "../_partials/NewsCard";
import Link from "next/link";
import Image from "next/image";
import { getCachedPaginatedNews } from "@/actions/news";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halaman Berita | SDN 2 Tamanharjo",
  description: "Halaman berita, berisikan beberapa berita terbaru dari SDN 2 Tamanharjo",
  abstract: "Halaman berita ini ditujukan untuk menampilkan beberapa berita terbaru dari SDN 2 Tamanharjo",
  keywords: ["SDN 2 Tamanharjo", "website", "resmi", "berita"],
  category: "Education, School, Profile",
};


export default async function Page({ searchParams }: { searchParams: any }) {

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 6;

  const paginatedBerita  = await getCachedPaginatedNews(page, pageSize);


  return (
    <Layout>
      <div className="relative overflow-hidden">
        <Image src={"/images/background-dark.png"} width={1440} height={900} className="absolute inset-0 w-full h-full object-cover filter brightness-150" alt="dark-bg" />
        <div className="py-26 container relative ">
          <h1 className="text-center font-bold text-2xl mt-8">Berita Terbaru</h1>
          <Separator className="w-20 bg-white mx-auto mt-3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 ">
            {paginatedBerita.berita.length > 0 ? paginatedBerita.berita.map((item, i) => <NewsCard key={item.id} delay={i * 0.05} data={JSON.stringify(item)} />) : (
              <div className="py-12 w-full border border-white rounded-lg mt-12">
                <div className="text-center">belum ada data berita yang ditambahkan</div>
              </div>
            )}
          </div>
        </div>
        {paginatedBerita.total_pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {page > 1 && (
              <Link href={`/berita?page=${page - 1}`} className="px-4 py-2 bg-white text-blue-500 rounded-md hover:bg-blue-700 hover:text-white">Prev</Link>
            )}
            {Array.from({ length: paginatedBerita.total_pages }, (_, i) => i).map((item) => (
              <Link key={item} href={`/berita?page=${item + 1}`} className={`px-4 py-2 ${(item + 1) === page ? "bg-blue-500 text-white" : "bg-white text-blue-500"} rounded-md hover:bg-blue-700 hover:text-white`}>{item + 1}</Link>
            ))}
            {page < paginatedBerita.total_pages && (
              <Link href={`/berita?page=${page + 1}`} className="px-4 py-2 bg-white text-blue-500 rounded-md hover:bg-blue-700 hover:text-white">Next</Link>
            )}
          </div>
        )}

      </div>
    </Layout>
  );
}