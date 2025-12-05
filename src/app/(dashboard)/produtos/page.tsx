'use client';

import { useState, useEffect } from 'react';
import { Plus, Package, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabase'; 
import ProductList from './_components/ProductList';
import CategoryList from './_components/CategoryList';
import ProductModal from './_components/ProductModal';
import CategoryModal from './_components/CategoryModal';
import DeleteModal from './_components/DeleteModal';
import styles from './page.module.css';
import { Product, Category } from '@/types';

type Tab = 'products' | 'categories';

export default function ProdutosPage() {
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de Modais
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Estados de Edição
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // 1. Busca Categorias
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (catError) throw catError;
      if (catData) setCategories(catData);

      // 2. Busca Produtos com JOIN na categoria para pegar o nome
      // A sintaxe 'categories (name)' instrui o Supabase a buscar o campo 'name' da tabela relacionada
      const { data: prodData, error: prodError } = await supabase
        .from('products')
        .select('*, categories (name)') 
        .order('name');
      
      if (prodError) throw prodError;

      if (prodData) {
        // Mapeamos os dados para o formato que o front espera (flat object)
        const formattedProducts: Product[] = prodData.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          active: p.active,
          category_id: p.category_id, // UUID para lógica
          category: p.categories?.name || 'Sem Categoria' // Nome para exibição
        }));
        setProducts(formattedProducts);
      }

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  // --- SAVE PRODUTO ---
  const handleSaveProduct = async (formData: any) => {
    try {
      // Prepara o objeto para o banco (usando snake_case se necessário, mas seus campos parecem simples)
      const payload = {
        name: formData.name,
        price: formData.price,
        active: formData.active,
        category_id: formData.category_id // Importante: Enviando o UUID
      };

      if (editingItem) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert(payload);
        if (error) throw error;
      }
      fetchData(); // Recarrega tudo
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto. Verifique o console.');
    }
  };

  const toggleProductStatus = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    try {
      // Atualização Otimista (UI primeiro)
      setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
      
      const { error } = await supabase
        .from('products')
        .update({ active: !product.active })
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error(error);
      fetchData(); // Reverte se der erro
    }
  };

  // --- SAVE CATEGORIA ---
  const handleSaveCategory = async (data: any) => {
    try {
      if (editingItem) {
        await supabase.from('categories').update(data).eq('id', editingItem.id);
      } else {
        await supabase.from('categories').insert(data);
      }
      fetchData();
    } catch (error) {
      console.error('Erro category:', error);
      alert('Erro ao salvar categoria');
    }
  };

  const toggleCategoryStatus = async (id: string) => {
    const category = categories.find(c => c.id === id);
    if (!category) return;
    try {
      setCategories(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
      await supabase.from('categories').update({ active: !category.active }).eq('id', id);
    } catch (e) { console.error(e); }
  };

  // --- MODAL CONTROLS ---
  const openNew = () => {
    setEditingItem(null);
    if (activeTab === 'products') setIsProductModalOpen(true);
    else setIsCategoryModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item); 
    if (activeTab === 'products') setIsProductModalOpen(true);
    else setIsCategoryModalOpen(true);
  };

  const openDelete = (item: any) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    try {
      const table = activeTab === 'products' ? 'products' : 'categories';
      const { error } = await supabase.from(table).delete().eq('id', deletingItem.id);
      
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Erro delete:', error);
      alert('Não foi possível excluir. Se for uma categoria, verifique se há produtos vinculados a ela.');
    } finally {
      setIsDeleteOpen(false);
      setDeletingItem(null);
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Catálogo</h1>
          <p className={styles.subtitle}>Gerencie seus produtos e categorias</p>
        </div>
        <button className={styles.newBtn} onClick={openNew}>
          <Plus size={20} />
          {activeTab === 'products' ? 'Novo Produto' : 'Nova Categoria'}
        </button>
      </header>

      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tab} ${activeTab === 'products' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={18} /> Produtos
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'categories' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <Tag size={18} /> Categorias
        </button>
      </div>

      <section className={styles.content}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Carregando dados...</div>
        ) : (
          <>
            {activeTab === 'products' ? (
              <ProductList 
                products={products} 
                onEdit={openEdit} 
                onDelete={openDelete} 
                onToggleStatus={toggleProductStatus} 
              />
            ) : (
              <CategoryList 
                categories={categories} 
                onEdit={openEdit} 
                onDelete={openDelete} 
                onToggleStatus={toggleCategoryStatus} 
              />
            )}
          </>
        )}
      </section>

      {/* MODAIS */}
      <ProductModal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)} 
        onSave={handleSaveProduct} 
        initialData={editingItem}
        categories={categories} // Passamos as categorias carregadas
      />

      <CategoryModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
        onSave={handleSaveCategory} 
        initialData={editingItem} 
      />

      <DeleteModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={confirmDelete} 
        itemName={deletingItem?.name} 
      />
    </main>
  );
}