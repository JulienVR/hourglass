import { resolve } from 'path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

function pathname(url) {
  return (url.split('?')[0] || '/').replace(/\/+$/, '') || '/'
}

function isViteInternal(path) {
  return (
    path.startsWith('/@') ||
    path.includes('/@vite/') ||
    path.includes('/@fs/') ||
    path.includes('/@id/') ||
    path.startsWith('/node_modules/')
  )
}

function isStaticAsset(path) {
  return /\.[a-zA-Z0-9]+$/.test(path)
}

function isKnownPage(path) {
  return path === '/' || path === '/index.html' || path === '/secret' || path === '/secret.html'
}

/** /secret → secret.html; unknown URLs → local site root */
function siteRedirects() {
  return {
    name: 'site-redirects',
    configureServer(server) {
      const handler = (req, res, next) => {
        const path = pathname(req.url ?? '/')

        if (path === '/secret') {
          const query = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
          req.url = `/secret.html${query}`
          return next()
        }

        if (isViteInternal(path) || isStaticAsset(path) || isKnownPage(path)) {
          return next()
        }

        res.writeHead(302, { Location: '/' })
        res.end()
      }

      server.middlewares.stack.unshift({ route: '', handle: handler })
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [siteRedirects(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        secret: resolve(__dirname, 'secret.html'),
      },
    },
  },
})
