import{B as e,i as t,r as n,z as r}from"./node-utils-Ds1sVy-v.js";import{n as i}from"./goods-generator-DS7hwx2H.js";import{A as a,Lt as o,Rt as s}from"./options-model-CrstL1Qd.js";import{d as c}from"./prosperity-J_ycIG-E.js";import{S as l,x as u}from"./names-generator-BcJRPzyi.js";import{t as d}from"./min-CCch3uox.js";import{t as f}from"./production-generator-BpyiZTFU.js";import{n as p,r as m}from"./axis-ChvWZg1j.js";import{t as h}from"./map-history-C5-kWlBi.js";import{a as g,m as _,n as v,o as y,r as b,y as x}from"./units-CYDspnRH.js";import{t as S}from"./csv-BoSHm6Vn.js";import{n as C}from"./file-name-B95gRTjS.js";import{t as w}from"./dialog-BkeQgjla.js";import{o as T}from"./tooltips-BVQbACdS.js";import{n as E}from"./file-utils-CUGyyqg9.js";import{f as D,o as O,p as k}from"./pack-generator-DTsfQ82D.js";import{O as A,a as j,k as M}from"./index-sNerCVjG.js";import{s as N,t as P}from"./linear-DMWKWi8f.js";import{v as F}from"./color-utils-OCVlKvQa.js";var I=class extends Map{constructor(e,t=z){if(super(),Object.defineProperties(this,{_intern:{value:new Map},_key:{value:t}}),e!=null)for(let[t,n]of e)this.set(t,n)}get(e){return super.get(L(this,e))}has(e){return super.has(L(this,e))}set(e,t){return super.set(R(this,e),t)}delete(e){return super.delete(ee(this,e))}};function L({_intern:e,_key:t},n){let r=t(n);return e.has(r)?e.get(r):n}function R({_intern:e,_key:t},n){let r=t(n);return e.has(r)?e.get(r):(e.set(r,n),n)}function ee({_intern:e,_key:t},n){let r=t(n);return e.has(r)&&(n=e.get(r),e.delete(r)),n}function z(e){return typeof e==`object`&&e?e.valueOf():e}function te(e,t,...n){return ne(e,Array.from,t,n)}function ne(e,t,n,r){return(function e(i,a){if(a>=r.length)return n(i);let o=new I,s=r[a++],c=-1;for(let e of i){let t=s(e,++c,i),n=o.get(t);n?n.push(e):o.set(t,[e])}for(let[t,n]of o)o.set(t,e(n,a));return t(o)})(e,0)}function re(t){return r(e(t).call(document.documentElement))}var B=Symbol(`implicit`);function V(){var e=new I,t=[],n=[],r=B;function i(i){let a=e.get(i);if(a===void 0){if(r!==B)return r;e.set(i,a=t.push(i)-1)}return n[a%n.length]}return i.domain=function(n){if(!arguments.length)return t.slice();t=[],e=new I;for(let r of n)e.has(r)||e.set(r,t.push(r)-1);return i},i.range=function(e){return arguments.length?(n=Array.from(e),i):n.slice()},i.unknown=function(e){return arguments.length?(r=e,i):r},i.copy=function(){return V(t,n).unknown(r)},N.apply(i,arguments),i}function H(){var e=V().unknown(void 0),t=e.domain,n=e.range,r=0,i=1,a,o,s=!1,c=0,l=0,u=.5;delete e.unknown;function d(){var e=t().length,d=i<r,f=d?i:r,p=d?r:i;a=(p-f)/Math.max(1,e-c+l*2),s&&(a=Math.floor(a)),f+=(p-f-a*(e-c))*u,o=a*(1-c),s&&(f=Math.round(f),o=Math.round(o));var m=F(e).map(function(e){return f+a*e});return n(d?m.reverse():m)}return e.domain=function(e){return arguments.length?(t(e),d()):t()},e.range=function(e){return arguments.length?([r,i]=e,r=+r,i=+i,d()):[r,i]},e.rangeRound=function(e){return[r,i]=e,r=+r,i=+i,s=!0,d()},e.bandwidth=function(){return o},e.step=function(){return a},e.round=function(e){return arguments.length?(s=!!e,d()):s},e.padding=function(e){return arguments.length?(c=Math.min(1,l=+e),d()):c},e.paddingInner=function(e){return arguments.length?(c=Math.min(1,e),d()):c},e.paddingOuter=function(e){return arguments.length?(l=+e,d()):l},e.align=function(e){return arguments.length?(u=Math.max(0,Math.min(1,e)),d()):u},e.copy=function(){return H(t(),[r,i]).round(s).paddingInner(c).paddingOuter(l).align(u)},N.apply(d(),arguments)}function U(e,t){if((o=e.length)>1)for(var n=1,r,i,a=e[t[0]],o,s=a.length;n<o;++n)for(i=a,a=e[t[n]],r=0;r<s;++r)a[r][1]+=a[r][0]=isNaN(i[r][1])?i[r][0]:i[r][1]}function W(e){for(var t=e.length,n=Array(t);--t>=0;)n[t]=t;return n}function ie(e,t){return e[t]}function ae(e){let t=[];return t.key=e,t}function oe(){var e=k([]),t=W,n=U,r=ie;function i(i){var a=Array.from(e.apply(this,arguments),ae),o,s=a.length,c=-1,l;for(let e of i)for(o=0,++c;o<s;++o)(a[o][c]=[0,+r(e,a[o].key,c,i)]).data=e;for(o=0,l=D(t(a));o<s;++o)a[l[o]].index=o;return n(a,l),a}return i.keys=function(t){return arguments.length?(e=typeof t==`function`?t:k(Array.from(t)),i):e},i.value=function(e){return arguments.length?(r=typeof e==`function`?e:k(+e),i):r},i.order=function(e){return arguments.length?(t=e==null?W:typeof e==`function`?e:k(Array.from(e)),i):t},i.offset=function(e){return arguments.length?(n=e??U,i):n},i}function se(e,t){if((r=e.length)>0){for(var n,r,i=0,a=e[0].length,o;i<a;++i){for(o=n=0;n<r;++n)o+=e[n][i][1]||0;if(o)for(n=0;n<r;++n)e[n][i][1]/=o}U(e,t)}}function ce(e,t){if((c=e.length)>0)for(var n,r=0,i,a,o,s,c,l=e[t[0]].length;r<l;++r)for(o=s=0,n=0;n<c;++n)(a=(i=e[t[n]][r])[1]-i[0])>0?(i[0]=o,i[1]=o+=a):a<0?(i[1]=s,i[0]=s+=a):(i[0]=0,i[1]=a)}var G={states:{label:j(`State`),getId:e=>pack.cells.state[e],getName:Q(`states`),getColors:$(`states`),landOnly:!0},cultures:{label:j(`Culture`),getId:e=>pack.cells.culture[e],getName:Q(`cultures`),getColors:$(`cultures`),landOnly:!0},religions:{label:j(`Religion`),getId:e=>pack.cells.religion[e],getName:Q(`religions`),getColors:$(`religions`),landOnly:!0},provinces:{label:j(`Province`),getId:e=>pack.cells.province[e],getName:Q(`provinces`),getColors:$(`provinces`),landOnly:!0},biomes:{label:j(`Biome`),getId:e=>pack.cells.biome[e],getName:Te,getColors:Ee,landOnly:!1},markets:{label:j(`Market`),getId:e=>pack.cells.market[e],getName:De,getColors:Oe,landOnly:!1},goods:{label:j(`Good`),requires:`good`,getId:(e,t)=>t.good,getName:ke,getColors:Ae,landOnly:!1}},K={total_population:{label:j(`Total population`),quantize:e=>Me(e)+Ne(e),aggregate:e=>A(o(e)),formatTicks:e=>M(e),stringify:e=>e.toLocaleString(),stackable:!0,landOnly:!0},urban_population:{label:j(`Urban population`),quantize:Me,aggregate:e=>A(o(e)),formatTicks:e=>M(e),stringify:e=>e.toLocaleString(),stackable:!0,landOnly:!0},rural_population:{label:j(`Rural population`),quantize:Ne,aggregate:e=>A(o(e)),formatTicks:e=>M(e),stringify:e=>e.toLocaleString(),stackable:!0,landOnly:!0},area:{label:j(`Land area`),quantize:e=>g(pack.cells.area[e]),aggregate:e=>A(o(e)),formatTicks:e=>`${M(e)} ${y()}`,stringify:e=>`${e.toLocaleString()} ${y()}`,stackable:!0,landOnly:!0},cells:{label:j(`Cells`),hint:j(`Number of land cells`),quantize:()=>1,aggregate:e=>o(e),formatTicks:e=>e,stringify:e=>e.toLocaleString(),stackable:!0,landOnly:!0},burgs_number:{label:j(`Burgs`),hint:j(`Number of burgs`),quantize:e=>+!!pack.cells.burg[e],aggregate:e=>o(e),formatTicks:e=>e,stringify:e=>e.toLocaleString(),stackable:!0,landOnly:!0},average_elevation:{label:j(`Average elevation`),quantize:e=>pack.cells.h[e],aggregate:e=>u(e),formatTicks:e=>_(e),stringify:e=>_(e),stackable:!1,landOnly:!1},max_elevation:{label:j(`Maximum mean elevation`),quantize:e=>pack.cells.h[e],aggregate:e=>l(e),formatTicks:e=>_(e),stringify:e=>_(e),stackable:!1,landOnly:!1},min_elevation:{label:j(`Minimum mean elevation`),quantize:e=>pack.cells.h[e],aggregate:e=>d(e),formatTicks:e=>_(e),stringify:e=>_(e),stackable:!1,landOnly:!1},average_temperature:{label:j(`Annual mean temperature`),quantize:e=>grid.cells.temp[pack.cells.g[e]],aggregate:e=>u(e),formatTicks:e=>v(e),stringify:e=>v(e),stackable:!1,landOnly:!1},max_temperature:{label:j(`Annual max temperature`),hint:j(`Highest mean temperature of the year`),quantize:e=>grid.cells.temp[pack.cells.g[e]],aggregate:e=>l(e),formatTicks:e=>v(e),stringify:e=>v(e),stackable:!1,landOnly:!1},min_temperature:{label:j(`Annual min temperature`),hint:j(`Lowest mean temperature of the year`),quantize:e=>grid.cells.temp[pack.cells.g[e]],aggregate:e=>d(e),formatTicks:e=>v(e),stringify:e=>v(e),stackable:!1,landOnly:!1},average_precipitation:{label:j(`Annual mean precipitation`),quantize:e=>grid.cells.prec[pack.cells.g[e]],aggregate:e=>A(u(e)),formatTicks:e=>x(A(e)),stringify:e=>x(A(e)),stackable:!1,landOnly:!0},max_precipitation:{label:j(`Annual max precipitation`),hint:j(`Highest mean precipitation of the year`),quantize:e=>grid.cells.prec[pack.cells.g[e]],aggregate:e=>A(l(e)),formatTicks:e=>x(A(e)),stringify:e=>x(A(e)),stackable:!1,landOnly:!0},min_precipitation:{label:j(`Annual min precipitation`),hint:j(`Lowest mean precipitation of the year`),quantize:e=>grid.cells.prec[pack.cells.g[e]],aggregate:e=>A(d(e)),formatTicks:e=>x(A(e)),stringify:e=>x(A(e)),stackable:!1,landOnly:!0},coastal_cells:{label:j(`Number of coastal cells`),quantize:e=>+(pack.cells.t[e]===1),aggregate:e=>o(e),formatTicks:e=>e,stringify:e=>e.toLocaleString(),stackable:!0,landOnly:!0},river_cells:{label:j(`Number of river cells`),quantize:e=>+!!pack.cells.r[e],aggregate:e=>o(e),formatTicks:e=>e,stringify:e=>e.toLocaleString(),stackable:!0,landOnly:!0},production_value:{label:j(`Production value`),hint:j(`Worth of produced goods`),provides:[`good`],prepare:()=>({rural:c.getRural()}),getContributions:(e,{rural:t})=>{let n=je(e,t),r=[];for(let[e,t]of Object.entries(n)){let n=i.get(+e);n&&r.push({good:+e,value:t*n.value})}return r},aggregate:e=>A(o(e)),formatTicks:e=>M(e),stringify:e=>b(e),stackable:!0,landOnly:!0},production_units:{label:j(`Production volume`),hint:j(`Units of goods produced`),provides:[`good`],prepare:()=>({rural:c.getRural()}),getContributions:(e,{rural:t})=>{let n=je(e,t),r=[];for(let[e,t]of Object.entries(n))r.push({good:+e,value:t});return r},aggregate:e=>A(o(e)),formatTicks:e=>M(e),stringify:e=>`${e.toLocaleString()} units`,stackable:!0,landOnly:!0},burgs_profit:{label:j(`Burgs profit`),hint:j(`Burgs profit from trade and manufacturing`),quantize:e=>{let t=pack.cells.burg[e];return t&&pack.burgs[t].product||0},aggregate:e=>A(o(e)),formatTicks:e=>M(e),stringify:e=>b(e),stackable:!0,landOnly:!0}},le={stackedBar:{offset:ce},normalizedStackedBar:{offset:se,formatX:e=>`${A(e*100)}%`}},q=[],ue;function de(){if(options.app.mode)return;fe(),ve(),pe(),w.closeAll(`#chartsOverview, .stable`);let e=h.at(-1)?.created;if(ue!==e&&(q=[],ue=e),!q.length)me();else for(let e of q)he(e);w.open(`chartsOverview`,{resizable:!0,title:j(`Data Charts`),width:`60vw`,height:`auto`,position:{my:`center`,at:`center`,of:`svg`},onClose:ye})}function fe(){w.destroy(`chartsOverview`);let e=Object.entries(G).map(([e,{label:t}])=>[e,t]),r=Object.entries(K).map(([e,{label:t}])=>[e,t]),i=([e,t])=>`<option value="${e}">${t}</option>`,a=e=>e.map(i).join(``),o=`<div id="chartsOverview" class="dialog stable">
    <form id="chartsOverview__form">
      <div>
        <button data-tip="${j(`Add`)}" type="submit">${j(`Plot`)}</button>

        <select data-tip="${j(`Select entity (y axis)`)}" id="chartsOverview__entitiesSelect">
          ${a(e)}
        </select>

        <label for="chartsOverview__plotBySelect" data-tip="${j(`Select metric to plot (x axis)`)}">
          <span>${j(`by`)}</span>
          <select id="chartsOverview__plotBySelect">
            ${a(r)}
          </select>
          <i id="chartsOverview__plotByInfo" class="icon-info-circled" style="display: none"></i>
        </label>

        <label for="chartsOverview__groupBySelect" data-tip="${j(`Select entity to group by. If you don't need grouping, set it the same as the entity`)}">
          <span>${j(`grouped by`)}</span>
          <select id="chartsOverview__groupBySelect">
            ${a(e)}
          </select>
        </label>

        <label data-tip="${j(`Sorting type`)}" for="chartsOverview__sortingSelect">
          <span>${j(`sorted`)}</span>
          <select id="chartsOverview__sortingSelect">
            <option value="value">${j(`by value`)}</option>
            <option value="name">${j(`by name`)}</option>
            <option value="natural">${j(`naturally`)}</option>
          </select>
        </label>
      </div>

      <div>
        <label data-tip="${j(`Select chart type`)}" for="chartsOverview__chartType">
          <span>${j(`Type`)}</span>
          <select id="chartsOverview__chartType">
            <option value="stackedBar" selected>${j(`Stacked Bar`)}</option>
            <option value="normalizedStackedBar">${j(`Normalized Bar`)}</option>
          </select>
        </label>

        <label data-tip="${j(`Show the charts in 1, 2, 3 or 4 columns`)}" for="chartsOverview__viewColumns">
          <span>${j(`Columns`)}</span>
          <select id="chartsOverview__viewColumns">
            <option value="1" selected>1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </label>

        <label data-tip="${j(`Exclude zero element from the results (id 0, e.g. the neutral state)`)}" for="chartsOverview__excludeNeutral">
          <input id="chartsOverview__excludeNeutral" type="checkbox" class="native" />
          <span>${j(`Exclude neutral`)}</span>
        </label>
      </div>
    </form>

    <section id="chartsOverview__charts"></section>
  </div>`;n(`dialogs`).insertAdjacentHTML(`beforeend`,o),n(`chartsOverview__entitiesSelect`).value=`states`,n(`chartsOverview__plotBySelect`).value=`total_population`,n(`chartsOverview__groupBySelect`).value=`cultures`,n(`chartsOverview__form`).addEventListener(`submit`,me),n(`chartsOverview__viewColumns`).addEventListener(`change`,ve),n(`chartsOverview__plotBySelect`).addEventListener(`change`,pe),t(`chartsOverviewStyle`)?.remove();let s=document.createElement(`style`);s.id=`chartsOverviewStyle`,s.textContent=`
    #chartsOverview {
      max-width: 90vw !important;
      max-height: 90vh !important;
      overflow: hidden;
      display: grid;
      grid-template-rows: auto 1fr;
    }

    #chartsOverview__form {
      display: grid;
      font-size: 1.1em;
      margin: 0.3em 0;
    }

    #chartsOverview__form > div:first-child {
      display: flex;
      align-items: center;
      gap: 0.2em;
    }

    #chartsOverview__form > div:nth-child(2) {
      display: flex;
      align-items: center;
      gap: 1em;
    }

    #chartsOverview__form label {
      display: inline-flex;
      align-items: center;
    }

    #chartsOverview__charts {
      overflow: auto;
      scroll-behavior: smooth;
      display: grid;
    }

    #chartsOverview__charts figure {
      margin: 0;
      padding: 0.6em 0 1em;
      border-top: 1px solid rgba(128, 128, 128, 0.4);
    }

    #chartsOverview__charts figcaption {
      font-size: 1.2em;
      margin: 0 1% 0.4em 4%;
      display: grid;
      align-items: center;
      grid-template-columns: 1fr auto;
    }

    #chartsOverview__plotByInfo {
      margin-left: 0.3em;
      cursor: help;
      opacity: 0.6;
    }
  `,document.head.appendChild(s)}function pe(){let e=n(`chartsOverview__plotBySelect`).value,t=n(`chartsOverview__plotByInfo`),{hint:r}=K[e];r?(t.dataset.tip=r,t.style.display=``):t.style.display=`none`}function me(e){e&&e.preventDefault();let t=n(`chartsOverview__entitiesSelect`).value,r=n(`chartsOverview__plotBySelect`).value,i=n(`chartsOverview__groupBySelect`).value,a=n(`chartsOverview__sortingSelect`).value,o=n(`chartsOverview__chartType`).value,s=n(`chartsOverview__excludeNeutral`).checked,{label:c,stackable:l,provides:u=[]}=K[r],d=[t,i].find(e=>{let t=G[e].requires;return t?!u.includes(t):!1});if(d){T(j(`{{plot}} cannot be broken down by {{group}}`,{plot:c,group:G[d].label.toLowerCase()}),!1,`error`,4e3);return}!l&&i!==t&&(T(j(`Grouping is not supported for {{plot}}`,{plot:r}),!1,`warn`,4e3),i=t);let f={id:Date.now(),entity:t,plotBy:r,groupBy:i,sorting:a,type:o,excludeNeutral:s};q.push(f),he(f),J()}function he({id:e,entity:t,plotBy:r,groupBy:i,sorting:a,type:o,excludeNeutral:s}){let{label:c,stringify:l,quantize:u,getContributions:d,prepare:f,aggregate:p,formatTicks:m,landOnly:h}=K[r],g=i===t,{label:_,getName:v,getId:y,landOnly:b}=G[t],{label:x,getName:S,getId:C,getColors:w}=G[i],T=f?f():void 0,E=d?e=>d(e,T):e=>[{value:u(e)}],D=g?j(`{{- metric}} by {{- entity}}`,{metric:c,entity:_}):j(`{{- metric}} by {{- entity}}, grouped by {{- group}}`,{metric:c,entity:_,group:x}),k=(e,t,n,r)=>{let i=`${_}: ${e}`,a=g?``:`${x}: ${t}`,o=`${c}: ${l(n)}`;return g||(o+=` (${A(r*100)}%)`),[i,a,o].filter(Boolean)},M={},N=new Set;for(let e of pack.cells.i)if(!((b||h)&&O(e,pack)))for(let t of E(e)){let n=y(e,t),r=C(e,t);if(s&&(n===0||r===0))continue;let{value:i}=t;M[n]?M[n][r]?M[n][r].push(i):M[n][r]=[i]:M[n]={[r]:[i]},N.add(r)}let P=Pe(Object.entries(M).flatMap(([e,t])=>{let n=v(e);return Object.entries(t).map(([e,t])=>{let r=S(e),i=p(t);return{name:n,group:r,value:i}})}),a),F=w(),{offset:I,formatX:L=m}=le[o];_e(e,P,ge(P,{colors:F,tooltip:k,offset:I,formatX:L}),D),n(`chartsOverview__charts`).lastElementChild?.scrollIntoView()}function ge(e,{colors:t,tooltip:n,offset:r,formatX:i}){let a=e.map(e=>e.value),c=e.map(e=>e.name),l=e.map(e=>e.group),u=new Set(c),d=new Set(l),f=F(a.length).filter(e=>u.has(c[e])&&d.has(l[e])),h=Array.from(u),g=Array.from(d),_=Ce(h),v=we(g,Z-_-15),y={top:30,right:15,bottom:v*20+10,left:_},b=[y.left,Z-y.right],x=u.size*25+y.top+y.bottom,S=[x-y.bottom,y.top],C=te(f,([e])=>e,e=>c[e],e=>l[e]),w=oe().keys(g).value(([,e],t)=>a[new Map(e).get(t)]).order(W).offset(r)(C).map(e=>{let t=e.filter(e=>!Number.isNaN(e[1])).map(t=>Object.assign(t,{i:new Map(t.data[1]).get(e.key)}));return{key:e.key,data:t}}),E=w.flatMap(e=>e.data.flatMap(e=>[e[0],e[1]])),D=s(E),O=P(D,b),k=H(h,S).paddingInner(be),A=m(O).ticks(Z/80,null),j=p(k).tickSizeOuter(0),M=re(`svg`).attr(`version`,`1.1`).attr(`xmlns`,`http://www.w3.org/2000/svg`).attr(`viewBox`,`0 0 ${Z} ${x}`).attr(`style`,`max-width: 100%; height: auto; height: intrinsic;`);M.append(`g`).attr(`transform`,`translate(0,${y.top})`).call(A).call(e=>e.select(`.domain`).remove()).call(e=>e.selectAll(`text`).text(e=>i(e))).call(e=>e.selectAll(`.tick line`).clone().attr(`y2`,x-y.top-y.bottom).attr(`stroke-opacity`,.1));let N=M.append(`g`).attr(`stroke`,`#666`).attr(`stroke-width`,.5).selectAll(`g`).data(w).join(`g`).attr(`fill`,e=>t[e.key]).selectAll(`rect`).data(e=>e.data.filter(([e,t])=>e!==t)).join(`rect`).attr(`x`,([e,t])=>Math.min(O(e),O(t))).attr(`y`,({i:e})=>k(c[e])).attr(`width`,([e,t])=>Math.abs(O(e)-O(t))).attr(`height`,k.bandwidth()),I=Object.fromEntries(te(f,e=>o(e,e=>a[e]),e=>c[e])),L=({i:e})=>n(c[e],l[e],a[e],a[e]/I[c[e]]);N.append(`title`).text(e=>L(e).join(`\r
