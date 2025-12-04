import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@client': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/common'),
      '@sdk': path.resolve(__dirname, './src/sdk'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'query-vendor': ['@tanstack/react-query'],
          charts: ['recharts'],
          'pdf-viewer': [
            '@react-pdf-viewer/core',
            '@react-pdf-viewer/default-layout',
            '@react-pdf-viewer/toolbar',
            '@react-pdf-viewer/page-navigation',
            '@react-pdf-viewer/bookmark',
            'pdfjs-dist',
          ],
          icons: ['lucide-react', '@heroicons/react'],
        },
      },
    },
  },
});
