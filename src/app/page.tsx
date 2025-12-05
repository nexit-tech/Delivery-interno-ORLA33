import { redirect } from 'next/navigation';

export default function Home() {
  // Antes redirecionava para /pedidos, agora força o Login
  redirect('/login');
}