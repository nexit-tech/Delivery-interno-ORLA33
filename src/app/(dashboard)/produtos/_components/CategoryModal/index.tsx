'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types';
import { X, Save } from 'lucide-react';
import styles from './styles.module.css';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, 'id'>) => void;
  initialData?: Category | null;
}

export default function CategoryModal({ isOpen, onClose, onSave, initialData }: CategoryModalProps) {
  const [name, setName] = useState('');
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name);
      setActive(initialData.active);
    } else {
      setName('');
      setActive(true);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, active });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{initialData ? 'Editar Categoria' : 'Nova Categoria'}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Nome da Categoria</label>
            <input 
              type="text" 
              placeholder="Ex: Bebidas" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          <div className={styles.checkboxField}>
            <input 
              type="checkbox" 
              id="catActive" 
              checked={active} 
              onChange={(e) => setActive(e.target.checked)} 
            />
            <label htmlFor="catActive">Categoria Ativa</label>
          </div>
          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.saveBtn}><Save size={18} /> Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}