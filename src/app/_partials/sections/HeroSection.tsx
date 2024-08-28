"use client"
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css';
import 'swiper/css/scrollbar';
import Image from 'next/image';
import { motion } from "framer-motion";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';


const HeroSection = ({ slideshows }: { slideshows: Array<Slideshow> }) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="flex w-full h-screen ">
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        autoplay={{ delay: 6000 }}
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
                  <motion.h1
                    className="text-3xl lg:text-4xl text-gray-200 xl:text-5xl font-bold"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 3 }}
                  >
                    {slideshow.judul}
                  </motion.h1>
                  <motion.p
                    className="text-base mt-3 sm:text-xl"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 3 }}
                  >
                    {slideshow.deskripsi}
                  </motion.p>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>

    </motion.section>
  )
}

export default HeroSection