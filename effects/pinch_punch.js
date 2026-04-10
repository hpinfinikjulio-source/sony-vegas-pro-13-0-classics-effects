export const pinchPunch = {
  id: 'pinch_punch',
  name: 'Pinch / Punch',
  description: 'Radial pinch (negative) or punch (positive) distortion around a center point',
  params: [
    { key: 'amount', name: 'Amount (-1..1)', min: -1, max: 1, step: 0.001, default: 0.2 },
    { key: 'radius', name: 'Radius (0.01..2)', min: 0.01, max: 2, step: 0.01, default: 0.5 },
    { key: 'cx', name: 'Center X', min: 0, max: 1, step: 0.01, default: 0.5 },
    { key: 'cy', name: 'Center Y', min: 0, max: 1, step: 0.01, default: 0.5 }
  ],
  apply: (pixels, w, h, p) => {
    const src = pixels.data;
    const out = new Uint8ClampedArray(src.length);
    const cx = (p.cx == null ? 0.5 : p.cx) * w;
    const cy = (p.cy == null ? 0.5 : p.cy) * h;
    const maxDim = Math.max(w, h);
    const radiusPx = Math.max(1, (p.radius == null ? 0.5 : p.radius) * maxDim);
    const amount = (p.amount == null ? 0 : p.amount);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.hypot(dx, dy);

        let sx = x;
        let sy = y;

        if (dist > 0 && dist < radiusPx) {
          const t = dist / radiusPx; // 0..1
          // smooth falloff: stronger near center
          const fall = 1 - t;
          // displacement magnitude: proportional to amount and falloff squared
          // positive amount pushes pixels outward (punch), negative pulls inward (pinch)
          const disp = amount * fall * fall * radiusPx;
          const factor = Math.max(0.0001, (dist + disp) / dist);
          sx = Math.round(cx + dx * factor);
          sy = Math.round(cy + dy * factor);
        }

        const sxi = Math.min(w - 1, Math.max(0, sx));
        const syi = Math.min(h - 1, Math.max(0, sy));
        const si = (syi * w + sxi) * 4;
        const di = (y * w + x) * 4;
        out[di] = src[si];
        out[di + 1] = src[si + 1];
        out[di + 2] = src[si + 2];
        out[di + 3] = src[si + 3];
      }
    }

    pixels.data.set(out);
  }
};