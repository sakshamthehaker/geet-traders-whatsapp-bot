/**
 * Production Meta WhatsApp Business Cloud API & Twilio Webhook Integration
 * Express.js Handler Example Snippet
 */

export const META_WHATSAPP_WEBHOOK_CODE = `
// server.js - Meta WhatsApp Cloud API Webhook Handler
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'geettraders_secret_token_2026';
const WHATSAPP_TOKEN = process.env.META_WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID;

// 1. Webhook Verification Endpoint (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook Verified Successfully!');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// 2. Incoming Messages Webhook (POST)
app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.object === 'whatsapp_business_account') {
    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.value && change.value.messages) {
          const message = change.value.messages[0];
          const from = message.from; // Customer WhatsApp Number
          const messageType = message.type;
          
          let textBody = '';
          if (messageType === 'text') {
            textBody = message.text.body;
          } else if (messageType === 'interactive') {
            textBody = message.interactive.button_reply.id;
          }

          console.log(\`Received message from \${from}: \${textBody}\`);

          // Process message through BotEngine state machine
          await handleIncomingWhatsAppMessage(from, textBody);
        }
      }
    }
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// 3. Send Interactive WhatsApp Message via Meta Cloud API
async function sendWhatsAppMessage(to, payload) {
  try {
    await axios.post(
      \`https://graph.facebook.com/v18.0/\${PHONE_NUMBER_ID}/messages\`,
      {
        messaging_product: 'whatsapp',
        to: to,
        ...payload
      },
      {
        headers: {
          'Authorization': \`Bearer \${WHATSAPP_TOKEN}\`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message);
  }
}

app.listen(process.env.PORT || 8080, () => {
  console.log('Geet Traders WhatsApp Webhook Server listening on port 8080');
});
`;

export const TWILIO_WHATSAPP_CODE = `
// twilio-server.js - Twilio WhatsApp Webhook Handler
const express = require('express');
const { MessagingResponse } = require('twilio').twiml;
const app = express();
app.use(express.urlencoded({ extended: false }));

app.post('/twilio-webhook', (req, res) => {
  const twiml = new MessagingResponse();
  const incomingMsg = req.body.Body.trim();
  const fromNumber = req.body.From;

  console.log(\`Twilio WhatsApp Message from \${fromNumber}: \${incomingMsg}\`);

  // Process message and return TwiML Response
  const responseMsg = twiml.message();
  responseMsg.body(\`👋 Welcome to Geet Traders! You said: "\${incomingMsg}". Reply CATALOG to see items.\`);

  res.type('text/xml').send(twiml.toString());
});

app.listen(3000, () => console.log('Twilio WhatsApp server running on port 3000'));
`;
