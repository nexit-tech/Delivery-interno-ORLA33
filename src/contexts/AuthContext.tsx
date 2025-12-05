'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  userType: 'admin' | 'partner' | null;
  partnerId: string | null;
  partnerName: string | null;
  login: (type: 'admin' | 'partner', data?: any) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<'admin' | 'partner' | null>(null);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verifica se já tem login salvo ao carregar
  useEffect(() => {
    const storedType = localStorage.getItem('userType') as 'admin' | 'partner';
    const storedId = localStorage.getItem('partnerId');
    const storedName = localStorage.getItem('partnerName');

    if (storedType) {
      setUserType(storedType);
      if (storedType === 'partner') {
        setPartnerId(storedId);
        setPartnerName(storedName);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (type: 'admin' | 'partner', data?: any) => {
    localStorage.setItem('userType', type);
    setUserType(type);

    if (type === 'partner' && data) {
      localStorage.setItem('partnerId', data.id);
      localStorage.setItem('partnerName', data.name);
      setPartnerId(data.id);
      setPartnerName(data.name);
      router.push('/pedidos-parceiros');
    } else {
      router.push('/pedidos'); // Admin
    }
  };

  const logout = () => {
    localStorage.clear();
    setUserType(null);
    setPartnerId(null);
    setPartnerName(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ userType, partnerId, partnerName, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);