import { SHAPES, cells } from './engine.mjs';

const UNIT = 56;
const profiles = {
  i: { paint: '#5cf3cf', shade: '#176957', body: [[.08,1.68],[.42,1.48],[1.05,1.41],[1.45,1.18],[2.20,1.18],[2.48,1.43],[3.7,1.49],[3.94,1.63],[3.88,1.78],[.18,1.78]], windows: [[1.35,1.43],[1.52,1.23],[2.15,1.23],[2.37,1.44]], wheels:[.79,3.26], axle:1.78, radius:.165 },
  o: { paint: '#ffd16f', shade: '#8a5416', body: [[.12,1.52],[.14,.46],[.34,.26],[1.39,.26],[1.64,.43],[1.83,1.06],[1.92,1.15],[1.9,1.62],[.16,1.62]], windows:[[.30,.47],[1.37,.47],[1.60,1.00],[.30,1.00]], wheels:[.47,1.54], axle:1.65, radius:.23 },
  t: { paint: '#bc9df9', shade: '#6544a0', body: [[.08,1.60],[.25,1.20],[.78,1.05],[1.16,.38],[1.81,.34],[2.12,1.09],[2.79,1.23],[2.94,1.45],[2.88,1.66],[.16,1.72]], windows:[[1.06,.99],[1.26,.47],[1.72,.44],[1.93,.99]], wheels:[.60,2.41], axle:1.68, radius:.217 },
  s: { paint: '#b1e06e', shade: '#416f2b', body: [[.09,1.53],[.27,1.27],[.71,1.16],[1.17,.53],[1.47,.35],[2.47,.29],[2.82,.52],[2.92,.76],[2.63,.95],[2.01,1.07],[1.90,1.69],[.17,1.72]], windows:[[1.27,.82],[1.52,.46],[2.43,.41],[2.64,.56],[2.51,.75]], wheels:[.54,1.61], axle:1.68, radius:.21 },
  z: { paint: '#f77779', shade: '#983c48', body: [[.08,.63],[.24,.45],[.88,.39],[1.38,.29],[1.81,.49],[1.98,.94],[2.68,1.13],[2.93,1.36],[2.90,1.70],[1.19,1.72],[1.07,.87],[.14,.82]], windows:[[.40,.51],[1.39,.40],[1.68,.55],[1.78,.79],[1.11,.72]], wheels:[1.43,2.52], axle:1.67, radius:.207 },
  j: { paint: '#75b7fa', shade: '#2c569a', body: [[.08,1.53],[.12,.50],[.25,.32],[.72,.32],[.91,.53],[1.09,1.08],[2.62,1.19],[2.89,1.32],[2.93,1.63],[.14,1.72]], windows:[[.25,.52],[.67,.44],[.81,.56],[.96,1.00],[.25,1.00]], wheels:[.55,2.38], axle:1.67, radius:.22 },
  l: { paint: '#f69859', shade: '#994b24', body: [[.07,1.55],[.13,1.17],[1.17,1.18],[1.68,1.06],[2.13,.44],[2.31,.32],[2.72,.36],[2.85,.53],[2.94,1.14],[2.93,1.62],[.15,1.73]], windows:[[2.00,1.00],[2.25,.52],[2.43,.45],[2.67,.48],[2.78,1.00]], wheels:[.53,2.41], axle:1.67, radius:.22 },
};
const sprites = new Map();

function polygon(ctx, points, color, line = null) {
  ctx.beginPath();
  points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  if (line) {
    ctx.strokeStyle = line;
    ctx.lineWidth = .045;
    ctx.stroke();
  }
}

function disc(ctx, x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function sprite(type, turn) {
  const key = type + turn;
  if (sprites.has(key)) return sprites.get(key);
  const shape = SHAPES[type];
  const size = shape.length;
  const { paint, shade, body, windows, wheels, axle, radius } = profiles[type];
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = UNIT * size;
  const ctx = canvas.getContext('2d');
  ctx.scale(UNIT, UNIT);
  ctx.translate(size / 2, size / 2);
  ctx.rotate(turn * Math.PI / 2);
  ctx.translate(-size / 2, -size / 2);

  const positions = cells(shape);
  ctx.beginPath();
  positions.forEach(([x, y]) => ctx.rect(x, y, 1, 1));
  ctx.clip();
  for (const [x, y] of positions) {
    ctx.fillStyle = shade;
    ctx.fillRect(x, y, 1, 1);
    ctx.fillStyle = '#11131de0';
    ctx.fillRect(x, y, 1, 1);
    ctx.strokeStyle = paint + '42';
    ctx.lineWidth = .028;
    for (const [dx, dy, wx, wy] of [[0,-1,1,0],[1,0,0,1],[0,1,1,0],[-1,0,0,1]]) {
      if (shape[y + dy]?.[x + dx] === 'x') continue;
      const a = x + (dx > 0 ? .97 : .03);
      const b = y + (dy > 0 ? .97 : .03);
      ctx.beginPath();
      ctx.moveTo(a, b);
      ctx.lineTo(a + wx * .94, b + wy * .94);
      ctx.stroke();
    }
  }

  const [roof, sill] = body.reduce(([low, high], [, y]) => [Math.min(low, y), Math.max(high, y)], [size, 0]);
  const paintGradient = ctx.createLinearGradient(0, roof, 0, sill);
  paintGradient.addColorStop(0, '#e9f4ec');
  paintGradient.addColorStop(.26, paint);
  paintGradient.addColorStop(.72, paint);
  paintGradient.addColorStop(1, shade);
  polygon(ctx, body, paintGradient, '#111319');

  const glass = ctx.createLinearGradient(0, roof, 0, sill);
  glass.addColorStop(0, '#94b8c5');
  glass.addColorStop(.32, '#324b59');
  glass.addColorStop(.65, '#151821');
  polygon(ctx, windows, glass, '#292833');

  for (const x of wheels) {
    disc(ctx, x, axle, radius, '#111319');
    disc(ctx, x, axle, radius * .57, '#8998a1');
    disc(ctx, x, axle, radius * .28, '#293239');
  }
  const lamps = {
    i:[3.75,1.61,.15,1.59], o:[1.73,1.23,.18,1.12], t:[2.73,1.43,.18,1.44],
    s:[2.70,.57,.18,1.45], z:[2.75,1.45,.18,.63], j:[2.74,1.42,.17,1.13], l:[2.78,1.30,.17,1.36],
  }[type];
  ctx.fillStyle = '#fff6cb';
  ctx.fillRect(lamps[0], lamps[1], .13, .07);
  ctx.fillStyle = '#ff513d';
  ctx.fillRect(lamps[2], lamps[3], .11, .07);
  const data = 'url(' + canvas.toDataURL('image/png') + ')';
  sprites.set(key, data);
  return data;
}

export function paintCarFragment(element, { type, turn, dx, dy }) {
  const size = SHAPES[type].length;
  element.classList.add('car-fragment');
  element.style.backgroundImage = sprite(type, turn);
  element.style.backgroundSize = (size * 100) + '%';
  element.style.backgroundPosition = (100 * dx / (size - 1)) + '% ' + (100 * dy / (size - 1)) + '%';
}
