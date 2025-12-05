import type { Metadata } from "next";
import { Montserrat } from "next/font/google"; 
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext"; // <--- Importe o Contexto

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Portal Parceiros",
  description: "Sistema de gerenciamento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={montserrat.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}