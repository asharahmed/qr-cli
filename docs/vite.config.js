import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

// Read parent package.json to get dependency count
const parentPackageJson = JSON.parse(
  readFileSync(resolve(__dirname, '../package.json'), 'utf-8')
);
const dependencyCount = Object.keys(parentPackageJson.dependencies || {}).length;

export default defineConfig(({ mode }) => ({
  root: '.',
  base: '/',

  define: {
    __DEPENDENCY_COUNT__: dependencyCount
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: mode === 'development',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true
      }
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    },
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 500
  },

  css: {
    devSourcemap: true
  },

  server: {
    port: 3000,
    open: true,
    cors: true,
    hmr: {
      overlay: true
    }
  },

  preview: {
    port: 4173,
    open: true
  },

  plugins: [
    mode === 'production' && viteCompression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    mode === 'analyze' && visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),

  publicDir: false
}));
