import { COLS, ROWS, TICK_MS, MOVE, SHAPES, cells, createGame, landingY, step } from './engine.mjs';
import { paintCarFragment } from './cars.mjs';

const byId = id => document.getElementById(id);
const board = byId('board');
const slots = Array.from({ length: COLS * ROWS }, () => {
  const slot = document.createElement('span');
  slot.className = 'slot';
  board.append(slot);
  return slot;
});
const drawnTiles = Array(slots.length).fill('');
const initials = byId('initials');
const form = byId('score-form');
const overlay = byId('overlay');
const start = byId('start');
const pause = byId('pause');
const save = byId('save');
const message = byId('message');
const controls = [...document.querySelectorAll('button[data-action]')];
const keyMap = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'spin', ArrowDown: 'down', Space: 'drop', ' ': 'drop' };
const repeatable = new Set(['left', 'right', 'down']);
const held = new Map();
const num = new Intl.NumberFormat('ko-KR');
const endNote = location.hash.slice(1);
if (/^(about|place|request|github|method(?:\/[1-5])?)$/.test(endNote)) byId('exit').href = '/#' + endNote;

let game = createGame(15);
let phase = 'idle';
let moves = [];
let run = null;
let nextTile = null;
let pending = 0;
let previous = 0;
let elapsed = 0;

async function api(path, payload) {
  const options = { signal: AbortSignal.timeout(8000), cache: 'no-store' };
  if (payload) Object.assign(options, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const response = await fetch('/api/arcade/' + path, options);
  if (!response.ok) throw new Error('Arcade API ' + response.status);
  return response.json();
}

function note(value) {
  message.textContent = value;
  message.hidden = !value;
}

function render() {
  const tiles = game.board.flat();
  const { shape, x, y, type, turn } = game.active;
  if (phase === 'playing' || phase === 'paused') {
    const ghostY = landingY(game);
    for (const [dx, dy] of cells(shape)) {
      if (ghostY + dy >= 0) tiles[(ghostY + dy) * COLS + x + dx] = { type, ghost: true };
    }
    for (const [dx, dy] of cells(shape)) {
      if (y + dy >= 0) tiles[(y + dy) * COLS + x + dx] = { type, turn, dx, dy };
    }
  }
  slots.forEach((slot, i) => {
    const tile = tiles[i];
    const key = !tile ? '' : tile.ghost ? 'ghost:' + tile.type : [tile.type, tile.turn, tile.dx, tile.dy].join(':');
    if (drawnTiles[i] === key) return;
    drawnTiles[i] = key;
    slot.className = 'slot';
    slot.removeAttribute('style');
    if (tile?.ghost) slot.classList.add('ghost', 'car-' + tile.type);
    else if (tile) paintCarFragment(slot, tile);
  });
  byId('score').textContent = num.format(game.score);
  byId('level').textContent = String(game.level).padStart(2, '0');
  byId('survival').firstChild.textContent = (game.maxFrames * TICK_MS / 1000).toFixed(1);
  byId('survival').parentElement.classList.toggle('at-max', game.level === 10);
  if (nextTile !== game.next) {
    nextTile = game.next;
    const positions = cells(SHAPES[nextTile]);
    const top = Math.min(...positions.map(([, row]) => row));
    byId('next').replaceChildren(...positions.map(([col, row]) => {
      const marker = document.createElement('span');
      paintCarFragment(marker, { type: nextTile, turn: 0, dx: col, dy: row });
      marker.style.gridArea = (row - top + 1) + ' / ' + (col + 1);
      return marker;
    }));
  }
}

async function startGame() {
  if (phase === 'paused') {
    setPaused(false);
    return;
  }
  if (phase === 'loading' || save.disabled) return;
  phase = 'loading';
  start.disabled = true;
  form.hidden = true;
  note('');
  byId('game-state').textContent = '시동 중…';
  try {
    run = await api('start', {});
  } catch {
    run = null;
  }
  game = createGame(run?.seed ?? crypto.getRandomValues(new Uint32Array(1))[0]);
  moves = [];
  clearInput();
  previous = performance.now();
  elapsed = 0;
  phase = 'playing';
  overlay.hidden = true;
  start.disabled = false;
  pause.disabled = false;
  pause.textContent = '일시 정지';
  board.focus({ preventScroll: true });
  render();
}

function clearInput() {
  pending = 0;
  held.clear();
  controls.forEach(button => button.classList.remove('held'));
}

function setPaused(paused) {
  if (paused ? phase !== 'playing' : phase !== 'paused') return;
  clearInput();
  phase = paused ? 'paused' : 'playing';
  overlay.hidden = !paused;
  if (paused) {
    byId('game-state').textContent = '일시 정지';
    start.textContent = '계속하기';
    pause.textContent = '계속하기';
    note('');
    start.focus({ preventScroll: true });
  } else {
    pause.textContent = '일시 정지';
    previous = performance.now();
    elapsed = 0;
    board.focus({ preventScroll: true });
  }
}

function gameOver() {
  clearInput();
  phase = 'over';
  pause.disabled = true;
  overlay.hidden = false;
  byId('game-state').textContent = '주행 종료 · ' + num.format(game.score) + '점';
  start.textContent = '다시 하기';
  form.hidden = !run;
  initials.value = '';
  note(run ? '' : '연습 주행 · 순위 서버에 연결할 수 없습니다.');
  if (run && matchMedia('(pointer:fine)').matches) initials.focus({ preventScroll: true });
}

function press(action, id) {
  if (phase !== 'playing' || held.has(id)) return;
  pending |= MOVE[action];
  if (repeatable.has(action)) held.set(id, { action, repeatAt: game.frame + (action === 'down' ? 2 : 4) });
}

function explodeRows(rows) {
  const effects = byId('effects');
  const flashOnly = matchMedia('(prefers-reduced-motion: reduce)').matches;
  for (const row of rows) {
    const wave = document.createElement('div');
    wave.className = 'row-blast';
    wave.style.top = (100 * row / ROWS) + '%';
    if (!flashOnly) {
      for (let i = 0; i < 14; i++) {
        const spark = document.createElement('span');
        spark.style.left = (6 + 88 * i / 13) + '%';
        spark.style.setProperty('--dx', ((i % 5) - 2) * 19 + 'px');
        spark.style.setProperty('--dy', (i % 2 ? 1 : -1) * (21 + (i % 4) * 11) + 'px');
        wave.append(spark);
      }
    }
    wave.addEventListener('animationend', event => {
      if (event.target === wave) wave.remove();
    });
    effects.append(wave);
  }
}

function loop(now) {
  if (phase === 'playing') {
    elapsed += Math.max(0, Math.min(now - previous, 350));
    previous = now;
    if (elapsed >= TICK_MS) {
      while (elapsed >= TICK_MS && !game.over) {
        elapsed -= TICK_MS;
        let mask = pending;
        pending = 0;
        for (const key of held.values()) {
          if (game.frame + 1 >= key.repeatAt) {
            mask |= MOVE[key.action];
            key.repeatAt += key.action === 'down' ? 1 : 2;
          }
        }
        if (mask && run) moves.push([game.frame + 1, mask]);
        step(game, mask);
        if (game.clearedRows) explodeRows(game.clearedRows);
      }
      if (game.over) gameOver();
      render();
    }
  }
  requestAnimationFrame(loop);
}

async function loadScores() {
  try {
    const { scores } = await api('scores');
    showScores(scores);
  } catch {
    showScores([], '순위를 불러올 수 없습니다. 새로고침해 다시 시도해 주세요.');
  }
}

function showScores(scores, empty = '첫 기록에 도전해 보세요.') {
  const body = byId('scores');
  body.replaceChildren();
  if (!scores.length) {
    const cell = body.insertRow().insertCell();
    cell.colSpan = 4;
    cell.textContent = empty;
    return;
  }
  scores.slice(0, 10).forEach(({ initials: name, score, max_frames: max }, index) => {
    const row = body.insertRow();
    [index + 1, name, num.format(score), (max * TICK_MS / 1000).toFixed(1) + '초'].forEach(value => {
      row.insertCell().textContent = value;
    });
  });
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!run || phase !== 'over' || save.disabled) return;
  save.disabled = true;
  start.disabled = true;
  note('기록 확인 중…');
  try {
    const result = await api('scores', { id: run.id, initials: initials.value.toUpperCase(), frame: game.frame, moves });
    form.hidden = true;
    run = null;
    showScores(result.scores);
    note(result.qualified ? '순위표에 등록했습니다.' : '기록을 확인했습니다. 상위 10위에 들면 순위표에 표시됩니다.');
  } catch {
    note('기록을 등록하지 못했습니다. 다시 시도해 주세요.');
  } finally {
    save.disabled = false;
    start.disabled = false;
  }
});

