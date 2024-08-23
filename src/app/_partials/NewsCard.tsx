import { makeEllipsis } from '@/lib/utils';
import Image from 'next/image'
import Link from 'next/link';
import React, { useMemo } from 'react'
import { FaUserSecret } from "react-icons/fa";

const NewsCard = ({ data }: { data: any }) => {
  const part = useMemo(() => {
    const date = new Date(data.created_at._seconds * 1000);
    const options: any = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options).split(" ");
  }, [data]);


  return (
    <div className='rounded-lg overflow-hidden'>
      <div className='relative group'>
        <Link href={`/berita/${data.id}`} className='overflow-hidden'>
          <Image src={data.thumbnail} alt={data.judul} width={290} height={290} className='group-hover:scale-105 transition-all w-full object-cover rounded-lg aspect-[3/2]' />
        </Link>
        <div className='flex flex-col absolute left-2 bottom-2 p-2 text-yellow-500 bg-blue-950/80 w-fit rounded-lg'>
          <span className='text-xl font-extrabold'>{part[0]} </span>
          <span className='text-xs'>{part[1]}, {part[2]}</span>
        </div>
      </div>
      <div className='bg-white text-black p-3 rounded-md mt-2'>
        <Link href={`/berita/${data.id}`} className='font-bold text-base hover:text-blue-500'>{makeEllipsis(data.judul, 50)}</Link>
        <p className='mt-4 text-sm'>{makeEllipsis(data.deskripsi, 150)}</p>
        <div className='mt-3 flex gap-2'>
          <FaUserSecret size={18} className='text-sm text-gray-500' />
          <span className='text-sm font-bold'>Admin</span>
        </div>
      </div>

    </div>
  )
}

export default NewsCard