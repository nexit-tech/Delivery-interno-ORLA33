'use client'; // Transformamos em Client Component para usar o Guard

import Navbar from '@/components/layout/Navbar';
import styles from './layout.module.css';
import AuthGuard from '@/components/AuthGuard'; // Importe o Guard

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedTypes={['admin']}> 
      <div className={styles.layout}>
        <Navbar />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}