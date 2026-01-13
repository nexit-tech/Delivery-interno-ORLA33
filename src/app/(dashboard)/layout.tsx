'use client';

import Navbar from '@/components/layout/Navbar';
// CORREÇÃO AQUI: Removemos o "/layout" do caminho
import AdminBottomNav from '@/components/AdminBottomNav'; 
import styles from './layout.module.css';
import AuthGuard from '@/components/AuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedTypes={['admin']}> 
      <div className={styles.layout}>
        {/* Navbar Superior (Desktop) */}
        <div className={styles.desktopNav}>
          <Navbar />
        </div>

        <main className={styles.mainContent}>
          {children}
        </main>

        {/* Navbar Inferior (Mobile) */}
        <AdminBottomNav />
      </div>
    </AuthGuard>
  );
}