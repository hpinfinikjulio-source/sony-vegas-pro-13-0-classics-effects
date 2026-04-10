export const channelBlend = {
  id: 'channel_blend',
  name: 'Channel Blend',
  description: 'Blend/display specific channels or reorder RGB (Normal, Grayscale, R, G, B, BGR)',
  params: [
    { key: 'mode', name: 'Mode (0=N,1=Gray,2=R,3=G,4=B,5=BGR)', min: 0, max: 5, step: 1, default: 0 },
    { key: 'mix', name: 'Mix', min: 0, max: 1, step: 0.01, default: 1 }
  ],
  apply: (pixels, w, h, p) => {
    const d = pixels.data;
    const mode = Math.max(0, Math.min(5, Math.round(p.mode || 0)));
    const mix = Math.max(0, Math.min(1, p.mix == null ? 1 : p.mix));
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];

      let nr = r, ng = g, nb = b;

      switch (mode) {
        case 0: // Normal (pass-through, but supports mix blending with original)
          nr = r; ng = g; nb = b;
          break;
        case 1: { // Grayscale
          const gray = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
          nr = ng = nb = gray;
          break;
        }
        case 2: // Red only
          nr = r; ng = nr; nb = nr;
          break;
        case 3: // Green only
          ng = g; nr = ng; nb = ng;
          break;
        case 4: // Blue only
          nb = b; nr = nb; ng = nb;
          break;
        case 5: // RGB -> BGR (swap R<->B)
          nr = b; ng = g; nb = r;
          break;
      }

      // mix between original and processed
      d[i]     = Math.round(r * (1 - mix) + nr * mix);
      d[i + 1] = Math.round(g * (1 - mix) + ng * mix);
      d[i + 2] = Math.round(b * (1 - mix) + nb * mix);
      // alpha left unchanged
    }
  }
};