import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Chemin de base du site : '/' en local, '/KAAY/' sur GitHub Pages
  // (défini par la variable VITE_BASE dans le workflow de déploiement).
  base: process.env.VITE_BASE ?? '/',
})
