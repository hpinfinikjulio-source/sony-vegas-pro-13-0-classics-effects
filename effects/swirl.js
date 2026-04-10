export const swirl = {
  id: 'swirl',
  name: 'Swirl',
  description: 'Twist pixels around a center point',
  params: [
    {key:'strength',name:'Strength',min:-6,max:6,step:0.01,default:1.2},
    {key:'radius',name:'Radius',min:0.01,max:2,step:0.01,default:0.7},
    {key:'cx',name:'Center X',min:0,max:1,step:0.01,default:0.5},
    {key:'cy',name:'Center Y',min:0,max:1,step:0.01,default:0.5}
  ],
  apply: (pixels,w,h,p) => {
    const src = pixels.data;
    const out = new Uint8ClampedArray(src.length);
    const cx = p.cx * w;
    const cy = p.cy * h;
    const maxDim = Math.max(w,h);
    const radiusPx = Math.max(1, p.radius * maxDim);
    const strength = p.strength;
    for(let y=0;y<h;y++){
      for(let x=0;x<w;x++){
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.hypot(dx,dy);
        if(dist <= radiusPx){
          const t = (radiusPx - dist) / radiusPx;
          const angle = Math.atan2(dy,dx);
          const offset = strength * t * t;
          const na = angle + offset;
          const sx = Math.round(cx + Math.cos(na) * dist);
          const sy = Math.round(cy + Math.sin(na) * dist);
          const sxi = Math.min(w-1, Math.max(0, sx));
          const syi = Math.min(h-1, Math.max(0, sy));
          const si = (syi * w + sxi) * 4;
          const di = (y * w + x) * 4;
          out[di]   = src[si];
          out[di+1] = src[si+1];
          out[di+2] = src[si+2];
          out[di+3] = src[si+3];
        } else {
          const i = (y*w + x)*4;
          out[i] = src[i];
          out[i+1] = src[i+1];
          out[i+2] = src[i+2];
          out[i+3] = src[i+3];
        }
      }
    }
    pixels.data.set(out);
  }
};