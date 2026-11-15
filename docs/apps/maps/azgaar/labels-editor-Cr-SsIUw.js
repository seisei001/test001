import{a as e,r as t,z as n}from"./node-utils-Ds1sVy-v.js";import{t as r}from"./controllers-Dbv1ZRTV.js";import{t as i}from"./added-labels-CB5gxKRk.js";import{T as a,X as o,fn as s,x as c}from"./options-model-CrstL1Qd.js";import{t as l,u}from"./pack-generator-DTsfQ82D.js";import{o as ee}from"./draw-heightmap-CEyJl1Kw.js";import{t as d}from"./names-generator-BcJRPzyi.js";import{t as f}from"./drag-CCSsgLNP.js";import{d as p,l as m,m as h,p as te,t as g}from"./layers-DjWzCbYN.js";import{_ as ne,t as _,u as v}from"./app-DCKsq5m8.js";import{t as y}from"./dialog-BkeQgjla.js";import{a as b,o as x}from"./tooltips-BVQbACdS.js";import{O as S,_ as re,a as C,i as w}from"./index-sNerCVjG.js";var T=``,E;function D(e,t){if(options.app.mode)return;y.closeAll(`.stable`),g.show(`labels`);let r=document.querySelector(`#labels text[data-label-type='${e}'][data-id='${t}']`);if(!r)return;let i=m(e,t);i&&(E={...i},$(r.id),n(`#viewbox`).on(`touchmove mousemove`,F),O(),y.open(`labelEditor`,{title:C(`Edit Label`),width:`fit-content`,position:{my:`center top+10`,at:`bottom`,of:r},onClose:ye}),I(),k(E.group),M(),A())}function O(){y.destroy(`labelEditor`);let e=`<div id="labelEditor" class="dialog">
      <button id="labelGroupShow" data-tip="${C(`Show`)}" class="icon-tags"></button>
      <div id="labelGroupSection" style="display: none">
        <button id="labelGroupHide" data-tip="${C(`Hide`)}" class="icon-tags"></button>
        <select id="labelGroupSelect" data-tip="${C(`Select a group for this label`)}" style="width: 10em"></select>
        <button
          id="labelGroupsConfigure"
          data-tip="${C(`Open the Label Groups Configurator to create, edit and reorder groups`)}"
          class="icon-cog"
        ></button>
      </div>
      <button id="labelTextShow" data-tip="${C(`Show`)}" class="icon-pencil"></button>
      <div id="labelTextSection" style="display: none">
        <button id="labelTextHide" data-tip="${C(`Hide`)}" class="icon-pencil"></button>
        <input
          id="labelText"
          data-tip="${C(`Type to change the label. Enter “|” to move to a new line`)}"
          style="width: 12em"
        />
        <span id="labelTextSpeak" data-tip="${w(C(`Speak the name`),C(`You can change voice and language in options`))}" class="speaker">🔊</span>
        <span id="labelTextRandom" data-tip="${C(`Generate random name`)}" class="icon-shuffle pointer"></span>
      </div>
      <button id="labelEditStyle" data-tip="${C(`Edit style in Style Editor`)}" class="icon-brush"></button>
      <button id="labelPathToggle"></button>
      <button id="labelSizeShow" data-tip="${C(`Show`)}" class="icon-text-height"></button>
      <div id="labelSizeSection" style="display: none">
        <button id="labelSizeHide" data-tip="${C(`Hide`)}" class="icon-text-height"></button>
        <span data-tip="${C(`Set relative size for the particular label (% of group default)`)}">${C(`Size`)}:</span>
        <input
          id="labelRelativeSize"
          data-tip="${C(`Set relative size for the particular label (% of group default)`)}"
          type="number"
          min="30"
          max="300"
          step="1"
          style="width: 4.5em"
        />
      </div>
      <button id="labelOffsetShow" data-tip="${C(`Show`)}" class="icon-sliders"></button>
      <div id="labelOffsetSection" style="display: none">
        <button id="labelOffsetHide" data-tip="${C(`Hide`)}" class="icon-sliders"></button>
        <span data-tip="${C(`Set starting offset for the particular label (% along the path)`)}">${C(`Offset`)}:</span>
        <input
          id="labelStartOffset"
          data-tip="${C(`Set starting offset for the particular label (% along the path)`)}"
          type="range"
          min="20"
          max="80"
          style="width: 8em"
        />
        <input
          id="labelStartOffsetValue"
          type="number"
          min="20"
          max="80"
          step="1"
          style="width: 3.5em"
          data-tip="${C(`Set starting offset numerically`)}"
        />
      </div>
      <button id="labelLetterSpacingShow" data-tip="${C(`Show`)}" class="icon-text-width"></button>
      <div id="labelLetterSpacingSection" style="display: none">
        <button
          id="labelLetterSpacingHide"
          data-tip="${C(`Hide`)}"
          class="icon-text-width"
        ></button>
        <slider-input
          id="labelLetterSpacingSize"
          style="display: inline-block"
          data-tip="${C(`Set the letter spacing size for this label`)}"
          min="0"
          max="20"
          step=".01"
          value="0"
        ></slider-input>
      </div>
      <button id="labelVisibility"></button>
      ${v(`labelLegend`,C(`Edit free text notes (legend)`))}
      <button id="labelReset" data-tip="${C(`Reset to default`)}" class="icon-arrows-cw"></button>
      <button
        id="labelRemoveSingle"
        data-tip="${C(`Remove`)}"
        data-shortcut="Delete"
        class="icon-trash fastDelete"
      ></button>
    </div>`;t(`dialogs`).insertAdjacentHTML(`beforeend`,e),t(`labelGroupShow`).addEventListener(`click`,U),t(`labelGroupHide`).addEventListener(`click`,W),t(`labelGroupSelect`).addEventListener(`change`,G),t(`labelGroupsConfigure`).addEventListener(`click`,()=>void r.LabelGroupsConfigurator.open()),t(`labelTextShow`).addEventListener(`click`,K),t(`labelTextHide`).addEventListener(`click`,q),t(`labelText`).addEventListener(`input`,J),t(`labelTextSpeak`).addEventListener(`click`,()=>_(t(`labelText`).value)),t(`labelTextRandom`).addEventListener(`click`,X),t(`labelEditStyle`).addEventListener(`click`,ie),t(`labelSizeShow`).addEventListener(`click`,ae),t(`labelSizeHide`).addEventListener(`click`,oe),t(`labelOffsetShow`).addEventListener(`click`,se),t(`labelOffsetHide`).addEventListener(`click`,ce),t(`labelStartOffset`).addEventListener(`input`,de),t(`labelStartOffsetValue`).addEventListener(`input`,fe),t(`labelRelativeSize`).addEventListener(`input`,pe),t(`labelLetterSpacingShow`).addEventListener(`click`,le),t(`labelLetterSpacingHide`).addEventListener(`click`,ue),t(`labelLetterSpacingSize`).addEventListener(`input`,me),t(`labelPathToggle`).addEventListener(`click`,he),t(`labelVisibility`).addEventListener(`click`,Z),t(`labelLegend`).addEventListener(`click`,ge),t(`labelReset`).addEventListener(`click`,ve),t(`labelRemoveSingle`).addEventListener(`click`,_e)}function k(e){T=e,W();let n=t(`labelGroupSelect`);n.options.length=0;for(let t of options.map.labels.groups)n.options.add(new Option(t.name,t.name,!1,t.name===e))}function A(){let e=j(),n=!t(`labelEditor`).classList.contains(`section-open`);t(`labelOffsetShow`).style.display=n&&e?`inline-block`:`none`,t(`labelRemoveSingle`).style.display=n&&E.type===`added`?`inline-block`:`none`,t(`labelReset`).style.display=n&&s.hasOverride(E.type,E.entityId)?`inline-block`:`none`;let r=t(`labelPathToggle`);r.className=e?`icon-resize-horizontal`:`icon-bezier-curve`,r.dataset.tip=C(e?`Remove the label path, render the label as a straight text`:`Curve the label along a path`);let i=t(`labelVisibility`);i.className=E.hidden?`icon-eye-off`:`icon-eye`,i.dataset.tip=E.hidden?C(`Show`):w(C(`Hide`),C(`You can toggle it on later in Labels Overview`))}function j(){return!!E.pathPoints?.length}function M(){let e=E.startOffset||50;t(`labelText`).value=E.text||``,t(`labelStartOffset`).value=String(e),t(`labelStartOffsetValue`).value=String(e),t(`labelRelativeSize`).value=String(E.fontSize??100),t(`labelLetterSpacingSize`).value=String(E.letterSpacing??0)}function N(){t(`labelEditor`).classList.add(`section-open`),document.querySelectorAll(`#labelEditor > button`).forEach(e=>{e.style.display=`none`})}function P(){t(`labelEditor`).classList.remove(`section-open`),document.querySelectorAll(`#labelEditor > button`).forEach(e=>{e.style.display=`inline-block`}),A()}function F(e){b();let t=e.target,n=t.parentNode;t.closest(`#${E.id}`)?x(C(`Drag to move the label`)):n?.id===`controlPoints`&&(t.tagName===`circle`&&x(C(`Drag to move, click to delete the control point`)),t.tagName===`path`&&x(C(`Click to add a control point`)))}function I(){if(n(`#debug`).select(`#controlPoints`).remove(),!j())return;let e=E.dx||E.dy?`translate(${E.dx||0}, ${E.dy||0})`:null;n(`#debug`).append(`g`).attr(`id`,`controlPoints`).attr(`transform`,e).append(`path`).attr(`d`,te(E)).on(`click`,V),E.pathPoints?.forEach(L)}function L(e){n(`#debug`).select(`#controlPoints`).append(`circle`).attr(`cx`,e[0]).attr(`cy`,e[1]).call(f().on(`drag`,R)).on(`click`,B)}function R(e){this.setAttribute(`cx`,String(e.x)),this.setAttribute(`cy`,String(e.y)),z()}function z(){let e=[];n(`#debug > #controlPoints`).selectAll(`circle`).each(function(){let t=S(+this.getAttribute(`cx`),2),n=S(+this.getAttribute(`cy`),2);e.push([t,n])});let t=u().curve(ee),r=re(t(e)||``);n(`#debug`).select(`#controlPoints > path`).attr(`d`,r),E.pathPoints=e,Q(),e.length||I()}function B(){this.remove(),z()}function V(t){let r=e(t,this),i=[];n(`#debug #controlPoints`).selectAll(`circle`).each(function(){let e=+this.getAttribute(`cx`),t=+this.getAttribute(`cy`);i.push((r[0]-e)**2+(r[1]-t)**2)});let a=i.length;if(i.length>1){let e=i.slice(0).sort((e,t)=>e-t),t=i.indexOf(e[0]),n=i.indexOf(e[1]);a=t<=n?t+1:n+1}let o=`:nth-child(${a+2})`;n(`#debug`).select(`#controlPoints`).insert(`circle`,o).attr(`cx`,r[0]).attr(`cy`,r[1]).call(f().on(`drag`,R)).on(`click`,B),z()}function H(e){let t=(E.dx||0)-e.x,r=(E.dy||0)-e.y;e.on(`drag`,e=>{E.dx=S(t+e.x,2),E.dy=S(r+e.y,2);let i=`translate(${E.dx}, ${E.dy})`;this.setAttribute(`transform`,i),n(`#debug #controlPoints`).attr(`transform`,i)}),e.on(`end`,()=>Q())}function U(){N(),t(`labelGroupSection`).style.display=`inline-block`}function W(){P(),t(`labelGroupSection`).style.display=`none`}function G(){let e=this.value,t=options.map.labels.groups.find(t=>t.name===e)?.type,n=()=>{T=e,E.group=e,Q()};if(t===E.type)return void n();y.confirm({title:C(`Assign cross-type Label Group`),message:w(C(`Assign this {{type}} label to the {{targetType}} group “{{group}}”?`,{type:E.type,targetType:t,group:e}),C(`It's better to avoid such cross-type assignment`)),confirm:C(`Assign`),onConfirm:n,onCancel:()=>{this.value=E.group}})}function K(){N(),t(`labelTextSection`).style.display=`inline-block`}function q(){P(),t(`labelTextSection`).style.display=`none`}function J(){let e=t(`labelText`).value;E.text=e,Q(),E.type===`state`&&x(C(`Use States Editor to change the actual state name, not just a label`),!1,`warn`),E.type===`province`&&x(C(`Use Provinces Editor to change the actual province name, not just a label`),!1,`warn`)}var Y={burg:e=>d.getCulture(pack.burgs[e.entityId].culture??0),state:e=>{let t=pack.states[e.entityId].culture;return d.getState(d.getCulture(t,4,7,``),t)},province:e=>{let t=pack.provinces[e.entityId];return d.getState(t.name,pack.cells.culture[t.center])},added:e=>{let t=l.findCell(...e.anchor);return t?d.getCulture(pack.cells.culture[t]):``},river:e=>{let t=l.findCell(...e.anchor);return t?o.getName(t):``},route:e=>{let t=pack.routes.find(t=>t.i===e.entityId)?.points??[];return c.generateName({group:e.group,points:t})||`Unnamed route segment`}};function X(){t(`labelText`).value=Y[E.type](E),J()}function ie(){r.StyleEditor.open(`labels`,E.group)}function ae(){N(),t(`labelSizeSection`).style.display=`inline-block`}function oe(){P(),t(`labelSizeSection`).style.display=`none`}function se(){N(),t(`labelOffsetSection`).style.display=`inline-block`}function ce(){P(),t(`labelOffsetSection`).style.display=`none`}function le(){N(),t(`labelLetterSpacingSection`).style.display=`inline-block`}function ue(){P(),t(`labelLetterSpacingSection`).style.display=`none`}function de(){if(!j())return;let e=this.value;t(`labelStartOffsetValue`).value=e,E.startOffset=+e,Q(),x(C(`Label offset: {{value}}%`,{value:e}))}function fe(){if(!j())return;let e=Math.min(80,Math.max(20,+this.value));t(`labelStartOffset`).value=String(e),this.value=String(e),E.startOffset=e,Q(),x(C(`Label offset: {{value}}%`,{value:e}))}function pe(){E.fontSize=+this.value,Q(),x(C(`Label relative size: {{value}}%`,{value:this.value}))}function me(){E.letterSpacing=+this.value,Q(),x(C(`Label letter-spacing size: {{value}}px`,{value:this.value}))}function he(){E.pathPoints=j()?[]:h(E),Q(),I()}function Z(){E.hidden?delete E.hidden:E.hidden=!0,Q()}function ge(){let e=a.resolveElement(E.id);e&&r.NotesEditor.open(e)}function _e(){y.confirm({title:C(`Remove`),message:C(`Are you sure you want to remove the label?`),confirm:C(`Remove`),onConfirm:()=>{E.type===`added`&&(i.remove(E.entityId),g.draw(`labels`),y.close(`labelEditor`))}})}function Q(){let e=s.getEntity(E.type,E.entityId);e&&(e.label=be(),p(E),$(E.id),A())}function $(e){n(`#${e}`).call(f().on(`start`,H)).classed(`draggable`,!0)}function ve(){let{type:e,entityId:t}=E;s.reset(e,t),g.draw(`labels`),E={...m(e,t)??E},$(E.id),k(E.group),M(),A(),I()}function ye(){n(`#debug`).select(`#controlPoints`).remove(),n(`#${E.id}`).on(`.drag`,null).classed(`draggable`,!1),ne(),E=null,y.destroy(`labelEditor`)}function be(){return{text:E.text,group:E.group,dx:E.dx,dy:E.dy,fontSize:E.fontSize,letterSpacing:E.letterSpacing,pathPoints:E.pathPoints??[],startOffset:E.startOffset,hidden:E.hidden}}var xe={open:D,getLastSelectedGroup:()=>T};export{xe as LabelsEditor};