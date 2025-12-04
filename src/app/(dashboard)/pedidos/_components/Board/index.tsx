'use client';

import { useState } from 'react';
import { Order } from '@/types';
import OrderCard from '../OrderCard';
import OrderModal from '../OrderModal'; // <--- Importei o Modal
import styles from './styles.module.css';

interface BoardProps {
  initialOrders: Order[];
}

export default function Board({ initialOrders }: BoardProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  
  // Estado para controlar o modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleAdvanceOrder = (id: string) => {
    setOrders((prev) => prev.map(order => {
      if (order.id !== id) return order;
      if (order.status === 'PENDING') return { ...order, status: 'PROCESSING' };
      if (order.status === 'PROCESSING') return { ...order, status: 'READY' };
      if (order.status === 'READY') return { ...order, status: 'COMPLETED' };
      return order;
    }).filter(o => o.status !== 'COMPLETED'));
  };

  // Funções do Modal
  const openModal = (order: Order) => setSelectedOrder(order);
  const closeModal = () => setSelectedOrder(null);

  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const processingOrders = orders.filter(o => o.status === 'PROCESSING');
  const readyOrders = orders.filter(o => o.status === 'READY');

  return (
    <>
      <div className={styles.boardContainer}>
        {/* Adicionei a prop onClick no OrderCard */}
        <div className={styles.column}>
          <h2 className={styles.columnTitle}><span className={styles.dotPending}></span> Pendentes ({pendingOrders.length})</h2>
          <div className={styles.columnContent}>
            {pendingOrders.map(order => (
              <div key={order.id} onClick={() => openModal(order)} style={{cursor: 'pointer'}}> 
                <OrderCard order={order} onAdvance={(id) => {
                  // Impede que abra o modal se clicar direto no botão de avançar do card
                  handleAdvanceOrder(id);
                }} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.column}>
          <h2 className={styles.columnTitle}><span className={styles.dotProcessing}></span> Em Preparo ({processingOrders.length})</h2>
          <div className={styles.columnContent}>
            {processingOrders.map(order => (
              <div key={order.id} onClick={() => openModal(order)} style={{cursor: 'pointer'}}>
                <OrderCard order={order} onAdvance={handleAdvanceOrder} />
              </div>
            ))}
          </div>
        </div>

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

      {/* O Modal vive aqui, fora das colunas */}
      <OrderModal 
        isOpen={!!selectedOrder}
        order={selectedOrder}
        onClose={closeModal}
        onAdvance={handleAdvanceOrder}
      />
    </>
  );
}