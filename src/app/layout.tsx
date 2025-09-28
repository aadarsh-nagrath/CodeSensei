import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { LoginModalProvider } from "@/lib/login-modal-context";
import GlobalLoginModal from "@/app/components/GlobalLoginModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeSensei",
  description: "GenAI DSA coding challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoginModalProvider>
          {children}
          <GlobalLoginModal />
        </LoginModalProvider>
        <Toaster />
      </body>
    </html>
  );
}
