import { getCachedFiles } from "@/actions/arsip-file";
import Layout from "../_partials/layout";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Arsip File | SDN 2 Tamanharjo",
  description: "Halaman arsip file, berisikan beberapa file yang telah diunggah oleh pihak sekolah",
  abstract: "Halaman arsip file ini ditujukan untuk menampilkan beberapa file yang telah diunggah oleh pihak sekolah",
  openGraph: {
    title: "Arsip File | SDN 2 Tamanharjo",
    description: "Halaman arsip file, berisikan beberapa file yang telah diunggah oleh pihak sekolah",
    url: "https://sdnegeri2tamanharjo.web.id/arsip-file",
    type: "website",
    locale: "id_ID",
    siteName: "SDN 2 Tamanharjo",
    images: [
      {
        url: "https://sdnegeri2tamanharjo.web.id/images/logo.png",
        width: 800,
        height: 600,
        alt: "SDN 2 Tamanharjo",
      },
    ],
  }
}

const fileCategories: any = {
  "dokumen-akademik": "Dokumen Akademik",
  "dokumen-administrasi": "Dokumen Administrasi",
  "dokumen-informasi-kegiatan-sekolah": "Dokumen Informasi Kegiatan Sekolah",
  "dokumen-kebijakan-dan-regulasi": "Dokumen Kebijakan dan Regulasi",
  "dokumen-laporan-dan-transparansi": "Dokumen Laporan dan Transparansi",
  "dokumen-pendukung-pembelajaran-dan-pengembangan": "Dokumen Pendukung Pembelajaran dan Pengembangan",
  "dokumen-kesehatan-dan-keselamatan": "Dokumen Kesehatan dan Keselamatan",
  "dokumen-korespondensi": "Dokumen Korespondensi",
  "dokumen-alumni-dan-reuni": "Dokumen Alumni dan Reuni",
  "lain-lain": "Dokumen Lain-lain",
};

export default async function Page() {
  const arsipFile = await getCachedFiles();
  const res: any = {};
  arsipFile.forEach((item: any) => {
    if (!res[item.tag]) res[item.tag] = [];
    res[item.tag].push(item);
  });

  const jenis = Object.keys(res);

  return (
    <Layout>
      <div className="relative overflow-hidden">
        <Image src={"/images/background-dark.png"} width={1440} height={900} className="absolute inset-0 w-full h-full object-cover filter brightness-150" alt="dark-bg" />
        <div className="py-26 container relative ">
          <h1 className="text-center font-bold text-2xl mt-8">Arsip File</h1>
          <Separator className="w-20 bg-white mx-auto mt-3" />
          <div className="mt-12 flex flex-col gap-6 ">
            {jenis.length > 0 ? jenis.map((j: any, i) => (
              <div key={i}>
                <h2 className="text-lg lg:text-xl font-bold">{fileCategories[j]}</h2>
                <ul className="ml-5 mt-6" style={{
                  listStyle:"disc",
                }}>
                  {res[j].map((item: any, i: number) => (
                    <li key={i}>
                      <Link className="hover:text-yellow-500" href={item.file}>{item.nama}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )) : (
              <div className="py-12 w-full border border-white rounded-lg mt-12">
                <div className="text-center">belum ada data prestasi yang ditambahkan</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}