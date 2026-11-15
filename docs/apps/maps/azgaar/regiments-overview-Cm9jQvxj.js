import{a as e,i as t,r as n,z as r}from"./node-utils-Ds1sVy-v.js";import{t as i}from"./controllers-Dbv1ZRTV.js";import{t as a}from"./pack-generator-DTsfQ82D.js";import{C as o,Lt as s,m as c}from"./options-model-CrstL1Qd.js";import{t as l}from"./military-generator-CVth4JoO.js";import{F as u,t as d}from"./layers-DjWzCbYN.js";import{t as f}from"./csv-BoSHm6Vn.js";import{S as p,_ as m,c as h,s as g}from"./app-DCKsq5m8.js";import{t as _}from"./dialog-BkeQgjla.js";import{t as v}from"./state-B2hBYDzv.js";import{a as y,i as b,n as x,r as S}from"./table-DPmN0izx.js";import{o as C,t as w}from"./tooltips-BVQbACdS.js";import{c as T,s as E,y as D}from"./notices-6lBE5Kkn.js";import{a as O,f as k,i as A,k as j}from"./index-sNerCVjG.js";var M=`regimentsOverview`,N={my:`right top`,at:`right-10 top+10`,of:`svg`},P,F=[],I=S({dialogId:M,getData:H,onUpdate:W});function L(e){options.app.mode||(P=v.get(M,`filters`,()=>({stateId:-1,search:``})),P.search??=``,P.stateId??=-1,_.closeAll(`.stable`),d.show(`military`),e!==void 0&&(P.stateId=e),R(),K(),I.reset(),_.open(`regimentsOverview`,{title:O(`Regiments Overview`),width:`fit-content`,onClose:z,position:N}))}function R(){F=V(),_.destroy(`regimentsOverview`);let e=`<div id="${M}" class="dialog stable editorDialog">
      <div id="regimentsBody" class="table" data-type="absolute">
        ${b({dialogId:M,columns:F})}
      </div>
      <div id="regimentsFilters" class="editorFilters">
        <label for="regimentsSearch" data-tip="${O(`Filter by name, state, or tag`)}">
          ${O(`Search`)}: <input id="regimentsSearch" type="search" />
        </label>
        <label for="regimentsFilter" data-tip="${O(`Select state`)}">
          ${O(`State`)}: <select id="regimentsFilter"></select>
        </label>
      </div>
      <div id="regimentsFooter" class="totalLine"></div>
      <div id="regimentsBottom" class="editorToolbar">
        <button id="regimentsOverviewRefresh" data-tip="${O(`Refresh`)}" class="icon-cw"></button>
        <button
          id="regimentsPercentage"
          data-tip="${O(`Toggle percentage / absolute values views`)}"
          class="icon-percent"
        ></button>
        <button id="regimentsAddNew" data-tip="${O(`Add`)}" class="icon-user-plus"></button>
        <button
          id="regimentsRecalculate"
          data-tip="${O(`Recalculate military forces of the selected state, or of all states`)}"
          class="icon-retweet"
        ></button>
        <button
          id="regimentsExport"
          data-tip="${O(`Save data as a CSV file`)}"
          class="icon-download"
        ></button>
      </div>
    </div>`;n(`dialogs`).insertAdjacentHTML(`beforeend`,e),n(`regimentsSearch`).value=P.search,g(M,I.reset),x({dialogId:M,columns:F,onUpdate:()=>_.update(M,{width:`fit-content`,position:N})});let t=n(`regimentsBody`);n(`regimentsOverviewRefresh`).addEventListener(`click`,U),n(`regimentsPercentage`).addEventListener(`click`,Y),n(`regimentsAddNew`).addEventListener(`click`,X),n(`regimentsRecalculate`).addEventListener(`click`,Q),n(`regimentsExport`).addEventListener(`click`,$),n(`regimentsSearch`).addEventListener(`input`,e=>{P.search=e.target.value,v.set(M,`filters`,P),I.reset()}),n(`regimentsFilter`).addEventListener(`change`,e=>{P.stateId=+e.target.value,v.set(M,`filters`,P),I.reset()}),t.addEventListener(`click`,async e=>{let t=e.target.closest(`.regimentVisibility`);if(t){let e=t.closest(`.states`),n=+e.dataset.s,r=+e.dataset.id,i=pack.states[n]?.military?.find(e=>e.i===r);i&&(i.hidden=!i.hidden,t.className=`regimentVisibility pointer ${i.hidden?`icon-eye-off`:`icon-eye`}`,d.draw(`military`));return}let n=e.target.closest(`[data-edit-regiment]`);n&&i.RegimentEditor.open(`#${n.dataset.editRegiment}`)})}function z(){n(`regimentsAddNew`).classList.contains(`pressed`)&&X(),_.destroy(`regimentsOverview`)}var B=e=>`unit:${e}`;function V(){let e=options.map.military.units.map(e=>({key:B(e.name),label:k(e.name.replace(/_/g,` `)),width:`5em`,mobileHidden:!0,tip:A(O(`{{unit}} units number`,{unit:e.name}),O(`Click to sort`)),sortBy:t=>t.regiment.u[e.name]||0}));return[{key:`color`,width:`1.2em`,permanent:!0},{key:`state`,label:O(`State`),width:`7em`,permanent:!0,sortBy:e=>e.state.name||``,sortType:`alpha`},{key:`emblem`,width:`1.2em`},{key:`name`,label:O(`Name`),width:`15em`,permanent:!0,sortBy:e=>e.regiment.name||``,sortType:`alpha`},...e,{key:`total`,label:O(`Total`),width:`5em`,defaultSort:`desc`,sortBy:e=>e.regiment.a,tip:A(O(`Total military personnel (not considering crew)`),O(`Click to sort`))},{key:`power`,label:O(`Power`),width:`5em`,sortBy:e=>l.getRegimentPower(e.regiment),tip:A(O(`Military power as the forces fight: units number multiplied by unit power and by upkeep`),O(`Click to sort`))},{key:`tags`,label:O(`Tags`),width:`10em`,hidden:!0,sortBy:e=>o.format(e.regiment.tags),sortType:`alpha`},{key:`visibility`,width:`1.4em`,sortBy:e=>+!!e.regiment.hidden,tip:O(`Toggle visibility`)},{key:`edit`,width:`1.4em`,permanent:!0}]}function H(){let e=[],t=P.search.toLowerCase().trim();for(let n of pack.states)if(n.i&&!n.removed&&n.military?.length&&(P.stateId===-1||n.i===P.stateId))for(let r of n.military)(!t||o.matches(t,r.name,r.tags,[n.name||``]))&&e.push({state:n,regiment:r});return h(M,e,F)}function U(){K(),I.refresh()}function W(e){let t=n(`regimentsBody`),r=t.dataset.type===`percentage`,i=Object.fromEntries(options.map.military.units.map(t=>[t.name,s(e.all.map(e=>e.regiment.u[t.name]||0))])),a=s(e.all.map(e=>e.regiment.a)),u=s(e.all.map(e=>l.getRegimentPower(e.regiment))),d=(e,t)=>`${Math.round(t?e/t*100:0)}%`,f=e.rows.map(({state:e,regiment:t})=>{let n=options.map.military.units.map(e=>{let n=t.u[e.name]||0;return`<div data-col="${B(e.name)}" data-tip="${O(`{{unit}} units number`,{unit:k(e.name)})}">${r?d(n,i[e.name]):l.getTroops(n)}</div>`}).join(``),s=`<span data-col="emblem" data-tip="${O(`Regiment's emblem`)}">${c.html(t.icon??``)}</span>`;return`<div class="states" data-id="${t.i}" data-s="${e.i}">
        <fill-box data-col="color" data-tip="${e.fullName}" fill="${e.color}" disabled></fill-box>
        <input data-col="state" data-tip="${e.fullName}" value="${e.name}" readonly />
        ${s}
        <input data-col="name" data-tip="${O(`Name`)}" value="${t.name}" readonly />
        ${n}
        <div data-col="total" data-tip="${O(`Total military personnel (not considering crew)`)}" style="font-weight:bold">${r?d(t.a,a):l.getTroops(t.a)}</div>
        <div data-col="power" data-tip="${O(`Military power as the forces fight: units number multiplied by unit power and by upkeep`)}">${r?d(l.getRegimentPower(t),u):j(l.getTroops(l.getRegimentPower(t)))}</div>
        <div data-col="tags">
          <input
            data-tip="${O(`Regiment tags (comma-separated)`)}"
            class="regimentTags"
            value="${o.format(t.tags)}"
            placeholder="${O(`Tags`)}"
            autocorrect="off"
            spellcheck="false"
          />
        </div>
        <span data-col="visibility" data-tip="${O(`Toggle visibility`)}" class="regimentVisibility pointer ${t.hidden?`icon-eye-off`:`icon-eye`}"></span>
        <span data-col="edit" data-tip="${O(`Edit Regiment`)}" data-edit-regiment="regiment${e.i}-${t.i}" class="icon-pencil pointer"></span>
      </div>`}).join(``);t.querySelectorAll(`:scope > .states`).forEach(e=>{e.remove()}),t.insertAdjacentHTML(`beforeend`,f);let p=n(`regimentsFooter`);p.innerHTML=`<div style="margin-left:4px">${O(`Regiments`)}:&nbsp;${e.all.length}</div>
    ${options.map.military.units.map(e=>`<div data-col="${B(e.name)}" style="margin-left:12px">${k(e.name)}:&nbsp;${j(l.getTroops(i[e.name]))}</div>`).join(``)}
    <div data-col="total" style="margin-left:12px">${O(`Total`)}:&nbsp;${j(l.getTroops(a))}</div>
    <div data-col="power" style="margin-left:12px">${O(`Power`)}:&nbsp;${j(l.getTroops(u))}</div>`,y(p,e,I.goto),t.querySelectorAll(`:scope > .states`).forEach(e=>{e.addEventListener(`mouseenter`,q),e.addEventListener(`mouseleave`,J)}),t.querySelectorAll(`.regimentTags`).forEach(e=>{e.addEventListener(`change`,G)}),_.update(M,{width:`fit-content`,position:N})}function G(){let e=this.closest(`.states`),t=Number(e.dataset.s),n=Number(e.dataset.id),r=pack.states[t]?.military?.find(e=>e.i===n);r&&(o.set(r,this.value),this.value=o.format(r.tags),P.search&&I.refresh())}function K(){P.stateId!==-1&&!pack.states.some(e=>e.i===P.stateId&&!e.removed)&&(P.stateId=-1);let e=n(`regimentsFilter`);e.options.length=0,e.options.add(new Option(O(`All`),`-1`,!1,P.stateId===-1)),pack.states.filter(e=>e.i&&!e.removed).sort((e,t)=>e.name>t.name?1:-1).forEach(t=>{e.options.add(new Option(t.name,String(t.i),!1,t.i===P.stateId))}),v.set(M,`filters`,P)}function q(e){let t=e.target,n=+t.dataset.s,i=+t.dataset.id;!options.app.mode&&n&&r(`#armies > g > g#regiment${n}-${i}`).transition().duration(2e3).style(`fill`,`#ff0000`)}function J(e){let t=e.target,n=+t.dataset.s,i=+t.dataset.id;r(`#armies > g > g#regiment${n}-${i}`).transition().duration(1e3).style(`fill`,null)}function Y(){let e=n(`regimentsBody`);e.dataset.type=e.dataset.type===`absolute`?`percentage`:`absolute`,I.refresh()}function X(){let e=n(`regimentsAddNew`);e.classList.toggle(`pressed`),e.classList.contains(`pressed`)?(r(`#viewbox`).style(`cursor`,`crosshair`).on(`click`,Z),C(O(`Click on map to create new regiment or fleet`),!0),t(`regimentAdd`)?.classList.add(`pressed`)):(w(),m(),U(),t(`regimentAdd`)?.classList.remove(`pressed`))}function Z(t){let n=P.stateId;if(n===-1){C(O(`Please select state from the list`),!1,`error`);return}let r=e(t,this),i=a.findCell(r[0],r[1]);if(i===void 0)return;let o=pack.cells.p[i][0],s=pack.cells.p[i][1],d=pack.states[n].military,f={a:0,cell:i,i:d.length?D(d).i+1:0,n:+(pack.cells.h[i]<20),u:{},x:o,y:s,bx:o,by:s,state:n,icon:c.glyph(`🛡️`),name:``,tags:[],t:0,s:0,type:``};f.name=l.getName(f,d),d.push(f),l.generateNote(f,pack.states[n]),u(f,n),X()}function Q(){p.openMilitaryRegeneration({stateId:P.stateId===-1?void 0:P.stateId})}function $(){let e=options.map.military.units.map(e=>e.name),{coordinates:t}=options.map.geography,{width:n,height:r}=options.map.graph,i=[`State`,`Id`,`Icon`,`Name`,...e.map(e=>k(e)),`Total`,`Power`,`Tags`,`X`,`Y`,`Latitude`,`Longitude`,`Base X`,`Base Y`,`Base Latitude`,`Base Longitude`],a=pack.states.filter(e=>e.i&&!e.removed).flatMap(i=>(i.military??[]).map(a=>[i.name,a.i,c.glyphText(a.icon??``)??a.icon,a.name,...e.map(e=>l.getTroops(a.u[e])),l.getTroops(a.a),l.getTroops(l.getRegimentPower(a)),o.format(a.tags),a.x,a.y,E(a.y,t,r,2),T(a.x,t,n,2),a.bx,a.by,E(a.by,t,r,2),T(a.bx,t,n,2)]));f.download(`Regiments`,i,a)}var ee={open:L,exportCsv:$};export{ee as RegimentsOverview};