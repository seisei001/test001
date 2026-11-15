import{A as e,M as t,O as n,g as r,m as i}from"./options-model-CrstL1Qd.js";import{i as a,n as o,r as s}from"./goods-generator-DS7hwx2H.js";import{i as c,n as l,r as u,t as d}from"./production-generator-BpyiZTFU.js";import{n as f}from"./prosperity-J_ycIG-E.js";import{r as p}from"./units-CYDspnRH.js";import{et as m}from"./layers-DjWzCbYN.js";import{t as h}from"./csv-BoSHm6Vn.js";import{t as g}from"./development-view-ChwbelfH.js";import{t as _}from"./dialog-BkeQgjla.js";import{B as v,C as y,D as b,H as x,L as S,M as ee,N as te,O as ne,P as re,R as C,U as ie,V as ae,f as oe,g as se,h as ce,i as w,p as T,t as le,u as ue,v as de,y as fe}from"./economy-view-C5mGSEYI.js";import{m as pe}from"./zoom-B8oh1YKy.js";import{o as E}from"./tooltips-BVQbACdS.js";import{O as D,a as O,i as k,m as A}from"./index-sNerCVjG.js";import{r as j}from"./node-utils-Ds1sVy-v.js";var M=0,N=`burgEconomyOverview`,P=`burgEconomyDialog`,F={my:`right top`,at:`right-10 top+10`,of:`svg`},I=e=>o.get(e.goodId)?.name??``,L=t=>{let n=e.get(t.marketId);return n?e.getName(n):``};function R(t){if(i.retry(`goods`),options.app.mode)return;let n=pack.burgs[t];!n||n.removed?E(O(`Invalid burg. The selected burg does not exist or was removed.`),!0,`error`,5e3):e.ofBurg(n)?n.production?(M=t,z(),q(),_.open(N,{title:O(`Burg Economy: {{- burg}}`,{burg:n.name}),width:`min(56em, calc(100vw - 20px))`,maxHeight:window.innerHeight-20,resizable:!0,onClose:()=>{M=0,_.destroy(N)},position:F})):E(O(`No production data for this burg.`),!0,`error`,5e3):E(k(O(`No market`),O(`This burg is not connected to any market`)),!0,`error`,5e3)}function z(){_.destroy(N);let e=`<div id="${N}" class="dialog stable ${P}">
      ${T(P)}
      <style>
        #${N} > div { width: auto }
        #${N}Stats { margin-bottom: 0.85em; line-height: 1.6em }
        #${N}Stats > div > span { margin-right: 0.6em }
        #${N}Stats .oneLine { white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
        #${N}Treasury { width: 7em; margin-left: 0.2em }
        #${N}Body { max-height: 35vh }
        #${N} .columns { margin-bottom: 0.6em }
        #${N} .columns h4 { margin-top: 0.3em }
        #${N} .row { line-height: 1.6 }
        #${N} .row.plain .right { font-variant-numeric: tabular-nums }
        #${N} .row.need { grid-template-columns: minmax(0, 8.5em) minmax(1em, 1fr) minmax(7.5em, max-content) 3em; white-space: nowrap }
        #${N} .adjustments .head { grid-template-columns: 1fr 6em; line-height: 1.6 }
        #${N} .adjustments .head > span:last-child { text-align: right; font-variant-numeric: tabular-nums }
        #${N} .productionGood { display: inline-flex; align-items: center; gap: 0.2em; vertical-align: middle }
        #${N} table { width: 100%; table-layout: fixed; border-collapse: collapse; line-height: 1 }
        #${N} thead th { position: sticky; top: 0; background: #eee }
        #${N} tbody tr { border-bottom: 1px solid #f0f0f0 }
        #${N} th, #${N} td { padding: 0.4em 0.5em; vertical-align: top; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
        #${N} .right { text-align: right }
        #${N} tr[data-expandable] { cursor: pointer }
        #${N} .historyDetails td { padding: 0.3em 0.5em 0.8em; line-height: 1.4; white-space: normal }
        #${N} .historyDetails ul { margin: 0.2em 0 0 1.1em; padding: 0 }
        #${N} .typeBadge { margin-left: 4px; border-radius: 3px; padding: 0 0.4em; font-size: 0.8em; font-weight: bold; line-height: 1.35 }
        ${Object.entries(le).map(([e,[t,n]])=>`#${N} .typeBadge.${e} { background: ${t}; color: ${n} }`).join(`
`)}
        #${N} .sources { border-collapse: collapse; margin: 0.3em 0; width: auto; table-layout: auto }
        #${N} .sources td, #${N} .sources th { padding: 0.1em 0.5em; border: 0 }
        #${N} .sources .chosen { font-weight: bold; background: #eef6ee }
      </style>
      <div id="${N}Stats"></div>
      <div id="${N}Body" class="table"></div>
      <div id="${N}Totals" class="totalLine"></div>
      <div id="${N}Bottom">
        <button id="${N}Refresh" data-tip="${O(`Refresh`)}" class="icon-cw"></button>
        <button id="${N}Export" data-tip="${O(`Save data as a CSV file`)}" class="icon-download"></button>
        ${ce(`${N}Wiki`)}
      </div>
  </div>`;j(`dialogs`).insertAdjacentHTML(`beforeend`,e),j(`${N}Refresh`).addEventListener(`click`,q),ue(`${N}Wiki`),j(`${N}Export`).addEventListener(`click`,ke),j(`${N}Body`).addEventListener(`click`,B)}function B(t){let n=t.target,r=n.closest(`[data-zoom-market]`);if(r){let t=pack.burgs[e.get(Number(r.dataset.zoomMarket))?.centerBurgId??0];t?.i&&pe(t.x,t.y,8,2e3);return}let i=n.closest(`tr[data-expandable]`),a=i?.nextElementSibling;i&&a&&(a.hidden=!a.hidden,i.querySelector(`.icon-right-open, .icon-down-open`).className=a.hidden?`icon-right-open`:`icon-down-open`)}function V(){let e=pack.burgs[M];return e?.production?c.get(e.i)?.map(he)??me(e):[]}function me(e){let t=e.production??[],r=pack.deals.filter(([t])=>t===e.i),i=t=>t===pack.cells.good[e.cell],a=([,,,,e,t])=>e*t,s=(e,t)=>a(t)-a(e),c=e=>r.filter(([,,,t])=>t===e).toSorted(s).map(([,t,n,,r,i,a,o,s])=>W(n,t,e,{units:r,price:i,tax:a,tariff:o,carriage:s})),l=new Set([...r.filter(([,,,e])=>e===n.input).map(([,,e])=>e),...t.map(([e])=>e)]),u=e=>{let t=o.get(e)?.recipes??[],n=t.filter(e=>Object.keys(e).every(e=>l.has(+e)));return(n.length?n:t).map(e=>Object.keys(e).map(e=>A(o.get(+e)?.name??``)).join(` ${O(`and`)} `)).join(` / `)};return[...t.filter(([e])=>i(e)).map(([e,t])=>H(e,t)),...c(n.input),...t.filter(([e])=>!i(e)).toSorted((e,t)=>t[1]-e[1]).map(([e,t])=>({...U(e,t),goodTip:O(`Manufacturing from {{- inputs}}`,{inputs:u(e)})})),...c(n.sale),...c(n.kept),...c(n.demand)]}function he(e){if(l(e))return _e(e);if(u(e)){let t=W(e.goodId,e.market,e.kind,e);return e.sources?{...t,details:ye(e.market,e.sources)}:t}let t=`${O(`Workers`)}: ${e.workers}. `;if(!e.recipe.length)return{...H(e.goodId,e.units),details:`${t}${G(e.candidates)}`};let n=e.recipe.map(e=>`${D(e.units,2)} ${K(e.goodId)}`).join(` ${O(`and`)} `),r=e.modifier??1,i=r===1?``:`. ${O(`Production multiplier`)}: x${D(r,2)}`,a=e.specialization?`. ${O(`Division of labor bonus`)}: x${e.specialization}`:``;return{...U(e.goodId,e.units),details:`${t}${O(`Manufacturing from {{- inputs}}`,{inputs:n})}${i}${a}${G(e.candidates)}`}}var H=(e,t)=>({type:`LOCAL`,goodId:e,units:t,tax:0,tariff:0,carriage:0,details:``}),U=(e,t)=>({type:`MFG`,goodId:e,units:t,tax:0,tariff:0,carriage:0,details:``});function W(e,t,r,i){if(r===n.kept)return ge(e,i.units,i.units*i.price);let a=r===n.sale,{units:o}=i,{goodsPrice:s,carriage:c,tax:l,tariff:u,value:d,formula:f}=S(i,a);return{type:a?`SELL`:`BUY`,goodId:e,units:o,kind:r,price:s,marketId:t,tax:l,tariff:u,carriage:c,income:a?d:-d,formula:f,details:``}}var ge=(e,t,r=0)=>({type:`KEEP`,goodId:e,units:t,kind:n.kept,tax:0,tariff:0,carriage:0,...r&&{income:-r},details:``});function G(e){if(!e.length)return``;let t=e=>`<b class="positive">${O(`score {{score}}`,{score:D(e,2)})}</b>`,n=e.toSorted((e,t)=>t.score-e.score).map(e=>{let n=o.get(e.goodId)?.name??``,r=e.ingredients.map(t=>`${D(t.amount*e.units,2)} ${K(t.goodId)}`).join(`, `),i=e.isPreparation?` (${O(`prep for {{- good}}`,{good:K(e.goalGoodId??-1)})})`:``,a=D(e.workersNeeded||1,2),s=e.isPreparation?`${O(`goal sell`)} ${p((e.gainPerWorker||0)*a)} ÷ ${O(`workers`)} ${a} × ${O(`units`)} ${D(e.units,2)}`:`${O(`sell`)} ${p(e.sellPrice)} - ${O(`cost`)} ${p(e.ingredientCost)}`,c=r?` ${O(`Ingredients`)}: ${r}`:` ${O(`Gathered from the deposit`)}`;return`<li><b>${A(n)}</b>${i}: ${s} = ${t(e.score)}.${c}</li>`}),r=O(`highest score among feasible options ({{options}})`,{options:e.length});return`<div><b>${O(`Decision basis`)}:</b> ${r}:</div><ul>${n.join(``)}</ul>`}function K(e){let t=o.get(e);return t?`<svg width="14" height="14" style="margin: -6px 2px -4px 0">${m(t)}</svg>`:``}function q(){let e=pack.burgs[M];if(!e||e.removed)return;Ee(e);let t=x(),n=V(),r=n.some(e=>e.details),i=n.map(e=>be(e,r));Ce(n),j(`${N}Body`).innerHTML=i.length?`<table>
        <colgroup>
          ${r?`<col style="width: 2%" />`:``}
          <col style="width: ${r?22:24}%" />
          <col style="width: 13%" />
          <col style="width: 13%" />
          <col style="width: 10%" />
          <col style="width: 9%" />
          <col style="width: 9%" />
          <col style="width: 8%" />
          <col style="width: 12%" />
        </colgroup>
        <thead>
          <tr>
            ${r?`<th></th>`:``}
            <th>${O(`Good`)}</th>
            <th>${O(`Market`)}</th>
            <th class="right" data-tip="${t.net}">${O(`Net`)}</th>
            <th class="right" data-tip="${t.carriage}">${O(`Carriage`)}</th>
            <th class="right" data-tip="${t.tax}">${O(`Tax`)}</th>
            <th class="right" data-tip="${t.tariff}">${O(`Tariff`)}</th>
            <th class="right" data-tip="${t.units}">${O(`Units`)}</th>
            <th class="right" data-tip="${t.income}">${O(`Revenue`)}</th>
          </tr>
        </thead>
        <tbody>${i.join(``)}</tbody>
      </table>`:`<i>${O(`No production actions recorded`)}</i>`}var _e=({category:e,shortage:n,options:r})=>{let i=a[e];return{type:`NEED`,goodId:-1,units:n,tax:0,tariff:0,carriage:0,label:`${s[i]} ${t[i]}`,details:ve(r)}},J=t=>{let n=e.get(t);return n?e.getName(n):`—`};function ve(e){if(!e.length)return`<i>${O(`No good that covers it is for sale anywhere`)}</i>`;let t=pack.cells.market[pack.burgs[M]?.cell],n=e.slice(0,10).map(({goodId:e,coverage:n,costPerCoverage:r,market:i,kept:a})=>{let s=a?O(`kept from its own sales`):i===t?O(`from its own market`):O(`from {{- market}}`,{market:J(i)}),c=n===1?``:` (${O(`{{coverage}} per unit`,{coverage:D(n,2)})})`;return`<li>${K(e)}${A(o.get(e)?.name??``)}: ${p(r)} ${O(`per covered need`)}${c}, ${s}</li>`}),r=e.length>10?`<li>${O(`and {{count}} more`,{count:e.length-10})}</li>`:``;return`<div>${O(`Goods that could cover the need`)}:</div><ul>${n.join(``)}${r}</ul>`}function ye(e,t){let n=pack.cells.market[pack.burgs[M]?.cell],r=O(e===n?`Bought at its own market`:`Bought from the cheapest other market`),i=t.filter(e=>!e.excluded),a=i.slice(0,6),o=i.find(t=>t.market===e);o&&!a.includes(o)&&a.push(o);let s=e=>{let t=A(J(e));return e===n?`${t} (${O(`own`)})`:t},c=a.map(t=>`<tr${t.market===e?` class="chosen"`:``}>
      <td>${s(t.market)}</td>
      <td class="right">${t.stock}</td>
      <td class="right">${p(t.price)}</td>
      <td class="right">${p(t.tax)}</td>
      <td class="right">${C(t.tariff,t.isImport)}</td>
      <td class="right">${p(t.carriage)}</td>
      <td class="right">${p(t.buyPrice)}</td>
    </tr>`),l=e=>t.filter(t=>t.excluded===e).length,[u,d,f]=[l(`stock`),l(`route`),l(`embargo`)],m=[u&&O(`{{count}} have none`,{count:u}),d&&O(`{{count}} have no route to the burg`,{count:d}),f&&O(`{{count}} are under embargo`,{count:f})].filter(Boolean);return`<div>${r}.</div>
    <table class="sources">
      <thead><tr><th>${O(`Market`)}</th><th class="right">${O(`Stock`)}</th><th class="right">${O(`Price`)}</th><th class="right">${O(`Tax`)}</th><th class="right">${O(`Tariff`)}</th><th class="right">${O(`Carriage`)}</th><th class="right">${O(`At the door`)}</th></tr></thead>
      <tbody>${c.join(``)}</tbody>
    </table>
    ${m.length?`<div>${O(`Other markets`)}: ${m.join(`, `)}</div>`:``}`}var Y={LOCAL:()=>O(`Local`).toUpperCase(),BUY:()=>O(`BUY`),MFG:()=>O(`MFG`),SELL:()=>O(`sell`).toUpperCase(),KEEP:()=>O(`Keep`).toUpperCase(),NEED:()=>O(`Need`).toUpperCase()};function be(e,t){if(e.label)return xe(e,t);let r=o.get(e.goodId);if(!r)return``;let i=[O(`Sale to local market`),O(`Purchase for production`),O(`Purchase for demand`),O(`Produced locally and kept to cover the burg's demand`)],a=e.kind===void 0?e.type===`MFG`?O(`Manufacturing step`):O(`Gathered from the burg's deposit by its workers`):i[e.kind],s=e.kind===n.demand||e.kind===n.kept?Se(r,e.units):``,c=s?k(a,O(`Covers demand: {{- demand}}`,{demand:s})):a,l=`<span class="typeBadge ${e.type.toLowerCase()}">${Y[e.type]()}</span>`,u=e.type===`SELL`,d=e.price!==void 0,f=e.income===void 0?``:p(e.income),m=d?X(e):void 0,h=m&&ae({...Te(e),good:r,...m}),g=(e,t)=>`<td class="right"${t?` data-tip="${t}"`:``}>${e}</td>`;return`<tr${e.details?` data-expandable`:``}>
      ${t?`<td>${e.details?`<span class="icon-right-open"></span>`:``}</td>`:``}
      <td data-tip="${e.goodTip??c}">${K(e.goodId)}${A(r.name)}${l}</td>
      <td>${we(e)}</td>
      ${g(d?b(e.price,u):``,h?.net)}
      ${g(d?b(e.carriage,!1)||p(0):``,h?.carriage)}
      ${g(b(e.tax,!1),h?.tax)}
      ${g(m?C(e.tariff,m.isImport):``,h?.tariff)}
      ${g(String(D(e.units,2)),h?.units)}
      <td class="right ${v(e.income??0)}" data-tip="${h?.income??``}">${f}</td>
    </tr>${e.details?`<tr class="historyDetails" hidden><td></td><td colspan="8">${e.details}</td></tr>`:``}`}function xe(e,t){let n=O(`A need the burg covered. Expand for options`),r=`<span class="typeBadge ${e.type.toLowerCase()}">${Y[e.type]()}</span>`;return`<tr${e.details?` data-expandable`:``}>
      ${t?`<td>${e.details?`<span class="icon-right-open"></span>`:``}</td>`:``}
      <td data-tip="${n}">${e.label}${r}</td>
      <td></td><td></td><td></td><td></td><td></td>
      <td class="right">${D(e.units,2)}</td>
      <td></td>
    </tr>${e.details?`<tr class="historyDetails" hidden><td></td><td colspan="8">${e.details}</td></tr>`:``}`}function Se(e,n){return a.flatMap(r=>{let i=e.demandCoverage?.[r]||0;return i?`${s[r]} ${t[r]} ${D(n*i,2)}`:[]}).join(`, `)}function Ce(e){let t=t=>e.reduce((e,n)=>e+t(n),0),n=-t(e=>e.type===`BUY`?e.income??0:0),r=t(e=>e.type===`SELL`||e.type===`KEEP`?e.income??0:0),i=r-n,a=(e,t,n)=>`<div style="margin-left: 12px" data-tip="${t}">${e}: ${n}</div>`;j(`${N}Totals`).innerHTML=[a(O(`Purchases`),O(`Paid for goods bought, carriage and taxes included`),b(n,!1)||p(0)),a(O(`Sales`),O(`Got for goods sold, carriage and sales tax taken off`),b(r,!0)||p(0)),a(O(`Carriage`),O(`Carriage paid in all`),p(D(t(e=>e.carriage*e.units),2))),a(O(`Tax`),O(`Sales tax paid in all`),p(D(t(e=>e.tax*e.units),2))),a(O(`Tariff`),O(`Import tariffs paid in all`),p(D(t(e=>e.tariff*e.units),2))),a(O(`Revenue`),x().income,`<span class="${v(i)}">${p(D(i,2))}</span>`)].join(``)}function we(t){let{marketId:n}=t,r=e.get(n);if(!r)return``;let i=e.getName(r),{decimas:a,isImport:o}=X(t),s=oe(a);return`<span class="pointer" data-zoom-market="${n}" data-tip="${o?k(O(`Import from {{market}}`,{market:i}),s,O(`Click to zoom`)):k(s,O(`Click to zoom`))}">${A(i)}</span>`}var X=({goodId:e,marketId:t=0,kind:r=n.sale,carriage:i,tariff:a})=>y(M,t,e,r,i,a),Te=({units:e,price:t,carriage:n,tax:r,tariff:i,formula:a})=>({units:e,net:t??0,carriage:n,tax:r,tariff:i,formula:a??``});function Ee(t){let n=t.population||0,i=d.getTurnOrder(pack.burgs.filter(e=>e.i&&!e.removed)),a=e.ofBurg(t),o=f.getConsumption(t.i),{covered:s,targets:l}=de(t),u=f.getBurg(t.i),m=Math.max(0,t.product||0),h=n>0?m/n:0,{scale:_,urbanization:v}=options.map.units.population,y=D(n*_*v.rate),b=pack.cells.development[t.cell];j(`${N}Stats`).innerHTML=`
    <div>
      <span><b>${O(`Population`)}:</b> ${y}</span>
      <span data-tip="${g(b)}"><b>${O(`Development`)}:</b> ${b}</span>
      ${c.get(t.i)?`<span><b>${O(`Order`)}:</b> ${O(`{{rank}} of {{total}}`,{rank:i.indexOf(t)+1,total:i.length})}</span>`:``}
      <span><b>${O(`Market`)}:</b> ${a?A(e.getName(a)):``}</span>
      <span data-tip="${w.product()}"><b>${O(`Product`)}:</b> <span class="positive">${p(m)}</span></span>
      <span data-tip="${w.wealth()}"><b>${O(`Wealth`)}:</b> <span class="positive">${p(h)}</span></span>
    </div>
    <div data-tip="${O(`Production: goods the burg made today, units a day`)}"><b>${O(`Production`)}:</b> ${$(t.production??[])||O(`None`)}</div>
    <div data-tip="${O(`Consumption: goods the people bought or kept`)}"><b>${O(`Consumption`)}:</b> ${$(o.flatMap((e,t)=>e?[[t,e]]:[]))||O(`None`)}</div>
    ${u?`<div class="oneLine" data-tip="${ee(u.prosperity)}"><b>${O(`Prosperity`)}:</b> ${te(u.prosperity)}, ${re(u)}</div>`:``}
    <div class="columns">
      <div>${De(t)}</div>
      ${Oe(s,l)}
    </div>`,ne(j(`${N}Adjustments`),t.adjustments??[],k(w.burgAdjustments(),O(`They take effect when production is regenerated`)),e=>r.setAdjustments(t.i,e),Z)}var Z=e=>{let t=D(e,2);return t>0?`+${t}`:t<0?`−${-t}`:`0`};function De(t){let n=e.ofBurg(t),r=n?.centerBurgId===t.i,{ingredients:i,sales:a,consumption:o,pollTax:s,license:c,margin:l}=se(t,fe()),u=t.treasury||0,d=(e,t,n,r=n!==0)=>r?`<div class="row plain" data-tip="${t}"><span class="name">${e}</span><span class="right ${n?v(n):``}">${Z(n)}</span></div>`:``,f=r?k(w.treasury(),O(`As its market's center, it also takes the market margin`)):w.treasury();return`<h4><span>${O(`Revenue and expenses`)}</span><span>🟡</span></h4>
    ${d(O(`Ingredients`),O(`Paid for goods bought to make others`),i)}
    ${d(O(`Sales`),O(`Got for goods sold, carriage and sales tax taken off`),a,!0)}
    ${d(O(`Consumption`),O(`Paid for goods the people bought`),o)}
    ${d(O(`Poll Tax`),O(`Poll tax: {{rate}} a head`,{rate:pack.states[t.state||0]?.economy.pollTax||0}),s)}
    ${d(O(`Market License`),O(`The license its state charges a market's center a day`),c)}
    ${r?d(O(`Market Margin`),O(`Market margin: {{rate}}% of every trade at its market`,{rate:D(e.getMarginRate(n)*100,1)}),l,!0):``}
    <div id="${N}Adjustments"></div>
    <div class="total">${d(O(`Day Balance`),f,u,!0)}</div>`}function Oe(e,n){let r=a.map((r,i)=>{let a=D(n[i]||0,2),o=D(Math.min(e[i]||0,a),2),c=D(Math.max(0,(e[i]||0)-a),2),l=a?o/a:1,u=`${t[r]}: ${O(`{{covered}} of {{target}} needed`,{covered:o,target:a})}${c?`, ${O(`{{wants}} more as wants`,{wants:c})}`:``}`,d=l>=1?`#6a9a3a`:`#d98a32`,f=`<div class="bar"><div style="width: ${l*100}%; background: ${d}"></div></div>`;return`<div class="row need" data-tip="${u}">
        <span class="name">${s[r]} ${t[r]}</span>
        ${f}
        <span class="right ${l<1?`negative`:``}">${o} / ${a}</span>
        <span class="right positive">${c?`+${c}`:``}</span>
      </div>`});return`<div>
      <h4 class="row need" data-tip="${O(`Demand: needs covered, plus wants`)}">
        <span>${O(`Demands`)}</span><span></span>
        <span class="right muted">${O(`covered / needed`)}</span>
        <span class="right muted" data-tip="${O(`Bought beyond the need: wants raise prosperity`)}">${O(`wants`)}</span>
      </h4>
      ${r.join(``)}
    </div>`}var Q=8;function $(e){let t=e.flatMap(([e,t])=>{let n=o.get(e);return n?[{good:n,amount:D(t,2)}]:[]}).sort((e,t)=>t.amount*t.good.value-e.amount*e.good.value),n=({good:e,amount:t})=>O(`{{good}}: {{amount}} {{unit}} per day`,{good:e.name,amount:t,unit:ie(t,e.unit)}),r=t.slice(0,Q).map(e=>`<span class="productionGood" data-tip="${n(e)}"><svg width="1.6em" height="1.6em">${m(e.good)}</svg>${e.amount}</span>`).join(` `),i=t.slice(Q);return i.length?`${r} +${O(`{{count}} more`,{count:i.length})}`:r}function ke(){let e=e=>D(e,2)?D(e,2):``,t=V().map(t=>[I(t),t.type,L(t),t.price===void 0?``:D(t.price,2),e(t.carriage),e(t.tax),e(t.tariff),D(t.units,2),t.income===void 0?``:D(t.income,2)]),n=pack.burgs[M]?.name??M;h.download(`Production_${n}`,[`Good`,`Type`,`Market`,`Net Unit Price`,`Carriage`,`Tax`,`Tariff`,`Units`,`Revenue`],t)}var Ae={open:R};export{Ae as BurgEconomyOverview};