export const vignette = {
  id: 'vignette',
  name: 'Vignette',
  description: 'Darken edges',
  params: [
    {key:'amount',name:'Amount',min:0,max:1,step:0.01,default:0.6},
    {key:'radius',name:'Radius',min:0.1,max:1.5,step:0.01,default:0.8}
  ],
  apply: (pixels,w,h,p) => {
    const cx = w/2, cy = h/2;
    const maxd = Math.hypot(cx,cy)*p.radius;
    const d = pixels.data;
    for(let y=0;y<h;y++){
      for(let x=0;x<w;x++){
        const i = (y*w + x)*4;
        const dist = Math.hypot(x-cx,y-cy);
        const t = Math.min(1, Math.max(0, (dist/maxd)));
        const factor = 1 - p.amount * (t*t);
        d[i] = d[i]*factor;
        d[i+1] = d[i+1]*factor;
        d[i+2] = d[i+2]*factor;
      }
    }
  }
};