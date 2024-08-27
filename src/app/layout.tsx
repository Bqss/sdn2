import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '@/css/satoshi.css';
import '@/css/style.css';
import { Toaster } from "@/components/ui/sonner"


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SDN 2 Tamanharjo",
  description: "Website resmi SDN 2 Tamanharjo",
  abstract: "Merupakan website resmi dari SDN 2 Tamanharjo",
  keywords: ["SDN 2 Tamanharjo", "website", "resmi","profile"],
  category: "Education, School, Profile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className + ' min-h-screen antialiased'}>
          {children}
      </body>
      <Toaster toastOptions={{
        classNames: {
          success: 'bg-green-500',
          error: 'bg-red-500',
          warning: 'bg-yellow-500',
          info: 'bg-blue-500'
        }
      }} />
    </html>
  );
}

