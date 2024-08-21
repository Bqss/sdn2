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
import { ArsipService } from "@/services/arsip";
import { toast } from "sonner";
import { AxiosError } from "axios";


export default function Page() {
  useSetTitle('Arsip File');

  const [isOnUpdateProcess, setIsOnUpdateProcess] = useState(false);
  const slideshowSchema = yup.object({
    id: yup.string().nullable(),
    nama: yup.string().required("Nama tidak boleh kosong"),
    file: yup.mixed().required("File tidak boleh kosong"),
    tag: yup.string().required("Tag tidak boleh kosong"),
  });

  const { toggleLoader } = useDashboardLayoutContext();
  const [isOpenArsipModal, setIsOpenArsipModal] = useState(false);

  const { isPending: isGettingArsipDetail, data: detailArsip, mutateAsync: getDetailArsip } = useMutation({
    mutationFn: ArsipService.getArsipById,
    mutationKey: ["archiveDetail"],
  });

  const { isPending: isDeleteArsip, mutateAsync: deleteArsip } = useMutation({
    mutationFn: ArsipService.deleteArsip,
  });

  const { isPending: isAddingArsip, mutateAsync: addArsip } = useMutation({
    mutationFn: ArsipService.tambahArsip,
  });

  const { isPending: isUpdatingArsip, mutateAsync: updateArsip } = useMutation({
    mutationFn: ArsipService.updateArsip,
  });

  const newsForm = useForm({
    mode: "onChange",
    resolver: yupResolver(slideshowSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      if (isOnUpdateProcess) {
        const { id, ...restData } = data;

        const result = await updateArsip({ id: data.id, payload: restData });
        toast.success(result.message);
        queryClientInstance.invalidateQueries({
          queryKey: ["archives"],
        });
        setIsOpenArsipModal(false);
        newsForm.reset();
        return;


      } else {
        const { id, ...restData } = data;
        const result = await addArsip(restData);
        toast.success(result.message);
        queryClientInstance.invalidateQueries({
          queryKey: ["archives"],
        });
        setIsOpenArsipModal(false);
        newsForm.reset();

      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      } else {
        toast.error("Terjadi kesalahan, silahkan coba lagi");
      }
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      newsForm.reset({
        nama: "",
        file: undefined,
        tag: "",
        id: ""
      });
    }
    setIsOnUpdateProcess(false);
    setIsOpenArsipModal(prev => !prev);
  }

  const handleClickEdit = async (id: string) => {
    toggleLoader(true);
    try {
      const data = await getDetailArsip(id);
      const { created_at, ...restData } = data.data;
      newsForm.reset(restData);
      newsForm.setValue("id", data.data.id);
      setIsOnUpdateProcess(true);
      setIsOpenArsipModal(true);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      } else {
        toast.error("Terjadi kesalahan, silahkan coba lagi ");
      }
    } finally {
      toggleLoader(false);
    }
  }

  const handleClickDelete = async (id: string) => {

    toggleLoader(true);
    try {
      const result = await deleteArsip(id);
      queryClientInstance.invalidateQueries({
        queryKey: ["archives"],
      });
      toast.success(result.message);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      } else {
        toast.error("Terjadi kesalahan, silahkan coba lagi");
      }
    } finally {
      toggleLoader(false);
    }

  }


  return (
    <Card className='py-5 text-sm'>
      <CardContent>
        <div className="flex items-center justify-end mb-4">
          <Dialog onOpenChange={handleOpenChange} open={isOpenArsipModal}>
            <DialogTrigger className='bg-black text-white px-5 py-2 rounded-md hover:bg-black/80'>Tambahkan Arsip File</DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle >{!isOnUpdateProcess ? "Tambah Arsip File" : "Edit Arsip File"}</DialogTitle>
              </DialogHeader>
              <Form {...newsForm}>
                <form onSubmit={newsForm.handleSubmit(onSubmit)} className=" mt-3 flex flex-col gap-3">
                  <FormField
                    control={newsForm.control}
                    name="nama"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan judul slideshow" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={newsForm.control}
                    name="tag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tag <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan tag" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={newsForm.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>File <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <FileUpload maxSize={10} setFiles={newsForm.setValue} files={newsForm.watch("file") as any} {...field} />
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
                    <LoadingButton type="submit" isLoading={isOnUpdateProcess ? isUpdatingArsip : isAddingArsip}>
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