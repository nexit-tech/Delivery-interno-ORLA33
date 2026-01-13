'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Package, Users, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './styles.module.css';

export default function AdminBottomNav() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Pedidos', href: '/pedidos', icon: ShoppingBag },
    { name: 'Produtos', href: '/produtos', icon: Package },
    { name: 'Parceiros', href: '/parceiros', icon: Users },
    { name: 'Financeiro', href: '/financeiro', icon: BarChart3 },
  ];

  return (
    <nav className={styles.navbar}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);
        
        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className={styles.label}>{item.name}</span>
          </Link>
        );
      })}
      {/* Botão de Sair no Mobile */}
      <button onClick={logout} className={styles.navItem}>
        <LogOut size={24} color="#d92d20" />
        <span className={styles.label} style={{color: '#d92d20'}}>Sair</span>
      </button>
    </nav>
  );
}