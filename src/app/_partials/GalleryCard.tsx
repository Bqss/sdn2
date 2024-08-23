import { ucFirst } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

const GalleryCard = ({ data }: { data: any }) => {
  return (
    <div className='rounded-lg relative overflow-hidden'>
      <Image src={data.foto} width={300} height={300} alt={data.judul} className='rounded-lg w-full h-full object-cover'/>
      <div className="absolute inset-x-0 h-[30%] bg-gradient-to-b from-black to-black/0 top-0"></div>
      <div className="absolute inset-x-0 h-[50%] bg-gradient-to-t from-black to-black/0 bottom-0"></div>
      <div className="!absolute inset-0 p-3 flex flex-col justify-between ">
        <span className='text-sm'>{ucFirst(data.judul)}</span>
        <span className='text-xs'>{ucFirst(data.deskripsi)}</span>
      </div>
    </div>
  )
}

export default GalleryCard