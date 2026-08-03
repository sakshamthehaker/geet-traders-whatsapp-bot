import React from 'react';
import { MessageSquare, ShoppingBag, LayoutDashboard, Smartphone, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'simulator' | 'storefront' | 'admin' | 'mobile-docs';
  setActiveTab: (tab: 'simulator' | 'storefront' | 'admin' | 'mobile-docs') => void;
  cartCount: number;
  orderCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  orderCount
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('simulator')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <MessageSquare className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">Geet Traders</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Bot Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">WhatsApp Clothing Commerce & Bot</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'simulator'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden md:inline">WhatsApp Bot</span>
              <span className="md:hidden">Bot</span>
            </button>

            <button
              onClick={() => setActiveTab('storefront')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 relative ${
                activeTab === 'storefront'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden md:inline">Storefront</span>
              <span className="md:hidden">Catalog</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-xs font-bold flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 relative ${
                activeTab === 'admin'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden md:inline flex items-center gap-1">Admin Dashboard 🔒</span>
              <span className="md:hidden">Admin 🔒</span>
              {orderCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-full text-xs border border-amber-500/30">
                  {orderCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('mobile-docs')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'mobile-docs'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden md:inline">Mobile App & API</span>
              <span className="md:hidden">Mobile</span>
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};
