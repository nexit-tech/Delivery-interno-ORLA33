'use client';

import { useState, useMemo } from 'react';
import { Calendar, DollarSign, TrendingUp, ShoppingCart, Filter, FileText } from 'lucide-react'; // Mudei icone pra FileText (PDF)
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import OrderModal from '../pedidos/_components/OrderModal'; // Importando o Modal existente
import styles from './page.module.css';
import { Order } from '@/types';

// Mock com datas variadas
const MOCK_SALES_DATA: Order[] = [
  { id: '1024', partnerName: 'Quiosque do Sol', date: '2023-12-01T14:00:00', total: 150.00, status: 'COMPLETED', items: [{ name: 'X-Bacon', quantity: 2 }, { name: 'Coca Zero', quantity: 2 }] },
  { id: '1025', partnerName: 'Quiosque do Sol', date: '2023-12-02T10:30:00', total: 89.90, status: 'COMPLETED', items: [{ name: 'Açaí 500ml', quantity: 2 }] },
  { id: '1026', partnerName: 'Arena Beach', date: '2023-12-02T11:00:00', total: 200.00, status: 'COMPLETED', items: [{ name: 'Porção de Camarão', quantity: 1 }] },
  { id: '1027', partnerName: 'Bar da Piscina', date: '2023-12-03T18:00:00', total: 450.00, status: 'COMPLETED', items: [{ name: 'Torre de Chopp', quantity: 3 }, { name: 'Isca de Peixe', quantity: 2 }] },
  { id: '1028', partnerName: 'Quiosque do Sol', date: '2023-12-05T09:00:00', total: 120.00, status: 'COMPLETED', items: [{ name: 'Suco Natural', quantity: 4 }] },
  { id: '1029', partnerName: 'Arena Beach', date: '2023-12-05T15:00:00', total: 300.50, status: 'COMPLETED', items: [{ name: 'Combo Família', quantity: 1 }] },
  { id: '1010', partnerName: 'Bar da Piscina', date: '2023-11-20T12:00:00', total: 1000.00, status: 'COMPLETED', items: [{ name: 'Festa Privada', quantity: 1 }] },
];

const PARTNERS_LIST = ['Quiosque do Sol', 'Arena Beach', 'Bar da Piscina'];

export default function FinanceiroPage() {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState('2023-11-01');
  const [endDate, setEndDate] = useState(today);
  const [selectedPartner, setSelectedPartner] = useState('all');

  // Estado para controlar o Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // --- FILTROS ---
  const filteredData = useMemo(() => {
    return MOCK_SALES_DATA.filter(order => {
      // Ajuste de fuso: pegamos a parte da data da string ISO
      const orderDate = order.date.split('T')[0];
      const isDateInRange = orderDate >= startDate && orderDate <= endDate;
      const isPartnerMatch = selectedPartner === 'all' || order.partnerName === selectedPartner;
      return isDateInRange && isPartnerMatch && order.status === 'COMPLETED';
    });
  }, [startDate, endDate, selectedPartner]);

  // --- KPIS ---
  const totalRevenue = filteredData.reduce((acc, curr) => acc + curr.total, 0);
  const totalOrders = filteredData.length;
  const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // --- FORMATADORES ---
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Formatação de Data/Hora segura para o Fuso Brasileiro
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // --- GERAR PDF ---
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text('Relatório Financeiro', 14, 20);
    
    // Subtítulo com info do filtro
    doc.setFontSize(10);
    doc.text(`Período: ${new Date(startDate).toLocaleDateString('pt-BR')} até ${new Date(endDate).toLocaleDateString('pt-BR')}`, 14, 28);
    doc.text(`Parceiro: ${selectedPartner === 'all' ? 'Todos' : selectedPartner}`, 14, 34);

    // Resumo (KPIs no PDF)
    doc.setFontSize(12);
    doc.text(`Faturamento: ${formatCurrency(totalRevenue)}`, 14, 45);
    doc.text(`Pedidos: ${totalOrders}`, 80, 45);
    doc.text(`Ticket Médio: ${formatCurrency(averageTicket)}`, 140, 45);

    // Tabela
    const tableData = filteredData.map(row => [
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
      headStyles: { fillColor: [234, 29, 44] }, // Cor vermelha do seu tema
    });

    doc.save(`relatorio_financeiro_${startDate}.pdf`);
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
            {PARTNERS_LIST.map(p => <option key={p} value={p}>{p}</option>)}
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
              {filteredData.length > 0 ? (
                filteredData.map(order => (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)} // <--- CLIQUE PARA ABRIR MODAL
                    className={styles.clickableRow} // Adicionei classe para cursor pointer
                  >
                    <td>{formatDateTime(order.date)}</td>
                    <td className={styles.partnerName}>{order.partnerName}</td>
                    <td className={styles.orderId}>#{order.id}</td>
                    <td><span className={styles.badgeSuccess}>Concluído</span></td>
                    <td className={styles.moneyValue}>{formatCurrency(order.total)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className={styles.emptyState}>Nenhuma venda encontrada.</td></tr>
              )}
            </tbody>
            {filteredData.length > 0 && (
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

      {/* MODAL DE DETALHES (Reutilizando o existente) */}
      <OrderModal 
        isOpen={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onAdvance={() => {}} // Função vazia, pois no histórico não avançamos status
      />

    </main>
  );
}