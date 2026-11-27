import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.py': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function readAssets(prefix = '') {
  const assets = {};
  for (const entry of readdirSync(join(dist, prefix), { withFileTypes: true })) {
    if (entry.name.startsWith('.') || (!prefix && entry.name === 'server')) continue;
    const relative = prefix + entry.name;
    if (entry.isDirectory()) {
      Object.assign(assets, readAssets(relative + '/'));
    } else if (MIME[extname(entry.name)]) {
      const body = readFileSync(join(dist, relative));
      assets['/' + relative] = {
        type: MIME[extname(relative)],
        gzip: gzipSync(body).toString('base64'),
        etag: '"' + createHash('sha256').update(body).digest('hex') + '"',
      };
    }
  }
  return assets;
}

const assets = readAssets();
const engine = readFileSync(join(dist, 'arcade/engine.mjs'), 'utf8');
const worker = readFileSync(join(root, 'worker/arcade.mjs'), 'utf8');
mkdirSync(join(dist, 'server'), { recursive: true });
writeFileSync(join(dist, 'server/index.js'),
  engine + '\n' + worker + '\nexport default createWorker(' + JSON.stringify(assets) + ', { replay, TICK_MS });\n');
