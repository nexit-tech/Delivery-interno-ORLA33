import { Order } from '@/types';
import { Clock, User, CheckCircle, ArrowRight, Play, XCircle } from 'lucide-react';
import styles from './styles.module.css';

interface OrderCardProps {
  order: Order;
  onAdvance: (id: string) => void;
  onReject?: (id: string) => void; // Nova prop opcional
}

export default function OrderCard({ order, onAdvance, onReject }: OrderCardProps) {
  
  const time = new Date(order.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // Função para evitar abrir o modal ao clicar nos botões
  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
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
        
        <div className={styles.actions}>
          {/* Ações para PENDENTE: Recusar e Aceitar */}
          {order.status === 'PENDING' && (
            <>
              {onReject && (
                <button 
                  onClick={(e) => handleAction(e, () => onReject(order.id))} 
                  className={`${styles.btn} ${styles.btnReject}`}
                  title="Recusar Pedido"
                >
                  <XCircle size={16} /> Recusar
                </button>
              )}
              <button 
                onClick={(e) => handleAction(e, () => onAdvance(order.id))} 
                className={`${styles.btn} ${styles.btnAccept}`}
                title="Aceitar Pedido"
              >
                Aceitar <Play size={16} />
              </button>
            </>
          )}

          {/* Ações para EM PREPARO */}
          {order.status === 'PROCESSING' && (
            <button 
              onClick={(e) => handleAction(e, () => onAdvance(order.id))} 
              className={`${styles.btn} ${styles.btnAdvance}`}
            >
              Pronto <ArrowRight size={16} />
            </button>
          )}

          {/* Ações para PRONTO */}
          {order.status === 'READY' && (
            <button 
              onClick={(e) => handleAction(e, () => onAdvance(order.id))} 
              className={`${styles.btn} ${styles.btnFinish}`}
            >
              Concluir <CheckCircle size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}