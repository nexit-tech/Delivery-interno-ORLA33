'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext'; 
import PartnerBottomNav from '../_components/PartnerBottomNav';
import { User, Save, Phone, Store, Key, LogOut } from 'lucide-react'; 
import styles from './page.module.css';

export default function PerfilPage() {
  const { partnerId, logout } = useAuth(); 
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [name, setName] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  useEffect(() => {
    async function fetchPartner() {
      if (!partnerId) return; 

      try {
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .eq('id', partnerId)
          .single();

        if (error) throw error;

        if (data) {
          setName(data.name);
          setLogin(data.login);
          setPassword(data.password);
          setWhatsapp(data.whatsapp);
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPartner();
  }, [partnerId]);

  const handleSave = async () => {
    if (!partnerId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('partners')
        .update({ whatsapp })
        .eq('id', partnerId);

      if (error) throw error;
      alert('Número atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Cabeçalho */}
      <div className={styles.profileHeader}>
        <div className={styles.avatarCircle}>
          <User size={48} color="#475467" />
        </div>
        <h1 className={styles.partnerName}>{loading ? 'Carregando...' : name}</h1>
        <span className={styles.roleLabel}>Parceiro Verificado</span>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.inputGroup}>
          <label><Store size={16} /> Nome</label>
          <input type="text" value={name} disabled className={styles.inputDisabled} />
        </div>

        <div className={styles.inputGroup}>
          <label><Phone size={16} /> WhatsApp</label>
          <input 
            type="text" 
            value={whatsapp} 
            onChange={(e) => setWhatsapp(e.target.value)} 
            className={styles.inputEditable}
          />
        </div>

        <div className={styles.divider} />

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label><User size={16} /> Login</label>
            <input type="text" value={login} disabled className={styles.inputDisabled} />
          </div>
          <div className={styles.inputGroup}>
            <label><Key size={16} /> Senha</label>
            <input type="text" value={password} disabled className={styles.inputDisabled} />
          </div>
        </div>

        {/* Botão Salvar Principal */}
        <button className={styles.saveBtn} onClick={handleSave} disabled={saving || loading}>
          {saving ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}
        </button>

        {/* Botão Sair Agora Em Baixo */}
        <button className={styles.logoutBtn} onClick={logout}>
          <LogOut size={18} /> Sair da conta
        </button>
      </div>

      <PartnerBottomNav />
    </div>
  );
}