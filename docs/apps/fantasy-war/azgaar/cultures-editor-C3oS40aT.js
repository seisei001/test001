import{a as e,d as t,i as n,r,z as i}from"./node-utils-Ds1sVy-v.js";import{t as a}from"./controllers-Dbv1ZRTV.js";import{C as o,G as s,b as c,g as l,j as u,pt as d,y as f}from"./options-model-CrstL1Qd.js";import{a as ee,t as te}from"./pack-generator-DTsfQ82D.js";import{J as p,_ as ne,c as re,d as ie,s as ae}from"./app-DCKsq5m8.js";import{t as m}from"./names-generator-BcJRPzyi.js";import{a as h,o as g}from"./units-CYDspnRH.js";import{t as oe}from"./drag-CCSsgLNP.js";import{Nt as se,lt as ce,n as le,t as _}from"./layers-DjWzCbYN.js";import{t as v}from"./csv-BoSHm6Vn.js";import{n as y}from"./development-view-ChwbelfH.js";import{t as b}from"./dialog-BkeQgjla.js";import{t as ue}from"./highlighting-C3iNJ2tq.js";import{t as x}from"./state-B2hBYDzv.js";import{a as de,i as fe,n as pe,o as me,r as he}from"./table-DPmN0izx.js";import{n as ge}from"./highlight-CBuOTLhq.js";import{o as S,t as _e}from"./tooltips-BVQbACdS.js";import{a as C,v as ve}from"./notices-6lBE5Kkn.js";import{O as w,a as T,g as ye,i as E,k as D,p as O}from"./index-sNerCVjG.js";var k=`culturesEditor`;function A(e){let t=N[e.i],n=f.ofCulture(e),r=[T(`Heartland: {{level}}, {{era}}`,{level:w(n),era:y(n)}),t===void 0?``:T(`People's average: {{level}}, {{era}}`,{level:w(t),era:y(t)})];return e.i?`<div data-col="development">
    <input data-tip="${E(T(`Development at the culture's center, 1–100`),...r,T(`Regenerate development in the Development Editor to apply`))}" class="cultureDevelopment" type="number" min="1" max="100" step="1" value="${e.development??33}" />
  </div>`:t===void 0?`<div class="placeholder" data-col="development"></div>`:`<div data-tip="${E(...r)}" data-col="development">${w(t)}</div>`}var be=`Cultures`,j={my:`right top`,at:`right-10 top+10`,of:`svg`},M,N=[],P=[`Id`,`Name`,`Ancestry`,`Color`,`Cells`,`Expansionism`,`Development`,`Type`,`Area`,`Population`,`Namesbase`,`Emblems Shape`,`Origins`,`Tags`],F=[{key:`color`,width:`1.2em`,permanent:!0},{key:`name`,label:T(`Culture`),width:`10em`,permanent:!0,sortBy:e=>e.name||``,sortType:`alpha`},{key:`ancestry`,label:T(`Ancestry`),width:`7.5em`,mobileHidden:!0,sortBy:e=>e.ancestry||``,sortType:`alpha`},{key:`type`,label:T(`Type`),width:`7.5em`,mobileHidden:!0,sortBy:e=>e.type||``,sortType:`alpha`},{key:`base`,label:T(`Namesbase`),width:`9em`,mobileHidden:!0,sortBy:e=>e.base},{key:`cells`,label:T(`Cells`),width:`5em`,hidden:!0,sortBy:e=>e.cells||0},{key:`expansionism`,label:T(`Expansion`),width:`5em`,hidden:!0,mobileHidden:!0,sortBy:e=>e.expansionism||0},{key:`area`,label:T(`Area`),width:`7em`,mobileHidden:!0,sortBy:e=>e.area||0},{key:`population`,label:T(`Population`),width:`6em`,defaultSort:`desc`,sortBy:e=>(e.rural||0)*options.map.units.population.scale+(e.urban||0)*options.map.units.population.scale*options.map.units.population.urbanization.rate},{key:`development`,label:T(`Development`),width:`7.5em`,hidden:!0,mobileHidden:!0,tip:T(`Development at the culture's center, 1–100; the heartland and the people's average in the tip`),sortBy:e=>e.i?e.development??33:N[0]??-1},{key:`emblems`,label:T(`Emblems`),width:`7em`,hidden:!0,mobileHidden:!0,sortBy:e=>e.shield||``,sortType:`alpha`},{key:`tags`,label:T(`Tags`),width:`9em`,hidden:!0,sortBy:e=>o.format(e.tags),sortType:`alpha`},{key:`note`,width:`1.1em`},{key:`locate`,width:`1.1em`},{key:`lock`,width:`1.1em`},{key:`remove`,width:`1.4em`,permanent:!0}];function xe(){let e=M?.search?.toLowerCase().trim(),t=pack.cultures.filter(e=>!e.removed);return e?t.filter(t=>o.matches(e,t.name,t.tags,[t.ancestry,t.type])):t}var I=he({dialogId:k,getData:()=>(N=f.getAverages(pack.cells.culture),re(k,xe(),F)),onUpdate:we});function L(){options.app.mode||(M=x.get(k,`filters`,()=>({search:``})),b.closeAll(`#${k}, .stable`),_.show(`cultures`),_.hide(`states`,`biomes`),_.hide(`religions`,`provinces`),Ce(),z(),q(),I.reset(),b.open(k,{title:T(`Cultures Editor`),width:`fit-content`,onClose:qe,position:j}))}function Se(){M.search=r(`culturesSearch`).value,x.set(k,`filters`,M),I.reset()}function Ce(){let e=pack.cultures.some(e=>e.i&&!e.removed&&!!e.ancestry?.trim()),t=F.find(e=>e.key===`ancestry`);t&&(t.hidden=!e),b.destroy(`culturesEditor`);let n=`<div id="culturesEditor" class="dialog stable editorDialog">
    <div id="culturesBody" class="table" data-type="absolute">${fe({dialogId:k,columns:F})}</div>
    <div id="culturesFilters" data-tip="${T(`Apply a filter`)}" class="editorFilters">
      <label for="culturesSearch" data-tip="${T(`Filter by name, ancestry, type, or tag`)}">
        ${T(`Search`)}: <input id="culturesSearch" type="search" />
      </label>
    </div>

    <div id="culturesFooter" class="totalLine">
      <div data-tip="${T(`Cultures number`)}" style="margin-left: 12px">${T(`Cultures`)}:&nbsp;<span id="culturesFooterCultures">0</span></div>
      <div data-tip="${T(`Number of land cells`)}" style="margin-left: 12px" data-col="cells">${T(`Cells`)}:&nbsp;<span id="culturesFooterCells">0</span></div>
      <div data-tip="${T(`Total land area`)}" style="margin-left: 12px" data-col="area">${T(`Land area`)}:&nbsp;<span id="culturesFooterArea">0</span></div>
      <div data-tip="${T(`Total population`)}" style="margin-left: 12px" data-col="population">${T(`Population`)}:&nbsp;<span id="culturesFooterPopulation">0</span></div>
    </div>

    <div id="culturesBottom" class="editorToolbar">
      <button id="culturesEditorRefresh" data-tip="${T(`Refresh`)}" class="icon-cw"></button>
      <button id="culturesEditStyle" data-tip="${T(`Edit style in Style Editor`)}" class="icon-adjust"></button>
      <button id="culturesLegend" data-tip="${T(`Toggle Legend box`)}" class="icon-list-bullet"></button>
      <button id="culturesPercentage" data-tip="${T(`Toggle percentage / absolute values views`)}" class="icon-percent"></button>
      <button id="culturesHeirarchy" data-tip="${T(`Cultures tree`)}" class="icon-sitemap"></button>
      <button id="culturesManually" data-tip="${T(`Manually re-assign cultures`)}" class="icon-brush"></button>
      <button id="culturesEditNamesBase" data-tip="${T(`Edit a database used for names generation`)}" class="icon-font"></button>
      <button id="culturesAdd" data-tip="${E(T(`Add`),T(`Hold Shift to add multiple`))}" class="icon-plus"></button>
      <button id="culturesExport" data-tip="${T(`Save data as a CSV file`)}" class="icon-download"></button>
      <button id="culturesImport" data-tip="${T(`Upload data from a CSV file`)}" class="icon-upload"></button>
      <button id="culturesRecalculate" data-tip="${T(`Recalculate cultures based on current values of growth-related attributes`)}" class="icon-retweet"></button>
      <span
        data-tip="${T(`Allow culture centers, expansion and type changes to take an immediate effect`)}"
        class="editorToolbarPanel"
        style="display: inline-flex"
      >
        <input id="culturesAutoChange" class="checkbox" type="checkbox" />
        <label for="culturesAutoChange" class="checkbox-label"><i>${T(`auto-apply changes`)}</i></label>
      </span>
    </div>
  </div>`;r(`dialogs`).insertAdjacentHTML(`beforeend`,n),r(`culturesSearch`).value=M.search,r(`culturesSearch`).addEventListener(`input`,Se),ae(k,I.reset),ue(k,({cellId:e})=>pack.cells.culture[e]),r(`culturesEditorRefresh`).addEventListener(`click`,R),pe({dialogId:k,columns:F,onUpdate:()=>b.update(k,{width:`fit-content`,position:j})}),r(`culturesEditStyle`).addEventListener(`click`,()=>void a.StyleEditor.open(`cultures`)),r(`culturesLegend`).addEventListener(`click`,He),r(`culturesPercentage`).addEventListener(`click`,J),r(`culturesHeirarchy`).addEventListener(`click`,Y),r(`culturesRecalculate`).addEventListener(`click`,()=>X(!0)),r(`culturesManually`).addEventListener(`click`,Ue),r(`culturesEditNamesBase`).addEventListener(`click`,()=>a.NamesbaseEditor.open()),r(`culturesAdd`).addEventListener(`click`,Ge),r(`culturesExport`).addEventListener(`click`,Q),r(`culturesImport`).addEventListener(`click`,()=>v.pick(Ye))}function R(){z(),I.refresh(),q()}function z(){let{cells:e,cultures:t,burgs:n}=pack;t.forEach(e=>{e.cells=e.area=e.rural=e.urban=0});for(let r of e.i){if(e.h[r]<20)continue;let i=e.culture[r];t[i].cells+=1,t[i].area+=e.area[r],t[i].rural+=e.pop[r];let a=e.burg[r];a&&(t[i].urban+=n[a].population)}}function we(e){let t=g(),n=``,i=0,a=0;for(let t of e.all)i+=h(t.area??0),a+=w((t.rural??0)*options.map.units.population.scale+(t.urban??0)*options.map.units.population.scale*options.map.units.population.urbanization.rate);for(let r of e.rows){let e=h(r.area??0),i=(r.rural??0)*options.map.units.population.scale,a=(r.urban??0)*options.map.units.population.scale*options.map.units.population.urbanization.rate,s=w(i+a),l=E(`${T(`Total population`)}: ${D(s)}`,`${T(`Rural population`)}: ${D(i)}`,`${T(`Urban population`)}: ${D(a)}`,T(`Click to edit`));r.i?n+=`<div
        class="states"
        data-id="${r.i}"
        data-name="${r.name}"
        data-ancestry="${r.ancestry||``}"
        data-color="${r.color}"
        data-cells="${r.cells}"
        data-area="${e}"
        data-population="${s}"
        data-base="${r.base}"
        data-type="${r.type}"
        data-expansionism="${r.expansionism}"
        data-emblems="${r.shield}"
      >
        <fill-box fill="${r.color}" data-col="color"></fill-box>
        <div data-col="name">
          <input data-tip="${E(T(`Name`),T(`Click and type to change`))}" class="cultureName"
            value="${r.name}" autocorrect="off" spellcheck="false" />
          <span data-tip="${T(`Regenerate culture name`)}" class="icon-cw hiddenIcon" style="visibility: hidden"></span>
        </div>
        <div data-col="ancestry">
          <input data-tip="${E(T(`Ancestry`),T(`Culture ancestry or race`),T(`Click and type to change`))}" class="cultureAncestry"
            value="${r.ancestry||``}" autocorrect="off" spellcheck="false" />
        </div>
        <select data-tip="${E(T(`Culture type`),T(`Defines growth model`),T(`Click to change`))}"
          class="cultureType" data-col="type">${B(r.type)}</select>
        <div data-col="base">
          <span data-tip="${T(`Click to re-generate names for burgs with this culture assigned`)}" class="icon-arrows-cw"></span>
          <select data-tip="${E(T(`Culture namesbase`),T(`Click to change`),T(`Click on arrows to re-generate names`))}"
            class="cultureBase">${V(r.base)}</select>
        </div>
        <div data-col="cells">
          <span data-tip="${T(`Number of cells`)}" class="icon-check-empty"></span>
          <div data-tip="${T(`Number of cells`)}" class="cultureCells">${r.cells}</div>
        </div>
        <div data-col="expansionism">
          <span data-tip="${E(T(`Culture expansionism`),T(`Defines competitive size`))}" class="icon-resize-full"></span>
          <input
            data-tip="${E(T(`Culture expansionism`),T(`Defines competitive size`),T(`Click to change, then click Recalculate to apply`))}"
            class="cultureExpan"
            type="number"
            min="0"
            max="99"
            step=".1"
            value=${r.expansionism}
          />
        </div>
        <div data-col="area">
          <span data-tip="${T(`Culture area`)}" class="icon-map-o"></span>
          <div data-tip="${T(`Culture area`)}" class="cultureArea">${D(e)} ${t}</div>
        </div>
        <div data-col="population">
          <span data-tip="${l}" class="icon-male"></span>
          <div data-tip="${l}" class="culturePopulation pointer">${D(s)}</div>
        </div>
        ${A(r)}
        <div data-col="emblems">${H(c.isDiversiform,r.shield)}</div>
        <div data-col="tags">
          <input data-tip="${E(T(`Culture tags`),T(`Click and type to change`))}" class="cultureTags"
            value="${o.format(r.tags)}" autocorrect="off" spellcheck="false" />
        </div>
        ${ie(T(`Edit free text notes (legend)`))}
        <span data-col="locate" data-tip="${T(`Locate on map`)}" class="icon-target"></span>
        <span data-col="lock" data-tip="${T(`Lock`)}" class="icon-lock${r.lock?``:`-open`}"></span>
        <span data-col="remove" data-tip="${T(`Remove`)}" class="icon-trash-empty"></span>
      </div>`:n+=`<div
          class="states"
          data-id="${r.i}"
          data-name="${r.name}"
          data-color=""
          data-cells="${r.cells}"
          data-area="${e}"
          data-population="${s}"
          data-base="${r.base}"
          data-type=""
          data-expansionism=""
          data-emblems="${r.shield}"
        >
          <svg width="11" height="11" class="placeholder" data-col="color"></svg>
          <div data-col="name">
            <input data-tip="${E(T(`Neutral culture name`),T(`Click and type to change`))}" class="cultureName italic"
              value="${r.name}" autocorrect="off" spellcheck="false" />
            <span class="icon-cw placeholder"></span>
          </div>
          <div data-col="ancestry"></div>
          <select class="cultureType placeholder" data-col="type">${B(r.type)}</select>
          <div data-col="base">
            <span data-tip="${T(`Click to re-generate names for burgs with this culture assigned`)}" class="icon-arrows-cw"></span>
            <select data-tip="${E(T(`Culture namesbase`),T(`Click to change`),T(`Click on arrows to re-generate names`))}"
              class="cultureBase">${V(r.base)}</select>
          </div>
          <div data-col="cells">
            <span data-tip="${T(`Number of cells`)}" class="icon-check-empty"></span>
            <div data-tip="${T(`Number of cells`)}" class="cultureCells">${r.cells}</div>
          </div>
          <div data-col="expansionism">
            <span class="icon-resize-full placeholder"></span>
            <input class="cultureExpan placeholder" type="number" />
          </div>
          <div data-col="area">
            <span data-tip="${T(`Culture area`)}" class="icon-map-o"></span>
            <div data-tip="${T(`Culture area`)}" class="cultureArea">${D(e)} ${t}</div>
          </div>
          <div data-col="population">
            <span data-tip="${l}" class="icon-male"></span>
            <div data-tip="${l}" class="culturePopulation pointer">${D(s)}</div>
          </div>
          ${A(r)}
          <div data-col="emblems">${H(c.isDiversiform,r.shield)}</div>
          <div data-col="tags"></div>
          <div data-col="note"></div>
          <div data-col="locate"></div>
          <div data-col="lock"></div>
          <div data-col="remove"></div>
        </div>`}let s=r(`culturesBody`);s.querySelectorAll(`:scope > .states`).forEach(e=>{e.remove()}),s.insertAdjacentHTML(`beforeend`,n),r(`culturesFooterCultures`).innerHTML=String(pack.cultures.filter(e=>e.i&&!e.removed).length),r(`culturesFooterCells`).innerHTML=String(pack.cells.h.filter(e=>e>=20).length),r(`culturesFooterArea`).innerHTML=`${D(i)} ${t}`,r(`culturesFooterPopulation`).innerHTML=D(a),r(`culturesFooterArea`).dataset.area=String(i),r(`culturesFooterPopulation`).dataset.population=String(a),de(r(`culturesFooter`),e,I.goto),r(`culturesBody`).querySelectorAll(`:scope > div.states`).forEach(e=>{e.addEventListener(`mouseenter`,G),e.addEventListener(`mouseleave`,K)}),r(`culturesBody`).querySelectorAll(`fill-box`).forEach(e=>void e.addEventListener(`click`,Te)),r(`culturesBody`).querySelectorAll(`div > input.cultureName`).forEach(e=>void e.addEventListener(`input`,Ee)),r(`culturesBody`).querySelectorAll(`div > input.cultureAncestry`).forEach(e=>void e.addEventListener(`input`,De)),r(`culturesBody`).querySelectorAll(`div > input.cultureTags`).forEach(e=>void e.addEventListener(`change`,Oe)),r(`culturesBody`).querySelectorAll(`div > span.icon-cw`).forEach(e=>void e.addEventListener(`click`,ke)),r(`culturesBody`).querySelectorAll(`div > input.cultureExpan`).forEach(e=>void e.addEventListener(`change`,Ae)),r(`culturesBody`).querySelectorAll(`div > input.cultureDevelopment`).forEach(e=>void e.addEventListener(`change`,je)),r(`culturesBody`).querySelectorAll(`div > select.cultureType`).forEach(e=>void e.addEventListener(`change`,Me)),r(`culturesBody`).querySelectorAll(`div > select.cultureBase`).forEach(e=>void e.addEventListener(`change`,Ne)),r(`culturesBody`).querySelectorAll(`div > select.cultureEmblems`).forEach(e=>void e.addEventListener(`change`,Pe)),r(`culturesBody`).querySelectorAll(`div > div.culturePopulation`).forEach(e=>void e.addEventListener(`click`,Fe)),r(`culturesBody`).querySelectorAll(`div > span.icon-arrows-cw`).forEach(e=>void e.addEventListener(`click`,Ie)),r(`culturesBody`).querySelectorAll(`div > span.icon-book`).forEach(e=>void e.addEventListener(`click`,Re)),r(`culturesBody`).querySelectorAll(`div > span.icon-target`).forEach(e=>void e.addEventListener(`click`,ze)),r(`culturesBody`).querySelectorAll(`div > span.icon-trash-empty`).forEach(e=>void e.addEventListener(`click`,Be)),r(`culturesBody`).querySelectorAll(`div > span.icon-lock`).forEach(e=>void e.addEventListener(`click`,$)),r(`culturesBody`).querySelectorAll(`div > span.icon-lock-open`).forEach(e=>void e.addEventListener(`click`,$)),me(k,c.isDiversiform?[]:[`emblems`]),r(`culturesBody`).dataset.type===`percentage`&&(r(`culturesBody`).dataset.type=`absolute`,J()),b.update(k,{width:`fit-content`,position:j})}function B(e){let t=``;return d.forEach(n=>{t+=`<option ${e===n?`selected`:``} value="${n}">${u[n]??n}</option>`}),t}function V(e){let t=``;return m.nameBases.forEach((n,r)=>{t+=`<option ${e===r?`selected`:``} value="${r}">${n.name}</option>`}),m.nameBases[e]||(t+=`<option selected value="${e}">${T(`removed`)}</option>`),t}function H(e,t){if(!e)return``;let n=Object.keys(c.shields.types).flatMap(e=>Object.keys(c.shields[e])).map(e=>`<option ${e===t?`selected`:``} value="${e}">${s[e]??e}</option>`);return`<select data-tip="${E(T(`Emblem shape associated with culture`),T(`Click to change`))}" class="cultureEmblems">${n}</select>`}var U=e=>Number(`data`in e?e.id:e.target?.dataset.id),W=e=>`data`in e&&e.data.shadow?e.data.name:null,G=C(e=>{if(!_.isOn(`cultures`)||options.app.mode)return;let n=t().duration(2e3).ease(se),r=W(e);if(r!==null){let e=pack.cultures.filter(e=>e.i&&!e.removed&&e.ancestry?.trim()===r);for(let t of e)i(`#cults`).select(`#culture${t.i}`).raise().transition(n).attr(`stroke-width`,2.5).attr(`stroke`,`#d0240f`),i(`#debug`).select(`#cultureCenter${t.i}`).raise().transition(n).attr(`r`,`6em`).attr(`stroke`,`#d0240f`);return}let a=U(e);i(`#cults`).select(`#culture${a}`).raise().transition(n).attr(`stroke-width`,2.5).attr(`stroke`,`#d0240f`),i(`#debug`).select(`#cultureCenter${a}`).raise().transition(n).attr(`r`,`6em`).attr(`stroke`,`#d0240f`)},200);function K(e){if(!_.isOn(`cultures`))return;let t=W(e);if(t!==null){let e=pack.cultures.filter(e=>e.i&&!e.removed&&e.ancestry?.trim()===t);for(let t of e)i(`#cults`).select(`#culture${t.i}`).transition().attr(`stroke-width`,null).attr(`stroke`,null),i(`#debug`).select(`#cultureCenter${t.i}`).transition().attr(`r`,`4em`).attr(`stroke`,null);return}let n=U(e);i(`#cults`).select(`#culture${n}`).transition().attr(`stroke-width`,null).attr(`stroke`,null),i(`#debug`).select(`#cultureCenter${n}`).transition().attr(`r`,`4em`).attr(`stroke`,null)}function Te(){let e=this.getAttribute(`fill`)||`#ffffff`,t=+this.parentNode.dataset.id;a.ColorPicker.open(e,e=>{this.fill=e,pack.cultures[t].color=e,i(`#cults`).select(`#culture${t}`).attr(`fill`,e),i(`#debug`).select(`#cultureCenter${t}`).attr(`fill`,e)})}function Ee(){let e=this.closest(`.states`),t=+e.dataset.id;e.dataset.name=this.value,this.value.trim()&&p.rename(t,this.value)}function De(){let e=this.closest(`.states`),t=+e.dataset.id;e.dataset.ancestry=this.value.trim(),p.setAncestry(t,this.value)}function Oe(){let e=+this.closest(`.states`).dataset.id;o.set(pack.cultures[e],this.value),this.value=o.format(pack.cultures[e].tags),M.search&&I.refresh()}function ke(){let e=+this.closest(`.states`).dataset.id,t=pack.cultures[e].base;if(!m.nameBases[t]){S(T(`Namesbase is not defined, please select a valid namesbase`),!1,`error`,5e3);return}let n=m.getCultureShort(e);this.parentNode.querySelector(`input.cultureName`).value=n,p.rename(e,n)}function Ae(){let e=this.closest(`.states`),t=+e.dataset.id;e.dataset.expansionism=this.value,+this.value>=0&&+this.value<=99&&(p.setExpansionism(t,+this.value),X())}function je(){let e=pack.cultures[+this.closest(`.states`).dataset.id],t=Math.round(+this.value);t>=1&&t<=100&&p.setDevelopment(e.i,t),this.value=String(e.development??33)}function Me(){let e=+this.parentNode.dataset.id;this.parentNode.dataset.type=this.value;let t=this.value;pack.cultures[e].type=t,X()}function Ne(){let e=this.closest(`.states`),t=+e.dataset.id,n=+this.value;p.setBase(t,n),e.dataset.base=String(n)}function Pe(){let e=this.closest(`.states`),t=+e.dataset.id;p.setEmblemShape(t,this.value),e.dataset.emblems=pack.cultures[t].shield;let r=(e,t)=>{let r=n(e);r&&t&&(r.remove(),ce.trigger(e,t))};for(let e of pack.states)e.i&&e.culture===t&&r(`stateCOA${e.i}`,e.coa);for(let e of pack.provinces)e.i&&pack.cells.culture[e.center]===t&&r(`provinceCOA${e.i}`,e.coa);for(let e of pack.burgs)e?.i&&e.culture===t&&r(`burgCOA${e.i}`,e.coa)}function Fe(){let e=+this.closest(`.states`).dataset.id,t=pack.cultures[e];if(!t.cells){S(T(`No cells, cannot change population`),!1,`error`);return}let n=w((t.rural??0)*options.map.units.population.scale),i=w((t.urban??0)*options.map.units.population.scale*options.map.units.population.urbanization.rate),a=n+i,o=e=>Number(e).toLocaleString(),s=pack.burgs.filter(t=>!t.removed&&t.culture===e);b.message({message:`<div>
    <i>${T(`Change population of all cells assigned to the culture`)}</i>
    <div style="margin: 0.5em 0">
      ${T(`Rural`)}: <input type="number" min="0" step="1" id="ruralPop" value=${n} style="width:6em" />
      ${T(`Urban`)}: <input type="number" min="0" step="1" id="urbanPop" value=${i} style="width:6em"
        ${s.length?``:`disabled`} />
    </div>
    <div>${T(`Total population`)}: ${o(a)} ⇒ <span id="totalPop">${o(a)}</span>
      (<span id="totalPopPerc">100</span>%)
    </div>
  </div>`,title:T(`Change culture population`),width:`24em`,buttons:[{label:T(`Apply`),onClick:()=>{try{p.setPopulation(e,+c.value||0,+l.value||0)}catch(e){return S(O(e),!1,`error`),!1}_.draw(`population`),R()}},{label:T(`Cancel`)}]});let c=r(`ruralPop`),l=r(`urbanPop`),u=r(`totalPop`),d=r(`totalPopPerc`),f=()=>{let e=c.valueAsNumber+l.valueAsNumber;Number.isNaN(e)||(u.innerHTML=o(e),d.innerHTML=String(w(e/a*100)))};c.oninput=()=>f(),l.oninput=()=>f()}function Ie(){let e=+this.closest(`.states`).dataset.id,t=pack.cultures[e].base;if(!m.nameBases[t]){S(T(`Namesbase is not defined, please select a valid namesbase`),!1,`error`,5e3);return}let n=pack.burgs.filter(t=>t.culture===e&&!t.removed&&!t.lock);for(let t of n)l.rename(t.i,m.getCulture(e));_.draw(`labels`),S(T(`Burg names regenerated: {{burgs}}`,{burgs:n.length}),!1,`success`)}function Le(e){i(`#cults`).select(`#culture${e}`).remove(),i(`#debug`).select(`#cultureCenter${e}`).remove(),p.remove(e),R()}function Re(){let e=+this.closest(`.states`).dataset.id;a.NotesEditor.open({type:`culture`,id:e})}function ze(){let e=+this.closest(`.states`).dataset.id;ge(i(`#cults`).select(`#culture${e}`).node(),4)}function Be(){if(options.app.mode)return;let e=+this.closest(`.states`).dataset.id;b.confirm({title:T(`Remove`),message:`${T(`Are you sure you want to remove the culture?`)}<br>${T(`This action cannot be reverted`)}`,confirm:T(`Remove`),onConfirm:()=>Le(e)})}function q(){let e=T(`Drag to move the culture center (ancestral home)`),t=i(`#debug`);t.select(`#cultureCenters`).remove();let n=t.append(`g`).attr(`id`,`cultureCenters`).attr(`stroke`,`#444444`).style(`cursor`,`move`),a=pack.cultures.filter(e=>e.i&&!e.removed);n.selectAll(`circle`).data(a).enter().append(`circle`).attr(`id`,e=>`cultureCenter${e.i}`).attr(`data-id`,e=>e.i).attr(`r`,`4em`).attr(`fill`,e=>e.color??null).attr(`cx`,e=>pack.cells.p[e.center][0]).attr(`cy`,e=>pack.cells.p[e.center][1]).on(`mouseenter`,(t,n)=>{S(e,!0),r(`culturesBody`).querySelector(`div[data-id='${n.i}']`)?.classList.add(`selected`),G(t)}).on(`mouseleave`,(e,t)=>{S(``,!0),r(`culturesBody`).querySelector(`div[data-id='${t.i}']`)?.classList.remove(`selected`),K(e)}).call(oe().on(`start`,Ve))}function Ve(e){let t=+this.id.slice(13),n=ye(this.getAttribute(`transform`)),r=+n[0]-e.x,i=+n[1]-e.y;function a(e){let{x:n,y:a}=e;this.setAttribute(`transform`,`translate(${r+n},${i+a})`);let o=te.findCell(n,a);if(!(o==null||pack.cells.h[o]<20)){try{p.moveCenter(t,n,a)}catch(e){S(e instanceof Error?e.message:String(e),!1,`error`,2e3);return}X()}}let o=C(a,50);e.on(`drag`,o)}function He(){le.toggle(be,()=>pack.cultures.filter(e=>e.i&&!e.removed&&e.cells).sort((e,t)=>(t.area??0)-(e.area??0)).map(e=>[e.i,e.color??``,e.name]),T(`No cultures to show`))}function J(){if(r(`culturesBody`).dataset.type===`absolute`){r(`culturesBody`).dataset.type=`percentage`;let e=+r(`culturesFooterCells`).textContent,t=+r(`culturesFooterArea`).dataset.area,n=+r(`culturesFooterPopulation`).dataset.population;r(`culturesBody`).querySelectorAll(`:scope > div.states`).forEach(r=>{let{cells:i,area:a,population:o}=r.dataset;r.querySelector(`.cultureCells`).textContent=`${w(+i/e*100)}%`,r.querySelector(`.cultureArea`).textContent=`${w(+a/t*100)}%`,r.querySelector(`.culturePopulation`).textContent=`${w(+o/n*100)}%`})}else r(`culturesBody`).dataset.type=`absolute`,I.refresh()}async function Y(){options.app.mode||a.HierarchyTree.open({type:`cultures`,data:pack.cultures,onNodeEnter:G,onNodeLeave:K,getDescription:e=>{if(e.shadow)return T(`{{- ancestry}} ancestry`,{ancestry:e.name});let{name:t,type:n,rural:r,urban:i}=e,a=(r??0)*options.map.units.population.scale+(i??0)*options.map.units.population.scale*options.map.units.population.urbanization.rate,o=a>0?T(`{{- population}} people`,{population:D(w(a))}):T(`Extinct`);return E(T(`{{- culture}} culture`,{culture:t}),u[n]??n,o)},getShape:({type:e,shadow:t})=>{if(t||e===`Generic`)return`circle`;if(e===`River`)return`diamond`;if(e===`Lake`)return`hexagon`;if(e===`Naval`)return`square`;if(e===`Highland`)return`concave`;if(e===`Nomadic`)return`octagon`;if(e===`Hunting`)return`pentagon`}})}function X(e){(e||r(`culturesAutoChange`).checked)&&(p.recalculate(),_.draw(`cultures`),R())}function Ue(){_.show(`cultures`),a.PaintEditor.open({title:T(`Paint Cultures`),parentDialogId:k,onClose:L,items:pack.cultures.filter(e=>!e.removed).map(e=>({id:e.i,name:e.name,color:e.color||`#ffffff`,lock:!!e.lock})),dontOverrideControl:!0,getValue:e=>pack.cells.culture[e],filterCell:e=>ee(e,pack),onApply:We})}function We(e){for(let[t,n]of ve(e))p.setCells(t,n);e.size&&(_.draw(`cultures`),n(k)&&R())}function Ge(){this.classList.contains(`pressed`)?Z():(options.app.mode=`addCulture`,this.classList.add(`pressed`),S(T(`Click on the map to add a new culture`),!0),i(`#viewbox`).style(`cursor`,`crosshair`).on(`click`,Ke),r(`culturesBody`).querySelectorAll(`div > input, select, span, svg`).forEach(e=>{e.style.pointerEvents=`none`}))}function Z(){options.app.mode=null,ne(),_e(),r(`culturesBody`).querySelectorAll(`div > input, select, span, svg`).forEach(e=>{e.style.removeProperty(`pointer-events`)});let e=r(`culturesAdd`);e.classList.contains(`pressed`)&&e.classList.remove(`pressed`)}function Ke(t){let[n,r]=e(t,this);try{p.add(n,r)}catch(e){S(O(e),!1,`error`);return}t.shiftKey===!1&&Z(),q(),I.refresh()}function Q(){let e=g(`2`),t=P.map(t=>t===`Area`?`Area ${e}`:t),n=I.view().all.map(e=>{let t=h(e.area??0),n=w((e.rural??0)*options.map.units.population.scale+(e.urban??0)*options.map.units.population.scale*options.map.units.population.urbanization.rate),r=m.nameBases[e.base].name,i=(e.origins??[]).filter(e=>!!e).map(e=>pack.cultures[e].name);return[e.i,e.name,e.i&&e.ancestry||``,e.i&&e.color||``,e.cells||0,e.i?e.expansionism||0:``,e.i?e.development??33:``,e.i?e.type:``,t,n,r,e.shield,i.join(`, `),o.format(e.tags)]});v.download(`Cultures`,t,n)}function qe(){i(`#debug #cultureCenters`).remove(),options.app.mode===`addCulture`&&Z(),N=[],b.destroy(`culturesEditor`)}var Je=e=>(e.origins??[]).filter(e=>!!e).map(e=>pack.cultures[e].name).join(`, `);async function Ye(e){let{scale:t,urbanization:n}=options.map.units.population,r=e=>pack.cultures[e]?.removed?void 0:pack.cultures[e],i=pack.cultures.filter(e=>!e.removed),s=new Map(i.map(e=>[e.i,Je(e)])),c=new Map(i.map(e=>[e.name,e.i])),l=e=>c.get(e)??v.byName(pack.cultures,e).i;await a.CsvUpload.update(e,P,{find:r,units:[`Area`],text:[`Name`,`Ancestry`,`Tags`]},(e,i)=>{let a=r(e);i.apply(`Name`,t=>p.rename(e,t),a.name),i.apply(`Ancestry`,t=>p.setAncestry(e,t),a.ancestry),i.apply(`Color`,t=>p.recolor(e,t),a.color),i.apply(`Expansionism`,t=>p.setExpansionism(e,+t),a.expansionism),i.apply(`Development`,t=>p.setDevelopment(e,+t),a.development),i.apply(`Type`,t=>p.setType(e,t),a.type),i.apply(`Namesbase`,t=>p.setBase(e,m.nameBases.indexOf(v.byName(m.nameBases,t))),m.nameBases[a.base]?.name),i.apply(`Emblems Shape`,t=>p.setEmblemShape(e,t),a.shield),i.assign(`Origins`,t=>p.setOrigins(e,t?t.split(`,`).map(e=>l(e.trim())):[0]),s.get(e)),i.assign(`Tags`,e=>o.set(a,e),o.format(a.tags)),i.population([(a.rural??0)*t,(a.urban??0)*t*n.rate],(t,n)=>p.setPopulation(e,t,n),[`Population`])})&&(_.draw(`cultures`,`emblems`),R())}function $(){if(options.app.mode)return;let e=+this.closest(`.states`).dataset.id,t=this.classList;p.setLocked(e,!pack.cultures[e].lock),t.toggle(`icon-lock-open`),t.toggle(`icon-lock`)}var Xe={open:L,showHierarchy:Y};export{Xe as CulturesEditor};