'use client';

import { Category } from '@/types';
import { Edit2, Trash2, Tag } from 'lucide-react';
import styles from './styles.module.css';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onToggleStatus: (id: string) => void;
}

export default function CategoryList({ categories, onEdit, onDelete, onToggleStatus }: CategoryListProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome da Categoria</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td className={styles.nameCell}>
                <div className={styles.icon}>
                  <Tag size={18} />
                </div>
                <span className={styles.name}>{category.name}</span>
              </td>
              <td>
                <button 
                  onClick={() => onToggleStatus(category.id)}
                  className={`${styles.statusBtn} ${category.active ? styles.active : styles.inactive}`}
                >
                  {category.active ? 'Ativa' : 'Inativa'}
                </button>
              </td>
              <td className={styles.actions}>
                <button className={styles.actionBtn} onClick={() => onEdit(category)}>
                  <Edit2 size={16} />
                </button>
                <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(category)}>
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr><td colSpan={3} className={styles.empty}>Nenhuma categoria cadastrada.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}