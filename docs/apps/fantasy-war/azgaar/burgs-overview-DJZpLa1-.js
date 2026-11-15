import{i as e,r as t,z as n}from"./node-utils-Ds1sVy-v.js";import{t as r}from"./controllers-Dbv1ZRTV.js";import{A as i,C as a,g as o}from"./options-model-CrstL1Qd.js";import{n as s}from"./prosperity-J_ycIG-E.js";import{t as c}from"./names-generator-BcJRPzyi.js";import{b as l,m as u,n as d}from"./units-CYDspnRH.js";import{at as f,t as p}from"./layers-DjWzCbYN.js";import{t as m}from"./stratify-CGdiYggi.js";import{t as h}from"./pack-CyBKcrr4.js";import{t as g}from"./csv-BoSHm6Vn.js";import{t as _}from"./development-view-ChwbelfH.js";import{t as v}from"./dialog-BkeQgjla.js";import{c as y,l as b,s as ee}from"./app-DCKsq5m8.js";import{t as te}from"./highlighting-C3iNJ2tq.js";import{t as x}from"./state-B2hBYDzv.js";import{a as ne,i as re,n as S,r as C}from"./table-DPmN0izx.js";import{F as w,M as ie,_ as ae,c as T,i as E,l as D,n as O,y as oe}from"./economy-view-C5mGSEYI.js";import{m as k}from"./zoom-B8oh1YKy.js";import{o as A}from"./tooltips-BVQbACdS.js";import{c as se,s as ce}from"./notices-6lBE5Kkn.js";import{O as j,a as M,i as N,k as P}from"./index-sNerCVjG.js";var F=`burgsOverview`,I=`Id.Burg.Province.Province Full Name.State.State Full Name.Culture.Religion.Group.Type.Population.Market.Product.Wealth.Prosperity.Balance.Adjustments.X.Y.Latitude.Longitude.Elevation.Temperature.Temperature likeness.Capital.Port.Citadel.Walls.Plaza.Temple.Shanty Town.Emblem.Preview link.Tags`.split(`.`),L={my:`right top`,at:`right-10 top+10`,of:`svg`},R,z=[{key:`locate`,width:`0.8em`,permanent:!0},{key:`name`,label:M(`Burg`),width:`8em`,permanent:!0,sortBy:e=>e.name||``,sortType:`alpha`},{key:`province`,label:M(`Province`),width:`8em`,hidden:!0,mobileHidden:!0,sortType:`alpha`,sortBy:e=>{let t=pack.cells.province[e.cell];return t&&pack.provinces[t]?.name||``}},{key:`state`,label:M(`State`),width:`7em`,sortBy:e=>pack.states[e.state]?.name||``,sortType:`alpha`},{key:`culture`,label:M(`Culture`),width:`7em`,mobileHidden:!0,sortBy:e=>pack.cultures[e.culture]?.name||``,sortType:`alpha`},{key:`group`,label:M(`Group`),width:`7em`,mobileHidden:!0,sortBy:e=>e.group||``,sortType:`alpha`},{key:`population`,label:M(`Population`),width:`7em`,defaultSort:`desc`,sortBy:e=>e.population*options.map.units.population.scale*options.map.units.population.urbanization.rate},{key:`grossproduct`,label:M(`Product`),width:`6.5em`,hidden:!0,mobileHidden:!0,sortBy:e=>j(e.product||0,2)},{key:`prosperity`,label:M(`Prosperity`),width:`6.5em`,mobileHidden:!0,tip:N(E.prosperity(),E.openValue()),sortBy:e=>s.getBurg(e.i)?.prosperity??-1},{key:`development`,label:M(`Development`),width:`7.5em`,hidden:!0,mobileHidden:!0,tip:M(`Development of the burg's land, 0–100, and its era`),sortBy:e=>pack.cells.development?.[e.cell]??-1},{key:`productpercapita`,label:M(`Wealth`),width:`6.5em`,mobileHidden:!0,tip:N(E.wealth(),E.openValue()),sortBy:e=>j(e.population>0?(e.product||0)/e.population:0,2)},{key:`treasury`,label:M(`Balance`),width:`6.5em`,hidden:!0,mobileHidden:!0,sortBy:e=>j(e.treasury||0,2)},{key:`capital`,label:M(`Capital`),icon:`icon-star-empty`,width:`2.2em`,mobileHidden:!0,sortBy:e=>+!!e.capital},{key:`port`,label:M(`Port`),icon:`icon-anchor`,width:`2.2em`,mobileHidden:!0,sortBy:e=>+!!e.port},{key:`market`,label:M(`Market`),icon:`icon-store`,width:`2.2em`,mobileHidden:!0,sortBy:e=>+!!J(e)},{key:`tags`,label:M(`Tags`),width:`10em`,hidden:!0,sortBy:e=>a.format(e.tags),sortType:`alpha`},{key:`edit`,width:`1.1em`},{key:`lock`,width:`1.1em`},{key:`remove`,width:`1.4em`,permanent:!0}],B=C({dialogId:F,getData:()=>y(F,q(),z),onUpdate:le});function V(e={}){options.app.mode||(R=x.get(F,`filters`,()=>({search:``,stateId:-1,cultureId:-1})),v.closeAll(`#${F}, .stable`),p.show(`burgIcons`,`labels`),e.stateId!=null&&(R.stateId=e.stateId),e.cultureId!=null&&(R.cultureId=e.cultureId),H(),G(),ve(),B.reset(),v.open(F,{title:M(`Burgs Overview`),onClose:U,width:`fit-content`,position:L}))}function H(){v.destroy(`burgsOverview`);let e=`<div id="burgsOverview" class="dialog stable editorDialog">
      <div id="burgsBody" class="table">${re({dialogId:F,columns:z})}</div>
      <div id="burgsFilters" data-tip="${M(`Apply a filter`)}" class="editorFilters">
        <label for="burgsSearch" data-tip="${M(`Filter by name, province, state, culture, group, or tag`)}"
          >${M(`Search`)}: <input id="burgsSearch" type="search"
        /></label>
        <label for="burgsFilterState"
          >${M(`State`)}:
          <select id="burgsFilterState"></select
        ></label>
        <label for="burgsFilterCulture"
          >${M(`Culture`)}:
          <select id="burgsFilterCulture"></select
        ></label>
      </div>
      <div id="burgsFooter" class="totalLine">
        <div data-tip="${M(`Burgs displayed`)}" style="margin-left: 5px">
          ${M(`Burgs`)}:&nbsp;<span id="burgsFooterBurgs">${M(`{{shown}} of {{total}}`,{shown:0,total:0})}</span>
        </div>
        <div data-tip="${M(`Average population`)}" style="margin-left: 12px" data-col="population">
          ${M(`Avg population`)}:&nbsp;<span id="burgsFooterPopulation">0</span>
        </div>
        <div data-tip="${E.prosperity()}" style="margin-left: 12px" data-col="prosperity">
          ${M(`Avg prosperity`)}:&nbsp;<span id="burgsFooterProsperity">0</span>
        </div>
        <div data-tip="${E.product()}" style="margin-left: 12px" data-col="grossproduct">
          ${M(`Avg product`)}:&nbsp;<span id="burgsFooterGrossProduct">0</span> 🟡
        </div>
        <div data-tip="${E.wealth()}" style="margin-left: 12px" data-col="productpercapita">
          ${M(`Avg wealth`)}:&nbsp;<span id="burgsFooterProductPerCapita">0</span> 🟡
        </div>
        <div data-tip="${E.treasury()}" style="margin-left: 12px" data-col="treasury">
          ${M(`Avg balance`)}:&nbsp;<span id="burgsFooterTreasury">0</span> 🟡
        </div>
      </div>
      <div id="burgsBottom" class="editorToolbar">
        <button id="burgsOverviewRefresh" data-tip="${M(`Refresh`)}" class="icon-cw"></button>
        <button id="burgsGroupsEditorButton" data-tip="${M(`Edit burg groups`)}" class="icon-cog"></button>
        <button id="burgsChart" data-tip="${M(`Burgs bubble chart`)}" class="icon-chart-area"></button>
        <button
          id="regenerateBurgNames"
          data-tip="${M(`Regenerate burg names based on assigned culture`)}"
          class="icon-retweet"
        ></button>
        <button id="addNewBurg" data-tip="${N(M(`Add`),M(`Hold Shift to add multiple`))}" class="icon-plus"></button>
        <button
          id="burgsExport"
          data-tip="${M(`Save data as a CSV file`)}"
          class="icon-download"
        ></button>
        <button id="burgsImport" data-tip="${M(`Upload data from a CSV file`)}" class="icon-upload"></button>
        <button id="burgsLockAll" data-tip="${M(`Lock or unlock all burgs`)}" class="icon-lock"></button>
        <button
          id="burgsRemoveAll"
          data-tip="${M(`Remove all unlocked burgs except for capitals. To remove a capital remove its state first`)}"
          class="icon-trash"
        ></button>
      </div>
    </div>`;t(`dialogs`).insertAdjacentHTML(`beforeend`,e),t(`burgsSearch`).value=R.search,ee(F,B.reset),te(F,({target:e,cellId:t})=>{let n=pack.cells.burg[t];if(n)return n;let r=e.closest(`#labels [data-label-type='burg'][data-id], #burgIcons [data-id]`);return r?Number(r.dataset.id):void 0}),S({dialogId:F,columns:z,onUpdate:()=>v.update(F,{width:`fit-content`,position:L})}),t(`burgsOverviewRefresh`).addEventListener(`click`,W),t(`burgsGroupsEditorButton`).addEventListener(`click`,()=>r.BurgGroupEditor.open()),t(`burgsChart`).addEventListener(`click`,Q),t(`burgsFilterState`).addEventListener(`change`,K),t(`burgsFilterCulture`).addEventListener(`change`,K),t(`burgsSearch`).addEventListener(`input`,K),t(`regenerateBurgNames`).addEventListener(`click`,he),t(`addNewBurg`).addEventListener(`click`,()=>void r.BurgCreator.toggle()),t(`burgsExport`).addEventListener(`click`,$),t(`burgsImport`).addEventListener(`click`,()=>g.pick(be)),t(`burgsLockAll`).addEventListener(`click`,_e),t(`burgsRemoveAll`).addEventListener(`click`,ge)}function U(){e(`addBurgTool`)?.classList.contains(`pressed`)&&r.BurgCreator.stop(),v.destroy(`burgsOverview`)}function W(){G(),B.reset()}function G(){let e=t(`burgsFilterState`);new Set(pack.states.filter(e=>!e.removed).map(e=>e.i)).has(R.stateId)||(R.stateId=-1),e.options.length=0,e.options.add(new Option(M(`All`),`-1`,!1,R.stateId===-1)),e.options.add(new Option(pack.states[0].name,`0`,!1,R.stateId===0)),pack.states.filter(e=>e.i&&!e.removed).sort((e,t)=>e.name>t.name?1:-1).forEach(t=>void e.options.add(new Option(t.name,String(t.i),!1,t.i===R.stateId)));let n=t(`burgsFilterCulture`);new Set(pack.cultures.filter(e=>!e.removed).map(e=>e.i)).has(R.cultureId)||(R.cultureId=-1),n.options.length=0,n.options.add(new Option(M(`All`),`-1`,!1,R.cultureId===-1)),n.options.add(new Option(pack.cultures[0].name,`0`,!1,R.cultureId===0)),pack.cultures.filter(e=>e.i&&!e.removed).sort((e,t)=>e.name>t.name?1:-1).forEach(e=>void n.options.add(new Option(e.name,String(e.i),!1,e.i===R.cultureId))),x.set(F,`filters`,R)}function K(){R.search=t(`burgsSearch`).value,R.stateId=+t(`burgsFilterState`).value,R.cultureId=+t(`burgsFilterCulture`).value,x.set(F,`filters`,R),B.reset()}function q(){let e=R.search.toLowerCase().trim(),t=pack.burgs.filter(e=>e.i&&!e.removed);return e&&(t=t.filter(t=>{let n=pack.states[t.state]?.name||``,r=pack.cells.province[t.cell],i=r&&pack.provinces[r]?.name||``,o=pack.cultures[t.culture]?.name||``;return a.matches(e,t.name,t.tags,[n,i,o,t.group])})),R.stateId!==-1&&(t=t.filter(e=>e.state===R.stateId)),R.cultureId!==-1&&(t=t.filter(e=>e.culture===R.cultureId)),t}function le(e){let n=t(`burgsBody`),o=pack.burgs.filter(e=>e.i&&!e.removed).length;n.querySelectorAll(`:scope > .states`).forEach(e=>{e.remove()});let c=``,l=0,u=0,d=0,f=0,p=0,m=0;for(let t of e.all){let e=t.population*options.map.units.population.scale*options.map.units.population.urbanization.rate,n=j(t.product||0,2),r=j(t.population>0?(t.product||0)/t.population:0,2),i=j(t.treasury||0,2);l+=e,u+=n,d+=r,f+=i;let a=s.getBurg(t.i);a&&(p+=a.prosperity,m++)}let h=E.treasury(),g=E.open();for(let t of e.rows){let e=t.population*options.map.units.population.scale*options.map.units.population.urbanization.rate,n=j(t.product||0,2),r=j(t.population>0?(t.product||0)/t.population:0,2),o=j(t.treasury||0,2),l=s.getBurg(t.i),u=J(t),d=pack.states[t.state].name,f=pack.cells.province[t.cell],p=f?pack.provinces[f].name:``,m=pack.cultures[t.culture].name;c+=`<div
        class="states"
        data-id=${t.i}
        data-name="${t.name}"
        data-state="${d}"
        data-province="${p}"
        data-culture="${m}"
        data-group="${t.group}"
        data-population=${e}
        data-grossproduct=${n}
        data-productpercapita=${r}
        data-prosperity="${l?j(l.prosperity*100):``}"
        data-treasury=${o}
      >
        <span data-tip="${M(`Click to zoom`)}" class="icon-dot-circled pointer" data-col="locate"></span>
        <input data-tip="${M(`Name`)}" class="burgName" value="${t.name}" data-col="name" disabled />
        <input data-tip="${M(`Burg province`)}" value="${p}" data-col="province" disabled />
        <input data-tip="${M(`Burg state`)}" value="${d}" data-col="state" disabled />
        <input data-tip="${M(`Dominant culture`)}" value="${m}" data-col="culture" disabled />
        <input data-tip="${M(`Burg group`)}" value="${t.group}" data-col="group" disabled />
        <div data-col="population">
          <span data-tip="${M(`Burg population`)}" class="icon-male"></span>
          <input data-tip="${M(`Burg population`)}" value=${P(e)} disabled />
        </div>
        <div data-col="grossproduct" class="burgEconomy pointer" data-tip="${N(E.product(),g)}">
          <span>🟡</span>
          <input class="pointer" value=${n} readonly />
        </div>
        <div data-col="prosperity" class="burgEconomy pointer" data-tip="${l?N(ie(l.prosperity),g):E.noData()}">
          ${l?w(l.prosperity):`—`}
        </div>
        ${pack.cells.development?`<div data-tip="${_(pack.cells.development[t.cell])}" data-col="development">${pack.cells.development[t.cell]}</div>`:`<div class="placeholder" data-col="development"></div>`}
        <div data-col="productpercapita" class="burgEconomy pointer" data-tip="${N(E.wealth(),g)}">
          <span>🟡</span>
          <input class="pointer" value=${r} readonly />
        </div>
        <div data-col="treasury" class="burgEconomy pointer" data-tip="${N(h,g)}">
          <span>🟡</span>
          <input class="pointer" value=${o} readonly />
        </div>
        <span data-col="capital"
          data-tip="${t.capital?M(`This burg is a state capital`):M(`This burg is NOT a state capital`)}"
          class="icon-star-empty${t.capital?``:` inactive`}"></span>
        <span data-col="port" data-tip="${t.port?M(`This burg is a port`):M(`This burg is NOT a port`)}"
          class="icon-anchor${t.port?``:` inactive`}"></span>
        <span data-col="market"
          data-tip="${u?M(`Center of the {{market}} market. Click to open`,{market:i.getName(u)}):M(`This burg is NOT a market center`)}"
          class="icon-store${u?` pointer`:` inactive`}" data-market="${u?.i??``}"></span>
        <div data-col="tags">
          <input
            data-tip="${M(`Tags (comma-separated)`)}"
            class="burgTags"
            value="${a.format(t.tags)}"
            placeholder="${M(`Tags`)}"
            autocorrect="off"
            spellcheck="false"
          />
        </div>
        <span data-col="edit" data-tip="${M(`Edit Burg`)}" class="icon-pencil"></span>
        <span data-col="lock" class="locks pointer ${t.lock?`icon-lock`:`icon-lock-open inactive`}" data-lock-tip></span>
        <span data-col="remove" data-tip="${M(`Remove`)}" class="icon-trash-empty"></span>
      </div>`}n.insertAdjacentHTML(`beforeend`,c),t(`burgsFooterBurgs`).innerHTML=M(`{{shown}} of {{total}}`,{shown:e.all.length,total:o}),t(`burgsFooterPopulation`).innerHTML=e.all.length?P(l/e.all.length):`0`,t(`burgsFooterGrossProduct`).innerHTML=e.all.length?String(j(u/e.all.length,2)):`0`,t(`burgsFooterProductPerCapita`).innerHTML=e.all.length?String(j(d/e.all.length,2)):`0`,t(`burgsFooterTreasury`).innerHTML=e.all.length?String(j(f/e.all.length,2)):`0`,t(`burgsFooterProsperity`).innerHTML=m?w(p/m):`—`,ne(t(`burgsFooter`),e,B.goto),n.querySelectorAll(`div.states`).forEach(e=>void e.addEventListener(`mouseenter`,e=>Y(e))),n.querySelectorAll(`div.states`).forEach(e=>void e.addEventListener(`mouseleave`,()=>X())),n.querySelectorAll(`div > span.icon-dot-circled`).forEach(e=>void e.addEventListener(`click`,de)),n.querySelectorAll(`div > span.locks`).forEach(e=>void e.addEventListener(`click`,fe)),n.querySelectorAll(`div > span.icon-pencil`).forEach(e=>void e.addEventListener(`click`,pe)),n.querySelectorAll(`.burgEconomy`).forEach(e=>{e.addEventListener(`click`,()=>r.BurgEconomyOverview.open(+e.closest(`.states`).dataset.id))}),n.querySelectorAll(`span.icon-store[data-market]`).forEach(e=>{e.dataset.market&&e.addEventListener(`click`,()=>r.MarketOverview.open(+e.dataset.market))}),n.querySelectorAll(`div > input.burgTags`).forEach(e=>void e.addEventListener(`change`,ue)),n.querySelectorAll(`div > span.icon-trash-empty`).forEach(e=>void e.addEventListener(`click`,me))}function J(e){return pack.markets.find(t=>t.centerBurgId===e.i)}function ue(){let e=this.closest(`.states`),t=Number(e.dataset.id),n=pack.burgs[t];n&&(a.set(n,this.value),this.value=a.format(n.tags),R.search&&B.refresh())}function Y(e){let t=+e.target.dataset.id,r=n(`#labels`).select(`[data-label-type='burg'][data-id='${t}']`);r.size()&&r.classed(`drag`,!0)}function X(){n(`#labels`).selectAll(`text[data-label-type='burg'].drag`).classed(`drag`,!1)}function de(){let e=+this.closest(`.states`).dataset.id,{x:t,y:n}=pack.burgs[e];k(t,n,8,2e3)}function fe(){let e=+this.closest(`.states`).dataset.id;o.setLocked(e,!pack.burgs[e].lock),this.classList.contains(`icon-lock`)?(this.classList.remove(`icon-lock`),this.classList.add(`icon-lock-open`),this.classList.add(`inactive`)):(this.classList.remove(`icon-lock-open`),this.classList.add(`icon-lock`),this.classList.remove(`inactive`))}function pe(){let e=+this.closest(`.states`).dataset.id;r.BurgEditor.open(e)}function me(){let e=+this.closest(`.states`).dataset.id;pack.burgs[e].capital?A(N(M(`You cannot remove the capital`),M(`You must change the state capital first`)),!1,`error`):pack.markets?.some(t=>t.centerBurgId===e)?A(M(`You cannot remove a market center burg. Please remove the market first`),!1,`error`):v.confirm({title:M(`Remove`),message:`${M(`Are you sure you want to remove the burg?`)}<br>${M(`This action cannot be reverted`)}`,confirm:M(`Remove`),onConfirm:()=>{o.remove(e),b(),f(`burg`,e),B.refresh(),p.draw(`burgIcons`,`labels`,`goods`,`trade`)}})}function he(){for(let e of q())e.lock||(e.name=c.getCulture(e.culture));B.refresh(),p.draw(`labels`)}var Z=(e,t)=>m().id(e=>String(e.id)).parentId(e=>{let n=t(e);return n==null?n:String(n)})(e).sum(e=>e.population??0).sort((e,t)=>t.value-e.value);function Q(){let e=pack.states.map(e=>{let t=e.color?e.color:`#ccc`,n=e.fullName?e.fullName:e.name;return{id:e.i,state:e.i?0:null,color:t,name:n}}),r=pack.burgs.filter(e=>e.i&&!e.removed).map(t=>{let n=t.i+e.length-1,r=t.population,i=t.capital,a=pack.cells.province[t.cell],o=a?a+e.length-1:t.state;return{id:n,i:t.i,state:t.state,culture:t.culture,province:a,parent:o,name:t.name,population:r,capital:i,x:t.x,y:t.y}}),i=[...e,...r];if(i.length<2){A(M(`No burgs to show`),!1,`error`);return}let a=Z(i,e=>e.state),o=t(`uiSize`).valueAsNumber,s=150+200*o,c=150+200*o,l={top:0,right:-50,bottom:-10,left:-50},u=s-l.left-l.right,d=c-l.top-l.bottom,f=h().size([u,d]).padding(3),p=document.createElement(`div`);p.innerHTML=`<select id="burgsTreeType" style="display:block; margin-left:13px; font-size:11px">
      <option value="states" selected>${M(`Group by state`)}</option>
      <option value="cultures">${M(`Group by culture`)}</option>
      <option value="parent">${M(`Group by province and state`)}</option>
      <option value="provinces">${M(`Group by province`)}</option>
    </select><div id='burgsInfo' class='chartInfo'>&#8205;</div>`;let m=n(p).insert(`svg`,`#burgsInfo`).attr(`id`,`burgsTree`).attr(`width`,s).attr(`height`,c-10).attr(`stroke-width`,2).append(`g`).attr(`transform`,`translate(-50, -10)`);p.querySelector(`#burgsTreeType`).addEventListener(`change`,b);let g=m.selectAll(`circle`).data(f(a).leaves()).join(`circle`).attr(`data-id`,e=>e.data.i??null).attr(`r`,e=>e.r).attr(`fill`,e=>e.parent.data.color).attr(`cx`,e=>e.x).attr(`cy`,e=>e.y).on(`mouseenter`,(e,t)=>_(e,t)).on(`mouseleave`,e=>y(e)).on(`click`,(e,t)=>k(t.data.x,t.data.y,8,2e3));function _(e,r){n(e.target).transition().duration(1500).attr(`stroke`,`#c13119`);let i=r.data.name,a=r.parent.data.name,o=P(r.value*options.map.units.population.scale*options.map.units.population.urbanization.rate);t(`burgsInfo`).innerHTML=`${i}. ${a}. ${`${M(`Population`)}: ${o}`}`,Y(e),A(M(`Click to zoom`))}function y(e){X(),t(`burgsInfo`)&&(t(`burgsInfo`).innerHTML=`&#8205;`,n(e.target).transition().attr(`stroke`,null),A(``))}function b(){let e=()=>pack.states.map(e=>{let t=e.color?e.color:`#ccc`,n=e.fullName?e.fullName:e.name;return{id:e.i,state:e.i?0:null,color:t,name:n}}),t=()=>pack.cultures.map(e=>{let t=e.color?e.color:`#ccc`;return{id:e.i,culture:e.i?0:null,color:t,name:e.name}}),n=()=>{let e=pack.states.map(e=>{let t=e.color?e.color:`#ccc`,n=e.fullName?e.fullName:e.name;return{id:e.i,parent:e.i?0:null,color:t,name:n}}),t=pack.provinces.filter(e=>e.i&&!e.removed).map(t=>({id:t.i+e.length-1,parent:t.state,color:t.color,name:t.fullName}));return[...e,...t]},i=()=>pack.provinces.map(e=>{let t=e.color?e.color:`#ccc`,n=e.fullName?e.fullName:e.name;return{id:e.i?e.i:0,province:e.i?0:null,color:t,name:n}}),a=e=>{if(this.value===`states`)return e.state;if(this.value===`cultures`)return e.culture;if(this.value===`parent`)return e.parent;if(this.value===`provinces`)return e.province},o={states:e,cultures:t,parent:n,provinces:i}[this.value]();r.forEach(e=>{e.id=e.i+o.length-1});let s=Z([...o,...r],a);g.data(f(s).leaves()).transition().duration(2e3).attr(`data-id`,e=>e.data.i??null).attr(`fill`,e=>e.parent.data.color).attr(`cx`,e=>e.x).attr(`cy`,e=>e.y).attr(`r`,e=>e.r)}v.message({message:p,title:M(`Burgs bubble chart`),width:`fit-content`,position:{my:`left bottom`,at:`left+10 bottom-10`,of:`svg`},buttons:[]})}function $(){let{coordinates:e}=options.map.geography,{scale:t,urbanization:n}=options.map.units.population,r=oe(),c=[...I,...O].map(e=>e===`Elevation`?`Elevation (${options.map.units.height.unit})`:e),f=pack.burgs.filter(e=>e.i&&!e.removed).map(c=>{let f=pack.provinces[pack.cells.province[c.cell]],p=grid.cells.temp[pack.cells.g[c.cell]],m=i.ofBurg(c);return[c.i,c.name,f?.i?f.name:``,f?.i?f.fullName:``,pack.states[c.state].name,pack.states[c.state].fullName,pack.cultures[c.culture].name,pack.religions[pack.cells.religion[c.cell]].name,c.group,c.type,j(c.population*t*n.rate),m?i.getName(m):``,j(c.product||0,2),j(c.population>0?(c.product||0)/c.population:0,2),s.getBurg(c.i)?j(s.getBurg(c.i).prosperity*100):``,j(c.treasury||0,2),D(c.adjustments),c.x,c.y,ce(c.y,e,options.map.graph.height,2),se(c.x,e,options.map.graph.width,2),parseInt(u(pack.cells.h[c.cell]),10),d(p),l(p),c.capital?`capital`:``,c.port?`port`:``,c.citadel?`citadel`:``,c.walls?`walls`:``,c.plaza?`plaza`:``,c.temple?`temple`:``,c.shanty?`shanty town`:``,c.coa?JSON.stringify(c.coa).replace(/"/g,``).replace(/,/g,`;`):``,o.getPreview(c).link,a.format(c.tags),...ae(c,r)]});g.download(`Burgs`,c,f)}function ge(){let e=()=>pack.burgs.filter(e=>e.i&&!e.removed&&!(e.capital||e.lock)&&!pack.markets?.some(t=>t.centerBurgId===e.i));v.confirm({title:M(`Remove burgs ({{burgs}})`,{burgs:e().length}),message:`${M(`Are you sure you want to remove all unlocked burgs except for capitals and market centers?`)}<br><i>${M(`To remove a capital you have to remove its state first`)}</i>`,confirm:M(`Remove`),onConfirm:()=>{for(let t of e())o.remove(t.i),f(`burg`,t.i);b(),B.refresh(),p.draw(`burgIcons`,`labels`,`goods`,`trade`)}})}function _e(){let e=pack.burgs.filter(e=>e.i&&!e.removed),n=e.every(e=>e.lock);for(let t of e)o.setLocked(t.i,!n);B.refresh(),t(`burgsLockAll`).className=n?`icon-lock`:`icon-lock-open`}function ve(){let e=pack.burgs.every(({lock:e,i:t,removed:n})=>e||!t||n);t(`burgsLockAll`).className=e?`icon-lock-open`:`icon-lock`}var ye=[[`Citadel`,`citadel`],[`Walls`,`walls`],[`Plaza`,`plaza`],[`Temple`,`temple`],[`Shanty Town`,`shanty`]];async function be(e){let{scale:t,urbanization:n}=options.map.units.population,i=e=>e&&pack.burgs[e]&&!pack.burgs[e].removed?pack.burgs[e]:void 0,s=pack.burgs.filter(e=>e?.i&&!e.removed),c=new Set(s.filter(e=>e.capital).map(e=>e.i)),l=new Map(s.map(e=>[e.i,o.getPreview(e).link]));await r.CsvUpload.update(e,[...I,...O],{find:i,units:[`Elevation`],text:[`Burg`,`Tags`]},(e,r)=>{let s=i(e);r.apply(`Burg`,t=>o.rename(e,t),s.name),r.apply(`Culture`,t=>o.setCulture(e,g.byName(pack.cultures,t).i),pack.cultures[s.culture]?.name),r.apply(`Group`,t=>o.setGroup(e,t),s.group),r.apply(`Type`,t=>o.setType(e,t),s.type),r.apply(`Population`,t=>o.setPopulation(e,+t),j(s.population*t*n.rate)),r.assign(`Adjustments`,t=>o.setAdjustments(e,T(t)),D(s.adjustments)),r.apply(`Capital`,()=>o.setCapital(e),c.has(e)?`capital`:``),r.assign(`Port`,t=>o.setPort(e,!!t),s.port?`port`:``);for(let[t,n]of ye)r.assign(t,t=>o.setBuilding(e,n,!!t),s[n]?t.toLowerCase():``);r.apply(`Preview link`,t=>o.setLink(e,t),l.get(e)),r.assign(`Tags`,e=>a.set(s,e),a.format(s.tags))})&&(p.draw(`burgIcons`,`labels`,`emblems`,`population`),W())}var xe={open:V,showChart:Q,exportCsv:$};export{xe as BurgsOverview};