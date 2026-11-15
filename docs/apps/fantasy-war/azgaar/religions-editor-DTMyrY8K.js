import{a as e,d as t,i as n,r,z as i}from"./node-utils-Ds1sVy-v.js";import{t as a}from"./controllers-Dbv1ZRTV.js";import{C as o,H as s,U as c}from"./options-model-CrstL1Qd.js";import{a as l,t as u}from"./pack-generator-DTsfQ82D.js";import{_ as d,c as f,d as p,q as m,s as ee}from"./app-DCKsq5m8.js";import{a as h,o as g}from"./units-CYDspnRH.js";import{t as te}from"./drag-CCSsgLNP.js";import{Nt as ne,n as re,t as _}from"./layers-DjWzCbYN.js";import{t as v}from"./csv-BoSHm6Vn.js";import{t as y}from"./dialog-BkeQgjla.js";import{t as ie}from"./highlighting-C3iNJ2tq.js";import{t as b}from"./state-B2hBYDzv.js";import{a as ae,i as oe,n as se,r as ce}from"./table-DPmN0izx.js";import{n as x}from"./highlight-CBuOTLhq.js";import{o as S,t as le}from"./tooltips-BVQbACdS.js";import{a as C,v as ue}from"./notices-6lBE5Kkn.js";import{O as w,a as T,g as E,i as D,k as O,p as k}from"./index-sNerCVjG.js";var A=`religionsEditor`,j=[`Id`,`Name`,`Color`,`Type`,`Form`,`Supreme Deity`,`Culture`,`Area`,`Cells`,`Believers`,`Origins`,`Potential`,`Expansionism`,`Tags`],de=`Religions`,M={my:`right top`,at:`right-10 top+10`,of:`svg`},N,P=[{key:`color`,width:`1.2em`,permanent:!0},{key:`name`,label:T(`Religion`),width:`14em`,permanent:!0,sortBy:e=>e.name||``,sortType:`alpha`},{key:`type`,label:T(`Type`),width:`7.5em`,defaultSort:`asc`,sortBy:e=>e.type||``,sortType:`alpha`},{key:`form`,label:T(`Form`),width:`7em`,mobileHidden:!0,sortBy:e=>e.form||``,sortType:`alpha`},{key:`deity`,label:T(`Deity`),width:`14em`,mobileHidden:!0,sortBy:e=>e.deity||``,sortType:`alpha`},{key:`area`,label:T(`Area`),width:`7em`,mobileHidden:!0,sortBy:e=>e.area||0},{key:`population`,label:T(`Population`),width:`6em`,sortBy:e=>(e.rural||0)*options.map.units.population.scale+(e.urban||0)*options.map.units.population.scale*options.map.units.population.urbanization.rate},{key:`expansion`,label:T(`Expansion`),width:`5em`,hidden:!0,mobileHidden:!0,sortBy:e=>e.expansion||``,sortType:`alpha`},{key:`expansionism`,label:T(`Expansionism`),width:`5em`,hidden:!0,mobileHidden:!0,sortBy:e=>e.expansionism||0},{key:`tags`,label:T(`Tags`),width:`10em`,hidden:!0,sortBy:e=>o.format(e.tags),sortType:`alpha`},{key:`note`,width:`1.1em`},{key:`locate`,width:`1.1em`},{key:`lock`,width:`1.1em`},{key:`remove`,width:`1.4em`,permanent:!0}];function fe(){let e=N?.search?.toLowerCase().trim(),t=pack.religions.filter(e=>!e.removed&&!(e.i&&!e.cells&&!N.showExtinct));return e?t.filter(t=>o.matches(e,t.name,t.tags,[t.deity,t.form,t.type])):t}var F=ce({dialogId:A,getData:()=>f(A,fe(),P),onUpdate:B});function I(){options.app.mode||(N=b.get(A,`filters`,()=>({showExtinct:!1,search:``})),y.closeAll(`#${A}, .stable`),_.show(`religions`),_.hide(`states`,`biomes`),_.hide(`cultures`,`provinces`),L(),z(),K(),F.reset(),y.open(A,{title:T(`Religions Editor`),width:`fit-content`,onClose:Le,position:M}))}function pe(){N.search=r(`religionsSearch`).value,b.set(A,`filters`,N),F.reset()}function L(){y.destroy(`religionsEditor`);let e=`<div id="religionsEditor" class="dialog stable editorDialog">
    <div id="religionsBody" class="table" data-type="absolute">${oe({dialogId:A,columns:P})}</div>
    <div id="religionsFilters" data-tip="${T(`Apply a filter`)}" class="editorFilters">
      <label for="religionsSearch" data-tip="${T(`Filter by name, deity, form, type, or tag`)}">
        ${T(`Search`)}: <input id="religionsSearch" type="search" />
      </label>
    </div>

    <div id="religionsFooter" class="totalLine">
      <div data-tip="${T(`Total number of organized religions`)}" style="margin-left: 12px">
        ${T(`Organized`,{context:`count`})}:&nbsp;<span id="religionsOrganized">0</span>
      </div>
      <div data-tip="${T(`Total number of heresies`)}" style="margin-left: 12px">
        ${T(`Heresies`)}:&nbsp;<span id="religionsHeresies">0</span>
      </div>
      <div data-tip="${T(`Total number of cults`)}" style="margin-left: 12px">
        ${T(`Cults`)}:&nbsp;<span id="religionsCults">0</span>
      </div>
      <div data-tip="${T(`Total number of folk religions`)}" style="margin-left: 12px">
        ${T(`Folk`,{context:`count`})}:&nbsp;<span id="religionsFolk">0</span>
      </div>
      <div data-tip="${T(`Total land area`)}" style="margin-left: 12px" data-col="area">
        ${T(`Land area`)}:&nbsp;<span id="religionsFooterArea">0</span>
      </div>
      <div data-tip="${T(`Total number of believers (population)`)}" style="margin-left: 12px" data-col="population">
        ${T(`Believers`)}:&nbsp;<span id="religionsFooterPopulation">0</span>
      </div>
    </div>

    <div id="religionsBottom" class="editorToolbar">
      <button id="religionsEditorRefresh" data-tip="${T(`Refresh`)}" class="icon-cw"></button>
      <button id="religionsEditStyle" data-tip="${T(`Edit style in Style Editor`)}" class="icon-adjust"></button>
      <button id="religionsLegend" data-tip="${T(`Toggle Legend box`)}" class="icon-list-bullet"></button>
      <button id="religionsPercentage" data-tip="${T(`Toggle percentage / absolute values views`)}" class="icon-percent"></button>
      <button id="religionsHeirarchy" data-tip="${T(`Religions tree`)}" class="icon-sitemap"></button>
      <button id="religionsExtinct" data-tip="${T(`Show/hide extinct religions (religions without cells)`)}" class="icon-eye-off"></button>

      <button id="religionsManually" data-tip="${T(`Manually re-assign religions`)}" class="icon-brush"></button>
      <button id="religionsAdd" data-tip="${D(T(`Add`),T(`Hold Shift to add multiple`))}" class="icon-plus"></button>
      <button id="religionsExport" data-tip="${T(`Save data as a CSV file`)}" class="icon-download"></button>
      <button id="religionsImport" data-tip="${T(`Upload data from a CSV file`)}" class="icon-upload"></button>
      <button id="religionsRecalculate" data-tip="${T(`Recalculate religions based on current values of growth-related attributes`)}" class="icon-retweet"></button>
      <span
        data-tip="${T(`Allow religion center, extent, and expansionism changes to take an immediate effect`)}"
        class="editorToolbarPanel"
      >
        <input id="religionsAutoChange" class="checkbox" type="checkbox" />
        <label for="religionsAutoChange" class="checkbox-label"><i>${T(`auto-apply changes`)}</i></label>
      </span>
    </div>
  </div>`;r(`dialogs`).insertAdjacentHTML(`beforeend`,e),Y();let t=r(`religionsSearch`);t.value=N.search??``,t.addEventListener(`input`,pe),ee(A,F.reset),ie(A,({cellId:e})=>pack.cells.religion[e]),r(`religionsEditorRefresh`).addEventListener(`click`,R),se({dialogId:A,columns:P,onUpdate:()=>y.update(A,{width:`fit-content`,position:M})}),r(`religionsEditStyle`).addEventListener(`click`,()=>void a.StyleEditor.open(`religions`)),r(`religionsLegend`).addEventListener(`click`,Oe),r(`religionsPercentage`).addEventListener(`click`,q),r(`religionsHeirarchy`).addEventListener(`click`,J),r(`religionsExtinct`).addEventListener(`click`,ke),r(`religionsManually`).addEventListener(`click`,Ae),r(`religionsAdd`).addEventListener(`click`,Me),r(`religionsExport`).addEventListener(`click`,Pe),r(`religionsImport`).addEventListener(`click`,()=>v.pick(ze)),r(`religionsRecalculate`).addEventListener(`click`,()=>Q(!0))}function R(){z(),F.refresh()}function z(){let{cells:e,religions:t,burgs:n}=pack;t.forEach(e=>{e.cells=e.area=e.rural=e.urban=0});for(let r of e.i){if(e.h[r]<20)continue;let i=e.religion[r];t[i].cells+=1,t[i].area+=e.area[r],t[i].rural+=e.pop[r];let a=e.burg[r];a&&(t[i].urban+=n[a].population)}}function B(e){let t=` ${g()}`,n=``,i=0,a=0;for(let t of e.all)i+=h(t.area??0),a+=w((t.rural??0)*options.map.units.population.scale+(t.urban??0)*options.map.units.population.scale*options.map.units.population.urbanization.rate);for(let r of e.rows){let e=h(r.area??0),i=(r.rural??0)*options.map.units.population.scale,a=(r.urban??0)*options.map.units.population.scale*options.map.units.population.urbanization.rate,s=w(i+a),c=D(T(`Believers: {{total}}; Rural areas: {{rural}}; Urban areas: {{urban}}`,{total:O(s),rural:O(i),urban:O(a)}),T(`Click to change`));r.i?n+=`<div
      class="states"
      data-id=${r.i}
      data-name="${r.name}"
      data-color="${r.color}"
      data-area=${e}
      data-population=${s}
      data-type="${r.type}"
      data-form="${r.form}"
      data-deity="${r.deity||``}"
      data-expansion="${r.expansion}"
      data-expansionism="${r.expansionism}"
    >
      <fill-box fill="${r.color}" data-col="color"></fill-box>
      <input data-tip="${D(T(`Name`),T(`Click and type to change`))}" class="religionName"
        value="${r.name}" autocorrect="off" spellcheck="false" data-col="name" />
      <select data-tip="${T(`Religion type`)}" class="religionType" data-col="type">
        ${V(r.type)}
      </select>
      <input data-tip="${T(`Religion form`)}" class="religionForm"
        value="${r.form}" autocorrect="off" spellcheck="false" data-col="form" />
      <div data-col="deity">
        <span data-tip="${T(`Click to re-generate supreme deity`)}" class="icon-arrows-cw pointer"></span>
        <input data-tip="${T(`Religion supreme deity`)}" class="religionDeity"
          value="${r.deity||``}" autocorrect="off" spellcheck="false" />
      </div>
      <div data-col="area">
        <span data-tip="${T(`Religion area`)}" style="padding-right: 4px" class="icon-map-o"></span>
        <div data-tip="${T(`Religion area`)}" class="religionArea">${O(e)+t}</div>
      </div>
      <div data-col="population">
        <span data-tip="${c}" class="icon-male"></span>
        <div data-tip="${c}" class="religionPopulation pointer">${O(s)}</div>
      </div>
      ${me(r)}
      <div data-col="tags">
        <input
          data-tip="${T(`Tags (comma-separated)`)}"
          class="religionTags"
          value="${o.format(r.tags)}"
          placeholder="${T(`Tags`)}"
          autocorrect="off"
          spellcheck="false"
        />
      </div>
      ${p(T(`Edit free text notes (legend)`))}
      <span data-col="locate" data-tip="${T(`Locate on map`)}" class="icon-target"></span>
      <span data-col="lock" data-tip="${T(`Lock`)}" class="icon-lock${r.lock?``:`-open`}"></span>
      <span data-col="remove" data-tip="${T(`Remove`)}" class="icon-trash-empty"></span>
    </div>`:n+=`<div
        class="states"
        data-id="${r.i}"
        data-name="${r.name}"
        data-color=""
        data-area="${e}"
        data-population="${s}"
        data-type=""
        data-form=""
        data-deity=""
        data-expansion=""
        data-expansionism=""
      >
        <svg width="9" height="9" class="placeholder" data-col="color"></svg>
        <input data-tip="${D(T(`Name`),T(`Click and type to change`))}" class="religionName italic"
          value="${r.name}" autocorrect="off" spellcheck="false" data-col="name" />
        <select data-tip="${T(`Religion type`)}" class="religionType placeholder" data-col="type">
          ${V(r.type)}
        </select>
        <input data-tip="${T(`Religion form`)}" class="religionForm placeholder" value="" autocorrect="off" spellcheck="false" data-col="form" />
        <div data-col="deity">
          <span class="icon-arrows-cw placeholder"></span>
          <input class="religionDeity placeholder" value="" autocorrect="off" spellcheck="false" />
        </div>
        <div data-col="area">
          <span data-tip="${T(`Religion area`)}" style="padding-right: 4px" class="icon-map-o"></span>
          <div data-tip="${T(`Religion area`)}" class="religionArea">${O(e)+t}</div>
        </div>
        <div data-col="population">
          <span data-tip="${c}" class="icon-male"></span>
          <div data-tip="${c}" class="religionPopulation pointer">${O(s)}</div>
        </div>
        <div data-col="expansion">
          <span class="icon-resize-full-alt placeholder" style="padding-right: 2px"></span>
          <span class="religionExtent placeholder">n/a</span>
        </div>
        <div data-col="expansionism">
          <span class="icon-resize-full placeholder"></span>
          <input class="religionExpantion placeholder" disabled type="number" value="0" />
        </div>
        <div data-col="tags"></div>
        <div data-col="note"></div>
        <div data-col="locate"></div>
        <div data-col="lock"></div>
        <div data-col="remove"></div>
      </div>`}let s=r(`religionsBody`);s.querySelectorAll(`:scope > .states`).forEach(e=>{e.remove()}),s.insertAdjacentHTML(`beforeend`,n);let c=pack.religions.filter(e=>e.i&&!e.removed);r(`religionsOrganized`).innerHTML=String(c.filter(e=>e.type===`Organized`).length),r(`religionsHeresies`).innerHTML=String(c.filter(e=>e.type===`Heresy`).length),r(`religionsCults`).innerHTML=String(c.filter(e=>e.type===`Cult`).length),r(`religionsFolk`).innerHTML=String(c.filter(e=>e.type===`Folk`).length),r(`religionsFooterArea`).innerHTML=O(i)+t,r(`religionsFooterPopulation`).innerHTML=O(a),r(`religionsFooterArea`).dataset.area=String(i),r(`religionsFooterPopulation`).dataset.population=String(a),ae(r(`religionsFooter`),e,F.goto),r(`religionsBody`).querySelectorAll(`:scope > .states`).forEach(e=>{e.addEventListener(`mouseenter`,U),e.addEventListener(`mouseleave`,W)}),r(`religionsBody`).querySelectorAll(`fill-box`).forEach(e=>void e.addEventListener(`click`,G)),r(`religionsBody`).querySelectorAll(`div > input.religionName`).forEach(e=>void e.addEventListener(`input`,ge)),r(`religionsBody`).querySelectorAll(`div > select.religionType`).forEach(e=>void e.addEventListener(`change`,_e)),r(`religionsBody`).querySelectorAll(`div > input.religionForm`).forEach(e=>void e.addEventListener(`input`,ve)),r(`religionsBody`).querySelectorAll(`div > input.religionDeity`).forEach(e=>void e.addEventListener(`input`,ye)),r(`religionsBody`).querySelectorAll(`div > span.icon-arrows-cw`).forEach(e=>void e.addEventListener(`click`,xe)),r(`religionsBody`).querySelectorAll(`div > div.religionPopulation`).forEach(e=>void e.addEventListener(`click`,Se)),r(`religionsBody`).querySelectorAll(`div > select.religionExtent`).forEach(e=>void e.addEventListener(`change`,Ce)),r(`religionsBody`).querySelectorAll(`div > input.religionExpantion`).forEach(e=>void e.addEventListener(`change`,we)),r(`religionsBody`).querySelectorAll(`div > input.religionTags`).forEach(e=>void e.addEventListener(`change`,be)),r(`religionsBody`).querySelectorAll(`div > span.icon-trash-empty`).forEach(e=>void e.addEventListener(`click`,Te)),r(`religionsBody`).querySelectorAll(`div > span.icon-book`).forEach(e=>void e.addEventListener(`click`,Fe)),r(`religionsBody`).querySelectorAll(`div > span.icon-target`).forEach(e=>void e.addEventListener(`click`,Ie)),r(`religionsBody`).querySelectorAll(`div > span.icon-lock`).forEach(e=>void e.addEventListener(`click`,Z)),r(`religionsBody`).querySelectorAll(`div > span.icon-lock-open`).forEach(e=>void e.addEventListener(`click`,Z)),r(`religionsBody`).dataset.type===`percentage`&&(r(`religionsBody`).dataset.type=`absolute`,q()),y.update(A,{width:`fit-content`,position:M})}function V(e){let t=``;return[`Folk`,`Organized`,`Cult`,`Heresy`].forEach(n=>{t+=`<option ${e===n?`selected`:``} value="${n}">${c[n]??n}</option>`}),t}function me(e){if(e.type===`Folk`){let e=T(`Folk religions are not competitive and do not expand. Initially they cover all cells of their parent culture, but get ousted by organized religions when they expand`);return`
      <div data-col="expansion">
        <span data-tip="${e}" class="icon-resize-full-alt" style="padding-right: 2px"></span>
        <span data-tip="${e}" class="religionExtent">${T(`culture`)}</span>
      </div>
      <div data-col="expansionism">
        <span data-tip="${e}" class="icon-resize-full"></span>
        <input data-tip="${e}" class="religionExpantion" disabled type="number" value='0' />
      </div>`}return`
    <div data-col="expansion">
      <span data-tip="${T(`Potential religion extent`)}" class="icon-resize-full-alt" style="padding-right: 2px"></span>
      <select data-tip="${T(`Potential religion extent`)}" class="religionExtent">
        ${he(e.expansion)}
      </select>
    </div>
    <div data-col="expansionism">
      <span data-tip="${D(T(`Religion expansionism`),T(`Defines competitive size`))}" class="icon-resize-full"></span>
      <input
        data-tip="${D(T(`Religion expansionism`),T(`Defines competitive size`),T(`Click to change, then click Recalculate to apply`))}"
        class="religionExpantion"
        type="number"
        min="0"
        max="99"
        step=".1"
        value=${e.expansionism}
      />
    </div>`}function he(e){let t=``;return[`global`,`state`,`culture`].forEach(n=>{t+=`<option ${e===n?`selected`:``} value="${n}">${s[n]??n}</option>`}),t}var H=e=>Number(`data`in e?e.id:e.target?.dataset.id),U=C(e=>{let n=H(e),a=r(`religionsBody`).querySelector(`div[data-id='${n}']`);if(a&&a.classList.add(`active`),!_.isOn(`religions`)||options.app.mode)return;let o=t().duration(2e3).ease(ne);i(`#relig`).select(`#religion${n}`).raise().transition(o).attr(`stroke-width`,2.5).attr(`stroke`,`#d0240f`),i(`#debug`).select(`#religionsCenter${n}`).raise().transition(o).attr(`r`,`6em`).attr(`stroke`,`#d0240f`)},200);function W(e){let t=H(e),n=r(`religionsBody`).querySelector(`div[data-id='${t}']`);n&&n.classList.remove(`active`),i(`#relig`).select(`#religion${t}`).transition().attr(`stroke-width`,null).attr(`stroke`,null),i(`#debug`).select(`#religionsCenter${t}`).transition().attr(`r`,`4em`).attr(`stroke`,null)}function G(){let e=this.getAttribute(`fill`)||`#ffffff`,t=+this.parentNode.dataset.id;a.ColorPicker.open(e,e=>{this.fill=e,pack.religions[t].color=e,i(`#relig`).select(`#religion${t}`).attr(`fill`,e),i(`#debug`).select(`#religionsCenter${t}`).attr(`fill`,e)})}function ge(){let e=+this.parentNode.dataset.id;this.parentNode.dataset.name=this.value,this.value.trim()&&m.rename(e,this.value)}function _e(){let e=+this.parentNode.dataset.id;this.parentNode.dataset.type=this.value,m.setType(e,this.value)}function ve(){let e=+this.parentNode.dataset.id;this.parentNode.dataset.form=this.value,this.value.trim()&&m.setForm(e,this.value)}function ye(){let e=this.closest(`.states`),t=+e.dataset.id;e.dataset.deity=this.value,m.setDeity(t,this.value)}function be(){let e=this.closest(`.states`),t=Number(e.dataset.id),n=pack.religions[t];n&&(o.set(n,this.value),this.value=o.format(n.tags),N.search&&F.refresh())}function xe(){let e=this.closest(`.states`),t=+e.dataset.id,n=pack.religions[t].culture,r=m.getDeityName(n)??``;e.dataset.deity=r,pack.religions[t].deity=r,this.nextElementSibling.value=r}function Se(){let e=+this.closest(`.states`).dataset.id,t=pack.religions[e];if(!t.cells){S(T(`No cells, cannot change population`),!1,`error`);return}let n=w((t.rural??0)*options.map.units.population.scale),i=w((t.urban??0)*options.map.units.population.scale*options.map.units.population.urbanization.rate),a=n+i,o=e=>Number(e).toLocaleString(),s=pack.burgs.filter(t=>!t.removed&&pack.cells.religion[t.cell]===e);y.message({message:`<div>
    <i>${T(`All population of religion territory is considered believers of this religion. It means believers number change will directly affect population`)}</i>
    <div style="margin: 0.5em 0">
      ${T(`Rural`)}: <input type="number" min="0" step="1" id="ruralPop" value=${n} style="width:6em" />
      ${T(`Urban`)}: <input type="number" min="0" step="1" id="urbanPop" value=${i} style="width:6em"
        ${s.length?``:`disabled`} />
    </div>
    <div>${T(`Total population`)}: ${o(a)} ⇒ <span id="totalPop">${o(a)}</span>
      (<span id="totalPopPerc">100</span>%)
    </div>
  </div>`,title:T(`Change believers number`),width:`24em`,buttons:[{label:T(`Apply`),onClick:()=>{p()}},{label:T(`Cancel`)}]});let c=r(`ruralPop`),l=r(`urbanPop`),u=r(`totalPop`),d=r(`totalPopPerc`),f=()=>{let e=c.valueAsNumber+l.valueAsNumber;Number.isNaN(e)||(u.innerHTML=o(e),d.innerHTML=String(w(e/a*100)))};c.oninput=()=>f(),l.oninput=()=>f();function p(){try{m.setPopulation(e,+c.value||0,+l.value||0)}catch(e){S(k(e),!1,`error`);return}_.draw(`population`),R()}}function Ce(){let e=this.closest(`.states`),t=+e.dataset.id;e.dataset.expansion=this.value,m.setExpansion(t,this.value),Q()}function we(){let e=this.closest(`.states`),t=+e.dataset.id;e.dataset.expansionism=this.value,+this.value>=0&&+this.value<=99&&(m.setExpansionism(t,+this.value),Q())}function Te(){if(options.app.mode)return;let e=+this.closest(`.states`).dataset.id;y.confirm({title:T(`Remove`),message:`${T(`Are you sure you want to remove the religion?`)}<br>${T(`This action cannot be reverted`)}`,confirm:T(`Remove`),onConfirm:()=>Ee(e)})}function Ee(e){i(`#relig`).select(`#religion${e}`).remove(),i(`#relig`).select(`#religion-gap${e}`).remove(),i(`#debug`).select(`#religionsCenter${e}`).remove(),m.remove(e),R()}function K(){let e=i(`#debug`);e.select(`#religionCenters`).remove();let t=e.append(`g`).attr(`id`,`religionCenters`).attr(`stroke`,`#444444`).style(`cursor`,`move`),n=pack.religions.filter(e=>e.i&&e.center&&!e.removed);N.showExtinct||(n=n.filter(e=>(e.cells??0)>0)),t.selectAll(`circle`).data(n).enter().append(`circle`).attr(`id`,e=>`religionsCenter${e.i}`).attr(`data-id`,e=>e.i).attr(`r`,`4em`).attr(`fill`,e=>e.color).attr(`cx`,e=>pack.cells.p[e.center][0]).attr(`cy`,e=>pack.cells.p[e.center][1]).on(`mouseenter`,(e,t)=>{S(T(`{{religion}}. Drag to move the religion center`,{religion:t.name}),!0),U(e)}).on(`mouseleave`,e=>{S(``,!0),W(e)}).call(te().on(`start`,De))}function De(e){let t=Number(this.dataset.id),n=E(this.getAttribute(`transform`)),r=+n[0]-e.x,i=+n[1]-e.y;function a(e){let{x:n,y:a}=e;this.setAttribute(`transform`,`translate(${r+n},${i+a})`);let o=u.findCell(n,a);if(!(o==null||pack.cells.h[o]<20)){try{m.moveCenter(t,n,a)}catch(e){S(e instanceof Error?e.message:String(e),!1,`error`,2e3);return}Q()}}let o=C(a,50);e.on(`drag`,o)}function Oe(){re.toggle(de,()=>pack.religions.filter(e=>e.i&&!e.removed&&e.area).sort((e,t)=>(t.area??0)-(e.area??0)).map(e=>[e.i,e.color,e.name]),T(`No religions to show`))}function q(){if(r(`religionsBody`).dataset.type===`absolute`){r(`religionsBody`).dataset.type=`percentage`;let e=+r(`religionsFooterArea`).dataset.area,t=+r(`religionsFooterPopulation`).dataset.population;r(`religionsBody`).querySelectorAll(`:scope > .states`).forEach(n=>{let{area:r,population:i}=n.dataset;n.querySelector(`.religionArea`).textContent=`${w(+r/e*100)}%`,n.querySelector(`.religionPopulation`).textContent=`${w(+i/t*100)}%`})}else r(`religionsBody`).dataset.type=`absolute`,F.refresh()}async function J(){options.app.mode||a.HierarchyTree.open({type:`religions`,data:pack.religions,onNodeEnter:U,onNodeLeave:W,getDescription:e=>{let{name:t,type:n,form:r,rural:i,urban:a}=e,o=()=>t.includes(n)||r.includes(n)?``:n===`Folk`?T(`Folk religion`):n===`Organized`?T(`Organized religion`):c[n]??n,s=(i??0)*options.map.units.population.scale+(a??0)*options.map.units.population.scale*options.map.units.population.urbanization.rate,l=s>0?T(`{{- population}} people`,{population:O(w(s))}):T(`Extinct`);return D(...[t,o(),r===n?``:r,l].filter(Boolean))},getShape:({type:e})=>{if(e===`Folk`)return`circle`;if(e===`Organized`)return`square`;if(e===`Cult`)return`hexagon`;if(e===`Heresy`)return`diamond`}})}function ke(){N.showExtinct=!N.showExtinct,b.set(A,`filters`,N),Y(),F.reset(),K()}function Y(){r(`religionsBody`).dataset.extinct=N.showExtinct?`show`:`hide`,r(`religionsExtinct`).classList.toggle(`active`,N.showExtinct)}function Ae(){_.show(`religions`),a.PaintEditor.open({title:T(`Paint Religions`),parentDialogId:A,onClose:I,items:pack.religions.filter(e=>!e.removed).map(e=>({id:e.i,name:e.name,color:e.color||`#ffffff`})),dontOverrideControl:!0,getValue:e=>pack.cells.religion[e],filterCell:e=>l(e,pack),onApply:je})}function je(e){for(let[t,n]of ue(e))m.setCells(t,n);e.size&&(_.draw(`religions`),n(A)&&R(),K())}function Me(){this.classList.contains(`pressed`)?X():(options.app.mode=`addReligion`,this.classList.add(`pressed`),S(T(`Click on the map to add a new religion`),!0),i(`#viewbox`).style(`cursor`,`crosshair`).on(`click`,Ne),r(`religionsBody`).querySelectorAll(`div > input, select, span, svg`).forEach(e=>{e.style.pointerEvents=`none`}))}function X(){options.app.mode=null,d(),le(),r(`religionsBody`).querySelectorAll(`div > input, select, span, svg`).forEach(e=>{e.style.removeProperty(`pointer-events`)});let e=r(`religionsAdd`);e.classList.contains(`pressed`)&&e.classList.remove(`pressed`)}function Ne(t){let[n,r]=e(t,this);try{m.add(n,r)}catch(e){S(k(e),!1,`error`);return}t.shiftKey===!1&&X(),_.draw(`religions`),R(),K()}function Pe(){let{scale:e,urbanization:t}=options.map.units.population,n=j.map(e=>e===`Area`?`Area ${g(`2`)}`:e),r=F.view().all.map(n=>[n.i,n.name,n.color,n.type,n.form,n.deity,n.i?pack.cultures[n.culture]?.name:``,h(n.area??0),n.cells,w((n.rural??0)*e+(n.urban??0)*e*t.rate),$(n),n.expansion,n.i?n.expansionism:``,o.format(n.tags)]);v.download(`Religions`,n,r)}function Fe(){let e=+this.closest(`.states`).dataset.id;a.NotesEditor.open({type:`religion`,id:e})}function Ie(){let e=+this.closest(`.states`).dataset.id,t=i(`#relig`).select(`#religion${e}`).node();t&&x(t,4)}function Z(){if(options.app.mode)return;let e=+this.closest(`.states`).dataset.id,t=this.classList;m.setLocked(e,!pack.religions[e].lock),t.toggle(`icon-lock-open`),t.toggle(`icon-lock`)}function Q(e){(e||r(`religionsAutoChange`).checked)&&(m.recalculate(),_.draw(`religions`),R(),K())}function Le(){i(`#debug`).select(`#religionCenters`).remove(),options.app.mode===`addReligion`&&X(),a.ColorPicker.close(),y.destroy(`religionsEditor`)}var $=e=>(e.origins??[]).filter(e=>!!e).map(e=>pack.religions[e].name).join(`, `),Re=e=>e.split(`,`).map(e=>e.trim()).filter(Boolean);async function ze(e){let{scale:t,urbanization:n}=options.map.units.population,r=e=>pack.religions[e]?.removed?void 0:pack.religions[e],i=[`Name`,`Type`,`Form`,`Supreme Deity`,`Potential`,`Tags`],s=pack.religions.filter(e=>!e.removed),c=new Map(s.map(e=>[e.i,$(e)])),l=new Map(s.map(e=>[e.name,e.i])),u=e=>l.get(e)??v.byName(pack.religions,e).i;await a.CsvUpload.update(e,j,{find:r,units:[`Area`],text:i},(e,i)=>{let a=r(e);i.apply(`Name`,t=>m.rename(e,t),a.name),i.apply(`Color`,t=>m.recolor(e,t),a.color),i.apply(`Type`,t=>m.setType(e,t),a.type),i.apply(`Form`,t=>m.setForm(e,t),a.form),i.apply(`Supreme Deity`,t=>m.setDeity(e,t),a.deity),i.apply(`Potential`,t=>m.setExpansion(e,t),a.expansion),i.apply(`Expansionism`,t=>m.setExpansionism(e,+t),a.expansionism),i.assign(`Origins`,t=>m.setOrigins(e,t?Re(t).map(u):[0]),c.get(e)),i.assign(`Tags`,e=>o.set(a,e),o.format(a.tags)),i.population([(a.rural??0)*t,(a.urban??0)*t*n.rate],(t,n)=>m.setPopulation(e,t,n),[`Believers`])})&&(_.draw(`religions`),R())}var Be={open:I,showHierarchy:J};export{Be as ReligionsEditor};