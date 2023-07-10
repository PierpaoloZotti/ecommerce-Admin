import { Nunito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { ToasterProvider } from "@/providers/toast-provider";
import { ModalProvider } from "@/providers/modal-provider";

import "./globals.css";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata = {
  title: "Admin Dashboard",
  description: "Created by zeta",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang='pt-BR'>
        <body className={nunito.className}>
          <ToasterProvider />
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
