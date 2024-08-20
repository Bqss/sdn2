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
import { GalleryService } from "@/services/gallery";
import dynamic from "next/dynamic";

export default function Page() {
  useSetTitle("Gallery");

  const [isOnUpdateProcess, setIsOnUpdateProcess] = useState(false);
  const gallerySchema = yup.object({
    id: yup.string().nullable(),
    judul: yup.string().required("Judul tidak boleh kosong"),
    deskripsi: yup.string().required("Deskripsi tidak boleh kosong"),
    foto: yup.mixed().required("Foto tidak boleh kosong")
  });

  const { toggleLoader } = useDashboardLayoutContext();
  const [isOpenGalleryModal, setIsOpenGalleryModal] = useState(false);

  const { isPending: isGettingBeritaDetail, data: detailBerita, mutateAsync: getDetailBerita } = useMutation({
    mutationFn: GalleryService.getGalleryById,
    mutationKey: ["detailGallery"],
  });

  const { isPending: isDeletingGallery, mutateAsync: deleteGallery } = useMutation({
    mutationFn: GalleryService.deleteGallery,
  });

  const { isPending: isAddingGallery, mutateAsync: addGallery } = useMutation({
    mutationFn: GalleryService.tambahBerita,
  });

  const { isPending: isUpdatingGallery, mutateAsync: updateGallery } = useMutation({
    mutationFn: GalleryService.updateGallery,
  });

  const galleryForm = useForm({
    mode: "onChange",
    resolver: yupResolver(gallerySchema),
    defaultValues: {
      id: null,
      judul: "",
      deskripsi: "",
      foto: undefined
    }
  });

  const onSubmit = async (data: any) => {
    try {
      if (isOnUpdateProcess) {
        const { id, ...restData } = data;
        try {
          const result = await updateGallery({ id: data.id, payload: restData });
          alert(result.message);
          queryClientInstance.invalidateQueries({
            queryKey: ["gallery"],
          });
          setIsOpenGalleryModal(false);
          galleryForm.reset();
          return;
        } catch (err) {
          console.log(err);
        }

      } else {
        const { id, ...restData } = data;
        try {
          await addGallery(restData);
          alert("Data slideshow berhasil ditambahkan");
          queryClientInstance.invalidateQueries({
            queryKey: ["gallery"],
          });
          setIsOpenGalleryModal(false);
          galleryForm.reset();
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
      galleryForm.reset({
        deskripsi: "",
        foto: undefined,
        judul: "",
        id: ""
      });
    }
    setIsOnUpdateProcess(false);
    setIsOpenGalleryModal(prev => !prev);
  }

  const handleClickEdit = async (id: string) => {
    toggleLoader(true);
    try {
      const data = await getDetailBerita(id);
      const {created_at, ...restData} = data.data;
      galleryForm.reset(restData);
      galleryForm.setValue("id", data.data.id);
      queryClientInstance.invalidateQueries({
        queryKey: ["gallery"],
      });
      setIsOnUpdateProcess(true);
      setIsOpenGalleryModal(true);
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
        await deleteGallery(id);
        queryClientInstance.invalidateQueries({
          queryKey: ["gallery"],
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
          <Dialog onOpenChange={handleOpenChange} open={isOpenGalleryModal}>
            <DialogTrigger className='bg-black text-white px-5 py-2 rounded-md hover:bg-black/80'>Tambahkan Gallery</DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle >{!isOnUpdateProcess ? "Tambahkan Gallery" : "Edit Gallery"}</DialogTitle>
              </DialogHeader>
              <Form {...galleryForm}>
                <form onSubmit={galleryForm.handleSubmit(onSubmit)} className=" mt-3 flex flex-col gap-3">
                  <FormField
                    control={galleryForm.control}
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
                    control={galleryForm.control}
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
                    control={galleryForm.control}
                    name="foto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Foto <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <FileUpload setFiles={galleryForm.setValue} files={galleryForm.watch("foto") as any} {...field} />
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
                    <LoadingButton type="submit" isLoading={isOnUpdateProcess ? isUpdatingGallery : isAddingGallery}>
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