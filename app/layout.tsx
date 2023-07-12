import { Nunito } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import { ToasterProvider } from '@/providers/toast-provider';
import { ModalProvider } from '@/providers/modal-provider';

import './globals.css';
import { ThemeProvider } from '@/providers/theme-provider';

const nunito = Nunito({ subsets: ['latin'] });

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Created by zeta',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang='pt-BR'>
        <body className={nunito.className}>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
          >
            <ToasterProvider />
            <ModalProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
