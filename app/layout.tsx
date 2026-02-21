import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const danaFont = localFont({
  src: [
    {
      path: "../public/fonts/dana-regular.woff2",
      weight: "400",
    },
    {
      path: "../public/fonts/dana-extrabold.woff2",
      weight: "800",
    },
    {
      path: "../public/fonts/dana-black.woff2",
      weight: "900",
    },
    {
      path: "../public/fonts/dana-medium.woff2",
      weight: "500",
    },
  ],
  variable: "--font-dana",
});

export const metadata: Metadata = {
  title: "سالاریتو - محاسبه واریز حقوق",
  description: "پس کی این حقوق مارو می ریزن؟",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${danaFont.variable} font-dana antialiased dark`}>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
