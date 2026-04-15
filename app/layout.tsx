import "./globals.css";
import type { Metadata } from "next";
import { Almarai, Nunito } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "@/components/ui/toaster";
import LocalStorageGuard from "@/components/LocalStorageGuard";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Ni Hao Now",
  description: "Ni Hao Now",
  icons: {
    icon: [
      { url: "/four.ico" },
      { url: "/six.ico" },
      { url: "/two.ico" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${almarai.variable} ${nunito.variable} ${nunito.className} font-sans`} suppressHydrationWarning={true}>
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
