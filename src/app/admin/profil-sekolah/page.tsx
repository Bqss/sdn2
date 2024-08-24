"use client";
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { useSetTitle } from '@/hooks/useSetTitle';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { AxiosError } from 'axios';
const Ckeditor = dynamic(() => import('@/components/Atoms/Ckeditor'), { ssr: false });
import { useMutation, useQuery } from "@tanstack/react-query";
import { ProfileService } from '@/services/profile';
import LoadingButton from '@/components/Atoms/LoadingButton';
import { queryClientInstance } from '../layout';
import { Input } from '@/components/ui/input';
import FileUpload from '@/components/Atoms/FileUpload';


const ProfileSchema = yup.object({
  sambutan_kepsek: yup.string().required('Profil Singkat Sekolah tidak boleh kosong'),
  nama_kepsek: yup.string().required('Nama Kepala Sekolah tidak boleh kosong'),
  foto_kepsek: yup.mixed().required('Foto Kepala Sekolah tidak boleh kosong'),
  profile_lengkap: yup.string().required('Profil Lengkap Sekolah tidak boleh kosong'),
  visi: yup.string().required('Visi Sekolah tidak boleh kosong'),
  misi: yup.string().required('Misi Sekolah tidak boleh kosong'),
  tujuan: yup.string().required('Tujuan Sekolah tidak boleh kosong'),
  sejarah: yup.string().required('Sejarah Sekolah tidak boleh kosong'),
});

function Page() {

  useSetTitle('Profil Sekolah');

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: ProfileService.updateProfile,
  });

  const { isLoading, data } = useQuery({
    queryKey: ['profile'],
    queryFn: ProfileService.getProfile,
    select: (data) => data.data
  })

  const onSubmit = async (data: any) => {
    mutateAsync(data).then((data) => {
      toast.success(data.message);
      queryClientInstance.invalidateQueries({
        queryKey: ["profile"]
      })
    }).catch((error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    })
  }

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(ProfileSchema),
  });

  useEffect(() => {
    if (data) {
      setValue('sambutan_kepsek', data.sambutan_kepsek);
      setValue('nama_kepsek', data.nama_kepsek);
      setValue('foto_kepsek', data.foto_kepsek);
      setValue('profile_lengkap', data.profile_lengkap);
      setValue('visi', data.visi);
      setValue('misi', data.misi);
      setValue('tujuan', data.tujuan);
      setValue('sejarah', data.sejarah);
    }
  }, [data, setValue])


  return (
    <>
      <Card className='py-5 text-sm'>
        <CardContent>
          {isLoading ? <div>Loading...</div> : (
            <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
              <h3 className='text-base font-medium'>Kepala Sekolah</h3>
              <div className="border border-gray-400 p-4 flex flex-col gap-4 rounded-lg">
                <div>
                  <label className="mb-5 block" >Nama kepala sekolah <span className="text-red-500">*</span></label>
                  <Input name='nama_kepala_sekolah' value={watch("nama_kepsek")} onChange={(e) => setValue("nama_kepsek", e.target.value)} />
                  {errors.nama_kepsek && <span className="text-red-500 text-xs mt-2">{errors.nama_kepsek.message}</span>}
                </div>
                <div>
                  <label className="mb-5 block" >Sambutan Kepala Sekolah <span className="text-red-500">*</span></label>
                  <Ckeditor
                    id="text-case"
                    data={watch('sambutan_kepsek')}
                    className={errors.sambutan_kepsek ? 'border-red-500' : ''}
                    onChange={(event, editor) => {
                      setValue('sambutan_kepsek', editor.getData());
                    }}
                  />
                  {errors.sambutan_kepsek && <span className="text-red-500 text-xs mt-1">{errors.sambutan_kepsek.message}</span>}
                </div>
                <div>
                  <label className="mb-5 block" >Foto kepala sekolah <span className="text-red-500">*</span></label>
                  <FileUpload name='foto_kepsek' setFiles={setValue} files={watch("foto_kepsek") as any} accept='image/*' maxSize={2}  />
                  {errors.foto_kepsek && <span className="text-red-500 text-xs mt-2">{errors.foto_kepsek.message}</span>}
                </div>
              </div>
              <div>
                <label className="mb-5 block" >Profil Lengkap Sekolah <span className="text-red-500">*</span></label>
                <Ckeditor
                  id="text-case"
                  data={watch('profile_lengkap')}
                  className={errors.profile_lengkap ? 'border-red-500' : ''}
                  onChange={(event, editor) => {
                    setValue('profile_lengkap', editor.getData());
                  }}
                />
                {errors.profile_lengkap && <span className="text-red-500 text-xs mt-1">{errors.profile_lengkap.message}</span>}
              </div>
              <div>
                <label className="mb-5 block" >Visi Sekolah <span className="text-red-500">*</span></label>
                <Ckeditor
                  id="text-case"
                  data={watch('visi')}
                  className={errors.profile_singkat ? 'border-red-500' : '' + 'min-h-96'}
                  onChange={(event, editor) => {
                    setValue('visi', editor.getData());
                  }}
                />
                {errors.visi && <span className="text-red-500 text-xs mt-1">{errors.visi.message}</span>}
              </div>
              <div>
                <label className="mb-5 block" >Misi Sekolah <span className="text-red-500">*</span></label>
                <Ckeditor
                  id="text-case"
                  data={watch('misi')}
                  className={errors.profile_singkat ? 'border-red-500' : ''}
                  onChange={(event, editor) => {
                    setValue('misi', editor.getData());
                  }}
                />
                {errors.misi && <span className="text-red-500 text-xs mt-1">{errors.misi.message}</span>}
              </div>
              <div>
                <label className="mb-5 block" >Tujuan Sekolah <span className="text-red-500">*</span></label>
                <Ckeditor
                  id="text-case"
                  data={watch('tujuan')}
                  className={errors.tujuan ? 'border-red-500' : ''}
                  onChange={(event, editor) => {
                    setValue('tujuan', editor.getData());
                  }}
                />
                {errors.tujuan && <span className="text-red-500 text-xs mt-1">{errors.tujuan.message}</span>}
              </div>
              <div>
                <label className="mb-5 block" >Sejarah Sekolah <span className="text-red-500">*</span></label>
                <Ckeditor
                  id="text-case"
                  data={watch('sejarah')}
                  className={errors.profile_singkat ? 'border-red-500' : ''}
                  onChange={(event, editor) => {
                    setValue('sejarah', editor.getData());
                  }}
                />
                {errors.sejarah && <span className="text-red-500 text-xs mt-1">{errors.sejarah.message}</span>}
              </div>
              <div className="flex justify-end">
                <LoadingButton isLoading={isPending} type="submit">Simpan</LoadingButton>
              </div>
            </form>
          )}
          {/* )} */}
        </CardContent>
      </Card>
    </>
  );
}

export default Page;