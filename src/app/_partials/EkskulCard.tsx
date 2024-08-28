"use client"
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion';

function EkskulCard({ data, delay }: any) {
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

      className='rounded-lg group relative'>
      {data.thumbnail && <Image src={data.thumbnail} alt={data.nama} width={300} className='w-full filter brightness-90 aspect-video object-cover rounded-md' height={200} />}
      <div className='vignette !absolute inset-0 '>
        <div className="p-5 flex flex-col justify-between h-full relative">
          <div className="absolute inset-x-0 h-[30%] bg-gradient-to-b from-black/60 to-black/0 top-0"></div>
          <div className="absolute inset-x-0 h-[50%] bg-gradient-to-t from-black/60 to-black/0 bottom-0"></div>
          <div className="relative z-99 h-full flex flex-col justify-between">
            <h3 className='font-bold shadow-md text-xl'>{data.nama}</h3>
            <p className=' transition-opacity duration-300'>{data.deskripsi}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default EkskulCard