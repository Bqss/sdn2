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
import { Textarea } from "@/components/ui/textarea";
import Datatable from "./datatable";
const Ckeditor = dynamic(() => import('@/components/Atoms/Ckeditor'), { ssr: false });
import { NewsService } from "@/services/news";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function Page() {
  useSetTitle('Berita');

  const [isOnUpdateProcess, setIsOnUpdateProcess] = useState(false);
  const slideshowSchema = yup.object({
    id: yup.string().nullable(),
    judul: yup.string().required("Judul harus diisi"),
    deskripsi: yup.string().required("Deskripsi "),
    content: yup.string().nullable("Content tidak boleh kosong"),
    thumbnail: yup.mixed().required("Thumbnail tidak boleh kosong")
  });

  const { toggleLoader } = useDashboardLayoutContext();
  const [isOpenPegawaiModal, setIsOpenPegawaiModal] = useState(false);

  const { isPending: isGettingBeritaDetail, data: detailBerita, mutateAsync: getDetailBerita } = useMutation({
    mutationFn: NewsService.getNewsById,
    mutationKey: ["detailSlideshow"],
  });

  const { isPending: isDeletingNews, mutateAsync: deleteNews } = useMutation({
    mutationFn: NewsService.deleteNews,
  });

  const { isPending: isAddingNews, mutateAsync: addNews } = useMutation({
    mutationFn: NewsService.tambahBerita,
  });

  const { isPending: isUpdatingNews, mutateAsync: updateNews } = useMutation({
    mutationFn: NewsService.updateNews,
  });

  const newsForm = useForm({
    mode: "onChange",
    resolver: yupResolver(slideshowSchema),
    defaultValues: {
      id: null,
      judul: "",
      deskripsi: "",
      content: "",
      thumbnail: undefined
    }
  });

  const onSubmit = async (data: any) => {
    try {
      if (isOnUpdateProcess) {
        const { id, ...restData } = data;
        const result = await updateNews({ id: data.id, payload: restData });
        toast.success(result.message);
        queryClientInstance.invalidateQueries({
          queryKey: ["news"],
        });
        setIsOpenPegawaiModal(false);
        newsForm.reset();
        return;
      } else {
        const { id, ...restData } = data;
        const result = await addNews(restData);
        toast.success(result.message);
        queryClientInstance.invalidateQueries({
          queryKey: ["news"],
        });
        setIsOpenPegawaiModal(false);
        newsForm.reset();
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.message);
      }
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      newsForm.reset({
        deskripsi: "",
        thumbnail: undefined,
        judul: "",
        content: "",
        id: ""
      });
    }
    setIsOnUpdateProcess(false);
    setIsOpenPegawaiModal(prev => !prev);
  }

  const handleClickEdit = async (id: string) => {
    toggleLoader(true);
    try {
      const data = await getDetailBerita(id);
      const { created_at, ...restData } = data.data;
      newsForm.reset(restData);
      newsForm.setValue("id", data.data.id);
      setIsOnUpdateProcess(true);
      setIsOpenPegawaiModal(true);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    } finally {
      toggleLoader(false);
    }
  }

  const handleClickDelete = async (id: string) => {
    toggleLoader(true);
    try {
      const result = await deleteNews(id);
      queryClientInstance.invalidateQueries({
        queryKey: ["news"],
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
          <Dialog onOpenChange={handleOpenChange} open={isOpenPegawaiModal}>
            <DialogTrigger className='bg-black text-white px-5 py-2 rounded-md hover:bg-black/80'>Tambahkan Berita</DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle >{!isOnUpdateProcess ? "Tambahkan Berita" : "Edit Berita"}</DialogTitle>
              </DialogHeader>
              <Form {...newsForm}>
                <form onSubmit={newsForm.handleSubmit(onSubmit)} className=" mt-3">
                  <div className="max-h-[60vh]  flex flex-col gap-3 overflow-y-auto">
                    <FormField
                      control={newsForm.control}
                      name="judul"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Judul <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan judul slideshow" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newsForm.control}
                      name="deskripsi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deskripsi <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Textarea placeholder="Masukkan deskripsi" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newsForm.control}
                      name="thumbnail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thumbnail <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <FileUpload maxSize={5} accept="image/*" setFiles={newsForm.setValue} files={newsForm.watch("thumbnail") as any} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <label htmlFor="" className="block text-sm mb-2 ">Content <span className="text-red-500 font-bold ">*</span></label>
                      <div className="text-sm">
                        <Ckeditor
                          data={newsForm.watch("content")}
                          onChange={(event, editor) => {
                            newsForm.setValue('content', editor.getData());
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* <FormField  */}
                  <div className="flex justify-end items-center mt-8 gap-3">
                    <DialogClose className='px-5 py-2 rounded-md text-sm bg-slate-100'>
                      Cancel
                    </DialogClose>
                    <LoadingButton type="submit" isLoading={isOnUpdateProcess ? isUpdatingNews : isAddingNews}>
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