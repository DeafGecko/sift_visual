'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Inter } from 'next/font/google';
import Sidebar from './components/Sidebar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`} suppressHydrationWarning>
        <QueryClientProvider client={queryClient}>
          <div className="flex">
            <Sidebar />
            <main className="ml-56 flex-1 min-h-screen">
              {children}
            </main>
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
