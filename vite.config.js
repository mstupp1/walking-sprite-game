// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/walking-sprite-game/', // Replace with your repository name
  build: {
    outDir: 'docs', // GitHub Pages can serve from /docs folder
    emptyOutDir: true,
  }
});
