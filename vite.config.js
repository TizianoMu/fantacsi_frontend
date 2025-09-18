import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
server: {
    // Sostituisci "tuo-dominio.com" con il dominio che vuoi consentire
    host: 'tuo-dominio.com',
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: 'dist',
  },
  css: {
    preprocessorOptions: {
      css: {
        additionalData: `
          :root {
            --primary-color: #ef7821;
            --secondary-color: #eb9a26;
            --navbar-color: #1d282b;
            --background-color: #f5f5dc; /* cream background */
          }
        `,
      },
    },
  },
})