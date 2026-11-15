import{a as e,i as t,r as n,z as r}from"./node-utils-Ds1sVy-v.js";import{t as i}from"./controllers-Dbv1ZRTV.js";import{t as a}from"./pack-generator-DTsfQ82D.js";import{C as o,X as s}from"./options-model-CrstL1Qd.js";import{t as c,v as l}from"./names-generator-BcJRPzyi.js";import{D as u,O as d,t as f}from"./layers-DjWzCbYN.js";import{t as p,u as m}from"./app-DCKsq5m8.js";import{t as h}from"./drag-CCSsgLNP.js";import{t as g}from"./dialog-BkeQgjla.js";import{o as _,t as v}from"./tooltips-BVQbACdS.js";import{l as y}from"./notices-6lBE5Kkn.js";import{O as b,a as x,i as S}from"./index-sNerCVjG.js";var C,w=!1;function T(e){if(options.app.mode||t(`riverEditor`)&&e===C.attr(`id`))return;g.closeAll(`.stable`),f.show(`rivers`),w=!f.isOn(`cells`),f.show(`cells`),d(Number(e.slice(5))),C=r(`#${e}`).on(`click`,z),_(S(x(`Drag control points to change the river course`),x(`Click on point to remove it`),x(`Click on river to add additional control point`),x(`For major changes please create a new river instead`)),!0),r(`#debug`).append(`g`).attr(`id`,`controlCells`),r(`#debug`).append(`g`).attr(`id`,`controlPoints`),E(),n(`riverEditor`).dataset.entity=`river:${Number(e.slice(5))}`,A();let{cells:i,points:a}=k();F(s.getRiverPoints(i,a??null)),I(i),g.open(`riverEditor`,{title:x(`Edit River`),position:{my:`left top`,at:`left+10 top+10`,of:`#map`},onClose:$})}function E(){g.destroy(`riverEditor`);let e=`<div id="riverEditor" class="dialog">
    <div id="riverBody" style="padding-bottom: 0.3em">
      <div>
        <div class="label" style="width: 4.8em">${x(`Name`)}:</div>
        <span id="riverNameCulture" data-tip="${x(`Generate culture-specific name`)}" class="icon-book pointer"></span>
        <span id="riverNameRandom" data-tip="${x(`Generate random name`)}" class="icon-globe pointer"></span>
        <input id="riverName" data-tip="${x(`Type to rename`)}" autocorrect="off" spellcheck="false" />
        <span id="riverNameSpeak" data-tip="${S(x(`Speak the name`),x(`You can change voice and language in options`))}" class="speaker">🔊</span>
      </div>
      <div data-tip="${x(`Type to change river type (e.g. fork, creek, river, brook, stream)`)}">
        <div class="label">${x(`Type`)}:</div>
        <input id="riverType" autocorrect="off" spellcheck="false" />
      </div>
      <div data-tip="${S(x(`Rendering group: the svg group the river is drawn in`),x(`Does not affect generation`))}">
        <div class="label">${x(`Group`)}:</div>
        <select id="riverGroup"></select>
        <span id="riverGroupEdit" data-tip="${x(`Edit river groups`)}" class="icon-pencil pointer"></span>
      </div>
      <div data-tip="${x(`River tags (comma-separated)`)}">
        <div class="label">${x(`Tags`)}:</div>
        <input
          id="riverTags"
          placeholder="${x(`Tags`)}"
          autocorrect="off"
          spellcheck="false"
        />
      </div>
      <div data-tip="${x(`Select parent river`)}">
        <div class="label">${x(`Mainstem`)}:</div>
        <select id="riverMainstem"></select>
      </div>
      <div data-tip="${x(`River drainage basin (watershed)`)}">
        <div class="label">${x(`Basin`)}:</div>
        <input id="riverBasin" disabled />
      </div>
      <div data-tip="${x(`River discharge (flux power)`)}">
        <div class="label">${x(`Discharge`)}:</div>
        <input id="riverDischarge" disabled />
      </div>
      <div data-tip="${x(`River length in selected units`)}">
        <div class="label">${x(`Length`)}:</div>
        <input id="riverLength" disabled />
      </div>
      <div data-tip="${x(`River mouth width in selected units`)}">
        <div class="label">${x(`Mouth width`)}:</div>
        <input id="riverWidth" disabled />
      </div>
      <div data-tip="${x(`River source additional width. Default value is 0`)}">
        <div class="label">${x(`Source width`)}:</div>
        <input id="riverSourceWidth" type="number" min="0" max="3" step=".01" />
      </div>
      <div data-tip="${x(`River width multiplier. Default value is 1`)}">
        <div class="label">${x(`Width modifier`)}:</div>
        <input id="riverWidthFactor" type="number" min=".1" max="4" step=".1" />
      </div>
    </div>
    <div id="riverBottom">
      <button id="riverCreateSelectingCells" data-tip="${x(`Create a new river selecting river cells`)}" class="icon-map-pin"></button>
      <button id="riverEditStyle" data-tip="${x(`Edit style in Style Editor`)}" class="icon-brush"></button>
      <button id="riverElevationProfile" data-tip="${x(`Elevation profile`)}" class="icon-chart-area"></button>
      ${m(`riverLegend`,x(`Edit free text notes (legend)`))}
      <button id="riverLock" class="icon-lock-open" data-lock-tip></button>
      <button id="riverRemove" data-tip="${x(`Remove`)}" data-shortcut="Delete" class="icon-trash fastDelete"></button>
    </div>
  </div>`;n(`dialogs`).insertAdjacentHTML(`beforeend`,e),n(`riverCreateSelectingCells`).addEventListener(`click`,D),n(`riverEditStyle`).addEventListener(`click`,O),n(`riverElevationProfile`).addEventListener(`click`,X),n(`riverLegend`).addEventListener(`click`,Z),n(`riverLock`).addEventListener(`click`,j),n(`riverRemove`).addEventListener(`click`,Q),n(`riverName`).addEventListener(`input`,V),n(`riverNameSpeak`).addEventListener(`click`,()=>p(n(`riverName`).value)),n(`riverType`).addEventListener(`input`,H),n(`riverGroup`).addEventListener(`change`,U),n(`riverGroupEdit`).addEventListener(`click`,()=>void i.RiverGroupsEditor.open()),n(`riverTags`).addEventListener(`change`,W),n(`riverNameCulture`).addEventListener(`click`,G),n(`riverNameRandom`).addEventListener(`click`,K),n(`riverMainstem`).addEventListener(`change`,q),n(`riverSourceWidth`).addEventListener(`input`,J),n(`riverWidthFactor`).addEventListener(`input`,Y)}function D(){i.RiverCreator.open()}function O(){i.StyleEditor.open(`rivers`,k().group)}function k(){let e=+C.attr(`id`).slice(5);return pack.rivers.find(t=>t.i===e)}function A(){let e=k();n(`riverName`).value=e.name,n(`riverType`).value=e.type;let t=n(`riverGroup`);t.options.length=0;for(let n of Object.keys(styles.rivers.groups))t.options.add(new Option(n,n,!1,n===e.group));n(`riverTags`).value=o.format(e.tags),M(e);let r=n(`riverMainstem`);r.options.length=0;let i=e.parent||e.i;pack.rivers.slice().sort((e,t)=>e.name>t.name?1:-1).forEach(e=>{let t=new Option(e.name,String(e.i),!1,e.i===i);r.options.add(t)}),n(`riverBasin`).value=pack.rivers.find(t=>t.i===e.basin).name,n(`riverDischarge`).value=`${e.discharge} m³/s`,n(`riverSourceWidth`).value=String(e.sourceWidth),n(`riverWidthFactor`).value=String(e.widthFactor),N(e),s.updateWidth(e),P(e)}function j(){let e=k();s.setLocked(e.i,!e.lock),M(e)}function M(e){n(`riverLock`).className=e.lock?`icon-lock`:`icon-lock-open`}function N(e){e.length=b(C.node().getTotalLength()/2,2);let t=`${b(e.length*options.map.units.distance.scale)} ${options.map.units.distance.unit}`;n(`riverLength`).value=t}function P(e){let t=`${b(e.width*options.map.units.distance.scale,3)} ${options.map.units.distance.unit}`;n(`riverWidth`).value=t}function F(e){r(`#controlPoints`).selectAll(`circle`).data(e).join(`circle`).attr(`cx`,e=>e[0]).attr(`cy`,e=>e[1]).call(h().on(`start`,L)).on(`click`,B)}function I(e){let t=[...new Set(e)].filter(e=>pack.cells.i[e]);r(`#controlCells`).selectAll(`polygon`).data(t).join(`polygon`).attr(`points`,e=>String(a.getPolygon(e)))}function L(e){let{r:t,fl:n}=pack.cells,i=k(),{x:o,y:s}=e,c=a.findCell(o,s),l=null;e.on(`drag`,function(e){let{x:t,y:n}=e,o=a.findCell(t,n);l=c===o?null:o,this.setAttribute(`cx`,String(t)),this.setAttribute(`cy`,String(n)),r(this).datum([b(t,1),b(n,1)]),R(),I(i.cells)}),e.on(`end`,()=>{if(l&&!t[l]){t[c]=0,t[l]=i.i;let e=n[c];n[c]=n[l],n[l]=e,R()}})}function R(){let e=k();e.points=r(`#controlPoints`).selectAll(`*`).data(),e.cells=e.points.map(([e,t])=>a.findCell(e,t)),u(e),N(e),f.draw(`labels`),t(`elevationProfile`)&&X()}function z(t){let[n,i]=e(t,this),a=[b(n,1),b(i,1)],o=k();o.points||=r(`#controlPoints`).selectAll(`*`).data();let s=y(o.points,a,2);o.points.splice(s,0,a),F(o.points),R()}function B(){if(k().cells.length<=2)return void _(x(`A path needs at least two points.`),!1,`error`);this.remove(),R();let{cells:e}=k();I(e)}function V(){this.value.trim()&&(s.rename(k().i,this.value),f.draw(`labels`))}function H(){this.value.trim()&&(s.setType(k().i,this.value),f.draw(`labels`))}function U(){let e=k();s.setGroup(e.i,this.value),u(e)}function W(){let e=k();e&&(o.set(e,this.value),this.value=o.format(e.tags))}function G(){let e=k(),t=s.getName(e.mouth);n(`riverName`).value=t,s.rename(e.i,t),f.draw(`labels`)}function K(){let e=c.getBase(l(c.nameBases.length-1));n(`riverName`).value=e,s.rename(k().i,e),f.draw(`labels`)}function q(){let e=k();try{s.setParent(e.i,+this.value)}catch(t){_(t.message,!1,`error`),this.value=String(e.parent||e.i);return}n(`riverBasin`).value=pack.rivers.find(t=>t.i===e.basin).name}function J(){let e=k();s.setWidth(e.i,Math.max(0,+this.value||0),e.widthFactor),P(e),R()}function Y(){let e=k();s.setWidth(e.i,e.sourceWidth??0,Math.max(0,+this.value||0)),P(e),R()}function X(){let e=r(`#controlPoints`).selectAll(`*`).data().map(([e,t])=>a.findCell(e,t)),t=k(),n=b(t.length*options.map.units.distance.scale);i.ElevationProfile.open(e,n,!0)}function Z(){i.NotesEditor.open({type:`river`,id:k().i})}function Q(){g.confirm({title:x(`Remove`),message:x(`Are you sure you want to remove the river? All tributaries will be auto-removed`),confirm:x(`Remove`),width:`22em`,onConfirm:()=>{let e=+C.attr(`id`).slice(5);s.remove(e),g.close(`riverEditor`),f.draw(`rivers`,`labels`)}})}function $(){r(`#controlPoints`).remove(),r(`#controlCells`).remove(),C.on(`click`,null),d(null),v(),w&&f.hide(`cells`),w=!1,g.destroy(`riverEditor`),C=null}var ee={open:T};export{ee as RiverEditor};