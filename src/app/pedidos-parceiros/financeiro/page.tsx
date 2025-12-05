'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import PartnerBottomNav from '../_components/PartnerBottomNav';
import OrderDetailModal from '../_components/OrderDetailModal'; 
import { Calendar, DollarSign, Package, ChevronRight } from 'lucide-react';
import styles from './page.module.css';
import { useAuth } from '@/contexts/AuthContext';

export default function FinanceiroParceiroPage() {
  // A CORREÇÃO ESTÁ AQUI: Hook dentro do componente
  const { partnerId } = useAuth();

  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);
  
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ total: 0, count: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      if (!partnerId) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, 
          total, 
          created_at, 
          status,
          order_items ( name:product_name, quantity, price )
        `)
        .eq('partner_id', partnerId)
        .eq('status', 'COMPLETED')
        .gte('created_at', `${startDate}T00:00:00`)
        .lte('created_at', `${endDate}T23:59:59`)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const formatted = data.map((order: any) => ({
          id: order.id,
          total: order.total,
          created_at: order.created_at,
          status: order.status,
          items: order.order_items 
        }));

        setOrders(formatted);
        const total = formatted.reduce((acc, curr) => acc + curr.total, 0);
        setSummary({ total, count: formatted.length });
      }
      setLoading(false);
    }
    fetchData();
  }, [startDate, endDate, partnerId]); // Adicionei partnerId

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Financeiro</h1>
        <p className={styles.subtitle}>Seus ganhos no período</p>
      </header>

      <div className={styles.filterBar}>
        <div className={styles.dateGroup}>
          <Calendar size={18} className={styles.filterIcon} />
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <span className={styles.separator}>até</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
      </div>

      <div className={styles.cards}>
        <div className={styles.kpiCard}>
          <div className={styles.iconBox} style={{background: '#ecfdf3', color: '#039855'}}>
            <DollarSign size={24} />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Faturamento</span>
            <strong className={styles.kpiValue}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.total)}
            </strong>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.iconBox} style={{background: '#eff8ff', color: '#2e90fa'}}>
            <Package size={24} />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Entregues</span>
            <strong className={styles.kpiValue}>{summary.count}</strong>
          </div>
        </div>
      </div>

      <div className={styles.list}>
        <h3 className={styles.listTitle}>Extrato Detalhado</h3>
        
        {loading ? <p style={{textAlign: 'center', color: '#999', marginTop: '2rem'}}>Carregando...</p> : (
          <div className={styles.transactions}>
            {orders.map(order => (
              <div 
                key={order.id} 
                className={styles.transactionCard}
                onClick={() => setSelectedOrder(order)}
              >
                <div className={styles.transInfo}>
                  <span className={styles.transId}>Pedido #{order.id}</span>
                  <span className={styles.transDate}>
                    {new Date(order.created_at).toLocaleDateString('pt-BR')} • {new Date(order.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                
                <div className={styles.transValue}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                  <ChevronRight size={16} color="#d0d5dd" />
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div style={{textAlign: 'center', padding: '2rem', color: '#999', background: 'white', borderRadius: '12px'}}>
                Nenhuma venda neste período.
              </div>
            )}
          </div>
        )}
      </div>

      <PartnerBottomNav />

      <OrderDetailModal 
        isOpen={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}