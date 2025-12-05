import { Order } from '@/types';
import { Clock, User, CheckCircle, ArrowRight, Play, Trash2 } from 'lucide-react';
import styles from './styles.module.css';

interface OrderCardProps {
  order: Order;
  onAdvance: (id: string) => void;
  onReject?: (id: string) => void; // Serve para Recusar (Pendente) ou Cancelar (Preparo)
}

export default function OrderCard({ order, onAdvance, onReject }: OrderCardProps) {
  
  const time = new Date(order.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

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
          {/* --- PENDENTE (Lixeira Soft + Aceitar) --- */}
          {order.status === 'PENDING' && (
            <>
              {onReject && (
                <button 
                  onClick={(e) => handleAction(e, () => onReject(order.id))} 
                  className={`${styles.btn} ${styles.btnSoftReject}`}
                  title="Recusar Pedido"
                >
                  <Trash2 size={20} />
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

          {/* --- EM PREPARO (Lixeira Soft + Pronto) --- */}
          {order.status === 'PROCESSING' && (
            <>
              {onReject && (
                <button 
                  onClick={(e) => handleAction(e, () => onReject(order.id))} 
                  className={`${styles.btn} ${styles.btnSoftReject}`}
                  title="Cancelar Pedido"
                >
                  <Trash2 size={20} />
                </button>
              )}
              <button 
                onClick={(e) => handleAction(e, () => onAdvance(order.id))} 
                className={`${styles.btn} ${styles.btnAdvance}`}
              >
                Pronto <ArrowRight size={16} />
              </button>
            </>
          )}

          {/* --- PRONTO --- */}
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