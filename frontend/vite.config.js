import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '');

  const serverPort = parseInt(env.VITE_PORT || '5173', 10);
  const serverHost = env.VITE_HOST || '0.0.0.0';
  const backendTarget = env.VITE_BACKEND_URL || env.VITE_API_PROXY_TARGET || 'http://localhost:5000';
  const defaultTheme = env.VITE_DEFAULT_THEME || 'golden-harvest';
  const defaultFont = env.VITE_DEFAULT_FONT || 'playfair';

  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    define: {
      __APP_DEFAULT_THEME__: JSON.stringify(defaultTheme),
      __APP_DEFAULT_FONT__: JSON.stringify(defaultFont),
    },
    server: {
      port: serverPort,
      host: serverHost,
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false
        },
        '/uploads': {
          target: backendTarget,
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      chunkSizeWarningLimit: 650,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor-react';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('framer-motion')) {
                return 'vendor-motion';
              }
            }
          }
        }
      }
    }
  };
});
