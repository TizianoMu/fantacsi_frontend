import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Questo permette a Vite di essere accessibile da altri dispositivi nella rete Docker
 allowedHosts: true,
    watch: {
      usePolling: true, // Potrebbe essere necessario per i sistemi Linux/WSL su Windows
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