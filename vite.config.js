import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir: './dist'
  },
  plugins: [
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,mp3,jpg,png,webp,svg}']
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Ravaglioli Christmas Game 2023',
        short_name: 'RAV Game 2023',
        start_url: '.',
        display: 'standalone',
        background_color: '#FFFFFF',
        theme_color: '#FFFFFF',
        description: 'Explore the magical Christmas world of Ravaglioli Xmas 2023! Explore the magical Christmas world of Ravaglioli Xmas 2023! Click to start the challenge with KPX55LIKTA.',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
})
