export type OrderStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'COMPLETED' | 'NOT_ACCEPTED';

export interface OrderItem {
  name: string;
  quantity: number;
  observation?: string;
  price?: number; 
}

export interface Order {
  id: string;
  uuid?: string;
  partnerName: string;
  partnerWhatsapp?: string;
  date: string;
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
  password: string;
}