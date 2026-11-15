import{t as e}from"./controllers-Dbv1ZRTV.js";import{m as t}from"./options-model-CrstL1Qd.js";import{G as n,f as r}from"./app-DCKsq5m8.js";import{t as i}from"./layers-DjWzCbYN.js";import{t as a}from"./dialog-BkeQgjla.js";import{a as o,m as s}from"./index-sNerCVjG.js";import{r as c}from"./node-utils-Ds1sVy-v.js";var l=`markersSettings`;function u(){options.app.mode||(a.destroy(l),c(`dialogs`).insertAdjacentHTML(`beforeend`,`<div id="${l}" class="dialog"></div>`),f(),a.open(l,{title:o(`Markers generation settings`),maxHeight:600,position:{my:`left top`,at:`left+10 top+10`,of:`svg`},buttons:[{label:o(`Regenerate`),tip:o(`Apply changes and regenerate markers`),onClick:()=>{d(),n.regenerate(),i.draw(`markers`),r(),a.close(l)}},{label:o(`Close`),tip:o(`Close the window`),onClick:()=>a.close(l)}],onClose:p}))}function d(){let e=c(l).querySelectorAll(`tbody > tr`),t=Array.from(e).map(e=>{let t=e.querySelector(`.type`),n=e.querySelector(`.changeIcon`),r=e.querySelector(`.multiplier`);if(!t||!n||!r)throw Error(`Invalid markers configuration row`);return{type:t.value,icon:n.dataset.icon??``,multiplier:r.valueAsNumber}});n.setConfig(n.getConfig().map((e,n)=>({...e,...t[n]})))}function f(){let r=`<thead style='font-weight:bold'><tr>
    <td data-tip="${o(`Name`)}">${o(`Type`)}</td>
    <td data-tip="${o(`Marker icon`)}">${o(`Icon`)}</td>
    <td data-tip="${o(`Marker number multiplier`)}">${o(`Multiplier`)}</td>
    <td data-tip="${o(`Number of markers of that type on the current map`)}">${o(`Number`)}</td>
  </tr></thead>`,i=n.getConfig().map(({type:e,icon:n,multiplier:r})=>`<tr>
      <td><input class="type" value="${e}" /></td>
      <td>
        <button class="changeIcon" data-icon="${s(n)}" data-tip="${o(`Change the icon`)}" style="font-size: 1.2em">${t.html(n)}</button>
      </td>
      <td><input class="multiplier" type="number" min="0" max="100" step="0.1" value="${r}" /></td>
      <td style="text-align:center">${pack.markers.filter(t=>t.type===e).length}</td>
    </tr>`),a=c(l);a.innerHTML=`<table class="table">${r}<tbody>${i.join(``)}</tbody></table>`,a.querySelectorAll(`button.changeIcon`).forEach(n=>{n.addEventListener(`click`,()=>{e.IconPicker.open({current:n.dataset.icon??``,onPick:e=>{n.dataset.icon=e,n.innerHTML=t.html(e)}})})})}function p(){a.destroy(l)}var m={open:u};export{m as MarkersSettings};