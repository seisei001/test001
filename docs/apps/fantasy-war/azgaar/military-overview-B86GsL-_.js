import{h as e,r as t,z as n}from"./node-utils-Ds1sVy-v.js";import{t as r}from"./controllers-Dbv1ZRTV.js";import{n as i}from"./goods-generator-DS7hwx2H.js";import{Lt as a,m as o,n as s,o as c}from"./options-model-CrstL1Qd.js";import{t as l}from"./military-generator-CVth4JoO.js";import{F as u,et as d,st as f,t as p}from"./layers-DjWzCbYN.js";import{t as m}from"./csv-BoSHm6Vn.js";import{S as h,c as g,s as _}from"./app-DCKsq5m8.js";import{t as v}from"./dialog-BkeQgjla.js";import{t as y}from"./highlighting-C3iNJ2tq.js";import{n as b,t as x}from"./limitation-picker-C6HWXSdg.js";import{a as S,i as C,n as w,r as T}from"./table-DPmN0izx.js";import{i as E}from"./economy-view-C5mGSEYI.js";import{o as D}from"./tooltips-BVQbACdS.js";import{h as O}from"./notices-6lBE5Kkn.js";import{O as k,a as A,f as j,i as M,k as N,m as P,y as F}from"./index-sNerCVjG.js";var I=`militaryOverview`,L={my:`right top`,at:`right-10 top+10`,of:`svg`},R=[],z=T({dialogId:I,getData:q,onUpdate:Y});function B(){options.app.mode||(v.closeAll(`#militaryOverview, .stable`),p.show(`states`,`borders`,`military`),V(),z.reset(),v.open(`militaryOverview`,{title:A(`Military Overview`),width:`fit-content`,onClose:H,position:L}))}function V(){R=W(),v.destroy(`militaryOverview`);let e=`<div id="${I}" class="dialog stable editorDialog">
      <div id="militaryBody" class="table" data-type="absolute">
        ${C({dialogId:I,columns:R})}
      </div>
      <div id="militaryFooter" class="totalLine">
        <div data-tip="${A(`States number`)}" style="margin-left: 4px">
          ${A(`States`)}:&nbsp;<span id="militaryFooterStates">0</span>
        </div>
        <div data-tip="${A(`Total military forces`)}" style="margin-left: 14px" data-col="total">
          ${A(`Total forces`)}:&nbsp;<span id="militaryFooterForcesTotal">0</span>
        </div>
        <div data-tip="${A(`Average military forces per state`)}" style="margin-left: 14px" data-col="total">
          ${A(`Average forces`)}:&nbsp;<span id="militaryFooterForces">0</span>
        </div>
        <div data-tip="${A(`Average forces rate per state`)}" style="margin-left: 14px" data-col="rate">
          ${A(`Average rate`)}:&nbsp;<span id="militaryFooterRate">0%</span>
        </div>
        <div data-tip="${A(`Average War Alert`)}" style="margin-left: 14px" data-col="alert">
          ${A(`Average alert`)}:&nbsp;<span id="militaryFooterAlert">0</span>
        </div>
      </div>
      <div id="militaryBottom" class="editorToolbar">
        <button id="militaryOverviewRefresh" data-tip="${A(`Refresh`)}" class="icon-cw"></button>
        <button id="militaryOptionsButton" data-tip="${A(`Edit Military Units`)}" class="icon-cog"></button>
        <button id="militaryRegimentsList" data-tip="${A(`Show regiments list`)}" class="icon-list-bullet"></button>
        <button
          id="militaryPercentage"
          data-tip="${A(`Toggle percentage / absolute values views`)}"
          class="icon-percent"
        ></button>
        <button
          id="militaryOverviewRecalculate"
          data-tip="${A(`Recalculate military forces based on current options`)}"
          class="icon-retweet"
        ></button>
        <button
          id="militaryExport"
          data-tip="${A(`Save data as a CSV file`)}"
          class="icon-download"
        ></button>
        <button id="militaryWiki" data-tip="${A(`Open Military Forces Tutorial`)}" class="icon-info"></button>
      </div>
    </div>`;t(`dialogs`).insertAdjacentHTML(`beforeend`,e),G(),y(`militaryOverview`,({cellId:e})=>pack.cells.state[e]);let n=t(`militaryBody`);t(`militaryOverviewRefresh`).addEventListener(`click`,J),t(`militaryPercentage`).addEventListener(`click`,te),t(`militaryOptionsButton`).addEventListener(`click`,ne),t(`militaryRegimentsList`).addEventListener(`click`,()=>U(-1)),t(`militaryOverviewRecalculate`).addEventListener(`click`,()=>h.openMilitaryRegeneration()),t(`militaryExport`).addEventListener(`click`,$),t(`militaryWiki`).addEventListener(`click`,()=>O(`Military-Forces`)),n.addEventListener(`change`,e=>{let t=e.target,n=t.closest(`.states`);n&&X(+n.dataset.id,+t.value)}),n.addEventListener(`click`,e=>{let t=e.target,n=t.closest(`.states`);if(!n)return;let r=+n.dataset.id;t.tagName===`SPAN`&&U(r)})}function H(){v.destroy(`militaryOverview`)}async function U(e){r.RegimentsOverview.open(e)}function W(){let e=options.map.military.units.map(e=>({key:`unit:${e.name}`,label:j(e.name.replace(/_/g,` `)),width:`5em`,mobileHidden:!0,tip:M(A(`{{unit}} units number`,{unit:e.name}),A(`Click to sort`)),sortBy:t=>t.forces[e.name]||0}));return[{key:`color`,width:`1.2em`,permanent:!0},{key:`state`,label:A(`State`),width:`7em`,permanent:!0,sortBy:e=>e.state.name||``,sortType:`alpha`},...e,{key:`total`,label:A(`Total`),width:`5em`,defaultSort:`desc`,sortBy:e=>e.total,tip:M(A(`Total military personnel (considering crew)`),A(`Click to sort`))},{key:`population`,label:A(`Population`),width:`6.5em`,mobileHidden:!0,sortBy:e=>e.population},{key:`rate`,label:A(`Rate`),width:`5em`,hidden:!0,sortBy:e=>e.rate,tip:M(A(`Military personnel rate (% of state population)`),A(`Depends on war alert`),A(`Click to sort`))},{key:`alert`,label:A(`War Alert`),width:`5.5em`,mobileHidden:!0,sortBy:e=>e.alert,tip:M(A(`War Alert`),A(`Modifier to military forces number, depends on political situation`),A(`Click to sort`))},{key:`upkeep`,label:A(`Upkeep`),width:`5em`,hidden:!0,sortBy:e=>e.upkeep,tip:M(E.upkeep(),A(`Click to sort`))},{key:`power`,label:A(`Power`),width:`5em`,sortBy:e=>e.power,tip:M(A(`Military power as the forces fight: units number multiplied by unit power and by upkeep`),A(`Click to sort`))},{key:`regiments`,width:`1.4em`,permanent:!0}]}function G(){_(I,z.reset),w({dialogId:I,columns:R,onUpdate:()=>v.update(I,{width:`fit-content`,position:L})})}function K(){R=W(),t(`${I}Header`).outerHTML=C({dialogId:I,columns:R}),G(),z.reset()}function q(){let e=pack.states.filter(e=>e.i&&!e.removed).map(e=>{let t=Object.fromEntries(options.map.military.units.map(t=>[t.name,(e.military||[]).reduce((e,n)=>e+(n.u[t.name]||0),0)])),n=(e.rural||0)+(e.urban||0)*options.map.units.population.urbanization.rate,r=k(n*options.map.units.population.scale),i=options.map.military.units.reduce((e,n)=>e+(t[n.name]||0)*n.crew,0);return{state:e,forces:t,total:i,power:l.getPower(e.i),population:r,rate:n?i/n*100:0,alert:e.alert??0,upkeep:l.getUpkeep(e.i)}});return g(I,e,R)}function J(){z.refresh()}function Y(e){let n=t(`militaryBody`),r=n.dataset.type===`percentage`,i=e.all.reduce((e,t)=>{e.total+=t.total,e.power+=t.power,e.population+=t.population;for(let n of options.map.military.units)e.units[n.name]=(e.units[n.name]||0)+t.forces[n.name];return e},{total:0,power:0,population:0,units:{}}),a=(e,t)=>`${k(t?e/t*100:0)}%`,o=e.rows.map(e=>{let t=options.map.military.units.map(t=>{let n=e.forces[t.name]||0;return`<div data-col="${`unit:${t.name}`}" data-tip="${A(`{{unit}} units number`,{unit:t.name})}">${r?a(n,i.units[t.name]||0):l.getTroops(n)}</div>`}).join(``);return`<div class="states" data-id="${e.state.i}">
        <fill-box data-col="color" data-tip="${e.state.fullName}" fill="${e.state.color}" disabled></fill-box>
        <input data-col="state" data-tip="${e.state.fullName}" value="${e.state.name}" readonly />
        ${t}
        <div data-col="total" data-tip="${A(`Total military personnel (considering crew)`)}" style="font-weight: bold">${r?a(e.total,i.total):N(l.getTroops(e.total))}</div>
        <div data-col="population" data-tip="${A(`State population`)}">${r?a(e.population,i.population):N(e.population)}</div>
        <div data-col="rate" data-tip="${M(A(`Military personnel rate (% of state population)`),A(`Depends on war alert`))}">${k(e.rate,2)}%</div>
        <input data-col="alert" data-tip="${M(A(`War Alert`),A(`Modifier to military forces number, depends on political situation`))}" type="number" min="0" step=".01" value="${k(e.alert,2)}" />
        <div data-col="upkeep" data-tip="${E.upkeep()}">${k(e.upkeep*100)}%</div>
                <div data-col="power" data-tip="${A(`Military power as the forces fight: units number multiplied by unit power and by upkeep`)}">${r?a(e.power,i.power):N(l.getTroops(e.power))}</div>
        <span data-col="regiments" data-tip="${A(`Show regiments list`)}" class="icon-list-bullet pointer"></span>
      </div>`}).join(``);n.querySelectorAll(`:scope > .states`).forEach(e=>{e.remove()}),n.insertAdjacentHTML(`beforeend`,o),Z(e),S(t(`militaryFooter`),e,z.goto),n.querySelectorAll(`:scope > .states`).forEach(e=>{e.addEventListener(`mouseenter`,Q),e.addEventListener(`mouseleave`,ee)}),v.update(I,{width:`fit-content`,position:L})}function X(e,t){t>=0&&l.setAlert(e,t);for(let t of pack.states[e].military??[])u(t,e);z.refresh()}function Z(e){let n=e.all.length,r=a(e.all.map(e=>e.total));t(`militaryFooterStates`).innerHTML=String(n),t(`militaryFooterForcesTotal`).innerHTML=N(l.getTroops(r)),t(`militaryFooterForces`).innerHTML=N(n?l.getTroops(r/n):0),t(`militaryFooterRate`).innerHTML=`${k(n?a(e.all.map(e=>e.rate))/n:0,2)}%`,t(`militaryFooterAlert`).innerHTML=String(k(n?a(e.all.map(e=>e.alert))/n:0,2))}function Q(t){let r=+t.target.dataset.id;if(options.app.mode||!r||(n(`#armies > g > g#army${r}`).transition().duration(2e3).style(`fill`,`#ff0000`),!p.isOn(`states`)))return;let i=n(`#regions`).select(`#state${r}`).attr(`d`),a=n(`#debug`).append(`path`).attr(`class`,`highlight`).attr(`d`,i).attr(`fill`,`none`).attr(`stroke`,`red`).attr(`stroke-width`,1).attr(`opacity`,1).attr(`filter`,`url(#blur1)`),o=a.node().getTotalLength(),s=(o+5e3)/2,c=e(`0,${o}`,`${o},${o}`);a.transition().duration(s).attrTween(`stroke-dasharray`,()=>e=>c(e))}function ee(e){n(`#debug`).selectAll(`.highlight`).each(function(){n(this).transition().duration(1e3).attr(`opacity`,0).remove()});let t=+e.target.dataset.id;n(`#armies > g > g#army${t}`).transition().duration(1e3).style(`fill`,null)}function te(){let e=t(`militaryBody`);e.dataset.type=e.dataset.type===`absolute`?`percentage`:`absolute`,z.refresh()}function ne(){re();let e=[`levies`,`melee`,`ranged`,`mounted`,`machinery`,`naval`,`armored`,`aviation`,`magical`],n=t(`militaryOptions`).querySelector(`tbody`),a={biomes:A(`Select allowed biomes`),states:A(`Select allowed states`),cultures:A(`Select allowed cultures`),religions:A(`Select allowed religions`)};u(),options.map.military.units.map(e=>y(e)),v.open(`militaryOptions`,{title:A(`Edit Military Units`),width:`fit-content`,position:{my:`center`,at:`center`,of:`svg`},onClose:ie,buttons:[{label:A(`Apply`),onClick:k,tip:A(`Apply military units settings.`)},{label:A(`Add`),tip:A(`Add`),onClick:()=>y({icon:o.glyph(`🛡️`),name:`custom${t(`militaryOptionsTable`).rows.length}`,rural:.2,urban:.5,crew:1,power:1,type:`melee`,separate:0},!1)},{label:A(`Restore`),onClick:C,tip:A(`Restore default military units and settings`)},{label:A(`Close`),tip:A(`Close`),onClick:()=>v.close(`militaryOptions`)}]}),n.addEventListener(`click`,e=>{let t=e.target.closest(`button`);if(!t)return;let n=t.dataset.type;if(n===`icon`)r.IconPicker.open({current:t.dataset.icon||``,onPick:e=>S(t,e)});else if(n===`biomes`)O(t,pack.biomes.filter(e=>!e.removed).map(({i:e,name:t,color:n})=>({i:e,name:t,color:n})));else{if(n===`states`)return O(t,pack.states,e=>`<span style="color:${P(e.color??``)}">⬤</span>${f(e.i)}`);if(n===`cultures`)return O(t,pack.cultures);if(n===`religions`)return O(t,pack.religions);if(n===`goods`)return E(t)}});function u(){n.querySelectorAll(`tr`).forEach(e=>{e.remove()})}function m(e){return e?.join(`,`)||``}function g(e,t){return e?.length?t===`states`?e.map(f).join(``):`some`:`all`}function _(e,t){return e?.length?x(e,t):``}function y(t,r=!0){let{type:i,icon:o,name:s,rural:c,urban:l,power:u,crew:d,separate:f}=t,p=document.createElement(`tr`);r&&options.map.military.units.some(e=>e.name===s)&&(p.dataset.origin=s);let h=e.map(e=>`<option ${i===e?`selected`:``} value="${e}">${e}</option>`).join(` `),v=e=>{let n=pack[e];return`<button
          data-tip="${a[e]}"
          style="white-space: nowrap"
          data-type="${e}"
          title="${P(_(t[e],n))}"
          data-value="${m(t[e])}">
          ${g(t[e],e)}
        </button>`};p.innerHTML=`<td>
          <button data-type="icon" data-tip="${A(`Click to select unit icon`)}" translate="no"></button>
        </td>
        <td><input data-tip="${A(`Name`)}" value="${s}" /></td>
        <td>
          <button data-tip="${A(`Goods that equip the unit; any of them, adding up. Units share the state's stock. Counts what the state consumes, not what it produces: 1 unit a day equips 365 troops × military coverage. Conscripts left without equipment are raised as levies`)}" data-type="goods" title="${P(w(t.goods))}" data-value="${m(t.goods)}">${T(t.goods)}</button>
        </td>
        <td>${v(`biomes`)}</td>
        <td>${v(`states`)}</td>
        <td>${v(`cultures`)}</td>
        <td>${v(`religions`)}</td>
        <td><input data-tip="${A(`Most of the rural population that can be raised to the unit, in percent: fewer if the state lacks the unit's goods`)}" type="number" min="0" max="100" step=".01" value="${c}" /></td>
        <td><input data-tip="${A(`Most of the urban population that can be raised to the unit, in percent: fewer if the state lacks the unit's goods`)}" type="number" min="0" max="100" step=".01" value="${l}" /></td>
        <td><input data-tip="${A(`Average number of people in crew (used for total personnel calculation)`)}" type="number" min="1" step="1" value="${d}" /></td>
        <td><input data-tip="${A(`Unit military power (used for battle simulation)`)}" type="number" min="0" step=".1" value="${u}" /></td>
        <td>
          <select data-tip="${A(`Unit type to apply special rules on forces recalculation`)}">
            ${h}
          </select>
        </td>
        <td data-tip="${A(`Check if unit is separate and can be stacked only with units of the same type`)}">
          <input id="${s}Separate" type="checkbox" class="checkbox" ${f?`checked`:``} />
          <label for="${s}Separate" class="checkbox-label"></label>
        </td>
        <td data-tip="${A(`Remove`)}">
          <span data-tip="${A(`Remove`)}" class="icon-trash-empty pointer"></span>
        </td>`,p.querySelector(`.icon-trash-empty`).addEventListener(`click`,()=>p.remove()),S(p.querySelector(`button[data-type='icon']`),o||``),n.appendChild(p)}function S(e,t){e.dataset.icon=t,e.innerHTML=o.html(t)}function C(){u(),c().map(e=>y(e))}function w(e){return e?.length?x(e,options.map.goods):A(`none`)}function T(e){let t=(e??[]).flatMap(e=>i.get(e)??[]).map(e=>`<svg width="1.4em" height="1.4em" style="vertical-align: middle">${d(e)}</svg>`);return t.length?t.join(``):A(`none`)}function E(e){b({title:A(`Unit goods`),heading:A(`Goods that equip the unit`),items:options.map.goods,allowed:e.dataset.value?e.dataset.value.split(`,`).map(Number):[],exact:!0,badge:e=>`<svg width="1.4em" height="1.4em" style="vertical-align: middle">${d(e)}</svg>`,onApply:t=>{e.dataset.value=t.join(`,`),e.innerHTML=T(t),e.setAttribute(`title`,w(t))}})}function O(e,t,n){let r=e.dataset.type;b({title:A(`Limit unit`),heading:A(`Limit unit by {{type}}`,{type:r}),items:t,allowed:e.dataset.value?e.dataset.value.split(`,`).map(Number):[],badge:n,onApply:n=>{e.dataset.value=n.join(`,`),e.innerHTML=g(n,r),e.setAttribute(`title`,_(n,t))}})}function k(){let e=Array.from(n.querySelectorAll(`tr`)),t=e.map(e=>F(e.querySelector(`input`).value));if(new Set(t).size!==t.length){D(A(`All units should have unique names`),!1,`error`);return}let r=e.map((e,n)=>{let[r,,i,a,o,s,c,l,u,d,f,p,m]=Array.from(e.querySelectorAll(`input, button, select`)).map(e=>{let{type:t,value:n}=e.dataset||{};return t===`icon`?e.dataset.icon??``:t?n?n.split(`,`).map(e=>parseInt(e,10)):null:e.type===`number`?+e.value||0:e.type===`checkbox`?+e.checked||0:e.value}),h={icon:r,name:t[n],rural:l,urban:u,crew:d,power:f,type:p,separate:m};return a&&(h.biomes=a),o&&(h.states=o),s&&(h.cultures=s),c&&(h.religions=c),i&&(h.goods=i),h}),i=l.setRoster(r,e.map(e=>e.dataset.origin??null));if(s.save(),K(),p.draw(`military`),e.forEach((e,n)=>{e.dataset.origin=t[n]}),!i.length)return void D(A(`Units are saved`),!1,`success`);h.openMilitaryRegeneration({units:i})}}function re(){v.destroy(`militaryOptions`);let e=`<div id="militaryOptions" class="dialog stable">
      <div class="table">
        <table id="militaryOptionsTable">
          <thead>
            <tr>
              <th data-tip="${A(`Unit icon`)}">${A(`Icon`)}</th>
              <th data-tip="${A(`Name`)}">${A(`Name`)}</th>
              <th data-tip="${A(`Goods that equip the unit; any of them, adding up. Units share the state's stock. Counts what the state consumes, not what it produces: 1 unit a day equips 365 troops × military coverage. Conscripts left without equipment are raised as levies`)}">${A(`Goods`)}</th>
              <th style="width: 5em" data-tip="${A(`Select allowed biomes`)}">${A(`Biomes`)}</th>
              <th style="width: 5em" data-tip="${A(`Select allowed states`)}">${A(`States`)}</th>
              <th style="width: 5em" data-tip="${A(`Select allowed cultures`)}">${A(`Cultures`)}</th>
              <th style="width: 5em" data-tip="${A(`Select allowed religions`)}">${A(`Religions`)}</th>
              <th data-tip="${A(`Most of the rural population that can be raised to the unit, in percent: fewer if the state lacks the unit's goods`)}">${A(`Rural`)}</th>
              <th data-tip="${A(`Most of the urban population that can be raised to the unit, in percent: fewer if the state lacks the unit's goods`)}">${A(`Urban`)}</th>
              <th data-tip="${A(`Average number of people in crew (used for total personnel calculation)`)}">${A(`Crew`)}</th>
              <th data-tip="${A(`Unit military power (used for battle simulation)`)}">${A(`Power`)}</th>
              <th data-tip="${A(`Unit type to apply special rules on forces recalculation`)}">${A(`Type`)}</th>
              <th data-tip="${A(`Check if unit is separate and can be stacked only with units of the same type`)}">
                ${A(`Separate`)}
              </th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>`;t(`dialogs`).insertAdjacentHTML(`beforeend`,e)}function ie(){v.destroy(`militaryOptions`)}function $(){let e=options.map.military.units.map(e=>e.name),t=[`Id`,`State`,...e.map(e=>j(e)),`Total`,`Power`,`Population`,`Rate`,`War Alert`],n=q().map(t=>[t.state.i,t.state.name,...e.map(e=>l.getTroops(t.forces[e])),l.getTroops(t.total),l.getTroops(t.power),t.population,`${k(t.rate,2)}%`,t.alert]);m.download(`Military`,t,n)}var ae={open:B,exportCsv:$};export{ae as MilitaryOverview};