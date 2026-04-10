/*
app.js (refactored)
This file now bootstraps the modularized pieces: effects, renderer, and ui.
Large functions and the monolithic code were moved into modules:
  - effects.js (effects array)
  - renderer.js (canvas, draw loop, startRendering)
  - ui.js (DOM wiring, controls)
TOMBSTONE: removed big monolithic implementation (see individual modules).
*/

// removed function initCanvas() {}
// removed function fitMediaToCanvas() {}
// removed function makeEffectList() {}
// removed function selectEffect() {}
// removed function renderControls() {}
// removed function drawFrame() {}
// removed function startRendering() {}
// removed media/load/export handlers and the entire effects array (moved to effects.js)

import { effects } from './effects.js';
import { createRenderer } from './renderer.js';
import { createUI } from './ui.js';

const media = document.getElementById('media');
const canvas = document.getElementById('canvas');
const fileIn = document.getElementById('file');
const useSample = document.getElementById('useSample');
const effectsList = document.getElementById('effectsList');
const controls = document.getElementById('controls');
const resetBtn = document.getElementById('reset');
const exportBtn = document.getElementById('exportPNG');

const state = {
  ctx: null,
  cw: 1280,
  ch: 720,
  activeEffect: null,
  stateParams: {},
  animId: null,
  media,
  canvas,
  fileIn,
  useSample,
  effectsList,
  controls,
  resetBtn,
  exportBtn,
  effects
};

// instantiate modules
const renderer = createRenderer(state);
const ui = createUI(state, renderer);

// start with sample video auto-loaded (same default as before)
ui.loadMedia('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');