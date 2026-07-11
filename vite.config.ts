import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Split heavy third-party libraries into their own chunks so no single
      // chunk exceeds the 500 kB warning threshold.
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('recharts') || id.includes('d3-') || id.includes('victory')) {
              return 'vendor-charts';
            }
            if (id.includes('framer-motion') || id.includes('/motion') || id.includes('motion-dom') || id.includes('motion-utils')) {
              return 'vendor-motion';
            }
            if (id.includes('react-dom') || id.includes('react') || id.includes('scheduler') || id.includes('use-sync-external-store')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) return 'vendor-icons';
            return 'vendor';
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? false : {},
      // Proxy /api calls to the standalone governance server (port 8787)
      // so the frontend can call the API without CORS issues in dev.
      proxy: {
        '/api': {
          target: process.env.GOVERNANCE_TARGET || 'http://localhost:8787',
          changeOrigin: true,
        },
      },
    },
  };
});
