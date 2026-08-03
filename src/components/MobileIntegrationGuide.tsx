import React, { useState } from 'react';
import { Smartphone, Code, Copy, Check, ExternalLink, Zap, Terminal, Globe, Server } from 'lucide-react';
import { 
  REACT_NATIVE_SNIPPET, 
  FLUTTER_SNIPPET, 
  ANDROID_KOTLIN_SNIPPET, 
  generateWhatsAppDeepLink 
} from '../services/mobileApiServer';
import { META_WHATSAPP_WEBHOOK_CODE, TWILIO_WHATSAPP_CODE } from '../services/whatsappWebhookHandler';

export const MobileIntegrationGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'react-native' | 'flutter' | 'kotlin' | 'meta-webhook' | 'twilio'>('react-native');
  const [copied, setCopied] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [customMsg, setCustomMsg] = useState('Hi Geet Traders! I want to view your clothing catalog & order.');

  const generatedLink = generateWhatsAppDeepLink({
    phoneNumber,
    defaultMessage: customMsg
  });

  const handleCopyCode = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const getCodeSnippet = () => {
    switch (activeTab) {
      case 'react-native': return REACT_NATIVE_SNIPPET;
      case 'flutter': return FLUTTER_SNIPPET;
      case 'kotlin': return ANDROID_KOTLIN_SNIPPET;
      case 'meta-webhook': return META_WHATSAPP_WEBHOOK_CODE;
      case 'twilio': return TWILIO_WHATSAPP_CODE;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/30 mb-3">
          <Smartphone className="w-4 h-4" />
          <span>Mobile App & Native Integration Center</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          How to Connect this WhatsApp Bot to your Mobile App
        </h1>
        <p className="text-slate-300 text-sm mt-2 max-w-3xl leading-relaxed">
          Embed direct "Order on WhatsApp" buttons, deep-links, or connect your native iOS & Android mobile apps directly to our Node/Express WhatsApp Bot Engine.
        </p>
      </div>

      {/* SECTION 1: Deep Link Interactive Tester */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 mb-10 shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-amber-400" />
          <span>1. Instant WhatsApp Mobile Deep-Link (`wa.me`) Generator</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">WhatsApp Business Phone Number:</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-slate-900 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Pre-filled Customer Request Text:</label>
              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                rows={3}
                className="w-full bg-slate-900 text-white text-sm p-4 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Generated WhatsApp URL:</span>
              <p className="font-mono text-xs text-slate-200 break-all bg-slate-950 p-3 rounded-lg border border-slate-800 mt-2">
                {generatedLink}
              </p>
            </div>

            <div className="flex gap-3 mt-4">
              <a
                href={generatedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-md"
              >
                <span>Test Link on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => handleCopyCode(generatedLink, 'deep-link')}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition border border-slate-700 flex items-center space-x-1.5"
              >
                {copied === 'deep-link' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>Copy URL</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Code Snippets for Mobile Frameworks */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-emerald-400" />
            <span>2. Native Mobile App Integration Snippets</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('react-native')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'react-native' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:text-white'
              }`}
            >
              React Native
            </button>
            <button
              onClick={() => setActiveTab('flutter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'flutter' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:text-white'
              }`}
            >
              Flutter (Dart)
            </button>
            <button
              onClick={() => setActiveTab('kotlin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'kotlin' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:text-white'
              }`}
            >
              Android (Kotlin)
            </button>
            <button
              onClick={() => setActiveTab('meta-webhook')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'meta-webhook' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:text-white'
              }`}
            >
              Meta Webhook Server
            </button>
            <button
              onClick={() => setActiveTab('twilio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'twilio' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:text-white'
              }`}
            >
              Twilio Webhook
            </button>
          </div>
        </div>

        {/* Code Viewport */}
        <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-mono">{activeTab}.ts / .dart / .js</span>
            <button
              onClick={() => handleCopyCode(getCodeSnippet(), activeTab)}
              className="hover:text-white font-semibold flex items-center space-x-1"
            >
              {copied === activeTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === activeTab ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto custom-scrollbar leading-relaxed">
            {getCodeSnippet()}
          </pre>
        </div>
      </div>

    </div>
  );
};
