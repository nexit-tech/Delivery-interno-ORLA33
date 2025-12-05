'use client';

import { CheckCircle } from 'lucide-react';
import styles from './styles.module.css';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.iconContainer}>
          <CheckCircle size={48} strokeWidth={2.5} />
        </div>
        
        <h2 className={styles.title}>Pedido Enviado!</h2>
        <p className={styles.message}>
          Recebemos seu pedido com sucesso.<br/>
          Já vamos começar a preparar.
        </p>

        <button className={styles.button} onClick={onClose}>
          Maravilha!
        </button>
      </div>
    </div>
  );
}