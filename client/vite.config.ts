import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The dev server proxies API calls to the NestJS service (port 5556).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/customers': 'http://localhost:5556',
      '/transfers': 'http://localhost:5556',
    },
  },
});
