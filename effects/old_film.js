export const oldFilm = {
  id: 'old_film',
  name: 'Old Film',
  description: 'Grain + sepia + scratches',
  params: [
    {key:'grain',name:'Grain',min:0,max:1,step:0.01,default:0.4},
    {key:'sepia',name:'Sepia',min:0,max:1,step:0.01,default:0.6}
  ],
  apply: (pixels,w,h,p, time=0) => {
    const d = pixels.data;
    for(let i=0;i<d.length;i+=4){
      const rnd = (Math.random()*2-1)*p.grain*40;
      d[i] = Math.max(0, Math.min(255, d[i] + rnd));
      d[i+1] = Math.max(0, Math.min(255, d[i+1] + rnd));
      d[i+2] = Math.max(0, Math.min(255, d[i+2] + rnd));
      const r = d[i], g = d[i+1], b = d[i+2];
      d[i] = Math.min(255, (r * (1 - 0.607)) + (g * 0.769) + (b * 0.189) * p.sepia);
      d[i+1] = Math.min(255, (r * 0.349) + (g * (1 - 0.314)) + (b * 0.168) * p.sepia);
      d[i+2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * (1 - 0.869)) * p.sepia);
    }
    const t = Math.abs(Math.sin(time*0.0006));
    const lineCount = 6;
    for(let li=0; li<lineCount; li++){
      const y = Math.floor(((li/lineCount) + (t*0.15)) * h) % h;
      for(let x=0;x<w;x++){
        const idx = (y*w + x)*4;
        d[idx] = Math.max(0, d[idx]-60);
        d[idx+1] = Math.max(0, d[idx+1]-60);
        d[idx+2] = Math.max(0, d[idx+2]-60);
      }
    }
  }
};