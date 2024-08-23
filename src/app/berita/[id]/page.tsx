import Layout from "@/app/_partials/layout";
import { Separator } from "@/components/ui/separator";
import { firestore, storage } from "@/lib/firebase";
import { getDownloadURL } from "firebase-admin/storage";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FaRegUser } from "react-icons/fa6";

export default async function Page({ params }: { params: { id: string } }) {

  const berita = (await firestore().collection("news").doc(params.id).get()).data();
  if (!berita) {
    return notFound();
  }
  const thumbnail = (await getDownloadURL(storage().bucket().file(berita?.thumbnail)));
  const date = new Date(berita.created_at._seconds * 1000);
  const options: any = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate  = date.toLocaleDateString('id-ID', options).split(" ");

  return (
    <Layout>
      <div className="container py-32">
        <div className="relative">
          <Image src={thumbnail} width={1440} height={900} alt={berita.judul} className="rounded-lg" />
          <div className="absolute left-2 bottom-2 p-3 rounded-md bg-blue-500/80 flex flex-col">
            <span className="text-3xl font-bold">{formattedDate[0]}</span>
            <span>{formattedDate[1]}, {formattedDate[2]}</span>
          </div>
        </div>
        <div className="mt-8">
          <h1 className="text-2xl font-bold">{berita.judul}</h1>
          <div className="mt-4 text-sm flex items-center gap-2 text-white">
            <FaRegUser />
            <span>Admin</span>
          </div>
          <Separator className="bg-gray-500 my-4"/>
          <div dangerouslySetInnerHTML={{ __html: berita.content }}>

          </div>
        </div>
      </div>
    </Layout>
  )
}