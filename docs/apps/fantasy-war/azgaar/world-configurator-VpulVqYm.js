import{i as e,r as t,z as n}from"./node-utils-Ds1sVy-v.js";import{t as r}from"./controllers-Dbv1ZRTV.js";import{X as i,Z as a,c as o,n as s,s as c,x as l}from"./options-model-CrstL1Qd.js";import{u}from"./draw-heightmap-CEyJl1Kw.js";import{p as d,v as f}from"./color-utils-OCVlKvQa.js";import{t as p}from"./biomes-generator-BQuuN3NH.js";import{At as m,Dt as h,Et as g,M as _,Mt as ee,Ot as v,Tt as y,jt as b,kt as x,t as S,wt as C}from"./layers-DjWzCbYN.js";import{t as w}from"./temperature-generator-BeC9kfd1.js";import{g as T,n as E}from"./units-CYDspnRH.js";import{t as D}from"./dialog-BkeQgjla.js";import{m as O}from"./app-DCKsq5m8.js";import{O as k,_ as A,a as j,g as M}from"./index-sNerCVjG.js";function N(e){return function(t,n){var r=ee(t*t+n*n),i=e(r),a=b(i),o=x(i);return[v(t*a,r*o),h(r&&n*a/r)]}}function P(e,t){return[x(t)*b(e),b(t)]}P.invert=N(h);function F(){return C(P).scale(249.5).clipAngle(90+m)}var I=F().translate([100,100]).scale(100),L=y(I);function R(){options.app.mode||(z(),K(),Y(),J(),X(),D.open(`worldConfigurator`,{title:j(`Configure World`),buttons:[{label:j(`Update world`),onClick:q,tip:j(`Apply current settings to the map`)}],footer:`<div data-tip="${j(`Automatically update world on input changes and button clicks`)}">
      <input id="wcAutoChange" class="checkbox" type="checkbox" checked />
      <label for="wcAutoChange" class="checkbox-label"><i>${j(`auto-apply changes`)}</i></label>
    </div>`}))}function z(){D.destroy(`worldConfigurator`),t(`dialogs`).insertAdjacentHTML(`beforeend`,B()),V()}function B(){let e=(e,t,n)=>`<div>
    <i data-locked="0" id="lock_${e}" class="icon-lock-open"></i>
    <label data-tip="${n}">
      <i>${t}:</i>
      <input id="${e}Input" type="number" min="-50" max="50" />
      <span>°C<span id="${e}Converted"></span></span>
      <input id="${e}Output" type="range" min="-50" max="50" />
    </label>
  </div>`;return`<div id="worldConfigurator" class="dialog stable">
    <div style="display: flex">
      <div id="worldControls">
        ${e(`temperatureEquator`,j(`Equator`),j(`Set temperature at equator`))}
        ${e(`temperatureNorthPole`,j(`North Pole`),j(`Set the North Pole average yearly temperature`))}
        ${e(`temperatureSouthPole`,j(`South Pole`),j(`Set the South Pole average yearly temperature`))}
        <div>
          <i data-locked="0" id="lock_mapSize" class="icon-lock-open"></i>
          <label data-tip="${j(`Set map size relative to the world size`)}">
            <i>${j(`Map size`)}:</i>
            <input id="mapSizeInput" type="number" min="1" max="100" step="0.1" />%
            <input id="mapSizeOutput" type="range" min="1" max="100" step="0.1" />
          </label>
        </div>
        <div>
          <i data-locked="0" id="lock_latitude" class="icon-lock-open"></i>
          <label data-tip="${j(`Set a North-South map shift, set to 50 to make map center lie on Equator`)}">
            <i>${j(`Latitudes`)}:</i>
            <input id="latitudeInput" type="number" min="0" max="100" step="0.1" />
            <br /><i>N</i
            ><input
              id="latitudeOutput"
              type="range"
              min="0"
              max="100"
              step="0.1"
              style="width: 10.3em"
            /><i>S</i>
          </label>
        </div>
        <div>
          <i data-locked="0" id="lock_longitude" class="icon-lock-open"></i>
          <label data-tip="${j(`Set a West-East map shift, set to 50 to make map center lie on Prime meridian`)}">
            <i>${j(`Longitudes`)}:</i>
            <input id="longitudeInput" type="number" min="0" max="100" step="0.1" />
            <br /><i>W</i
            ><input
              id="longitudeOutput"
              type="range"
              min="0"
              max="100"
              step="0.1"
              style="width: 10.3em"
            /><i>E</i>
          </label>
        </div>
        <div>
          <label
            data-tip="${j(`Set precipitation - water amount clouds can bring. Defines rivers and biomes generation. Keep around 100% for default generation`)}"
          >
            <i data-locked="0" id="lock_prec" class="icon-lock-open"></i>
            <i>${j(`Precipitation`)}:</i>
            <input id="precInput" type="number" />%
            <input id="precOutput" type="range" min="0" max="500" />
          </label>
        </div>
        <div data-tip="${j(`The coordinate extent this map was generated on. The next map's is set in Options`)}">
          <i>${j(`Map size`)}:</i><br />
          <span id="mapSize"></span> px = <span id="mapSizeFriendly"></span>
        </div>
        <div>
          <i data-tip="${j(`Length of Meridian. Almost half of the equator length`)}">${j(`Meridian length`)}:</i><br />
          <span id="meridianLength" data-tip="${j(`Length of Meridian in pixels`)}"></span> px =
          <span
            id="meridianLengthFriendly"
            data-tip="${j(`Length of Meridian is friendly units (depends on user configuration)`)}"
          ></span>
          <span
            id="meridianLengthEarth"
            data-tip="${j(`Fantasy world Meridian length relative to real-world Earth (20k km)`)}"
          ></span>
        </div>
        <div data-tip="${j(`Map coordinates on globe`)}"><i>${j(`Coords`)}:</i> <span id="mapCoordinates"></span></div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-end">
        <svg id="globe" width="22em" viewBox="-20 -25 240 240">
          <defs>
            <linearGradient id="temperatureGradient" x1="0" x2="0" y1="0" y2="1">
              <stop id="grad90" offset="0%" stop-color="blue" />
              <stop id="grad60" offset="16.6%" stop-color="green" />
              <stop id="grad30" offset="33.3%" stop-color="yellow" />
              <stop id="grad0" offset="50%" stop-color="red" />
              <stop id="grad-30" offset="66.6%" stop-color="yellow" />
              <stop id="grad-60" offset="83.3%" stop-color="green" />
              <stop id="grad-90" offset="100%" stop-color="blue" />
            </linearGradient>
          </defs>
          <g id="globeNoteLines">
            <line x1="5" x2="220" y1="0" y2="0" />
            <line x1="5" x2="220" y1="13" y2="13" />
            <line x1="5" x2="220" y1="49.5" y2="49.5" />
            <line x1="-5" x2="220" y1="100" y2="100" />
            <line x1="5" x2="220" y1="150.5" y2="150.5" />
            <line x1="5" x2="220" y1="187" y2="187" />
            <line x1="5" x2="220" y1="200" y2="200" />
          </g>
          <g id="globeWindArrows" data-tip="${j(`Click to change wind direction`)}" stroke-linejoin="round">
            <circle cx="210" cy="6" r="12" />
            <path data-tier="0" d="M210,11 v-10 l-3,3 m6,0 l-3,-3" transform="rotate(225 210 6)" />
            <circle cx="210" cy="30" r="12" />
            <path data-tier="1" d="M210,35 v-10 l-3,3 m6,0 l-3,-3" transform="rotate(45 210 30)" />
            <circle cx="210" cy="75" r="12" />
            <path data-tier="2" d="M210,80 v-10 l-3,3 m6,0 l-3,-3" transform="rotate(225 210 75)" />
            <circle cx="210" cy="130" r="12" />
            <path data-tier="3" d="M210,135 v-10 l-3,3 m6,0 l-3,-3" transform="rotate(315 210 130)" />
            <circle cx="210" cy="173" r="12" />
            <path data-tier="4" d="M210,178 v-10 l-3,3 m6,0 l-3,-3" transform="rotate(135 210 173)" />
            <circle cx="210" cy="194" r="12" />
            <path data-tier="5" d="M210,199 v-10 l-3,3 m6,0 l-3,-3" transform="rotate(315 210 194)" />
          </g>
          <g id="globaAxisLabels">
            <text x="82%" y="-4%">${j(`wind`)}</text>
            <text x="-8%" y="-4%">${j(`Latitude`)}</text>
          </g>
          <g id="globeLatLabels">
            <text x="-15" y="5">90°</text>
            <text x="-15" y="18">60°</text>
            <text x="-15" y="53">30°</text>
            <text x="-15" y="103">0°</text>
            <text x="-15" y="153">30°</text>
            <text x="-15" y="190">60°</text>
            <text x="-15" y="204">90°</text>
          </g>
          <circle id="globeGradient" cx="100" cy="100" r="100" fill="url(#temperatureGradient)" stroke="none" />
          <line id="globePrimeMeridian" x1="100" x2="100" y1="0" y2="200" />
          <line id="globeEquator" x1="1" x2="200" y1="100" y2="100" />
          <circle id="globeOutline" cx="100" cy="100" r="100" fill="none" />
          <path id="globeGraticule" />
          <path id="globeArea" />
        </svg>
        <button id="restoreWinds" data-tip="${j(`Click to restore default (Earth-based) wind directions`)}">
          ${j(`Restore winds`)}
        </button>
      </div>
    </div>
    <div style="margin-top: 0.3em">
      <i>${j(`Presets`)}:</i>
      <button id="wcWholeWorld" data-tip="${j(`Click to set map size to cover the whole world`)}">${j(`Whole world`)}</button>
      <button id="wcNorthern" data-tip="${j(`Click to set map size to cover the Northern latitudes`)}">${j(`Northern`)}</button>
      <button id="wcTropical" data-tip="${j(`Click to set map size to cover the Tropical latitudes`)}">${j(`Tropical`)}</button>
      <button id="wcSouthern" data-tip="${j(`Click to set map size to cover the Southern latitudes`)}">${j(`Southern`)}</button>
    </div>
  </div>`}function V(){n(`#globe`).select(`#globeWindArrows`).on(`click`,Z),n(`#globe`).select(`#globeGraticule`).attr(`d`,A(L(g()())??``)),t(`worldConfigurator`).addEventListener(`input`,U),t(`restoreWinds`).addEventListener(`click`,Q),t(`wcWholeWorld`).addEventListener(`click`,()=>$(100,50)),t(`wcNorthern`).addEventListener(`click`,()=>$(33,25)),t(`wcTropical`).addEventListener(`click`,()=>$(33,50)),t(`wcSouthern`).addEventListener(`click`,()=>$(33,75)),O(t(`worldConfigurator`),H)}function H(e){let{temperature:t}=options.map.climate;if(e===`temperatureEquator`)return t.equator;if(e===`temperatureNorthPole`)return t.northPole;if(e===`temperatureSouthPole`)return t.southPole;if(e===`prec`)return options.map.climate.precipitation;if(e===`mapSize`)return options.map.geography.mapSize;if(e===`latitude`)return options.map.geography.latitude;if(e===`longitude`)return options.map.geography.longitude}function U(t){let n=t.target,r=n.id.match(/^(\w+?)(Input|Output)$/);if(!r||!n.value)return;let[,i,a]=r,l=Number(n.value);if(Number.isNaN(l))return;let u=e(`${i}${a===`Input`?`Output`:`Input`}`);u&&(u.value=n.value);let{geography:d,climate:f}=options.map;if(i===`temperatureEquator`)f.temperature.equator=l;else if(i===`temperatureNorthPole`)f.temperature.northPole=l;else if(i===`temperatureSouthPole`)f.temperature.southPole=l;else if(i===`prec`)f.precipitation=l;else if(i===`mapSize`||i===`latitude`||i===`longitude`)d[i]=l,c.calculate();else return;o.set(i,l),s.save(),G(),e(`wcAutoChange`)?.checked&&q()}function W(e){return options.map.units.temperature.unit===`°C`?``:` = ${E(e)}`}function G(){let{equator:e,northPole:n,southPole:r}=options.map.climate.temperature;t(`temperatureEquatorConverted`).textContent=W(e),t(`temperatureNorthPoleConverted`).textContent=W(n),t(`temperatureSouthPoleConverted`).textContent=W(r)}function K(){let{temperature:t,precipitation:n}=options.map.climate,{mapSize:r,latitude:i,longitude:a}=options.map.geography;for(let[o,s]of Object.entries({temperatureEquator:t.equator,temperatureNorthPole:t.northPole,temperatureSouthPole:t.southPole,prec:n,mapSize:r,latitude:i,longitude:a}))for(let t of[`Input`,`Output`]){let n=e(`${o}${t}`);n&&(n.value=String(s))}G()}function q(){Y(),J(),w.generate(),_.generate();let t=new Uint8Array(pack.cells.h);i.generate(!0,i.getLocked()),i.specify(),l.sync(),pack.cells.h=new Float32Array(t),p.define(),a.defineGroups(),a.defineNames(),S.draw(`temperature`,`precipitation`),S.draw(`biomes`,`coordinates`,`rivers`),e(`canvas3d`)&&setTimeout(()=>r.View3d.update(),500)}function J(){let e=options.map.graph.height/2*100/options.map.geography.mapSize;c.calculate();let r=options.map.geography.coordinates,i=options.map.units.distance.unit,a=e*2*options.map.units.distance.scale*T();t(`mapSize`).innerHTML=`${options.map.graph.width}x${options.map.graph.height}`,t(`mapSizeFriendly`).innerHTML=`${k(options.map.graph.width*options.map.units.distance.scale)}x${k(options.map.graph.height*options.map.units.distance.scale)} ${i}`,t(`meridianLength`).innerHTML=String(k(e*2)),t(`meridianLengthFriendly`).innerHTML=`${k(e*2*options.map.units.distance.scale)} ${i}`,t(`meridianLengthEarth`).innerHTML=a?` = ${k(a/200)}%🌏`:``,t(`mapCoordinates`).innerHTML=`${o(r.latN)} ${Math.abs(k(r.lonW))}°W; ${o(r.latS)} ${k(r.lonE)}°E`;function o(e){return e>0?`${Math.abs(k(e))}°N`:`${Math.abs(k(e))}°S`}let s=g().extent([[r.lonW??0,r.latN??0],[r.lonE??0,r.latS??0]]);n(`#globe`).select(`#globeArea`).attr(`d`,A(L(s.outline())??``))}function Y(){let e=options.map.climate.temperature.equator,t=options.map.climate.temperature.northPole,r=options.map.climate.temperature.southPole,i=d(u),a=e=>i(1-e),[o,s]=[-25,30],c=s-o;n(`#globe`).select(`#grad90`).attr(`stop-color`,a((t-o)/c)),n(`#globe`).select(`#grad60`).attr(`stop-color`,a((e-(e-t)*2/3-o)/c)),n(`#globe`).select(`#grad30`).attr(`stop-color`,a((e-(e-t)*1/4-o)/c)),n(`#globe`).select(`#grad0`).attr(`stop-color`,a((e-o)/c)),n(`#globe`).select(`#grad-30`).attr(`stop-color`,a((e-(e-r)*1/4-o)/c)),n(`#globe`).select(`#grad-60`).attr(`stop-color`,a((e-(e-r)*2/3-o)/c)),n(`#globe`).select(`#grad-90`).attr(`stop-color`,a((r-o)/c))}function X(){n(`#globe`).select(`#globeWindArrows`).selectAll(`path`).each(function(e,t){let n=M(this.getAttribute(`transform`)??``);this.setAttribute(`transform`,`rotate(${options.map.climate.winds[t]} ${n[1]} ${n[2]})`)})}function Z(e){let n=e.target,r=n.tagName===`path`?n:n.nextElementSibling;if(!r?.dataset.tier)return;let i=+r.dataset.tier;options.map.climate.winds[i]=(options.map.climate.winds[i]+45)%360,s.save();let a=M(r.getAttribute(`transform`)??``);r.setAttribute(`transform`,`rotate(${options.map.climate.winds[i]} ${a[1]} ${a[2]})`);let o=f(options.map.geography.coordinates.latN,options.map.geography.coordinates.latS,-30).map(e=>(90-e)/30|0);t(`wcAutoChange`).checked&&o.includes(i)&&q()}function Q(){let e=[225,45,225,315,135,315],n=f(options.map.geography.coordinates.latN,options.map.geography.coordinates.latS,-30).map(e=>(90-e)/30|0),r=t(`wcAutoChange`).checked&&n.some(t=>options.map.climate.winds[t]!==e[t]);options.map.climate.winds=e,s.save(),X(),r&&q()}function $(t,n){options.map.geography.mapSize=t,options.map.geography.latitude=n,c.calculate(),s.save(),o.set(`mapSize`,t),o.set(`latitude`,n),K(),e(`wcAutoChange`)?.checked&&q()}var te={open:R};export{te as WorldConfigurator};