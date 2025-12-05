'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './styles.module.css';

interface ObsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (obs: string) => void;
  itemName: string;
  initialObs: string;
}

export default function ObsModal({ isOpen, onClose, onSave, itemName, initialObs }: ObsModalProps) {
  const [obs, setObs] = useState(initialObs);

  // O SEGREDO ESTÁ AQUI: 
  // Toda vez que abrir o modal ou mudar o produto, atualiza o texto do input
  useEffect(() => {
    if (isOpen) {
      setObs(initialObs || '');
    }
  }, [isOpen, initialObs]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(obs);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Obs: {itemName}</h3>
          <button onClick={onClose} className={styles.closeBtn}><X size={24} /></button>
        </div>
        
        <textarea 
          className={styles.textarea}
          placeholder="Ex: Sem cebola..."
          value={obs}
          onChange={(e) => setObs(e.target.value)}
          autoFocus
        />

        <button className={styles.saveBtn} onClick={handleSave}>
          Salvar Observação
        </button>
      </div>
    </div>
  );
}