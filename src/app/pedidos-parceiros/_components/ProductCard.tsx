'use client';

import { Product } from '@/types';
import styles from '../page.module.css';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onClick: () => void;
}

export default function ProductCard({ product, quantity, onClick }: ProductCardProps) {
  return (
    <div 
      className={`${styles.card} ${quantity > 0 ? styles.activeCard : ''}`} 
      onClick={onClick}
    >
      <div className={styles.cardContent}>
        <span className={styles.categoryBadge}>{product.category}</span>
        <h3 className={styles.productName}>{product.name}</h3>
        <span className={styles.price}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
        </span>
      </div>

      {/* Indicador de Quantidade (Badge) se já tiver no carrinho */}
      {quantity > 0 && (
        <div className={styles.qtyBadge}>
          {quantity}x
        </div>
      )}
    </div>
  );
}