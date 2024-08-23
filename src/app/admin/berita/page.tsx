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
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Page() {
  useSetTitle('Berita');
  const router = useRouter();
  const { toggleLoader } = useDashboardLayoutContext();
  const { isPending: isGettingBeritaDetail, data: detailBerita, mutateAsync: getDetailBerita } = useMutation({
    mutationFn: NewsService.getNewsById,
    mutationKey: ["detailSlideshow"],
  });

  const { isPending: isDeletingNews, mutateAsync: deleteNews } = useMutation({
    mutationFn: NewsService.deleteNews,
  });



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

  const handleClickEdit = async (id: string) => {
    router.push(`/admin/berita/${id}/edit`);
  }


  return (
    <Card className='py-5 text-sm'>
      <CardContent>
        <div className="flex items-center justify-end mb-4">
          <Button onClick={() => router.push("/admin/berita/tambah")}>
            Tambah berita
          </Button>
        </div>
        <div>
          <Datatable handleDelete={handleClickDelete} handleEdit={handleClickEdit} />
        </div>
      </CardContent>
    </Card>
  )
}