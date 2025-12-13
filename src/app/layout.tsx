import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProviderWrapper } from "@/components/auth/SessionProvider";
import { Toaster } from "@/components/ui/sonner";
import { AuthModal } from "@/components/auth/AuthModal";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AviatorTutor - Flight Instruction Platform",
  description: "Find experienced aviation instructors worldwide. Book 1-on-1 classes, group sessions, and get certified.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper>
          {children}
          <Toaster />
          <Suspense fallback={<div />}>
            <AuthModal />
          </Suspense>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
