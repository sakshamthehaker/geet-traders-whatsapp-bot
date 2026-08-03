export type Size = 'Single Bed (S/B)' | 'Double Bed (D/B)' | 'Free Size' | 'S/B' | 'D/B';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'mink-blanket' | 'flannel' | 'lohi' | 'bedsheets';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  sizes: Size[];
  colors: ProductColor[];
  imageUrl: string;
  description: string;
  inStock: boolean;
  stockCount: number;
  featured?: boolean;
  rating: number;
  reviewsCount: number;
}

export interface Category {
  id: string;
  name: string;
  label: string;
  iconName: string;
  itemCount: number;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: Size;
  selectedColor: ProductColor;
  quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'upi' | 'card';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  pincode: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  trackingNumber: string;
  whatsappMessageId?: string;
}

export interface QuickButton {
  id: string;
  title: string;
  payload: string;
  icon?: string;
}

export interface InteractiveCard {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  imageUrl: string;
  badge?: string;
  payload: string;
}

export type Sender = 'user' | 'bot' | 'system';

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  timestamp: string;
  buttons?: QuickButton[];
  cards?: InteractiveCard[];
  imageUrl?: string;
  productHighlight?: Product;
  orderSummary?: Order;
  interactiveType?: 'text' | 'buttons' | 'catalog_cards' | 'order_receipt' | 'image';
}

export type BotFlowStep = 
  | 'IDLE'
  | 'MAIN_MENU'
  | 'BROWSE_CATEGORIES'
  | 'VIEW_PRODUCTS'
  | 'PRODUCT_DETAILS'
  | 'SELECT_SIZE'
  | 'SELECT_COLOR'
  | 'VIEW_CART'
  | 'ENTER_ADDRESS_NAME'
  | 'ENTER_ADDRESS_DETAILS'
  | 'ENTER_ADDRESS_PINCODE'
  | 'SELECT_PAYMENT'
  | 'ORDER_CONFIRMED'
  | 'TRACK_ORDER_INPUT'
  | 'HUMAN_SUPPORT';

export interface BotSession {
  phoneNumber: string;
  currentStep: BotFlowStep;
  activeCategory?: string;
  selectedProduct?: Product;
  selectedSize?: Size;
  selectedColor?: ProductColor;
  cart: CartItem[];
  shippingAddressDraft: Partial<ShippingAddress>;
  lastOrder?: Order;
}
