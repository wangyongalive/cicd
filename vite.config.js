import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // base: './',
  plugins: [vue()],
   build: {
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true
  },
})
