import{i as e}from"./rolldown-runtime-COiEfhsA.js";import{A as t,An as n,At as r,C as i,Dn as a,En as o,Et as s,F as c,O as l,T as u,Tt as d,W as f,X as p,Z as m,_ as h,_n as g,a as ee,b as _,bt as te,c as v,dt as ne,f as re,fn as ie,g as ae,gn as y,h as oe,hn as se,ht as ce,i as le,k as ue,lt as de,m as fe,mt as pe,n as b,p as me,pt as he,r as ge,s as _e,st as ve,t as ye,tt as be,un as xe,v as x,vn as Se,wn as Ce,wt as we,x as S,y as Te,yt as Ee}from"./options-model-CrstL1Qd.js";import{t as C}from"./controllers-Dbv1ZRTV.js";import{D as De,E as Oe,O as ke,T as Ae,_ as je,a as w,b as Me,f as Ne,i as T,k as Pe,l as Fe,m as E,n as D,p as Ie,r as Le,s as Re,t as ze,v as Be}from"./index-sNerCVjG.js";import{G as Ve,J as He,K as Ue,M as We,P as Ge,St as Ke,X as qe,bt as Je,c as Ye,et as Xe,h as Ze,i as Qe,lt as $e,n as et,nt as tt,q as nt,r as rt,t as O,vt as it}from"./layers-DjWzCbYN.js";import{_ as at,a as ot,d as k,i as st,p as ct,u as lt,y as ut}from"./notices-6lBE5Kkn.js";import{D as A,a as dt,i as j,r as M,s as ft,t as pt,z as N}from"./node-utils-Ds1sVy-v.js";import{t as mt}from"./min-CCch3uox.js";import{_ as ht,b as gt,h as _t,i as vt,o as yt,s as bt,t as P,u as xt,v as St,x as Ct}from"./pack-generator-DTsfQ82D.js";import{n as wt,t as Tt}from"./map-history-C5-kWlBi.js";import{n as Et,t as F}from"./dialog-BkeQgjla.js";import{a as Dt,i as Ot,o as I,t as kt}from"./tooltips-BVQbACdS.js";import{t as At}from"./drag-CCSsgLNP.js";import{S as jt,_ as L,a as Mt,c as Nt,d as Pt,f as Ft,g as It,i as Lt,l as R,m as Rt,n as zt,p as Bt,r as z,t as B,v as V,x as Vt,y as H}from"./names-generator-BcJRPzyi.js";import{i as Ht,n as Ut,r as Wt,s as Gt,t as U}from"./services-CiMWa4Oi.js";import{a as Kt,n as qt,r as Jt,t as Yt}from"./canvas-BVQSnWDn.js";import{n as Xt,t as Zt}from"./environment-BDBII_BV.js";import{t as Qt}from"./added-labels-CB5gxKRk.js";import{t as $t}from"./measurers-generator-DazKvylb.js";import{n as W}from"./goods-generator-DS7hwx2H.js";import{i as en,t as tn}from"./production-generator-BpyiZTFU.js";import{a as nn,c as rn,d as an,i as on,n as sn,o as cn,s as ln}from"./prosperity-J_ycIG-E.js";import{t as un}from"./graph-override-D--VMnwP.js";import{T as dn,f as fn,n as pn,p as mn,s as hn,w as gn}from"./units-CYDspnRH.js";import{t as _n}from"./biomes-generator-BQuuN3NH.js";import{t as vn}from"./heightmap-generator-C-OtvlxP.js";import{t as yn}from"./ice-generator-tkZapT-A.js";import{t as bn}from"./temperature-generator-BeC9kfd1.js";import{a as xn,r as Sn,t as Cn,u as wn}from"./military-generator-CVth4JoO.js";import{n as Tn}from"./stability-DCAus2OW.js";import{a as En,c as Dn,n as On,o as kn,r as An,s as jn,t as Mn,u as Nn,v as Pn}from"./color-utils-OCVlKvQa.js";import{t as Fn}from"./journeys-generator-Dzl8JmN4.js";import{t as In}from"./notes-DvEnXEai.js";import{i as Ln,o as Rn}from"./fonts-BG2tKf1N.js";import{o as zn,r as Bn,t as G}from"./styles-7-lY19-9.js";import{a as Vn,r as Hn,t as Un}from"./file-utils-CUGyyqg9.js";import{t as Wn}from"./platform-Cry3Vb1_.js";import{c as Gn,d as Kn,f as qn,i as Jn,m as Yn,n as Xn,o as Zn,r as Qn,t as $n,u as er}from"./zoom-B8oh1YKy.js";import{r as tr}from"./development-overlay-CuKeZGSe.js";import{t as nr}from"./development-view-ChwbelfH.js";import{r as rr}from"./highlight-CBuOTLhq.js";import{t as ir}from"./state-B2hBYDzv.js";import{a as ar,d as or}from"./draw-heightmap-CEyJl1Kw.js";import{t as sr}from"./map-restoration--iF7MIok.js";import{n as cr}from"./file-name-B95gRTjS.js";globalThis.grid={},globalThis.pack={};function lr(e,t){this._basis=new bt(e),this._beta=t}lr.prototype={lineStart:function(){this._x=[],this._y=[],this._basis.lineStart()},lineEnd:function(){var e=this._x,t=this._y,n=e.length-1;if(n>0)for(var r=e[0],i=t[0],a=e[n]-r,o=t[n]-i,s=-1,c;++s<=n;)c=s/n,this._basis.point(this._beta*e[s]+(1-this._beta)*(r+c*a),this._beta*t[s]+(1-this._beta)*(i+c*o));this._x=this._y=null,this._basis.lineEnd()},point:function(e,t){this._x.push(+e),this._y.push(+t)}};var ur=(function e(t){function n(e){return t===1?new bt(e):new lr(e,t)}return n.beta=function(t){return e(+t)},n})(.85);globalThis.options=b.getDefaultOptions();var dr=new Map([[`texture`,{label:w(`Texture`),shortcut:`KeyX`}],[`heightmap`,{label:w(`Heightmap`),shortcut:`KeyH`}],[`lakes`,{label:w(`Lakes`),shortcut:`KeyQ`}],[`biomes`,{label:w(`Biomes`),shortcut:`KeyB`}],[`cells`,{label:w(`Cells`),shortcut:`KeyE`}],[`grid`,{label:w(`Grid`),shortcut:`Semicolon`,hint:`; (${w(`semicolon`)})`}],[`coordinates`,{label:w(`Coordinates`),shortcut:`KeyO`}],[`compass`,{label:w(`Wind Rose`),shortcut:`KeyW`}],[`rivers`,{label:w(`Rivers`),shortcut:`KeyV`}],[`relief`,{label:w(`Relief`),shortcut:`KeyF`}],[`religions`,{label:w(`Religions`),shortcut:`KeyR`}],[`cultures`,{label:w(`Cultures`),shortcut:`KeyC`}],[`states`,{label:w(`States`),shortcut:`KeyS`}],[`provinces`,{label:w(`Provinces`),shortcut:`KeyP`}],[`zones`,{label:w(`Zones`),shortcut:`KeyZ`}],[`borders`,{label:w(`Borders`),shortcut:`KeyD`}],[`routes`,{label:w(`Routes`),shortcut:`KeyU`}],[`temperature`,{label:w(`Temperature`),shortcut:`KeyT`}],[`ice`,{label:w(`Ice`),shortcut:`KeyJ`}],[`goods`,{label:w(`Goods`),shortcut:`KeyG`}],[`markets`,{label:w(`Markets`)}],[`trade`,{label:w(`Trade`),shortcut:`Backquote`,hint:`\` (${w(`backtick`)})`}],[`precipitation`,{label:w(`Precipitation`),shortcut:`KeyA`}],[`population`,{label:w(`Population`),shortcut:`KeyN`}],[`emblems`,{label:w(`Emblems`),shortcut:`KeyY`}],[`burgIcons`,{label:w(`Icons`),shortcut:`KeyI`}],[`labels`,{label:w(`Labels`),shortcut:`KeyL`}],[`military`,{label:w(`Military`),shortcut:`KeyM`}],[`markers`,{label:w(`Markers`),shortcut:`KeyK`}],[`journeys`,{label:w(`Journeys`)}],[`rulers`,{label:w(`Rulers`),shortcut:`Equal`,hint:`= (${w(`equal sign`)})`}],[`scaleBar`,{label:w(`Scale Bar`),shortcut:`Slash`,hint:`/ (${w(`slash sign`)})`}],[`vignette`,{label:w(`Vignette`),shortcut:`BracketLeft`,hint:`[ (${w(`left square bracket`)})`}]]),fr={coastline:w(`Coastline`),fogging:w(`Fogging`),landmass:w(`Landmass`),legend:w(`Legend`),ocean:w(`Ocean`)};function pr(e){return e===`map`?w(`Map`):dr.get(e)?.label??fr[e]??e.charAt(0).toUpperCase()+e.slice(1)}function mr({label:e,shortcut:t}){let n=t?.startsWith(`Key`)?t.slice(3).toLowerCase():``,r=n?e.toLowerCase().indexOf(n):-1;return r<0?e:`${e.slice(0,r)}<u>${e[r]}</u>${e.slice(r+1)}`}var hr={political:w(`Political map`),cultural:w(`Cultural map`),religions:w(`Religions map`),provinces:w(`Provinces map`),biomes:w(`Biomes map`),heightmap:w(`Heightmap`),physical:w(`Physical map`),poi:w(`Places of interest`),goods:w(`Goods and production`),trade:w(`Trade map`),military:w(`Military map`),emblems:w(`Emblems`),landmass:w(`Pure landmass`)},gr=e=>[...dr].find(([,t])=>t.shortcut===e)?.[0],_r=`
  <div class="head">
    <p data-tip="${w(`Select a map layers preset`)}">${w(`Layers preset`)}:</p>
    <select data-tip="${w(`Select a map layers preset`)}" id="layersPreset">
      ${Object.entries(hr).map(([e,t])=>`<option value="${e}">${t}</option>`).join(``)}
      <option hidden value="custom">${w(`Custom (not saved)`)}</option>
    </select>
    <button
      id="savePresetButton"
      data-tip="${w(`Click to save displayed layers as a new preset`)}"
      class="icon-plus sideButton"
      style="display: none"
    ></button>
    <button
      id="removePresetButton"
      data-tip="${w(`Remove`)}"
      class="icon-minus sideButton"
      style="display: none"
    ></button>
    <button id="layersOrderButton" data-tip="${w(`Change the layer order`)}" class="icon-sort-alt-down sideButton"></button>
  </div>
  <div data-tip="${T(w(`Click to toggle the layer`),w(`Ctrl + click to edit layer style`))}" id="mapLayers"></div>
  <div class="tip">${w(`Click to toggle the layer`)}. ${w(`Ctrl + click to edit layer style`)}</div>
  <div id="viewMode" data-tip="${w(`Set view mode`)}">
    <p>${w(`View mode`)}:</p>
    <button data-tip="${w(`Standard view mode for editing the map`)}" id="viewStandard" class="pressed">
      ${w(`Standard`)}
    </button>
    <button
      data-tip="${T(w(`Map presentation in 3D scene`),w(`Works best for heightmap`),w(`Cannot be used for editing`))}"
      id="viewMesh"
    >
      ${w(`3D scene`)}
    </button>
    <button data-tip="${T(w(`Project map on globe`),w(`Cannot be used for editing`))}" id="viewGlobe">${w(`Globe`)}</button>
  </div>
`;M(`layersContent`).innerHTML=_r;function vr(){M(`mapLayers`).replaceChildren(...O.all.flatMap(e=>{let t=dr.get(e.id);if(!t)return[];let n=document.createElement(`button`);return n.dataset.layer=e.id,n.dataset.tip=T(w(`Toggle {{- layer}}`,{layer:t.label}),w(`Ctrl + click to edit layer style`)),t.shortcut&&(n.dataset.shortcut=t.hint??t.shortcut.replace(`Key`,``)),n.innerHTML=mr(t),n.classList.toggle(`buttonoff`,!O.isOn(e.id)),[n]}))}M(`mapLayers`).addEventListener(`click`,e=>{let t=e.target.closest(`button`)?.dataset.layer;if(t&&O.has(t)){if(lt(e)&&!options.map.viewOnly)return void C.StyleEditor.open(t);O.toggle(t)}}),M(`layersOrderButton`).addEventListener(`click`,()=>void C.LayersOrder.open()),O.subscribe(vr),O.subscribe(()=>it.renderNow());var yr;O.subscribe(()=>{j(`canvas3d`)&&(clearTimeout(yr),yr=window.setTimeout(()=>void C.View3d.update(),400))}),vr();var br=`
  <div class="head">
    <p data-tip="${w(`Select a style preset. State labels may required regeneration if font is changed`)}">${w(`Preset`)}:</p>
    <button type="button" id="stylePreset" data-tip="${w(`Click to select a style preset`)}"></button>
    <button id="addStyleButton" data-tip="${w(`Click to save current style as a new preset`)}" class="icon-plus sideButton"></button>
  </div>
  <div class="head">
    <p data-tip="${w(`Select an element to edit its style`)}">${w(`Element`)}:</p>
    <select data-tip="${w(`Select an element to edit its style`)}" id="styleElementSelect"></select>
    <button id="styleElementTreeButton" data-tip="${w(`Browse all elements and their groups`)}" class="icon-sitemap sideButton"></button>
  </div>
  <div class="head group-row" style="display: none">
    <p data-tip="${w(`Select element group`)}">${w(`Group`)}:</p>
    <select data-tip="${w(`Select element group`)}" id="styleGroupSelect"></select>
  </div>
  <div id="styleForm"></div>
`,xr=`
  :root {
    --style-card-fill: rgba(255, 255, 255, .1);
    --style-card-head: rgba(255, 255, 255, .2);
    --style-group-line: rgba(0, 0, 0, .15);
  }
  #stylePreset { flex: 1 1 auto; min-width: 0; height: 1.6em; margin: 0; padding: 0 .3em; font-size: smaller; display: flex; align-items: center; gap: .4em; background: #fff; color: #000; border: .5px solid #dbdfe6; border-top-color: #abadb3; border-radius: .5px; text-transform: capitalize; cursor: pointer; }
  #stylePreset > span { flex: 1 1 auto; min-width: 0; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  #stylePreset::after { content: "▾"; opacity: .6; }
  #styleForm { margin-top: .4em; }
  #styleForm .banner { color: darkred; font-weight: 700; margin: .3em 0; }
  #styleForm .banner a { cursor: pointer; text-decoration: underline; }
  #styleForm .pick { margin: 0; flex: 1 1 0; display: flex; align-items: center; gap: .4em; padding: 0.1em .4em; background: #ffffff; font-size: smaller; }
  #styleForm .pick::after { content: "▾"; margin-left: auto; opacity: .6; }
  #styleForm .pick > svg { flex: none; width: 1.4em; height: 1.4em; overflow: visible; }
  #styleForm .reset { flex: none; visibility: hidden; border: 0; background: none; box-shadow: none; color: var(--dark-solid); padding: 0 .2em; margin: 0; cursor: pointer; }
  #styleForm .changed .reset { visibility: visible; }
  #styleForm .reset.blank { visibility: hidden; }
  #styleForm details[data-section] > summary:has(> .gate.changed) { box-shadow: inset 3px 0 0 var(--dark-solid); }
  #styleForm summary > .preview { display: flex; height: 1.6em; } /* reserved, so every header is the same height */
  #styleForm summary > .preview > .sample { font-size: 1.25em; line-height: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  #styleForm summary > .preview > .chip { flex: none; width: 3em; height: 1.6em; overflow: visible; }
  #styleForm summary > .preview > .ramp { flex: none; width: 2.6em; height: .9em; border: 1px solid #333; border-radius: 3px; }
  #styleForm summary > .preview > .tex { flex: none; width: 1.8em; height: 1.5em; border: 1px solid #333; border-radius: 3px; background-size: cover; background-position: center; }
  #styleForm summary > .preview > .icon { flex: none; display: flex; }
  #styleForm summary > .preview > .icon > svg { width: 1.5em; height: 1.5em; overflow: visible; }
  #styleForm summary > .preview > .off { opacity: .45; }
`;M(`styleContent`).innerHTML=br;var Sr=document.createElement(`style`);Sr.textContent=xr,document.head.append(Sr);var Cr=`
  <p>${w(`Heightmap customization tools`)}:</p>
  <div id="customizeTools">
    <button data-tip="${w(`Display brushes panel`)}" id="paintBrushes">${w(`Paint Brushes`)}</button>
    <button data-tip="${w(`Template Editor`)}" id="applyTemplate" style="display: none">${w(`Template Editor`)}</button>
    <button data-tip="${w(`Image Converter`)}" id="convertImage" style="display: none">${w(`Image Converter`)}</button>
    <button data-tip="${w(`Render heightmap data as a small monochrome image`)}" id="heightmapPreview">${w(`Preview`)}</button>
    <button data-tip="${w(`Preview the heightmap in a 3D scene`)}" id="heightmap3DView">${w(`3D scene`)}</button>
  </div>
  <p>${w(`Options`)}:</p>
  <div id="customizeOptions">
    <div data-tip="${w(`Heightmap edit mode`)}">${w(`Edit mode`)}: <span id="heightmapEditMode"></span></div>
    <div data-tip="${w(`Render cells below sea level (with a height less than 20)`)}">
      <input id="renderOcean" class="checkbox" type="checkbox" />
      <label for="renderOcean" class="checkbox-label">${w(`Render ocean cells`)}</label>
    </div>
    <div data-tip="${w(`Show where water flows: arrows point downhill, hatching marks depressions that get filled, blue hatching marks the ones deep enough to become lakes`)}">
      <input id="showDrainage" class="checkbox" type="checkbox" />
      <label for="showDrainage" class="checkbox-label">${w(`Show drainage`)}</label>
    </div>
    <div
      id="allowErosionBox"
      data-tip="${w(`Regenerate rivers and allow water flow to change heights and form new lakes. Recommended`)}"
    >
      <input id="allowErosion" class="checkbox" type="checkbox" />
      <label for="allowErosion" class="checkbox-label">${w(`Allow water erosion`)}</label>
    </div>
    <div
      data-tip="${w(`Maximum number of iterations to fill depressions. Increase if rivers end without reaching a lake or the sea`)}"
    >
      <div>${w(`Maximum depression filling iterations`)}:</div>
      <input
        id="resolveDepressionsStepsInput"
        data-option="resolveDepressionsSteps"
        type="range"
        min="0"
        max="500"
        value="250"
      />
      <input
        id="resolveDepressionsStepsOutput"
        data-option="resolveDepressionsSteps"
        type="number"
        min="0"
        max="1000"
        value="250"
      />
    </div>
    <div data-tip="${w(`Depression depth needed to form a new lake. Increase to reduce the number of generated lakes`)}">
      <div>${w(`Depression depth threshold`)}:</div>
      <input
        id="lakeElevationLimitInput"
        data-option="lakeElevationLimit"
        type="range"
        min="0"
        max="80"
        value="20"
      />
      <input
        id="lakeElevationLimitOutput"
        data-option="lakeElevationLimit"
        type="number"
        min="0"
        max="80"
        value="20"
      />
    </div>
  </div>
  <p>${w(`Statistics`)}:</p>
  <div>
    <span>${w(`Land cells`)}: </span><span id="landmassCounter">0</span>
    <span style="margin-left: 0.9em">${w(`Mean height`)}: </span><span id="landmassAverage">0</span>
  </div>
  <p>${w(`Cell info`)}:</p>
  <div>
    <span>${w(`Coord`)}: </span><span id="heightmapInfoX"></span>/<span id="heightmapInfoY"></span><br />
    <span>${w(`Cell`)}: </span><span id="heightmapInfoCell"></span><br />
    <span>${w(`Height`)}: </span><span id="heightmapInfoHeight"></span>
  </div>
`;M(`heightmapMenu`).innerHTML=Cr;var wr=(e,t,n)=>N(`#${e}`).transition().duration(n).style(`opacity`,String(t));function Tr(){wr(`loading`,1,200),wr(`optionsContainer`,0,100),wr(`tooltip`,0,200)}function Er(){wr(`loading`,0,3e3),wr(`optionsContainer`,1,2e3),wr(`tooltip`,1,3e3)}var Dr=e(ht());function Or(e){if(e)options.map.seed=e;else{let e=!Tt.length,t=new URL(window.location.href).searchParams.get(`seed`);if(e&&t){let e=new URL(window.location.href).searchParams.get(`from`)===`MFCG`&&t.length===13;options.map.seed=e?t.slice(0,-4):t}else options.map.seed=Rt()}Math.random=(0,Dr.default)(options.map.seed)}function kr(){let e=M(`seedInput`).value;e===options.map.seed?I(w(`The current map already has this seed`),!1,`error`):os({seed:e})}function Ar(){let e=Tt.map((e,t)=>{let n=new Date(e.created).toLocaleTimeString(),r=`<i data-tip="${w(`Click to generate a map with this seed`)}" data-index="${t}" class="icon-history optionsSeedRestore"></i>`;return`<li>${w(`Seed: {{seed}} {{- restore}}. Size: {{width}}x{{height}}. Template: {{template}}. Created: {{created}}`,{seed:e.seed,restore:r,width:e.width,height:e.height,template:e.template,created:n})}</li>`}),t=F.message({title:w(`Seed history`),message:`<ol style="margin: 0; padding-left: 1.5em">${e.join(``)}</ol>`});for(let e of t.querySelectorAll(`.optionsSeedRestore`))e.addEventListener(`click`,()=>jr(Number(e.dataset.index)))}function jr(e){let{seed:t,width:n,height:r,template:i,templatePinned:a}=Tt[e];b.set(e=>e.generation.template=i),a?v.set(`template`,i):v.has(`template`)&&v.clear(`template`),os({seed:t,width:n,height:r})}function Mr(){O.init(),Pr(),window.addEventListener(`resize`,Fr),window.addEventListener(`vite:preloadError`,Lr),Rr(),Ir(),!Xt()&&!Zt()&&(window.onbeforeunload=()=>w(`Are you sure you want to navigate away?`)),Zt()&&Br()}var Nr=[[`#optionsTrigger`,null,w(`Click to show the Menu`)],[`#regenerate`,w(`New Map!`),w(`Click to generate a new map`)],[`#options .drag-trigger`,null,w(`Drag to move the Menu`)],[`#optionsHide`,null,w(`Click to hide the Menu`)],[`#layersTab`,w(`Layers`),w(`Click to change map layers`)],[`#styleTab`,w(`Style`),w(`Click to open style editor`)],[`#optionsTab`,w(`Options`),w(`Click to change generation and UI options`)],[`#toolsTab`,w(`Tools`),w(`Click to open tools menu`)],[`#aboutTab`,w(`About`),w(`Click to see Generator info`)],[`#newMapButton`,w(`New Map`),w(`Generate a new map based on options`)],[`#exportButton`,w(`Export`),w(`Select format to download image or export map data`)],[`#saveButton`,w(`Save`),w(`Save fully-functional map file`)],[`#loadButton`,w(`Load`),w(`Load fully-functional map (.map or .gz formats)`)],[`#zoomReset`,w(`Zoom Out`,{context:`button`}),w(`Reset map zoom`)],[`#searchButton`,w(`Search`,{context:`button`}),w(`Search map and commands`)],[`#heightmapFinalize > div`,null,w(`Drag to move the pane`)],[`#finalizeHeightmap`,w(`Exit Customization`),w(`Finalize the heightmap and exit the edit mode`)],[`#assistantBubble`,null,w(`Azgaar Assistant`)],[`#mapOverlay`,w(`Drop a map file to open`),null]];function Pr(){for(let[e,t,n]of Nr){let r=document.querySelector(e);r&&(t!==null&&(r.textContent=t),n!==null&&(r.dataset.tip=n))}j(`assistantBubble`)?.setAttribute(`aria-label`,w(`Azgaar Assistant`));let e=j(`tooltip`);e&&!localStorage.getItem(`fmg-disable-click-arrow-tooltip`)&&(e.dataset.main=w(`Click the arrow button for options. Zoom in to see the map in details`));let t=j(`loading-text`)?.firstChild;t&&(t.textContent=w(`Loading`).toUpperCase())}function Fr(){b.set(e=>{v.rolls(`mapWidth`)&&window.innerWidth>0&&(e.generation.graph.width=window.innerWidth),v.rolls(`mapHeight`)&&window.innerHeight>0&&(e.generation.graph.height=window.innerHeight)}),Jt()}function Ir(){let e=j(`assistantBubble`);e&&(e.addEventListener(`click`,()=>C.Assistant.toggle()),e.addEventListener(`mouseover`,Ot))}function Lr(){navigator.onLine?F.confirm({title:w(`New version released`),message:`${w(`This part of the app failed to load because a new version was released while the page was open.`)}<br>${T(w(`Reload the page to get the new version`),w(`If you have unsaved changes, save the map first`))}`,confirm:w(`Reload`),cancel:w(`Not now`),onConfirm:()=>{window.onbeforeunload=null,location.reload()}}):F.message({title:w(`You are offline`),message:w(`This part of the app was not downloaded before the connection was lost. Reconnect and try again`)})}function Rr(){let e=()=>M(`mapOverlay`);document.addEventListener(`dragover`,t=>{t.stopPropagation(),t.preventDefault(),e().style.display=null}),document.addEventListener(`dragleave`,()=>{e().style.display=`none`}),document.addEventListener(`drop`,t=>{t.stopPropagation(),t.preventDefault();let n=e();n.style.display=`none`;let r=t.dataTransfer?.items;if(r?.length!==1)return;let i=r[0].getAsFile();if(i){if(!i.name.endsWith(`.map`)&&!i.name.endsWith(`.gz`))return F.message({title:w(`Invalid file format`),message:w(`Please upload a map file (.map or .gz formats) you have previously downloaded`)});n.style.display=null,n.innerHTML=`${w(`Uploading`)}<span>.</span><span>.</span><span>.</span>`,F.closeAll(),U.Load.uploadMap(i,()=>{n.style.display=`none`,n.innerHTML=w(`Drop a map file to open`)})}})}function zr(){return!location.hostname&&(F.message({title:w(`Loading error`),width:`28em`,message:w(`Fantasy Map Generator cannot run serverless. Follow the {{- instructions}} on how you can easily run a local web-server`,{instructions:`<a href="https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Run-FMG-locally" target="_blank">${w(`instructions`)}</a>`})}),!0)}function Br(){j(`getAppButton`)?.remove(),j(`saveToDropboxButton`)?.remove(),j(`loadFromDropbox`)?.remove()}var Vr=class{name;steps;constructor(e,t){this.name=e,this.steps=t}async run(e){D.group(this.name),D.time(this.name);let t=performance.now();try{for(let t of this.steps){D.time(t.id);let n=performance.now();try{await t.run(e)}catch(e){let n=Ie(e);throw Error(`${this.name} failed at step "${t.id}": ${n}`,{cause:e})}finally{D.timeEnd(t.id),performance.measure(t.id,{start:n,detail:this.name})}}}finally{D.timeEnd(this.name),performance.measure(this.name,{start:t}),D.groupEnd()}}};function Hr(e,t){let n=t.reduce((e,t)=>e+t,0);if(!n)return L(e);let r=Math.random()*n,i=0;return e.find((e,n)=>(i+=t[n],r<i))??e.at(-1)}var Ur=new class{config;constructor(){this.config={invasion:{quantity:2,generate:e=>this.addInvasion(e)},rebels:{quantity:1.5,generate:e=>this.addRebels(e)},proselytism:{quantity:1.6,generate:e=>this.addProselytism(e)},crusade:{quantity:1.6,generate:e=>this.addCrusade(e)},disease:{quantity:1.4,generate:e=>this.addDisease(e)},disaster:{quantity:1,generate:e=>this.addDisaster(e)},eruption:{quantity:1,generate:e=>this.addEruption(e)},avalanche:{quantity:.8,generate:e=>this.addAvalanche(e)},fault:{quantity:1,generate:e=>this.addFault(e)},flood:{quantity:1,generate:e=>this.addFlood(e)},tsunami:{quantity:1,generate:e=>this.addTsunami(e)},famine:{quantity:1,generate:e=>this.addFamine(e)}}}rename(e,t){this.living(e).name=y(t)}recolor(e,t){this.living(e).color=Dn(t)}setType(e,t){this.living(e).type=y(t)}setHidden(e,t){let n=this.living(e);t?n.hidden=!0:delete n.hidden}add(e,t,n){let r=pack.zones.length?Math.max(...pack.zones.map(e=>e.i))+1:0,i={i:r,name:y(e),type:y(t),color:`url(#hatch${r%42})`,cells:[],tags:[]};return pack.zones.push(i),this.setCells(r,n),r}setCells(e,t){let n=pack.cells.i.length;if(!Array.isArray(t)||!t.length||t.some(e=>!Number.isInteger(e)||e<0||e>=n))throw Error(`The cells must be a non-empty list of cell ids from 0 to ${n-1}`);this.living(e).cells=[...new Set(t)]}setPopulation(e,t,n){let r=new Set(this.living(e).cells);x.setArea(x.landCells(e=>r.has(e)),x.burgIds(e=>r.has(e.cell)),t,n)}remove(e){this.living(e),pack.zones=pack.zones.filter(t=>t.i!==e)}living(e){let t=pack.zones.find(({i:t})=>t===e);if(!t)throw Error(`Zone ${e} does not exist`);return t}regenerate(e=1){this.generate(e),W.remapEntityMultipliers(`zone`,new Map)}generate(e=1){let t=new Uint8Array(pack.cells.i.length);pack.zones=[],Object.values(this.config).forEach(n=>{let r=n.quantity*e,i=Bt(r,r/2,0,100);for(;i--;)n.generate(t)});for(let e of pack.zones)e&&(e.tags??=[],e.cells=[...new Set(e.cells)])}addInvasion(e){let{cells:t,states:n}=pack,r=n.filter(e=>e.i&&!e.removed&&e.campaigns).flatMap(e=>e.campaigns).filter(e=>!e.end);if(!r.length)return;let{defender:i,attacker:a,name:o}=L(r),s=t.i.filter(n=>e[n]||t.state[n]!==i?!1:t.c[n].some(e=>t.state[e]===a)),c=Hr(s,s.map(e=>(t.prosperity?.[e]||0)**2));if(c===void 0)return;let l=[],u=[c],d=V(5,30);for(;u.length;){let n=R(.4)?u.shift():u.pop();if(l.push(n),l.length>=d)break;t.c[n].forEach(n=>{e[n]||t.state[n]===i&&(e[n]=1,u.push(n))})}let f=H({Invasion:5,Occupation:4,Conquest:3,Incursion:2,Intervention:2,Assault:1,Foray:1,Intrusion:1,Irruption:1,Offensive:1,Pillaging:1,Plunder:1,Raid:1,Skirmishes:1}),p=`${z(n[a].name)} ${f}`,m=`Troops of ${n[a].name} have crossed into ${n[i].name} in the ${o}. They raid, besiege and hold the land here, the richest along the border, and its people flee before them.`;pack.zones.push({i:pack.zones.length,name:p,note:m,type:`Invasion`,cells:l,color:`url(#hatch1)`})}addRebels(e){let{cells:t,states:n}=pack,r=(e=.5)=>(1-e)**2,i=n.filter(e=>e.i&&!e.removed&&e.neighbors?.some(Boolean)),a=Hr(i,i.map(e=>r(Tn.get(e.i)?.stability)));if(!a)return;let o=L(a.neighbors.filter(e=>e&&!n[e].removed));if(!o)return;let s=Tn.getProvinces(a.i).filter(e=>e.province.people),c=s.length?Hr(s,s.map(e=>r(e.stability))):void 0,l=c?.province,u=e=>t.state[e]===a.i&&(!l||rn.ofCell(e)===l),d=e=>t.c[e].some(e=>t.state[e]===o),f=[],p=[],m=t.i.find(e=>u(e)&&d(e)),h=l?.burg?.cell,g=m??(l&&(h!==void 0&&u(h)?h:t.i.find(u)));g!==void 0&&p.push(g);let ee=V(10,30);for(;p.length;){let n=p.shift();if(f.push(n),f.length>=ee)break;t.c[n].forEach(t=>{e[t]||u(t)&&(e[t]=1,(m===void 0||t%4==0||d(t))&&p.push(t))})}let _=c?.parts,te=!!_&&_.burden<=-.1&&Object.values(_).every(e=>e>=_.burden),v=H(te?{"Tax Revolt":3,"Tax Rebels":2,"Tithe Riots":1,"Peasant Revolt":1}:{Rebels:5,Insurrection:2,Mutineers:1,Insurgents:1,Rebellion:1,Renegades:1,Revolters:1,Revolutionaries:1,Rioters:1,Separatists:1,Secessionists:1,Conspiracy:1}),ne=l?.id?pack.provinces[l.id]:void 0,re=te?ne??a:m!==void 0||!ne?n[o]:ne,ie=`${z(re.name)} ${v}`,ae=ne?.name??a.name,y=_&&this.getUnrestCause(_),oe=te?`Crushed by the taxes of ${a.name}, the people of ${ae} refuse to pay and have taken up arms against the tax collectors.`:m===void 0?`${ae} has risen against the rule of ${a.name}${y?`. ${y}`:``}.`:`People of ${a.name} along the border with ${n[o].name} have taken up arms against their rulers, backed by their neighbor${y?`. ${y}`:``}.`;pack.zones.push({i:pack.zones.length,name:ie,note:oe,type:`Rebels`,cells:f,color:`url(#hatch3)`})}addProselytism(e){let{cells:t,religions:n}=pack,r=n.filter(e=>e.i&&!e.removed&&e.type===`Organized`),i=L(r);if(!i)return;let a=t.i.filter(e=>t.h[e]>=20&&t.pop[e]&&t.religion[e]!==i.i&&t.c[e].some(e=>t.religion[e]===i.i)),o=L(a);if(!o)return;let s=t.religion[o],c=[],l=[o],u=V(10,30);for(;l.length;){let n=l.shift();if(c.push(n),c.length>=u)break;t.c[n].forEach(n=>{e[n]||t.religion[n]===s&&(t.h[n]<20||!t.pop[n]||(e[n]=1,l.push(n)))})}let d=`${z(i.name.split(` `)[0])} Proselytism`,f=`Missionaries of ${i.name} preach among the followers of ${n[s]?.name||`other faiths`} here, winning converts village by village.`;pack.zones.push({i:pack.zones.length,name:d,note:f,type:`Proselytism`,cells:c,color:`url(#hatch6)`})}addCrusade(e){let{cells:t,religions:n}=pack,r=n.filter(e=>!e.removed&&e.type===`Heresy`);if(!r.length)return;let i=L(r),a=t.i.filter(n=>!e[n]&&t.religion[n]===i.i);if(!a.length)return;for(let t of a)e[t]=1;let o=`${z(i.name.split(` `)[0])} Crusade`,s=`${i.name} is condemned as heresy. Crusaders march against its followers wherever they live, burning their shrines.`;pack.zones.push({i:pack.zones.length,name:o,note:s,type:`Crusade`,cells:Array.from(a),color:`url(#hatch6)`})}addDisease(e){let{cells:t,burgs:n}=pack,r=n.filter(t=>!e[t.cell]&&t.i&&!t.removed),i=Hr(r,this.getBurgTrade(r).map((e,t)=>Math.sqrt(e)*(r[t].port?2:1)));if(!i)return;let a=[],o=[],s=V(20,40),c=new ne;for(c.push({e:i.cell,p:0},0);c.length;){let n=c.pop();(t.burg[n.e]||t.pop[n.e])&&a.push(n.e),e[n.e]=1,t.c[n.e].forEach(e=>{let t=S.getRoute(n.e,e)?5:100,r=n.p+t;r>s||(!o[e]||r<o[e])&&(o[e]=r,c.push({e,p:r},r))})}let l=this.getDiseaseName(`color`),u=this.getDiseaseName(`animal`),d=this.getDiseaseName(`adjective`),f=H({color:2,animal:1,adjective:1}),p=`${f===`color`?l:f===`animal`?u:d} ${H({Fever:5,Plague:3,Cough:3,Flu:2,Pox:2,Cholera:2,Typhoid:2,Leprosy:1,Smallpox:1,Pestilence:1,Malaria:1,Dropsy:1})}`,m=i.port?`the port of ${i.name}, brought by ships`:`the market of ${i.name}`,h=`An outbreak of ${p.toLowerCase()} that began in ${m}. Merchants and travelers carry it along the roads.`;pack.zones.push({i:pack.zones.length,name:p,note:h,type:`Disease`,cells:a,color:`url(#hatch12)`})}getUnrestCause(e){let t={remoteness:`The capital is far away, and its rule is weak here`,diversity:`Its people are strangers to the ruling culture`,corruption:`Corrupt officials have turned the people against their rulers`,army:`The army goes unpaid and does not keep order`},[n,r]=Object.entries(e).filter(([e])=>e in t).reduce((e,t)=>t[1]<e[1]?t:e,[``,0]);return r<=-.05?t[n]:void 0}getBurgTrade(e){let t=[];for(let[e,,,n,r,i]of pack.deals)n!==l.kept&&(t[e]=(t[e]||0)+r*i);return e.map(e=>t[e.i]||0)}addFamine(e){let{cells:t,states:n}=pack;if(!t.prosperity)return;let r=(n,r)=>!e[n]&&t.pop[n]>0&&t.prosperity[n]>0&&t.prosperity[n]<=r,i=t.i.filter(e=>r(e,20)),a=Hr(i,i.map(e=>(21-t.prosperity[e])**2));if(a===void 0)return;let o=[],s=[a];e[a]=1;let c=V(10,40);for(;s.length&&o.length<c;){let n=s.shift();o.push(n);for(let i of t.c[n])r(i,30)&&(e[i]=1,s.push(i))}if(o.length<3)return;let l=n[t.state[a]],u=l?.i?l.name:B.getCulture(t.culture[a]),d=H({Famine:5,Hunger:2,Dearth:1,Starvation:1});pack.zones.push({i:pack.zones.length,name:`${z(u)} ${d}`,note:`The poorest countryside of ${u}. The harvest has failed, and its people have no money to buy grain from the markets, so they go hungry.`,type:`Famine`,cells:o,color:`url(#hatch10)`})}getDiseaseName(e){return L(e===`color`?[`Amber`,`Azure`,`Black`,`Blue`,`Brown`,`Crimson`,`Emerald`,`Golden`,`Green`,`Grey`,`Orange`,`Pink`,`Purple`,`Red`,`Ruby`,`Scarlet`,`Silver`,`Violet`,`White`,`Yellow`]:e===`animal`?[`Ape`,`Bear`,`Bird`,`Boar`,`Cat`,`Cow`,`Deer`,`Dog`,`Fox`,`Goat`,`Horse`,`Lion`,`Pig`,`Rat`,`Raven`,`Sheep`,`Spider`,`Tiger`,`Viper`,`Wolf`,`Worm`,`Wyrm`]:[`Blind`,`Bloody`,`Brutal`,`Burning`,`Deadly`,`Fatal`,`Furious`,`Great`,`Grim`,`Horrible`,`Invisible`,`Lethal`,`Loud`,`Mortal`,`Savage`,`Severe`,`Silent`,`Unknown`,`Venomous`,`Vicious`])}addDisaster(e){let{cells:t,burgs:n}=pack,r=L(n.filter(t=>!e[t.cell]&&t.i&&!t.removed));if(!r)return;e[r.cell]=1;let i=[],a=[],o=V(5,25),s=new ne;for(s.push({e:r.cell,p:0},0);s.length;){let n=s.pop();(t.burg[n.e]||t.pop[n.e])&&i.push(n.e),e[n.e]=1,t.c[n.e].forEach(e=>{let t=V(1,10),r=n.p+t;r>o||(!a[e]||r<a[e])&&(a[e]=r,s.push({e,p:r},r))})}let c=H({Drought:3,Earthquake:3,Tornadoes:1,Wildfires:1,Storms:1,Blight:1}),l=`${z(r.name)} ${c}`,u={Drought:`No rain has fallen around ${r.name} for months. Wells run dry and the crops wither in the fields.`,Earthquake:`An earthquake has struck ${r.name} and the land around, toppling houses and blocking roads.`,Tornadoes:`Tornadoes have torn through the land around ${r.name}, leaving a trail of wrecked farms.`,Wildfires:`Wildfires burn around ${r.name}, and smoke hangs over the burnt fields and woods.`,Storms:`Storms batter ${r.name} and the land around, flattening crops and tearing off roofs.`,Blight:`A blight rots the crops around ${r.name}, and the harvest is lost.`}[c];pack.zones.push({i:pack.zones.length,name:l,note:u,type:`Disaster`,cells:i,color:`url(#hatch5)`})}addEruption(e){let{cells:t,markers:n}=pack,r=n.find(t=>t.type===`volcanoes`&&!e[t.cell]);if(!r)return;e[r.cell]=1,r.note&&=r.note.replace(`Active volcano`,`Erupting volcano`);let i=r.name?`${r.name.replace(` Volcano`,``)} Eruption`:`Volcano Eruption`,a=[],o=[r.cell],s=V(10,30);for(;o.length;){let n=R(.5)?o.shift():o.pop();if(a.push(n),a.length>=s)break;t.c[n].forEach(n=>{e[n]||t.h[n]<20||(e[n]=1,o.push(n))})}pack.zones.push({i:pack.zones.length,name:i,note:`${r.name||`The volcano`} is erupting. Ash and lava cover the land around it, and people flee its slopes.`,type:`Eruption`,cells:a,color:`url(#hatch7)`})}addAvalanche(e){let{cells:t}=pack,n=t.i.filter(n=>!e[n]&&S.isConnected(n)&&t.h[n]>=70);if(!n.length)return;let r=L(n);e[r]=1;let i=[],a=[r],o=V(3,15);for(;a.length;){let n=R(.3)?a.shift():a.pop();if(i.push(n),i.length>=o)break;t.c[n].forEach(n=>{e[n]||t.h[n]<65||(e[n]=1,a.push(n))})}let s=`${z(B.getCultureShort(t.culture[r]))} Avalanche`;pack.zones.push({i:pack.zones.length,name:s,note:`Avalanches have buried the mountain road here. The pass is closed until the snow is cleared.`,type:`Avalanche`,cells:i,color:`url(#hatch5)`})}addFault(e){let t=pack.cells,n=t.i.filter(n=>!e[n]&&t.h[n]>50&&t.h[n]<70);if(!n.length)return;let r=L(n);e[r]=1;let i=[],a=[r],o=V(3,15);for(;a.length;){let n=a.pop();if(t.h[n]>=20&&i.push(n),i.length>=o)break;t.c[n].forEach(n=>{e[n]||t.r[n]||(e[n]=1,a.push(n))})}let s=`${z(B.getCultureShort(t.culture[r]))} Fault`;pack.zones.push({i:pack.zones.length,name:s,note:`A fault line where the ground cracks and shakes with frequent tremors. Few dare to build here.`,type:`Fault`,cells:i,color:`url(#hatch2)`})}addFlood(e){let t=pack.cells,n=Vt(t.fl.filter(Boolean))??0,r=e=>t.r[e]&&t.fl[e]>=n,i=t.i.filter(n=>!e[n]&&t.h[n]<50&&t.burg[n]&&r(n)),a=Hr(i,i.map(e=>t.fl[e]));if(a===void 0)return;e[a]=1;let o=t.r[a],s=[],c=[a],l=V(5,30);for(;c.length&&s.length<l;){let n=c.shift();if(s.push(n),r(n))for(let i of t.c[n])e[i]||t.h[i]<20||t.h[i]>=50||!r(i)&&t.h[i]>t.h[n]+3||(e[i]=1,c.push(i))}let u=pack.burgs[t.burg[a]].name,d=`${z(u)} Flood`,f=pack.rivers.find(e=>e.i===o);pack.zones.push({i:pack.zones.length,name:d,note:`The ${f?`${f.name} ${f.type.toLowerCase()}`:`river`} has burst its banks at ${u}, flooding the streets and the fields along it.`,type:`Flood`,cells:s,color:`url(#hatch13)`})}addTsunami(e){let{cells:t,features:n}=pack,r=t.i.filter(r=>!e[r]&&t.t[r]===-1&&n[t.f[r]].type!==`lake`);if(!r.length)return;let i=L(r);e[i]=1;let a=[],o=[i],s=V(10,30);for(;o.length;){let n=o.shift();if(t.t[n]===1&&a.push(n),a.length>=s)break;t.c[n].forEach(n=>{e[n]||t.t[n]>2||pack.features[t.f[n]].type!==`lake`&&(e[n]=1,o.push(n))})}let c=`${z(B.getCultureShort(t.culture[i]))} Tsunami`;pack.zones.push({i:pack.zones.length,name:c,note:`A great wave from the sea has struck this coast, wrecking harbors and drowning the villages along the shore.`,type:`Tsunami`,cells:a,color:`url(#hatch13)`})}};function Wr(e){let t=2166136261;for(let n=0;n<e.length;n++)t=Math.imul(t^e.charCodeAt(n),16777619);return 15+(t>>>0)%28}var Gr=new class{cells;developmentByName=null;getRandomShield(){let e=H(_.shields.types);return H(_.shields[e])}getDefaultDevelopment(e){if(!this.developmentByName){this.developmentByName=new Map;for(let e of Object.keys(n))if(e!==`english`&&e!==`random`)for(let t of this.getDefault(0,e))t.development!==void 0&&this.developmentByName.set(t.name,t.development)}return this.developmentByName.get(e)}getDefault(e=0,t=options.map.cultures.set){let n=pack.cells,r=n.s,i=n.t,a=n.h,o=0,s=e=>(o||=jt(r),Math.ceil(r[e]/o*3)),c=(e,t)=>{let r=Math.abs(grid.cells.temp[n.g[e]]-t);return r?r+1:1},l=(e,t,r=4)=>t.includes(n.biome[e])?1:r,u=(e,t=4)=>n.haven[e]&&pack.features[n.f[n.haven[e]]].type!==`lake`?1:t;if(t===`european`)return[{name:`Shwazen`,development:36,base:0,odd:1,sort:e=>s(e)/c(e,10)/l(e,[6,8]),shield:`swiss`},{name:`Angshire`,development:36,base:1,odd:1,sort:e=>s(e)/c(e,10)/u(e),shield:`wedged`},{name:`Luari`,development:40,base:2,odd:1,sort:e=>s(e)/c(e,12)/l(e,[6,8]),shield:`french`},{name:`Tallian`,development:42,base:3,odd:1,sort:e=>s(e)/c(e,15),shield:`horsehead`},{name:`Astellian`,development:36,base:4,odd:1,sort:e=>s(e)/c(e,16),shield:`spanish`},{name:`Slovan`,development:32,base:5,odd:1,sort:e=>s(e)/c(e,6)*i[e],shield:`polish`},{name:`Norse`,development:30,base:6,odd:1,sort:e=>s(e)/c(e,5),shield:`heater`},{name:`Elladan`,development:36,base:7,odd:1,sort:e=>s(e)/c(e,18)*a[e],shield:`boeotian`},{name:`Romian`,development:36,base:8,odd:.2,sort:e=>s(e)/c(e,15)/i[e],shield:`roman`},{name:`Soumi`,development:28,base:9,odd:1,sort:e=>s(e)/c(e,5)/l(e,[9])*i[e],shield:`pavise`},{name:`Portuzian`,development:36,base:13,odd:1,sort:e=>s(e)/c(e,17)/u(e),shield:`renaissance`},{name:`Vengrian`,development:33,base:15,odd:1,sort:e=>s(e)/c(e,11)/l(e,[4])*i[e],shield:`horsehead2`},{name:`Turchian`,development:35,base:16,odd:.05,sort:e=>s(e)/c(e,14),shield:`round`},{name:`Euskati`,development:30,base:20,odd:.05,sort:e=>s(e)/c(e,15)*a[e],shield:`oldFrench`},{name:`Keltan`,development:30,base:22,odd:.05,sort:e=>s(e)/c(e,11)/l(e,[6,8])*i[e],shield:`oval`}];if(t===`oriental`)return[{name:`Koryo`,development:36,base:10,odd:1,sort:e=>s(e)/c(e,12)/i[e],shield:`round`},{name:`Hantzu`,development:42,base:11,odd:1,sort:e=>s(e)/c(e,13),shield:`banner`},{name:`Yamoto`,development:35,base:12,odd:1,sort:e=>s(e)/c(e,15)/i[e],shield:`round`},{name:`Turchian`,development:35,base:16,odd:1,sort:e=>s(e)/c(e,12),shield:`round`},{name:`Amazi`,development:28,base:17,odd:.2,sort:e=>s(e)/c(e,19)/l(e,[1,2,3],7)*i[e],shield:`oval`},{name:`Eurabic`,development:40,base:18,odd:1,sort:e=>s(e)/c(e,26)/l(e,[1,2],7)*i[e],shield:`oval`},{name:`Efratic`,development:35,base:23,odd:.1,sort:e=>s(e)/c(e,22)*i[e],shield:`round`},{name:`Tehrani`,development:38,base:24,odd:1,sort:e=>s(e)/c(e,18)*a[e],shield:`round`},{name:`Maui`,development:12,base:25,odd:.2,sort:e=>s(e)/c(e,24)/u(e)/i[e],shield:`vesicaPiscis`},{name:`Carnatic`,development:33,base:26,odd:.5,sort:e=>s(e)/c(e,26),shield:`round`},{name:`Vietic`,development:32,base:29,odd:.8,sort:e=>s(e)/c(e,25)/l(e,[7],7)/i[e],shield:`banner`},{name:`Guantzu`,development:38,base:30,odd:.5,sort:e=>s(e)/c(e,17),shield:`banner`},{name:`Ulus`,development:26,base:31,odd:1,sort:e=>s(e)/c(e,5)/l(e,[2,4,10],7)*i[e],shield:`banner`}];if(t===`english`){let e=()=>B.getBase(1,5,9,``);return[{name:e(),development:36,base:1,odd:1,shield:`heater`},{name:e(),development:36,base:1,odd:1,shield:`wedged`},{name:e(),development:36,base:1,odd:1,shield:`swiss`},{name:e(),development:36,base:1,odd:1,shield:`oldFrench`},{name:e(),development:36,base:1,odd:1,shield:`swiss`},{name:e(),development:36,base:1,odd:1,shield:`spanish`},{name:e(),development:36,base:1,odd:1,shield:`hessen`},{name:e(),development:36,base:1,odd:1,shield:`fantasy5`},{name:e(),development:36,base:1,odd:1,shield:`fantasy4`},{name:e(),development:36,base:1,odd:1,shield:`fantasy1`}]}return t===`antique`?[{name:`Roman`,development:24,base:8,odd:1,sort:e=>s(e)/c(e,14)/i[e],shield:`roman`},{name:`Roman`,development:24,base:8,odd:1,sort:e=>s(e)/c(e,15)/u(e),shield:`roman`},{name:`Roman`,development:24,base:8,odd:1,sort:e=>s(e)/c(e,16)/u(e),shield:`roman`},{name:`Roman`,development:24,base:8,odd:1,sort:e=>s(e)/c(e,17)/i[e],shield:`roman`},{name:`Hellenic`,development:23,base:7,odd:1,sort:e=>s(e)/c(e,18)/u(e)*a[e],shield:`boeotian`},{name:`Hellenic`,development:23,base:7,odd:1,sort:e=>s(e)/c(e,19)/u(e)*a[e],shield:`boeotian`},{name:`Macedonian`,development:21,base:7,odd:.5,sort:e=>s(e)/c(e,12)*a[e],shield:`round`},{name:`Celtic`,development:18,base:22,odd:1,sort:e=>s(e)/c(e,11)**.5/l(e,[6,8]),shield:`round`},{name:`Germanic`,development:16,base:0,odd:1,sort:e=>s(e)/c(e,10)**.5/l(e,[6,8]),shield:`round`},{name:`Persian`,development:21,base:24,odd:.8,sort:e=>s(e)/c(e,18)*a[e],shield:`oval`},{name:`Scythian`,development:15,base:24,odd:.5,sort:e=>s(e)/c(e,11)**.5/l(e,[4]),shield:`round`},{name:`Cantabrian`,development:16,base:20,odd:.5,sort:e=>s(e)/c(e,16)*a[e],shield:`oval`},{name:`Estian`,development:12,base:9,odd:.2,sort:e=>s(e)/c(e,5)*i[e],shield:`pavise`},{name:`Carthaginian`,development:21,base:42,odd:.3,sort:e=>s(e)/c(e,20)/u(e),shield:`oval`},{name:`Hebrew`,development:19,base:42,odd:.2,sort:e=>s(e)/c(e,19)*u(e),shield:`oval`},{name:`Mesopotamian`,development:19,base:23,odd:.2,sort:e=>s(e)/c(e,22)/l(e,[1,2,3]),shield:`oval`}]:t===`highFantasy`?[{name:`Quenian`,development:44,ancestry:`Elfish`,base:33,odd:1,sort:e=>s(e)/l(e,[6,7,8,9],10)*i[e],shield:`gondor`},{name:`Eldar`,development:46,ancestry:`Elfish`,base:33,odd:1,sort:e=>s(e)/l(e,[6,7,8,9],10)*i[e],shield:`noldor`},{name:`Trow`,development:36,ancestry:`Dark Elfish`,base:34,odd:.9,sort:e=>s(e)/l(e,[7,8,9,12],10)*i[e],shield:`hessen`},{name:`Lothian`,development:36,ancestry:`Dark Elfish`,base:34,odd:.3,sort:e=>s(e)/l(e,[7,8,9,12],10)*i[e],shield:`wedged`},{name:`Dunirr`,development:50,ancestry:`Dwarven`,base:35,odd:1,sort:e=>s(e)+a[e],shield:`ironHills`},{name:`Khazadur`,development:53,ancestry:`Dwarven`,base:35,odd:1,sort:e=>s(e)+a[e],shield:`erebor`},{name:`Kobold`,development:18,ancestry:`Goblin`,base:36,odd:1,sort:e=>i[e]-r[e],shield:`moriaOrc`},{name:`Uruk`,development:18,ancestry:`Orkish`,base:37,odd:1,sort:e=>a[e]*i[e],shield:`urukHai`},{name:`Ugluk`,development:15,ancestry:`Orkish`,base:37,odd:.5,sort:e=>a[e]*i[e]/l(e,[1,2,10,11]),shield:`moriaOrc`},{name:`Yotunn`,development:8,ancestry:`Giants`,base:38,odd:.7,sort:e=>c(e,-10),shield:`pavise`},{name:`Rake`,development:28,ancestry:`Drakonic`,base:39,odd:.7,sort:e=>-r[e],shield:`fantasy2`},{name:`Arago`,development:12,ancestry:`Arachnid`,base:40,odd:.7,sort:e=>i[e]-r[e],shield:`horsehead2`},{name:`Aj'Snaga`,development:22,ancestry:`Serpents`,base:41,odd:.7,sort:e=>s(e)/l(e,[12],10),shield:`fantasy1`},{name:`Anor`,development:36,ancestry:`Human`,base:32,odd:1,sort:e=>s(e)/c(e,10),shield:`fantasy5`},{name:`Dail`,development:32,ancestry:`Human`,base:32,odd:1,sort:e=>s(e)/c(e,13),shield:`roman`},{name:`Rohand`,development:30,ancestry:`Human`,base:16,odd:1,sort:e=>s(e)/c(e,16),shield:`round`},{name:`Dulandir`,development:34,ancestry:`Human`,base:31,odd:1,sort:e=>s(e)/c(e,5)/l(e,[2,4,10],7)*i[e],shield:`easterling`}]:t===`darkFantasy`?[{name:`Angshire`,development:36,base:1,odd:1,sort:e=>s(e)/c(e,10)/u(e),shield:`heater`},{name:`Enlandic`,development:35,base:1,odd:1,sort:e=>s(e)/c(e,12),shield:`heater`},{name:`Westen`,development:35,base:1,odd:1,sort:e=>s(e)/c(e,10),shield:`heater`},{name:`Nortumbic`,development:33,base:1,odd:1,sort:e=>s(e)/c(e,7),shield:`heater`},{name:`Mercian`,development:35,base:1,odd:1,sort:e=>s(e)/c(e,9),shield:`heater`},{name:`Kentian`,development:35,base:1,odd:1,sort:e=>s(e)/c(e,12),shield:`heater`},{name:`Norse`,development:30,base:6,odd:.7,sort:e=>s(e)/c(e,5)/u(e),shield:`oldFrench`},{name:`Schwarzen`,development:36,base:0,odd:.3,sort:e=>s(e)/c(e,10)/l(e,[6,8]),shield:`gonfalon`},{name:`Luarian`,development:40,base:2,odd:.3,sort:e=>s(e)/c(e,12)/l(e,[6,8]),shield:`oldFrench`},{name:`Hetallian`,development:42,base:3,odd:.3,sort:e=>s(e)/c(e,15),shield:`oval`},{name:`Astellian`,development:36,base:4,odd:.3,sort:e=>s(e)/c(e,16),shield:`spanish`},{name:`Kiswaili`,development:28,base:28,odd:.05,sort:e=>s(e)/c(e,29)/l(e,[1,3,5,7]),shield:`vesicaPiscis`},{name:`Yoruba`,development:27,base:21,odd:.05,sort:e=>s(e)/c(e,15)/l(e,[5,7]),shield:`vesicaPiscis`},{name:`Koryo`,development:36,base:10,odd:.05,sort:e=>s(e)/c(e,12)/i[e],shield:`round`},{name:`Hantzu`,development:42,base:11,odd:.05,sort:e=>s(e)/c(e,13),shield:`banner`},{name:`Yamoto`,development:35,base:12,odd:.05,sort:e=>s(e)/c(e,15)/i[e],shield:`round`},{name:`Guantzu`,development:38,base:30,odd:.05,sort:e=>s(e)/c(e,17),shield:`banner`},{name:`Ulus`,development:26,base:31,odd:.05,sort:e=>s(e)/c(e,5)/l(e,[2,4,10],7)*i[e],shield:`banner`},{name:`Turan`,development:30,base:16,odd:.05,sort:e=>s(e)/c(e,12),shield:`round`},{name:`Amazi`,development:28,base:17,odd:.05,sort:e=>s(e)/c(e,19)/l(e,[1,2,3],7)*i[e],shield:`round`},{name:`Eurabic`,development:40,base:18,odd:.05,sort:e=>s(e)/c(e,26)/l(e,[1,2],7)*i[e],shield:`round`},{name:`Slovan`,development:32,base:5,odd:.05,sort:e=>s(e)/c(e,6)*i[e],shield:`round`},{name:`Keltan`,development:30,base:22,odd:.1,sort:e=>s(e)/c(e,11)**.5/l(e,[6,8]),shield:`vesicaPiscis`},{name:`Elladan`,development:36,base:7,odd:.2,sort:e=>s(e)/c(e,18)/u(e)*a[e],shield:`boeotian`},{name:`Romian`,development:36,base:8,odd:.2,sort:e=>s(e)/c(e,14)/i[e],shield:`roman`},{name:`Eldar`,development:46,ancestry:`Elfish`,base:33,odd:.5,sort:e=>s(e)/l(e,[6,7,8,9],10)*i[e],shield:`fantasy5`},{name:`Trow`,development:36,ancestry:`Dark Elfish`,base:34,odd:.8,sort:e=>s(e)/l(e,[7,8,9,12],10)*i[e],shield:`hessen`},{name:`Durinn`,development:53,ancestry:`Dwarven`,base:35,odd:.8,sort:e=>s(e)+a[e],shield:`erebor`},{name:`Kobblin`,development:18,ancestry:`Goblin`,base:36,odd:.8,sort:e=>i[e]-r[e],shield:`moriaOrc`},{name:`Uruk`,development:18,ancestry:`Orkish`,base:37,odd:.8,sort:e=>a[e]*i[e]/l(e,[1,2,10,11]),shield:`urukHai`},{name:`Yotunn`,development:8,ancestry:`Giants`,base:38,odd:.8,sort:e=>c(e,-10),shield:`pavise`},{name:`Drake`,development:28,ancestry:`Drakonic`,base:39,odd:.9,sort:e=>-r[e],shield:`fantasy2`},{name:`Rakhnid`,development:12,ancestry:`Arachnid`,base:40,odd:.9,sort:e=>i[e]-r[e],shield:`horsehead2`},{name:`Aj'Snaga`,development:22,ancestry:`Serpents`,base:41,odd:.9,sort:e=>s(e)/l(e,[12],10),shield:`fantasy1`}]:t===`random`?Pn(e).map(()=>{let e=V(B.nameBases.length-1),t=B.getBaseShort(e);return{name:t,development:Wr(t),base:e,odd:1,shield:this.getRandomShield()}}):[{name:`Shwazen`,development:36,base:0,odd:.7,sort:e=>s(e)/c(e,10)/l(e,[6,8]),shield:`hessen`},{name:`Angshire`,development:36,base:1,odd:1,sort:e=>s(e)/c(e,10)/u(e),shield:`heater`},{name:`Luari`,development:40,base:2,odd:.6,sort:e=>s(e)/c(e,12)/l(e,[6,8]),shield:`oldFrench`},{name:`Tallian`,development:42,base:3,odd:.6,sort:e=>s(e)/c(e,15),shield:`horsehead2`},{name:`Astellian`,development:36,base:4,odd:.6,sort:e=>s(e)/c(e,16),shield:`spanish`},{name:`Slovan`,development:32,base:5,odd:.7,sort:e=>s(e)/c(e,6)*i[e],shield:`round`},{name:`Norse`,development:30,base:6,odd:.7,sort:e=>s(e)/c(e,5),shield:`heater`},{name:`Elladan`,development:36,base:7,odd:.7,sort:e=>s(e)/c(e,18)*a[e],shield:`boeotian`},{name:`Romian`,development:36,base:8,odd:.7,sort:e=>s(e)/c(e,15),shield:`roman`},{name:`Soumi`,development:28,base:9,odd:.3,sort:e=>s(e)/c(e,5)/l(e,[9])*i[e],shield:`pavise`},{name:`Koryo`,development:36,base:10,odd:.1,sort:e=>s(e)/c(e,12)/i[e],shield:`round`},{name:`Hantzu`,development:42,base:11,odd:.1,sort:e=>s(e)/c(e,13),shield:`banner`},{name:`Yamoto`,development:35,base:12,odd:.1,sort:e=>s(e)/c(e,15)/i[e],shield:`round`},{name:`Portuzian`,development:36,base:13,odd:.4,sort:e=>s(e)/c(e,17)/u(e),shield:`spanish`},{name:`Nawatli`,development:18,base:14,odd:.1,sort:e=>a[e]/c(e,18)/l(e,[7]),shield:`square`},{name:`Vengrian`,development:33,base:15,odd:.2,sort:e=>s(e)/c(e,11)/l(e,[4])*i[e],shield:`wedged`},{name:`Turchian`,development:35,base:16,odd:.2,sort:e=>s(e)/c(e,13),shield:`round`},{name:`Amazi`,development:28,base:17,odd:.1,sort:e=>s(e)/c(e,19)/l(e,[1,2,3],7)*i[e],shield:`round`},{name:`Eurabic`,development:40,base:18,odd:.2,sort:e=>s(e)/c(e,26)/l(e,[1,2],7)*i[e],shield:`round`},{name:`Inuk`,development:6,base:19,odd:.05,sort:e=>c(e,-1)/l(e,[10,11])/u(e),shield:`square`},{name:`Euskati`,development:30,base:20,odd:.05,sort:e=>s(e)/c(e,15)*a[e],shield:`spanish`},{name:`Yoruba`,development:27,base:21,odd:.05,sort:e=>s(e)/c(e,15)/l(e,[5,7]),shield:`vesicaPiscis`},{name:`Keltan`,development:30,base:22,odd:.05,sort:e=>s(e)/c(e,11)/l(e,[6,8])*i[e],shield:`vesicaPiscis`},{name:`Efratic`,development:35,base:23,odd:.05,sort:e=>s(e)/c(e,22)*i[e],shield:`diamond`},{name:`Tehrani`,development:38,base:24,odd:.1,sort:e=>s(e)/c(e,18)*a[e],shield:`round`},{name:`Maui`,development:12,base:25,odd:.05,sort:e=>s(e)/c(e,24)/u(e)/i[e],shield:`round`},{name:`Carnatic`,development:33,base:26,odd:.05,sort:e=>s(e)/c(e,26),shield:`round`},{name:`Inqan`,development:20,base:27,odd:.05,sort:e=>a[e]/c(e,13),shield:`square`},{name:`Kiswaili`,development:28,base:28,odd:.1,sort:e=>s(e)/c(e,29)/l(e,[1,3,5,7]),shield:`vesicaPiscis`},{name:`Vietic`,development:32,base:29,odd:.1,sort:e=>s(e)/c(e,25)/l(e,[7],7)/i[e],shield:`banner`},{name:`Guantzu`,development:38,base:30,odd:.1,sort:e=>s(e)/c(e,17),shield:`banner`},{name:`Ulus`,development:26,base:31,odd:.1,sort:e=>s(e)/c(e,5)/l(e,[2,4,10],7)*i[e],shield:`banner`},{name:`Levent`,development:35,base:42,odd:.2,sort:e=>s(e)/c(e,18)*u(e),shield:`oval`}]}generate(){options.map.cultures.set=options.generation.cultures.set,this.cells=pack.cells;let e=new Uint16Array(this.cells.i.length),t=options.generation.cultures.limit,r=n[options.map.cultures.set]?.max??0,i=Math.min(t,r),a=this.cells.i.filter(e=>this.cells.s[e]);if(a.length<i*25){if(i=Math.floor(a.length/50),i)D.warn(`Not enough populated cells (${a.length}). Will generate only ${i} cultures`),F.message({message:[w(`There are only {{populated}} populated cells and it's insufficient livable area.`,{populated:a.length}),w(`Cultures to generate: {{cultures}}, requested: {{limit}}`,{cultures:i,limit:options.generation.cultures.limit}),w(`Please consider changing climate settings in the World Configurator`)].join(`<br>`),title:w(`Extreme climate warning`)});else{D.warn(`There are no populated cells. Cannot generate cultures`),pack.cultures=[{name:`Wildlands`,i:0,base:1,shield:`round`,type:pe,tags:[]}],this.cells.culture=e,F.message({message:`${w(`The climate is harsh and people cannot live in this world.`)}<br>${w(`No cultures, states and burgs will be created.`)}<br>${w(`Please consider changing climate settings in the World Configurator`)}`,title:w(`Extreme climate warning`)});return}}let o=(e=>{let t=this.getDefault(e),n=[];if(pack.cultures?.forEach(e=>{e.lock&&!e.removed&&n.push(e)}),!n.length){if(e===t.length)return t;if(t.every(e=>e.odd===1))return t.splice(0,e)}for(let r,i,a=0;n.length<e&&t.length>0;){do i=V(t.length-1),r=t[i],a++;while(a<200&&!R(r.odd));n.push(r),t.splice(i,1)}return n})(i);pack.cultures=o;let s=_t(),c=En(i),l=_.shape,u=[],d=t=>{let n=(options.map.graph.width+options.map.graph.height)/2/i,r=[...a].sort((e,n)=>t(n)-t(e)),o=Math.floor(r.length/2),c=0;for(let t=0;t<100&&(c=r[Pt(0,o,5)],n*=.9,e[c]||s.find(this.cells.p[c][0],this.cells.p[c][1],n));t++);return c},f=e=>{if(this.cells.h[e]<70&&[1,2,4].includes(this.cells.biome[e]))return`Nomadic`;if(this.cells.h[e]>50)return`Highland`;let t=pack.features[this.cells.f[this.cells.haven[e]]];return t.type===`lake`&&t.cells>5?`Lake`:this.cells.harbor[e]&&t.type!==`lake`&&R(.1)||this.cells.harbor[e]===1&&R(.6)||pack.features[this.cells.f[e]].subtype===`isle`&&R(.4)?`Naval`:this.cells.r[e]&&this.cells.fl[e]>100?`River`:this.cells.t[e]>2&&[3,7,8,9,10,12].includes(this.cells.biome[e])?`Hunting`:pe},p=e=>{let t=1;return e===`Lake`?t=.8:e===`Naval`?t=1.5:e===`River`?t=.9:e===`Nomadic`?t=1.5:e===`Hunting`?t=.7:e===`Highland`&&(t=1.2),ke((Math.random()*options.generation.cultures.sizeVariety/2+1)*t,1)};o.forEach((t,n)=>{let r=n+1;if(t.lock){u.push(t.code);let n=t.center===void 0?void 0:this.cells.p[t.center];n&&s.add(n);for(let n of this.cells.i)this.cells.culture[n]===t.i&&(e[n]=r);t.i=r;return}let i=t.sort?t.sort:e=>this.cells.s[e],a=d(i);s.add(this.cells.p[a]),t.center=a,t.i=r,delete t.odd,delete t.sort,t.color=c[n],t.type=f(a),t.expansionism=p(t.type),t.development??=33,t.origins=[0],t.code=zt(t.name,u),u.push(t.code),e[a]=r,l===`random`&&(t.shield=this.getRandomShield()),t.tags=t.tags??[]}),this.cells.culture=e,o.unshift({name:`Wildlands`,i:0,base:1,origins:[null],shield:`round`,type:pe,tags:[]}),B.nameBases.length||(D.error(`Name base is empty, default nameBases will be applied`),B.nameBases=B.getNameBases()),o.forEach(e=>{e.base%=B.nameBases.length})}add(e,t){let n=P.requireCell(e,t);if(pack.cells.h[n]<20)throw Error(`A culture center cannot be placed in the water`);if(pack.cultures.some(e=>e.i&&!e.removed&&e.center===n))throw Error(`Cell ${n} is already a culture center`);let r=this.getDefault(),i,a,o,s,c;pack.cultures.length<r.length?(i=pack.cultures.length,a=r[i].base,o=r[i].name,s=r[i].ancestry,c=r[i].development):(i=V(pack.cultures.length-1),o=B.getCulture(i,5,8,``),a=pack.cultures[i].base,s=pack.cultures[i].ancestry,c=pack.cultures[i].development);let l=zt(o,pack.cultures.map(e=>e.code)),u=pack.cultures.length,d=jn(),f={name:o,color:d,base:a,center:n,i:u,expansionism:1,development:c??33,type:pe,cells:0,area:0,rural:0,urban:0,origins:[pack.cells.culture[n]],code:l,shield:_.shape===`random`?this.getRandomShield():``,tags:[]};return s&&(f.ancestry=s),pack.cultures.push(f),u}expand(){let{cells:e,cultures:t}=pack,n=new ne,r=[],i=options.generation.cultures.growthRate,a=e.i.length*.6*i,o=t.some(e=>!e.removed&&e.lock);if(o)for(let n of e.i)t[e.culture[n]].lock||(e.culture[n]=0);else e.culture=new Uint16Array(e.i.length);for(let e of t)!e.i||e.removed||e.lock||n.push({cellId:e.center,cultureId:e.i,priority:0},0);let s=(n,r,i)=>e.biome[t[n].center]===r?10:i===`Hunting`?pack.biomes[r].cost*5:i===`Nomadic`&&r>4&&r<10?pack.biomes[r].cost*10:pack.biomes[r].cost*2,c=(t,n,r)=>{let i=pack.features[e.f[t]],a=e.area[t];return r===`Lake`&&i.type===`lake`?10:r===`Naval`&&n<20?a*2:r===`Nomadic`&&n<20?a*50:n<20?a*6:r===`Highland`&&n<44?3e3:r===`Highland`&&n<62?200:r===`Highland`?0:n>=67?200:n>=44?30:0},l=(t,n,r)=>r===`River`?t?0:100:t?Ae(e.fl[n]/10,20,100):0,u=(e,t)=>e===1?t===`Naval`||t===`Lake`?0:t===`Nomadic`?60:20:e===2?t===`Naval`||t===`Nomadic`?30:0:e===-1?0:t===`Naval`||t===`Lake`?100:0;for(;n.length;){let{cellId:i,priority:d,cultureId:f}=n.pop(),{type:p,expansionism:m}=t[f],h=e.biome[i];e.c[i].forEach(i=>{if(o){let n=e.culture[i];if(n&&t[n].lock)return}let g=e.biome[i],ee=s(f,g,p),_=h===g?0:20,te=c(i,e.h[i],p),v=l(e.r[i],i,p),ne=u(e.t[i],p),re=(ee+_+te+v+ne)/m,ie=d+re;ie>a||(!r[i]||ie<r[i])&&(e.pop[i]>0&&(e.culture[i]=f),r[i]=ie,n.push({cellId:i,cultureId:f,priority:ie},ie))})}}rename(e,t){let n=pack.cultures[e];if(!n||n.removed)throw Error(`Culture ${e} does not exist`);n.name=y(t),n.code=zt(n.name,pack.cultures.flatMap(e=>e!==n&&e.code?[e.code]:[]))}setAncestry(e,t){let n=this.living(e),r=t.trim();r?n.ancestry=r:delete n.ancestry}recolor(e,t){this.living(e).color=Dn(t)}setType(e,t){this.living(e).type=g(t,he,`The type`)}setBase(e,t){if(!B.nameBases[t])throw Error(`Name base ${t} does not exist`);this.living(e).base=t}setExpansionism(e,t){if(typeof t!=`number`||!(t>=0&&t<=99))throw Error(`The expansionism must be a number from 0 to 99`);this.living(e).expansionism=t}setDevelopment(e,t){if(!Number.isInteger(t)||t<1||t>100)throw Error(`The development must be a whole number from 1 to 100`);this.living(e).development=t}recalculate(){this.expand();for(let e of pack.burgs)e?.i&&!e.removed&&(e.culture=pack.cells.culture[e.cell])}remove(e){let t=this.living(e);if(!e)throw Error(`The wildlands cannot be removed`);let{burgs:n,states:r,religions:i,cells:a,cultures:o}=pack;for(let t of n)t?.i&&t.culture===e&&(t.culture=0);for(let t of r)t.culture===e&&(t.culture=0);for(let t of i)t.culture===e&&(t.culture=0);a.culture.forEach((t,n)=>{t===e&&(a.culture[n]=0)}),t.removed=!0;for(let t of o)t.i&&!t.removed&&t.origins&&(t.origins=t.origins.filter(t=>t!==e),t.origins.length||(t.origins=[0]))}setPopulation(e,t,n){this.living(e);let{cells:r}=pack;x.setArea(x.landCells(t=>r.culture[t]===e),x.burgIds(t=>t.culture===e),t,n)}setLocked(e,t){let n=this.living(e);t?n.lock=!0:delete n.lock}setOrigins(e,t){this.living(e).origins=Se(pack.cultures,e,t)}setCode(e,t){this.living(e).code=se(t)}moveCenter(e,t,n){let r=this.living(e);if(!e)throw Error(`The wildlands have no center`);let i=P.requireCell(t,n);if(pack.cells.h[i]<20)throw Error(`A culture center cannot be placed in the water`);let a=pack.cultures.find(e=>e.i&&!e.removed&&e!==r&&e.center===i);if(a)throw Error(`Cell ${i} is already the center of culture ${a.i}`);r.center=i}setCells(e,t){this.living(e);let{cells:n}=pack;if(!Array.isArray(t)||!t.length)throw Error(`Name at least one cell`);for(let e of t){if(!Number.isInteger(e)||e<0||e>=n.i.length)throw Error(`Cell ${e} does not exist`);if(n.h[e]<20)throw Error(`Cell ${e} is water; cultures hold land only`)}for(let r of t)n.culture[r]=e,n.burg[r]&&(pack.burgs[n.burg[r]].culture=e)}setEmblemShape(e,t){let n=this.living(e),r=Object.keys(_.shields.types).flatMap(e=>Object.keys(_.shields[e]));n.shield=g(t,r,`The shape`);let i=e=>{e&&!(`icon`in e)&&(e.shield=n.shield)};for(let t of pack.states)t.i&&!t.removed&&t.culture===e&&i(t.coa);for(let t of pack.provinces)t.i&&!t.removed&&pack.cells.culture[t.center]===e&&i(t.coa);for(let t of pack.burgs)t?.i&&!t.removed&&t.culture===e&&i(t.coa)}living(e){let t=pack.cultures[e];if(!t||t.removed)throw Error(`Culture ${e} does not exist`);return t}regenerate(){let e=pack.cultures?.filter(e=>e.i&&e.lock&&!e.removed)??[],t=e.map(e=>e.i);this.generate(),this.expand(),W.remapEntityMultipliers(`culture`,new Map([[0,0],...e.map((e,n)=>[t[n],e.i])])),pack.states=pack.states.map(e=>!e.i||e.removed?e:{...e,culture:pack.cells.culture[e.center]}),pack.burgs=pack.burgs.map(e=>!e.i||e.removed?e:{...e,culture:pack.cells.culture[e.cell]}),pack.religions=pack.religions.map(e=>!e.i||e.removed?e:{...e,culture:pack.cells.culture[e.center]})}},Kr=[`Folk`,`Organized`,`Cult`,`Heresy`],qr=[`global`,`state`,`culture`],Jr={Number:1,Being:3,Adjective:5,"Color + Animal":5,"Adjective + Animal":5,"Adjective + Being":5,"Adjective + Genitive":1,"Color + Being":3,"Color + Genitive":3,"Being + of + Genitive":2,"Being + of the + Genitive":1,"Animal + of + Genitive":1,"Adjective + Being + of + Genitive":2,"Adjective + Animal + of + Genitive":2},Yr=[];for(let e in Jr)for(let t=0;t<Jr[e];t++)Yr.push(e);var K={number:[`One`,`Two`,`Three`,`Four`,`Five`,`Six`,`Seven`,`Eight`,`Nine`,`Ten`,`Eleven`,`Twelve`],being:`Ancestor.Ancient.Avatar.Brother.Champion.Chief.Council.Creator.Deity.Divine One.Elder.Enlightened Being.Father.Forebear.Forefather.Giver.God.Goddess.Guardian.Guide.Hierarch.Lady.Lord.Maker.Master.Mother.Numen.Oracle.Overlord.Protector.Reaper.Ruler.Sage.Seer.Sister.Spirit.Supreme Being.Transcendent.Virgin`.split(`.`),animal:`Antelope.Ape.Badger.Basilisk.Bear.Beaver.Bison.Boar.Buffalo.Camel.Cat.Centaur.Cerberus.Chimera.Cobra.Cockatrice.Crane.Crocodile.Crow.Cyclope.Deer.Dog.Direwolf.Drake.Dragon.Eagle.Elephant.Elk.Falcon.Fox.Goat.Goose.Gorgon.Gryphon.Hare.Hawk.Heron.Hippogriff.Horse.Hound.Hyena.Ibis.Jackal.Jaguar.Kitsune.Kraken.Lark.Leopard.Lion.Manticore.Mantis.Marten.Minotaur.Moose.Mule.Narwhal.Owl.Ox.Panther.Pegasus.Phoenix.Python.Rat.Raven.Roc.Rook.Scorpion.Serpent.Shark.Sheep.Snake.Sphinx.Spider.Swan.Tiger.Turtle.Unicorn.Viper.Vulture.Walrus.Wolf.Wolverine.Worm.Wyvern.Yeti`.split(`.`),adjective:`Aggressive.Almighty.Ancient.Beautiful.Benevolent.Big.Blind.Blond.Bloody.Brave.Broken.Brutal.Burning.Calm.Celestial.Cheerful.Crazy.Cruel.Dead.Deadly.Devastating.Distant.Disturbing.Divine.Dying.Eternal.Ethernal.Empyreal.Enigmatic.Enlightened.Evil.Explicit.Fair.Far.Fat.Fatal.Favorable.Flying.Friendly.Frozen.Giant.Good.Grateful.Great.Happy.High.Holy.Honest.Huge.Hungry.Illustrious.Immutable.Ineffable.Infallible.Inherent.Last.Latter.Lost.Loud.Lucky.Mad.Magical.Main.Major.Marine.Mythical.Mystical.Naval.New.Noble.Old.Otherworldly.Patient.Peaceful.Pregnant.Prime.Proud.Pure.Radiant.Resplendent.Sacred.Sacrosanct.Sad.Scary.Secret.Selected.Serene.Severe.Silent.Sleeping.Slumbering.Sovereign.Strong.Sunny.Superior.Supernatural.Sustainable.Transcendent.Transcendental.Troubled.Unearthly.Unfathomable.Unhappy.Unknown.Unseen.Waking.Wild.Wise.Worried.Young`.split(`.`),genitive:`Cold.Day.Death.Doom.Fate.Fire.Fog.Frost.Gates.Heaven.Home.Ice.Justice.Life.Light.Lightning.Love.Nature.Night.Pain.Snow.Springs.Summer.Thunder.Time.Victory.War.Winter`.split(`.`),theGenitive:[`Abyss`,`Blood`,`Dawn`,`Earth`,`East`,`Eclipse`,`Fall`,`Harvest`,`Moon`,`North`,`Peak`,`Rainbow`,`Sea`,`Sky`,`South`,`Stars`,`Storm`,`Sun`,`Tree`,`Underworld`,`West`,`Wild`,`Word`,`World`],color:`Amber.Black.Blue.Bright.Bronze.Brown.Coral.Crimson.Dark.Emerald.Golden.Green.Grey.Indigo.Lavender.Light.Magenta.Maroon.Orange.Pink.Plum.Purple.Red.Ruby.Sapphire.Teal.Turquoise.White.Yellow`.split(`.`)},Xr={Folk:{Shamanism:4,Animism:4,Polytheism:4,"Ancestor Worship":2,"Nature Worship":1,Totemism:1},Organized:{Polytheism:7,Monotheism:7,Dualism:3,Syncretism:2,Pantheism:2,"Non-theism":2,Philosophical:1,Ethical:1,Deism:1,Henotheism:1},Cult:{Cult:5,"Dark Cult":5,Sect:1},Heresy:{Heresy:1}},Zr={Shamanism:{"Culture + type":1},Animism:{"Culture + type":1},Polytheism:{"Random + type":4,"Random + ism":1,"Place + ism":1,"Culture + ism":2,"Place + ian + type":6,"Culture + type":4,"Type + of the + meaning":2},"Ancestor Worship":{"Culture + type":1},"Nature Worship":{"Culture + type":1},Totemism:{"Culture + type":1},Monotheism:{"Random + type":2,"Random + ism":1,"Supreme + ism":6,"Faith of + Supreme":6,"Place + ism":1,"Culture + ism":1,"Place + ian + type":4,"Culture + type":3},Dualism:{"Random + type":3,"Random + ism":1,"Place + ism":1,"Culture + ism":2,"Place + ian + type":5,"Culture + type":4,"Type + of the + meaning":3},Syncretism:{"Random + type":3,"Random + ism":2,"Place + ism":1,"Culture + ism":2,"Place + ian + type":5,"Culture + type":4,"Type + of the + meaning":2},Pantheism:{"Random + type":3,"Random + ism":1,"Place + ism":1,"Culture + ism":2,"Place + ian + type":5,"Culture + type":4,"Type + of the + meaning":2},"Non-theism":{"Random + type":3,"Random + ism":2,"Place + ism":1,"Culture + ism":3,"Place + ian + type":4,"Culture + type":5},Philosophical:{"Random + type":3,"Random + ism":2,"Place + ism":1,"Culture + ism":3,"Place + ian + type":4,"Culture + type":5},Ethical:{"Random + type":3,"Random + ism":2,"Place + ism":1,"Culture + ism":3,"Place + ian + type":4,"Culture + type":5},Deism:{"Random + type":2,"Random + ism":1,"Supreme + ism":3,"Faith of + Supreme":3,"Place + ism":1,"Culture + ism":2,"Place + ian + type":5,"Culture + type":4},Henotheism:{"Random + type":2,"Random + ism":1,"Supreme + ism":2,"Faith of + Supreme":2,"Place + ism":1,"Culture + ism":2,"Place + ian + type":6,"Culture + type":4,"Type + of the + meaning":2},Cult:{"Burg + ian + type":2,"Random + ian + type":1,"Type + of the + meaning":2},"Dark Cult":{"Burg + ian + type":2,"Random + ian + type":1,"Type + of the + meaning":3},Sect:{"Burg + ian + type":2,"Random + ian + type":1,"Type + of the + meaning":2},Heresy:{"Burg + ian + type":3,"Random + ism":3,"Random + ian + type":2,"Type + of the + meaning":1}},Qr={Shamanism:{Beliefs:3,Shamanism:1,Druidism:1,Spirits:1},Animism:{Spirits:3,Beliefs:1},Polytheism:{Pantheon:3,Deities:2,Gods:1},"Ancestor Worship":{Beliefs:1,Forefathers:2,Ancestors:2},"Nature Worship":{Beliefs:3,Druids:1,Spirits:1},Totemism:{Beliefs:2,Totems:2,Idols:1},Monotheism:{Religion:2,Church:3,Faith:1,Creed:1,Commandments:1},Dualism:{Religion:3,Faith:1},Syncretism:{Faith:2,Religion:2,Beliefs:1},Pantheism:{Religion:1,Faith:1},"Non-theism":{Beliefs:3,Spirits:1},Philosophical:{Philosophy:3,Doctrine:2,School:1,Way:1},Ethical:{Ethics:2,Doctrine:2,Path:2,Way:2,Precepts:1},Deism:{Faith:2,Religion:1,Church:1,Creed:1},Henotheism:{Faith:2,Religion:1,Gods:1,Pantheon:1},Cult:{Cult:4,Sect:2,Arcanum:1,Order:1,Worship:1,Mysticism:1},"Dark Cult":{Cult:2,Blasphemy:1,Circle:1,Coven:1,Idols:1,Occultism:1},Sect:{Sect:4,Society:1,Brotherhood:1,Circle:1,Way:1},Heresy:{Heresy:3,Sect:2,Apostates:1,Brotherhood:1,Circle:1,Dissent:1,Dissenters:1,Iconoclasm:1,Schism:1,Society:1}},$r={Folk:()=>0,Organized:()=>Bt(5,3,0,10,1),Cult:()=>Bt(.5,.5,0,5,1),Heresy:()=>Bt(1,.5,0,5,1)};function ei(e){let t=pack.cultures[e]?.ancestry?.trim();return t?new Set(pack.cultures.filter(e=>e.i&&!e.removed&&e.ancestry?.trim()===t).map(e=>e.i)):new Set([e])}var ti=new class{regenerate(){let e=pack.religions?.filter(e=>e.i&&e.lock&&!e.removed)??[];this.generate(),W.remapEntityMultipliers(`religion`,new Map([[0,0],...e.map(e=>[e.i,e.i])]))}generate(){let e=pack.religions?.filter(e=>e.i&&e.lock&&!e.removed)||[],t=this.generateFolkReligions(),n=this.generateOrganizedReligions(options.generation.religions.limit,e),r=this.specifyReligions([...t,...n]),i=this.combineReligions(r,e),a=this.expandReligions(i),o=this.defineOrigins(a,i),s=this.generateHeresies(o,a),c=[...o,...s];for(let e of c)e&&(e.tags=e.tags??[]);this.expandHeresies(c,a,s),pack.religions=c,pack.cells.religion=a,this.checkCenters()}generateFolkReligions(){let e=pack.cultures.filter(e=>e.i&&!e.removed),t=[],n=new Map;for(let r of e){let e=r.ancestry?.trim();if(e){let t=n.get(e);t?t.push(r):n.set(e,[r])}else t.push({type:`Folk`,form:H(Xr.Folk),culture:r.i,center:r.center})}for(let e of n.values()){let n=e[0];t.push({type:`Folk`,form:H(Xr.Folk),culture:n.i,center:n.center})}return t}generateOrganizedReligions(e,t){let n=pack.cells,r=e-t.filter(({type:e})=>e===`Organized`||e===`Cult`).length;if(r<1)return[];let i=u(),a=l(),o=Math.floor(V(1,4)/10*a.length),s=a.length-o,c=e=>e<s?`Organized`:`Cult`;return a.map((e,t)=>{let r=c(t);return{type:r,form:H(Xr[r]),culture:n.culture[e],center:e}});function l(){let a=[],o=_t();for(let{center:e}of t)o.add(n.p[e]);let s=(options.map.graph.width+options.map.graph.height)/2/e;for(let e of i){let[t,i]=n.p[e];if(o.find(t,i,s)===void 0&&(a.push(e),o.add([t,i]),a.length===r))return a}return D.warn(`Placed only ${a.length} of ${r} religions`),a}function u(){let e=pack.burgs.filter(e=>e.i&&!e.removed);return e.length>=r?e.sort((e,t)=>t.population-e.population).map(e=>e.cell):n.i.filter(e=>n.s[e]>2).sort((e,t)=>n.s[t]-n.s[e])}}specifyReligions(e){let{cells:t,cultures:n}=pack;return e.map(({type:e,form:i,culture:a,center:o})=>{let s=this.getDeityName(a),c=i===`Non-theism`||i===`Animism`?null:s??null,l=t.state[o],[u,d]=this.generateReligionName(e,i,s,o);d===`state`&&!l&&(d=`global`);let f=$r[e](),p=r(n[a],e);return{name:u,type:e,form:i,culture:a,center:o,deity:c,expansion:d,expansionism:f,color:p}});function r(e,t){return e.i?t===`Folk`?e.color:t===`Heresy`?kn(e.color,.35,.2):t===`Cult`?kn(e.color,.5,0):kn(e.color,.25,.4):jn()}}combineReligions(e,t){let n=[{name:`No religion`,i:0}],{lockedReligionQueue:r,reservedOriginIds:i,highestReservedIndex:a,codes:o,numberLockedFolk:s}=l(),c=Math.max(a+1,e.length+t.length+i.size+1-s);for(let a=1,s=0;a<c;a=n.length)if(a===r[0]?.i){let e=r.shift();n.push(e)}else if(i.has(a))n.push({i:a,type:`Folk`,culture:0,name:`Removed religion`,removed:!0});else if(s<e.length){let r=e[s];if(s++,r.type===`Folk`&&t.some(({type:e,culture:t})=>{if(e!==`Folk`)return!1;if(t===r.culture)return!0;let n=pack.cultures[r.culture]?.ancestry?.trim(),i=pack.cultures[t]?.ancestry?.trim();return!!(n&&i&&n===i)}))continue;let i=u(r),c=zt(i,o);o.push(c),n.push({...r,i:a,name:i,code:c})}else n.push({i:a,type:`Folk`,culture:0,name:`Removed religion`,removed:!0});return n;function l(){let e=t.map(e=>({...e})).sort((e,t)=>e.i-t.i),n=new Set(t.map(e=>e.i)),r=new Set(t.flatMap(e=>e.origins??[]).filter(e=>e>0&&!n.has(e)));return{lockedReligionQueue:e,reservedOriginIds:r,highestReservedIndex:Math.max(...n,...r,0),codes:t.length>0?t.map(e=>e.code):[],numberLockedFolk:t.filter(({type:e})=>e===`Folk`).length}}function u({name:n,type:r,culture:i}){if(r!==`Folk`)return n;let a=ei(i);return(e.some(({type:e,culture:t,expansion:n})=>a.has(t)&&e===`Organized`&&n===`culture`)||t.some(({type:e,culture:t,expansion:n})=>a.has(t)&&e===`Organized`&&n===`culture`))&&n.slice(0,3)!==`Old`?`Old ${n}`:n}}defineOrigins(e,t){let n={Organized:{clusterSize:100,maxReligions:2},Cult:{clusterSize:50,maxReligions:3}},r=[...t];for(let i of t){let{i:t,type:a,culture:o,expansion:s,center:c}=i;if(t===0){r[t]={...i,origins:null};continue}if(i.lock||a===`Heresy`)continue;if(a===`Folk`){r[t]={...i,origins:[0]};continue}let l=r.find(({culture:e,type:t})=>t===`Folk`&&e===o);if(l&&o&&s===`culture`&&Ft(2)(c)){r[t]={...i,origins:[l.i]};continue}let{clusterSize:u,maxReligions:d}=n[a],f=l?.i||0,p=this.getReligionsInRadius(pack.cells.c,c,e,t,u,d,f,r);r[t]={...i,origins:p}}return r}generateHeresies(e,t){let n=e.filter(e=>e.type===`Organized`&&!e.lock&&!e.removed&&(e.expansionism??0)>=3);if(!n.length)return[];let r=new Set(n.map(e=>e.i)),i=new Map;for(let e of pack.cells.i){let n=t[e];if(!r.has(n)||!pack.cells.c[e].some(e=>t[e]!==n))continue;let a=i.get(n)??[];a.push(e),i.set(n,a)}let a=new Set(e.filter(e=>!e.removed).map(e=>e.center)),o=e.map(e=>e.code),s=[];for(let t of n){let n=(i.get(t.i)??[]).filter(e=>!a.has(e)),r=Bt(0,1,0,3);for(let i=0;i<r&&n.length;i++){let r=V(0,n.length-1),i=n.splice(r,1)[0],c=this.createHeresy(t,i,e.length+s.length,o);a.add(i),o.push(c.code),s.push(c)}}return s}createHeresy(e,t,n,r){let[i,a]=this.generateReligionName(`Heresy`,`Heresy`,e.deity??``,t);return{i:n,name:i,color:kn(e.color,.4,.2),culture:pack.cells.culture[t],type:`Heresy`,form:e.form,deity:e.deity,expansion:a,expansionism:$r.Heresy(),center:t,cells:0,area:0,rural:0,urban:0,origins:[e.i],code:zt(i,r),tags:[]}}getReligionsInRadius(e,t,n,r,i,a,o,s){let c=new Set,l=[t],u={};for(let t=0;l.length&&t<i;t++){let t=l.shift();u[t]=!0;for(let i of e[t]){if(u[i])continue;u[i]=!0;let e=n[i];if(e&&e<r&&!this.wouldCreateOriginCycle(r,e,s)&&c.add(e),c.size>=a)return[...c];l.push(i)}}return c.size?[...c]:this.wouldCreateOriginCycle(r,o,s)?[0]:[o]}wouldCreateOriginCycle(e,t,n){let r=[t],i=new Set;for(;r.length;){let t=r.shift();if(t===e)return!0;t&&!i.has(t)&&(i.add(t),r.push(...(n[t]?.origins??[]).filter(e=>e!==null)))}return!1}expandReligions(e){let{cells:t}=pack,n=this.spreadFolkReligions(e),r=new ne,i=[],a=t.i.length/20*options.generation.cultures.growthRate;e.filter(e=>e.i&&!e.lock&&e.type!==`Folk`&&e.type!==`Heresy`&&!e.removed).forEach(e=>{n[e.center]=e.i,r.push({e:e.center,p:0,r:e.i,s:t.state[e.center]},0),i[e.center]=1});let o=new Map(e.map(e=>[e.i,e]));for(;r.length;){let{e,p:s,r:c,s:l}=r.pop(),{culture:u,expansion:d,expansionism:f}=o.get(c);t.c[e].forEach(p=>{if(d===`culture`&&u!==t.culture[p]||d===`state`&&l!==t.state[p]||o.get(n[p])?.lock)return;let m=u===t.culture[p]?0:10,h=l===t.state[p]?0:10,g=this.getPassageCost(e,p),ee=m+h+g,_=s+10+ee/f;_>a||(!i[p]||_<i[p])&&(t.culture[p]&&(n[p]=c),i[p]=_,r.push({e:p,p:_,r:c,s:l},_))})}return n}expandHeresies(e,t,n){if(!n.length)return;let{cells:r}=pack,i=new ne,a=[],o=r.i.length/20*options.generation.cultures.growthRate,s=new Map(e.map(e=>[e.i,e]));for(let e of n){let n=e.origins?.[0];n&&s.get(n)?.type===`Organized`&&(s.get(t[e.center])?.lock||(t[e.center]=e.i,i.push({e:e.center,p:0,r:e.i,b:n},0),a[e.center]=1))}for(;i.length;){let{e,p:n,r:c,b:l}=i.pop(),u=s.get(c);for(let d of r.c[e]){if(s.get(t[d])?.lock)continue;let f=t[d]===l?0:2e3,p=this.getPassageCost(e,d),m=n+10+(f+p)/Math.max(u.expansionism,.1);m>o||(!a[d]||m<a[d])&&(r.culture[d]&&(t[d]=c),a[d]=m,i.push({e:d,p:m,r:c,b:l},m))}}}normalizeHeresiesForExpansion(e,t){let n=new Map(e.map(e=>[e.i,e])),r=e.filter(e=>e.type===`Organized`&&!e.lock&&!e.removed);return e.filter(e=>e.type===`Heresy`&&!e.lock&&!e.removed).flatMap(i=>{let a=n.get(t[i.center]),o=[...(i.origins??[]).map(e=>n.get(e)),a,...r],s=new Set,c=o.find(t=>!t||s.has(t.i)?!1:(s.add(t.i),t.type===`Organized`&&!t.lock&&!t.removed&&!this.wouldCreateOriginCycle(i.i,t.i,e)));if(!c){i.removed=!0,i.origins=[0],i.cells=0,i.area=0,i.rural=0,i.urban=0;for(let t of e){if(t.lock||!t.origins?.includes(i.i))continue;let e=t.origins.filter(e=>e!==i.i);t.origins=e.length?e:[0]}return[]}return i.origins=[c.i],i.form=c.form,i.deity=c.deity,[i]})}getPassageCost(e,t){let n=S.getRoute(e,t);if(yt(e,pack))return n?50:500;let r=pack.biomes[pack.cells.biome[t]].cost;return n?n.group===`roads`?1:r/3:r}spreadFolkReligions(e){let t=pack.cells,n=t.religion&&!0,r=new Uint16Array(t.i.length),i=e.filter(e=>e.type===`Folk`&&!e.removed),a=new Map;for(let e of i)a.set(e.culture,e.i);for(let e of i){let t=pack.cultures[e.culture]?.ancestry?.trim();if(t)for(let n of pack.cultures)n.i&&!n.removed&&n.ancestry?.trim()===t&&(a.has(n.i)||a.set(n.i,e.i))}for(let i of t.i){let o=n&&t.religion[i]||0;if(o&&e[o]?.lock&&!e[o]?.removed){r[i]=o;continue}let s=t.culture[i];r[i]=a.get(s)||0}return r}checkCenters(){let e=pack.cells;pack.religions.forEach(t=>{if(!t.i||e.religion[t.center]===t.i)return;let n=e.i.find(n=>e.religion[n]===t.i),r=pack.cultures[t.culture]?.center;n?t.center=n:t.type===`Folk`&&r&&(t.center=r)})}recalculate(){let e=this.expandReligions(pack.religions),t=this.normalizeHeresiesForExpansion(pack.religions,e);this.expandHeresies(pack.religions,e,t),pack.cells.religion=e,this.checkCenters()}rename(e,t){let n=pack.religions[e];if(!n||n.removed)throw Error(`Religion ${e} does not exist`);n.name=y(t),n.code=zt(n.name,pack.religions.flatMap(e=>e!==n&&e.code?[e.code]:[]))}recolor(e,t){this.living(e).color=Dn(t)}setDeity(e,t){this.living(e).deity=String(t??``).trim()||null}setType(e,t){this.living(e).type=g(t,Kr,`The type`)}setForm(e,t){this.living(e).form=y(t)}setExpansion(e,t){this.living(e).expansion=g(t,qr,`The expansion`)}setExpansionism(e,t){if(typeof t!=`number`||!(t>=0&&t<=99))throw Error(`The expansionism must be a number from 0 to 99`);this.living(e).expansionism=t}remove(e){let t=this.living(e);if(!e)throw Error(`No religion cannot be removed`);pack.cells.religion.forEach((t,n)=>{t===e&&(pack.cells.religion[n]=0)}),t.removed=!0;for(let t of pack.religions)t.i&&!t.removed&&t.origins&&(t.origins=t.origins.filter(t=>t!==e),t.origins.length||(t.origins=[0]))}setPopulation(e,t,n){this.living(e);let{cells:r}=pack;x.setArea(x.landCells(t=>r.religion[t]===e),x.burgIds(t=>r.religion[t.cell]===e),t,n)}setLocked(e,t){let n=this.living(e);t?n.lock=!0:delete n.lock}setOrigins(e,t){this.living(e).origins=Se(pack.religions,e,t)}setCode(e,t){this.living(e).code=se(t)}moveCenter(e,t,n){let r=this.living(e);if(!e)throw Error(`Lands without religion have no center`);let i=P.requireCell(t,n);if(pack.cells.h[i]<20)throw Error(`A religion center cannot be placed in the water`);let a=pack.religions.find(e=>e.i&&!e.removed&&e!==r&&e.center===i);if(a)throw Error(`Cell ${i} is already the center of religion ${a.i}`);r.center=i}setCells(e,t){this.living(e);let{cells:n}=pack;if(!Array.isArray(t)||!t.length)throw Error(`Name at least one cell`);for(let e of t){if(!Number.isInteger(e)||e<0||e>=n.i.length)throw Error(`Cell ${e} does not exist`);if(n.h[e]<20)throw Error(`Cell ${e} is water; religions hold land only`)}for(let r of t)n.religion[r]=e}living(e){let t=pack.religions[e];if(!t||t.removed)throw Error(`Religion ${e} does not exist`);return t}add(e,t){let{cells:n,cultures:r,religions:i}=pack,a=P.requireCell(e,t);if(n.h[a]<20)throw Error(`A religion center cannot be placed in the water`);if(i.some(e=>e.i&&!e.removed&&e.center===a))throw Error(`Cell ${a} is already a religion center`);let o=n.religion[a],s=i.length,c=n.culture[a],l=ei(c),u=c!==0&&!i.some(({type:e,culture:t,removed:n})=>e===`Folk`&&l.has(t)&&!n),d=i[o],f=u?`Folk`:i[o].type===`Organized`?H({Organized:4,Cult:1,Heresy:2}):H({Organized:5,Cult:2}),p=i.map(e=>e.code);if(f===`Heresy`)return i.push(this.createHeresy(d,a,s,p)),n.religion[a]=s,s;let m=u?r[c].color:kn(d.color,.3,0),h=H(Xr[f]),g=h===`Non-theism`||h===`Animism`?null:this.getDeityName(c)??null,[ee,_]=this.generateReligionName(f,h,g??``,a),te=zt(ee,p),v=this.getReligionsInRadius(n.c,a,n.religion,s,25,3,0,i),ne=f===`Folk`?[0]:v;return i.push({i:s,name:ee,color:m,culture:c,type:f,form:h,deity:g,expansion:_,expansionism:$r[f](),center:a,cells:0,area:0,rural:0,urban:0,origins:ne,code:te,tags:[]}),n.religion[a]=s,s}getDeityName(e){if(e===void 0){D.error(`Please define a culture`);return}let t=this.generateMeaning();return`${B.getCulture(e)}, The ${t}`}generateReligionName(e,t,n,r){let{cells:i,cultures:a,burgs:o,states:s}=pack,c=()=>B.getCulture(i.culture[r]),l=H(Qr[t]),u=n.split(/[ ,]+/)[0],d=a[i.culture[r]],f=d?.ancestry?.trim(),p=e===`Folk`&&f||d?.name,m=e=>{let t=i.burg[r],n=i.state[r],a=t?o[t].name:s[n].name,c=Nt(a.split(/[ ,]+/)[0]);return e?z(c):c},h=H(Zr[t]||Zr[e]);return e===`Folk`&&f?h===`Culture + ism`?[`${Nt(f)}ism`,`culture`]:[`${f} ${l}`,`culture`]:h===`Random + type`?[`${c()} ${l}`,`global`]:h===`Random + ism`?[`${Nt(c())}ism`,`global`]:h===`Supreme + ism`&&n?[`${Nt(u)}ism`,`global`]:h===`Faith of + Supreme`&&n?[`${L([`Faith`,`Way`,`Path`,`Word`,`Witnesses`])} of ${u}`,`global`]:h===`Place + ism`?[`${m()}ism`,`state`]:h===`Culture + ism`?[`${Nt(p)}ism`,`culture`]:h===`Place + ian + type`?[`${m(!0)} ${l}`,`state`]:h===`Culture + type`?[`${p} ${l}`,`culture`]:h===`Burg + ian + type`?[`${m(!0)} ${l}`,`global`]:h===`Random + ian + type`?[`${z(c())} ${l}`,`global`]:h===`Type + of the + meaning`?[`${l} of the ${this.generateMeaning()}`,`global`]:[`${Nt(c())}ism`,`global`]}generateMeaning(){let e=L(Yr);return e===`Number`?L(K.number):e===`Being`?L(K.being):e===`Adjective`?L(K.adjective):e===`Color + Animal`?`${L(K.color)} ${L(K.animal)}`:e===`Adjective + Animal`?`${L(K.adjective)} ${L(K.animal)}`:e===`Adjective + Being`?`${L(K.adjective)} ${L(K.being)}`:e===`Adjective + Genitive`?`${L(K.adjective)} ${L(K.genitive)}`:e===`Color + Being`?`${L(K.color)} ${L(K.being)}`:e===`Color + Genitive`?`${L(K.color)} ${L(K.genitive)}`:e===`Being + of + Genitive`?`${L(K.being)} of ${L(K.genitive)}`:e===`Being + of the + Genitive`?`${L(K.being)} of the ${L(K.theGenitive)}`:e===`Animal + of + Genitive`?`${L(K.animal)} of ${L(K.genitive)}`:e===`Adjective + Being + of + Genitive`?`${L(K.adjective)} ${L(K.being)} of ${L(K.genitive)}`:e===`Adjective + Animal + of + Genitive`?`${L(K.adjective)} ${L(K.animal)} of ${L(K.genitive)}`:(D.error(`Unknown generation approach`),L(K.being))}},ni=[`bubble`,`pin`,`square`,`squarish`,`diamond`,`hex`,`hexy`,`shieldy`,`shield`,`pentagon`,`heptagon`,`circle`,`no`],ri={1:[`Camels`,`Antelopes`,`Jackals`,`Hyenas`,`Scorpions`,`Locusts`],2:[`Camels`,`Goats`,`Wolves`,`Foxes`,`Eagles`,`Falcons`],3:[`Antelopes`,`Buffalo`,`Elephants`,`Lions`,`Hyenas`,`Cranes`,`Zebras`],4:[`Bisons`,`Horses`,`Deer`,`Hares`,`Geese`,`Larks`,`Wolves`],5:[`Apes`,`Elephants`,`Leopards`,`Tigers`,`Parrots`,`Mantises`],6:[`Deer`,`Boars`,`Badgers`,`Foxes`,`Crows`,`Rooks`,`Bears`,`Wolves`],7:[`Apes`,`Jaguars`,`Panthers`,`Snakes`,`Spiders`,`Parrots`],8:[`Elk`,`Deer`,`Bears`,`Beavers`,`Owls`,`Ravens`],9:[`Elk`,`Moose`,`Wolves`,`Wolverines`,`Martens`,`Bears`,`Ravens`],10:[`Reindeer`,`Musk oxen`,`Wolves`,`Foxes`,`Geese`,`Hares`,`Owls`],12:[`Herons`,`Cranes`,`Ibises`,`Geese`,`Crocodiles`,`Frogs`]},ii={"Healing Spring":5,"Purifying Well":2,"Enchanted Reservoir":1,"Creek of Luck":1,"Fountain of Youth":1,"Wisdom Spring":1,"Spring of Life":1,"Spring of Youth":1,"Healing Stream":1},ai={stone:10,wooden:1,lengthy:2,formidable:2,rickety:1,beaten:1,weathered:1},oi=[`Dark`,`Light`,`Bright`,`Golden`,`White`,`Black`,`Red`,`Pink`,`Purple`,`Blue`,`Green`,`Yellow`,`Amber`,`Orange`,`Brown`,`Grey`],si=`Antelope.Ape.Badger.Bear.Beaver.Bison.Boar.Buffalo.Cat.Crane.Crocodile.Crow.Deer.Dog.Eagle.Elk.Fox.Goat.Goose.Hare.Hawk.Heron.Horse.Hyena.Ibis.Jackal.Jaguar.Lark.Leopard.Lion.Mantis.Marten.Moose.Mule.Narwhal.Owl.Panther.Rat.Raven.Rook.Scorpion.Shark.Sheep.Snake.Spider.Swan.Tiger.Turtle.Wolf.Wolverine.Camel.Falcon.Hound.Ox`.split(`.`),ci=`New.Good.High.Old.Great.Big.Major.Happy.Main.Huge.Far.Beautiful.Fair.Prime.Ancient.Golden.Proud.Lucky.Fat.Honest.Giant.Distant.Friendly.Loud.Hungry.Magical.Superior.Peaceful.Frozen.Divine.Favorable.Brave.Sunny.Flying`.split(`.`),li=[`Boiled`,`Grilled`,`Roasted`,`Spit-roasted`,`Stewed`,`Stuffed`,`Jugged`,`Mashed`,`Baked`,`Braised`,`Poached`,`Marinated`,`Pickled`,`Smoked`,`Dried`,`Dry-aged`,`Corned`,`Fried`,`Pan-fried`,`Deep-fried`,`Dressed`,`Steamed`,`Cured`,`Syrupped`,`Flame-Broiled`],ui={Cattle:[`beef`,`veal`],Sheep:[`lamb`,`mutton`],Game:[`hare`,`rabbit`,`hart`,`deer`,`antlers`,`bear`,`buffalo`,`badger`,`beaver`,`boar`,`pheasant`],Fish:[`carp`,`bass`,`pike`,`catfish`,`sturgeon`,`escallop`,`eel`],Whales:[`whale`,`seal`],Camels:[`camel`],Grain:[`bread`,`pie`,`cake`,`pottage`,`pudding`,`pasta`],Olives:[`olives`],Dates:[`dates`],Cheese:[`cheese`]},di=[`pork`,`bacon`,`chicken`,`goose`,`duck`,`pigeon`,`chevon`,`eggs`,`onions`,`carrot`,`potato`,`beet`,`garlic`,`cabbage`,`spinach`,`peas`,`beans`,`pumpkin`,`apples`,`pears`,`rat tails`,`pig ears`],fi=[`rice`,`chickpea`,`eggplant`,`zucchini`,`pepper`,`tomatoes`,`melon`,`oranges`,`mango`],pi=[`hot`,`cold`,`fire`,`ice`,`smoky`,`misty`,`shiny`,`sweet`,`bitter`,`salty`,`sour`,`sparkling`,`smelly`],mi={Wine:[`wine`,`brandy`],Beer:[`beer`,`ale`],Liquor:[`gin`,`whisky`,`rum`,`vodka`,`tequila`,`absinthe`,`liquor`,`spirits`],Grain:[`kvass`],Honey:[`mead`,`nectar`],Sugarcane:[`rum`],Tea:[`tea`],Cattle:[`milk`],Horses:[`kumis`]},hi=[`water`,`cider`,`juice`,`sap`],gi=[`A gorgeous waterfall flows here.`,`The rapids of an exceptionally beautiful waterfall.`,`An impressive waterfall has cut through the land.`,`The cascades of a stunning waterfall.`,`A river drops down from a great height forming a wondrous waterfall.`,`A breathtaking waterfall cuts through the landscape.`],_i=[`Locals`,`Elders`,`Inscriptions`,`Tipplers`,`Legends`,`Whispers`,`Rumors`,`Journeying folk`,`Tales`],vi=[`great`,`big`,`huge`,`prime`,`golden`,`proud`,`lucky`,`fat`,`giant`,`hungry`,`magical`,`superior`,`terrifying`,`horrifying`,`feared`],yi=[`Ogre`,`Troll`,`Cyclops`,`Giant`,`Monster`,`Beast`,`Dragon`,`Undead`,`Ghoul`,`Vampire`,`Hag`,`Banshee`,`Bearded Devil`,`Roc`,`Hydra`,`Warg`],bi=[`steals cattle at night`,`prefers eating children`,`doesn't mind human flesh`,`keeps the region at bay`,`eats kids whole`,`abducts young women`,`terrorizes the region`,`harasses travelers in the area`,`snatches people from homes`,`attacks anyone who dares to approach its lair`,`attacks unsuspecting victims`],xi=`Apes.Badgers.Bears.Beavers.Bisons.Boars.Cats.Crows.Dogs.Foxes.Hares.Hawks.Hyenas.Jackals.Jaguars.Leopards.Lions.Owls.Panthers.Rats.Ravens.Rooks.Scorpions.Sharks.Snakes.Spiders.Tigers.Wolfs.Wolverines.Falcons`.split(`.`),Si={brigands:4,bandits:3,robbers:1,highwaymen:1},Ci=[`Statue`,`Obelisk`,`Monument`,`Column`,`Monolith`,`Pillar`,`Megalith`,`Stele`,`Runestone`,`Sculpture`,`Effigy`,`Idol`],wi={cypriot:`𐠁𐠂𐠃𐠄𐠅𐠈𐠊𐠋𐠌𐠍𐠎𐠏𐠐𐠑𐠒𐠓𐠔𐠕𐠖𐠗𐠘𐠙𐠚𐠛𐠜𐠝𐠞𐠟𐠠𐠡𐠢𐠣𐠤𐠥𐠦𐠧𐠨𐠩𐠪𐠫𐠬𐠭𐠮𐠯𐠰𐠱𐠲𐠳𐠴𐠵𐠷𐠸𐠼𐠿      `,geez:`ሀለሐመሠረሰቀበተኀነአከወዐዘየደገጠጰጸፀፈፐ   `,coptic:`ⲲⲴⲶⲸⲺⲼⲾⳀⳁⳂⳃⳄⳆⳈⳊⳌⳎⳐⳒⳔⳖⳘⳚⳜⳞⳠⳢⳤ⳥⳧⳩⳪ⳫⳬⳭⳲ⳹⳾   `,tibetan:`ༀ༁༂༃༄༅༆༇༈༉༊་༌༐༑༒༓༔༕༖༗༘༙༚༛༜༠༡༢༣༤༥༦༧༨༩༪༫༬༭༮༯༰༱༲༳༴༵༶༷༸༹༺༻༼༽༾༿`,mongolian:`᠀᠐᠑᠒ᠠᠡᠦᠧᠨᠩᠪᠭᠮᠯᠰᠱᠲᠳᠵᠻᠼᠽᠾᠿᡀᡁᡆᡍᡎᡏᡐᡑᡒᡓᡔᡕᡖᡗᡙᡜᡝᡞᡟᡠᡡᡭᡮᡯᡰᡱᡲᡳᡴᢀᢁᢂᢋᢏᢐᢑᢒᢓᢛᢜᢞᢟᢠᢡᢢᢤᢥᢦ`},Ti=[`City`,`Town`,`Settlement`,`Pyramid`,`Fort`,`Stronghold`,`Temple`,`Sacred site`,`Mausoleum`,`Outpost`,`Fortification`,`Fortress`,`Castle`],Ei={Library:3,Archive:1,Collection:1},Di=[`Fantastical`,`Wondrous`,`Incomprehensible`,`Magical`,`Extraordinary`,`Unmissable`,`World-famous`,`Breathtaking`],Oi=[`Joust`,`Competition`,`Melee`,`Tournament`,`Contest`],ki=[`cunning`,`might`,`speed`,`the greats`,`acumen`,`brutality`],Ai=[`gala`,`dance`,`performance`,`ball`,`soiree`,`jamboree`,`exhibition`,`carnival`,`festival`,`jubilee`,`celebration`,`gathering`,`fete`],ji=[`great and the good`,`nobility`,`local elders`,`foreign dignitaries`,`spiritual leaders`,`suspected revolutionaries`],Mi=[`Entrancing`,`Diaphanous`,`Illusory`,`Distant`,`Peculiar`],Ni={Cave:10,Cavern:8,Chasm:6,Ravine:6,Fracture:5,Grotto:4,Pit:4,Sinkhole:2,Hole:2},Pi={"a good spot to hid treasure":5,"the home of strange monsters":5,"totally empty":4,"endlessly deep and unexplored":4,"completely flooded":2,"slowly filling with lava":1},Fi=[`Demonic`,`Interdimensional`,`Abyssal`,`Cosmic`,`Cataclysmic`,`Subterranean`,`Ancient`],Ii=[`all known nearby beings to flee in terror`,`cracks in reality itself to form`,`swarms of foes to spill forth`,`nearby plants to wither and decay`,`an emmissary to step through with an all-powerful relic`],Li={Necropolis:5,Crypt:2,Tomb:2,Graveyard:1,Cemetery:2,Mausoleum:1,Sepulchre:1},Ri=[`A foreboding necropolis shrouded in perpetual darkness, where eerie whispers echo through the winding corridors and spectral guardians stand watch over the tombs of long-forgotten souls.`,`A towering necropolis adorned with macabre sculptures and guarded by formidable undead sentinels. Its ancient halls house the remains of fallen heroes, entombed alongside their cherished relics.`,`This ethereal necropolis seems suspended between the realms of the living and the dead. Wisps of mist dance around the tombstones, while haunting melodies linger in the air, commemorating the departed.`,`Rising from the desolate landscape, this sinister necropolis is a testament to necromantic power. Its skeletal spires cast ominous shadows, concealing forbidden knowledge and arcane secrets.`,`An eerie necropolis where nature intertwines with death. Overgrown tombstones are entwined by thorny vines, and mournful spirits wander among the fading petals of once-vibrant flowers.`,`A labyrinthine necropolis where each step echoes with haunting murmurs. The walls are adorned with ancient runes, and restless spirits guide or hinder those who dare to delve into its depths.`,`This cursed necropolis is veiled in perpetual twilight, perpetuating a sense of impending doom. Dark enchantments shroud the tombs, and the moans of anguished souls resound through its crumbling halls.`,`A sprawling necropolis built within a labyrinthine network of catacombs. Its halls are lined with countless alcoves, each housing the remains of the departed, while the distant sound of rattling bones fills the air.`,`A desolate necropolis where an eerie stillness reigns. Time seems frozen amidst the decaying mausoleums, and the silence is broken only by the whispers of the wind and the rustle of tattered banners.`,`A foreboding necropolis perched atop a jagged cliff, overlooking a desolate wasteland. Its towering walls harbor restless spirits, and the imposing gates bear the marks of countless battles and ancient curses.`],zi=[{subject:`Bandits`,verb:`have set an ambush`},{subject:`Wild beasts`,verb:`have been sighted`},{subject:`A lone traveler`,verb:`was seen wandering`},{subject:`Cultists`,verb:`gather in secret`},{subject:`A pilgrim`,verb:`walks the road`},{subject:`Refugees`,verb:`have made camp`},{subject:`Smugglers`,verb:`move under cover of night`},{subject:`A hermit`,verb:`dwells alone`},{subject:`Mercenaries`,verb:`ride through`},{subject:`Poachers`,verb:`have been active`}],Bi=(e=100,t=1e3)=>new Date(V(e,t),V(11),V(1,28)).toLocaleDateString(`en`,{year:`numeric`,month:`long`,day:`numeric`});function Vi(e){return e?Ne(e.replaceAll(`-`,` `)):`Marker`}var Hi=(e,t)=>n=>{if(typeof n!=`number`||!(n>=e&&n<=t))throw Error(`Expected a number from ${e} to ${t}`);return n},Ui={size:Hi(1,500),px:Hi(1,50),dx:Hi(0,100),dy:Hi(0,100),pin:e=>g(e,ni,`The pin`),fill:Dn,stroke:Dn,iconFill:Dn,iconStroke:Dn},Wi=new class{configuration;occupied=[];tradeIndex;tradeSource=null;get config(){return this.configuration??=this.getDefaultConfig(),this.configuration}set config(e){this.configuration=e}getConfig(){return this.config}setConfig(e){this.config=e}generate(){this.resetConfig(),pack.markers=[],this.generateTypes()}regenerate(){pack.markers=pack.markers.filter(({lock:e,cell:t})=>e?(this.occupied[t]=!0,!0):!1),this.generateTypes()}add(e){let t=this.config.find(t=>t.type===e.type);if(t){let{icon:n,type:r,dx:i,dy:a,px:o,size:s,pin:c,fill:l,stroke:u}=t;return e=this.addMarker({icon:n,type:r,dx:i,dy:a,px:o,size:s,pin:c,fill:l,stroke:u},e),t.add(e,e.cell),e}let n=ut(pack.markers)?.i+1||0,r={...e,i:n,name:e.name||Vi(e.type),tags:e.tags??[]};return pack.markers.push(r),this.occupied[e.cell]=!0,r}rename(e,t){let n=pack.markers.find(t=>t.i===e);if(!n)throw Error(`Marker ${e} does not exist`);n.name=y(t)}setIcon(e,t){this.living(e).icon=fe.reference(t)}setType(e,t){this.living(e).type=y(t)}setHidden(e,t){let n=this.living(e);t?n.hidden=!0:delete n.hidden}move(e,t,n){let r=this.living(e),i=P.requireCell(t,n);Object.assign(r,{x:ke(t,1),y:ke(n,1),cell:i})}setPinned(e,t){let n=this.living(e);t?n.pinned=!0:delete n.pinned}setLocked(e,t){let n=this.living(e);t?n.lock=!0:delete n.lock}setAppearance(e,t){let n=this.living(e);if(typeof t!=`object`||!t)throw Error(`The appearance must be an object`);let r={};for(let[e,n]of Object.entries(t)){if(!(e in Ui))throw Error(`Unknown marker appearance ${e}; known: ${Object.keys(Ui).join(`, `)}`);r[e]=n===null?null:Ui[e](n)}for(let[e,t]of Object.entries(r))t===null?delete n[e]:Object.assign(n,{[e]:t})}living(e){let t=pack.markers.find(t=>t.i===e);if(!t)throw Error(`Marker ${e} does not exist`);return t}place(e,t,n,r={}){if(typeof r!=`object`||!r||Array.isArray(r))throw Error(`The marker details must be an object: { name, note, icon }`);let i=Object.keys(r).find(e=>![`name`,`note`,`icon`].includes(e));if(i)throw Error(`Unknown marker detail ${i}; known: name, note, icon`);let{name:a,note:o,icon:s}=r,c=P.requireCell(e,t),l={x:ke(e,2),y:ke(t,2),cell:c,type:y(n)},u=this.config.some(e=>e.type===l.type);if(!u&&!o)throw Error(`Marker type ${l.type} generates no legend; give the marker a note`);a!==void 0&&(l.name=y(a)),s===void 0?u||(l.icon=fe.glyph(`❓`)):l.icon=fe.reference(s);let d=this.add(l);return l.name&&(d.name=l.name),o&&In.write(`marker:${d.i}`,o),d.i}remove(e){this.living(e),pack.markers=pack.markers.filter(t=>t.i!==e)}listParty({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.burg[t])}addParty(e,t){pack.markers.some(t=>t.type===`party`&&t.i!==e.i&&t.note)||(e.name=`The Party`,e.note=`Current location of the adventuring party.`)}getDefaultConfig(){let e=options.map.cultures.set.includes(`Fantasy`);return[{type:`volcanoes`,icon:`🌋`,dx:52,px:13,min:10,each:500,multiplier:1,list:this.listVolcanoes.bind(this),add:this.addVolcano.bind(this)},{type:`hot-springs`,icon:`♨️`,dy:52,min:30,each:1200,multiplier:1,list:this.listHotSprings.bind(this),add:this.addHotSpring.bind(this)},{type:`water-sources`,icon:`💧`,min:1,each:1e3,multiplier:1,list:this.listWaterSources.bind(this),add:this.addWaterSource.bind(this)},{type:`guild-halls`,icon:`🏛️`,min:1,each:1,multiplier:1,list:this.listGuildHalls.bind(this),add:this.addGuildHall.bind(this)},{type:`mines`,icon:`⛏️`,dx:48,px:13,min:1,each:6,multiplier:1,list:this.listMines.bind(this),weight:this.weighMines.bind(this),add:this.addMine.bind(this)},{type:`bridges`,icon:`🌉`,px:14,min:1,each:5,multiplier:1,list:this.listBridges.bind(this),weight:e=>Math.sqrt(this.trade.burgTrade[pack.cells.burg[e]]||0),add:this.addBridge.bind(this)},{type:`merchant-houses`,icon:`⚖️`,min:3,each:8,multiplier:1,list:this.listMerchantHouses.bind(this),weight:e=>Math.max(0,this.trade.margin[pack.cells.market?.[e]]||0),add:this.addMerchantHouse.bind(this)},{type:`inns`,icon:`🍻`,px:14,min:1,each:10,multiplier:1,list:this.listInns.bind(this),weight:this.weighInns.bind(this),add:this.addInn.bind(this)},{type:`lighthouses`,icon:`🚨`,px:14,min:1,each:2,multiplier:1,list:this.listLighthouses.bind(this),add:this.addLighthouse.bind(this)},{type:`waterfalls`,icon:`💦`,dy:54,px:16,min:1,each:5,multiplier:1,list:this.listWaterfalls.bind(this),add:this.addWaterfall.bind(this)},{type:`battlefields`,icon:`⚔️`,dy:52,min:50,each:700,multiplier:1,list:this.listBattlefields.bind(this),add:this.addBattlefield.bind(this)},{type:`dungeons`,icon:`🗝️`,dy:51,px:13,min:30,each:200,multiplier:1,list:this.listDungeons.bind(this),add:this.addDungeon.bind(this)},{type:`lake-monsters`,icon:`🐉`,dy:48,min:2,each:10,multiplier:1,list:this.listLakeMonsters.bind(this),add:this.addLakeMonster.bind(this)},{type:`sea-monsters`,icon:`🦑`,min:50,each:700,multiplier:1,list:this.listSeaMonsters.bind(this),add:this.addSeaMonster.bind(this)},{type:`hill-monsters`,icon:`👹`,dy:54,px:13,min:30,each:600,multiplier:1,list:this.listHillMonsters.bind(this),add:this.addHillMonster.bind(this)},{type:`sacred-mountains`,icon:`🗻`,dy:48,min:1,each:5,multiplier:1,list:this.listSacredMountains.bind(this),add:this.addSacredMountain.bind(this)},{type:`sacred-forests`,icon:`🌳`,min:30,each:1e3,multiplier:1,list:this.listSacredForests.bind(this),add:this.addSacredForest.bind(this)},{type:`sacred-pineries`,icon:`🌲`,px:13,min:30,each:800,multiplier:1,list:this.listSacredPineries.bind(this),add:this.addSacredPinery.bind(this)},{type:`sacred-palm-groves`,icon:`🌴`,px:13,min:1,each:100,multiplier:1,list:this.listSacredPalmGroves.bind(this),add:this.addSacredPalmGrove.bind(this)},{type:`brigands`,icon:`💰`,px:13,min:50,each:100,multiplier:1,list:this.listBrigands.bind(this),weight:this.weighBrigands.bind(this),add:this.addBrigands.bind(this)},{type:`pirates`,icon:`🏴‍☠️`,dx:51,min:40,each:400,multiplier:1,list:this.listPirates.bind(this),weight:this.weighPirates.bind(this),add:this.addPirates.bind(this)},{type:`statues`,icon:`🗿`,min:80,each:1200,multiplier:1,list:this.listStatues.bind(this),add:this.addStatue.bind(this)},{type:`ruins`,icon:`🏺`,min:80,each:1200,multiplier:1,list:this.listRuins.bind(this),add:this.addRuins.bind(this)},{type:`libraries`,icon:`📚`,min:10,each:1200,multiplier:1,list:this.listLibraries.bind(this),add:this.addLibrary.bind(this)},{type:`circuses`,icon:`🎪`,min:80,each:1e3,multiplier:1,list:this.listCircuses.bind(this),add:this.addCircus.bind(this)},{type:`jousts`,icon:`🤺`,dx:48,min:5,each:500,multiplier:1,list:this.listJousts.bind(this),add:this.addJoust.bind(this)},{type:`fairs`,icon:`🎠`,min:50,each:1e3,multiplier:1,list:this.listFairs.bind(this),weight:this.weighFairs.bind(this),add:this.addFair.bind(this)},{type:`customs-houses`,icon:`🛃`,min:1,each:3,multiplier:1,list:this.listCustomsHouses.bind(this),weight:this.weighCustomsHouses.bind(this),add:this.addCustomsHouse.bind(this)},{type:`canoes`,icon:`🛶`,min:500,each:2e3,multiplier:1,list:this.listCanoes.bind(this),add:this.addCanoe.bind(this)},{type:`migration`,icon:`🐗`,min:20,each:1e3,multiplier:1,list:this.listMigrations.bind(this),add:this.addMigration.bind(this)},{type:`dances`,icon:`💃🏽`,min:50,each:1e3,multiplier:1,list:this.listDances.bind(this),add:this.addDances.bind(this)},{type:`mirage`,icon:`꩜`,min:10,each:600,multiplier:1,list:this.listMirage.bind(this),add:this.addMirage.bind(this)},{type:`caves`,icon:`🦇`,min:60,each:1e3,multiplier:1,list:this.listCaves.bind(this),add:this.addCave.bind(this)},{type:`portals`,icon:`🌀`,px:14,min:16,each:8,multiplier:+e,list:this.listPortals.bind(this),add:this.addPortal.bind(this)},{type:`rifts`,icon:`🎆`,min:5,each:3e3,multiplier:+e,list:this.listRifts.bind(this),add:this.addRift.bind(this)},{type:`disturbed-burials`,icon:`💀`,min:20,each:3e3,multiplier:+e,list:this.listDisturbedBurial.bind(this),add:this.addDisturbedBurial.bind(this)},{type:`necropolises`,icon:`🪦`,min:20,each:1e3,multiplier:1,list:this.listNecropolis.bind(this),add:this.addNecropolis.bind(this)},{type:`encounters`,icon:`🧙`,min:10,each:600,multiplier:1,list:this.listEncounters.bind(this),add:this.addEncounter.bind(this)},{type:`party`,icon:`🚩`,size:46,pin:`pin`,fill:`#ffffff`,stroke:`#d4351c`,min:1,each:2**53-1,multiplier:1,list:this.listParty.bind(this),add:this.addParty.bind(this)}].map(e=>({...e,icon:fe.glyph(e.icon)}))}resetConfig(){this.config=this.getDefaultConfig()}generateTypes(){this.config.forEach(({type:e,icon:t,dx:n,dy:r,px:i,size:a,pin:o,fill:s,stroke:c,min:l,each:u,multiplier:d,list:f,weight:p,add:m})=>{if(d===0)return;let h=Array.from(f(pack)),g=p&&h.map(p),ee=this.getQuantity(h,l,u,d);for(;ee&&h.length;){let[l]=g?this.extractWeighted(h,g):this.extractAnyElement(h),u=this.addMarker({icon:t,type:e,dx:n,dy:r,px:i,size:a,pin:o,fill:s,stroke:c},{cell:l});u&&(m(u,l),ee--)}}),this.occupied=[]}getQuantity(e,t,n,r){if(!e.length||e.length<t/r)return 0;let i=Math.ceil(e.length/n*r);return Math.min(e.length,i)}extractAnyElement(e){let t=Math.floor(Math.random()*e.length);return e.splice(t,1)}extractWeighted(e,t){let n=t.reduce((e,t)=>e+t,0),r=Math.random(),i=Math.floor(r*e.length);if(n){let e=r*n-t[0];for(i=0;e>=0&&i<t.length-1;)e-=t[++i]}return t.splice(i,1),e.splice(i,1)}get trade(){return this.tradeIndex&&this.tradeSource===pack.deals||(this.tradeIndex=this.indexTrade(),this.tradeSource=pack.deals),this.tradeIndex}indexTrade(){let{burgs:e,markets:n}=pack,r=[],i=[],a=[],o=[],s=new Map;for(let n of pack.deals??[]){let[c,u,d,f,p,m,,h]=n;if(f===l.kept||(r[u]=(r[u]||0)+p*m,o[c]=(o[c]||0)+p*m,i[u]=(i[u]||0)+ue.getMargin(n),a[c]??=new Set,a[c].add(d),!h))continue;let g=this.getStatePair(e[c]?.state||0,t.getState(t.get(u)));s.set(g,(s.get(g)||0)+h)}for(let{i:e,rural:t}of n??[])t&&(r[e]=(r[e]||0)+t.earned+t.spent,i[e]=(i[e]||0)+(t.margin||0));return{volume:r,margin:i,goods:a.map(e=>e.size),burgTrade:o,tariffs:s,guilds:this.indexGuilds()}}indexGuilds(){let e=[],t=[],n=new Map,r=[],i=[];for(let a of pack.burgs)if(a.i&&!a.removed)for(let[o,s]of a.production??[]){let c=W.get(o);if(!c?.recipes?.length)continue;let l=(a.state||0)*65536+o;e[o]=(e[o]||0)+s,t[o]=(t[o]||0)+1,n.set(l,(n.get(l)||0)+s),r[a.i]=(r[a.i]||0)+s*c.value,i.push({burg:a,good:c,units:s,stateKey:l})}let a=new Map;for(let{burg:o,good:s,units:c,stateKey:l}of i){let i=c*s.value;if(i<15||i/r[o.i]<.25)continue;let u=c/e[s.i]*Math.sqrt(t[s.i]*(c/n.get(l)));u<.75||u<=(a.get(o.i)?.renown??0)||a.set(o.i,{good:s,renown:u})}return a}getStatePair(e,t){return e<t?e*65536+t:t*65536+e}getMarketTrade(e){return Math.sqrt(this.trade.volume[pack.cells.market?.[e]]||0)}addMarker(e,t){let{cell:n}=t;if(n===void 0)return;let r=ut(pack.markers)?.i+1||0,[i,a]=this.getMarkerCoordinates(n),o=t.type??e.type,s={...e,x:i,y:a,...t,cell:n,i:r,name:t.name||Vi(o),tags:t.tags??[]};return pack.markers.push(s),this.occupied[n]=!0,s}getMarkerCoordinates(e){let{cells:t,burgs:n}=pack,r=t.burg[e];if(r){let{x:e,y:t}=n[r];return[e,t]}return t.p[e]}listVolcanoes({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.h[t]>=70)}addVolcano(e,t){let{cells:n}=pack,r=B.getCulture(n.culture[t]),i=R(.3)?`Mount ${r}`:R(.7)?`${r} Volcano`:r,a=R(.6)?`Dormant`:R(.4)?`Active`:`Erupting`;e.name=i,e.note=`${a} volcano. Height: ${fn(n.p[t],pack,grid)}.`}listHotSprings({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.h[t]>50&&e.culture[t])}addHotSpring(e,t){let{cells:n}=pack,r=B.getCulture(n.culture[t]),i=pn(Bt(35,15,20,100)),a=R(.3)?`Hot Springs of ${r}`:R(.7)?`${r} Hot Springs`:r,o=`A geothermal springs with naturally heated water that provide relaxation and medicinal benefits. Average temperature is ${i}.`;e.name=a,e.note=o}listWaterSources({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.h[t]>30&&e.r[t])}addWaterSource(e,t){let{cells:n}=pack,r=H(ii);e.name=`${B.getCulture(n.culture[t])} ${r}`,e.note=`This legendary water source is whispered about in ancient tales and believed to possess mystical properties. The spring emanates crystal-clear water, shimmering with an otherworldly iridescence that sparkles even in the dimmest light.`}getMinedGood(e){let t=W.get(pack.cells.good[e]);if(t?.tags.some(e=>e===`ore`||e===`mineral`))return pack.burgs[pack.cells.burg[e]]?.production?.some(([e])=>e===t.i)?t:void 0}getMarketGoods(e){let n=pack.cells.market?.[e],r=t.get(n);if(!r)return new Set;let i=Object.keys(r.goods).filter(e=>r.goods[+e].stock>0).map(Number);for(let[,e,t]of pack.deals??[])e===n&&i.push(t);return new Set(i.map(e=>W.get(e)?.name).filter(e=>e!==void 0))}getDeposit(e){let t=W.get(pack.cells.good[e]);if(pack.cells.burg[e]&&t?.tags.some(e=>e===`ore`||e===`mineral`))return t}listMines({cells:e}){return e.i.filter(e=>!this.occupied[e]&&this.getDeposit(e))}weighMines(e){let t=this.getDeposit(e);return t?t.value**2*(t.tags.includes(`luxury`)?4:1):0}addMine(e,t){let{cells:n}=pack,r=this.getMinedGood(t),i=(r??this.getDeposit(t))?.name.toLowerCase()??`ore`,a=pack.burgs[n.burg[t]];if(!a?.i)return;if(!r&&pack.deals?.length){e.name=`${a.name} — old ${i} mine`,e.note=`The ${i} mine by ${a.name} is played out. Its shafts stand empty, and the miners have long gone to work the fields.`;return}let o=ke(a.population*options.map.units.population.scale*options.map.units.population.urbanization.rate);e.name=`${a.name} — ${i} mining town`,e.note=`${a.name} is a mining town of ${o} people just nearby the ${i} mine.`}listBridges({cells:e,burgs:t}){let n=Vt(e.fl.filter(e=>e));return e.i.filter(r=>!this.occupied[r]&&e.burg[r]&&e.t[r]!==1&&t[e.burg[r]].population>20&&e.r[r]&&e.fl[r]>n)}addBridge(e,t){let{cells:n}=pack,r=pack.burgs[n.burg[t]],i=pack.rivers.find(e=>e.i===pack.cells.r[t]),a=i?`${i.name} ${i.type}`:`river`,o=i&&R(.2)?`${i.name} Bridge`:`${r.name} Bridge`,s=`A ${H(ai)} bridge spans over the ${a} at ${r.name}. Carts and pack trains cross it from dawn to dusk, bound for the market.`;e.name=o,e.note=s}listInns({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.pop[t]>5&&S.isCrossroad(t))}weighInns(e){return this.getMarketTrade(e)}addInn(e,t){let n=R(.3)?`inn`:`tavern`,r=R(.7),i=L(si),a=r?R(.6)?`${L(oi)} ${i}`:`${L(ci)} ${i}`:`${L(ci)} ${Ne(n)}`,o=this.getMarketGoods(t),s=e=>Object.entries(e).flatMap(([e,t])=>o.has(e)?t:[]),c=(e,t)=>e.length&&R(.7)?L(e):L(t),l=grid.cells.temp[pack.cells.g[t]]>=18?[...di,...fi]:di,u=s(ui),d=[...l,...u].includes(i.toLowerCase()),f=r&&d&&R(.5)?i:c(u,l),p=`A big and famous roadside ${n}. Delicious ${`${L(li)} ${f}`.toLowerCase()} with ${`${R(.5)?L(pi):L(oi)} ${c(s(mi),hi)}`.toLowerCase()} is served here.`;e.name=`The ${a}`,e.note=p}listLighthouses({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.harbor[t]>6&&e.c[t].some(t=>e.h[t]<20&&S.isConnected(t)))}addLighthouse(e,t){let{cells:n}=pack,r=n.burg[t]?pack.burgs[n.burg[t]].name:B.getCulture(n.culture[t]);e.name=`${z(r)} Lighthouse`,e.note=`A lighthouse to serve as a beacon for ships in the open sea.`}listWaterfalls({cells:e}){return e.i.filter(t=>e.r[t]&&!this.occupied[t]&&e.h[t]>=50&&e.c[t].some(t=>e.h[t]<40&&e.r[t]))}addWaterfall(e,t){let{cells:n}=pack,r=n.burg[t]?pack.burgs[n.burg[t]].name:B.getCulture(n.culture[t]);e.name=`${z(r)} Waterfall`,e.note=L(gi)}listBattlefields({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.state[t]&&e.pop[t]>2&&e.h[t]<50&&e.h[t]>25)}addBattlefield(e,t){let{cells:n,states:r}=pack,i=r[n.state[t]];i.campaigns||=Sn.generateCampaign(i);let a=L(i.campaigns),o=Bi(a.start,a.end),s=`${B.getCulture(n.culture[t])} Battlefield`,c=`A historical battle of the ${a.name}. \r\nDate: ${o} ${options.map.lore.calendar.era}.`;e.name=s,e.note=c}listDungeons({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.pop[t]&&e.pop[t]<3)}addDungeon(e,t){let n=`${options.map.seed}${t}`,r=`<div>Undiscovered dungeon. See <a href="https://watabou.github.io/one-page-dungeon/?seed=${n}" target="_blank">One page dungeon</a></div><iframe style="pointer-events: none;" src="https://watabou.github.io/one-page-dungeon/?seed=${n}" sandbox="allow-scripts allow-same-origin"></iframe>`;e.name=`Dungeon`,e.note=r}listLakeMonsters({features:e}){return e.filter(e=>e.type===`lake`&&e.subtype===`freshwater`&&!this.occupied[e.firstCell]).map(e=>e.firstCell)}addLakeMonster(e,t){let n=pack.features[pack.cells.f[t]];if(n.type!==`lake`)return;let r=`${n.name} Monster`,i=Bt(10,5,5,100),a=`${L(_i)} say a relic monster of ${i} ${options.map.units.height.unit} long inhabits ${n.name} Lake. Truth or lie, folks are afraid to fish in the lake.`;e.name=r,e.note=a}listSeaMonsters({cells:e,features:t}){return e.i.filter(n=>!this.occupied[n]&&e.h[n]<20&&S.isConnected(n)&&t[e.f[n]].type===`ocean`)}addSeaMonster(e,t){let n=`${B.getCultureShort(0)} Monster`,r=`Old sailors tell stories of a gigantic sea monster inhabiting these dangerous waters. Rumors say it can be ${Bt(25,10,10,100)} ${options.map.units.height.unit} long.`;e.name=n,e.note=r}listHillMonsters({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.h[t]>=50&&e.pop[t])}addHillMonster(e,t){let{cells:n}=pack,r=L(yi),i=B.getCulture(n.culture[t]),a=`${i} ${r}`,o=`${L(_i)} speak of a ${L(vi)} ${r} who inhabits ${i} hills and ${L(bi)}.`;e.name=a,e.note=o}listSacredMountains({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.h[t]>=70&&e.c[t].some(t=>e.culture[t])&&e.c[t].every(t=>e.h[t]<60))}addSacredMountain(e,t){let{cells:n,religions:r}=pack,i=n.c[t].map(e=>n.culture[e]).find(e=>e),a=n.religion[t]||n.c[t].map(e=>n.religion[e]).find(e=>e),o=`${B.getCulture(i)} Mountain`,s=fn(n.p[t],pack,grid),c=`A sacred mountain${a?` of ${r[a].name}`:``}. Height: ${s}.`;e.name=o,e.note=c}listSacredForests({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.culture[t]&&e.religion[t]&&[6,8].includes(e.biome[t]))}addSacredForest(e,t){let{cells:n,religions:r}=pack,i=n.culture[t],a=n.religion[t],o=`${B.getCulture(i)} Forest`,s=`A forest sacred to local ${r[a].name}.`;e.name=o,e.note=s}listSacredPineries({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.culture[t]&&e.religion[t]&&e.biome[t]===9)}addSacredPinery(e,t){let{cells:n,religions:r}=pack,i=n.culture[t],a=n.religion[t],o=`${B.getCulture(i)} Pinery`,s=`A pinery sacred to local ${r[a].name}.`;e.name=o,e.note=s}listSacredPalmGroves({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.culture[t]&&e.religion[t]&&e.biome[t]===1&&e.pop[t]>1&&S.isConnected(t))}addSacredPalmGrove(e,t){let{cells:n,religions:r}=pack,i=n.culture[t],a=n.religion[t],o=`${B.getCulture(i)} Palm Grove`,s=`A palm grove sacred to local ${r[a].name}.`;e.name=o,e.note=s}listBrigands({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.culture[t]&&S.hasRoad(t))}weighBrigands(e){return this.getMarketTrade(e)*(1.2-(pack.cells.prosperity?.[e]||0)/100)}addBrigands(e,t){let{cells:n}=pack,r=n.culture[t],i=n.biome[t],a=((e,t)=>e>=70?`highlander`:[1,2].includes(t)?`desert`:[3,4].includes(t)?`mounted`:[5,6,7,8,9].includes(t)?`forest`:t===12?`swamp`:`angry`)(n.h[t],i),o=`${B.getCulture(r)} ${L(xi)}`,s=`A gang of ${a} ${H(Si)}.`;e.name=o,e.note=s}listPirates({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.h[t]<20&&S.isConnected(t))}weighPirates(e){let{cells:t,routes:n}=pack,r=0;for(let i of new Set(Object.values(t.routes[e]??{}))){let e=n.find(e=>e.i===i)?.points;e?.length&&(r=Math.max(r,this.getMarketTrade(e[0][2])+this.getMarketTrade(ut(e)[2])))}return r}addPirates(e,t){e.name=`Pirates`,e.note=`Pirate ships have been spotted in these waters.`}listStatues({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.h[t]>=20&&e.h[t]<40)}addStatue(e,t){let{cells:n}=pack,r=n.culture[t],i=L(Ci),a=`${B.getCulture(r)} ${i}`,o=wi[L(Object.keys(wi))],s=Array(V(40,100)).fill(null).map(()=>L(o.split(``))).join(``),c=`An ancient ${i.toLowerCase()}. It has an inscription, but no one can translate it:
        <div style="font-size: 1.8em; line-break: anywhere;">${s}</div>`;e.name=a,e.note=c}listRuins({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.culture[t]&&e.h[t]>=20&&e.h[t]<60)}addRuins(e,t){let n=L(Ti),r=`Ruined ${n}`,i=`Ruins of an ancient ${n.toLowerCase()}. Untold riches may lie within.`;e.name=r,e.note=i}listLibraries({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.culture[t]&&e.burg[t]&&e.pop[t]>10)}addLibrary(e,t){let{cells:n}=pack,r=H(Ei);e.name=`${B.getCulture(n.culture[t])} ${r}`,e.note=`A vast collection of knowledge, including many rare and ancient tomes.`}listCircuses({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.culture[t]&&e.h[t]>=20&&S.isConnected(t))}addCircus(e,t){let n=L(Di),r=`Travelling ${n} Circus`,i=`Roll up, roll up, this ${n.toLowerCase()} circus is here for a limited time only.`;e.name=r,e.note=i}listJousts({cells:e,burgs:t}){return e.i.filter(n=>!this.occupied[n]&&e.burg[n]&&t[e.burg[n]].population>20)}addJoust(e,t){let{cells:n,burgs:r}=pack;if(!n.burg[t])return;let i=r[n.burg[t]].name,a=L(Oi),o=L(ki),s=`${i} ${a}`,c=`Warriors from around the land gather for a ${a.toLowerCase()} of ${o} in ${i}, with fame, fortune and favour on offer to the victor.`;e.name=s,e.note=c}listFairs({cells:e,burgs:t}){return e.i.filter(n=>!this.occupied[n]&&e.burg[n]&&t[e.burg[n]].population<20&&t[e.burg[n]].population>5)}weighFairs(e){return this.trade.goods[pack.cells.burg[e]]||0}addFair(e,t){let{cells:n,burgs:r}=pack;if(!n.burg[t])return;let i=r[n.burg[t]],a=i.name,o=(i.production??[]).toSorted((e,t)=>t[1]-e[1]).map(([e])=>W.get(e)?.name.toLowerCase()).filter(e=>e!==void 0),s=[...new Set(o)].slice(0,3),c=s.length?`offering local ${Mt(s)} alongside foreign goods and services`:`with all manner of local and foreign goods and services on offer`,l=`${a} Fair`,u=`A fair is being held in ${a}, ${c}.`;e.name=l,e.note=u}getCustomsBorder(e){let{cells:t,routes:n}=pack,r=t.state[e],i;for(let[a,o]of Object.entries(t.routes[e]??{})){let e=t.state[+a];if(!r||!e||e===r||n.find(e=>e.i===o)?.group!==`roads`)continue;let s=this.trade.tariffs.get(this.getStatePair(r,e))||0;s>(i?.tariffs??0)&&(i={state:e,tariffs:s})}return i}listCustomsHouses({cells:e}){let t=new Map;for(let n of e.i){if(this.occupied[n]||!e.routes[n])continue;let r=this.getCustomsBorder(n),i=r&&this.getStatePair(e.state[n],r.state);i!==void 0&&!t.has(i)&&t.set(i,n)}return[...t.values()]}weighCustomsHouses(e){return this.getCustomsBorder(e)?.tariffs??0}addCustomsHouse(e,t){let{cells:n,states:r}=pack,i=r[n.state[t]],a=this.getCustomsBorder(t),o=a?` from ${r[a.state].name}`:``;e.name=`${n.burg[t]?pack.burgs[n.burg[t]].name:B.getCulture(n.culture[t])} Customs House`,e.note=`A customs house of ${i?.name||`the state`} on the road${o}. Carts queue at its barrier while the wardens weigh their loads and collect the tariffs.`}listGuildHalls({cells:e}){return e.i.filter(t=>!this.occupied[t]&&this.trade.guilds.has(e.burg[t]))}addGuildHall(e,t){let n=pack.burgs[pack.cells.burg[t]],r=n&&this.trade.guilds.get(n.i);if(!r){e.name=n?.i?`${n.name} Guild Hall`:`Guild Hall`,e.note=`The hall of a craft guild that keeps the secrets of its trade.`;return}let i=r.good.name.toLowerCase();e.name=`${n.name} ${Ne(i)} Guild`;let a=this.getMinedGood(t),o=a&&r.good.recipes?.some(e=>a.i in e)?`, worked from the ${a.name.toLowerCase()} of its own mines`:``;e.note=`${n.name} is famed for its ${i}${o}. The guild hall of its makers keeps the secrets of the craft, and its masters set the price far beyond the town.`}listMerchantHouses({cells:e,burgs:t}){return(pack.markets??[]).map(e=>t[e.centerBurgId]?.cell).filter(t=>t!==void 0&&!this.occupied[t]&&e.burg[t]>0)}addMerchantHouse(e,t){let{cells:n,burgs:r}=pack,i=r[n.burg[t]],a=n.market?.[t],o=this.trade.margin[a]||0,s=(pack.markets??[]).filter(({i:e})=>(this.trade.margin[e]||0)>o).length?`one of the richest`:`the richest`;e.name=`House of ${B.getCulture(n.culture[t])}`,e.note=`A merchant family of ${i?.name||`the town`}, ${s} in the land. Its factors buy and sell across the whole market, and a share of every deal ends in its coffers.`}listCanoes({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.r[t])}addCanoe(e,t){let n=pack.rivers.find(e=>e.i===pack.cells.r[t]),r=`A small location along the ${n?`${n.name} ${n.type}`:`river`} to launch boats from sits here, along with a weary looking owner, willing to sell passage along the river.`;e.name=`Minor Jetty`,e.note=r}listMigrations({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.h[t]>=20&&e.pop[t]<=2&&ri[e.biome[t]])}addMigration(e,t){let n=L(ri[pack.cells.biome[t]]??[`Birds`]),r=`${n} migration`,i=`A huge group of ${n.toLowerCase()} are migrating, whether part of their annual routine, or something more extraordinary.`;e.name=r,e.note=i}listDances({cells:e,burgs:t}){return e.i.filter(n=>!this.occupied[n]&&e.burg[n]&&t[e.burg[n]].population>15)}addDances(e,t){let{cells:n,burgs:r}=pack,i=r[n.burg[t]].name,a=L(Ai),o=`${i} ${a}`,s=`A ${a} has been organised at ${i} as a chance to gather the ${L(ji)} of the area together to be merry, make alliances and scheme around the crisis.`;e.name=o,e.note=s}listMirage({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.biome[t]===1)}addMirage(e,t){let n=L(Mi),r=`${n} mirage`,i=`This ${n.toLowerCase()} mirage has been luring travellers out of their way for eons.`;e.name=r,e.note=i}listCaves({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.h[t]>=50&&e.pop[t])}addCave(e,t){let{cells:n}=pack,r=H(Ni),i=B.getCulture(n.culture[t]);n.biome[t]===11&&(r=`Glacial ${r}`);let a=`${i} ${r}`,o=`The ${a}. Locals claim that it is ${H(Pi)}.`;e.name=a,e.note=o}listPortals({burgs:e}){return e.slice(1,Math.ceil(e.length/10)+1).filter(({cell:e})=>!this.occupied[e]).map(e=>e.cell)}addPortal(e,t){let{cells:n,burgs:r}=pack;n.burg[t]&&(e.name=`${r[n.burg[t]].name} Portal`,e.note=`An element of the magic portal system connecting major cities. The portals were installed centuries ago, but still work fine.`)}listRifts({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.pop[t]<=3&&pack.biomes[e.biome[t]].habitability)}addRift(e,t){let n=L(Fi),r=`${n} Rift`,i=`A rumoured ${n.toLowerCase()} rift in this area is causing ${L(Ii)}.`;e.name=r,e.note=i}listDisturbedBurial({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.h[t]>=20&&e.pop[t]>2)}addDisturbedBurial(e,t){e.name=`Disturbed Burial`,e.note=`A burial site has been disturbed in this area, causing the dead to rise and attack the living.`}listNecropolis({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.h[t]>=20&&e.pop[t]<2)}addNecropolis(e,t){let{cells:n}=pack,r=`${B.getCulture(n.culture[t])} ${H(Li)}`,i=L(Ri);e.name=r,e.note=i}listEncounters({cells:e}){return e.i.filter(t=>!this.occupied[t]&&e.h[t]>=20&&e.pop[t]>1)}addEncounter(e,t){if(typeof navigator>`u`||navigator.onLine!==!1){let n=`<div>You have encountered a character.</div><iframe src="https://deorum.vercel.app/encounter/${t}" width="375" height="600" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>`;e.name=`Random encounter`,e.note=n;return}let{cells:n}=pack,r=B.getCulture(n.culture[t]),i=(pack.biomes[n.biome[t]]?.name||`wilderness`).toLowerCase(),{subject:a,verb:o}=L(zi),s=`${a} of ${r}`,c=`${a} ${o} in the ${i} of ${r} lands.`;e.name=s,e.note=c}},Gi=new Vr(`Generation Pipeline`,[{id:`grid`,run:({graph:e})=>dn.prepare(e)},{id:`heightmap`,run:()=>vn.generate()},{id:`markupGrid`,run:()=>m.markupGrid()},{id:`depressionLakes`,run:()=>dn.addDeepDepressionLakes()},{id:`nearSeaLakes`,run:()=>dn.openNearSeaLakes()},{id:`mapSize`,run:()=>_e.generate()},{id:`temperatures`,run:()=>bn.generate()},{id:`precipitation`,run:()=>We.generate()},{id:`clearPack`,run:()=>P.clear()},{id:`clearGraphOverride`,run:()=>un.clear()},{id:`regraph`,run:()=>P.generate()},{id:`markupPack`,run:()=>m.markupPack()},{id:`defaultRuler`,run:()=>$t.createDefaultRuler()},{id:`rivers`,run:()=>p.generate()},{id:`biomes`,run:()=>_n.generate()},{id:`featureGroups`,run:()=>m.defineGroups()},{id:`ice`,run:()=>yn.generate()},{id:`goods`,run:()=>W.generate()},{id:`rankCells`,run:()=>x.rankCells()},{id:`cultures`,run:()=>Gr.generate()},{id:`culturesExpand`,run:()=>Gr.expand()},{id:`burgs`,run:()=>ae.generate()},{id:`states`,run:()=>Sn.generate()},{id:`routes`,run:()=>S.generate()},{id:`development`,run:()=>Te.generate()},{id:`religions`,run:()=>ti.generate()},{id:`burgsSpecify`,run:()=>ae.specify()},{id:`stateStatistics`,run:()=>Sn.collectStatistics()},{id:`stateForms`,run:()=>Sn.defineStateForms()},{id:`provinces`,run:()=>xn.generate()},{id:`provincePoles`,run:()=>xn.getPoles()},{id:`riversSpecify`,run:()=>p.specify()},{id:`featureNames`,run:()=>m.defineNames()},{id:`markets`,run:()=>t.generate()},{id:`production`,run:()=>tn.produce()},{id:`taxes`,run:()=>ln.collect()},{id:`military`,run:()=>Cn.generate()},{id:`markers`,run:()=>Wi.generate()},{id:`zones`,run:()=>Ur.generate()},{id:`addedLabels`,run:()=>Qt.initiate()},{id:`journeys`,run:()=>Fn.generate()},{id:`legends`,run:()=>rt.initiate()}]),Ki=new Vr(`Erase Heightmap`,[{id:`markupGrid`,run:()=>m.markupGrid()},{id:`depressionLakes`,run:({erosion:e})=>e&&dn.addDeepDepressionLakes()},{id:`nearSeaLakes`,run:({erosion:e})=>e&&dn.openNearSeaLakes()},{id:`temperatures`,run:()=>bn.generate()},{id:`precipitation`,run:()=>We.generate()},{id:`regraph`,run:()=>P.generate()},{id:`markupPack`,run:()=>m.markupPack()},{id:`rivers`,run:({erosion:e})=>p.generate(e)},{id:`biomes`,run:()=>_n.define()},{id:`featureGroups`,run:()=>m.defineGroups()},{id:`ice`,run:()=>yn.generate()},{id:`goods`,run:()=>W.generate()},{id:`rankCells`,run:()=>x.rankCells()},{id:`cultures`,run:()=>Gr.generate()},{id:`culturesExpand`,run:()=>Gr.expand()},{id:`burgs`,run:()=>ae.generate()},{id:`states`,run:()=>Sn.generate()},{id:`routes`,run:()=>S.generate()},{id:`development`,run:()=>Te.generate()},{id:`religions`,run:()=>ti.generate()},{id:`burgsSpecify`,run:()=>ae.specify()},{id:`stateStatistics`,run:()=>Sn.collectStatistics()},{id:`stateForms`,run:()=>Sn.defineStateForms()},{id:`provinces`,run:()=>xn.generate()},{id:`provincePoles`,run:()=>xn.getPoles()},{id:`riversSpecify`,run:()=>p.specify()},{id:`featureNames`,run:()=>m.defineNames()},{id:`markets`,run:()=>t.generate()},{id:`production`,run:()=>tn.produce()},{id:`taxes`,run:()=>ln.collect()},{id:`military`,run:()=>Cn.generate()},{id:`markers`,run:()=>Wi.generate()},{id:`zones`,run:()=>Ur.generate()}]),qi=/^hatch\d+$/,Ji=`#000000`,Yi=100,Xi=new class{fill(e,t,n=Yi){return`url(#${e}${t===Ji?``:`-${t.slice(1)}`}${n===Yi?``:`-s${n}`})`}bases(){return this.#e().filter(({id:e})=>qi.test(e))}parse(e){let t=e.match(On);return t?{hatch:t[1],color:t[2]?`#${t[2]}`:Ji,size:t[3]?+t[3]:Yi}:null}recolor(e,t,n,r=Yi){let i=e.cloneNode(!0);i.id=t;for(let e of i.querySelectorAll(`*`))e.style.stroke&&(e.style.stroke=n),e.style.fill&&(e.style.fill=n);if(r!==Yi){let e=i.getAttribute(`patternTransform`)??``;i.setAttribute(`patternTransform`,`${e} scale(${r/Yi})`.trim())}return i}ensure(e){let t=this.parse(e);if(!t)return;let n=e.slice(5,-1),r=j(t.hatch);r&&!j(n)&&r.parentElement.append(this.recolor(r,n,t.color,t.size))}sync(){let e=new Set(Zi());for(let t of e)this.ensure(t);for(let t of this.#e())!qi.test(t.id)&&!e.has(`url(#${t.id})`)&&t.remove()}#e(){return Array.from(document.querySelectorAll(`#defs-hatching > pattern`))}};function Zi(){let{biomes:e,cultures:t,states:n,religions:r,provinces:i,zones:a,markets:o,legends:s}=pack;return[...[e,t,n,r,i,a,o].flat().map(e=>e?.color),...s.flatMap(({items:e})=>e.map(e=>e[1]))].filter(e=>typeof e==`string`)}function Qi(){O.eraseAll();for(let e of M(`deftemp`).querySelectorAll(`path, clipPath, svg`))e.remove();qe(),M(`coas`).innerHTML=``,Ye(),He.releaseAll()}var $i=`standard`;function ea(e){$i=e}var ta=()=>$i!==`standard`,na=()=>$i===`globe`,ra=`fmg-help-token`,ia=`fmg-help-signin-pending`,aa=`#token=`,oa=()=>localStorage.getItem(ra),sa=e=>localStorage.setItem(ra,e),ca=()=>localStorage.removeItem(ra);function la(){if(!location.hash.startsWith(aa))return;let e=sessionStorage.getItem(ia)===`1`;sessionStorage.removeItem(ia),e&&sa(location.hash.slice(7)),history.replaceState(null,``,location.pathname+location.search)}function ua(e){sessionStorage.setItem(ia,`1`),location.assign(e)}var da=6e4;function fa(){let e=Date.now();async function t(){let t=options.app.autosave.interval;if(t&&!options.map.viewOnly&&!((Date.now()-e)/da<t)){if(options.app.mode)return I(w(`Autosave: map cannot be saved in edit mode`),!1,`warn`,2e3);try{I(w(`Autosave: saving map...`),!1,`warn`,3e3),await U.Save.writeToStorage(await U.Save.prepareMapData(),`auto`),I(w(`Autosave: map is saved`),!1,`success`,2e3),e=Date.now()}catch(e){D.error(e),I(w(`Autosave failed: {{error}}`,{error:e?.message||w(`Unknown error`)}),!0,`error`,4e3)}}}setInterval(t,da/2),ha()}var pa,ma=!1;function ha(){if(!options.app.autosave.remind)return;let e=[w(`Please don't forget to save the project to desktop from time to time`),w(`Please remember to save the map to your desktop`),w(`Saving will ensure your data won't be lost in case of issues`),w(`Safety is number one priority. Please save the map`),w(`Don't forget to save your map on a regular basis!`),w(`Just a gentle reminder for you to save the map`),w(`Please don't forget to save your progress (saving to desktop is the best option)`),w(`Don't want to get reminded about need to save? Press CTRL+Q`)];pa=setInterval(()=>{options.app.mode||I(L(e),!0,`warn`,2500)},15*da),ma=!0}function ga(){ma?(I(w(`Save reminder is turned off. Press CTRL+Q again to re-initiate`),!0,`warn`,2e3),clearInterval(pa),b.set(e=>e.app.autosave.remind=!1),ma=!1):(I(w(`Save reminder is turned on. Press CTRL+Q to turn off`),!0,`warn`,2e3),b.set(e=>e.app.autosave.remind=!0),ha())}var _a={"#terrs #landHeights":`#terrs > #landHeights`,"#terrs #oceanHeights":`#terrs > #oceanHeights`},va={"#map":{path:[`map`],options:{"data-filter":`dataFilter`},drop:[`background-color`]},"#armies":{path:[`military`],options:{"box-size":`boxSize`},drop:[`font-size`]},"#biomes":{path:[`biomes`],drop:[`mask`]},"#cells":{path:[`cells`],rename:{opacity:`stroke-opacity`}},"#gridOverlay":{path:[`grid`],options:{type:`type`,scale:`scale`,dx:`dx`,dy:`dy`}},"#coordinates":{path:[`coordinates`],rename:{"data-size":`font-size`},drop:[`font-size`]},"#compass":{path:[`compass`],drop:[`shape-rendering`]},"#compass > use":{path:[`compass`,`groups`,`compassRose`]},"#rivers":{path:[`rivers`,`groups`,`regular`]},"#freshwater":{path:[`lakes`,`groups`,`freshwater`]},"#salt":{path:[`lakes`,`groups`,`salt`]},"#sinkhole":{path:[`lakes`,`groups`,`sinkhole`]},"#frozen":{path:[`lakes`,`groups`,`frozen`]},"#lava":{path:[`lakes`,`groups`,`lava`]},"#dry":{path:[`lakes`,`groups`,`dry`]},"#sea_island":{path:[`coastline`,`groups`,`sea_island`],drop:[`auto-filter`,`stroke-dasharray`,`stroke-linecap`]},"#lake_island":{path:[`coastline`,`groups`,`lake_island`],drop:[`stroke-dasharray`,`stroke-linecap`]},"#terrs > #landHeights":{path:[`heightmap`,`groups`,`landHeights`],options:{scheme:`scheme`,terracing:`terracing`,skip:`skip`,relax:`relax`,curve:`curve`}},"#terrs > #oceanHeights":{path:[`heightmap`,`groups`,`oceanHeights`],options:{scheme:`scheme`,terracing:`terracing`,skip:`skip`,relax:`relax`,curve:`curve`,"data-render":`render`},bools:[`render`]},"#terrain":{path:[`relief`],options:{set:`set`,size:`size`,density:`density`}},"#relig":{path:[`religions`]},"#cults":{path:[`cultures`]},"#statesBody":{path:[`states`,`groups`,`statesBody`]},"#statesHalo":{path:[`states`,`groups`,`statesHalo`],rename:{"data-width":`stroke-width`},drop:[`stroke-width`]},"#provs":{path:[`provinces`],drop:[`data-size`,`fill`,`font-size`,`font-family`]},"#zones":{path:[`zones`]},"#stateBorders":{path:[`borders`,`groups`,`stateBorders`]},"#provinceBorders":{path:[`borders`,`groups`,`provinceBorders`]},"#roads":{path:[`routes`,`groups`,`roads`]},"#trails":{path:[`routes`,`groups`,`trails`]},"#searoutes":{path:[`routes`,`groups`,`searoutes`]},"#journeys":{path:[`journeys`]},"#temperature":{path:[`temperature`],rename:{opacity:`stroke-opacity`}},"#ice":{path:[`ice`]},"#prec":{path:[`precipitation`]},"#population":{path:[`population`]},"#rural":{path:[`population`,`groups`,`rural`]},"#urban":{path:[`population`,`groups`,`urban`]},"#emblems":{path:[`emblems`]},"#texture":{path:[`texture`],options:{"data-href":`href`,"data-x":`x`,"data-y":`y`}},"#goodsCells":{path:[`goods`,`groups`,`goodsCells`]},"#goodsIcons":{path:[`goods`,`groups`,`goodsIcons`],options:{"data-size":`size`,"data-circle":`circle`},bools:[`circle`]},"#goodsBurgs":{path:[`goods`,`groups`,`goodsBurgs`],options:{"data-size":`size`}},"#markets":{path:[`markets`],options:{"data-size":`size`,"font-size":`iconSize`,"data-icon":`icon`},strings:[`icon`],drop:[`opacity`,`fill`]},"#tradeAnimation":{path:[`trade`]},"#markers":{path:[`markers`],drop:[`rescale`]},"#ruler":{path:[`rulers`],rename:{"data-size":`font-size`}},"#scaleBar":{path:[`scaleBar`],options:{"data-bar-size":`barSize`,"data-x":`x`,"data-y":`y`,"data-label":`label`},strings:[`label`]},"#scaleBarBack":{path:[`scaleBar`,`groups`,`back`],options:{"data-top":`top`,"data-right":`right`,"data-bottom":`bottom`,"data-left":`left`}},"#legend":{path:[`legend`],options:{"data-columns":`columns`},rename:{"data-size":`font-size`},drop:[`data-x`,`data-y`]},"#legendBox":{path:[`legend`,`groups`,`box`]},"#fogging":{path:[`fogging`]},"#vignette":{path:[`vignette`]},"#vignette-rect":{path:[`vignette`],options:{x:`x`,y:`y`,width:`width`,height:`height`,rx:`rx`,ry:`ry`,filter:`filter`},ownAttrs:!1},"#oceanLayers":{path:[`ocean`,`groups`,`oceanLayers`],options:{layers:`outline`},strings:[`outline`]},"#oceanBase":{path:[`ocean`,`groups`,`base`]},"#oceanicPattern":{path:[`ocean`,`groups`,`pattern`]},"#landmass":{path:[`landmass`]}},ya={lakes:[`freshwater`,`salt`,`sinkhole`,`frozen`,`lava`,`dry`],routes:[`trails`,`roads`,`searoutes`]},ba=Object.keys(G.defaults.routes.groups),xa=Object.keys(G.defaults.lakes.groups),Sa=new Set([`fill`,`stroke`,`color`,`shore`]),Ca=Object.keys(Object.values(G.defaults.labels.groups)[0].attrs),wa=Object.keys(Object.values(G.defaults.burgIcons.groups)[0].groups.icons.attrs);async function Ta(e,t){let n=t?Be(t):void 0;return n&&Ea(n),Oa(e,{hasStyleRecord:!!n}),JSON.stringify(styles)}function Ea(e){let t=typeof e==`object`&&e?e:{};if(t.labels?.groups&&(styles.labels.groups=Object.fromEntries(Object.entries(t.labels.groups).map(([e,t])=>[e,Qa(t)]))),t.burgIcons||t.anchors){let e=styles.burgIcons.groups,n=new Set([...Object.keys(t.burgIcons??{}),...Object.keys(t.anchors??{})]);for(let r of n)e[r]={groups:{icons:to(t.burgIcons?.[r]),anchors:no(t.anchors?.[r])}}}t.relief&&(styles.relief.options={...styles.relief.options,set:ce.sets.find(e=>e===t.relief?.set)??`simple`,size:po(t.relief.size,1),density:po(t.relief.density,.4)})}function Da(e=document){let t={};for(let[n,r]of Object.entries(Na())){let i=va[n],a=i.ownAttrs===!1?[]:uo(i.path),o=e.querySelector(n);if(o)t[n]=Ia(o,r,a);else{let r=Pa(i,e),o=r?a.filter(e=>r.hasAttribute(e)):[];o.length&&(t[n]=Object.fromEntries(o.map(e=>[e,null])))}}for(let n of e.querySelectorAll(`#labels > *`)){let e=n.dataset.group||n.id.replace(/^labels-/,``);e&&(t[`#labels > #${e}`]=Ia(n,[...Ca,`data-dx`,`data-dy`,`data-size`],Ca))}for(let n of e.querySelectorAll(`#routes > g`))n.id&&(n.dataset.group=n.id),n.id&&!ba.includes(n.id)&&(t[`#routes > g#${n.id}`]=Ia(n,Object.keys(Object.values(G.defaults.routes.groups)[0].attrs)));for(let n of e.querySelectorAll(`#lakes > g`))n.id&&(n.dataset.group=n.id),n.id&&!xa.includes(n.id)&&(t[`#lakes > g#${n.id}`]=Ia(n,Object.keys(G.defaults.lakes.groups.freshwater.attrs),[]));for(let n of e.querySelectorAll(`#burgIcons > g`))n.id&&(t[`#burgIcons > g#${n.id}`]=Ia(n,[...wa,`font-size`,`size`,`data-icon`],wa));for(let n of e.querySelectorAll(`#anchors > g`))n.id&&(t[`#anchors > g#${n.id}`]=Ia(n,[...wa,`font-size`,`size`,`data-icon`],wa));for(let n of[`stateEmblems`,`provinceEmblems`,`burgEmblems`]){let r=e.querySelector(`#emblems > #${n}`);r&&(t[`#emblems > #${n}`]=Ia(r,[`data-size`],[]))}return Za(t,{onUnknown:`skip`})}function Oa(e,{hasStyleRecord:t=!1}={}){let n=Da(e);n.labels=structuredClone(styles.labels),t&&Object.keys(styles.burgIcons.groups).length&&(n.burgIcons.groups=structuredClone(styles.burgIcons.groups)),n.relief.options=structuredClone(styles.relief.options);let r={regions:[n.states.groups.statesBody],terrs:Object.values(n.heightmap.groups),lakes:Object.values(n.lakes.groups),coastline:Object.values(n.coastline.groups),borders:Object.values(n.borders.groups),routes:Object.values(n.routes.groups),labels:Object.values(n.labels.groups),burgIcons:Object.values(n.burgIcons.groups).map(e=>e.groups.icons),anchors:Object.values(n.burgIcons.groups).map(e=>e.groups.anchors)};for(let[t,n]of Object.entries(r)){let r=e.getElementById(t)?.getAttribute(`opacity`);if(r!=null)for(let e of n)e.attrs.opacity=Number(r)||null}e.getElementById(`legend`)?.hasAttribute(`data-columns`)||(n.legend.options.columns=styles.legend.options.columns);for(let t of[`stateEmblems`,`provinceEmblems`,`burgEmblems`])e.getElementById(t)?.hasAttribute(`data-size`)||(n.emblems.groups[t].options=structuredClone(styles.emblems.groups[t].options));e.getElementById(`goodsIcons`)?.hasAttribute(`data-size`)||(n.goods.groups.goodsIcons.options.size=styles.goods.groups.goodsIcons.options.size),e.getElementById(`goodsBurgs`)?.hasAttribute(`data-size`)||(n.goods.groups.goodsBurgs.options=structuredClone(styles.goods.groups.goodsBurgs.options)),e.getElementById(`markets`)?.hasAttribute(`data-size`)||(n.markets.options.size=styles.markets.options.size);for(let t of[`landHeights`,`oceanHeights`])e.getElementById(t)?.hasAttribute(`scheme`)||(n.heightmap.groups[t].options=structuredClone(styles.heightmap.groups[t].options));e.getElementById(`armies`)?.hasAttribute(`box-size`)||(n.military.options=structuredClone(styles.military.options)),e.getElementById(`gridOverlay`)?.hasAttribute(`type`)||(n.grid.options=structuredClone(styles.grid.options)),e.getElementById(`markets`)?.hasAttribute(`font-size`)||(n.markets.options.iconSize=styles.markets.options.iconSize),e.getElementById(`markets`)?.hasAttribute(`data-icon`)||(n.markets.options.icon=styles.markets.options.icon),e.getElementById(`goodsIcons`)?.hasAttribute(`data-circle`)||(n.goods.groups.goodsIcons.options.circle=styles.goods.groups.goodsIcons.options.circle),e.getElementById(`texture`)?.hasAttribute(`data-href`)||(n.texture.options=structuredClone(styles.texture.options)),e.getElementById(`oceanLayers`)?.hasAttribute(`layers`)||(n.ocean.groups.oceanLayers.options.outline=styles.ocean.groups.oceanLayers.options.outline),e.getElementById(`scaleBar`)?.hasAttribute(`data-bar-size`)||(n.scaleBar.options=structuredClone(styles.scaleBar.options)),e.getElementById(`scaleBarBack`)?.hasAttribute(`data-top`)||(n.scaleBar.groups.back.options=structuredClone(styles.scaleBar.groups.back.options));for(let t of O.all){let r=n[t.id]?.attrs,i=styles[t.id]?.attrs;if(!r||!i)continue;let a=e.getElementById(t.elementId);for(let e of Object.keys(t.params.attrs??{}))e in r&&!a?.hasAttribute(e)&&(r[e]=i[e])}Ja(n),G.set(n)}function ka(e){if(e in va)return va[e];let t=e.match(/^#labels > #(.+)$/);if(t)return{path:[`labels`,`groups`,t[1]],kind:`label`};let n=e.match(/^#burgIcons > g#(.+)$/);if(n)return{path:[`burgIcons`,`groups`,n[1],`groups`,`icons`],kind:`burg`};let r=e.match(/^#anchors > g#(.+)$/);if(r)return{path:[`burgIcons`,`groups`,r[1],`groups`,`anchors`],kind:`anchor`};let i=e.match(/^#routes > g#(.+)$/);if(i)return{path:[`routes`,`groups`,i[1]],kind:`route`};let a=e.match(/^#lakes > g#(.+)$/);if(a)return va[`#${a[1]}`]??{path:[`lakes`,`groups`,a[1]],kind:`lake`};let o=e.match(/^#emblems > #(.+)$/);if(o)return{path:[`emblems`,`groups`,o[1]],options:{"data-size":`size`}}}function Aa(e,t){if(e===`skip`)D.warn(t);else throw Error(t)}function ja(e,t,n,r,i){n.options&&!e.options&&(e.options={});let a=e.options,o={};for(let[e,r]of Object.entries(t))e!==`id`&&!n.drop?.includes(e)&&(o[e]=r);for(let[e,t]of Object.entries(n.rename??{}))e in o&&(o[t]=o[e],delete o[e]);let s={};for(let[e,t]of Object.entries(n.options??{})){if(!(e in o))continue;let c=yo(o[e]);delete o[e],t in s&&s[t]!==c?Aa(i,`unknown legacy attribute "${e}" on "${r}" conflicts for option "${t}"`):(s[t]=c,a&&(a[t]=n.bools?.includes(t)?!!Number(c):n.strings?.includes(t)&&c!=null?String(c):c))}if(e.attrs&&n.ownAttrs!==!1)for(let t of Object.keys(o))t in e.attrs&&(e.attrs[t]=bo(t,o[t]),delete o[t]);for(let e of Object.keys(o))Aa(i,`unknown legacy attribute "${e}" on "${r}"`)}function Ma(e){let t=ge(G.defaults,e);return t?.attrs?Object.keys(t.attrs):[]}function Na(){let e={};for(let[t,n]of Object.entries(va)){let r=n.ownAttrs===!1?[]:Ma(n.path);e[t]=[...new Set([...r,...Object.keys(n.options??{}),...Object.keys(n.rename??{}),...n.drop??[]])]}return e}function Pa(e,t){if(e.path.length<2)return null;let n=O.all.find(({id:t})=>t===e.path[0]);return n?t.querySelector(`#${n.elementId}`):null}function Fa(e){if(e===``)return``;let t=Number(e);return Number.isNaN(t)?e:t}function Ia(e,t,n=t){let r={};for(let i of t){let t=e.style?.[i],a=typeof t==`string`&&t?t:e.getAttribute(i);if(a!=null){let e=Fa(a);r[i]=Sa.has(i)&&typeof e==`string`?Nn(e):e}else n.includes(i)&&(r[i]=null)}return r}function La(e,...t){for(let n of t){if(!Xa(e)){let t=e[n];if(t)return t;continue}let t=ka(n),r=t&&ge(e,t.path);if(r?.attrs)return r.attrs}}function Ra(e,t){let n=(e,t={})=>{let n=new Set([`id`,`style`,`data-layer`,`data-group`,...Object.keys(t)]);return Array.from(e.attributes).every(e=>n.has(e.name))},r=(t,r,i)=>{let a=e.getElementById(t);if(r&&a?.tagName===`g`&&n(a,i))for(let[e,n]of Object.entries(r))n!==null&&n!==`null`&&(t===`terrain`&&[`set`,`size`,`density`].includes(e)||a.setAttribute(e,String(n)))};for(let e of O.all){r(e.elementId,La(t,`#${e.elementId}`),e.params.attrs);for(let n of e.children)r(n.id,La(t,`#${n.id}`,`#${e.elementId} > #${n.id}`),n.attrs);for(let n of ya[e.id]??[])r(n,La(t,`#${n}`,`#${e.elementId} > #${n}`))}}var za=new Set([`filter`,`mask`,`stroke-dasharray`]),Ba=new Set([`stroke-linecap`,`stroke-linejoin`]),Va={"map.attrs.filter":s,"ocean.groups.pattern.attrs.href":zn},Ha=(e,t)=>{let n=Number.parseFloat(t);return Number.isFinite(n)?`${n}${e[0]===`labels`&&e[1]===`groups`?`%`:`px`}`:t},q=e=>typeof e==`object`&&e?e:void 0,Ua={borders:[`stateBorders`,`provinceBorders`],coastline:[`sea_island`,`lake_island`],compass:[`compassRose`],emblems:[`stateEmblems`,`provinceEmblems`,`burgEmblems`],goods:[`goodsCells`,`goodsIcons`,`goodsBurgs`],heightmap:[`landHeights`,`oceanHeights`],legend:[`box`],ocean:[`base`,`pattern`,`oceanLayers`,`oceanWaves`],population:[`rural`,`urban`],scaleBar:[`back`],states:[`statesBody`,`statesHalo`]};function Wa(e){let t=(e,t)=>{let n=q(e[t]);return n||(n={},e[t]=n),n};for(let[n,r]of Object.entries(Ua)){let i=q(e[n]);if(!i)continue;let a=t(i,`groups`);for(let e of r)i[e]!==void 0&&(a[e]=i[e],delete i[e])}let n=q(e.burgIcons);if(!n)return;let r=q(n.burgIcons)?.groups,i=q(n.anchors)?.groups;if(!r&&!i)return;let a=t(n,`groups`),o=e=>t(t(a,e),`groups`);for(let[e,t]of Object.entries(r??{}))o(e).icons=t;for(let[e,t]of Object.entries(i??{}))o(e).anchors=t;delete n.burgIcons,delete n.anchors}function Ga(e){let t=q(e);if(!t)return;Wa(t);let n=e=>typeof e==`number`?`${e}px`:e,r=e=>e.attrs??={},i=(e,t,n,i=e=>e)=>{let a=q(e),o=a?.options;a&&o&&(o[t]!==void 0&&(r(a)[n]=i(o[t])),delete o[t],Object.keys(o).length||delete a.options)},a=(e,t,n)=>{let r=q(e);r&&r[t]!==void 0&&(r[n]=r[t],delete r[t])};i(t.map,`dataFilter`,`filter`,e=>e?`url(#filter-${e})`:null);let o=q(t.ocean);if(o){let e=q(o.groups);if(e||(e={},o.groups=e),o.options&&`pattern`in o.options){let{pattern:t,patternOpacity:n}=o.options;e.pattern={attrs:{href:t,opacity:n??1}},delete o.options.pattern,delete o.options.patternOpacity}}i(q(q(t.states)?.groups)?.statesHalo,`width`,`stroke-width`);let s=q(t.military);s?.options&&delete s.options.fontSize,s?.attrs&&delete s.attrs[`font-size`];let c=q(t.labels);c&&delete c.attrs,i(t.coordinates,`fontSize`,`font-size`,n),i(t.rulers,`fontSize`,`font-size`,n),i(t.legend,`fontSize`,`font-size`,n);let l=q(t.legend)?.options;if(l)for(let e of[`x`,`y`])delete l[e];let u=q(t.scaleBar);u?.attrs&&(u.attrs[`font-size`]=n(u.attrs[`font-size`]??10)),a(q(t.temperature)?.attrs,`opacity`,`stroke-opacity`),a(q(t.cells)?.attrs,`opacity`,`stroke-opacity`);let d=q(t.biomes);d?.attrs&&delete d.attrs.mask,a(q(t.markets)?.options,`fontSize`,`iconSize`);let f=q(t.markers);f?.options&&delete f.options.rescale;let p=q(q(q(t.coastline)?.groups)?.sea_island);p&&delete p.options;for(let e of[`sea_island`,`lake_island`]){let n=q(q(q(t.coastline)?.groups)?.[e])?.attrs;if(n)for(let e of[`stroke-dasharray`,`stroke-linecap`])delete n[e]}let m=q(t.markets)?.attrs;if(m)for(let e of[`fill`,`opacity`])delete m[e];let h=q(t.compass)?.attrs;h&&delete h[`shape-rendering`];let g=q(q(q(t.heightmap)?.groups)?.landHeights);g?.options&&delete g.options.render,Ka(t)}function Ka(e){let t=q(q(e)?.rivers);if(!t?.attrs||t.groups)return;let n=structuredClone(G.defaults.rivers.groups);Object.assign(n.regular.attrs,t.attrs),t.groups=n,delete t.attrs}function qa(e){typeof e==`object`&&e&&Ga(e);let t=(e,n,r)=>{if(typeof e==`object`&&e)for(let[i,a]of Object.entries(e)){if(typeof a==`object`){t(a,[...n,i],i===`attrs`||i===`options`);continue}if(!r||typeof a!=`string`)continue;let o=a.trim(),s=Va[[...n,i].join(`.`)];e[i]=s?o in s?o:null:za.has(i)&&o===``||Ba.has(i)&&o===`inherit`?null:i===`font-size`?Ha(n,o):i===`icon`&&(n[0]===`burgIcons`||n[0]===`markets`)?io(oo(o)??``):o}};return t(e,[],!1),Ja(e),e}function Ja(e){let t=(e,n)=>{if(typeof e==`object`&&e)for(let[r,i]of Object.entries(e))typeof i==`object`?t(i,r===`attrs`||r===`options`):n&&typeof i==`string`&&Sa.has(r)&&(e[r]=Nn(i))};t(e,!1)}function Ya(e){return Object.keys(e).some(e=>e.startsWith(`#`))}function Xa(e){return typeof e==`object`&&!!e&&`map`in e}function Za(e,t={}){let n=t.onUnknown??`throw`,r=structuredClone(G.defaults);for(let[t,i]of Object.entries(e)){let e=_a[t]??t,a=ka(e);if(!a){Aa(n,`unknown legacy selector "${e}"`);continue}if(a.kind){if(a.kind===`burg`||a.kind===`anchor`){let e=a.path[2],t=r.burgIcons.groups,n=t[e]??structuredClone(t.town??Object.values(t)[0]);a.kind===`burg`?n.groups.icons=to(i):n.groups.anchors=no(i),t[e]=n;continue}let t=ge(r,a.path.slice(0,-1));if(!t){Aa(n,`unknown legacy selector "${e}"`);continue}let o=a.kind===`label`?Qa:a.kind===`lake`?co:so;t[a.path.at(-1)]=o(i);continue}let o=ge(r,a.path);o?ja(o,i,a,e,n):Aa(n,`unknown legacy selector "${e}"`)}return G.parse(qa(r))}function Qa(e){let t=e,n=J(t.opacity,1);return{attrs:{opacity:n===0?1:n,fill:Y(t.fill,`#3e3e4b`),"fill-opacity":J(t[`fill-opacity`],null),stroke:Y(t.stroke,`#3a3a3a`),"stroke-opacity":J(t[`stroke-opacity`],null),"stroke-width":J(t[`stroke-width`],0)??0,"stroke-dasharray":Y(t[`stroke-dasharray`],null),"stroke-linecap":vo(t[`stroke-linecap`],mo),"stroke-linejoin":vo(t[`stroke-linejoin`],ho),"letter-spacing":J(t[`letter-spacing`],0),"font-size":Y(t[`data-size`],null)??Y(t[`font-size`],`18%`)??`18%`,"font-family":Y(t[`font-family`],`Almendra SC`)??`Almendra SC`,"font-style":vo(t[`font-style`],go),"font-weight":vo(J(t[`font-weight`],null),te),"text-decoration":vo(t[`text-decoration`],_o),style:$a(t),filter:Y(t.filter,null)}}}function $a(e){let t=po(e[`data-dx`],0),n=po(e[`data-dy`],0),r=t||n?`transform: translate(${t}em, ${n}em)`:``;return eo([Y(e.style,null),r].filter(Boolean).join(`; `))}function eo(e){return(e||``).split(`;`).map(e=>e.trim()).filter(e=>e&&!/^display\s*:/.test(e)).join(`; `)||null}function to(e){let t=e??{};return{attrs:{opacity:J(t.opacity,null),fill:Y(t.fill,null),"fill-opacity":J(t[`fill-opacity`],null),stroke:Y(t.stroke,null),"stroke-opacity":J(t[`stroke-opacity`],null),"stroke-width":J(t[`stroke-width`],null),"stroke-dasharray":Y(t[`stroke-dasharray`],null),"stroke-linecap":vo(t[`stroke-linecap`],mo),"stroke-linejoin":vo(t[`stroke-linejoin`],ho),filter:Y(t.filter,null)},options:{size:po(t[`font-size`],po(t.size,1)),icon:io(oo(Y(t[`data-icon`],null))??`burgs-atlas-circle`)}}}function no(e){let t=to(e);return t.options.icon===`burgs-atlas-circle`&&(t.options.icon=`ports-anchor`),t}function ro(e){if(oe.fileOf(e))return!0;let t=oe.setForId(e);return(t?oe.get(t).aliases?.(oe.files(t))??[]:[]).some(({name:n})=>oe.symbolId(t,n)===e)}function io(e){let t=e.trim(),n=t.startsWith(`#`)?t.slice(1):t;return fe.glyphText(n)!==null||fe.kind(n)===`custom`||ro(n)?n:fe.glyph(t)}function ao(e){let t=new Map;for(let n of e){let e=n.icon;if(!e)continue;if(!Vn(e)){n.icon=io(e);continue}let r=t.get(e);r||(r=re.add({kind:`image`,content:e,viewBox:me}).id,t.set(e,r)),n.icon=r}}function oo(e){let t=e?.match(/^#icon-(.+)$/)?.[1];return t?t===`anchor`||t===`harbor`?`ports-${t}`:t.startsWith(`watabou-`)||t.startsWith(`illustrated-`)?`burgs-${t}`:`burgs-atlas-${t}`:e}function so(e){let t=e;return{attrs:{opacity:J(t.opacity,null),stroke:Y(t.stroke,null),"stroke-opacity":J(t[`stroke-opacity`],null),"stroke-width":J(t[`stroke-width`],null),"stroke-dasharray":Y(t[`stroke-dasharray`],null),"stroke-linecap":vo(t[`stroke-linecap`],mo),"stroke-linejoin":vo(t[`stroke-linejoin`],ho),filter:Y(t.filter,null),mask:vo(t.mask,[`url(#land)`,`url(#water)`])}}}function co(e,t=G.defaults.lakes.groups.freshwater){let n=structuredClone(t),r=n.attrs;for(let[t,n]of Object.entries(e))t in r&&(r[t]=bo(t,n));return n}function lo(e,t){return co(Ia(e,Object.keys((t??G.defaults.lakes.groups.freshwater).attrs),[]),t)}function uo(e){let t=Bn;for(let n of[...e,`attrs`])t=fo(t)?.shape?.[n];let n=fo(t)?.shape;return n?Object.keys(n).filter(e=>n[e].safeParse(null).success):[]}var fo=e=>typeof e==`object`&&e?e:void 0;function po(e,t){let n=Number(e);return Number.isFinite(n)?n:t}function J(e,t){return e===void 0?t:e===null?null:po(e,0)}function Y(e,t){return e===void 0||e===``?t:e===null?null:String(e)}var mo=Object.keys(we),ho=Object.keys(d),go=Object.keys(Ee),_o=Object.keys(r);function vo(e,t){return t.includes(e)?e:null}function yo(e){return e===`null`?null:e}function bo(e,t){return[`stroke-dasharray`,`font-size`].includes(e)&&typeof t==`number`?String(t):yo(t)}function xo(e){let t=t=>{let n=Number(e.get(t));return Number.isFinite(n)&&n>0?n:void 0};return{width:t(`width`),height:t(`height`)}}var So={};function Co(e){Object.assign(So,e)}function wo(e=options.app.ui.assistant===`show`){let t=j(`assistantBubble`);t&&(t.style.display=e?`flex`:`none`)}function To(e){let t=j(`assistantBubble`);t?.classList.toggle(`open`,e),t?.setAttribute(`aria-expanded`,String(e))}var Eo=/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/,Do=()=>new URL(window.location.href).searchParams;async function Oo(){let e=Do(),t=xo(e),n=e.get(`maplink`);if(n){if(D.warn(`Load map from URL`),Eo.test(n)){setTimeout(()=>U.Load.loadMapFromURL(n,!0),1e3);return}U.Load.showUploadErrorMessage(w(`Map link is not a valid URL`),n)}if(e.get(`seed`))D.warn(`Generate map for seed`,e.get(`seed`)),await ko(t);else{if(options.app.onLoad===`lastSaved`)try{let e=await U.BrowserSaves.latest(),t=e&&await U.BrowserSaves.read(e.id);if(t){D.warn(`Loading last stored map`),U.Load.uploadMap(t);return}}catch(e){D.error(e)}D.warn(`Generate random map`),ko(t)}}async function ko(e){await C.StylePresetsEditor.applyOnLoad(),await So.generate(e),So.applyLayersPreset(),O.drawAll(),Jt(),Ao(),wo()}function Ao(){let e=Do();if(So.applyURLLayers(e),e.get(`from`)===`MFCG`&&document.referrer){let t=e.get(`seed`)??``;if(t.length===13)e.set(`burg`,t.slice(-4));else{jo(e);return}}let t=e.get(`scale`),n=e.get(`cell`),r=e.get(`burg`);if(!t&&!n&&!r)return;let i=+(t??0)||8;if(n){let[e,t]=pack.cells.p[+n];Yn(e,t,i,1600)}else if(r){let e=Number.isNaN(+r)?pack.burgs.find(e=>e.name===r):pack.burgs[+r];e&&Yn(e.x,e.y,i,1600)}else Yn(+(e.get(`x`)??0)||options.map.graph.width/2,+(e.get(`y`)??0)||options.map.graph.height/2,i,1600)}function jo(e){let{cells:t}=pack,n=pack.burgs;if(n.length<2)return void D.error(`Cannot select a burg for MFCG`);let r=+(e.get(`size`)??0),i=+(e.get(`coast`)??0),a=+(e.get(`port`)??0),o=+(e.get(`river`)??0),s=(e,r,i)=>r&&i?n.filter(e=>e.port&&t.r[e.cell]):!r&&e&&i?n.filter(e=>!e.port&&t.t[e.cell]===1&&t.r[e.cell]):!e&&!i?n.filter(e=>t.t[e.cell]!==1&&!t.r[e.cell]):!e&&i?n.filter(e=>t.t[e.cell]!==1&&t.r[e.cell]):e&&i?n.filter(e=>t.t[e.cell]===1&&t.r[e.cell]):[],c=s(i,a,o);c.length||(c=s(i,!a,!o)),c.length||(c=s(!i,0,!o)),c.length||(c=[n[1]]);let l=e=>Math.abs((e.population??0)-r),u=or(c,(e,t)=>l(e)-l(t)),d=u===void 0?0:c[u].i;if(!d)return void D.error(`Cannot select a burg for MFCG`);let f=n[d];for(let[e,t]of new URL(document.referrer).searchParams)e===`name`?f.name=t:e===`size`?f.population=+t:e===`seed`?f.MFCG=t:e===`shantytown`?f.shanty=+t:f[e]=+t;let p=e.get(`name`);p&&p!==`null`&&(f.name=p);let m=N(`#labels [data-label-type='burg'][data-id='${d}']`);m.empty()||m.text(f.name??``).classed(`drag`,!0).on(`mouseover`,function(){N(this).classed(`drag`,!1),m.on(`mouseover`,null)}),Yn(f.x,f.y,8,1600),I(w(`Here stands the glorious city of {{burg}}`,{burg:f.name}),!0,`success`,15e3)}function Mo(){let e=!document.querySelectorAll(`i.icon-lock`).length,t=`?seed=${M(`seedInput`).value}&width=${options.map.graph.width}&height=${options.map.graph.height}${e?`&options=default`:``}`;navigator.clipboard.writeText(location.host+location.pathname+t).then(()=>I(w(`Map URL is copied to clipboard`),!1,`success`,3e3)).catch(e=>I(w(`Could not copy URL: {{error}}`,{error:String(e)}),!1,`error`,5e3))}var No=e=>{let{parentNode:t,host:n,defaultView:r}=e,i=t||n||r;return i?[e,...No(i)]:[e]};function Po(e){let t=e.currentTarget;if(!t||!pack.cells?.p)return;let n=dt(e,t),r=P.findCell(n[0],n[1]);if(r===void 0)return;Io(e);let i=dn.findCell(n[0],n[1]);j(`tooltip`)?.dataset.main?Dt():Ro(n,e,r,i)}var Fo=null;function Io(e){if(j(`notesEditor`))return;let t=u.resolveTarget(e.target instanceof Element?e.target:null),n=t&&u.key(t),r=t&&In.get(t);if(t&&r){if(Fo===n)return;Fo=n??null;let e=j(`notes`);e&&(e.style.display=`block`);let i=j(`notesHeader`);i&&(i.textContent=u.getName(t));let a=j(`notesBody`);a&&(a.innerHTML=r);return}if(options.app.notesPinned||j(`markerEditor`)||e.shiftKey)return;let i=j(`notes`);i&&(i.style.display=`none`);let a=j(`notesHeader`);a&&(a.innerHTML=``);let o=j(`notesBody`);o&&(o.innerHTML=``),Fo=null}function Lo(e){let[t,n]=hn(e,pack);return w(`Cell population: {{total}}; Rural: {{rural}}; Urban: {{urban}}`,{total:Pe(t+n),rural:Pe(t),urban:Pe(n)})}function Ro(e,t,n,r){I(``);let i=t.target,a=t.composedPath?t.composedPath():No(i);if(!a[a.length-8])return;let o=a[a.length-7].id,s=pack.cells.h[n]>=20,c=zo({group:o,target:i,event:t,path:a,cellId:n});c===void 0?qo(e,n,r,s):I(c)}function X(e,t=w(`Click to edit`)){return options.map.viewOnly?e||void 0:e?T(e,t):t}function zo({group:e,target:t,event:n,path:r,cellId:i}){let a=t.parentNode,o=t.closest(`[data-label-type='burg'][data-id], #burgIcons [data-id]`);if(o){let e=Number(o.dataset.id),t=pack.burgs[e];if(!t)return X();let n=Pe((t.population||0)*options.map.units.population.scale*options.map.units.population.urbanization.rate),r={burg:t.name,group:t.group,population:n},i=t.port?w(`{{burg}} {{group}} port`,r):w(`{{burg}} {{group}}`,r);return X(T(i,`${w(`Population`)}: ${n}`))}let s=t.closest(`#labels [data-label-type]`);if(s)return X(E(Bo(s)));if(e===`armies`)return X(E(a.dataset.name??``));if(e===`emblems`&&t.tagName===`use`)return Vo(t,a,n);if(e===`rivers`){let e=u.resolveTarget(t);return X(E(e?u.getName(e):``))}if(e===`routes`){let e=u.resolveTarget(t);if(e&&u.get(e)){let t=u.getName(e);return X(t?E(t):void 0)}}else{if(e===`terrain`||e===`ice`)return X();if(e===`markers`)return X(void 0,w(`Click to edit the Marker. Hold Shift to not close the assosiated note`));if(e===`ruler`)return j(`measurersEditor`)?w(`Drag the measurer or its points to edit`):w(`Measurers Editor`);if(e===`markets`)return Ho(t)??``;if(e===`goods`)return Ko(t,i)??``;if(e===`lakes`&&pack.cells.h[i]<20){let e=pack.features[Number(t.dataset.f)],n=e?.name?[E(e.name)]:[],r=e?.subtype||`lake`;return X(T(...n,c[r]??r))}if(e===`zones`){let e=Number(r[r.length-8].dataset.id);return pack.zones.find(t=>t.i===e)?.name}if(e===`journeys`){let e=t.id?.match(/^segment(\d+)_(\d+)$/);if(e){let t=pack.journeys?.find(t=>t.i===+e[1]),n=t?.segments?.find(t=>t.i===+e[2]);if(t&&n){let e=E(`${t.name}: ${n.name}`);return X(n.note?T(e,`“${E(n.note)}”`):e)}}return X()}}}function Bo(e){let t=e.querySelectorAll(`tspan`);return(t.length?Array.from(t,e=>e.textContent??``).join(` `):e.textContent??``).replaceAll(`|`,` `).trim()}function Vo(e,t,n){let[r,i]=t.id===`burgEmblems`?[pack.burgs,`burg`]:t.id===`provinceEmblems`?[pack.provinces,`province`]:[pack.states,`state`],a=r[Number(e.dataset.i)];n.shiftKey&&rr(i,a),N(e).raise(),N(t).raise();let o=`fullName`in a&&a.fullName||a.name,s=w(i===`burg`?`{{name}} burg emblem`:i===`province`?`{{name}} province emblem`:`{{name}} state emblem`,{name:o});return X(T(s,w(`Hold Shift to show associated area or place`)))}function Ho(e){let n=e.closest(`[data-id]`);if(!n)return;let r=t.get(Number(n.dataset.id));if(r)return X(w(`{{burg}} market`,{burg:t.getName(r)}),w(`Click to view`))}function Uo(e,t=(e,t)=>`${t}`){return[...e].flatMap(([e,t])=>{let n=W.get(+e);return n&&t>0&&W.isDisplayed(n)?[{good:n,units:t,worth:t*n.value}]:[]}).sort((e,t)=>t.worth-e.worth).map(({good:e,units:n,worth:r})=>({good:e,worth:r,badge:Wo(e,t(e,n))}))}function Wo(e,t){return`<svg width="1.2em" height="1.2em" style="vertical-align: middle; margin: 0 0.1em 0 0.3em">${Xe(e)}</svg>${t}`}function Go(e,t){let n=e.dataset.cells?.split(`,`).map(Number)??[],r=Math.min(Math.max(0,n.indexOf(t)),n.length-2),i=n.length>1?tt.get(n[r],n[r+1]):void 0;if(!i)return;let a=Uo(i.goods,(e,t)=>{let n=ke(t,+(t<10));return e.unit?n===1?`${n} ${e.unit}`:`${n} ${e.unit}s`:`${n}`}),o=a.slice(0,5).map(({badge:e})=>e);a.length>5&&o.push(`…`);let s=o.join(` `);return i.water?w(`By water a day: {{- goods}}`,{goods:s}):w(`By land a day: {{- goods}}`,{goods:s})}function Ko(e,t){if(e.closest(`#goodsTraffic`))return Go(e,t);let n=e.closest(`#goodsIcons [data-i]`);if(n){let e=W.get(Number(n.dataset.i));if(!e)return;let t=an.ofCell(Number(n.dataset.cell))[e.i]||0;return w(`Deposit production: {{- production}}`,{production:Wo(e,`${t}`)})}if(e.closest(`#goodsCells`)){let e=Uo(Object.entries(an.ofCell(t))).map(({badge:e})=>e).join(` `);return w(`Cell rural production: {{- production}}`,{production:e})}if(e.closest(`#goodsBurgs`)){let t=e.closest(`[data-id]`),n=t&&pack.burgs[Number(t.dataset.id)];if(!n||n.removed)return;N(t).raise();let r=e.closest(`[data-goods]`)?.dataset.goods?.split(`,`).map(Number),i=Uo(Object.entries(tn.getBurgProduction(n))),a=i.reduce((e,{worth:t})=>e+t,0)||1,o=i.filter(({good:e})=>!r||r.includes(e.i)).map(({badge:e,worth:t})=>{let n=t/a*100;return`${e} (${n<1?`<1`:ke(n)}%)`}).join(` `);return X(w(`{{burg}} urban production: {{- production}}`,{burg:n.name,production:o}),w(`Click to view`))}}function qo(e,t,n,r){let{cells:i}=pack;if(O.isOn(`precipitation`)&&r)return void I(w(`Annual Precipitation: {{value}}`,{value:mn(t,pack,grid)}));if(O.isOn(`population`))return void I(Lo(t));if(O.isOn(`temperature`))return void I(`${w(`Temperature`)}: ${pn(grid.cells.temp[n])}`);if(tr()&&i.development?.[t])I(nr(i.development[t]));else if(O.isOn(`biomes`)&&i.biome[t]){let e=i.biome[t];I(`${w(`Biome`)}: ${E(pack.biomes[e].name)}`)}else if(O.isOn(`religions`)&&i.religion[t]){let e=i.religion[t],n=pack.religions[e],r=n.name;if(n.type===`Cult`)return void I(`${w(`Cult`)}: ${E(r)}`);if(n.type===`Heresy`)return void I(`${w(`Heresy`)}: ${E(r)}`);if(n.type===`Folk`)return void I(`${w(`Folk religion`)}: ${E(r)}`);I(`${w(`Organized religion`)}: ${E(r)}`)}else if(i.state[t]&&(O.isOn(`provinces`)||O.isOn(`states`))){let e=i.state[t],n=i.province[t],r=n?`${pack.provinces[n].fullName}, `:``;I(r+pack.states[e].fullName)}else if(O.isOn(`cultures`)&&i.culture[t]){let e=i.culture[t],n=pack.cultures[e],r=n?.ancestry?.trim(),a=r?`${n.name} (${r})`:n?.name||``;I(`${w(`Culture`)}: ${E(a)}`)}else{if(O.isOn(`cells`))return void I(`${w(`Cell`)}: ${t} (${w(`Grid`)}: ${n})`);if(O.isOn(`heightmap`))return void I(`${w(`Height`)}: ${fn(e,pack,grid)}`)}}var Jo=ot(Po,100);function Yo(){$n(),N(`#viewbox`).style(`cursor`,`default`).on(`.drag`,null).on(`click`,ts).on(`contextmenu`,ns).on(`touchmove mousemove`,Jo),N(`#legend`).on(`mousemove`,()=>I(T(w(`Drag to change the position`),w(`Click to hide the legend box`)))).on(`click`,Xo).call(At().on(`start`,Ve)),N(`#scaleBar`).on(`mousemove`,()=>I(w(`Units Editor`))).on(`click`,()=>C.UnitsEditor.open())}function Xo(e){let t=nt(e)?.dataset.legend;t&&et.hide(t)}var Zo={ice:e=>C.IceEditor.open(e),terrain:e=>C.ReliefEditor.open(e),goodsCells:()=>C.GoodsEditor.open(),goodsTraffic:()=>C.GoodsEditor.open()},Qo={emblems:e=>C.EmblemsEditor.open(void 0,void 0,void 0,e),routes:e=>C.RouteEditor.open(e.id),rivers:e=>C.RiverEditor.open(e.id),journeys:(e,t)=>C.JourneyEditor.open(Number(t.id.replace(`journey`,``))),markers:e=>C.MarkersEditor.open(void 0,e),ruler:()=>C.MeasurersEditor.open(),goodsIcons:()=>C.GoodsEditor.open(),goodsBurgs:(e,t)=>C.BurgEconomyOverview.open(Number(t.dataset.id)),lakes:e=>C.LakesEditor.open(e),tradeAnimation:(e,t)=>C.TradeDetails.open(N(t).datum()),markets:(e,t)=>{e.classList.contains(`pin`)&&C.MarketOverview.open(Number(t.dataset.id))}},$o={burgIcons:e=>C.BurgEditor.open(Number(e.dataset.id)),markers:e=>C.MarkersEditor.open(void 0,e),ruler:()=>C.MeasurersEditor.open(),armies:(e,t)=>C.RegimentEditor.open(`#${t.id}`)};function es(e){let t=e,n=t.parentElement,r=n?.parentElement,i=r?.parentElement,a=i?.parentElement;if(!n||!r||!i||!a)return!1;let o=t.closest(`#labels text[data-label-type]`);if(o){let e=Number(o.dataset.id),t=o.dataset.labelType;return t===`burg`?j(`burgEditor`)?.dataset.burgId===String(e)?C.LabelsEditor.open(t,e):C.BurgEditor.open(e):C.LabelsEditor.open(t,e),!0}let s=Zo[n.id]||Qo[r.id]||$o[i.id];return s?.(t,n),!!s}function ts(e){e?.target&&!options.map.viewOnly&&es(e.target)}function ns(e){e.shiftKey||options.app.mode||options.map.viewOnly||(e.preventDefault(),C.ContextMenu.open(e))}async function rs(){la(),Wn(),Mr(),Ln(),b.restore(),await b.restoreIcons(),ao(options.map.military.units),oc(),Ic(),Je(options.map.graph.width,options.map.graph.height),Yo(),zr()||(Er(),await Oo()),fa()}async function is(e){try{let{seed:t,graph:n,width:r,height:i,points:a,jitter:o}=e||{};b.setGraphSize(r,i),Or(t),b.randomize(),fe.syncCustom(),n&&(a!==void 0&&(options.map.graph.points=a),o!==void 0&&(options.map.graph.jitter=o),options.map.graph.sampling=n.sampling),Yt(),await Gi.run({graph:n}),Xi.sync(),b.persist(),oc(),wt(),Jn()}catch(e){D.error(e),kt(),F.message({message:`${w(`An error has occurred on map generation. Please retry.`)}<br>${w(`If error is critical, clear the stored data and try again.`)}
      <p id="errorBox">${ct(e)}</p>`,title:w(`Generation error`),width:`32em`,buttons:[{label:w(`Cleanup data`),onClick:()=>(Ht(),!1)},{label:w(`Regenerate`),onClick:()=>{as(`generation error`)}},{label:w(`Ignore`)}]})}}var as=ot(async e=>{let t=typeof e==`string`?e:`user request`;D.warn(`Generate new random map: ${t}`);let n=a(options.generation.graph.density)>1e4;n&&Tr(),F.closeAll(`#worldConfigurator, #options3d`,{minimized:!0}),options.app.mode=null,Gn(1e3),Qi(),await is(typeof e==`string`?void 0:e),O.drawAll(),ta()&&C.View3d.redraw(),j(`worldConfigurator`)?.offsetParent&&C.WorldConfigurator.open(),Jt(),n&&Er(),kt()},250);function os(e){if(options.app.mode){I(w(`New map cannot be generated when edit mode is active, please exit the mode and retry`),!1,`error`);return}let t=Tt.at(-1);(t?(Date.now()-t.registeredAt)/6e4:0)<1?as(e):F.confirm({title:w(`Generate New Map`),message:`${w(`Are you sure you want to generate a new map?`)}<br>${w(`All unsaved changes made to the current map will be lost`)}`,confirm:w(`Generate`),onConfirm:()=>{F.closeAll(),as(e)}})}var ss=`advancedOptions`,cs={default:{label:w(`Default`),sampling:`square`,jitter:St},organicHexes:{label:w(`Organic hexes`),sampling:`hexPointy`,jitter:.5},pointyHexBoard:{label:w(`Hex board (pointy)`),sampling:`hexPointy`,jitter:0},flatHexBoard:{label:w(`Hex board (flat)`),sampling:`hexFlat`,jitter:0},squareBoard:{label:w(`Square board`),sampling:`square`,jitter:0},isometricBoard:{label:w(`Isometric board`),sampling:`diamond`,jitter:0}};function ls({sampling:e,jitter:t}){return Object.entries(cs).find(([,n])=>n.sampling===e&&n.jitter===t)?.[0]??`custom`}var us=({label:e,tip:t,control:n,icon:r=``})=>`
  <tr data-tip="${t}">
    <td>${r}</td>
    <td>${e}</td>
    <td>${n}</td>
  </tr>`,ds=(...e)=>`<div class="inline">${e.join(``)}</div>`,fs=e=>`<i data-locked="0" id="lock_${e}" class="icon-lock-open"></i>`,ps=(e,t)=>`<slider-input id="${e}" data-option="${e}" ${t}></slider-input>`,ms=(e,t,n=!1)=>`<option value="${e}" ${n?`disabled`:``}>${t}</option>`,hs=()=>Object.entries(cs).map(([e,{label:t}])=>ms(e,t)).join(``)+ms(`custom`,w(`Custom`),!0),gs=()=>[us({label:w(`Map size`),tip:w(`Coordinate extent of the next map, fixed for its life. The Viewport size in Options is only how much of it you see. For full-globe maps use aspect ratio 2:1`),icon:`<i data-tip="${w(`Reset to default`)}" id="restoreDefaultMapSize" class="icon-ccw"></i>`,control:ds(`<input id="mapWidthInput" data-option="mapWidth" type="number" min="240" />`,`<span>x</span>`,`<input id="mapHeightInput" data-option="mapHeight" type="number" min="135" />`)}),us({label:w(`Lattice`),tip:w(`Ready-made sampling and jitter pairs. Regular boards need jitter 0`),control:`<select id="graphPreset" data-option="graphPreset">${hs()}</select>`}),us({label:w(`Sampling`),tip:w(`The lattice the map cells are built on. Square with high jitter is the classic natural look`),control:`<select id="sampling" data-option="sampling">${Ct.map(e=>ms(e,f[e])).join(``)}</select>`}),us({label:w(`Jitter`),tip:w(`How far cell centers move off the lattice. 0 keeps perfectly regular cells, higher values look more natural`),control:ps(`jitter`,`min="0" max="${gt}" step="0.05"`)}),us({label:w(`Provinces ratio`),tip:w(`Set what share of eligible burgs in each state will become province centers. Higher values create more provinces`),icon:fs(`provincesRatio`),control:ps(`provincesRatio`,`min="0" max="100"`)}),us({label:w(`Size variety`),tip:w(`Define how much states and cultures can vary in size. Defines expansionism value`),icon:fs(`sizeVariety`),control:ps(`sizeVariety`,`min="0" max="10" step=".1"`)}),us({label:w(`Growth rate`),tip:w(`Set the growth rate of states and cultures. Determines how much land stays neutral`),icon:fs(`growthRate`),control:ps(`growthRate`,`min=".1" max="2" step=".1"`)})].join(``),_s=()=>[us({label:w(`Autosave interval`),tip:w(`Set autosave interval in minutes. Set 0 to disable autosave. Map is saved to browser memory`),control:ps(`autosaveInterval`,`min="0" max="60" step="1"`)}),us({label:w(`On load`),tip:w(`Set what Generator should do on load`),control:`
        <select id="onloadBehavior" data-option="onloadBehavior">
          ${ms(`random`,w(`Generate random map`))}
          ${ms(`lastSaved`,w(`Open last saved map`))}
        </select>`}),us({label:w(`Speaker voice`),tip:w(`Select speech synthesis voice to pronounce generated names`),control:ds(`<select id="speakerVoice" data-option="speakerVoice"></select>`,`<span id="speakerTest" data-tip="${w(`Click to test the voice`)}" style="cursor: pointer">🔊</span>`)}),us({label:w(`Emblem shape`),tip:w(`Select emblem shape. Can be changed individually in the Emblem Editor`),control:ds(`<select id="emblemShape" data-option="emblemShape">${xs()}</select>`,`<svg class="emblemShapePreview" viewBox="0 0 200 210"><path id="emblemShapeImage" /></svg>`)})].join(``),vs={economy:{label:w(`Economy`),tip:w(`The Economy Overview shows every step of the burg's run: what it weighed before making each good, every market it could have bought from with the price at its door, and the goods that could cover each need. Recorded from the next production run, about three times slower`)},temperature:{label:w(`Temperature`),tip:w(`Log sea temperatures by latitude to the console when the climate is generated`)},cloud:{label:w(`Cloud storage`),tip:w(`Log cloud storage responses to the console`)}},ys=()=>ze.map(e=>us({label:vs[e].label,tip:vs[e].tip,control:`<input id="debug_${e}" data-debug="${e}" class="checkbox" type="checkbox" /><label for="debug_${e}" class="checkbox-label"></label>`})).join(``),bs=[[w(`Diversiform`),[[`culture`,w(`Culture-specific`)],[`random`,w(`Culture-random`)],[`state`,w(`State-specific`)]]],[w(`Basic`),[[`heater`,w(`Heater`)],[`spanish`,w(`Spanish`)],[`french`,w(`French`)]]],[w(`Regional`),[[`horsehead`,w(`Horsehead`)],[`horsehead2`,w(`Horsehead Edgy`)],[`polish`,w(`Polish`)],[`hessen`,w(`Hessen`)],[`swiss`,w(`Swiss`)]]],[w(`Historical`),[[`boeotian`,w(`Boeotian`)],[`roman`,w(`Roman`)],[`kite`,w(`Kite`)],[`oldFrench`,w(`Old French`)],[`renaissance`,w(`Renaissance`)],[`baroque`,w(`Baroque`)]]],[w(`Specific`),[[`targe`,w(`Targe`)],[`targe2`,`${w(`Targe`)} 2`],[`pavise`,w(`Pavise`)],[`wedged`,w(`Wedged`)],[`embowed`,w(`Embowed`)]]],[w(`Banner`),[[`flag`,w(`Flag`)],[`pennon`,w(`Pennon`)],[`guidon`,w(`Guidon`)],[`banner`,w(`Banner`)],[`dovetail`,w(`Dovetail`)],[`gonfalon`,w(`Gonfalon`)],[`pennant`,w(`Pennant`)]]],[w(`Simple`),[[`round`,w(`Round`)],[`oval`,w(`Oval`)],[`vesicaPiscis`,w(`Vesica Piscis`)],[`square`,w(`Square`)],[`diamond`,w(`Diamond`)],[`hexagon`,w(`Hexagon`)]]],[w(`Fantasy`),[1,2,3,4,5].map(e=>[`fantasy${e}`,`${w(`Fantasy`)} ${e}`])],[w(`Middle Earth`),[[`noldor`,w(`Noldor`)],[`gondor`,w(`Gondor`)],[`easterling`,w(`Easterling`)],[`erebor`,w(`Erebor`)],[`ironHills`,w(`Iron Hills`)],[`urukHai`,w(`UrukHai`)],[`moriaOrc`,w(`Moria Orc`)]]]];function xs(){return bs.map(([e,t])=>`<optgroup label="${e}">${t.map(([e,t])=>ms(e,t)).join(``)}</optgroup>`).join(``)}function Ss(){let e=ss;return`
    <div id="${e}" class="dialog" style="display: none">
      <style>
        #${e} table { border-collapse: collapse; }
        #${e} th { text-align: left; font-style: italic; padding-top: 0.5em; }
        #${e} td:last-child { width: 13em; }
        #${e} td:last-child > *, #${e} .inline > :is(select, input) { width: 100%; }
        #${e} .inline { display: flex; align-items: center; gap: 0.3em; }
        #${e} slider-input input[type="range"] { flex: 1; }
        #${e} slider-input input[type="number"] { width: 3.5em; }
        #${e} i { cursor: pointer; }
      </style>
      <table>
        <tr><th colspan="3">${w(`Map settings (apply to new maps)`)}</th></tr>
        ${gs()}
        <tr><th colspan="3">${w(`Interface settings`)}</th></tr>
        ${_s()}
        <tr data-tip="${w(`Diagnostics for checking how the generator works. They may change the view and record more, but never what is saved in the map file`)}"><th colspan="3">${w(`Debugging`)}</th></tr>
        ${ys()}
      </table>
    </div>`}function Cs(){F.closeAll(`#${ss}, .stable`),F.open(ss,{title:w(`Advanced Options`),width:`auto`,position:{my:`right top`,at:`right-10 top+10`,of:`svg`},buttons:[{label:w(`New Map`),onClick:()=>os()}],persistent:!0})}var ws={open:Cs},Ts={quality:{shapeRendering:`geometricPrecision`,stateHalos:!0,viewportRedraw:`continuous`},balance:{shapeRendering:`optimizeSpeed`,stateHalos:!1,viewportRedraw:`continuous`},speed:{shapeRendering:`optimizeSpeed`,stateHalos:!1,viewportRedraw:`settled`}};function Es(e){let t=Object.keys(e);for(let[n,r]of Object.entries(Ts))if(t.every(t=>r[t]===e[t]))return n;return`custom`}var Ds=new Set;function Os(e){return Ds.add(e),()=>Ds.delete(e)}function ks(e){Object.hasOwn(Ts,e)&&js(t=>t.app.performance={...Ts[e]})}function As(e,t){js(n=>n.app.performance[e]=t)}function js(e){b.set(e),Ms();for(let e of Ds)e()}function Ms(){let{shapeRendering:e,stateHalos:t}=options.app.performance;j(`viewbox`)?.setAttribute(`shape-rendering`,e);let n=j(`statesHalo`);n&&(n.style.display=t?``:`none`,t&&pack.cells&&!n.childElementCount&&O.draw(`states`))}var Ns=`performanceSettings`,Ps=Ts.balance,Fs=[{key:`shapeRendering`,label:w(`Shape rendering`),tip:w(`SVG shape-rendering hint for the map. Crisp edges drops anti-aliasing. Chromium-based browsers rasterize on the GPU and ignore the hint for speed purposes, so it makes no difference there`),choices:[{value:`geometricPrecision`,label:w(`Geometric precision`)},{value:`auto`,label:w(`Auto`)},{value:`optimizeSpeed`,label:w(`Optimize speed`)},{value:`crispEdges`,label:w(`Crisp edges`)}]},{key:`stateHalos`,label:w(`State halos`),tip:w(`Blurred glow along state borders. It is an SVG blur filter, which is costly on big maps`),choices:[{value:`true`,label:w(`Shown`)},{value:`false`,label:w(`Hidden`)}]},{key:`viewportRedraw`,label:w(`Redraw on zoom`),tip:w(`When labels, icons and relief are redrawn and text re-sized during a zoom or pan. 'After zoom' does it once per gesture: faster on big maps, but new content appears all at once`),choices:[{value:`continuous`,label:w(`While zooming`)},{value:`settled`,label:w(`After zoom`)}]}],Is={quality:w(`Quality`),balance:w(`Balance`,{context:`preset`}),speed:w(`Speed`),custom:w(`Custom`)};function Ls(){F.closeAll(`#${Ns}, .stable`),Rs();let e=Os(Bs);F.open(Ns,{title:w(`Performance Settings`),position:{my:`right top`,at:`right-10 top+10`,of:`svg`},onClose:()=>{e(),F.destroy(Ns)}})}function Rs(){F.destroy(Ns),M(`dialogs`).insertAdjacentHTML(`beforeend`,Hs());for(let{key:e}of Fs){let t=M(`${Ns}_${e}`);t.addEventListener(`change`,()=>zs(e,t.value)),M(`${Ns}_${e}Reset`).addEventListener(`click`,()=>zs(e,String(Ps[e])))}}function zs(e,t){e===`stateHalos`?As(e,t===`true`):As(e,t)}function Bs(){let e=options.app.performance;for(let{key:t}of Fs)M(`${Ns}_${t}`).value=String(e[t]);M(`${Ns}Preset`).textContent=Vs()}var Vs=()=>Is[Es(options.app.performance)];function Hs(){let e=options.app.performance,t=Fs.map(({key:t,label:n,tip:r,choices:i})=>{let a=String(e[t]);return`
      <tr data-tip="${r}">
        <td>${n}</td>
        <td><select id="${Ns}_${t}" style="width: 100%">${i.map(e=>`<option value="${e.value}" ${e.value===a?`selected`:``}>${e.label}</option>`).join(``)}</select></td>
        <td>
          <button id="${Ns}_${t}Reset" data-tip="${w(`Reset to the Balance preset value`)}"
            style="font-size: .85em; padding: 1px 5px; margin-left: .3em">↺</button>
        </td>
      </tr>`}).join(``);return`
    <div id="${Ns}" class="dialog" style="display: none">
      <p data-tip="${w(`The preset on the Options tab these settings amount to`)}" style="margin: 0 0 .5em">
        ${w(`Preset`)}: <b id="${Ns}Preset">${Vs()}</b>
      </p>
      <table style="border-collapse: collapse; width: 100%">
        <tbody>${t}</tbody>
      </table>
    </div>`}var Us={open:Ls},Ws={"africa-centric":{id:0,name:w(`Africa Centric`)},arabia:{id:1,name:w(`Arabia`)},atlantics:{id:2,name:w(`Atlantics`)},britain:{id:3,name:w(`Britain`)},caribbean:{id:4,name:w(`Caribbean`)},"east-asia":{id:5,name:w(`East Asia`)},eurasia:{id:6,name:w(`Eurasia`)},europe:{id:7,name:w(`Europe`)},"europe-accented":{id:8,name:w(`Europe Accented`)},"europe-and-central-asia":{id:9,name:w(`Europe and Central Asia`)},"europe-central":{id:10,name:w(`Europe Central`)},"europe-north":{id:11,name:w(`Europe North`)},greenland:{id:12,name:w(`Greenland`)},hellenica:{id:13,name:w(`Hellenica`)},iceland:{id:14,name:w(`Iceland`)},"indian-ocean":{id:15,name:w(`Indian Ocean`)},"mediterranean-sea":{id:16,name:w(`Mediterranean Sea`)},"middle-east":{id:17,name:w(`Middle East`)},"north-america":{id:18,name:w(`North America`)},"us-centric":{id:19,name:w(`US-centric`)},"us-mainland":{id:20,name:w(`US Mainland`)},world:{id:21,name:w(`World`,{context:`heightmap`})},"world-from-pacific":{id:22,name:w(`World from Pacific`)}},Gs=w(`Click to lock the option and always use the current value on new map generation`),Ks=w(`Click to unlock the option and allow it to be randomized on new map generation`),qs=e=>e.dataset.ids?e.dataset.ids.split(`,`):[e.id.slice(5)];function Js(e,t){for(let n of e.querySelectorAll(`[data-locked]`)){let e=qs(n);n.addEventListener(`mouseover`,e=>{e.stopPropagation(),I(n.className===`icon-lock`?Ks:Gs)}),n.addEventListener(`click`,()=>{let r=n.className!==`icon-lock`;for(let n of e)r?v.set(n,t(n)):v.clear(n)})}Ys()}function Ys(){let e=v.all();for(let t of document.querySelectorAll(`[data-locked]`)){let n=qs(t).some(t=>Object.hasOwn(e,t));t.dataset.locked=n?`1`:`0`,t.className=n?`icon-lock`:`icon-lock-open`}}v.subscribe(Ys);var Xs={mapWidth:{read:e=>e.generation.graph.width,update:mc,pin:`mapWidth`,event:`change`},mapHeight:{read:e=>e.generation.graph.height,update:mc,pin:`mapHeight`,event:`change`},seed:{read:e=>e.map.seed,update:kr,event:`change`},graphPreset:{read:e=>ls(e.generation.graph),update:gc},sampling:Z({read:e=>e.generation.graph.sampling,write:(e,t)=>e.generation.graph.sampling=t,parse:e=>e,effect:()=>ac(`graphPreset`)}),jitter:Z({read:e=>e.generation.graph.jitter,write:(e,t)=>e.generation.graph.jitter=t,parse:Number,effect:()=>ac(`graphPreset`)}),points:Z({read:e=>e.generation.graph.density,write:(e,t)=>e.generation.graph.density=t,parse:Number,pin:`points`,effect:lc}),template:Z({read:e=>e.generation.template,write:(e,t)=>e.generation.template=t,parse:String,pin:`template`}),resolveDepressionsSteps:Z({read:e=>e.generation.resolveDepressionsSteps,write:(e,t)=>e.generation.resolveDepressionsSteps=t,parse:Number,pin:`resolveDepressionsSteps`}),lakeElevationLimit:Z({read:e=>e.generation.lakeElevationLimit,write:(e,t)=>e.generation.lakeElevationLimit=t,parse:Number,pin:`lakeElevationLimit`,effect:()=>options.app.mode===`heightmap`&&C.HeightmapEditor.redrawDrainage()}),cultures:Z({read:e=>e.generation.cultures.limit,write:(e,t)=>e.generation.cultures.limit=t,parse:Number,pin:`cultures`,effect:uc}),culturesSet:Z({read:e=>e.generation.cultures.set,write:(e,t)=>{e.generation.cultures.set=t,b.capCultures()},parse:String,pin:`culturesSet`,effect:uc}),statesNumber:Z({read:e=>e.generation.states.limit,write:(e,t)=>e.generation.states.limit=t,parse:Number,pin:`statesNumber`}),provincesRatio:Z({read:e=>e.generation.provinces.ratio,write:(e,t)=>e.generation.provinces.ratio=t,parse:Number,pin:`provincesRatio`}),religionsNumber:Z({read:e=>e.generation.religions.limit,write:(e,t)=>e.generation.religions.limit=t,parse:Number,pin:`religionsNumber`}),manors:Z({read:e=>e.generation.burgs.limit,write:(e,t)=>e.generation.burgs.limit=t,parse:Number,pin:`manors`,effect:cc}),sizeVariety:Z({read:e=>e.generation.states.sizeVariety,write:(e,t)=>e.generation.states.sizeVariety=e.generation.cultures.sizeVariety=t,parse:Number,pin:`sizeVariety`}),growthRate:Z({read:e=>e.generation.states.growthRate,write:(e,t)=>e.generation.states.growthRate=e.generation.cultures.growthRate=t,parse:Number,pin:`growthRate`}),uiSize:Z({read:e=>e.app.ui.size,write:(e,t)=>e.app.ui.size=t,parse:Number,effect:yc,event:`change`}),tooltipSize:Z({read:e=>e.app.ui.tooltipSize,write:(e,t)=>e.app.ui.tooltipSize=t,parse:Number,effect:xc}),azgaarAssistant:Z({read:e=>e.app.ui.assistant,write:(e,t)=>e.app.ui.assistant=t,parse:e=>e===`hide`?`hide`:`show`,effect:e=>wo(e===`show`)}),speakerVoice:Z({read:e=>e.app.ui.speakerVoice||null,write:(e,t)=>e.app.ui.speakerVoice=t,parse:String}),emblemShape:Z({read:e=>e.app.emblems.shape,write:(e,t)=>e.app.emblems.shape=t,parse:String,effect:vc}),performancePreset:{read:e=>Es(e.app.performance),update:ks},onloadBehavior:Z({read:e=>e.app.onLoad,write:(e,t)=>e.app.onLoad=t,parse:e=>e===`lastSaved`?`lastSaved`:`random`}),autosaveInterval:Z({read:e=>e.app.autosave.interval,write:(e,t)=>e.app.autosave.interval=t,parse:Number}),viewportWidth:{read:()=>Ke.width,update:Dc,event:`change`},viewportHeight:{read:()=>Ke.height,update:Dc,event:`change`},zoomExtentMin:{read:e=>e.app.zoomExtent.min,update:Ec,event:`change`},zoomExtentMax:{read:e=>e.app.zoomExtent.max,update:Ec,event:`change`},themeHue:{read:e=>A(e.app.ui.themeColor).h,update:wc},themeColor:{read:e=>e.app.ui.themeColor,update:e=>Sc(e,options.app.ui.transparency)},transparency:{read:e=>e.app.ui.transparency,update:e=>Sc(options.app.ui.themeColor,+e)}};function Z(e){let{read:t,write:n,parse:r,pin:i,effect:a,event:o}=e;return{read:t,pin:i,event:o,update(e){let t=r(e);b.set(e=>n(e,t)),i&&v.set(i,t),a?.(t)}}}var Zs=new Intl.Collator,Qs=Object.entries(Re).sort(([e,t],[n,r])=>e===`en`?-1:n===`en`?1:Zs.compare(t,r)),$s=`
  <p data-tip="${w(`Settings for the next map. Generate a new map to apply them`)}">
    ${w(`Map settings (apply to new maps)`)}:
  </p>
  <table>
    <tr
      data-tip="${w(`Map seed number. Press 'Enter' to apply. A seed reproduces the same map only if the map size and the settings are the same`)}"
    >
      <td>
        <i
          data-tip="${w(`Show seed history to apply a previous seed`)}"
          id="optionsMapHistory"
          class="icon-hourglass-1"
        ></i>
      </td>
      <td>${w(`Map seed`)}</td>
      <td>
        <input id="seedInput" data-option="seed" class="long" type="number" min="1" max="999999999" step="1" />
      </td>
      <td>
        <i
          data-tip="${w(`Copy map seed as URL. It will produce the same map only if options are default or the same`)}"
          id="optionsCopySeed"
          class="icon-docs"
        ></i>
      </td>
    </tr>
    <tr
      data-tip="${w(`Set number of points to be used for graph generation. Highly affects performance. 10K is the only recommended value`)}"
    >
      <td>
        <i data-locked="0" id="lock_points" class="icon-lock-open"></i>
      </td>
      <td>${w(`Points number`)}</td>
      <td>
        <input
          id="pointsInput"
          data-option="points"
          type="range"
          min="1"
          max="13"
          value="4"
          data-cells="10000"
        />
      </td>
      <td>
        <output id="pointsOutputFormatted" data-option-output="points" style="color: #053305">10K</output>
      </td>
    </tr>
    <tr data-tip="${w(`Select template or precreated heightmap to be used on generation`)}">
      <td>
        <i data-locked="0" id="lock_template" class="icon-lock-open"></i>
      </td>
      <td>${w(`Heightmap`)}</td>
      <td id="templateInputContainer" class="pointer">
        <select id="templateInput" data-option="template" style="pointer-events: none"></select>
      </td>
      <td></td>
    </tr>
    <tr data-tip="${w(`Define how many Cultures should be generated`)}">
      <td>
        <i data-locked="0" id="lock_cultures" class="icon-lock-open"></i>
      </td>
      <td>${w(`Cultures number`)}</td>
      <td>
        <input id="culturesInput" data-option="cultures" type="range" min="1" />
      </td>
      <td>
        <input id="culturesOutput" data-option="cultures" type="number" min="1" />
      </td>
    </tr>
    <tr data-tip="${w(`Select a set of cultures to be used for names and cultures generation`)}">
      <td>
        <i data-locked="0" id="lock_culturesSet" class="icon-lock-open"></i>
      </td>
      <td>${w(`Cultures set`)}</td>
      <td>
        <select id="culturesSet" data-option="culturesSet">
          <option value="world" data-max="32" selected>${w(`All-world`)}</option>
          <option value="european" data-max="15">${w(`European`)}</option>
          <option value="oriental" data-max="13">${w(`Oriental`)}</option>
          <option value="english" data-max="10">${w(`English`)}</option>
          <option value="antique" data-max="10">${w(`Antique`)}</option>
          <option value="highFantasy" data-max="17">${w(`High Fantasy`)}</option>
          <option value="darkFantasy" data-max="18">${w(`Dark Fantasy`)}</option>
          <option value="random" data-max="100">${w(`Random`)}</option>
        </select>
      </td>
      <td></td>
    </tr>
    <tr data-tip="${w(`Define how many states and capitals should be generated`)}">
      <td>
        <i data-locked="0" id="lock_statesNumber" class="icon-lock-open"></i>
      </td>
      <td>${w(`States number`)}</td>
      <td colspan="2">
        <slider-input id="statesNumber" data-option="statesNumber" min="0" max="100"></slider-input>
      </td>
    </tr>
    <tr data-tip="${w(`Define a number of non-capital settlements to be placed (if enough suitable land exists)`)}">
      <td>
        <i data-locked="0" id="lock_manors" class="icon-lock-open"></i>
      </td>
      <td>${w(`Number of burgs`)}</td>
      <td>
        <input id="manorsInput" data-option="manors" type="range" min="0" max="1000" step="1" value="1000" />
      </td>
      <td>
        <output id="manorsOutput" data-option-output="manors" value="auto"></output>
      </td>
    </tr>
    <tr
      data-tip="${w(`Define how many organized religions and cults should be generated. Cultures will have their own folk religions in any case`)}"
    >
      <td>
        <i data-locked="0" id="lock_religionsNumber" class="icon-lock-open"></i>
      </td>
      <td>${w(`Religions number`)}</td>
      <td colspan="2">
        <slider-input
          id="religionsNumber"
          data-option="religionsNumber"
          min="0"
          max="50"
          step="1"
        ></slider-input>
      </td>
    </tr>
  </table>
  <p data-tip="${w(`Interface preferences saved in this browser. Changes apply immediately`)}">
    ${w(`Interface settings`)}:
  </p>
  <table>
    <tr data-tip="${w(`Select the interface language. It applies after a reload`)}">
      <td></td>
      <td>${w(`Language`)}</td>
      <td>
        <select id="interfaceLanguage">
          ${Qs.map(([e,t])=>`<option value="${e}" ${e===Le.language?`selected`:``}>${t}</option>`).join(``)}
        </select>
      </td>
      <td></td>
    </tr>
    <tr
      data-tip="${w(`Set user interface size. Please note browser zoom also affects interface size (Ctrl + or Ctrl - to change)`)}"
    >
      <td></td>
      <td>${w(`Interface size`)}</td>
      <td colspan="2">
        <slider-input id="uiSize" data-option="uiSize" min=".6" max="3" step=".1"></slider-input>
      </td>
    </tr>
    <tr data-tip="${w(`Set tooltip size`)}">
      <td></td>
      <td>${w(`Tooltip size`)}</td>
      <td colspan="2">
        <slider-input id="tooltipSize" data-option="tooltipSize" min="1" max="32" value="14"></slider-input>
      </td>
    </tr>
    <tr data-tip="${w(`Set theme hue for dialogs and tool windows`)}">
      <td>
        <i data-tip="${w(`Reset to default`)}" id="themeColorRestore" class="icon-ccw"></i>
      </td>
      <td>${w(`Theme color`)}</td>
      <td>
        <input id="themeHueInput" data-option="themeHue" type="range" min="0" max="359" />
      </td>
      <td>
        <input id="themeColorInput" data-option="themeColor" type="color" />
      </td>
    </tr>
    <tr data-tip="${w(`Set dialog and tool windows transparency`)}">
      <td></td>
      <td>${w(`Transparency`)}</td>
      <td colspan="2">
        <slider-input id="transparencyInput" data-option="transparency" min="0" max="100"></slider-input>
      </td>
    </tr>
    <tr data-tip="${w(`Rendering preset: visual quality traded for speed. Pick 'Speed' if the map feels slow`)}">
      <td></td>
      <td>${w(`Performance`)}</td>
      <td>
        <select id="performancePreset" data-option="performancePreset">
          <option value="quality">${w(`Quality`)}</option>
          <option value="balance" selected>${w(`Balance`,{context:`preset`})}</option>
          <option value="speed">${w(`Speed`)}</option>
          <option value="custom" disabled hidden>${w(`Custom`)}</option>
        </select>
      </td>
      <td>
        <i data-tip="${w(`Open the performance settings`)}" id="openPerformanceSettings" class="icon-cog"></i>
      </td>
    </tr>
    <tr data-tip="${w(`Toggle Azgaar Assistant (help bubble on the bottom right corner)`)}">
      <td></td>
      <td>${w(`Azgaar Assistant`)}</td>
      <td>
        <select id="azgaarAssistant" data-option="azgaarAssistant">
          <option value="show" selected>${w(`Show`)}</option>
          <option value="hide">${w(`Hide`)}</option>
        </select>
      </td>
    </tr>
    <tr
      data-tip="${w(`Size of the map window on screen. Independent of the map size: it is how much of the map you see at once. Set by hand it is remembered, until you fit it back to the window`)}"
    >
      <td>
        <i data-tip="${w(`Fit the viewport to the browser window`)}" id="viewportFit" class="icon-ccw"></i>
      </td>
      <td>${w(`Viewport size`)}</td>
      <td>
        <input id="viewportWidth" data-option="viewportWidth" class="paired" type="number" min="100" />
        <span>x</span>
        <input id="viewportHeight" data-option="viewportHeight" class="paired" type="number" min="100" />
        <span>px</span>
      </td>
      <td></td>
    </tr>
    <tr data-tip="${w(`Set minimum and maximum possible zoom level`)}">
      <td>
        <i data-tip="${w(`Reset to default`)}" id="zoomExtentDefault" class="icon-ccw"></i>
      </td>
      <td>${w(`Zoom extent`)}</td>
      <td>
        <span data-tip="${w(`Minimum possible zoom level (should be > 0)`)}">${w(`min`)}</span>
        <input
          data-tip="${w(`Minimum possible zoom level (should be > 0)`)}"
          id="zoomExtentMin" data-option="zoomExtentMin"
          class="paired"
          type="number"
          min=".2"
          step=".1"
          max="20"
          value="1"
        />
        <span data-tip="${w(`Maximum possible zoom level (should be > 1)`)}">${w(`max`)}</span>
        <input
          data-tip="${w(`Maximum possible zoom level (should be > 1)`)}"
          id="zoomExtentMax" data-option="zoomExtentMax"
          class="paired"
          type="number"
          min="1"
          max="50"
          value="20"
        />
      </td>
      <td>
        <i
          data-tip="${w(`Allow dragging the map beyond the canvas borders`)}"
          id="translateExtent"
          data-on="0"
          class="icon-hand-paper-o"
        ></i>
      </td>
    </tr>
  </table>
  <p data-tip="${w(`Open the map configurators or reset all options`)}">${w(`Configure`)}:</p>
  <div style="display: flex; flex-wrap: wrap; gap: 0.3em; margin: 0.3em 0.3em 0">
    <button
      id="configureWorld"
      style="flex: 1; min-width: max-content"
      data-tip="${w(`Open the World Configurator to set the map position on the globe and the world climate`)}"
    >
      ${w(`Climate`)}
    </button>
    <button
      id="setupLore"
      style="flex: 1; min-width: max-content"
      data-tip="${w(`Click to name the map, date its calendar and describe the world`)}"
    >
      ${w(`Lore`)}
    </button>
    <button
      id="openAdvancedOptions"
      style="flex: 1; min-width: max-content"
      data-tip="${w(`Open advanced options: settings for experienced users`)}"
    >
      ${w(`Advanced`)}
    </button>
    <button
      id="optionsReset"
      style="flex: 1; min-width: max-content"
      data-tip="${w(`Click to restore default options and reload the page`)}"
    >
      ${w(`Reset`)}
    </button>
  </div>
`,ec=new WeakMap;M(`optionsContent`).innerHTML=$s,M(`dialogs`).insertAdjacentHTML(`beforeend`,Ss()),tc(),Mc(),Os(()=>ac(`performancePreset`));function tc(){for(let e of[M(`options`),M(ss)])e.addEventListener(`input`,pc),e.addEventListener(`change`,pc);M(`interfaceLanguage`).addEventListener(`change`,e=>Pc(e.target));let e=e=>{let t=e.target;t.id===`restoreDefaultMapSize`?hc():t.id===`configureWorld`?C.WorldConfigurator.open():t.id===`setupLore`?C.LoreEditor.open():t.id===`optionsMapHistory`?Ar():t.id===`optionsCopySeed`?Mo():t.id===`templateInputContainer`?C.HeightmapSelection.open():t.id===`viewportFit`?Oc():t.id===`zoomExtentDefault`?kc():t.id===`translateExtent`?jc(t):t.id===`openPerformanceSettings`?Us.open():t.id===`speakerTest`?Nc():t.id===`themeColorRestore`?Cc():t.id===`openAdvancedOptions`?ws.open():t.id===`optionsReset`&&Gt()};M(`optionsContent`).addEventListener(`click`,e),M(ss).addEventListener(`click`,e),M(ss).addEventListener(`change`,nc)}function nc(e){if(!e.target.dataset.debug)return;let t=ze.filter(e=>j(`debug_${e}`)?.checked);b.set(e=>e.app.debug=t),b.persist(),D.setDebug(t)}function rc(){for(let e of ze){let t=j(`debug_${e}`);t&&(t.checked=options.app.debug.includes(e))}}function ic(e){return document.querySelectorAll(`:is(#options, #${ss}) [data-option="${e}"]`)}function Q(e){let t=ic(e)[0];if(!t)throw Error(`Missing option control: ${e}`);return t}function ac(e,t){let n=Xs[e].read(options);if(n!==null)for(let r of ic(e))r!==t&&(r.value=String(n),ec.delete(r))}function oc(){let e=ic(`template`)[0],t=options.generation.template;e&&t&&pt(e,t,Ce[t]?.name||Ws[t]?.name||t);for(let e of Object.keys(Xs))ac(e);cc(),lc(),uc(),dc(),sc(),rc()}function sc(){let e=!!options.map.viewOnly;document.body.classList.toggle(`view-only`,e),e&&j(`layersTab`)?.click();let t=j(`saveButton`);t&&(t.disabled=e,t.dataset.tip=w(e?`The map is in view-only mode and cannot be saved`:`Save fully-functional map file`))}function cc(){let e=M(`options`).querySelector(`[data-option-output="manors"]`);e&&(e.value=h()?w(`Auto`):String(options.generation.burgs.limit))}function lc(){let{density:e}=options.generation.graph,t=a(e),n=ic(`points`)[0];n&&(n.value=String(e),n.dataset.cells=String(t));let r=M(`options`).querySelector(`[data-option-output="points"]`);r&&(r.value=`${t/1e3}K`,r.style.color=o(t))}function uc(){let e=String(n[options.generation.cultures.set]?.max??0);for(let t of ic(`cultures`))t.max=e,t.value=String(options.generation.cultures.limit)}function dc(){let e=M(`options`).querySelector(`[data-option="pngResolution"]`);e&&(e.value=String(options.app.export.pngResolution))}function fc(e){return Object.values(Xs).find(t=>t.pin===e)?.read(options)??void 0}function pc(e){let t=e.target,n=t.dataset.option;if(!n||!Object.hasOwn(Xs,n))return;let r=Xs[n];(r.event!==`change`||e.type===`change`)&&((e.type!==`change`||ec.get(t)!==t.value)&&(r.update(t.value),ac(n,t)),e.type===`input`?ec.set(t,t.value):(ec.delete(t),b.persist()))}function mc(){let e=e=>{let t=Q(e),n=Math.max(+t.value||0,+t.min||1);return t.value=String(n),n},t=e(`mapWidth`),n=e(`mapHeight`);if(b.set(e=>{e.generation.graph.width=t,e.generation.graph.height=n}),v.set(`mapWidth`,t),v.set(`mapHeight`,n),options.generation.graph.width>window.innerWidth||options.generation.graph.height>window.innerHeight){let e=`${window.innerWidth} x ${window.innerHeight}`;I(w(`Map size is larger than the window ({{size}}). It can affect performance`,{size:e}),!1,`warn`,4e3)}}function hc(){b.set(e=>{e.generation.graph.width=window.innerWidth,e.generation.graph.height=window.innerHeight}),v.clear(`mapWidth`),v.clear(`mapHeight`),oc()}function gc(e){let t=cs[e];t&&(b.set(e=>Object.assign(e.generation.graph,{sampling:t.sampling,jitter:t.jitter})),ac(`sampling`),ac(`jitter`))}function _c(e){b.set(t=>t.generation.graph.density=e),lc()}function vc(e){_.setShape(e);let t=M(`emblemShapeImage`),{shieldPaths:n}=$e,r=n[e];r?t.setAttribute(`d`,r):t.removeAttribute(`d`);let i=[`culture`,`state`,`random`].includes(e)?null:e;if(e===`random`)for(let e of pack.cultures)e.removed||(e.shield=Gr.getRandomShield());for(let e of pack.states){if(!e.i||e.removed||!e.coa||`icon`in e.coa)continue;let t=i||_.getShield(e.culture??0);t!==e.coa.shield&&(e.coa.shield=t,$e.trigger(`stateCOA${e.i}`,e.coa))}for(let e of pack.provinces){if(!e.i||e.removed||!e.coa||`icon`in e.coa)continue;let t=i||_.getShield(pack.cells.culture[e.center]??0,e.state);t!==e.coa.shield&&(e.coa.shield=t,$e.trigger(`provinceCOA${e.i}`,e.coa))}for(let e of pack.burgs){if(!e.i||e.removed||!e.coa||`icon`in e.coa)continue;let t=i||_.getShield(e.culture??0,e.state);t!==e.coa.shield&&(e.coa.shield=t,$e.trigger(`burgCOA${e.i}`,e.coa))}}function yc(e){if(Number.isNaN(e)||e<.5)return;let t=Math.min(e,bc());Q(`uiSize`).value=String(t),document.body.style.fontSize=`${ke(t*10,2)}px`,M(`options`).style.width=`${t*300}px`}var bc=()=>ke(Math.min(window.innerHeight/465,window.innerWidth/302),1);function xc(e){M(`tooltip`).style.fontSize=`calc(${e}px + 0.5vw)`}function Sc(e,t){b.set(n=>{n.app.ui.themeColor=e,n.app.ui.transparency=t}),Tc(e,t)}function Cc(){Sc(ye,options.app.ui.transparency)}function wc(e){let{s:t,l:n}=A(options.app.ui.themeColor);Sc(A(+e,t,n).hex(),options.app.ui.transparency)}function Tc(e,t){Q(`transparency`).value=String(t);let n=(100-t)/100,r=Math.min(n+.3,1),{h:i,s:a,l:o}=A(e);Q(`themeColor`).value=e,Q(`themeHue`).value=String(i);let s=[[`--bg-opacity`,String(n)],[`--bg-main`,A(i,a,o,n).toString()],[`--bg-lighter`,A(i,a,o+.02,n).toString()],[`--bg-light`,A(i,a-.02,o+.06,n).toString()],[`--light-solid`,A(i,a+.01,o+.05,1).toString()],[`--dark-solid`,A(i,a,o-.2,1).toString()],[`--header`,A(i,a,o-.03,r).toString()],[`--header-active`,A(i,a,o-.09,r).toString()],[`--bg-disabled`,A(i,a-.04,o+.09).toString()],[`--bg-dialogs`,A(0,0,.98,n).toString()]];for(let[e,t]of s)document.documentElement.style.setProperty(e,t)}function Ec(e){let t=Q(`zoomExtentMin`),n=Q(`zoomExtentMax`);+t.value>+n.value&&([t.value,n.value]=[n.value,t.value]),Ac(Math.max(+t.value,.01),Math.min(+n.value,200)),er(Ae(+e,.01,200))}function Dc(){let e=+Q(`viewportWidth`).value,t=+Q(`viewportHeight`).value;e>0&&t>0&&(Kt(e,t),b.set(e=>e.app.viewport={width:Ke.width,height:Ke.height}))}function Oc(){b.set(e=>e.app.viewport=null),Jt()}function kc(){b.set(e=>e.app.zoomExtent.max=b.getDefaultOptions().app.zoomExtent.max),Q(`zoomExtentMax`).value=String(options.app.zoomExtent.max),qt(),er(options.app.zoomExtent.min)}function Ac(e,t){b.set(n=>n.app.zoomExtent={min:e,max:t}),Q(`zoomExtentMin`).value=String(e),Q(`zoomExtentMax`).value=String(t),qn(e,t),Qn()}function jc(e){let t=!+(e.dataset.on??0);e.dataset.on=String(+t);let{width:n,height:r}=options.map.graph;t?Kn(-n/2,-r/2,n*1.5,r*1.5):Kn(0,0,n,r)}function Mc(){let e=0,t=Q(`speakerVoice`),n=setInterval(()=>{let r=speechSynthesis.getVoices();if(r.length){clearInterval(n);for(let[e,n]of r.entries())t.options.add(new Option(n.name,String(e)));t.value=options.app.ui.speakerVoice||String(r.findIndex(e=>e.lang===`en-US`))}else{if(++e<10)return;clearInterval(n),t.options.length||t.options.add(new Option(w(`No voices available`),``))}},1e3)}function Nc(){let e=new SpeechSynthesisUtterance(w(`The quick brown fox jumps over the lazy dog`)),t=speechSynthesis.getVoices();t.length&&(e.voice=t[Number(options.app.ui.speakerVoice)]??e.voice),speechSynthesis.speak(e)}function Pc(e){let t=e.value;Fe(t)&&(b.set(e=>e.app.language=t),b.persist(),t!==Le.language&&F.confirm({title:w(`Change language`),message:T(w(`The interface switches to {{language}} after a reload`,{language:Re[t]}),w(`If you have unsaved changes, save the map first`)),confirm:w(`Reload`),cancel:w(`Not now`),onConfirm:()=>{window.onbeforeunload=null,location.reload()}}))}var Fc=()=>Ae(ke(window.innerWidth/1280,1),1,bc());function Ic(){let e=options.generation.template;if(e){let t=Ce[e]?.name||Ws[e]?.name||e;pt(Q(`template`),e,t)}Js(M(`options`),fc),Js(M(ss),fc);let{ui:t,emblems:n}=options.app;_.setShape(n.shape),xc(t.tooltipSize),Q(`uiSize`).setAttribute(`max`,String(bc())),yc(t.size??Fc()),Tc(t.themeColor,t.transparency),Ms(),qt()}var Lc={discord:k(`https://discordapp.com/invite/X7E84HU`,`Discord`),reddit:k(`https://www.reddit.com/r/FantasyMapGenerator`,`Reddit`),patreon:k(`https://www.patreon.com/azgaar`,`Patreon`)},Rc={armoria:k(`https://azgaar.github.io/Armoria`,`Armoria`),deorum:k(`https://deorum.vercel.app`,`Deorum`)},zc=`https://github.com/Azgaar/Fantasy-Map-Generator/wiki`,Bc={quickStart:k(`${zc}/Quick-Start-Tutorial`,w(`Quick start tutorial`)),qaa:k(`${zc}/Q&A`,w(`Q&A page`)),video:k(`https://youtube.com/playlist?list=PLtgiuDC8iVR2gIG8zMTRn7T_L0arl9h1C`,w(`Video tutorial`))},Vc=[k(`https://github.com/Azgaar/Fantasy-Map-Generator`,w(`GitHub repository`)),k(`https://github.com/Azgaar/Fantasy-Map-Generator/blob/master/LICENSE`,w(`License`)),k(`${zc}/Changelog`,w(`Changelog`)),k(`${zc}/Hotkeys`,w(`Hotkeys`)),k(`https://trello.com/b/7x832DG4/fantasy-map-generator`,w(`Devboard`)),`<a href="mailto:azgaar.fmg@yandex.by" target="_blank">${w(`Contact Azgaar`)}</a>`];function Hc(){return`${w(`Fantasy Map Generator (FMG) is a free open-source application. It means that you own all created maps and can use them as you wish.`)}

    <p>
      ${w(`The development is community-backed, you can donate on {{- patreon}}. You can also help creating overviews, tutorials and spreding the word about the Generator.`,{patreon:Lc.patreon})}
    </p>

    <p>
      ${w(`The best way to get help is to contact the community on {{- discord}} and {{- reddit}}. Before asking questions, please check out the {{- quickStart}}, the {{- qaa}}, and {{- video}}.`,{...Lc,...Bc})}
    </p>

    <ul style="columns:2">${Vc.map(e=>`<li>${e}</li>`).join(``)}</ul>

    <p>${w(`Check out our other projects`)}:
      <ul>
        <li>${w(`{{- armoria}}: a tool for creating heraldic coats of arms`,{armoria:Rc.armoria})}</li>
        <li>${w(`{{- deorum}}: a vast gallery of customizable fantasy characters`,{deorum:Rc.deorum})}</li>
      </ul>
    </p>`}function Uc(){F.message({message:Hc(),title:document.title,width:`28em`})}var Wc=`
  <div id="exportMapData" style="display: none" class="dialog">
    <div style="margin-bottom: 0.3em; font-weight: bold">${w(`Download image`)}</div>
    <div>
      <button data-action="svg" data-tip="${w(`Download the map as vector image (open directly in browser or Inkscape)`)}">.svg</button>
      <button data-action="png" data-tip="${w(`Download visible part of the map as .png (lossless compressed)`)}">.png</button>
      <button data-action="jpeg" data-tip="${w(`Download visible part of the map as .jpeg (lossy compressed) image`)}">.jpeg</button>
      <button data-action="tiles" data-tip="${w(`Split map into smaller png tiles and download as zip archive`)}">${w(`tiles`)}</button>
      <span data-tip="${w(`Check to not allow system to automatically hide labels`)}">
        <input id="showLabels" class="checkbox" type="checkbox" />
        <label for="showLabels" class="checkbox-label">${w(`Show all labels`)}</label>
      </span>
    </div>
    <div
      data-tip="${w(`Define scale of a saved png/jpeg image (e.g. 5x). Saving big images is slow and may cause a browser crash!`)}"
      style="margin-bottom: 0.3em"
    >
      ${w(`PNG / JPEG scale`)}:
      <input id="pngResolutionInput" data-stored="pngResolution" type="range" min="1" max="8" value="1" style="width: 10em" />
      <input id="pngResolutionOutput" data-stored="pngResolution" type="number" min="1" max="8" value="1" />
    </div>
    <p>${w(`Generator uses pop-up window to download files. Please ensure your browser does not block popups.`)}</p>
    <div style="margin: 1em 0 0.3em; font-weight: bold">${w(`Export to GeoJSON`)}</div>
    <div>
      <button data-action="geojsonCells" data-tip="${w(`Export to GeoJSON`)}">${w(`Cells`)}</button>
      <button data-action="geojsonRoutes" data-tip="${w(`Export to GeoJSON`)}">${w(`Routes`)}</button>
      <button data-action="geojsonRivers" data-tip="${w(`Export to GeoJSON`)}">${w(`Rivers`)}</button>
      <button data-action="geojsonMarkers" data-tip="${w(`Export to GeoJSON`)}">${w(`Markers`)}</button>
      <button data-action="geojsonZones" data-tip="${w(`Export to GeoJSON`)}">${w(`Zones`)}</button>
    </div>
    <p>
      ${T(w(`GeoJSON format is used in GIS tools such as QGIS.`),w(`Check out {{- wiki}} for guidance.`,{wiki:k(`https://github.com/Azgaar/Fantasy-Map-Generator/wiki/GIS-data-export`,w(`wiki`))}))}
    </p>
    <div style="margin: 1em 0 0.3em; font-weight: bold">${w(`Export to JSON`)}</div>
    <div>
      <button data-action="jsonFull" data-tip="${w(`Download full data in JSON`)}">${w(`Full`)}</button>
      <button data-action="jsonMinimal" data-tip="${w(`Download minimal data in JSON`)}">${w(`Minimal`)}</button>
      <button data-action="jsonPackCells" data-tip="${w(`Download map metadata and pack cells data in JSON`)}">${w(`Pack cells`)}</button>
      <button data-action="jsonGridCells" data-tip="${w(`Download map metadata and grid cells data in JSON`)}">${w(`Grid cells`)}</button>
    </div>
    <p>${w(`Export in JSON format can be used as an API replacement.`)}</p>
  </div>

  <div id="saveMapData" style="display: none" class="dialog">
    <div style="margin-top: 0.3em">
      <strong>${w(`Save map to`)}</strong>
      <button
        data-action="saveToMachine"
        data-tip="${w(`Save to a new file; Shift-click to overwrite the last saved file`)}"
        data-shortcut="Ctrl + S"
        style="font-weight: 600"
      >
        ${w(`machine`)}
      </button>
      <button id="saveToDropboxButton" data-action="saveToDropbox" data-tip="${w(`Save Map to Dropbox`)}" data-shortcut="Ctrl + C">
        dropbox
      </button>
      <button id="saveToStorageButton" data-action="saveToStorage" data-tip="${w(`Save the project to browser storage only`)}" data-shortcut="F6">${w(`browser`)}</button>
    </div>
    <p>
      ${w(`Each save creates a new file, so earlier saves stay as backups. Where your browser supports it, Shift-click machine or press Ctrl + Shift + S to overwrite the last saved file.`)}
    </p>
    <p>
      ${w(`Maps are saved in .map format, that can be loaded back via the Load in menu. There is no way to restore the progress if file is lost. Please keep old save files on your machine or cloud storage as backups.`)}
    </p>
    <p>
      ${w(`Browser storage is only a backup: the browser can clear it at any time. It keeps one quick save and the latest autosaves, listed in the Load menu.`)}
    </p>
    <div data-tip="${w(`Saved map opens for browsing only, with editing disabled. Not a protection: the file itself can still be changed`)}">
      <input id="saveViewOnly" class="checkbox" type="checkbox" />
      <label for="saveViewOnly" class="checkbox-label">${w(`View-only mode`)}</label>
    </div>
  </div>

  <div id="loadMapData" style="display: none" class="dialog">
    <div>
      <strong>${w(`Load map from`)}</strong>
      <button id="loadMapFromMachine" data-tip="${w(`Load map file (.map or .gz) from your local disk`)}">${w(`machine`)}</button>
      <button data-action="loadFromURL" data-tip="${w(`Load map file (.map or .gz) file from URL. Note that the server should allow CORS`)}">
        URL
      </button>
    </div>
    <p style="margin-bottom: 0.3em"><strong>${w(`Saved in the browser`)}</strong></p>
    <style>
  #browserSaves {
    display: grid;
    grid-template-columns: auto minmax(9em, 1fr) auto auto auto auto;
    row-gap: 0.2em;
    width: auto;
    max-height: 16em;
    overflow-y: auto;
    scrollbar-width: thin;
  }

  .browserSave {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
    column-gap: 0.9em;
    padding: 0.3em 0.5em;
    border: 1px solid #00000022;
    cursor: pointer;
  }

  .browserSave:hover {
    border-color: #00000055;
    background-color: #00000010;
  }

  #browserSaves > i {
    grid-column: 1 / -1;
    opacity: 0.7;
  }

  .browserSaveKind {
    padding: 0 0.5em;
    border-radius: 1em;
    font-size: 0.85em;
    text-align: center;
    background-color: #00000014;
  }

  .browserSaveKind.quick {
    background-color: var(--header);
    color: #fff;
  }

  .browserSaveName {
    overflow: hidden;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .browserSaveSize {
    text-align: right;
    opacity: 0.7;
  }
</style>
    <div id="browserSaves"></div>
    <div id="loadFromDropbox">
      <p style="margin-bottom: 0.3em">
        <b>${w(`Or load from your Dropbox account`)}</b>
        <button id="dropboxConnectButton" data-action="connectDropbox" data-tip="${w(`Connect your Dropbox account to be able to load maps from it`)}">
          ${w(`Connect`)}
        </button>
      </p>
      <select id="loadFromDropboxSelect" style="width: 22em"></select>
      <div id="loadFromDropboxButtons" style="margin-bottom: 0.6em">
        <button data-action="loadFromDropbox" data-tip="${w(`Load map file (.map or .gz) from your Dropbox`)}">${w(`Load`)}</button>
        <button data-action="shareDropboxLink" data-tip="${w(`Select file and create a link to share with your friends`)}">${w(`Share`)}</button>
      </div>
      <div style="margin-top: 0.3em">
        <div id="sharableLinkContainer" style="display: none">
          <a id="sharableLink" target="_blank"></a>
          <i data-action="copyLink" data-tip="${w(`Copy link to the clipboard`)}" class="icon-clone pointer"></i>
        </div>
      </div>
    </div>
  </div>

  <div id="exportToPngTilesScreen" style="display: none" class="dialog">
    <p>${w(`Map will be split into tiles and downloaded as a single zip file. Avoid saving too large images`)}</p>
    <div data-tip="${w(`Number of columns`)}" style="margin-bottom: 0.3em">
      <div class="label">${w(`Columns`)}:</div>
      <input id="tileColsInput" data-stored="tileCols" type="range" min="2" max="26" value="8" style="width: 10em" />
      <input id="tileColsOutput" data-stored="tileCols" type="number" min="2" value="8" />
    </div>
    <div data-tip="${w(`Number of rows`)}" style="margin-bottom: 0.3em">
      <div class="label">${w(`Rows`)}:</div>
      <input id="tileRowsInput" data-stored="tileRows" type="range" min="2" max="26" value="8" style="width: 10em" />
      <input id="tileRowsOutput" data-stored="tileRows" type="number" min="2" value="8" />
    </div>
    <div data-tip="${w(`Image scale relative to image size (e.g. 5x)`)}" style="margin-bottom: 0.3em">
      <div class="label">${w(`Scale`)}:</div>
      <input id="tileScaleInput" data-stored="tileScale" type="range" min="1" max="4" value="1" style="width: 10em" />
      <input id="tileScaleOutput" data-stored="tileScale" type="number" min="1" value="1" />
    </div>
    <div data-tip="${w(`Calculated size of image if combined`)}" style="margin-bottom: 0.3em">
      <div class="label">${w(`Total size`)}:</div>
      <div id="tileSize" style="display: inline-block">1000 x 1000 px</div>
    </div>
    <div id="tileStatus" style="font-style: italic"></div>
  </div>
`,Gc={svg:()=>U.ExportMap.exportToSvg(),png:()=>U.ExportMap.exportToPng(),jpeg:()=>U.ExportMap.exportToJpeg(),tiles:()=>al(),geojsonCells:()=>U.ExportMap.saveGeoJsonCells(),geojsonRoutes:()=>U.ExportMap.saveGeoJsonRoutes(),geojsonRivers:()=>U.ExportMap.saveGeoJsonRivers(),geojsonMarkers:()=>U.ExportMap.saveGeoJsonMarkers(),geojsonZones:()=>U.ExportMap.saveGeoJsonZones(),jsonFull:()=>U.ExportJson.exportToJson(`Full`),jsonMinimal:()=>U.ExportJson.exportToJson(`Minimal`),jsonPackCells:()=>U.ExportJson.exportToJson(`PackCells`),jsonGridCells:()=>U.ExportJson.exportToJson(`GridCells`),saveToMachine:e=>U.Save.toMachine(e.shiftKey,Kc()),saveToDropbox:()=>U.Save.toDropbox(Kc()),saveToStorage:()=>U.Save.toStorage(),loadFromURL:()=>il(),loadBrowserSave:e=>U.Load.loadFromBrowser($c(e)),downloadBrowserSave:e=>U.BrowserSaves.download($c(e)),removeBrowserSave:e=>el($c(e)),connectDropbox:()=>tl(),loadFromDropbox:()=>U.Load.loadFromDropbox(),shareDropboxLink:()=>U.Load.createSharableDropboxLink(),copyLink:()=>nl()},Kc=()=>M(`saveViewOnly`).checked;function qc(){M(`saveToStorageButton`).disabled=Kc()}var Jc=e=>[{label:w(`Close`),onClick:()=>F.close(e)}];function Yc(){M(`saveViewOnly`).checked=!1,qc(),F.open(`saveMapData`,{title:w(`Save map`),width:`25em`,position:{my:`center`,at:`center`,of:`svg`},buttons:Jc(`saveMapData`),persistent:!0})}function Xc(){M(`showLabels`).checked=options.app.labels.showAll,F.open(`exportMapData`,{title:w(`Export map data`),width:`26em`,position:{my:`center`,at:`center`,of:`svg`},buttons:Jc(`exportMapData`),persistent:!0})}async function Zc(){if(F.open(`loadMapData`,{title:w(`Load Map`),width:`auto`,position:{my:`center`,at:`center`,of:`svg`},buttons:Jc(`loadMapData`),onClose:()=>M(`browserSaves`).replaceChildren(),persistent:!0}),Qc(),!j(`loadFromDropbox`))return;M(`sharableLinkContainer`).style.display=`none`;let e=M(`dropboxConnectButton`),t=M(`loadFromDropboxButtons`),n=M(`loadFromDropboxSelect`);if(!await U.Cloud.isConnected()){e.style.display=`inline-block`,t.style.display=`none`,n.style.display=`none`;return}e.style.display=`none`,n.style.display=`block`,n.innerHTML=`<option value="" disabled selected>${w(`Loading`)}…</option>`;let r=await U.Cloud.list();if(!r.length)t.style.display=`none`,n.innerHTML=`<option value="" disabled selected>${w(`Save files to Dropbox first`)}</option>`;else{t.style.display=`block`,n.innerHTML=``;for(let{name:e,updated:t,size:i,path:a}of r){let r=`${new Date(t).toLocaleDateString()}: ${e} [${ke(i/1024/1024,2)} MB]`;n.options.add(new Option(r,a))}}}async function Qc(){let e=(await U.BrowserSaves.list().catch(()=>[])).map(({id:e,kind:t,name:n,savedAt:r,size:i})=>{let a=r?new Date(r).toLocaleString(void 0,{dateStyle:`medium`,timeStyle:`short`}):``;return`<div data-id="${e}" data-action="loadBrowserSave" data-tip="${w(`Load`)}" class="browserSave">
      <span class="browserSaveKind ${t}">${w(t===`quick`?`Quick save`:`Autosave`)}</span>
      <span class="browserSaveName">${E(n)||`<i>${w(`Unnamed`)}</i>`}</span>
      <span>${a}</span>
      <span class="browserSaveSize">${ke(i/1024/1024,1)} MB</span>
      <span data-action="downloadBrowserSave" data-tip="${w(`Download`)}" class="icon-download pointer"></span>
      <span data-action="removeBrowserSave" data-tip="${w(`Remove`)}" class="icon-trash-empty pointer"></span>
    </div>`});M(`browserSaves`).innerHTML=e.join(``)||`<i>${w(`No maps saved in the browser`)}</i>`}var $c=e=>e.target.closest(`[data-id]`)?.dataset.id??``;function el(e){F.confirm({title:w(`Remove`),message:`${w(`Are you sure you want to remove this map from the browser storage?`)}<br>${w(`This action cannot be reverted`)}`,confirm:w(`Remove`),onConfirm:async()=>{await U.BrowserSaves.remove(e),F.isOpen(`loadMapData`)&&Qc()}})}async function tl(){await U.Cloud.connect(),await U.Cloud.isConnected()&&Zc()}function nl(){let e=M(`sharableLink`).getAttribute(`href`)??``;navigator.clipboard.writeText(e).then(()=>I(w(`Link is copied to the clipboard`),!0,`success`,8e3))}var rl=/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;function il(){F.message({message:`${w(`Provide URL to map file`)}:
    <input id="mapURL" type="url" style="width: 24em" placeholder="https://e-cloud.com/test.map" />
    <br /><i>${w(`Please note server should allow CORS for file to be loaded. If CORS is not allowed, save file to Dropbox and provide a direct link`)}</i>`,title:w(`Load Map from URL`),width:`27em`,buttons:[{label:w(`Load`),onClick:()=>{let e=M(`mapURL`).value;if(!rl.test(e))return I(w(`Please provide a valid URL`),!1,`error`),!1;U.Load.loadMapFromURL(e)}},{label:w(`Cancel`)}]})}function al(){M(`tileStatus`).innerHTML=``,F.closeAll(),ul();let e=Array.from(M(`exportToPngTilesScreen`).querySelectorAll(`input`));for(let t of e)t.addEventListener(`input`,ol);F.open(`exportToPngTilesScreen`,{title:w(`Download tiles`),width:`23em`,buttons:[{label:w(`Download`),onClick:()=>U.ExportMap.exportToPngTiles()},{label:w(`Cancel`),onClick:()=>{F.close(`exportToPngTilesScreen`)}}],onClose:()=>{for(let t of e)t.removeEventListener(`input`,ol);N(`#debug`).selectAll(`*`).remove()},persistent:!0})}function ol(){let{nextElementSibling:e,previousElementSibling:t}=this;e instanceof HTMLInputElement&&(e.value=this.value),t instanceof HTMLInputElement&&(t.value=this.value),sl(this),ul()}function sl(e){let t=+e.value;t>0&&b.set(n=>{let{tiles:r}=n.app.export;e.dataset.stored===`pngResolution`?n.app.export.pngResolution=t:e.dataset.stored===`tileCols`?r.cols=t:e.dataset.stored===`tileRows`?r.rows=t:e.dataset.stored===`tileScale`&&(r.scale=t)})}var cl=`ABCDEFGHIJKLMNOPQRSTUVWXYZ`,ll=e=>(e>=26?cl[Math.floor(e/26)-1]:``)+cl[e%26];function ul(){let{cols:e,rows:t,scale:n}=options.app.export.tiles,r=options.map.graph.width*n*e,i=options.map.graph.height*n*t,a=r*i,o=M(`tileSize`);o.innerHTML=`${r} x ${i} px`,o.style.color=a>1e9?`#d00b0b`:a>1e8?`#9e6409`:`#1a941a`;let s=options.map.graph.width/e|0,c=options.map.graph.height/t|0,l=[],u=[];for(let e=0,t=0;e+c<=options.map.graph.height;e+=c,t++)for(let n=0,r=1;n+s<=options.map.graph.width;n+=s,r++){l.push(`<rect x=${n} y=${e} width=${s} height=${c} />`);let i=`${ll(t)}${r}`;u.push(`<text x=${n+s/2} y=${e+c/2}>${i}</text>`)}N(`#debug`).html(`<g fill="none" stroke="#000">${l.join(``)}</g>
    <g fill="#000" stroke="none" text-anchor="middle" dominant-baseline="central" font-size="18px">${u.join(``)}</g>`)}var dl=Un(`.map,.gz`);dl.id=`mapToLoad`,dl.onchange=()=>{let e=dl.files?.[0];dl.value=``,F.closeAll(),e&&U.Load.uploadMap(e)};function fl(){dl.click()}function pl(){M(`dialogs`).insertAdjacentHTML(`afterbegin`,Wc);for(let e of[`exportMapData`,`saveMapData`,`loadMapData`])M(e).addEventListener(`click`,e=>{let t=e.target.closest(`[data-action]`)?.dataset.action;t&&Gc[t]?.(e)});for(let e of document.querySelectorAll(`[data-stored="pngResolution"]`))e.addEventListener(`input`,()=>{for(let t of document.querySelectorAll(`[data-stored="pngResolution"]`))t.value=e.value;sl(e)});M(`showLabels`).addEventListener(`change`,function(){b.set(e=>e.app.labels.showAll=this.checked),O.draw(`labels`)}),M(`saveViewOnly`).addEventListener(`change`,qc),M(`loadMapFromMachine`).addEventListener(`click`,fl)}pl();var ml=`input, textarea, button, select, option`,hl=(e,t)=>{let n=e.target;return n.closest(ml)?null:n.closest(t)};function gl(e,t){getComputedStyle(e).position===`static`&&(e.style.position=`relative`),e.addEventListener(`mousedown`,e=>{hl(e,t)&&e.preventDefault()}),e.addEventListener(`pointerdown`,n=>{let r=hl(n,t);if(n.button!==0||!r)return;let i=r.getBoundingClientRect(),a=getComputedStyle(e),o={left:parseFloat(a.left)||0,top:parseFloat(a.top)||0};Et(n,(t,n)=>{let r=o.left+Ae(t,-i.left,window.innerWidth-i.right),a=o.top+Ae(n,-i.top,window.innerHeight-i.bottom);Object.assign(e.style,{left:`${r}px`,top:`${a}px`,right:`auto`,bottom:`auto`})})})}function _l(e){let t=e.target;t.tagName===`BUTTON`&&(!t.classList.contains(`pressed`)&&t.id!==`viewStandard`?C.View3d.open(t.id):C.View3d.enterStandard())}var vl={layersTab:`layersContent`,styleTab:`styleContent`,optionsTab:`optionsContent`,toolsTab:`toolsContent`,aboutTab:`aboutContent`};function yl(e){localStorage.getItem(`fmg-disable-click-arrow-tooltip`)||(kt(),localStorage.setItem(Ut,`true`),M(`optionsTrigger`).classList.remove(`glow`)),M(`regenerate`).style.display=`none`,M(`options`).style.display=`block`,M(`optionsTrigger`).style.display=`none`,e?.stopPropagation()}function bl(e){M(`options`).style.display=`none`,M(`optionsTrigger`).style.display=`block`,e?.stopPropagation()}function xl(e){M(`options`).style.display===`none`?yl(e):bl(e)}function Sl(e){yl(),Cl(e)}function Cl(e){let t=M(`options`).querySelector(`.tab > button.active`);if(t?.id===e)return;t?.id===`styleTab`&&C.StyleEditor.close(),t?.classList.remove(`active`),M(e).classList.add(`active`);for(let e of M(`options`).querySelectorAll(`.tabcontent`))e.style.display=`none`;let n=e===`toolsTab`&&options.app.mode===`heightmap`?`heightmapMenu`:vl[e];n&&(M(n).style.display=`block`),e===`styleTab`&&C.StyleEditor.open()}function wl(e){let t=e.target;if(t.closest(`[data-option]`))return;let{id:n,value:r}=t;if(n.endsWith(`Input`)){let e=j(`${n.slice(0,-5)}Output`);e&&(e.value=r)}else if(n.endsWith(`Output`)){let e=j(`${n.slice(0,-6)}Input`);e&&(e.value=r)}}function Tl(){gl(M(`optionsContainer`),`.drag-trigger`),gl(M(`heightmapFinalize`),`div`),localStorage.getItem(`fmg-disable-click-arrow-tooltip`)&&(kt(),M(`optionsTrigger`).classList.remove(`glow`));let e=M(`optionsTrigger`);e.addEventListener(`mouseenter`,()=>{e.classList.contains(`glow`)||M(`options`).style.display===`none`&&(M(`regenerate`).style.display=`block`)}),M(`collapsible`).addEventListener(`mouseleave`,()=>{M(`regenerate`).style.display=`none`}),M(`options`).querySelector(`div.tab`)?.addEventListener(`click`,e=>{let t=e.target;t.tagName===`BUTTON`&&Cl(t.id)});for(let e of[`options`,`dialogs`])M(e).addEventListener(`input`,wl);M(`sticked`).addEventListener(`click`,e=>{let t=e.target.id;t===`newMapButton`?os():t===`saveButton`?Yc():t===`exportButton`?Xc():t===`loadButton`?Zc():t===`zoomReset`?Gn(1e3):t===`searchButton`&&C.Omnibar.open()}),M(`viewMode`).addEventListener(`click`,_l),M(`optionsTrigger`).addEventListener(`click`,yl),M(`regenerate`).addEventListener(`click`,()=>os()),M(`optionsHide`).addEventListener(`click`,bl)}Tl();var El={political:[`borders`,`burgIcons`,`ice`,`labels`,`lakes`,`rivers`,`routes`,`scaleBar`,`states`,`vignette`],cultural:[`borders`,`burgIcons`,`cultures`,`labels`,`lakes`,`rivers`,`routes`,`scaleBar`,`vignette`],religions:[`borders`,`burgIcons`,`labels`,`lakes`,`religions`,`rivers`,`routes`,`scaleBar`,`vignette`],provinces:[`borders`,`burgIcons`,`labels`,`lakes`,`provinces`,`rivers`,`scaleBar`,`vignette`],biomes:[`biomes`,`ice`,`lakes`,`rivers`,`scaleBar`,`vignette`],heightmap:[`heightmap`,`lakes`,`rivers`,`vignette`],physical:[`coordinates`,`heightmap`,`ice`,`lakes`,`rivers`,`scaleBar`,`vignette`],poi:[`borders`,`burgIcons`,`heightmap`,`ice`,`lakes`,`markers`,`rivers`,`routes`,`scaleBar`,`vignette`],goods:[`borders`,`goods`,`ice`,`lakes`,`rivers`,`scaleBar`,`vignette`],trade:[`borders`,`burgIcons`,`ice`,`lakes`,`markets`,`rivers`,`routes`,`scaleBar`,`trade`,`vignette`],military:[`borders`,`burgIcons`,`labels`,`lakes`,`military`,`rivers`,`routes`,`scaleBar`,`states`,`vignette`],emblems:[`borders`,`burgIcons`,`emblems`,`ice`,`lakes`,`rivers`,`routes`,`scaleBar`,`states`,`vignette`],landmass:[`scaleBar`]},$={...El};Dl();function Dl(){let e=JSON.parse(localStorage.getItem(`presets`)||`null`);if(e)for(let t in e)e[t].every(e=>O.has(e))&&($[t]=e[t],El[t]||M(`layersPreset`).add(new Option(t,t)))}function Ol(){let e=localStorage.getItem(`preset`)||M(`layersPreset`).value,t=e in $?e:`political`;jl(t),O.restore({order:O.state.order,active:$[t]})}function kl(e){let t=e.get(`layers`);if(t){let e=t.split(`,`).map(e=>e.trim()).filter(e=>O.has(e));e.length?O.set(e):D.error(`URL param layers="${t}" has no valid layer ids`);return}let n=e.get(`preset`),r=n&&Al(n);r?(jl(r),O.set($[r])):n&&D.error(`URL param preset="${n}" is invalid`)}function Al(e){let t=e.toLowerCase().trim(),n=Object.keys($).find(e=>e.toLowerCase()===t);if(n)return n;let r=Array.from(M(`layersPreset`).options).find(e=>e.text.toLowerCase()===t);return r?.value&&r.value in $?r.value:void 0}function jl(e){M(`layersPreset`).value=e,localStorage.setItem(`preset`,e),M(`removePresetButton`).style.display=El[e]?`none`:`inline-block`,M(`savePresetButton`).style.display=`none`}function Ml(e){e in $&&(jl(e),O.set($[e]))}function Nl(){F.confirm({title:w(`Save Layers Preset`),message:`<label>${w(`Preset name`)}: <input id="layersPresetName" type="text" autocomplete="off" /></label>`,confirm:w(`Save`),onConfirm:()=>{let e=M(`layersPresetName`).value.trim();e&&($[e]=O.all.filter(e=>dr.has(e.id)&&O.isOn(e.id)).map(e=>e.id),M(`layersPreset`).add(new Option(e,e,!1,!0)),localStorage.setItem(`presets`,JSON.stringify($)),localStorage.setItem(`preset`,e),M(`removePresetButton`).style.display=`inline-block`,M(`savePresetButton`).style.display=`none`)}}),M(`layersPresetName`).focus()}function Pl(){let e=M(`layersPreset`).value;delete $[e],M(`layersPreset`).options.remove(Array.from(M(`layersPreset`).options).findIndex(t=>t.value===e)),M(`layersPreset`).value=`custom`,M(`removePresetButton`).style.display=`none`,M(`savePresetButton`).style.display=`inline-block`,localStorage.setItem(`presets`,JSON.stringify($)),localStorage.removeItem(`preset`)}function Fl(){let e=e=>[...e].sort().join(`,`),t=e(O.all.filter(e=>dr.has(e.id)&&O.isOn(e.id)).map(e=>e.id)),n=Object.keys($).find(n=>e($[n])===t);M(`layersPreset`).value=n??`custom`,M(`removePresetButton`).style.display=n&&!El[n]?`inline-block`:`none`,M(`savePresetButton`).style.display=n?`none`:`inline-block`}M(`layersPreset`).addEventListener(`change`,e=>{Ml(e.target.value)}),M(`savePresetButton`).addEventListener(`click`,Nl),M(`removePresetButton`).addEventListener(`click`,Pl),O.subscribe(Fl);function Il(e,t){return`<button id="${e}" data-tip="${t}" class="icon-book"></button>`}function Ll(e){return`<span data-col="note" data-tip="${e}" class="icon-book pointer"></span>`}var Rl=[`culturesEditorRefresh`,`biomesEditorRefresh`,`diplomacyOverviewRefresh`,`provincesEditorRefresh`,`religionsEditorRefresh`,`statesEditorRefresh`,`zonesEditorRefresh`,`goodsEditorRefresh`,`marketsOverviewRefresh`,`marketOverviewRefresh`,`marketDealsRefresh`,`marketsGoodCompareRefresh`,`burgsOverviewRefresh`,`routesOverviewRefresh`,`riversOverviewRefresh`,`featuresOverviewRefresh`,`militaryOverviewRefresh`,`developmentRefresh`,`regimentsOverviewRefresh`,`markersOverviewRefresh`,`journeysOverviewRefresh`];function zl(){let e=document.querySelectorAll(`.burgEconomyDialog, .economyOverviewDialog, .stabilityDialog, [id^='stateEconomy'][id$='Table'], #marketOverview, #marketDeals, #tradeDetails, #stateBudgetEditor, #limitationPicker`);for(let{id:t}of e)F.close(t)}function Bl(){for(let e of Rl)j(e)?.click()}var Vl=e=>e.link===!0,Hl=[{id:`assistant`,name:w(`Azgaar Assistant`),aliases:`help chat question ask faq support how why what ?`,matches:Ul,run:(e,t)=>t&&Ul(t)?C.Assistant.ask(t):C.Assistant.open()},{id:`startTour`,name:w(`Start Interactive Tour`),aliases:`help guide tutorial`,run:()=>U.UiTour.start()},{id:`newMap`,name:w(`Generate New Map`),aliases:`regenerate random create`,run:()=>os()},{id:`saveToMachine`,name:w(`Save Map File`),aliases:`save .map disk`,run:()=>U.Save.toMachine()},{id:`overwriteMapFile`,name:w(`Overwrite Saved Map File`),aliases:`save same file update replace .map`,run:()=>U.Save.toMachine(!0)},{id:`loadFromFile`,name:w(`Load Map from File`),aliases:`open upload disk`,run:()=>fl()},{id:`quickLoad`,name:w(`Quick Load Map`),aliases:`browser storage restore`,run:()=>U.Load.quickLoad()},{id:`saveToStorage`,name:w(`Save Map to browser storage`),aliases:`browser storage`,run:()=>U.Save.toStorage()},{id:`saveToDropbox`,name:w(`Save Map to Dropbox`),aliases:`cloud`,run:()=>U.Save.toDropbox()},{id:`loadFromURL`,name:w(`Load Map from URL`),aliases:`open link`,run:()=>il()},{id:`saveButton`,name:w(`Show Save Panel`),link:!0,aliases:`store dialog`,run:()=>Yc()},{id:`loadButton`,name:w(`Load Map`),aliases:`open dialog`,run:()=>Zc()},{id:`exportButton`,name:w(`Show Export Panel`),link:!0,aliases:`map download image data`,run:()=>Xc()},{id:`copyMapURL`,name:w(`Copy Map URL`),aliases:`seed link share clipboard`,run:()=>Mo()},{id:`seedHistory`,name:w(`Show Seed History`),link:!0,aliases:`previous maps restore`,run:()=>Ar()},{id:`editStatesButton`,name:w(`States Editor`),link:!0,aliases:`countries kingdoms nations`,run:()=>C.StatesEditor.open()},{id:`overviewBurgsButton`,name:w(`Burgs Overview`),link:!0,aliases:`settlements cities towns villages`,run:()=>C.BurgsOverview.open()},{id:`editCulturesButton`,name:w(`Cultures Editor`),link:!0,aliases:`people`,run:()=>C.CulturesEditor.open()},{id:`editReligions`,name:w(`Religions Editor`),link:!0,aliases:`faith beliefs`,run:()=>C.ReligionsEditor.open()},{id:`editProvincesButton`,name:w(`Provinces Editor`),link:!0,aliases:`territories counties`,run:()=>C.ProvincesEditor.open()},{id:`editHeightmapButton`,name:w(`Edit Heightmap`),link:!0,aliases:`terrain elevation`,run:()=>C.HeightmapEditor.open()},{id:`editBiomesButton`,name:w(`Biomes Editor`),link:!0,aliases:`environment terrain`,run:()=>C.BiomesEditor.open()},{id:`editReliefRules`,name:w(`Relief Rules`),link:!0,aliases:`terrain icons mountains hills trees biome rules`,run:()=>C.ReliefRulesEditor.open()},{id:`editDiplomacyButton`,name:w(`Diplomacy Overview`),link:!0,aliases:`relations allies wars`,run:()=>C.DiplomacyOverview.open()},{id:`overviewFeaturesButton`,name:w(`Geographical Features Overview`),link:!0,aliases:`islands lakes oceans landmasses water bodies continents`,run:()=>C.FeaturesOverview.open()},{id:`overviewRiversButton`,name:w(`Rivers Overview`),link:!0,aliases:`waterways`,run:()=>C.RiversOverview.open()},{id:`overviewRoutesButton`,name:w(`Routes Overview`),link:!0,aliases:`roads paths trails`,run:()=>C.RoutesOverview.open()},{id:`overviewMarkersButton`,name:w(`Markers Overview`),link:!0,aliases:`points of interest`,run:()=>C.MarkersOverview.open()},{id:`overviewLabelsButton`,name:w(`Labels Overview`),link:!0,aliases:`text typography`,run:()=>C.LabelsOverview.open()},{id:`editZonesButton`,name:w(`Zones Editor`),link:!0,aliases:`areas regions`,run:()=>C.ZonesEditor.open()},{id:`overviewMilitaryButton`,name:w(`Military Overview`),link:!0,aliases:`armies regiments`,run:()=>C.MilitaryOverview.open()},{id:`regiments`,name:w(`Regiments Overview`),link:!0,aliases:`military armies`,run:()=>C.RegimentsOverview.open()},{id:`editEmblemButton`,name:w(`Edit Emblem`),link:!0,aliases:`heraldry coat of arms`,run:()=>C.EmblemsEditor.openDefault()},{id:`editNotesButton`,name:w(`Notes Editor`),link:!0,aliases:`lore descriptions legends`,run:()=>C.NotesEditor.open()},{id:`lore`,name:w(`Setup Lore`),link:!0,aliases:`description history story`,run:()=>C.LoreEditor.open()},{id:`editNamesBaseButton`,name:w(`Namesbase Editor`),link:!0,aliases:`names language`,run:()=>C.NamesbaseEditor.open()},{id:`editUnitsButton`,name:w(`Units Editor`),link:!0,aliases:`scale distance population`,run:()=>C.UnitsEditor.open()},{id:`editCoastlineSettings`,name:w(`Coastline Settings`),link:!0,aliases:`coast islands oceans`,run:()=>C.CoastlineEditor.open()},{id:`editMeasurersButton`,name:w(`Measurers Editor`),link:!0,aliases:`rulers distances`,run:()=>C.MeasurersEditor.open()},{id:`editGoods`,name:w(`Goods Editor`),link:!0,aliases:`resources products economy`,run:()=>C.GoodsEditor.open()},{id:`editDevelopmentButton`,name:w(`Development Editor`),link:!0,aliases:`technology tech level era civilization progress`,run:()=>C.DevelopmentEditor.open()},{id:`eras`,name:w(`Eras`),link:!0,aliases:`development technology rename`,run:()=>C.ErasEditor.open()},{id:`overviewMarketsButton`,name:w(`Markets Overview`),link:!0,aliases:`economy trade`,run:()=>C.MarketsOverview.open()},{id:`productionChains`,name:w(`Production Chains`),link:!0,aliases:`goods recipes economy`,run:()=>C.ProductionChains.open()},{id:`editTradeAnimationButton`,name:w(`Trade Animation Editor`),link:!0,aliases:`economy`,run:()=>C.TradeAnimationEditor.open()},{id:`overviewJourneysButton`,name:w(`Journeys Overview`),link:!0,aliases:`travel quests`,run:()=>C.JourneysOverview.open()},{id:`transports`,name:w(`Transport Types`),link:!0,aliases:`journeys travel speed`,run:()=>C.TransportEditor.open()},{id:`burgGroups`,name:w(`Configure burg groups`),link:!0,aliases:`settlements cities towns villages types`,run:()=>C.BurgGroupEditor.open()},{id:`labelGroups`,name:w(`Configure Label Groups`),link:!0,aliases:`labels text typography fonts`,run:()=>C.LabelGroupsConfigurator.open()},{id:`routeGroups`,name:w(`Edit route groups`),link:!0,aliases:`roads paths trails types`,run:()=>C.RouteGroupsEditor.open()},{id:`riverGroups`,name:w(`Edit river groups`),link:!0,aliases:`rivers streams frozen dry lava types`,run:()=>C.RiverGroupsEditor.open()},{id:`world`,name:w(`World Configurator`),link:!0,aliases:`climate size latitude temperature`,run:()=>C.WorldConfigurator.open()},{id:`overviewCellsButton`,name:w(`Cell Details`),link:!0,aliases:`cell information`,run:()=>C.CellInfo.open()},{id:`overviewChartsButton`,name:w(`Data Charts`),link:!0,aliases:`statistics graphs`,run:()=>C.ChartsOverview.open()},{id:`addBurgTool`,name:w(`Add Burg`),aliases:`add burgs settlement city town village`,run:()=>C.BurgCreator.toggle()},{id:`addLabel`,name:w(`Add Label`),aliases:`text`,run:()=>C.LabelCreator.toggle()},{id:`addMarker`,name:w(`Add Marker`),aliases:`point of interest`,run:()=>C.MarkerCreator.toggle()},{id:`addRiver`,name:w(`Add River`),aliases:`waterway`,run:()=>C.RiverAutoCreator.toggle()},{id:`drawRiver`,name:w(`Draw River`),aliases:`add waterway manually`,run:()=>C.RiverCreator.open()},{id:`addRoute`,name:w(`Add Route`),aliases:`road trail path`,run:()=>C.RouteCreator.open()},{id:`selectHeightmap`,name:w(`Select Heightmap Template`),aliases:`precreated generation options`,run:()=>C.HeightmapSelection.open()},{id:`openSubmapTool`,name:w(`Create Submap`),aliases:`generate region`,run:()=>C.SubmapTool.open()},{id:`openTransformTool`,name:w(`Transform Map`),aliases:`rotate resize`,run:()=>C.TransformTool.open()},{id:`openWrapTool`,name:w(`Wrap Tool`),link:!0,aliases:`reshape cells brush`,run:()=>C.WrapTool.open()},{id:`openMinimapButton`,name:w(`Minimap`),link:!0,aliases:`navigation`,run:()=>C.Minimap.open()},{id:`viewMesh`,name:w(`3D Preview`),link:!0,aliases:`view mode mesh`,run:()=>C.View3d.open(`viewMesh`)},{id:`viewGlobe`,name:w(`Open Globe View`),link:!0,aliases:`view mode planet`,run:()=>C.View3d.open(`viewGlobe`)},{id:`showStatesChart`,name:w(`States bubble chart`),link:!0,aliases:`countries kingdoms area population bubble`,run:()=>C.StatesEditor.showChart()},{id:`showProvincesChart`,name:w(`Provinces chart`),link:!0,aliases:`territories area population treemap`,run:()=>C.ProvincesEditor.showChart()},{id:`showBurgsChart`,name:w(`Burgs bubble chart`),link:!0,aliases:`settlements cities population bubble`,run:()=>C.BurgsOverview.showChart()},{id:`showCulturesHierarchy`,name:w(`Cultures tree`),link:!0,aliases:`people origins tree`,run:()=>C.CulturesEditor.showHierarchy()},{id:`showReligionsHierarchy`,name:w(`Religions tree`),link:!0,aliases:`faith beliefs origins tree`,run:()=>C.ReligionsEditor.showHierarchy()},{id:`showRelationsHistory`,name:w(`Relations history`),link:!0,aliases:`diplomacy chronicle wars`,run:()=>C.DiplomacyOverview.showHistory()},{id:`regenerateStates`,name:`${w(`Regenerate`)}: ${w(`States`)}`,aliases:`generate countries kingdoms`,run:()=>Kl(`regenerateStates`,tu)},{id:`regenerateProvinces`,name:`${w(`Regenerate`)}: ${w(`Provinces`)}`,link:!0,aliases:`generate counties`,run:()=>C.ProvincesRegeneration.open()},{id:`regenerateBurgs`,name:`${w(`Regenerate`)}: ${w(`Burgs`)}`,aliases:`generate settlements cities towns`,run:()=>Kl(`regenerateBurgs`,nu)},{id:`regenerateCultures`,name:`${w(`Regenerate`)}: ${w(`Cultures`)}`,aliases:`generate people`,run:()=>Kl(`regenerateCultures`,ou)},{id:`regenerateReligions`,name:`${w(`Regenerate`)}: ${w(`Religions`)}`,aliases:`generate faith`,run:()=>Kl(`regenerateReligions`,au)},{id:`regenerateRivers`,name:`${w(`Regenerate`)}: ${w(`Rivers`)}`,aliases:`generate waterways`,run:()=>Kl(`regenerateRivers`,$l)},{id:`regenerateRoutes`,name:`${w(`Regenerate`)}: ${w(`Routes`)}`,aliases:`generate roads`,run:()=>Kl(`regenerateRoutes`,Ql)},{id:`regenerateStateLabels`,name:`${w(`Regenerate`)}: ${w(`State Labels`)}`,aliases:`generate text placement`,run:()=>Kl(`regenerateStateLabels`,Xl)},{id:`regenerateReliefIcons`,name:`${w(`Regenerate`)}: ${w(`Relief`)}`,aliases:`generate mountains forests`,run:()=>Kl(`regenerateReliefIcons`,Zl)},{id:`regenerateEmblems`,name:`${w(`Regenerate`)}: ${w(`Emblems`)}`,aliases:`generate heraldry`,run:()=>Kl(`regenerateEmblems`,iu)},{id:`regenerateMarkers`,name:`${w(`Regenerate`)}: ${w(`Markers`)}`,link:!0,aliases:`generate points of interest settings configure multiplier`,run:()=>C.MarkersSettings.open()},{id:`regenerateZones`,name:`${w(`Regenerate`)}: ${w(`Zones`)}`,aliases:`generate regions`,run:e=>Kl(`regenerateZones`,()=>cu(e))},{id:`regenerateMilitary`,name:`${w(`Regenerate`)}: ${w(`Military`)}`,aliases:`generate armies regiments`,run:()=>Yl()},{id:`regeneratePopulation`,name:`${w(`Regenerate`)}: ${w(`Population`)}`,aliases:`generate people`,run:()=>Kl(`regeneratePopulation`,eu)},{id:`regenerateEconomy`,name:`${w(`Regenerate`)}: ${w(`Economy`)}`,aliases:`generate goods resources deposits markets production trade`,run:()=>Jl([`production`])},{id:`regenerateIce`,name:`${w(`Regenerate`)}: ${w(`Ice`)}`,aliases:`generate glaciers icebergs`,run:()=>Kl(`regenerateIce`,su)},{id:`zoomReset`,name:w(`Reset Zoom`),aliases:`fit view whole map`,run:()=>Gn(1e3)},{id:`zoomIn`,name:w(`Zoom In`),aliases:`view closer`,run:()=>Xn(1.2)},{id:`zoomOut`,name:w(`Zoom Out`),aliases:`view farther`,run:()=>Xn(.8)},{id:`toggleOptions`,name:w(`Toggle Menu`),aliases:`options panel show hide`,run:()=>xl()},{id:`layersTab`,name:w(`Layers Tab`),link:!0,aliases:`menu panel`,run:()=>Sl(`layersTab`)},{id:`styleTab`,name:w(`Style Tab`),link:!0,aliases:`menu panel editor`,run:()=>Sl(`styleTab`)},{id:`optionsTab`,name:w(`Options Tab`),link:!0,aliases:`menu panel settings`,run:()=>Sl(`optionsTab`)},{id:`toolsTab`,name:w(`Tools Tab`),link:!0,aliases:`menu panel`,run:()=>Sl(`toolsTab`)},{id:`aboutTab`,name:w(`About Tab`),link:!0,aliases:`menu panel info credits`,run:()=>Sl(`aboutTab`)},{id:`exportSvg`,name:w(`Export as SVG`),aliases:`download vector image`,run:()=>U.ExportMap.exportToSvg()},{id:`exportPng`,name:w(`Export as PNG`),aliases:`download image`,run:()=>U.ExportMap.exportToPng()},{id:`exportJpeg`,name:w(`Export as JPEG`),aliases:`download image`,run:()=>U.ExportMap.exportToJpeg()},{id:`exportTiles`,name:w(`Export as PNG Tiles`),aliases:`download zip`,run:()=>al()},{id:`exportJsonFull`,name:`${w(`Export to JSON`)}: ${w(`Full`)}`,aliases:`download data`,run:()=>U.ExportJson.exportToJson(`Full`)},{id:`exportJsonMinimal`,name:`${w(`Export to JSON`)}: ${w(`Minimal`)}`,aliases:`download data`,run:()=>U.ExportJson.exportToJson(`Minimal`)},{id:`exportJsonPackCells`,name:`${w(`Export to JSON`)}: ${w(`Pack cells`)}`,aliases:`download data`,run:()=>U.ExportJson.exportToJson(`PackCells`)},{id:`exportJsonGridCells`,name:`${w(`Export to JSON`)}: ${w(`Grid cells`)}`,aliases:`download data`,run:()=>U.ExportJson.exportToJson(`GridCells`)},{id:`exportGeoJsonCells`,name:`${w(`Export to GeoJSON`)}: ${w(`Cells`)}`,aliases:`download gis`,run:()=>U.ExportMap.saveGeoJsonCells()},{id:`exportGeoJsonRoutes`,name:`${w(`Export to GeoJSON`)}: ${w(`Routes`)}`,aliases:`download gis`,run:()=>U.ExportMap.saveGeoJsonRoutes()},{id:`exportGeoJsonRivers`,name:`${w(`Export to GeoJSON`)}: ${w(`Rivers`)}`,aliases:`download gis`,run:()=>U.ExportMap.saveGeoJsonRivers()},{id:`exportGeoJsonMarkers`,name:`${w(`Export to GeoJSON`)}: ${w(`Markers`)}`,aliases:`download gis`,run:()=>U.ExportMap.saveGeoJsonMarkers()},{id:`exportGeoJsonZones`,name:`${w(`Export to GeoJSON`)}: ${w(`Zones`)}`,aliases:`download gis`,run:()=>U.ExportMap.saveGeoJsonZones()},{id:`exportCsvBurgs`,name:`${w(`Export to CSV`)}: ${w(`Burgs`)}`,aliases:`download table settlements cities towns`,run:()=>C.BurgsOverview.exportCsv()},{id:`exportCsvBiomes`,name:`${w(`Export to CSV`)}: ${w(`Biomes`)}`,aliases:`download table environment terrain`,run:()=>C.BiomesEditor.exportCsv()},{id:`exportCsvRelations`,name:`${w(`Export to CSV`)}: ${w(`Relations`)}`,aliases:`download table diplomacy matrix`,run:()=>C.DiplomacyOverview.exportCsv()},{id:`exportCsvGoods`,name:`${w(`Export to CSV`)}: ${w(`Goods`)}`,aliases:`download table resources economy`,run:()=>C.GoodsEditor.exportCsv()},{id:`exportCsvMarkers`,name:`${w(`Export to CSV`)}: ${w(`Markers`)}`,aliases:`download table points of interest`,run:()=>C.MarkersOverview.exportCsv()},{id:`exportCsvMarkets`,name:`${w(`Export to CSV`)}: ${w(`Markets`)}`,aliases:`download table economy trade`,run:()=>C.MarketsOverview.exportCsv()},{id:`exportCsvMilitary`,name:`${w(`Export to CSV`)}: ${w(`Military`)}`,aliases:`download table armies forces`,run:()=>C.MilitaryOverview.exportCsv()},{id:`exportCsvRegiments`,name:`${w(`Export to CSV`)}: ${w(`Regiments`)}`,aliases:`download table military armies`,run:()=>C.RegimentsOverview.exportCsv()},{id:`exportCsvNotes`,name:`${w(`Export to CSV`)}: ${w(`Notes`)}`,aliases:`download table lore legends descriptions`,run:()=>C.NotesEditor.exportCsv()},{id:`exportCsvZones`,name:`${w(`Export to CSV`)}: ${w(`Zones`)}`,aliases:`download table areas regions`,run:()=>C.ZonesEditor.exportCsv()},{id:`showInfo`,name:w(`Show App Info`),link:!0,aliases:`about version help`,run:()=>Uc()},{id:`getApp`,name:w(`Get Desktop App`),aliases:`install download electron`,run:()=>U.AppOffer.open()},{id:`toggleSaveReminder`,name:w(`Toggle Save Reminder`),aliases:`autosave notification`,run:()=>ga()},{id:`optionsReset`,name:w(`Reset Options`),aliases:`restore defaults clear cache reload`,run:()=>Gt()},{id:`savePresetButton`,name:w(`Save Layers Preset`),aliases:`displayed layers`,run:()=>Nl()},...Object.entries(hr).map(([e,t])=>({id:`preset:${e}`,name:w(`Apply Layers Preset: {{- preset}}`,{preset:t}),aliases:`layers preset show`,run:()=>Ml(e)})),...[...dr].map(([e,t])=>({id:`layer:${e}`,name:w(`Toggle {{- layer}}`,{layer:t.label}),aliases:`layer visibility show hide`,layer:e,run:()=>O.toggle(e)}))];function Ul(e){let t=e.trim();return t.includes(`?`)||/^(how|what|why|where|when|which|who|can|could|should|is|are|do|does|did|will|would)\s+\S/i.test(t)}function Wl(e){e(),zl(),Bl()}var Gl=(e=``,t=``)=>`<div style="display: flex; flex-direction: column; gap: 0.6em;">
    <div>${w(`Regeneration will remove all the custom changes for the element.`)}</div>
    ${e}
    <div>${w(`Are you sure you want to proceed?`)}</div>
    ${t}
  </div>`;function Kl(e,t){let n=`regenerateDontAsk-${e}`;if(sessionStorage.getItem(n))return void Wl(t);let r=()=>{j(`regenerateDontAsk`)?.checked&&sessionStorage.setItem(n,`true`)};F.confirm({title:w(`Regenerate element`),message:Gl(``,`<div>
        <input id="regenerateDontAsk" class="checkbox" type="checkbox" />
        <label for="regenerateDontAsk" class="checkbox-label"><i>${w(`Do not ask again`)}</i></label>
      </div>`),confirm:w(`Proceed`),onConfirm:()=>{r(),Wl(t)}})}var ql=[`restore`,`deposits`,`markets`,`territories`,`production`];function Jl(e){let t={restore:w(`Restore default goods`),deposits:w(`Regenerate good deposits`),markets:w(`Regenerate markets`),territories:w(`Regenerate market areas`),production:w(`Regenerate production and trade deals`)},n=e=>M(`regeneratePart-${e}`);F.confirm({title:w(`Economy Regeneration`),message:Gl(`<div style="display: flex; flex-direction: column; gap: 0.3em;">${ql.map(n=>`<div>
      <input id="regeneratePart-${n}" class="checkbox" type="checkbox" ${e.includes(n)?`checked`:``} />
      <label for="regeneratePart-${n}" class="checkbox-label">${t[n]}</label>
    </div>`).join(``)}</div>`),confirm:w(`Proceed`),onConfirm:()=>Wl(()=>ru(new Set(ql.filter(e=>n(e).checked))))});for(let[t,r]of[[`restore`,`deposits`],[`markets`,`territories`]]){let i=n(t),a=n(r),o=()=>{a.checked=i.checked||e.includes(r),a.disabled=i.checked};i.addEventListener(`change`,o),o()}}function Yl({units:e,stateId:t}={}){let n=t?pack.states[t]:void 0,r=n?[n.i]:void 0,i=e=>()=>Wl(()=>{e(),j(`regimentEditor`)&&F.close(`regimentEditor`),O.draw(`military`)}),a=[{label:w(`Update`),tip:w(`Update troop numbers in existing regiments. New regiments form only where a state has none nearby`),onClick:i(()=>Cn.raiseUnits(e??options.map.military.units.map(({name:e})=>e),r))},{label:w(`Regenerate`),tip:w(`Regenerate regiments from scratch. Manual changes to them will be lost`),onClick:i(()=>Cn.regenerate(r))},e?{label:w(`Keep`),tip:w(`Change nothing now. The new settings apply at the next recalculation`)}:{label:w(`Cancel`),tip:``}],o=e?w(`Units are saved. Troops of changed units are not updated yet: {{units}}`,{units:e.join(`, `)}):n?w(`Recalculate military forces of {{state}}?`,{state:E(n.name)}):w(`Are you sure you want to recalculate military forces for all states?`);F.message({title:w(`Recalculate military`),message:[o,...a.filter(({tip:e})=>e).map(({label:e,tip:t})=>`<b>${e}</b>: ${t}`)].join(`<br><br>`),width:`32em`,buttons:a})}function Xl(){for(let e of pack.states)e.i&&!e.removed&&e.label&&delete e.label;O.draw(`labels`)}function Zl(){ce.generate(),O.draw(`relief`)}function Ql(){S.regenerate(),O.draw(`routes`,`goods`,`trade`)}function $l(){p.regenerate(),ae.syncPorts(),S.sync(),O.draw(`rivers`,`burgIcons`)}function eu(){x.regenerate(),Sn.collectStatistics(),O.draw(`population`,`goods`)}function tu(){let{warning:e,error:t}=Sn.regenerate();if(t)return void I(t,!1,`error`);e&&I(e,!1,`warn`),tn.regenerate(),Cn.regenerate(),Ye(),O.draw(`states`,`borders`,`provinces`,`labels`,`burgIcons`,`military`,`markets`,`goods`,`trade`,`emblems`)}function nu(){ae.regenerate(),Sn.collectStatistics(),t.regenerate(),tn.regenerate(),O.draw(`burgIcons`,`labels`,`routes`,`population`,`markets`,`goods`,`trade`,`emblems`)}function ru(e){let n=e.has(`restore`);if(n){let e=options.map.goods.map(e=>e.i);W.restoreDefaults(),b.save(),Sn.pruneTariffs({goods:e.filter(e=>!W.get(e))}),W.generate()}else e.has(`deposits`)&&W.regenerate();let r=e.has(`markets`);r?t.regenerate():e.has(`territories`)&&t.expand(),e.has(`production`)?tn.regenerate():(n||r)&&tn.clear(),O.draw(`markets`,`goods`,`trade`)}function iu(){_.regenerate(),O.draw(`emblems`)}function au(){ti.regenerate(),O.draw(`religions`,`goods`)}function ou(){Gr.regenerate(),O.draw(`cultures`,`goods`)}function su(){yn.regenerate(),O.draw(`ice`)}function cu(e){function t(e){Ur.regenerate(e),Bl(),O.draw(`zones`,`goods`)}!e||!lt(e)?t(Bt(1,.5,.6,5,2)):F.prompt(w(`Please provide zones number multiplier`),{default:1,step:.01,min:0,max:100},e=>t(e))}var lu=`
  <div class="separator">${w(`Edit`)}</div>
  <div class="grid">
    <button id="editBiomesButton" data-tip="${w(`Biomes Editor`)}" data-shortcut="Shift + B">
      ${w(`Biomes`)}
    </button>
    <button id="overviewBurgsButton" data-tip="${w(`Burgs Overview`)}" data-shortcut="Shift + T">
      ${w(`Burgs`)}
    </button>
    <button
      id="editCoastlineSettings"
      data-tip="${w(`Coastline Settings`)}"
    >
      ${w(`Coastlines`)}
    </button>
    <button id="editCulturesButton" data-tip="${w(`Cultures Editor`)}" data-shortcut="Shift + C">
      ${w(`Cultures`)}
    </button>
    <button id="editDevelopmentButton" data-tip="${w(`Development Editor`)}" data-shortcut="Shift + X">
      ${w(`Development`)}
    </button>
    <button
      id="editDiplomacyButton"
      data-tip="${w(`Diplomacy Overview`)}"
      data-shortcut="Shift + D"
    >
      ${w(`Diplomacy`)}
    </button>
    <button id="editEmblemButton" data-tip="${w(`Edit Emblem`)}" data-shortcut="Shift + Y">
      ${w(`Emblems`)}
    </button>
    <button id="overviewFeaturesButton" data-tip="${w(`Geographical Features Overview`)}" data-shortcut="Shift + F">
      ${w(`Features`)}
    </button>
    <button id="editGoods" data-tip="${w(`Goods Editor`)}" data-shortcut="Shift + G">${w(`Goods`)}</button>
    <button
      id="editHeightmapButton"
      data-tip="${w(`Click to open Heightmap customization menu`)}"
      data-shortcut="Shift + H"
    >
      ${w(`Heightmap`)}
    </button>
    <button id="overviewMarkersButton" data-tip="${w(`Markers Overview`)}" data-shortcut="Shift + K">
      ${w(`Markers`)}
    </button>
    <button id="overviewMarketsButton" data-tip="${w(`Markets Overview`)}">
      ${w(`Markets`)}
    </button>
    <button id="editMeasurersButton" data-tip="${w(`Measurers Editor`)}" data-shortcut="Shift + =">
      ${w(`Measurers`)}
    </button>
    <button id="overviewLabelsButton" data-tip="${w(`Labels Overview`)}" data-shortcut="Shift + L">
      ${w(`Labels`)}
    </button>
    <button
      id="overviewMilitaryButton"
      data-tip="${w(`Military Overview`)}"
      data-shortcut="Shift + M"
    >
      ${w(`Military`)}
    </button>
    <button id="editNamesBaseButton" data-tip="${w(`Namesbase Editor`)}" data-shortcut="Shift + N">
      ${w(`Namesbase`)}
    </button>
    <button id="editNotesButton" data-tip="${w(`Notes Editor`)}" data-shortcut="Shift + O">${w(`Notes`)}</button>
    <button id="editProvincesButton" data-tip="${w(`Provinces Editor`)}" data-shortcut="Shift + P">
      ${w(`Provinces`)}
    </button>
    <button id="editReligions" data-tip="${w(`Religions Editor`)}" data-shortcut="Shift + R">
      ${w(`Religions`)}
    </button>
    <button id="overviewRiversButton" data-tip="${w(`Rivers Overview`)}" data-shortcut="Shift + V">
      ${w(`Rivers`)}
    </button>
    <button id="overviewRoutesButton" data-tip="${w(`Routes Overview`)}" data-shortcut="Shift + U">
      ${w(`Routes`)}
    </button>
    <button id="overviewJourneysButton" data-tip="${w(`Journeys Overview`)}" data-shortcut="Shift + J">
      ${w(`Journeys`)}
    </button>
    <button id="editStatesButton" data-tip="${w(`States Editor`)}" data-shortcut="Shift + S">
      ${w(`States`)}
    </button>
    <button id="editTradeAnimationButton" data-tip="${w(`Trade Animation Editor`)}">
      ${w(`Trade`)}
    </button>
    <button id="editUnitsButton" data-tip="${w(`Units Editor`)}" data-shortcut="Shift + Q">${w(`Units`)}</button>
    <button id="editZonesButton" data-tip="${w(`Zones Editor`)}" data-shortcut="Shift + Z">${w(`Zones`)}</button>
  </div>
  <div class="separator">${w(`Regenerate`)}</div>
  <div id="regenerateFeature" class="grid">
    <button
      id="regenerateBurgs"
      data-tip="${T(w(`Click to regenerate all unlocked burgs and routes, then markets and production`),w(`States will remain as they are`),w(`Note: burgs are only generated in populated areas with culture assigned`))}"
    >
      ${w(`Burgs`)}
    </button>
    <button id="regenerateCultures" data-tip="${w(`Click to regenerate non-locked cultures`)}">${w(`Cultures`)}</button>
    <button
      id="regenerateEconomy"
      data-tip="${w(`Open regeneration dialog`)}"
    >
      ${w(`Economy`)}
    </button>
    <button id="regenerateEmblems" data-tip="${w(`Click to regenerate all emblems`)}">${w(`Emblems`)}</button>
    <button id="regenerateIce" data-tip="${w(`Click to regenerate icebergs and glaciers`)}">${w(`Ice`)}</button>
    <button
      id="regenerateStateLabels"
      data-tip="${w(`Click to update state labels placement based on current borders`)}"
    >
      ${w(`State Labels`)}
    </button>
    <button id="regenerateMarkers" data-tip="${w(`Click to configure markers generation and regenerate unlocked markers`)}">
      ${w(`Markers`)}
    </button>
    <button
      id="regenerateMilitary"
      data-tip="${w(`Recalculate military forces based on current options`)}"
    >
      ${w(`Military`)}
    </button>
    <button id="regeneratePopulation" data-tip="${w(`Click to recalculate rural and urban population`)}">
      ${w(`Population`)}
    </button>
    <button
      id="regenerateProvinces"
      data-tip="${T(w(`Click to select states and regenerate their non-locked provinces`),w(`States will remain as they are`))}"
    >
      ${w(`Provinces`)}
    </button>
    <button
      id="regenerateReliefIcons"
      data-tip="${w(`Click to regenerate all relief icons based on current cell biome and elevation`)}"
    >
      ${w(`Relief`)}
    </button>
    <button id="regenerateReligions" data-tip="${w(`Click to regenerate non-locked religions`)}">${w(`Religions`)}</button>
    <button id="regenerateRivers" data-tip="${w(`Click to regenerate all rivers (restore default state)`)}">
      ${w(`Rivers`)}
    </button>
    <button id="regenerateRoutes" data-tip="${w(`Click to regenerate all unlocked routes`)}">${w(`Routes`)}</button>
    <button
      id="regenerateStates"
      data-tip="${w(`Click to regenerate non-locked states. Emblems, military forces and production will be regenerated as well, burgs will remain as they are, but capitals will be different`)}"
    >
      ${w(`States`)}
    </button>
    <button
      id="regenerateZones"
      data-tip="${w(`Click to regenerate zones. Hold Ctrl and click to set zones number multiplier`)}"
    >
      ${w(`Zones`)}
    </button>
  </div>
  <div class="separator">${w(`Add`)}</div>
  <div id="addFeature" class="grid">
    <button
      id="addBurgTool"
      data-tip="${T(w(`Click on map to place a burg`),w(`Hold Shift to add multiple`))}"
      data-shortcut="Shift + 1"
    >
      ${w(`Burg`)}
    </button>
    <button
      id="addLabel"
      data-tip="${T(w(`Click on map to place label`),w(`Hold Shift to add multiple`))}"
      data-shortcut="Shift + 2"
    >
      ${w(`Label`)}
    </button>
    <button
      id="addMarker"
      data-tip="${T(w(`Click on map to place a marker`),w(`Hold Shift to add multiple`))}"
      data-shortcut="Shift + 3"
    >
      ${w(`Marker`)}
    </button>
    <input type="hidden" id="addedMarkerType" name="addedMarkerType" value="" />
    <button
      id="addRiver"
      data-tip="${T(w(`Click on map to place a river`),w(`Hold Shift to add multiple`))}"
      data-shortcut="Shift + 4"
    >
      ${w(`River`)}
    </button>
    <button id="addRoute" data-tip="${w(`Open route creation dialog`)}" data-shortcut="Shift + 5">${w(`Route`)}</button>
  </div>
  <div class="separator">${w(`Show`)}</div>
  <div class="grid">
    <button id="overviewCellsButton" data-tip="${w(`Cell Details`)}" data-shortcut="Shift + E">
      ${w(`Cells`)}
    </button>
    <button
      id="overviewChartsButton"
      data-tip="${w(`Data Charts`)}"
      data-shortcut="Shift + A"
    >
      ${w(`Charts`)}
    </button>
    <button id="openMinimapButton" data-tip="${w(`Click to open minimap overview. Click minimap to center view`)}">
      ${w(`Minimap`)}
    </button>
  </div>
  <div class="separator">${w(`Create`)}</div>
  <div class="grid">
    <button id="openSubmapTool" data-tip="${w(`Click to generate a submap from the current viewport`)}">${w(`Submap`)}</button>
    <button id="openTransformTool" data-tip="${w(`Click to transform the map`)}">${w(`Transform`)}</button>
    <button id="openWrapTool" data-tip="${w(`Adjust cell shapes with a brush`)}">${w(`Wrap`)}</button>
  </div>
`;M(`toolsContent`).innerHTML=lu,M(`toolsContent`).addEventListener(`click`,e=>{if(options.app.mode)return I(w(`Exit customization mode first`),!1,`error`);if(!(e instanceof MouseEvent)||!(e.target instanceof HTMLElement)||e.target.tagName!==`BUTTON`)return;let t=Hl.find(t=>t.id===e.target.id);t&&t.run(e)});var uu=`ken burgan
Sera's Nafitlaan
Richard Rogers
Hylobate
Colin deSousa
Aurelia De La Silla
Maciej Kontny
Ricky L Cain
Iggyflare
Garrett Renner
Michael Harris
Joshua Maly
Nigel Guest
Theo Hodges
BERTHEAS Frédéric
lilMoni
Δημήτρης Μάρκογιαννακης
Lee S.
Chris Dibbs
jarrad tait
Jacen Solo
Hannes Rotestam
Preston Hicks
Лонгин
Will Fink
ControlFreq
IllAngel
John Giardina
Thiago Prado
Zhang Dijon
NoBurny
thibault tersinet
scarletsky 
Nich Smith
Omegus
Karl Abrahamsson
Sara Fernandes
peetey897
Cooper Janse
G F
Glen Aultman-Bettridge
Nathan Rogers
Benjamin Mock
CadmiumMan 
Kirk Edwards
Leigh G
Thom Colyer
Frederik
C pstj
Zachary Pecora
Trevor D'Arcey
Ryan Gauvin
Shawn Moore
Jim Channon
Kyarou
Actual_Dio
Jim B Johnson
Robert Rinne
Zion 
Kenji Yamada
DerWolf 
RLKZ1022
Neyimadd
Aaron Blair
Mira Cyr
Bird Law Expert
S A Rudy
Sam Spoerle
angel carrillo
Alden Z
Holly Loveless
Sea Wolf
Atenfox 
Cyberate
E. Jason Davis
Caro Lyns
David Kaul
Charlotte Wiland
Kyle Barrett
Ian Grau-Fay
cameron cannon
RedSpaz
John Wick
Randy Ross
Rita
Ele
Johnathan Xavier Hutchinson
Andrew Stein
Ghettov Milan
Malke
TameMoon
Daniel Cooper
Markus Peham
The Next Level
Alexander Whittaker
Sidr Dim
William Markus
Jordan
Pleaseworkforonce 
Damon Gallaty
Trentin Bergeron
Emarandzeb
Laulajatar
Dale McBane
Chris Kohut
Preston Mitchell
Andrew Kircher
Frank Fewkes
Moist mongol
Joshua Xiong
Jan Bundesmann
www15o
Game Master Pro
jason baldrick
Exp1nt
w 
Shubham Jakhotiya
Braxton Istace
LesterThePossum
Rurikid
ojacid .
james 
A Patreon of the Ahts
BigE0021
Angelique Badger
Jonathan Williams
AntiBlock 
Redsauz
Florian Kelber
John Patrick Callahan Jr
Alexandra Vesey
Bas Kroot
Dzmitry Malyshau
PedanticSteve
Josh Wren
BLRageQuit
Dario Spadavecchia
Neutrix 
Markell
Rocky
Robert Landry
Skylar Mangum-Turner
Nick Mowry
Anjen Pai
Hope You're Well
Alexandre Boivin
Racussa
Mike Conley
Karen Blythe
Mark Sprietsma
Xavier privé
Tommy Mayfield
Václav Švec
Binks
Mackenzie 
Linn Browning
Writer's Consultant Page by George J.Lekkas
Andrew Hines
Wexxler 
Jason Matthew Wuerfel
Milo Cohen
Alan Buehne
Dominick Ormsby
Espen Sæverud
Rasmus Legêne
rbbalderama
Nobody679
Prince of Morgoth
Jaryd Armstrong
Gary Smith
ThyHolyDevil
良义 金
Andrew Pirkola
Dig
Chris Gray
Tyshaun Wise
Phoenix
Ethan Cook
Jordan Bellah
Petro Lombaard
Kass Frisson
Lazer Elf
Gavin Madrigal
Rox
PinkEvil
Martin Lorber
Emanuel Pietri
Alex Beard
Jeffrey Henning
Eric Alexander Cartaya
Dust Bunny
GameNight 
Beingus
Crys Cain
Lon Varnadore
Thomas Mortensen Hansen
Drinarius
Ed Wright
Adrian Wright
Zklaus 
Chris Bloom
PlayByMail.Net
Maxim Lowe
Aquelion
Tiber
Daydream1013
Page One Project
Clonetone
Egoensis 
Brad Wardell
Heaven N Lee
BarnabyJones
Paul Ingram
Lance Saba
Chad Riley
Austin
Rowland Kingman
Decimus Vitalis
Grayson McClead
Battleturtle1
Kristin Chernoff
Justin Mcclain
Patrick Jones
Esther Busch
Chance Mena
JimmyTheBob
Antiroo 
Dalton Clark
Guilherme Aguiar
Simon Drapeau
Akirsop
Radovan Zapletal
Vanessa Anjos
Rikard Wolff
Justa Badge
teco 47
Jake
Miguel Alejandro
Blargh Blarghmoomoo
Jakob Siegel
Grant A. Murray
Jarno Hallikainen
Jan Ka
Joshua Vaught
MaxOliver 
WarWizardGames
Evan-DiLeo 
Eric Moore
Kyle S
Alex Debus
Uniquenameosaurus 
Dean Dunakin
Jack 
Bryan Brake
McNeil Atticus Inksmudge
Char 
Tom Van Orden jr
Kendall Patterson
Akylos 
Barna Csíkos
Nicholas Grabstas
OldFarkas
Riley Seaman
Daniel Gill
Kyle Robertson
Natasha Taylor
Pierrick Bertrand
Jared.K
Dylan Devenny
logic_error
SashaTK
Steve Johnson
MontyBoosh 
Achillain 
Jaden 
Vito Martono
Thirty-OneR 
Eric Foley
ThatGuyGW 
Dee Chiu
James H. Anthony
Kevin Cossutta
MadNomadMedia
Darinius Dragonclaw Studios
Tsahyla (Triston Lightyear)
Christopher Whitney
María Martín López
Annie Rishor
Aram Sabatés
Jeppe Skov Jensen
Martin Seeger
Oneiris (Oni)
EternalDeiwos
Richard Keating
StroboWolf 
Rick Falkvinge
Zewen Senpai
Adam Butler
Kassidy 
Sadie Blackthorne
ErrorForever 
Seth Fusion
Gus 
Paul 
Lucid 
Allen Varney
Hannah May
Sankroh
Eliot Miller
Detocroix 
Meg Ziegler
rob bee
Anoplexian 
Marten F
Erin D. Smale
Johnpaul Morrow
Roekai 
Drunken_Legends 
Jesse Holmes
Maxwell Hill
Jan Dvořák
SirTobit 
G0atfather
Allen S. Rout
Pippa Mitchell
Austin Miller
Caner Oleas Pekgönenç
Alison Bull Bear
Bradley Edwards
Tertiary 
Daniel
Joshua E Goodwin
Shaun Alexander
Ryan Lege
Myrrhlin
Jesper Cockx
Noirbard 
Dice
Brian Drennen
Giant Monster Games
Reya C.
Krk
Endwords 
Jacob Harrington
RK
Michael Greiner
Steven Bennett
Brice Moss
Whakomatic x
Stephen Herron
kosmobius
ZizRenanim
Barished 
Maur Razimtheth
Aaron bateson
Diklyquill
Shawn Taylor
Brady R Rathbun
FlippantFeline 
Shadow
J 
Tamashi Toh
Huw Williams
Graves
ShadeByTheSea
The Dungeon Masters
Valerie Elise
Empi3
William Pucs
Michael Carmody
Marco Veldman
naikibens220
Jordon Phillips
_gfx_ 
F. Casanova
Jared McDaris
BlastWind 
Taldonix
Connor McMartin
Nexoness 
Guy 
Maggie 
AdvancedAzrielAngel
Alfred García
Norbert Žigmund
Jennifer
Titanium Tomes
John Ackley
Invad3r233
Jonathan Killstring
Jessica Thomas
Nikita Kondratjuks
Steve Hyatt
PoliticsBuff 
Ian arless
Karnat 
Hilton Williams
Kevin 
Katharina Haase
Hisham Bedri
Bird
JOSHUA QUALTIERI
Preston Brooks
Troy Schuler
DerGeisterbär 
L. V. Werneck
Marcus Hellyrr
yami
Daniel Eric Crosby
Augusto Chiarle
Doug Churchman
David Roza
Alexander Thomas
Ashley Wilson-Savoury
Nathan L Myers
Theresa Walsh
JP Roberts III
William Henry
OldbeanOldboy
Javasharp
Diagonath 
Gun Metal Games
Scott Marner
Alloyed Clavicle
Valerii Matskevych
Spencer Sherman
Nolan Moore
James Schellenger
Pat 
Dino Princip
Shawn Spencer
Timothée CALLET
KC138
Nylian 
Kate 
Markus Finster
CanadianGold 
AstralJacks 
Keith Marshall
Scott Davis
Joseph Miranda
Shaptarshi Joarder
Branndon
EP
Johan Fröberg
Sasquatch 
Chase Mayers
Sizz_TV 
Ryan Westcott
Nathan Mitchell
Curt Flood
Mikey 
E.M. White
Billy 
Vlad Tomash
Xariun
Luke Nelson
W Maxwell Cassity-Guilliom
Marty H
Aaron Meyer
Max Amillios
chris 
cyninge 
Omegavoid 
Fritjof Olsson
Crazypedia 
Duncan Thomson
William Merriott
Gold Tamarin
Lhoris 
Jonathan
Jon
Massimo Vella
Feuver 
aymeric 
Eric Schumann
Rei 
Fondue 
Paavi1
Wil Sisney
David Patterson
L
Justin Scheffers
Commieboo
Garrison Wood
Emsiron
Frosty
John Joseph Adams
The_Lone_Wanderer
Andrew Stein
Groonfish
soup
Bruno Haack Vilar
Ian Burke
Tentacle Shogun
Andrew Chandler
Fritz Wulfram
Doom Chupacabra
Zakharov
Dylan Fox
Alfred Piccioni
Avery Vreeland
Kennedy
Zack Wolf
Matjam
Jeff Johnston
Hunter Hawthorne
Sunsette 
Travis Love
Dakian Delomast
Kyle
Davis Walker
Naomi
Clément D
Jake Herr
ReV0LT
Jack Dawson
Queso y Libertad
RadioJay21H
NEO
Crecs
A AASD
Mikhail Ushakov
NoFun
AmbiguousCake
Madeline Naiman
2FingerzDown
Josiah Lulf
Vector Tragedy
yann
Blarghle Hargle
Jelke Boonstra
afistupmabum
Rob Frantz
Driver
Tr4v3l3r
Cooper Cantrell
Maximilien Bouillot
J.E. Ellis
Igor
John Todd
burning.rosary
Shane Roppel
Hank Agrippa
Noah Morris
Phil Karecki
Matthew Jarocki
Lucius Licinius Lucullus
Andrew Haney
Noah Morris
Phil Karecki
Matthew Jarocki
Lucius Licinius Lucullus
Andrew Haney
Jesse Luke
Lord_Luce
Neko no Maigo
Hossyboy 
Yasui Masatake
Jesse Roy
Remain
Douglas Rector
J Clark
Raine Logan
Matty Ice
DieMuetze
Dan Popoli
Marwyn
Kederalia
Whyse Wytch
Elliyevee
James Miller
Pirate Fish
David Leitner
Vyritecht
emre
Don't mail me
Isaac Wooten
MisterPete
Johanna Martin
Marmalade_MacGuffin
James Benware
FortunesFaded
breadsticks
Murderbits
Ben Jones
Marco Faltracco
L
silentArtifact
Keith Potter
Morgan Gilbert
Alengork Gamer
Don Johnson
Mish
effervescent
Trevor Sansom
Eric Christian Berg
Jamin
Aurelia De La Sella
morgan
Barry Gill
Wolf
Titan_650
Sebastian Tampu
dr_not_sam
Mie96
Riley
Amber Davis
tomtom1969vlbg
Eric Knight
Adeline Lefizelier
Jerry Palmer
Colin Lewis
ｌうｃｙ
Peyton
Silvershade
jim8333
Kevin
Jeffrey Brown
Tyler Riggs
Justin Warrington
Sovrynth Systems
Coffee
Justin
Paul Facknitz
William Fichou
Morphine
ussis6nad
Ælyndor
Patrick McEntee
y John
Sean O'Daniels
ShadowMole
FlightlessDutchman
Gawain Yeo
Tom Hollingworth
Scott Gunn
Gabe Hurd
Benjamin Sardinsky
Task_Failer
Gawain Yeo
Tom Hollingworth
Scott Gunn
Gabe Hurd
Benjamin Sardinsky
Task_Failer
Sable Crow
HaginZuria
Conor Pewterbaugh
Warren
f
YeOldeRaven`,du=`https://github.com/Azgaar/Fantasy-Map-Generator`,fu=`${du}/wiki`,pu=`
  <div class="aboutActions">
    <button
      id="startTourButton"
      data-tip="${w(`Take an interactive tour of the map generator`)}"
      style="flex: 1; border: 1px solid var(--header);"
    >
      ${w(`Interactive Tour`)}
    </button>
    <button
      id="getAppButton"
      data-tip="${w(`Install the Generator on your computer`)}"
      style="flex: 1; border: 1px solid var(--header);"
    >
      ${w(`Desktop App`)}
    </button>
  </div>
  <p>
    ${T(w(`{{- generator}} is an {{- openSource}} tool by Azgaar and Team.`,{generator:k(du,w(`Fantasy Map Generator`)),openSource:k(`${du}/blob/master/LICENSE`,w(`open source`))}),w(`You may use maps as they are, edit them or even create a new map from scratch.`),w(`Check out the {{- quickStart}}, {{- qaa}}, {{- video}} and {{- hotkeys}} for guidance.`,{quickStart:k(`${fu}/Quick-Start-Tutorial`,w(`Quick start tutorial`)),qaa:k(`${fu}/Q&A`,w(`Q&A page`)),video:k(`https://youtube.com/playlist?list=PLtgiuDC8iVR2gIG8zMTRn7T_L0arl9h1C`,w(`Video tutorial`)),hotkeys:k(`${fu}/Hotkeys`,w(`hotkeys`))}))}
  </p>
  <p>
    ${T(w(`Join our {{- discord}} and {{- reddit}} to ask questions, get help and share maps.`,{discord:k(`https://discordapp.com/invite/X7E84HU`,w(`Discord server`)),reddit:k(`https://www.reddit.com/r/FantasyMapGenerator/`,w(`Reddit community`))}),w(`The created maps can be used for free, even for commercial purposes.`))}
  </p>
  <p>
    ${T(w(`The project is under active development.`),w(`Creator and main maintainer: Azgaar.`),w(`To track the development progress see the {{- devboard}}.`,{devboard:k(`https://trello.com/b/7x832DG4/fantasy-map-generator`,w(`devboard`))}),w(`For older versions see the {{- changelog}}.`,{changelog:k(`${fu}/Changelog`,w(`changelog`))}),w(`Please report bugs {{- here}}.`,{here:k(`${du}/issues`,w(`here`))}),w(`You can also contact me directly via {{- email}}.`,{email:`<a href="mailto:azgaar.fmg@yandex.by" target="_blank">${w(`email`)}</a>`}))}
  </p>
  <div
    style="
      background-color: #e85b46;
      padding: 0.4em;
      width: max-content;
      margin: 0.6em auto 0 auto;
      border: 1px solid #943838;
    "
  >
    <a
      href="https://www.patreon.com/azgaar"
      target="_blank"
      style="color: white; text-decoration: none; font-family: sans-serif"
    >
      <div>
        <div style="width: 0.8em; display: inline-block; padding: 0 0.2em; fill: white">
          <svg viewBox="0 0 569 546">
            <circle cx="362.589996" cy="204.589996" data-fill="1" id="Oval" r="204.589996" />
            <rect data-fill="2" height="545.799988" id="Rectangle" width="100" x="0" y="0" />
          </svg>
        </div>
        ${w(`SUPPORT ON PATREON`)}
      </div>
    </a>
  </div>
  <p>
    ${w(`Thanks for all supporters on {{- patreon}}!`,{patreon:`<a id="supportersLink" data-tip="${w(`Click to see list of supporters`)}">Patreon</a>`})}
  </p>
  <div style="display: flex; justify-content: center; padding: 0.4em; font-family: cursive">
    <a href="https://u24.gov.ua/" style="width: 80%" data-tip="${w(`Support Ukraine`)}" target="_blank">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200">
        <rect width="100%" height="100%" fill="#005bbb"></rect>
        <rect y="50%" width="100%" height="50%" fill="#ffd500"></rect>
        <text x="50%" text-anchor="middle" font-size="5em" y="32%" fill="#f5f5f5">${w(`Support Ukraine`)}</text>
        <text x="50%" text-anchor="middle" font-size="4em" y="78%" fill="#005bdd">u24.gov.ua</text>
      </svg>
    </a>
  </div>
  <div style="text-align: left">
    <p>${w(`Check out our other projects`)}:</p>
    <div>• <a href="https://azgaar.github.io/Armoria" target="_blank">Armoria</a>: ${w(`a tool for creating coats of arms`)}</div>
    <div>• <a href="https://deorum.vercel.app" target="_blank">Deorum</a>: ${w(`gallery of fantasy characters`)}</div>
  </div>
  <ul class="share-buttons">
    <li>
      <a
        href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fazgaar.github.io%2FFantasy-Map-Generator%2F&quote="
        data-tip="${w(`Share on Facebook`)}"
        target="_blank"
        ><img alt="${w(`Share on Facebook`)}" src="images/Facebook.png" loading="lazy"
      /></a>
    </li>
    <li>
      <a
        href="https://twitter.com/intent/tweet?source=https%3A%2F%2Fazgaar.github.io%2FFantasy-Map-Generator&text=%23FantasyMapGenerator%0A%0Ahttps%3A//azgaar.github.io/Fantasy-Map-Generator"
        target="_blank"
        data-tip="${w(`Tweet`)}"
        ><img alt="${w(`Tweet`)}" src="images/Twitter.png" loading="lazy"
      /></a>
    </li>
    <li>
      <a
        href="http://pinterest.com/pin/create/button/?url=https%3A%2F%2Fazgaar.github.io%2FFantasy-Map-Generator"
        target="_blank"
        data-tip="${w(`Pin it`)}"
        ><img alt="${w(`Pin it`)}" src="images/Pinterest.png" loading="lazy"
      /></a>
    </li>
    <li>
      <a
        href="http://www.reddit.com/submit?url=https%3A%2F%2Fazgaar.github.io%2FFantasy-Map-Generator"
        target="_blank"
        data-tip="${w(`Submit to Reddit`)}"
        ><img alt="${w(`Submit to Reddit`)}" src="images/Reddit.png" loading="lazy"
      /></a>
    </li>
    <li>
      <a href="https://discord.gg/X7E84HU" target="_blank" data-tip="${w(`Join Discord server`)}"
        ><img alt="${w(`Join Discord server`)}" src="images/Discord.png" loading="lazy"
      /></a>
    </li>
  </ul>
`;M(`aboutContent`).innerHTML=pu;function mu(){let e=window.innerWidth<800?2:5,t=uu.split(`
`).sort();F.message({title:w(`Patreon supporters`),width:`min-width`,message:`<ul style="column-count: ${e}; column-gap: 2em">${t.map(e=>`<li>${e}</li>`).join(``)}</ul>`})}M(`startTourButton`).addEventListener(`click`,()=>U.UiTour.start()),M(`getAppButton`).addEventListener(`click`,()=>U.AppOffer.open()),M(`supportersLink`).addEventListener(`click`,mu),document.addEventListener(`keydown`,hu),document.addEventListener(`keyup`,gu);function hu(e){if(!bu())return;let{code:t,ctrlKey:n,metaKey:r,altKey:i,shiftKey:a}=e;(n||r)&&t===`KeyS`?(e.preventDefault(),e.repeat||U.Save.toMachine(a)):(i&&!n&&!a&&e.preventDefault(),n&&[`KeyS`,`KeyC`].includes(t)&&e.preventDefault(),[`F1`,`F2`,`F6`,`F9`,`Tab`].includes(t)&&e.preventDefault())}function gu(e){if(!bu()||(e.stopPropagation(),options.map.viewOnly&&!vu(e)))return;let{code:t,key:n,ctrlKey:r,metaKey:i,shiftKey:a,altKey:o}=e,s=r||i||n===`Control`;if(s&&t===`KeyS`)return;let c=(a||n===`Shift`)&&!o,l=o&&(a||n===`Shift`)&&!s,u=gr(t),d=xu();if(t===`Space`)yu(e);else if(t===`F1`)U.ReleaseNotes.open();else if(t===`F2`)os();else if(t===`F6`)U.Save.toStorage();else if(t===`F9`)U.Load.quickLoad();else if(t===`Tab`)xl(e);else if(t===`Escape`)F.closeAll(),bl();else if(t===`Delete`)wu();else if(t===`KeyO`&&j(`canvas3d`))C.View3d.toggleOptions();else if(s&&t===`KeyQ`)ga();else if(s&&t===`KeyC`)U.Save.toDropbox();else if(s&&t===`KeyZ`)j(`undo`)?.click();else if(s&&t===`KeyY`)j(`redo`)?.click();else if((c||l)&&t===`KeyH`)C.HeightmapEditor.open();else if((c||l)&&t===`KeyB`)C.BiomesEditor.open();else if((c||l)&&t===`KeyS`)C.StatesEditor.open();else if((c||l)&&t===`KeyP`)C.ProvincesEditor.open();else if((c||l)&&t===`KeyD`)C.DiplomacyOverview.open();else if((c||l)&&t===`KeyL`)C.LabelsOverview.open();else if((c||l)&&t===`KeyC`)C.CulturesEditor.open();else if((c||l)&&t===`KeyN`)C.NamesbaseEditor.open();else if((c||l)&&t===`KeyZ`)C.ZonesEditor.open();else if((c||l)&&t===`KeyR`)C.ReligionsEditor.open();else if((c||l)&&t===`KeyY`)C.EmblemsEditor.openDefault();else if((c||l)&&t===`KeyQ`)C.UnitsEditor.open();else if((c||l)&&t===`KeyO`)C.NotesEditor.open();else if((c||l)&&t===`KeyA`)C.ChartsOverview.open();else if((c||l)&&t===`KeyT`)C.BurgsOverview.open();else if((c||l)&&t===`KeyU`)C.RoutesOverview.open();else if((c||l)&&t===`KeyF`)C.FeaturesOverview.open();else if((c||l)&&t===`KeyV`)C.RiversOverview.open();else if((c||l)&&t===`KeyM`)C.MilitaryOverview.open();else if((c||l)&&t===`KeyK`)C.MarkersOverview.open();else if((c||l)&&t===`KeyE`)C.CellInfo.open();else if((c||l)&&t===`KeyG`)C.GoodsEditor.open();else if((c||l)&&t===`KeyJ`)C.JourneysOverview.open();else if((c||l)&&t===`KeyW`)C.WrapTool.open();else if((c||l)&&t===`KeyX`)C.DevelopmentEditor.open();else if((c||l)&&t===`Equal`&&!d)C.MeasurersEditor.open();else if(n===`!`)C.BurgCreator.toggle();else if(n===`@`)C.LabelCreator.toggle();else if(n===`#`)C.MarkerCreator.toggle();else if(n===`$`)C.RiverAutoCreator.toggle();else if(n===`%`)C.RouteCreator.open();else if(t===`BracketRight`)Cu(t);else if(t===`BracketLeft`&&Cu(t))return;else u&&(t!==`Equal`||!options.app.mode&&!d)?O.toggle(u):t===`ArrowLeft`?Zn(10,0):t===`ArrowRight`?Zn(-10,0):t===`ArrowUp`?Zn(0,10):t===`ArrowDown`?Zn(0,-10):n===`+`||n===`-`||n===`=`?Su(n,d):n===`0`?Gn(1e3):n===`1`?er(1):n===`2`?er(2):n===`3`?er(3):n===`4`?er(4):n===`5`?er(5):n===`6`?er(6):n===`7`?er(7):n===`8`?er(8):n===`9`&&er(9)}var _u=[`Space`,`F1`,`F2`,`F9`,`Tab`,`Escape`,`KeyO`,`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`];function vu({code:e,key:t,ctrlKey:n,metaKey:r,altKey:i,shiftKey:a}){return n||r||i?!1:_u.includes(e)?!0:/^[\d=+-]$/.test(t)?!(a&&e===`Equal`):!a&&!!gr(e)}function yu(e){if(e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||xu())return;let t=document.activeElement;t&&t!==document.body||C.Omnibar.open()}function bu(){let e=document.activeElement,t=e?.tagName,n=e?.contentEditable;return!([`INPUT`,`SELECT`,`TEXTAREA`].includes(t??``)||t===`DIV`&&n===`true`||document.getSelection()?.toString())}function xu(){return[...document.querySelectorAll(`[data-brush-size]`)].find(e=>e.offsetParent)??null}function Su(e,t=xu()){if(t){let n=Number(t.dataset.keyStep)||5,r=e===`-`?-n:n,i=Number(t.getAttribute(`min`))||5,a=Number(t.getAttribute(`max`))||100;t.value=String(Ae(+t.value+r,i,a)),t.dispatchEvent(new Event(`input`,{bubbles:!0}))}else Xn(e===`+`?1.2:.8)}function Cu(e){return!j(`brushesButtons`)?.querySelector(`button.pressed`)&&!xu()?!1:(Su(e===`BracketLeft`?`-`:`+`),!0)}function wu(){let e=Array.from(document.querySelectorAll(`[role='dialog'] .fastDelete`)).find(e=>e.style.display!==`none`);e&&e.click();let t=Array.from(document.querySelectorAll(`[role='dialog']`)).filter(e=>e.style.display!==`none`);t.length&&t.forEach(e=>{e.querySelectorAll(`button`).forEach(e=>{e.textContent===w(`Remove`)&&e.click()})})}var Tu=new WeakMap;function Eu(e,t=`${e}Header`){let n=j(t);if(!n)return;let r=Au(n);Mu(e,n),ku(n);for(let t of Array.from(n.querySelectorAll(`.sortable`)))t.addEventListener(`click`,()=>Ou(e,t));ir.onReset(e,`sorting`,()=>{Nu(n,r),ku(n)})}function Du(e,t){let n=t.classList.contains(`alphabetically`)?`name`:`number`,r=t.className.includes(`icon-sort`),i=t.className.includes(`-down`)?`-up`:`-down`;!r&&n===`name`&&(i=`-up`);let a=t.parentNode;for(let e of Array.from(a.querySelectorAll(`div.sortable`)))for(let t of Array.from(e.classList))t.includes(`icon-sort`)&&e.classList.remove(t);t.classList.add(`icon-sort-${n}${i}`),ju(e,a)}function Ou(e,t){Du(e,t),ku(t.parentNode)}function ku(e){let t=e.querySelector(`div[class*='icon-sort']`);if(!t)return;let n=t.dataset.sortby,r=t.classList.contains(`alphabetically`),i=t.className.includes(`-down`)?-1:1,a=e.nextElementSibling;Array.from(a.children).sort((e,t)=>{let a=r?e.dataset[n]:Number(e.dataset[n]),o=r?t.dataset[n]:Number(t.dataset[n]);return a===void 0||o===void 0?0:(a>o?1:a<o?-1:0)*i}).forEach(e=>{a.appendChild(e)})}function Au(e){let t=e.querySelector(`div[class*='icon-sort']`);return t?{sortBy:t.dataset.sortby,alphabetically:t.classList.contains(`alphabetically`),direction:t.className.includes(`-down`)?-1:1}:null}function ju(e,t){let n=Au(t);n&&ir.set(e,`sorting`,n)}function Mu(e,t){let n=ir.get(e,`sorting`,()=>Au(t));n&&(Array.from(t.querySelectorAll(`.sortable`)).find(e=>e.dataset.sortby===n.sortBy)?Nu(t,n):ir.remove(e,`sorting`))}function Nu(e,t){for(let t of Array.from(e.querySelectorAll(`.sortable`)))for(let e of Array.from(t.classList))e.includes(`icon-sort`)&&t.classList.remove(e);if(!t)return;let n=Array.from(e.querySelectorAll(`.sortable`)).find(e=>e.dataset.sortby===t.sortBy);if(!n)return;let r=n.classList.contains(`alphabetically`)?`name`:`number`,i=t.direction===-1?`down`:`up`;n.classList.add(`icon-sort-${r}-${i}`)}function Pu(e,t,n){let r=n[t.sortBy];if(!r)return e;let i=e.map(e=>({item:e,key:r(e)}));i.sort((e,n)=>{if(t.alphabetically){let r=String(e.key),i=String(n.key);return(r>i?1:r<i?-1:0)*t.direction}return(Number(e.key)-Number(n.key))*t.direction});for(let t=0;t<i.length;t++)e[t]=i[t].item;return e}function Fu(e,t){let n=M(`${e}Header`),r=Au(n);Mu(e,n);for(let r of Array.from(n.querySelectorAll(`.sortable`)))r.addEventListener(`click`,()=>{Du(e,r),t()});ir.onReset(e,`sorting`,()=>{Tu.delete(n),Nu(n,r),t()})}function Iu(e,t,n){let r=M(`${e}Header`),i=Au(r);if(!i)return t;let a={};for(let e of n)e.sortBy&&(a[e.key]=e.sortBy);let o=[i,...(Tu.get(r)||[]).filter(e=>e.sortBy!==i.sortBy)];Tu.set(r,o);for(let e of o.toReversed())Pu(t,e,a);return t}var Lu=`
  fill-box:not([disabled]) {
    cursor: pointer;
  }

  fill-box > svg {
    vertical-align: middle;
    pointer-events: none;
  }

  fill-box > svg > rect {
    stroke: #666666;
    stroke-width: 2;
  }
`,Ru=document.createElement(`style`);Ru.setAttribute(`type`,`text/css`),Ru.innerHTML=Lu,document.head.appendChild(Ru);var zu=document.createElement(`template`);zu.innerHTML=`
  <svg>
    <rect x="0" y="0" width="100%" height="100%">
  </svg>
`;function Bu(){I(this.tip)}var Vu=class extends HTMLElement{constructor(){super(),this.appendChild(zu.content.cloneNode(!0)),this.querySelector(`rect`)?.setAttribute(`fill`,this.fill),this.querySelector(`svg`)?.setAttribute(`width`,this.size),this.querySelector(`svg`)?.setAttribute(`height`,this.size)}connectedCallback(){this.addEventListener(`mousemove`,Bu)}disconnectedCallback(){this.removeEventListener(`mousemove`,Bu)}get fill(){return this.getAttribute(`fill`)||`#333`}set fill(e){this.setAttribute(`fill`,e),this.querySelector(`rect`)?.setAttribute(`fill`,e)}get size(){return this.getAttribute(`size`)||`1em`}get tip(){return this.dataset.tip||T(w(`Fill style`),w(`Click to change`))}};customElements.define(`fill-box`,Vu);var Hu=`
  slider-input {
    display: flex;
    align-items: center;
    gap: .4em;
  }
`,Uu=document.createElement(`style`);Uu.setAttribute(`type`,`text/css`),Uu.innerHTML=Hu,document.head.appendChild(Uu);var Wu=document.createElement(`template`);Wu.innerHTML=`
  <input type="range" />
  <input type="number" />
`;var Gu=class extends HTMLElement{static observedAttributes=[`min`,`max`,`step`];constructor(){super(),this.appendChild(Wu.content.cloneNode(!0));let e=this.querySelector(`input[type=range]`),t=this.querySelector(`input[type=number]`);e.min=t.min=this.getAttribute(`min`)||`0`,e.max=t.max=this.getAttribute(`max`)||`100`,e.step=t.step=this.getAttribute(`step`)||`1`,e.value=t.value=this.value||this.getAttribute(`value`)||`50`,e.addEventListener(`input`,this.handleEvent.bind(this)),t.addEventListener(`input`,this.handleEvent.bind(this)),e.addEventListener(`change`,this.handleEvent.bind(this)),t.addEventListener(`change`,this.handleEvent.bind(this))}attributeChangedCallback(e,t,n){if(n!==null)for(let t of this.querySelectorAll(`input`))t.setAttribute(e,n)}handleEvent(e){let t=e.target.value;if(Number.isNaN(Number(t))||t===``)return e.stopPropagation();let n=this.querySelector(`input[type=range]`),r=this.querySelector(`input[type=number]`);this.value=n.value=r.value=t,this.dispatchEvent(new CustomEvent(e.type,{detail:{value:t},bubbles:!0,composed:!0}))}set value(e){let t=this.querySelector(`input[type=range]`),n=this.querySelector(`input[type=number]`);t.value=n.value=e}get value(){return this.querySelector(`input[type=number]`).value}get valueAsNumber(){return this.querySelector(`input[type=number]`).valueAsNumber}};customElements.define(`slider-input`,Gu);var Ku=(e,t)=>{N(`#debug`).selectAll(`text`).remove(),N(`#debug`).selectAll(`text`).data(e).enter().append(`text`).attr(`x`,(e,n)=>t[n][0]).attr(`y`,(e,n)=>t[n][1]).text(e=>e)},qu=(e,t)=>{let n=jt(e),r=mt(e),i=ar.get(styles.heightmap.groups.landHeights.options.scheme);e=e.map(e=>1-Oe(e,r,n)),N(`#debug`).selectAll(`polygon`).remove(),N(`#debug`).selectAll(`polygon`).data(e).enter().append(`polygon`).attr(`points`,(e,n)=>String(dn.getPolygon(n,t))).attr(`fill`,e=>i(e)).attr(`stroke`,e=>i(e))},Ju=e=>{N(`#debug`).select(`#connections`).remove();let t=N(`#debug`).append(`g`).attr(`id`,`connections`).attr(`stroke-width`,.8),n=e.cells.p,r=e.cells.routes;for(let e in r)for(let i in r[e]){let[a,o]=n[e],[s,c]=n[i],[l,u]=[(a+s)/2,(o+c)/2],d=r[e][i];t.append(`line`).attr(`x1`,a).attr(`y1`,o).attr(`x2`,l).attr(`y2`,u).attr(`data-id`,d).attr(`stroke`,Mn[d%12])}},Yu=([e,t],{color:n=`red`,radius:r=.5})=>{N(`#debug`).append(`circle`).attr(`cx`,e).attr(`cy`,t).attr(`r`,r).attr(`fill`,n)},Xu=(e,{color:t=`red`,width:n=.5})=>{let r=xt().curve(ur);N(`#debug`).append(`path`).attr(`d`,je(r(e))).attr(`stroke`,t).attr(`stroke-width`,n).attr(`fill`,`none`)},Zu=`river-cells.river-points.river-ownership.river-ends.river-parent.river-sea.river-unique.river-outlet.route-points.route-steps.route-links.route-cache.journey-points.journey-steps.marker-cells.burg-cells.burg-positions.burg-features.burg-routes.burg-markets.cell-burgs.state-centers.state-capitals.state-provinces.province-centers.province-capitals.culture-centers.religion-centers.regiment-cells.zone-cells.market-centers.cell-owners.lake-links.cell-arrays.cell-values.feature-data`.split(`.`),Qu=[`h`,`t`,`f`,`haven`,`harbor`,`biome`,`pop`,`s`,`culture`,`state`,`province`,`religion`,`burg`,`good`,`r`,`fl`,`conf`,`market`],$u=new class{rules=Zu;check(){let e=new Map,t=(t,n)=>{let r=e.get(t)??[];r.push(String(n)),e.set(t,r)},{cells:n,features:r}=pack,i=n.i.length,a=e=>Number.isInteger(e)&&e>=0&&e<i,o=e=>a(e)&&!yt(e,pack),s=(e,t)=>e===t||n.c[e]?.includes(t),c=e=>{let t=-1;for(let n=e.length-1;n>=0;n--){let[r,i,o]=e[n];if(!a(o))return!0;let c=P.findCell(r,i);if(!s(o,c)&&!(a(t)&&s(t,c)))return!0;e[n-1]?.[2]!==o&&(t=o)}return!1},l=(e=[])=>e.filter(e=>e.i&&!e.removed),u=(e,t)=>!(!e[t]?.i||e[t].removed),d=e=>a(e)&&r[n.f[e]]?.type===`ocean`,{width:f,height:p}=options.map.graph,m=(e,t)=>e>0&&e<f&&t>0&&t<p,h=new Set(pack.rivers.map(e=>e.i));for(let e of pack.rivers){if(!Array.isArray(e.cells)){t(`river-cells`,e.i);continue}(e.cells.some(e=>e!==-1&&!a(e))||e.points&&e.points.length!==e.cells.length)&&t(`river-cells`,e.i),e.points?.some((t,n)=>a(e.cells[n])&&P.findCell(...t)!==e.cells[n])&&t(`river-points`,e.i),e.cells.some(e=>o(e)&&!h.has(n.r[e]))&&t(`river-ownership`,e.i),a(e.source)&&(a(e.mouth)||e.mouth===-1)||t(`river-ends`,e.i),e.parent&&!h.has(e.parent)&&t(`river-parent`,e.i),e.cells.slice(0,-1).some(d)&&t(`river-sea`,e.i);let r=e.cells.filter((t,n)=>t!==-1&&t!==e.cells[n-1]);new Set(r).size!==r.length&&t(`river-unique`,e.i);let i=e.cells.indexOf(-1),s=e.points?.at(-1);i!==-1&&(i<e.cells.length-1||s&&m(...s))&&t(`river-outlet`,e.i)}let g=new Set(pack.routes.map(e=>e.i)),_=new Set;for(let e of pack.routes){c(e.points)&&t(`route-points`,e.i);for(let n=1;n<e.points.length;n++){let[r,i]=[e.points[n-1][2],e.points[n][2]];_.add(`${r}-${i}`).add(`${i}-${r}`),a(r)&&a(i)&&!s(r,i)&&t(`route-steps`,e.i)}}for(let[e,r]of Object.entries(n.routes??{}))for(let[n,i]of Object.entries(r))a(+e)&&a(+n)&&g.has(i)&&_.has(`${e}-${n}`)||t(`route-links`,e);let te=S.connections;for(let e of te?.keys()??[])_.has(e)||t(`route-cache`,e);for(let e of pack.journeys??[])for(let n of e.segments){let{points:r}=n;c(r)&&t(`journey-points`,e.i),ee.getDomain(n.transport)!==`air`&&r.some(([,,e],t)=>t&&a(e)&&!s(r[t-1][2],e))&&t(`journey-steps`,e.i)}for(let e of pack.markers)a(e.cell)&&P.findCell(e.x,e.y)===e.cell||t(`marker-cells`,e.i);let v=new Set,ne=new Set((pack.markets??[]).map(e=>e.i));for(let e of l(pack.burgs)){(!o(e.cell)||n.burg[e.cell]!==e.i||v.has(e.cell))&&t(`burg-cells`,e.i),v.add(e.cell),a(e.cell)&&P.findCell(e.x,e.y)!==e.cell&&t(`burg-positions`,e.i);let i=e.port?r[e.port]:void 0;(e.feature!==n.f[e.cell]||e.port&&(!i||i.land))&&t(`burg-features`,e.i),a(e.cell)&&!Object.keys(n.routes?.[e.cell]??{}).length&&t(`burg-routes`,e.i),ne.has(n.market?.[e.cell]??0)||t(`burg-markets`,e.i)}for(let e=0;e<i;e++){let r=n.burg[e];r&&(!u(pack.burgs,r)||pack.burgs[r].cell!==e)&&t(`cell-burgs`,e)}for(let e of l(pack.states)){let r=pack.burgs[e.capital];!e.capital||!u(pack.burgs,e.capital)?t(`state-capitals`,e.i):e.center!==r.cell&&t(`state-centers`,e.i),!e.capital&&n.state[e.center]!==e.i&&t(`state-centers`,e.i),e.provinces?.some(e=>!u(pack.provinces,e))&&t(`state-provinces`,e.i);for(let n of e.military??[])a(n.cell)||t(`regiment-cells`,`${e.i}-${n.i}`)}for(let e of l(pack.provinces)){e.burg&&!u(pack.burgs,e.burg)&&t(`province-capitals`,e.i);let r=n.province[e.center]===e.i;(!a(e.center)||!r&&pack.burgs[e.burg]?.cell!==e.center)&&t(`province-centers`,e.i)}for(let e of l(pack.cultures))o(e.center)||t(`culture-centers`,e.i);for(let e of l(pack.religions))o(e.center)||t(`religion-centers`,e.i);for(let e of pack.zones)e.cells.some(e=>!a(e))&&t(`zone-cells`,e.i);for(let e of pack.markets??[])u(pack.burgs,e.centerBurgId)||t(`market-centers`,e.i);let re=[[n.state,pack.states],[n.culture,pack.cultures],[n.province,pack.provinces],[n.religion,pack.religions]];for(let[e,n]of re)for(let r=0;r<i;r++)e?.[r]&&!u(n,e[r])&&t(`cell-owners`,r);for(let e of r)e?.type===`lake`&&(e.outlet&&!h.has(e.outlet)||e.inlets?.some(e=>!h.has(e)))&&t(`lake-links`,e.i);for(let e of Qu)n[e]?.length!==i&&t(`cell-arrays`,e);for(let e=0;e<i;e++)(!Number.isFinite(n.pop?.[e])||o(e)&&!n.biome?.[e])&&t(`cell-values`,e);for(let e of r)e&&(!e.name||e.type!==`ocean`&&!e.group)&&t(`feature-data`,e.i);return Zu.flatMap(t=>{let n=e.get(t);return n?[{rule:t,count:n.length,examples:n.slice(0,5)}]:[]})}},ed=new class{smoothHeightmap(){grid.cells.h.forEach((e,t)=>{let n=[e,...grid.cells.c[t].map(e=>grid.cells.h[e])],r=Vt(n);grid.cells.h[t]=yt(t,grid)?Math.min(r,19):Math.max(r,20)})}resamplePrimaryGridData(e,t,n,r){grid.cells.h=new Uint8Array(grid.points.length),grid.cells.temp=new Int8Array(grid.points.length),grid.cells.prec=new Uint8Array(grid.points.length);let i=_t(t.cells.p.map(([e,t],n)=>[e,t,n]));grid.points.forEach(([r,a],o)=>{let[s,c]=n(r,a),l=i.find(s,c,1/0)?.[2];if(l===void 0)return;let u=t.cells.g[l];grid.cells.h[o]=e.cells.h[u],grid.cells.temp[o]=e.cells.temp[u],grid.cells.prec[o]=e.cells.prec[u]}),r>=2&&this.smoothHeightmap()}process(e){let{projection:t,inverse:n,scale:r}=e,i=structuredClone(grid),o=sr.snapshot();if(options.map.graph.points=a(options.generation.graph.density),grid=dn.generate(options.map.seed),pack={},this.resamplePrimaryGridData(i,o.pack,n,r),m.markupGrid(),dn.addDeepDepressionLakes(),dn.openNearSeaLakes(),_e.calculate(),bn.generate(),P.generate(),!pack.cells.i.length)throw Error(`The area holds no land`);m.markupPack(),yn.generate(),$t.createDefaultRuler(),sr.restore(o,{projection:t,inverse:n,scale:r,rivers:`restore`,relief:!1})}},td=new class{rename(e){options.map.lore.name=y(e)}setYear(e){if(typeof e!=`number`||!Number.isFinite(e))throw Error(`The year must be a number`);options.map.lore.calendar.year=Math.round(e)}setEra(e,t){let{calendar:n}=options.map.lore;n.era=y(e),n.eraShort=t===void 0?B.getEraShort(n.era):y(t)}setDescription(e){if(typeof e!=`string`)throw Error(`The description must be text`);options.map.lore.description=e}},nd=e=>{let t=new SpeechSynthesisUtterance(e),n=speechSynthesis.getVoices();n.length&&(t.voice=n[Number(options.app.ui.speakerVoice)]??t.voice),speechSynthesis.speak(t)},rd={get pack(){return pack},get grid(){return grid},get options(){return options},get styles(){return styles},...at,...An,...st,...Hn,...vt,...Lt,...ft,...De,...le,...de,...It,...Me,...gn,speak:nd,getFileName:cr,VERSION:Wt,DEAL_KINDS:l,mapHistory:Tt,log:D,fonts:Rn,heightmapTemplates:Ce,precreatedHeightmaps:Ws,Accounts:wn,AddedLabels:Qt,Biomes:_n,Burgs:ae,Coastline:xe,Coordinates:_e,Cultures:Gr,CustomIcons:re,Deals:ue,Development:Te,EconomyDebug:en,Emblems:_,ErasePipeline:Ki,Features:m,GenerationPipeline:Gi,Goods:W,Corruption:rn,GraphOverride:un,Grid:dn,HeightmapGenerator:vn,Ice:yn,IconSets:oe,Icons:fe,Journeys:Fn,Labels:ie,Lakes:be,Legends:rt,Lore:td,MapEntities:u,MapIntegrity:$u,MapRestoration:sr,Markers:Wi,Markets:t,Measurers:$t,Military:Cn,Names:B,Notes:In,Ocean:Ge,Options:b,Output:an,Pack:P,Pins:v,Population:x,Precipitation:We,Production:tn,Prosperity:sn,Provinces:xn,Relief:ce,Religions:ti,Resample:ed,Rivers:p,Routes:S,Stability:Tn,StateOrders:on,States:Sn,Styles:G,Tags:i,Taxes:ln,Temperature:bn,Trade:nn,TradeRoutes:cn,TradeTraffic:tt,Transports:ee,Zones:Ur,Layers:O,ViewportLayers:it,TradeAnimation:Qe,EmblemRenderer:$e,getLabelsData:Ze,fitLegendBox:Ue,Controllers:C,Services:U,tip:I,clearMainTip:kt,Dialog:F,zoomTo:Yn,resetZoom:Gn,setMapZoom:er,setZoomExtent:qn,setTranslateExtent:Kn,invokeActiveZooming:Jn,regenerateMap:as,regeneratePrompt:os,generateMapWithSeed:kr,restoreSeed:jr,showSeedHistoryDialog:Ar,applyLayersPreset:Ol,applyURLLayers:kl,toggleOptions:xl,hideOptions:bl,changeCellsDensity:_c,initiateAutosave:fa,toggleSaveReminder:ga,copyMapURL:Mo,cleanupData:Ht,drawCellsValue:(e,t=pack.cells.p)=>Ku(e,t),drawPolygons:e=>qu(e,grid),drawRouteConnections:()=>Ju(pack),drawPoint:Yu,drawPath:Xu,getVertexPath:e=>ve(e,pack)};Object.defineProperty(window,"FMG",{value:rd}),Co({generate:is,regenerateMap:as,regeneratePrompt:os,syncOptionInputs:oc,changeCellsDensity:_c,openTab:Sl,pickMapFile:fl,showExportPane:Xc,applyLayersPreset:Ol,applyURLLayers:kl,mapCommands:Hl,openEconomyRegeneration:Jl,openMilitaryRegeneration:Yl,isLinkable:Vl});export{Ta as A,na as B,ya as C,Xa as D,Ya as E,Da as F,Wi as G,Qi as H,ca as I,Gr as J,Vi as K,oa as L,Za as M,Ra as N,Qa as O,eo as P,ur as Q,ua as R,So as S,Ka as T,Xi as U,ea as V,Ki as W,dr as X,Ur as Y,pr as Z,Yo as _,ku as a,ko as b,rs as boot,Iu as c,Ll as d,Bl as f,Ms as g,Ws as h,$u as i,qa as j,lo as k,zl as l,Js as m,td as n,Eu as o,_l as p,ti as q,ed as r,Fu as s,nd as t,Il as u,es as v,ao as w,To as x,Ao as y,ta as z};