import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['taskapp-frontend-ashir-dqd0gyckb7behpge.southeastasia-01.azurewebsites.net']
  }
})