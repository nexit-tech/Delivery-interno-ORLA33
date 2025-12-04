import { Order } from '@/types';
import { Clock, User, CheckCircle, ArrowRight, Play } from 'lucide-react';
import styles from './styles.module.css';

interface OrderCardProps {
  order: Order;
  onAdvance: (id: string) => void;
}

export default function OrderCard({ order, onAdvance }: OrderCardProps) {
  
  const time = new Date(order.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // Função auxiliar para evitar que o clique no botão abra o modal
  const handleButtonClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // <--- O SEGREDO ESTÁ AQUI! (Impede de abrir o modal)
    onAdvance(id);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.partnerName}>
          <User size={14} /> {order.partnerName}
        </span>
        <span className={styles.orderId}>#{order.id}</span>
      </div>

      <div className={styles.timeBadge}>
        <Clock size={12} /> {time}
      </div>

      <div className={styles.itemsList}>
        {order.items.map((item, index) => (
          <div key={index} className={styles.itemLine}>
            <span className={styles.quantity}>{item.quantity}x</span>
            <span className={styles.itemName}>{item.name}</span>
            {item.observation && <p className={styles.obs}>{item.observation}</p>}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.total}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
        </div>
        
        {/* Botões Atualizados com a trava de clique */}
        {order.status === 'PENDING' && (
          <button 
            onClick={(e) => handleButtonClick(e, order.id)} 
            className={`${styles.btn} ${styles.btnAccept}`}
          >
            Aceitar <Play size={16} />
          </button>
        )}

        {order.status === 'PROCESSING' && (
          <button 
            onClick={(e) => handleButtonClick(e, order.id)} 
            className={`${styles.btn} ${styles.btnAdvance}`}
          >
            Pronto <ArrowRight size={16} />
          </button>
        )}

        {order.status === 'READY' && (
          <button 
            onClick={(e) => handleButtonClick(e, order.id)} 
            className={`${styles.btn} ${styles.btnFinish}`}
          >
            Concluir <CheckCircle size={16} />
          </button>
        )}
      </div>
    </div>
  );
}