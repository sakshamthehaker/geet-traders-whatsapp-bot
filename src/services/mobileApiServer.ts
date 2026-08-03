/**
 * Mobile App Integration Generator
 * Deep-links (wa.me) & Native Code Snippets
 */

export interface DeepLinkConfig {
  phoneNumber: string;
  defaultMessage: string;
  catalogCategory?: string;
  productId?: string;
}

export function generateWhatsAppDeepLink(config: DeepLinkConfig): string {
  const cleanPhone = config.phoneNumber.replace(/\D/g, '');
  let text = config.defaultMessage;

  if (config.productId) {
    text = `Hi Geet Traders! I'm interested in ordering item PROD_${config.productId}`;
  } else if (config.catalogCategory) {
    text = `Hi Geet Traders! Show me items in ${config.catalogCategory}`;
  }

  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export const REACT_NATIVE_SNIPPET = `
import React from 'react';
import { TouchableOpacity, Text, Linking, StyleSheet } from 'react-native';

export const OrderOnWhatsAppButton = ({ phoneNumber = "+919876543210", itemCode = "PROD-1" }) => {
  const openWhatsApp = () => {
    const text = encodeURIComponent(\`Hi! I want to order \${itemCode} from Geet Traders\`);
    const url = \`whatsapp://send?phone=\${phoneNumber}&text=\${text}\`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Linking.openURL(\`https://wa.me/\${phoneNumber}?text=\${text}\`);
      }
    });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={openWhatsApp}>
      <Text style={styles.text}>📱 Order on WhatsApp</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#25D366',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  }
});
`;

export const FLUTTER_SNIPPET = `
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

void openWhatsAppOrder({required String phone, required String text}) async {
  final Uri whatsappUrl = Uri.parse("https://wa.me/$phone?text=\${Uri.encodeComponent(text)}");
  if (await canLaunchUrl(whatsappUrl)) {
    await launchUrl(whatsappUrl, mode: LaunchMode.externalApplication);
  } else {
    throw 'Could not launch WhatsApp';
  }
}

// Button Widget
ElevatedButton.icon(
  style: ElevatedButton.styleFrom(
    backgroundColor: const Color(0xFF25D366),
    foregroundColor: Colors.white,
    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
  ),
  onPressed: () => openWhatsAppOrder(
    phone: "919876543210",
    text: "Hi Geet Traders! I want to view your latest catalog",
  ),
  icon: const Icon(Icons.chat_bubble_outline),
  label: const Text("Order via WhatsApp", style: TextStyle(fontWeight: FontWeight.bold)),
);
`;

export const ANDROID_KOTLIN_SNIPPET = `
// Android Kotlin WhatsApp Deep-link Intent
fun openWhatsAppChat(context: Context, phoneNumber: String, message: String) {
    val cleanPhone = phoneNumber.replace("+", "").replace(" ", "")
    val url = "https://api.whatsapp.com/send?phone=$cleanPhone&text=" + URLEncoder.encode(message, "UTF-8")
    val intent = Intent(Intent.ACTION_VIEW).apply {
        data = Uri.parse(url)
    }
    context.startActivity(intent)
}
`;
