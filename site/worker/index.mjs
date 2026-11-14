const repository = 'smallstep-zzz/furyawesome-requests';
const api = 'https://api.github.com';
const recent = new Map();

function json(data, status = 200) {
  return Response.json(data, { status, headers: { 'cache-control': 'no-store' } });
}

function base64url(value) {
  return btoa(value).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

async function github(path, token, body) {
  const response = await fetch(api + path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: {
      authorization: 'Bearer ' + token,
      accept: 'application/vnd.github+json',
      'user-agent': 'FuryAwesome-Place',
      'x-github-api-version': '2022-11-28',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error('GitHub API status ' + response.status);
  return response.json();
}

async function installationToken(env) {
  const now = Math.floor(Date.now() / 1000);
  const claims = base64url(JSON.stringify({ iss: env.GITHUB_APP_ID, iat: now - 60, exp: now + 480 }));
  const unsigned = base64url('{"alg":"RS256","typ":"JWT"}') + '.' + claims;
  const keyBytes = Uint8Array.from(atob(env.GITHUB_APP_PRIVATE_KEY_PKCS8_BASE64), char => char.charCodeAt(0));
  const key = await crypto.subtle.importKey('pkcs8', keyBytes, {
    name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256',
  }, false, ['sign']);
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned));
  const jwt = unsigned + '.' + base64url(String.fromCharCode(...new Uint8Array(signature)));
  const result = await github('/app/installations/' + env.GITHUB_APP_INSTALLATION_ID + '/access_tokens', jwt, {
    repositories: ['furyawesome-requests'],
    permissions: { issues: 'write' },
  });
  return result.token;
}

async function submit(request, env) {
  if (request.headers.get('origin') !== new URL(request.url).origin ||
      !/^application\/json(?:;|$)/i.test(request.headers.get('content-type') || '')) {
    return json({ error: 'invalid_request' }, 403);
  }
  if (!/^\d+$/.test(env.GITHUB_APP_ID || '') ||
      !/^\d+$/.test(env.GITHUB_APP_INSTALLATION_ID || '') ||
      !env.GITHUB_APP_PRIVATE_KEY_PKCS8_BASE64) return json({ error: 'unavailable' }, 503);

  let input;
  try {
    const reader = request.body.getReader();
    const decoder = new TextDecoder();
    let bytes = 0;
    let raw = '';
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 8192) {
        await reader.cancel();
        return json({ error: 'invalid_request' }, 413);
      }
      raw += decoder.decode(value, { stream: true });
    }
    input = JSON.parse(raw + decoder.decode());
  } catch {
    return json({ error: 'invalid_request' }, 400);
  }

  const { name, url, reason, consent } = input ?? {};
  if (consent !== true || typeof name !== 'string' || !name.trim() ||
      name.length > 220 || /[\x00-\x1f\x7f]/.test(name) ||
      typeof reason !== 'string' || !reason.trim() || reason.length > 700 ||
      !(url === null || (typeof url === 'string' &&
        /^https:\/\/(?:github\.com|huggingface\.co)\/[\w.-]+\/[\w.-]+$/.test(url)))) {
    return json({ error: 'invalid_request' }, 400);
  }

  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const now = Date.now();
  for (const [client, expiry] of recent) {
    if (expiry <= now) recent.delete(client);
  }
  if (recent.has(ip) || recent.size >= 100) return json({ error: 'rate_limited' }, 429);
  recent.set(ip, now + 60_000);

  const safe = text => text.replace(/[&<>]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[ch])
    .replace(/@/g, '@\u200b');
  try {
    const token = await installationToken(env);
    const target = await github('/repos/' + repository, token);
    if (target.private !== true || target.has_issues !== true) throw new Error('Private intake unavailable');
    const issue = await github('/repos/' + repository + '/issues', token, {
      title: '[모델 요청] ' + safe(name.trim()),
      body: '## 저장소\n' + (url || '저장소 주소 미지정') + '\n\n## 요청 이유\n' +
        reason.trim().split(/\r?\n/).map(line => '> ' + safe(line)).join('\n'),
    });
    return json({ number: issue.number }, 201);
  } catch {
    return json({ error: 'unavailable' }, 503);
  }
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (path === '/api/model-requests') {
      if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
      return submit(request, env);
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response(null, { status: 405 });
    const asset = Object.hasOwn(assets, path) && assets[path];
    if (!asset) return new Response('Not found', { status: 404 });
    const [type, content] = asset;
    return new Response(request.method === 'HEAD' ? null : Uint8Array.from(atob(content), c => c.charCodeAt(0)), {
      headers: { 'content-type': type },
    });
  },
};
