import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { SidebarLayout } from "./sidebar-layout";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  title: "Pukis Dongeng Sunda",
  description: "Hiji Website anu Eusina Dongeng Sunda",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="su" className={poppins.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Caveat:wght@400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-poppins min-h-screen`}
      >
        <SidebarLayout>{children}</SidebarLayout>
        <Toaster />
      </body>
    </html>
  );
}
