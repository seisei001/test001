import{a as e,i as t,r as n,z as r}from"./node-utils-Ds1sVy-v.js";import{t as i}from"./controllers-Dbv1ZRTV.js";import{n as a}from"./goods-generator-DS7hwx2H.js";import{A as o,m as s}from"./options-model-CrstL1Qd.js";import{a as c}from"./prosperity-J_ycIG-E.js";import{t as l}from"./pack-generator-DTsfQ82D.js";import{r as u}from"./units-CYDspnRH.js";import{et as d,lt as f,t as p}from"./layers-DjWzCbYN.js";import{t as m}from"./csv-BoSHm6Vn.js";import{t as h}from"./dialog-BkeQgjla.js";import{_ as g,c as _,s as v,u as y}from"./app-DCKsq5m8.js";import{a as b,i as x,n as S,r as C}from"./table-DPmN0izx.js";import{h as w,u as T}from"./economy-view-C5mGSEYI.js";import{o as E,t as D}from"./tooltips-BVQbACdS.js";import{O,a as k,i as A,m as j}from"./index-sNerCVjG.js";var M=0,N=`marketOverview`,P={my:`right top`,at:`right-10 top+10`,of:`svg`},F=[{key:`icon`,width:`1.8em`,permanent:!0},{key:`good`,label:k(`Good`),width:`8em`,permanent:!0,sortBy:e=>e.good,sortType:`alpha`},{key:`stock`,label:k(`Stock`),width:`6em`,sortBy:e=>e.stock,defaultSort:`desc`},{key:`price`,label:k(`Price`),width:`6em`,sortBy:e=>e.price},{key:`actions`,width:`1.4em`,permanent:!0,hidden:!0}],I=C({dialogId:N,getData:U,onUpdate:G});function L(e){if(s.retry(`goods`),options.app.mode)return;let n=o.get(e);n?(M=e,h.closeAll(`#${N}, .stable`),t(`marketOverviewRelocate`)?.classList.contains(`pressed`)&&K(),R(),I.reset(),z(n),h.open(N,{title:k(`Market Stock: {{- market}}`,{market:o.getName(n)}),width:`auto`,onClose:Y,position:P})):E(A(k(`Invalid market`),k(`The selected market does not exist`)),!0,`error`,5e3)}function R(){h.destroy(N);let e=`<div id="${N}" class="dialog stable editorDialog">
        <div id="marketOverviewNameLine" style="display: flex; align-items: center; margin-bottom: 0.4em">
        <div class="label">${k(`Name`)}:</div>
        <input
          id="marketOverviewName"
          data-tip="${k(`Market name. Clear to reset`)}"
          autocorrect="off"
          spellcheck="false"
          style="width: 11em; margin-left: 0.3em;"
        />
        <span
          id="marketOverviewNameReset"
          data-tip="${k(`Reset to the default name (center burg name)`)}"
          class="icon-ccw pointer"
          style="margin-left: 0.3em"
        ></span>
      </div>
      <div id="marketOverviewInfo" style="margin-bottom: 0.3em"></div>
      ${x({dialogId:N,columns:F})}
      <div id="marketOverviewGoodsBody" class="table" style="max-height:40em"></div>
      <div id="marketOverviewSummary" class="totalLine"></div>
      <div id="marketOverviewBottom">
        <button id="marketOverviewRefresh" data-tip="${k(`Refresh`)}" class="icon-cw"></button>
        <button id="marketOverviewOpenDeals" data-tip="${k(`View market deals`)}" class="icon-list-bullet"></button>
        ${y(`marketOverviewLegend`,k(`Edit free text notes (legend)`))}
        <button
          id="marketOverviewRelocate"
          data-tip="${k(`Relocate the market: click a burg`)}"
          class="icon-map-pin"
        ></button>
        <button id="marketOverviewExport" data-tip="${k(`Save data as a CSV file`)}" class="icon-download"></button>
        ${w(`marketOverviewWiki`)}
      </div>
  </div>`;n(`dialogs`).insertAdjacentHTML(`beforeend`,e),v(N,I.reset),S({dialogId:N,columns:F,onUpdate:()=>h.update(N,{width:`fit-content`,position:P})}),n(`marketOverviewRefresh`).addEventListener(`click`,I.refresh),T(`marketOverviewWiki`),n(`marketOverviewExport`).addEventListener(`click`,J),n(`marketOverviewOpenDeals`).addEventListener(`click`,()=>i.MarketDealsOverview.open(M)),n(`marketOverviewRelocate`).addEventListener(`click`,K),n(`marketOverviewLegend`).addEventListener(`click`,B),n(`marketOverviewGoodsBody`).addEventListener(`click`,e=>{let t=e.target.closest(`.marketGoodPrice`)?.dataset.goodId;t&&i.ComparePrices.open(+t,`#${N}`)}),n(`marketOverviewName`).addEventListener(`input`,V),n(`marketOverviewNameReset`).addEventListener(`click`,H)}function z(e){let t=n(`marketOverviewName`);t.value=e.name||``,t.placeholder=pack.burgs[e.centerBurgId]?.name||`Market ${e.i}`}function B(){i.NotesEditor.open({type:`market`,id:M})}function V(){let e=o.get(M);e&&(o.rename(e.i,this.value),h.update(`marketOverview`,{title:k(`Market Stock: {{- market}}`,{market:o.getName(e)})}))}function H(){let e=o.get(M);e&&(o.rename(e.i,``),n(`marketOverviewName`).value=``,h.update(`marketOverview`,{title:k(`Market Stock: {{- market}}`,{market:o.getName(e)})}))}function U(){let e=o.get(M);if(!e)return E(A(k(`Invalid market`),k(`The selected market does not exist`)),!0,`error`,5e3),[];let t=pack.burgs[e.centerBurgId];if(!t||t.removed)return E(A(k(`Invalid market`),k(`The selected market has no center burg`)),!0,`error`,5e3),[];let n=Object.entries(e.goods).flatMap(([e,t])=>{let n=a.get(+e);return n?[{goodId:+e,good:n.name,stock:t.stock,price:t.price}]:[]});return _(N,n,F)}var W=(e,t)=>A(`${k(`Market price`)}: ${u(e)}`,`${k(`Base good price`)}: ${u(t)}`,k(`Click to compare prices across markets`));function G(e){let t=o.get(M);if(!t)return;let r=e.rows.map(e=>{let t=a.get(e.goodId);return`<div class="states marketGood"
      data-good="${j(t.name)}"
      data-stock="${O(e.stock,2)}"
      data-price="${O(e.price,2)}">
      <svg data-col="icon" data-tip="${k(`Good icon`)}" width="1.6em" height="1.6em" class="goodIcon">
        ${d(t)}
      </svg>
      <div data-col="good" data-tip="${k(`Name`)}" class="goodName">${j(t.name)}</div>
      <div data-col="stock" data-tip="${k(`Good stock`)}" class="marketGoodStock">${O(e.stock,2)}</div>
      <div data-col="price" data-tip="${W(e.price,t.value)}" class="marketGoodPrice pointer" data-good-id="${t.i}">${u(e.price)}</div>
    </div>`});n(`marketOverviewGoodsBody`).innerHTML=r.join(``)||k(`No goods available`);let i=pack.burgs[t.centerBurgId],s=pack.states[i?.state||0],c=`stateCOA${s.i}`;s&&f.trigger(c,s.coa),n(`marketOverviewInfo`).innerHTML=`<svg class="coaIcon" viewBox="0 0 200 200"><use href="#${c}"></use></svg><b>${k(`Owner`)}:</b> ${j(s.fullName||s.name)}`;let l=pack.burgs.filter(e=>e.i&&!e.removed&&pack.cells.market[e.cell]===t.i),p=e.all.reduce((e,t)=>e+t.stock,0);n(`marketOverviewSummary`).innerHTML=`
    <div style="margin-left:5px">${k(`Cells`)}: ${pack.cells.market.reduce((e,n)=>e+ +(n===t.i),0)}</div>
    <div style="margin-left:12px">${k(`Burgs`)}: ${l.length}</div>
    <div data-col="stock" style="margin-left:12px">${k(`Stock`)}: ${O(p,2)}</div>
    <div data-tip="${k(`It buys this much below its prices and sells this much above; a dear market license raises it`)}" style="margin-left:12px">${k(`Market margin`)}: ${O(o.getMarginRate(t)*100,1)}%</div>`,b(n(`marketOverviewSummary`),e,I.goto),h.update(N,{width:`fit-content`,position:P})}function K(){let e=n(`marketOverviewRelocate`);e.classList.toggle(`pressed`),e.classList.contains(`pressed`)?(r(`#viewbox`).style(`cursor`,`crosshair`).on(`click`,q),E(k(`Click on a burg on the map to relocate the market center`),!0)):(D(),g())}function q(t){let n=o.get(M);if(!n)return;let[r,i]=e(t,this),a=l.findCell(r,i);if(a===void 0)return;let s=pack.cells.burg[a],c=pack.burgs[s];!s||!c||c.removed?E(k(`No valid burg in this cell. Click on a cell with a burg`),!1,`error`):s===n.centerBurgId?E(k(`This burg is already a market center`),!1,`error`):pack.markets.some(e=>e.centerBurgId===s)?E(k(`This burg is already a center of another market`),!1,`error`):o.relocateMarket(M,s)&&(K(),p.draw(`markets`),z(n),h.update(`marketOverview`,{title:k(`Market Stock: {{- market}}`,{market:o.getName(n)})}),I.refresh())}function J(){let e=o.get(M);if(!e)return;let t=Object.entries(e.goods).flatMap(([t,n])=>{let r=a.get(Number(t));if(!r)return[];let i=O(c.customerBuyPrice(e,n.price),2),o=O(c.customerSellPrice(e,n.price),2);return[[r.name,O(n.stock,2),i,o]]});m.download(`Market`,[`Good`,`Stock`,`Buy Price`,`Sell Price`],t)}function Y(){n(`marketOverviewRelocate`).classList.contains(`pressed`)&&K(),h.destroy(N),M=0}var X={open:L};export{X as MarketOverview};