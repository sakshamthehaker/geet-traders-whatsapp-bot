import React, { useState } from 'react';
import { 
  Package, 
  TrendingUp, 
  Users, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  MessageSquare,
  Sparkles,
  Upload,
  Image as ImageIcon,
  X,
  Check
} from 'lucide-react';
import { Order, OrderStatus, Product, Size, ProductColor } from '../types';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onNavigateToSimulator: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  products,
  onUpdateOrderStatus,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onNavigateToSimulator
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    category: 'mink-blanket' | 'flannel' | 'lohi' | 'bedsheets';
    price: number;
    originalPrice: number;
    sizes: Size[];
    colorsText: string;
    imageUrl: string;
    description: string;
    stockCount: number;
  }>({
    name: '',
    category: 'mink-blanket',
    price: 999,
    originalPrice: 1499,
    sizes: ['Single Bed (S/B)', 'Double Bed (D/B)'],
    colorsText: 'Cream, Maroon, Blue',
    imageUrl: '',
    description: '',
    stockCount: 50
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Analytics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped' || o.status === 'delivered').length;

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customerPhone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'mink-blanket',
      price: 999,
      originalPrice: 1499,
      sizes: ['Single Bed (S/B)', 'Double Bed (D/B)'],
      colorsText: 'Royal Blue, Maroon Red, Soft Cream',
      imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800',
      description: 'High-quality winter bedding item by Geet Traders.',
      stockCount: 40
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || Math.round(product.price * 1.4),
      sizes: [...product.sizes],
      colorsText: product.colors.map(c => c.name).join(', '),
      imageUrl: product.imageUrl,
      description: product.description,
      stockCount: product.stockCount
    });
    setIsModalOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const categoryLabels: Record<string, string> = {
      'mink-blanket': 'Mink Blanket',
      'flannel': 'Flannel Collection',
      'lohi': 'Lohi (Pashmina/Wool)',
      'bedsheets': 'Bedsheets (Cotton/Blended)'
    };

    const parsedColors: ProductColor[] = formData.colorsText.split(',').map(c => {
      const name = c.trim();
      return { name: name || 'Standard Color', hex: '#2563eb' };
    });

    if (editingProduct) {
      const updatedProd: Product = {
        ...editingProduct,
        name: formData.name,
        category: formData.category,
        categoryLabel: categoryLabels[formData.category],
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        sizes: formData.sizes.length > 0 ? formData.sizes : ['Single Bed (S/B)'],
        colors: parsedColors,
        imageUrl: formData.imageUrl || editingProduct.imageUrl,
        description: formData.description,
        stockCount: Number(formData.stockCount)
      };
      onUpdateProduct(updatedProd);
      showToast(`Updated "${formData.name}" in Geet Traders catalog!`);
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: formData.name,
        category: formData.category,
        categoryLabel: categoryLabels[formData.category],
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        sizes: formData.sizes.length > 0 ? formData.sizes : ['Single Bed (S/B)'],
        colors: parsedColors,
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800',
        description: formData.description || 'Premium bedding product.',
        inStock: true,
        stockCount: Number(formData.stockCount),
        featured: true,
        rating: 5.0,
        reviewsCount: 1
      };
      onAddProduct(newProd);
      showToast(`Added "${formData.name}" to Geet Traders catalog!`);
    }

    setIsModalOpen(false);
  };

  const toggleSize = (size: Size) => {
    setFormData(prev => {
      const exists = prev.sizes.includes(size);
      if (exists) {
        return { ...prev, sizes: prev.sizes.filter(s => s !== size) };
      } else {
        return { ...prev, sizes: [...prev.sizes, size] };
      }
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case 'processing':
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Processing</span>;
      case 'shipped':
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1"><Truck className="w-3 h-3" /> Shipped</span>;
      case 'delivered':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'cancelled':
        return <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl shadow-2xl font-bold text-sm flex items-center space-x-2 animate-bounce">
          <Check className="w-5 h-5 stroke-[3]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span>Geet Traders Merchant Admin</span>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/30 font-semibold">
              Live Catalog & Order Control
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Add new products, upload images, set prices/sizes, and manage WhatsApp orders in real-time.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleOpenAddModal}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Add New Item</span>
          </button>

          <button
            onClick={onNavigateToSimulator}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition flex items-center space-x-2 border border-slate-700"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Launch Bot Simulator</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Sales</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-white">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-emerald-400 mt-1 font-medium">From {orders.length} WhatsApp Orders</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Orders</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-white">{pendingOrders}</p>
          <p className="text-xs text-amber-400 mt-1 font-medium">Requires Merchant Dispatch</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Shipments</span>
            <Truck className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-white">{shippedOrders}</p>
          <p className="text-xs text-purple-400 mt-1 font-medium">Delivered / Shipped</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Catalog</span>
            <Package className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-3xl font-black text-white">{products.length}</p>
          <p className="text-xs text-teal-400 mt-1 font-medium">Bedding & Textile Items Listed</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center border-b border-slate-800 mb-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition ${
            activeTab === 'orders'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          📦 WhatsApp Customer Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition ${
            activeTab === 'inventory'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          🛏️ Catalog & Item Manager ({products.length})
        </button>
      </div>

      {/* ORDERS TAB CONTENT */}
      {activeTab === 'orders' && (
        <div>
          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name or Phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 text-white placeholder-slate-400 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-800 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
              >
                <option value="all">All Order Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/90 text-xs uppercase text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-bold">Order ID</th>
                    <th className="px-6 py-4 font-bold">Customer Details</th>
                    <th className="px-6 py-4 font-bold">Bedding Items</th>
                    <th className="px-6 py-4 font-bold">Amount & Payment</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        No WhatsApp orders found. Use the simulator to place a test order!
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-700/30 transition">
                        <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                          {order.id}
                          <p className="text-[11px] text-slate-500 font-sans">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-bold text-white">{order.customerName}</p>
                          <p className="text-xs text-slate-400">{order.customerPhone}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{order.shippingAddress.addressLine}</p>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="text-xs flex items-center gap-2">
                                <span className="font-semibold text-slate-200">{it.product.name}</span>
                                <span className="bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded text-[10px]">{it.selectedSize}</span>
                                <span className="text-slate-400">x{it.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-black text-white">₹{order.totalAmount}</p>
                          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                            {order.paymentMethod}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {getStatusBadge(order.status)}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <select
                            value={order.status}
                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="bg-slate-900 text-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CATALOG & ITEM MANAGER TAB CONTENT */}
      {activeTab === 'inventory' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Active Geet Traders Catalog Items</h2>
            <button
              onClick={handleOpenAddModal}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/40 transition">
                <div>
                  <div className="flex gap-4">
                    <img src={product.imageUrl} alt={product.name} className="w-24 h-24 rounded-xl object-cover bg-slate-900 shrink-0 border border-slate-700" />
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {product.categoryLabel}
                      </span>
                      <h3 className="font-bold text-white text-sm mt-1 leading-snug">{product.name}</h3>
                      <div className="mt-1 flex items-baseline space-x-2">
                        <span className="text-emerald-400 font-extrabold text-base">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-slate-500 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs space-y-1">
                    <p className="text-slate-400 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-1 flex-wrap pt-1">
                      <span className="text-slate-400">Sizes:</span>
                      {product.sizes.map(s => (
                        <span key={s} className="bg-slate-900 text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-700">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-700/60 pt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-300">Stock: <strong className="text-white">{product.stockCount} units</strong></span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition"
                      title="Edit Item"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Remove "${product.name}" from catalog?`)) {
                          onDeleteProduct(product.id);
                          showToast(`Removed "${product.name}"`);
                        }
                      }}
                      className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white p-2 rounded-lg transition border border-rose-500/30"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>{editingProduct ? 'Edit Catalog Item' : 'Add New Item to Geet Traders Catalog'}</span>
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5">
              
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Product Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Heavyweight Mink Blanket Double Bed (D/B)"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-800 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Category & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full bg-slate-800 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="mink-blanket">🛏️ Mink Blanket</option>
                    <option value="flannel">🧵 Flannel (Chader/Dohar/Bedsheet)</option>
                    <option value="lohi">🧣 Lohi (Pashmina/Wool)</option>
                    <option value="bedsheets">🛌 Bedsheets (Cotton/Blended)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Available Stock Count</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.stockCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, stockCount: Number(e.target.value) }))}
                    className="w-full bg-slate-800 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Price & MRP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full bg-slate-800 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Original Price / MRP (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                    className="w-full bg-slate-800 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Sizes Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Available Sizes *</label>
                <div className="flex flex-wrap gap-3">
                  {(['Single Bed (S/B)', 'Double Bed (D/B)', 'Free Size'] as Size[]).map((sz) => {
                    const isChecked = formData.sizes.includes(sz);
                    return (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => toggleSize(sz)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                          isChecked ? 'bg-emerald-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        <span>{sz}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Color Options (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g., Cream, Royal Blue, Maroon Red, Black"
                  value={formData.colorsText}
                  onChange={(e) => setFormData(prev => ({ ...prev, colorsText: e.target.value }))}
                  className="w-full bg-slate-800 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Photo Upload & URL */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Product Photo</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  
                  {/* File Upload Input */}
                  <label className="col-span-1 bg-slate-800 hover:bg-slate-700 text-slate-200 p-3 rounded-xl border border-dashed border-slate-600 cursor-pointer text-xs font-bold flex flex-col items-center justify-center space-y-1">
                    <Upload className="w-5 h-5 text-emerald-400" />
                    <span>Upload Photo</span>
                    <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                  </label>

                  {/* URL Input */}
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Or paste image URL (https://...)"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="w-full bg-slate-800 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Photo Preview Box */}
                {formData.imageUrl && (
                  <div className="mt-3 relative w-32 h-32 rounded-xl overflow-hidden bg-slate-950 border border-slate-700">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-emerald-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.5 rounded">
                      Preview
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Product Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe material, warmth, fabric blend, and care instructions..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-800 text-white text-sm p-4 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="border-t border-slate-800 pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{editingProduct ? 'Save Changes' : 'Add Item to Catalog'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
