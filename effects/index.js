/* effects/index.js
Aggregates modular effect definitions into a single exported array.
*/
import { colorCorrection } from './color_correction.js';
import { vignette } from './vignette.js';
import { oldFilm } from './old_film.js';
import { gaussianBlur } from './gaussian_blur.js';
import { crush } from './crush.js';
import { glow } from './glow.js';
import { invert } from './invert.js';
import { swirl } from './swirl.js';
import { chromaticAberration } from './chromatic_aberration.js';
import { shake } from './shake.js';
import { zoomBlur } from './zoom_blur.js';
import { chromaKey } from './chroma_key.js';
import { replica } from './replica.js';
import { wave } from './wave.js';
import { threshold } from './threshold.js';
import { hslAdjust } from './hsl_adjust.js';
import { channelBlend } from './channel_blend.js';
import { pinchPunch } from './pinch_punch.js';
import { jitter } from './jitter.js';

export const effects = [
  colorCorrection,
  vignette,
  oldFilm,
  gaussianBlur,
  crush,
  glow,
  invert,
  swirl,
  chromaticAberration,
  shake,
  zoomBlur,
  chromaKey,
  replica,
  wave,
  threshold,
  channelBlend,
  hslAdjust,
  pinchPunch,
  jitter
];