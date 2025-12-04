'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase'; // <--- Importando a conexão
import PartnerCard from './_components/PartnerCard';
import PartnerModal from './_components/PartnerModal';
import DeleteModal from '../produtos/_components/DeleteModal';
import styles from './page.module.css';
import { Partner } from '@/types';

export default function ParceirosPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento

  // Estados dos Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [deletingPartner, setDeletingPartner] = useState<Partner | null>(null);

  // --- 1. BUSCAR DADOS (READ) ---
  const fetchPartners = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('created_at', { ascending: false }); // Mais recentes primeiro

    if (error) {
      console.error('Erro ao buscar parceiros:', error);
    } else {
      setPartners(data || []);
    }
    setIsLoading(false);
  };

  // Busca ao carregar a página
  useEffect(() => {
    fetchPartners();
  }, []);

  // --- 2. SALVAR (CREATE / UPDATE) ---
  const handleSave = async (data: Omit<Partner, 'id'>) => {
    if (editingPartner) {
      // Atualizar existente
      const { error } = await supabase
        .from('partners')
        .update(data)
        .eq('id', editingPartner.id);

      if (!error) fetchPartners(); // Recarrega a lista
    } else {
      // Criar novo
      const { error } = await supabase
        .from('partners')
        .insert([data]);

      if (!error) fetchPartners(); // Recarrega a lista
    }
  };

  // --- 3. DELETAR (DELETE) ---
  const confirmDelete = async () => {
    if (deletingPartner) {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', deletingPartner.id);

      if (!error) {
        setPartners(prev => prev.filter(p => p.id !== deletingPartner.id));
        setIsDeleteOpen(false);
        setDeletingPartner(null);
      } else {
        alert('Erro ao excluir parceiro. Verifique se ele tem pedidos vinculados.');
      }
    }
  };

  // Funções de abrir modal (iguais ao anterior)
  const openNew = () => { setEditingPartner(null); setIsModalOpen(true); };
  const openEdit = (partner: Partner) => { setEditingPartner(partner); setIsModalOpen(true); };
  const openDelete = (partner: Partner) => { setDeletingPartner(partner); setIsDeleteOpen(true); };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Parceiros</h1>
          <p className={styles.subtitle}>
            {isLoading ? 'Carregando...' : `Gerencie os estabelecimentos cadastrados (${partners.length})`}
          </p>
        </div>
        <button className={styles.newBtn} onClick={openNew}>
          <Plus size={20} /> Novo Parceiro
        </button>
      </header>

      {/* Loading State Simples */}
      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Carregando dados...</div>
      ) : (
        <div className={styles.grid}>
          {partners.map(partner => (
            <PartnerCard 
              key={partner.id} 
              partner={partner} 
              onEdit={openEdit} 
              onDelete={openDelete} 
            />
          ))}
          {partners.length === 0 && (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#999', marginTop: '2rem' }}>
              Nenhum parceiro encontrado. Cadastre o primeiro!
            </p>
          )}
        </div>
      )}

      <PartnerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        initialData={editingPartner} 
      />

      <DeleteModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        itemName={deletingPartner?.name}
      />
    </main>
  );
}