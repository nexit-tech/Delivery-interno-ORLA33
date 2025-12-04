import type { Metadata } from "next";
import { Montserrat } from "next/font/google"; 
import "./globals.css";

// Configurando a fonte com pesos comuns (400, 600, 700)
const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Gestor de Pedidos",
  description: "Sistema de gerenciamento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      {/* A classe aqui aplica a fonte no site todo */}
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}