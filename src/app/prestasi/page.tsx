import Layout from "../_partials/layout";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import PrestasiCard from "../_partials/PrestasiCard";
import { getCachedPaginatedAwards } from "@/actions/awards";
import Image from "next/image";

export const metadata = {
  title: "Prestasi | SDN 2 Tamanharjo",
  description: "Halaman prestasi, berisikan beberapa prestasi terbaru dari SDN 2 Tamanharjo",
  abstract: "Halaman prestasi ini ditujukan untuk menampilkan beberapa prestasi terbaru dari SDN 2 Tamanharjo",
  keywords: ["SDN 2 Tamanharjo", "website", "resmi", "prestasi"],
  category: "Education",
  openGraph: {
    title: "Prestasi | SDN 2 Tamanharjo",
    description: "Halaman prestasi, berisikan beberapa prestasi terbaru dari SDN 2 Tamanharjo",
    url: "https://sdnegeri2tamanharjo.web.id/prestasi",
    type: "website",
    locale: "id_ID",
    siteName: "SDN 2 Tamanharjo",
    images: [
      {
        url: "https://sdnegeri2tamanharjo.web.id/images/logo-sdn.png",
        width: 800,
        height: 600,
        alt: "SDN 2 Tamanharjo",
      },
    ],
  }
}

export default async function Page({ searchParams }: { searchParams: any }) {

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 6;

  const awards = await getCachedPaginatedAwards(page, pageSize);

  return (
    <Layout>
      <div className="relative overflow-hidden">
        <Image src={"/images/background-dark.png"} width={1440} height={900} alt={"bg-dark"} className="filter brightness-[2] w-full absolute inset-0 h-full object-cover" />
        <div className="py-26 container relative">
          <h1 className="text-center font-bold text-2xl mt-8">Prestasi Terbaru</h1>
          <Separator className="w-20 bg-white mx-auto mt-3" />
          <div className="flex flex-col gap-8 mt-12">
            {awards.data.length > 0 ? awards.data.map((item) => <PrestasiCard key={item.id} data={JSON.stringify(item)} />) :
              <div className="py-12 w-full border border-white rounded-lg mt-12">
                <div className="text-center">belum ada data prestasi yang ditambahkan</div>
              </div>
            }
          </div>
          {awards.page_total > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <Link href={`/prestasi?page=${page - 1}`} className="px-4 py-2 bg-white text-blue-500 rounded-md hover:bg-blue-700 hover:text-white">Prev</Link>
              )}
              {Array.from({ length: awards.page_total }, (_, i) => i).map((item) => (
                <Link key={item} href={`/prestasi?page=${item + 1}`} className={`px-4 py-2 ${(item + 1) === page ? "bg-blue-500 text-white" : "bg-white text-blue-500"} rounded-md hover:bg-blue-700 hover:text-white`}>{item + 1}</Link>
              ))}
              {page < awards.page_total && (
                <Link href={`/prestasi?page=${page + 1}`} className="px-4 py-2 bg-white text-blue-500 rounded-md hover:bg-blue-700 hover:text-white">Next</Link>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}