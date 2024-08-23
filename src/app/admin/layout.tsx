"use client";
import React, { useState, ReactNode, createContext, useEffect } from 'react';
import Header from '@/components/Header/index';
import Sidebar from '@/components/Sidebar/index';
import ClientOnly from '@/components/Templates/ClientOnly';
import { usePathname } from 'next/navigation';
import Loader from '@/common/Loader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const defaultLayoutContext = createContext({
  title: '',
  setTitle: (title: string) => { },
  toggleLoader: (loading: boolean) => { }
})

export const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      throwOnError: true,
    },
  },
});

function DefaultLayout({ children }: { children: ReactNode, title: string }) {

  const [loading, setLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 0);
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState('');

  if (loading) {
    return <Loader />
  }

  const toggleLoader = (loading: boolean) => {
    setIsLoading(loading);
  }
  return (
    <defaultLayoutContext.Provider value={{ title, setTitle, toggleLoader }}>
      {isLoading && <TransparentLoader />}
      <QueryClientProvider client={queryClientInstance}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <div className="flex h-screen overflow-hidden">
            <ClientOnly>
              <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            </ClientOnly>
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
              <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              <main>
                <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                  <div className='rounded-sm  bg-white py-5 '>
                    <h1 className='text-lg font-semibold'>{title}</h1>
                  </div>
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </ defaultLayoutContext.Provider>
  );
};

const TransparentLoader = () => {
  return (
    <div>
      <div className="flex fixed inset-0 z-999 items-center justify-center bg-black/25">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    </div>
  )
}

export default DefaultLayout;
