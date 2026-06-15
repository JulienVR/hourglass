import { mkdir, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = 'dist';
const appDir = join(dist, 'hourglass');

await mkdir(appDir, { recursive: true });

for (const name of ['index.html', 'assets', 'favicon.png', 'pictures', 'vite.svg']) {
  try {
    await rename(join(dist, name), join(appDir, name));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

try {
  await mkdir(join(dist, 'secret'), { recursive: true });
  await rename(join(dist, 'secret.html'), join(dist, 'secret', 'index.html'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const redirectHtml = (target = '/hourglass/') => `<!DOCTYPE html>
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

await writeFile(join(dist, 'index.html'), redirectHtml(), 'utf8');
await writeFile(join(dist, '404.html'), redirectHtml(), 'utf8');
