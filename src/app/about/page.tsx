import Layout from "@/app/_partials/layout";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import "@/css/blog.css"
import { getChachedProfile } from "@/actions/profile";
import { Metadata } from "next";

interface Props {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props) {
  const profile = await getChachedProfile();
  return {
    title: "Tentang Kami | " + "SDN 2 Tamanharjo",
    description: "Tentang kami SDN 2 Tamanharjo, profil sekolah, visi misi, sejarah, dan lainnya",
    abstract: profile?.profile_lengkap,
    keywords: ["SDN 2 Tamanharjo", "website", "resmi", "profile"],
    category: "Education",
    openGraph: {
      title: "Tentang Kami | " + "SDN 2 Tamanharjo",
      description: "Tentang kami SDN 2 Tamanharjo, profil sekolah, visi misi, sejarah, dan lainnya",
      url: "https://sdnegeri2tamanharjo.web.id/about",
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
}


export default async function Page({ params }: { params: { id: string } }) {

  const profile = await getChachedProfile();


  return (
    <Layout>
      <div className="overflow-hidden relative">
        <Image src={"/images/background-dark.png"} width={1440} height={900} alt={"bg-dark"} className="filter brightness-[2] w-full absolute inset-0 h-full object-cover" />
        <div className="container max-w-5xl mx-auto py-24 relative">
          <h1 className="text-center text-xl font-bold md:text-2xl mt-8">Tentang SDN 2 Tamanharjo</h1>
          <Separator className="w-36 bg-white mx-auto mt-3" />
          <div className="relative mt-10">
            <Image src={"/images/depan.jpeg"} width={1440} height={600} alt={"foto bg"} className="rounded-lg aspect-video object-cover" />
          </div>
          <Separator className="w-full bg-gray-500 mt-6" />
          <div className="mt-4 blog" dangerouslySetInnerHTML={{
            __html: profile?.profile_lengkap
          }}>
          </div>
        </div>
      </div>
    </Layout>
  )
}