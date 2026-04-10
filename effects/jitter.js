export const jitter = {
  id: 'jitter',
  name: 'Jitter (Vertical)',
  description: 'Fast vertical-only temporal jitter/shake',
  params: [
    { key: 'intensity', name: 'Intensity (px)', min: 0, max: 40, step: 1, default: 6 },
    { key: 'freq', name: 'Frequency', min: 0.1, max: 30, step: 0.1, default: 12 }
  ],
  apply: (pixels, w, h, p, time = 0) => {
    const d = pixels.data;
    const t = time * 0.001;
    const oy = Math.round(Math.sin(t * p.freq) * p.intensity);
    const out = new Uint8ClampedArray(d.length);
    for (let y = 0; y < h; y++) {
      const sy = Math.min(h - 1, Math.max(0, y - oy));
      for (let x = 0; x < w; x++) {
        const sIdx = (sy * w + x) * 4;
        const dIdx = (y * w + x) * 4;
        out[dIdx] = d[sIdx];
        out[dIdx + 1] = d[sIdx + 1];
        out[dIdx + 2] = d[sIdx + 2];
        out[dIdx + 3] = d[sIdx + 3];
      }
    }
    pixels.data.set(out);
  }
};