import{i as e,r as t,z as n}from"./node-utils-Ds1sVy-v.js";import{t as r}from"./pack-generator-DTsfQ82D.js";import{Lt as i,m as a}from"./options-model-CrstL1Qd.js";import{t as o}from"./military-generator-CVth4JoO.js";import{n as s}from"./stability-DCAus2OW.js";import{a as c,l,r as u,t as d,u as f,v as p,x as m}from"./names-generator-BcJRPzyi.js";import{L as h,t as g}from"./layers-DjWzCbYN.js";import{t as _}from"./dialog-BkeQgjla.js";import{a as v,o as y}from"./app-DCKsq5m8.js";import{i as b}from"./economy-view-C5mGSEYI.js";import{o as x}from"./tooltips-BVQbACdS.js";import{h as S,y as ee}from"./notices-6lBE5Kkn.js";import{O as C,T as w,a as T,f as E,i as D,m as O}from"./index-sNerCVjG.js";var k=null;function te(e,t){if(options.app.mode)return;_.closeAll(`.stable`),options.app.mode=`battle`,ne();let n=t.x,i=t.y;k={iteration:0,x:n,y:i,cell:r.findCell(n,i)??0,attackers:{regiments:[],distances:[],morale:100,casualties:0,power:0},defenders:{regiments:[],distances:[],morale:100,casualties:0,power:0},phasesRecord:[],place:null,type:`field`,name:``},N(),P(`attackers`,e),P(`defenders`,t),k.place=ie(),re(),k.name=j(),W(),V(`attackers`),V(`defenders`),H(),_.open(`battleScreen`,{title:k.name,width:`fit-content`,position:{my:`center`,at:`center`,of:`#map`},onClose:Z})}function ne(){e(`battleScreen`)?.remove(),e(`regimentSelectorScreen`)?.remove();let n=`<div id="battleScreen" class="dialog stable">
      <div id="battleBody">
        <template id="battlePhases_field">
          <button
            data-tip="${T(`Skirmish phase. Ranged units excel`)}"
            data-phase="skirmish"
            class="icon-button-skirmish"
          ></button>
          <button data-tip="${D(T(`Melee phase`),T(`Melee units excel`))}" data-phase="melee" class="icon-button-melee"></button>
          <button
            data-tip="${D(T(`Pursue phase`),T(`Mounted units excel`))}"
            data-phase="pursue"
            class="icon-button-pursue"
          ></button>
          <button
            data-tip="${D(T(`Retreat phase`),T(`Units strength reduced`))}"
            data-phase="retreat"
            class="icon-button-retreat"
          ></button>
        </template>
        <template id="battlePhases_naval">
          <button
            data-tip="${T(`Shelling phase. Naval artillery bombardment of enemy fleet`)}"
            data-phase="shelling"
            class="icon-button-shelling"
          ></button>
          <button
            data-tip="${T(`Boarding phase. Melee units go aboard`)}"
            data-phase="boarding"
            class="icon-button-boarding"
          ></button>
          <button
            data-tip="${T(`Сhase phase. Naval units pursue and rarely shell enemy fleet`)}"
            data-phase="chase"
            class="icon-button-chase"
          ></button>
          <button
            data-tip="${T(`Withdrawal phase. Naval units try to escape enemy fleet`)}"
            data-phase="withdrawal"
            class="icon-button-withdrawal"
          ></button>
        </template>
        <template id="battlePhases_siege_attackers">
          <button
            data-tip="${T(`Blockade phase. Prepare or hold the blockade`)}"
            data-phase="blockade"
            class="icon-button-blockade"
          ></button>
          <button
            data-tip="${T(`Bombardment phase. Attack enemy with machinery units`)}"
            data-phase="bombardment"
            class="icon-button-bombardment"
          ></button>
          <button
            data-tip="${D(T(`Storming phase`),T(`Storm enemy town`),T(`Melee units excel`))}"
            data-phase="storming"
            class="icon-button-storming"
          ></button>
          <button
            data-tip="${D(T(`Looting phase`),T(`Plunder the town`),T(`Units strength increased`))}"
            data-phase="looting"
            class="icon-button-looting"
          ></button>
          <button
            data-tip="${D(T(`Retreat phase`),T(`Units strength reduced`))}"
            data-phase="retreat"
            class="icon-button-retreat"
          ></button>
        </template>
        <template id="battlePhases_siege_defenders">
          <button
            data-tip="${T(`Sheltering phase. Hide behind the walls and wait`)}"
            data-phase="sheltering"
            class="icon-button-sheltering"
          ></button>
          <button
            data-tip="${D(T(`Sortie phase`),T(`Make a sortie from besieged town`),T(`Melee units excel`))}"
            data-phase="sortie"
            class="icon-button-sortie"
          ></button>
          <button
            data-tip="${T(`Bombardment phase. Attack enemy with machinery units`)}"
            data-phase="bombardment"
            class="icon-button-bombardment"
          ></button>
          <button
            data-tip="${D(T(`Defense phase`),T(`Ranged and melee units excel`))}"
            data-phase="defense"
            class="icon-button-defense"
          ></button>
          <button
            data-tip="${D(T(`Surrendering phase`),T(`Give up the defense`),T(`Units strength reduced`))}"
            data-phase="surrendering"
            class="icon-button-surrendering"
          ></button>
          <button
            data-tip="${D(T(`Pursue phase`),T(`Mounted units excel`))}"
            data-phase="pursue"
            class="icon-button-pursue"
          ></button>
        </template>
        <template id="battlePhases_ambush_attackers">
          <button
            data-tip="${D(T(`Shock phase`),T(`Units strength reduced`))}"
            data-phase="shock"
            class="icon-button-shock"
          ></button>
          <button data-tip="${D(T(`Melee phase`),T(`Melee units excel`))}" data-phase="melee" class="icon-button-melee"></button>
          <button
            data-tip="${D(T(`Pursue phase`),T(`Mounted units excel`))}"
            data-phase="pursue"
            class="icon-button-pursue"
          ></button>
          <button
            data-tip="${D(T(`Retreat phase`),T(`Units strength reduced`))}"
            data-phase="retreat"
            class="icon-button-retreat"
          ></button>
        </template>
        <template id="battlePhases_ambush_defenders">
          <button
            data-tip="${T(`Surprice attack phase. Units strength increased, ranged units excel`)}"
            data-phase="surprise"
            class="icon-button-surprise"
          ></button>
          <button data-tip="${D(T(`Melee phase`),T(`Melee units excel`))}" data-phase="melee" class="icon-button-melee"></button>
          <button
            data-tip="${D(T(`Pursue phase`),T(`Mounted units excel`))}"
            data-phase="pursue"
            class="icon-button-pursue"
          ></button>
          <button
            data-tip="${D(T(`Retreat phase`),T(`Units strength reduced`))}"
            data-phase="retreat"
            class="icon-button-retreat"
          ></button>
        </template>
        <template id="battlePhases_landing_attackers">
          <button
            data-tip="${T(`Landing phase. Amphibious attack. Units are vulnerable against prepared defense`)}"
            data-phase="landing"
            class="icon-button-landing"
          ></button>
          <button data-tip="${D(T(`Melee phase`),T(`Melee units excel`))}" data-phase="melee" class="icon-button-melee"></button>
          <button
            data-tip="${D(T(`Pursue phase`),T(`Mounted units excel`))}"
            data-phase="pursue"
            class="icon-button-pursue"
          ></button>
          <button data-tip="${D(T(`Flee phase`),T(`Units strength reduced`))}" data-phase="flee" class="icon-button-flee"></button>
        </template>
        <template id="battlePhases_landing_defenders">
          <button
            data-tip="${D(T(`Shock phase`),T(`Units are not prepared for a defense`))}"
            data-phase="shock"
            class="icon-button-shock"
          ></button>
          <button
            data-tip="${D(T(`Defense phase`),T(`Prepared defense`),T(`Units strength increased`))}"
            data-phase="defense"
            class="icon-button-defense"
          ></button>
          <button data-tip="${D(T(`Melee phase`),T(`Melee units excel`))}" data-phase="melee" class="icon-button-melee"></button>
          <button
            data-tip="${T(`Waiting phase. Cannot pursue fleeing naval`)}"
            data-phase="waiting"
            class="icon-button-waiting"
          ></button>
          <button
            data-tip="${D(T(`Pursue phase`),T(`Try to intercept fleeing attackers`),T(`Mounted units excel`))}"
            data-phase="pursue"
            class="icon-button-pursue"
          ></button>
          <button
            data-tip="${D(T(`Retreat phase`),T(`Units strength reduced`))}"
            data-phase="retreat"
            class="icon-button-retreat"
          ></button>
        </template>
        <template id="battlePhases_air">
          <button
            data-tip="${D(T(`Maneuvering phase`),T(`Units strength reduced`))}"
            data-phase="maneuvering"
            class="icon-button-maneuvering"
          ></button>
          <button
            data-tip="${D(T(`Dogfight phase`),T(`Units strength increased`))}"
            data-phase="dogfight"
            class="icon-button-dogfight"
          ></button>
          <button
            data-tip="${D(T(`Pursue phase`),T(`Units strength increased`))}"
            data-phase="pursue"
            class="icon-button-pursue"
          ></button>
          <button
            data-tip="${D(T(`Retreat phase`),T(`Units strength reduced`))}"
            data-phase="retreat"
            class="icon-button-retreat"
          ></button>
        </template>
        <div style="font-size: 1.2em; font-weight: bold; width: unset">
          <span>${T(`Attackers`)}</span>
          <div style="float: right; font-size: 0.7em">
            <meter
              id="battleMorale_attackers"
              data-tip="${T(`Attackers morale`)}: "
              min="0"
              max="100"
              low="33"
              high="66"
              optimum="80"
            ></meter>
            <div
              id="battlePower_attackers"
              data-tip="${D(T(`Attackers strength during this phase`),T(`Strength defines dealt damage`))}"
              style="display: inline-block; text-align: center"
              class="icon-button-power"
            ></div>
            <div style="display: inline-block">
              <button id="battlePhase_attackers" style="width: 3.2em"></button>
              <div class="battlePhases" style="display: none"></div>
            </div>
            <button
              id="battleDie_attackers"
              data-tip="${D(T(`Random factor for attackers`),T(`Click to re-roll`))}"
              style="padding: 0.1em 0.2em; width: 3.2em"
              class="icon-button-die"
            ></button>
          </div>
        </div>
        <table id="battleAttackers"></table>
        <div style="font-size: 1.2em; font-weight: bold; width: unset">
          <span>${T(`Defenders`)}</span>
          <div style="float: right; font-size: 0.7em">
            <meter
              id="battleMorale_defenders"
              data-tip="${T(`Defenders morale`)}: "
              min="0"
              max="100"
              low="33"
              high="66"
              optimum="80"
            ></meter>
            <div
              id="battlePower_defenders"
              data-tip="${D(T(`Defenders strength during this phase`),T(`Strength defines dealt damage`))}"
              style="display: inline-block; text-align: center"
              class="icon-button-power"
            ></div>
            <div style="display: inline-block">
              <button id="battlePhase_defenders" style="width: 3.2em"></button>
              <div class="battlePhases" style="display: none"></div>
            </div>
            <button
              id="battleDie_defenders"
              data-tip="${D(T(`Random factor for defenders`),T(`Click to re-roll`))}"
              style="padding: 0.1em 0.2em; width: 3.2em"
              class="icon-button-die"
            ></button>
          </div>
        </div>
        <table id="battleDefenders"></table>
      </div>
      <div id="battleBottom">
        <button id="battleType" data-tip="${D(T(`Battle type`),T(`Click to change`))}"></button>
        <div class="battleTypes" style="display: none">
          <button
            data-tip="${T(`Field Battle: a standard type of combat`)}"
            data-type="field"
            class="icon-button-field"
          ></button>
          <button data-tip="${T(`Naval Battle: naval units combat`)}" data-type="naval" class="icon-button-naval"></button>
          <button data-tip="${T(`Siege: burg blockade and storming`)}" data-type="siege" class="icon-button-siege"></button>
          <button data-tip="${T(`Ambush: surprise attack`)}" data-type="ambush" class="icon-button-ambush"></button>
          <button data-tip="${T(`Landing: amphibious attack`)}" data-type="landing" class="icon-button-landing"></button>
          <button
            data-tip="${T(`Air Battle: maneuring fight of avia units`)}"
            data-type="air"
            class="icon-button-air"
          ></button>
        </div>
        <button id="battleNameShow" data-tip="${T(`Set battle name`)}" class="icon-font"></button>
        <div id="battleNameSection" style="display: none">
          <button id="battleNameHide" data-tip="${T(`Hide`)}" class="icon-font"></button>
          <input id="battleNamePlace" data-tip="${T(`Type place name`)}" style="width: 30%" />
          <input id="battleNameFull" data-tip="${T(`Type full battle name`)}" style="width: 46%" />
          <button
            id="battleNameCulture"
            data-tip="${T(`Generate culture-specific name`)}"
            class="icon-book"
          ></button>
          <button
            id="battleNameRandom"
            data-tip="${T(`Generate random name`)}"
            class="icon-globe"
          ></button>
        </div>
        <button id="battleAddRegiment" data-tip="${T(`Add regiment to the battle`)}" class="icon-user-plus"></button>
        <button id="battleRoll" data-tip="${T(`Roll dice to update random factor`)}" class="icon-die"></button>
        <button id="battleRun" data-tip="${T(`Iterate battle`)}" class="icon-play"></button>
        <button
          id="battleApply"
          data-tip="${T(`End battle: apply current results and close the screen`)}"
          class="icon-check"
        ></button>
        <button
          id="battleCancel"
          data-tip="${T(`Cancel battle: roll back results and close the screen`)}"
          class="icon-cancel"
        ></button>
        <button id="battleWiki" data-tip="${T(`Open Battle Simulation Tutorial`)}" class="icon-info"></button>
      </div>
    </div>
    <div id="regimentSelectorScreen" class="dialog">
      <div id="regimentSelectorHeader" class="header" style="grid-template-columns: 9em 13em 4em 6em">
        <div data-tip="${T(`Click to sort`)}" class="sortable alphabetically" data-sortby="state">
          ${T(`State`)}&nbsp;
        </div>
        <div data-tip="${T(`Click to sort`)}" class="sortable alphabetically" data-sortby="regiment">
          ${T(`Regiment`)}&nbsp;
        </div>
        <div data-tip="${T(`Click to sort`)}" class="sortable" data-sortby="total">${T(`Total`)}&nbsp;</div>
        <div
          data-tip="${T(`Click to sort`)}"
          class="sortable icon-sort-number-up"
          data-sortby="distance"
        >
          ${T(`Distance`)}&nbsp;
        </div>
      </div>
      <div id="regimentSelectorBody" class="table"></div>
    </div>`;t(`dialogs`).insertAdjacentHTML(`beforeend`,n),y(`battleScreen`,`regimentSelectorHeader`),t(`battleType`).addEventListener(`click`,e=>Y(e)),t(`battleType`).nextElementSibling.addEventListener(`click`,e=>oe(e)),t(`battleNameShow`).addEventListener(`click`,()=>I()),t(`battleNamePlace`).addEventListener(`change`,e=>{k&&(k.place=e.target.value)}),t(`battleNameFull`).addEventListener(`change`,e=>R(e)),t(`battleNameCulture`).addEventListener(`click`,()=>z(`culture`)),t(`battleNameRandom`).addEventListener(`click`,()=>z(`random`)),t(`battleNameHide`).addEventListener(`click`,()=>L()),t(`battleAddRegiment`).addEventListener(`click`,()=>F()),t(`battleRoll`).addEventListener(`click`,()=>W()),t(`battleRun`).addEventListener(`click`,()=>ae()),t(`battleApply`).addEventListener(`click`,()=>ce()),t(`battleCancel`).addEventListener(`click`,()=>Z()),t(`battleWiki`).addEventListener(`click`,()=>S(`Battle-Simulator`)),t(`battlePhase_attackers`).addEventListener(`click`,e=>Y(e)),t(`battlePhase_attackers`).nextElementSibling.addEventListener(`click`,e=>X(e,`attackers`)),t(`battlePhase_defenders`).addEventListener(`click`,e=>Y(e)),t(`battlePhase_defenders`).nextElementSibling.addEventListener(`click`,e=>X(e,`defenders`)),t(`battleDie_attackers`).addEventListener(`click`,()=>G(`attackers`)),t(`battleDie_defenders`).addEventListener(`click`,()=>G(`defenders`))}function re(){let e=k,t=e.attackers.regiments[0],n=e.defenders.regiments[0];e.type=(()=>{let r=Object.keys(t.u).map(e=>options.map.military.units.find(t=>t.name===e)?.type),i=Object.keys(n.u).map(e=>options.map.military.units.find(t=>t.name===e)?.type);return t.n&&n.n?`naval`:r.every(e=>e===`aviation`)&&i.every(e=>e===`aviation`)?`air`:t.n&&!n.n&&r.some(e=>e!==`naval`)?`landing`:!n.n&&(pack.burgs[pack.cells.burg[e.cell]].walls||pack.burgs[pack.cells.burg[e.cell]].citadel)?`siege`:l(.1)&&[5,6,7,8,9,12].includes(pack.cells.biome[e.cell])?`ambush`:`field`})(),A()}function A(){let n=k;t(`battleType`).className=`icon-button-${n.type}`;let r=e(`battlePhases_${n.type}_attackers`),i=r?r.content:t(`battlePhases_${n.type}`).content,a=r?t(`battlePhases_${n.type}_defenders`).content:i,o=t(`battlePhase_attackers`).nextElementSibling,s=t(`battlePhase_defenders`).nextElementSibling;o.innerHTML=``,s.innerHTML=``,o.append(i.cloneNode(!0)),s.append(a.cloneNode(!0))}function ie(){let e=pack.cells,t=k.cell,n=e.burg[t]?pack.burgs[e.burg[t]].name:null,r=!n&&e.r[t]?(e=>{let t=pack.rivers.find(t=>t.i===e);return`${t.name} ${t.type}`})(e.r[t]):null,i=n||r?null:d.getCulture(e.culture[t]);return n||r||i}function j(){let e=k;return e.type===`field`?`Battle of ${e.place}`:e.type===`naval`?`Naval Battle of ${e.place}`:e.type===`siege`?`Siege of ${e.place}`:e.type===`ambush`?`${e.place} Ambush`:e.type===`landing`?`${e.place} Landing`:`${e.place} ${l(.8)?`Air Battle`:`Dogfight`}`}function M(){let e=k;return e.type===`field`?`field battle`:e.type===`naval`?`naval battle`:e.type===`siege`?`siege`:e.type===`ambush`?`ambush`:e.type===`landing`?`landing`:`battle`}function N(){let e=`<thead><tr><th></th><th></th>`;for(let t of options.map.military.units){let n=E(t.name.replace(/_/g,` `));e+=`<th data-tip="${n}">${a.html(t.icon)}</th>`}e+=`<th data-tip="${T(`Total military forces`)}">${T(`Total`)}</th></tr></thead>`,t(`battleAttackers`).innerHTML=e,t(`battleDefenders`).innerHTML=e}function P(e,n){let r=k;n.casualties=Object.keys(n.u).reduce((e,t)=>(e[t]=0,e),{}),n.survivors=Object.fromEntries(Object.entries(n.u).map(([e,t])=>[e,o.getTroops(t)]));let i=pack.states[n.state],s=Math.hypot(r.y-n.by,r.x-n.bx)*options.map.units.distance.scale|0,c=`<svg width="1.4em" height="1.4em" style="margin-bottom: -.6em; stroke: #333">
      <rect x="0" y="0" width="100%" height="100%" fill="${i.color?.[0]===`#`?i.color:`#999`}"></rect>
      <use href="${O(a.href(n.icon??``))}" x="10%" y="10%" width="80%" height="80%" stroke="none"></use></svg>`,l=`<tbody id="battle${i.i}-${n.i}">`,u=`<tr class="battleInitial"><td>${c}</td><td class="regiment">${n.name}</td>`,d=C(o.getBattleUpkeep(i.i)*100),f=D(b.upkeep(),T(`Troops fight with this share of their power`)),p=`<tr class="battleCasualties"><td></td><td class="regiment">${i.fullName} <span data-tip="${f}" class="${d<100?`negative`:``}">(${T(`upkeep {{upkeep}}%`,{upkeep:d})})</span></td>`,m=`<tr class="battleSurvivors"><td></td><td data-tip="${T(`Supply line length, affects morale`)}">${T(`Distance to base`)}: ${s} ${options.map.units.distance.unit}</td>`;for(let e of options.map.military.units)u+=`<td data-tip="${T(`Initial forces`)}" style="width: 2.5em; text-align: center">${o.getTroops(n.u[e.name])}</td>`,p+=`<td data-tip="${T(`Casualties`)}" style="width: 2.5em; text-align: center; color: red">0</td>`,m+=`<td data-tip="${T(`Survivors`)}" style="width: 2.5em; text-align: center; color: green">${o.getTroops(n.u[e.name])}</td>`;u+=`<td data-tip="${T(`Initial forces`)}" style="width: 2.5em; text-align: center">${o.getTroops(n.a)}</td></tr>`,p+=`<td data-tip="${T(`Casualties`)}"  style="width: 2.5em; text-align: center; color: red">0</td></tr>`,m+=`<td data-tip="${T(`Survivors`)}" style="width: 2.5em; text-align: center; color: green">${o.getTroops(n.a)}</td></tr>`;let h=t(e===`attackers`?`battleAttackers`:`battleDefenders`);h.innerHTML+=`${l+u+p+m}</tbody>`,r[e].regiments.push(n),r[e].distances.push(s)}function F(){if(_.isOpen(`regimentSelectorScreen`))return;let e=k,n=t(`regimentSelectorBody`),r=pack.states.filter(e=>e.military&&!e.removed).flatMap(e=>e.military),i=t=>C(Math.hypot(e.y-t.y,e.x-t.x)*options.map.units.distance.scale),s=t=>e.defenders.regiments.some(e=>e===t)||e.attackers.regiments.some(e=>e===t);n.innerHTML=r.map(e=>{let t=pack.states[e.state],n=s(e),r=n?0:i(e),c=`${r} ${options.map.units.distance.unit}`;return`<div ${n?`class='inactive'`:``} data-s=${t.i} data-i=${e.i} data-state=${t.name} data-regiment=${e.name}
        data-total=${o.getTroops(e.a)} data-distance="${r}" data-tip="${T(`Click to select regiment`)}">
        <svg width=".9em" height=".9em" style="margin-bottom:-1px; stroke: #333"><rect x="0" y="0" width="100%" height="100%" fill="${t.color}" ></svg>
        <div style="width:6em">${t.name.slice(0,11)}</div>
        <div style="width:1.2em; display:flex">${a.html(e.icon??``)}</div>
        <div style="width:13em">${e.name.slice(0,24)}</div>
        <div style="width:4em">${o.getTroops(e.a)}</div>
        <div style="width:4em">${c}</div>
      </div>`}).join(``),_.open(`regimentSelectorScreen`,{width:`fit-content`,title:T(`Add regiment to the battle`),position:{my:`left center`,at:`right+10 center`,of:`#battleScreen`},persistent:!0,onClose:u,buttons:[{label:T(`Add to attackers`),onClick:()=>l(`attackers`)},{label:T(`Add to defenders`),onClick:()=>l(`defenders`)},{label:T(`Cancel`),onClick:()=>_.close(`regimentSelectorScreen`)}]}),v(t(`regimentSelectorHeader`)),n.addEventListener(`click`,c);function c(e){let t=e.target;t.className===`inactive`?x(T(`Regiment is already in the battle`),!1,`error`):t.classList.toggle(`selected`)}function l(t){let r=n.querySelectorAll(`.selected`);r.length?(_.close(`regimentSelectorScreen`),r.forEach(n=>{let r=pack.states[+n.dataset.s].military.find(e=>e.i===+n.dataset.i);P(t,r),V(t),H();let i=e.defenders.regiments,a=e.attackers.regiments,o=t===`attackers`?a.length*-8:(i.length-1)*8;r.px=r.x,r.py=r.y,h(r,i[0].x,i[0].y+o)})):x(T(`Please select a regiment first`),!1,`error`)}function u(){n.innerHTML=``,n.removeEventListener(`click`,c)}}function I(){document.querySelectorAll(`#battleBottom > button`).forEach(e=>{e.style.display=`none`}),t(`battleNameSection`).style.display=`inline-block`,t(`battleNamePlace`).value=k.place??``,t(`battleNameFull`).value=k.name}function L(){document.querySelectorAll(`#battleBottom > button`).forEach(e=>{e.style.display=`inline-block`}),t(`battleNameSection`).style.display=`none`}function R(e){let t=e.target.value;k.name=t,_.open(`battleScreen`,{title:t})}function z(e){let n=k,r=e===`culture`?d.getCulture(pack.cells.culture[n.cell],void 0,void 0,``):d.getBase(p(d.nameBases.length-1));n.place=r,t(`battleNamePlace`).value=r,n.name=j(),t(`battleNameFull`).value=n.name,_.open(`battleScreen`,{title:n.name})}function B(e,t=()=>1){return e.reduce((e,n)=>{let r=t(n);for(let t in n.survivors)Object.hasOwn(n.survivors,t)&&(e[t]=(e[t]||0)+n.survivors[t]*r);return e},{})}function V(e){let n=k,r={skirmish:{melee:.2,ranged:2.4,mounted:.1,machinery:3,naval:1,armored:.2,aviation:1.8,magical:1.8},melee:{melee:2,ranged:1.2,mounted:1.5,machinery:.5,naval:.2,armored:2,aviation:.8,magical:.8},pursue:{melee:1,ranged:1,mounted:4,machinery:.05,naval:1,armored:1,aviation:1.5,magical:.6},retreat:{melee:.1,ranged:.01,mounted:.5,machinery:.01,naval:.2,armored:.1,aviation:.8,magical:.05},shelling:{melee:0,ranged:.2,mounted:0,machinery:2,naval:2,armored:0,aviation:.1,magical:.5},boarding:{melee:1,ranged:.5,mounted:.5,machinery:0,naval:.5,armored:.4,aviation:0,magical:.2},chase:{melee:0,ranged:.15,mounted:0,machinery:1,naval:1,armored:0,aviation:.15,magical:.5},withdrawal:{melee:0,ranged:.02,mounted:0,machinery:.5,naval:.1,armored:0,aviation:.1,magical:.3},blockade:{melee:.25,ranged:.25,mounted:.2,machinery:.5,naval:.2,armored:.1,aviation:.25,magical:.25},sheltering:{melee:.3,ranged:.5,mounted:.2,machinery:.5,naval:.2,armored:.1,aviation:.25,magical:.25},sortie:{melee:2,ranged:.5,mounted:1.2,machinery:.2,naval:.1,armored:.5,aviation:1,magical:1},bombardment:{melee:.2,ranged:.5,mounted:.2,machinery:3,naval:1,armored:.5,aviation:1,magical:1},storming:{melee:1,ranged:.6,mounted:.5,machinery:1,naval:.1,armored:.1,aviation:.5,magical:.5},defense:{melee:2,ranged:3,mounted:1,machinery:1,naval:.1,armored:1,aviation:.5,magical:1},looting:{melee:1.6,ranged:1.6,mounted:.5,machinery:.2,naval:.02,armored:.2,aviation:.1,magical:.3},surrendering:{melee:.1,ranged:.1,mounted:.05,machinery:.01,naval:.01,armored:.02,aviation:.01,magical:.03},surprise:{melee:2,ranged:2.4,mounted:1,machinery:1,naval:1,armored:1,aviation:.8,magical:1.2},shock:{melee:.5,ranged:.5,mounted:.5,machinery:.4,naval:.3,armored:.1,aviation:.4,magical:.5},landing:{melee:.8,ranged:.6,mounted:.6,machinery:.5,naval:.5,armored:.5,aviation:.5,magical:.6},flee:{melee:.1,ranged:.01,mounted:.5,machinery:.01,naval:.5,armored:.1,aviation:.2,magical:.05},waiting:{melee:.05,ranged:.5,mounted:.05,machinery:.5,naval:2,armored:.05,aviation:.5,magical:.5},maneuvering:{melee:0,ranged:.1,mounted:0,machinery:.2,naval:0,armored:0,aviation:1,magical:.2},dogfight:{melee:0,ranged:.1,mounted:0,machinery:.1,naval:0,armored:0,aviation:2,magical:.1}},a=new Map,s=B(n[e].regiments,({state:e})=>(a.has(e)||a.set(e,o.getBattleUpkeep(e)),a.get(e))),c=n[e].phase,l=options.map.units.population.scale/10;n[e].power=i(options.map.military.units.map(e=>(s[e.name]||0)*e.power*(r[c][e.type]??r[c].melee)))/l;let u=n[e].power?Math.max(n[e].power|0,1):0;t(`battlePower_${e}`).innerHTML=String(u)}function H(){let e=k,t=e=>w(100-e**1.5*10+10,50,100),n=e=>Math.min((m(e)??0)/50,15),r=e=>{let t=i(e,e=>e.a);return .75+(t?i(e,e=>(s.get(e.state)?.stability??.5)*e.a)/t:.5)/2},a=e.defenders.power/e.attackers.power;e.attackers.morale=Math.min(100,t(a)*r(e.attackers.regiments)-n(e.attackers.distances)),e.defenders.morale=Math.min(100,t(1/a)*r(e.defenders.regiments)-n(e.defenders.distances)),U(`attackers`),U(`defenders`)}function U(e){let n=k,r=t(`battleMorale_${e}`);r.dataset.tip=(r.dataset.tip||``).replace(r.value,``),r.value=String(n[e].morale|0),r.dataset.tip+=r.value}function W(){G(`attackers`),G(`defenders`),K(),V(`attackers`),V(`defenders`)}function G(e){let n=k,r=t(`battleDie_${e}`),i=+r.innerHTML,a;do a=p(1,6),r.innerHTML=String(a);while(a===i);n[e].die=a}function K(){let e=k,n=e.iteration,r=[e.attackers.morale,e.defenders.morale],a=e.attackers.power/e.defenders.power,o=()=>{let t=[e.attackers.phase||`skirmish`,e.defenders.phase||`skirmish`];if(l(1-r[0]/25))return[`retreat`,`pursue`];if(l(1-r[1]/25))return[`pursue`,`retreat`];if(t[0]===`skirmish`&&t[1]===`skirmish`){let t=B(e.attackers.regiments.concat(e.defenders.regiments)),r=i(Object.values(t)),a=i(options.map.military.units.filter(e=>e.type===`ranged`).map(e=>e.name).map(e=>t[e]))/r;if(l(a)||l(.8-n/10))return[`skirmish`,`skirmish`]}return[`melee`,`melee`]},s=()=>{let t=[e.attackers.phase||`shelling`,e.defenders.phase||`shelling`];if(t[0]===`withdrawal`)return[`withdrawal`,`chase`];if(t[0]===`chase`)return[`chase`,`withdrawal`];if(t[0]!==`boarding`){if(a<.5||l(e.attackers.casualties)&&a<1)return[`withdrawal`,`chase`];if(a>2||l(e.defenders.casualties)&&a>1)return[`chase`,`withdrawal`]}return t[0]===`boarding`||l(n/10-.1)?[`boarding`,`boarding`]:[`shelling`,`shelling`]},c=()=>{let t=[e.attackers.phase||`blockade`,e.defenders.phase||`sheltering`],o=[`blockade`,`sheltering`];if(t[0]===`retreat`||t[0]===`looting`)return t;if(l(1-r[0]/30)&&a<1)return[`retreat`,`pursue`];if(l(1-r[1]/15))return[`looting`,`surrendering`];if(l((a-1)/2))return[`storming`,`defense`];if(t[0]!==`storming`){let a=options.map.military.units.filter(e=>e.type===`machinery`).map(e=>e.name),s=B(e.attackers.regiments),c=i(a.map(e=>s[e]));n&&c&&l(.9)&&(o[0]=`bombardment`);let u=B(e.defenders.regiments),d=i(a.map(e=>u[e]));d&&l(.9)&&(o[1]=`bombardment`),n&&t[1]!==`sortie`&&d<c&&l(.25)&&l(r[1]/70)&&(o[1]=`sortie`)}return o},u=()=>[e.attackers.phase||`shock`,e.defenders.phase||`surprise`][1]===`surprise`&&l(1-a*n/5)?[`shock`,`surprise`]:l(1-r[0]/25)?[`retreat`,`pursue`]:l(1-r[1]/25)?[`pursue`,`retreat`]:[`melee`,`melee`],d=()=>{let t=[e.attackers.phase||`landing`,e.defenders.phase||`defense`];return t[1]===`waiting`?[`flee`,`waiting`]:t[1]===`pursue`?[`flee`,l(.3)?`pursue`:`waiting`]:t[1]===`retreat`?[`pursue`,`retreat`]:t[0]===`landing`?[l(n/2)?`melee`:`landing`,n?t[1]:l(.5)?`defense`:`shock`]:l(1-r[0]/40)?[`flee`,`pursue`]:l(1-r[1]/25)?[`pursue`,`retreat`]:[`melee`,`melee`]},f=()=>{let t=[e.attackers.phase||`maneuvering`,e.defenders.phase||`maneuvering`];return l(1-r[0]/25)?[`retreat`,`pursue`]:l(1-r[1]/25)?[`pursue`,`retreat`]:t[0]===`maneuvering`&&l(1-n/10)?[`maneuvering`,`maneuvering`]:[`dogfight`,`dogfight`]},p=(()=>{switch(e.type){case`field`:return o();case`naval`:return s();case`siege`:return c();case`ambush`:return u();case`landing`:return d();case`air`:return f();default:return o()}})();e.attackers.phase=p[0],e.defenders.phase=p[1];let m=t(`battlePhase_attackers`);m.className=`icon-button-${e.attackers.phase}`,m.dataset.tip=m.nextElementSibling.querySelector(`[data-phase='${p[0]}']`).dataset.tip;let h=t(`battlePhase_defenders`);h.className=`icon-button-${e.defenders.phase}`,h.dataset.tip=h.nextElementSibling.querySelector(`[data-phase='${p[1]}']`).dataset.tip}function ae(){let e=k;if(!e.attackers.power){x(T(`Attackers army destroyed`),!1,`warn`);return}if(!e.defenders.power){x(T(`Defenders army destroyed`),!1,`warn`);return}let t=`Attackers: ${e.attackers.phase}, defenders: ${e.defenders.phase}`,n=e.phasesRecord.at(-1);n?.phase===t?n.count+=1:e.phasesRecord.push({phase:t,count:1});let r=e.attackers.power*(e.attackers.die/10+.4),i=e.defenders.power*(e.defenders.die/10+.4),a={skirmish:.1,melee:.2,pursue:.3,retreat:.3,boarding:.2,shelling:.1,chase:.03,withdrawal:.03,blockade:0,sheltering:0,sortie:.1,bombardment:.05,storming:.2,defense:.2,looting:.5,surrendering:.5,surprise:.3,shock:.3,landing:.3,flee:0,waiting:0,maneuvering:.1,dogfight:.2},o=Math.random()*Math.max(a[e.attackers.phase],a[e.defenders.phase]),s=o*i/(r+i),c=o*r/(r+i);q(`attackers`,s),q(`defenders`,c),e.attackers.casualties+=s,e.defenders.casualties+=c,e.attackers.morale=Math.max(e.attackers.morale-s*100-1,0),e.defenders.morale=Math.max(e.defenders.morale-c*100-1,0),J(`attackers`),J(`defenders`),e.iteration+=1,K(),V(`attackers`),V(`defenders`)}function q(e,t){let n=k;for(let r of n[e].regiments)for(let e in r.u){let n=.8+Math.random()*.4,i=Math.min(f(o.getTroops(r.u[e])*t*n),r.survivors[e]);r.casualties[e]-=i,r.survivors[e]-=i}}function J(e){let n=k;for(let r of n[e].regiments){let e=t(`battle${r.state}-${r.i}`),n=e.querySelector(`.battleCasualties`),a=e.querySelector(`.battleSurvivors`),o=3;for(let e of options.map.military.units)n.querySelector(`td:nth-child(${o})`).innerHTML=String(r.casualties[e.name]||0),a.querySelector(`td:nth-child(${o})`).innerHTML=String(r.survivors[e.name]||0),o++;n.querySelector(`td:nth-child(${o})`).innerHTML=String(i(Object.values(r.casualties))),a.querySelector(`td:nth-child(${o})`).innerHTML=String(i(Object.values(r.survivors)))}U(e)}function Y(e){e.stopPropagation();let t=e.target,n=t.nextElementSibling,r=()=>{t.style.opacity=`1`,n.style.display=`none`};n.style.display===`block`?r():(t.style.opacity=`0.5`,n.style.display=`block`,document.getElementsByTagName(`body`)[0].addEventListener(`click`,r,{once:!0}))}function oe(e){let t=e.target;if(t.tagName!==`BUTTON`)return;let n=k;n.type=t.dataset.type,A(),K(),V(`attackers`),V(`defenders`),n.name=j(),_.open(`battleScreen`,{title:n.name})}function X(e,n){let r=e.target;if(r.tagName!==`BUTTON`)return;let i=k,a=r.dataset.phase;i[n].phase=a;let o=t(`battlePhase_${n}`);o.className=`icon-button-${a}`,o.dataset.tip=r.dataset.tip,V(n)}function se(e){return e===1?`was annihilated`:e>.9?`was virtually wiped out`:e>.75?`was nearly destroyed`:e>.6?`was devastated`:e>.45?`sustained catastrophic losses`:e>.3?`sustained severe losses`:e>.2?`sustained heavy losses`:e>.1?`took considerable losses`:e>.05?`took noticeable losses`:e>0?`took minor losses`:`emerged unscathed`}function ce(){let e=k,t=e.name,r=Math.max(e.attackers.casualties,e.defenders.casualties),s=e.attackers.casualties+e.defenders.casualties,d=f(s?e.defenders.casualties/s:NaN,r);function f(e,t){return Number.isNaN(e)?[`standoff`,`standoff`]:t<.05?[`minor skirmishes`,`minor skirmishes`]:e>.95?[`attackers flawless victory`,`disorderly retreat of defenders`]:e>.7?[`attackers decisive victory`,`defenders disastrous defeat`]:e>.6?[`attackers victory`,`defenders defeat`]:e>.4?[`stalemate`,`stalemate`]:e>.3?[`attackers defeat`,`defenders victory`]:e>=0?[`attackers disorderly retreat`,`flawless victory of defenders`]:[`stalemate`,`stalemate`]}e.attackers.regiments.forEach(e=>{p(e,`attackers`)}),e.defenders.regiments.forEach(e=>{p(e,`defenders`)});function p(e,r){let a=`regiment${e.state}-${e.i}`;if(e.note){let n=r===`attackers`?d[0]:d[1],a=se(e.a?Math.abs(i(Object.values(e.casualties)))/o.getTroops(e.a):1),s=Object.keys(e.u).map(t=>e.u[t]?`${o.getTroops(e.u[t])} ${t}`:null).filter(e=>!!e),l=s.length?` Initial forces: ${c(s)}.`:``,u=Object.keys(e.casualties).map(t=>e.casualties[t]?`${Math.abs(e.casualties[t])} ${t}`:null).filter(e=>!!e),f=u.length?` Casualties: ${c(u)}.`:``;e.note+=`<br><br>${t} (${options.map.lore.calendar.year} ${options.map.lore.calendar.eraShort}): ${n}. The regiment ${a}.${l}${f}`}let{scale:s}=options.map.units.population;for(let t in e.u)e.u[t]=e.survivors[t]?e.u[t]+e.casualties[t]/s:0;e.a=i(Object.values(e.u)),n(`#armies`).select(`g#${a} > text`).text(o.getTotal(e)),h(e,e.px,e.py)}let m={i:(ee(pack.markers)?.i??-1)+1,x:e.x,y:e.y,cell:e.cell,icon:a.glyph(`⚔️`),type:`battlefields`,dy:52,name:e.name,tags:[]};pack.markers.push(m),g.draw(`markers`);let _=(e,t)=>e.length>1?`${t?`regiments`:`forces`} of ${c([...new Set(e.map(e=>pack.states[e.state].name))])}`:`${u(pack.states[e[0].state].name)} ${e[0].name}`,v=e=>Math.min(C(e*100),100),y=(e,t)=>e.reduce((e,n)=>{for(let r in n.casualties)e[r]=(e[r]||0)+t(n,r);return e},{}),b=e=>{let t=Object.keys(e).map(t=>e[t]?`${e[t]} ${t}`:null).filter(e=>!!e);return t.length?c(t):``},S=(e,t)=>{let n=b(y(t.regiments,(e,t)=>(e.survivors[t]||0)+Math.abs(e.casualties[t]))),r=b(y(t.regiments,(e,t)=>Math.abs(e.casualties[t]))),i=n?`<br>${e} initial forces: ${n}.`:``;return r&&(i+=` Casualties: ${r}.`),i},w=d[+l(.7)],E=`The ${M()} ended in ${w}`,D=`${e.name} took place in ${options.map.lore.calendar.year} ${options.map.lore.calendar.eraShort}. It was fought between ${_(e.attackers.regiments,1)} and ${_(e.defenders.regiments,0)}. ${E}.
      <br>Attackers losses: ${v(e.attackers.casualties)}%, defenders losses: ${v(e.defenders.casualties)}%.`;if(D+=S(`Attackers`,e.attackers),D+=S(`Defenders`,e.defenders),e.phasesRecord.length){let t=e.phasesRecord.map(e=>e.count>1?`${e.phase} (x${e.count})`:e.phase).join(`<br>`);D+=`<br><br>${T(`Engagement progression`)}:<br>${t}`}m.note=D,x(T(`{{battle}} is over. {{result}}`,{battle:e.name,result:E}),!0,`success`,4e3),Q(),$()}function Z(){let e=k;e.attackers.regiments.forEach(e=>{h(e,e.px,e.py)}),e.defenders.regiments.forEach(e=>{h(e,e.px,e.py)}),Q(),$()}function Q(){_.destroy(`battleScreen`),_.destroy(`regimentSelectorScreen`)}function $(){options.app.mode=null,k&&k.attackers.regiments.concat(k.defenders.regiments).forEach(e=>{delete e.px,delete e.py,delete e.casualties,delete e.survivors}),k=null}var le={open:te};export{le as BattleScreen};