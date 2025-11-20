import type { Metadata } from 'next';
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
      <body>{children}</body>
    </html>
  );
}
