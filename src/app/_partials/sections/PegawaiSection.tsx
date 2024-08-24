"use client";

import { Separator } from '@radix-ui/react-separator';
import React, { FC } from 'react'
import PegawaiCard from './../PegawaiCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { useMediaQuery } from "usehooks-ts";

interface PegawaiSectionProps {
  pegawai: any[],

}

const PegawaiSection: FC<PegawaiSectionProps> = ({ pegawai }) => {
  
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const isMediumDevice = useMediaQuery(
    "only screen and (min-width : 769px) and (max-width : 992px)"
  );
  const isLargeDevice = useMediaQuery(
    "only screen and (min-width : 993px) and (max-width : 1200px)"
  );

  return (
    <section className="w-full relative overflow-hidden bg-[#03346E]">
      <div className="py-16 sm:py-24 flex flex-col items-center relative ">
        <h1 className="text-2xl text-center font-bold  text-white">Data kepagawaian dan guru</h1>
        <Separator className="my-2 w-40 h-[2px] bg-white" />
        <div className=" mt-16 w-full container relative">
          <Swiper
            spaceBetween={isSmallDevice ? 10 : isMediumDevice ? 20 : isLargeDevice ? 30 : 40}
            slidesPerView={isSmallDevice ? 2 : isMediumDevice ? 3 : isLargeDevice ? 4 : 5}
            autoplay={{ delay: 4000 }}
            effect='cube'
            modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
            scrollbar={{ draggable: true }}
            navigation={{
              enabled: true,
              prevEl: '.swiper-button-prev',
              nextEl: '.swiper-button-next',
            }}
            speed={1000}
          >
            {pegawai.map((p: any, i) => (
              <SwiperSlide key={p.id}>
                < PegawaiCard key={p.id} data={p} delay={i * 0.07} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-button-prev absolute top-1/2 left-0 transform -translate-y-1/2 bg-white rounded-full !w-8 !h-8 font-bold grid place-content-center text-black after:!text-sm"></div>
          <div className="swiper-button-next absolute top-1/2 right-0 transform -translate-y-1/2 bg-white rounded-full !w-8 !h-8 font-bold grid place-content-center text-black after:!text-sm"></div>
        </div>
      </div>
    </section>
  )
}

export default PegawaiSection