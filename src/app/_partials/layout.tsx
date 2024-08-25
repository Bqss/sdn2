"use client"
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { CiInstagram } from "react-icons/ci";
import { FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa6";

import Header from "./sections/Header";
import { SessionProvider } from "next-auth/react";


export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>

      <div className="bg-[#000] min-h-screen text-white relative flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <footer className="w-full bg-[#03346E]">
          <div className="flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 container py-8 md:py-20">
              <div>
                <span className="inline-flex gap-2 items-center">
                  <Image src={"/images/tutwuri.png"} width={60} height={60} alt="tutwuri" />
                  <span className="text-xl font-bold">SDN 2 TAMARHARJO</span>
                </span>
                <p className="text-sm mt-3">SMA Negeri 1 Yogyakarta telah menjadi bagian tak terpisahkan dari perjalanan Yogyakarta sebagai kota pendidikan sejak tahun 1957. Dijiwai motto Teladan Jayamahe, Sekolah ini mengantar keluarga besarnya untuk berjaya di manapun dan kapanpun.</p>
              </div>
              <div className="lg:pl-24">
                <h3 className="text-xl font-bold mt-3">Navigasi</h3>
                <div className="flex flex-col gap-2 mt-4">
                  <Link href={"#"} className="text-white text-sm">Beranda</Link>
                  <Link href={"#"} className="text-white text-sm">Tentang</Link>
                  <Link href={"#"} className="text-white text-sm">Kontak</Link>
                  <Link href={"#"} className="text-white text-sm">PPDB</Link>
                </div>
              </div>

              <div className="">
                <h3 className="text-xl font-bold mt-3">Social Media</h3>
                <div className="flex items-center gap-3 mt-4">
                  <Link href={"#"} className="text-white p-1 border border-white rounded-full hover:bg-black hover:border-blue-400 hover:text-blue-500"><FaFacebookF size={24} /></Link>
                  <Link href={"#"} className="text-white p-1 border border-white rounded-full hover:bg-black hover:border-pink-500 hover:text-pink-500"><CiInstagram size={24} /></Link>
                  <Link href={"#"} className="text-white p-1 border border-white rounded-full hover:bg-black hover:border-black "><FaTiktok size={24} /></Link>
                  <Link href={"#"} className="text-white p-1 border border-white rounded-full hover:bg-black hover:border-red-400 hover:text-red-500"><FaYoutube size={24} /></Link>
                </div>
              </div>

            </div>
            <div className="py-4 border-t border-[#E2E2B6]">
              <div className="text-center text-sm">© Copyright <Link href={"/"} className="text-yellow-500">KKN Unikama Tamanharjo 2024</Link>.<br /> All Rights Reserved</div>
            </div>
          </div>
        </footer>
      </div>
    </SessionProvider>

  )
}