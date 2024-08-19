"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useSetTitle } from "@/hooks/useSetTitle";

import { Input } from "@/components/ui/input"
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { useState } from "react";
import * as yup from "yup";
import useDashboardLayoutContext from "@/hooks/useDashboardLayoutContext";
import { queryClientInstance } from "../layout";
import { useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useMutation } from "@tanstack/react-query";
import LoadingButton from "@/components/Atoms/LoadingButton";
import FileUpload from "@/components/Atoms/FileUpload";
import Datatable from "./datatable";
import { EkstrakurikulerService } from "@/services/ekstrakurikuler";
import { Select } from "@/components/ui/select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
  useSetTitle("Ekstrakurikuler");

  const [isOnUpdateProcess, setIsOnUpdateProcess] = useState(false);
  const ekstrakurikulerSchema = yup.object({
    id: yup.string().nullable(),
    thumbnail: yup.mixed().required("Thumbnail harus diisi"),
    nama: yup.string().required("Nama ekstrakurikuler harus diisi"),
    deskripsi: yup.string().required("Deskripsi ekstrakurikuler harus diisi"),
  });

  const { toggleLoader } = useDashboardLayoutContext();
  const [isOpenEsktrakurikulerModal, setIsOpenEkstrakurikulerModal] = useState(false);

  const { isPending: isGettingEkstrakurikuler, data: detailEkstrakurikuler, mutateAsync: getDetailEkstrakurikuler } = useMutation({
    mutationFn: EkstrakurikulerService.getEkstrakurikulerById,
    mutationKey: ["detailEkstrakurikuler"],
  });

  const { isPending: isDeletingEkstrakurikuler, mutateAsync: deleteEkstrakurikuler } = useMutation({
    mutationFn: EkstrakurikulerService.deleteEkstrakurikuler,
  });

  const { isPending: isAddingEkstrakurikuler, mutateAsync: addEkstrakurikuler } = useMutation({
    mutationFn: EkstrakurikulerService.tambahEkstrakurikuler,
  });

  const { isPending: isUpdateEkstrakurikuler, mutateAsync: updateEkstrakurikuler } = useMutation({
    mutationFn: EkstrakurikulerService.updateEkstrakurikuler,
  });

  const prestasiForm = useForm({
    mode: "onChange",
    resolver: yupResolver(ekstrakurikulerSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      if (isOnUpdateProcess) {
        const { id, ...restData } = data;
        try {
          const result = await updateEkstrakurikuler({ id: data.id, payload: restData });
          alert(result?.message);
          queryClientInstance.invalidateQueries({
            queryKey: ["ekstrakurikuler"],
          });
          setIsOnUpdateProcess(false);
          setIsOpenEkstrakurikulerModal(false);
          prestasiForm.reset();
          return;
        } catch (err) {
          console.log(err);
        }

      } else {
        const { id, ...restData } = data;
        try {
          const result = await addEkstrakurikuler(restData);
          alert(result.message);
          queryClientInstance.invalidateQueries({
            queryKey: ["ekstrakurikuler"],
          });
          setIsOpenEkstrakurikulerModal(false);
          prestasiForm.reset();
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      alert("Data gagal ditambahkan");
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      prestasiForm.reset();
    }
    setIsOnUpdateProcess(false);
    setIsOpenEkstrakurikulerModal(prev => !prev);
  }

  const handleClickEdit = async (id: string) => {
    toggleLoader(true);
    try {
      const data = await getDetailEkstrakurikuler(id);
      prestasiForm.reset(data.data);
      prestasiForm.setValue("id", data.data.id);
      queryClientInstance.invalidateQueries({
        queryKey: ["ekstrakurikuler"],
      });
      setIsOnUpdateProcess(true);
      setIsOpenEkstrakurikulerModal(true);
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
        await deleteEkstrakurikuler(id);
        queryClientInstance.invalidateQueries({
          queryKey: ["ekstrakurikuler"],
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
    <Card className='py-5 text-sm'>
      <CardContent>
        <div className="flex items-center justify-end mb-4">
          <Dialog onOpenChange={handleOpenChange} open={isOpenEsktrakurikulerModal}>
            <DialogTrigger className='bg-black text-white px-5 py-2 rounded-md hover:bg-black/80'>Tambahkan Ekstrakurikuler</DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle >{!isOnUpdateProcess ? "Tambahkan Ekstrakurikuler" : "Edit Ekstrakurikuler"}</DialogTitle>
              </DialogHeader>
              <Form {...prestasiForm}>
                <form onSubmit={prestasiForm.handleSubmit(onSubmit)} className=" mt-3 flex flex-col gap-3">
                  <FormField
                    control={prestasiForm.control}
                    name="nama"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Judul <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan judul prestasi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={prestasiForm.control}
                    name="deskripsi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi <span className="text-red-500">*</span></FormLabel>
                        <Textarea placeholder="" {...field}/>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={prestasiForm.control}
                    name="thumbnail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thumbnail <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <FileUpload setFiles={prestasiForm.setValue} files={prestasiForm.watch("thumbnail") as any} {...field} />
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
                    <LoadingButton type="submit" isLoading={isOnUpdateProcess ? isUpdateEkstrakurikuler : false}>
                      {isOnUpdateProcess ? "Simpan" : "Tambahkan"}
                    </LoadingButton>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <Datatable handleDelete={handleClickDelete} handleEdit={handleClickEdit} />
        </div>
      </CardContent>
    </Card>
  )
}