'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Adicionei 'BarChart3'
import { LayoutDashboard, ShoppingBag, Users, Package, LogOut, Bell, BarChart3 } from 'lucide-react';
import styles from './styles.module.css';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: 'Monitor de Pedidos', href: '/pedidos', icon: ShoppingBag },
    { name: 'Produtos', href: '/produtos', icon: Package },
    { name: 'Parceiros', href: '/parceiros', icon: Users },
    { name: 'Financeiro', href: '/financeiro', icon: BarChart3 }, // <--- Novo Link
  ];

  // ... (o resto do código continua igual)
  return (
    <header className={styles.navbar}>
       {/* ... mantenha o conteúdo do return igual ... */}
       <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>B2B</div>
        <h1 className={styles.logoText}>Portal<span className={styles.highlight}>Parceiros</span></h1>
      </div>

      <nav className={styles.nav}>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          
          return (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`${styles.link} ${isActive ? styles.active : ''}`}
            >
              <Icon size={18} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.actions}>
        <button className={styles.iconBtn}>
          <Bell size={20} />
          <span className={styles.notificationDot}></span>
        </button>
        <div className={styles.divider}></div>
        <div className={styles.profile}>
          <div className={styles.avatar}>A</div>
          <span className={styles.profileName}>Admin</span>
        </div>
        <button className={styles.logoutBtn}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}