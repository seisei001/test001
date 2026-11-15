import{t as e}from"./controllers-Dbv1ZRTV.js";import{t}from"./pack-generator-DTsfQ82D.js";import{T as n}from"./options-model-CrstL1Qd.js";import{t as r}from"./layers-DjWzCbYN.js";import{r as i}from"./connection-BjyQOPKH.js";import{a,r as o}from"./reveal-CQpR_gxf.js";import{v as s}from"./app-DCKsq5m8.js";import{O as c,a as l,m as u}from"./index-sNerCVjG.js";import{a as d,i as f}from"./node-utils-Ds1sVy-v.js";var p=[`Escape`,`ArrowDown`,`ArrowUp`,`Enter`,` `],m=new class{root;events;rows=[];cell=0;point=[0,0];open(e){this.close();let n=f(`viewbox`);if(!n||!pack.cells?.p)return;let[r,i]=d(e,n),a=t.findCell(r,i);a!==void 0&&(this.cell=a,this.point=[c(r,2),c(i,2)],this.rows=this.collect(e.clientX,e.clientY,a),this.render(e.clientX,e.clientY),this.listen())}close(){this.root?.remove(),this.root=void 0,this.rows=[],this.events?.abort(),this.events=void 0}collect(e,t,r){let i=new Map,a=(e,t)=>{let r=n.key(e);!i.has(r)&&n.get(e)&&i.set(r,{ref:e,element:t})};for(let r of document.elementsFromPoint(e,t)){let e=n.resolveTarget(r);e&&a(e,r)}let o=i.values().next().value;for(let e of n.at(r))a(e,this.element(e));let s=({ref:e})=>n.getDisplay(e).scale,c=[...i.values()].filter(e=>e!==o).sort((e,t)=>s(t)-s(e));return o?[o,...c]:c}render(e,t){let r=document.createElement(`div`);r.id=`contextMenu`,r.setAttribute(`role`,`menu`);let a=this.rows.map(({ref:e,element:t},r)=>{let{kind:i,icon:a}=n.getDisplay(e),o=!t&&this.hidden(e),s=n.getName(e);return`<button type="button" role="menuitem" data-index="${r}" ${o?`class="dim" data-tip="${l(`The layer is hidden`)}"`:``}>
        <span class="${a}"></span><span class="name">${u(s||i)}</span>${s?`<span class="kind">${u(i)}</span>`:``}
      </button>`});i()&&a.push(`<button type="button" role="menuitem" data-action="ask">
        <span class="icon-help"></span><span class="name">${l(`What's there?`)}</span>
      </button>`),r.innerHTML=`
      <style>
        #contextMenu {
          position: fixed;
          z-index: 100000;
          box-sizing: border-box;
          min-width: 14em;
          max-width: min(24em, calc(100vw - 8px));
          max-height: calc(100vh - 8px);
          overflow-y: auto;
          padding: 0.25em;
          background: var(--bg-dialogs, rgb(250 250 250 / 97%));
          color: #30343b;
          box-shadow: 0 0.5em 1.5em #00000030;
          font: 1.1em/1.3 var(--sans-serif);
        }

        #contextMenu button {
          display: flex;
          align-items: center;
          gap: 0.6em;
          width: 100%;
          padding: 0.3em 0.6em;
          border: 0;
          background: transparent;
          color: inherit;
          font: inherit;
          text-align: left;
          cursor: pointer;
        }

        #contextMenu button:hover,
        #contextMenu button:focus-visible {
          outline: none;
          background: color-mix(in srgb, var(--dark-solid) 12%, transparent);
        }

        #contextMenu button.dim {
          opacity: 0.55;
        }

        #contextMenu button[data-action="ask"] {
          margin-top: 0.25em;
          border-top: 1px solid color-mix(in srgb, var(--bg-main) 22%, transparent);
        }

        #contextMenu button > [class^="icon-"] {
          flex: 0 0 1.3em;
          color: var(--dark-solid);
          text-align: center;
        }

        #contextMenu .name {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        #contextMenu .kind {
          color: color-mix(in srgb, currentColor 55%, transparent);
          font-size: 0.85em;
          white-space: nowrap;
        }
      </style>
      ${a.join(``)}`,document.body.append(r);let{width:o,height:s}=r.getBoundingClientRect();r.style.left=`${Math.max(4,Math.min(e,window.innerWidth-o-4))}px`,r.style.top=`${Math.max(4,Math.min(t,window.innerHeight-s-4))}px`,this.root=r}listen(){let e=this.root;if(!e)return;this.events=new AbortController;let t=this.events.signal,n={capture:!0,signal:t};e.addEventListener(`click`,e=>this.activate(e.target),{signal:t}),e.addEventListener(`contextmenu`,e=>e.preventDefault(),{signal:t});let r=e=>p.includes(e.key);window.addEventListener(`keydown`,e=>{r(e)?((e.key===`ArrowDown`||e.key===`ArrowUp`)&&this.move(e.key===`ArrowDown`?1:-1),e.key!==`Enter`&&e.key!==` `&&e.preventDefault(),e.stopImmediatePropagation()):this.close()},n),window.addEventListener(`keyup`,e=>{r(e)&&(e.stopImmediatePropagation(),e.key===`Escape`&&this.close())},n);let i=t=>{e.contains(t.target)||this.close()};window.addEventListener(`pointerdown`,i,n),window.addEventListener(`wheel`,i,n);for(let e of[`blur`,`resize`,`map:generated`])window.addEventListener(e,()=>this.close(),{signal:t})}move(e){let t=Array.from(this.root?.querySelectorAll(`button`)??[]),n=t.indexOf(document.activeElement);t[n===-1?e>0?0:t.length-1:(n+e+t.length)%t.length]?.focus()}activate(e){let t=e.closest(`button`);if(!t)return;if(t.dataset.action===`ask`){this.ask();return}let n=this.rowOf(t);this.close(),!n||n.element&&s(n.element)||o(n.ref)||a(n.ref)}ask(){let[t,n]=this.point,r=`${l(`What's there?`)} cell:${this.cell}, x:${t}, y:${n}`;this.close(),e.Assistant.ask(r)}element(e){let t=this.hidden(e)?null:f(n.getElementId(e)??``);return t&&!t.closest(`#labels`)?t:void 0}hidden(e){let{layers:t}=n.getDisplay(e);return t.length>0&&!t.some(e=>r.isOn(e))}rowOf(e){let t=e?.closest(`button[data-index]`)?.dataset.index;return t===void 0?void 0:this.rows[Number(t)]}};export{m as ContextMenu};