import Link from 'next/link';
import { Order } from '@/types';
import styles from './OrdersTable.module.css';

interface OrdersTableProps {
  orders: Order[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  
  // Função auxiliar para formatar status (pode virar componente depois)
  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      PENDING: 'Pendente',
      PROCESSING: 'Em Preparo',
      COMPLETED: 'Concluído',
      CANCELLED: 'Cancelado'
    };
    return map[status] || status;
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID do Pedido</th>
            <th>Parceiro</th>
            <th>Data</th>
            <th>Qtd. Itens</th>
            <th>Total</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className={styles.idColumn}>#{order.id}</td>
              <td>{order.partnerName}</td>
              <td>{new Date(order.date).toLocaleDateString('pt-BR')}</td>
              <td>{order.itemsCount}</td>
              <td className={styles.totalColumn}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
              </td>
              <td>
                <span className={`${styles.badge} ${styles[order.status.toLowerCase()]}`}>
                  {getStatusLabel(order.status)}
                </span>
              </td>
              <td>
                <Link href={`/pedidos/${order.id}`} className={styles.linkAction}>
                  Ver detalhes
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}