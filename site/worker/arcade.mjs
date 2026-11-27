const RUN_TTL_MS = 4 * 60 * 60 * 1000;
const MAX_BODY_BYTES = 512 * 1024;
const SCORE_ORDER = 'score DESC, max_frames DESC, finished_at, run_id';
const API_PREFIX = '/api/arcade/';

function json(value, status = 200) {
  return Response.json(value, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}

class BadScoreRequest extends Error {}

async function scoreBody(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new BadScoreRequest();
  const decoder = new TextDecoder();
  let size = 0;
  let text = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new BadScoreRequest();
    }
    text += decoder.decode(value, { stream: true });
  }
  try {
    return JSON.parse(text + decoder.decode());
  } catch {
    throw new BadScoreRequest();
  }
}

async function topScores(db) {
  const { results } = await db.prepare(
    'SELECT run_id, initials, score, max_frames FROM arcade_scores ORDER BY ' + SCORE_ORDER + ' LIMIT 10'
  ).all();
  return results;
}

function publicScores(rows) {
  return rows.map(({ initials, score, max_frames }) => ({ initials, score, max_frames }));
}

async function startRun(db, now) {
  const id = crypto.randomUUID();
  const seed = crypto.getRandomValues(new Uint32Array(1))[0] || 1;
  await db.batch([
    db.prepare('DELETE FROM arcade_runs WHERE started_at < ?').bind(now - RUN_TTL_MS),
    db.prepare('INSERT INTO arcade_runs (id, seed, started_at) VALUES (?, ?, ?)').bind(id, seed, now),
  ]);
  return json({ id, seed }, 201);
}

async function saveScore(db, request, now, engine) {
  const { id, initials, frame, moves } = (await scoreBody(request)) ?? {};
  if (typeof id !== 'string' || !/^[a-f0-9-]{36}$/.test(id) ||
      typeof initials !== 'string' || !/^[A-Z]{3}$/.test(initials) ||
      !Number.isSafeInteger(frame) || frame < 1) {
    throw new BadScoreRequest();
  }
  const run = await db.prepare('SELECT seed, started_at FROM arcade_runs WHERE id = ?').bind(id).first();
  if (!run || run.started_at < now - RUN_TTL_MS) {
    const rows = await topScores(db);
    if (rows.some(row => row.run_id === id && row.initials === initials)) {
      return json({ qualified: true, scores: publicScores(rows) });
    }
    return json({ error: 'Run expired or already registered' }, 409);
  }
  if (frame * engine.TICK_MS > now - run.started_at + engine.TICK_MS) {
    throw new BadScoreRequest();
  }
  const game = engine.replay(run.seed, frame, moves);
  if (!game) throw new BadScoreRequest();

  const [insert] = await db.batch([
    db.prepare(`INSERT INTO arcade_scores (run_id, initials, score, max_frames, finished_at)
                SELECT id, ?, ?, ?, ? FROM arcade_runs WHERE id = ?
                ON CONFLICT(run_id) DO NOTHING`).bind(initials, game.score, game.maxFrames, now, id),
    db.prepare('DELETE FROM arcade_runs WHERE id = ?').bind(id),
    db.prepare(`DELETE FROM arcade_scores WHERE run_id IN
               (SELECT run_id FROM arcade_scores ORDER BY ${SCORE_ORDER} LIMIT -1 OFFSET 10)`),
  ]);
  const rows = await topScores(db);
  const qualified = rows.some(row => row.run_id === id && row.initials === initials);
  if (!insert.meta.changes && !qualified) {
    return json({ error: 'Run already registered' }, 409);
  }
  return json({ qualified, scores: publicScores(rows) }, 201);
}

async function arcadeApi(request, url, db, engine, allowedOrigins) {
  if (!db) return json({ error: 'Leaderboard unavailable' }, 503);
  if (url.pathname === API_PREFIX + 'scores' && request.method === 'GET') {
    return json({ scores: publicScores(await topScores(db)) });
  }
  if (request.method !== 'POST') return json({ error: 'Not found' }, 404);
  const origin = request.headers.get('Origin');
  if ((origin && origin !== url.origin && !allowedOrigins.includes(origin)) ||
      (request.headers.get('Sec-Fetch-Site') === 'cross-site' && !allowedOrigins.includes(origin)) ||
      request.headers.get('Content-Type')?.split(';')[0] !== 'application/json') {
    return json({ error: 'Unsupported request' }, 403);
  }
  if (url.pathname === API_PREFIX + 'start') return startRun(db, Date.now());
  if (url.pathname === API_PREFIX + 'scores') {
    return saveScore(db, request, Date.now(), engine);
  }
  return json({ error: 'Not found' }, 404);
}

export function createWorker(assets, engine) {
  return {
    async fetch(request, env) {
      const url = new URL(request.url);
      if (url.pathname.startsWith(API_PREFIX)) {
        const allowedOrigins = (env.ALLOWED_ORIGINS ?? '').split(',').map(value => value.trim()).filter(Boolean);
        const origin = request.headers.get('Origin');
        if (origin && origin !== url.origin && !allowedOrigins.includes(origin)) {
          return json({ error: 'Unsupported origin' }, 403);
        }
        const cors = response => {
          if (!origin) return response;
          const headers = new Headers(response.headers);
          headers.set('Access-Control-Allow-Origin', origin);
          headers.set('Vary', 'Origin');
          return new Response(response.body, { status: response.status, headers });
        };
        if (request.method === 'OPTIONS') {
          const method = request.headers.get('Access-Control-Request-Method');
          if (!origin || !['GET', 'POST'].includes(method)) return json({ error: 'Unsupported preflight' }, 403);
          return cors(new Response(null, { status: 204, headers: {
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
          } }));
        }
        try {
          return cors(await arcadeApi(request, url, env.DB, engine, allowedOrigins));
        } catch (error) {
          if (error instanceof BadScoreRequest) return cors(json({ error: 'Invalid score submission' }, 400));
          console.error('Arcade request failed', url.pathname, error);
          return cors(json({ error: 'Leaderboard unavailable' }, 503));
        }
      }
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
      }
      if (url.pathname === '/arcade') {
        url.pathname += '/';
        return Response.redirect(url, 308);
      }
      const path = url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname;
      if (!Object.hasOwn(assets, path)) return new Response('Not found', { status: 404 });
      const { type, gzip, etag } = assets[path];
      const headers = { 'Content-Type': type, 'Cache-Control': 'no-cache', ETag: etag };
      if (request.headers.get('If-None-Match') === etag) return new Response(null, { status: 304, headers });
      if (request.method === 'HEAD') return new Response(null, { headers });
      const compressed = Uint8Array.from(atob(gzip), char => char.charCodeAt(0));
      const body = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
      return new Response(body, { headers });
    },
  };
}
