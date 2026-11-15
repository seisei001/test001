import{C as e,T as t,w as n}from"./options-model-CrstL1Qd.js";import{g as r,t as i}from"./layers-DjWzCbYN.js";import{S as a}from"./app-DCKsq5m8.js";import{a as o,i as s,r as c}from"./reveal-CQpR_gxf.js";import{o as l}from"./tooltips-BVQbACdS.js";import{a as u}from"./index-sNerCVjG.js";import{i as d}from"./node-utils-Ds1sVy-v.js";var f=`fmg-omnibar-history`,p=10,m=50,h=60,g=100,_=800,v=document.createElement(`template`),y=class{root;input;list;status;events;previousFocus;keys=new Set;records=[];results=[];matched=0;history=[];selected=-1;busy=!1;open(){if(this.root)return void this.input?.focus();this.busy||(this.previousFocus=document.activeElement instanceof HTMLElement?document.activeElement:void 0,this.records=this.collect(),this.history=this.readHistory(),this.render(),this.listen(),this.search(),this.input?.focus())}close(){this.dismiss(!0)}collect(){let i=(options.map.viewOnly?[]:a.mapCommands).map(e=>({kind:`command`,id:e.id,name:e.name,context:`Command`,fields:{name:b(e.name),alias:b(e.link?`open ${e.name} ${e.aliases}`:e.aliases)},command:e}));if(typeof pack>`u`||!pack.cells?.i?.length)return i;let o=new Map;for(let r of n)for(let n of t.collect(r,{located:!0})){let{ref:r,entity:i}=n,a=t.key(r),s=t.getDisplay(r),c=t.getName(r)||i.name||``,l=e.format(i.tags),u=(i.tags||[]).map(e=>`#${e}`).join(` `),d=[s.kind,t.getContext(r)].filter(Boolean).join(` · `),f=[i.name||c,d,l,u].filter(Boolean).join(` `);o.set(a,{kind:`entity`,id:`entity:${a}`,name:c||s.kind,context:d,fields:{...this.fields({name:c,alias:f,note:i.note}),unnamed:!c},target:n,display:s})}for(let e of r()){if(!e.text)continue;let n=e.type===`added`?`addedLabel`:e.type,r=o.get(t.key({type:n,id:e.entityId}));if(r?.kind!==`entity`||e.type===`added`)continue;let i=e.text.replaceAll(`|`,` `);o.set(`label:${e.id}`,{kind:`label`,id:`label:${e.id}`,name:i,context:`Label · ${r.context}`,fields:this.fields({name:i,alias:`${r.name} ${r.context}`}),target:r.target,label:e})}return[...i,...o.values()]}fields({name:e,alias:t,note:n}){let r=C(n||``);return{name:b(e),alias:b(t),note:r,normalizedNote:r?b(r):void 0}}readHistory(){try{let e=JSON.parse(localStorage.getItem(f)||`[]`),t=new Set(this.records.filter(e=>e.kind===`command`).map(e=>e.id));return Array.isArray(e)?[...new Set(e.filter(e=>typeof e==`string`&&t.has(e)))].slice(0,p):[]}catch{return[]}}render(){let e=document.createElement(`div`);e.id=`omnibar`,e.setAttribute(`role`,`dialog`),e.setAttribute(`aria-label`,u(`Search map and commands`)),e.innerHTML=`
      <style>
        #omnibar {
          --line: color-mix(in srgb, var(--bg-main) 22%, transparent);
          --muted: color-mix(in srgb, currentColor 55%, transparent);
          position: fixed;
          top: 0.8em;
          left: 50%;
          transform: translateX(-50%);
          width: min(50em, calc(100vw - 2em));
          z-index: 100000;
          box-sizing: border-box;
          overflow: hidden;
          background: var(--bg-dialogs, rgb(250 250 250 / 97%));
          color: #30343b;
          box-shadow: 0 0.5em 1.5em #00000030;
          font: 1.2em/1.3 var(--sans-serif);
        }

        #omnibar .omnibar-search {
          display: flex;
          align-items: center;
          gap: 0.7em;
          padding: 0 0.9em;
        }

        #omnibar .omnibar-search > .icon-search {
          color: var(--dark-solid);
          font-size: 1em;
        }

        #omnibar input {
          box-sizing: border-box;
          flex: 1;
          min-width: 0;
          height: 2.7em;
          margin: 0;
          padding: 0;
          border: 0;
          border-radius: 0;
          outline: none;
          box-shadow: none;
          background: transparent;
          color: inherit;
          caret-color: var(--dark-solid);
          font: inherit;
        }

        #omnibar input::placeholder {
          color: var(--muted);
        }

        #omnibar .omnibar-escape {
          color: var(--muted);
          font-size: 0.75em;
        }

        #omnibar-list {
          max-height: min(26em, 50vh);
          overflow-y: auto;
          overscroll-behavior: contain;
          scrollbar-width: thin;
          scrollbar-color: var(--line) transparent;
        }

        #omnibar-list:not(:empty) {
          padding: 0.25em;
          border-top: 1px solid var(--line);
        }

        #omnibar [role="option"] {
          display: flex;
          align-items: center;
          gap: 0.6em;
          min-width: 0;
          padding: 0.3em 0.6em;
          cursor: pointer;
        }

        #omnibar [role="option"]:hover {
          background: color-mix(in srgb, var(--dark-solid) 5%, transparent);
        }

        #omnibar [role="option"][aria-selected="true"] {
          background: color-mix(in srgb, var(--dark-solid) 12%, transparent);
        }

        #omnibar [aria-disabled="true"] {
          color: var(--muted);
          cursor: default;
        }

        #omnibar .omnibar-icon {
          flex: 0 0 1.3em;
          color: var(--muted);
          font-size: 0.95em;
          text-align: center;
        }

        #omnibar [aria-selected="true"] .omnibar-icon {
          color: var(--dark-solid);
        }

        #omnibar .omnibar-name {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        #omnibar .omnibar-detail {
          flex: 0 1 auto;
          max-width: 50%;
          margin-left: auto;
          overflow: hidden;
          color: var(--muted);
          font-size: 0.85em;
          text-align: right;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        #omnibar mark {
          background: transparent;
          color: var(--dark-solid);
          font-weight: 600;
        }

        #omnibar-status {
          padding: 0.35em 1.2em;
          border-top: 1px solid var(--line);
          color: var(--muted);
          font-size: 0.75em;
        }

        #omnibar-status:empty {
          display: none;
        }
      </style>

      <div class="omnibar-search">
        <span class="icon-search" aria-hidden="true"></span>
        <input
          id="omnibar-input"
          role="combobox"
          aria-label="${u(`Search map and commands`)}"
          aria-expanded="true"
          aria-controls="omnibar-list"
          aria-autocomplete="list"
          autocomplete="off"
          spellcheck="false"
          placeholder="${u(`Search map and commands`)}"
        >
        <span class="omnibar-escape" aria-hidden="true">esc</span>
      </div>

      <div id="omnibar-list" role="listbox" aria-label="${u(`Search results`)}"></div>
      <div id="omnibar-status" role="status" aria-live="polite"></div>
    `,document.body.append(e),this.root=e,this.input=e.querySelector(`input`),this.list=e.querySelector(`#omnibar-list`),this.status=e.querySelector(`#omnibar-status`),this.input.addEventListener(`input`,()=>this.search()),this.list.addEventListener(`mousedown`,e=>e.preventDefault()),this.list.addEventListener(`click`,e=>{let t=e.target.closest(`[data-index]`);t&&this.activate(Number(t.dataset.index))})}listen(){if(this.events)return;this.events=new AbortController;let e={capture:!0,signal:this.events.signal};window.addEventListener(`keydown`,e=>{if(this.root){if(e.code===`Space`&&!this.input?.value)e.preventDefault(),e.stopImmediatePropagation();else if(this.keys.add(e.code),e.stopImmediatePropagation(),!e.isComposing){if([`Escape`,`Enter`,`ArrowDown`,`ArrowUp`,`Tab`].includes(e.key)&&e.preventDefault(),((e.ctrlKey||e.metaKey)&&e.code===`KeyS`||/^F\d+$/.test(e.code))&&e.preventDefault(),e.key===`Escape`)this.close();else if(e.key===`Enter`&&!e.repeat)this.activate(this.selected);else if(e.key===`ArrowDown`||e.key===`ArrowUp`){let t=this.results.length;t&&this.select((this.selected+(e.key===`ArrowDown`?1:-1)+t)%t)}else e.key===`Tab`&&this.input?.focus()}}},e),window.addEventListener(`keyup`,e=>{(this.root||this.keys.has(e.code))&&(e.stopImmediatePropagation(),e.preventDefault()),this.keys.delete(e.code),e.key===`Meta`&&this.keys.clear(),this.cleanup()},e),window.addEventListener(`pointerdown`,e=>{this.root&&!this.root.contains(e.target)&&this.close()},e),window.addEventListener(`blur`,()=>{this.keys.clear(),this.close()},{signal:this.events.signal}),window.addEventListener(`map:generated`,()=>{this.root&&(this.records=this.collect(),this.search(),this.report(u(`The map changed. Select a current result.`)))},{signal:this.events.signal})}search(){let e=this.input?.value.trim()||``,t=e.startsWith(`>`),n=b(t?e.slice(1):e),r=!n||/[\p{L}\p{N}?]/u.test(n),i=this.records.filter(e=>!t||e.kind===`command`).map((e,i)=>({result:e,order:i,score:r?this.score(e,n,t,this.history.indexOf(e.id)):0})).filter(e=>e.score>0).sort((e,t)=>t.score-e.score||e.order-t.order);this.matched=i.length,this.results=i.slice(0,t?1/0:m).map(e=>e.result),this.selected=0,this.renderResults(n)}score(e,t,n,r){if(t){let{fields:n}=e,r=w(n.name,t),i=w(n.alias,t),a=n.normalizedNote?.includes(t)?g:0,o=e.kind===`command`&&e.command.matches?.(t)?_:0,s=Math.max(r&&r+400,i&&i+200,o,a);return n.unnamed?Math.min(s,g):s}return e.kind===`command`?r>=0?1e3-r:+!!n:0}renderResults(e){if(!this.list||!this.status)return;let t=T();this.list.replaceChildren(),this.results.forEach((n,r)=>{let a=document.createElement(`div`);a.id=`omnibar-result-${r}`,a.dataset.index=String(r),a.setAttribute(`role`,`option`),a.setAttribute(`aria-disabled`,String(!!t));let o=document.createElement(`span`);o.className=`omnibar-icon`,n.kind===`command`?o.textContent=`>`:o.classList.add(n.kind===`label`?`icon-font`:n.display.icon),o.setAttribute(`aria-hidden`,`true`);let s=document.createElement(`span`);s.className=`omnibar-name`,this.highlight(s,n.name,e);let c=document.createElement(`span`);c.className=`omnibar-detail`;let l=n.kind===`command`?n.command.layer:void 0;c.textContent=t||`${n.context}${l?` · ${i.isOn(l)?u(`Visible`):u(`Hidden`)}`:``}`,a.append(o,s,c);let d=n.kind===`entity`?n.fields:void 0,f=n.kind===`entity`&&n.display.previewNote;if(d?.note&&(f||e&&d.normalizedNote?.includes(e))){let t=document.createElement(`span`);this.highlight(t,S(d.note,f?``:e),e),c.append(` · `,t)}a.title=`${n.name} · ${c.textContent}`,this.list.append(a)});let n=this.matched>this.results.length?u(`{{shown}} of {{total}}`,{shown:this.results.length,total:this.matched}):this.results.length;this.status.textContent=this.results.length?`${u(`Results: {{results}}`,{results:n})} · ↑↓ ${u(`navigate`)} · ↵ ${u(`select`)}`:e?u(`No matches`):``,this.select(this.selected)}highlight(e,t,n){let{letters:r,haystack:i,owners:a}=x(t),o=new Set;for(let e of n.split(` `).filter(Boolean)){let t=i.indexOf(e);for(;t!==-1;){for(let n=t;n<t+e.length;n++)o.add(a[n]);t=i.indexOf(e,t+e.length)}}r.forEach((t,n)=>{if(!o.has(n)){e.append(t);return}let r=document.createElement(`mark`);r.textContent=t,e.append(r)})}select(e){this.selected=e,this.list?.querySelectorAll(`[role='option']`).forEach((t,n)=>{t.setAttribute(`aria-selected`,String(n===e))});let t=this.list?.children[e];t?(this.input?.setAttribute(`aria-activedescendant`,t.id),t.scrollIntoView({block:`nearest`})):this.input?.removeAttribute(`aria-activedescendant`)}async activate(e){let t=this.results[e];if(!t||this.busy||this.unavailable())return;if(t.kind!==`command`&&!this.current(t)){this.records=this.collect(),this.search(),this.report(u(`The map changed. Select a current result.`));return}let n=this.input?.value.trim().replace(/^>\s*/,``);this.busy=!0,this.dismiss(!1);try{if(t.kind===`command`)await t.command.run(void 0,n),this.remember(t.id);else if(t.kind===`label`)this.navigate(t.target,{label:t.label});else{let e=!options.map.viewOnly&&c(t.target.ref);e?await e:this.navigate(t.target)}}catch{l(u(`Could not open the search result. Please try again.`),!1,`error`)}finally{this.busy=!1}}current(e){return t.get(e.target.ref)===e.target.entity}navigate(e,{label:t}={}){let n;if(t){let e=options.map.labels.groups.find(e=>e.name===t.group),r=[`labels`];e?.layerDependency&&i.has(e.layerDependency)&&r.push(e.layerDependency),n=s([[t.anchor[0]+(t.dx||0),t.anchor[1]+(t.dy||0)]],{layers:r,maxScale:8,zoom:e?.zoom,element:()=>d(t.id)})}else n=o(e.ref);n||this.report(u(`This element has no map location`),`warn`)}remember(e){this.history=[e,...this.history.filter(t=>t!==e)].slice(0,p);try{localStorage.setItem(f,JSON.stringify(this.history))}catch{}}report(e,t){t?l(e,!1,t,4e3):this.status&&(this.status.textContent=e)}unavailable(){let e=T();return e?(this.report(e),!0):!1}dismiss(e){this.root?.remove(),this.root=this.input=this.list=this.status=void 0,this.records=this.results=[],e&&this.previousFocus?.isConnected&&this.previousFocus.focus(),this.previousFocus=void 0,this.cleanup()}cleanup(){this.root||this.keys.size||(this.events?.abort(),this.events=void 0)}};function b(e){return e.normalize(`NFD`).replace(/\p{M}/gu,``).toLowerCase().replace(/\s+/g,` `).trim()}function x(e){let t=Array.from(e),n=t.map(e=>e.normalize(`NFD`).replace(/\p{M}/gu,``).toLowerCase()),r=n.flatMap((e,t)=>Array(e.length).fill(t));return{letters:t,haystack:n.join(``),owners:r}}function S(e,t){let{letters:n,haystack:r,owners:i}=x(e),a=t?r.indexOf(t):-1,o=a===-1?0:Math.max(0,i[a]-35);return`${o?`…`:``}${n.slice(o,o+h).join(``)}`}function C(e){if(!e)return``;v.innerHTML=e;for(let e of v.content.querySelectorAll(`script, style`))e.remove();for(let e of v.content.querySelectorAll(`br, p, div, li`))e.append(` `);let t=v.content.textContent||``;return v.innerHTML=``,t.replace(/\s+/g,` `).trim()}function w(e,t){if(e===t)return 1e3;if(e.startsWith(t))return 850;if(e.includes(t))return 700;let n=t.split(` `);return n.length>1&&n.every(t=>e.includes(t))?600:0}function T(){return typeof pack>`u`||!pack.cells?.i?.length?u(`Generate or load a map first`):options.app.mode?u(`Exit customization mode first`):d(`canvas3d`)?u(`Switch to the 2D map first`):``}var E=new y;export{E as Omnibar};