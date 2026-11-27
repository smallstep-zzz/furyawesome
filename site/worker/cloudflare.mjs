import { createWorker } from './arcade.mjs';
import { replay, TICK_MS } from '../dist/arcade/engine.mjs';

export default createWorker({}, { replay, TICK_MS });
