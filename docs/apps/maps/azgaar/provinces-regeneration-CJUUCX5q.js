import{a as e}from"./military-generator-CVth4JoO.js";import{c as t,lt as n,t as r}from"./layers-DjWzCbYN.js";import{t as i}from"./dialog-BkeQgjla.js";import{f as a,l as o}from"./app-DCKsq5m8.js";import{o as s}from"./tooltips-BVQbACdS.js";import{a as c}from"./index-sNerCVjG.js";import{r as l}from"./node-utils-Ds1sVy-v.js";var u=`provincesRegeneration`;function d(){options.app.mode||(i.destroy(u),l(`dialogs`).insertAdjacentHTML(`beforeend`,`<div id="${u}" class="dialog"></div>`),f(),i.open(u,{title:c(`Regenerate Provinces`),width:`32em`,maxHeight:600,position:{my:`center`,at:`center`,of:`svg`},buttons:[{label:c(`Regenerate`),onClick:p},{label:c(`Close`),onClick:()=>{i.close(u)}}]}))}function f(){let e=pack.states.filter(e=>e.i&&!e.removed).sort((e,t)=>e.name.localeCompare(t.name)),t=e=>pack.provinces.filter(t=>t.i&&!t.removed&&t.state===e).length;for(let{i:t,coa:r}of e)r&&n.trigger(`stateCOA${t}`,r);let r=e.map(({i:e,name:n,fullName:r,color:i})=>`<div data-tip="${r||n}">
      <input id="${u}State${e}" class="checkbox" type="checkbox" value="${e}" checked />
      <label for="${u}State${e}" class="checkbox-label">
        <fill-box fill="${i}" disabled></fill-box>
        <svg class="coaIcon" viewBox="0 0 200 200"><use href="#stateCOA${e}"></use></svg>${n} (${t(e)})
      </label>
    </div>`),i=l(u);i.innerHTML=`
    <p style="margin-top: 0">${c(`Select states to regenerate provinces for. Locked provinces will remain as they are`)}</p>
    <div style="margin-bottom: 0.4em">
      <input id="${u}All" class="checkbox" type="checkbox" />
      <label for="${u}All" class="checkbox-label"><b>${c(`All states`)}</b></label>
    </div>
    <div class="stateList" style="width: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 0.3em">
      ${r.join(``)||c(`No states to regenerate provinces for`)}
    </div>`;let a=l(`${u}All`),o=Array.from(i.querySelectorAll(`.stateList input`)),s=()=>{let e=o.filter(e=>e.checked).length;a.checked=e===o.length,a.indeterminate=e>0&&e<o.length};s(),a.addEventListener(`change`,()=>{for(let e of o)e.checked=a.checked});for(let e of o)e.addEventListener(`change`,s)}function p(){let n=l(u).querySelectorAll(`.stateList input:checked`),d=Array.from(n,e=>Number(e.value));if(!d.length)return void s(c(`Please select at least one state`),!1,`error`);e.regenerate(!0,d),t(),r.draw(`borders`,`provinces`,`labels`,`emblems`),o(),a(),i.close(u)}var m={open:d};export{m as ProvincesRegeneration};