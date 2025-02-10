import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './src/frontend',
  base:"/", // Root folder with index.html
  resolve: {
    alias: {
      '@': '/src', // Optional: Alias for cleaner imports
    },
  },
  build: {
    rollupOptions: {
      input: './src/frontend/index.html', // Explicitly specify index.html
    },
  },
});
