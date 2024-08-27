import Layout from "@/app/_partials/layout";
import { Separator } from "@/components/ui/separator";
import { firestore, storage } from "@/lib/firebase";
import { ucFirst } from "@/lib/utils";
import { getDownloadURL } from "firebase-admin/storage";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FaRegUser } from "react-icons/fa6";
import "@/css/blog.css"
import { getChachedDetailAward } from "@/actions/awards";

export default async function Page({ params }: { params: { id: string } }) {

  const prestasi = await getChachedDetailAward(params.id);
  if (!prestasi) {
    return notFound();
  }
 


  return (
    <Layout>
      <div className="container py-32">
        <div className="relative">
          <Image src={prestasi.foto} width={1440} height={900} alt={prestasi.judul} className="rounded-lg aspect-video object-cover" />
          <div className="absolute left-2 bottom-2 p-3 rounded-md bg-blue-500/80 flex flex-col">
            <span className="text-xl md:text-3xl font-bold">{prestasi.created_at[0]}</span>
            <span className="text-sm md:text-base">{prestasi.created_at[1]}, {prestasi.created_at[2]}</span>
          </div>
        </div>
        <div className="mt-8">
          <h1 className="text-xl md:text-2xl font-bold">{prestasi.judul}</h1>
          <div className="mt-4 text-sm flex items-center gap-2 text-white">
            <FaRegUser />
            <span>Admin</span>
          </div>
          <Separator className="bg-gray-500 my-4" />
          <div className="text-sm md:text-base">
            <style>
              {
                `
              table tr td {
                padding: 3px 5px;
              }

              @media (min-width: 768px) {
                padding: 5px 10px;  
              }
              `
              }
            </style>
            <table>
              <tr>
                <td width={"40%"}>Penyelenggara </td>
                <td> : {prestasi.penyelenggara}</td>
              </tr>
              <tr>
                <td>Tingkat Perlombaan </td>
                <td> : {ucFirst(prestasi.skala)}</td>
              </tr>
              <tr>
                <td>Peraih </td>
                <td> : {prestasi.peraih}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}