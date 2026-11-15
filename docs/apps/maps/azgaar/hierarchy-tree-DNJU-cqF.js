import{c as e,i as t,r as n,z as r}from"./node-utils-Ds1sVy-v.js";import{J as i,q as a}from"./app-DCKsq5m8.js";import{t as o}from"./dialog-BkeQgjla.js";import{t as s}from"./drag-CCSsgLNP.js";import{o as c}from"./tooltips-BVQbACdS.js";import{T as l,a as u,i as d,m as f}from"./index-sNerCVjG.js";import{n as p,x as m}from"./names-generator-BcJRPzyi.js";import{i as h,t as ee}from"./stratify-CGdiYggi.js";function g(e,t){return e.parent===t.parent?1:2}function _(e){var t=e.children;return t?t[0]:e.t}function v(e){var t=e.children;return t?t[t.length-1]:e.t}function te(e,t,n){var r=n/(t.i-e.i);t.c-=r,t.s+=n,e.c+=r,t.z+=n,t.m+=n}function ne(e){for(var t=0,n=0,r=e.children,i=r.length,a;--i>=0;)a=r[i],a.z+=t,a.m+=t,t+=a.s+(n+=a.c)}function y(e,t,n){return e.a.parent===t.parent?e.a:n}function b(e,t){this._=e,this.parent=null,this.children=null,this.A=null,this.a=this,this.z=0,this.m=0,this.c=0,this.s=0,this.t=null,this.i=t}b.prototype=Object.create(h.prototype);function re(e){for(var t=new b(e,0),n,r=[t],i,a,o,s;n=r.pop();)if(a=n._.children)for(n.children=Array(s=a.length),o=s-1;o>=0;--o)r.push(i=n.children[o]=new b(a[o],o)),i.parent=n;return(t.parent=new b(null,0)).children=[t],t}function x(){var e=g,t=1,n=1,r=null;function i(i){var s=re(i);if(s.eachAfter(a),s.parent.m=-s.z,s.eachBefore(o),r)i.eachBefore(c);else{var l=i,u=i,d=i;i.eachBefore(function(e){e.x<l.x&&(l=e),e.x>u.x&&(u=e),e.depth>d.depth&&(d=e)});var f=l===u?1:e(l,u)/2,p=f-l.x,m=t/(u.x+f+p),h=n/(d.depth||1);i.eachBefore(function(e){e.x=(e.x+p)*m,e.y=e.depth*h})}return i}function a(t){var n=t.children,r=t.parent.children,i=t.i?r[t.i-1]:null;if(n){ne(t);var a=(n[0].z+n[n.length-1].z)/2;i?(t.z=i.z+e(t._,i._),t.m=t.z-a):t.z=a}else i&&(t.z=i.z+e(t._,i._));t.parent.A=s(t,i,t.parent.A||r[0])}function o(e){e._.x=e.z+e.parent.m,e.m+=e.parent.m}function s(t,n,r){if(n){for(var i=t,a=t,o=n,s=i.parent.children[0],c=i.m,l=a.m,u=o.m,d=s.m,f;o=v(o),i=_(i),o&&i;)s=_(s),a=v(a),a.a=t,f=o.z+u-i.z-c+e(o._,i._),f>0&&(te(y(o,t,r),t,f),c+=f,l+=f),u+=o.m,c+=i.m,d+=s.m,l+=a.m;o&&!v(a)&&(a.t=o,a.m+=u-l),i&&!_(s)&&(s.t=i,s.m+=c-d,r=t)}return r}function c(e){e.x*=t,e.y=e.depth*n}return i.separation=function(t){return arguments.length?(e=t,i):e},i.size=function(e){return arguments.length?(r=!1,t=+e[0],n=+e[1],i):r?null:[t,n]},i.nodeSize=function(e){return arguments.length?(r=!0,t=+e[0],n=+e[1],i):r?[t,n]:null},i}var S={top:10,right:10,bottom:-5,left:10},C=e().scaleExtent([.2,1.5]).on(`zoom`,e=>E.attr(`transform`,e.transform.toString())),w=null,T,E,D,O,k,A;function j(){H(),U(),T=r(`#hierarchyTree > svg`).call(C),E=T.select(`g#hierarchyTree_viewbox`),D=E.select(`g#hierarchyTree_linksPrimary`),O=E.select(`g#hierarchyTree_linksSecondary`),k=E.select(`g#hierarchyTree_nodes`),A=E.select(`path#hierarchyTree_dragLine`)}var M,N,P,F,I,L,R;function z(e){if(o.closeAll(`#hierarchyTree, .stable`),M=e.data,N=e.type===`cultures`?i:a,P=W(M),P.filter(e=>!e.shadow).length<3){c(e.type===`cultures`?u(`Not enough cultures to show hierarchy`):u(`Not enough religions to show hierarchy`),!1,`error`),V();return}F=e.onNodeEnter,I=e.onNodeLeave,L=e.getDescription,R=e.getShape;let t=K();if(!t){V();return}let n=t.leaves().length*50,r=t.height*50,s=n-S.left-S.right,d=r+30-S.top-S.bottom,f=x().size([s,d]),p=l(n,300,innerWidth*.75),m=l(r,200,innerHeight*.75);j(),C.extent([[0,0],[p,m]]),T.attr(`viewBox`,`0, 0, ${p}, ${m}`),o.open(`hierarchyTree`,{resizable:!0,title:e.type===`cultures`?u(`Cultures tree`):u(`Religions tree`),position:{my:`left center`,at:`left+10 center`,of:`svg`},width:p,onClose:B}),ae(t,f)}function B(){o.destroy(`hierarchyTree_originSelector`),o.destroy(`hierarchyTree`),t(`hierarchyTreeStyle`)?.remove(),V()}function V(){w=null,T=null,E=null,D=null,O=null,k=null,A=null,N=null,M=null,P=null,F=null,I=null,L=null,R=null}function H(){if(t(`hierarchyTreeStyle`))return;let e=document.createElement(`style`);e.id=`hierarchyTreeStyle`,e.textContent=`
    #hierarchyTree_selectedOrigins > button {
      margin: 0 2px;
    }

    #hierarchyTree {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    #hierarchyTree > svg {
      height: 100%;
    }

    .hierarchyTree_selectedOrigins {
      margin-right: 15px;
    }

    .hierarchyTree_selectedOrigin {
      border: 1px solid #aaa;
      background: none;
      padding: 1px 4px;
    }

    .hierarchyTree_selectedOrigin:hover {
      border: 1px solid #333;
    }

    .hierarchyTree_selectedOrigin::after {
      content: "✕";
      margin-left: 8px;
      color: #999;
    }

    .hierarchyTree_selectedOrigin:hover:after {
      color: #333;
    }

    #hierarchyTree_originSelector {
      display: none;
    }

    #hierarchyTree_originSelector > form > div {
      padding: 0.3em;
      margin: 1px 0;
      border-radius: 1em;
    }

    #hierarchyTree_originSelector > form > div:hover {
      background-color: #ddd;
    }

    #hierarchyTree_originSelector > form > div[checked] {
      background-color: #c6d6d6;
    }

    #hierarchyTree_nodes > g > text {
      pointer-events: none;
      stroke: none;
      font-size: 11px;
    }

    #hierarchyTree_nodes > g.selected {
      stroke: #c13119;
      stroke-width: 1;
      cursor: move;
    }

    #hierarchyTree_dragLine {
      marker-end: url(#end-arrow);
      stroke: #333333;
      stroke-dasharray: 5;
      stroke-dashoffset: 1000;
      animation: dash 80s linear backwards;
    }
  `,document.head.appendChild(e)}function U(){o.destroy(`hierarchyTree`);let e=`<div id="hierarchyTree" class="dialog" style="overflow: hidden;">
    <svg>
      <g id="hierarchyTree_viewbox" style="text-anchor: middle; dominant-baseline: central">
        <g transform="translate(10, -45)">
          <g id="hierarchyTree_links" fill="none" stroke="#aaa">
            <g id="hierarchyTree_linksPrimary"></g>
            <g id="hierarchyTree_linksSecondary" stroke-dasharray="1"></g>
          </g>
          <g id="hierarchyTree_nodes"></g>
          <path id="hierarchyTree_dragLine" path='' />
        </g>
      </g>
    </svg>

    <div id="hierarchyTree_details" class='chartInfo'>
      <div id='hierarchyTree_infoLine' style="display: block">&#8205;</div>
      <div id='hierarchyTree_selected' style="display: none">
        <span><span id='hierarchyTree_selectedName'></span>. </span>
        <span data-name="Type short name (abbreviation)">${u(`Abbreviation`)}: <input id='hierarchyTree_selectedCode' type='text' maxlength='3' size='3' /></span>
        <span>${u(`Origins`)}: <span id='hierarchyTree_selectedOrigins'></span></span>
        <button data-tip='Edit this node's origins' class="hierarchyTree_selectedButton" id='hierarchyTree_selectedSelectButton'>Edit</button>
        <button data-tip='Unselect this node' class="hierarchyTree_selectedButton" id='hierarchyTree_selectedCloseButton'>Unselect</button>
      </div>
    </div>
    <div id="hierarchyTree_originSelector"></div>
  </div>`;n(`dialogs`).insertAdjacentHTML(`beforeend`,e)}function W(e){let t=e.filter(e=>!e.removed).map(e=>({...e,origins:[...e.origins||[]]}));for(let e of t)e.i===0?e.origins=[null]:e.origins.length&&t.find(t=>e.origins[0]===t.i)||(e.origins=[0]),e.origins=e.origins.filter((e,n)=>!n||t.some(t=>t.i&&t.i===e));let n=new Map;for(let e of t){if(!e.i)continue;let t=typeof e.ancestry==`string`?e.ancestry.trim():``;t&&(n.has(t)||n.set(t,[]),n.get(t).push(e))}if(n.size>0){let e=-1,r=[];for(let[i,a]of n.entries()){let n=a.filter(e=>e.origins[0]===0);if(!n.length)continue;let o=e--,s=[...t.map(e=>e.code).filter(Boolean),...r.map(e=>e.code).filter(Boolean)],c={i:o,name:i,code:p(i,s),color:`#ffffff`,type:`Generic`,origins:[0],shadow:!0,ancestry:i};r.push(c);for(let e of n)e.origins[0]=o}t.push(...r)}return t}function G(e,t){try{let n=t.map(e=>Math.max(e,0)),r=[...new Set(n)],i=r.length>1?r.filter(Boolean):r;return N.setOrigins(e,i.length?i:[0]),!0}catch(e){return c(e instanceof Error?e.message:String(e),!1,`error`,4e3),!1}}function K(){try{let e=ee().id(e=>String(e.i)).parentId(e=>e.origins[0]==null?null:String(e.origins[0]))(P);return w=e,e}catch(e){return c(d(u(`Hierarchy data issue`),f(String(e))),!1,`error`,6e3),w}}function q(e){return`${e.source.id}-${e.target.id}`}function J(e){return e.id??``}function Y(e){let{source:{x:t,y:n},target:{x:r,y:i}}=e;return`M${t},${n} C${t},${(n*3+i)/4} ${r},${(n*2+i)/3} ${r},${i}`}function X(e){let t=e.descendants(),n=[];for(let e of t){let r=e.data.origins;for(let i=1;i<r.length;i++){let a=t.find(e=>e.data.i===r[i]);a&&n.push({source:a,target:e})}}return n}var ie={undefined:`M5,0A5,5,0,1,1,-5,0A5,5,0,1,1,5,0`,circle:`M11.3,0A11.3,11.3,0,1,1,-11.3,0A11.3,11.3,0,1,1,11.3,0`,square:`M-11,-11h22v22h-22Z`,hexagon:`M-6.5,-11.26l13,0l6.5,11.26l-6.5,11.26l-13,0l-6.5,-11.26Z`,diamond:`M0,-14L14,0L0,14L-14,0Z`,concave:`M-11,-11l11,2l11,-2l-2,11l2,11l-11,-2l-11,2l2,-11Z`,octagon:`M-4.97,-12.01 l9.95,0 l7.04,7.04 l0,9.95 l-7.04,7.04 l-9.95,0 l-7.04,-7.04 l0,-9.95Z`,pentagon:`M0,-14l14,11l-6,14h-16l-6,-14Z`},Z=e=>{let t=e.descendants(),n=t.flatMap(({data:e})=>e.origins.slice(1));if(n.length>0)return m(n)??0;if(e.data.shadow){let e=t.filter(e=>!e.data.shadow&&e.data.i>0);if(e.length)return Math.min(...e.map(e=>e.data.i))}return e.data.i};function ae(e,t){t(e.sort((e,t)=>Z(e)-Z(t))),D.selectAll(`path`).data(e.links(),q).join(`path`).attr(`d`,Y),O.selectAll(`path`).data(X(e),q).join(`path`).attr(`d`,Y);let n=k.selectAll(`g`).data(e.descendants(),J).join(`g`).attr(`data-id`,e=>e.data.i).attr(`stroke`,`#333`).attr(`transform`,e=>`translate(${e.x}, ${e.y})`).on(`mouseenter`,se).on(`mouseleave`,ce).on(`click`,(e,t)=>$(t)).call(s().on(`start`,le));n.selectAll(`path`).data(e=>[e]).join(`path`).attr(`d`,e=>ie[R(e.data)??`undefined`]).attr(`fill`,e=>e.data.color||`#ffffff`).attr(`stroke-dasharray`,e=>e.data.cells?`none`:`1`),n.selectAll(`text`).data(e=>[e]).join(`text`).text(e=>e.data.code||``)}function oe(e,t){e.x=t.x,e.y=t.y;for(let n of e.descendants()){let e=t.descendants().find(e=>e.data.i===n.data.i);e&&(n.x=e.x,n.y=e.y)}}function Q(){let e=w;P=W(M);let t=K();if(!t)return;e&&oe(t,e);let n=1e3,r=e=>e.append(`path`).attr(`d`,Y).attr(`opacity`,0).call(e=>e.transition().duration(50).attr(`opacity`,1)),i=e=>e.call(e=>e.transition().duration(50).attr(`d`,Y)),a=e=>e.call(e=>e.transition().duration(50).attr(`opacity`,0).remove()),o=e=>e.selectAll(`path`);o(D).data(t.links(),q).join(r,i,a),o(O).data(X(t),q).join(r,i,a);let s=t.leaves().length*50,c=t.height*50,l=s-S.left-S.right,u=c+30-S.top-S.bottom;x().size([l,u])(t.sort((e,t)=>Z(e)-Z(t))),D.selectAll(`path`).data(t.links(),q).transition().duration(n).delay(50).attr(`d`,Y),O.selectAll(`path`).data(X(t),q).transition().duration(n).delay(50).attr(`d`,Y),k.selectAll(`g`).data(t.descendants(),J).transition().delay(50).duration(n).attr(`transform`,e=>`translate(${e.x},${e.y})`)}function $(e){let t=e.data;if(!t.i||t.shadow){k.selectAll(`g`).style(`outline`,`none`),n(`hierarchyTree_selected`).style.display=`none`,n(`hierarchyTree_infoLine`).style.display=`block`;return}let r=k.select(`g[data-id="${e.id}"]`);k.selectAll(`g`).style(`outline`,`none`),r.style(`outline`,`1px solid #c13119`),n(`hierarchyTree_selected`).style.display=`block`,n(`hierarchyTree_infoLine`).style.display=`none`,n(`hierarchyTree_selectedName`).textContent=t.name,n(`hierarchyTree_selectedCode`).value=t.code||``,n(`hierarchyTree_selectedCode`).onchange=function(){let e=this;if(e.value.length>3)return c(u(`Abbreviation must be 3 characters or less`),!1,`error`,3e3);if(!e.value.length)return c(u(`Abbreviation cannot be empty`),!1,`error`,3e3);N.setCode(t.i,e.value),r.select(`text`).text(t.code||``)};let i=()=>{n(`hierarchyTree_selectedOrigins`).innerHTML=t.origins.filter(e=>e&&e>0).map((e,t)=>{let{name:n,code:r}=P.find(t=>t.i===e)||{};return`<button data-id="${e}" class="hierarchyTree_selectedButton hierarchyTree_selectedOrigin" data-tip="${d(u(t?`Secondary origin: {{name}}`:`Primary origin: {{name}}`,{name:n}),u(`Click to remove link to that origin`))}">${r??n??e}</button>`}).join(``),n(`hierarchyTree_selectedOrigins`).onclick=e=>{let n=e.target;if(n.tagName!==`BUTTON`)return;let r=Number(n.dataset.id),i=t.origins.filter(e=>e!==r);G(t.i,i.length?i:[0])&&(n.remove(),Q())}};i(),n(`hierarchyTree_selectedSelectButton`).onclick=()=>{let r=t.origins,a=e.descendants().map(e=>e.data.i),s=P.filter(({i:e,shadow:t})=>!a.includes(e)&&!t).map(({i:e,name:t,code:n,color:i})=>{let a=r[0]===e||e===0&&(r[0]==null||r[0]<=0)?`checked`:``,o=r.includes(e)?`checked`:``;return e===0?`
        <div ${o}>
          <input data-tip="${u(`Set as primary origin`)}" type="radio" name="primary" value="${e}" ${a} />
          ${u(`Top level`)}
        </div>
      `:`
        <div ${o}>
          <input data-tip="${u(`Set as primary origin`)}" type="radio" name="primary" value="${e}" ${a} />
          <input data-id="${e}" id="selectElementOrigin${e}" class="checkbox" type="checkbox" ${o} />
          <label data-tip="${u(`Check to set as a secondary origin`)}" for="selectElementOrigin${e}" class="checkbox-label">
            <fill-box fill="${i}" size=".8em" disabled></fill-box>
            ${n}: ${t}
          </label>
        </div>
      `});n(`hierarchyTree_originSelector`).innerHTML=`
      <form style="max-height: 35vh">
        ${s.join(``)}
      </form>
    `,o.open(`hierarchyTree_originSelector`,{title:u(`Select origins`),position:{my:`center`,at:`center`,of:`svg`},buttons:[{label:u(`Select`),onClick:()=>{o.close(`hierarchyTree_originSelector`);let e=n(`hierarchyTree_originSelector`),r=e.querySelector(`input[type='radio']:checked`),a=e.querySelectorAll(`input[type='checkbox']:checked`),s=r?Number(r.value):0,c=Array.from(a).map(e=>Number(e.dataset.id)).filter(e=>e!==s);G(t.i,[s,...c])&&(Q(),i())}},{label:u(`Cancel`),onClick:()=>{o.close(`hierarchyTree_originSelector`)}}]})},n(`hierarchyTree_selectedCloseButton`).onclick=()=>{r.style(`outline`,`none`),n(`hierarchyTree_selected`).style.display=`none`,n(`hierarchyTree_infoLine`).style.display=`block`}}function se(e,t){t.depth!==0&&(this.classList.add(`selected`),F(t),n(`hierarchyTree_infoLine`).textContent=L(t.data),t.data.shadow?c(u(`Ancestry`)):c(u(`Drag to other node to add parent, click to edit`)))}function ce(e,t){this.classList.remove(`selected`),I(t),n(`hierarchyTree_infoLine`).innerHTML=`&#8205;`,c(``)}function le(e,t){t.data.i&&!t.data.shadow&&(A.attr(`d`,`M${t.x},${t.y}L${t.x},${t.y}`),e.on(`drag`,e=>{A.attr(`d`,`M${t.x},${t.y}L${e.x},${e.y}`)}),e.on(`end`,()=>{A.attr(`d`,``);let e=k.select(`g.selected`);if(!e.size())return;let n=t.data.i,r=e.datum()?.data;if(!r)return;let i=!!r.shadow,a=i?0:r.i;if(n===a||t.data.origins.includes(r.i)||t.descendants().some(e=>e.data.i===r.i))return;let o=M.find(({i:e})=>e===n);if(o){if(i||a===0){if(!G(n,[0]))return}else if(!G(n,[...o.origins?.[0]===0?[]:o.origins??[],a]))return;$(t),Q()}}))}var ue={open:z};export{ue as HierarchyTree};