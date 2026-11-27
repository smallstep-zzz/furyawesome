import { SHAPES, cells } from './engine.mjs';

const UNIT = 56;
const profiles = {
  i: ['#52dbb4', '#125749'],
  o: ['#e7b857', '#6e451d'],
  t: ['#b590df', '#4c356b'],
  s: ['#a3c966', '#405a21'],
  z: ['#eb6d66', '#702f38'],
  j: ['#70abe7', '#254c76'],
  l: ['#ec925d', '#794427'],
};
const sprites = new Map();

function path(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (const point of points.slice(1)) ctx.lineTo(...point);
}

function fold(ctx, points, width, color) {
  path(ctx, points);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function facet(ctx, points, color) {
  path(ctx, points);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function scrap(ctx, shape, type) {
  const positions = cells(shape);
  const [paint, shade] = profiles[type];
  const length = shape.length;
  let seed = type.charCodeAt(0);
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  ctx.beginPath();
  positions.forEach(([x, y]) => ctx.rect(x, y, 1, 1));
  ctx.clip();
  const lowest = Math.max(...positions.map(([, y]) => y)) + 1;
  const highest = positions[0][1];
  const skin = ctx.createLinearGradient(0, highest, .7, lowest);
  skin.addColorStop(0, '#dce0db');
  skin.addColorStop(.11, paint);
  skin.addColorStop(.68, shade);
  skin.addColorStop(.88, paint);
  skin.addColorStop(1, '#272b30');
  ctx.fillStyle = skin;
  ctx.fillRect(0, 0, length, length);

  // Folds continue across cells, so every tetromino reads as one crushed car.
  for (let y = highest + .14; y < lowest; y += .24) {
    const points = Array.from({ length: length * 4 + 2 }, (_, i) => [
      i * .25 - .1, y + (random() - .5) * .28,
    ]);
    fold(ctx, points, .105, shade);
    fold(ctx, points.map(([x, row]) => [x, row - .041]), .035, paint);
    fold(ctx, points.slice(1, 4), .025, '#ebebe2ac');
  }
  for (let i = 0; i < length * 15; i++) {
    const x = random() * length;
    const y = highest + random() * (lowest - highest);
    const width = .12 + random() * .7;
    const dent = .055 + random() * .16;
    facet(ctx, [[x,y],[x+width*.33,y-dent],[x+width,y+dent*.55],[x+width*.18,y+dent]], [
      '#181e24c4', paint + 'ae', '#bbc0c0b5', shade + 'c6',
    ][i % 4]);
  }

  const [tx, ty] = positions[0];
  const [bx, by] = positions.at(-1);
  ctx.fillStyle = '#222a30';
  ctx.fillRect(tx+.12, ty+.30, .40, .22);
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = '#8d999d';
    ctx.fillRect(tx+.16, ty+.34+i*.055, .32, .018);
  }
  facet(ctx, [[bx+.32,by+.66],[bx+.92,by+.57],[bx+.89,by+.73],[bx+.40,by+.79]], '#2b252a');
  facet(ctx, [[bx+.62,by+.65],[bx+.84,by+.62],[bx+.82,by+.70],[bx+.61,by+.72]], '#d4483b');

  // A continuous, compressed outer edge keeps the silhouettes clear at 20px per cell.
  for (const [x, y] of positions) {
    const edges = [
      [x,y-1,[x,y],[x+1,y]], [x+1,y,[x+1,y],[x+1,y+1]],
      [x,y+1,[x,y+1],[x+1,y+1]], [x-1,y,[x,y],[x,y+1]],
    ];
    for (const [nx, ny, start, end] of edges) {
      if (shape[ny]?.[nx] === 'x') continue;
      fold(ctx, [start,end], .16, '#1b2027');
      const offset = [x + .5 - (start[0] + end[0]) / 2, y + .5 - (start[1] + end[1]) / 2];
      const face = [start,end].map(([px,py]) => [px + offset[0]*.18, py + offset[1]*.18]);
      fold(ctx, face, .041, (ny < y || nx < x) ? '#d4d8cc' : shade);
    }
  }
}

function sprite(type, turn) {
  const key = type + turn;
  if (sprites.has(key)) return sprites.get(key);
  const shape = SHAPES[type];
  const size = shape.length;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = UNIT * size;
  const ctx = canvas.getContext('2d');
  ctx.scale(UNIT, UNIT);
  ctx.translate(size / 2, size / 2);
  ctx.rotate(turn * Math.PI / 2);
  ctx.translate(-size / 2, -size / 2);
  scrap(ctx, shape, type);
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
