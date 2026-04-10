export const gaussianBlur = {
  id:'gaussian_blur',
  name:'Gaussian Blur',
  description:'Soft blur (fast box-blur approximation)',
  params:[
    {key:'radius',name:'Radius',min:0,max:12,step:1,default:0}
  ],
  apply: (pixels,w,h,p) => {
    const r = Math.round(p.radius);
    if(r<=0) return;
    const src = pixels.data;
    const tmp = new Uint8ClampedArray(src.length);
    for(let y=0;y<h;y++){
      for(let x=0;x<w;x++){
        const outIdx = (y*w + x)*4;
        let rsum=0,gsum=0,bsum=0,asum=0;
        let count=0;
        for(let dx=-r; dx<=r; dx++){
          const nx = Math.min(w-1, Math.max(0, x+dx));
          const idx = (y*w + nx)*4;
          rsum += src[idx];
          gsum += src[idx+1];
          bsum += src[idx+2];
          asum += src[idx+3];
          count++;
        }
        tmp[outIdx] = rsum/count;
        tmp[outIdx+1] = gsum/count;
        tmp[outIdx+2] = bsum/count;
        tmp[outIdx+3] = asum/count;
      }
    }
    for(let y=0;y<h;y++){
      for(let x=0;x<w;x++){
        const outIdx = (y*w + x)*4;
        let rsum=0,gsum=0,bsum=0,asum=0;
        let count=0;
        for(let dy=-r; dy<=r; dy++){
          const ny = Math.min(h-1, Math.max(0, y+dy));
          const idx = (ny*w + x)*4;
          rsum += tmp[idx];
          gsum += tmp[idx+1];
          bsum += tmp[idx+2];
          asum += tmp[idx+3];
          count++;
        }
        src[outIdx] = rsum/count;
        src[outIdx+1] = gsum/count;
        src[outIdx+2] = bsum/count;
        src[outIdx+3] = asum/count;
      }
    }
  }
};