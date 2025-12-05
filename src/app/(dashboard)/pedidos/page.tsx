'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Board from './_components/Board';
import styles from './page.module.css';
import { Order } from '@/types';

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Função de busca (com opção silenciosa para não piscar a tela)
  const fetchOrders = async (forceLoading = true) => {
    try {
      if (forceLoading) setLoading(true);
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          total,
          status,
          partners ( name, whatsapp ), 
          order_items ( product_name, quantity, observation )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedOrders: Order[] = data.map((order: any) => ({
          id: order.id.toString(), 
          uuid: order.id.toString(),
          partnerName: order.partners?.name || 'Desconhecido',
          partnerWhatsapp: order.partners?.whatsapp || '',
          date: order.created_at,
          total: order.total,
          status: order.status,
          items: order.order_items.map((item: any) => ({
            name: item.product_name,
            quantity: item.quantity,
            observation: item.observation
          }))
        }));
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      if (forceLoading) setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Busca inicial (mostra loading)
    fetchOrders(true);

    // 2. Configura o POLLING (Get a cada 5 segundos)
    // Isso substitui o Realtime complexo por algo simples que funciona sempre
    const intervalId = setInterval(() => {
      // false = update silencioso (não mostra "Carregando..." na tela)
      fetchOrders(false); 
    }, 5000); // 5000ms = 5 segundos

    // Limpa o intervalo se o usuário sair da página (para não travar o pc)
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Monitor de Pedidos</h1>
          <p className={styles.subtitle}>Acompanhe o fluxo de produção em tempo real (Atualização a cada 5s).</p>
        </div>
      </header>

      <section className={styles.content}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            Carregando pedidos...
          </div>
        ) : (
          <Board initialOrders={orders} />
        )}
      </section>
    </main>
  );
}