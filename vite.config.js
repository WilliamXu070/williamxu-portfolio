import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Use a single base path; must end with a slash for Vite asset URLs
  // Update this to your actual deployment subpath or '/' for root
  base: '/williamxu-portfolio/',
  plugins: [react(), tailwindcss()]
})
