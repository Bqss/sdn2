"use client";

import { cn } from '@/lib/utils';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Nav = () => {
  const path = usePathname();
  return (
    <div className="flex items-center text-base gap-8">
      <Link href={"/"} className={cn("hover:text-gray-500", (path == "/" ? "text-yellow-500" : ""))}>Beranda</Link>
      <Link href={"/about"} className={cn("hover:text-gray-500", (path =="/about" ? "text-yellow-500": ""))}>Tentang</Link>
      <Link href={"/berita"} className={cn("hover:text-gray-500", (path =="/berita" ? "text-yellow-500": ""))}>Berita</Link>
      <Link href={"/prestasi"} className={cn("hover:text-gray-500", (path =="/prestasi" ? "text-yellow-500": ""))}>Prestasi</Link>
      <Link href={"/gallery"} className={cn("hover:text-gray-500", (path =="/gallery" ? "text-yellow-500": ""))}>Gallery</Link>
      <Link className="px-6 py-2 hover:bg-blue-700 rounded-md bg-blue-500 text-white font-medium" href={"/auth/login"}>Login</Link>
    </div>
  )
}

export default Nav