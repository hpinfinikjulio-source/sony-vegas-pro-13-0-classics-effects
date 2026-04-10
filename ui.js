/*
ui.js
Wires up DOM, creates effect list and controls, and hooks file/sample/reset/export actions.
createUI(state, renderer) -> { loadMedia(src) }
*/
export function createUI(state, renderer){
  const {
    media, canvas, fileIn, useSample, effectsList, controls,
    resetBtn, exportBtn, effects
  } = state;

  function makeEffectList(){
    effects.forEach(e=>{
      const el = document.createElement('button');
      el.className='effectItem';
      el.textContent = e.name;
      el.title = e.description;
      el.onclick = ()=>{
        document.querySelectorAll('.effectItem').forEach(x=>x.classList.remove('active'));
        el.classList.add('active');
        selectEffect(e);
      };
      effectsList.appendChild(el);
    });
  }

  function selectEffect(effect){
    state.activeEffect = effect;
    state.stateParams = {};
    effect.params.forEach(p=>{
      state.stateParams[p.key] = p.default;
    });
    renderControls();
    controls.classList.remove('hidden');
  }

  function renderControls(){
    controls.innerHTML = '';
    if(!state.activeEffect) return;
    state.activeEffect.params.forEach(p=>{
      const wrap = document.createElement('div');
      wrap.className='control';
      const label = document.createElement('label');
      label.textContent = p.name;
      const inp = document.createElement('input');
      inp.type='range';
      inp.min=p.min; inp.max=p.max; inp.step=p.step;
      inp.value = state.stateParams[p.key];
      inp.oninput = () => {
        state.stateParams[p.key] = parseFloat(inp.value);
      };
      const val = document.createElement('div');
      val.style.fontSize='12px'; val.style.marginTop='6px'; val.textContent=inp.value;
      inp.addEventListener('input', ()=> val.textContent = inp.value);
      wrap.appendChild(label);
      wrap.appendChild(inp);
      wrap.appendChild(val);
      controls.appendChild(wrap);
    });
  }

  function drawSetupAndStart(){
    renderer.fitMediaToCanvas();
    renderer.startRendering();
  }

  function loadMedia(src){
    renderer.stop();
    controls.classList.add('hidden');
    state.activeEffect = null;
    document.querySelectorAll('.effectItem').forEach(x=>x.classList.remove('active'));
    media.pause();
    media.src = src;
    media.onloadedmetadata = () => {
      drawSetupAndStart();
    };
  }

  fileIn.addEventListener('change', e=>{
    const f = e.target.files && e.target.files[0];
    if(!f) return;
    const url = URL.createObjectURL(f);
    loadMedia(url);
  });

  useSample.addEventListener('click', ()=>{
    loadMedia('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
  });

  resetBtn.addEventListener('click', ()=>{
    if(state.activeEffect){
      state.activeEffect.params.forEach(p=> state.stateParams[p.key] = p.default);
      renderControls();
    } else {
      state.stateParams = {};
      controls.classList.add('hidden');
      document.querySelectorAll('.effectItem').forEach(x=>x.classList.remove('active'));
      state.activeEffect = null;
    }
  });

  exportBtn.addEventListener('click', ()=>{
    renderer.exportPNG();
  });

  // initial UI build
  makeEffectList();

  return { loadMedia };
}