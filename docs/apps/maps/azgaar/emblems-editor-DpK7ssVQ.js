import{i as e,r as t,z as n}from"./node-utils-Ds1sVy-v.js";import{IconPicker as r}from"./icon-picker-U0lFMAWI.js";import{n as i,t as a}from"./pictures-9UhEGDF2.js";import{t as o}from"./tinctures-CsgIeV6I.js";import{b as s,f as c,in as l,m as u,sn as d,tn as f}from"./options-model-CrstL1Qd.js";import{t as p}from"./drag-CCSsgLNP.js";import{_t as m,ct as ee,lt as h,rt as g}from"./layers-DjWzCbYN.js";import{cloneEmblem as te,emblemURL as ne,loadEmblemIcons as _}from"./emblem-image-C-HBG6P4.js";import{n as re}from"./file-name-B95gRTjS.js";import{t as v}from"./dialog-BkeQgjla.js";import{r as ie}from"./highlight-CBuOTLhq.js";import{o as y,t as ae}from"./tooltips-BVQbACdS.js";import{f as oe}from"./notices-6lBE5Kkn.js";import{n as se}from"./file-utils-CUGyyqg9.js";import{O as b,T as x,a as S,f as C,m as w}from"./index-sNerCVjG.js";import{t as T}from"./drawability-DhOrII3t.js";var ce=l({type:f(`armoria:coa`),version:f(1),session:d(),coa:i.schema,svg:d()}),le=class{sessions=new Map;start(e,t,n,r=new URL(i.GUI).origin){for(let[e,n]of this.sessions)n.key===t&&this.sessions.delete(e);let a=crypto.randomUUID();return this.sessions.set(a,{target:e,key:t,map:n,origin:r}),a}receive(e,t){let n=ce.safeParse(e.data);if(!n.success)return null;let{session:r,coa:i,svg:a}=n.data,o=this.sessions.get(r);return!o||e.origin!==o.origin||o.map!==t?null:{target:o.target,coa:i,svg:a}}},ue=S(`Size of this emblem, 0 hides it. Change a whole category in Menu ⭢ Style ⭢ Emblems`),de=`
  #emblemEditor { padding: .5em .7em .6em; }
  #emblemEditor > div { width: auto; }
  #emblemEditor .preview { width: 12em; height: 12em; margin: 0 auto .2em; }
  #emblemEditor .preview svg { width: 100%; height: 100%; overflow: visible; }
  #emblemArmiger { display: block; margin-bottom: .5em; text-align: center; }
  #emblemEditor .fields { display: grid; grid-template-columns: 6.4em minmax(0, 1fr); align-items: center; gap: .3em .4em; }
  #emblemEditor .fields .row { display: contents; }
  #emblemEditor .fields .row.hidden { display: none; }
  #emblemEditor .tincture { display: flex; align-items: center; gap: .35em; }
  #emblemEditor .tincture select { flex: 1; min-width: 0; }
  #emblemEditor .swatch { flex: none; width: 1.1em; height: 1.1em; border: 1px solid #0006; border-radius: 2px; }
  #emblemEditor .fields label { white-space: nowrap; padding: .15em .35em; border-radius: 3px; transition: background-color .3s ease-out; }
  #emblemEditor .fields label.active { background-color: #54ca7733; font-weight: bold; }
  #emblemEditor .fields select { width: 100%; min-width: 0; margin: 0; }
  #emblemEditor .fields hr { grid-column: 1 / -1; width: 100%; margin: .2em 0; border: 0; border-top: 1px solid #0000001f; }
  #emblemEditor .size { display: flex; align-items: center; gap: .4em; }
  #emblemEditor .size input[type="range"] { flex: 1; min-width: 0; margin: 0; }
  #emblemEditor .size input[type="number"] { width: 3.8em; margin: 0; }
  #emblemEditor .armoria { margin-top: .6em; }
  #emblemEditor .armoria button { width: 100%; margin: 0; padding: .4em; font-weight: bold; }
  #emblemEditor .armoria p { margin: .3em 0 0; font-size: .85em; opacity: .75; text-align: center; }
  #emblemEditor .toolbar { display: grid; grid-template-columns: repeat(7, 1fr); gap: .25em; margin-top: .7em; }
  #emblemEditor .control { display: flex; align-items: center; gap: .3em; margin-top: .4em; }
  #emblemEditor .control.hidden { display: none; }
  #emblemEditor .control input[type="text"] { flex: 1; min-width: 0; margin: 0; }
  #emblemEditor .control input[type="number"] { width: 4.6em; margin: 0; }
  #emblemEditor .control button { margin: 0; }
  #emblemEditor #emblemDownloadControl button { flex: 1; }
  #emblemEditor #emblemPasteControl { flex-direction: column; align-items: stretch; }
  #emblemPaste { box-sizing: border-box; width: 100%; height: 18em; margin: 0; resize: vertical; font: .85em/1.3 monospace; white-space: pre; tab-size: 2; }
`,E,D,O,k,A=new le,j=i.GUI;async function fe(){let e=pack.states.find(e=>e.i&&!e.removed&&e.coa),t=pack.burgs.find(e=>e.i&&!e.removed&&e.coa),n=e?`state`:`burg`,r=e??t;if(!r?.coa){y(S(`No emblems to edit, please generate states and burgs first`),!1,`error`);return}let i=`${n}COA${r.i}`;await h.trigger(i,r.coa),M(n,i,r)}function M(e,t,n,r){if(!options.app.mode){if(!t&&r)me(r);else{if(!e||!t||!n?.coa)return;E=e,D=t,O=n}pe(),Ne(),k?.(),k=ee(Ne),N(),v.open(`emblemEditor`,{title:S(`Edit Emblem`),resizable:!0,width:`22em`,height:`auto`,position:{my:`left top`,at:`left+10 top+10`,of:`svg`},onClose:Pe})}}function pe(){v.destroy(`emblemEditor`);let e=`<div id="emblemEditor" class="dialog stable">
      <style>${de}</style>
      <div class="preview"><svg viewBox="0 0 200 200"><use id="emblemImage"></use></svg></div>
      <b id="emblemArmiger"></b>
      <div class="fields">
        <label for="emblemStates" data-tip="${S(`Select state`)}">${S(`State`)}</label>
        <select id="emblemStates" data-tip="${S(`Select state`)}"></select>
        <label for="emblemProvinces" data-tip="${S(`Select province in state`)}">${S(`Province`)}</label>
        <select id="emblemProvinces" data-tip="${S(`Select province in state`)}"></select>
        <label for="emblemBurgs" data-tip="${S(`Select burg in province or state`)}">${S(`Burg`)}</label>
        <select id="emblemBurgs" data-tip="${S(`Select burg in province or state`)}"></select>
        <hr />
        <div id="emblemShapeRow" class="row">
        <label for="emblemShapeSelector" data-tip="${S(`Select shape of the emblem`)}">${S(`Shape`)}</label>
          <select id="emblemShapeSelector" data-tip="${S(`Select shape of the emblem`)}">
            <option value="">${S(`None`)}</option>
            <optgroup label="${S(`Basic`)}">
              <option value="heater">${S(`Heater`)}</option>
              <option value="spanish">${S(`Spanish`)}</option>
              <option value="french">${S(`French`)}</option>
            </optgroup>
            <optgroup label="${S(`Regional`)}">
              <option value="horsehead">${S(`Horsehead`)}</option>
              <option value="horsehead2">${S(`Horsehead Edgy`)}</option>
              <option value="polish">${S(`Polish`)}</option>
              <option value="hessen">${S(`Hessen`)}</option>
              <option value="swiss">${S(`Swiss`)}</option>
            </optgroup>
            <optgroup label="${S(`Historical`)}">
              <option value="boeotian">${S(`Boeotian`)}</option>
              <option value="roman">${S(`Roman`)}</option>
              <option value="kite">${S(`Kite`)}</option>
              <option value="oldFrench">${S(`Old French`)}</option>
              <option value="renaissance">${S(`Renaissance`)}</option>
              <option value="baroque">${S(`Baroque`)}</option>
            </optgroup>
            <optgroup label="${S(`Specific`)}">
              <option value="targe">${S(`Targe`)}</option>
              <option value="targe2">${S(`Targe`)} 2</option>
              <option value="pavise">${S(`Pavise`)}</option>
              <option value="wedged">${S(`Wedged`)}</option>
              <option value="embowed">${S(`Embowed`)}</option>
            </optgroup>
            <optgroup label="${S(`Banner`)}">
              <option value="flag">${S(`Flag`)}</option>
              <option value="pennon">${S(`Pennon`)}</option>
              <option value="guidon">${S(`Guidon`)}</option>
              <option value="banner">${S(`Banner`)}</option>
              <option value="dovetail">${S(`Dovetail`)}</option>
              <option value="gonfalon">${S(`Gonfalon`)}</option>
              <option value="pennant">${S(`Pennant`)}</option>
            </optgroup>
            <optgroup label="${S(`Simple`)}">
              <option value="round">${S(`Round`)}</option>
              <option value="oval">${S(`Oval`)}</option>
              <option value="vesicaPiscis">${S(`Vesica Piscis`)}</option>
              <option value="square">${S(`Square`)}</option>
              <option value="diamond">${S(`Diamond`)}</option>
              <option value="hexagon">${S(`Hexagon`)}</option>
            </optgroup>
            <optgroup label="${S(`Fantasy`)}">
              <option value="fantasy1">${S(`Fantasy`)} 1</option>
              <option value="fantasy2">${S(`Fantasy`)} 2</option>
              <option value="fantasy3">${S(`Fantasy`)} 3</option>
              <option value="fantasy4">${S(`Fantasy`)} 4</option>
              <option value="fantasy5">${S(`Fantasy`)} 5</option>
            </optgroup>
            <optgroup label="${S(`Middle Earth`)}">
              <option value="noldor">${S(`Noldor`)}</option>
              <option value="gondor">${S(`Gondor`)}</option>
              <option value="easterling">${S(`Easterling`)}</option>
              <option value="erebor">${S(`Erebor`)}</option>
              <option value="ironHills">${S(`Iron Hills`)}</option>
              <option value="urukHai">${S(`UrukHai`)}</option>
              <option value="moriaOrc">${S(`Moria Orc`)}</option>
            </optgroup>
          </select>
        </div>
        <div id="emblemFieldRow" class="row">
          <label for="emblemField" data-tip="${S(`Tincture of the field`)}">${S(`Field`)}</label>
          <div class="tincture"><span class="swatch"></span><select id="emblemField"></select></div>
        </div>
        <div id="emblemChargeRows" class="row">
          <label for="emblemChargeTincture" data-tip="${S(`Tincture of the main charge. A raster picture keeps its own colours`)}">${S(`Charge`)}</label>
          <div class="tincture"><span class="swatch"></span><select id="emblemChargeTincture"></select></div>
          <label for="emblemChargeSizeNumber" data-tip="${S(`Size of the main charge`)}">${S(`Charge size`)}</label>
          <div class="size" data-tip="${S(`Size of the main charge`)}">
            <input id="emblemChargeSizeSlider" type="range" min=".2" max="3" step=".05" />
            <input id="emblemChargeSizeNumber" type="number" min=".2" max="3" step=".05" />
          </div>
        </div>
        <label for="emblemSizeNumber" data-tip="${ue}">${S(`Map size`,{context:`emblem`})}</label>
        <div class="size" data-tip="${ue}">
          <input id="emblemSizeSlider" type="range" min="0" max="5" step=".1" />
          <input id="emblemSizeNumber" type="number" min="0" max="5" step=".1" />
        </div>
      </div>
      <div class="armoria">
        <button id="emblemsArmoria" type="button" data-tip="${S(`Open the emblem in Armoria, the heraldry editor: your changes show on the map as you make them`)}"><span class="icon-font"></span> ${S(`Edit in Armoria`)}</button>
      </div>
      <div class="toolbar">
        <button id="emblemsPaste" data-tip="${S(`Edit the COA string by hand, or paste an Armoria edit link, API link or COA string`)}" class="icon-pencil"></button>
        <button id="emblemsCharge" data-tip="${S(`Set the charge: choose, link or upload a picture to place on the field`)}" class="icon-chess-knight"></button>
        <button id="emblemsUpload" data-tip="${S(`Replace the whole emblem with a picture: choose, link or upload an image, such as a ready coat of arms`)}" class="icon-shield-alt"></button>
        <button id="emblemsDownload" data-tip="${S(`Download the emblem as an image`)}" class="icon-download"></button>
        <button id="emblemsGallery" data-tip="${S(`Download all emblems as an HTML gallery (open it in a browser; preparing takes a while)`)}" class="icon-layer-group"></button>
        <button id="emblemsRegenerate" data-tip="${S(`Regenerate the emblem`)}" class="icon-shuffle"></button>
        <button id="emblemsFocus" data-tip="${S(`Show the area or place of the emblem`)}" class="icon-target"></button>
      </div>
      <div id="emblemPasteControl" class="control hidden">
        <textarea id="emblemPaste" spellcheck="false" placeholder="${S(`Armoria link or COA string`)}" data-tip="${S(`The emblem's COA string: edit it, or replace it with an Armoria link or COA string, then Apply`)}"></textarea>
        <button id="emblemPasteApply" type="button" data-tip="${S(`Apply the pasted emblem`)} (Ctrl+Enter)">${S(`Apply`)}</button>
      </div>
      <div id="emblemDownloadControl" class="control hidden">
        <input id="emblemsDownloadSize" data-tip="${S(`Image size in pixels`)}" type="number" value="500" step="100" min="100" max="10000" />
        <span>px</span>
        <button id="emblemsDownloadSVG" data-tip="${S(`Scalable vector image: best quality, opens in a browser or Inkscape`)}">SVG</button>
        <button id="emblemsDownloadPNG" data-tip="${S(`Lossless raster image with a transparent background`)}">PNG</button>
        <button id="emblemsDownloadJPG" data-tip="${S(`Compressed raster image on a white background`)}">JPG</button>
      </div>
    </div>`;t(`dialogs`).insertAdjacentHTML(`beforeend`,e),t(`emblemStates`).oninput=he,t(`emblemProvinces`).oninput=ge,t(`emblemBurgs`).oninput=_e,t(`emblemShapeSelector`).oninput=ve,t(`emblemField`).oninput=ye,t(`emblemChargeTincture`).oninput=be,t(`emblemChargeSizeSlider`).oninput=L,t(`emblemChargeSizeNumber`).oninput=L,t(`emblemSizeSlider`).oninput=V,t(`emblemSizeNumber`).oninput=V,t(`emblemsRegenerate`).onclick=we,t(`emblemsArmoria`).onclick=Te,t(`emblemsCharge`).onclick=()=>J(`charge`),t(`emblemsUpload`).onclick=()=>J(`whole`),t(`emblemsPaste`).onclick=()=>Y(`emblemPasteControl`),t(`emblemPasteApply`).onclick=()=>void W();let n=t(`emblemPaste`);n.onkeydown=e=>{e.key===`Enter`&&(e.ctrlKey||e.metaKey)&&W()},n.onpaste=()=>setTimeout(U),n.onchange=U,t(`emblemsDownload`).onclick=()=>Y(`emblemDownloadControl`),t(`emblemsDownloadSVG`).onclick=()=>X(`svg`),t(`emblemsDownloadPNG`).onclick=()=>X(`png`),t(`emblemsDownloadJPG`).onclick=()=>X(`jpeg`),t(`emblemsGallery`).onclick=ke,t(`emblemsFocus`).onclick=Ce}function me(e){let t=e.parentNode,n=t.id===`burgEmblems`?`burg`:t.id===`provinceEmblems`?`province`:`state`,r=+e.dataset.i,i=Q(n,r);if(!i)throw Error(`Cannot edit ${n} emblem ${r}`);E=n,D=`${E}COA${r}`,O=i}function N(){let e=E,n=O,r=t(`emblemStates`),i=t(`emblemProvinces`),a=t(`emblemBurgs`),o=0,s=0,c=0;for(let[t,n]of[[r,`state`],[i,`province`],[a,`burg`]])t.previousElementSibling?.classList.toggle(`active`,e===n);e===`state`?o=n.i:e===`province`?(s=n.i,o=pack.states[n.state].i):(c=n.i,s=pack.cells.province[n.cell]?pack.provinces[pack.cells.province[n.cell]].i:0,o=n.state??0);let l=pack.burgs.filter(e=>e.i&&!e.removed&&e.coa);r.options.length=0,l.filter(e=>!e.state).length&&r.options.add(new Option(pack.states[0].name,`0`,!1,!o)),pack.states.filter(e=>e.i&&!e.removed).forEach(e=>{r.options.add(new Option(e.name,String(e.i),!1,e.i===o))}),i.options.length=0,i.options.add(new Option(``,`0`,!1,!s)),pack.provinces.filter(e=>!e.removed&&e.state===o).forEach(e=>{i.options.add(new Option(e.name,String(e.i),!1,e.i===s))}),a.options.length=0,a.options.add(new Option(``,`0`,!1,!c)),l.filter(e=>s?pack.cells.province[e.cell]===s:e.state===o).forEach(e=>{a.options.add(new Option(e.capital?`👑 ${e.name}`:e.name,String(e.i),!1,e.i===c))}),a.options[0].disabled=!0,h.trigger(D,n.coa),P()}function P(){let e=O;if(!e.coa)return;t(`emblemImage`).setAttribute(`href`,`#${D}`);let n=e.fullName||e.name;E===`burg`&&(n=S(`Burg of {{- burg}}`,{burg:n})),t(`emblemArmiger`).textContent=n??``;let r=t(`emblemShapeSelector`);r.value=e.coa.shield??(`icon`in e.coa?``:`heater`);let i=e.coa,a=I(),o=!!a&&!s.chargeIcon(a.charge)&&!!u.kind(a.charge);t(`emblemShapeRow`).classList.toggle(`hidden`,!o&&!(`icon`in i)),t(`emblemFieldRow`).classList.toggle(`hidden`,!o),t(`emblemChargeRows`).classList.toggle(`hidden`,!o),o&&!(`icon`in i)&&B(`emblemField`,i.t1),o&&a&&(B(`emblemChargeTincture`,a.t),t(`emblemChargeSizeSlider`).value=String(a.size??1),t(`emblemChargeSizeNumber`).value=String(a.size??1));let c=t(`emblemPaste`);if(document.activeElement!==c){let e=H(i);c.value=e?JSON.stringify(e,null,2):``}let l=e.coa.size??1;t(`emblemSizeSlider`).value=String(l),t(`emblemSizeNumber`).value=String(l)}function he(){let e=+t(`emblemStates`).value;if(e){if(!$(`state`,e))return}else{let e=pack.burgs.filter(e=>e.i&&!e.removed&&!e.state);if(!e.length||!$(`burg`,e[0].i))return}N()}function ge(){let e=+t(`emblemProvinces`).value;if(e){if(!$(`province`,e))return}else if(!$(`state`,+t(`emblemStates`).value))return;N()}function _e(){$(`burg`,+t(`emblemBurgs`).value)&&N()}function ve(){let n=t(`emblemShapeSelector`),r=n.value,i=O.coa;if(r)`icon`in i?O.coa=F(i.icon,r,i):i.shield=r;else if(!(`icon`in i)){let e=i.charges?.[0]&&s.chargeArt(i.charges[0].charge);if(!e){n.value=i.shield??`heater`,y(S(`Only an emblem with a charge can show it without a shield`),!1,`warn`);return}O.coa={icon:e,...s.placement(i)}}K(i),e(D)?.remove(),h.trigger(D,O.coa),g(E,O.i),P()}function F(e,t,n){return{t1:`argent`,shield:t,charges:[{charge:s.chargeOf(e),t:`gules`,p:`e`,size:1.5}],...s.placement(n)}}function I(){let e=O.coa;return`icon`in e?void 0:e.charges?.[0]}function ye(){let e=O.coa;`icon`in e||(e.t1=t(`emblemField`).value,R())}function be(){let e=I();e&&(e.t=t(`emblemChargeTincture`).value,R())}function L(e){let t=I(),n=+e.currentTarget.value;t&&n>0&&(t.size=n,R())}function R(){h.trigger(D,O.coa),P()}var z=[[S(`Metals`),o.metals],[S(`Colours`),o.colours],[S(`Stains`),o.stains]];function B(e,n){let r=t(e);r.innerHTML=(z.some(([,e])=>n in e)?``:`<option value="${w(n)}">${w(xe(n))}</option>`)+z.map(([e,t])=>`<optgroup label="${e}">${Object.keys(t).map(e=>`<option value="${e}">${C(e)}</option>`).join(``)}</optgroup>`).join(``),r.value=n,r.previousElementSibling.style.background=Se(n)}function xe(e){let[t,n,r]=e.split(`-`);return r?`${C(t.replace(`semy_of_`,`semy of `).replace(/([a-z])([A-Z])/g,`$1 $2`).toLowerCase())}: ${n} and ${r}`:e}function Se(e){let[,t,n]=e.split(`-`);return n?`repeating-linear-gradient(45deg, ${m[t]??t} 0 3px, ${m[n]??n} 3px 6px)`:m[e]??e}function Ce(){ie(E,O)}function V(e){let n=x(+e.currentTarget.value||0,0,5);t(`emblemSizeSlider`).value=String(n),t(`emblemSizeNumber`).value=String(n);let{x:r,y:i}=O.coa;s.place(`${E}:${O.i}`,r??null,i??null,n),g(E,O.i)}function we(){let e=O.coa;s.regenerateOne(`${E}:${O.i}`),K(e),h.trigger(D,O.coa),g(E,O.i),P()}function H(e){if(`icon`in e)return i.pictureCoa(c.get(e.icon));let{size:t,x:n,y:r,...a}=e;return a}function Te(){let e=H(O.coa)??{t1:`sable`};e.charges?.some(({charge:e})=>!s.chargeIcon(e)&&u.kind(e))&&y(S(`Armoria cannot show pictures from the icon library: those charges are missing there`),!1,`warn`,6e3);let t=A.start({type:E,id:O.i,entity:O,queue:Promise.resolve()},`${E}:${O.i}`,options.map,new URL(j).origin),n=new URL(j);n.searchParams.set(`coa`,JSON.stringify(e)),n.searchParams.set(`from`,`FMG`),n.searchParams.set(`session`,t),n.searchParams.set(`returnOrigin`,location.origin),oe(n.href)}function U(){let e=t(`emblemPaste`);try{e.value=JSON.stringify(i.parse(e.value),null,2)}catch{}}async function W(){try{let e=t(`emblemPaste`).value;await G(E,O.i,i.parse(e))}catch(e){y(e.message,!1,`error`,6e3)}}async function G(e,t,n,r){let i=Q(e,t);if(!i)return;let o=options.map,l=i.coa;if(T(n))i.coa={...n,...s.placement(l)};else{if(!r)throw Error(S(`This COA uses art FMG cannot draw`));let t=Ee(l),u=t??c.newId(),d=new File([r],`armoria.svg`,{type:`image/svg+xml`}),f=await a.fromFile(d,u,`emblem`);if(options.map!==o||Q(e,i.i)!==i)return;t?c.update(t,{...f,coa:n}):c.add({id:u,...f,coa:n}),i.coa={icon:u,...s.placement(i.coa)},t||y(S(`This COA uses art FMG cannot draw`),!1,`warn`,5e3)}K(l),q(e,t)&&(h.trigger(D,i.coa),P()),g(e,t)}function Ee(e){if(`icon`in e&&i.pictureCoa(c.get(e.icon)))return Object.values(u.uses(e.icon)).reduce((e,t)=>e+(t??0),0)===1?e.icon:void 0}function K(e){`icon`in e&&i.pictureCoa(c.get(e.icon))&&(Object.keys(u.uses(e.icon)).length||c.remove(e.icon))}function q(e,t){return v.isOpen(`emblemEditor`)&&E===e&&O.i===t}window.addEventListener(`message`,e=>{let t=A.receive(e,options.map);if(!t)return;let n=t.target;n.queue=n.queue.then(async()=>{Q(n.type,n.id)===n.entity&&await G(n.type,n.id,t.coa,t.svg)}).catch(e=>y(e.message,!1,`error`,6e3))});function J(e){let t=O,n=E,a=D,o=options.map,l=t.coa,u=`icon`in l?``:l.charges?.[0]?s.chargeArt(l.charges[0].charge)??``:``;r.open({current:`icon`in l?l.icon:e===`charge`?u:``,preferCustom:!0,profile:`emblem`,onPick:r=>{if(!r||options.map!==o||Q(n,t.i)!==t)return;let l=t.coa,u=i.pictureCoa(c.get(r));if(u&&T(u))t.coa={...u,...s.placement(l)},K({icon:r});else if(e===`whole`||u)t.coa={icon:r,...s.placement(l)};else if(`icon`in l){let e=l.shield??s.getShield(t.culture??0,t.state);t.coa=F(r,e,l)}else{let e=s.chargeOf(r);l.charges?.length?l.charges[0]={...l.charges[0],charge:e}:l.charges=[{charge:e,t:/^(argent|or)$/.test(l.t1)?`gules`:`or`,p:`e`,size:1.5}]}K(l),h.trigger(a,t.coa),g(n,t.i),q(n,t.i)&&P()}})}function Y(e){for(let[n,r]of Object.entries({emblemPasteControl:`emblemsPaste`,emblemDownloadControl:`emblemsDownload`})){let i=n===e&&t(n).classList.contains(`hidden`);if(t(n).classList.toggle(`hidden`,!i),t(r).classList.toggle(`pressed`,i),!i)continue;let a=t(n).querySelector(`input, textarea`);a instanceof HTMLTextAreaElement&&a.setSelectionRange(0,0),a?.focus()}}async function X(e){await h.trigger(D,O.coa);let n=t(D);await _([n]);let r=+t(`emblemsDownloadSize`).value,i=await ne(n,r,e!==`svg`),a=document.createElement(`a`);a.download=`${re(`Emblem ${O.fullName||O.name}`)}.${e}`,e===`svg`?De(i,a):Oe(e,i,a,r),Y(`emblemDownloadControl`)}function De(e,t){t.href=e,t.click()}function Oe(e,t,n,r){let i=document.createElement(`canvas`),a=i.getContext(`2d`);i.width=r,i.height=r;let o=new Image;o.src=t,o.onload=()=>{e===`jpeg`&&(a.fillStyle=`#fff`,a.fillRect(0,0,i.width,i.height)),a.drawImage(o,0,0,i.width,i.height);let t=i.toDataURL(`image/${e}`,.92);n.href=t,n.click(),window.setTimeout(()=>window.URL.revokeObjectURL(t),6e3)}}function Z(e,t){return new XMLSerializer().serializeToString(te(e,t))}async function ke(){let n=re(`Emblems Gallery`),r=pack.states.filter(e=>e.i&&!e.removed&&e.coa),i=pack.provinces.filter(e=>e.i&&!e.removed&&e.coa),a=pack.burgs.filter(e=>e.i&&!e.removed&&e.coa);await Ae(r,i,a),await _([...document.querySelectorAll(`#coas > svg`)]);let o=`<a href="javascript:history.back()">${S(`Go Back`)}</a>`,s=`<div><h2>${S(`States`)}</h2>${r.map(e=>{let n=t(`stateCOA${e.i}`);return`<figure id="state_${e.i}"><a href="#provinces_${e.i}"><figcaption>${e.fullName}</figcaption>${Z(n,200)}</a></figure>`}).join(``)}</div>`,c=r.map(e=>{let n=i.filter(t=>t.state===e.i),r=n.map(e=>{let n=t(`provinceCOA${e.i}`);return`<figure id="province_${e.i}"><a href="#burgs_${e.i}"><figcaption>${e.fullName}</figcaption>${Z(n,200)}</a></figure>`}).join(``);return n.length?`<div id="provinces_${e.i}">${o}<h2>${e.fullName} provinces</h2>${r}</div>`:``}).join(``),l=r.map(t=>{let n=a.filter(e=>e.state===t.i),r=i.filter(e=>e.state===t.i).map(t=>{let r=n.filter(e=>pack.cells.province[e.cell]===t.i),i=r.map(t=>{let n=e(`burgCOA${t.i}`);return n?`<figure id="burg_${t.i}"><figcaption>${t.name}</figcaption>${Z(n,200)}</figure>`:``}).join(``);return r.length?`<div id="burgs_${t.i}">${o}<h2>${t.fullName} burgs</h2>${i}</div>`:``}).join(``),s=n.filter(e=>!pack.cells.province[e.cell]).map(t=>{let n=e(`burgCOA${t.i}`);return n?`<figure id="burg_${t.i}"><figcaption>${t.name}</figcaption>${Z(n,200)}</figure>`:``}).join(``);return s&&(r+=`<div><h2>${t.fullName} burgs under direct control</h2>${s}</div>`),r}).join(``),u=a.filter(e=>!e.state),d=u.length?`<div><h2>${S(`Independent burgs`)}</h2>${u.map(t=>{let n=e(`burgCOA${t.i}`);return n?`<figure id="burg_${t.i}"><figcaption>${t.name}</figcaption>${Z(n,200)}</figure>`:``}).join(``)}</div>`:``,f=`<a href="https://azgaar.github.io/Fantasy-Map-Generator" target="_blank">${S(`Azgaar's Fantasy Map Generator`)}</a>`,p=`<a target="_blank" href="https://github.com/Azgaar/Armoria#license">${S(`the license`)}</a>`,m=`<!DOCTYPE html>
    <html>
      <head>
        <title>${S(`{{map}} Emblems Gallery`,{map:options.map.lore.name})}</title>
      </head>
      <style type="text/css">
        body { margin: 0; padding: 1em; font-family: serif; }
        h1, h2 { font-family: "Forum"; }
        div { width: 100%; max-width: 1018px; margin: 0 auto; border-bottom: 1px solid #ddd; }
        figure { margin: 0 0 2em; display: inline-block; transition: 0.2s; }
        figure:hover { background-color: #f6f6f6; }
        figcaption { text-align: center; margin: 0.4em 0; width: 200px; font-family: "Overlock SC"; }
        address { width: 100%; max-width: 1018px; margin: 0 auto; }
        a { color: black; }
        figure > a { text-decoration: none; }
        div > a { float: right; font-family: var(--monospace); margin-top: 0.8em; }
      </style>
      <link href="https://fonts.googleapis.com/css2?family=Forum&family=Overlock+SC" rel="stylesheet" />
      <body>
        <div><h1>${S(`{{map}} Emblems Gallery`,{map:options.map.lore.name})}</h1></div>
        ${s} ${c} ${l} ${d}
        <address>${S(`Generated by {{- generator}}. The tool is free, but images may be copyrighted, see {{- license}}`,{generator:f,license:p})}</address>
      </body>
    </html>`;se(m,`${n}.html`,`text/plain`)}async function Ae(e,t,n){y(S(`Preparing for download...`),!0,`warn`);let r=e.map(e=>h.trigger(`stateCOA${e.i}`,e.coa)),i=t.map(e=>h.trigger(`provinceCOA${e.i}`,e.coa)),a=n.map(e=>h.trigger(`burgCOA${e.i}`,e.coa)),o=[...r,...i,...a];await Promise.allSettled(o),ae()}function je(e){let t=Number(this.getAttribute(`x`))-e.x,n=Number(this.getAttribute(`y`))-e.y;e.on(`drag`,function(e){this.setAttribute(`x`,String(t+e.x)),this.setAttribute(`y`,String(n+e.y))}),e.on(`end`,function(e){let r=Number(this.parentNode.getAttribute(`font-size`))*Number.parseFloat(this.getAttribute(`width`)||`1`)/2,i=Me(this.parentElement?.id),a=Number(this.dataset.i),o=i&&Number.isInteger(a)?Q(i,a):void 0;if(!i||!o)return;let{width:c,height:l}=options.map.graph,u=x(b(t+e.x+r,2),0,c),d=x(b(n+e.y+r,2),0,l);s.place(`${i}:${a}`,u,d,o.coa.size??null),g(i,a)})}function Me(e){if(e===`burgEmblems`)return`burg`;if(e===`provinceEmblems`)return`province`;if(e===`stateEmblems`)return`state`}function Q(e,t){let n=e===`burg`?pack.burgs[t]:e===`province`?pack.provinces[t]:pack.states[t];return n?.coa?n:void 0}function $(e,t){let n=Q(e,t);return n?(E=e,D=`${e}COA${t}`,O=n,!0):!1}function Ne(){n(`#emblems`).selectAll(`use`).call(p().on(`drag`,je)).classed(`draggable`,!0)}function Pe(){k?.(),k=void 0,n(`#emblems`).selectAll(`use`).on(`.drag`,null).attr(`class`,null),O=null,v.destroy(`emblemEditor`)}var Fe={open:M,openDefault:fe};export{Fe as EmblemsEditor};