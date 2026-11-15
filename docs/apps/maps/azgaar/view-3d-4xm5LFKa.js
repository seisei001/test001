const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./view-3d-renderer-CV_Zksr3.js","./units-CYDspnRH.js","./rolldown-runtime-COiEfhsA.js","./pack-generator-DTsfQ82D.js","./index-sNerCVjG.js","./index-DmJ2v1Kj.css","./notices-6lBE5Kkn.js","./node-utils-Ds1sVy-v.js","./min-CCch3uox.js","./options-model-CrstL1Qd.js","./names-generator-BcJRPzyi.js","./number-Da26Xeod.js","./color-utils-OCVlKvQa.js","./linear-DMWKWi8f.js","./charges-XaoNl-VI.js","./line-weights-DMXPYRDE.js","./divisions-yddbEqou.js","./ordinaries-DXI0TOB4.js","./shields-QQIBRbRT.js","./tinctures-CsgIeV6I.js","./file-utils-CUGyyqg9.js","./local-db-CPdztq67.js","./layers-DjWzCbYN.js","./draw-heightmap-CEyJl1Kw.js","./military-generator-CVth4JoO.js","./goods-generator-DS7hwx2H.js","./prosperity-J_ycIG-E.js","./isoline-fills-DwzSIerx.js","./production-generator-BpyiZTFU.js","./state-B2hBYDzv.js","./app-DCKsq5m8.js","./controllers-Dbv1ZRTV.js","./tooltips-BVQbACdS.js","./environment-BDBII_BV.js","./registry-CwrTqJ86.js","./map-history-C5-kWlBi.js","./dialog-BkeQgjla.js","./drag-CCSsgLNP.js","./services-CiMWa4Oi.js","./graph-override-D--VMnwP.js","./notes-DvEnXEai.js","./fonts-BG2tKf1N.js","./file-name-B95gRTjS.js","./platform-Cry3Vb1_.js","./zoom-B8oh1YKy.js","./canvas-BVQSnWDn.js","./added-labels-CB5gxKRk.js","./measurers-generator-DazKvylb.js","./biomes-generator-BQuuN3NH.js","./heightmap-generator-C-OtvlxP.js","./ice-generator-tkZapT-A.js","./temperature-generator-BeC9kfd1.js","./stability-DCAus2OW.js","./journeys-generator-Dzl8JmN4.js","./styles-7-lY19-9.js","./development-overlay-CuKeZGSe.js","./development-view-ChwbelfH.js","./highlight-CBuOTLhq.js","./map-restoration--iF7MIok.js"])))=>i.map(i=>d[i]);
import{t as e}from"./controllers-Dbv1ZRTV.js";import{Sn as t,n,xn as r,yn as i}from"./options-model-CrstL1Qd.js";import{z as ee}from"./app-DCKsq5m8.js";import{St as a}from"./layers-DjWzCbYN.js";import{t as te}from"./services-CiMWa4Oi.js";import{n as o}from"./file-name-B95gRTjS.js";import{n as ne}from"./platform-Cry3Vb1_.js";import{t as s}from"./dialog-BkeQgjla.js";import{o as c,r as re}from"./tooltips-BVQbACdS.js";import{n as l}from"./file-utils-CUGyyqg9.js";import{a as u,i as d,o as ie}from"./index-sNerCVjG.js";import{i as f,r as p}from"./node-utils-Ds1sVy-v.js";import{t as ae}from"./notices-6lBE5Kkn.js";var m=null,h=()=>m?Promise.resolve(m):ie(()=>import(`./view-3d-renderer-CV_Zksr3.js`).then(e=>(e.setMapImageSource((e,t)=>te.ExportMap.getMapURL(e,t)),e.setBuildListener(e=>e?_():v()),m=e,e)),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58]),import.meta.url),oe=(e,t=`viewMesh`)=>h().then(n=>n.create(e,t),()=>(v(),ae(u(`Cannot load 3d library`),`error`,4e3),!1)),g=null,_=()=>{g??=re(`${u(`Loading`)}…`)},v=()=>{g?.(),g=null},y=()=>h().then(e=>e.redraw()),b=()=>h().then(e=>e.update()),se=()=>h().then(e=>e.stop()),ce=e=>h().then(t=>t.setSunColor(e)),le=e=>h().then(t=>t.setScale(e)),ue=e=>h().then(t=>t.setResolutionScale(e)),de=e=>h().then(t=>t.setLightness(e)),fe=(e,t,n)=>h().then(r=>r.setSun(e,t,n)),pe=e=>h().then(t=>t.setRotation(e)),me=()=>h().then(e=>e.toggleLabels()),x=()=>h().then(e=>e.toggle3dSubdivision()),S=()=>h().then(e=>e.toggleErosion()),C=e=>h().then(t=>t.setErosionStrength(e)),w=e=>h().then(t=>t.setErosionRiverDepth(e)),T=e=>h().then(t=>t.setErosionDetail(e)),E=e=>h().then(t=>t.setErosionOctaves(e)),D=()=>h().then(e=>e.toggleSatellite()),O=()=>h().then(e=>e.toggleWireframe()),k=()=>h().then(e=>e.toggleSky()),A=e=>h().then(t=>t.setResolution(e)),j=(e,t)=>h().then(n=>n.setColors(e,t)),M=e=>h().then(t=>t.setTimeOfDay(e)),N=async()=>{let e=(await h()).screenshotUrl(),t=document.createElement(`a`);t.download=`${o()}.jpeg`,t.href=e,t.click(),c(ne(u(`Screenshot`)),!0,`success`,7e3)},P=async()=>l(await(await h()).exportOBJ(),`${o()}.obj`,`text/plain;charset=UTF-8`),F=()=>ee(),I=e=>h().then(t=>t.isCached(e)),L=(e,t,n)=>h().then(r=>r.heightAt(e,t,n));function R(){f(`canvas3d`)&&(se(),f(`canvas3d`)?.remove(),f(`options3d`)&&s.close(`options3d`),f(`preview3d`)&&s.close(`preview3d`))}function z(){p(`viewMode`).querySelectorAll(`.pressed`).forEach(e=>{e.classList.remove(`pressed`)}),p(`heightmap3DView`).classList.remove(`pressed`),p(`viewStandard`).classList.add(`pressed`),R()}async function B(e){z(),p(`viewStandard`).classList.remove(`pressed`),p(e).classList.add(`pressed`);let t=document.createElement(`canvas`);if(t.id=`canvas3d`,t.dataset.type=e,e===`heightmap3DView`?(t.width=parseFloat(f(`preview3d`)?.style.width??``)||options.map.graph.width/3,t.height=t.width/(options.map.graph.width/options.map.graph.height),t.style.display=`block`):(t.width=a.width,t.height=a.height,t.style.position=`absolute`,t.style.display=`none`),_(),!await oe(t,e))return z();t.style.display=`block`,t.onmouseenter=()=>{let e=[u(`Drag to pan`),u(`Scroll to zoom`),u(`Right-click drag to rotate`),u(`O to toggle options`)].join(` • `);+t.dataset.hovered>2?c(``):c(e),t.dataset.hovered=String((t.dataset.hovered|0)+1)},e===`heightmap3DView`?(he(),p(`preview3d`).appendChild(t),s.open(`preview3d`,{title:u(`3D Preview`),resizable:!0,position:{my:`left bottom`,at:`left+10 bottom-20`,of:`svg`},onResize:V,onClose:ge})):document.body.insertBefore(t,p(`optionsContainer`)),H()}function he(){f(`preview3d`)?.remove(),p(`dialogs`).insertAdjacentHTML(`beforeend`,`<div id="preview3d" class="dialog stable" style="padding: 0px"></div>`)}function ge(){s.destroy(`preview3d`),z()}function V(){let e=f(`canvas3d`);if(!e)return;let t=p(`preview3d`);e.width=parseFloat(t.style.width),e.height=parseFloat(t.style.height)-2,y()}function H(){f(`options3d`)?s.close(`options3d`):(_e(),s.open(`options3d`,{title:u(`3D mode settings`),width:`fit-content`,position:{my:`right top`,at:`right-30 top+10`,of:`svg`},onClose:ye}),G())}function _e(){f(`options3d`)?.remove();let t=`<div id="options3d" class="dialog stable">
      <div id="options3dMesh" style="display: none">
        <div data-tip="${d(u(`Set map rotation speed`),u(`Set to 0 is you want to toggle off the rotation`))}">
          <div>${u(`Rotation`)}:</div>
          <input id="options3dMeshRotationRange" type="range" min="0" max="10" step=".1" />
          <input id="options3dMeshRotationNumber" type="number" min="0" max="10" step=".1" style="width: 4em" />
        </div>
        <div data-tip="${u(`Set height scale`)}">
          <div>${u(`Height scale`)}:</div>
          <input id="options3dScaleRange" type="range" min="0" max="100" />
          <input id="options3dScaleNumber" type="number" min="0" max="1000" style="width: 4em" />
        </div>
        <div data-tip="${u(`Set scene lightness`)}">
          <div>${u(`Lightness`)}:</div>
          <input id="options3dLightnessRange" type="range" min="0" max="100" />
          <input id="options3dLightnessNumber" type="number" min="0" max="500" style="width: 4em" />
        </div>
        <div data-tip="${u(`Set mesh texture resolution`)}">
          <div>${u(`Texture resolution`)}:</div>
          <select id="options3dMeshSkinResolution" style="width: 10em">
            <option value="512">512x512px</option>
            <option value="1024">1024x1024px</option>
            <option value="2048">2048x2048px</option>
            <option value="4096" selected>4096x4096px</option>
            <option value="8192">8192x8192px</option>
          </select>
        </div>
        <div data-tip="${u(`Quick preset lighting for different times of day`)}" style="margin-top: 0.4em">
          <label>${u(`Time of day`)}:</label>
          <select id="options3dTimeOfDay" style="width: 10em; margin-bottom: 0.3em">
            <option value="custom">${u(`Custom`)}</option>
            <option value="dawn">${u(`Dawn`)}</option>
            <option value="noon" selected>${u(`Noon`)}</option>
            <option value="evening">${u(`Evening`)}</option>
            <option value="night">${u(`Night`)}</option>
          </select>
        </div>
        <div data-tip="${u(`Set sun position (x, y) and color`)}" style="margin-top: 0.4em">
          <label>${u(`Sun position and color`)}:</label>
          <div style="display: flex; gap: 0.2em">
            <input id="options3dSunX" type="number" min="-2500" max="2500" step="100" style="width: 4.7em" />
            <input id="options3dSunY" type="number" min="0" max="5000" step="100" style="width: 4.7em" />
            <input id="options3dSunColor" type="color" style="padding: 0; height: 1.5em; border: none" />
          </div>
        </div>
        <div data-tip="${u(`Toggle 3d labels`)}" style="margin: 0.6em 0 0.3em -0.2em">
          <input id="options3dMeshLabels3d" class="checkbox" type="checkbox" />
          <label for="options3dMeshLabels3d" class="checkbox-label"><i>${u(`Show labels as sprites`)}</i></label>
        </div>
        <div data-tip="${u(`Toggle sky mode`)}" style="margin: 0.6em 0 0.3em -0.2em">
          <input id="options3dMeshSkyMode" class="checkbox" type="checkbox" />
          <label for="options3dMeshSkyMode" class="checkbox-label"><i>${u(`Show sky and extend water`)}</i></label>
        </div>
        <div
          data-tip="${u(`Increases the polygon count to smooth the sharp points. Please note that it can take some time to calculate`)}"
          style="margin: 0.6em 0 0.3em -0.2em"
        >
          <input id="options3dSubdivide" class="checkbox" type="checkbox" />
          <label for="options3dSubdivide" class="checkbox-label"
            ><i>${u(`Smooth geometry`)} <small style="color: darkred">[${u(`slow`)}]</small></i></label
          >
        </div>

        <div
          data-tip="${u(`Texture the terrain as a satellite image. Replaces the standard map texture`)}"
          style="margin: 0.6em 0 0.3em -0.2em"
        >
          <input id="options3dSatellite" class="checkbox" type="checkbox" />
          <label for="options3dSatellite" class="checkbox-label"><i>${u(`Satellite texture`)}</i></label>
        </div>

        <div
          data-tip="${u(`Bake procedural erosion detail into the 3D terrain. Visual only, the map data is not changed`)}"
          style="margin: 0.6em 0 0.3em -0.2em"
        >
          <input id="options3dErosion" class="checkbox" type="checkbox" />
          <label for="options3dErosion" class="checkbox-label"><i>${u(`Erode terrain`)}</i></label>
        </div>

        <div id="options3dErosionSection" style="display: none">
          <div data-tip="${u(`Set eroded mesh detail level (vertices on the long side)`)}">
            <div>${u(`Mesh detail`)}:</div>
            <select id="options3dErosionDetail" style="width: 10em">
              <option value="256">256</option>
              <option value="512">512</option>
              <option value="1024" selected>1024</option>
              <option value="2048">2048 [${u(`slow`)}]</option>
            </select>
          </div>

          <div data-tip="${u(`Set the strength of erosion gullies and ridges`)}">
            <div>${u(`Gully strength`)}:</div>
            <input id="options3dErosionStrengthRange" type="range" min="0" max="100" />
            <input id="options3dErosionStrengthNumber" type="number" min="0" max="100" style="width: 4em" />
          </div>

          <div data-tip="${u(`Set how deep the valleys are carved along the rivers`)}">
            <div>${u(`River valleys`)}:</div>
            <input id="options3dErosionRiverDepthRange" type="range" min="0" max="100" />
            <input id="options3dErosionRiverDepthNumber" type="number" min="0" max="100" style="width: 4em" />
          </div>

          <div data-tip="${u(`Set the number of erosion detail layers. More octaves add finer gullies`)}">
            <div>${u(`Detail octaves`)}:</div>
            <select id="options3dErosionOctaves" style="width: 6em">
              <option value="1">1</option>
              <option value="2" selected>2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
        </div>

        <div data-tip="${u(`Toggle wireframe mode`)}" style="margin: 0.6em 0 0.3em -0.2em">
          <input id="options3dMeshWireframeMode" class="checkbox" type="checkbox" />
          <label for="options3dMeshWireframeMode" class="checkbox-label"><i>${u(`Show wireframe`)}</i></label>
        </div>
        <div data-tip="${u(`Set sky and water color`)}" id="options3dColorSection" style="display: none">
          <span>${u(`Sky`)}:</span
          ><input
            id="options3dMeshSky"
            type="color"
            style="width: 4.4em; height: 1em; border: 0; padding: 0; margin: 0 0.2em"
          />
          <span>${u(`Water`)}:</span
          ><input
            id="options3dMeshWater"
            type="color"
            style="width: 4.4em; height: 1em; border: 0; padding: 0; margin: 0 0.2em"
          />
        </div>
      </div>
      <div id="options3dGlobe" style="display: none">
        <div data-tip="${d(u(`Set globe rotation speed`),u(`Set to 0 is you want to toggle off the rotation`))}">
          <div>${u(`Rotation`)}:</div>
          <input id="options3dGlobeRotationRange" type="range" min="0" max="10" step=".1" />
          <input id="options3dGlobeRotationNumber" type="number" min="0" max="10" step=".1" style="width: 4em" />
        </div>
        <div data-tip="${u(`Set globe texture resolution`)}">
          <div>${u(`Texture resolution`)}:</div>
          <select id="options3dGlobeResolution" style="width: 5em">
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="2">2x</option>
            <option value="4">4x</option>
            <option value="8">8x</option>
          </select>
        </div>
        <div
          data-tip="${u(`Equirectangular projection is used: distortion is maximum on poles. Use map with aspect ratio 2:1 for best result`)}"
          style="font-style: italic; margin: 0.2em 0"
        >
          ${u(`Equirectangular projection is used`)}
        </div>
      </div>
      <div id="options3dBottom" style="margin-top: 0.2em">
        <button id="options3dUpdate" data-tip="${u(`Update the scene`)}" class="icon-cw"></button>
        <button
          id="options3dConfigureWorld"
          data-tip="${u(`Configure world and map size and climate settings`)}"
          class="icon-globe"
        ></button>
        <button id="options3dSave" data-tip="${u(`Save screenshot of the 3d scene`)}" class="icon-button-screenshot"></button>
        <button id="options3dOBJSave" data-tip="${u(`Save OBJ file of the 3d scene`)}" class="icon-download"></button>
        <button id="options3dReset" data-tip="${u(`Reset to default`)}" class="icon-ccw"></button>
      </div>
    </div>`;p(`dialogs`).insertAdjacentHTML(`beforeend`,t),p(`options3dUpdate`).addEventListener(`click`,()=>void b()),p(`options3dConfigureWorld`).addEventListener(`click`,()=>e.WorldConfigurator.open()),p(`options3dSave`).addEventListener(`click`,()=>void N()),p(`options3dOBJSave`).addEventListener(`click`,()=>void P()),p(`options3dReset`).addEventListener(`click`,ve),p(`options3dScaleRange`).addEventListener(`input`,q),p(`options3dScaleNumber`).addEventListener(`change`,q),p(`options3dLightnessRange`).addEventListener(`input`,J),p(`options3dLightnessNumber`).addEventListener(`change`,J),p(`options3dSunX`).addEventListener(`change`,Y),p(`options3dSunY`).addEventListener(`change`,Y),p(`options3dMeshSkinResolution`).addEventListener(`change`,Se),p(`options3dMeshRotationRange`).addEventListener(`input`,X),p(`options3dMeshRotationNumber`).addEventListener(`change`,X),p(`options3dGlobeRotationRange`).addEventListener(`input`,X),p(`options3dGlobeRotationNumber`).addEventListener(`change`,X),p(`options3dMeshLabels3d`).addEventListener(`change`,()=>void me()),p(`options3dMeshSkyMode`).addEventListener(`change`,Oe),p(`options3dMeshSky`).addEventListener(`input`,$),p(`options3dMeshWater`).addEventListener(`input`,$),p(`options3dGlobeResolution`).addEventListener(`change`,ke),p(`options3dMeshWireframeMode`).addEventListener(`change`,()=>void O()),p(`options3dSunColor`).addEventListener(`input`,Ce),p(`options3dSubdivide`).addEventListener(`change`,()=>void x()),p(`options3dTimeOfDay`).addEventListener(`change`,xe),p(`options3dErosion`).addEventListener(`change`,we),p(`options3dErosionDetail`).addEventListener(`change`,Te),p(`options3dErosionStrengthRange`).addEventListener(`change`,Z),p(`options3dErosionStrengthNumber`).addEventListener(`change`,Z),p(`options3dErosionRiverDepthRange`).addEventListener(`change`,Q),p(`options3dErosionRiverDepthNumber`).addEventListener(`change`,Q),p(`options3dErosionOctaves`).addEventListener(`change`,De),p(`options3dSatellite`).addEventListener(`change`,Ee)}function ve(e){s.confirm({event:e,confirm:u(`Reset`),onConfirm:()=>{let e=f(`canvas3d`)?.dataset.type??`viewMesh`;n.set(e=>e.app.threeD=structuredClone(i)),B(e)}})}function ye(){s.destroy(`options3d`)}function U(e,t){p(e).value=String(t)}function W(e,t){p(e).checked=t}function G(){let e=options.app.threeD,t=f(`canvas3d`)?.dataset.type===`viewGlobe`;p(`options3dMesh`).style.display=t?`none`:`block`,p(`options3dGlobe`).style.display=t?`block`:`none`,p(`options3dOBJSave`).style.display=t?`none`:`inline-block`,U(`options3dScaleRange`,e.scale),U(`options3dScaleNumber`,e.scale),U(`options3dLightnessRange`,e.lightness*100),U(`options3dLightnessNumber`,e.lightness*100),U(`options3dSunX`,e.sun.x),U(`options3dSunY`,e.sun.y),U(`options3dMeshRotationRange`,e.rotateMesh),U(`options3dMeshRotationNumber`,e.rotateMesh),U(`options3dMeshSkinResolution`,e.resolutionScale),U(`options3dGlobeRotationRange`,e.rotateGlobe),U(`options3dGlobeRotationNumber`,e.rotateGlobe),W(`options3dMeshLabels3d`,!!e.labels3d),W(`options3dMeshSkyMode`,!!e.extendedWater),p(`options3dColorSection`).style.display=e.extendedWater?`block`:`none`,U(`options3dMeshSky`,e.skyColor),U(`options3dMeshWater`,e.waterColor),U(`options3dGlobeResolution`,r(e.resolutionScale)),U(`options3dSunColor`,e.sunColor),W(`options3dSubdivide`,!!e.subdivide),p(`options3dSubdivide`).disabled=!!e.erosion,W(`options3dErosion`,!!e.erosion),p(`options3dErosionSection`).style.display=e.erosion?`block`:`none`,U(`options3dErosionDetail`,e.erosionDetail),U(`options3dErosionStrengthRange`,e.erosionStrength),U(`options3dErosionStrengthNumber`,e.erosionStrength),U(`options3dErosionRiverDepthRange`,e.erosionRiverDepth),U(`options3dErosionRiverDepthNumber`,e.erosionRiverDepth),U(`options3dErosionOctaves`,e.erosionOctaves),W(`options3dSatellite`,!!e.satellite),W(`options3dMeshWireframeMode`,!!e.wireframe),be()}function be(){let e=p(`options3dTimeOfDay`),n=options.app.threeD,r=`custom`;for(let[e,i]of Object.entries(t))if(i.sun.x===n.sun.x&&i.sun.y===n.sun.y&&i.sun.z===n.sun.z&&i.sunColor===n.sunColor&&Math.abs(i.lightness-n.lightness)<.05){r=e;break}e.value=r}function K(){let e=p(`options3dTimeOfDay`);e.value!==`custom`&&(e.value=`custom`)}function xe(){this.value!==`custom`&&(M(this.value),G())}function q(){U(`options3dScaleRange`,this.value),U(`options3dScaleNumber`,this.value),le(+this.value)}function Se(){U(`options3dMeshSkinResolution`,this.value),ue(+this.value)}function J(){U(`options3dLightnessRange`,this.value),U(`options3dLightnessNumber`,this.value),de(this.value/100),K()}function Ce(){ce(p(`options3dSunColor`).value),K()}function Y(){fe(+p(`options3dSunX`).value,+p(`options3dSunY`).value),K()}function X(){let e=this.nextElementSibling||this.previousElementSibling;e&&(e.value=this.value),pe(+this.value)}function we(){let e=!options.app.threeD.erosion;p(`options3dErosionSection`).style.display=e?`block`:`none`,p(`options3dSubdivide`).disabled=e,e&&c(u(`Baking eroded terrain...`),!1,`warn`,4e3),S()}function Te(){T(+this.value)}function Z(){U(`options3dErosionStrengthRange`,this.value),U(`options3dErosionStrengthNumber`,this.value),C(+this.value)}function Q(){U(`options3dErosionRiverDepthRange`,this.value),U(`options3dErosionRiverDepthNumber`,this.value),w(+this.value)}function Ee(){options.app.threeD.satellite||c(u(`Baking satellite texture...`),!1,`warn`,4e3),D()}function De(){E(+this.value)}function Oe(){let e=options.app.threeD.extendedWater;p(`options3dColorSection`).style.display=e?`none`:`block`,k()}function $(){j(p(`options3dMeshSky`).value,p(`options3dMeshWater`).value)}function ke(){A(+this.value)}var Ae={open:B,enterStandard:z,toggleOptions:H,redraw:y,update:b,isOn:F,isCached:I,heightAt:L};export{Ae as View3d};