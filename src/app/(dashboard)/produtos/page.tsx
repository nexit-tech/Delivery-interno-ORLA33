'use client';

import { useState, useEffect } from 'react';
import { Plus, Package, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient'; 
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
  const [products, setProducts] = useState<any[]>([]); // Usando any[] para flexibilidade com o join
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de Modais
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // PRODUTOS: Faz o JOIN para trazer o nome da categoria
      const { data: prodData, error: prodError } = await supabase
        .from('products')
        .select('*, categories (name)') // <--- O PULO DO GATO AQUI
        .order('name');
      
      if (prodError) throw prodError;

      // CATEGORIAS
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (catError) throw catError;

      if (prodData) {
        // Transformamos os dados para o formato que a Tabela espera
        const formattedProducts = prodData.map((p: any) => ({
          ...p,
          // Se categories existe (o join funcionou), pega o nome. Senão, 'Sem Categoria'
          category: p.categories?.name || 'Sem categoria',
          // Mantemos o category_id original para edição
          category_id: p.category_id 
        }));
        setProducts(formattedProducts);
      }

      if (catData) setCategories(catData);

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  // --- SAVE PRODUTO ---
  const handleSaveProduct = async (formData: any) => {
    try {
      // Prepara o objeto exatamente como o banco espera
      const payload = {
        name: formData.name,
        price: formData.price,
        active: formData.active,
        category_id: formData.category_id // Manda o UUID
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
      fetchData(); // Recarrega para atualizar a lista
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto. Verifique o console.');
    }
  };

  const toggleProductStatus = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    try {
      await supabase.from('products').update({ active: !product.active }).eq('id', id);
      // Atualiza localmente otimista
      setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
    } catch (error) { console.error(error); }
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
      await supabase.from('categories').update({ active: !category.active }).eq('id', id);
      setCategories(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
    } catch (e) { console.error(e); }
  };

  // --- MODAIS ---
  const openNew = () => {
    setEditingItem(null);
    if (activeTab === 'products') setIsProductModalOpen(true);
    else setIsCategoryModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item); // O item já tem category_id graças à nossa formatação no fetchData
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
      alert('Erro ao excluir (verifique se a categoria tem produtos vinculados!)');
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

      <ProductModal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)} 
        onSave={handleSaveProduct} 
        initialData={editingItem}
        categories={categories} 
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