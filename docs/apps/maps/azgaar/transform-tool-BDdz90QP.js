import{En as e,Tn as t}from"./options-model-CrstL1Qd.js";import{n}from"./map-history-C5-kWlBi.js";import{t as r}from"./map-restoration--iF7MIok.js";import{H as i,S as a,r as o}from"./app-DCKsq5m8.js";import{t as s}from"./layers-DjWzCbYN.js";import{t as c}from"./services-CiMWa4Oi.js";import{t as l}from"./dialog-BkeQgjla.js";import{i as u,r as d,t as f}from"./canvas-BVQSnWDn.js";import{c as p}from"./zoom-B8oh1YKy.js";import{o as m}from"./tooltips-BVQbACdS.js";import{O as h,a as g,i as _,n as v}from"./index-sNerCVjG.js";import{i as y,r as b}from"./node-utils-Ds1sVy-v.js";var x=!1,S=0,C=0;function w(){T(),E(),O(),l.open(`transformTool`,{title:g(`Transform Map`),position:{my:`center`,at:`center`,of:`svg`},onClose:D,buttons:[{label:g(`Transform`),onClick:()=>{F(),l.close(`transformTool`)}},{label:g(`Cancel`),onClick:()=>{l.close(`transformTool`)}}]})}function T(){l.destroy(`transformTool`);let n=String(options.generation.graph.density),r=t[+n],i=`<div id="transformTool" class="dialog">
    <div style="padding-top: 0.5em; width: 40em; font-weight: bold">
      ${g(`This operation is destructive and irreversible. It will create a completely new map based on the current one. Don't forget to save the .map file to your machine first!`)}
    </div>
    <div
      id="transformToolBody"
      style="
        padding: 0.5em 0;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: repeat(5, 1fr);
        align-items: center;
      "
    >
      <div>${g(`Points number`)}</div>
      <div>
        <input id="transformPointsInput" type="range" min="1" max="13" value="${n}" />
        <output id="transformPointsFormatted" style="color: ${e(r)}">${r/1e3}K</output>
      </div>
      <div>${g(`Shift`)}</div>
      <div>
        <label>X: <input id="transformShiftX" type="number" size="4" value="0" /></label>
        <label>Y: <input id="transformShiftY" type="number" size="4" value="0" /></label>
      </div>
      <div>${g(`Rotate`)}</div>
      <div>
        <input id="transformAngleInput" type="range" min="0" max="359" value="0" />
        <output id="transformAngleOutput">0</output>°
      </div>
      <div>${g(`Scale`)}</div>
      <div>
        <input id="transformScaleInput" type="range" min="-25" max="25" value="0" />
        <output id="transformScaleResult">1</output>x
      </div>
      <div>${g(`Mirror`)}</div>
      <div style="display: flex; gap: 0.5em">
        <input type="checkbox" class="checkbox" id="transformMirrorH" />
        <label for="transformMirrorH" class="checkbox-label">${g(`horizontally`)}</label>
        <input type="checkbox" class="checkbox" id="transformMirrorV" />
        <label for="transformMirrorV" class="checkbox-label">${g(`vertically`)}</label>
      </div>
    </div>
    <div id="transformPreview" style="position: relative; overflow: hidden; outline: 1px solid #666">
      <canvas id="transformPreviewCanvas" style="position: absolute; transform-origin: center"></canvas>
    </div>
  </div>`;b(`dialogs`).insertAdjacentHTML(`beforeend`,i)}function E(){b(`transformToolBody`).addEventListener(`input`,A),b(`transformPointsInput`).oninput=k;let e=b(`transformPreview`);e.addEventListener(`mousedown`,j),e.addEventListener(`mouseup`,M),e.addEventListener(`mousemove`,N),e.addEventListener(`wheel`,P)}function D(){x=!1,l.destroy(`transformTool`)}async function O(){let e=Math.min(400,window.innerWidth*.5),t=e/options.map.graph.width,n=options.map.graph.height*t;b(`transformPreview`).style.width=`${e}px`,b(`transformPreview`).style.height=`${n}px`;let r=await c.ExportMap.getMapURL(`png`,{noWater:!0,fullMap:!0,noLabels:!0,noScaleBar:!0,noVignette:!0,noIce:!0}),i=new Image;i.src=r,i.onload=()=>{let t=y(`transformPreviewCanvas`);t&&(t.style.width=`${e}px`,t.style.height=`${n}px`,t.width=e*4,t.height=n*4,t.getContext(`2d`)?.drawImage(i,0,0,e*4,n*4))}}function k(n){let r=t[+n.target.value],i=b(`transformPointsFormatted`);i.value=`${r/1e3}K`,i.style.color=e(r)}function A(){let e=Math.min(400,window.innerWidth*.5)/options.map.graph.width,t=b(`transformAngleInput`).value;b(`transformAngleOutput`).value=t;let n=t/180*Math.PI,r=+b(`transformShiftX`).value,i=+b(`transformShiftY`).value,a=b(`transformMirrorH`).checked,o=b(`transformMirrorV`).checked,s=h(1.0965**b(`transformScaleInput`).value,2);b(`transformScaleResult`).value=String(s),b(`transformPreviewCanvas`).style.transform=`
    translate(${r*e}px, ${i*e}px)
    scale(${a?-s:s}, ${o?-s:s})
    rotate(${n}rad)
  `}function j(e){let t=Math.min(400,window.innerWidth*.5)/options.map.graph.width;x=!0;let n=+b(`transformShiftX`).value,r=+b(`transformShiftY`).value;S=n-e.clientX/t,C=r-e.clientY/t}function M(){x=!1}function N(e){if(!x)return;e.preventDefault();let t=Math.min(400,window.innerWidth*.5)/options.map.graph.width;b(`transformShiftX`).value=String(Math.round(S+e.clientX/t)),b(`transformShiftY`).value=String(Math.round(C+e.clientY/t)),A()}function P(e){let t=b(`transformScaleInput`);t.value=String(t.valueAsNumber-Math.sign(e.deltaY)),A()}function F(){v.group(`transformMap`);try{r.transaction(()=>{let e=b(`transformPointsInput`).value;e!==String(options.generation.graph.density)&&a.changeCellsDensity(+e);let[t,n]=I();f(),d(),p(0),i(),o.process({projection:t,inverse:n,scale:1})})}catch(e){v.error(e),u();let t=g(`Failed to transform the map: {{error}}`,{error:e.message});m(_(t,g(`The map is unchanged`)),!1,`error`,6e3),v.groupEnd();return}s.drawAll(),n(),v.groupEnd()}function I(){let e=options.map.graph.width/2,t=options.map.graph.height/2,n=+b(`transformShiftX`).value,r=+b(`transformShiftY`).value,i=b(`transformAngleInput`).value/180*Math.PI,a=Math.cos(i),o=Math.sin(i),s=+b(`transformScaleResult`).value,c=b(`transformMirrorH`).checked,l=b(`transformMirrorV`).checked;function u(u,d){return u-=e,d-=t,s!==1&&(u*=s,d*=s),i&&([u,d]=[u*a-d*o,u*o+d*a]),c&&(u=-u),l&&(d=-d),[u+e+n,d+t+r]}function d(u,d){return u-=e+n,d-=t+r,l&&(d=-d),c&&(u=-u),i!==0&&([u,d]=[u*a+d*o,-u*o+d*a]),s!==1&&(u/=s,d/=s),[u+e,d+t]}return[u,d]}var L={open:w};export{L as TransformTool};