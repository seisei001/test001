import{a as e,r as t,z as n}from"./node-utils-Ds1sVy-v.js";import{t as r}from"./controllers-Dbv1ZRTV.js";import{A as i,C as a,g as o}from"./options-model-CrstL1Qd.js";import{n as ee}from"./prosperity-J_ycIG-E.js";import{t as s,v as c}from"./names-generator-BcJRPzyi.js";import{b as te,m as ne,n as re}from"./units-CYDspnRH.js";import{at as l,lt as u,t as d}from"./layers-DjWzCbYN.js";import{_ as f,l as p,t as ie,u as ae}from"./app-DCKsq5m8.js";import{i as oe}from"./development-view-ChwbelfH.js";import{t as m}from"./dialog-BkeQgjla.js";import{M as se,N as ce,i as h}from"./economy-view-C5mGSEYI.js";import{m as le}from"./zoom-B8oh1YKy.js";import{o as g,t as ue}from"./tooltips-BVQbACdS.js";import{f as de}from"./notices-6lBE5Kkn.js";import{O as _,T as v,a as y,i as b,p as fe}from"./index-sNerCVjG.js";var x={k:1,x:0,y:0};function S({k:e,x:t,y:n},r){return{k:e,x:v(t,r.width*(1-e),0),y:v(n,r.height*(1-e),0)}}function C(e,t,n,r,i=32){let a=v(e.k*n,1,Math.max(1,i)),o=a/e.k;return S({k:a,x:t.x-(t.x-e.x)*o,y:t.y-(t.y-e.y)*o},r)}function w(e,t,n,r){return S({k:e.k,x:e.x+t,y:e.y+n},r)}var T=null,E=null,D={...x},O=32,k=1,A=0,j=!1;function pe(e){options.app.mode||(m.closeAll(`.stable`),d.show(`burgIcons`,`labels`),E=+e,T=n(`#labels`).select(`[data-label-type='burg'][data-id='${e}']`),T.size()||(T=n(`#burgIcons`).select(`[data-id='${e}']`)),me(),t(`burgEditor`).dataset.entity=`burg:${E}`,N(),m.open(`burgEditor`,{title:y(`Edit Burg`),onClose:Be,position:{my:`left top`,at:`left+10 top+10`,of:`svg`}}),P())}function me(){m.destroy(`burgEditor`);let e=`<div id="burgEditor" class="dialog" data-burg-id="${M()}">
      <div id="burgBody" style="padding-bottom: 0.3em">
        <div style="display: flex; align-items: center">
          <svg data-tip="${b(y(`Burg emblem`),y(`Click to edit`))}" class="pointer" viewBox="0 0 200 200" width="13em" height="13em">
            <use id="burgEmblem"></use>
          </svg>
          <div style="display: grid; grid-auto-rows: minmax(2em, auto)">
            <div id="burgProvinceAndState" style="font-weight: bold; max-width: 16em"></div>
            <div>
              <div class="label">${y(`Name`)}:</div>
              <input
                id="burgName"
                data-tip="${y(`Type to rename`)}"
                autocorrect="off"
                spellcheck="false"
                style="width: 9em"
              />
              <span id="burgNameSpeak" data-tip="${b(y(`Speak the name`),y(`You can change voice and language in options`))}" class="speaker">🔊</span>
              <span
                id="burgNameReRandom"
                data-tip="${y(`Generate random name`)}"
                class="icon-globe pointer"
              ></span>
            </div>
            <div data-tip="${y(`Select burg group. Groups defines burg icon, label size and style`)}">
              <div class="label">${y(`Group`)}:</div>
              <select id="burgGroup" style="width: 9em"></select>
              <span id="burgGroupConfigure" data-tip="${y(`Configure burg groups`)}" class="icon-cog pointer"></span>
            </div>
            <div data-tip="${y(`Select burg type. Type slightly affects emblem generation`)}">
              <div class="label">${y(`Type`)}:</div>
              <select id="burgType" style="width: 9em">
                <option value="Generic">${y(`Generic`)}</option>
                <option value="River">${y(`River`)}</option>
                <option value="Lake">${y(`Lake`)}</option>
                <option value="Naval">${y(`Naval`)}</option>
                <option value="Nomadic">${y(`Nomadic`)}</option>
                <option value="Hunting">${y(`Hunting`)}</option>
                <option value="Highland">${y(`Highland`)}</option>
              </select>
            </div>
            <div data-tip="${y(`Select dominant culture`)}">
              <div class="label">${y(`Culture`)}:</div>
              <select id="burgCulture" style="width: 9em"></select>
              <span
                id="burgNameReCulture"
                data-tip="${y(`Generate culture-specific name`)}"
                class="icon-book pointer"
              ></span>
            </div>
            <div data-tip="${y(`Set burg population`)}">
              <div class="label">${y(`Population`)}:</div>
              <input id="burgPopulation" type="number" min="0" step="1" style="width: 9em" />
            </div>
            <div data-tip="${y(`Burg average yearly temperature`)}" style="display: flex; justify-content: space-between">
              <div>
                <div class="label">${y(`Temperature`)}:</div>
                <span id="burgTemperature"></span>
              </div>
              <div style="display: flex; gap: 0.5em">
                <i class="icon-info-circled" id="burgTemperatureLikeIn"></i>
                <i
                  id="burgTemperatureGraph"
                  data-tip="${y(`Show temperature graph for the burg`)}"
                  class="icon-chart-area pointer"
                ></i>
              </div>
            </div>
            <div data-tip="${y(`Burg height above mean sea level`)}">
              <div class="label">${y(`Elevation`)}:</div>
              <span id="burgElevation"></span> ${y(`above sea level`)}
            </div>
            <div>
              <div class="label">${y(`Features`,{context:`burg`})}:</div>
              <span
                id="burgCapital"
                data-tip="${b(y(`Shows whether the burg is a state capital`),y(`Click to toggle`))}"
                data-feature="capital"
                class="burgFeature icon-star"
              ></span>
              <span
                id="burgPort"
                data-tip="${b(y(`Shows whether the burg is a port`),y(`Click to toggle`))}"
                data-feature="port"
                class="burgFeature icon-anchor"
              ></span>
              <span
                id="burgCitadel"
                data-tip="${b(y(`Shows whether the burg has a citadel (castle)`),y(`Click to toggle`))}"
                data-feature="citadel"
                class="burgFeature icon-chess-rook"
                style="font-size: 1.1em"
              ></span>
              <span
                id="burgWalls"
                data-tip="${b(y(`Shows whether the burg is walled`),y(`Click to toggle`))}"
                data-feature="walls"
                class="burgFeature icon-fort-awesome"
              ></span>
              <span
                id="burgPlaza"
                data-tip="${b(y(`Shows whether the burg is a trade center (market center)`),y(`Click to toggle`))}"
                data-feature="plaza"
                class="burgFeature icon-store"
                style="font-size: 1em"
              ></span>
              <span
                id="burgTemple"
                data-tip="${b(y(`Shows whether the burg is a religious center`),y(`Click to toggle`))}"
                data-feature="temple"
                class="burgFeature icon-chess-bishop"
                style="font-size: 1.1em; margin-left: 3px"
              ></span>
              <span
                id="burgShanty"
                data-tip="${b(y(`Shows whether the burg has a shanty town`),y(`Click to toggle`))}"
                data-feature="shanty"
                class="burgFeature icon-campground"
                style="font-size: 1em"
              ></span>
            </div>
            <div id="burgDevelopmentLine" data-tip="${y(`Development of the burg's land, 0–100, and its era: what it can make`)}">
              <div class="label">${y(`Development`)}:</div>
              <span id="burgDevelopment"></span>
            </div>
            <div id="burgProsperityLine">
              <div class="label">${y(`Prosperity`)}:</div>
              <span id="burgProsperity"></span>
            </div>
            <div data-tip="${b(h.wealth(),h.product())}">
              <div class="label">${y(`Wealth`)}:</div>
              <span id="burgWealth"></span>
              <span id="burgWealthEconomy" data-tip="${h.open()}" class="icon-chart-bar pointer" style="margin-left: 0.3em"></span>
            </div>
            <div data-tip="${y(`Burg tags (comma-separated)`)}">
              <div class="label"><label for="burgTags">${y(`Tags`)}:</label></div>
              <input
                id="burgTags"
                placeholder="${y(`Tags`)}"
                autocorrect="off"
                spellcheck="false"
                style="width: 9em"
              />
            </div>
          </div>
        </div>
        <div id="burgPreviewSection" data-tip="${y(`Burg map preview: scroll to zoom, drag to pan`)}" style="display: flex; flex-direction: column">
          <div style="display: flex; justify-content: space-between">
            <span>${y(`Burg preview`)}:</span>
            <div style="display: flex; gap: 0.5em">
              <i id="burgPreviewReset" data-tip="${y(`Reset preview zoom`)}" class="icon-ccw pointer"></i>
              <i id="burgLinkOpen" data-tip="${y(`Open burg map in a new tab`)}" class="icon-link-ext pointer"></i>
            </div>
          </div>
          <div
            id="burgPreviewObject"
            style="overflow: hidden; position: relative; touch-action: none; height: 320px; max-width: 60vw; max-height: 60vh"
          ></div>
        </div>
      </div>
      <div id="burgBottom">
        <button id="burgStyleShow" data-tip="${y(`Show`)}" class="icon-brush"></button>
        <div id="burgStyleSection" style="display: none">
          <button id="burgStyleHide" data-tip="${y(`Hide`)}" class="icon-brush"></button>
          <button
            id="burgEditLabelStyle"
            data-tip="${y(`Edit label style for burg group in Style Editor`)}"
            class="icon-font"
          ></button>
          <button
            id="burgEditGroupStyle"
            data-tip="${y(`Edit icon and anchor style for the burg group in Style Editor`)}"
            class="icon-dot-circled"
          ></button>
        </div>
        <button id="burgEditLabel" data-tip="${y(`Edit this burg label`)}" class="icon-font"></button>
        <button id="burgEditEmblem" data-tip="${y(`Edit Emblem`)}" class="icon-shield-alt"></button>
        <button id="burgSetPreviewLink" data-tip="${y(`Set custom burg map URL`)}" class="icon-map-o"></button>
        <button id="burgLocate" data-tip="${y(`Zoom map and center view in the burg`)}" class="icon-target"></button>
        <button
          id="burgEconomyButton"
          data-tip="${h.open()}"
          class="icon-chart-bar"
        ></button>
        <button
          id="burgRelocate"
          data-tip="${y(`Relocate burg. Click on map to move the burg`)}"
          class="icon-map-pin"
        ></button>
        ${ae(`burglLegend`,y(`Edit free text notes (legend)`))}
        <button id="burgLock" class="icon-lock-open" data-lock-tip></button>
        <button
          id="burgRemove"
          data-tip="${y(`Remove`)}"
          data-shortcut="Delete"
          class="icon-trash fastDelete"
        ></button>
      </div>
    </div>`;t(`dialogs`).insertAdjacentHTML(`beforeend`,e),t(`burgName`).addEventListener(`input`,F),t(`burgNameSpeak`).addEventListener(`click`,()=>ie(t(`burgName`).value)),t(`burgNameReRandom`).addEventListener(`click`,I),t(`burgGroup`).addEventListener(`change`,L),t(`burgGroupConfigure`).addEventListener(`click`,ze),t(`burgType`).addEventListener(`change`,R),t(`burgCulture`).addEventListener(`change`,z),t(`burgNameReCulture`).addEventListener(`click`,he),t(`burgPopulation`).addEventListener(`change`,ge),t(`burgWealthEconomy`).addEventListener(`click`,$),t(`burgTags`).addEventListener(`change`,_e),t(`burgBody`).querySelectorAll(`.burgFeature`).forEach(e=>void e.addEventListener(`click`,ve)),t(`burgLinkOpen`).addEventListener(`click`,Ne),t(`burgPreviewReset`).addEventListener(`click`,G),t(`burgPreviewObject`).addEventListener(`wheel`,Oe,{passive:!1}),t(`burgPreviewObject`).addEventListener(`dblclick`,ke),t(`burgPreviewObject`).addEventListener(`pointerdown`,Ae),t(`burgStyleShow`).addEventListener(`click`,Ce),t(`burgStyleHide`).addEventListener(`click`,we),t(`burgEditLabelStyle`).addEventListener(`click`,Te),t(`burgEditGroupStyle`).addEventListener(`click`,De),t(`burgEmblem`).addEventListener(`click`,X),t(`burgSetPreviewLink`).addEventListener(`click`,Y),t(`burgEditEmblem`).addEventListener(`click`,X),t(`burgLocate`).addEventListener(`click`,Pe),t(`burgEditLabel`).addEventListener(`click`,Ee),t(`burgRelocate`).addEventListener(`click`,Q),t(`burglLegend`).addEventListener(`click`,Ie),t(`burgLock`).addEventListener(`click`,Se),t(`burgRemove`).addEventListener(`click`,Re),t(`burgTemperatureGraph`).addEventListener(`click`,Le),t(`burgEconomyButton`).addEventListener(`click`,$)}function M(){return E??+T.attr(`data-id`)}function N(){let e=t(`burgGroup`);e.options.length=0;for(let{name:t}of options.map.burgs.groups)e.options.add(new Option(t,t))}function P(){let e=M(),n=pack.burgs[e],r=pack.cells.province[n.cell],i=r?`${pack.provinces[r].fullName}, `:``,o=pack.states[n.state].fullName||pack.states[n.state].name;t(`burgProvinceAndState`).textContent=i+o,t(`burgName`).value=n.name,t(`burgGroup`).value=n.group,t(`burgType`).value=n.type||`Generic`,t(`burgPopulation`).value=String(_(n.population*options.map.units.population.scale*options.map.units.population.urbanization.rate)),t(`burgWealth`).innerHTML=`🟡 ${_(n.population>0?(n.product||0)/n.population:0,2)}`,t(`burgTags`).value=a.format(n.tags);let s=t(`burgCulture`);s.options.length=0,pack.cultures.filter(e=>!e.removed).forEach(e=>void s.options.add(new Option(e.name,String(e.i),!1,e.i===n.culture)));let c=grid.cells.temp[pack.cells.g[n.cell]];t(`burgTemperature`).innerHTML=re(c),t(`burgTemperatureLikeIn`).dataset.tip=y(`Average yearly temperature is like in {{place}}`,{place:te(c)}),t(`burgElevation`).innerHTML=ne(pack.cells.h[n.cell]),t(`burgCapital`).classList.toggle(`inactive`,!n.capital),t(`burgPort`).classList.toggle(`inactive`,!n.port),t(`burgCitadel`).classList.toggle(`inactive`,!n.citadel),t(`burgWalls`).classList.toggle(`inactive`,!n.walls),t(`burgPlaza`).classList.toggle(`inactive`,!n.plaza),t(`burgTemple`).classList.toggle(`inactive`,!n.temple),t(`burgShanty`).classList.toggle(`inactive`,!n.shanty);let l=ee.getBurg(n.i);t(`burgProsperity`).innerHTML=l?ce(l.prosperity):`—`,t(`burgProsperityLine`).dataset.tip=l?se(l.prosperity):h.noData();let d=pack.cells.development?.[n.cell];t(`burgDevelopment`).textContent=d===void 0?`—`:oe(d),V();let f=`burgCOA${e}`;u.trigger(f,n.coa),t(`burgEmblem`).setAttribute(`href`,`#${f}`),J(n)}function F(){let e=t(`burgName`).value;e.trim()&&(o.rename(M(),e),d.draw(`labels`))}function I(){let e=c(s.nameBases.length-1);t(`burgName`).value=s.getBase(e),F()}function L(){let e=M(),t=pack.burgs[e];o.changeGroup(t,this.value),d.draw(`burgIcons`,`labels`)}function R(){let e=M();o.setType(e,this.value)}function z(){o.setCulture(M(),+this.value)}function he(){let e=M(),n=pack.burgs[e].culture;t(`burgName`).value=s.getCulture(n),F()}function ge(){let e=M(),n=pack.burgs[e],r=t(`burgPopulation`).valueAsNumber;Number.isFinite(r)&&r>=0&&o.setPopulation(e,r),J(n)}function _e(){let e=pack.burgs[M()];if(!e)return;let n=t(`burgTags`);a.set(e,n.value),n.value=a.format(e.tags)}function ve(){let e=M(),t=pack.burgs[e],n=this.dataset.feature,r=Number(this.classList.contains(`inactive`));if(n===`plaza`&&!r){let t=pack.markets?.find(t=>t.centerBurgId===e);if(t){ye(t);return}}n===`port`?be(e):n===`capital`?xe(e):o.setBuilding(e,n,!!r),this.classList.toggle(`inactive`,!t[n]),J(t)}function ye(e){m.confirm({title:y(`Remove`),message:`${y(`This burg is the center of the market “{{market}}”. Remove the market?`,{market:i.getName(e)})}<br>${y(`This action cannot be reverted`)}`,confirm:y(`Remove`),onConfirm:()=>{i.removeMarket(e.i),p(),d.draw(`markets`,`goods`,`trade`),P()}})}function be(e){B(()=>o.setPort(e,!pack.burgs[e].port))&&d.draw(`burgIcons`)}function xe(e){pack.burgs[e].capital?g(y(`To change capital please assign a capital status to another burg of this state`),!1,`error`):B(()=>o.setCapital(e))&&d.draw(`burgIcons`,`labels`)}function B(e){try{return e(),!0}catch(e){return g(fe(e),!1,`error`),!1}}function Se(){let e=M();o.setLocked(e,!pack.burgs[e].lock),V()}function V(){let e=M();pack.burgs[e].lock?(t(`burgLock`).classList.remove(`icon-lock-open`),t(`burgLock`).classList.add(`icon-lock`)):(t(`burgLock`).classList.remove(`icon-lock`),t(`burgLock`).classList.add(`icon-lock-open`))}function Ce(){document.querySelectorAll(`#burgBottom > button`).forEach(e=>{e.style.display=`none`}),t(`burgStyleSection`).style.display=`inline-block`}function we(){document.querySelectorAll(`#burgBottom > button`).forEach(e=>{e.style.display=`inline-block`}),t(`burgStyleSection`).style.display=`none`}function Te(){let e=pack.burgs[M()];m.closeAll(`.stable`),r.StyleEditor.open(`labels`,e.label?.group||e.group)}function Ee(){let e=M();m.close(`burgEditor`),r.LabelsEditor.open(`burg`,e)}function De(){let e=pack.burgs[M()];m.closeAll(`.stable`),r.StyleEditor.open(`burgIcons`,e.group)}function H(){let e=t(`burgPreviewObject`);return{width:e.clientWidth,height:e.clientHeight}}function U(){let e=t(`burgPreviewObject`),n=e.querySelector(`iframe`);if(!n)return;let{k:r,x:i,y:a}=D;n.style.transformOrigin=`0 0`,n.style.transform=`translate(${i}px, ${a}px) scale(${r/k})`,n.style.left=`0`,n.style.top=`0`,e.style.cursor=r>1?`grab`:`default`,clearTimeout(A),j||(A=window.setTimeout(W,200))}function W(){if(j)return;let e=t(`burgPreviewObject`).querySelector(`iframe`);if(!e)return;let{k:n,x:r,y:i}=D;k=n,e.style.width=`${n*100}%`,e.style.height=`${n*100}%`,e.style.transform=`none`,e.style.left=`${r}px`,e.style.top=`${i}px`}function G(){D={...x},clearTimeout(A),j?U():W(),t(`burgPreviewObject`).style.cursor=`default`}function K(e){let n=t(`burgPreviewObject`).getBoundingClientRect();return{x:e.clientX-n.left,y:e.clientY-n.top}}function Oe(e){e.preventDefault();let t=Math.exp(-e.deltaY*(e.deltaMode===1?.05:e.deltaMode?1:.002));D=C(D,K(e),t,H(),O),U()}function ke(e){D=C(D,K(e),2,H(),O),U()}function Ae(e){if(D.k<=1)return;e.preventDefault();let n=t(`burgPreviewObject`);n.setPointerCapture(e.pointerId),n.style.cursor=`grabbing`;let r={x:e.clientX,y:e.clientY},i=e=>{let t=e;D=w(D,t.clientX-r.x,t.clientY-r.y,H()),r={x:t.clientX,y:t.clientY},U()},a=()=>{n.removeEventListener(`pointermove`,i),n.removeEventListener(`pointerup`,a),n.removeEventListener(`pointercancel`,a),n.style.cursor=`grab`};n.addEventListener(`pointermove`,i),n.addEventListener(`pointerup`,a),n.addEventListener(`pointercancel`,a)}var q=0;function je(){if(!q){let e=document.createElement(`canvas`).getContext(`webgl`);q=e?e.getParameter(e.MAX_TEXTURE_SIZE):4096}return q}function Me(){let{width:e,height:t}=H(),n=Math.max(e,t,1);return je()/2/(devicePixelRatio*n)}function J(e){let n=o.getPreview(e).preview;if(!n){t(`burgPreviewSection`).style.display=`none`;return}t(`burgPreviewSection`).style.display=`block`;let r=t(`burgPreviewObject`);r.innerHTML=``;let i=document.createElement(`iframe`);if(i.style.position=`absolute`,i.style.border=`none`,i.style.pointerEvents=`none`,i.setAttribute(`sandbox`,`allow-scripts allow-same-origin`),i.src=n,r.insertBefore(i,null),j=n.includes(`watabou.github.io`),j){let e=Math.max(1,Math.min(4,Me()));k=e,i.style.width=`${e*100}%`,i.style.height=`${e*100}%`,O=Math.min(32,e*2.5)}else k=1,O=32;G()}function Ne(){let e=M(),t=pack.burgs[e],n=o.getPreview(t).link;n&&de(n)}function Y(){let e=M(),t=pack.burgs[e];m.prompt(y(`Provide custom URL to the burg map. It can be a link to a generator or just an image. Leave empty to use the default map preview`),{default:o.getPreview(t).link||``,required:!1},n=>{try{o.setLink(e,String(n??``))}catch(e){g(e.message,!1,`error`)}J(t)})}function X(){let e=M(),t=pack.burgs[e];r.EmblemsEditor.open(`burg`,`burgCOA${e}`,t)}function Pe(){let e=M(),t=pack.burgs[e];le(t.x,t.y,8,2e3)}var Z=!1;function Q(){t(`burgRelocate`).classList.toggle(`pressed`),t(`burgRelocate`).classList.contains(`pressed`)?(n(`#viewbox`).style(`cursor`,`crosshair`).on(`click`,Fe),g(y(`Click on map to relocate burg. Hold Shift for continuous move`),!0),d.isOn(`cells`)||(d.show(`cells`),Z=!0)):(ue(),f(),Z&&=(d.hide(`cells`),!1))}function Fe(t){let[n,r]=e(t,this);B(()=>o.move(M(),n,r))&&(d.draw(`burgIcons`,`labels`,`routes`,`goods`,`markets`,`trade`),t.shiftKey===!1&&Q())}function Ie(){r.NotesEditor.open({type:`burg`,id:M()})}function Le(){let e=M();r.TemperatureGraph.open(e)}function $(){let e=M();r.BurgEconomyOverview.open(e)}function Re(){let e=M();pack.burgs[e].capital?m.message({message:`${b(y(`You cannot remove the capital`),y(`You must change the state capital first`))}`,title:y(`Remove`)}):pack.markets?.some(t=>t.centerBurgId===e)?m.message({message:`${y(`You cannot remove a market center burg. Please remove the market first`)}`,title:y(`Remove`)}):m.confirm({title:y(`Remove`),message:`${y(`Are you sure you want to remove the burg?`)}<br>${y(`This action cannot be reverted`)}`,confirm:y(`Remove`),onConfirm:()=>{o.remove(e),p(),l(`burg`,e),d.draw(`burgIcons`,`labels`,`goods`,`trade`),m.close(`burgEditor`)}})}function ze(){r.BurgGroupEditor.open()}function Be(){clearTimeout(A),t(`burgRelocate`).classList.contains(`pressed`)&&Q(),T=null,t(`burgPreviewObject`).replaceChildren(),m.destroy(`burgEditor`)}var Ve={open:pe};export{Ve as BurgEditor};