import { 
  ChatMessage, 
  BotSession, 
  Product, 
  Size, 
  ProductColor, 
  CartItem, 
  Order, 
  OrderStatus 
} from '../types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mockCatalog';

export class BotEngine {
  private session: BotSession;
  private products: Product[];
  private orders: Order[];

  constructor(products: Product[] = MOCK_PRODUCTS, initialOrders: Order[] = []) {
    this.products = products;
    this.orders = initialOrders;
    this.session = this.getInitialSession();
  }

  public updateProducts(newProducts: Product[]) {
    this.products = newProducts;
  }

  public getInitialSession(): BotSession {
    return {
      phoneNumber: '+91 98765 00000',
      currentStep: 'MAIN_MENU',
      cart: [],
      shippingAddressDraft: {}
    };
  }

  public getSession(): BotSession {
    return this.session;
  }

  public resetSession(): ChatMessage[] {
    this.session = this.getInitialSession();
    return [this.generateWelcomeMessage()];
  }

  public generateWelcomeMessage(): ChatMessage {
    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      timestamp: this.getCurrentTimeString(),
      text: `👋 *Welcome to Geet Traders!* ✨\n\nYour trusted supplier for Premium Mink Blankets, Flannel Chaders & Dohars, Pashmina Lohis, and Pure Cotton Bedsheets (S/B & D/B).\n\nHow can we help you today? Select an option below to get started:`,
      interactiveType: 'buttons',
      buttons: [
        { id: 'btn-1', title: '🛍️ Browse Catalog', payload: 'BROWSE_ALL' },
        { id: 'btn-2', title: '📂 Categories', payload: 'SHOW_CATEGORIES' },
        { id: 'btn-3', title: '📦 Track Order', payload: 'TRACK_ORDER' }
      ]
    };
  }

  public processUserInput(userText: string, payload?: string): { messages: ChatMessage[]; createdOrder?: Order } {
    const text = userText.trim().toLowerCase();
    const activePayload = payload || text;

    // Global Command Overrides
    if (activePayload === 'MAIN_MENU' || activePayload === 'hi' || activePayload === 'hello' || activePayload === 'menu') {
      this.session.currentStep = 'MAIN_MENU';
      return { messages: [this.generateWelcomeMessage()] };
    }

    if (activePayload === 'SHOW_CATEGORIES' || text.includes('category') || text.includes('categories')) {
      return { messages: [this.generateCategoryListMessage()] };
    }

    if (activePayload === 'BROWSE_ALL' || text.includes('catalog') || text.includes('shop') || text.includes('browse')) {
      return { messages: [this.generateProductListMessage('All Trendy Clothing', this.products)] };
    }

    if (activePayload === 'VIEW_CART' || text === 'cart' || text.includes('basket')) {
      return { messages: [this.generateCartMessage()] };
    }

    if (activePayload === 'TRACK_ORDER' || text.includes('track')) {
      this.session.currentStep = 'TRACK_ORDER_INPUT';
      return {
        messages: [{
          id: `msg-${Date.now()}`,
          sender: 'bot',
          timestamp: this.getCurrentTimeString(),
          text: `🔍 *Track Your Order*\n\nPlease reply with your *Order ID* (e.g., \`ORD-9821\`) or tracking number:`
        }]
      };
    }

    if (activePayload === 'HUMAN_SUPPORT' || text.includes('human') || text.includes('agent') || text.includes('help')) {
      this.session.currentStep = 'HUMAN_SUPPORT';
      return {
        messages: [{
          id: `msg-${Date.now()}`,
          sender: 'bot',
          timestamp: this.getCurrentTimeString(),
          text: `👨‍💼 *Connecting to Human Support*\n\nOur customer care executive has been notified. They will respond to this WhatsApp chat shortly.\n\n_Operating hours: 9 AM - 9 PM IST_`,
          buttons: [
            { id: 'b-menu', title: '🔙 Back to Menu', payload: 'MAIN_MENU' }
          ]
        }]
      };
    }

    // Step-by-Step Flow Handlers
    if (activePayload.startsWith('CAT_')) {
      const categoryId = activePayload.replace('CAT_', '');
      const filtered = this.products.filter(p => p.category === categoryId);
      const catObj = MOCK_CATEGORIES.find(c => c.id === categoryId);
      return { messages: [this.generateProductListMessage(catObj ? catObj.label : 'Items', filtered)] };
    }

    if (activePayload.startsWith('PROD_')) {
      const productId = activePayload.replace('PROD_', '');
      const prod = this.products.find(p => p.id === productId);
      if (prod) {
        this.session.selectedProduct = prod;
        this.session.currentStep = 'SELECT_SIZE';
        return { messages: [this.generateProductDetailMessage(prod)] };
      }
    }

    if (activePayload.startsWith('SIZE_')) {
      const sizeSelected = activePayload.replace('SIZE_', '') as Size;
      this.session.selectedSize = sizeSelected;
      if (this.session.selectedProduct) {
        this.session.currentStep = 'SELECT_COLOR';
        return { messages: [this.generateColorPickerMessage(this.session.selectedProduct, sizeSelected)] };
      }
    }

    if (activePayload.startsWith('COLOR_')) {
      const colorName = activePayload.replace('COLOR_', '');
      if (this.session.selectedProduct && this.session.selectedSize) {
        const colorObj = this.session.selectedProduct.colors.find(c => c.name === colorName) || this.session.selectedProduct.colors[0];
        this.session.selectedColor = colorObj;

        // Add to Cart
        const cartItem: CartItem = {
          id: `cart-${Date.now()}`,
          product: this.session.selectedProduct,
          selectedSize: this.session.selectedSize,
          selectedColor: colorObj,
          quantity: 1
        };
        this.session.cart.push(cartItem);

        return {
          messages: [
            {
              id: `msg-${Date.now()}`,
              sender: 'bot',
              timestamp: this.getCurrentTimeString(),
              text: `✅ *Added to Cart!*\n\n👕 *${cartItem.product.name}*\n📏 Size: *${cartItem.selectedSize}*\n🎨 Color: *${cartItem.selectedColor.name}*\n💰 Price: *₹${cartItem.product.price}*\n\nWhat would you like to do next?`,
              buttons: [
                { id: 'b-cart', title: '🛒 View Cart (' + this.session.cart.length + ')', payload: 'VIEW_CART' },
                { id: 'b-more', title: '🛍️ Continue Shopping', payload: 'BROWSE_ALL' },
                { id: 'b-checkout', title: '💳 Checkout Now', payload: 'CHECKOUT' }
              ]
            }
          ]
        };
      }
    }

    if (activePayload === 'CHECKOUT' || activePayload === 'START_CHECKOUT') {
      if (this.session.cart.length === 0) {
        return {
          messages: [{
            id: `msg-${Date.now()}`,
            sender: 'bot',
            timestamp: this.getCurrentTimeString(),
            text: `🛒 *Your cart is currently empty!*\n\nBrowse our collection to add items:`,
            buttons: [
              { id: 'b-shop', title: '🛍️ Browse Catalog', payload: 'BROWSE_ALL' }
            ]
          }]
        };
      }

      this.session.currentStep = 'ENTER_ADDRESS_NAME';
      return {
        messages: [{
          id: `msg-${Date.now()}`,
          sender: 'bot',
          timestamp: this.getCurrentTimeString(),
          text: `📝 *Delivery Information*\n\nPlease reply with your *Full Name* for delivery:`
        }]
      };
    }

    // Address Collection State Machine
    if (this.session.currentStep === 'ENTER_ADDRESS_NAME') {
      this.session.shippingAddressDraft.fullName = userText;
      this.session.currentStep = 'ENTER_ADDRESS_DETAILS';
      return {
        messages: [{
          id: `msg-${Date.now()}`,
          sender: 'bot',
          timestamp: this.getCurrentTimeString(),
          text: `📍 Thanks *${userText}*!\n\nNow please type your *Complete Delivery Address* (House/Flat No, Street, Landmark, City):`
        }]
      };
    }

    if (this.session.currentStep === 'ENTER_ADDRESS_DETAILS') {
      this.session.shippingAddressDraft.addressLine = userText;
      this.session.currentStep = 'ENTER_ADDRESS_PINCODE';
      return {
        messages: [{
          id: `msg-${Date.now()}`,
          sender: 'bot',
          timestamp: this.getCurrentTimeString(),
          text: `📮 Great! Finally, please reply with your *6-digit Pincode*:`
        }]
      };
    }

    if (this.session.currentStep === 'ENTER_ADDRESS_PINCODE') {
      const pin = userText.replace(/\D/g, '').slice(0, 6);
      this.session.shippingAddressDraft.pincode = pin || '400001';
      this.session.shippingAddressDraft.city = 'Mumbai';
      this.session.shippingAddressDraft.phone = this.session.phoneNumber;
      this.session.currentStep = 'SELECT_PAYMENT';

      return {
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'bot',
            timestamp: this.getCurrentTimeString(),
            text: `💳 *Select Payment Method*\n\n📍 *Shipping to:*\n${this.session.shippingAddressDraft.fullName}\n${this.session.shippingAddressDraft.addressLine}, Pincode: ${this.session.shippingAddressDraft.pincode}\n\nChoose payment option:`,
            buttons: [
              { id: 'pay-upi', title: '⚡ Instant UPI / QR', payload: 'PAY_UPI' },
              { id: 'pay-cod', title: '💵 Cash on Delivery (COD)', payload: 'PAY_COD' },
              { id: 'pay-card', title: '💳 Credit/Debit Card', payload: 'PAY_CARD' }
            ]
          }
        ]
      };
    }

    if (activePayload.startsWith('PAY_')) {
      const payMethod = activePayload.replace('PAY_', '').toLowerCase() as 'upi' | 'cod' | 'card';
      const createdOrder = this.finalizeOrder(payMethod);
      this.session.lastOrder = createdOrder;
      this.session.currentStep = 'ORDER_CONFIRMED';
      this.session.cart = [];

      return {
        createdOrder,
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'bot',
            timestamp: this.getCurrentTimeString(),
            text: `🎉 *ORDER CONFIRMED!* 🎉\n\nThank you for shopping with *Geet Traders*! Your order has been placed successfully.\n\n🆔 *Order ID:* \`${createdOrder.id}\`
💰 *Total Paid/Due:* ₹${createdOrder.totalAmount}
📦 *Status:* Processing
🚚 *Estimated Delivery:* 3-5 Business Days\n\nTracking Code: \`${createdOrder.trackingNumber}\``,
            interactiveType: 'order_receipt',
            orderSummary: createdOrder,
            buttons: [
              { id: 'b-track', title: '📍 Track Shipment', payload: 'TRACK_ORDER' },
              { id: 'b-menu', title: '🛍️ Shop More', payload: 'MAIN_MENU' }
            ]
          }
        ]
      };
    }

    if (this.session.currentStep === 'TRACK_ORDER_INPUT') {
      const orderIdQuery = userText.trim().toUpperCase();
      const foundOrder = this.orders.find(o => o.id.toUpperCase() === orderIdQuery || o.trackingNumber.toUpperCase() === orderIdQuery) || this.session.lastOrder;

      if (foundOrder) {
        return {
          messages: [{
            id: `msg-${Date.now()}`,
            sender: 'bot',
            timestamp: this.getCurrentTimeString(),
            text: `📦 *Order Tracking Details*\n\n🆔 *Order ID:* \`${foundOrder.id}\`
👤 *Customer:* ${foundOrder.customerName}
📊 *Current Status:* *${foundOrder.status.toUpperCase()}*
🚚 *Tracking No:* \`${foundOrder.trackingNumber}\`
💰 *Amount:* ₹${foundOrder.totalAmount} (${foundOrder.paymentMethod.toUpperCase()})\n\nAddress: ${foundOrder.shippingAddress.addressLine}`,
            buttons: [
              { id: 'b-menu', title: '🔙 Main Menu', payload: 'MAIN_MENU' }
            ]
          }]
        };
      } else {
        return {
          messages: [{
            id: `msg-${Date.now()}`,
            sender: 'bot',
            timestamp: this.getCurrentTimeString(),
            text: `❌ Could not find an order with ID \`${userText}\`.\n\nPlease double check your Order ID or select an option below:`,
            buttons: [
              { id: 'b-menu', title: '🔙 Main Menu', payload: 'MAIN_MENU' },
              { id: 'b-human', title: '👨‍💼 Speak to Agent', payload: 'HUMAN_SUPPORT' }
            ]
          }]
        };
      }
    }

    // Default Fallback
    return {
      messages: [{
        id: `msg-${Date.now()}`,
        sender: 'bot',
        timestamp: this.getCurrentTimeString(),
        text: `🤖 I'm sorry, I didn't quite catch that. Here is what I can help you with:`,
        buttons: [
          { id: 'b-cat', title: '🛍️ Browse Catalog', payload: 'BROWSE_ALL' },
          { id: 'b-categories', title: '📂 Categories', payload: 'SHOW_CATEGORIES' },
          { id: 'b-track', title: '📦 Track Order', payload: 'TRACK_ORDER' }
        ]
      }]
    };
  }

  private generateCategoryListMessage(): ChatMessage {
    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      timestamp: this.getCurrentTimeString(),
      text: `📂 *Explore Clothing Categories*\n\nSelect a category to view items:`,
      interactiveType: 'buttons',
      buttons: MOCK_CATEGORIES.map(cat => ({
        id: `btn-cat-${cat.id}`,
        title: `${cat.label} (${cat.itemCount})`,
        payload: `CAT_${cat.id}`
      }))
    };
  }

  private generateProductListMessage(title: string, items: Product[]): ChatMessage {
    const cards: Array<any> = items.map(p => ({
      id: p.id,
      title: p.name,
      subtitle: `${p.sizes.join(', ')} • ${p.categoryLabel}`,
      price: `₹${p.price} ${p.originalPrice ? `(~₹${p.originalPrice}~)` : ''}`,
      imageUrl: p.imageUrl,
      badge: p.featured ? '🔥 BESTSELLER' : undefined,
      payload: `PROD_${p.id}`
    }));

    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      timestamp: this.getCurrentTimeString(),
      text: `✨ *${title}* (${items.length} items available)\n\nTap on any item below to view full details, size chart, & order:`,
      interactiveType: 'catalog_cards',
      cards,
      buttons: [
        { id: 'b-menu', title: '🔙 Main Menu', payload: 'MAIN_MENU' }
      ]
    };
  }

  private generateProductDetailMessage(product: Product): ChatMessage {
    const text = `👕 *${product.name.toUpperCase()}*\n\n` +
      `💰 *Price:* ₹${product.price} ${product.originalPrice ? `_(MRP ₹${product.originalPrice} - 33% OFF)_` : ''}\n` +
      `⭐️ *Rating:* ${product.rating} / 5.0 (${product.reviewsCount} reviews)\n` +
      `📦 *Stock:* ${product.stockCount > 0 ? 'In Stock (Ready to dispatch)' : 'Out of Stock'}\n\n` +
      `📝 *Description:*\n${product.description}\n\n` +
      `📏 *Available Sizes:* ${product.sizes.join(', ')}\n` +
      `🎨 *Colors:* ${product.colors.map(c => c.name).join(', ')}\n\n` +
      `👇 *Step 1: Select your size:*`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      timestamp: this.getCurrentTimeString(),
      text,
      imageUrl: product.imageUrl,
      productHighlight: product,
      interactiveType: 'buttons',
      buttons: product.sizes.map(size => ({
        id: `btn-size-${size}`,
        title: `${size}`,
        payload: `SIZE_${size}`
      }))
    };
  }

  private generateColorPickerMessage(product: Product, selectedSize: Size): ChatMessage {
    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      timestamp: this.getCurrentTimeString(),
      text: `🎨 *Step 2: Choose Color Variant for ${product.name} (Size ${selectedSize}):*`,
      buttons: product.colors.map(color => ({
        id: `btn-col-${color.name}`,
        title: `🎨 ${color.name}`,
        payload: `COLOR_${color.name}`
      }))
    };
  }

  public generateCartMessage(): ChatMessage {
    if (this.session.cart.length === 0) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        timestamp: this.getCurrentTimeString(),
        text: `🛒 *Your Cart is Empty*\n\nExplore our catalog to add items:`,
        buttons: [
          { id: 'b-shop', title: '🛍️ Browse Catalog', payload: 'BROWSE_ALL' }
        ]
      };
    }

    let subtotal = 0;
    const itemsListText = this.session.cart.map((item, idx) => {
      subtotal += item.product.price * item.quantity;
      return `${idx + 1}. *${item.product.name}*\n   Size: ${item.selectedSize} | Color: ${item.selectedColor.name}\n   Qty: ${item.quantity} x ₹${item.product.price} = *₹${item.product.price * item.quantity}*`;
    }).join('\n\n');

    const deliveryFee = subtotal >= 1500 ? 0 : 99;
    const total = subtotal + deliveryFee;

    const summaryText = `🛒 *YOUR SHOPPING CART*\n\n${itemsListText}\n\n` +
      `───────────────\n` +
      `Subtotal: ₹${subtotal}\n` +
      `Shipping: ${deliveryFee === 0 ? 'FREE 🎉' : `₹${deliveryFee}`}\n` +
      `💵 *TOTAL AMOUNT:* *₹${total}*\n\n` +
      `Ready to place your order?`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      timestamp: this.getCurrentTimeString(),
      text: summaryText,
      buttons: [
        { id: 'b-checkout', title: '💳 Proceed to Checkout', payload: 'START_CHECKOUT' },
        { id: 'b-more', title: '🛍️ Add More Items', payload: 'BROWSE_ALL' }
      ]
    };
  }

  private finalizeOrder(paymentMethod: 'upi' | 'cod' | 'card'): Order {
    let subtotal = 0;
    this.session.cart.forEach(item => subtotal += item.product.price * item.quantity);
    const deliveryFee = subtotal >= 1500 ? 0 : 99;
    const totalAmount = subtotal + deliveryFee;

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: this.session.shippingAddressDraft.fullName || 'Valued Customer',
      customerPhone: this.session.phoneNumber,
      items: [...this.session.cart],
      subtotal,
      deliveryFee,
      discount: 0,
      totalAmount,
      shippingAddress: {
        fullName: this.session.shippingAddressDraft.fullName || 'Valued Customer',
        phone: this.session.phoneNumber,
        addressLine: this.session.shippingAddressDraft.addressLine || 'Address provided via WhatsApp',
        city: this.session.shippingAddressDraft.city || 'Mumbai',
        pincode: this.session.shippingAddressDraft.pincode || '400001'
      },
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
      trackingNumber: `TRK-WA-${Math.floor(100000 + Math.random() * 900000)}`
    };

    this.orders.unshift(newOrder);
    return newOrder;
  }

  private getCurrentTimeString(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
