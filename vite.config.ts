import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // This repo is deployed as a project page at /n7sight.github.io/,
    // so Vite should prefix built asset URLs with that subpath.
    base: '/n7sight.github.io/', 
    build: {
      outDir: 'dist',
    },
    define: {
      // This allows 'process.env.API_KEY' to work in the browser
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY),
    }
  };
});
