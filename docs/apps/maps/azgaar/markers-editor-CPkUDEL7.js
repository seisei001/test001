import{i as e,r as t,z as n}from"./node-utils-Ds1sVy-v.js";import{t as r}from"./controllers-Dbv1ZRTV.js";import{C as i,m as a}from"./options-model-CrstL1Qd.js";import{G as o,f as s,u as c}from"./app-DCKsq5m8.js";import{t as l}from"./drag-CCSsgLNP.js";import{H as u,U as d}from"./layers-DjWzCbYN.js";import{t as f}from"./dialog-BkeQgjla.js";import{t as p}from"./map-placement-yj0IQ1LE.js";import{o as m,t as h}from"./tooltips-BVQbACdS.js";import{O as g,T as _,a as v,i as y}from"./index-sNerCVjG.js";var b,x;function S(i,a){if(options.app.mode)return;f.closeAll(`.stable`);let o=w(i,a);o&&([b,x]=o,n(b).raise().call(l().on(`start`,E)).classed(`draggable`,!0),e(`notesEditor`)&&r.NotesEditor.open({type:`marker`,id:x.i}),C(),t(`markerEditor`).dataset.entity=`marker:${x.i}`,D(),f.open(`markerEditor`,{title:v(`Edit Marker`),position:{my:`left top`,at:`left+10 top+10`,of:`svg`},onClose:X}))}function C(){f.destroy(`markerEditor`);let e=`<div id="markerEditor" class="dialog">
    <div id="markerBody" style="padding-bottom: 0.3em">
      <div data-tip="${v(`Marker name, shown in the notes editor and overviews`)}">
        <div class="label">${v(`Name`)}:</div>
        <input id="markerName" style="width: 10.3em" />
      </div>
      <div data-tip="${y(v(`Marker type`),v(`Style changes will apply to all markers of the same type`),v(`Leave blank if the marker is unique`))}">
        <div class="label">${v(`Type`)}:</div>
        <input id="markerType" style="width: 10.3em" />
      </div>
      <div data-tip="${v(`Marker tags (comma-separated)`)}">
        <div class="label">${v(`Tags`)}:</div>
        <input
          id="markerTags"
          placeholder="${v(`Tags`)}"
          autocorrect="off"
          spellcheck="false"
          style="width: 10.3em"
        />
      </div>
      <div data-tip="${v(`Marker icon`)}" style="display: flex; align-items: center">
        <div class="label">${v(`Icon`)}:</div>
        <div id="markerIcon" style="font-size: 1.5em; width: 3.7em; display: flex"></div>
        <button id="markerIconSelect" style="width: 5em">${v(`Select`)}</button>
      </div>
      <div data-tip="${v(`Marker marker element and icon sizes in pixels`)}">
        <div class="label">${v(`Size`)}:</div>
        <input data-tip="${v(`Marker element size in pixels`)}" id="markerSize" type="number" min="1" max="500" style="width: 5em" />
        <input data-tip="${v(`Marker icon sizes in pixels`)}" id="markerIconSize" type="number" min="1" max="50" step="0.1" style="width: 5em" />
      </div>
      <div data-tip="${v(`Marker icon shift (by X and by Y axis), percent. Set to 50 to position icon in center`)}">
        <div class="label">${v(`Icon shift`)}:</div>
        <input id="markerIconShiftX" type="number" min="0" max="100" step="1" style="width: 5em" />
        <input id="markerIconShiftY" type="number" min="0" max="100" step="1" style="width: 5em" />
      </div>
      <div data-tip="${v(`Marker pin shape`)}">
        <div class="label">${v(`Pin shape`)}:</div>
        <select id="markerPin" style="width: 10.3em">
          <option value="bubble">${v(`Bubble`)}</option>
          <option value="pin">${v(`Pin`)}</option>
          <option value="square">${v(`Square`)}</option>
          <option value="squarish">${v(`Squarish`)}</option>
          <option value="diamond">${v(`Diamond`)}</option>
          <option value="hex">${v(`Hex`)}</option>
          <option value="hexy">${v(`Hexy`)}</option>
          <option value="shieldy">${v(`Shieldy`)}</option>
          <option value="shield">${v(`Shield`)}</option>
          <option value="pentagon">${v(`Pentagon`)}</option>
          <option value="heptagon">${v(`Heptagon`)}</option>
          <option value="circle">${v(`Circle`)}</option>
          <option value="no">${v(`No`)}</option>
        </select>
      </div>
      <div data-tip="${v(`Pin fill and stroke colors`)}">
        <div class="label">${v(`Pin colors`)}:</div>
        <input id="markerFill" type="color" style="width: 5em; height: 1.6em" />
        <input id="markerStroke" type="color" style="width: 5em; height: 1.6em" />
      </div>
      <div data-tip="${v(`Icon fill and stroke colors: they paint the parts the icon leaves uncolored. Emoji keep their own colors`)}">
        <div class="label">${v(`Icon colors`)}:</div>
        <input id="markerIconFill" type="color" style="width: 5em; height: 1.6em" />
        <input id="markerIconStroke" type="color" style="width: 5em; height: 1.6em" />
        <i id="markerIconPaintReset" data-tip="${v(`Reset to default`)}" class="icon-ccw pointer"></i>
      </div>
    </div>
    <div id="markerBottom">
      ${c(`markerNotes`,v(`Edit free text notes (legend)`))}
      <button id="markerRadius" data-tip="${v(`Show markers within a radius of this one`)}" class="icon-dot-circled"></button>
      <button id="markerLock" class="icon-lock-open" data-lock-tip></button>
      <button id="markerAdd" data-tip="${v(`Add additional marker of that type`)}" class="icon-plus"></button>
      <button id="markerRemove" data-tip="${v(`Remove`)}" data-shortcut="Delete" class="icon-trash fastDelete"></button>
    </div>
  </div>`;t(`dialogs`).insertAdjacentHTML(`beforeend`,e),t(`markerName`).addEventListener(`change`,k),t(`markerType`).addEventListener(`change`,A),t(`markerTags`).addEventListener(`change`,j),t(`markerIconSelect`).addEventListener(`click`,M),t(`markerIconSize`).addEventListener(`input`,N),t(`markerIconShiftX`).addEventListener(`input`,P),t(`markerIconShiftY`).addEventListener(`input`,F),t(`markerSize`).addEventListener(`input`,I),t(`markerPin`).addEventListener(`change`,L),t(`markerFill`).addEventListener(`input`,R),t(`markerStroke`).addEventListener(`input`,z),t(`markerIconFill`).addEventListener(`input`,B),t(`markerIconStroke`).addEventListener(`input`,V),t(`markerIconPaintReset`).addEventListener(`click`,H),t(`markerNotes`).addEventListener(`click`,W),t(`markerRadius`).addEventListener(`click`,G),t(`markerLock`).addEventListener(`click`,K),t(`markerAdd`).addEventListener(`click`,q),t(`markerRemove`).addEventListener(`click`,J)}function w(t,n){let r=n?Number(n.closest(`svg`)?.id.slice(6)):t,i=pack.markers.find(({i:e})=>e===r);if(!i)return null;d(i);let a=e(`marker${r}`);return a||d(null),a?[a,i]:null}function T(){let e=x.type;return e?pack.markers.filter(({type:t})=>t===e):[x]}function E(e){let t=+this.getAttribute(`x`)-e.x,n=+this.getAttribute(`y`)-e.y;e.on(`drag`,function(e){this.setAttribute(`x`,String(t+e.x)),this.setAttribute(`y`,String(n+e.y))}),e.on(`end`,function(e){let{width:r,height:i}=options.map.graph,a=_(e.x+t,0,r),s=_(e.y+n,0,i);this.setAttribute(`x`,String(g(a,2))),this.setAttribute(`y`,String(g(s,2))),o.move(x.i,a,s),u()})}function D(){let e=x;O(),t(`markerName`).value=e.name||``,t(`markerType`).value=e.type||``,t(`markerTags`).value=i.format(e.tags),t(`markerIconSize`).value=String(e.px||12),t(`markerIconShiftX`).value=String(e.dx||50),t(`markerIconShiftY`).value=String(e.dy||50),t(`markerSize`).value=String(e.size||30),t(`markerPin`).value=e.pin||`bubble`,t(`markerFill`).value=e.fill||`#ffffff`,t(`markerStroke`).value=e.stroke||`#000000`,t(`markerLock`).className=e.lock?`icon-lock`:`icon-lock-open`}function O(){let{icon:e,iconFill:n,iconStroke:r}=x,i=a.paint(e),o=e=>e&&/^#[\da-f]{6}$/i.test(e)?e:`#000000`;t(`markerIcon`).innerHTML=a.html(e,{fill:n,stroke:r}),t(`markerIconFill`).value=o(n??i.fill),t(`markerIconStroke`).value=o(r??i.stroke),t(`markerIconPaintReset`).style.visibility=n||r?`visible`:`hidden`}function k(){this.value.trim()&&o.rename(x.i,this.value),e(`notesEditor`)&&r.NotesEditor.open({type:`marker`,id:x.i})}function A(){this.value.trim()&&o.setType(x.i,this.value)}function j(){i.set(x,this.value),this.value=i.format(x.tags)}function M(){r.IconPicker.open({current:x.icon,live:!0,onPick:e=>{for(let t of T())t.icon=e;O(),u()}})}function N(){U({px:+this.value})}function P(){U({dx:+this.value})}function F(){U({dy:+this.value})}function I(){U({size:+this.value})}function L(){U({pin:this.value})}function R(){U({fill:this.value})}function z(){U({stroke:this.value})}function B(){U({iconFill:this.value}),O()}function V(){U({iconStroke:this.value}),O()}function H(){U({iconFill:null,iconStroke:null}),O()}function U(e){try{for(let t of T())o.setAppearance(t.i,e)}catch(e){m(e.message,!1,`error`)}u()}function W(){r.NotesEditor.open({type:`marker`,id:x.i})}function G(){r.MarkersInRadius.open(x)}function K(){o.setLocked(x.i,!x.lock);let e=t(`markerLock`);e.classList.toggle(`icon-lock-open`),e.classList.toggle(`icon-lock`)}function q(){r.MarkerCreator.toggle(x)}function J(){f.confirm({title:v(`Remove`),message:y(v(`Are you sure you want to remove this marker?`),v(`This action cannot be reverted`)),confirm:v(`Remove`),onConfirm:Y})}function Y(){o.remove(x.i),u(),f.close(`markerEditor`),s()}function X(){n(b).on(`.drag`,null).classed(`draggable`,!1),d(null),t(`addMarker`).classList.contains(`pressed`)&&p(),h(),f.destroy(`markerEditor`),b=null,x=null}var Z={open:S};export{Z as MarkersEditor};