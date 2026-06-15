import { resolve } from 'path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { devRedirects } from './scripts/vite-dev-redirects.js'

export default defineConfig({
  base: '/hourglass/',
  plugins: [devRedirects(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        secret: resolve(__dirname, 'secret.html'),
      },
    },
  },
})
