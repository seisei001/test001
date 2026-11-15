import{r as e,z as t}from"./node-utils-Ds1sVy-v.js";import{t as n}from"./controllers-Dbv1ZRTV.js";import{$ as r,C as i,F as a,Z as o}from"./options-model-CrstL1Qd.js";import{t as s,v as c,x as l}from"./names-generator-BcJRPzyi.js";import{t as u}from"./min-CCch3uox.js";import{t as d}from"./styles-7-lY19-9.js";import{a as f,m as p,o as m}from"./units-CYDspnRH.js";import{t as h}from"./layers-DjWzCbYN.js";import{t as g,u as _}from"./app-DCKsq5m8.js";import{t as v}from"./dialog-BkeQgjla.js";import{o as y}from"./tooltips-BVQbACdS.js";import{a as b,i as x,k as S}from"./index-sNerCVjG.js";function C(e){for(var t=-1,n=e.length,r=e[n-1],i,a,o=r[0],s=r[1],c=0;++t<n;)i=o,a=s,r=e[t],o=r[0],s=r[1],i-=o,a-=s,c+=Math.hypot(i,a);return c}var w;function T(e){options.app.mode||(v.closeAll(`.stable`),h.hide(`cells`),E(),w=t(e),O(),F(),v.open(`lakeEditor`,{title:b(`Edit Lake`),position:{my:`center top+20`,at:`top`,of:`svg`},onClose:U}))}function E(){v.destroy(`lakeEditor`);let t=`<div id="lakeEditor" class="dialog">
    <div id="lakeBody" style="padding-bottom: 0.3em">
      <div>
        <div class="label" style="width: 4.8em">${b(`Name`)}:</div>
        <span id="lakeNameCulture" data-tip="${b(`Generate culture-specific name`)}" class="icon-book pointer"></span>
        <span id="lakeNameRandom" data-tip="${b(`Generate random name`)}" class="icon-globe pointer"></span>
        <input id="lakeName" data-tip="${b(`Type to rename`)}" autocorrect="off" spellcheck="false" />
        <span id="lakeNameSpeak" data-tip="${x(b(`Speak the name`),b(`You can change voice and language in options`))}" class="speaker">🔊</span>
      </div>
      <div data-tip="${b(`Lake subtype. Generators read it: burgs cannot port on dry, frozen or lava lakes`)}">
        <div class="label" style="width: 7em">${b(`Subtype`)}:</div>
        <select id="lakeSubtype" data-tip="${b(`Select lake subtype`)}">
          ${r.map(e=>`<option value="${e}">${a[e]??e}</option>`).join(``)}
        </select>
      </div>
      <div data-tip="${x(b(`Rendering group: the svg group the lake is drawn in`),b(`Does not affect generation`))}">
        <div class="label" style="width: 4.8em">${b(`Group`)}:</div>
        <span id="lakeGroupRemove" data-tip="${b(`Remove`)}" class="icon-trash-empty pointer"></span>
        <span id="lakeGroupAdd" data-tip="${b(`Create a new group for the lake`)}" class="icon-plus pointer"></span>
        <select id="lakeGroup" data-tip="${b(`Select lake rendering group`)}"></select>
        <input id="lakeGroupName" placeholder="${b(`Group name`)}" data-tip="${b(`Provide a name for the new group`)}" style="display: none" />
        <span id="lakeEditStyle" data-tip="${b(`Edit style in Style Editor`)}" class="icon-brush pointer"></span>
      </div>
      <div data-tip="${b(`Lake tags (comma-separated)`)}">
        <div class="label" style="width: 4.8em">${b(`Tags`)}:</div>
        <input
          id="lakeTags"
          placeholder="${b(`Tags`)}"
          autocorrect="off"
          spellcheck="false"
        />
      </div>
      <div data-tip="${b(`Lake area in selected units`)}">
        <div class="label">${b(`Area`)}:</div>
        <input id="lakeArea" disabled />
      </div>
      <div data-tip="${b(`Lake shore length in selected units`)}">
        <div class="label">${b(`Shore length`)}:</div>
        <input id="lakeShoreLength" disabled />
      </div>
      <div data-tip="${b(`Lake elevation in selected units`)}">
        <div class="label">${b(`Elevation`)}:</div>
        <input id="lakeElevation" disabled />
      </div>
      <div data-tip="${b(`Lake average depth in selected units`)}">
        <div class="label">${b(`Average depth`)}:</div>
        <input id="lakeAverageDepth" disabled />
      </div>
      <div data-tip="${b(`Lake maximum depth in selected units`)}">
        <div class="label">${b(`Max depth`)}:</div>
        <input id="lakeMaxDepth" disabled />
      </div>
      <div data-tip="${b(`Lake water supply. If supply > evaporation and there is an outlet, the lake water is fresh. If supply is very low, the lake becomes dry`)}">
        <div class="label">${b(`Supply`)}:</div>
        <input id="lakeFlux" disabled />
      </div>
      <div data-tip="${b(`Evaporation from lake surface. If evaporation > supply, the lake water is saline. If difference is high, the lake becomes dry`)}">
        <div class="label">${b(`Evaporation`)}:</div>
        <input id="lakeEvaporation" disabled />
      </div>
      <div data-tip="${b(`Number of lake inlet rivers`)}">
        <div class="label">${b(`Inlets`)}:</div>
        <input id="lakeInlets" disabled />
      </div>
      <div data-tip="${b(`Lake outlet river`)}">
        <div class="label">${b(`Outlet`)}:</div>
        <input id="lakeOutlet" disabled />
      </div>
    </div>
    <div id="lakeBottom">
      ${_(`lakeLegend`,b(`Edit free text notes (legend)`))}
    </div>
  </div>`;e(`dialogs`).insertAdjacentHTML(`beforeend`,t),e(`lakeName`).addEventListener(`input`,k),e(`lakeNameSpeak`).addEventListener(`click`,()=>g(e(`lakeName`).value)),e(`lakeNameCulture`).addEventListener(`click`,A),e(`lakeNameRandom`).addEventListener(`click`,j),e(`lakeSubtype`).addEventListener(`change`,M),e(`lakeGroup`).addEventListener(`change`,I),e(`lakeGroupAdd`).addEventListener(`click`,L),e(`lakeGroupName`).addEventListener(`change`,R),e(`lakeGroupRemove`).addEventListener(`click`,z),e(`lakeEditStyle`).addEventListener(`click`,B),e(`lakeTags`).addEventListener(`change`,V),e(`lakeLegend`).addEventListener(`click`,H)}function D(){let e=+w.attr(`data-f`);return pack.features.find(t=>t.i===e)}function O(){let{cells:t,vertices:n,rivers:r}=pack,a=D();e(`lakeName`).value=a.name,e(`lakeSubtype`).value=a.subtype||`freshwater`,e(`lakeTags`).value=i.format(a.tags),e(`lakeArea`).value=`${S(f(a.area))} ${m()}`;let o=C(a.vertices.map(e=>n.p[e]));e(`lakeShoreLength`).value=`${S(o*options.map.units.distance.scale)} ${options.map.units.distance.unit}`;let s=Array.from(t.i.filter(e=>t.f[e]===a.i)).map(e=>t.h[e]);e(`lakeElevation`).value=p(a.height),e(`lakeAverageDepth`).value=p(l(s)??0,!0),e(`lakeMaxDepth`).value=p(u(s)??0,!0),e(`lakeFlux`).value=String(a.flux),e(`lakeEvaporation`).value=String(a.evaporation);let c=a.inlets?.map(e=>r.find(t=>t.i===e)?.name),d=a.outlet?r.find(e=>e.i===a.outlet)?.name:`no`,h=e(`lakeInlets`);h.value=c?String(c.length):`no`,h.title=c?c.join(`, `):``,e(`lakeOutlet`).value=d??`no`}function k(){D().name=this.value}function A(){let t=D();t.name=e(`lakeName`).value=o.getName(t)}function j(){let t=D();t.name=e(`lakeName`).value=s.getBase(c(s.nameBases.length-1))}function M(){o.setSubtype(D().i,this.value)}var N=e=>e in d.defaults.lakes.groups,P=e=>pack.features.filter(t=>t?.type===`lake`&&t.group===e);function F(){let t=D().group,n=e(`lakeGroup`);n.options.length=0;for(let e of Object.keys(styles.lakes.groups))n.options.add(new Option(e,e,!1,e===t))}function I(){D().group=this.value,h.draw(`lakes`)}function L(){let t=e(`lakeGroupName`),n=e(`lakeGroup`);t.style.display===`none`?(t.style.display=`inline-block`,t.focus(),n.style.display=`none`):(t.style.display=`none`,n.style.display=`inline-block`)}function R(){if(!this.value){y(b(`Invalid group name`));return}let t=this.value.toLowerCase().replace(/ /g,`_`).replace(/[^\w\s]/gi,``);if(Object.hasOwn(styles.lakes.groups,t)){y(b(`Element with this name already exists. Provide a unique name`),!1,`error`);return}if(Number.isFinite(+t.charAt(0))){y(b(`Group name should start with a letter`),!1,`error`);return}let n=D(),r=n.group,i=styles.lakes.groups,a=e(`lakeGroup`);if(!N(r)&&P(r).length===1){let e=Object.entries(i);for(let[t]of e)delete i[t];for(let[n,a]of e)i[n===r?t:n]=a;a.selectedOptions[0].remove()}else i[t]=structuredClone(i[r]||i.freshwater);a.options.add(new Option(t,t,!1,!0)),n.group=t,h.draw(`lakes`),L(),e(`lakeGroupName`).value=``}function z(){let t=D().group;if(N(t)){y(b(`This is one of the default groups, it cannot be removed`),!1,`error`);return}let n=P(t).length;v.confirm({title:b(`Remove`),message:x(b(`Are you sure you want to remove the group?`),b(`All lakes of the group ({{lakes}}) will be turned into Freshwater`,{lakes:n})),confirm:b(`Remove`),onConfirm:()=>{for(let e of P(t))e.group=`freshwater`;delete styles.lakes.groups[t],h.draw(`lakes`),e(`lakeGroup`).selectedOptions[0].remove(),e(`lakeGroup`).value=`freshwater`}})}function B(){n.StyleEditor.open(`lakes`,D().group)}function V(){let e=D();e&&(i.set(e,this.value),this.value=i.format(e.tags))}function H(){n.NotesEditor.open({type:`feature`,id:D().i})}function U(){v.destroy(`lakeEditor`),w=null}var W={open:T};export{W as LakesEditor};