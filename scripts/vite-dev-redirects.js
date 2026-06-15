const BASE = '/hourglass/';

function pathname(url) {
  return (url.split('?')[0] || '/').replace(/\/+$/, '') || '/';
}

function isViteInternal(path) {
  return (
    path.startsWith('/@') ||
    path.includes('/@vite/') ||
    path.includes('/@fs/') ||
    path.includes('/@id/') ||
    path.startsWith('/node_modules/') ||
    path.startsWith('/hourglass/node_modules/')
  );
}

function isStaticAsset(path) {
  return /\.[a-zA-Z0-9]+$/.test(path);
}

function isAllowedHourglassPath(path) {
  return (
    path === '/hourglass' ||
    path === '/hourglass/index.html' ||
    path === '/hourglass/secret.html' ||
    isStaticAsset(path)
  );
}

function redirectTarget(path) {
  if (path === '/') return BASE;
  if (path === '/secret') return null;
  if (!path.startsWith('/hourglass')) return BASE;
  if (isViteInternal(path) || isAllowedHourglassPath(path)) return null;
  return BASE;
}

export function devRedirects() {
  return {
    name: 'dev-redirects',
    configureServer(server) {
      const handler = (req, res, next) => {
        const path = pathname(req.url ?? '/');

        if (path === '/secret') {
          const query = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
          req.url = `/hourglass/secret.html${query}`;
          return next();
        }

        const target = redirectTarget(path);
        if (target) {
          res.writeHead(302, { Location: target });
          res.end();
          return;
        }

        next();
      };

      server.middlewares.stack.unshift({ route: '', handle: handler });
    },
  };
}
