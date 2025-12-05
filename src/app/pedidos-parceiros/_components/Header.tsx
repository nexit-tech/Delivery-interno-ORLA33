'use client';

import { Search } from 'lucide-react';
import styles from '../page.module.css';

interface HeaderProps {
  onSearch: (term: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  return (
    <div className={styles.headerWrapper}>
      <h1 className={styles.headerTitle}>Fazer Pedido</h1>
      <p className={styles.headerSubtitle}>Selecione os itens para reposição</p>
      
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={18} />
        <input 
          type="text" 
          placeholder="Buscar produto..." 
          className={styles.searchInput}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}