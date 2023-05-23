import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { viteReactSvgComponentPlugin } from 'svg-component-vite-plugin/dist/react';

const r = (p) => resolve(__dirname, p);

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8000,
    host: true,
  },

  resolve: {
    alias: {
      '@': r('./src'),
      '@c': r('./src/components'),
      '@p': r('./src/pages'),
      process: 'process/browser',
      stream: 'stream-browserify',
      zlib: 'browserify-zlib',
      util: 'util',
    },
  },
  plugins: [
    react(),
    viteReactSvgComponentPlugin({
      include: 'src/assets/svg/**/*.svg*',
    }),
  ],
});
