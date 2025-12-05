'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardList, DollarSign, User } from 'lucide-react';
import styles from './styles.module.css';

export default function PartnerBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { 
      name: 'Início', 
      href: '/pedidos-parceiros', 
      icon: Home 
    },
    { 
      name: 'Pedidos', 
      href: '/pedidos-parceiros/meus-pedidos', 
      icon: ClipboardList 
    },
    { 
      name: 'Finanças', 
      href: '/pedidos-parceiros/financeiro', // Futuro
      icon: DollarSign 
    },
    { 
      name: 'Perfil', 
      href: '/pedidos-parceiros/perfil', // Futuro
      icon: User 
    }
  ];

  return (
    <nav className={styles.navbar}>
      {navItems.map((item) => {
        const Icon = item.icon;
        // Verifica se é a rota ativa
        const isActive = pathname === item.href;
        
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
    </nav>
  );
}