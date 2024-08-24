"use client";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react'
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { AiOutlineSend } from "react-icons/ai";
import { motion } from 'framer-motion'

const saranSchema = object().shape({
  nama: string().nullable(),
  email: string().email('Email tidak valid').required('Email harus diisi'),
  saran: string().required('Saran harus diisi'),
  telp: string().nullable()
});


const FormSaran = () => {
  const saranForm = useForm({
    resolver: yupResolver(saranSchema),
    mode: 'onChange',
    defaultValues: {
      nama: '',
      email: '',
      saran: '',
      telp: ''
    }
  });

  const onSubmit = () => {

  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: .25 }}
      transition={{ duration: 0.4 }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
      className='p-4 mt-10 container relative rounded-lg border border-[#6EACDA]'>
      <Form {...saranForm}>
        <form onSubmit={saranForm.handleSubmit(onSubmit)} className=" mt-3">
          <div className="max-h-[60vh]  flex flex-col gap-3 px-3">
            <FormField
              control={saranForm.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={saranForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan email anda " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={saranForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telp</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan email anda " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={saranForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saran <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea placeholder='Masukkan saran anda' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end mt-3">
            <Button className='bg-blue-500 hover:bg-blue-700 inline-flex gap-2 ml-auto'>
              <AiOutlineSend />
              <span>Kirim</span>
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  )
}

export default FormSaran