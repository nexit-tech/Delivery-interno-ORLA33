'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedTypes: ('admin' | 'partner')[]; // Quem pode entrar aqui?
}

export default function AuthGuard({ children, allowedTypes }: AuthGuardProps) {
  const { userType, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Se ainda está carregando o localStorage, não faz nada
    if (isLoading) return;

    // 2. Se não tem usuário logado -> Manda pro Login
    if (!userType) {
      router.replace('/login');
      return;
    }

    // 3. Se tem usuário, mas o tipo dele não é permitido nessa rota
    if (!allowedTypes.includes(userType)) {
      // Se tentou entrar em área de Admin mas é Partner -> manda pra área de Partner
      if (userType === 'partner') {
        router.replace('/pedidos-parceiros');
      } 
      // Se tentou entrar em área de Partner mas é Admin -> manda pra área de Admin
      else if (userType === 'admin') {
        router.replace('/pedidos');
      }
    }
  }, [userType, isLoading, router, allowedTypes]);

  // Enquanto carrega ou verifica, mostra um loading bonito
  if (isLoading || !userType || !allowedTypes.includes(userType)) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f2f4f7'
      }}>
        <Loader2 className="animate-spin" size={48} color="#ea1d2c" />
      </div>
    );
  }

  // Se passou por tudo, renderiza a página
  return <>{children}</>;
}