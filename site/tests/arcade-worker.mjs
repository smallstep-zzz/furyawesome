import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'node:test';
import site from '../dist/server/index.js';
import { MOVE, TICK_MS, createGame, replay, speedMs, step } from '../dist/arcade/engine.mjs';

export function testDb() {
  const database = new DatabaseSync(':memory:');
  database.exec(readFileSync(new URL('../drizzle/0000_arcade.sql', import.meta.url), 'utf8'));
  const db = {
    prepare(sql) {
      const statement = database.prepare(sql);
      function bind(...values) {
        return {
          first: () => statement.get(...values),
          all: () => ({ results: statement.all(...values) }),
          run: () => ({ meta: statement.run(...values) }),
          bind,
        };
      }
      return bind();
    },
    async batch(statements) {
      database.exec('BEGIN');
      try {
        const results = statements.map(statement => statement.run());
        database.exec('COMMIT');
        return results;
      } catch (error) {
        database.exec('ROLLBACK');
        throw error;
      }
    },
  };
  return { db, database };
}

function play(seed) {
  const game = createGame(seed);
  const moves = [];
  while (!game.over) {
    moves.push([game.frame + 1, MOVE.drop]);
    step(game, MOVE.drop);
  }
  return { frame: game.frame, moves, score: game.score };
}

test('drops replay deterministically and speed reaches a stable maximum', () => {
  const { frame, moves, score } = play(3456);
  assert.equal(replay(3456, frame, moves).score, score);
  assert.equal(replay(3456, frame, [[1, 42]]), null);
  assert.equal(replay(3456, frame + 1, moves), null);
  const game = createGame(5);
  const start = speedMs(game);
  game.frame = 225000 / TICK_MS - 1;
  step(game);
  assert.equal(game.level, 10);
  assert.equal(speedMs(game), 150);
  assert.ok(speedMs(game) < start);
  step(game);
  assert.equal(game.maxFrames, 2);
  assert.equal(speedMs(game), 150);
});

test('worker preserves catalog and arcade assets with the appropriate MIME types', async () => {
  for (const [path, filename, type] of [
    ['/', 'index.html', 'text/html'],
    ['/catalog.js', 'catalog.js', 'text/javascript'],
    ['/assets/utility-wagon.webp', 'assets/utility-wagon.webp', 'image/webp'],
    ['/arcade/', 'arcade/index.html', 'text/html'],
    ['/arcade/game.mjs', 'arcade/game.mjs', 'text/javascript'],
  ]) {
    const url = 'https://arcade.test' + path;
    const response = await site.fetch(new Request(url), {});
    assert.equal(response.status, 200);
    assert.ok(response.headers.get('Content-Type').startsWith(type));
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), readFileSync(new URL('../dist/' + filename, import.meta.url)));
    const cached = await site.fetch(new Request(url, { headers: { 'If-None-Match': response.headers.get('ETag') } }), {});
    assert.equal(cached.status, 304);
  }
});

test('leaderboard replays submitted controls, rejects tampering and retains ten scores', async context => {
  const { db, database } = testDb();
  const now = context.mock.method(Date, 'now', () => 1000000);
  const get = path => site.fetch(new Request('https://arcade.test/api/arcade/' + path), { DB: db });
  const post = (path, body, origin) => site.fetch(new Request('https://arcade.test/api/arcade/' + path, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...(origin ? { Origin: origin } : {}) },
    body: JSON.stringify(body),
  }), { DB: db });
  assert.deepEqual(await (await get('scores')).json(), { scores: [] });
  assert.equal((await post('start', {}, 'https://elsewhere.test')).status, 403);
  for (let i = 0; i < 12; i++) {
    const start = await post('start', {});
    assert.equal(start.status, 201);
    const { seed, id } = await start.json();
    const run = play(seed);
    const data = { id, initials: 'NOX', frame: run.frame, moves: run.moves, score: 9999999 };
    assert.equal((await post('scores', data)).status, 400);
    now.mock.mockImplementation(() => 1000000 + i * 10000 + 9000);
    assert.equal((await post('scores', { ...data, initials: 'NO' })).status, 400);
    assert.equal((await post('scores', data)).status, 201);
    now.mock.mockImplementation(() => 1000000 + (i + 1) * 10000);
  }
  const { scores } = await (await get('scores')).json();
  assert.equal(scores.length, 10);
  assert.ok(scores.every((record, i) => record.score < 9999999 && (i === 0 || record.score <= scores[i - 1].score)));
  assert.equal(database.prepare('SELECT COUNT(*) AS count FROM arcade_runs').get().count, 0);
  database.close();
});

test('completed row reports its original blast position and preserves remaining car fragments', () => {
  const game = createGame(9);
  const filler = { type: 'j', turn: 0, dx: 0, dy: 0 };
  game.active = { type: 'o', shape: ['xx', 'xx'], turn: 0, x: 4, y: 0 };
  game.board[19] = Array(10).fill(filler);
  game.board[19][4] = game.board[19][5] = null;
  step(game, MOVE.drop);
  assert.deepEqual(game.clearedRows, [19]);
  assert.equal(game.lines, 1);
  assert.deepEqual(game.board[19][4], { type: 'o', turn: 0, dx: 0, dy: 0 });
  assert.deepEqual(game.board[19][5], { type: 'o', turn: 0, dx: 1, dy: 0 });
  step(game);
  assert.equal(game.clearedRows, null);
});
