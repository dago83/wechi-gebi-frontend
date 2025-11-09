
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true, 
      },
      manifest: {
        name: 'Wechi Gebi (ወጪ ገቢ)',
        short_name: 'Wechi Gebi',
        description: 'Personal finance tracker for Ethiopians',
        theme_color: '#0d6efd',
        background_color: '#aca7a7ff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^http:\/\/localhost:5000\/api\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /\.(?:js|css|html|png|jpg|jpeg|svg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-cache',
            },
          },
        ],
      },
    }),
  ],
});