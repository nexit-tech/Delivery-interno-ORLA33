'use client';

import { Partner } from '@/types';
import { Edit2, Trash2, Store, Phone, User, Key, Copy } from 'lucide-react';
import styles from './styles.module.css';

interface PartnerCardProps {
  partner: Partner;
  onEdit: (partner: Partner) => void;
  onDelete: (partner: Partner) => void;
}

export default function PartnerCard({ partner, onEdit, onDelete }: PartnerCardProps) {
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Poderia adicionar um toast aqui, mas vamos manter simples
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <Store size={20} />
        </div>
        <div className={styles.headerInfo}>
          <h3 className={styles.name}>{partner.name}</h3>
          <span className={styles.id}>ID: {partner.id}</span>
        </div>
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={() => onEdit(partner)}>
            <Edit2 size={16} />
          </button>
          <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(partner)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.row}>
          <div className={styles.label}>
            <Phone size={14} /> WhatsApp
          </div>
          <div className={styles.value}>{partner.whatsapp}</div>
        </div>

        <div className={styles.divider} />

        <div className={styles.credentialsBox}>
          <div className={styles.credentialRow}>
            <span className={styles.credLabel}><User size={14}/> Login:</span>
            <strong className={styles.credValue}>{partner.login}</strong>
            <button className={styles.copyBtn} onClick={() => copyToClipboard(partner.login)} title="Copiar">
              <Copy size={12} />
            </button>
          </div>
          
          <div className={styles.credentialRow}>
            <span className={styles.credLabel}><Key size={14}/> Senha:</span>
            <strong className={styles.credValue}>{partner.password}</strong>
            <button className={styles.copyBtn} onClick={() => copyToClipboard(partner.password)} title="Copiar">
              <Copy size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}