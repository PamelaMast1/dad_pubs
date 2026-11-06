import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages project site serves from /<repo-name>/.
  // Switch to '/' once this is hosted at its own domain.
  base: '/dad_pubs/',
  plugins: [react()],
})
