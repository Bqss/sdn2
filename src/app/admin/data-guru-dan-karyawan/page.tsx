"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useSetTitle } from '@/hooks/useSetTitle';
import { DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React, { ReactNode, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import * as yup from "yup";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { GoPencil } from "react-icons/go";
import { FaRegTrashCan } from "react-icons/fa6";
import { yupResolver } from '@hookform/resolvers/yup';
import FileUpload from '@/components/Atoms/FileUpload';
import { DialogClose } from '@radix-ui/react-dialog';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PegawaiService } from '@/services/pegawai';
import Image from 'next/image';
import LoadingButton from '@/components/Atoms/LoadingButton';
import useDashboardLayoutContext from '@/hooks/useDashboardLayoutContext';
import { queryClientInstance } from '../layout';
import Ckeditor from '@/components/Atoms/Ckeditor';
import { Textarea } from '@/components/ui/textarea';

function Page() {

  useSetTitle("Data Guru dan Karyawan")

  const [isOnUpdateProcess, setIsOnUpdateProcess] = useState(false);
  const formSchema = yup.object({
    id: yup.string().nullable(),
    nama: yup.string().required(),
    order: yup.number().required(),
    jabatan: yup.string().required(),
    deskripsi: yup.string().nullable(),
    foto: yup.mixed().nullable(),
  });

  const { toggleLoader } = useDashboardLayoutContext();

  const { isLoading, data } = useQuery({
    queryKey: ["pegawai"],
    queryFn: PegawaiService.getPegawai,
  });

  const { isPending: isGettingDetailPegawai, data: detailPegawai, mutateAsync: getDetailPegawai } = useMutation({
    mutationFn: PegawaiService.getPegawaiById,
    mutationKey: ["detailPegawai"],
  });

  const { isPending: isDeletingPegawai, mutateAsync: deletePegawai } = useMutation({
    mutationFn: PegawaiService.deletePegawai,
  });

  const [isOpenPegawaiModal, setIsOpenPegawaiModal] = useState(false);

  const { isPending: isAddingWorker, mutateAsync: addWorker } = useMutation({
    mutationFn: PegawaiService.tambahPegawai,
  });
  const { isPending: isUpdateWorker, mutateAsync: updateWorker } = useMutation({
    mutationFn: PegawaiService.updatePegawai,
  });

  const pegawaiForm = useForm({
    mode: "onChange",
    resolver: yupResolver(formSchema),
    defaultValues: {
      nama: "",
      jabatan: "",
      order: 0,
      deskripsi: "",
      foto: null,
    }
  })

  const onSubmit = async (data: any) => {
    try {
      if (isOnUpdateProcess) {
        const { id, ...restData } = data;
        await updateWorker({ id: data.id, payload: restData });
        alert("Data berhasil diupdate");
        queryClientInstance.invalidateQueries({
          queryKey: ["pegawai"],
        });
        setIsOpenPegawaiModal(false);
        pegawaiForm.reset();
        return;
      } else {
        const { id, ...restData } = data;
        await addWorker(restData);
        alert("Data berhasil ditambahkan");
        queryClientInstance.invalidateQueries({
          queryKey: ["pegawai"],
        });
        setIsOpenPegawaiModal(false);
        pegawaiForm.reset();
      }
    } catch (err) {
      alert("Data gagal ditambahkan");
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      pegawaiForm.reset({
        deskripsi: "",
        id: null,
        foto: null,
        jabatan: "",
        nama: "",
        order: 0,
      });
    }
    setIsOnUpdateProcess(false);
    setIsOpenPegawaiModal(prev => !prev);
  }

  const handleClickEdit = async (id: string) => {
    toggleLoader(true);
    try {
      const data = await getDetailPegawai(id);
      pegawaiForm.reset(data.data);
      pegawaiForm.setValue("id", data.data.id);
      queryClientInstance.invalidateQueries({
        queryKey: ["pegawai"],
      });
      setIsOnUpdateProcess(true);
      setIsOpenPegawaiModal(true);
    } catch (err) {
      alert("Data gagal diambil");
    } finally {
      toggleLoader(false);
    }
  }

  const handleClickDelete = async (id: string) => {
    const confirmed = confirm("Apakah anda yakin ingin menghapus data ini?");
    if (confirmed) {
      toggleLoader(true);
      try {
        await deletePegawai(id);
        queryClientInstance.invalidateQueries({
          queryKey: ["pegawai"],
        });
        alert("Data berhasil dihapus");
      } catch (err) {
        alert("Data gagal dihapus");
      } finally {
        toggleLoader(false);
      }
    }
  }

  return (
    <>
      <Card className='py-5 text-sm'>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="relative">
              <span className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 '>
                <CiSearch size={20} />
              </span>
              <Input className='pl-10 border-gray-300' placeholder='Cari...' />
            </div>
            <Dialog onOpenChange={handleOpenChange} open={isOpenPegawaiModal}>
              <DialogTrigger className='bg-black text-white px-5 py-2 rounded-md hover:bg-black/80'>Tambahkan data pegawai</DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle >{isOnUpdateProcess ? "Edit data pegawai " : "Tambah data pegawai"}</DialogTitle>
                </DialogHeader>
                <Form {...pegawaiForm}>
                  <form onSubmit={pegawaiForm.handleSubmit(onSubmit)} className=" mt-3 flex flex-col gap-3">
                    <FormField
                      control={pegawaiForm.control}
                      name="nama"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Pegawai <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan nama pegawai" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pegawaiForm.control}
                      name="jabatan"
                      render={({ field }) => (
                        <FormItem >
                          <FormLabel>Jabatan <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan jabatan" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pegawaiForm.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem >
                          <FormLabel>Urutan <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="urutan" type='number'  {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pegawaiForm.control}
                      name="deskripsi"
                      render={({ field }) => (
                        <FormItem >
                          <FormLabel>Deskripsi</FormLabel>
                          <FormControl>
                            <Textarea placeholder='Masukkan deskripsi pegawai' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pegawaiForm.control}
                      name="foto"
                      render={({ field }) => (
                        <FormItem >
                          <FormLabel>Foto</FormLabel>
                          <FormControl>
                            <FileUpload {...field} files={pegawaiForm.watch("foto") as any} setFiles={pegawaiForm.setValue} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* <FormField  */}
                    <div className="flex justify-end items-center mt-8 gap-3">
                      <DialogClose className='px-5 py-2 rounded-md text-sm bg-slate-100'>
                        Cancel
                      </DialogClose>
                      <LoadingButton type="submit" isLoading={isOnUpdateProcess ? isUpdateWorker : isAddingWorker}>
                        {isOnUpdateProcess ? "Simpan" : "Tambahkan"}
                      </LoadingButton>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-6">
            {/* blank state */}
            {isLoading ? <p>Loading...</p> : data.data.length > 0 ? (
              <div className="grid grid-cols-5 gap-3">
                {data?.data.map((pegawai: any) => (
                  <PegawaiCard key={pegawai.id} handleClickDelete={handleClickDelete} handleClickEdit={handleClickEdit} dataPegawai={pegawai} />
                ))}
              </div>
            ) : (
              <div className="text-center px-5 py-15 text-sm rounded-md bg-gray-50 mt-5">
                <p className="text-black">Data guru dan karyawan belum tersedia</p>
              </div>
            )}
          </div>

        </CardContent>
      </Card>
    </>
  )
}

const PegawaiCard = ({ dataPegawai, handleClickEdit, handleClickDelete }: { dataPegawai: any, handleClickEdit: (id: string) => void, handleClickDelete: (id: string) => void }) => {
  return (
    <div className='p-.5 rounded-lg border flex flex-col border-gray-400 group cursor-pointer overflow-hidden hover:scale-105 transition-all duration-200 relative'>
      <Image src={dataPegawai?.foto} width={100} height={100} className='w-full aspect-square rounded-md object-cover  transition-all duration-300' alt={dataPegawai?.nama} />
      <div className='opacity-0 group-hover:opacity-100 grid place-content-center absolute inset-0 bg-black/20 transition-opacity duratin-300 ease-in-out'>
        <div className="flex gap-2">
          <Button size={"sm"} variant={"destructive"} onClick={() => handleClickDelete(dataPegawai?.id)}>
            <FaRegTrashCan />
          </Button>
          <Button variant={"outline"} size={"sm"} onClick={() => handleClickEdit(dataPegawai?.id)}>
            <GoPencil />
          </Button>
        </div>
      </div>

      <div className='mt-1 flex-1 bg-black space-y-1 text-white py-5 px-3 rounded-md'>
        <h3 className='text-base font-medium'>{dataPegawai?.nama}</h3>
        <hr className='border-top border-white' />
        <p>{dataPegawai?.jabatan}</p>
      </div>
    </div>
  )
}

export default Page