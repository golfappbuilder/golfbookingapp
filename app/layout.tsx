import type { Metadata } from 'next';
import { Inter, Pacifico } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });
const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pacifico',
});

export const metadata: Metadata = {
  title: 'Breakfast Ball - Book Your Tee Time',
  description: 'Book tee times at the best golf courses near you',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${pacifico.variable}`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-masters-green text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-masters-green-light">
              &copy; {new Date().getFullYear()} Breakfast Ball. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
