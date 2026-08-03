import React, { useState } from 'react';
import { ShoppingBag, MessageSquare, Filter, Star, ExternalLink, Sparkles, Check } from 'lucide-react';
import { Product, Size } from '../types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mockCatalog';
import { generateWhatsAppDeepLink } from '../services/mobileApiServer';

interface StorefrontCatalogProps {
  onOrderViaWhatsApp: (product: Product) => void;
  cartCount: number;
}

export const StorefrontCatalog: React.FC<StorefrontCatalogProps> = ({
  onOrderViaWhatsApp,
  cartCount
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const filteredProducts = selectedCategory === 'all'
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter(p => p.category === selectedCategory);

  const handleCopyWhatsAppLink = (product: Product) => {
    const link = generateWhatsAppDeepLink({
      phoneNumber: '+919876543210',
      defaultMessage: `Hi Geet Traders! I'd like to order ${product.name} (₹${product.price})`
    });
    navigator.clipboard.writeText(link);
    setCopiedLink(product.id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/20 p-8 sm:p-12 mb-10 overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-0"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/30 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct WhatsApp Home Textile & Bedding Store</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Order Blankets, Flannel & Bedsheets via <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">WhatsApp</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg mb-6 leading-relaxed">
            No password required! Tap any Mink Blanket, Flannel Chader, Lohi, or Bedsheet to chat with Geet Traders WhatsApp Bot, pick Single Bed (S/B) or Double Bed (D/B), and place your order instantly.
          </p>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto custom-scrollbar pb-4 mb-8">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
            selectedCategory === 'all'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
          }`}
        >
          ✨ All Collections ({MOCK_PRODUCTS.length})
        </button>

        {MOCK_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat.id
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            {cat.label} ({cat.itemCount})
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div 
            key={product.id}
            className="group bg-slate-800/70 border border-slate-700/80 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-500/5"
          >
            <div>
              {/* Product Image & Badges */}
              <div className="relative h-72 bg-slate-900 overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {product.featured && (
                  <span className="absolute top-3 left-3 bg-emerald-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-md shadow">
                    🔥 BESTSELLER
                  </span>
                )}

                <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-xs font-semibold text-amber-300 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400">({product.reviewsCount})</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  {product.categoryLabel}
                </span>

                <h3 className="text-lg font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
                  {product.name}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Sizes Available */}
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-slate-400">Sizes:</span>
                  {product.sizes.map((sz) => (
                    <span key={sz} className="text-[11px] font-bold bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      {sz}
                    </span>
                  ))}
                </div>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-white">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-500 line-through">₹{product.originalPrice}</span>
                  )}
                  {product.originalPrice && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      SAVE 33%
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-5 pt-0 grid grid-cols-2 gap-2">
              <button
                onClick={() => onOrderViaWhatsApp(product)}
                className="col-span-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/20"
              >
                <MessageSquare className="w-4 h-4 fill-slate-950" />
                <span>Chat & Order</span>
              </button>

              <button
                onClick={() => handleCopyWhatsAppLink(product)}
                className="col-span-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 border border-slate-600"
              >
                {copiedLink === product.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>wa.me Link</span>
                  </>
                )}
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
