/*
renderer.js
Handles canvas sizing, drawing the media to canvas, applying the active effect, and the animation loop.
API: createRenderer(state) -> { startRendering(), stop(), exportPNG() }
*/
export function createRenderer(state){
  const { canvas, media } = state;
  let ctx = null;

  function initCanvas(){
    canvas.width = state.cw;
    canvas.height = state.ch;
    ctx = canvas.getContext('2d');
    state.ctx = ctx;
  }

  function fitMediaToCanvas(){
    const wrap = document.getElementById('previewWrap');
    const rect = wrap.getBoundingClientRect();
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    media.style.width = rect.width + 'px';
    media.style.height = rect.height + 'px';
  }

  window.addEventListener('resize', fitMediaToCanvas);

  function drawFrame(time){
    if(media.readyState < 2) {
      state.animId = requestAnimationFrame(drawFrame);
      return;
    }
    const sw = media.videoWidth || media.naturalWidth || state.cw;
    const sh = media.videoHeight || media.naturalHeight || state.ch;
    const scale = Math.min(state.cw/sw, state.ch/sh);
    const dw = Math.round(sw*scale);
    const dh = Math.round(sh*scale);

    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,state.cw,state.ch);
    const dx = Math.round((state.cw - dw)/2);
    const dy = Math.round((state.ch - dh)/2);
    ctx.drawImage(media, 0, 0, sw, sh, dx, dy, dw, dh);

    let img = ctx.getImageData(0,0,state.cw,state.ch);

    if(state.activeEffect){
      try{
        state.activeEffect.apply(img, state.cw, state.ch, state.stateParams, time);
      }catch(e){
        console.error('Effect error', e);
      }
    }

    ctx.putImageData(img,0,0);
    state.animId = requestAnimationFrame(drawFrame);
  }

  function startRendering(){
    cancelAnimationFrame(state.animId);
    const sw = media.videoWidth || media.naturalWidth || 1280;
    const sh = media.videoHeight || media.naturalHeight || 720;
    const maxW = 1280, maxH = 720;
    const ratio = Math.min(maxW/sw, maxH/sh, 1);
    state.cw = Math.round(sw*ratio);
    state.ch = Math.round(sh*ratio);
    initCanvas();
    fitMediaToCanvas();
    media.play().catch(()=>{});
    state.animId = requestAnimationFrame(drawFrame);
  }

  function stop(){
    cancelAnimationFrame(state.animId);
  }

  function exportPNG(){
    canvas.toBlob(b=>{
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = 'vegas_classic_effect.png';
      a.click();
    }, 'image/png');
  }

  return { startRendering, stop, exportPNG, fitMediaToCanvas };
}