export type OrderStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'COMPLETED';

export interface OrderItem {
  name: string;
  quantity: number;
  observation?: string;
}

export interface Order {
  id: string;
  partnerName: string;
  date: string; // ISO string
  items: OrderItem[];
  total: number;
  status: OrderStatus;
}

export interface Category {
  id: string;
  name: string;
  active: boolean;
}

export interface Partner {
  id: string;
  name: string;
  whatsapp: string;
  login: string;
  password: string; // Exibição direta conforme solicitado
}