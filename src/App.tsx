import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { WhatsAppSimulator } from './components/WhatsAppSimulator';
import { StorefrontCatalog } from './components/StorefrontCatalog';
import { AdminDashboard } from './components/AdminDashboard';
import { MobileIntegrationGuide } from './components/MobileIntegrationGuide';
import { BotEngine } from './services/botEngine';
import { Order, OrderStatus, Product } from './types';
import { INITIAL_ORDERS, MOCK_PRODUCTS } from './data/mockCatalog';

export function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'storefront' | 'admin' | 'mobile-docs'>('simulator');
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  
  // Singleton BotEngine instance
  const botEngine = useMemo(() => new BotEngine(products, orders), []);

  // Synchronize products to bot engine whenever products change
  useEffect(() => {
    botEngine.updateProducts(products);
  }, [products, botEngine]);

  const handleOrderCreated = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleOrderViaWhatsApp = (product: Product) => {
    botEngine.processUserInput(product.name, `PROD_${product.id}`);
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={botEngine.getSession().cart.length}
        orderCount={orders.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'simulator' && (
          <WhatsAppSimulator
            botEngine={botEngine}
            onOrderCreated={handleOrderCreated}
            onNavigateToStore={() => setActiveTab('storefront')}
          />
        )}

        {activeTab === 'storefront' && (
          <StorefrontCatalog
            onOrderViaWhatsApp={handleOrderViaWhatsApp}
            cartCount={botEngine.getSession().cart.length}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            orders={orders}
            products={products}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onNavigateToSimulator={() => setActiveTab('simulator')}
          />
        )}

        {activeTab === 'mobile-docs' && (
          <MobileIntegrationGuide />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Geet Traders. WhatsApp Commerce & Automation Bot Engine.</p>
          <div className="flex space-x-4">
            <button onClick={() => setActiveTab('simulator')} className="hover:text-emerald-400">WhatsApp Simulator</button>
            <button onClick={() => setActiveTab('storefront')} className="hover:text-emerald-400">Storefront</button>
            <button onClick={() => setActiveTab('admin')} className="hover:text-emerald-400">Merchant Dashboard</button>
            <button onClick={() => setActiveTab('mobile-docs')} className="hover:text-emerald-400">Mobile API Docs</button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
