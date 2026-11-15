import{t as e}from"./controllers-Dbv1ZRTV.js";import{fn as t,g as n,n as r}from"./options-model-CrstL1Qd.js";import{t as i}from"./layers-DjWzCbYN.js";import{t as a}from"./dialog-BkeQgjla.js";import{f as o}from"./app-DCKsq5m8.js";import{n as s}from"./limitation-picker-C6HWXSdg.js";import{o as c}from"./tooltips-BVQbACdS.js";import{a as l,h as u,i as d}from"./index-sNerCVjG.js";import{r as f}from"./node-utils-Ds1sVy-v.js";var p=/^[\p{L}_][\p{L}\p{N}_-]*$/u;function m(){options.app.mode||(a.closeAll(`.stable`),h(),_(),a.open(`burgGroupsEditor`,{title:l(`Configure burg groups`),position:{my:`center`,at:`center`,of:`svg`},onClose:g,buttons:[{label:l(`Apply`),onClick:()=>{f(`burgGroupsForm`).requestSubmit()}},{label:l(`Add`),onClick:()=>{let e={name:``,order:Math.max(0,...options.map.burgs.groups.map(({order:e})=>e))+1,active:!0};f(`burgGroupsBody`).insertAdjacentHTML(`beforeend`,v(e))}},{label:l(`Restore`),onClick:()=>{_(n.getDefaultGroups())}},{label:l(`Cancel`),onClick:()=>{a.close(`burgGroupsEditor`)}}]}))}function h(){a.destroy(`burgGroupsEditor`);let t=`<div id="burgGroupsEditor" class="dialog stable">
    <form id="burgGroupsForm">
      <table class="table">
        <thead>
          <tr>
            <th data-tip="${l(`Rendering order: higher values are rendered on top`)}">${l(`Order`)}</th>
            <th data-tip="${l(`Group name`)}">${l(`Name`)}</th>
            <th data-tip="${l(`Burg preview generator`)}">${l(`Preview generator`)}</th>
            <th data-tip="${l(`Set min and max population constraint in population points (see the multiplier in Units Editor)`)}" colspan="3">${l(`Population`)}</th>
            <th data-tip="${l(`Select allowed biomes`)}">${l(`Biomes`)}</th>
            <th data-tip="${l(`Select allowed states`)}">${l(`States`)}</th>
            <th data-tip="${l(`Select allowed cultures`)}">${l(`Cultures`)}</th>
            <th data-tip="${l(`Select allowed religions`)}">${l(`Religions`)}</th>
            <th data-tip="${l(`Select allowed features`)}">${l(`Features`,{context:`burg`})}</th>
            <th data-tip="${l(`Number of burgs in group`)}">${l(`Count`)}</th>
            <th data-tip="${l(`Activate/deactivate group`)}">${l(`Active`)}</th>
            <th data-tip="${l(`Select group to be assigned if burg doesn't pass the criteria for other groups`)}">
              ${l(`Default`)}
            </th>
          </tr>
        </thead>
        <tbody id="burgGroupsBody"></tbody>
      </table>
    </form>
    <div style="padding: 0.5em 0; font-style: italic;">
      ${l(`Burg population is calculated as {{formula}}, see the {{- editor}}.`,{formula:`value * population_point * urbanization_rate`,editor:`<a style="text-decoration: underline;" id="burgGroupsUnitsEditorLink">${l(`Units Editor`)}</a>`})}
      <br>${l(`Applying changes reclassifies Burgs, but label groups are not affected. Reconcile label groups in {{- configurator}}.`,{configurator:`<a id="burgGroupsLabelGroupsLink" style="text-decoration: underline;">${l(`Label Group Configurator`)}</a>`})}
    </div>
  </div>`;f(`dialogs`).insertAdjacentHTML(`beforeend`,t);let n=f(`burgGroupsForm`);n.addEventListener(`change`,S),n.addEventListener(`submit`,T),f(`burgGroupsBody`).addEventListener(`click`,e=>{let t=e.target,n=t.closest(`tr`);if(n){if(t.getAttribute(`name`)===`biomes`)return y(t,pack.biomes.filter(e=>!e.removed).map(({i:e,name:t,color:n})=>({i:e,name:t,color:n})));if(t.getAttribute(`name`)===`states`)return y(t,pack.states);if(t.getAttribute(`name`)===`cultures`)return y(t,pack.cultures);if(t.getAttribute(`name`)===`religions`)return y(t,pack.religions);if(t.getAttribute(`name`)===`features`)return b(t);if(t.getAttribute(`name`)===`up`){let e=n.previousElementSibling;e&&n.parentNode.insertBefore(n,e)}else if(t.getAttribute(`name`)===`down`){let e=n.nextElementSibling;e&&n.parentNode.insertBefore(e,n)}else if(t.getAttribute(`name`)===`remove`)return x(n)}}),f(`burgGroupsUnitsEditorLink`).addEventListener(`click`,()=>e.UnitsEditor.open()),f(`burgGroupsLabelGroupsLink`).addEventListener(`click`,()=>e.LabelGroupsConfigurator.open())}function g(){a.destroy(`burgGroupsEditor`)}function _(e=options.map.burgs.groups){let t=e.map(v);f(`burgGroupsBody`).innerHTML=t.join(``)}function v(e){let t=pack.burgs.filter(t=>!t.removed&&t.group===e.name).length;return`<tr name="${e.name}">
      <td data-tip="${l(`Rendering order: higher values are rendered on top`)}"><input type="number" name="order" min="1" max="999" step="1" required value="${e.order||``}" /></td>
      <td data-tip="${d(l(`Group name`),l(`Must start with a letter or underscore, followed by letters, digits, underscores, or dashes`),l(`Spaces are not allowed`))}"><input type="text" name="name" value="${e.name}" required /></td>
      <td data-tip="${l(`Burg preview generator`)}">
        <select name="preview">
          <option value="" ${e.preview?``:`selected`}>${l(`No`)}</option>
          <option value="watabou-city" ${e.preview===`watabou-city`?`selected`:``}>Watabou City</option>
          <option value="watabou-village" ${e.preview===`watabou-village`?`selected`:``}>Watabou Village</option>
          <option value="watabou-dwelling" ${e.preview===`watabou-dwelling`?`selected`:``}>Watabou Dwelling</option>
        </select>
      </td>
      <td data-tip="${l(`Set min and max population constraint in population points (see the multiplier in Units Editor)`)}"><input type="number" name="min" min="0" step="any" value="${e.min||``}" /></td>
      <td data-tip="${l(`Set min and max population constraint in population points (see the multiplier in Units Editor)`)}"><input type="number" name="max" min="0" step="any" value="${e.max||``}" /></td>
      <td data-tip="${l(`Set population percentile: 0-100, where 90 means the burg must have a population higher than 90% of all burgs`)}"><input type="number" name="percentile" min="0" max="100" step="any" value="${e.percentile||``}" /></td>
      <td data-tip="${l(`Select allowed biomes`)}">
        <input type="hidden" name="biomes" value="${e.biomes||``}">
        <button type="button" name="biomes">${e.biomes?l(`Some`):l(`All`)}</button>
      </td>
      <td data-tip="${l(`Select allowed states`)}">
        <input type="hidden" name="states" value="${e.states||``}">
        <button type="button" name="states">${e.states?l(`Some`):l(`All`)}</button>
      </td>
      <td data-tip="${l(`Select allowed cultures`)}">
        <input type="hidden" name="cultures" value="${e.cultures||``}">
        <button type="button" name="cultures">${e.cultures?l(`Some`):l(`All`)}</button>
      </td>
      <td data-tip="${l(`Select allowed religions`)}">
        <input type="hidden" name="religions" value="${e.religions||``}">
        <button type="button" name="religions">${e.religions?l(`Some`):l(`All`)}</button>
      </td>
      <td data-tip="${l(`Select allowed features`)}" >
        <input type="hidden" name="features" value='${JSON.stringify(e.features||{})}'>
        <button type="button" name="features">${Object.keys(e.features||{}).length?l(`Some`):l(`Any`)}</button>
      </td>
      <td data-tip="${l(`Number of burgs in group`)}">${t}</td>
      <td data-tip="${l(`Activate/deactivate group`)}"><input type="checkbox" name="active" class="native" ${e.active&&`checked`} /></td>
      <td data-tip="${l(`Select group to be assigned if other groups are not passed`)}"><input type="radio" name="isDefault" ${e.isDefault&&`checked`}></td>
      <td data-tip="${l(`Assignment order: move group up or down`)}"><button type="button" name="up" class="icon-up-big"></button></td>
      <td data-tip="${l(`Assignment order: move group up or down`)}"><button type="button" name="down" class="icon-down-big"></button></td>
      <td data-tip="${l(`Remove`)}"><button type="button" name="remove" class="icon-trash"></button></td>
    </tr>`}function y(e,t){let n=e.previousElementSibling;s({title:l(`Limit group`),heading:l(`Limit group by {{feature}}`,{feature:e.getAttribute(`name`)}),items:t,allowed:n.value?n.value.split(`,`).map(Number):[],onApply:t=>{n.value=t.join(`,`),e.innerHTML=t.length?l(`Some`):l(`All`)}})}function b(e){let t=e.previousElementSibling.value,n=t?JSON.parse(t):{},r=[{name:`capital`,icon:`icon-star`},{name:`port`,icon:`icon-anchor`},{name:`citadel`,icon:`icon-chess-rook`},{name:`walls`,icon:`icon-fort-awesome`},{name:`plaza`,icon:`icon-store`},{name:`temple`,icon:`icon-chess-bishop`},{name:`shanty`,icon:`icon-campground`}],i=r.map(({name:e,icon:t})=>`
        <tr data-tip="${l(`Select limitation for burg feature: {{feature}}`,{feature:e})}">
          <td>
            <span class="${t}"></span>
            <span style="margin-left:.2em">${e}</span>
          </td>
          <td>
            <input type="radio" name="${e}" value="true" ${n[e]===!0?`checked`:``} style="margin:0" >
          </td>
          <td>
            <input type="radio" name="${e}" value="false" ${n[e]===!1?`checked`:``} style="margin:0">
          </td>
          <td>
            <input type="radio" name="${e}" value="undefined" ${n[e]===void 0?`checked`:``} style="margin:0">
          </td>
        </tr>`);a.message({message:`
      <form id="featuresLimitationForm">
        <table>
          <thead style="font-weight:bold">
            <td style="width:6em">${l(`Features`,{context:`burg`})}</td>
            <td style="width:3em">${l(`True`)}</td>
            <td style="width:3em">${l(`False`)}</td>
            <td style="width:3em">${l(`Any`)}</td>
          </thead>
          <tbody>
            ${i.join(``)}
          </tbody>
        </table>
      </form>`,width:`fit-content`,title:l(`Limit group by features`),buttons:[{label:l(`Apply`),onClick:()=>{let t=f(`featuresLimitationForm`),n=r.reduce((e,{name:n})=>{let r=t[n].value;return r!==`undefined`&&(e[n]=r===`true`),e},{});e.previousElementSibling.value=JSON.stringify(n),e.innerHTML=Object.keys(n).length?l(`Some`):l(`Any`)}},{label:l(`Cancel`)}]})}function x(e){f(`burgGroupsBody`).children.length<2?c(l(`At least one group should be defined`),!1,`error`):a.confirm({title:l(`Remove`),message:`${l(`Are you sure you want to remove the group?`)}<br>${l(`This WON'T change the burgs unless the changes are applied`)}`,confirm:l(`Remove`),onConfirm:()=>{e.remove(),S()}})}function S(){let e=f(`burgGroupsForm`),t=e.name;if(t.length){let e=Array.from(t).map(e=>e.value);t.forEach(t=>{let n=t.value,r=p.test(n),i=e.filter(e=>e===n).length===1,a=r?i?``:l(`Group name should be unique`):l(`Group name must start with a letter or underscore and then contain only letters, digits, underscores, or dashes`);t.setCustomValidity(a)})}else{let e=t.value,n=p.test(e)?``:l(`Group name must start with a letter or underscore and then contain only letters, digits, underscores, or dashes`);t.setCustomValidity(n)}let n=e.active;if(n.length){let e=Array.from(n).map(e=>e.checked);n[0].setCustomValidity(e.includes(!0)?``:l(`At least one group should be active`))}else n.setCustomValidity(n.checked?``:l(`At least one group should be active`));let r=e.isDefault;if(r.length){let e=Array.from(r).map(e=>e.checked);r[0].setCustomValidity(e.includes(!0)?``:l(`At least one group should be default`))}else r.setCustomValidity(r.checked?``:l(`At least one group should be default`));let i=e.checkValidity();return i||e.reportValidity(),i}function C(e){let t=t=>e.querySelector(`input[name="${t}"]`),n=e=>{let n=t(e).valueAsNumber;return Number.isNaN(n)||n===0?void 0:n},r=e=>{let n=t(e).value;return n?n.split(`,`).map(Number):void 0};return{name:t(`name`).value,order:t(`order`).valueAsNumber,active:t(`active`).checked,isDefault:t(`isDefault`).checked,preview:e.querySelector(`select[name="preview"]`).value||void 0,min:n(`min`),max:n(`max`),percentile:n(`percentile`),features:w(t(`features`).value),biomes:r(`biomes`),states:r(`states`),cultures:r(`cultures`),religions:r(`religions`)}}function w(e){if(!u(e))return;let t=JSON.parse(e);return Object.keys(t).length?t:void 0}function T(e){if(e.preventDefault(),!S())return;let s=Array.from(f(`burgGroupsBody`).children);if(!s.length){c(l(`At least one group should be defined`),!1,`error`);return}options.map.burgs.groups=s.map(C),r.save();let u=pack.burgs.filter(e=>e.i&&!e.removed),d=u.map(e=>e.population).sort((e,t)=>e-t);u.forEach(e=>void n.defineGroup(e,d)),t.ensureBurgLabelGroups(),n.ensureBurgGroupStyles(),i.draw(`burgIcons`),i.draw(`labels`),o(),a.close(`burgGroupsEditor`)}var E={open:m};export{E as BurgGroupEditor};