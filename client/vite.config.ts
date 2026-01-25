import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '')
  
  const isProduction = mode === 'production'
  const apiUrl = env.VITE_API_URL || 'http://localhost:8000/api/v1/'
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: isProduction ? 'https://smartclass-backend-bxld.onrender.com' : 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: isProduction ? false : true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            api: ['axios', '@reduxjs/toolkit'],
          }
        }
      }
    },
    // For Vercel environment detection
    define: {
      'import.meta.env.VERCEL': JSON.stringify(process.env.VERCEL || ''),
    }
  }
})