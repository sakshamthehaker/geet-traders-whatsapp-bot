import { Product, Category, Order } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'mink-blanket', name: 'mink-blanket', label: '🛏️ Mink Blanket', iconName: 'Layers', itemCount: 2 },
  { id: 'flannel', name: 'flannel', label: '🧵 Flannel Collection', iconName: 'Shirt', itemCount: 3 },
  { id: 'lohi', name: 'lohi', label: '🧣 Lohi (Pashmina/Wool)', iconName: 'Sparkles', itemCount: 4 },
  { id: 'bedsheets', name: 'bedsheets', label: '🛌 Bedsheets (Cotton/Blended)', iconName: 'ShoppingBag', itemCount: 2 },
];

export const MOCK_PRODUCTS: Product[] = [
  // 1. MINK BLANKET
  {
    id: 'prod-mink-1',
    name: 'Super Soft Premium Mink Blanket',
    category: 'mink-blanket',
    categoryLabel: 'Mink Blanket',
    price: 1499,
    originalPrice: 2499,
    sizes: ['Single Bed (S/B)', 'Double Bed (D/B)'],
    colors: [
      { name: 'Royal Blue', hex: '#1e3a8a' },
      { name: 'Maroon Red', hex: '#881337' },
      { name: 'Camel Brown', hex: '#78350f' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800',
    description: 'Ultra-plush heavyweight Mink Blanket designed for extreme warmth, buttery soft comfort, and winter durability. Available in Single Bed (S/B) and Double Bed (D/B).',
    inStock: true,
    stockCount: 50,
    featured: true,
    rating: 4.9,
    reviewsCount: 142
  },

  // 2. FLANNEL COLLECTION
  {
    id: 'prod-flannel-chader',
    name: 'Flannel Chader (Warm Winter Sheet)',
    category: 'flannel',
    categoryLabel: 'Flannel Collection',
    price: 799,
    originalPrice: 1199,
    sizes: ['Single Bed (S/B)', 'Double Bed (D/B)'],
    colors: [
      { name: 'Soft Cream', hex: '#fef3c7' },
      { name: 'Vintage Rose', hex: '#fda4af' },
      { name: 'Sky Blue', hex: '#7dd3fc' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800',
    description: 'Soft brushed Flannel Chader offering cozy, lightweight thermal insulation for cold nights. Available in S/B & D/B sizes.',
    inStock: true,
    stockCount: 65,
    featured: true,
    rating: 4.8,
    reviewsCount: 98
  },
  {
    id: 'prod-flannel-dohar',
    name: 'Flannel Reversible AC Dohar',
    category: 'flannel',
    categoryLabel: 'Flannel Collection',
    price: 999,
    originalPrice: 1499,
    sizes: ['Single Bed (S/B)', 'Double Bed (D/B)'],
    colors: [
      { name: 'Checkered Blue', hex: '#2563eb' },
      { name: 'Pastel Beige', hex: '#d97706' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
    description: '3-Layered breathable Flannel Dohar with cotton piping edges. Perfect for year-round AC comfort and winter layering.',
    inStock: true,
    stockCount: 40,
    featured: false,
    rating: 4.7,
    reviewsCount: 76
  },
  {
    id: 'prod-flannel-bedsheet',
    name: 'Flannel Warm Bedsheet Set (1 Bedsheet + 2 Pillow Covers)',
    category: 'flannel',
    categoryLabel: 'Flannel Collection',
    price: 1199,
    originalPrice: 1799,
    sizes: ['Single Bed (S/B)', 'Double Bed (D/B)'],
    colors: [
      { name: 'Navy Floral', hex: '#1e293b' },
      { name: 'Maroon Damask', hex: '#4c0519' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1540518614846-7ede433c517a?auto=format&fit=crop&q=80&w=800',
    description: 'Complete 1+2 Flannel Bedsheet set featuring 1 super-warm bedsheet and 2 matching pillow covers. Anti-shrink & pill-resistant.',
    inStock: true,
    stockCount: 35,
    featured: true,
    rating: 4.9,
    reviewsCount: 110
  },

  // 3. LOHI
  {
    id: 'prod-lohi-cream',
    name: 'Classic Cream Gents Lohi Shawl',
    category: 'lohi',
    categoryLabel: 'Lohi (Pashmina/Wool)',
    price: 899,
    originalPrice: 1299,
    sizes: ['Free Size'],
    colors: [
      { name: 'Cream', hex: '#fef08a' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800',
    description: 'Traditional Cream Woollen Lohi with refined border weave. Lightweight yet exceptionally warm.',
    inStock: true,
    stockCount: 55,
    featured: false,
    rating: 4.8,
    reviewsCount: 64
  },
  {
    id: 'prod-lohi-pashmina',
    name: 'Pashmina Feel Coloured Lohi',
    category: 'lohi',
    categoryLabel: 'Lohi (Pashmina/Wool)',
    price: 1299,
    originalPrice: 1999,
    sizes: ['Free Size'],
    colors: [
      { name: 'Pashmina Natural', hex: '#ca8a04' },
      { name: 'Walnut Brown', hex: '#451a03' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800',
    description: 'Luxury Pashmina-texture Lohi woven from ultra-fine yarn for a rich hand-feel and elegant draping.',
    inStock: true,
    stockCount: 30,
    featured: true,
    rating: 5.0,
    reviewsCount: 88
  },
  {
    id: 'prod-lohi-orange',
    name: 'Vibrant Orange Winter Lohi',
    category: 'lohi',
    categoryLabel: 'Lohi (Pashmina/Wool)',
    price: 899,
    originalPrice: 1299,
    sizes: ['Free Size'],
    colors: [
      { name: 'Orange', hex: '#ea580c' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=800',
    description: 'Rich Orange shade winter Lohi crafted with durable thermal weave.',
    inStock: true,
    stockCount: 25,
    featured: false,
    rating: 4.6,
    reviewsCount: 42
  },
  {
    id: 'prod-lohi-black',
    name: 'Royal Black Premium Lohi',
    category: 'lohi',
    categoryLabel: 'Lohi (Pashmina/Wool)',
    price: 949,
    originalPrice: 1399,
    sizes: ['Free Size'],
    colors: [
      { name: 'Black', hex: '#09090b' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
    description: 'Jet Black solid Gents Lohi with soft touch finish and classic selvedge border.',
    inStock: true,
    stockCount: 45,
    featured: true,
    rating: 4.9,
    reviewsCount: 95
  },

  // 4. BEDSHEETS
  {
    id: 'prod-bedsheet-cotton',
    name: 'Pure Cotton Printed Bedsheet Set',
    category: 'bedsheets',
    categoryLabel: 'Bedsheets (Cotton/Blended)',
    price: 699,
    originalPrice: 999,
    sizes: ['Single Bed (S/B)', 'Double Bed (D/B)'],
    colors: [
      { name: 'Indigo Mandala', hex: '#1d4ed8' },
      { name: 'Floral Yellow', hex: '#eab308' },
      { name: 'Sage Green', hex: '#15803d' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800',
    description: '100% Pure Cotton breathable bedsheet with high thread count. Soft, skin-friendly, and color-fast. Available in S/B & D/B.',
    inStock: true,
    stockCount: 80,
    featured: true,
    rating: 4.8,
    reviewsCount: 156
  },
  {
    id: 'prod-bedsheet-blended',
    name: 'Cotton Blended Easy-Care Bedsheet',
    category: 'bedsheets',
    categoryLabel: 'Bedsheets (Cotton/Blended)',
    price: 499,
    originalPrice: 799,
    sizes: ['Single Bed (S/B)', 'Double Bed (D/B)'],
    colors: [
      { name: 'Geometric Grey', hex: '#475569' },
      { name: 'Maroon Stripe', hex: '#991b1b' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1582582621959-48d273528920?auto=format&fit=crop&q=80&w=800',
    description: 'Wrinkle-resistant Cotton Blended bedsheet set. Quick dry, highly durable, and affordable for everyday use.',
    inStock: true,
    stockCount: 90,
    featured: false,
    rating: 4.7,
    reviewsCount: 84
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-701',
    customerName: 'Suresh Kumar',
    customerPhone: '+91 98123 45678',
    items: [
      {
        id: 'cart-1',
        product: MOCK_PRODUCTS[0],
        selectedSize: 'Double Bed (D/B)',
        selectedColor: MOCK_PRODUCTS[0].colors[0],
        quantity: 1
      }
    ],
    subtotal: 1499,
    deliveryFee: 0,
    discount: 50,
    totalAmount: 1449,
    shippingAddress: {
      fullName: 'Suresh Kumar',
      phone: '+91 98123 45678',
      addressLine: 'Shop 14, Main Market, Ludhiana',
      city: 'Ludhiana',
      pincode: '141001'
    },
    paymentMethod: 'upi',
    status: 'shipped',
    createdAt: '2026-08-03T09:30:00Z',
    trackingNumber: 'TRK-GEET-99128'
  },
  {
    id: 'ORD-702',
    customerName: 'Priya Sharma',
    customerPhone: '+91 97654 32109',
    items: [
      {
        id: 'cart-2',
        product: MOCK_PRODUCTS[5],
        selectedSize: 'Free Size',
        selectedColor: MOCK_PRODUCTS[5].colors[0],
        quantity: 2
      }
    ],
    subtotal: 2598,
    deliveryFee: 0,
    discount: 100,
    totalAmount: 2498,
    shippingAddress: {
      fullName: 'Priya Sharma',
      phone: '+91 97654 32109',
      addressLine: 'H.No 45, Sector 15',
      city: 'Chandigarh',
      pincode: '160015'
    },
    paymentMethod: 'cod',
    status: 'processing',
    createdAt: '2026-08-03T10:45:00Z',
    trackingNumber: 'TRK-GEET-99129'
  }
];
