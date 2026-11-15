import{a as e,i as t,r as n,t as r,z as i}from"./node-utils-Ds1sVy-v.js";import{t as a}from"./controllers-Dbv1ZRTV.js";import{c as o,l as s}from"./prosperity-J_ycIG-E.js";import{C as c,P as l,g as u,j as d,y as f}from"./options-model-CrstL1Qd.js";import{n as p,r as m,u as h}from"./military-generator-CVth4JoO.js";import{a as g,t as _}from"./pack-generator-DTsfQ82D.js";import{n as v}from"./stability-DCAus2OW.js";import{S as y,r as b,t as x,v as ee}from"./names-generator-BcJRPzyi.js";import{a as S,o as C}from"./units-CYDspnRH.js";import{at as w,c as T,lt as te,n as ne,rt as re,s as ie,t as E}from"./layers-DjWzCbYN.js";import{t as ae}from"./stratify-CGdiYggi.js";import{t as oe}from"./pack-CyBKcrr4.js";import{t as D}from"./csv-BoSHm6Vn.js";import{_ as se,c as ce,d as le,l as ue,s as de,t as fe}from"./app-DCKsq5m8.js";import{t as pe}from"./development-view-ChwbelfH.js";import{t as O}from"./dialog-BkeQgjla.js";import{t as me}from"./highlighting-C3iNJ2tq.js";import{t as he}from"./state-B2hBYDzv.js";import{a as ge,i as _e,n as ve,r as ye}from"./table-DPmN0izx.js";import{F as k,M as be,c as xe,i as A,l as j,s as M,x as Se}from"./economy-view-C5mGSEYI.js";import{t as Ce}from"./annex-mode-DX72TXM1.js";import{i as N,n as we}from"./highlight-CBuOTLhq.js";import{m as Te}from"./zoom-B8oh1YKy.js";import{o as P,t as Ee}from"./tooltips-BVQbACdS.js";import{v as De}from"./notices-6lBE5Kkn.js";import{O as F,a as I,i as L,k as R,m as Oe,p as ke}from"./index-sNerCVjG.js";var z=`statesEditor`,Ae=`States`,B={my:`right top`,at:`right-10 top+10`,of:`svg`},V,H=[],U=e=>e===void 0?`<div class="placeholder" data-col="development"></div>`:`<div data-tip="${pe(e)}" data-col="development">${F(e)}</div>`,W=e=>{let t=e.i?h.ofState(e.i):null;return t?.product?t.taxes/t.product*100:null},G=[{key:`color`,width:`1.2em`,permanent:!0},{key:`name`,label:I(`State`),width:`7em`,permanent:!0,sortBy:e=>e.name||``,sortType:`alpha`},{key:`emblem`,width:`1.4em`},{key:`form`,label:I(`Form`),width:`8em`,mobileHidden:!0,sortBy:e=>e.i&&e.formName||``,sortType:`alpha`},{key:`capital`,label:I(`Capital`),width:`7em`,sortBy:e=>e.i&&pack.burgs[e.capital]?.name||``,sortType:`alpha`},{key:`culture`,label:I(`Culture`),width:`6em`,mobileHidden:!0,sortBy:e=>e.i&&pack.cultures[e.culture]?.name||``,sortType:`alpha`},{key:`burgs`,label:I(`Burgs`),width:`5em`,mobileHidden:!0,sortBy:e=>e.burgs||0},{key:`cells`,label:I(`Cells`),width:`5em`,hidden:!0,mobileHidden:!0,sortBy:e=>e.cells||0},{key:`area`,label:I(`Area`),width:`7em`,mobileHidden:!0,defaultSort:`desc`,sortBy:e=>S(e.area||0)},{key:`population`,label:I(`Population`),width:`6em`,sortBy:e=>F((e.rural||0)*options.map.units.population.scale+(e.urban||0)*options.map.units.population.scale*options.map.units.population.urbanization.rate)},{key:`treasury`,label:I(`Balance`),width:`6em`,hidden:!0,mobileHidden:!0,tip:L(A.stateTreasury(),A.openValue()),sortBy:e=>e.economy.treasury||0},{key:`burden`,label:I(`Tax burden`),width:`6em`,hidden:!0,mobileHidden:!0,tip:L(I(`Tax burden: the taxes' share of the product`),A.openValue()),sortBy:e=>W(e)??-1},{key:`corruption`,label:I(`Corruption`),width:`6em`,hidden:!0,mobileHidden:!0,tip:L(A.corruption(),A.openValue()),sortBy:e=>e.i?o.ofState(e,e.economy.collected):0},...s.map(e=>({key:e,label:l[e],width:`6em`,hidden:!0,mobileHidden:!0,tip:L(A.expenseTip(e),A.openValue()),sortBy:t=>t.i?t.economy.budget[e]:-1})),{key:`prosperity`,label:I(`Prosperity`),width:`6em`,mobileHidden:!0,tip:L(A.prosperity(),A.openValue()),sortBy:e=>h.ofState(e.i)?.prosperity??-1},{key:`stability`,label:I(`Stability`),width:`6em`,mobileHidden:!0,tip:L(A.stability(),I(`Click a value to open the stability overview`)),sortBy:e=>v.get(e.i)?.stability??-1},{key:`product`,label:I(`Product`),width:`6em`,hidden:!0,mobileHidden:!0,tip:L(A.stateProduct(),A.openValue()),sortBy:e=>h.ofState(e.i)?.product??0},{key:`wealth`,label:I(`Wealth`),width:`6em`,hidden:!0,mobileHidden:!0,tip:L(A.wealth(),A.openValue()),sortBy:e=>h.ofState(e.i)?.wealth??0},{key:`development`,label:I(`Development`),width:`7.5em`,hidden:!0,mobileHidden:!0,tip:I(`Development: the people's average technology, 0–100, and its era`),sortBy:e=>H[e.i]??-1},{key:`type`,label:I(`Type`),width:`5em`,hidden:!0,sortBy:e=>e.i&&e.type||``,sortType:`alpha`},{key:`expansionism`,label:I(`Expansion`),width:`5em`,hidden:!0,sortBy:e=>e.i&&e.expansionism||0},{key:`tags`,label:I(`Tags`),width:`10em`,hidden:!0,sortBy:e=>c.format(e.tags),sortType:`alpha`},{key:`note`,width:`1.1em`},{key:`locate`,width:`1.1em`},{key:`focus`,width:`1.1em`},{key:`lock`,width:`1.1em`},{key:`remove`,width:`1.4em`,permanent:!0}],K=`Id.State.Full Name.Form.Color.Capital.Culture.Type.Expansionism.Cells.Burgs.Area.Total Population.Rural Population.Urban Population.Provinces.Neighbors.Sales Tax.Poll Tax.Market License.Adjustments.Court.Administration.Infrastructure.Military.Corruption.Treasury.Tags`.split(`.`);function je(){let e=V?.search,t=pack.states.filter(e=>!e.removed);return e?t.filter(t=>t.i?c.matches(e,t.name,t.tags,[t.fullName]):c.matches(e,t.name)):t}var q=ye({dialogId:z,getData:()=>(H=f.getAverages(pack.cells.state),ce(z,je(),G)),onUpdate:Le});function Me(){options.app.mode||(V=he.get(z,`filters`,()=>({search:``})),O.closeAll(`#${z}, .stable`),E.show(`states`,`borders`),E.hide(`cultures`,`biomes`,`religions`),Ne(),m.collectStatistics(),q.reset(),O.open(z,{title:I(`States Editor`),resizable:!1,position:B,onClose:Ie}))}function Ne(){O.destroy(z);let e=`<div id="${z}" class="dialog stable editorDialog">
    <div id="statesBodySection" class="table" data-type="absolute">
      ${_e({dialogId:z,columns:G})}
    </div>

    <div id="statesFilters" class="editorFilters">
      <label for="statesSearch" data-tip="${I(`Filter by name or tag`)}">${I(`Search`)}: <input id="statesSearch" type="search" autocomplete="off" /></label>
    </div>

    <div id="statesFooter" class="totalLine">
      <div data-tip="${I(`States number`)}" style="margin-left: 5px">${I(`States`)}:&nbsp;<span id="statesFooterStates">0</span></div>
      <div data-tip="${I(`Number of burgs`)}" style="margin-left: 12px" data-col="burgs">${I(`Burgs`)}:&nbsp;<span id="statesFooterBurgs">0</span></div>
      <div data-tip="${I(`Total land area`)}" style="margin-left: 12px" data-col="area">${I(`Land area`)}:&nbsp;<span id="statesFooterArea">0</span></div>
      <div data-tip="${I(`Total population`)}" style="margin-left: 12px" data-col="population">${I(`Population`)}:&nbsp;<span id="statesFooterPopulation">0</span></div>
      <div data-tip="${A.stateTreasury()}" style="margin-left: 12px" data-col="treasury">${I(`Avg balance`)}:&nbsp;<span id="statesFooterTreasury">0</span></div>
      <div data-tip="${A.prosperity()}" style="margin-left: 12px" data-col="prosperity">${I(`Avg prosperity`)}:&nbsp;<span id="statesFooterProsperity">—</span></div>
    </div>

    <div id="statesBottom" class="editorToolbar">
      <button id="statesEditorRefresh" data-tip="${I(`Refresh`)}" class="icon-cw"></button>
      <button id="statesEditStyle" data-tip="${I(`Edit style in Style Editor`)}" class="icon-adjust"></button>
      <button id="statesLegend" data-tip="${I(`Toggle Legend box`)}" class="icon-list-bullet"></button>
      <button id="statesPercentage" data-tip="${I(`Toggle percentage / absolute values views`)}" class="icon-percent"></button>
      <button id="statesChart" data-tip="${I(`States bubble chart`)}" class="icon-chart-area"></button>

      <button id="statesRegenerate" data-tip="${I(`Show`)}" class="icon-cog-alt"></button>
      <div id="statesRegenerateButtons" style="display: none">
        <button id="statesRegenerateBack" data-tip="${I(`Hide`)}" class="icon-cog-alt"></button>
        <button id="statesRandomize" data-tip="${I(`Randomize states Expansion value and re-calculate states and provinces`)}" class="icon-shuffle"></button>
        <button id="statesRecalculate" data-tip="${I(`Recalculate states based on current values of growth-related attributes`)}" class="icon-retweet"></button>
        <div data-tip="${I(`Allow states neutral distance, expansion and type changes to take an immediate effect`)}" style="display: inline-block">
          <input id="statesAutoChange" class="checkbox" type="checkbox" />
          <label for="statesAutoChange" class="checkbox-label"><i>${I(`auto-apply changes`)}</i></label>
        </div>
        <div data-tip="${I(`Allow system to change state labels when states data is change`)}" style="display: inline-block">
          <input id="adjustLabels" class="checkbox" type="checkbox" />
          <label for="adjustLabels" class="checkbox-label"><i>${I(`auto-change labels`)}</i></label>
        </div>
      </div>

      <button id="statesManually" data-tip="${I(`Manually re-assign states`)}" class="icon-brush"></button>

      <button id="statesAdd" data-tip="${L(I(`Add`),I(`Hold Shift to add multiple`))}" class="icon-plus"></button>
      <button id="statesMerge" data-tip="${I(`Merge several states into one`)}" class="icon-layer-group"></button>
      <button id="statesAnnex" data-tip="${L(I(`Annex states: click the annexing state, then the states it absorbs`),I(`Hold Shift to keep annexing`))}" class="icon-crown"></button>
      <button id="statesExport" data-tip="${I(`Save data as a CSV file`)}" class="icon-download"></button>
      <button id="statesImport" data-tip="${I(`Upload data from a CSV file`)}" class="icon-upload"></button>
    </div>
  </div>`;n(`dialogs`).insertAdjacentHTML(`beforeend`,e),n(`statesSearch`).value=V.search,de(z,q.reset),me(z,({cellId:e})=>pack.cells.h[e]<20?void 0:pack.cells.state[e]),ve({dialogId:z,columns:G,onUpdate:()=>O.update(z,{width:`fit-content`,position:B})}),n(`statesSearch`).addEventListener(`input`,Pe),n(`statesEditorRefresh`).addEventListener(`click`,J),n(`statesEditStyle`).addEventListener(`click`,()=>void a.StyleEditor.open(`states`)),n(`statesLegend`).addEventListener(`click`,Ze),n(`statesPercentage`).addEventListener(`click`,Qe),n(`statesChart`).addEventListener(`click`,$e),n(`statesRegenerate`).addEventListener(`click`,et),n(`statesRegenerateBack`).addEventListener(`click`,nt),n(`statesRecalculate`).addEventListener(`click`,()=>Z(!0)),n(`statesRandomize`).addEventListener(`click`,tt),n(`statesManually`).addEventListener(`click`,rt),n(`statesAdd`).addEventListener(`click`,at),n(`statesMerge`).addEventListener(`click`,st),n(`statesAnnex`).addEventListener(`click`,lt.toggle),n(`statesExport`).addEventListener(`click`,dt),n(`statesImport`).addEventListener(`click`,()=>D.pick(ft)),n(`statesBodySection`).addEventListener(`click`,e=>{let t=e.target,n=t.classList,r=t.closest(`.states`);if(!r)return;let o=Number(r.dataset.id);t.tagName===`FILL-BOX`?Be(t):n.contains(`name`)?Ve(o):n.contains(`coaIcon`)?a.EmblemsEditor.open(`state`,`stateCOA${o}`,pack.states[o]):n.contains(`icon-star-empty`)?We(o):n.contains(`icon-dot-circled`)?a.BurgsOverview.open({stateId:o}):n.contains(`statePopulation`)?Ue(o):t.closest(`.stateEconomy`)?a.EconomyOverview.open(`state`,o):t.closest(`.stateStability`)?a.StabilityOverview.open(o):n.contains(`icon-book`)?a.NotesEditor.open({type:`state`,id:o}):n.contains(`icon-pin`)?Je(o,n):n.contains(`icon-target`)?we(i(`#regions`).select(`#state${o}`).node(),4):n.contains(`icon-trash-empty`)?Ye(o):(n.contains(`icon-lock`)||n.contains(`icon-lock-open`))&&pt(o,n)}),n(`statesBodySection`).addEventListener(`change`,e=>{let t=e.target,n=t.classList,r=t.closest(`.states`);if(!r)return;let i=+r.dataset.id;n.contains(`stateCulture`)?Ge(i,r,t.value):n.contains(`cultureType`)?Ke(i,r,t.value):n.contains(`statePower`)?qe(i,r,t.value):n.contains(`stateTags`)&&Fe(i,r,t)})}function Pe(e){V.search=e.target.value,he.set(z,`filters`,V),q.reset()}function Fe(e,t,n){let r=pack.states[e];r&&(c.set(r,n.value),n.value=c.format(r.tags),t.dataset.tags=c.format(r.tags),V.search&&q.refresh())}function Ie(){options.app.mode===`addState`&&Q(),lt.exit(),a.ColorPicker.close(),i(`#debug`).selectAll(`.highlight`).remove(),H=[]}function J(){m.collectStatistics(),O.isOpen(z)&&q.refresh()}function Le(e){let t=C(),r=0,a=0,l=0;for(let t of e.all){r+=S(t.area||0);let e=(t.rural||0)*options.map.units.population.scale,n=(t.urban||0)*options.map.units.population.scale*options.map.units.population.urbanization.rate;a+=F(e+n),l+=t.burgs||0}let u=``;for(let n of e.rows){let e=S(n.area||0),r=(n.rural||0)*options.map.units.population.scale,a=(n.urban||0)*options.map.units.population.scale*options.map.units.population.urbanization.rate,l=F(r+a),d=L(`${I(`Total population`)}: ${R(l)}`,`${I(`Rural population`)}: ${R(r)}`,`${I(`Urban population`)}: ${R(a)}`,I(`Click to edit`)),f=i(`#deftemp`).select(`#fog #focusState${n.i}`).size(),p=L(A.stateTreasury(),I(`Sales tax: {{rate}}%`,{rate:F((n.economy.salesTax||0)*100,1)}),I(`Poll tax: {{rate}} a head`,{rate:F(n.economy.pollTax||0,2)}),I(`Market license: {{fee}}`,{fee:F(n.economy.marketFee||0,2)}),I(`Corruption: {{rate}}%`,{rate:F(o.ofState(n,n.economy.collected))}),A.open()),m=n.i?h.ofState(n.i):null,g=v.get(n.i),_=W(n),y=n.economy.budget,b=n.i?null:h.ofState(0);if(!n.i){u+=`<div
        class="states"
        data-id=${n.i}
        data-name="${n.name}"
        data-cells=${n.cells}
        data-area=${e}
        data-population=${l}
        data-burgs=${n.burgs}
        data-treasury="0"
        data-prosperity="${b?.prosperity??``}"
        data-product="${b?.product??``}"
        data-wealth="${b?.wealth??``}"
        data-color=""
        data-form=""
        data-capital=""
        data-culture=""
        data-type=""
        data-expansionism=""
        data-tags=""
      >
        <svg width="1em" height="1em" class="placeholder" data-col="color"></svg>
        <input data-tip="${L(I(`Neutral lands name`),I(`Click to change`))}" class="stateName name pointer italic" value="${n.name}" readonly data-col="name" />
        <svg class="coaIcon placeholder" viewBox="0 0 200 200" data-col="emblem"></svg>
        <input class="stateForm placeholder" value="none" data-col="form" />
        <div data-col="capital">
          <span class="icon-star-empty placeholder"></span>
          <div class="stateCapital placeholder"></div>
        </div>
        <select class="stateCulture placeholder" data-col="culture">${Y(0)}</select>
        <div data-col="burgs">
          <span data-tip="${I(`Click to overview neutral burgs`)}" class="icon-dot-circled pointer" style="padding-right: 1px"></span>
          <div data-tip="${I(`Number of burgs`)}" class="stateBurgs">${n.burgs}</div>
        </div>
        <div data-col="cells">
          <span data-tip="${I(`Number of cells`)}" class="icon-check-empty"></span>
          <div data-tip="${I(`Number of cells`)}" class="stateCells">${n.cells}</div>
        </div>
        <div data-col="area">
          <span data-tip="${I(`Neutral lands area`)}" style="padding-right: 4px" class="icon-map-o"></span>
          <div data-tip="${I(`Neutral lands area`)}" class="stateArea">${R(e)} ${t}</div>
        </div>
        <div data-col="population">
          <span data-tip="${d}" class="icon-male"></span>
          <div data-tip="${d}" class="statePopulation pointer">${R(l)}</div>
        </div>
        <div data-tip="${I(`Neutrals collect no taxes`)}" class="stateTreasury placeholder" data-col="treasury"></div>
        <div data-tip="${I(`Neutrals collect no taxes`)}" class="placeholder" data-col="burden"></div>
        <div data-tip="${I(`Neutrals collect no taxes`)}" class="placeholder" data-col="corruption"></div>
        ${s.map(e=>`<div data-tip="${I(`Neutrals collect no taxes`)}" class="placeholder" data-col="${e}"></div>`).join(``)}
        ${n.cells||n.burgs?`<div data-tip="${L(A.prosperity(),A.open())}" class="stateEconomy stateProsperity pointer" data-col="prosperity">${b?.prosperity==null?`—`:k(b.prosperity)}</div>
        <div data-tip="${I(`Neutral lands have no government`)}" class="placeholder" data-col="stability"></div>
        <div data-tip="${L(A.stateProduct(),A.open())}" class="stateEconomy stateProduct pointer" data-col="product">🟡 ${R(b?.product??0)}</div>
        <div data-tip="${L(A.wealth(),A.open())}" class="stateEconomy stateWealth pointer" data-col="wealth">🟡 ${F(b?.wealth??0,2)}</div>`:`<div class="stateProsperity placeholder" data-col="prosperity"></div>
        <div class="placeholder" data-col="stability"></div>
        <div class="stateProduct placeholder" data-col="product"></div>
        <div class="stateWealth placeholder" data-col="wealth"></div>`}
        ${U(H[0])}
        <select class="cultureType placeholder" data-col="type">${Re(0)}</select>
        <div data-col="expansionism">
          <span class="icon-resize-full placeholder"></span>
          <input class="statePower placeholder" type="number" value="0" />
        </div>
        <div data-col="tags" class="placeholder"></div>
        <div data-col="note"></div>
        <div data-col="locate"></div>
        <div data-col="focus"></div>
        <div data-col="lock"></div>
        <div data-col="remove"></div>
      </div>`;continue}let x=pack.burgs[n.capital].name;te.trigger(`stateCOA${n.i}`,n.coa),u+=`<div
      class="states"
      data-id=${n.i}
      data-name="${n.name}"
      data-form="${n.formName||``}"
      data-capital="${x}"
      data-color="${n.color}"
      data-cells=${n.cells}
      data-area=${e}
      data-population=${l}
      data-burgs=${n.burgs}
      data-treasury="${n.economy.treasury}"
      data-prosperity="${m?.prosperity??``}"
      data-product="${m?.product??``}"
      data-wealth="${m?.wealth??``}"
      data-culture=${pack.cultures[n.culture].name}
      data-type=${n.type}
      data-expansionism=${n.expansionism}
      data-tags="${c.format(n.tags)}"
    >
      <fill-box fill="${n.color}" data-col="color"></fill-box>
      <input data-tip="${L(I(`Name`),I(`Click to change`))}" class="stateName name pointer" value="${n.name}" readonly data-col="name" />
      <svg data-tip="${I(`Edit Emblem`)}" class="coaIcon pointer" viewBox="0 0 200 200" data-col="emblem"><use href="#stateCOA${n.i}"></use></svg>
      <input data-tip="${L(I(`Form name`),I(`Click to change`))}" class="stateForm name pointer" value="${n.formName||``}" readonly data-col="form" />
      <div data-col="capital">
        <span data-tip="${L(I(`State capital`),I(`Click to zoom`))}" class="icon-star-empty pointer"></span>
        <div data-tip="${I(`Capital name`)}" class="stateCapital">${Oe(x??``)}</div>
      </div>
      <select data-tip="${L(I(`Dominant culture`),I(`Click to change`))}" class="stateCulture" data-col="culture">${Y(n.culture)}</select>
      <div data-col="burgs">
        <span data-tip="${I(`Click to overview state burgs`)}" style="padding-right: 1px" class="icon-dot-circled pointer"></span>
        <div data-tip="${I(`Number of burgs`)}" class="stateBurgs">${n.burgs}</div>
      </div>
      <div data-col="cells">
        <span data-tip="${I(`Number of cells`)}" class="icon-check-empty"></span>
        <div data-tip="${I(`Number of cells`)}" class="stateCells">${n.cells}</div>
      </div>
      <div data-col="area">
        <span data-tip="${I(`State area`)}" style="padding-right: 4px" class="icon-map-o"></span>
        <div data-tip="${I(`State area`)}" class="stateArea">${R(e)} ${t}</div>
      </div>
      <div data-col="population">
        <span data-tip="${d}" class="icon-male"></span>
        <div data-tip="${d}" class="statePopulation pointer">${R(l)}</div>
      </div>
      <div data-tip="${p}" class="stateTreasury stateEconomy pointer" data-col="treasury">🟡 ${R(n.economy.treasury)}</div>
      <div data-tip="${L(I(`Tax burden: the taxes' share of the product`),A.open())}" class="stateEconomy pointer" data-col="burden">${_===null?`—`:`${F(_,1)}%`}</div>
      <div data-tip="${L(A.corruption(),I(`Before administration: {{rate}}%`,{rate:F(o.getStateTendency(n))}),A.open())}" class="stateEconomy pointer" data-col="corruption">${F(o.ofState(n,n.economy.collected))}%</div>
      ${s.map(e=>`<div data-tip="${L(A.expenseTip(e),A.open())}" class="stateEconomy pointer" data-col="${e}">${y[e]}%</div>`).join(``)}
      <div data-tip="${m?.prosperity==null?A.noData():L(be(m.prosperity),A.open())}" class="stateEconomy stateProsperity pointer" data-col="prosperity">${m?.prosperity==null?`—`:k(m.prosperity)}</div>
      <div data-tip="${g?L(A.stability(),I(`Click to open the stability overview`)):A.noData()}" class="stateStability pointer" data-col="stability">${g?`${F(g.stability*100)}%`:`—`}</div>
      <div data-tip="${L(A.stateProduct(),A.open())}" class="stateEconomy stateProduct pointer" data-col="product">🟡 ${R(m?.product??0)}</div>
      <div data-tip="${L(A.wealth(),A.open())}" class="stateEconomy stateWealth pointer" data-col="wealth">🟡 ${F(m?.wealth??0,2)}</div>
      ${U(H[n.i])}
      <select data-tip="${L(I(`State type`),I(`Defines growth model`),I(`Click to change`))}" class="cultureType" data-col="type">${Re(n.type)}</select>
      <div data-col="expansionism">
        <span data-tip="${I(`State expansionism`)}" class="icon-resize-full"></span>
        <input data-tip="${I(`Expansionism (defines competitive size). Change to re-calculate states based on new value`)}"
          class="statePower" type="number" min="0" max="99" step=".1" value=${n.expansionism} />
      </div>
      <div data-col="tags">
        <input data-tip="${L(I(`State tags`),I(`Comma-separated list of tags`))}" class="stateTags" placeholder="${I(`none`)}" value="${c.format(n.tags)}" />
      </div>
      ${le(I(`Edit free text notes (legend)`))}
      <span data-col="locate" data-tip="${I(`Locate on map`)}" class="icon-target"></span>
      <span data-col="focus" data-tip="${I(`Toggle state focus`)}" class="icon-pin ${f?``:` inactive`}"></span>
      <span data-col="lock" data-tip="${I(`Lock`)}" class="icon-lock${n.lock?``:`-open`}"></span>
      <span data-col="remove" data-tip="${I(`Remove`)}" class="icon-trash-empty"></span>
    </div>`}let d=n(`statesBodySection`);d.querySelectorAll(`:scope > .states`).forEach(e=>{e.remove()}),d.insertAdjacentHTML(`beforeend`,u);let f=pack.states.filter(e=>e.i&&!e.removed).length,p=e.all.filter(e=>e.i&&!e.removed).length;n(`statesFooterStates`).innerHTML=p===f?String(f):I(`{{shown}} of {{total}}`,{shown:p,total:f}),n(`statesFooterBurgs`).innerHTML=String(l),n(`statesFooterArea`).innerHTML=R(r)+t,n(`statesFooterArea`).dataset.area=String(r),n(`statesFooterPopulation`).innerHTML=R(a),n(`statesFooterPopulation`).dataset.population=String(a);let m=e.all.filter(e=>e.i&&!e.removed),g=m.reduce((e,t)=>e+(t.economy.treasury||0),0);n(`statesFooterTreasury`).innerHTML=`🟡 ${R(m.length?g/m.length:0)}`;let _=m.flatMap(e=>{let t=h.ofState(e.i);return t?.prosperity==null?[]:[{people:t.people,prosperity:t.prosperity}]}),y=_.reduce((e,t)=>e+t.people,0);n(`statesFooterProsperity`).innerHTML=y?k(_.reduce((e,t)=>e+t.people*t.prosperity,0)/y):`—`,ge(n(`statesFooter`),e,q.goto),n(`statesBodySection`).querySelectorAll(`:scope > .states`).forEach(e=>{e.addEventListener(`mouseenter`,ze),e.addEventListener(`mouseleave`,X)}),n(`statesBodySection`).dataset.type===`percentage`&&(n(`statesBodySection`).dataset.type=`absolute`,Qe()),O.update(z,{width:`fit-content`,position:B})}function Y(e){let t=``;return pack.cultures.forEach(n=>{n.removed||(t+=`<option ${n.i===e?`selected`:``} value="${n.i}">${n.name}</option>`)}),t}function Re(e){let t=``;return[`Generic`,`River`,`Lake`,`Naval`,`Nomadic`,`Hunting`,`Highland`].forEach(n=>{t+=`<option ${e===n?`selected`:``} value="${n}">${d[n]??n}</option>`}),t}function ze(e){if(!E.isOn(`states`)||i(`#deftemp`).select(`#fog path`).size())return;let t=Number(e.target.dataset.id);!options.app.mode&&t&&N(i(`#regions`).select(`#state${t}`).attr(`d`))}function X(){i(`#debug`).selectAll(`.highlight`).each(function(){i(this).transition().duration(1e3).attr(`opacity`,0).remove()})}function Be(e){let t=e.getAttribute(`fill`)||`#ffffff`,n=+e.closest(`.states`).dataset.id;a.ColorPicker.open(t,t=>{e.fill=t,pack.states[n].color=t,E.draw(`states`),E.draw(`military`)})}function Ve(e){He();let t=n(`stateNameEditorCustomForm`),i=n(`stateNameEditorSelectForm`);t.value=``,t.style.display===`inline-block`&&(t.style.display=`none`,i.style.display=`inline-block`);let a=pack.states[e];n(`stateNameEditor`).dataset.state=String(e),n(`stateNameEditorShort`).value=a.name||``,r(i,a.formName||``),n(`stateNameEditorFull`).value=a.fullName||``,O.open(`stateNameEditor`,{resizable:!1,title:I(`Change state name`),buttons:[{label:I(`Apply`),onClick:()=>{u(a),O.close(`stateNameEditor`)}},{label:I(`Cancel`),onClick:()=>O.close(`stateNameEditor`)}],position:{my:`center`,at:`center`,of:`svg`}}),n(`stateNameEditorShortCulture`).addEventListener(`click`,o),n(`stateNameEditorShortRandom`).addEventListener(`click`,s),n(`stateNameEditorShortSpeak`).addEventListener(`click`,()=>fe(n(`stateNameEditorShort`).value)),n(`stateNameEditorAddForm`).addEventListener(`click`,c),n(`stateNameEditorCustomForm`).addEventListener(`change`,c),n(`stateNameEditorFullRegenerate`).addEventListener(`click`,l),n(`stateNameEditorFullSpeak`).addEventListener(`click`,()=>fe(n(`stateNameEditorFull`).value));function o(){let e=+n(`stateNameEditor`).dataset.state,t=pack.states[e].culture,r=x.getState(x.getCultureShort(t),t);n(`stateNameEditorShort`).value=r}function s(){let e=ee(x.nameBases.length-1),t=x.getState(x.getBase(e),void 0,e);n(`stateNameEditorShort`).value=t}function c(){let e=t.value,n=t.style.display===`inline-block`;t.style.display=n?`none`:`inline-block`,i.style.display=n?`inline-block`:`none`,e&&n&&r(i,e),t.value=``}function l(){let e=n(`stateNameEditorShort`).value,t=n(`stateNameEditorSelectForm`).value;n(`stateNameEditorFull`).value=r();function r(){if(!t)return e;if(!e&&t)return`The ${t}`;let r=n(`stateNameEditorFullRegenerate`),i=+r.dataset.tick;return r.dataset.tick=String(i+1),i%2?`${b(e)} ${t}`:`${t} of ${e}`}}function u(e){let t=n(`stateNameEditorShort`).value.trim(),r=n(`stateNameEditorSelectForm`).value,i=n(`stateNameEditorFull`).value.trim(),a=e.fullName,o=t!==e.name||r!==(e.formName??``)||i!==a;t&&t!==e.name&&m.rename(e.i,t),r!==(e.formName??``)&&m.setForm(e.i,r),i&&i!==a&&m.setFullName(e.i,i),o&&n(`stateNameEditorUpdateLabel`).checked&&(e.label?.text&&delete e.label.text,E.draw(`labels`)),J()}}function He(){O.destroy(`stateNameEditor`);let e=`<div id="stateNameEditor" class="dialog" data-state="0">
      <div>
        <div data-tip="${I(`Short name`)}" class="label">${I(`Short name`)}:</div>
        <input
          id="stateNameEditorShort"
          data-tip="${I(`Type to change the short name`)}"
          autocorrect="off"
          spellcheck="false"
          style="width: 11em"
        />
        <span id="stateNameEditorShortSpeak" data-tip="${L(I(`Speak the name`),I(`You can change voice and language in options`))}" class="speaker">🔊</span>
        <span
          id="stateNameEditorShortCulture"
          data-tip="${I(`Generate culture-specific name`)}"
          class="icon-book pointer"
        ></span>
        <span id="stateNameEditorShortRandom" data-tip="${I(`Generate random name`)}" class="icon-globe pointer"></span>
      </div>
      <div data-tip="${I(`Select form name`)}">
        <div data-tip="${I(`Form name`)}" class="label">${I(`Form name`)}:</div>
        <select id="stateNameEditorSelectForm" style="width: 11em">
          <option value="">${I(`blank`)}</option>
          ${Object.entries(p).map(([e,t])=>`<optgroup label="${e}">${t.map(e=>`<option value="${e}">${e}</option>`).join(``)}</optgroup>`).join(``)}
        </select>
        <input
          id="stateNameEditorCustomForm"
          placeholder="${I(`Enter custom form name`)}"
          data-tip="${I(`Enter custom form name`)}"
          style="display: none; width: 11em"
        />
        <span
          id="stateNameEditorAddForm"
          data-tip="${I(`Click to add custom state form name to the list`)}"
          class="icon-plus pointer"
        ></span>
      </div>
      <div>
        <div data-tip="${I(`Full name`)}" class="label">${I(`Full name`)}:</div>
        <input
          id="stateNameEditorFull"
          data-tip="${I(`Type to change the full name`)}"
          autocorrect="off"
          spellcheck="false"
          style="width: 11em"
        />
        <span id="stateNameEditorFullSpeak" data-tip="${L(I(`Speak the name`),I(`You can change voice and language in options`))}" class="speaker">🔊</span>
        <span
          id="stateNameEditorFullRegenerate"
          data-tip="${I(`Click to re-generate full name`)}"
          data-tick="0"
          class="icon-arrows-cw pointer"
        ></span>
      </div>
      <div data-tip="${I(`Uncheck to not update state label on name change`)}" style="padding-block: 0.2em">
        <input id="stateNameEditorUpdateLabel" class="checkbox" type="checkbox" checked />
        <label for="stateNameEditorUpdateLabel" class="checkbox-label"><i>${I(`Update label on Apply`)}</i></label>
      </div>
    </div>`;n(`dialogs`).insertAdjacentHTML(`beforeend`,e)}function Ue(e){let t=pack.states[e];if(!t.cells){P(I(`No cells, cannot change population`),!1,`error`);return}let r=F((t.rural||0)*options.map.units.population.scale),i=F((t.urban||0)*options.map.units.population.scale*options.map.units.population.urbanization.rate),a=r+i,o=e=>Number(e).toLocaleString();O.message({message:`<div>
    <i>${I(`Change population of all cells assigned to the state`)}</i>
    <div style="margin: 0.5em 0">
      ${I(`Rural`)}: <input type="number" min="0" step="1" id="ruralPop" value=${r} style="width:6em" />
      ${I(`Urban`)}: <input type="number" min="0" step="1" id="urbanPop" value=${i} style="width:6em" />
    </div>
    <div>${I(`Total population`)}: ${o(a)} ⇒ <span id="totalPop">${o(a)}</span>
      (<span id="totalPopPerc">100</span>%)
    </div>
  </div>`,title:I(`Change state population`),width:`24em`,buttons:[{label:I(`Apply`),onClick:()=>{f()}},{label:I(`Cancel`)}]});let s=n(`ruralPop`),c=n(`urbanPop`),l=n(`totalPop`),u=n(`totalPopPerc`),d=()=>{let e=s.valueAsNumber+c.valueAsNumber;Number.isNaN(e)||(l.innerHTML=o(e),u.innerHTML=String(F(e/a*100)))};s.oninput=()=>d(),c.oninput=()=>d();function f(){try{m.setPopulation(e,+s.value||0,+c.value||0)}catch(e){P(ke(e),!1,`error`);return}E.draw(`population`),J()}}function We(e){let t=pack.states[e].capital,{x:n,y:r}=pack.burgs[t];Te(n,r,8,2e3)}function Ge(e,t,n){m.setCulture(e,+n),t.dataset.base=String(+n)}function Ke(e,t,n){m.setType(e,n),t.dataset.type=n,Z()}function qe(e,t,n){let r=Number(n);r>=0&&r<=99&&(m.setExpansionism(e,r),t.dataset.expansionism=n,Z())}function Je(e,t){if(options.app.mode)return;let n=i(`#statesBody`).select(`#state${e}`).attr(`d`),r=`focusState${e}`;t.contains(`inactive`)?ie(r,n):T(r),t.toggle(`inactive`)}function Ye(e){options.app.mode||O.confirm({title:I(`Remove`),message:`${I(`Are you sure you want to remove the state?`)}<br>${I(`This action cannot be reverted`)}`,confirm:I(`Remove`),onConfirm:()=>Xe(e)})}function Xe(e){T(`focusState${e}`),w(`state`,e);for(let t of pack.states[e].provinces||[])w(`province`,t);m.remove(e),ue(),i(`#debug`).selectAll(`.highlight`).remove(),E.draw(`burgIcons`,`labels`,`military`,`borders`,`provinces`,`states`),J()}function Ze(){ne.toggle(Ae,()=>pack.states.filter(e=>e.i&&!e.removed&&e.cells).sort((e,t)=>(t.area??0)-(e.area??0)).map(e=>[e.i,e.color??``,e.name]),I(`No states to show`))}function Qe(){if(n(`statesBodySection`).dataset.type===`absolute`){n(`statesBodySection`).dataset.type=`percentage`;let e=+n(`statesFooterBurgs`).textContent,t=+n(`statesFooterArea`).dataset.area,r=+n(`statesFooterPopulation`).dataset.population,i=pack.states.reduce((e,t)=>e+(t.i&&!t.removed?Math.abs(t.economy.treasury||0):0),0),a=h.getWorld(),o=pack.states.reduce((e,t)=>e+(t.i&&!t.removed&&t.cells||0),0);n(`statesBodySection`).querySelectorAll(`:scope > .states`).forEach(n=>{let{burgs:s,area:c,population:l,treasury:u,cells:d}=n.dataset;n.querySelector(`.stateBurgs`).textContent=`${F(+s/e*100)}%`,n.querySelector(`.stateCells`).textContent=`${F(+d/o*100)}%`,n.querySelector(`.stateArea`).textContent=`${F(+c/t*100)}%`,n.querySelector(`.statePopulation`).textContent=`${F(+l/r*100)}%`,n.querySelector(`.stateTreasury`).textContent=`${F(+u/(i||1)*100,2)}%`;let{prosperity:f,product:p,wealth:m}=n.dataset,h=(e,t)=>e&&t?`${F(+e/t*100,1)}%`:`—`,g=e=>n.querySelector(e);g(`.stateProduct`)&&(g(`.stateProduct`).textContent=h(p,a?.product)),g(`.stateWealth`)&&(g(`.stateWealth`).textContent=h(m,a?.wealth)),g(`.stateProsperity`)&&(g(`.stateProsperity`).textContent=h(f,a?.prosperity))})}else n(`statesBodySection`).dataset.type=`absolute`,q.refresh()}function $e(){let e=pack.states.filter(e=>!e.removed);if(e.length<2){P(I(`No states to show`),!1,`error`);return}let r=ae().id(e=>String(e.i)).parentId(e=>e.i?`0`:null)(e).sum(e=>e.area??0).sort((e,t)=>t.value-e.value),a=150+200*n(`uiSize`).valueAsNumber,o={top:0,right:-50,bottom:0,left:-50},s=a-o.left-o.right,c=a-o.top-o.bottom,l=oe().size([s,c]).padding(3),u=document.createElement(`div`);u.innerHTML=`<select id="statesTreeType" style="display:block; margin-left:13px; font-size:11px">
    <option value="area" selected>${I(`Area`)}</option>
    <option value="population">${I(`Total population`)}</option>
    <option value="rural">${I(`Rural population`)}</option>
    <option value="urban">${I(`Urban population`)}</option>
    <option value="burgs">${I(`Number of burgs`)}</option>
  </select><div id='statesInfo' class='chartInfo'>&#8205;</div>`;let d=i(u).insert(`svg`,`#statesInfo`).attr(`id`,`statesTree`).attr(`width`,a).attr(`height`,a).style(`font-family`,`Almendra SC`).attr(`text-anchor`,`middle`).attr(`dominant-baseline`,`central`).append(`g`).attr(`transform`,`translate(-50, 0)`);u.querySelector(`#statesTreeType`).addEventListener(`change`,_);let f=d.selectAll(`g`).data(l(r).leaves()).enter().append(`g`).attr(`transform`,e=>`translate(${e.x},${e.y})`).attr(`data-id`,e=>e.data.i).on(`mouseenter`,(e,t)=>h(e,t)).on(`mouseleave`,e=>g(e));f.append(`circle`).attr(`fill`,e=>e.data.color??null).attr(`r`,e=>e.r);let p=/(?=[A-Z][^A-Z])/g,m=e=>(y(e.split(p).map(e=>e.length))??0)+1;f.append(`text`).attr(`text-rendering`,`optimizeSpeed`).style(`font-size`,e=>`${F(e.r**.97*4/m(e.data.name),2)}px`).selectAll(`tspan`).data(e=>e.data.name.split(p)).join(`tspan`).attr(`x`,0).text(e=>e).attr(`dy`,(e,t,n)=>`${t?1:(n.length-1)/-2}em`);function h(e,t){i(e.target).select(`circle`).classed(`selected`,!0);let r=t.data.fullName,a=`${S(t.data.area)} ${C()}`,o=F(t.data.rural*options.map.units.population.scale),s=F(t.data.urban*options.map.units.population.scale*options.map.units.population.urbanization.rate),c=n(`statesTreeType`).value,l=c===`area`?`${I(`Area`)}: ${a}`:c===`rural`?`${I(`Rural population`)}: ${R(o)}`:c===`urban`?`${I(`Urban population`)}: ${R(s)}`:c===`burgs`?I(`Burgs number: {{burgs}}`,{burgs:t.data.burgs}):`${I(`Population`)}: ${R(o+s)}`;n(`statesInfo`).innerHTML=`${r}. ${l}`,ze(e)}function g(e){X(),t(`statesInfo`)&&(n(`statesInfo`).innerHTML=`&#8205;`,i(e.target).select(`circle`).classed(`selected`,!1))}function _(){let e=this.value===`area`?e=>e.area??0:this.value===`rural`?e=>e.rural??0:this.value===`urban`?e=>e.urban??0:this.value===`burgs`?e=>e.burgs??0:e=>(e.rural??0)+(e.urban??0);r.sum(e),f.data(l(r).leaves()),f.transition().duration(1500).attr(`transform`,e=>`translate(${e.x},${e.y})`),f.select(`circle`).transition().duration(1500).attr(`r`,e=>e.r),f.select(`text`).transition().duration(1500).style(`font-size`,e=>`${F(e.r**.97*4/m(e.data.name),2)}px`)}O.message({message:u,title:I(`States bubble chart`),width:`fit-content`,position:{my:`left bottom`,at:`left+10 bottom-10`,of:`svg`},buttons:[]})}function et(){n(`statesBottom`).querySelectorAll(`:scope > button`).forEach(e=>{e.style.display=`none`}),n(`statesRegenerateButtons`).style.display=`block`}function Z(e){if(e||n(`statesAutoChange`).checked){if(m.recalculate(),E.draw(`states`,`borders`,`provinces`,`goods`,`emblems`),n(`adjustLabels`).checked){for(let e of pack.states)e.label&&(e.label.pathPoints=void 0);E.draw(`labels`)}J()}}function tt(){pack.states.forEach(e=>{if(!e.i||e.removed)return;let t=F(Math.random()*4+1,1);e.expansionism=t;let r=n(`statesBodySection`).querySelector(`div.states[data-id='${e.i}'] input.statePower`);r&&(r.value=String(t))}),Z(!0)}function nt(){n(`statesBottom`).querySelectorAll(`:scope > button`).forEach(e=>{e.style.display=`inline-block`}),n(`statesRegenerateButtons`).style.display=`none`}function rt(){E.show(`states`);let e=n(`adjustLabels`).checked;a.PaintEditor.open({title:I(`Paint States`),parentDialogId:z,onClose:Me,items:pack.states.filter(e=>!e.removed).map(e=>({id:e.i,name:e.name,color:e.color||`#ffffff`,lock:!!e.lock})),dontOverrideControl:!0,getValue:e=>pack.cells.state[e],filterCell:(e,t)=>g(e,pack)&&e!==pack.states[t].center,onApply:t=>it(t,e)})}function it(e,n){if(!e.size)return;let r=new Set;for(let[t,n]of De(e)){for(let e of n)r.add(pack.cells.state[e]).add(t);m.setCells(t,n)}if(E.draw(`states`,`borders`,`provinces`,`emblems`),n){for(let e of r)delete pack.states[e].label;E.draw(`labels`)}t(z)&&J()}function at(){this.classList.contains(`pressed`)?Q():(options.app.mode=`addState`,this.classList.add(`pressed`),P(I(`Click on the map to create a new capital or promote an existing burg`),!0),i(`#viewbox`).style(`cursor`,`crosshair`).on(`click`,ot),n(`statesBodySection`).querySelectorAll(`div > input, select, span, svg`).forEach(e=>{e.style.pointerEvents=`none`}))}function ot(t){let[n,r]=e(t,this),i=pack.cells.burg[_.findCell(n,r)],a;try{a=m.add(n,r)}catch(e){P(ke(e),!1,`error`);return}t.shiftKey===!1&&Q(),i||re(`burg`,pack.states[a].capital),re(`state`,a),E.hide(`provinces`),E.draw(`burgIcons`,`labels`,`routes`,`states`,`borders`),q.refresh()}function Q(){options.app.mode=null,se(),Ee(),n(`statesBodySection`).querySelectorAll(`div > input, select, span, svg`).forEach(e=>{e.style.removeProperty(`pointer-events`)});let e=n(`statesAdd`);e.classList.contains(`pressed`)&&e.classList.remove(`pressed`)}var $=e=>`<svg class="coaIcon" viewBox="0 0 200 200"><use href="#stateCOA${e}"></use></svg>`;function st(){let e=pack.states.filter(e=>e.i&&!e.removed).map(e=>`
      <div data-id="${e.i}" style="cursor:default">
        <input type="radio" name="rulingState" value="${e.i}" />
        <input id="selectState${e.i}" class="checkbox" type="checkbox" name="statesToMerge" value="${e.i}" />
        <label for="selectState${e.i}" class="checkbox-label"><fill-box fill="${e.color}" disabled></fill-box>${$(e.i)}${e.fullName}</label>
      </div>
    `).join(``);O.message({id:`mergeStates`,message:`
    <form id='mergeStatesForm' style="overflow: hidden; display: flex; flex-direction: column; gap: 1em;">
      <p style="margin:0">
        ${I(`Check the checkbox next to each state you want to merge. Use the radio button to pick the ruling state that will absorb all others (its name, color, and capital will be kept). Hover over a row to highlight the state on the map.`)}
      </p>
      <main style='display: grid; grid-template-columns: 1fr 1fr; gap: .3em;'>
        ${e}
      </main>
    </form>
  `,width:600,title:I(`Merge states`),onClose:X,buttons:[{label:I(`Merge`),onClick:()=>{let e=new FormData(n(`mergeStatesForm`)),t=Number(e.get(`rulingState`));if(!t)return P(I(`Please select a state to merge into`),!1,`error`),!1;let r=e.getAll(`statesToMerge`).map(Number).filter(e=>e!==t);return r.length?(ct(r,t,()=>O.close(`mergeStates`)),!1):(P(I(`Please select several states to merge`),!1,`error`),!1)}},{label:I(`Cancel`)}]}),n(`mergeStatesForm`).querySelectorAll(`div[data-id]`).forEach(e=>{e.addEventListener(`mouseenter`,t),e.addEventListener(`mouseleave`,X)}),me(`mergeStates`,({cellId:e})=>pack.cells.state[e]);function t(e){if(!E.isOn(`states`))return;let t=Number(e.currentTarget.dataset.id);if(!t)return;let n=i(`#regions`).select(`#state${t}`).attr(`d`);n&&(X(),N(n))}}function ct(e,t,r){let i=pack.states[t],a=`${$(i.i)}${i.name}`;O.confirm({title:I(`Merge states`),message:`
      <p>${I(`The following states will be removed`)}: ${e.map(e=>`${$(e)}${pack.states[e].name}`).join(`, `)}.</p>
      <p>${I(`Removed states data (burgs, provinces, regiments) will be assigned to {{- ruler}}.`,{ruler:a})}</p>
      <label style="display: flex; align-items: center"><input id="mergeStatesAsProvinces" class="checkbox native" type="checkbox"> ${I(`Keep each removed state as a province of {{- ruler}}, replacing its own provinces`,{ruler:a})}</label>
      <p>${L(I(`Are you sure you want to merge states?`),I(`This action cannot be reverted`))}</p>`,confirm:I(`Merge`),onConfirm:()=>{ut(e,t,n(`mergeStatesAsProvinces`).checked),r?.()}})}var lt=Ce({buttonId:`statesAnnex`,bodySectionId:`statesBodySection`,tips:{start:L(I(`Click the state that annexes, then the states it absorbs`),I(`Hold Shift to keep annexing`)),pickLand:I(`Click on a land cell to pick a state`),nothingHere:I(`There is no state here`),annexing:e=>L(I(`Annexing into {{state}}`,{state:e}),I(`Click the states to annex`),I(`Hold Shift to keep annexing`)),isParent:e=>I(`{{state}} is the annexing state`,{state:e})},ownerOf:e=>pack.cells.state[e],colorOf:e=>pack.states[e].color??`#999999`,nameOf:e=>pack.states[e].name,commit:(e,t)=>ct(t,e)});function ut(e,t,n=!1){for(let t of e)w(`state`,t);m.merge(t,e,n),ue(),T(),i(`#debug`).selectAll(`.highlight`).remove(),E.draw(`states`,`borders`,`burgIcons`,`labels`,`provinces`,`military`,`emblems`),n&&E.show(`provinces`),J()}function dt(){let{scale:e,urbanization:t}=options.map.units.population,n=[...K,...M].map(e=>e===`Area`?`Area ${C(`2`)}`:e),r=q.view().all.map(n=>{let r=Math.round((n.rural||0)*e),i=Math.round((n.urban||0)*e*t.rate),a=(n.neighbors||[]).filter(e=>e&&!pack.states[e]?.removed);return[n.i,n.name,n.i&&n.fullName||``,n.i&&n.formName||``,n.i&&n.color||``,n.i&&pack.burgs[n.capital].name||``,n.i?pack.cultures[n.culture].name:``,n.i?n.type:``,n.i?n.expansionism:``,n.cells||0,n.burgs||0,S(n.area||0),r+i,r,i,n.i?(n.provinces||[]).filter(e=>!pack.provinces[e]?.removed).length:``,n.i?a.map(e=>pack.states[e].name).join(`;`):``,n.i?n.economy.salesTax||0:``,n.i?n.economy.pollTax||0:``,n.i?n.economy.marketFee||0:``,n.i?j(n.economy.adjustments):``,...s.map(e=>n.i?n.economy.budget[e]:``),n.i?n.economy.budget.corruption||0:``,n.i?n.economy.treasury||0:``,n.i?(n.tags||[]).join(`;`):``,...Se(n.i)]});D.download(`States`,n,r)}async function ft(e){let{scale:t,urbanization:n}=options.map.units.population,r=e=>pack.states[e]?.removed?void 0:pack.states[e];await a.CsvUpload.update(e,[...K,...M],{find:r,units:[`Area`],text:[`State`,`Full Name`,`Form`,`Tags`]},(e,i)=>{let a=r(e),o=a.fullName;if(i.apply(`State`,t=>m.rename(e,t),a.name),e){i.apply(`Form`,t=>m.setForm(e,t),a.formName),i.apply(`Full Name`,t=>m.setFullName(e,t),o),i.apply(`Color`,t=>m.recolor(e,t),a.color),i.apply(`Capital`,t=>u.setCapital(D.byName(pack.burgs,t,t=>t.state===e).i),pack.burgs[a.capital]?.name),i.apply(`Culture`,t=>m.setCulture(e,D.byName(pack.cultures,t).i),pack.cultures[a.culture]?.name),i.apply(`Type`,t=>m.setType(e,t),a.type),i.apply(`Expansionism`,t=>m.setExpansionism(e,+t),a.expansionism),i.apply(`Sales Tax`,t=>m.setTaxes(e,+t,a.economy.pollTax||0),a.economy.salesTax||0),i.apply(`Poll Tax`,t=>m.setTaxes(e,a.economy.salesTax||0,+t),a.economy.pollTax||0),i.apply(`Market License`,t=>m.setMarketFee(e,+t),a.economy.marketFee||0);let t=a.economy.budget,n={court:`Court`,administration:`Administration`,infrastructure:`Infrastructure`,military:`Military`};for(let r of s)i.apply(n[r],t=>m.setBudget(e,{[r]:+t}),t[r]);i.apply(`Corruption`,t=>m.setCorruption(e,+t),a.economy.budget.corruption||0),i.assign(`Adjustments`,t=>m.setAdjustments(e,xe(t)),j(a.economy.adjustments)),i.assign(`Tags`,t=>m.setTags(e,t),(a.tags??[]).join(`;`))}else for(let e of[`Full Name`,`Form`,`Color`,`Capital`,`Culture`,`Type`,`Expansionism`,`Sales Tax`,`Poll Tax`,`Market License`,`Adjustments`,`Court`,`Administration`,`Infrastructure`,`Military`,`Corruption`,`Tags`])i.apply(e,()=>{throw Error(I(`Neutral lands have no government`))});i.population([Math.round((a.rural||0)*t),Math.round((a.urban||0)*t*n.rate)],(t,n)=>m.setPopulation(e,t,n))})&&(E.draw(`states`,`borders`,`burgIcons`,`labels`,`provinces`,`military`,`emblems`,`population`),J())}function pt(e,t){m.setLocked(e,!pack.states[e].lock),t.toggle(`icon-lock-open`),t.toggle(`icon-lock`)}var mt={open:Me,showChart:$e,refresh:J};export{mt as StatesEditor};