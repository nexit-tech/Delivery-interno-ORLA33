'use client';

import { Order } from '@/types';
import { X, Clock, User, DollarSign, CheckCircle, ArrowRight, Play } from 'lucide-react';
import styles from './styles.module.css';

interface OrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onAdvance: (id: string) => void;
}

export default function OrderModal({ order, isOpen, onClose, onAdvance }: OrderModalProps) {
  if (!isOpen || !order) return null;

  const handleAdvance = () => {
    onAdvance(order.id);
    onClose(); // Fecha o modal após a ação
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        {/* Header do Modal */}
        <div className={styles.header}>
          <div>
            <span className={styles.labelId}>PEDIDO #{order.id}</span>
            <h2 className={styles.partnerName}>{order.partnerName}</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className={styles.body}>
          
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <Clock size={16} />
              <span>{new Date(order.date).toLocaleTimeString('pt-BR')}</span>
            </div>
            <div className={styles.infoItem}>
              <User size={16} />
              <span>Parceiro Verificado</span>
            </div>
          </div>

          <div className={styles.divider} />

          <h3 className={styles.sectionTitle}>Itens do Pedido</h3>
          <ul className={styles.itemsList}>
            {order.items.map((item, idx) => (
              <li key={idx} className={styles.item}>
                <div className={styles.itemMain}>
                  <span className={styles.qty}>{item.quantity}x</span>
                  <span className={styles.name}>{item.name}</span>
                </div>
                {item.observation && (
                  <p className={styles.obs}>Obs: {item.observation}</p>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer com Ações */}
        <div className={styles.footer}>
          <div className={styles.totalContainer}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
            </span>
          </div>

          {/* Botão de Ação Dinâmico */}
          {order.status === 'PENDING' && (
            <button onClick={handleAdvance} className={`${styles.actionBtn} ${styles.btnAccept}`}>
              Aceitar Pedido <Play size={18} />
            </button>
          )}
          {order.status === 'PROCESSING' && (
            <button onClick={handleAdvance} className={`${styles.actionBtn} ${styles.btnReady}`}>
              Marcar como Pronto <ArrowRight size={18} />
            </button>
          )}
          {order.status === 'READY' && (
            <button onClick={handleAdvance} className={`${styles.actionBtn} ${styles.btnFinish}`}>
              Concluir Entrega <CheckCircle size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}