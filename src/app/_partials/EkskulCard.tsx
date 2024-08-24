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
      {data.thumbnail && <Image src={data.thumbnail} alt={data.nama} width={300} className='h-[200px] filter brightness-90 object-cover rounded-md' height={200} />}
      <div className='vignette !absolute inset-0'>
        <div className="p-5 flex flex-col justify-between h-full">
          <h3 className='font-bold shadow-md'>{data.nama}</h3>
          <p className='text-xs transition-opacity duration-300'>{data.deskripsi}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default EkskulCard