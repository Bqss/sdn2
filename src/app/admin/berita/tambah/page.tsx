"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useSetTitle } from "@/hooks/useSetTitle";

import { Input } from "@/components/ui/input"
import { useState } from "react";
import * as yup from "yup";
import { queryClientInstance } from "../../layout";
import { useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useMutation } from "@tanstack/react-query";
import LoadingButton from "@/components/Atoms/LoadingButton";
import FileUpload from "@/components/Atoms/FileUpload";
import { Textarea } from "@/components/ui/textarea";

const Ckeditor = dynamic(() => import('@/components/Atoms/Ckeditor'), { ssr: false });
import { NewsService } from "@/services/news";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function Page() {
  useSetTitle('Tambah Berita');

  const router = useRouter();
  const slideshowSchema = yup.object({
    id: yup.string().nullable(),
    judul: yup.string().required("Judul harus diisi"),
    deskripsi: yup.string().required("Deskripsi "),
    content: yup.string().required("Content tidak boleh kosong"),
    thumbnail: yup.mixed().required("Thumbnail tidak boleh kosong")
  });


  const { isPending: isAddingNews, mutateAsync: addNews } = useMutation({
    mutationFn: NewsService.tambahBerita,
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

      const { id, ...restData } = data;
      const result = await addNews(restData);
      toast.success(result.message);  
      router.push("/admin/berita");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.message);
      }
    }
  }



  return (
    <Card className='py-5 text-sm'>
      <CardContent>

        <Form {...newsForm}>
          <form onSubmit={newsForm.handleSubmit(onSubmit)} className=" mt-3">
            <div className="flex flex-col gap-3 relative px-3">
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
                {newsForm.formState.errors.content && <small className="text-red-500 text-sm mt-1">{newsForm.formState.errors.content.message}</small>}
              </div>
            </div>
            <div className="flex justify-end items-center mt-4 gap-3 ">
              <Button variant={"secondary"} type="button" onClick={() => router.push("/admin/berita")}>
                <span>Cancel</span>
              </Button>
              <LoadingButton
                isLoading={isAddingNews}
                type="submit"
              >
                Tambah Berita
              </LoadingButton>
            </div>
          </form>
        </Form>


      </CardContent>
    </Card>
  )
}