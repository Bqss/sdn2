import Layout from "@/app/_partials/layout";
import { Separator } from "@/components/ui/separator";
import { firestore } from "@/lib/firebase";
import Image from "next/image";
import "@/css/blog.css"

export default async function Page({ params }: { params: { id: string } }) {

  const profile = (await firestore().collection("profile-sekolah").doc("profile").get()).data();

  return (
    <Layout>
      <div className="relative overflow-hidden">
        <Image src={"/images/background-dark.png"} width={1440} height={900} alt={"bg-dark"} className="filter brightness-125 w-full absolute inset-0 h-full object-cover" />
        <div className="container max-w-4xl mx-auto py-24 relative">
          <h1 className="text-center font-bold text-2xl mt-8">Visi & Misi</h1>
          <Separator className="w-20 bg-white mx-auto mt-3" />
          <div className="relative mt-10">
            <Image src={"/images/pramuka.jpg"} width={1440} height={600} alt={"foto bg"} className="rounded-lg aspect-video object-cover" />
          </div>
          <Separator className="w-full bg-gray-500 mt-6" />
          <div className="mt-4 text-white">
            <h5 className="text-base font-medium">Visi Sekolah</h5>
            <div className="mt-1" dangerouslySetInnerHTML={{
              __html: profile?.visi,
            }}></div>
            <h5 className="text-base font-medium mt-4">Misi Sekolah</h5>
            <div className="mt-1" dangerouslySetInnerHTML={{
              __html: profile?.misi,
            }}></div>
          </div>
        </div>
      </div>
    </Layout>
  )
}