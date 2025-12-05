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
  title: "Delivery interno - Orla33",
  description: "Sistema de delivery interno para parceiros Orla33",
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