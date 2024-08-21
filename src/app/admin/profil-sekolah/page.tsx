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


const ProfileSchema = yup.object({
  profile_singkat: yup.string().required('Profil Singkat Sekolah tidak boleh kosong'),
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
      setValue('profile_singkat', data.profile_singkat);
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
              <div>
                <label className="mb-5 block" >Profil Singkat Sekolah <span className="text-red-500">*</span></label>
                <Ckeditor
                  id="text-case"
                  data={watch('profile_singkat')}
                  className={errors.profile_singkat ? 'border-red-500' : ''}
                  onChange={(event, editor) => {
                    setValue('profile_singkat', editor.getData());
                  }}
                />
                {errors.profile_singkat && <span className="text-red-500 text-xs mt-1">{errors.profile_singkat.message}</span>}
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