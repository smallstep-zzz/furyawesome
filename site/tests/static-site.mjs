import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const root = new URL('../dist/', import.meta.url);
// Resolve assets under a project prefix, as Pages does (also catches root-only URLs).
for (const page of ['index.html', 'arcade/index.html']) {
  const html = readFileSync(new URL(page, root), 'utf8');
  const base = new URL(page, 'https://example.test/furyawesome/');
  for (const [, attribute, value] of html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, match => match.slice(0, match.indexOf('>') + 1)).matchAll(/\b(src|href)="([^"\s]+)"/g)) {
    if (/^(?:https?:|data:|#|mailto:)/.test(value)) continue;
    const url = new URL(value, base);
    assert.ok(url.pathname.startsWith('/furyawesome/'), `${page}: outside project path: ${value}`);
    const relative = url.pathname.slice('/furyawesome/'.length);
    assert.ok(existsSync(new URL(relative.endsWith('/') ? relative + 'index.html' : relative, root)), `${page}: missing ${attribute}: ${value}`);
  }
}
const html = readFileSync(new URL('arcade/index.html', root), 'utf8');
assert.doesNotMatch(html, /leaderboard|score-form|ranking-status/);
const source = readFileSync(new URL('arcade/game.mjs', root), 'utf8');
assert.doesNotMatch(source, /fetch\(|\/api\/|loadScores|initials/);
assert.match(readFileSync(new URL('index.html', root), 'utf8'), /repo\+'\/issues\/new'/);

// Exercise the real game controller without a server, including game over and restart.
class Element {
  constructor() {
    this.events = {}; this.children = []; this.style = { setProperty() {} };
    this.classList = { add() {}, remove() {}, toggle() {} };
    this.firstChild = { textContent: '' }; this.parentElement = this;
    this.hidden = false; this.disabled = false;
  }
  getContext() { return new Proxy({}, { get: (_, key) => key === 'createLinearGradient' ? () => ({ addColorStop() {} }) : () => {} }); }
  toDataURL() { return 'data:image/png;base64,'; }
  append(child) { this.children.push(child); }
  replaceChildren(...children) { this.children = children; }
  setAttribute() {} removeAttribute() {} focus() {} remove() {}
  addEventListener(type, fn) { this.events[type] = fn; }
}
const elements = new Map();
const document = new Element();
document.getElementById = id => {
  if (!elements.has(id)) elements.set(id, new Element());
  return elements.get(id);
};
document.createElement = () => new Element();
document.querySelectorAll = () => [];
let frameCallback;
Object.assign(globalThis, {
  Path2D: class { moveTo() {} lineTo() {} quadraticCurveTo() {} arcTo() {} closePath() {} },
  document, window: new Element(), location: { hash: '#request' },
  matchMedia: () => ({ matches: false }),
  requestAnimationFrame: callback => { frameCallback = callback; },
  fetch: () => { throw new Error('Static game must never access the network'); },
});
await import(new URL('arcade/game.mjs', root));
const get = id => document.getElementById(id);
assert.equal(get('exit').href, '../#request');
assert.equal(get('board').children.length, 200);
get('start').events.click();
assert.equal(get('overlay').hidden, true);
assert.equal(get('pause').disabled, false);
get('pause').events.click();
assert.equal(get('game-state').textContent, '일시 정지');
get('start').events.click();
assert.equal(get('overlay').hidden, true);
let now = performance.now();
for (let i = 0; i < 1000 && get('overlay').hidden; i++) {
  document.events.keydown({ code: 'Space', target: { matches: () => false }, preventDefault() {} });
  frameCallback(now += 100);
}
assert.match(get('game-state').textContent, /^주행 종료/);
assert.equal(get('pause').disabled, true);
get('start').events.click();
assert.equal(get('overlay').hidden, true);
assert.equal(get('score').textContent, '0');
assert.equal(get('pause').disabled, false);
console.log('Static paths, issue handoff, and server-free game start/pause/game-over/restart passed.');
