# 🛏️ Geet Traders - WhatsApp Chatbot & Admin Commerce System

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)

A full-stack **WhatsApp Commerce Chatbot & Merchant Admin System** designed for **Geet Traders** (Home Textiles & Bedding Business). Customers can chat, browse catalog items, pick sizes (Single Bed S/B, Double Bed D/B), enter delivery addresses, and place orders directly over WhatsApp.

---

## ✨ Features

### 1. 📱 Interactive WhatsApp Simulator
- **Live Conversation Engine**: Greetings, category browsing, variant pickers, live cart calculations, delivery address intake, payment method choice (COD, UPI, Card), and instant order receipts.
- **Device Frames**: Toggle between Smartphone frame view and Desktop web view.
- **Rich WhatsApp UI**: Quick-reply buttons, catalog carousels, typing indicators, double blue checkmarks, and celebratory confetti upon order placement.
- **Order Tracking**: Enter Order ID (e.g. `ORD-701`) to fetch real-time shipment status.

### 2. 📊 Merchant Admin Dashboard & Inventory Manager
- **Product & Photo Management**: Add new items, upload photos (local file upload or image URL), set selling price & MRP, choose available sizes (`S/B`, `D/B`, `Free Size`), and manage stock quantities.
- **Real-time WhatsApp Sync**: Any product added or edited in the Admin Panel immediately updates in the WhatsApp Bot catalog!
- **Order Stream & Status Control**: Manage incoming orders and update fulfillment status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
- **Revenue Analytics**: Track total sales, active shipments, and stock count.

### 3. 🛍️ Storefront Catalog View
- E-commerce showcase for Mink Blankets, Flannel Dohars/Chaders/Bedsheets, Pashmina Lohis, and Cotton Bedsheets with direct **"Chat & Order on WhatsApp"** buttons.

### 4. 📱 Mobile App & Webhook Integration Center
- **Native App Snippets**: Ready-to-use code for **React Native**, **Flutter**, and **Android (Kotlin)** deep-links (`wa.me`).
- **Production Webhook Handlers**: Node.js/Express controllers for Meta WhatsApp Business Cloud API & Twilio.

---

## 📋 Catalog Structure (Geet Traders Inventory)

- **🛏️ Mink Blankets**: Single Bed (`S/B`), Double Bed (`D/B`)
- **🧵 Flannel Collection**:
  - Flannel Chader (`S/B`, `D/B`)
  - Flannel Dohar (`S/B`, `D/B`)
  - Flannel Bedsheet 1+2 Set (`S/B`, `D/B`) *(1 Bedsheet + 2 Pillow Covers)*
- **🧣 Lohi (Pashmina & Wool)**: Cream, Pashmina Colour, Orange, Black
- **🛌 Bedsheets**: Pure Cotton & Cotton Blended (`S/B`, `D/B`)

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Build Tool**: Vite
- **Bot Engine**: Custom TypeScript State Machine
- **API Snippets**: Express.js (Node.js), React Native, Flutter (Dart), Android (Kotlin)

---

## 🚀 Quick Start & Installation

```bash
# 1. Clone repository
git clone https://github.com/sakshamthehaker/geet-traders-whatsapp-bot.git

# 2. Navigate to project directory
cd geet-traders-whatsapp-bot

# 3. Install dependencies
npm install

# 4. Start local dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying with Meta WhatsApp Cloud API

To connect a live WhatsApp Business phone number:

1. Obtain your `PHONE_NUMBER_ID` and `WHATSAPP_TOKEN` from the [Meta Developer Portal](https://developers.facebook.com/).
2. Use the production webhook handler located in [`src/services/whatsappWebhookHandler.ts`](file:///C:/Users/saksham%20tandon/.gemini/antigravity/scratch/whatsapp-clothing-bot/src/services/whatsappWebhookHandler.ts).
3. Set your environment variables:
   ```env
   META_VERIFY_TOKEN=geettraders_secret_token_2026
   META_WHATSAPP_TOKEN=your_meta_system_user_token
   META_PHONE_NUMBER_ID=your_phone_number_id
   ```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.