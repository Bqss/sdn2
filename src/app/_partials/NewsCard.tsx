"use client"
import { makeEllipsis } from '@/lib/utils';
import Image from 'next/image'
import Link from 'next/link';
import React, { useMemo } from 'react'
import { FaUserSecret } from "react-icons/fa";
import { motion } from 'framer-motion';

const NewsCard = ({ data, delay }: { data: any, delay: number }) => {


  const convertedData = useMemo(() => {
      return JSON.parse(data);
  },[data])

  const part = useMemo(() => {
    const date = new Date(convertedData.created_at._seconds * 1000);
    const options: any = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options).split(" ");
  }, [convertedData]);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: .25 }}
      transition={{ duration: 0.4, delay }}
      variants={{
        visible: { opacity: 1, scale: 1 },
        hidden: { opacity: 0, scale:.75  }
      }}
      className='rounded-lg overflow-hidden'>
      <div className='relative group'>
        <Link href={`/berita/${convertedData.id}`} className='overflow-hidden'>
          <Image src={convertedData.thumbnail} alt={convertedData.judul} width={290} height={290} className='group-hover:scale-105 transition-all w-full object-cover rounded-lg aspect-[3/2]' />
        </Link>
        <div className='flex flex-col absolute left-2 bottom-2 p-2 text-yellow-500 bg-blue-950/80 w-fit rounded-lg'>
          <span className='text-xl font-extrabold'>{part[0]} </span>
          <span className='text-xs'>{part[1]}, {part[2]}</span>
        </div>
      </div>
      <div className='bg-white text-black p-3 rounded-md mt-2'>
        <Link href={`/berita/${convertedData.id}`} className='font-bold text-base hover:text-blue-500'>{makeEllipsis(convertedData.judul,200)}</Link>
        <p className='mt-4 text-sm'>{makeEllipsis(convertedData.deskripsi, 150)}</p>
        <div className='mt-3 flex gap-2'>
          <FaUserSecret size={18} className='text-sm text-gray-500' />
          <span className='text-sm font-bold'>Admin</span>
        </div>
      </div>

    </motion.div>
  )
}

export default NewsCard