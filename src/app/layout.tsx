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
  keywords: ["SDN 2 Tamanharjo", "website", "resmi", "profile"],
  category: "Education, School, Profile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="08Hf3rcvT3tP5goIVLkEn1MS1aKHEibdBMGVSF7sTJk" />
      </head>
      <body className={inter.className + ' min-h-screen antialiased'}>
        {children}
      </body>
      <Toaster toastOptions={{
        classNames: {
          success: 'bg-green-500 text-white',
          error: 'bg-red-500',
          warning: 'bg-yellow-500',
          info: 'bg-blue-500'
        }
      }} />
    </html>
  );
}

