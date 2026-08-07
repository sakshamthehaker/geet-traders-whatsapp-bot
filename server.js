/**
 * Geet Traders - Production WhatsApp Bot Backend Server (ES Module Format)
 * Railway Deployment v1.0.1 - Verified ES Imports
 */
import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;
const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'geettraders_secret_token_2026';
const WHATSAPP_TOKEN = process.env.META_WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID;

// 1. Serve Static Frontend Files (Vite dist folder)
app.use(express.static(path.join(__dirname, 'dist')));

// 2. Meta Webhook Verification (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook Verified Successfully on Railway!');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// 3. Incoming Messages Webhook (POST)
app.post('/webhook', async (req, res) => {
  const body = req.body;
  console.log('📩 Incoming Webhook POST Event:', JSON.stringify(body, null, 2));

  if (body.object === 'whatsapp_business_account' || body.object === 'page') {
    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.value && change.value.messages) {
          const message = change.value.messages[0];
          const from = message.from; // Customer phone number
          const messageType = message.type;

          let textBody = '';
          if (messageType === 'text') {
            textBody = message.text.body;
          } else if (messageType === 'interactive') {
            textBody = message.interactive.button_reply.id;
          }

          console.log(`📩 Received WhatsApp message from ${from}: ${textBody}`);

          // Automated reply logic for Geet Traders
          await handleBotReply(from, textBody);
        }
      }
    }
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Automated WhatsApp Reply Function
async function handleBotReply(to, userText) {
  const text = userText.trim().toLowerCase();
  
  let replyText = `👋 *Welcome to Geet Traders!* ✨\n\nYour trusted supplier for Premium Mink Blankets, Flannel Dohars, Pashmina Lohis, and Pure Cotton Bedsheets (S/B & D/B).\n\nReply CATALOG to view items or ORDER to place an order.`;
  
  if (text.includes('catalog') || text.includes('items') || text.includes('blanket')) {
    replyText = `🛏️ *Geet Traders Catalog:*\n\n` +
      `1. *Mink Blanket* (Single Bed S/B - ₹1499 | Double Bed D/B - ₹1999)\n` +
      `2. *Flannel Chader* (S/B - ₹799 | D/B - ₹1199)\n` +
      `3. *Flannel Dohar* (S/B - ₹999 | D/B - ₹1499)\n` +
      `4. *Flannel Bedsheet 1+2 Set* (S/B - ₹1199 | D/B - ₹1699)\n` +
      `5. *Lohi Shawls* (Cream, Pashmina, Orange, Black - ₹899)\n` +
      `6. *Cotton Bedsheets* (S/B - ₹699 | D/B - ₹999)\n\n` +
      `Reply with the item name & size (S/B or D/B) to order!`;
  }

  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.log(`⚠️ Missing META_WHATSAPP_TOKEN or META_PHONE_NUMBER_ID environment variables in Railway!`);
    console.log(`[Simulated Meta Cloud API Send to ${to}]: ${replyText}`);
    return;
  }

  try {
    await axios.post(
      `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: replyText }
      },
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`✅ Message sent to ${to} via Meta API`);
  } catch (error) {
    console.error('❌ Meta API Send Error:', JSON.stringify(error.response?.data || error.message, null, 2));
  }
}

// 4. Fallback: Catch-all route to serve React Single Page Application (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Geet Traders Webhook & Web Server running on Railway port ${PORT}`);
});
