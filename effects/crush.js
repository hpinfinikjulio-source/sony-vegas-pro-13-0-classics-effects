export const crush = {
  id:'crush',
  name:'Color Crush',
  description:'Posterize / channel intensity',
  params:[
    {key:'levels',name:'Levels',min:2,max:64,step:1,default:8},
    {key:'shift',name:'R/G shift',min:-64,max:64,step:1,default:0}
  ],
  apply:(pixels,w,h,p)=>{
    const d=pixels.data;
    const levels = p.levels;
    for(let i=0;i<d.length;i+=4){
      d[i] = Math.floor(d[i]/(256/levels))*(256/levels) + p.shift;
      d[i+1] = Math.floor(d[i+1]/(256/levels))*(256/levels);
      d[i+2] = Math.floor(d[i+2]/(256/levels))*(256/levels);
    }
  }
};