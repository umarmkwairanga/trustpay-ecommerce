import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Forces Vite to listen on both localhost AND 127.0.0.1 simultaneously!
    port: 5173
  }
})