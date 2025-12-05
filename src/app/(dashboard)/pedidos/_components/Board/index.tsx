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

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  // --- NOTIFICAÇÃO PADRONIZADA ---
  // Adicionei 'ACCEPTED' no tipo
  const sendNotification = async (order: Order, type: 'READY' | 'REJECTED' | 'CANCELLED' | 'ACCEPTED') => {
    try {
      const itemsList = order.items.map(item => `${item.quantity}x ${item.name}`).join('\n');
      
      // Cabeçalho Padrão
      const header = `${order.partnerName} seu pedido #${order.id}`;
      
      // Mensagem Final baseada no tipo
      let footer = '';
      if (type === 'ACCEPTED') footer = 'Seu pedido foi aceito e já está sendo preparado!';
      if (type === 'READY') footer = 'Está pronto, venha retirar';
      if (type === 'REJECTED') footer = 'Seu pedido foi recusado pelo estabelecimento.';
      if (type === 'CANCELLED') footer = 'Seu pedido foi cancelado pelo estabelecimento.';

      // Monta a mensagem completa
      const messageBody = `${header}\n\n${itemsList}\n\n${footer}`;
      
      const rawPhone = order.partnerWhatsapp || '';
      const cleanPhone = rawPhone.replace(/\D/g, '');
      const finalPhone = `55${cleanPhone}`;

      // Dispara o Webhook
      await fetch('https://n8n-nexit-n8n.7rdajt.easypanel.host/webhook/notificacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telefone: finalPhone,
          mensagem: messageBody,
          loja: order.partnerName,
          pedido_id: order.id,
          status_evento: type 
        })
      });
    } catch (error) {
      console.error('Erro notificação:', error);
    }
  };

  // --- UPDATE NO BANCO ---
  const updateOrderStatus = async (id: string, newStatus: string) => { 
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', parseInt(id));

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar pedido no banco.');
    }
  };

  // --- AVANÇAR (PENDENTE -> PREPARO -> PRONTO -> CONCLUÍDO) ---
  const handleAdvanceOrder = (id: string) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    let nextStatus: OrderStatus | null = null;
    
    if (order.status === 'PENDING') nextStatus = 'PROCESSING';
    else if (order.status === 'PROCESSING') nextStatus = 'READY';
    else if (order.status === 'READY') nextStatus = 'COMPLETED';

    if (nextStatus) {
      setOrders(prev => prev.map(o => 
        o.id === id ? { ...o, status: nextStatus! } : o
      ).filter(o => o.status !== 'COMPLETED'));

      updateOrderStatus(id, nextStatus);

      // Notificações Automáticas
      if (nextStatus === 'PROCESSING') {
        sendNotification(order, 'ACCEPTED'); // <--- NOVA NOTIFICAÇÃO DE ACEITE
      }
      if (nextStatus === 'READY') {
        sendNotification(order, 'READY');
      }
    }
  };

  // --- RECUSAR (PENDENTE -> RECUSADO) ---
  const handleRejectOrder = (id: string) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    if (!confirm('Tem certeza que deseja RECUSAR este pedido?')) return;

    // Remove da tela
    setOrders(prev => prev.filter(o => o.id !== id));
    // Atualiza Banco
    updateOrderStatus(id, 'NOT_ACCEPTED');
    // Envia Notificação
    sendNotification(order, 'REJECTED');
  };

  // --- CANCELAR (PREPARO -> CANCELADO) ---
  const handleCancelProcessingOrder = (id: string) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    if (!confirm('Tem certeza que deseja CANCELAR este pedido em preparo?')) return;

    setOrders(prev => prev.filter(o => o.id !== id));
    updateOrderStatus(id, 'CANCELLED');
    sendNotification(order, 'CANCELLED');
  };

  const openModal = (order: Order) => setSelectedOrder(order);
  const closeModal = () => setSelectedOrder(null);

  // Ordenação
  const pendingOrders = orders
    .filter(o => o.status === 'PENDING')
    .sort((a, b) => parseInt(a.id) - parseInt(b.id)); 

  const processingOrders = orders
    .filter(o => o.status === 'PROCESSING')
    .sort((a, b) => parseInt(b.id) - parseInt(a.id)); 

  const readyOrders = orders
    .filter(o => o.status === 'READY')
    .sort((a, b) => parseInt(b.id) - parseInt(a.id)); 

  return (
    <>
      <div className={styles.boardContainer}>
        {/* Coluna Pendentes */}
        <div className={styles.column}>
          <h2 className={styles.columnTitle}><span className={styles.dotPending}></span> Pendentes ({pendingOrders.length})</h2>
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
          </div>
        </div>

        {/* Coluna Em Preparo */}
        <div className={styles.column}>
          <h2 className={styles.columnTitle}><span className={styles.dotProcessing}></span> Em Preparo ({processingOrders.length})</h2>
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
          </div>
        </div>

        {/* Coluna Pronto */}
        <div className={styles.column}>
          <h2 className={styles.columnTitle}><span className={styles.dotReady}></span> Pronto p/ Entrega ({readyOrders.length})</h2>
          <div className={styles.columnContent}>
            {readyOrders.map(order => (
              <div key={order.id} onClick={() => openModal(order)} style={{cursor: 'pointer'}}>
                <OrderCard order={order} onAdvance={handleAdvanceOrder} />
              </div>
            ))}
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