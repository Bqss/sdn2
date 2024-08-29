import { firestore, storage } from "@/lib/firebase";
import { getDownloadURL } from "firebase-admin/storage";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";


import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import HeroSection from "./_partials/sections/HeroSection";
import { Separator } from "@/components/ui/separator";
import NewsCard from "./_partials/NewsCard";
import EkskulCard from "./_partials/EkskulCard";
import PrestasiCard from "./_partials/PrestasiCard";
import Layout from "./_partials/layout";
import PegawaiSection from "./_partials/sections/PegawaiSection";
import ClientOnly from "@/components/Templates/ClientOnly";
import SambutanSection from "./_partials/sections/SambutanSection";
import Contact from "./_partials/sections/Contact";
import { getCachedSlideshows } from "@/actions/slideshow";
import { getChachedProfile } from "@/actions/profile";
import { getCachedEkskul } from "@/actions/ekskul";
import { getCachedNews } from "@/actions/news";
import { getCachedAwards } from "@/actions/awards";
import { getCachedStaff } from "@/actions/staff";

export const metadata: Metadata = {
  title: "SDN 2 Tamanharjo",
  description: "Halaman beranda, website resmi SDN 2 Tamanharjo",
  abstract: "",
  keywords: ["SDN 2 Tamanharjo", "website", "resmi","profile"],
  category: "Education",
  openGraph: {
    title: "SDN 2 Tamanharjo",
    description: "Halaman beranda, website profile resmi SDN 2 Tamanharjo",
    url: "https://sdnegeri2tamanharjo.web.id",
    countryName: "Indonesia",
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
};


export default async function Home() {
  const slideshows = await getCachedSlideshows();
  const profile = await getChachedProfile();
  const news = await getCachedNews();
  const ekskuls = await getCachedEkskul();

  const awards = await getCachedAwards();
  const pegawai = await getCachedStaff();

  return (
    <Layout>
      <HeroSection slideshows={slideshows} />
      <SambutanSection  profile={profile}/>
      <section className="bg-[#03346E] ">
        <div className="py-10 sm:py-16 flex flex-col items-center grid-cols-3 container">
          <h1 className="text-2xl text-center font-bold  text-white">Berita Terbaru</h1>
          <Separator className="my-2 w-20 bg-white" />
          <div className="grid mt-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-6">
            {news.length > 0 ?
              news.map((berita: any, i: number) => <NewsCard delay={i * 0.05} key={berita.id} data={JSON.stringify(berita)} />)
              : (
                <div className="py-8 md:py-12 px-16 w-full border border-white rounded-lg">
                <div className="text-sm md:text-base text-center">Tidak ada berita yang ditambahkan</div>
              </div>
              )
            }
          </div>
          <div className="mt-10 sm:mt-16">
            {news.length > 3 ? (
              <Link href={"/berita"} className="text-white px-6 py-2 border border-white rounded-md hover:text-gray-500">Lihat Berita Lainnya</Link>
            ) : null}
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden">
        <Image src={"/images/background-dark.png"} width={1440} alt="dark-background" height={600} className="filter absolute inset-0 brightness-[2.5] h-full w-full" />
        <div className="h-fit relative py-10 sm:py-16 flex flex-col items-center ">
          <h1 className="text-2xl text-center font-bold  text-white">Ekstrakurikuler</h1>
          <Separator className="my-2 w-20 bg-white" />
          <div className="grid w-full grid-cols-1 md:grid-cols-2 xl:grid-cols-2 mt-8 sm:mt-12 gap-6 container">
            {ekskuls.map((ekskul: any, i : number) => <EkskulCard key={ekskul.id} data={ekskul} delay={i * 0.05} />)}
          </div>
        </div>
      </section>
      <section className="w-full relative overflow-hidden">
        <Image src={"/images/background-dark.png"} width={1440} alt="dark-background" height={600} className="filter absolute inset-0 brightness-[2.5] h-full w-full" />
        <div className="py-10 sm:py-16 flex flex-col items-center relative ">
          <h1 className="text-2xl text-center font-bold  text-white">Prestasi Terbaru</h1>
          <Separator className="my-2 w-20 bg-white" />
          <div className="flex flex-col mt-10 sm:mt-16 w-full container">
            {awards.length > 0 ?
              awards.map((award: any) => <PrestasiCard key={award.id} data={JSON.stringify(award)} />)
              : (
                <div className="py-8 md:py-12 px-16 w-full border border-white rounded-lg">
                  <div className="text-sm md:text-base text-center">belum ada data berita yang ditambahkan</div>
                </div>
              )
            }
          </div>
          <div className="mt-16">
            {awards.length > 3 ? (
              <Link href={"/prestasi"} className="text-white px-6 py-2 border border-white rounded-md hover:text-gray-500">Lihat Prestasi Lainnya</Link>
            ) : null}
          </div>
        </div>
      </section>
      <ClientOnly>
        <PegawaiSection pegawai={pegawai} />
      </ClientOnly>
      <Contact />
      {/* <section className="w-full relative py-16 overflow-hidden">
        <h1 className="text-2xl text-center font-bold  text-white ">Kotak saran</h1>
        <Image src={"/images/background-dark.png"} width={1440} alt="dark-background" height={600} className="filter absolute inset-0 brightness-[2.5] h-auto w-full" />
        <Separator className="my-2 mx-auto w-20 h-[2px] bg-white" />
        <FormSaran />
      </section> */}

    </Layout>
  );
}
