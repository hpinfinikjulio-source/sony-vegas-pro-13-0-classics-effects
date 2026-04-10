export const shake = {
  id: 'shake',
  name: 'Camera Shake',
  description: 'Temporal jitter / shake',
  params: [
    {key:'intensity',name:'Intensity',min:0,max:40,step:1,default:6},
    {key:'freq',name:'Frequency',min:0.1,max:10,step:0.1,default:6}
  ],
  apply: (pixels,w,h,p, time=0) => {
    const d = pixels.data;
    const t = time * 0.001;
    const ox = Math.round(Math.sin(t * p.freq) * p.intensity);
    const oy = Math.round(Math.cos(t * (p.freq*1.3)) * (p.intensity*0.6));
    const copy = new Uint8ClampedArray(d.length);
    for(let y=0;y<h;y++){
      for(let x=0;x<w;x++){
        const sx = Math.min(w-1, Math.max(0, x - ox));
        const sy = Math.min(h-1, Math.max(0, y - oy));
        const sIdx = (sy*w + sx)*4;
        const dIdx = (y*w + x)*4;
        copy[dIdx] = d[sIdx];
        copy[dIdx+1] = d[sIdx+1];
        copy[dIdx+2] = d[sIdx+2];
        copy[dIdx+3] = d[sIdx+3];
      }
    }
    pixels.data.set(copy);
  }
};