start.addEventListener('click', startGame);
pause.addEventListener('click', () => setPaused(phase !== 'paused'));
document.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.target === initials) return;
  if ((event.code === 'KeyP' || event.key?.toLowerCase() === 'p') && !event.repeat) {
    setPaused(phase !== 'paused');
    return;
  }
  const action = keyMap[event.code] ?? keyMap[event.key];
  if (phase !== 'playing' || !action) return;
  if (action === 'drop' && event.target.matches('button, a')) return;
  event.preventDefault();
  if (!event.repeat) press(action, 'key:' + action);
});
document.addEventListener('keyup', event => {
  const action = keyMap[event.code] ?? keyMap[event.key];
  if (action) held.delete('key:' + action);
});

for (const button of controls) {
  button.addEventListener('pointerdown', event => {
    if (phase !== 'playing' || event.button !== 0) return;
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    button.classList.add('held');
    press(button.dataset.action, event.pointerId);
  });
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    button.addEventListener(type, event => {
      held.delete(event.pointerId);
      button.classList.remove('held');
    });
  }
  button.addEventListener('click', event => {
    if (!event.detail) press(button.dataset.action, null);
    held.delete(null);
  });
}
window.addEventListener('blur', () => setPaused(true));
document.addEventListener('visibilitychange', () => {
  if (document.hidden) setPaused(true);
});

render();
loadScores();
requestAnimationFrame(loop);
