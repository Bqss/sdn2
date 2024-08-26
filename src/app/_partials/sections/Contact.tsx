"use client";
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import React from 'react'
import { FaFax } from 'react-icons/fa6'
import { IoLocationOutline } from 'react-icons/io5'
import { MdOutlineMail, MdOutlinePhone } from 'react-icons/md'
import { motion } from 'framer-motion'

const Contact = () => {
  return (
    <section className="relative overflow-hidden">
      <Image src={"/images/background-dark.png"} width={1440} alt="dark-background" height={600} className="filter absolute inset-0 brightness-[2.5] h-full w-full" />
      <div className="py-16 flex flex-col items-center relative ">
        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: .25 }}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 20 }
          }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl text-center font-bold  text-white">Hubungi Kami</motion.h1>
        <Separator className="my-2 w-20 bg-white" />
        <div className="mt-10 lg:mt-16 w-full container mx-auto flex flex-col-reverse lg:flex-row gap-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: .5 }}
            transition={{ duration: 0.4 }}
            variants={{
              visible: { opacity: 1, scale: 1 },
              hidden: { opacity: 0, scale: .75 }
            }}
            className="lg:w-1/2 relative overflow-hidden rounded-md">
            <h3 className="text-2xl font-bold mb-4">Denah Lokasi</h3>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.0077983704805!2d112.67826157550242!3d-7.894251878539822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd62bb82fa99057%3A0x77e46a8da7bb4d40!2sSDN%202%20Tamanharjo!5e0!3m2!1sid!2sid!4v1724347315808!5m2!1sid!2sid" width="600" height="450" style={{
              border: 0,
              width: "100%",
            }} loading="lazy"></iframe>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: .5 }}
            transition={{ duration: 0.4 }}
            variants={{
              visible: { opacity: 1, scale: 1 },
              hidden: { opacity: 0, scale: .75 }
            }}
            className="flex flex-col gap-3 w-full lg:w-1/2 text-sm">
            <h3 className="text-2xl font-bold mb-4">Kontak</h3>
            <div className="flex gap-3 items-center">
              <span className='flex-shrink-0'>
                <IoLocationOutline className="text-2xl" size={30} />
              </span>
              <div className="flex flex-col">
                <span>Alamat</span>
                <span>Jl. Tamanharjo No. 1, Kec. Lowokwaru, Kota Malang</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MdOutlinePhone className="text-2xl" size={30} />
              <div className="flex flex-col">
                <span>Telepon</span>
                <span>0341-123456</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MdOutlineMail className="text-2xl" size={30} />
              <div className="flex flex-col">
                <span>Email</span>
                <span>tes@gmail.com</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaFax className="text-2xl" size={30} />
              <div className="flex flex-col">
                <span>Fax</span>
                <span>-</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact