'use client';

import { ArrowRight, Loader2 } from 'lucide-react';
import styles from '../page.module.css';

interface CartBarProps {
  total: number;
  itemCount: number;
  onCheckout: () => void;
  loading: boolean;
}

export default function CartBar({ total, itemCount, onCheckout, loading }: CartBarProps) {
  if (itemCount === 0) return null;

  return (
    <div className={styles.cartBar}>
      <div className={styles.cartInfo}>
        <span className={styles.cartLabel}>Total ({itemCount} itens)</span>
        <span className={styles.cartTotal}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
        </span>
      </div>
      
      <button className={styles.checkoutBtn} onClick={onCheckout} disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : <>Confirmar <ArrowRight size={18} /></>}
      </button>
    </div>
  );
}