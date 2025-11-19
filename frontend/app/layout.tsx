import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Expenses Dashboard',
  description: 'Finance reviewer dashboard for Chapter 6 Day 1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
