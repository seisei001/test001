import{Bt as e,R as t,f as n,h as r,m as i}from"./options-model-CrstL1Qd.js";import{n as a}from"./file-name-B95gRTjS.js";import{t as o}from"./icons-archive-D0KQ8qyQ.js";import{t as s}from"./dialog-BkeQgjla.js";import{o as c}from"./tooltips-BVQbACdS.js";import{n as l,t as u}from"./file-utils-CUGyyqg9.js";import{a as d,f,i as p,m}from"./index-sNerCVjG.js";import{i as h,r as g}from"./node-utils-Ds1sVy-v.js";import{t as _}from"./pictures-9UhEGDF2.js";var v=`iconPositioner`,y=.25,[b,x]=[25,400],S=`
  #${v} > div { width: auto; }
  #${v} .stage { width: 16em; height: 16em; margin: 0 auto; background: repeating-conic-gradient(#e8e8e8 0 25%, #fff 0 50%) 0 0 / 1em 1em; cursor: grab; touch-action: none; }
  #${v} .stage:active { cursor: grabbing; }
  #${v} .stage svg { display: block; width: 100%; height: 100%; }
  #${v} .controls { display: flex; align-items: center; gap: .4em; margin-top: .5em; }
  #${v} .controls slider-input { flex: 1; min-width: 0; }
  #${v} .controls input[type=range] { flex: 1; min-width: 0; }
  #${v} .previews { display: flex; justify-content: center; align-items: center; gap: 1em; margin-top: .5em; }
  #${v} .previews svg { width: 2em; height: 2em; }
  #${v} .previews .circle svg { border-radius: 50%; background: #d4c7a1; }
  #${v} .previews .small svg { width: 1em; height: 1em; }
`;function C(e){let t=h(v);t&&(!e||t.dataset.icon===e)&&s.close(v)}function w(e){let t=n.get(e);if(!t||!h(e))return;let r=t=>h(e)?.setAttribute(`viewBox`,t),a=t.viewBox,o=T(a),l={...o};C(),g(`dialogs`).insertAdjacentHTML(`beforeend`,`<div id="${v}" class="dialog" data-icon="${m(e)}">
      <style>${S}</style>
      <div class="stage" data-tip="${d(`Drag to pan, scroll to zoom`)}">
        <svg><g class="art"${i.paintAttributes(e)}>${g(e).innerHTML}</g><path class="shade" fill="#000" fill-opacity=".45" fill-rule="evenodd"/><rect class="edge" fill="none" stroke="#d0240f" vector-effect="non-scaling-stroke" stroke-dasharray="4 3"/></svg>
      </div>
      <div class="controls">
        <span>${d(`Zoom`)}</span>
        <slider-input min="${b}" max="${x}" value="100"></slider-input>
        <button type="button" class="fit" data-tip="${d(`Fit the frame to the picture's visible content`)}">${d(`Fit`)}</button>
      </div>
      <div class="previews" data-tip="${d(`The icon at map sizes`)}">
        <span class="small">${i.html(e)}</span>
        <span>${i.html(e)}</span>
        <span class="circle">${i.html(e)}</span>
      </div>
    </div>`);let u=g(v),f=u.querySelector(`.stage svg`),p=u.querySelector(`slider-input`),w=(e,t=!1)=>{l=e;let{x:n,y:i,side:a}=l,s=a*y,[c,u,d]=[n-a/2-s,i-a/2-s,a+2*s];f.setAttribute(`viewBox`,`${c} ${u} ${d} ${d}`);let[m,h]=[n-a/2,i-a/2];f.querySelector(`.shade`).setAttribute(`d`,`M${c},${u}h${d}v${d}h${-d}z M${m},${h}v${a}h${a}v${-a}z`);let g=f.querySelector(`.edge`);for(let[e,t]of Object.entries({x:m,y:h,width:a,height:a}))g.setAttribute(e,String(t));t||(p.value=String(Math.round(o.side/a*100))),r(E(l))};w(l);let D=(e,t=!1)=>{let[n,r]=[o.side*100/x,o.side*100/b];w({...l,side:Math.min(r,Math.max(n,e))},t)};p.addEventListener(`input`,e=>{e.target===p&&D(o.side*100/p.valueAsNumber,!0)}),p.addEventListener(`change`,e=>{e.target===p&&w(l)}),f.addEventListener(`wheel`,e=>{e.preventDefault(),D(l.side*1.1**Math.sign(e.deltaY))}),f.addEventListener(`pointerdown`,e=>{f.setPointerCapture(e.pointerId);let t={x:e.clientX,y:e.clientY},n=e=>{let n=l.side*1.5/f.getBoundingClientRect().width;w({...l,x:l.x-(e.clientX-t.x)*n,y:l.y-(e.clientY-t.y)*n}),t={x:e.clientX,y:e.clientY}},r=()=>{f.removeEventListener(`pointermove`,n),f.removeEventListener(`pointerup`,r),f.removeEventListener(`pointercancel`,r)};f.addEventListener(`pointermove`,n),f.addEventListener(`pointerup`,r),f.addEventListener(`pointercancel`,r)}),u.querySelector(`.fit`).addEventListener(`click`,async()=>{let e=await _.fit(t);u.isConnected&&(w(T(e)),c(d(`The frame is fitted to the picture`),!1,`success`,2e3))});let O=!1;s.open(v,{title:d(`Position icon`),width:`20em`,position:{my:`center`,at:`center`,of:`svg`},onClose:()=>{O||r(a),s.destroy(v)},buttons:[{label:d(`Apply`),onClick:()=>{O=!0,n.update(e,{viewBox:E(l)}),s.close(v)}},{label:d(`Cancel`),onClick:()=>{s.close(v)}}]})}function T(e){let[t,n,r,a]=i.parseFrame(e)??[0,0,100,100];return{x:t+r/2,y:n+a/2,side:Math.max(r,a)}}function E({x:e,y:t,side:n}){return i.formatFrame([e-n/2,t-n/2,n,n])}var D=`iconPicker`,O=`
  #${D} { padding: .4em .6em; }
  #${D} > div { width: auto; }
  #${D} .head { display: flex; align-items: center; gap: .6em; padding-bottom: .5em; border-bottom: 1px solid #0000001a; }
  #${D} .current { display: flex; align-items: center; gap: .5em; flex: 1; min-width: 0; }
  #${D} .current .preview { flex: none; display: grid; place-items: center; width: 2.2em; height: 2.2em; border-radius: 4px; background: #0000000d; }
  #${D} .current .preview svg { width: 1.7em; height: 1.7em; overflow: visible; }
  #${D} .current .about { display: flex; align-items: baseline; gap: .5em; min-width: 0; white-space: nowrap; }
  #${D} .current .name { font-weight: bold; overflow: hidden; text-overflow: ellipsis; }
  #${D} .current .from { font-size: .85em; opacity: .65; overflow: hidden; text-overflow: ellipsis; }
  #${D} .currentActions { display: flex; gap: .2em; margin-left: auto; }
  #${D} .currentActions button { margin: 0; padding: .2em .4em; white-space: nowrap; }
  #${D} .search { width: 11em; }
  #${D} .body { display: grid; grid-template-columns: 11.5em 1fr; height: min(32em, 64vh); }
  #${D} nav { overflow-y: auto; padding: .4em .4em .4em 0; border-right: 1px solid #0000001a; }
  #${D} nav button { display: flex; justify-content: space-between; width: 100%; margin: 0; padding: .25em .4em; border: 0; border-radius: 4px; background: none; box-shadow: none; text-align: left; white-space: nowrap; }
  #${D} nav button:hover { background: #0000000d; }
  #${D} nav button.active { background: #0000001a; color: inherit; font-weight: bold; }
  #${D} nav button small { margin-left: .4em; opacity: .6; font-weight: normal; }
  #${D} nav .section { margin-top: .5em; font-weight: bold; }
  #${D} nav div.section { padding: .25em .4em; white-space: nowrap; }
  #${D} nav .entry { padding-left: 1.2em; }
  #${D} .panel { position: relative; overflow-y: auto; padding: .4em 0 .4em .6em; }
  #${D} .panel h4 { margin: .6em 0 .3em; font-size: .85em; opacity: .7; }
  #${D} .panel h4:first-child { margin-top: 0; }
  #${D} .choices { display: grid; grid-template-columns: repeat(auto-fill, minmax(5.4em, 1fr)); gap: .4em; }
  #${D} .choices button { display: grid; place-items: center; aspect-ratio: 1; margin: 0; padding: 0; border: 1px solid transparent; border-radius: 4px; background: #0000000a; box-shadow: none; font-size: 2.6em; }
  #${D} .choices button:hover { background: #00000017; }
  #${D} .choices button.pressed { border-color: var(--dark-solid); background: #0000001f; }
  #${D} .choices button svg { width: 80%; height: 80%; overflow: visible; pointer-events: none; }
  #${D} .glyphText { display: flex; align-items: center; gap: .4em; margin-bottom: .5em; }
  #${D} .glyphText input { width: 6em; }
  #${D} .customAdd { display: flex; gap: .3em; margin-bottom: .5em; }
  #${D} .customAdd input { flex: 1; min-width: 0; }
  #${D} .customAdd button { margin: 0; white-space: nowrap; }
  #${D} .customArchive { display: flex; gap: .3em; margin-top: .5em; }
  #${D} .customArchive button { margin: 0; }
  #${D} .replacing { margin: -.2em 0 .5em; padding: .3em .5em; border-radius: 4px; background: #ffd70033; }
  #${D} .replacing a { cursor: pointer; text-decoration: underline; }
  #${D} .note { margin: .6em 0 0; font-size: .85em; opacity: .7; }
  #${D} .empty { margin: 1em 0; font-style: italic; opacity: .7; }
  #${D}.busy { cursor: progress; }
  #${D}.busy :is(.customAdd, .customArchive) { pointer-events: none; opacity: .5; }
  @media (max-width: 600px) {
    #${D} .head { flex-wrap: wrap; }
    #${D} .search { width: 100%; }
    #${D} .body { grid-template-columns: 1fr; grid-template-rows: auto 1fr; }
    #${D} nav { display: flex; gap: .2em; overflow-x: auto; padding: .4em 0; border: 0; border-bottom: 1px solid #0000001a; }
    #${D} nav button { width: auto; white-space: nowrap; }
    #${D} nav .section, #${D} nav .entry { margin: 0; padding-left: .4em; }
    #${D} .choices { grid-template-columns: repeat(auto-fill, minmax(4.4em, 1fr)); }
    #${D} .panel { padding-left: 0; }
  }
`,k=null;function A({current:e,onPick:t,live:r=!1,preferCustom:f,profile:m=`icon`}){let h=e,v=!1,y=te(),b=N(e,y,f),x=``,S=null;s.destroy(D),g(`dialogs`).insertAdjacentHTML(`beforeend`,`<div id="${D}" class="dialog">
      <style>${O}</style>
      <div class="head">
        <div class="current"></div>
        <input type="search" class="search" placeholder="${d(`Search built-in icons`)}" data-tip="${d(`Find a built-in icon or emoji by name`)}" />
      </div>
      <div class="body">
        <nav></nav>
        <div class="panel"></div>
      </div>
    </div>`);let T=g(D),E=T.querySelector(`nav`),A=T.querySelector(`.panel`),j=T.querySelector(`.search`),M=options.map,P=()=>T.isConnected&&options.map===M,F=()=>{T.querySelector(`.current`).innerHTML=I(e,S,y)},U=()=>{E.innerHTML=L(y,x?null:b)},W=()=>{if(x)A.innerHTML=B(y,x,e);else if(b===`custom`)A.innerHTML=H(e,S,m);else{let t=y.filter(({key:e})=>e===b);A.innerHTML=(b.startsWith(`glyph`)?V(e):``)+R(t,e),z(t)}G()},G=()=>{let e=A.querySelector(`.pressed`);A.scrollTop=e?e.offsetTop-A.clientHeight/2:0},K=e=>{b=e,x=``,j.value=``,U(),W()},q=n=>{e=n;for(let e of A.querySelectorAll(`.choices [data-icon]`))e.classList.toggle(`pressed`,e.dataset.icon===n);F(),r&&t(n)},J=()=>{v=!0,r||t(e),s.close(D)},Y=e=>{S=e,F(),e?K(`custom`):b===`custom`&&!x&&W()},X=()=>{U(),F(),b===`custom`&&!x&&W()},Z=async e=>{if(!P()||T.classList.contains(`busy`))return;let t=S,r=t??n.newId();T.classList.add(`busy`);try{let i=await e(r);if(!P()||S!==t)return;t?(C(r),n.update(r,i),S=null,X()):(n.add({id:r,...i}),X(),q(r))}catch(e){P()&&c(e.message,!1,`error`,6e3)}finally{T.classList.remove(`busy`)}},ne=()=>A.querySelector(`.customAdd input`)?.value??``,Q=(e,t)=>{k??=u(e),k.accept=e,k.onchange=()=>{let e=k.files?.[0];k.value=``,e&&t(e)},k.click()},re=()=>Q(`image/*,.svg`,e=>void Z(t=>_.fromFile(e,t,m))),ie=async()=>{let e=await o.pack();l(e,`${a(`Custom icons`)}.zip`,`application/zip`)},ae=t=>{P()&&!T.classList.contains(`busy`)&&(T.classList.add(`busy`),C(e),o.unpack(t).then(({added:e,unchanged:t,conflicts:n,invalid:r})=>{if(!P())return;X();let i=[`${d(`Added`)}: ${e}`,t&&d(`Already here: {{unchanged}}`,{unchanged:t}),r&&d(`Invalid, skipped: {{invalid}}`,{invalid:r})];c(p(d(`Custom icons imported`),i.filter(Boolean).join(`, `)),!1,`success`,5e3),n.length&&oe(n)}).catch(e=>P()&&c(e.message,!1,`error`,6e3)).finally(()=>T.classList.remove(`busy`)))},oe=e=>{s.confirm({title:d(`Import custom icons`),message:p(d(`Archived icons with the id of a different icon on this map: {{icons}}`,{icons:e.length}),d(`Replace the map's pictures with the archived ones?`),d(`Everything using them will change`)),confirm:d(`Replace`),cancel:d(`Keep the map's`),onConfirm:()=>{for(let{id:t}of e)C(t);o.replace(e),P()&&X(),c(d(`Custom icons replaced: {{icons}}`,{icons:e.length}),!1,`success`,4e3)}})},$={link:()=>void Z(()=>_.fromLink(ne())),upload:re,exportAll:()=>void ie().catch(e=>c(e.message,!1,`error`,6e3)),importArchive:()=>Q(`.zip,application/zip`,ae),stopReplacing:()=>Y(null),position:()=>w(e),replace:()=>Y(S===e?null:e),remove:()=>{let t=e,r=i.uses(t),a=Object.values(r).reduce((e,t)=>e+t,0);s.confirm({title:d(`Remove`),message:a?`${d(`The icon is used by {{uses}}. They will show no icon.`,{uses:i.describeUses(r)})}<br>${d(`Remove it anyway?`)}`:d(`The icon is not used on the map. Remove it?`),confirm:d(`Remove`),onConfirm:()=>{S===t&&(S=null),C(t),n.remove(t),X()}})}};T.addEventListener(`click`,e=>{let t=e.target,n=t.closest(`nav [data-source]`)?.dataset.source;if(n)return K(n);let r=t.closest(`[data-action]`)?.dataset.action;if(r)return $[r]?.();let a=t.closest(`.choices [data-icon]`)?.dataset.icon;if(a===void 0)return;let o=A.querySelector(`.glyphText input`);o&&(o.value=i.glyphText(a)??``),q(a)}),A.addEventListener(`dblclick`,e=>{e.target.closest(`.choices [data-icon]`)&&J()}),A.addEventListener(`input`,e=>{let t=e.target;t.closest(`.glyphText`)&&q(i.glyph(t.value))}),A.addEventListener(`keydown`,e=>{e.key===`Enter`&&e.target.closest(`.customAdd`)&&$.link()}),j.addEventListener(`input`,()=>{x=j.value.trim().toLowerCase(),U(),W()}),F(),U(),W(),s.open(D,{title:d(`Select icon`),width:ee(),position:{my:`center`,at:`center`,of:`svg`},onClose:()=>{r&&!v&&e!==h&&t(h),s.destroy(D)},buttons:[{label:d(`Apply`),onClick:J},{label:d(`Cancel`),onClick:()=>s.close(D)}]}),G()}function ee(){let e=Number.parseFloat(getComputedStyle(document.body).fontSize)||10;return Math.min(52*e,(window.visualViewport?.width??window.innerWidth)-16)}function te(){return[...Object.entries(e).map(([e,n])=>({key:`glyph/${e}`,group:d(`Emoji`),label:t[e]??e,icons:Object.keys(n).map(e=>i.glyph(e))})),...r.sets().flatMap(j)]}function j({id:e,group:t}){let n=e,i=new Map;for(let e of r.files(n)){let t=e.slice(0,Math.max(0,e.lastIndexOf(`/`)));i.set(t,[...i.get(t)??[],r.symbolId(n,e)])}let a=e.slice(e.indexOf(`-`)+1);return[...i].map(([e,r])=>({key:e?`${n}/${e}`:n,group:t,label:f((e||a).replaceAll(/[-/]/g,` `).replace(/([a-z0-9])([A-Z])/g,`$1 $2`)),icons:r,set:n}))}function M(e,t){let n=r.setForId(t);return e.find(e=>e.icons.includes(t))??(n&&e.find(e=>e.set===n))}function N(e,t,n){let r=i.kind(e);return r===`custom`||!e&&n?`custom`:(M(t,e)??t.find(({set:e})=>r===`glyph`?!e:e))?.key??`custom`}function P(e){return e.label===e.group?F(e.group):`${F(e.group)} · ${e.label}`}var F=e=>t[e]??e;function I(e,t,r){let a=i.kind(e),o=a===`set`?M(r,e):void 0,s=e?a===`glyph`?d(`Emoji`):a===`custom`?d(`Carried by this map`):o?P(o):d(`Built-in`):d(`No icon selected`),c=a===`custom`&&n.get(e)?`<div class="currentActions">
          <button type="button" data-action="position" data-tip="${d(`Zoom and pan the picture in its frame`)}"><span class="icon-resize-full"></span> ${d(`Position`)}</button>
          <button type="button" data-action="replace" class="${t===e?`pressed`:``}" data-tip="${d(`Give the icon a new picture: every use follows`)}"><span class="icon-upload"></span> ${d(`Replace`)}</button>
          <button type="button" data-action="remove" data-tip="${d(`Remove`)}"><span class="icon-trash-empty"></span></button>
        </div>`:``;return`<span class="preview">${i.html(e)}</span>
    <div class="about"><span class="name">${m(e?f(i.name(e)):d(`None`))}</span><span class="from">${s}</span></div>
    ${c}`}function L(e,t){let r=(e,n,r,i=``)=>`<button type="button" data-source="${m(e)}" class="${i} ${e===t?`active`:``}">${n}${r?` <small>${r}</small>`:``}</button>`,i=``,a=e.map(e=>{if(e.label===e.group)return r(e.key,F(e.group),e.icons.length,`section`);let t=e.group===i?``:`<div class="section">${F(e.group)}</div>`;return i=e.group,t+r(e.key,e.label,e.icons.length,`entry`)});return r(`custom`,d(`Custom`),n.all.length)+a.join(``)}function R(e,t,n=!1){return e.map(e=>{let r=e.icons.map(e=>U(e,t)).join(``);return`${n?`<h4>${e.label}</h4>`:``}<div class="choices">${r}</div>`}).join(``)}function z(e){for(let t of new Set(e.map(e=>e.set)))t&&i.retry(t)}function B(e,t,n){let r=e.map(e=>({...e,label:P(e),icons:e.icons.filter(e=>i.name(e).toLowerCase().includes(t))})).filter(e=>e.icons.length);return z(r),r.length?R(r,n,!0):`<p class="empty">${d(`No built-in icon is called “{{query}}”.`,{query:t})}</p>`}function V(e){return`<label class="glyphText">${d(`Type any short text`)}
      <input value="${m(i.glyphText(e)??``)}" placeholder="XIV" />
    </label>`}function H(e,t,r){let i=n.all.map(({id:t})=>U(t,e));return`<div class="customAdd">
      <input type="url" placeholder="${d(`Paste a link to an image`)}" data-tip="${d(`A linked image keeps the map small; it shows while its site serves it`)}" />
      <button type="button" data-action="link">${d(`Add link`)}</button>
      <button type="button" data-action="upload" data-tip="${d(r===`emblem`?`Upload an SVG file (up to 1 MB) or a PNG, JPEG or WebP image (up to 10 MB, shrunk to 1024 px)`:`Upload an SVG file (up to 200 kB) or a PNG, JPEG or WebP image (up to 2 MB, shrunk to 256 px)`)}">${d(`Upload`)}</button>
    </div>
    <div class="replacing" ${t?``:`hidden`}>${d(`Link or upload the new picture of the selected icon.`)} <a data-action="stopReplacing">${d(`Cancel`)}</a></div>
    ${i.length?`<div class="choices">${i.join(``)}</div>`:`<p class="empty">${d(`This map carries no custom icons yet.`)}</p>`}
    <div class="customArchive">
      ${i.length?`<button type="button" data-action="exportAll" data-tip="${d(`Download all custom icons as a zip archive, to import them into another map`)}">${d(`Download all`)}</button>`:``}
      <button type="button" data-action="importArchive" data-tip="${d(`Import custom icons from a downloaded zip archive. An icon whose id the map uses for another picture is replaced only on confirmation`)}">${d(`Import zip`)}</button>
    </div>
    <p class="note">${d(`Free icons`)}: <a href="https://game-icons.net" target="_blank" rel="noopener">game-icons.net</a>, <a href="https://thenounproject.com" target="_blank" rel="noopener">The Noun Project</a>, <a href="https://openmoji.org" target="_blank" rel="noopener">OpenMoji</a>, <a href="https://commons.wikimedia.org" target="_blank" rel="noopener">Wikimedia Commons</a>.</p>`}function U(e,t){let n=e===t?`pressed`:``,r=i.glyphText(e),a=r===null?i.html(e):m(r);return`<button type="button" class="${n}" data-icon="${m(e)}" data-tip="${m(f(i.name(e)))}">${a}</button>`}var W={open:A};export{W as IconPicker};