import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Smartphone, 
  Monitor, 
  CheckCheck, 
  RotateCcw, 
  ShoppingBag, 
  Sparkles, 
  ArrowLeft, 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip, 
  Smile, 
  Bot, 
  User, 
  Tag, 
  ExternalLink,
  ChevronRight,
  PackageCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChatMessage, Order, Product } from '../types';
import { BotEngine } from '../services/botEngine';

interface WhatsAppSimulatorProps {
  botEngine: BotEngine;
  onOrderCreated: (order: Order) => void;
  onNavigateToStore: () => void;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({
  botEngine,
  onOrderCreated,
  onNavigateToStore
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [deviceFrame, setDeviceFrame] = useState<'phone' | 'desktop'>('phone');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Welcome Message
  useEffect(() => {
    const welcome = botEngine.generateWelcomeMessage();
    setMessages([welcome]);
  }, [botEngine]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string, payload?: string) => {
    const messageContent = textToSend || inputText;
    if (!messageContent.trim() && !payload) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageContent || (payload ? `[Selected: ${payload}]` : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      interactiveType: 'text'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Simulate bot typing delay
    setIsTyping(true);
    setTimeout(() => {
      const response = botEngine.processUserInput(messageContent, payload);
      setIsTyping(false);
      setMessages(prev => [...prev, ...response.messages]);

      if (response.createdOrder) {
        onOrderCreated(response.createdOrder);
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }, 800);
  };

  const handleResetChat = () => {
    const resetMsgs = botEngine.resetSession();
    setMessages(resetMsgs);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      
      {/* Top Device Frame & Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span>📱 Interactive WhatsApp Simulator</span>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30">
              Live Bot Engine
            </span>
          </h2>
          <p className="text-sm text-slate-400">
            Test catalog browsing, size selection, cart management, and order placement in real-time.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Frame Toggle */}
          <div className="bg-slate-900 p-1 rounded-xl flex border border-slate-700">
            <button
              onClick={() => setDeviceFrame('phone')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                deviceFrame === 'phone' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Mobile Frame</span>
            </button>
            <button
              onClick={() => setDeviceFrame('desktop')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                deviceFrame === 'desktop' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Desktop Frame</span>
            </button>
          </div>

          <button
            onClick={handleResetChat}
            className="flex items-center space-x-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold transition border border-slate-600"
            title="Reset Chat Session"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Simulator Frame Container */}
      <div className="flex justify-center">
        <div 
          className={`w-full transition-all duration-300 ${
            deviceFrame === 'phone' ? 'max-w-md border-[10px] border-slate-800 rounded-[40px] shadow-2xl shadow-emerald-500/10 overflow-hidden' : 'max-w-4xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden'
          }`}
        >
          {/* WhatsApp Header */}
          <div className="bg-[#075E54] dark:bg-[#202c33] text-white p-3 flex items-center justify-between border-b border-emerald-800/30">
            <div className="flex items-center space-x-3">
              <button className="text-slate-200 hover:text-white sm:hidden">
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center font-bold text-emerald-400 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=200" 
                    alt="ThreadStyle Studio"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075E54] rounded-full"></span>
              </div>

              <div>
                <h3 className="font-bold text-sm leading-tight text-white flex items-center gap-1.5">
                  <span>Geet Traders Official</span>
                  <span className="text-emerald-400">✓</span>
                </h3>
                <p className="text-[11px] text-emerald-200 flex items-center gap-1">
                  {isTyping ? (
                    <span className="text-amber-300 font-semibold animate-pulse">typing...</span>
                  ) : (
                    <span>online • Business Account</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-slate-200">
              <Video className="w-5 h-5 cursor-pointer hover:text-white" />
              <Phone className="w-5 h-5 cursor-pointer hover:text-white" />
              <MoreVertical className="w-5 h-5 cursor-pointer hover:text-white" />
            </div>
          </div>

          {/* WhatsApp Chat Body */}
          <div className="h-[520px] bg-[#efeae2] dark:bg-[#0b141a] p-4 overflow-y-auto custom-scrollbar whatsapp-chat-bg flex flex-col space-y-3">
            
            {/* Encryption Notice */}
            <div className="flex justify-center mb-2">
              <div className="bg-amber-100/90 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700/50 text-amber-800 dark:text-amber-300 text-[11px] px-3 py-1.5 rounded-lg text-center max-w-xs shadow-sm">
                🔒 Messages and orders are end-to-end simulated with Meta WhatsApp API.
              </div>
            </div>

            {/* Chat Messages */}
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
              >
                {/* Message Bubble */}
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-slate-900 dark:text-slate-100 rounded-tr-none'
                      : 'bg-white dark:bg-[#202c33] text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'
                  }`}
                >
                  {/* Image Attachment preview */}
                  {msg.imageUrl && (
                    <div className="mb-2 rounded-xl overflow-hidden max-h-56 bg-slate-900">
                      <img src={msg.imageUrl} alt="Product Preview" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Main Text Content */}
                  <div className="whitespace-pre-line leading-relaxed font-sans">
                    {msg.text}
                  </div>

                  {/* Product Highlight Card */}
                  {msg.productHighlight && (
                    <div className="mt-3 p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                      <img src={msg.productHighlight.imageUrl} className="w-12 h-12 rounded-lg object-cover" alt="" />
                      <div className="flex-1 text-xs">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{msg.productHighlight.name}</p>
                        <p className="text-emerald-600 dark:text-emerald-400 font-semibold">₹{msg.productHighlight.price}</p>
                      </div>
                    </div>
                  )}

                  {/* Interactive Cards Carousel */}
                  {msg.cards && msg.cards.length > 0 && (
                    <div className="mt-3 flex space-x-3 overflow-x-auto custom-scrollbar pb-2 pt-1 max-w-full">
                      {msg.cards.map((card) => (
                        <div 
                          key={card.id}
                          className="min-w-[210px] w-[210px] bg-slate-50 dark:bg-[#111b21] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col justify-between"
                        >
                          <div>
                            <div className="relative h-32 bg-slate-900">
                              <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />
                              {card.badge && (
                                <span className="absolute top-2 left-2 bg-emerald-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full">
                                  {card.badge}
                                </span>
                              )}
                            </div>
                            <div className="p-2.5">
                              <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{card.title}</h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">{card.subtitle}</p>
                              <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{card.price}</p>
                            </div>
                          </div>

                          <div className="p-2 pt-0">
                            <button
                              onClick={() => handleSendMessage(card.title, card.payload)}
                              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-1.5 rounded-lg transition flex items-center justify-center space-x-1"
                            >
                              <span>View & Order</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Order Summary Receipt Box */}
                  {msg.orderSummary && (
                    <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <PackageCheck className="w-4 h-4" /> Order Summary
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded">
                          {msg.orderSummary.id}
                        </span>
                      </div>
                      <div className="space-y-1 text-slate-700 dark:text-slate-300">
                        {msg.orderSummary.items.map((it, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{it.product.name} ({it.selectedSize}) x{it.quantity}</span>
                            <span className="font-semibold">₹{it.product.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-emerald-500/20 pt-1.5 flex justify-between font-bold text-slate-900 dark:text-white">
                        <span>Total Paid</span>
                        <span className="text-emerald-600 dark:text-emerald-400">₹{msg.orderSummary.totalAmount}</span>
                      </div>
                    </div>
                  )}

                  {/* Timestamp & Ticks */}
                  <div className="flex items-center justify-end space-x-1 mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'user' && (
                      <CheckCheck className="w-3.5 h-3.5 text-sky-500 stroke-[2.5]" />
                    )}
                  </div>
                </div>

                {/* Quick Reply Buttons */}
                {msg.buttons && msg.buttons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1 max-w-[85%]">
                    {msg.buttons.map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => handleSendMessage(btn.title, btn.payload)}
                        className="bg-white dark:bg-[#202c33] hover:bg-emerald-500 dark:hover:bg-emerald-600 hover:text-white text-emerald-700 dark:text-emerald-300 border border-emerald-600/30 dark:border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm transition-all duration-150 flex items-center space-x-1"
                      >
                        <span>{btn.title}</span>
                      </button>
                    ))}
                  </div>
                )}

              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center space-x-2 bg-white dark:bg-[#202c33] px-4 py-2.5 rounded-2xl rounded-tl-none w-24 border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-dot-1"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-dot-2"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-dot-3"></span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Action Chips Bar */}
          <div className="bg-[#f0f2f5] dark:bg-[#111b21] px-3 py-2 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto custom-scrollbar">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">Quick Options:</span>
            <button 
              onClick={() => handleSendMessage('🛍️ Browse Catalog', 'BROWSE_ALL')}
              className="shrink-0 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs px-2.5 py-1 rounded-lg font-medium transition"
            >
              🛍️ All Clothes
            </button>
            <button 
              onClick={() => handleSendMessage('📂 Categories', 'SHOW_CATEGORIES')}
              className="shrink-0 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs px-2.5 py-1 rounded-lg font-medium transition"
            >
              📂 Categories
            </button>
            <button 
              onClick={() => handleSendMessage('🛒 View Cart', 'VIEW_CART')}
              className="shrink-0 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs px-2.5 py-1 rounded-lg font-medium transition"
            >
              🛒 My Cart
            </button>
            <button 
              onClick={() => handleSendMessage('📦 Track Order', 'TRACK_ORDER')}
              className="shrink-0 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs px-2.5 py-1 rounded-lg font-medium transition"
            >
              📍 Track Order
            </button>
          </div>

          {/* WhatsApp Message Input Bar */}
          <div className="bg-[#f0f2f5] dark:bg-[#202c33] p-3 flex items-center space-x-2 border-t border-slate-200 dark:border-slate-700/50">
            <Smile className="w-6 h-6 text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200" />
            <Paperclip className="w-6 h-6 text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200" />

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message or select an option above..."
              className="flex-1 bg-white dark:bg-[#2a3942] text-slate-900 dark:text-white placeholder-slate-400 text-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              onClick={() => handleSendMessage()}
              className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow transition-all duration-200 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
