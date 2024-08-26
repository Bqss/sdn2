"use client";
import { landingmenus } from '@/data/menu';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { RiMenu2Fill } from "react-icons/ri";

const Header = () => {
  const { data: session } = useSession();
  const path = usePathname();
  const [isOpenMenuDropdown, setIsOpenMenuDropdown] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  const handleOpenModal = () => {
    if (isOpenMenuDropdown === false) {
      setIsOpenMenuDropdown(true);
    } else {
      setIsOpenMenuDropdown(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isOpenMenuDropdown) {
        setIsOpenMenuDropdown(false);
      }
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpenMenuDropdown]);

  return (
    <>
      <header className={cn(" fixed top-0 inset-x-0 transition-all duration-300 z-99 align-center `", (isScrolled ? "bg-white text-black" : ""))}>
        <div className="container flex justify-between p-4">
          <motion.span
            initial={{ height: 0, opacity: 0, }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Link href={"/"} className="flex items-center gap-2 justify-center">
              <Image src={"/images/tutwuri.png"} width={60} height={60} className="w-8 h-8 md:h-12 md:w-12" alt="tutwuri" />
              <span className="text-sm sm:text-xl  font-bold">SDN 2 TAMANHARJO</span>
            </Link>
          </motion.span>
          <motion.div
            initial={{ height: 0, opacity: 0, }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className='lg:hidden'>
            <button className={cn("p-2 rounded-md border ", (isScrolled ? "border-black" : "border-white"))} onClick={handleOpenModal}>
              <RiMenu2Fill size={18} />
            </button>
            <AnimatePresence>
              {isOpenMenuDropdown && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}

                  transition={{ duration: 0.3 }}
                  className={"absolute top-16 inset-x-0 md:top-20 text-white container bg-[#000] rounded-md"}
                >
                  <div className="flex flex-col gap-3 items-center px-4 py-6">
                    <Link href={"/"} className={cn("hover:text-gray-500", (path == "/" ? "text-yellow-500" : ""))}>Beranda</Link>
                    <Link href={"/about"} className={cn("hover:text-gray-500", (path == "/about" ? "text-yellow-500" : ""))}>Tentang</Link>
                    <Link href={"/visi-misi"} className={cn("hover:text-gray-500", (path == "/visi-misi" ? "text-yellow-500" : ""))}>Visi Misi</Link>
                    <Link href={"/berita"} className={cn("hover:text-gray-500", (path == "/berita" ? "text-yellow-500" : ""))}>Berita</Link>
                    <Link href={"/prestasi"} className={cn("hover:text-gray-500", (path == "/prestasi" ? "text-yellow-500" : ""))}>Prestasi</Link>
                    <Link href={"/gallery"} className={cn("hover:text-gray-500", (path == "/gallery" ? "text-yellow-500" : ""))}>Gallery</Link>
                    <Link className="px-6 py-2 hover:bg-blue-700 rounded-md bg-blue-500 text-white font-medium" href={"/auth/login"}>Login</Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <div className="lg:flex gap-6 items-center hidden ">
            <ul className="hidden lg:flex items-center text-base gap-6">
              {
                landingmenus.map((menu, i) => (
                  <motion.li key={i}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}

                    transition={{ duration: 0.3, delay: .5 + i * 0.1 }}
                  >
                    <Link href={menu.url} className={cn("hover:text-gray-500", (path == menu.url ? "text-yellow-500" : ""))}>{menu.name}</Link>
                  </motion.li>
                ))
              }

            </ul>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, delay:  1.2 }}
            >
               {session ? (
                  <Link href={"/admin/dashboard"} className={cn("px-6 py-2 border  rounded-md" , (isScrolled ? "border-black text-black": "border-white" ))}>Dashboard</Link>
                ) : (
                  <Link href={"/auth/login"} className="hidden lg:block px-6 py-2 hover:bg-blue-700 rounded-md bg-blue-500 text-white font-medium">Login</Link>
                )}
             
            </motion.div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;