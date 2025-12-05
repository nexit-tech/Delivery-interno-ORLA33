'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Lock, User, Loader2 } from 'lucide-react';
import styles from './page.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Verifica ADMIN Hardcoded
      if (username === 'orla33steakhouse' && password === 'Abcd@4@5@6') {
        login('admin');
        return;
      }

      // 2. Verifica PARCEIRO no Banco
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('login', username)
        .eq('password', password) // Comparação direta (simples)
        .single();

      if (error || !data) {
        setError('Usuário ou senha incorretos.');
        setLoading(false);
        return;
      }

      // Login bem sucedido de parceiro
      login('partner', data);

    } catch (err) {
      console.error(err);
      setError('Erro ao conectar. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Bem-vindo</h1>
          <p>Acesse o portal para gerenciar pedidos</p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <User size={18} className={styles.icon} />
            <input 
              type="text" 
              placeholder="Login" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock size={18} className={styles.icon} />
            <input 
              type="password" 
              placeholder="Senha" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}