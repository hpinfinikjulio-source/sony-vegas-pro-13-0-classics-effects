export const replica = {
  id: 'replica',
  name: 'Replica (Tile)',
  description: 'Tile the image into an N×N grid with optional gaps and offsets',
  params: [
    {key:'tiles',name:'Tiles',min:1,max:8,step:1,default:3},
    {key:'gap',name:'Gap',min:0,max:0.5,step:0.01,default:0},
    {key:'offsetX',name:'Offset X',min:0,max:1,step:0.01,default:0},
    {key:'offsetY',name:'Offset Y',min:0,max:1,step:0.01,default:0}
  ],
  apply: (pixels, w, h, p) => {
    const src = pixels.data;
    const out = new Uint8ClampedArray(src.length);
    const tiles = Math.max(1, Math.round(p.tiles));
    const gapFrac = Math.max(0, Math.min(0.5, p.gap));
    const tileW = w / tiles;
    const tileH = h / tiles;
    for(let y=0;y<h;y++){
      for(let x=0;x<w;x++){
        const di = (y*w + x)*4;
        let nx = (x / w) * tiles + p.offsetX;
        let ny = (y / h) * tiles + p.offsetY;
        nx = nx - Math.floor(nx);
        ny = ny - Math.floor(ny);
        const lx = nx;
        const ly = ny;
        const margin = gapFrac * 0.5;
        if(lx < margin || lx > 1 - margin || ly < margin || ly > 1 - margin){
          out[di] = 0;
          out[di+1] = 0;
          out[di+2] = 0;
          out[di+3] = src[di+3];
          continue;
        }
        const sampleX = Math.floor(( (lx - margin) / (1 - (gapFrac)) ) * tileW + Math.floor(( (x / w) * tiles )) * tileW);
        const sampleY = Math.floor(( (ly - margin) / (1 - (gapFrac)) ) * tileH + Math.floor(( (y / h) * tiles )) * tileH);
        const sx = Math.min(w-1, Math.max(0, sampleX));
        const sy = Math.min(h-1, Math.max(0, sampleY));
        const si = (sy * w + sx) * 4;
        out[di] = src[si];
        out[di+1] = src[si+1];
        out[di+2] = src[si+2];
        out[di+3] = src[si+3];
      }
    }
    pixels.data.set(out);
  }
};