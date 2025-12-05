'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import Header from './_components/Header';
import ProductCard from './_components/ProductCard';
import CartBar from './_components/CartBar';
import PartnerBottomNav from './_components/PartnerBottomNav';
import ProductDetailModal from './_components/ProductDetailModal';
import SuccessModal from './_components/SuccessModal'; // <--- IMPORT NOVO
import styles from './page.module.css';
import { useAuth } from '@/contexts/AuthContext';

export default function PedidosParceiroPage() {
  const { partnerId } = useAuth();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Record<string, { qty: number, obs: string }>>({}); 
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para os Modais
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSuccess, setShowSuccess] = useState(false); // <--- ESTADO NOVO

  // Função isolada para buscar produtos
  const fetchProducts = async (isBackgroundUpdate = false) => {
    if (!isBackgroundUpdate) setLoading(true);

    const { data } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('active', true)
      .order('name');

    if (data) {
      const formatted = data.map((p: any) => ({
        ...p,
        category: p.categories?.name || 'Geral'
      }));
      setProducts(formatted);
      
      if (!searchTerm) {
        setFilteredProducts(formatted);
      }
    }
    
    if (!isBackgroundUpdate) setLoading(false);
  };

  useEffect(() => {
    fetchProducts(); 
    const interval = setInterval(() => { fetchProducts(true); }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(products);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(lowerTerm) || 
        p.category.toLowerCase().includes(lowerTerm)
      );
      setFilteredProducts(filtered);
    }
  }, [products, searchTerm]);

  const handleSearch = (term: string) => setSearchTerm(term);
  const handleProductClick = (product: Product) => setSelectedProduct(product);

  const handleAddToCart = (qty: number, obs: string) => {
    if (!selectedProduct) return;
    setCart(prev => {
      if (qty === 0) {
        const newCart = { ...prev };
        delete newCart[selectedProduct.id];
        return newCart;
      }
      return { ...prev, [selectedProduct.id]: { qty, obs } };
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b.qty, 0);
  const totalPrice = products.reduce((total, product) => {
    const item = cart[product.id];
    return total + (product.price * (item?.qty || 0));
  }, 0);

  const handleCheckout = async () => {
    if (!partnerId) {
      alert('Erro: Parceiro não identificado. Faça login novamente.');
      return;
    }

    setSubmitting(true);
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          partner_id: partnerId,
          total: totalPrice,
          status: 'PENDING'
        })
        .select('id')
        .single();

      if (orderError) throw orderError;

      const orderItems = Object.entries(cart).map(([productId, item]) => {
        const product = products.find(p => p.id === productId);
        return {
          order_id: orderData.id,
          product_id: productId,
          product_name: product?.name || 'Item',
          price: product?.price || 0,
          quantity: item.qty,
          observation: item.obs
        };
      });

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // SUCESSO!
      setCart({}); // Limpa carrinho
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Sobe a tela
      setShowSuccess(true); // <--- ABRE O MODAL NOVO

    } catch (error) {
      console.error(error);
      alert('Erro ao enviar pedido.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header onSearch={handleSearch} />

      {loading ? (
        <div style={{padding: '2rem', textAlign: 'center', color: '#666'}}>Carregando...</div>
      ) : (
        <div className={styles.grid}>
          {filteredProducts.map(product => {
            const item = cart[product.id];
            const qty = item?.qty || 0;

            return (
              <ProductCard 
                key={product.id}
                product={product}
                quantity={qty}
                onClick={() => handleProductClick(product)}
              />
            );
          })}
        </div>
      )}

      <CartBar 
        total={totalPrice} 
        itemCount={totalItems} 
        onCheckout={handleCheckout} 
        loading={submitting} 
      />

      <PartnerBottomNav />

      {/* MODAL DE PRODUTO */}
      <ProductDetailModal 
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onConfirm={handleAddToCart}
        product={selectedProduct}
        initialQty={selectedProduct ? cart[selectedProduct.id]?.qty || 0 : 0}
        initialObs={selectedProduct ? cart[selectedProduct.id]?.obs || '' : ''}
      />

      {/* NOVO MODAL DE SUCESSO */}
      <SuccessModal 
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}