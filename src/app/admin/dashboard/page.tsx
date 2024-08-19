"use client";
import { useSetTitle } from '@/hooks/useSetTitle';
import React from 'react';


function Page() {
  useSetTitle('Dashboard');
  return (
    <>
      <div className='rounded-sm border border-stroke bg-white py-5 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark'>
        <h2 className='text-lg font-semibold'>Welcome, Administrator</h2>
      </div>
    </>
  );
};


export default Page;
