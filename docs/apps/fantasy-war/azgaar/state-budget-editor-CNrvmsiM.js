import{i as e,r as t}from"./node-utils-Ds1sVy-v.js";import{t as n}from"./controllers-Dbv1ZRTV.js";import{c as r,i,l as a}from"./prosperity-J_ycIG-E.js";import{Lt as o,P as s}from"./options-model-CrstL1Qd.js";import{r as c,t as l,u}from"./military-generator-CVth4JoO.js";import{n as d}from"./goods-generator-DS7hwx2H.js";import{r as f}from"./units-CYDspnRH.js";import{et as p,st as m}from"./layers-DjWzCbYN.js";import{S as h}from"./app-DCKsq5m8.js";import{t as g}from"./dialog-BkeQgjla.js";import{n as _}from"./limitation-picker-C6HWXSdg.js";import{B as v,O as y,d as b,h as x,i as S,u as C}from"./economy-view-C5mGSEYI.js";import{O as w,T,a as E,i as D,m as O}from"./index-sNerCVjG.js";var k=`
  #stateBudgetForm { width: auto; max-height: 70vh; overflow: auto; margin: 0.2em 0 0.4em }
  #stateBudgetForm table { width: 100%; border-collapse: collapse; table-layout: fixed }
  #stateBudgetForm td, #stateBudgetForm th { padding: 0.15em 0; vertical-align: middle; overflow: hidden; text-overflow: ellipsis; white-space: nowrap }
  #stateBudgetForm th { text-align: left; border-bottom: 1px solid var(--dark-solid); padding-top: 0.7em }
  #stateBudgetForm tbody:first-child th { padding-top: 0 }
  #stateBudgetForm th.actions, #stateBudgetForm td.amount { text-align: right }
  #stateBudgetForm td.amount { font-variant-numeric: tabular-nums }
  #stateBudgetForm td.amount input { width: 100%; text-align: right }
  #stateBudgetForm input[type="number"] { width: 4em; margin: 0 }
  #stateBudgetForm button { font-size: 0.9em; padding: 0 0.4em; }
  #stateBudgetForm button::before { margin-right: 0.2em; }
  #stateBudgetForm .muted { color: #666 }
  #stateBudgetForm tr.total td { font-weight: bold; border-top: 1px solid #ccc }
  #stateBudgetForm tr.minor td { color: #666; }
  #stateBudgetForm input[type="range"] { appearance: none; width: 100%; height: 0.7em; margin: 0; padding: 0; border: 0; border-radius: 2px; vertical-align: middle }
  #stateBudgetForm input[type="range"]::-webkit-slider-thumb { appearance: none; width: 0.6em; height: 1.2em; border-radius: 2px; background: var(--light-solid); border: 1px solid var(--dark-solid); cursor: pointer }
  #stateBudgetForm input[type="range"]::-moz-range-thumb { width: 0.5em; height: 1.1em; border-radius: 2px; background: var(--light-solid); border: 1px solid var(--dark-solid); cursor: pointer }
  #stateBudgetForm input[type="range"]::-moz-range-track { background: transparent }
  #stateBudgetForm select { width: 100%; margin: 0 }
  #stateBudgetForm .scroll { max-height: 13em; overflow-y: auto }
  #stateBudgetForm .pick { width: 100%; white-space: nowrap; overflow: hidden; padding: 0 0.2em }
  #stateBudgetForm .pick svg { vertical-align: middle; margin: -0.2em 0 }
  #stateBudgetForm tr.columns th { border: 0; padding: 0.3em 0 0; font-weight: normal; color: #666 }
  #stateBudgetForm #stateTariffRules td { padding: 0.1em 0.2em 0.1em 0 }
  #stateBudgetForm #stateTariffRules input.rate { width: 3.2em }
`,A=`stateBudgetEditor`,j=0,M,N;function P(e,t){let n=pack.states[e];e&&n&&!n.removed&&(j=e,M=t,F(),I(),L(),g.open(A,{title:E(`Budget: {{- state}}`,{state:n.name}),width:`32em`,position:{my:`center`,at:`center`,of:`svg`},footer:x(`stateTaxesWiki`),buttons:[{label:E(`Apply`),tip:E(`Set the changes`),onClick:R},{label:E(`Close`),onClick:()=>g.close(A)}],onClose:z}),C(`stateTaxesWiki`))}function F(){g.destroy(A),t(`dialogs`).insertAdjacentHTML(`beforeend`,`<div id="${A}" class="dialog"><style>${k}</style><div id="stateBudgetForm"></div></div>`)}function I(){let e=t(`stateBudgetForm`);e.addEventListener(`input`,Y),e.addEventListener(`change`,X),e.addEventListener(`click`,Z)}function L(){g.close(`limitationPicker`);let e=pack.states[j],n=u.getBudget(j);N={budget:{...e.economy.budget},rules:Q(e.economy.tariffs),adjustments:[...e.economy.adjustments],collected:n.salesTax+n.tariffs+n.pollTax+n.marketFees},t(`stateBudgetForm`).innerHTML=V(e),y(t(`stateAdjustments`),N.adjustments,S.adjustments(),e=>{N.adjustments=e,H()}),H(),U(),q()}function R(){let r=pack.states[j],i=e=>t(e).valueAsNumber,a=T(i(`stateSalesTax`)/100,0,1),o=Math.max(0,i(`statePollTax`)),s=Math.max(0,i(`stateMarketFee`));c.setTaxes(j,Number.isFinite(a)?a:r.economy.salesTax,Number.isFinite(o)?o:r.economy.pollTax),Number.isFinite(s)&&c.setMarketFee(j,s);let{corruption:l,...u}=N.budget;c.setCorruption(j,l),c.setBudget(j,u),c.setTariffs(j,N.rules),c.setAdjustments(j,N.adjustments),e(`statesEditor`)&&n.StatesEditor.refresh(),M?.(),L(),h.openEconomyRegeneration([`production`])}function z(){g.destroy(`limitationPicker`),g.destroy(A),j=0,M=void 0,N=null}var B=(e,t=``,n=``,r=``)=>`<td ${r?`id="${r}"`:``} class="amount ${t}" data-tip="${n}">${f(e)}</td>`;function V(e){let{salesTax:t,tariffs:n,pollTax:o,pollTaxOwed:c,marketFees:d,markets:f,corruption:p}=u.getBudget(e.i),{budget:m}=e.economy,h=(e,t,n=1,r=100)=>`<td><input id="${e}" type="number" min="0" max="${r}" step="${n}" value="${t}"/>%</td>`,g=(e,t,n,r,i)=>`<tr class="${e===`corruption`?`minor`:``}"><td data-tip="${n}">${t}</td>
      <td><input class="share" data-key="${e}" type="range" min="0" max="100" step="1" value="${r}"/></td>
      <td><input class="share" data-key="${e}" type="number" min="0" max="100" step="1" value="${r}"/>%</td>${i}</tr>`,_=(e,t,n)=>`<tr><td colspan="3" data-tip="${n}">${e}</td><td class="amount" data-tip="${n}">${t}</td></tr>`,y=e=>`${w(e*100)}%`,b=w(r.ofState(e,e.economy.collected)),x=w(r.getStateTendency(e));return`<table><colgroup><col style="width: 8.5em"/><col/><col style="width: 5.2em"/><col style="width: 6.5em"/></colgroup>
      <tbody>
        <tr><th colspan="4" data-tip="${E(`State taxes. Changes apply on regeneration`)}">${E(`Revenue`)}</th></tr>
        <tr><td>${E(`Sales Tax`)}</td><td></td>${h(`stateSalesTax`,w(e.economy.salesTax*100,2),.5)}${B(t,`positive`)}</tr>
        <tr><td>${E(`Poll Tax`)}</td><td></td><td><input id="statePollTax" type="number" min="0" max="10" step="0.01" value="${e.economy.pollTax}"/></td>${B(o,`positive`,c?S.collected(o,c):``)}</tr>
        <tr><td data-tip="${E(`Paid a day by each market centered in the state, from its margin`)}">${E(`Market License`)}</td><td class="muted">${E(`Markets: {{markets}}`,{markets:f})}</td><td><input id="stateMarketFee" type="number" min="0" step="1" value="${e.economy.marketFee||0}"/></td>${B(d,`positive`)}</tr>
        <tr><td>${E(`Import Tariffs`)}</td><td></td><td></td>${B(n,`positive`)}</tr>
        <tr><td colspan="4" id="stateAdjustments"></td></tr>
        <tr class="total"><td colspan="3">${E(`Collected`)}</td>${B(t+n+o+d,``,``,`stateCollected`)}</tr>
      </tbody>
      <tbody id="stateBudget">
        <tr><th colspan="3" data-tip="${S.budget()}">${E(`Expenses`)}</th><th class="actions"><button id="stateBudgetReset" type="button" class="icon-arrows-cw" data-tip="${E(`Reset the budget to the state's defaults`)}">${E(`Reset`)}</button></th></tr>
        ${a.map(t=>g(t,s[t],S.expenseTip(t),m[t],B(-e.economy.spent[t],`negative`))).join(``)}
        <tr class="total"><td data-tip="${S.stateTreasury()}">${E(`Day Balance`)}</td><td></td><td id="stateBudgetBalance"></td>${B(e.economy.treasury,v(e.economy.treasury),S.stateTreasury())}</tr>
        ${g(`corruption`,E(`Corruption`),S.corruption(),m.corruption,B(-p,`negative`))}
      </tbody>
      <tbody>
        <tr><th colspan="4" data-tip="${E(`What the state's expenses achieved in the last run`)}">${E(`Effects`)}</th></tr>
        ${_(E(`Army upkeep`),y(l.getUpkeep(e.i)),S.upkeep())}
        ${_(E(`Corruption curbed`),`${x}% → ${b}%`,S.expenseTip(`administration`))}
        ${_(E(`Infrastructure served`),y(i.getProvision(e,`infrastructure`)),S.expenseTip(`infrastructure`))}
        ${_(E(`Court and clergy served`),y(i.getProvision(e,`court`)),S.expenseTip(`court`))}
      </tbody>
    </table>
    <table>${W}
      <tbody>
        <tr><th colspan="2" data-tip="${E(`Specific rules override general ones`)}">${E(`Tariffs and Embargoes`)}</th><th class="actions" colspan="3"><button id="stateTariffReset" type="button" class="icon-arrows-cw" data-tip="${E(`Reset tariffs based on current diplomatic relations`)}">${E(`Reset`)}</button> <button id="stateTariffAdd" type="button" class="icon-plus" data-tip="${E(`Add tariff or embargo rule`)}">${E(`Add`)}</button></th></tr>
        <tr class="columns"><th>${E(`States`)}</th><th>${E(`Goods`)}</th><th>${E(`Policy`)}</th><th>${E(`Rate`)}</th><th></th></tr>
      </tbody>
    </table>
    <div class="scroll"><table>${W}<tbody id="stateTariffRules"></tbody></table></div>`}function H(){t(`stateCollected`).innerHTML=f(N.collected+o(N.adjustments,e=>e.value))}function U(){let{economy:e}=pack.states[j],n=e.budget.corruption,i=n?r.ofState(pack.states[j],e.collected)/n:1;for(let e of t(`stateBudget`).querySelectorAll(`input.share`)){let t=e.dataset.key;e.value=String(N.budget[t]),e.type===`range`&&(e.style.background=b(N.budget[t],t===`corruption`?100:N.budget.corruption*i))}let s=100-o(a.map(e=>N.budget[e]));t(`stateBudgetBalance`).innerHTML=`<span class="${v(s)}">${s}%</span>`}var W=`<colgroup><col/><col/><col style="width: 6em"/><col style="width: 4.6em"/><col style="width: 1.2em"/></colgroup>`,G=4;function K(e,t){let n=t=>(e===`states`?pack.states[t]?.name:d.get(t)?.name)||String(t),r=t=>{if(e===`states`)return m(t);let n=d.get(t);return n?`<svg width="1.2em" height="1.2em">${p(n)}</svg>`:``},i=!Array.isArray(t),a=i?E(`All`):t.map(n).join(`, `)||E(`None`),o=i?E(`All`):t.slice(0,G).map(r).join(``)+(t.length>G?` +${t.length-G}`:``);return`<button type="button" class="pick ${e}" data-tip="${D(O(a),E(`Click to select`))}">${o||E(`None`)}</button>`}function q(){t(`stateTariffRules`).innerHTML=N.rules.map((e,t)=>{let n=e.rate===`embargo`,r=w((e.rate===`embargo`?.1:e.rate)*100,2);return`<tr data-index="${t}">
          <td>${K(`states`,e.states)}</td>
          <td>${K(`goods`,e.goods)}</td>
          <td><select class="policy"><option value="tariff" ${n?``:`selected`}>${E(`Tariff`)}</option><option value="embargo" ${n?`selected`:``}>${E(`Embargo`)}</option></select></td>
          <td>${n?``:`<input class="rate" type="number" min="0" max="1000" step="1" value="${r}" data-tip="${E(`Import tariff rate`)}"/>%`}</td>
          <td><span class="icon-trash-empty pointer remove" data-tip="${E(`Remove rule`)}"></span></td></tr>`}).join(``)||`<tr><td colspan="5" class="muted"><i>${E(`None`)}</i></td></tr>`}var J=e=>e.closest(`#stateTariffRules tr[data-index]`);function Y(e){let t=e.target;t.matches(`#stateBudget input.share`)&&(N.budget[t.dataset.key]=T(Math.round(t.valueAsNumber||0),0,100),U())}function X(e){let t=J(e.target),n=t&&N.rules[+t.dataset.index];if(!n)return;let r=t.querySelector(`input.rate`)?.valueAsNumber;n.rate=t.querySelector(`select.policy`).value===`embargo`?`embargo`:T(Number.isFinite(r)?w(r/100,4):.1,0,10),q()}function Z(e){let t=e.target,n=pack.states[j];if(t.closest(`#stateBudgetReset`))N.budget={...c.defineExpenses(n),corruption:c.defineCorruption(n)},U();else if(t.closest(`#stateTariffAdd`))N.rules.push({states:`all`,goods:`all`,rate:.1}),q();else if(t.closest(`#stateTariffReset`))g.close(`limitationPicker`),N.rules=Q(c.defineTariffs(n)),q();else{let e=J(t),n=e&&N.rules[+e.dataset.index];if(!n)return;t.classList.contains(`remove`)?(g.close(`limitationPicker`),N.rules.splice(+e.dataset.index,1),q()):t.classList.contains(`states`)?ee(n):t.classList.contains(`goods`)&&te(n)}}var Q=e=>(e??[]).map(e=>({...e,states:$(e.states),goods:$(e.goods)})),$=e=>Array.isArray(e)?[...e]:`all`;function ee(e){_({title:E(`Select States`),heading:E(`States`),items:pack.states.filter(e=>e.i!==j),allowed:Array.isArray(e.states)?e.states:[],badge:e=>`<span style="color:${O(e.color??``)}">⬤</span>${m(e.i)}`,onApply:t=>{e.states=t.length?t:`all`,q()}})}function te(e){_({title:E(`Select Goods`),heading:E(`Goods`),items:options.map.goods,allowed:Array.isArray(e.goods)?e.goods:[],badge:e=>`<svg width="1.4em" height="1.4em" style="vertical-align: middle">${p(e)}</svg>`,onApply:t=>{e.goods=t.length?t:`all`,q()}})}var ne={open:P};export{ne as StateBudgetEditor};