`)),N.on(`mouseover`,(e,t)=>T(L(t).join(`. `))),M.append(`g`).attr(`transform`,`translate(${O(0)},0)`).call(j);let R=Math.ceil(g.length/v),ee=Z/(R+.5),z=(e,t)=>t%R*ee,ne=(e,t)=>z(e,t)+Se,B=(e,t)=>Math.floor(t/R)*20,V=M.append(`g`).attr(`stroke`,`#666`).attr(`stroke-width`,.5).attr(`dominant-baseline`,`central`).attr(`transform`,`translate(${y.left},${x-y.bottom+15})`);return V.selectAll(`circle`).data(g).join(`rect`).attr(`x`,z).attr(`y`,B).attr(`width`,10).attr(`height`,10).attr(`transform`,`translate(-5, -5)`).attr(`fill`,e=>t[e]),V.selectAll(`text`).data(g).join(`text`).attr(`x`,ne).attr(`y`,B).text(e=>e),M.node()}function _e(e,t,r,i){let a=n(`chartsOverview__charts`),o=document.createElement(`figure`),s=document.createElement(`figcaption`),c=a.childElementCount+1;s.innerHTML=`
    <div>
      <strong>${j(`Figure {{number}}`,{number:c})}</strong>. ${i}
    </div>
    <div>
      <button data-tip="${j(`Download the chart data as a CSV file`)}" class="icon-download"></button>
      <button data-tip="${j(`Download the chart as a PNG image`)}" class="icon-export"></button>
      <button data-tip="${j(`Download the chart in SVG format (vector, opens in a browser or Inkscape)`)}" class="icon-chart-bar"></button>
      <button data-tip="${j(`Remove`)}" class="icon-trash"></button>
    </div>
  `,o.appendChild(s),o.appendChild(r),a.appendChild(o),o.querySelector(`button.icon-download`)?.addEventListener(`click`,()=>{let e=t.map(({name:e,group:t,value:n})=>[e,t,n]);S.download(i,[`Name`,`Group`,`Value`],e)}),o.querySelector(`button.icon-export`)?.addEventListener(`click`,()=>{let{width:e,height:t}=r.viewBox.baseVal,n=r.cloneNode(!0);n.setAttribute(`width`,String(e)),n.setAttribute(`height`,String(t));let a=new XMLSerializer().serializeToString(n),o=URL.createObjectURL(new Blob([a],{type:`image/svg+xml;charset=utf-8`})),s=new Image;s.onload=()=>{let n=document.createElement(`canvas`);n.width=e*2,n.height=t*2;let r=n.getContext(`2d`);r&&(r.fillStyle=`#fff`,r.fillRect(0,0,n.width,n.height),r.drawImage(s,0,0,n.width,n.height),n.toBlob(e=>e&&E(e,`${C(i)}.png`,`image/png`))),URL.revokeObjectURL(o)},s.src=o}),o.querySelector(`button.icon-chart-bar`)?.addEventListener(`click`,()=>{let e=`${C(i)}.svg`;E(r.outerHTML,e)}),o.querySelector(`button.icon-trash`)?.addEventListener(`click`,()=>{o.remove(),q=q.filter(t=>t.id!==e),J()})}function ve(){let e=n(`chartsOverview__viewColumns`).value,t=n(`chartsOverview__charts`);t.style.gridTemplateColumns=`repeat(${e}, 1fr)`,J()}function J(){w.update(`chartsOverview`,{position:{my:`center`,at:`center`,of:`svg`}})}function ye(){w.destroy(`chartsOverview`),t(`chartsOverviewStyle`)?.remove()}var Y=`#ccc`,X=`no`,Z=800,be=.2,xe=7,Se=10;function Ce(e){return l(e.map(e=>e.length))*xe}function we(e,t){if(!e.length)return 0;let n=Se+Ce(e),r=Math.max(1,Math.floor(t/n));return Math.ceil(e.length/r)}function Q(e){return t=>pack[e][+t]?.name||X}function $(e){return()=>Object.fromEntries(pack[e].map(e=>[e.name||X,e.color||Y]))}function Te(e){return pack.biomes[+e]?.name||X}function Ee(){return Object.fromEntries(pack.biomes.map(({name:e,color:t})=>[e,t]))}function De(e){let t=a.get(+e);return t?t.name||pack.burgs[t.centerBurgId]?.name||`Market ${t.i}`:X}function Oe(){return Object.fromEntries((pack.markets||[]).map(e=>[De(e.i),e.color||Y]))}function ke(e){return i.get(+e)?.name||X}function Ae(){return Object.fromEntries(options.map.goods.map(e=>[e.name||X,e.color||Y]))}function je(e,t){let n={...t[e]},r=pack.cells.burg[e];if(r){let e=f.getBurgProduction(pack.burgs[r]);for(let[t,r]of Object.entries(e))n[+t]=(n[+t]||0)+r}return n}function Me(e){let t=pack.cells.burg[e];return t?(pack.burgs[t].population||0)*options.map.units.population.scale*options.map.units.population.urbanization.rate:0}function Ne(e){return pack.cells.pop[e]*options.map.units.population.scale}function Pe(e,t){if(t===`natural`)return e;if(t===`name`)return e.sort((e,t)=>e.name===t.name?e.group.localeCompare(t.group):t.name.localeCompare(e.name));if(t===`value`){let t={},n={};for(let{name:r,group:i,value:a}of e)t[r]=(t[r]||0)+a,n[i]=(n[i]||0)+a;return e.sort((e,r)=>e.name===r.name?n[r.group]-n[e.group]:t[e.name]-t[r.name])}return e}var Fe={open:de};export{Fe as ChartsOverview};