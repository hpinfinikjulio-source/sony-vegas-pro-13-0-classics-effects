export const chromaKey = {
  id: 'chroma_key',
  name: 'Chroma Key',
  description: 'Remove a color (green screen)',
  params: [
    {key:'r',name:'Key R',min:0,max:255,step:1,default:0},
    {key:'g',name:'Key G',min:0,max:255,step:1,default:255},
    {key:'b',name:'Key B',min:0,max:255,step:1,default:0},
    {key:'threshold',name:'Threshold',min:0,max:255,step:1,default:80},
    {key:'soft',name:'Soft',min:0,max:1,step:0.01,default:0.2}
  ],
  apply: (pixels,w,h,p) => {
    const d = pixels.data;
    for(let i=0;i<d.length;i+=4){
      const dr = d[i], dg = d[i+1], db = d[i+2];
      const kr = p.r, kg = p.g, kb = p.b;
      const dist = Math.hypot(dr-kr, dg-kg, db-kb);
      const t = Math.max(0, Math.min(1, (dist - p.threshold) / (p.threshold * (1-p.soft) + 0.0001)));
      d[i+3] = Math.round(d[i+3] * t);
    }
  }
};