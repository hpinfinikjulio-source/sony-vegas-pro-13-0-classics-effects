export const zoomBlur = {
  id: 'zoom_blur',
  name: 'Zoom Blur',
  description: 'Radial blur towards center',
  params: [
    {key:'strength',name:'Strength',min:0,max:1,step:0.01,default:0.25},
    {key:'samples',name:'Samples',min:2,max:32,step:1,default:8}
  ],
  apply: (pixels,w,h,p) => {
    if(p.strength <= 0) return;
    const cx = w/2, cy = h/2;
    const src = pixels.data;
    const out = new Uint8ClampedArray(src.length);
    const samples = Math.max(2, Math.round(p.samples));
    for(let y=0;y<h;y++){
      for(let x=0;x<w;x++){
        let r=0,g=0,b=0,a=0;
        for(let s=0;s<samples;s++){
          const t = s / samples;
          const sx = Math.round(x + (cx - x) * t * p.strength);
          const sy = Math.round(y + (cy - y) * t * p.strength);
          const idx = (Math.min(h-1,Math.max(0,sy))*w + Math.min(w-1,Math.max(0,sx)))*4;
          r += src[idx];
          g += src[idx+1];
          b += src[idx+2];
          a += src[idx+3];
        }
        const di = (y*w + x)*4;
        out[di] = r/samples;
        out[di+1] = g/samples;
        out[di+2] = b/samples;
        out[di+3] = a/samples;
      }
    }
    pixels.data.set(out);
  }
};