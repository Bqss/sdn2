"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import LoadingButton from '@/components/Atoms/LoadingButton';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Image from 'next/image';


const SignIn: React.FC = () => {

  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isShowPassword, setIsOpenPassword] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const response = await signIn('credentials', { email, password, redirect: false });


    
    if (response?.ok) {
      router.push('/admin/dashboard');
    } else {
      setIsPending(false);
      if(response?.error == "Invalid password"){
        toast.error('Password yang anda masukkan salah');
      }else{
        toast.error('User tidak ditemukan');
      }
    }
  }
  return (
    <div className='h-screen flex items-center'>
      <div className="rounded-sm border w-11/12 mx-auto max-w-5xl border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-17.5 px-26 text-center">
              <Link href={"/"} className="text-3xl font-bold">
                <Image src={"/images/logo-sdn.png"} alt='logo tutwuri' width={300} height={300}  />
              </Link>
            </div>
          </div>
          <div className="w-full xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 text-sm block font-medium">Admin Panel SDN 2 Tamanharjo</span>
              <h2 className="mb-9 text-xl font-bold text-black dark:text-white sm:text-2xl">Sign In to Admin Panel</h2>
              <form method="post" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-2.5 text-sm block font-medium text-black dark:text-white">Email</label>
                  <div className="relative">
                    <Input name='email' type='email' placeholder='Enter your email' />
                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                          // SVG path data here
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="mb-2.5 text-sm block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <Input name='password' type={isShowPassword ? 'text' : 'password'} placeholder='6+ Characters, 1 Capital letter' />
                    <button type='button' className='absolute right-3 top-1/2 -translate-y-1/2' onClick={() => setIsOpenPassword(prev => !prev)}>
                      {isShowPassword ? (
                        <FaRegEyeSlash />
                      ) : (
                        <FaRegEye />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mb-5">
                  <LoadingButton type='submit' className='w-full' variant={"default"} isLoading={isPending}>
                    Sign In
                  </LoadingButton>
                  {/* <input
                    type="submit"
                    value="Sign In"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  /> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;