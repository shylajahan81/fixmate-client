import type { Metadata } from 'next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'FixMate — Smart Device & Home Appliance Repair Platform',
  description:
    'Book verified technicians for device and appliance repair with live job tracking and pay-after-completion.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-stone-50 text-slate-900 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}