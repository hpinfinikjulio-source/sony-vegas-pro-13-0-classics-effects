export const invert = {
  id: 'invert',
  name: 'Invert',
  description: 'Invert colors',
  params: [
    {key:'mix',name:'Mix',min:0,max:1,step:0.01,default:1}
  ],
  apply: (pixels,w,h,p) => {
    const d = pixels.data;
    for(let i=0;i<d.length;i+=4){
      d[i] = d[i] + (255 - 2*d[i]) * p.mix;
      d[i+1] = d[i+1] + (255 - 2*d[i+1]) * p.mix;
      d[i+2] = d[i+2] + (255 - 2*d[i+2]) * p.mix;
    }
  }
};