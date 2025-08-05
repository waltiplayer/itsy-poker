import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 8080,
    host: "127.0.0.1",
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});