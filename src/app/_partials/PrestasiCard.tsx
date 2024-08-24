import Image from 'next/image'
import React from 'react'
import { CiCalendar } from "react-icons/ci";
import { AiOutlineNumber } from "react-icons/ai";
import { CiMedal } from "react-icons/ci";
import { CiMicrophoneOn } from "react-icons/ci";
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

const PrestasiCard = ({ data }: any) => {
  const publishedAt = new Date(data.created_at._seconds * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <Link href={`/prestasi/${data.id}`} className='flex flex-col sm:flex-row w-full group rounded-lg overflow-hidden text-white p-2 border border-[#E2E2B6]'>
      <div className=" sm:w-1/2 overflow-hidden">
        <Image src={data.foto} width={300} height={200} alt={data.judul} className=' group-hover:scale-110 transition-all duration-300 rounded-lg w-full' />
      </div>
      <div className='p-4 flex-1'>
        <h3 className='font-bold text-xl'>{data.judul}</h3>
        <div className="flex gap-4">
          <span className='text-xs sm:text-sm inline-flex items-center gap-2 mt-2'>
            <CiCalendar size={18} className='inline-block' />
            {publishedAt}</span>
          <span className='text-xs sm:text-sm inline-flex items-center gap-2 mt-2'>
            <AiOutlineNumber size={18} className='inline-block' />
            Tingkat {data.skala}</span>
        </div>
        <Separator className='w-full bg-white mt-3' />
        <div className='text-sm mt-4 flex flex-col'>
          <span className='inline-flex items-center gap-1'>
            <CiMicrophoneOn size={22} className='inline-block' />
            <span>{data.penyelenggara}</span>
          </span>
          <span className='inline-flex items-center mt-2 gap-1'>
            <CiMedal size={22} className='inline-block' />
            <span>{data.peraih}</span>
          </span>
        </div>
      </div>
    </Link>
  )
}

export default PrestasiCard