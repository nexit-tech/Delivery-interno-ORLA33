'use client';

import { useState, useEffect } from 'react';
import { Calendar, DollarSign, TrendingUp, ShoppingCart, Filter, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '@/lib/supabase'; // Conexão real
import OrderModal from '../pedidos/_components/OrderModal';
import styles from './page.module.css';
import { Order } from '@/types';

export default function FinanceiroPage() {
  // Configura datas iniciais (Início do mês atual até hoje)
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);
  const [selectedPartner, setSelectedPartner] = useState('all');

  // Estados de dados
  const [orders, setOrders] = useState<Order[]>([]);
  const [partnersList, setPartnersList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado do Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // --- 1. BUSCAR LISTA DE PARCEIROS (Para o filtro) ---
  useEffect(() => {
    async function fetchPartners() {
      const { data } = await supabase.from('partners').select('name').order('name');
      if (data) {
        setPartnersList(data.map((p: any) => p.name));
      }
    }
    fetchPartners();
  }, []);

  // --- 2. BUSCAR DADOS FINANCEIROS ---
  useEffect(() => {
    async function fetchFinancialData() {
      setLoading(true);
      try {
        // Query base: Busca pedidos CONCLUÍDOS dentro do período
        let query = supabase
          .from('orders')
          .select(`
            id,
            created_at,
            total,
            status,
            partners ( name ),
            order_items ( product_name, quantity, observation, price )
          `)
          .eq('status', 'COMPLETED') 
          .gte('created_at', `${startDate}T00:00:00`)
          .lte('created_at', `${endDate}T23:59:59`)
          .order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) throw error;

        if (data) {
          // Formata os dados para o front
          let formattedOrders = data.map((order: any) => ({
            id: order.id.toString(),
            partnerName: order.partners?.name || 'Desconhecido',
            date: order.created_at,
            total: order.total,
            status: order.status,
            items: order.order_items.map((item: any) => ({
              name: item.product_name,
              quantity: item.quantity,
              observation: item.observation,
              price: item.price
            }))
          }));

          // Filtragem por parceiro no front-end (mais simples para dashboard leve)
          if (selectedPartner !== 'all') {
            formattedOrders = formattedOrders.filter((o: any) => o.partnerName === selectedPartner);
          }

          setOrders(formattedOrders);
        }
      } catch (error) {
        console.error('Erro ao buscar financeiro:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFinancialData();
  }, [startDate, endDate, selectedPartner]);

  // --- CÁLCULO DE KPIS ---
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
  const totalOrders = orders.length;
  const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // --- FORMATADORES ---
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  // --- EXPORTAR PDF ---
  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Relatório Financeiro', 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Período: ${new Date(startDate).toLocaleDateString('pt-BR')} até ${new Date(endDate).toLocaleDateString('pt-BR')}`, 14, 28);
    doc.text(`Parceiro: ${selectedPartner === 'all' ? 'Todos' : selectedPartner}`, 14, 34);

    doc.setFontSize(12);
    doc.text(`Faturamento: ${formatCurrency(totalRevenue)}`, 14, 45);
    doc.text(`Pedidos: ${totalOrders}`, 80, 45);
    doc.text(`Ticket Médio: ${formatCurrency(averageTicket)}`, 140, 45);

    const tableData = orders.map(row => [
      formatDateTime(row.date),
      row.partnerName,
      `#${row.id}`,
      formatCurrency(row.total)
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['Data/Hora', 'Parceiro', 'ID Pedido', 'Valor']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [234, 29, 44] },
    });

    doc.save(`relatorio_${startDate}.pdf`);
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Relatório Financeiro</h1>
          <p className={styles.subtitle}>Visão geral de faturamento e desempenho.</p>
        </div>
        <button className={styles.exportBtn} onClick={handleExportPDF}>
          <FileText size={18} /> Exportar PDF
        </button>
      </header>

      <section className={styles.filtersBar}>
        <div className={styles.filterGroup}>
          <label><Calendar size={14}/> Período</label>
          <div className={styles.dateInputs}>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <span>até</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label><Filter size={14}/> Filtrar por Parceiro</label>
          <select value={selectedPartner} onChange={(e) => setSelectedPartner(e.target.value)}>
            <option value="all">Todos os Parceiros</option>
            {partnersList.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </section>

      <section className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={`${styles.iconBox} ${styles.blue}`}><DollarSign size={24} /></div>
          <div><span className={styles.kpiLabel}>Faturamento Total</span><strong className={styles.kpiValue}>{formatCurrency(totalRevenue)}</strong></div>
        </div>
        <div className={styles.kpiCard}>
          <div className={`${styles.iconBox} ${styles.orange}`}><ShoppingCart size={24} /></div>
          <div><span className={styles.kpiLabel}>Pedidos Realizados</span><strong className={styles.kpiValue}>{totalOrders}</strong></div>
        </div>
        <div className={styles.kpiCard}>
          <div className={`${styles.iconBox} ${styles.green}`}><TrendingUp size={24} /></div>
          <div><span className={styles.kpiLabel}>Ticket Médio</span><strong className={styles.kpiValue}>{formatCurrency(averageTicket)}</strong></div>
        </div>
      </section>

      <section className={styles.tableSection}>
        <h3 className={styles.sectionTitle}>Detalhamento do Período</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Data / Hora</th>
                <th>Parceiro</th>
                <th>ID Pedido</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className={styles.emptyState}>Carregando...</td></tr>
              ) : orders.length > 0 ? (
                orders.map(order => (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className={styles.clickableRow}
                  >
                    <td>{formatDateTime(order.date)}</td>
                    <td className={styles.partnerName}>{order.partnerName}</td>
                    <td className={styles.orderId}>#{order.id}</td>
                    <td><span className={styles.badgeSuccess}>Concluído</span></td>
                    <td className={styles.moneyValue}>{formatCurrency(order.total)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className={styles.emptyState}>Nenhuma venda encontrada neste período.</td></tr>
              )}
            </tbody>
            {!loading && orders.length > 0 && (
              <tfoot>
                <tr className={styles.footerRow}>
                  <td colSpan={4} style={{ textAlign: 'right' }}>Total do Período:</td>
                  <td className={styles.totalFooter}>{formatCurrency(totalRevenue)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </section>

      <OrderModal 
        isOpen={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onAdvance={() => {}} 
      />
    </main>
  );
}