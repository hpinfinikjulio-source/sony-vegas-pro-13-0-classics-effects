export const threshold = {
  id: 'threshold',
  name: 'Threshold',
  description: 'Hard or soft threshold based on luminance (paper / halftone look)',
  params: [
    // Allow finer fractional adjustments for smooth control
    { key: 'threshold', name: 'Threshold (0-255)', min: 0, max: 255, step: 0.1, default: 128 },
    { key: 'softness', name: 'Softness (0 = hard)', min: 0, max: 1, step: 0.01, default: 0 }
  ],
  apply: (pixels, w, h, p) => {
    const d = pixels.data;
    const thr = Math.max(0, Math.min(255, p.threshold == null ? 128 : p.threshold));
    const soft = Math.max(0, Math.min(1, p.softness == null ? 0 : p.softness));
    // If softness is zero, do a simple hard threshold. Otherwise apply smoothstep around threshold.
    const half = soft * 128; // range of transition in luminance units
    const low = thr - half;
    const high = thr + half;

    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      // luminance (0..255)
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      let t;
      if (soft <= 0) {
        // keep hard threshold behavior but allow fractional threshold value
        t = lum >= thr ? 1 : 0;
      } else {
        // smoothstep between low..high
        const x = Math.max(0, Math.min(1, (lum - low) / (high - low + 1e-6)));
        // smoothstep cubic
        t = x * x * (3 - 2 * x);
      }
      // output black/white mix based on t
      // do not aggressively quantize to integer until assigning to pixel channels so the transition
      // remains visually smooth when softness > 0 and threshold is adjusted continuously.
      const out = 255 * t;
      d[i] = out;
      d[i + 1] = out;
      d[i + 2] = out;
      // preserve alpha
    }
  }
};