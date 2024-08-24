"use client";
import { ucFirst } from '@/lib/utils'
import Image from 'next/image'
import React, { useMemo } from 'react'
import { motion } from 'framer-motion';

const GalleryCard = ({ data, delay }: any) => {
  const parsedData = useMemo(() => {
    return JSON.parse(data)
  }, [data]);
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

      className='rounded-lg relative overflow-hidden'>
      <Image src={parsedData.foto} width={300} height={300} alt={parsedData.judul} className='rounded-lg w-full h-full object-cover' />
      <div className="absolute inset-x-0 h-[30%] bg-gradient-to-b from-black to-black/0 top-0"></div>
      <div className="absolute inset-x-0 h-[50%] bg-gradient-to-t from-black to-black/0 bottom-0"></div>
      <div className="!absolute inset-0 p-3 flex flex-col justify-between ">
        <span className='text-sm'>{ucFirst(parsedData.judul)}</span>
        <span className='text-xs'>{ucFirst(parsedData.deskripsi)}</span>
      </div>
    </motion.div>
  )
}

export default GalleryCard