import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    jsxRuntime: 'classic',
  })],
  optimizeDeps: {
    exclude: ['jeep-sqlite/loader', 'jeep-sqlite/deps', 'jose']
  }
})
