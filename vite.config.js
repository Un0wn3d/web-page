import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Змініть base на назву вашого репозиторію для GitHub Pages
// Наприклад: base: '/eco-toloka/'
export default defineConfig({
  plugins: [react()],
  base: '/',
})