'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext'; // <--- Importe o Auth
import PartnerBottomNav from '../_components/PartnerBottomNav';
import { User, Save, Lock, Phone, Store, Key, LogOut } from 'lucide-react'; // Import LogOut
import styles from './page.module.css';

export default function PerfilPage() {
  // Pega o ID e a função logout do contexto
  const { partnerId, logout } = useAuth(); 
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [name, setName] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  useEffect(() => {
    async function fetchPartner() {
      if (!partnerId) return; // Espera carregar o ID

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
      {/* Botão Sair no Topo Direito */}
      <div style={{width: '100%', padding: '1rem 1.5rem 0', display: 'flex', justifyContent: 'flex-end'}}>
        <button onClick={logout} style={{background: 'none', border: 'none', color: '#d92d20', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 600}}>
          <LogOut size={18} /> Sair
        </button>
      </div>

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

        <button className={styles.saveBtn} onClick={handleSave} disabled={saving || loading}>
          {saving ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}
        </button>
      </div>

      <PartnerBottomNav />
    </div>
  );
}