'use client';

import { Product } from '@/types';
import { Edit2, Trash2, Package, Power } from 'lucide-react';
import styles from './styles.module.css';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleStatus: (id: string) => void;
}

export default function ProductList({ products, onEdit, onDelete, onToggleStatus }: ProductListProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Categoria</th>
            <th>Preço</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className={styles.productCell}>
                <div className={styles.productIcon}>
                  <Package size={20} />
                </div>
                <span className={styles.productName}>{product.name}</span>
              </td>
              <td>
                <span className={styles.categoryBadge}>{product.category}</span>
              </td>
              <td className={styles.price}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
              </td>
              <td>
                {/* Botão interativo de status */}
                <button 
                  onClick={() => onToggleStatus(product.id)}
                  className={`${styles.statusBtn} ${product.active ? styles.active : styles.inactive}`}
                  title="Clique para alterar status"
                >
                  {product.active ? 'Ativo' : 'Inativo'}
                </button>
              </td>
              <td className={styles.actions}>
                <button 
                  className={styles.actionBtn} 
                  title="Editar"
                  onClick={() => onEdit(product)}
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                  title="Excluir"
                  onClick={() => onDelete(product)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
          
          {products.length === 0 && (
            <tr>
              <td colSpan={5} className={styles.empty}>
                Nenhum produto cadastrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}