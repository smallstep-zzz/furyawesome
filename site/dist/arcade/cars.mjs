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

function roundedOutline(shape, positions) {
  const edges = new Map();
  for (const [x, y] of positions) {
    const sides = [
      [x, y - 1, [x, y], [x + 1, y]],
      [x + 1, y, [x + 1, y], [x + 1, y + 1]],
      [x, y + 1, [x + 1, y + 1], [x, y + 1]],
      [x - 1, y, [x, y + 1], [x, y]],
    ];
    for (const [nx, ny, start, end] of sides) {
      if (shape[ny]?.[nx] !== 'x') edges.set(start.join(','), end);
    }
  }

  const vertices = [positions[0]];
  for (let i = 1; i < edges.size; i++) vertices.push(edges.get(vertices[i - 1].join(',')));
  const outline = new Path2D();
  const first = vertices[0];
  const last = vertices.at(-1);
  outline.moveTo((first[0] + last[0]) / 2, (first[1] + last[1]) / 2);
  for (let i = 0; i < vertices.length; i++) {
    const [x, y] = vertices[i];
    const [px, py] = vertices.at(i - 1);
    const [nx, ny] = vertices[(i + 1) % vertices.length];
    const clockwise = (x - px) * (ny - y) - (y - py) * (nx - x) > 0;
    if (clockwise) outline.arcTo(x, y, nx, ny, .14);
    else outline.lineTo(x, y);
  }
  outline.closePath();
  return outline;
}

function crushedDetails(ctx, type, positions) {
  const [x, y] = positions[type === 'i' ? 1 : 0];
  const width = type === 'i' ? 1.23 : .79;
  const window = [[x + .12, y + .47], [x + .25, y + .18],
                  [x + width, y + .24], [x + width - .05, y + .40], [x + .48, y + .49]];
  facet(ctx, window, '#233c4a');
  fold(ctx, window, .06, '#aab6b8');
  fold(ctx, [[x + .39, y + .20], [x + .54, y + .32], [x + .43, y + .35],
             [x + .56, y + .46]], .025, '#b1cad5');

  const [bx, by] = positions.at(-1);
  ctx.save();
  ctx.translate(bx + .30, by + .75);
  ctx.rotate(-.33);
  ctx.scale(1, .53);
  for (const [radius, color] of [[.22, '#161b21'], [.13, '#8a959d'], [.065, '#333a40']]) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
  ctx.restore();

  const bumper = [[bx + .47, by + .46], [bx + .78, by + .42],
                  [bx + .91, by + .51], [bx + .88, by + .70], [bx + .50, by + .66]];
  facet(ctx, bumper, '#272c32');
  fold(ctx, [bumper[4], bumper[3], bumper[2]], .06, '#aab0ad');
  fold(ctx, [[bx + .54, by + .53], [bx + .64, by + .52]], .07, '#fff1bd');
  fold(ctx, [[bx + .77, by + .53], [bx + .85, by + .56]], .07, '#faab61');
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

  const outline = roundedOutline(shape, positions);
  ctx.clip(outline);
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
  for (let y = highest + .16; y < lowest; y += .29) {
    const points = Array.from({ length: length * 4 + 2 }, (_, i) => [
      i * .25 - .1, y + (random() - .5) * .28,
    ]);
    fold(ctx, points, .105, shade);
    fold(ctx, points.map(([x, row]) => [x, row - .041]), .035, paint);
    fold(ctx, points.slice(1, 4), .025, '#ebebe2ac');
  }
  for (let i = 0; i < length * 9; i++) {
    const x = random() * length;
    const y = highest + random() * (lowest - highest);
    const width = .12 + random() * .7;
    const dent = .055 + random() * .16;
    facet(ctx, [[x,y],[x+width*.33,y-dent],[x+width,y+dent*.55],[x+width*.18,y+dent]], [
      '#181e24c4', paint + 'ae', '#bbc0c0b5', shade + 'c6',
    ][i % 4]);
  }

  crushedDetails(ctx, type, positions);
  const trim = ctx.createLinearGradient(0, highest, length / 2, lowest);
  trim.addColorStop(0, '#d9ded7');
  trim.addColorStop(.48, paint);
  trim.addColorStop(1, '#252831');
  ctx.lineWidth = .11;
  ctx.strokeStyle = '#1b2027';
  ctx.stroke(outline);
  ctx.lineWidth = .046;
  ctx.strokeStyle = trim;
  ctx.stroke(outline);
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
