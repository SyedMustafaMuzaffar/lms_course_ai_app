import type { Metadata } from "next";
import { Inter } from "next/font/google"
import './globals.css';
import { AuthProvider } from '@/lib/AuthContext';
import { Toaster } from 'react-hot-toast';
import AIChatAssistant from '@/components/AIChatAssistant';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LMS Pro - Learning Management System',
  description: 'A modern platform for online education',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-center" />
          <AIChatAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}
