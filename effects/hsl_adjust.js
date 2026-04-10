export const hslAdjust = {
  id: 'hsl_adjust',
  name: 'HSL Adjust',
  description: 'Adjust Hue (degrees), Saturation and Luminance',
  params: [
    { key: 'hue', name: 'Hue (°)', min: -180, max: 180, step: 1, default: 0 },
    { key: 'saturation', name: 'Saturation', min: -1, max: 1, step: 0.01, default: 0 },
    { key: 'luminance', name: 'Luminance', min: -1, max: 1, step: 0.01, default: 0 }
  ],
  apply: (pixels, w, h, p) => {
    const d = pixels.data;
    const hueShift = (p.hue || 0) / 360; // convert degrees to fraction of circle
    const satAdj = p.saturation || 0;
    const lumAdj = p.luminance || 0;

    // helper: rgb <-> hsl (all channels 0..1)
    function rgbToHsl(r, g, b) {
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return [h, s, l];
    }

    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    function hslToRgb(h, s, l) {
      let r, g, b;
      if (s === 0) {
        r = g = b = l;
      } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }
      return [r, g, b];
    }

    for (let i = 0; i < d.length; i += 4) {
      // normalize to 0..1
      let r = d[i] / 255;
      let g = d[i + 1] / 255;
      let b = d[i + 2] / 255;

      // convert to HSL
      let [h, s, l] = rgbToHsl(r, g, b);

      // apply adjustments
      h = (h + hueShift) % 1;
      if (h < 0) h += 1;
      s = Math.min(1, Math.max(0, s + satAdj));
      l = Math.min(1, Math.max(0, l + lumAdj));

      // back to RGB
      const [nr, ng, nb] = hslToRgb(h, s, l);

      d[i] = Math.round(nr * 255);
      d[i + 1] = Math.round(ng * 255);
      d[i + 2] = Math.round(nb * 255);
      // preserve alpha
    }
  }
};