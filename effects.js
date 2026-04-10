/*
effects.js — tombstone shim
The large monolithic effects array was split into modular files under /effects/.
Removed the big effects array into individual modules for maintainability.
See ./effects/index.js which aggregates and exports the effects array.
*/
export { effects } from './effects/index.js';