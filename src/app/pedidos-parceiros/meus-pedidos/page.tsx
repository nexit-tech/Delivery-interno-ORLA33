'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import PartnerBottomNav from '../_components/PartnerBottomNav';
import { Clock, CheckCircle, Package, AlertCircle, Trash2 } from 'lucide-react';
import styles from './page.module.css';
import { useAuth } from '@/contexts/AuthContext';

interface MyOrder {
  id: string; 
  total: number;
  status: string;
  created_at: string;
  items_count: number;
  items_summary: string;
}

export default function MeusPedidosPage() {
  // A CORREÇÃO ESTÁ AQUI: Hook dentro do componente
  const { partnerId } = useAuth();

  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async (forceLoading = true) => {
    if (!partnerId) return;

    try {
      if (forceLoading) setLoading(true);

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total,
          status,
          created_at,
          order_items ( product_name, quantity )
        `)
        .eq('partner_id', partnerId)
        .neq('status', 'COMPLETED') 
        .neq('status', 'CANCELLED') 
        .neq('status', 'NOT_ACCEPTED') 
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formatted = data.map((order: any) => {
          const summary = order.order_items
            .map((i: any) => `${i.quantity}x ${i.product_name}`)
            .join(', ');

          return {
            id: order.id.toString(),
            total: order.total,
            status: order.status,
            created_at: order.created_at,
            items_count: order.order_items.length,
            items_summary: summary
          };
        });

        const statusPriority: Record<string, number> = {
          'READY': 1,
          'PROCESSING': 2,
          'PENDING': 3
        };

        formatted.sort((a, b) => {
          const priorityA = statusPriority[a.status] || 99;
          const priorityB = statusPriority[b.status] || 99;
          return priorityA - priorityB;
        });

        setOrders(formatted);
      }
    } catch (error) {
      console.error('Erro ao buscar meus pedidos:', error);
    } finally {
      if (forceLoading) setLoading(false);
    }
  };

  const handleCancelOrder = async (id: string) => {
    if (!confirm('Deseja realmente cancelar este pedido?')) return;

    try {
      setOrders(prev => prev.filter(o => o.id !== id));

      const { error } = await supabase
        .from('orders')
        .update({ status: 'CANCELLED' })
        .eq('id', parseInt(id));

      if (error) throw error;

    } catch (error) {
      console.error('Erro ao cancelar:', error);
      alert('Não foi possível cancelar. Tente novamente.');
      fetchMyOrders(false); 
    }
  };

  useEffect(() => {
    if (partnerId) {
      fetchMyOrders(true);
      const interval = setInterval(() => fetchMyOrders(false), 5000);
      return () => clearInterval(interval);
    }
  }, [partnerId]); // Adicionei partnerId na dependência

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'READY': return { label: 'Pronto p/ Retirar', color: '#12b76a', bg: '#ecfdf3', icon: CheckCircle };
      case 'PROCESSING': return { label: 'Em Preparo', color: '#0086c9', bg: '#f0f9ff', icon: Package };
      case 'PENDING': return { label: 'Aguardando Confirmação', color: '#f79009', bg: '#fffaeb', icon: Clock };
      default: return { label: status, color: '#667085', bg: '#f2f4f7', icon: AlertCircle };
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Meus Pedidos</h1>
        <p className={styles.subtitle}>Acompanhe o status em tempo real</p>
      </header>

      <div className={styles.list}>
        {loading ? (
          <div style={{textAlign: 'center', padding: '2rem', color: '#666'}}>Carregando...</div>
        ) : orders.length === 0 ? (
          <div style={{textAlign: 'center', padding: '3rem', color: '#999'}}>
            Nenhum pedido ativo no momento.
          </div>
        ) : (
          orders.map(order => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div key={order.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.orderId}>#{order.id}</span>
                  <span className={styles.date}>
                    {new Date(order.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.summary}>{order.items_summary}</p>
                  <p className={styles.total}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                  </p>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.statusBadge} style={{ color: statusInfo.color, backgroundColor: statusInfo.bg }}>
                    <StatusIcon size={14} />
                    {statusInfo.label}
                  </div>

                  {order.status === 'PENDING' && (
                    <button 
                      className={styles.cancelBtn} 
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      <Trash2 size={16} /> Cancelar
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      <PartnerBottomNav />
    </div>
  );
}