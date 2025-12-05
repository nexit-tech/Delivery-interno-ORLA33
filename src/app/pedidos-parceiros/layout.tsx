'use client';

import AuthGuard from '@/components/AuthGuard';

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Apenas 'partner' pode acessar qualquer coisa dentro de /pedidos-parceiros
    <AuthGuard allowedTypes={['partner']}>
      {children}
    </AuthGuard>
  );
}