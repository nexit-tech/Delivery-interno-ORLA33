import { redirect } from 'next/navigation';

export default function Home() {
  // Redirecionamento automático da raiz para a lista de pedidos
  redirect('/pedidos');
}