import { mkdir, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = 'dist';
const HOME = 'https://whitefoxes.be/';

// Keep secret at /secret/
try {
  await mkdir(join(dist, 'secret'), { recursive: true });
  await rename(join(dist, 'secret.html'), join(dist, 'secret', 'index.html'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const redirectHtml = (target = HOME) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url=${target}" />
  <link rel="canonical" href="${target}" />
  <title>Redirecting…</title>
  <script>location.replace("${target}");</script>
</head>
<body>
  <p>Redirecting to <a href="${target}">Hourglass Tournament</a>…</p>
</body>
</html>
`;

// Old /hourglass bookmarks + unknown paths (GitHub Pages 404.html) → home
await mkdir(join(dist, 'hourglass'), { recursive: true });
await writeFile(join(dist, 'hourglass', 'index.html'), redirectHtml(), 'utf8');
await writeFile(join(dist, '404.html'), redirectHtml(), 'utf8');
