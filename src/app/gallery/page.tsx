import { Separator } from "@/components/ui/separator";
import Layout from "../_partials/layout";

import GalleryCard from "../_partials/GalleryCard";
import { getCachedgallery } from "@/actions/gallery";

export const metadata = {
  title: "Gallery | SDN 2 Tamanharjo",
  description: "Gallery SDN 2 Tamanharjo, berisi beberapa foto kegiatan sekolah",
  abstract: "Halaman gallery ini merupakan halaman yang berisi beberapa foto kegiatan sekolah SDN 2 Tamanharjo",
}

export default async function Page() {

  const galleries = await getCachedgallery();
  return (
    <Layout>
      <div className="py-26 container">
        <h1 className="text-center font-bold text-2xl mt-8">Gallery</h1>
        <Separator className="w-12 bg-white mx-auto mt-3" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-12">
          {galleries.length > 0 ? galleries.map((item, i) => <GalleryCard delay={i * 0.1 + 1.5} key={item.id} data={JSON.stringify(item)} />) : (
            <div className="py-12 w-full border border-white rounded-lg mt-12">
              <div className="text-center">belum ada gallery yang ditambahkan</div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}