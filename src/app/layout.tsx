import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProviderWrapper } from "@/components/auth/SessionProvider";
import { AuthModal } from "@/components/auth/AuthModal";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AviatorTutor - World Class Aviation Training",
  description: "Find experienced aviation instructors worldwide. Book 1-on-1 classes, group sessions, and get certified.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper>
          {children}
          <Suspense fallback={<div />}>
            <AuthModal />
          </Suspense>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
