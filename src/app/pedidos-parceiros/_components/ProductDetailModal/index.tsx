'use client';

import { useState, useEffect } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { Product } from '@/types';
import styles from './styles.module.css';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (qty: number, obs: string) => void;
  product: Product | null;
  initialQty: number;
  initialObs: string;
}

export default function ProductDetailModal({ 
  isOpen, onClose, onConfirm, product, initialQty, initialObs 
}: ProductDetailModalProps) {
  const [qty, setQty] = useState(1);
  const [obs, setObs] = useState('');

  // Reseta ou carrega dados quando o produto muda
  useEffect(() => {
    if (isOpen && product) {
      setQty(initialQty > 0 ? initialQty : 1);
      setObs(initialObs || '');
    }
  }, [isOpen, product, initialQty, initialObs]);

  if (!isOpen || !product) return null;

  const handleIncrement = () => setQty(prev => prev + 1);
  const handleDecrement = () => setQty(prev => Math.max(0, prev - 1));

  const handleConfirm = () => {
    onConfirm(qty, obs);
    onClose();
  };

  const totalPrice = product.price * qty;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        <div className={styles.header}>
          <h3 className={styles.title}>{product.name}</h3>
          <button onClick={onClose} className={styles.closeBtn}><X size={24} /></button>
        </div>

        <div className={styles.body}>
          <p className={styles.description}>
            {product.category} • <span className={styles.priceUnit}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </span>
          </p>

          <div className={styles.controlGroup}>
            <label>Quantidade</label>
            <div className={styles.qtyControl}>
              <button 
                className={styles.qtyBtn} 
                onClick={handleDecrement}
                disabled={qty === 0}
              >
                <Minus size={20} />
              </button>
              <span className={styles.qtyValue}>{qty}</span>
              <button 
                className={`${styles.qtyBtn} ${styles.addBtn}`} 
                onClick={handleIncrement}
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <label>Observação (Opcional)</label>
            <textarea 
              className={styles.textarea}
              placeholder="Ex: Sem cebola, capricha no molho..."
              value={obs}
              onChange={(e) => setObs(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button 
            className={styles.confirmBtn} 
            onClick={handleConfirm}
            disabled={qty === 0 && initialQty === 0} // Desabilita se for 0 e já não tinha nada
          >
            {qty === 0 ? 'Remover do Carrinho' : (
              <>
                Adicionar
                <span className={styles.btnPrice}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
                </span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}