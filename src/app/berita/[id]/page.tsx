import Layout from "@/app/_partials/layout";
import { Separator } from "@/components/ui/separator";
import { firestore, storage } from "@/lib/firebase";
import { getDownloadURL } from "firebase-admin/storage";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { FaRegUser } from "react-icons/fa6";
import "@/css/blog.css"
import { getCachedDetailNew } from "@/actions/news";
import { Metadata, ResolvingMetadata } from "next";


interface Props {
  params: {
    id: string
  }
  searchParams: URLSearchParams
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const berita = await getCachedDetailNew(params.id);
  if (!berita) {
    redirect("/404");
  }
  return {
    title: berita.judul,
    description: berita.deskripsi,
    publisher: "administrator",
    openGraph: {
      title: berita.judul,
      description: berita.deskripsi,
      images: [
        {
          url: berita.thumbnail,
          width: 800,
          height: 600,
          alt: berita.judul,
        },
      ],
    },
    
  }
}


export default async function Page({ params }: Props) {

  const berita = await getCachedDetailNew(params.id);
  if (!berita) {
    return notFound();
  }

  return (
    <Layout>
      <div className="container py-32">
        <div className="relative">
          <Image src={berita.thumbnail} width={1440} height={900} alt={berita.judul} className="rounded-lg aspect-video object-cover" />
          <div className="absolute left-2 bottom-2 p-3 rounded-md bg-blue-500/80 flex flex-col">
            <span className="text-xl md:text-3xl font-bold">{berita.created_at[0]}</span>
            <span className="text-sm md:text-base">{berita.created_at[1]}, {berita.created_at[2]}</span>
          </div>
        </div>
        <div className="mt-8">
          <h1 className="text-xl md:text-2xl font-bold">{berita.judul}</h1>
          <div className="mt-4 text-sm flex items-center gap-2 text-white">
            <FaRegUser />
            <span>Admin</span>
          </div>
          <Separator className="bg-gray-500 my-4" />
          <div style={{
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }} className="mt-8 lg:mt-12 blog" dangerouslySetInnerHTML={{ __html: berita.content }}>

          </div>
        </div>
      </div>
    </Layout>
  )
}