'use client';

import { X, Calendar, User, Package } from 'lucide-react';
import styles from './styles.module.css';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any; // Recebe o objeto do pedido selecionado
}

export default function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        <div className={styles.header}>
          <div>
            <span className={styles.labelId}>PEDIDO #{order.id}</span>
            <span className={styles.date}>
              {new Date(order.created_at).toLocaleDateString('pt-BR')} às {new Date(order.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
          <button onClick={onClose} className={styles.closeBtn}><X size={24} /></button>
        </div>

        <div className={styles.body}>
          <div className={styles.statusRow}>
            <span className={styles.statusLabel}>Status:</span>
            <span className={styles.statusValue}>Concluído</span>
          </div>

          <div className={styles.divider} />

          <h4 className={styles.sectionTitle}>Itens do Pedido</h4>
          <ul className={styles.itemsList}>
            {order.items.map((item: any, idx: number) => (
              <li key={idx} className={styles.item}>
                <div className={styles.itemInfo}>
                  <span className={styles.qty}>{item.quantity}x</span>
                  <span className={styles.name}>{item.name}</span>
                </div>
                {item.price && (
                  <span className={styles.itemPrice}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.footer}>
          <span className={styles.totalLabel}>Valor Total</span>
          <span className={styles.totalValue}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
          </span>
        </div>

      </div>
    </div>
  );
}