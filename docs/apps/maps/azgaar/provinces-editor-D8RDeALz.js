import{T as e,a as t,d as n,i as r,r as i,t as a,z as o}from"./node-utils-Ds1sVy-v.js";import{t as s}from"./controllers-Dbv1ZRTV.js";import{a as c,u as l}from"./military-generator-CVth4JoO.js";import{c as u}from"./prosperity-J_ycIG-E.js";import{l as d}from"./linear-DMWKWi8f.js";import{n as f}from"./stability-DCAus2OW.js";import{C as p,y as m}from"./options-model-CrstL1Qd.js";import{t as h,v as g}from"./names-generator-BcJRPzyi.js";import{a as _,o as v}from"./units-CYDspnRH.js";import{Nt as y,at as b,c as x,it as S,lt as C,rt as w,s as ee,t as T}from"./layers-DjWzCbYN.js";import{t as E}from"./csv-BoSHm6Vn.js";import{_ as te,c as ne,d as re,l as ie,s as ae,t as D}from"./app-DCKsq5m8.js";import{t as oe}from"./development-view-ChwbelfH.js";import{t as O}from"./dialog-BkeQgjla.js";import{t as se}from"./highlighting-C3iNJ2tq.js";import{t as k}from"./state-B2hBYDzv.js";import{a as ce,i as le,n as ue,r as de}from"./table-DPmN0izx.js";import{F as fe,M as pe,a as me,b as he,i as A}from"./economy-view-C5mGSEYI.js";import{t as ge}from"./annex-mode-DX72TXM1.js";import{i as _e,n as ve}from"./highlight-CBuOTLhq.js";import{m as ye}from"./zoom-B8oh1YKy.js";import{o as j,t as be}from"./tooltips-BVQbACdS.js";import{b as M,v as xe}from"./notices-6lBE5Kkn.js";import{s as Se}from"./color-utils-OCVlKvQa.js";import{a as Ce}from"./pack-generator-DTsfQ82D.js";import{O as N,a as P,i as F,k as I,p as L}from"./index-sNerCVjG.js";import{r as we,t as Te}from"./stratify-CGdiYggi.js";import{n as R,t as z}from"./constant-CUk6ox2a.js";function Ee(e){e.x0=Math.round(e.x0),e.y0=Math.round(e.y0),e.x1=Math.round(e.x1),e.y1=Math.round(e.y1)}function De(e,t,n,r,i){for(var a=e.children,o,s=-1,c=a.length,l=e.value&&(r-t)/e.value;++s<c;)o=a[s],o.y0=n,o.y1=i,o.x0=t,o.x1=t+=o.value*l}function Oe(e,t,n,r,i){for(var a=e.children,o,s=-1,c=a.length,l=e.value&&(i-n)/e.value;++s<c;)o=a[s],o.x0=t,o.x1=r,o.y0=n,o.y1=n+=o.value*l}var ke=(1+Math.sqrt(5))/2;function Ae(e,t,n,r,i,a){for(var o=[],s=t.children,c,l,u=0,d=0,f=s.length,p,m,h=t.value,g,_,v,y,b,x,S;u<f;){p=i-n,m=a-r;do g=s[d++].value;while(!g&&d<f);for(_=v=g,x=Math.max(m/p,p/m)/(h*e),S=g*g*x,b=Math.max(v/S,S/_);d<f;++d){if(g+=l=s[d].value,l<_&&(_=l),l>v&&(v=l),S=g*g*x,y=Math.max(v/S,S/_),y>b){g-=l;break}b=y}o.push(c={value:g,dice:p<m,children:s.slice(u,d)}),c.dice?De(c,n,r,i,h?r+=m*g/h:a):Oe(c,n,r,h?n+=p*g/h:i,a),h-=g,u=d}return o}var je=(function e(t){function n(e,n,r,i,a){Ae(t,e,n,r,i,a)}return n.ratio=function(t){return e((t=+t)>1?t:1)},n})(ke);function Me(){var e=je,t=!1,n=1,r=1,i=[0],a=z,o=z,s=z,c=z,l=z;function u(e){return e.x0=e.y0=0,e.x1=n,e.y1=r,e.eachBefore(d),i=[0],t&&e.eachBefore(Ee),e}function d(t){var n=i[t.depth],r=t.x0+n,u=t.y0+n,d=t.x1-n,f=t.y1-n;d<r&&(r=d=(r+d)/2),f<u&&(u=f=(u+f)/2),t.x0=r,t.y0=u,t.x1=d,t.y1=f,t.children&&(n=i[t.depth+1]=a(t)/2,r+=l(t)-n,u+=o(t)-n,d-=s(t)-n,f-=c(t)-n,d<r&&(r=d=(r+d)/2),f<u&&(u=f=(u+f)/2),e(t,r,u,d,f))}return u.round=function(e){return arguments.length?(t=!!e,u):t},u.size=function(e){return arguments.length?(n=+e[0],r=+e[1],u):[n,r]},u.tile=function(t){return arguments.length?(e=we(t),u):e},u.padding=function(e){return arguments.length?u.paddingInner(e).paddingOuter(e):u.paddingInner()},u.paddingInner=function(e){return arguments.length?(a=typeof e==`function`?e:R(+e),u):a},u.paddingOuter=function(e){return arguments.length?u.paddingTop(e).paddingRight(e).paddingBottom(e).paddingLeft(e):u.paddingTop()},u.paddingTop=function(e){return arguments.length?(o=typeof e==`function`?e:R(+e),u):o},u.paddingRight=function(e){return arguments.length?(s=typeof e==`function`?e:R(+e),u):s},u.paddingBottom=function(e){return arguments.length?(c=typeof e==`function`?e:R(+e),u):c},u.paddingLeft=function(e){return arguments.length?(l=typeof e==`function`?e:R(+e),u):l},u}var B=`provincesEditor`,V={my:`right top`,at:`right-10 top+10`,of:`svg`},H,U=[],Ne=[`Id`,`Province`,`Full Name`,`Form`,`State`,`Color`,`Capital`,`Area`,`Total Population`,`Rural Population`,`Urban Population`,`Burgs`,`Tags`],W=e=>_(e.area);function Pe(e,t=f.getProvince(e.i)?.province){let n=pack.states[e.state];return t&&n?u.ofProvince(n,t,n.economy.collected):null}function Fe(e){let t=l.ofProvince(e.i)?.prosperity,n=t==null?`<div data-tip="${A.noData()}" class="placeholder" data-col="prosperity"></div>`:`<div data-tip="${F(pe(t),P(`Click to open the province's economy`))}" class="provinceEconomy pointer" data-col="prosperity">${fe(t)}</div>`,r=f.getProvince(e.i),i=r?Pe(e,r.province):null;return!r||i===null?`${n}<div data-tip="${A.noData()}" class="placeholder" data-col="corruption"></div><div class="placeholder" data-col="stability"></div>`:`${n}
      <div data-tip="${F(A.corruption(),P(`Click to open the province's economy`))}" class="provinceEconomy pointer" data-col="corruption">${N(i)}%</div>
      <div data-tip="${F(A.stability(),P(`Click to open the stability overview`))}" class="provinceStability pointer" data-col="stability">${N(r.stability*100)}%</div>`}var G=e=>N(e.rural*options.map.units.population.scale+e.urban*options.map.units.population.scale*options.map.units.population.urbanization.rate),K=[{key:`color`,width:`1.2em`,permanent:!0},{key:`name`,label:P(`Province`),width:`7em`,permanent:!0,sortBy:e=>e.name||``,sortType:`alpha`},{key:`emblem`,width:`1.4em`},{key:`form`,label:P(`Form`),width:`7em`,mobileHidden:!0,sortBy:e=>e.formName||``,sortType:`alpha`},{key:`capital`,label:P(`Capital`),width:`7em`,sortBy:e=>e.burg&&pack.burgs[e.burg]?.name||``,sortType:`alpha`},{key:`state`,label:P(`State`),width:`7em`,permanent:!0,sortBy:e=>pack.states[e.state]?.name||``,sortType:`alpha`},{key:`burgs`,label:P(`Burgs`),width:`5em`,mobileHidden:!0,sortBy:e=>e.burgs?.length||0},{key:`area`,label:P(`Area`),width:`7em`,mobileHidden:!0,defaultSort:`desc`,sortBy:W},{key:`population`,label:P(`Population`),width:`6em`,sortBy:G},{key:`prosperity`,label:P(`Prosperity`),width:`6em`,mobileHidden:!0,tip:F(A.prosperity(),P(`Click a value to open the province's economy`)),sortBy:e=>l.ofProvince(e.i)?.prosperity??-1},{key:`corruption`,label:P(`Corruption`),width:`6em`,hidden:!0,tip:A.corruption(),sortBy:e=>Pe(e)??-1},{key:`stability`,label:P(`Stability`),width:`6em`,mobileHidden:!0,tip:F(A.stability(),P(`Click a value to open the stability overview`)),sortBy:e=>f.getProvince(e.i)?.stability??-1},{key:`development`,label:P(`Development`),width:`7.5em`,hidden:!0,mobileHidden:!0,tip:P(`Development: the people's average technology, 0–100, and its era`),sortBy:e=>U[e.i]??-1},{key:`tags`,label:P(`Tags`),width:`10em`,hidden:!0,sortBy:e=>p.format(e.tags),sortType:`alpha`},{key:`note`,width:`1.1em`},{key:`independence`,width:`1.1em`},{key:`locate`,width:`1.1em`},{key:`focus`,width:`1.1em`},{key:`lock`,width:`1.1em`},{key:`remove`,width:`1.4em`,permanent:!0}],q=de({dialogId:B,getData:X,onUpdate:Ve});function Ie(){options.app.mode||(H=k.get(B,`filters`,()=>({stateId:1,search:``})),O.closeAll(`#provincesEditor, .stable`),T.show(`provinces`,`borders`),T.hide(`states`,`cultures`),Re(),J(),O.open(`provincesEditor`,{title:P(`Provinces Editor`),width:`fit-content`,onClose:vt,position:V}))}function Le(){H.search=i(`provincesSearch`).value,k.set(B,`filters`,H),q.reset()}function Re(){O.destroy(`provincesEditor`);let e=`<div id="provincesEditor" class="dialog stable editorDialog">
      <div id="provincesBodySection" class="table" data-type="absolute">
        ${le({dialogId:B,columns:K})}
      </div>
      <div id="provincesFilters" data-tip="${P(`Apply a filter`)}" class="editorFilters">
        <label for="provincesSearch" data-tip="${P(`Filter by name, form, capital, state, or tag`)}">
          ${P(`Search`)}: <input id="provincesSearch" type="search" />
        </label>
      </div>
      <div id="provincesFooter" class="totalLine">
        <div data-tip="${P(`Provinces displayed`)}" style="margin-left: 4px">
          ${P(`Provinces`)}:&nbsp;<span id="provincesFooterNumber">0</span>
        </div>
        <div data-tip="${P(`Number of burgs`)}" style="margin-left: 12px" data-col="burgs">
          ${P(`Burgs`)}:&nbsp;<span id="provincesFooterBurgs">0</span>
        </div>
        <div data-tip="${P(`Average area`)}" style="margin-left: 14px" data-col="area">
          ${P(`Mean area`)}:&nbsp;<span id="provincesFooterArea">0</span>
        </div>
        <div data-tip="${P(`Average population`)}" style="margin-left: 14px" data-col="population">
          ${P(`Mean population`)}:&nbsp;<span id="provincesFooterPopulation">0</span>
        </div>
      </div>
      <div id="provincesBottom" class="editorToolbar">
        <button id="provincesEditorRefresh" data-tip="${P(`Refresh`)}" class="icon-cw"></button>
        <button id="provincesEditStyle" data-tip="${P(`Edit style in Style Editor`)}" class="icon-adjust"></button>
        <button
          id="provincesRecolor"
          data-tip="${P(`Recolor listed provinces based on state color`)}"
          class="icon-paint-roller"
        ></button>
        <button
          id="provincesPercentage"
          data-tip="${P(`Toggle percentage / absolute values views`)}"
          class="icon-percent"
        ></button>
        <button id="provincesChart" data-tip="${P(`Provinces chart`)}" class="icon-chart-area"></button>
        <button
          id="regenerateProvinceNames"
          data-tip="${P(`Regenerate province names based on assigned culture`)}"
          class="icon-retweet"
        ></button>
        <button
          id="provincesExport"
          data-tip="${P(`Save data as a CSV file`)}"
          class="icon-download"
        ></button>
        <button id="provincesImport" data-tip="${P(`Upload data from a CSV file`)}" class="icon-upload"></button>
        <button id="provincesManually" data-tip="${P(`Manually re-assign provinces`)}" class="icon-brush"></button>
        <button
          id="provincesRelease"
          data-tip="${P(`Release all provinces. It will make all provinces with burgs independent`)}"
          class="icon-flag"
        ></button>
        <button
          id="provincesAdd"
          data-tip="${F(P(`Add`),P(`Hold Shift to add multiple`))}"
          class="icon-plus"
        ></button>
        <button id="provincesMerge" data-tip="${P(`Merge several provinces into one`)}" class="icon-layer-group"></button>
        <button
          id="provincesAnnex"
          data-tip="${F(P(`Annex provinces: click the annexing province, then the provinces of the same state it absorbs`),P(`Hold Shift to keep annexing`))}"
          class="icon-crown"
        ></button>
        <button
          id="provincesRemoveAll"
          data-tip="${F(P(`Remove all provinces`),P(`States will remain as they are`))}"
          class="icon-trash"
        ></button>
        <span>${P(`State`)}: </span>
        <select id="provincesFilterState"></select>
      </div>
    </div>`;i(`dialogs`).insertAdjacentHTML(`beforeend`,e);let t=i(`provincesSearch`);t.value=H.search??``,t.addEventListener(`input`,Le),ae(B,q.reset),ue({dialogId:B,columns:K,onUpdate:()=>O.update(B,{width:`fit-content`,position:V})}),se(`provincesEditor`,({cellId:e})=>pack.cells.province[e]),i(`provincesEditorRefresh`).addEventListener(`click`,J),i(`provincesEditStyle`).addEventListener(`click`,()=>void s.StyleEditor.open(`provinces`)),i(`provincesFilterState`).addEventListener(`change`,e=>{H.stateId=+e.target.value,k.set(B,`filters`,H),q.reset()}),i(`provincesPercentage`).addEventListener(`click`,ct),i(`provincesChart`).addEventListener(`click`,lt),i(`regenerateProvinceNames`).addEventListener(`click`,ze),i(`provincesExport`).addEventListener(`click`,gt),i(`provincesImport`).addEventListener(`click`,()=>E.pick(Et)),i(`provincesRemoveAll`).addEventListener(`click`,_t),i(`provincesManually`).addEventListener(`click`,dt),i(`provincesRelease`).addEventListener(`click`,ut),i(`provincesAdd`).addEventListener(`click`,pt),i(`provincesMerge`).addEventListener(`click`,yt),i(`provincesAnnex`).addEventListener(`click`,xt.toggle),i(`provincesRecolor`).addEventListener(`click`,ht),i(`provincesBodySection`).addEventListener(`click`,e=>{if(options.app.mode)return;let t=e.target,n=t.classList,r=t.closest(`.states`);if(!r)return;let i=+r.dataset.id,a=pack.provinces[i].state;t.tagName===`FILL-BOX`?Ge(t):n.contains(`name`)?$e(i):n.contains(`coaIcon`)?s.EmblemsEditor.open(`province`,`provinceCOA${i}`,pack.provinces[i]):n.contains(`icon-star-empty`)?Ke(i):n.contains(`icon-flag-empty`)?qe(i):n.contains(`icon-dot-circled`)?s.BurgsOverview.open({stateId:a}):n.contains(`culturePopulation`)?Xe(i):n.contains(`provinceStability`)?s.StabilityOverview.open(a):n.contains(`provinceEconomy`)?s.EconomyOverview.open(`province`,i):n.contains(`icon-target`)?ve(o(`#provs`).select(`#province${i}`).node(),8):n.contains(`icon-pin`)?Ze(i,n):n.contains(`icon-book`)?s.NotesEditor.open({type:`province`,id:i}):n.contains(`icon-trash-empty`)?Qe(i):(n.contains(`icon-lock`)||n.contains(`icon-lock-open`))&&Tt(i,n)}),i(`provincesBodySection`).addEventListener(`change`,e=>{let t=e.target,n=t.classList,r=t.closest(`.states`);if(!r)return;let i=+r.dataset.id;n.contains(`cultureBase`)&&st(i,r,t.value)})}function J(){Y(),Be(),q.reset()}function ze(){for(let e of X()){if(e.lock)continue;let t=pack.cells.culture[e.center];c.rename(e.i,h.getState(h.getCultureShort(t),t))}q.refresh(),T.draw(`labels`)}function Y(){let{cells:e,provinces:t,burgs:n}=pack;t.forEach(e=>{e.i&&!e.removed&&(e.area=e.rural=e.urban=0,e.burgs=[],(e.burg&&!n[e.burg]||n[e.burg]?.removed)&&(e.burg=0))});for(let r of e.i){let i=e.province[r];i&&(t[i].area+=e.area[r],t[i].rural+=e.pop[r],e.burg[r]&&(t[i].urban+=n[e.burg[r]].population??0,t[i].burgs.push(e.burg[r])))}t.forEach(e=>{e.i&&!e.removed&&!e.burg&&e.burgs.length&&(e.burg=e.burgs[0])})}function Be(){let e=i(`provincesFilterState`);H.stateId!==-1&&!pack.states.some(e=>e.i===H.stateId&&!e.removed)&&(H.stateId=-1),e.options.length=0,e.options.add(new Option(P(`All`),`-1`,!1,H.stateId===-1)),pack.states.filter(e=>e.i&&!e.removed).sort((e,t)=>e.name>t.name?1:-1).forEach(t=>{e.options.add(new Option(t.name,String(t.i),!1,t.i===H.stateId))}),k.set(B,`filters`,H)}function X(){U=m.getAverages(pack.cells.province);let e=pack.provinces.filter(e=>e.i&&!e.removed),t=H.stateId===-1?e:e.filter(e=>e.state===H.stateId),n=H?.search?.toLowerCase().trim();return n&&(t=t.filter(e=>{let t=e.burg?pack.burgs[e.burg]?.name:``,r=pack.states[e.state]?.name;return p.matches(n,e.name,e.tags,[e.formName,t,r])})),ne(B,t,K)}function Ve(e){let t=i(`provincesBodySection`),n=` ${v()}`,r=e.all.reduce((e,t)=>({area:e.area+W(t),population:e.population+G(t),burgs:e.burgs+t.burgs.length}),{area:0,population:0,burgs:0}),a=t.dataset.type===`percentage`,s=e.rows.map(e=>{let t=W(e),i=e.rural*options.map.units.population.scale,s=e.urban*options.map.units.population.scale*options.map.units.population.urbanization.rate,c=G(e),l=F(`${P(`Total population`)}: ${I(c)}`,`${P(`Rural population`)}: ${I(i)}`,`${P(`Urban population`)}: ${I(s)}`),u=pack.states[e.state].name,d=e.burg&&e.burg!==pack.states[e.state].capital,f=o(`#deftemp`).select(`#fog #focusProvince${e.i}`).size();return C.trigger(`provinceCOA${e.i}`,e.coa),`<div class="states" data-id=${e.i}>
      <fill-box data-col="color" fill="${e.color}"></fill-box>
      <input data-col="name" data-tip="${F(P(`Name`),P(`Click to change`))}" class="name pointer" value="${e.name}" readonly />
      <svg data-col="emblem" data-tip="${P(`Edit Emblem`)}" class="coaIcon pointer" viewBox="0 0 200 200"><use href="#provinceCOA${e.i}"></use></svg>
      <input data-col="form" data-tip="${F(P(`Form name`),P(`Click to change`))}" class="name pointer" value="${e.formName}" readonly />
      <div data-col="capital">
        <span data-tip="${F(P(`Province capital`),P(`Click to zoom`))}" class="icon-star-empty pointer ${e.burg?``:`placeholder`}"></span>
        <select data-tip="${F(P(`Province capital`),P(`Click to select from burgs within the state`),P(`No capital means the province is governed from the state capital`))}" class="cultureBase ${e.burgs.length?``:`placeholder`}">${e.burgs.length?Ue(e.burgs,e.burg):``}</select>
      </div>
      <input data-col="state" data-tip="${P(`Province owner`)}" class="provinceOwner" value="${u}" disabled>
      <div data-col="burgs">
        <span data-tip="${P(`Click to overview province burgs`)}" class="icon-dot-circled pointer"></span>
        <span data-tip="${P(`Number of burgs`)}" class="provinceBurgs">${a?`${N(r.burgs?e.burgs.length/r.burgs*100:0)}%`:e.burgs.length}</span>
      </div>
      <div data-col="area">
        <span data-tip="${P(`Province area`)}" class="icon-map-o" style="padding-right: 4px"></span>
        <span data-tip="${P(`Province area`)}" class="biomeArea">${a?`${N(r.area?t/r.area*100:0)}%`:I(t)+n}</span>
      </div>
      <div data-col="population">
        <span data-tip="${l}" class="icon-male"></span>
        <span data-tip="${l}" class="culturePopulation">${a?`${N(r.population?c/r.population*100:0)}%`:I(c)}</span>
      </div>
      ${Fe(e)}
      ${U[e.i]===void 0?`<div class="placeholder" data-col="development"></div>`:`<div data-tip="${oe(U[e.i])}" data-col="development">${N(U[e.i])}</div>`}
      <div data-col="tags">
        <input
          data-tip="${P(`Tags (comma-separated)`)}"
          class="provinceTags"
          value="${p.format(e.tags)}"
          placeholder="${P(`Tags`)}"
          autocorrect="off"
          spellcheck="false"
        />
      </div>
      ${re(P(`Edit free text notes (legend)`))}
      <span data-col="independence" data-tip="${P(`Declare province independence (turn non-capital province with burgs into a new state)`)}" class="icon-flag-empty ${d?``:`placeholder`}"></span>
      <span data-col="locate" data-tip="${P(`Locate on map`)}" class="icon-target"></span>
      <span data-col="focus" data-tip="${P(`Toggle province focus`)}" class="icon-pin ${f?``:` inactive`}"></span>
      <span data-col="lock" data-tip="${P(`Lock`)}" class="icon-lock${e.lock?``:`-open`}"></span>
      <span data-col="remove" data-tip="${P(`Remove`)}" class="icon-trash-empty"></span>
    </div>`}).join(``);t.querySelectorAll(`:scope > .states`).forEach(e=>{e.remove()}),t.insertAdjacentHTML(`beforeend`,s),i(`provincesFooterNumber`).innerHTML=String(e.all.length),i(`provincesFooterBurgs`).innerHTML=String(r.burgs),i(`provincesFooterArea`).innerHTML=e.all.length?I(r.area/e.all.length)+n:`0${n}`,i(`provincesFooterPopulation`).innerHTML=e.all.length?I(r.population/e.all.length):`0`,i(`provincesFooterArea`).dataset.area=String(r.area),i(`provincesFooterPopulation`).dataset.population=String(r.population),ce(i(`provincesFooter`),e,q.goto),t.querySelectorAll(`div.states`).forEach(e=>{e.addEventListener(`mouseenter`,We),e.addEventListener(`mouseleave`,Z)}),t.querySelectorAll(`input.provinceTags`).forEach(e=>{e.addEventListener(`change`,He)}),O.update(B,{width:`fit-content`,position:V})}function He(){let e=this.closest(`.states`),t=Number(e.dataset.id),n=pack.provinces[t];n&&(p.set(n,this.value),this.value=p.format(n.tags),H.search&&q.refresh())}function Ue(e,t){let n=``;return e.forEach(e=>{n+=`<option ${e===t?`selected`:``} value="${e}">${pack.burgs[e].name}</option>`}),n}function We(e){let t=+e.target.dataset.id,r=i(`provincesBodySection`).querySelector(`div[data-id='${t}']`);if(r&&r.classList.add(`active`),!T.isOn(`provinces`)||options.app.mode)return;let a=n().duration(2e3).ease(y);o(`#provs`).select(`#province${t}`).raise().transition(a).attr(`stroke-width`,2.5).attr(`stroke`,`#d0240f`)}function Z(e){let t=(e?.target)?.dataset?.id,n=t?+t:null;if(n){let e=i(`provincesBodySection`).querySelector(`div[data-id='${n}']`);e&&e.classList.remove(`active`)}!T.isOn(`provinces`)||!n||o(`#provs`).select(`#province${n}`).transition().attr(`stroke-width`,null).attr(`stroke`,null),o(`#debug`).selectAll(`.highlight`).remove()}function Ge(e){let t=e.getAttribute(`fill`),n=+e.closest(`.states`).dataset.id;s.ColorPicker.open(t,t=>{e.fill=t,pack.provinces[n].color=t,T.draw(`provinces`)})}function Ke(e){let t=pack.provinces[e].burg,{x:n,y:r}=pack.burgs[t];ye(n,r,8,2e3)}function qe(e){O.confirm({title:P(`Declare independence`),message:`${P(`Are you sure you want to declare province independence?`)}<br>${P(`It will turn province into a new state`)}`,confirm:P(`Declare`),onConfirm:()=>{let t=Je(e);if(!t)return;let[n,r]=t;Ye([n],[r])}})}function Je(e){let t=pack.provinces[e].state;try{let n=c.declareIndependence(e);return b(`province`,e),[t,n]}catch(e){j(L(e),!1,`error`)}}function Ye(e,t){let n=M([...e,...t]);T.hide(`provinces`),T.show(`states`,`borders`),T.draw(`burgIcons`,`labels`),S(n.map(e=>[`state`,e])),x(),O.closeAll(),s.StatesEditor.open()}function Xe(e){let t=pack.provinces[e];if(!pack.cells.i.filter(t=>pack.cells.province[t]===e).length){j(P(`No cells, cannot change population`),!1,`error`);return}let n=N(t.rural*options.map.units.population.scale),r=N(t.urban*options.map.units.population.scale*options.map.units.population.urbanization.rate),a=n+r,o=e=>Number(e).toLocaleString();O.message({message:` ${P(`Rural`)}: <input type="number" min="0" step="1" id="ruralPop" value=${n} style="width:6em" /> ${P(`Urban`)}:
    <input type="number" min="0" step="1" id="urbanPop" value=${r} style="width:6em" ${t.burgs.length?``:`disabled`} />
    <p>${P(`Total population`)}: ${o(a)} ⇒ <span id="totalPop">${o(a)}</span> (<span id="totalPopPerc">100</span>%)</p>`,title:P(`Change province population`),width:`24em`,buttons:[{label:P(`Apply`),onClick:()=>{d()}},{label:P(`Cancel`)}]});let s=i(`ruralPop`),l=i(`urbanPop`),u=()=>{let e=s.valueAsNumber+l.valueAsNumber;Number.isNaN(e)||(i(`totalPop`).innerHTML=o(e),i(`totalPopPerc`).innerHTML=String(N(e/a*100)))};s.oninput=()=>u(),l.oninput=()=>u();function d(){try{c.setPopulation(e,+s.value||0,+l.value||0)}catch(e){j(L(e),!1,`error`);return}T.draw(`population`),J()}}function Ze(e,t){let n=o(`#provs`).select(`#province${e}`).attr(`d`),r=`focusProvince${e}`;t.contains(`inactive`)?ee(r,n):x(r),t.toggle(`inactive`)}function Qe(e){O.confirm({title:P(`Remove`),message:`${P(`Are you sure you want to remove the province?`)}<br>${P(`This action cannot be reverted`)}`,confirm:P(`Remove`),onConfirm:()=>{c.remove(e),ie(),x(`focusProvince${e}`),b(`province`,e);let t=o(`#provs`).select(`#provincesBody`);t.select(`#province${e}`).remove(),t.select(`#province-gap${e}`).remove(),T.draw(`borders`),T.draw(`labels`),J()}})}function $e(e){et();let t=pack.provinces[e];i(`provinceNameEditor`).dataset.province=String(e),i(`provinceNameEditorShort`).value=t.name,a(i(`provinceNameEditorSelectForm`),t.formName),i(`provinceNameEditorFull`).value=t.fullName;let n=pack.cells.culture[t.center];i(`provinceCultureDisplay`).textContent=pack.cultures[n].name,O.open(`provinceNameEditor`,{title:P(`Change province name`),buttons:[{label:P(`Apply`),onClick:()=>{ot(t),O.close(`provinceNameEditor`)}},{label:P(`Cancel`),onClick:()=>{O.close(`provinceNameEditor`)}}],position:{my:`center`,at:`center`,of:`svg`},onClose:tt})}function et(){O.destroy(`provinceNameEditor`);let e=`<div id="provinceNameEditor" class="dialog" data-province="0">
      <div>
        <div data-tip="${P(`Short name`)}" class="label">${P(`Short name`)}:</div>
        <input
          id="provinceNameEditorShort"
          data-tip="${P(`Type to change the short name`)}"
          autocorrect="off"
          spellcheck="false"
          style="width: 11em"
        />
        <span id="provinceNameEditorShortSpeak" data-tip="${F(P(`Speak the name`),P(`You can change voice and language in options`))}" class="speaker">🔊</span>
        <span
          id="provinceNameEditorShortCulture"
          data-tip="${P(`Generate culture-specific name`)}"
          class="icon-book pointer"
        ></span>
        <span id="provinceNameEditorShortRandom" data-tip="${P(`Generate random name`)}" class="icon-globe pointer"></span>
      </div>
      <div data-tip="${P(`Select form name`)}">
        <div data-tip="${P(`Form name`)}" class="label">${P(`Form name`)}:</div>
        <select id="provinceNameEditorSelectForm" style="display: inline-block; width: 11em; height: 1.645em">
          <option value="">${P(`blank`)}</option>
          <option value="Area">${P(`Area`)}</option>
          <option value="Autonomy">${P(`Autonomy`)}</option>
          <option value="Barony">${P(`Barony`)}</option>
          <option value="Canton">${P(`Canton`)}</option>
          <option value="Captaincy">${P(`Captaincy`)}</option>
          <option value="Chiefdom">${P(`Chiefdom`)}</option>
          <option value="Clan">${P(`Clan`)}</option>
          <option value="Colony">${P(`Colony`)}</option>
          <option value="Council">${P(`Council`)}</option>
          <option value="County">${P(`County`)}</option>
          <option value="Deanery">${P(`Deanery`)}</option>
          <option value="Department">${P(`Department`)}</option>
          <option value="Dependency">${P(`Dependency`)}</option>
          <option value="Diaconate">${P(`Diaconate`)}</option>
          <option value="District">${P(`District`)}</option>
          <option value="Earldom">${P(`Earldom`)}</option>
          <option value="Governorate">${P(`Governorate`)}</option>
          <option value="Island">${P(`Island`)}</option>
          <option value="Islands">${P(`Islands`)}</option>
          <option value="Land">${P(`Land`)}</option>
          <option value="Landgrave">${P(`Landgrave`)}</option>
          <option value="Mandate">${P(`Mandate`)}</option>
          <option value="Margrave">${P(`Margrave`)}</option>
          <option value="Municipality">${P(`Municipality`)}</option>
          <option value="Occupation zone">${P(`Occupation zone`)}</option>
          <option value="Parish">${P(`Parish`)}</option>
          <option value="Prefecture">${P(`Prefecture`)}</option>
          <option value="Province">${P(`Province`)}</option>
          <option value="Region">${P(`Region`)}</option>
          <option value="Republic">${P(`Republic`)}</option>
          <option value="Reservation">${P(`Reservation`)}</option>
          <option value="Seneschalty">${P(`Seneschalty`)}</option>
          <option value="Shire">${P(`Shire`)}</option>
          <option value="State">${P(`State`)}</option>
          <option value="Territory">${P(`Territory`)}</option>
          <option value="Tribe">${P(`Tribe`)}</option>
        </select>
        <input
          id="provinceNameEditorCustomForm"
          placeholder="${P(`Enter custom form name`)}"
          data-tip="${P(`Create custom province form name`)}"
          style="display: none; width: 11em"
        />
        <span
          id="provinceNameEditorAddForm"
          data-tip="${P(`Click to add custom province form name to the list`)}"
          class="icon-plus pointer"
        ></span>
      </div>
      <div>
        <div data-tip="${P(`Full name`)}" class="label">${P(`Full name`)}:</div>
        <input
          id="provinceNameEditorFull"
          data-tip="${P(`Type to change the full name`)}"
          autocorrect="off"
          spellcheck="false"
          style="width: 11em"
        />
        <span id="provinceNameEditorFullSpeak" data-tip="${F(P(`Speak the name`),P(`You can change voice and language in options`))}" class="speaker">🔊</span>
        <span
          id="provinceNameEditorFullRegenerate"
          data-tip="${P(`Click to re-generate full name`)}"
          class="icon-arrows-cw pointer"
        ></span>
      </div>
      <div
        id="provinceCultureName"
        data-tip="${P(`Dominant culture in the province. This defines culture-based naming. Can be changed via the Cultures Editor`)}"
        style="margin-top: 0.2em"
      >
        ${P(`Dominant culture`)}:&nbsp;<span id="provinceCultureDisplay"></span>
      </div>
    </div>`;i(`dialogs`).insertAdjacentHTML(`beforeend`,e),i(`provinceNameEditorShortCulture`).addEventListener(`click`,nt),i(`provinceNameEditorShortRandom`).addEventListener(`click`,rt),i(`provinceNameEditorShortSpeak`).addEventListener(`click`,()=>D(i(`provinceNameEditorShort`).value)),i(`provinceNameEditorAddForm`).addEventListener(`click`,it),i(`provinceNameEditorFullRegenerate`).addEventListener(`click`,at),i(`provinceNameEditorFullSpeak`).addEventListener(`click`,()=>D(i(`provinceNameEditorFull`).value))}function tt(){O.destroy(`provinceNameEditor`)}function nt(){let e=+i(`provinceNameEditor`).dataset.province,t=pack.cells.culture[pack.provinces[e].center],n=h.getState(h.getCultureShort(t),t);i(`provinceNameEditorShort`).value=n}function rt(){let e=g(h.nameBases.length-1),t=h.getState(h.getBase(e),void 0,e);i(`provinceNameEditorShort`).value=t}function it(){let e=i(`provinceNameEditorCustomForm`),t=i(`provinceNameEditorSelectForm`),n=e.value,r=e.style.display===`inline-block`;e.style.display=r?`none`:`inline-block`,t.style.display=r?`inline-block`:`none`,r&&a(t,n)}function at(){let e=i(`provinceNameEditorShort`).value,t=i(`provinceNameEditorSelectForm`).value,n=()=>t?!e&&t?`The ${t}`:`${e} ${t}`:e;i(`provinceNameEditorFull`).value=n()}function ot(e){let t=i(`provinceNameEditorShort`).value.trim(),n=i(`provinceNameEditorSelectForm`).value,r=i(`provinceNameEditorFull`).value.trim(),a=e.fullName;t&&t!==e.name&&c.rename(e.i,t),n!==(e.formName??``)&&c.setForm(e.i,n),r&&r!==a&&c.setFullName(e.i,r),T.draw(`provinces`),T.draw(`labels`),J()}function st(e,t,n){c.setCapital(e,+n),t.dataset.capital=pack.burgs[+n].name}function ct(){let e=i(`provincesBodySection`);e.dataset.type=e.dataset.type===`absolute`?`percentage`:`absolute`,q.refresh()}function lt(){Y();let t=t=>!t.i||t.removed||t.color?.[0]!==`#`?`#666`:String(e(t.color).darker()),n=pack.states.map(e=>({id:e.i,state:e.i?0:null,color:t(e)})),a=pack.provinces.filter(e=>e.i&&!e.removed).map(e=>({id:e.i+n.length-1,i:e.i,state:e.state,color:e.color,name:e.name,fullName:e.fullName,area:e.area,urban:e.urban,rural:e.rural})),s=[...n,...a],c=Te().id(e=>String(e.id)).parentId(e=>e.state==null?null:String(e.state))(s).sum(e=>e.area??0),l=+i(`uiSize`).value,u=300+300*l,d=90+90*l,f={top:10,right:10,bottom:0,left:10},p=u-f.left-f.right,m=d-f.top-f.bottom,h=Me().size([p,m]).padding(2),g=document.createElement(`div`);g.innerHTML=`<select id="provincesTreeType" style="display:block; margin-left:13px; font-size:11px">
    <option value="area" selected>${P(`Area`)}</option>
    <option value="population">${P(`Total population`)}</option>
    <option value="rural">${P(`Rural population`)}</option>
    <option value="urban">${P(`Urban population`)}</option>
  </select><div id='provinceInfo' class='chartInfo'>&#8205;</div>`;let y=o(g).insert(`svg`,`#provinceInfo`).attr(`id`,`provincesTree`).attr(`width`,u).attr(`height`,d).attr(`font-size`,`10px`).append(`g`).attr(`transform`,`translate(10, 0)`);g.querySelector(`#provincesTreeType`).addEventListener(`change`,w);let b=y.selectAll(`g`).data(h(c).leaves()).enter().append(`g`).attr(`data-id`,e=>e.data.i??null).on(`mouseenter`,(e,t)=>x(e,t)).on(`mouseleave`,e=>S(e));function x(e,t){o(e.currentTarget).select(`rect`).classed(`selected`,!0);let n=t.data.fullName,r=pack.states[t.data.state].fullName,a=`${_(t.data.area)} ${v()}`,s=N(t.data.rural*options.map.units.population.scale),c=N(t.data.urban*options.map.units.population.scale*options.map.units.population.urbanization.rate),l=i(`provincesTreeType`).value,u=l===`area`?`${P(`Area`)}: ${a}`:l===`rural`?`${P(`Rural population`)}: ${I(s)}`:l===`urban`?`${P(`Urban population`)}: ${I(c)}`:`${P(`Population`)}: ${I(s+c)}`;i(`provinceInfo`).innerHTML=`${n}. ${r}. ${u}`,We(e)}function S(e){Z(e),r(`provinceInfo`)&&(i(`provinceInfo`).innerHTML=`&#8205;`,o(e.currentTarget).select(`rect`).classed(`selected`,!1))}b.append(`rect`).attr(`stroke`,e=>e.parent.data.color??null).attr(`stroke-width`,1).attr(`fill`,e=>e.data.color??null).attr(`x`,e=>e.x0).attr(`y`,e=>e.y0).attr(`width`,e=>e.x1-e.x0).attr(`height`,e=>e.y1-e.y0),b.append(`text`).attr(`text-rendering`,`optimizeSpeed`).attr(`dx`,`.2em`).attr(`dy`,`1em`).attr(`x`,e=>e.x0).attr(`y`,e=>e.y0);function C(){b.select(`text`).each(function(e){this.innerHTML=e.data.name??``;let t=this.getBBox();t.y+t.height>e.y1+1&&(this.innerHTML=``);for(let n=0;n<15&&t.width>0&&t.x+t.width>e.x1;n++){if(this.innerHTML.length<3){this.innerHTML=``;break}this.innerHTML=`${this.innerHTML.slice(0,-2)}…`,t=this.getBBox()}})}function w(){let e=this.value===`area`?e=>e.area??0:this.value===`rural`?e=>e.rural??0:this.value===`urban`?e=>e.urban??0:e=>(e.rural??0)+(e.urban??0);c.sum(e),b.data(h(c).leaves()),b.select(`rect`).transition().duration(1500).attr(`x`,e=>e.x0).attr(`y`,e=>e.y0).attr(`width`,e=>e.x1-e.x0).attr(`height`,e=>e.y1-e.y0),b.select(`text`).transition().duration(1500).attr(`x`,e=>e.x0).attr(`y`,e=>e.y0),setTimeout(C,2e3)}O.message({message:g,title:P(`Provinces chart`),width:`fit-content`,position:{my:`left bottom`,at:`left+10 bottom-10`,of:`svg`},buttons:[]}),C()}function ut(){O.confirm({title:P(`Release provinces`),message:`${P(`Are you sure you want to release all provinces?`)}<br>${P(`It will turn all separable provinces into independent states.`)}<br>${P(`Capital province and provinces without any burgs will state as they are`)}`,confirm:P(`Release`),onConfirm:()=>{let e=[],t=[];X().forEach(n=>{if(!n.burg||n.burg===pack.states[n.state].capital||n.burgs.some(e=>pack.burgs[e].capital))return;let r=Je(n.i);r&&(e.push(r[0]),t.push(r[1]))}),Ye(M(e),t)}})}function dt(){T.show(`provinces`,`borders`),s.PaintEditor.open({title:P(`Paint Provinces`),parentDialogId:B,onClose:Ie,items:X().map(e=>({id:e.i,name:e.name,color:e.color||`#ffffff`})),getValue:e=>pack.cells.province[e],filterCell:(e,t,n)=>!Ce(e,pack)||!pack.cells.state[e]||pack.cells.state[e]!==pack.provinces[n].state?!1:!t||e!==pack.provinces[t].center||(j(P(`Province center cannot be assigned to a different region. Please remove the province first`),!1,`error`),!1),dontOverrideControl:!0,onApply:ft})}function ft(e){for(let[t,n]of xe(e))c.setCells(t,n);T.draw(`borders`,`provinces`),T.draw(`labels`),r(B)&&J()}function pt(){this.classList.contains(`pressed`)?Q():(options.app.mode=`addProvince`,this.classList.add(`pressed`),j(P(`Click on the map to place a new province center`),!0),o(`#viewbox`).style(`cursor`,`crosshair`).on(`click`,mt),i(`provincesBodySection`).querySelectorAll(`div > input, select, span, svg`).forEach(e=>{e.style.pointerEvents=`none`}))}function mt(e){let[n,r]=t(e,this),a;try{a=c.add(n,r)}catch(e){j(L(e),!1,`error`);return}e.shiftKey===!1&&Q(),w(`province`,a),T.draw(`borders`,`provinces`,`labels`),Y(),H.stateId=pack.provinces[a].state,k.set(B,`filters`,H),i(`provincesFilterState`).value=String(H.stateId),q.reset()}function Q(){options.app.mode=null,te(),be(),i(`provincesBodySection`).querySelectorAll(`div > input, select, span, svg`).forEach(e=>{e.style.removeProperty(`pointer-events`)});let e=i(`provincesAdd`);e.classList.contains(`pressed`)&&e.classList.remove(`pressed`)}function ht(){let t=H.stateId;pack.provinces.forEach(n=>{if(!n||n.removed||t!==-1&&n.state!==t)return;let r=pack.states[n.state].color,i=Se();n.color=r[0]===`#`?e(d(r,i)(.2)).hex():i}),T.draw(`provinces`),q.refresh()}function gt(){let e=options.map.units.area.unit===`square`?`${options.map.units.distance.unit}2`:options.map.units.area.unit,{scale:t,urbanization:n}=options.map.units.population,r=[...Ne,...me].map(t=>t===`Area`?`Area ${e}`:t),i=X().map(e=>[e.i,e.name,e.fullName,e.formName,pack.states[e.state].name,e.color,e.burg?pack.burgs[e.burg].name:``,W(e),G(e),Math.round(e.rural*t),Math.round(e.urban*t*n.rate),e.burgs.length,p.format(e.tags),...he(e.i)]);E.download(`Provinces`,r,i)}function _t(){O.confirm({title:P(`Remove all provinces`),message:`${P(`Are you sure you want to remove all provinces?`)}<br>${P(`This action cannot be reverted`)}`,confirm:P(`Remove`),onConfirm:()=>{pack.provinces.forEach(e=>{e.i&&b(`province`,e.i)}),pack.provinces=[0],pack.cells.province=new Uint16Array(pack.cells.i.length),pack.states.forEach(e=>{e.provinces=[]}),x(),T.draw(`borders`),o(`#provs`).select(`#provincesBody`).remove(),T.hide(`provinces`),T.draw(`labels`),q.reset()}})}function vt(){options.app.mode===`addProvince`&&Q(),xt.exit(),s.ColorPicker.close(),U=[],O.destroy(`provincesEditor`)}function yt(){let e=H.stateId;if(e===-1){O.message({message:P(`Please select a specific state from the filter to merge provinces within that state.`),title:P(`Merge Provinces`)});return}let t=pack.provinces.filter(t=>t.i&&!t.removed&&t.state===e);if(t.length<2){O.message({message:P(`Not enough provinces in the selected state to merge.`),title:P(`Merge Provinces`)});return}let n=t.map(e=>`
    <div data-id="${e.i}" data-tip="${e.fullName||e.name}" style="cursor:default">
      <input type="radio" name="rulingProvince" value="${e.i}" />
      <input id="selectProvince${e.i}" class="checkbox" type="checkbox" name="provincesToMerge" value="${e.i}" />
      <label for="selectProvince${e.i}" class="checkbox-label"><fill-box fill="${e.color}" disabled></fill-box>${$(e.i)}${e.name}</label>
    </div>
  `).join(``);O.message({id:`mergeProvinces`,message:`
    <form id='mergeProvincesForm' style="overflow: hidden; display: flex; flex-direction: column; gap: 1em;">
      <p style="margin:0">
        ${P(`Check the checkbox next to each province you want to merge. Use the radio button to pick the primary province that will absorb all others. Hover over a row to highlight the province on the map.`)}
      </p>
      <main style='display: grid; grid-template-columns: 1fr 1fr; gap: .3em;'>
        ${n}
      </main>
    </form>
  `,width:600,title:P(`Merge Provinces`),onClose:()=>Z(),buttons:[{label:P(`Merge`),onClick:()=>{let e=new FormData(i(`mergeProvincesForm`)),t=Number(e.get(`rulingProvince`));if(!t)return j(P(`Please select a province to merge into`),!1,`error`),!1;let n=e.getAll(`provincesToMerge`).map(Number).filter(e=>e!==t);return n.length?(bt(n,t,()=>O.close(`mergeProvinces`)),!1):(j(P(`Please select several provinces to merge`),!1,`error`),!1)}},{label:P(`Cancel`)}]}),i(`mergeProvincesForm`).querySelectorAll(`div[data-id]`).forEach(e=>{e.addEventListener(`mouseenter`,St),e.addEventListener(`mouseleave`,Z)})}var $=e=>`<svg class="coaIcon" viewBox="0 0 200 200"><use href="#provinceCOA${e}"></use></svg>`;function bt(e,t,n){O.confirm({title:P(`Merge Provinces`),message:`
      <p>${P(`The following provinces will be removed`)}: ${e.map(e=>`${$(e)}${pack.provinces[e].name}`).join(`, `)}.</p>
      <p>${P(`Removed provinces data (burgs and cells) will be assigned to {{- province}}.`,{province:`${$(t)}${pack.provinces[t].name}`})}</p>
      <p>${F(P(`Are you sure you want to merge provinces?`),P(`This action cannot be reverted`))}</p>`,confirm:P(`Merge`),onConfirm:()=>{wt(e,t),n?.()}})}var xt=ge({buttonId:`provincesAnnex`,bodySectionId:`provincesBodySection`,tips:{start:F(P(`Click the province that annexes, then the provinces it absorbs`),P(`Hold Shift to keep annexing`)),pickLand:P(`Click on a land cell to pick a province`),nothingHere:P(`There is no province here`),annexing:e=>F(P(`Annexing into {{province}}`,{province:e}),P(`Click the provinces to annex`),P(`Hold Shift to keep annexing`)),isParent:e=>P(`{{province}} is the annexing province`,{province:e})},ownerOf:e=>pack.cells.province[e],colorOf:e=>pack.provinces[e].color,nameOf:e=>pack.provinces[e].name,rejectReason:(e,t)=>pack.provinces[t].state===pack.provinces[e].state?void 0:P(`{{province}} belongs to another state. Merge states first, or pick a province of {{state}}`,{province:pack.provinces[t].name,state:pack.states[pack.provinces[e].state].name}),commit:(e,t)=>bt(t,e)});function St(e){if(!T.isOn(`provinces`))return;let t=+e.currentTarget.dataset.id;if(!t)return;let n=o(`#provs`).select(`#province${t}`).attr(`d`);n&&(Z(e),_e(n))}function Ct(e){x(`focusProvince${e}`),b(`province`,e)}function wt(e,t){for(let n of e)n!==t&&Ct(n);c.merge(t,e),Y(),T.draw(`provinces`,`borders`,`labels`),x(),o(`#debug`).selectAll(`.highlight`).remove(),J()}function Tt(e,t){c.setLocked(e,!pack.provinces[e].lock),t.toggle(`icon-lock-open`),t.toggle(`icon-lock`)}async function Et(e){let{scale:t,urbanization:n}=options.map.units.population,r=e=>{let t=pack.provinces[e];return e&&t&&!t.removed?t:void 0},i=[`Province`,`Full Name`,`Form`,`Tags`];await s.CsvUpload.update(e,[...Ne,...me],{find:r,units:[`Area`],text:i},(e,i)=>{let a=r(e),o=a.fullName;i.apply(`Province`,t=>c.rename(e,t),a.name),i.apply(`Form`,t=>c.setForm(e,t),a.formName),i.apply(`Full Name`,t=>c.setFullName(e,t),o),i.apply(`Color`,t=>c.recolor(e,t),a.color),i.apply(`State`,t=>c.setState(e,E.byName(pack.states,t).i),pack.states[a.state].name);let s=t=>pack.cells.province[t.cell]===e;i.apply(`Capital`,t=>c.setCapital(e,E.byName(pack.burgs,t,s).i),pack.burgs[a.burg]?.name),i.assign(`Tags`,e=>p.set(a,e),p.format(a.tags)),i.population([(a.rural??0)*t,(a.urban??0)*t*n.rate],(t,n)=>c.setPopulation(e,t,n))})&&(T.draw(`states`,`provinces`,`borders`,`burgIcons`,`labels`,`emblems`,`population`),J())}var Dt={open:Ie,showChart:lt};export{Dt as ProvincesEditor};