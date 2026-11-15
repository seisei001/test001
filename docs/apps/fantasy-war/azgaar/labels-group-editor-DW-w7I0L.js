import{t as e}from"./controllers-Dbv1ZRTV.js";import{B as t,dn as n,fn as r,n as i,z as a}from"./options-model-CrstL1Qd.js";import{X as o,Z as s}from"./app-DCKsq5m8.js";import{_ as c,g as l,t as u}from"./layers-DjWzCbYN.js";import{t as d}from"./dialog-BkeQgjla.js";import{o as f}from"./tooltips-BVQbACdS.js";import{a as p,i as m}from"./index-sNerCVjG.js";import{r as h}from"./node-utils-Ds1sVy-v.js";function g(){options.app.mode||(d.closeAll(`.stable`),_(),v(),d.open(`labelGroupsConfigurator`,{title:p(`Configure Label Groups`),maxHeight:Math.max(window.innerHeight-40,300),position:{my:`right top`,at:`right-10 top+10`,of:`svg`},onClose:A,buttons:[{label:p(`Apply`),onClick:()=>{h(`labelGroupsForm`).requestSubmit()}},{label:p(`Add`),onClick:()=>{h(`labelGroupsBody`).insertAdjacentHTML(`beforeend`,x({name:``,type:`state`,zoom:{min:null,max:null}},!0,0))}},{label:p(`Restore`),onClick:()=>{let e=r.getDefaultOptions();h(`labelsShowAll`).checked=e.showAll,v(e.groups)}},{label:p(`Cancel`),onClick:()=>{d.close(`labelGroupsConfigurator`)}}]}))}function _(){d.destroy(`labelGroupsConfigurator`);let t=`<div id="labelGroupsConfigurator" class="dialog stable">
    <form id="labelGroupsForm">
      <table class="table" style="white-space:nowrap; overflow-x:auto; max-width:100%">
        <colgroup>
          <col style="width:2.5em">
          <col style="width:8em">
          <col style="width:5.5em">
          <col style="width:4em">
          <col style="width:3.5em">
          <col style="width:3.5em">
          <col style="width:8.5em">
          <col style="width:3.5em">
          <col style="width:3.2em">
          <col style="width:3.2em">
        </colgroup>
        <thead>
          <tr>
            <th data-tip="${m(p(`Activate/deactivate group`),p(`Deactivated group labels are not visible`))}">${p(`Active`)}</th>
            <th data-tip="${m(p(`Group name`),p(`Must start with a letter or underscore, followed by letters, digits, underscores, or dashes`))}">${p(`Group`)}</th>
            <th data-tip="${p(`Label type, fixed after creation`)}">${p(`Type`)}</th>
            <th data-tip="${p(`Name display mode. Only applicable to States and Provinces`)}">${p(`Mode`)}</th>
            <th data-tip="${p(`Minimum zoom level to show the group`)}">${p(`Zoom min`)}</th>
            <th data-tip="${p(`Maximum zoom level to show the group`)}">${p(`Zoom max`)}</th>
            <th data-tip="${p(`Layer that must be toggled on for this group to be shown`)}">${p(`Layer dependency`)}</th>
            <th data-tip="${m(p(`Number of labels currently assigned to this group`),p(`Click the list icon to see them`))}">${p(`Labels`)}</th>
            <th data-tip="${p(`Rendering order: lower groups are rendered on top`)}">${p(`Order`)}</th>
            <th data-tip="${p(`Edit style or remove group`)}">${p(`Actions`)}</th>
          </tr>
        </thead>
        <tbody id="labelGroupsBody"></tbody>
      </table>
      <div id="labelGroupsMissingWrapper" style="display:none; gap:.4em; align-items:center; margin:.6em 0 0">
        <label data-tip="${p(`Groups referenced by labels but not defined here. Such labels are not rendered until they are reassigned to an existing group`)}"><strong>${p(`Missing groups`)}:</strong> <span id="labelGroupsMissing"></span></label>
      </div>
      <div style="display:flex; gap:1.2em; align-items:center; margin:.6em 0 0">
        <label data-tip="${p(`Ignore zoom bounds and show all labels regardless of the current zoom level`)}"><input id="labelsShowAll" class="checkbox" type="checkbox" ${options.app.labels.showAll?`checked`:``}><span class="checkbox-label">${p(`Show all labels`)} <small>[${p(`slow`)}]</small></span></label>
        <div style="padding: 0.5em 0; font-style: italic;">${p(`To change Burg Groups open {{- configurator}}.`,{configurator:`<a id="labelGroupsBurgGroupsLink" style="text-decoration: underline;">${p(`Burg Group Configurator`)}</a>`})}</div>
      </div>
    </form>
  </div>`;h(`dialogs`).insertAdjacentHTML(`beforeend`,t);let n=h(`labelGroupsForm`);n.addEventListener(`change`,D),n.addEventListener(`submit`,O),h(`labelGroupsBody`).addEventListener(`click`,w),h(`labelGroupsBody`).addEventListener(`change`,S),h(`labelGroupsBurgGroupsLink`).addEventListener(`click`,()=>e.BurgGroupEditor.open()),h(`labelGroupsMissing`).addEventListener(`click`,C)}function v(e=options.map.labels.groups){let t=b();h(`labelGroupsBody`).innerHTML=e.map(e=>x(e,!1,t.get(e.name)??0)).join(``),y(t,e)}function y(e,t){let n=new Set(t.map(({name:e})=>e)),r=[...e.entries()].filter(([e])=>!n.has(e)).sort();h(`labelGroupsMissingWrapper`).style.display=r.length?`flex`:`none`,h(`labelGroupsMissing`).innerHTML=r.map(([e,t])=>`${e} (${t})
        <button type="button" name="missing" data-group="${e}" class="icon-list-bullet"
          data-tip="${p(`Show labels of the {{group}} group in Labels Overview to reassign them`,{group:e})}"></button>`).join(`, `)}function b(){let e=new Map,t=t=>e.set(t,(e.get(t)??0)+1);return l().forEach(e=>void t(e.group)),e}function x(e,r=!1,i=0){let c=[`auto`,`short`,`full`],l=!!e.isDefault,u=l?p(`Default group for this type, can't be renamed`):m(p(`Group name`),p(`Must start with a letter or underscore, followed by letters, digits, underscores, or dashes`)),d=E(e.type),f=p(d?`Name display mode: auto picks the best fit, short/full force a specific name form`:`Name display mode. Only applicable to States and Provinces`),h=[...o.keys()].sort();return`<tr data-group="${r?``:e.name}" data-is-default="${l?`1`:``}">
      <td data-tip="${p(`Activate/deactivate group`)}"><input type="checkbox" name="active" class="native" ${e.active===!1?``:`checked`}></td>
      <td data-tip="${u}"><input type="text" name="name" value="${e.name}" ${l?`disabled`:`required`}></td>
      <td data-tip="${p(`Label type, fixed after creation`)}"><select name="type" ${r?``:`disabled`}>
        ${n.map(n=>`<option value="${n}" ${e.type===n?`selected`:``}>${t[n]}</option>`).join(``)}
      </select></td>
      <td data-tip="${f}"><select name="mode" ${d?``:`disabled`}>
        ${c.map(t=>`<option value="${t}" ${(e.mode||`auto`)===t?`selected`:``}>${a[t]??t}</option>`).join(``)}
      </select></td>
      <td data-tip="${p(`Minimum zoom to show the group, leave empty for no limit`)}"><input type="number" name="zoom-min" min="0.01" max="200" step=".01" value="${e.zoom.min??``}"></td>
      <td data-tip="${p(`Maximum zoom to show the group, leave empty for no limit`)}"><input type="number" name="zoom-max" min="0.01" max="200" step=".01" value="${e.zoom.max??``}"></td>
      <td data-tip="${p(`Layer that must be toggled on for this group to be shown`)}"><select name="dependency">
        <option value="">${p(`None`)}</option>
        ${h.map(t=>`<option value="${t}" ${e.layerDependency===t?`selected`:``}>${s(t)}</option>`).join(``)}
      </select></td>
      <td data-tip="${p(`Number of labels currently assigned to this group`)}" style="text-align:center">
        <div style="min-width:2em; display:inline-block">${i}</div>
        <button type="button" name="list" class="icon-list-bullet" data-tip="${p(`Show labels of this group in Labels Overview`)}"></button>
      </td>
      <td data-tip="${p(`Assignment order: move group up or down`)}"><button type="button" name="up" class="icon-up-open" data-tip="${p(`Move up`)}"></button><button type="button" name="down" class="icon-down-open" data-tip="${p(`Move down`)}"></button></td>
      <td><button type="button" name="style" class="icon-brush" data-tip="${p(`Edit style`)}"></button><span data-tip="${p(l?`Default groups can't be removed`:`Remove`)}"><button type="button" name="remove" class="icon-trash-empty" ${l?`disabled`:``}></button></span></td>
    </tr>`}function S(e){let t=e.target;if(!(t instanceof HTMLSelectElement)||t.name!==`type`)return;let n=t.closest(`tr`)?.querySelector(`[name="mode"]`);if(!n)return;let r=E(t.value);n.disabled=!r,r||(n.value=`auto`)}function C(t){let n=t.target.closest(`button[name='missing']`);n?.dataset.group&&e.LabelsOverview.open(n.dataset.group)}function w(t){let n=t.target.closest(`button[name]`);if(!n||n.disabled)return;let r=n.closest(`tr`);if(r){if(n.name===`up`){let e=r.previousElementSibling;e&&r.parentNode.insertBefore(r,e)}else if(n.name===`down`){let e=r.nextElementSibling;e&&r.parentNode.insertBefore(e,r)}else if(n.name===`style`){let t=r.querySelector(`[name="name"]`).value.trim();t&&e.StyleEditor.open(`labels`,t)}else if(n.name===`list`){let t=r.dataset.group;t&&e.LabelsOverview.open(t)}else n.name===`remove`&&T(r)}}function T(e){h(`labelGroupsBody`).children.length<2?f(p(`At least one group should be defined`),!1,`error`):d.confirm({title:p(`Remove`),message:p(`Remove the group? This won't affect labels unless the changes are applied.`),confirm:p(`Remove`),onConfirm:()=>{e.remove(),D()}})}function E(e){return[`state`,`province`].includes(e)}function D(){let e=h(`labelGroupsForm`),t=Array.from(e.querySelectorAll(`input[name="name"]`)),n=t.map(e=>e.value.trim());t.forEach(e=>{if(e.disabled){e.setCustomValidity(``);return}let t=``,r=e.value.trim(),i=/^[\p{L}_][\p{L}\p{N}_-]*$/u.test(r),a=n.filter(e=>e===r).length===1;i||(t=p(`Group name must start with a letter or underscore and not contain special characters`)),a||(t=p(`Group name should be unique`)),e.setCustomValidity(t)});let r=e.checkValidity();return r||e.reportValidity(),r}function O(e){if(e.preventDefault(),!D())return;let t=Array.from(h(`labelGroupsBody`).children);if(!t.length)return void f(p(`At least one group should be defined`),!1,`error`);let n=new Set;t.forEach(e=>{let t=e.dataset.group,i=k(e);n.add(i.name),i.name!==t&&(t?(r.regroup(t,i.name),styles.labels.groups[i.name]=styles.labels.groups[t],delete styles.labels.groups[t]):styles.labels.groups[i.name]=c(i))}),options.map.labels.groups.forEach(e=>{if(n.has(e.name))return;let t=r.getFallbackGroup(e.type);r.regroup(e.name,t.name),delete styles.labels.groups[e.name]}),options.map.labels.groups=t.map(k),i.set(e=>e.app.labels.showAll=h(`labelsShowAll`).checked);for(let e of options.map.labels.groups)styles.labels.groups[e.name]??=c(e);u.draw(`labels`),d.close(`labelGroupsConfigurator`)}function k(e){let t=e.querySelector(`[name="name"]`).value.trim(),n=e.querySelector(`[name="type"]`).value,r=e.querySelector(`[name="active"]`).checked,i=e.querySelector(`[name="mode"]`).value,a=e.querySelector(`[name="zoom-min"]`),o=e.querySelector(`[name="zoom-max"]`),s=e.querySelector(`[name="dependency"]`).value.trim(),c={name:t,type:n,zoom:{min:a.value===``?null:a.valueAsNumber,max:o.value===``?null:o.valueAsNumber}};return r||(c.active=!1),i!==`auto`&&(c.mode=i),u.has(s)&&(c.layerDependency=s),e.dataset.isDefault===`1`&&(c.isDefault=!0),c}function A(){d.destroy(`labelGroupsConfigurator`)}var j={open:g};export{j as LabelGroupsConfigurator};