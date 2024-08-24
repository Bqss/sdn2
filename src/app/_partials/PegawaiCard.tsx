import Image from 'next/image'
import React from 'react'

const PegawaiCard = ({ data }: any) => {
  return (
    <div className='flex w-full relative group rounded-lg overflow-hidden bg-white text-white border border-[#E2E2B6]'>
      <Image src={data.foto?? (data.is_male =="1" ? "/images/guru-placeholder-male.jpg": "/images/guru-placeholder-female.png")}
       width={200} height={350} className='h-full aspect-[2/3] object-cover rounded-lg  w-full' alt={data.nama} />
      <div className="absolute inset-x-2 bottom-2 p-2 text-black rounded-md bg-white">
          <h4 className='text-sm font-bold'>{data.nama}</h4>
          <span className='text-xs sm:text-sm text-{#E2E2B6] text-sm'>{data.jabatan}</span>
      </div>
    </div>
  )
}

export default PegawaiCard