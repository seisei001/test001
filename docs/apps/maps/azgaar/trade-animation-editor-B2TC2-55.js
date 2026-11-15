import{Cn as e,n as t}from"./options-model-CrstL1Qd.js";import{t as n}from"./layers-DjWzCbYN.js";import{t as r}from"./dialog-BkeQgjla.js";import{h as i,u as a}from"./economy-view-C5mGSEYI.js";import{a as o}from"./index-sNerCVjG.js";import{r as s}from"./node-utils-Ds1sVy-v.js";var c=e,l=[{id:`tradeAnimConcurrent`,label:o(`Animations`),tip:o(`Target number of trade animations visible at once. New ones spawn as old ones finish. Higher = more simultaneous animations, can cause lag on slower devices`),min:1,max:500,step:1,key:`concurrent`,default:c.concurrent},{id:`tradeAnimDuration`,label:o(`Travel duration`),tip:o(`Milliseconds per map unit travelled. Lower = faster animations`),min:1,max:1e3,step:1,key:`duration`,default:c.duration},{id:`tradeAnimLandDurationModifier`,label:o(`Land slowdown`),tip:o(`Multiplier applied to travel duration on land segments. Higher = slower land animations`),min:.1,max:20,step:.1,key:`landDurationModifier`,default:c.landDurationModifier},{id:`tradeAnimSegmentChangePause`,label:o(`Segment pause`),tip:o(`Pause between land and water legs of a trip, in milliseconds. Higher = longer pause`),min:0,max:5e3,step:100,key:`segmentChangePause`,default:c.segmentChangePause},{id:`tradeAnimMarkerSize`,label:o(`Marker size`),tip:o(`Marker icon size in map units. Wagons render at half this size. Higher = bigger icons`),min:1,max:50,step:.5,key:`markerSize`,default:c.markerSize}];function u(){options.app.mode||(r.closeAll(`#tradeAnimationEditor, .stable`),d(),r.open(`tradeAnimationEditor`,{title:o(`Trade Animation Editor`),position:{my:`right top`,at:`right-10 top+10`,of:`svg`},footer:i(`tradeAnimationWiki`)}),a(`tradeAnimationWiki`))}function d(){r.destroy(`tradeAnimationEditor`),document.body.insertAdjacentHTML(`beforeend`,f());for(let e of l){let r=e.key,i=s(e.id),a=s(`${e.id}Reset`),o=options.app.trade.animation[r]??e.default;i.value=String(o),i.addEventListener(`input`,e=>{e.target===e.currentTarget&&(t.set(e=>e.app.trade.animation={...e.app.trade.animation,[r]:i.valueAsNumber}),n.draw(`trade`))}),a.addEventListener(`click`,()=>{t.set(t=>t.app.trade.animation={...t.app.trade.animation,[r]:e.default}),i.value=String(e.default),n.draw(`trade`)})}}function f(){return`
    <div id="tradeAnimationEditor" class="dialog" style="display:none">
      <style>
        #tradeAnimationEditor slider-input { width: 100%; }
        #tradeAnimationEditor slider-input input[type=range] { flex: 1; min-width: 0; }
      </style>
      <table style="border-collapse: collapse;width:100%">
        <tbody>${l.map(({id:e,label:t,tip:n,min:r,max:i,step:a,key:s,default:c})=>`
      <tr data-tip="${n}">
        <td style="padding: 0">${t}</td>
        <td style="padding: 0"><slider-input id="${e}" min="${r}" max="${i}" step="${a}" value="${options.app.trade.animation[s]??c}"></slider-input></td>
        <td style="padding: 0">
          <button id="${e}Reset" data-tip="${o(`Reset to default`)}"
            style="font-size:.85em; padding:1px 5px; margin-left: 0.3em">↺</button>
        </td>
      </tr>`).join(``)}</tbody>
      </table>
    </div>`}var p={open:u};export{p as TradeAnimationEditor};