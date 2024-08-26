"use client";
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import React from 'react'
import { motion } from "framer-motion";

import "@/css/blog.css"

const SambutanSection = ({profile}: any) => {
  return (
    <section
      className="relative overflow-hidden">
      <Image src={"/images/background-dark.png"} width={1440} alt="dark-background" height={600} className="filter absolute inset-0 brightness-[2.5] h-full w-full" />
      <div className="h-fit relative ">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.3 }}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 50 }
          }}
          className="text-center p-4 text-xl sm:text-3xl sm:p-6 bg-white text-black font-bold ">Sambutan Kepala Sekolah</motion.div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 py-12 sm:py-32 container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            variants={{
              visible: { opacity: 1, x: 0 },
              hidden: { opacity: 0, x: -100 }
            }}
            className=" w-full sm:w-2/5 border border-white flex-shrink-0 p-5 rounded-lg">
            <Image className="rounded-lg filter  -z-1 brightness-75 w-full" src={profile.foto_kepsek} width={400} height={400} alt={profile.nama_kepsek} />
            <div className="flex flex-col items-center mt-4">
              <span className="font-bold">{profile.nama_kepsek}</span>
              <Separator className="my-2 w-20 bg-white " />
              <span>Kepala Sekolah</span>
            </div>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5}}
            transition={{ duration: 0.5 }}
            variants={{
              visible: { opacity: 1, x: 0 },
              hidden: { opacity: 0, x: 100 }
            }}

            className="sm:mt-14" dangerouslySetInnerHTML={{ 
              __html : profile.sambutan_kepsek
             }}>
        
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default SambutanSection