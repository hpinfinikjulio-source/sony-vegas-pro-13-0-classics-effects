export const wave = {
  id: 'wave',
  name: 'Wave',
  description: 'Sine wave distortion (animated) — choose horizontal or vertical',
  params: [
    {key:'amplitude',name:'Amplitude',min:0,max:0.2,step:0.001,default:0.02},
    {key:'wavelength',name:'Wavelength',min:0.01,max:1,step:0.01,default:0.1},
    {key:'speed',name:'Speed',min:0,max:10,step:0.1,default:2},
    {key:'direction',name:'Direction (0=H / 1=V)',min:0,max:1,step:1,default:0}
  ],
  apply: (pixels, w, h, p, time = 0) => {
    const src = pixels.data;
    const out = new Uint8ClampedArray(src.length);
    const ampPx = Math.max(0, p.amplitude) * (p.direction === 1 ? h : w);
    const wl = Math.max(0.0001, p.wavelength);
    const t = time * 0.001 * p.speed;
    const twoPi = Math.PI * 2;

    if (p.direction === 1) {
      for (let x = 0; x < w; x++) {
        const phase = (x / w) / wl * twoPi + t;
        const offset = Math.round(Math.sin(phase) * ampPx);
        for (let y = 0; y < h; y++) {
          const dy = y + offset;
          const sy = Math.min(h - 1, Math.max(0, dy));
          const sx = x;
          const si = (sy * w + sx) * 4;
          const di = (y * w + x) * 4;
          out[di] = src[si];
          out[di + 1] = src[si + 1];
          out[di + 2] = src[si + 2];
          out[di + 3] = src[si + 3];
        }
      }
    } else {
      for (let y = 0; y < h; y++) {
        const phase = (y / h) / wl * twoPi + t;
        const offset = Math.round(Math.sin(phase) * ampPx);
        for (let x = 0; x < w; x++) {
          const dx = x + offset;
          const sx = Math.min(w - 1, Math.max(0, dx));
          const sy = y;
          const si = (sy * w + sx) * 4;
          const di = (y * w + x) * 4;
          out[di] = src[si];
          out[di + 1] = src[si + 1];
          out[di + 2] = src[si + 2];
          out[di + 3] = src[si + 3];
        }
      }
    }

    pixels.data.set(out);
  }
};