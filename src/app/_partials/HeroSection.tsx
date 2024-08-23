"use client"
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css';
import 'swiper/css/scrollbar';
import Image from 'next/image';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';


const HeroSection = ({ slideshows }: { slideshows: Array<Slideshow> }) => {
  return (
    <section className="flex w-full h-screen ">
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        autoplay={{ delay: 4000 }}  
        effect='cube'
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        speed={1000}
      >
        {slideshows.map((slideshow: Slideshow) => {
          return (
            <SwiperSlide key={slideshow.id}>
              <div className='w-full h-full relative overflow-hidden vignette'>
                <Image src={slideshow.gambar} width={1200} height={700} alt="slideshow" className="filter w-full h-full object-cover brightness-50" />
                <div className="absolute inset-0 container flex justify-center text-left flex-col mx-auto">
                  <h1 className="text-5xl font-bold">{slideshow.judul}</h1>
                  <p className="mt-3 text-xl">{slideshow.deskripsi}</p>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>

    </section>
  )
}

export default HeroSection