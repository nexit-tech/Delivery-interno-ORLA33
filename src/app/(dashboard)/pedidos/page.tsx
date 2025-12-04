import Board from './_components/Board';
import styles from './page.module.css';
import { Order } from '@/types';

// ... (Mantenha o seu array MOCK_ORDERS aqui como estava) ...
const MOCK_ORDERS: Order[] = [
  // ... seus dados mockados
  { 
      id: '1024', 
      partnerName: 'Quiosque do Sol', 
      date: new Date().toISOString(), 
      total: 89.90, 
      status: 'PENDING',
      items: [
        { name: 'X-Bacon Artesanal', quantity: 2, observation: 'Sem cebola' },
        { name: 'Coca-Cola Zero', quantity: 2 }
      ]
    },
    // ... outros
];

export default function PedidosPage() {
  return (
    <main className={styles.container}>
      
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Monitor de Pedidos</h1>
          <p className={styles.subtitle}>Acompanhe o fluxo de produção em tempo real.</p>
        </div>
        
        {/* O BOTÃO FOI REMOVIDO DAQUI */}
        
      </header>

      <section className={styles.content}>
        <Board initialOrders={MOCK_ORDERS} />
      </section>

    </main>
  );
}