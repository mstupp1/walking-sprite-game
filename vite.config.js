// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/walking-sprite-game/', // Replace with your repository name
  build: {
    outDir: 'docs', // GitHub Pages can serve from /docs folder
    emptyOutDir: true,
    assetsInlineLimit: 0, // Don't inline any assets as base64
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  publicDir: 'public', // Ensure public directory is correctly set
});
