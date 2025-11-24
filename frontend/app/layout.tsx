import type { Metadata } from 'next';
import { AppQueryClientProvider } from '@/app/providers/query-client';
import { Nav } from '@/app/(shell)/Nav';
import './globals.css';

export const metadata: Metadata = {
  title: 'Expenses Dashboard',
  description: 'Finance reviewer dashboard for Chapter 6 Day 1',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AppQueryClientProvider>
          <Nav />
          <main>{children}</main>
        </AppQueryClientProvider>
      </body>
    </html>
  );
}
