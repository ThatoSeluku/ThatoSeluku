import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ThatoSeluku/', // repo name here (not domain)
  plugins: [react()],
})
