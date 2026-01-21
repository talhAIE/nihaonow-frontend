import "./globals.css";
import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "@/components/ui/toaster";
import LocalStorageGuard from "@/components/LocalStorageGuard";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
});

export const metadata: Metadata = {
  title: "Ni hao now",
  description: "Ni hao now",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${almarai.variable} ${almarai.className} font-sans`} suppressHydrationWarning={true}>
        <AppProvider>
          <LocalStorageGuard>
            {children}
          </LocalStorageGuard>
        </AppProvider>
        <Toaster />
      </body>
    </html>
  );
}