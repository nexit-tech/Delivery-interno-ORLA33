'use client';

import { useState, useEffect } from 'react';
import { Product, Category } from '@/types';
import { X, Save } from 'lucide-react';
import styles from './styles.module.css';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Agora aceitamos qualquer objeto no save, pois vamos manipular os campos na página pai
  onSave: (data: any) => void; 
  initialData?: any; // Usamos any aqui para facilitar a transição do ID
  categories: Category[];
}

export default function ProductModal({ isOpen, onClose, onSave, initialData, categories }: ProductModalProps) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name);
      // Pega o ID da categoria (seja do banco ou do objeto local)
      setCategoryId(initialData.category_id || initialData.categoryId || '');
      setPrice(initialData.price?.toFixed(2) || '');
      setActive(initialData.active);
    } else {
      setName('');
      setCategoryId('');
      setPrice('');
      setActive(true);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      // Envia o ID da categoria selecionada
      category_id: categoryId, 
      price: parseFloat(price.replace(',', '.')) || 0,
      active
    });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        <div className={styles.header}>
          <h2>{initialData ? 'Editar Produto' : 'Novo Produto'}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Nome do Produto</label>
            <input 
              type="text" 
              placeholder="Ex: X-Salada" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Categoria</label>
              <select 
                value={categoryId} 
                onChange={(e) => setCategoryId(e.target.value)} 
                required
              >
                <option value="" disabled>Selecione...</option>
                {categories.filter(c => c.active).map((cat) => (
                  // O valor agora é o ID, mas mostramos o NOME
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>Preço (R$)</label>
              <input 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className={styles.checkboxField}>
            <input 
              type="checkbox" 
              id="productActive" 
              checked={active} 
              onChange={(e) => setActive(e.target.checked)} 
            />
            <label htmlFor="productActive">Produto Ativo</label>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn}>
              <Save size={18} /> Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}