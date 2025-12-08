export type OrderStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'COMPLETED' | 'NOT_ACCEPTED' | 'CANCELLED';

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

// ESTA É A PARTE QUE ESTAVA FALTANDO OU NÃO FOI ENVIADA
export interface Product {
  id: string;
  name: string;
  price: number;
  active: boolean;
  category: string;      // Nome da categoria (para exibir na lista)
  category_id?: string;  // ID da categoria (para salvar no banco)
}

export interface Partner {
  id: string;
  name: string;
  whatsapp: string;
  login: string;
  password: string;
}