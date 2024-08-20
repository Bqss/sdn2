"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useSetTitle } from "@/hooks/useSetTitle";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

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
import { SlideshowService } from "@/services/slideshow";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMutation } from "@tanstack/react-query";
import LoadingButton from "@/components/Atoms/LoadingButton";
import FileUpload from "@/components/Atoms/FileUpload";
import { Textarea } from "@/components/ui/textarea";
import Datatable from "./datatable";

export default function Page() {
  useSetTitle('Slideshow');

  const [isOnUpdateProcess, setIsOnUpdateProcess] = useState(false);
  const slideshowSchema = yup.object({
    id: yup.string().nullable(),
    judul: yup.string().required(),
    deskripsi: yup.string().required(),
    is_active: yup.mixed().required(),
    order: yup.number().required(),
    gambar: yup.mixed().required(),
  });

  const { toggleLoader } = useDashboardLayoutContext();
  const [isOpenPegawaiModal, setIsOpenPegawaiModal] = useState(false);
 
  const { mutateAsync: getDetailSlideshow } = useMutation({
    mutationFn: SlideshowService.getSlideshowById,
    mutationKey: ["detailSlideshow"],
  });

  const {  mutateAsync: deletePegawai } = useMutation({
    mutationFn: SlideshowService.deleteSlideshow,
  });

  const { isPending: isAddingSlideshow, mutateAsync: addSlideshow } = useMutation({
    mutationFn: SlideshowService.tambahSlideshow,
  });

  const { isPending: isUpdateSlideshow, mutateAsync: updateSlideshow } = useMutation({
    mutationFn: SlideshowService.updateSlideshow,
  });

  const slideshowForm = useForm({
    mode: "onChange",
    resolver: yupResolver(slideshowSchema),
    defaultValues: {
      id: null,
      judul: "",
      deskripsi: "",
      is_active: "1",
      order: 0,
      gambar: undefined,
    }
  });

  const onSubmit = async (data: any) => {
    try {
      if (isOnUpdateProcess) {
        const { id, ...restData } = data;
        await updateSlideshow({ id: data.id, payload: restData });
        alert("Data slideshow berhasil diupdate");
        queryClientInstance.invalidateQueries({
          queryKey: ["slideshow"],
        });
        setIsOpenPegawaiModal(false);
        slideshowForm.reset();
        return;
      } else {
        const { id, ...restData } = data;
        await addSlideshow(restData);
        alert("Data slideshow berhasil ditambahkan");
        queryClientInstance.invalidateQueries({
          queryKey: ["slideshow"],
        });
        setIsOpenPegawaiModal(false);
        slideshowForm.reset();
      }
    } catch (err) {
      alert("Data gagal ditambahkan");
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      slideshowForm.reset({
        deskripsi: "",
        gambar: undefined,
        judul: "",
        is_active: "1",
        order: 0,
      });
    }
    setIsOnUpdateProcess(false);
    setIsOpenPegawaiModal(prev => !prev);
  }

  const handleClickEdit = async (id: string) => {
    toggleLoader(true);
    try {
      const data = await getDetailSlideshow(id);
      slideshowForm.reset(data.data);
      slideshowForm.setValue("id", data.data.id);
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
          queryKey: ["slideshow"],
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
          <Dialog onOpenChange={handleOpenChange} open={isOpenPegawaiModal}>
            <DialogTrigger className='bg-black text-white px-5 py-2 rounded-md hover:bg-black/80'>Tambahkan slideshow</DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle >{!isOnUpdateProcess ? "Tambahkan slideshow" : "Edit slideshow"}</DialogTitle>
              </DialogHeader>
              <Form {...slideshowForm}>
                <form onSubmit={slideshowForm.handleSubmit(onSubmit)} className=" mt-3 flex flex-col gap-3">
                  <FormField
                    control={slideshowForm.control}
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
                    control={slideshowForm.control}
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
                    control={slideshowForm.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Masukkan deskripsi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={slideshowForm.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Is Active <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex gap-5 mt-4"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="1" />
                              </FormControl>
                              <FormLabel className="font-normal">Active</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="0" />
                              </FormControl>
                              <FormLabel className="font-normal">Inactive</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={slideshowForm.control}
                    name="gambar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gambar <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <FileUpload setFiles={slideshowForm.setValue} files={slideshowForm.watch("gambar") as any} {...field} />
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
                    <LoadingButton type="submit" isLoading={isOnUpdateProcess ? isUpdateSlideshow : isAddingSlideshow}>
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