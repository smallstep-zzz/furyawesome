export const COLS = 10;
export const ROWS = 20;
export const TICK_MS = 50;
export const MAX_FRAME = 216000;
export const MAX_MOVES = 30000;
export const MOVE = { left: 1, right: 2, spin: 4, down: 8, drop: 16 };
const SPEED_TICKS = [18, 16, 14, 12, 10, 8, 6, 5, 4, 3];
const TYPES = ['i', 'o', 't', 's', 'z', 'j', 'l'];
export const SHAPES = {
  i: ['....', 'xxxx', '....', '....'],
  o: ['xx', 'xx'],
  t: ['.x.', 'xxx', '...'],
  s: ['.xx', 'xx.', '...'],
  z: ['xx.', '.xx', '...'],
  j: ['x..', 'xxx', '...'],
  l: ['..x', 'xxx', '...'],
};

function random(game) {
  let state = game.seed;
  state ^= state << 13;
  state ^= state >>> 17;
  state ^= state << 5;
  game.seed = state >>> 0;
  return game.seed;
}

function takePiece(game) {
  if (!game.bag.length) {
    game.bag = [...TYPES];
    for (let index = game.bag.length - 1; index > 0; index--) {
      const pick = random(game) % (index + 1);
      [game.bag[index], game.bag[pick]] = [game.bag[pick], game.bag[index]];
    }
  }
  return game.bag.pop();
}

export function cells(shape) {
  const positions = [];
  shape.forEach((row, y) => {
    [...row].forEach((tile, x) => {
      if (tile === 'x') positions.push([x, y]);
    });
  });
  return positions;
}

function fits(game, shape, x, y) {
  return cells(shape).every(([dx, dy]) => {
    const col = x + dx;
    const row = y + dy;
    return col >= 0 && col < COLS && row < ROWS && (row < 0 || !game.board[row][col]);
  });
}

function spawn(game) {
  const type = game.next;
  const shape = SHAPES[type];
  game.next = takePiece(game);
  game.active = { type, shape, x: Math.floor((COLS - shape.length) / 2), y: -1, turn: 0 };
  game.fall = 0;
  game.grounded = 0;
  if (!fits(game, shape, game.active.x, game.active.y)) game.over = true;
}

export function createGame(seed) {
  const game = {
    seed: Number(seed) >>> 0 || 1,
    board: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
    bag: [], frame: 0, score: 0, lines: 0, level: 1, maxFrames: 0, over: false,
  };
  game.next = takePiece(game);
  spawn(game);
  return game;
}

export function speedMs(game) {
  return SPEED_TICKS[game.level - 1] * TICK_MS;
}

function move(game, x, y) {
  const piece = game.active;
  if (!fits(game, piece.shape, piece.x + x, piece.y + y)) return false;
  piece.x += x;
  piece.y += y;
  return true;
}

function rotate(game) {
  const { shape, type, x, y } = game.active;
  if (type === 'o') return;
  const rotated = shape.map((_, col) => shape.map(row => row[col]).reverse().join(''));
  const kicks = [[0, 0], [-1, 0], [1, 0], [-2, 0], [2, 0], [0, -1], [-1, -1], [1, -1]];
  for (const [dx, dy] of kicks) {
    if (fits(game, rotated, x + dx, y + dy)) {
      Object.assign(game.active, { shape: rotated, x: x + dx, y: y + dy, turn: (game.active.turn + 1) % 4 });
      return;
    }
  }
}

export function landingY(game) {
  const { shape, x, y } = game.active;
  let landing = y;
  while (fits(game, shape, x, landing + 1)) landing++;
  return landing;
}

function park(game) {
  const { shape, type, turn, x, y } = game.active;
  const positions = cells(shape);
  if (positions.some(([, dy]) => y + dy < 0)) {
    game.over = true;
    return;
  }
  for (const [dx, dy] of positions) game.board[y + dy][x + dx] = { type, turn, dx, dy };
  const remaining = game.board.filter((row, index) => {
    if (row.some(tile => !tile)) return true;
    (game.clearedRows ??= []).push(index);
    return false;
  });
  const cleared = ROWS - remaining.length;
  while (remaining.length < ROWS) remaining.unshift(Array(COLS).fill(null));
  game.board = remaining;
  game.lines += cleared;
  game.score += [0, 120, 340, 650, 1100][cleared] * game.level;
  spawn(game);
}

export function step(game, action = 0) {
  if (game.over) return;
  game.frame++;
  game.clearedRows = null;
  // Clear rows or keep the run alive to reach the speed ceiling.
  game.level = Math.min(SPEED_TICKS.length, 1 + Math.max(
    Math.floor(game.lines / 6), Math.floor(game.frame * TICK_MS / 25000)
  ));
  if (game.level === SPEED_TICKS.length) game.maxFrames++;
  if (action & MOVE.spin) rotate(game);
  if (Boolean(action & MOVE.left) !== Boolean(action & MOVE.right)) {
    move(game, action & MOVE.left ? -1 : 1, 0);
  }
  if (action & MOVE.drop) {
    const landing = landingY(game);
    game.score += (landing - game.active.y) * 2;
    game.active.y = landing;
    park(game);
    return;
  }
  if (action & MOVE.down && move(game, 0, 1)) game.score++;
  if (++game.fall >= SPEED_TICKS[game.level - 1]) {
    move(game, 0, 1);
    game.fall = 0;
  }
  const { shape, x, y } = game.active;
  game.grounded = fits(game, shape, x, y + 1) ? 0 : game.grounded + 1;
  if (game.grounded === 9) park(game);
}

export function replay(seed, frame, moves) {
  if (!Number.isInteger(frame) || frame < 1 || frame > MAX_FRAME ||
      !Array.isArray(moves) || moves.length > MAX_MOVES) return null;
  let previous = 0;
  for (const move of moves) {
    if (!Array.isArray(move) || move.length !== 2) return null;
    const [time, mask] = move;
    if (!Number.isInteger(time) || time <= previous || time > frame ||
        !Number.isInteger(mask) || mask < 1 || mask > 31) return null;
    previous = time;
  }
  const game = createGame(seed);
  let index = 0;
  while (!game.over && game.frame < frame) {
    const next = moves[index];
    step(game, next?.[0] === game.frame + 1 ? moves[index++][1] : 0);
  }
  return game.over && game.frame === frame ? game : null;
}
