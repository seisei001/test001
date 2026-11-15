import{d as e,i as t,r as n,z as r}from"./node-utils-Ds1sVy-v.js";import{t as i}from"./controllers-Dbv1ZRTV.js";import{t as a}from"./relief-pool-editor-DCeRKySi.js";import{i as o,t as s}from"./relief-previews-DRuGemVT.js";import{t as c}from"./biomes-generator-BQuuN3NH.js";import{r as l}from"./military-generator-CVth4JoO.js";import{Lt as u,v as d}from"./options-model-CrstL1Qd.js";import{a as f,o as p}from"./units-CYDspnRH.js";import{Nt as m,n as h,t as g}from"./layers-DjWzCbYN.js";import{t as _}from"./csv-BoSHm6Vn.js";import{t as v}from"./dialog-BkeQgjla.js";import{c as y,d as ee,s as b}from"./app-DCKsq5m8.js";import{t as x}from"./highlighting-C3iNJ2tq.js";import{a as S,i as C,n as w,r as T}from"./table-DPmN0izx.js";import{o as E}from"./tooltips-BVQbACdS.js";import{f as te,v as D}from"./notices-6lBE5Kkn.js";import{s as O}from"./color-utils-OCVlKvQa.js";import{a as ne}from"./pack-generator-DTsfQ82D.js";import{O as k,a as A,i as j,k as M}from"./index-sNerCVjG.js";var N=`biomesEditor`,P=[`Id`,`Biome`,`Color`,`Habitability`,`Development`,`Cells`,`Area`,`Population`],F=`Biomes`,I={my:`right top`,at:`right-10 top+10`,of:`svg`},L=[],R=[{key:`name`,label:A(`Biome`),width:`15em`,permanent:!0,sortBy:e=>e.name,sortType:`alpha`},{key:`habitability`,label:A(`Habitability`),width:`6.5em`,sortBy:e=>e.habitability},{key:`development`,label:A(`Development`),width:`7em`,hidden:!0,tip:A(`What the biome adds to its people's development, in points`),sortBy:e=>e.development??0},{key:`relief`,label:A(`Relief`),width:`6.5em`,sortBy:e=>e.iconsDensity},{key:`cells`,label:A(`Cells`),width:`5em`,sortBy:e=>L[e.i]?.cells??0,defaultSort:`desc`},{key:`area`,label:A(`Area`),width:`7em`,mobileHidden:!0,sortBy:e=>L[e.i]?.area??0},{key:`population`,label:A(`Population`),width:`6.2em`,mobileHidden:!0,sortBy:e=>{let t=L[e.i];return t?t.rural+t.urban:0}},{key:`note`,width:`1.1em`},{key:`wiki`,width:`1.1em`},{key:`remove`,width:`1.4em`,permanent:!0}],z=T({dialogId:N,getData:()=>y(N,pack.biomes.filter(e=>e.i&&!e.removed),R),onUpdate:e=>G(e,L)});function B(){options.app.mode||(v.closeAll(`#${N}, .stable`),g.show(`biomes`),g.hide(`states`,`cultures`),g.hide(`religions`,`provinces`),V(),L=W(),z.reset(),v.open(N,{title:A(`Biomes Editor`),onClose:pe,position:I}))}function V(){v.destroy(N);let e=`<div id="${N}" class="dialog stable editorDialog">
      ${C({dialogId:N,columns:R})}
      <div id="biomesBody" class="table" data-type="absolute"></div>
      <div id="biomesFooter" class="totalLine">
        <div data-tip="${A(`Number of land biomes`)}" style="margin-left: 12px">
          ${A(`Biomes`)}:&nbsp;<span id="biomesFooterBiomes">0</span>
        </div>
        <div data-col="cells" data-tip="${A(`Number of land cells`)}" style="margin-left: 12px">
          ${A(`Cells`)}:&nbsp;<span id="biomesFooterCells">0</span>
        </div>
        <div data-col="area" data-tip="${A(`Total land area`)}" style="margin-left: 12px">
          ${A(`Land area`)}:&nbsp;<span id="biomesFooterArea">0</span>
        </div>
        <div data-col="population" data-tip="${A(`Total population`)}" style="margin-left: 12px">
          ${A(`Population`)}:&nbsp;<span id="biomesFooterPopulation">0</span>
        </div>
      </div>
      <div id="biomesBottom">
        <button id="biomesEditorRefresh" data-tip="${A(`Refresh`)}" class="icon-cw"></button>
        <button id="biomesEditStyle" data-tip="${A(`Edit style in Style Editor`)}" class="icon-adjust"></button>
        <button id="biomesLegend" data-tip="${A(`Toggle Legend box`)}" class="icon-list-bullet"></button>
        <button
          id="biomesPercentage"
          data-tip="${A(`Toggle percentage / absolute values views`)}"
          class="icon-percent"
        ></button>
        <button
          id="biomesManually"
          data-tip="${A(`Manually re-assign biomes to not follow the default moisture/temperature pattern`)}"
          class="icon-brush"
        ></button>
        <button id="biomesReliefRules" data-tip="${A(`Edit the relief rules: hills, mountains and other relief placed by elevation`)}" class="icon-mountain"></button>
        <button id="biomesAdd" data-tip="${A(`Add`)}" class="icon-plus"></button>
        <button
          id="biomesRestore"
          data-tip="${A(`Restore the defaults and re-define biomes based on current moisture and temperature`)}"
          class="icon-history"
        ></button>
        <button
          id="biomesExport"
          data-tip="${A(`Save data as a CSV file`)}"
          class="icon-download"
        ></button>
        <button id="biomesImport" data-tip="${A(`Upload data from a CSV file`)}" class="icon-upload"></button>
      </div>
    </div>`;n(`dialogs`).insertAdjacentHTML(`beforeend`,e),w({dialogId:N,columns:R,onUpdate:()=>v.update(N,{width:`fit-content`,position:I})}),n(`biomesEditorRefresh`).addEventListener(`click`,H),n(`biomesEditStyle`).addEventListener(`click`,()=>void i.StyleEditor.open(`biomes`)),n(`biomesLegend`).addEventListener(`click`,se),n(`biomesPercentage`).addEventListener(`click`,Z),n(`biomesManually`).addEventListener(`click`,ue),n(`biomesRestore`).addEventListener(`click`,fe),n(`biomesReliefRules`).addEventListener(`click`,()=>void i.ReliefRulesEditor.open()),n(`biomesAdd`).addEventListener(`click`,ce),n(`biomesExport`).addEventListener(`click`,Q),n(`biomesImport`).addEventListener(`click`,()=>_.pick(he)),b(N,z.reset),x(N,({cellId:e})=>e&&pack.cells.biome[e]),n(`biomesBody`).addEventListener(`click`,e=>{let t=e.target,n=t.classList;t.tagName===`FILL-BOX`?re(t):n.contains(`icon-book`)?ae(t):n.contains(`icon-info-circled`)?oe(t):n.contains(`icon-trash-empty`)?le(t):t.closest(`.biomeRelief`)&&q(t)}),n(`biomesBody`).addEventListener(`change`,e=>{let t=e.target,n=t.classList;n.contains(`biomeName`)?X(t):n.contains(`biomeHabitability`)?ie(t):n.contains(`biomeDevelopment`)&&me(t)})}function H(){L=W(),z.refresh()}function U(e=pack){let{cells:t}=e,n=e.biomes.map(()=>({cells:0,area:0,rural:0,urban:0}));for(let r of t.i){if(t.h[r]<20)continue;let i=n[t.biome[r]];i.cells++,i.area+=t.area[r],i.rural+=t.pop[r];let a=t.burg[r]?e.burgs[t.burg[r]]:null;a&&(i.urban+=a.population??0)}return n}function W(){return U(pack)}function G(e,t){let r=` ${p()}`,i=``,a=0,o=0;for(let n of e.rows){let{i:e,name:a,color:o,habitability:s}=n,{cells:c,area:l,rural:u,urban:d}=t[e],p=f(l),m=u*options.map.units.population.scale,h=d*options.map.units.population.scale*options.map.units.population.urbanization.rate,g=k(m+h),_=j(`${A(`Total population`)}: ${M(g)}`,`${A(`Rural population`)}: ${M(m)}`,`${A(`Urban population`)}: ${M(h)}`);i+=`
      <div
        class="states biomes"
        data-id="${e}"
        data-name="${a}"
        data-habitability="${s}"
        data-cells=${c}
        data-area=${p}
        data-population=${g}
        data-color=${o}
      >
        <div data-col="name">
          <fill-box fill="${o}"></fill-box>
          <input data-tip="${j(A(`Name`),A(`Click and type to change`))}" class="biomeName" value="${a}" autocorrect="off" spellcheck="false" />
        </div>
        <div data-col="habitability" class="hide">
          <span data-tip="${A(`Biome habitability percent`)}">%</span>
          <input data-tip="${j(A(`Biome habitability percent`),A(`Click and type to change`))}" type="number" min="0" max="9999" class="biomeHabitability" value=${s} />
        </div>
        <div data-col="development" class="hide">
          <input data-tip="${j(A(`What the biome adds to its people's development, in points, negative for harsh lands`),A(`Regenerate development in the Development Editor to apply`))}" type="number" min="-50" max="50" step="1" class="biomeDevelopment" value=${n.development??0} />
        </div>
        <div data-col="relief" class="hide">${K(n)}</div>
        <div data-col="cells" class="hide"><span data-tip="${A(`Number of cells`)}" class="icon-check-empty"></span><span data-tip="${A(`Number of cells`)}" class="biomeCells">${c}</span></div>
        <div data-col="area" class="hide"><span data-tip="${A(`Biome area`)}" class="icon-map-o" style="padding-right: 2px"></span><span data-tip="${A(`Biome area`)}" class="biomeArea">${M(p)+r}</span></div>
        <div data-col="population" class="hide"><span data-tip="${_}" class="icon-male"></span><span data-tip="${_}" class="biomePopulation">${M(g)}</span></div>
        ${ee(A(`Edit free text notes (legend)`))}
        <span data-col="wiki" data-tip="${A(`Open Wikipedia article about the biome`)}" class="icon-info-circled pointer"></span>
        <span data-col="remove" ${e>12&&!c?`data-tip="${A(`Remove`)}" class="icon-trash-empty"`:``}></span>
      </div>
    `}let c=n(`biomesBody`);c.innerHTML=i,s(c,styles.relief.options.set);for(let n of e.all){let e=t[n.i];a+=f(e.area),o+=k(e.rural*options.map.units.population.scale+e.urban*options.map.units.population.scale*options.map.units.population.urbanization.rate)}let l=f(u(pack.cells.area));n(`biomesFooterBiomes`).innerHTML=String(e.all.length),n(`biomesFooterCells`).innerHTML=String(pack.cells.h.filter(e=>e>=20).length);let d=n(`biomesFooterArea`);d.innerHTML=M(a)+r,n(`biomesFooterPopulation`).innerHTML=M(o),d.dataset.area=String(a),d.dataset.mapArea=String(l),n(`biomesFooterPopulation`).dataset.population=String(o),S(n(`biomesFooter`),e,z.goto),c.querySelectorAll(`div.biomes`).forEach(e=>{e.addEventListener(`mouseenter`,J)}),c.querySelectorAll(`div.biomes`).forEach(e=>{e.addEventListener(`mouseleave`,Y)}),c.dataset.type===`percentage`&&(c.dataset.type=`absolute`,Z()),v.update(N,{width:`fit-content`,position:I})}function K({icons:e,iconsDensity:t}){return o(e,t,`biomeRelief`)}function q(e){let t=Number(e.closest(`.biomes`).dataset.id);a.open({biome:t,onApply:H})}function J(t){let n=+t.target.dataset.id,i=e().duration(2e3).ease(m);r(`#biomes > #biome${n}`).raise().transition(i).attr(`stroke-width`,2).attr(`stroke`,`#cd4c11`)}function Y(e){let t=+e.target.dataset.id,n=pack.biomes[t].color;r(`#biomes > #biome${t}`).transition().attr(`stroke-width`,.7).attr(`stroke`,n)}function re(e){let t=e.getAttribute(`fill`),n=+e.closest(`.biomes`).dataset.id;i.ColorPicker.open(t,t=>{e.fill=t,pack.biomes[n].color=t,g.draw(`biomes`)})}function X(e){let t=e.closest(`.biomes`),n=+t.dataset.id;e.value.trim()?(c.rename(n,e.value),t.dataset.name=pack.biomes[n].name):e.value=pack.biomes[n].name}function ie(e){let t=e.closest(`.biomes`),n=+t.dataset.id;Number.isNaN(+e.value)||+e.value<0||+e.value>9999?(e.value=String(pack.biomes[n].habitability),E(A(`Please provide a valid number in range 0-9999`),!1,`error`)):(c.setHabitability(n,+e.value),t.dataset.habitability=e.value,$(),H())}function ae(e){let t=+(e.closest(`.biomes`)?.dataset.id||0);i.NotesEditor.open({type:`biome`,id:t})}function oe(e){let t=e.closest(`.biomes`)?.dataset.name;if(t===`Custom`||!t){E(A(`Please fill in the biome name`),!1,`error`);return}let n={"Hot desert":`Desert_climate#Hot_desert_climates`,"Cold desert":`Desert_climate#Cold_desert_climates`,Savanna:`Tropical_and_subtropical_grasslands,_savannas,_and_shrublands`,Grassland:`Temperate_grasslands,_savannas,_and_shrublands`,"Tropical seasonal forest":`Seasonal_tropical_forest`,"Temperate deciduous forest":`Temperate_deciduous_forest`,"Tropical rainforest":`Tropical_rainforest`,"Temperate rainforest":`Temperate_rainforest`,Taiga:`Taiga`,Tundra:`Tundra`,Glacier:`Glacier`,Wetland:`Wetland`},r=`https://en.wikipedia.org/w/index.php?search=${t}`,i=n[t]?`https://en.wikipedia.org/wiki/`+n[t]:r;te(i)}function se(){h.toggle(F,()=>{let e=W();return pack.biomes.filter(({i:t})=>e[t].cells).sort((t,n)=>e[n.i].area-e[t.i].area).map(({i:e,color:t,name:n})=>[e,t,n])},A(`No biomes to show`))}function Z(){let e=n(`biomesBody`);if(e.dataset.type===`absolute`){e.dataset.type=`percentage`;let t=+n(`biomesFooterCells`).innerHTML,r=n(`biomesFooterArea`),i=+r.dataset.area,a=+r.dataset.mapArea,o=+n(`biomesFooterPopulation`).dataset.population;e.querySelectorAll(`:scope > div`).forEach(e=>{e.querySelector(`.biomeCells`).innerHTML=`${k(+e.dataset.cells/t*100)}%`,e.querySelector(`.biomeArea`).innerHTML=`${k(+e.dataset.area/i*100)}%`,e.querySelector(`.biomePopulation`).innerHTML=`${k(+e.dataset.population/o*100)}%`}),r.innerHTML=`${k(i/a*100)}%`}else e.dataset.type=`absolute`,z.refresh()}function ce(){try{c.add(`Custom`,O(),50)}catch{E(A(`Maximum number of biomes reached (255), data cleansing is required`),!1,`error`);return}L=W(),z.refresh()}function le(e){let t=+e.closest(`.biomes`).dataset.id;try{c.remove(t)}catch{return}L=W(),z.refresh()}function Q(){let e=options.map.units.area.unit===`square`?`${options.map.units.distance.unit}2`:options.map.units.area.unit,{scale:t,urbanization:n}=options.map.units.population,r=W(),i=pack.biomes.filter(e=>e.i&&!e.removed).map(e=>{let{cells:i,area:a,rural:o,urban:s}=r[e.i],c=k(o*t+s*t*n.rate);return[e.i,e.name,e.color,`${e.habitability}%`,e.development??0,i,f(a),c]});_.download(`Biomes`,P.map(t=>t===`Area`?`Area ${e}`:t),i)}function ue(){g.show(`biomes`),i.PaintEditor.open({title:A(`Paint Biomes`),parentDialogId:N,onClose:B,items:pack.biomes.filter(e=>e.i&&!e.removed).map(e=>({id:e.i,name:e.name,color:e.color})),getValue:e=>pack.cells.biome[e],filterCell:e=>ne(e,pack),onApply:de})}function de(e){for(let[t,n]of D(e))c.setCells(t,n);e.size&&(g.draw(`biomes`),t(N)&&H())}function fe(){c.restore(),g.draw(`biomes`),$(),H()}function pe(){L=[],v.destroy(`biomesEditor`)}function $(){d.regenerate(),l.collectStatistics(),g.draw(`population`,`goods`)}function me(e){let t=pack.biomes[+e.closest(`.biomes`).dataset.id],n=Math.round(+e.value);n>=-50&&n<=50&&c.setDevelopment(t.i,n),e.value=String(t.development??0)}async function he(e){let t=e=>e&&pack.biomes[e]&&!pack.biomes[e].removed?pack.biomes[e]:void 0;await i.CsvUpload.update(e,P,{find:t,units:[`Area`],text:[`Biome`]},(e,n)=>{let r=t(e);n.apply(`Biome`,e=>c.rename(r.i,e),r.name),n.apply(`Color`,e=>c.recolor(r.i,e),r.color),n.apply(`Habitability`,e=>c.setHabitability(r.i,Number.parseFloat(e)),`${r.habitability}%`),n.apply(`Development`,e=>c.setDevelopment(r.i,+e),r.development??0)})&&(g.draw(`biomes`),H())}var ge={open:B,exportCsv:Q};export{ge as BiomesEditor};