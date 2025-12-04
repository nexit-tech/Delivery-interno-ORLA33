'use client';

import { AlertTriangle, X } from 'lucide-react';
import styles from './styles.module.css';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, itemName }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconContainer}>
          <AlertTriangle size={24} />
        </div>
        
        <h3 className={styles.title}>Excluir Produto</h3>
        <p className={styles.description}>
          Tem certeza que deseja excluir <strong>{itemName}</strong>? <br/>
          Essa ação não pode ser desfeita.
        </p>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
          <button className={styles.confirmBtn} onClick={onConfirm}>Sim, excluir</button>
        </div>

        <button className={styles.closeIcon} onClick={onClose}>
          <X size={20} />
        </button>
      </div>
    </div>
  );
}