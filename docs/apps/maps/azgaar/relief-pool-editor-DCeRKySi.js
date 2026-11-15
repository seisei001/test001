import{t as e}from"./controllers-Dbv1ZRTV.js";import{ht as t,n}from"./options-model-CrstL1Qd.js";import{t as r}from"./biomes-generator-BQuuN3NH.js";import{m as i}from"./units-CYDspnRH.js";import{j as a,t as o}from"./layers-DjWzCbYN.js";import{t as s}from"./dialog-BkeQgjla.js";import{o as c}from"./tooltips-BVQbACdS.js";import{O as l,T as u,a as d,i as f,m as p}from"./index-sNerCVjG.js";import{r as m}from"./node-utils-Ds1sVy-v.js";import{n as h,o as g,r as _,t as v}from"./relief-previews-DRuGemVT.js";var y=`reliefPoolEditor`,b=250,x=5,S=`#d8d2bb`,C=`
  #${y} { padding: .4em .6em; }
  #${y} > div { width: auto; }
  #${y} .patch { position: relative; height: 7em; margin-bottom: .3em; border-radius: 4px; overflow: hidden; }
  #${y} .patch .art, #${y} .patch svg { display: block; width: 100%; height: 100%; }
  #${y} .patch .empty { display: grid; place-items: center; height: 100%; margin: 0; }
  #${y} .patch .shuffle { position: absolute; top: .3em; right: .3em; margin: 0; padding: .1em .3em; border: 0; border-radius: 3px; background: #ffffffb0; box-shadow: none; cursor: pointer; }
  #${y} .heights { display: flex; justify-content: space-between; font-size: .85em; opacity: .7; }
  #${y} .setting { display: flex; align-items: center; gap: .5em; margin: .3em 0; }
  #${y} .setting > span:first-child { width: 3.6em; }
  #${y} .setting slider-input { flex: 1; }
  #${y} .setting input[type=range] { flex: 1; min-width: 0; }
  #${y} .setting input[type=number] { width: 4em; }
  #${y} .entries { display: grid; gap: .2em; max-height: 16em; overflow-y: auto; margin: .5em 0 .6em; }
  #${y} .entry, #${y} .head { display: grid; grid-template-columns: 2em 1fr 3.8em 3.8em 3em 1.6em; align-items: center; gap: 1em; }
  #${y} .head { opacity: .7; }
  #${y} .head span:nth-child(n+3) { text-align: center; }
  #${y} .entry .preview { display: grid; place-items: center; font-size: 1.8em; }
  #${y} .entry .preview svg { width: 1em; height: 1em; overflow: visible; }
  #${y} .entry .name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  #${y} .entry .share { text-align: right; opacity: .7; }
  #${y} .entry button { margin: 0; padding: 0; border: 0; background: none; box-shadow: none; cursor: pointer; }
  #${y} .empty { margin: .4em 0; font-style: italic; opacity: .7; }
  #${y} .caption { margin: .4em 0 .3em; font-size: .85em; opacity: .7; }
  #${y} .types { display: grid; grid-template-columns: repeat(7, 1fr); gap: .3em; }
  #${y} .types button { display: grid; place-items: center; aspect-ratio: 1; margin: 0; padding: 0; border: 1px solid transparent; border-radius: 4px; background: #0000000a; box-shadow: none; font-size: 1.9em; cursor: pointer; }
  #${y} .types button:hover { background: #00000017; }
  #${y} .types button svg { width: 1em; height: 1em; overflow: visible; pointer-events: none; }
  #${y} .actions { display: flex; gap: .3em; margin: .5em 0 0; }
  #${y} .actions button { margin: 0; }
  #${y} .any { flex: 1; }
`,w=e=>structuredClone(e);function T(e){if(`rule`in e){let{rule:r}=e,i=r.biomes?.length===1?pack.biomes[r.biomes[0]]:void 0,a=t.getDefaultRules().find(({name:e})=>e===r.name);return{title:d(`Relief rule: {{- rule}}`,{rule:r.name}),place:d(`the cells the {{- rule}} rule claims`,{rule:r.name}),draft:{icons:w(r.icons),density:r.density,size:{...r.size}},rule:r,color:i?.color??S,write:e=>{Object.assign(r,e),n.save()},defaults:a&&(()=>({icons:a.icons,density:a.density,size:a.size})),covers:e=>t.claim(e)===r,exists:()=>options.map.relief.rules.includes(r)}}let i=pack.biomes[e.biome];return{title:d(`Relief pool: {{- biome}}`,{biome:i.name}),place:d(`{{- biome}} lowland`,{biome:i.name}),draft:{icons:w(i.icons),density:i.iconsDensity},color:i.color??S,write:({icons:e,density:t})=>Object.assign(i,{icons:e,iconsDensity:t}),defaults:()=>{let t=r.getDefault()[e.biome];return{icons:t?.icons??{},density:t?.iconsDensity??0}},covers:n=>t.isPoolCell(n,e.biome),exists:()=>pack.biomes[e.biome]===i&&!i.removed}}function E(n){let r=T(n),{set:a}=styles.relief.options,o=r.draft,{rule:S}=r,E=1,O=o.size?`<div class="setting ruleSize" data-tip="${d(`Icon size at the rule's lowest height, growing with height up to the second value. Each entry's size scales it`)}">
        <span>${d(`Size`)}</span>
        <input type="number" data-bound="min" min="0.1" step="0.1" value="${o.size.min}" />–<input type="number" data-bound="max" min="0.1" step="0.1" value="${o.size.max}" />
      </div>`:``,k=S?`<div class="heights"><span>${i(S.height.min)}</span><span>${d(`Height`)}</span><span>${i(S.height.max)}</span></div>`:``;s.destroy(y),m(`dialogs`).insertAdjacentHTML(`beforeend`,`<div id="${y}" class="dialog">
      <style>${C}</style>
      <div class="patch" style="background: color-mix(in srgb, ${p(r.color)} 55%, white)" data-tip="${d(`A sample of the relief the pool places, at the map's sizes and spacing`)}">
        <div class="art"></div>
        <button type="button" class="shuffle icon-shuffle" data-tip="${d(`Draw another sample`)}"></button>
      </div>
      ${k}
      <div class="setting density" data-tip="${d(`How packed the relief is. 0 places none`)}">
        <span>${d(`Density`)}</span>
        <slider-input min="0" max="${b}" step="1" value="${o.density}"></slider-input>
      </div>
      ${O}
      <div class="entries"></div>
      <div class="caption">${d(`Add a relief type, drawn in the style's relief set`)}</div>
      <div class="types">${t.types.map(({type:e,label:t})=>`<button type="button" data-entry="${e}" data-tip="${d(`Add {{icon}}`,{icon:t})}">${h(e,a)}</button>`).join(``)}</div>
      <div class="actions">
        <button type="button" class="any" data-tip="${d(`Add your own icon, an emoji or another set's art`)}">${d(`Add any icon…`)}</button>
        ${r.defaults?`<button type="button" class="restore icon-ccw" data-tip="${o.size?f(d(`Restore the default pool, density and size`),d(`Apply to keep it`)):f(d(`Restore the default pool and density`),d(`Apply to keep it`))}"></button>`:``}
      </div>
    </div>`);let A=m(y),j=A.querySelector(`.patch .art`),M=A.querySelector(`.entries`),N=A.querySelector(`slider-input`),P=()=>{let e=S&&o.size?{...S,size:o.size}:void 0;j.innerHTML=g(o.icons,o.density,e,E)||`<p class="empty">${d(`No relief: {{place}} stays bare`,{place:r.place})}</p>`},F=()=>Object.values(o.icons).reduce((e,{weight:t})=>e+t,0),I=e=>`${l(e/F()*100)}%`,L=()=>{M.innerHTML=F()?`<div class="head"><span></span><span></span><span>${d(`Weight`)}</span><span>${d(`Size`)}</span><span>${d(`Share`,{context:`portion`})}</span><span></span></div>`+Object.entries(o.icons).map(([e,{weight:t,size:n=1}])=>`<div class="entry" data-entry="${p(e)}">
              <span class="preview">${h(e,a)}</span>
              <span class="name">${p(_(e))}</span>
              <input type="number" class="weight" min="1" step="1" value="${t}" data-tip="${d(`Weight: how often the entry is picked, relative to the others`)}" />
              <input type="number" class="size" min="0.1" max="${x}" step="0.1" value="${n}" data-tip="${d(`Size: the entry's icons as a multiple of the pool's size`)}" />
              <span class="share" data-tip="${d(`Share of the pool's relief`)}">${I(t)}</span>
              <button type="button" class="icon-trash-empty" data-tip="${d(`Remove`)}"></button>
            </div>`).join(``):`<p class="empty">${d(`The pool is empty: {{place}} gets no relief`,{place:r.place})}</p>`,v(A,a),P()},R=e=>{let t=o.icons[e];o.icons[e]={...t,weight:(t?.weight??0)+1},L()},z=e=>e.closest(`.entry`)?.dataset.entry??null,B=(e,t)=>{let n=z(e);if(n===null||!o.icons[n])return!1;let r=Number(e.value);if(!t&&!(r>0))return!1;let i=o.icons[n];if(e.classList.contains(`weight`))i.weight=Math.max(1,Math.round(r)||1);else if(e.classList.contains(`size`)){let e=u(l(r||1,2),.1,x);e===1?delete i.size:i.size=e}return!0};A.querySelector(`.types`).addEventListener(`click`,e=>{let t=e.target.closest(`button[data-entry]`)?.dataset.entry;t&&R(t)}),A.querySelector(`.any`).addEventListener(`click`,()=>{e.IconPicker.open({current:``,onPick:e=>e&&R(e)})}),A.querySelector(`.shuffle`).addEventListener(`click`,()=>{E++,P()}),N.addEventListener(`input`,e=>{e.target===N&&(o.density=u(Math.round(N.valueAsNumber)||0,0,b),P())}),A.querySelector(`.ruleSize`)?.addEventListener(`change`,e=>{let t=e.target,n=t.dataset.bound,r=o.size;r[n]=Math.max(.1,Number(t.value)||r[n]),r.min>r.max&&(r[n===`min`?`max`:`min`]=r[n]),V(),P()});let V=()=>{for(let e of A.querySelectorAll(`.ruleSize input`))e.value=String(o.size[e.dataset.bound])};A.querySelector(`.restore`)?.addEventListener(`click`,()=>{let{icons:e,density:t,size:n}=r.defaults();Object.assign(o,{icons:w(e),density:t},n&&{size:{...n}}),N.value=String(t),n&&V(),L()}),M.addEventListener(`input`,e=>{let t=e.target;if(B(t,!1)){for(let e of M.querySelectorAll(`.entry`))e.querySelector(`.share`).textContent=I(o.icons[e.dataset.entry].weight);P()}}),M.addEventListener(`change`,e=>{B(e.target,!0)&&L()}),M.addEventListener(`click`,e=>{let t=z(e.target);t!==null&&e.target.classList.contains(`icon-trash-empty`)&&(delete o.icons[t],L())}),L();let H=()=>{o.density=u(Math.round(N.valueAsNumber)||0,0,b),r.write(o),n.onApply?.()},U=()=>s.close(y),W=()=>c(d(`{{target}} no longer exists: nothing is applied`,{target:r.title}),!1,`error`);s.open(y,{title:r.title,width:`28em`,position:{my:`center`,at:`center`,of:`svg`},buttons:[{label:d(`Apply`),onClick:()=>{r.exists()?H():W(),U()}},{label:d(`Apply and re-place`),onClick:()=>{r.exists()?D(r.place,r.covers,()=>{H(),U()}):(W(),U())}},{label:d(`Cancel`),onClick:U}]})}function D(e,n,r){let i=pack.relief?.length?t.iconsOn(n).length:0;s.confirm({title:d(`Re-place relief`),message:f(d(`Replace relief icons on {{place}} with new ones ({{icons}})?`,{place:e,icons:i}),d(`Relief elsewhere is kept`)),confirm:d(`Re-place`),onConfirm:()=>{r?.(),pack.relief?.length&&t.regenerate(n),o.isOn(`relief`)?a():o.show(`relief`)}})}var O={open:E};export{D as n,O as t};