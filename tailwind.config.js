/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          light: '#25D366',
          dark: '#075E54',
          teal: '#128C7E',
          bg: '#E5DDD5',
          chat: '#efeae2',
          card: '#d9fdd3',
          bubble: '#ffffff',
          darkBg: '#0b141a',
          darkHeader: '#202c33',
          darkBubble: '#005c4b',
          darkReceived: '#202c33'
        }
      }
    },
  },
  plugins: [],
}
