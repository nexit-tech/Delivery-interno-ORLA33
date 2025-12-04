'use client';

import { useState, useEffect } from 'react';
import { Partner } from '@/types';
import { X, Save } from 'lucide-react';
import styles from './styles.module.css';

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partner: Omit<Partner, 'id'>) => void;
  initialData?: Partner | null;
}

export default function PartnerModal({ isOpen, onClose, onSave, initialData }: PartnerModalProps) {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name);
      setWhatsapp(initialData.whatsapp);
      setLogin(initialData.login);
      setPassword(initialData.password);
    } else {
      setName('');
      setWhatsapp('');
      setLogin('');
      setPassword('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, whatsapp, login, password });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{initialData ? 'Editar Parceiro' : 'Novo Parceiro'}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Nome do Estabelecimento</label>
            <input 
              type="text" placeholder="Ex: Pizzaria do Zé" 
              value={name} onChange={(e) => setName(e.target.value)} required 
            />
          </div>
          
          <div className={styles.field}>
            <label>WhatsApp do Responsável</label>
            <input 
              type="text" placeholder="(11) 99999-9999" 
              value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required 
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Login de Acesso</label>
              <input 
                type="text" placeholder="usuario.loja" 
                value={login} onChange={(e) => setLogin(e.target.value)} required 
              />
            </div>
            <div className={styles.field}>
              <label>Senha</label>
              <input 
                type="text" placeholder="senha123" 
                value={password} onChange={(e) => setPassword(e.target.value)} required 
              />
            </div>
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