'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Inter } from 'next/font/google';
import Sidebar from './components/Sidebar';
import LearningLab from './components/LearningLab';
import SettingsApplier from './components/SettingsApplier';
import AccessibilityProvider from './components/AccessibilityProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`} suppressHydrationWarning>
        <QueryClientProvider client={queryClient}>
          <AccessibilityProvider>
            <div className="flex">
              <Sidebar />
              <main
                id="main-content"
                tabIndex={-1}
                className="ml-56 flex-1 min-h-screen"
                aria-label="Main content"
              >
                {children}
              </main>
            </div>
            <LearningLab />
            <SettingsApplier />
          </AccessibilityProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
