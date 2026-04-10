export const glow = {
  id:'glow',
  name:'Glow',
  description:'Add bloom-like glow',
  params:[
    {key:'intensity',name:'Intensity',min:0,max:2,step:0.01,default:0.6},
    {key:'threshold',name:'Threshold',min:0,max:1,step:0.01,default:0.6}
  ],
  apply:(pixels,w,h,p)=>{
    const src = pixels.data;
    const tmp = new Uint8ClampedArray(src.length);
    for(let i=0;i<src.length;i+=4){
      const r=src[i]/255,g=src[i+1]/255,b=src[i+2]/255;
      const lum = 0.2126*r + 0.7152*g + 0.0722*b;
      if(lum > p.threshold){
        tmp[i]=src[i];tmp[i+1]=src[i+1];tmp[i+2]=src[i+2];tmp[i+3]=src[i+3];
      } else {
        tmp[i]=tmp[i+1]=tmp[i+2]=0;tmp[i+3]=0;
      }
    }
    const r=6;
    const blur = new Uint8ClampedArray(src.length);
    for(let y=0;y<h;y++){
      for(let x=0;x<w;x++){
        const out=(y*w+x)*4;
        let rr=0,gg=0,bb=0,count=0;
        for(let dx=-r;dx<=r;dx++){
          const nx=Math.min(w-1,Math.max(0,x+dx));
          const idx=(y*w+nx)*4;
          rr+=tmp[idx];gg+=tmp[idx+1];bb+=tmp[idx+2];count++;
        }
        blur[out]=rr/count;blur[out+1]=gg/count;blur[out+2]=bb/count;blur[out+3]=255;
      }
    }
    for(let y=0;y<h;y++){
      for(let x=0;x<w;x++){
        const out=(y*w+x)*4;
        let rr=0,gg=0,bb=0,count=0;
        for(let dy=-r;dy<=r;dy++){
          const ny=Math.min(h-1,Math.max(0,y+dy));
          const idx=(ny*w+x)*4;
          rr+=blur[idx];gg+=blur[idx+1];bb+=blur[idx+2];count++;
        }
        src[out] = Math.min(255, src[out] + (rr/count)*p.intensity);
        src[out+1] = Math.min(255, src[out+1] + (gg/count)*p.intensity);
        src[out+2] = Math.min(255, src[out+2] + (bb/count)*p.intensity);
      }
    }
  }
};