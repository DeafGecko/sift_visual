'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from './components/Sidebar';
import './globals.css';

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground" suppressHydrationWarning>
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
