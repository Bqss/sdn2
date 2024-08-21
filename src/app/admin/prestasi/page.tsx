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
import { PrestasiService } from "@/services/prestasi";
import { Select } from "@/components/ui/select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function Page() {
  useSetTitle("Prestasi");

  const [isOnUpdateProcess, setIsOnUpdateProcess] = useState(false);
  const prestasiSchema = yup.object({
    id: yup.string().nullable(),
    foto: yup.mixed().required("Foto tidak boleh kosong"),
    judul: yup.string().required("Judul tidak boleh kosong"),
    skala: yup.string().required("Skala prestasi tidak boleh kosong"),
    peraih: yup.string().required("Peraih tidak boleh kosong"),
    penyelenggara: yup.string().required("Penyelenggara tidak boleh kosong")
  });

  const { toggleLoader } = useDashboardLayoutContext();
  const [isOpenPrestasiModal, setIsOpenPrestasiModal] = useState(false);

  const { data: detailPrestasi, mutateAsync: getDetailPrestasi } = useMutation({
    mutationFn: PrestasiService.getPrestasiById,
    mutationKey: ["detailPrestasi"],
  });

  const { mutateAsync: deletePrestasi } = useMutation({
    mutationFn: PrestasiService.deletePrestasi,
  });

  const { isPending: isAddingPrestasi, mutateAsync: addPrestasi } = useMutation({
    mutationFn: PrestasiService.tambahPrestasi,
  });

  const { isPending: isUpdatePrestasi, mutateAsync: updatePrestasi } = useMutation({
    mutationFn: PrestasiService.updatePrestasi,
  });

  const prestasiForm = useForm({
    mode: "onChange",
    resolver: yupResolver(prestasiSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      if (isOnUpdateProcess) {
        const { id, ...restData } = data;
        const result = await updatePrestasi({ id: data.id, payload: restData });
        toast.success(result.message);
        queryClientInstance.invalidateQueries({
          queryKey: ["prestasi"],
        });
        setIsOnUpdateProcess(false);
        setIsOpenPrestasiModal(false);
        prestasiForm.reset();
        return;


      } else {
        const { id, ...restData } = data;
        const result = await addPrestasi(restData);
        toast.success(result.message);
        queryClientInstance.invalidateQueries({
          queryKey: ["prestasi"],
        });
        setIsOpenPrestasiModal(false);
        prestasiForm.reset();

      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      prestasiForm.reset();
    }
    setIsOnUpdateProcess(false);
    setIsOpenPrestasiModal(prev => !prev);
  }

  const handleClickEdit = async (id: string) => {
    toggleLoader(true);
    try {
      const data = await getDetailPrestasi(id);
      const { created_at, ...restData } = data.data;
      prestasiForm.reset(restData);
      prestasiForm.setValue("id", data.data.id);
      queryClientInstance.invalidateQueries({
        queryKey: ["gallery"],
      });
      setIsOnUpdateProcess(true);
      setIsOpenPrestasiModal(true);
    } catch (err: any) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      toggleLoader(false);
    }
  }

  const handleClickDelete = async (id: string) => {
    toggleLoader(true);
    try {
      await deletePrestasi(id);
      queryClientInstance.invalidateQueries({
        queryKey: ["prestasi"],
      });
      toast.success("Data berhasil dihapus");
    } catch (err) {
      toast.error("Data gagal dihapus");
    } finally {
      toggleLoader(false);
    }
  }
  return (
    <Card className='py-5 text-sm'>
      <CardContent>
        <div className="flex items-center justify-end mb-4">
          <Dialog onOpenChange={handleOpenChange} open={isOpenPrestasiModal}>
            <DialogTrigger className='bg-black text-white px-5 py-2 rounded-md hover:bg-black/80'>Tambahkan Prestasi</DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle >{!isOnUpdateProcess ? "Tambahkan Prestasi" : "Edit Prestasi"}</DialogTitle>
              </DialogHeader>
              <Form {...prestasiForm}>
                <form onSubmit={prestasiForm.handleSubmit(onSubmit)} className=" mt-3 flex flex-col gap-3">
                  <FormField
                    control={prestasiForm.control}
                    name="judul"
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
                    name="skala"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skala Prestasi <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih skala prestasi" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="internasional">Internasional</SelectItem>
                            <SelectItem value="nasional">Nasional</SelectItem>
                            <SelectItem value="provinsi">Provinsi</SelectItem>
                            <SelectItem value="kabupaten">Kabupaten</SelectItem>
                            <SelectItem value="kecamatan">Kecamatan</SelectItem>
                            <SelectItem value="desa">Desa</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={prestasiForm.control}
                    name="foto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Foto <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <FileUpload maxSize={2} accept="image/*"  setFiles={prestasiForm.setValue} files={prestasiForm.watch("foto") as any} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={prestasiForm.control}
                    name="peraih"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peraih <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan peraih" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={prestasiForm.control}
                    name="penyelenggara"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Penyelenggara <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan penyelenggara" {...field} />
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
                    <LoadingButton type="submit" isLoading={isOnUpdateProcess ? isUpdatePrestasi : isAddingPrestasi}>
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