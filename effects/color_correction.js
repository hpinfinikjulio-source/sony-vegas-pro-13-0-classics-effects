export const colorCorrection = {
  id: 'color_correction',
  name: 'Color Correction',
  description: 'Lift/Gamma/Gain style tonal controls',
  params: [
    {key:'lift',name:'Lift',min:-1,max:1,step:0.01,default:0},
    {key:'gamma',name:'Gamma',min:0.2,max:3,step:0.01,default:1},
    {key:'gain',name:'Gain',min:0,max:2,step:0.01,default:1}
  ],
  apply: (pixels, w, h, p) => {
    const d = pixels.data;
    const lift = p.lift;
    const gamma = p.gamma;
    const gain = p.gain;
    for(let i=0;i<d.length;i+=4){
      for(let c=0;c<3;c++){
        let v = d[i+c]/255;
        v = (v + lift);
        v = Math.pow(Math.max(0,v), 1/gamma);
        v = Math.min(1, v*gain);
        d[i+c] = Math.round(v*255);
      }
    }
  }
};