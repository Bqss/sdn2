import Layout from "@/app/_partials/layout";
import { Separator } from "@/components/ui/separator";

import Image from "next/image";
import "@/css/blog.css"
import { getChachedProfile } from "@/actions/profile";

export const metadata = {
  title: "Visi & Misi | SDN 2 Tamanharjo",
  description: "Visi dan misi sekolah SDN 2 Tamanharjo",
  abstract: "Visi dan misi sekolah SDN 2 Tamanharjo",
  keywords: ["SDN 2 Tamanharjo", "website", "resmi", "profile"],
  category: "Education",
  openGraph: {
    title: "Visi & Misi | SDN 2 Tamanharjo",
    description: "Visi dan misi sekolah SDN 2 Tamanharjo",
    url: "https://sdnegeri2tamanharjo.web.id/visi-misi",
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

export default async function Page({ params }: { params: { id: string } }) {

  const profile = await getChachedProfile();

  return (
    <Layout>
      <div className="relative overflow-hidden">
        <Image src={"/images/background-dark.png"} width={1440} height={900} alt={"bg-dark"} className="filter brightness-150 w-full absolute inset-0 h-full object-cover" />
        <div className="container max-w-5xl mx-auto py-24 relative">
          <h1 className="text-center font-bold text-2xl mt-8">Visi & Misi</h1>
          <Separator className="w-20 bg-white mx-auto mt-3" />
          <div className="relative mt-10">
            <Image src={"/images/depan2.jpeg"} width={1440} height={600} alt={"foto bg"} className="rounded-lg aspect-video object-cover" />
          </div>
          <Separator className="w-full bg-gray-500 mt-6" />
          <div className="mt-4 text-white">
            <h5 className="text-base font-medium">Visi Sekolah</h5>
            <div className="mt-1" dangerouslySetInnerHTML={{
              __html: profile?.visi,
            }}></div>
            <h5 className="text-base font-medium mt-4">Misi Sekolah</h5>
            <div className="mt-4 blog" dangerouslySetInnerHTML={{
              __html: profile?.misi,
            }}></div>
            <h5 className="text-base font-medium mt-4">Tujuan</h5>
            <div className="mt-4 blog" dangerouslySetInnerHTML={{
              __html: profile?.tujuan,
            }}></div>
          </div>
        </div>
      </div>
    </Layout>
  )
}