import{D as e,O as t,T as n,i as r,r as i}from"./node-utils-Ds1sVy-v.js";import{U as a}from"./app-DCKsq5m8.js";import{t as o}from"./dialog-BkeQgjla.js";import{s}from"./color-utils-OCVlKvQa.js";import{T as c,a as l}from"./index-sNerCVjG.js";var u=`colorPicker`,d=Array.from({length:12},(t,n)=>e(n*30,.7,.7).formatHex()),f=[0,1,2,3,4,5,6,8,9,11].map(e=>`hatch${e}`),[p,m]=[50,200],h=[`hex`,`rgb`,`hsl`],g=`hex`,_=window.EyeDropper,v=`
  #${u} { padding: .6em; }
  #${u} > div { width: auto; }
  #${u} button { margin: 0; }
  #${u} svg { pointer-events: none; }
  #${u} .area { position: relative; height: 12em; border: 1px solid #9b9b9b; cursor: crosshair; touch-action: none;
    background: linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, var(--hue)); }
  #${u} .handle { position: absolute; width: .7em; height: .7em; margin: -.45em; border: 1px solid #fff; outline: 1px solid #000; pointer-events: none; }
  #${u} .controls, #${u} .fields { display: flex; align-items: center; gap: .4em; margin-top: .6em; }
  #${u} .controls button svg { display: block; width: 1em; height: 1em; fill: currentColor; }
  #${u} .preview { flex: none; width: 1.75em; height: 1.75em; box-sizing: border-box; border: 1px solid #9b9b9b; }
  #${u} .hue { flex: 1; min-width: 0; height: .8em; border: 1px solid #9b9b9b;
    background: linear-gradient(to right, #f00, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00); }
  #${u} .inputs { display: flex; flex: 1; gap: .4em; }
  #${u} .inputs label { display: grid; flex: 1; min-width: 0; }
  #${u} .inputs label > * { grid-area: 1 / 1; }
  #${u} .inputs input { width: 100%; padding: .2em 2.2em .2em .4em; -moz-appearance: textfield; }
  #${u} .inputs input::-webkit-inner-spin-button, #${u} .inputs input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  #${u} .inputs span { align-self: center; justify-self: end; padding-right: .5em; font-size: .9em; opacity: .6; pointer-events: none; }
  #${u} .swatches { display: grid; grid-template-columns: repeat(12, 1fr); gap: .3em; margin-top: .6em; padding-top: .6em; border-top: 1px solid #0000001a; }
  #${u} .swatch { aspect-ratio: 1; padding: 0; border: 1px solid #9b9b9b; background: none; }
  #${u} .swatch:hover { border-color: #000; }
  #${u} .swatch.selected { outline: 2px solid var(--dark-solid); outline-offset: 1px; }
  #${u} .swatches:not(.expanded) .extra { display: none; }
  #${u} .expand { padding: 0; }
  #${u} .swatches svg, #${u} .preview svg { display: block; width: 100%; height: 100%; }
  #${u} .patterns { position: absolute; }
  #${u} .tile-size { display: flex; grid-column: 1 / -1; align-items: center; gap: .4em; }
  #${u} .tile-size slider-input { flex: 1; }
  #${u} .tile-size input[type=range] { flex: 1; min-width: 0; }
  #${u} .tile-size input[type=number] { width: 4.5em; }
`,y=`<svg viewBox="0 0 16 16"><path d="M13.4 2.6a2 2 0 0 0-2.8 0L8.9 4.3 8.2 3.6 7.1 4.7l.7.7L2.5 10.7V13.5h2.8l5.3-5.3.7.7 1.1-1.1-.7-.7 1.7-1.7a2 2 0 0 0 0-2.8ZM4.7 12H4v-.7l5-5 .7.7Z"/></svg>`;function b(){o.close(u)}function x(e,t){b();let n=a.parse(e),v=n?.hatch??``,y=n?.size??100,{h:x,s:k,v:A}=O(n?.color||E(e)||d[0]);Number.isNaN(x)&&(x=0),i(`dialogs`).insertAdjacentHTML(`beforeend`,S(y));let j=i(u),M=e=>j.querySelector(e),[N,P,F,I,L,R,z,B]=[M(`.area`),M(`.handle`),M(`.hue`),M(`.preview rect`),M(`.inputs`),M(`.patterns`),M(`[data-hatch=""] rect`),M(`.tile-size slider-input`)],V=(e=!0)=>{let t=D(x,k,A);N.style.setProperty(`--hue`,D(x,1,1)),Object.assign(P.style,{left:`${k*100}%`,top:`${(1-A)*100}%`,background:t}),F.value=String(Math.round(x)),R.style.color=t;let n=v&&r(v),i=n&&a.recolor(n,`picker-current`,`currentColor`,y);i&&M(`#picker-current`).replaceWith(i),I.setAttribute(`fill`,i?`url(#picker-current)`:t),z.setAttribute(`fill`,t);for(let e of B.querySelectorAll(`input`))e.disabled=!v;if(e){let e=L.querySelectorAll(`input`);C(t,x).forEach((t,n)=>{e[n].value=String(t.value)})}for(let e of j.querySelectorAll(`[data-color]`))e.classList.toggle(`selected`,e.dataset.color===t);for(let e of j.querySelectorAll(`[data-hatch]`))e.classList.toggle(`selected`,e.dataset.hatch===v)},H=(e=!0)=>{let n=D(x,k,A),r=v?a.fill(v,n,y):n;V(e),a.ensure(r),t(r)},U=(e,t=!0)=>{let n=O(e);Number.isNaN(n.h)||(x=n.h),[k,A]=[n.s,n.v],H(t)},W=e=>{let{left:t,top:n,width:r,height:i}=N.getBoundingClientRect();k=c((e.clientX-t)/r,0,1),A=1-c((e.clientY-n)/i,0,1),H()};N.addEventListener(`pointerdown`,e=>{N.setPointerCapture(e.pointerId),W(e)}),N.addEventListener(`pointermove`,e=>{N.hasPointerCapture(e.pointerId)&&W(e)}),F.addEventListener(`input`,()=>{x=F.valueAsNumber,H()}),B.addEventListener(`input`,e=>{let t=Math.round(B.valueAsNumber);e.target===B&&t>=p&&t<=m&&(y=t,H())}),B.addEventListener(`change`,()=>{B.value=String(y)}),L.addEventListener(`input`,()=>{let e=Array.from(L.querySelectorAll(`input`),e=>e.value.trim()),t=T(e);t&&(U(t,!1),g===`hsl`&&(x=Number(e[0])%360,V(!1)))}),L.addEventListener(`change`,()=>V());let G=()=>{L.innerHTML=C(D(x,k,A),x).map(w).join(``)};M(`.format`).addEventListener(`click`,()=>{g=h[(h.indexOf(g)+1)%h.length],G()}),M(`.random`).addEventListener(`click`,()=>U(s()));let K=M(`.eyedropper`);_?K.addEventListener(`click`,async()=>{let e=await new _().open().then(e=>E(e.sRGBHex)).catch(()=>``);e&&j.isConnected&&U(e)}):K.remove(),j.addEventListener(`click`,e=>{let t=e.target.closest(`.swatch`);t?.dataset.color?U(t.dataset.color):t?.dataset.hatch!==void 0&&(v=t.dataset.hatch,H())});let q=M(`.hatches`),J=M(`.expand`),Y=e=>{q.classList.toggle(`expanded`,e),J.className=`expand ${e?`icon-up-open`:`icon-down-open`}`,J.dataset.tip=l(e?`Show only the basic hatchings`:`Show all hatchings`)};J.addEventListener(`click`,()=>Y(!q.classList.contains(`expanded`))),Y(!!v&&(!f.includes(v)||y!==100)),G(),V(),o.open(u,{title:l(`Color Picker`),width:`26em`,position:{my:`center`,at:`center`,of:`svg`},onClose:()=>a.sync()})}function S(e){let t=a.bases(),n=t.map(e=>a.recolor(e,`picker-${e.id}`,`currentColor`).outerHTML).join(``),r=(e,t,n,r=!1)=>`<button class="swatch${r?` extra`:``}" ${e} data-tip="${n}"><svg><rect width="100%" height="100%" fill="${t}" /></svg></button>`,i=d.map(e=>r(`data-color="${e}"`,e,l(`Click to fill with the color`))),o=e=>r(`data-hatch="${e}"`,`url(#picker-${e})`,l(`Click to fill with the hatching {{hatching}}`,{hatching:e}),!f.includes(e)),s=t.map(({id:e})=>e).filter(e=>!f.includes(e));return`<div id="${u}" class="dialog">
    <style>${v}</style>
    <svg class="patterns" width="0" height="0"><defs>${n}<pattern id="picker-current" /></defs></svg>
    <div class="area" data-tip="${l(`Drag to set saturation and brightness`)}"><div class="handle"></div></div>
    <div class="controls">
      <button class="eyedropper" data-tip="${l(`Pick a color from the screen`)}">${y}</button>
      <span class="preview" data-tip="${l(`Current fill`)}"><svg><rect width="100%" height="100%" /></svg></span>
      <input class="hue" type="range" min="0" max="360" step="1" data-tip="${l(`Set hue`)}" />
      <button class="random icon-shuffle" data-tip="${l(`Pick a random color`)}"></button>
    </div>
    <div class="fields">
      <div class="inputs"></div>
      <button class="format icon-resize-vertical" data-tip="${l(`Switch color format`)}"></button>
    </div>
    <div class="swatches">${i.join(``)}</div>
    <div class="swatches hatches">
      ${r(`data-hatch=""`,``,l(`Click to fill with the color`))}${f.map(o).join(``)}
      <button class="expand"></button>${s.map(o).join(``)}
      <label class="tile-size extra">${l(`Tile size`)}
        <slider-input min="${p}" max="${m}" step="1" value="${e}"></slider-input><span>%</span>
      </label>
    </div>
  </div>`}function C(n,r){if(g===`hex`)return[{label:`HEX`,value:n}];if(g===`rgb`){let{r:e,g:r,b:i}=t(n);return[{label:`R`,value:e,max:255},{label:`G`,value:r,max:255},{label:`B`,value:i,max:255}]}let{s:i,l:a}=e(n);return[{label:`H`,value:Math.round(r),max:360},{label:`S`,value:Math.round((i||0)*100),max:100},{label:`L`,value:Math.round(a*100),max:100}]}function w({label:e,value:t,max:n}){return`<label><input ${n?`type="number" min="0" max="${n}"`:`type="text" maxlength="7"`} value="${t}" spellcheck="false" autocomplete="off" /><span>${e}</span></label>`}function T(n){if(g===`hex`)return/^#?([\da-f]{3}|[\da-f]{6})$/i.test(n[0])?E(`#${n[0].replace(`#`,``)}`):``;let r=n.map(Number),i=g===`rgb`?[255,255,255]:[360,100,100];if(n.some(e=>e===``)||r.some((e,t)=>!(e>=0&&e<=i[t])))return``;let[a,o,s]=r;return g===`rgb`?t(a,o,s).formatHex():e(a,o/100,s/100).formatHex()}function E(e){return n(e)?.formatHex()||``}function D(e,n,r){let i=t=>{let i=(t+e/60)%6;return(r-r*n*Math.max(0,Math.min(i,4-i,1)))*255};return t(i(5),i(3),i(1)).formatHex()}function O(e){let{r:n,g:r,b:i}=t(e),[a,o,s]=[n/255,r/255,i/255],c=Math.max(a,o,s),l=c-Math.min(a,o,s);return{h:(l?c===a?((o-s)/l+6)%6:c===o?(s-a)/l+2:(a-o)/l+4:NaN)*60,s:c?l/c:0,v:c}}var k={open:x,close:b};export{k as ColorPicker};