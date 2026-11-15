import{t as e}from"./controllers-Dbv1ZRTV.js";import{C as t,M as n,j as r,m as i,n as a,pt as o}from"./options-model-CrstL1Qd.js";import{i as s,n as c,r as l}from"./goods-generator-DS7hwx2H.js";import{_ as u,c as d,l as f}from"./units-CYDspnRH.js";import{t as p,tt as m}from"./layers-DjWzCbYN.js";import{S as h,f as g}from"./app-DCKsq5m8.js";import{n as _}from"./development-view-ChwbelfH.js";import{t as v}from"./dialog-BkeQgjla.js";import{h as y,u as b}from"./economy-view-C5mGSEYI.js";import{o as x}from"./tooltips-BVQbACdS.js";import{s as S}from"./color-utils-OCVlKvQa.js";import{O as C,a as w,f as T,i as E,m as D}from"./index-sNerCVjG.js";import{i as O,r as k}from"./node-utils-Ds1sVy-v.js";function A(r,o){let S={...r?.demandCoverage||{}},A={...r?.biomeOutput||{}},L=()=>{let e=s.map(e=>[e,S[e]??0]).filter(([,e])=>e>0);return e.length?e.map(([e,t])=>`${l[e]} ${T(n[e])}: ${t}`).join(`, `):w(`None`)},R=()=>{let e=Object.entries(A).filter(([,e])=>(e??0)>0);return e.length?e.map(([e,t])=>`${pack.biomes[Number(e)].name}: ${t}`).join(`, `):w(`None`)},z={cultureType:{...r?.multipliers?.cultureType??{}},culture:{...r?.multipliers?.culture??{}},state:{...r?.multipliers?.state??{}},religion:{...r?.multipliers?.religion??{}},biome:{...r?.multipliers?.biome??{}},zone:{...r?.multipliers?.zone??{}}},B=e=>{let t=z[e]??{},n=Object.entries(t).filter(([,e])=>e!==1);return n.length?n.map(([t,n])=>`${N(e,t)} ×${C(n,2)}`).join(`, `):w(`None`)},V=(e,t)=>`
      <label class="ge-top" data-tip="${E(w(`Production multiplier by {{dimension}}`,{dimension:t.toLowerCase()}),j)}">${t}</label>
      <span id="mSummary_${e}" class="ge-summary">${B(e)}</span>
      <button class="mEdit icon-pencil ge-edit ge-top" data-dim="${e}" data-tip="${w(`Edit {{dimension}} multipliers`,{dimension:t})}"></button>`,H=structuredClone(r?.recipes??[]),U=r?.icon||`goods-unknown`,W;G(),i.retry(c.iconSet.id),v.open(`goodEditor`,{width:`36em`,title:w(r?`Edit good`:`Add`),footer:y(`goodEditorWiki`),buttons:[{label:w(`Cancel`),onClick:()=>{v.close(`goodEditor`)}},{label:w(r?`Apply`:`Add`),onClick:()=>{let e=[],n=k(`newGoodName`).value.trim(),i=k(`newGoodTags`).value.trim(),s=t.parse(i),l=+k(`newGoodValue`).value,u=+k(`newGoodCarriage`).value,d=+k(`newGoodDevelopment`).value,f=[+k(`newGoodDepositsMin`).value,+k(`newGoodDepositsMax`).value],m=+k(`newGoodDepositYield`).value,_=k(`newGoodUnit`).value.trim(),y=k(`newGoodColor`).value,b=k(`newGoodDistribution`).textContent?.trim()??``;if(n||e.push(w(`Name is required`)),(!Number.isFinite(l)||l<0)&&e.push(w(`Value must be a valid non-negative number`)),(!Number.isFinite(u)||u<0)&&e.push(w(`Carriage price must be a valid non-negative number`)),(!Number.isInteger(d)||d<0||d>100)&&e.push(w(`Development must be a whole number from 0 to 100`)),(f.some(e=>!Number.isFinite(e)||e<0)||f[0]>f[1])&&e.push(w(`Deposits must be a range of non-negative numbers, the minimum first`)),(!Number.isFinite(m)||m<0)&&e.push(w(`Deposit yield must be a valid non-negative number`)),b)try{let e=c.getMethods(),t=`{${Object.keys(e).join(`, `)}}`;Function(t,`return ${b}`)(e)}catch(t){e.push(w(`Distribution function is invalid: {{- error}}`,{error:t.message||String(t)}))}for(let t of H){for(let[n,r]of Object.entries(t)){let t=Number(n),i=c.get(t);i||e.push(w(`Recipe references unknown good id: {{- id}}`,{id:t}));let a=Number(r);(Number.isNaN(a)||!Number.isFinite(a)||a<=0)&&e.push(w(`Invalid recipe amount for good {{- good}}`,{good:i?.name}))}Object.keys(t).length||e.push(w(`Each recipe must have at least one ingredient`))}if(k(`newGoodError`).textContent=e.join(`. `),e.length)return;function C(){let e={};for(let[t,n]of Object.entries(z)){let r=Object.fromEntries(Object.entries(n??{}).filter(([,e])=>e!==void 0&&e!==1));Object.keys(r).length&&(e[t]=r)}return Object.keys(e).length?e:void 0}if(r){let e=r.i,t=b!==(r.distribution??``)||String(b?f:void 0)!==String(r.deposits);c.rename(e,n),c.setTags(e,s),c.setIcon(e,U),c.recolor(e,y),c.setPrice(e,l),c.setCarriage(e,u),c.setDevelopment(e,d),c.setUnit(e,_),c.setProduction(e,{deposits:b?f:null,depositYield:b&&m!==1?m:null,demandCoverage:S,multipliers:C()??null,biomeOutput:Object.keys(A).length?A:null,recipes:H.length?H:null}),r.distribution=b||void 0,c.sync(),t&&c.regeneratePlacement(r.i),p.draw(`markets`,`goods`,`trade`),g()}else{let e={i:(()=>{let e=new Set(options.map.military.units.flatMap(e=>e.goods??[])),t=options.map.goods.at(-1)?.i??1;for(;c.get(t)||e.has(t);)t++;return t})(),name:n,tags:s,icon:U,color:y,value:l,carriage:u,development:d||void 0,deposits:b?f:void 0,depositYield:b&&m!==1?m:void 0,unit:_,demandCoverage:S,multipliers:C(),distribution:b||void 0,biomeOutput:Object.keys(A).length?A:void 0,recipes:H.length?H:void 0};a.set(({map:t})=>t.goods.push(e)),c.regeneratePlacement(e.i)}x(w(r?`Good is updated`:`Good is added`),!1,`success`,5e3),o?.(),v.close(`goodEditor`),r&&h.openEconomyRegeneration([`production`])}}]}),b(`goodEditorWiki`);function G(){v.destroy(`goodEditor`),k(`dialogs`).insertAdjacentHTML(`beforeend`,`<div id="goodEditor" class="dialog">
    <style>
      .ge                 { display:flex; width:auto !important; flex-direction:column; gap:10px; max-height:72vh; overflow-y:auto; padding-right:2px; }
      .ge-section-title   { display:flex; align-items:center; justify-content:space-between; min-height:1.6em; font-weight:bold; text-transform:uppercase; font-size:.8em; letter-spacing:.06em; margin-bottom:6px; padding-bottom:3px; border-bottom:1px solid #666; }
      .ge-grid            { display:grid; grid-template-columns:9.5em minmax(0, 1fr) 1.8em; column-gap:.5em; row-gap:.35em; align-items:center; }
      .ge-grid > *        { min-width:0; }
      .ge-grid > label    { color:#555; }
      .ge-grid > .ge-top  { align-self:start; }
      .ge-field           { width:100%; box-sizing:border-box; }
      input.ge-num        { width:5em; }
      .ge-inline          { display:flex; flex-wrap:wrap; align-items:center; gap:.4em; }
      .ge-badge           { width:2em; height:2em; flex-shrink:0; }
      .ge-color           { width:2.4em; height:1.4em; padding:0; border:none; }
      .ge-edit            { justify-self:end; }
      .ge-summary         { line-height:1.35; }
      .ge-dist            { color:#555; font-family:var(--monospace); word-break:break-all; }
      .ge-note            { color:#777; font-style:italic; font-size:.9em; }
      .ge-error           { color:#b20000; min-height:1.2em; }
      .ge-recipe-list     { display:flex; flex-direction:column; gap:.45em; }
      .ge-recipe          { border:1px solid #ccc; border-radius:3px; }
      .ge-recipe-head     { display:flex; align-items:center; justify-content:space-between; padding:.2em .3em; }
      .ge-recipe-actions  { display:flex; gap:.3em; }
      .ge-recipe-ings     { display:flex; flex-direction:column; gap:.2em; padding:.3em .4em; }
      .ge-recipe-ing      { display:grid; grid-template-columns:1fr 5em 1.5em; gap:.25em; align-items:center; }
    </style>

    <div class="ge">
      <div>
        <div class="ge-section-title">${w(`General`)}</div>
        <div class="ge-grid">
          <label for="newGoodName">${w(`Name`)}*</label>
          <input id="newGoodName" class="ge-field" value="${D(r?.name||``)}" />
          <span></span>

          <label for="newGoodTags">${w(`Tags`)}</label>
          <input id="newGoodTags" class="ge-field" value="${t.format(r?.tags)}" placeholder="${w(`comma separated`)}" />
          <span></span>

          <label for="newGoodIconEdit">${w(`Icon`)}*</label>
          <span class="ge-inline">
            <svg class="ge-badge">
              <circle id="newGoodIconCircle" cx="50%" cy="50%" r="42%" fill="${r?.color||`#ff5959`}" stroke="${c.getStroke(r?.color||`#ff5959`)}"/>
              <use id="newGoodIconPreview" href="${D(i.href(U))}" x="10%" y="10%" width="80%" height="80%"${m()}/>
            </svg>
            <input id="newGoodColor" class="ge-color" type="color" data-tip="${w(`Color`)}" value="${r?.color||`#ff5959`}" />
          </span>
          <button id="newGoodIconEdit" type="button" class="icon-pencil ge-edit" data-tip="${w(`Select the good's icon`)}"></button>

          <label for="newGoodValue" data-tip="${w(`Price of one unit in {{money}}, the price markets start from`,{money:u()})}">${w(`Base Price`)}*</label>
          <span class="ge-inline"><input id="newGoodValue" class="ge-num" type="number" min="0" step="1" value="${r?.value??1}" /> 🟡</span>
          <span></span>

          <label for="newGoodCarriage" data-tip="${w(`Carriage: price of one unit per decima ({{distance}})`,{distance:f(d())})}">${w(`Carriage Price`)}*</label>
          <span class="ge-inline"><input id="newGoodCarriage" class="ge-num" type="number" min="0" step="0.1" value="${r?.carriage??.5}" /> 🟡</span>
          <span></span>

          <label for="newGoodDevelopment" data-tip="${w(`The least development, 0–100, a land needs to produce the good; 0 for none`)}">${w(`Development`)}</label>
          <span class="ge-inline"><input id="newGoodDevelopment" class="ge-num" type="number" min="0" max="100" step="1" value="${r?.development??0}" /> <span id="newGoodEra">${D(_(r?.development??0))}</span></span>
          <span></span>

          <label for="newGoodUnit">${w(`Unit`)}</label>
          <input id="newGoodUnit" class="ge-field" placeholder="${w(`e.g. wagon, barrel`)}" value="${D(r?.unit||``)}" />
          <span></span>

          <label class="ge-top" data-tip="${w(`Needs one unit covers. Click the pencil to edit`)}">${w(`Demand Coverage`)}</label>
          <span id="demandCoverageSummary" class="ge-summary">${L()}</span>
          <button class="dcEdit icon-pencil ge-edit ge-top" data-tip="${w(`Edit demand coverage`)}"></button>
        </div>
      </div>

      <div>
        <div class="ge-section-title">${w(`Raw Production`)}</div>
        <div class="ge-grid">
          <label class="ge-top" data-tip="${w(`For raw resources: sets the baseline production per biome`)}">${w(`Rural production`)}</label>
          <span id="biomeProductionSummary" class="ge-summary">${R()}</span>
          <button class="bpEdit icon-pencil ge-edit ge-top" data-tip="${w(`Edit biome baseline production`)}"></button>

          <label class="ge-top" data-tip="${w(`Where the raw good is produced`)}">${w(`Deposit distribution`)}</label>
          <div id="newGoodDistribution" class="ge-dist">${r?.distribution||``}</div>
          <button id="newGoodDistributionEditor" class="icon-pencil ge-edit ge-top" data-tip="${w(`Open the Distribution visual editor`)}"></button>

          <label data-tip="${w(`Deposits placed on the map, minimum to maximum`)}">${w(`Deposits`)}</label>
          <span class="ge-inline">
            <input id="newGoodDepositsMin" class="ge-num" type="number" min="0" step="1" value="${r?.deposits?.[0]??1}" />
            –
            <input id="newGoodDepositsMax" class="ge-num" type="number" min="0" step="1" value="${r?.deposits?.[1]??2}" />
            ${w(`on the map`)}
          </span>
          <span></span>

          <label for="newGoodDepositYield" data-tip="${w(`Multiplier on each deposit's output: below 1 for poorer deposits, above 1 for richer`)}">${w(`Deposit yield`)}</label>
          <span class="ge-inline"><input id="newGoodDepositYield" class="ge-num" type="number" min="0" step="0.1" value="${r?.depositYield??1}" /> ×</span>
          <span></span>
        </div>
        <div id="newGoodRawNote" class="ge-note"></div>
      </div>

      <div>
        <div class="ge-section-title">
          <span data-tip="${w(`Ingredients to make the good`)}">${w(`Recipes`)}</span>
          <button id="newGoodAddRecipe" class="icon-plus" data-tip="${w(`Add`)}"></button>
        </div>
        <div id="newGoodRecipeList" class="ge-recipe-list"></div>
        <div id="newGoodRecipeNote" class="ge-note"></div>
      </div>

      <div>
        <div class="ge-section-title">
          <span data-tip="${E(w(`Per-dimension production multipliers`),j)}">${w(`Multipliers`)}</span>
        </div>
        <div class="ge-grid">
          ${V(`cultureType`,M.cultureType)}
          ${V(`culture`,M.culture)}
          ${V(`state`,M.state)}
          ${V(`religion`,M.religion)}
          ${V(`biome`,M.biome)}
          ${V(`zone`,M.zone)}
        </div>
      </div>

      <div id="newGoodError" class="ge-error"></div>
    </div>
  </div>`),W=k(`goodEditor`);let n=k(`newGoodRecipeList`),a=options.map.goods[0]?.i??0,o=[...options.map.goods].sort((e,t)=>e.name.localeCompare(t.name)),s=()=>!Object.values(A).some(e=>(e??0)>0)&&!O(`newGoodDistribution`)?.textContent?.trim(),l=()=>{let e=s(),t=H.length===0,n=O(`newGoodRecipeNote`);if(!n)return;n.textContent=w(`This good is raw-only: gathered from the environment.`),n.style.display=t&&!e?``:`none`;let r=k(`newGoodRawNote`);r.textContent=w(`This good is manufactured-only: made from recipes in burgs.`),r.style.display=e&&!t?``:`none`},p=()=>{n.innerHTML=H.map((e,t)=>`
          <div class="recipeOption ge-recipe" data-recipe-index="${t}" >
            <div class="ge-recipe-head">
              <span>${w(`Recipe {{number}}`,{number:t+1})}</span>
              <div class="ge-recipe-actions">
                <span class="recipeAddIngredient icon-plus pointer" data-recipe-index="${t}" data-tip="${w(`Add`)}"></span>
                <span class="recipeRemoveOption icon-trash-empty pointer" data-recipe-index="${t}" data-tip="${w(`Remove`)}"></span>
              </div>
            </div>
            <div class="recipeIngredients ge-recipe-ings">
              ${Object.entries(e).map(([e,n],r)=>`
                    <div class="ge-recipe-ing" data-recipe-index="${t}" data-ingredient-index="${r}">
                      <select class="recipeGoodSelect" data-recipe-index="${t}" data-ingredient-index="${r}">${o.map(t=>`<option value="${t.i}" ${t.i===Number(e)?`selected`:``}>${D(t.name)}</option>`).join(``)}</select>
                      <input class="recipeAmountInput" data-recipe-index="${t}" data-ingredient-index="${r}" type="number" min="1" step="1" value="${n}" />
                      <span class="recipeRemoveIngredient icon-trash-empty pointer" data-recipe-index="${t}" data-ingredient-index="${r}" data-tip="${w(`Remove`)}" />
                    </div>`).join(``)}
            </div>
          </div>
        `).join(``),n.querySelectorAll(`.recipeGoodSelect`).forEach(e=>{e.onchange=()=>{let t=+e.value,n=+e.dataset.recipeIndex,r=+e.dataset.ingredientIndex,i=H[n],a=Number(Object.keys(i)[r]),o=i[a];delete i[a],i[t]=o,p()}}),n.querySelectorAll(`.recipeAmountInput`).forEach(e=>{e.onchange=()=>{let t=+e.dataset.recipeIndex,n=+e.dataset.ingredientIndex,r=H[t],i=Number(Object.keys(r)[n]);r[i]=+e.value}}),n.querySelectorAll(`.recipeAddIngredient`).forEach(e=>{e.onclick=t=>{t.preventDefault();let n=+e.dataset.recipeIndex,i=H[n],a=o.find(e=>!(e.i in i)&&e.i!==r?.i);a&&(i[a.i]=1,p())}}),n.querySelectorAll(`.recipeRemoveIngredient`).forEach(e=>{e.onclick=t=>{t.preventDefault();let n=+e.dataset.recipeIndex,r=+e.dataset.ingredientIndex,i=H[n];if(Object.keys(i).length>1){let e=Number(Object.keys(i)[r]);delete i[e],p()}}}),n.querySelectorAll(`.recipeRemoveOption`).forEach(e=>{e.onclick=t=>{t.preventDefault();let n=+e.dataset.recipeIndex;H.splice(n,1),p()}}),l()};p(),W.querySelectorAll(`.mEdit`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.dim;P(t,z[t]??{},e=>{z[t]=e;let n=O(`mSummary_${t}`);n&&(n.textContent=B(t))})})}),W.querySelector(`.dcEdit`).addEventListener(`click`,()=>{F({...S},e=>{Object.keys(S).forEach(e=>void delete S[e]),Object.assign(S,e);let t=O(`demandCoverageSummary`);t&&(t.textContent=L())})}),W.querySelector(`.bpEdit`).addEventListener(`click`,()=>{I({...A},e=>{Object.keys(A).forEach(e=>void delete A[+e]),Object.assign(A,e);let t=O(`biomeProductionSummary`);t&&(t.textContent=R()),l()})}),k(`newGoodAddRecipe`).addEventListener(`click`,e=>{e.preventDefault(),H.push({[a]:1}),p()}),k(`newGoodDistributionEditor`).addEventListener(`click`,()=>{let t=k(`newGoodDistribution`);e.DistributionEditor.open(e=>{t.textContent=e,l()},t.textContent?.trim()??``)});let h=e=>{U=e,k(`newGoodIconPreview`).setAttribute(`href`,i.href(e))};k(`newGoodIconEdit`).onclick=()=>e.IconPicker.open({current:U,onPick:h});let g=k(`newGoodColor`);g.oninput=()=>{let e=k(`newGoodIconCircle`);e.setAttribute(`fill`,g.value),e.setAttribute(`stroke`,c.getStroke(g.value))};let y=k(`newGoodDevelopment`);y.oninput=()=>{k(`newGoodEra`).textContent=_(+y.value)}}}var j=`1 = ${w(`no effect`)}, 0 = ${w(`fully suppressed`)}`,M={cultureType:w(`Culture type`),culture:w(`Culture`),state:w(`State`),religion:w(`Religion`),biome:w(`Biome`),zone:w(`Zone`)};function N(e,t){return e===`cultureType`?r[t]??t:e===`culture`?pack.cultures[+t]?.name??`Culture ${t}`:e===`state`?pack.states[+t]?.name??`State ${t}`:e===`religion`?pack.religions[+t]?.name??`Religion ${t}`:e===`zone`?pack.zones.find(e=>e.i===+t)?.name??`Zone ${t}`:pack.biomes[+t]?.name??`Biome ${t}`}function P(e,t,n){let i,a;switch(e){case`cultureType`:i=o.map(e=>({id:e,name:r[e]??e})),a=M.cultureType;break;case`culture`:i=pack.cultures.filter(e=>e.i&&!e.removed).map(e=>({id:String(e.i),name:e.name,color:e.color})),a=M.culture;break;case`state`:i=pack.states.filter(e=>e.i&&!e.removed).map(e=>({id:String(e.i),name:e.fullName||e.name,color:e.color})),a=M.state;break;case`religion`:i=pack.religions.filter(e=>e.i&&!e.removed).map(e=>({id:String(e.i),name:e.name,color:e.color})),a=M.religion;break;case`biome`:i=pack.biomes.filter(e=>!e.removed).map(({i:e,name:t,color:n})=>({id:String(e),name:t,color:n})),a=M.biome;break;case`zone`:i=pack.zones.map(e=>({id:String(e.i),name:e.name,color:e.color})),a=M.zone}i.sort((e,t)=>e.name.localeCompare(t.name));let s=i.map(e=>{let n=t[e.id]??1;return`${`<fill-box fill="${e.color||S()}" size="1em" disabled data-tip="${D(e.name)}"></fill-box>`}<span>${D(e.name)}</span><input type="number" class="mPopupInput" data-id="${e.id}" min="0" step="0.1" style="width:5em;" value="${n}" />`}),c=document.createElement(`div`);c.innerHTML=`<div style="max-height:320px; overflow-y:auto; padding:.2em;">${s.length?`<div style="display:grid; grid-template-columns:auto 1fr 5em; gap:.3em .5em; align-items:center;">${s.join(``)}</div>`:`<div style="color:#777; font-style:italic;">${w(`No options available`)}</div>`}</div>`,v.message({id:`goodMultipliers`,message:c,title:w(`{{- dimension}} multipliers`,{dimension:a}),width:`22em`,buttons:[{label:w(`Cancel`)},{label:w(`Apply`),onClick:()=>{let e=Array.from(c.querySelectorAll(`.mPopupInput`)),t={};for(let n of e){let e=n.dataset.id,r=Number(n.value);Number.isFinite(r)&&r>=0&&r!==1&&(t[e]=r)}n(t)}}]})}function F(e,t){let r=s.map(t=>{let r=e[t]??0;return`<span>${l[t]} ${T(n[t])}</span><input type="number" class="dcPopupInput" data-cat="${t}" min="0" step="0.05" style="width:5em;" value="${r}" />`}).join(``),i=document.createElement(`div`);i.innerHTML=`<div style="display:grid;grid-template-columns:1fr 5em;gap:.3em .5em;align-items:center;padding:.2em;">${r}</div>`,v.message({id:`goodDemandCoverage`,message:i,title:w(`Demand Coverage`),width:`18em`,buttons:[{label:w(`Cancel`)},{label:w(`Apply`),onClick:()=>{let e={};i.querySelectorAll(`.dcPopupInput`).forEach(t=>{let n=t.dataset.cat,r=Number(t.value);Number.isFinite(r)&&r>0&&(e[n]=r)}),t(e)}}]})}function I(e,t){let n=pack.biomes.filter(e=>!e.removed).map(({i:t,name:n})=>{let r=e[t]??0;return`<span>${D(n)}</span><input type="number" class="bpPopupInput" data-id="${t}" min="0" step="0.01" style="width:5em;" value="${r}" />`}).join(``),r=document.createElement(`div`);r.innerHTML=`<div style="max-height:320px;overflow-y:auto;padding:.2em;"><div style="display:grid;grid-template-columns:1fr 5em;gap:.3em .5em;align-items:center;">${n}</div></div>`,v.message({id:`goodBiomeProduction`,message:r,title:w(`Biome Baseline Production`),width:`22em`,buttons:[{label:w(`Cancel`)},{label:w(`Apply`),onClick:()=>{let e={};r.querySelectorAll(`.bpPopupInput`).forEach(t=>{let n=Number(t.dataset.id),r=Number(t.value);Number.isFinite(r)&&r>0&&(e[n]=r)}),t(e)}}]})}var L={open:A};export{L as GoodEditor};