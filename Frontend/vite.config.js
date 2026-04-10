import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  server: {
    port: 8000,
    strictPort: false,
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=*',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data: https://*.google.com https://*.amazon.com https://*.microsoft.com https://*.stripe.com https://*.facebook.com https://*.uber.com https://*.zomato.com https://*.canva.com https://lh3.googleusercontent.com; connect-src 'self' https://nominatim.openstreetmap.org http://localhost:5000; font-src 'self' data: https://fonts.gstatic.com;"
    }
  }
})

