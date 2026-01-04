import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Replace 'N7sight' with your repository name if it is different
  base: '/N7sight.github.io/', 
  build: {
    outDir: 'dist',
  }
});
