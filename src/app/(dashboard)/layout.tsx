import Navbar from '@/components/layout/Navbar'; // Importando a nova Navbar
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      {/* Navbar fixa no topo */}
      <Navbar />
      
      {/* Área de conteúdo abaixo da navbar */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}