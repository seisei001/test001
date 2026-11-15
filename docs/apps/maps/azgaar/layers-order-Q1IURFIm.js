import{X as e}from"./app-DCKsq5m8.js";import{t}from"./layers-DjWzCbYN.js";import{t as n}from"./dialog-BkeQgjla.js";import{t as r}from"./sortable-list-BzIJXSX4.js";import{a as i}from"./index-sNerCVjG.js";import{i as a,r as o}from"./node-utils-Ds1sVy-v.js";var s=`layersOrder`,c=`
  #${s} { padding: .4em .5em; }
  #${s} > .rows { width: auto; }
  #${s} .row { display: grid; grid-template-columns: 1em 1fr 1.2em; align-items: center; gap: .4em; height: 1.9em; padding: 0 .4em; border-radius: 3px; white-space: nowrap; }
  #${s} .row:hover { background: rgba(0, 0, 0, .06); }
  #${s} .row.off :is(.name, .eye) { opacity: .5; }
  #${s} .row .icon-resize-vertical { cursor: row-resize; opacity: .6; touch-action: none; }
  #${s} .row .eye { cursor: pointer; text-align: center; }
`,l;function u(){if(a(s))return void n.open(s);o(`dialogs`).insertAdjacentHTML(`beforeend`,`<div id="${s}" class="dialog"><style>${c}</style><div class="rows"></div></div>`);let e=o(s).querySelector(`.rows`);e.addEventListener(`click`,e=>{let n=e.target.closest(`.eye`)?.closest(`.row`)?.dataset.layer;n&&t.has(n)&&t.toggle(n)}),r(e,{items:`.row`,handle:`.icon-resize-vertical`,onReorder:p}),l=t.subscribe(f),n.open(s,{title:i(`Layers Order`),width:`16em`,maxHeight:Math.round(window.innerHeight*.85),position:{my:`left top`,at:`right+10 top`,of:`#options`},buttons:[{label:i(`Restore`),tip:i(`Restore the default layer order`),onClick:()=>t.resetOrder()}],onClose:d}),f()}function d(){l?.(),l=void 0}function f(){let n=a(s)?.querySelector(`.rows`);n&&(n.innerHTML=t.all.filter(t=>t.params.parent===`viewbox`&&e.has(t.id)).reverse().map(n=>{let{label:r}=e.get(n.id),a=t.isOn(n.id);return`<div class="row${a?``:` off`}" data-layer="${n.id}">
        <span class="icon-resize-vertical" data-tip="${i(`Drag to reorder`)}"></span>
        <span class="name">${r}</span>
        <span class="eye ${a?`icon-eye`:`icon-eye-off`}" data-tip="${i(`Toggle {{- layer}}`,{layer:r})}"></span>
      </div>`}).join(``))}function p(e){let n=e.dataset.layer,r=e.previousElementSibling?.dataset.layer;n&&t.has(n)&&t.move(n,r&&t.has(r)?r:void 0)}var m={open:u};export{m as LayersOrder};