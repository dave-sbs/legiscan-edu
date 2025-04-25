import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ReactQueryProviders from '@/lib/ReactQueryProviders';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500'] });

export const metadata: Metadata = {
  title: 'Sporos',
  description: 'Unified Government Information Database Search Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ReactQueryProviders>{children}</ReactQueryProviders>
        <Toaster />
      </body>
    </html>
  );
}
