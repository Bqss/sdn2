import Image from 'next/image'
import React from 'react'
import { motion } from "framer-motion";

const PegawaiCard = ({ data, delay }: any) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: .25 }}
      transition={{ duration: 0.4, delay }}
      variants={{
        visible: { opacity: 1, scale: 1 },
        hidden: { opacity: 0, scale: .75 }
      }}
      className='flex w-full relative group rounded-lg overflow-hidden bg-white text-white border border-[#E2E2B6]'>
      <Image src={data.foto ?? (data.is_male == "1" ? "/images/guru-placeholder-male.jpg" : "/images/guru-placeholder-female.png")}
        width={200} height={350} className='h-full aspect-[2/3] object-cover rounded-lg  w-full' alt={data.nama} />
      <div className="absolute inset-x-2 bottom-2 p-2 text-black rounded-md bg-white">
        <h4 className='text-sm font-bold'>{data.nama}</h4>
        <span className='text-xs sm:text-sm text-{#E2E2B6] text-sm'>{data.jabatan}</span>
      </div>
    </motion.div>
  )
}

export default PegawaiCard