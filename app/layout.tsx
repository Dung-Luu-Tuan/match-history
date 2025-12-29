import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TFT Match History',
  description: 'View your Teamfight Tactics match history',
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

