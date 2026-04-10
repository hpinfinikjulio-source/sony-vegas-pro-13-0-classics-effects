export const chromaticAberration = {
  id: 'chromatic_aberration',
  name: 'Chromatic Aberration',
  description: 'Split color channels slightly',
  params: [
    {key:'amount',name:'Amount',min:0,max:20,step:1,default:6}
  ],
  apply: (pixels,w,h,p) => {
    const src = pixels.data;
    const out = new Uint8ClampedArray(src.length);
    const shift = Math.round(p.amount);
    for(let y=0;y<h;y++){
      for(let x=0;x<w;x++){
        const i = (y*w+x)*4;
        const rIdxX = Math.min(w-1, Math.max(0, x+shift));
        const bIdxX = Math.min(w-1, Math.max(0, x-shift));
        const rIdx = (y*w + rIdxX)*4;
        const bIdx = (y*w + bIdxX)*4;
        out[i] = src[rIdx];
        out[i+1] = src[i+1];
        out[i+2] = src[bIdx+2];
        out[i+3] = src[i+3];
      }
    }
    pixels.data.set(out);
  }
};