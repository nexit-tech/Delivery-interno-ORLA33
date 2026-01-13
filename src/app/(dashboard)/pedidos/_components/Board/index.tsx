'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Order, OrderStatus } from '@/types';
import OrderCard from '../OrderCard';
import OrderModal from '../OrderModal';
import styles from './styles.module.css';

interface BoardProps {
  initialOrders: Order[];
}

export default function Board({ initialOrders }: BoardProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // ESTADO PARA ABA MOBILE
  const [mobileTab, setMobileTab] = useState<'PENDING' | 'PROCESSING' | 'READY'>('PENDING');

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  // --- LÓGICA DE NEGÓCIO (RECUPERADA) ---

  const sendNotification = async (phone: string, status: OrderStatus, orderId: string) => {
    if (!phone) return;
    try {
      await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, status, orderId })
      });
    } catch (error) {
      console.error('Erro ao enviar notificação', error);
    }
  };

  const updateOrderStatus = async (id: string, newStatus: OrderStatus) => {
    // Atualização Otimista
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', parseInt(id));

      if (error) throw error;

      // Envia notificação (opcional, descomente se tiver a API)
      // const order = orders.find(o => o.id === id);
      // if (order?.partnerWhatsapp) {
      //   sendNotification(order.partnerWhatsapp, newStatus, id);
      // }

    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      // Reverte em caso de erro (opcional: buscar dados novamente)
    }
  };

  // Funções de Ação
  const handleAdvanceOrder = (id: string) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    if (order.status === 'PENDING') updateOrderStatus(id, 'PROCESSING');
    else if (order.status === 'PROCESSING') updateOrderStatus(id, 'READY');
    else if (order.status === 'READY') updateOrderStatus(id, 'COMPLETED');
  };

  const handleRejectOrder = (id: string) => {
    if (!confirm('Tem certeza que deseja recusar este pedido?')) return;
    updateOrderStatus(id, 'NOT_ACCEPTED');
  };

  const handleCancelProcessingOrder = (id: string) => {
    if (!confirm('O pedido já está em preparo. Deseja cancelar mesmo assim?')) return;
    updateOrderStatus(id, 'CANCELLED');
  };

  // Modais
  const openModal = (order: Order) => setSelectedOrder(order);
  const closeModal = () => setSelectedOrder(null);

  // Filtros
  const pendingOrders = orders.filter(o => o.status === 'PENDING').sort((a, b) => parseInt(a.id) - parseInt(b.id)); 
  const processingOrders = orders.filter(o => o.status === 'PROCESSING').sort((a, b) => parseInt(b.id) - parseInt(a.id)); 
  const readyOrders = orders.filter(o => o.status === 'READY').sort((a, b) => parseInt(b.id) - parseInt(a.id)); 

  return (
    <>
      {/* SELETOR DE ABAS (SÓ APARECE NO CSS MOBILE) */}
      <div className={styles.mobileTabs}>
        <button 
          className={`${styles.tabBtn} ${mobileTab === 'PENDING' ? styles.activeTab : ''}`}
          onClick={() => setMobileTab('PENDING')}
        >
          Pendentes ({pendingOrders.length})
        </button>
        <button 
          className={`${styles.tabBtn} ${mobileTab === 'PROCESSING' ? styles.activeTab : ''}`}
          onClick={() => setMobileTab('PROCESSING')}
        >
          Preparo ({processingOrders.length})
        </button>
        <button 
          className={`${styles.tabBtn} ${mobileTab === 'READY' ? styles.activeTab : ''}`}
          onClick={() => setMobileTab('READY')}
        >
          Pronto ({readyOrders.length})
        </button>
      </div>

      <div className={styles.boardContainer}>
        {/* Coluna Pendentes */}
        <div className={`${styles.column} ${mobileTab !== 'PENDING' ? styles.hideOnMobile : ''}`}>
          <h2 className={styles.columnTitle}><span className={styles.dotPending}></span> Pendentes</h2>
          <div className={styles.columnContent}>
            {pendingOrders.map(order => (
              <div key={order.id} onClick={() => openModal(order)} style={{cursor: 'pointer'}}> 
                <OrderCard 
                  order={order} 
                  onAdvance={handleAdvanceOrder} 
                  onReject={handleRejectOrder} 
                />
              </div>
            ))}
            {pendingOrders.length === 0 && <p className={styles.emptyMsg}>Sem pedidos pendentes.</p>}
          </div>
        </div>

        {/* Coluna Em Preparo */}
        <div className={`${styles.column} ${mobileTab !== 'PROCESSING' ? styles.hideOnMobile : ''}`}>
          <h2 className={styles.columnTitle}><span className={styles.dotProcessing}></span> Em Preparo</h2>
          <div className={styles.columnContent}>
            {processingOrders.map(order => (
              <div key={order.id} onClick={() => openModal(order)} style={{cursor: 'pointer'}}>
                 <OrderCard 
                   order={order} 
                   onAdvance={handleAdvanceOrder} 
                   onReject={handleCancelProcessingOrder} 
                 />
              </div>
            ))}
             {processingOrders.length === 0 && <p className={styles.emptyMsg}>Cozinha vazia.</p>}
          </div>
        </div>

        {/* Coluna Pronto */}
        <div className={`${styles.column} ${mobileTab !== 'READY' ? styles.hideOnMobile : ''}`}>
          <h2 className={styles.columnTitle}><span className={styles.dotReady}></span> Pronto p/ Entrega</h2>
          <div className={styles.columnContent}>
            {readyOrders.map(order => (
              <div key={order.id} onClick={() => openModal(order)} style={{cursor: 'pointer'}}>
                <OrderCard 
                  order={order} 
                  onAdvance={handleAdvanceOrder} 
                />
              </div>
            ))}
             {readyOrders.length === 0 && <p className={styles.emptyMsg}>Nada para entregar.</p>}
          </div>
        </div>
      </div>

      <OrderModal 
        isOpen={!!selectedOrder}
        order={selectedOrder}
        onClose={closeModal}
        onAdvance={handleAdvanceOrder}
      />
    </>
  );
}