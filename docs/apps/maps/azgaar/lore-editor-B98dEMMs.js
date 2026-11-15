import{c as e,n as t}from"./options-model-CrstL1Qd.js";import{t as n}from"./names-generator-BcJRPzyi.js";import{m as r,n as i}from"./app-DCKsq5m8.js";import{t as a}from"./dialog-BkeQgjla.js";import{a as o}from"./index-sNerCVjG.js";import{i as s,r as c}from"./node-utils-Ds1sVy-v.js";var l=`loreEditor`,u=`
  <style>
    #${l} .le { display: grid; grid-template-columns: 1em 5.6em minmax(0, 1fr) 1.2em; gap: .3em; align-items: center; width: 23em; }
    #${l} .le > label[for="loreDescription"] { align-self: start; padding-top: .35em; }
    #${l} .le-era { display: flex; align-items: center; gap: .4em; min-width: 0; }
    #${l} .le-era > input:first-child { flex: 1; min-width: 0; }
    #${l} .le-era > input:last-child { flex: 0 0 3.4em; }
    #${l} input, #${l} textarea { width: 100%; box-sizing: border-box; font: inherit; }
    #${l} textarea { resize: vertical; }
    #${l} .le > i { cursor: pointer; justify-self: center; }
    #${l} .le > i[data-locked] { font-size: .8em; color: #626573; }
  </style>

  <div class="le">
    <i data-locked="0" id="lock_mapName" class="icon-lock-open"></i>
    <label for="loreMapName">${o(`Map name`)}:</label>
    <input
      id="loreMapName"
      data-tip="${o(`Name of the map. Used to name the files it is downloaded as`)}"
      autocorrect="off"
      spellcheck="false"
      type="text"
    />
    <i data-tip="${o(`Generate a new map name`)}" id="loreMapNameRegenerate" class="icon-arrows-cw"></i>

    <i data-locked="0" id="lock_year" class="icon-lock-open"></i>
    <label for="loreYear">${o(`Year`)}:</label>
    <input
      id="loreYear"
      data-tip="${o(`Current year. Dates state history and battle reports`)}"
      type="number"
      step="1"
    />
    <span></span>

    <i data-locked="0" id="lock_era" data-ids="era,eraShort" class="icon-lock-open"></i>
    <label for="loreEra">${o(`Era`)}:</label>
    <span class="le-era" data-tip="${o(`Name of the era the current year belongs to, and its abbreviation`)}">
      <input id="loreEra" autocorrect="off" spellcheck="false" type="text" placeholder="${o(`Winter Era`)}" />
      <input id="loreEraShort" autocorrect="off" spellcheck="false" type="text" placeholder="${o(`WE`)}" />
    </span>
    <i data-tip="${o(`Generate a new era`)}" id="loreEraRegenerate" class="icon-arrows-cw"></i>

    <span></span>
    <label for="loreDescription">${o(`Description`)}:</label>
    <textarea
      id="loreDescription"
      rows="5"
      data-tip="${o(`Your own description of this world. Free text, carried in the map file`)}"
      placeholder="${o(`Describe the map, its age, its peoples – whatever the map should carry with it.`)}"
    ></textarea>
    <span></span>
  </div>
`;function d(){a.closeAll(`#loreEditor, .stable`),f(),a.open(l,{title:o(`Setup Lore`),width:`auto`,minWidth:340,position:{my:`right top`,at:`right-10 top+10`,of:`svg`}})}function f(){a.destroy(l),c(`dialogs`).insertAdjacentHTML(`beforeend`,`<div id="${l}" class="dialog stable">${u}</div>`),m(),h(),r(c(l),p)}function p(e){let{name:t,calendar:n}=options.map.lore;if(e===`mapName`)return t;if(e===`year`)return n.year;if(e===`era`)return n.era;if(e===`eraShort`)return n.eraShort}function m(){let{name:e,description:t,calendar:n}=options.map.lore;c(`loreMapName`).value=e,c(`loreYear`).value=String(n.year),c(`loreEra`).value=n.era,c(`loreEraShort`).value=n.eraShort,c(`loreDescription`).value=t}function h(){c(l).addEventListener(`change`,g),c(`loreMapNameRegenerate`).addEventListener(`click`,_),c(`loreEraRegenerate`).addEventListener(`click`,v)}function g(n){let r=n.target,a=r.value,{lore:o}=options.map;switch(r.id){case`loreMapName`:if(!a.trim())return;i.rename(a),e.set(`mapName`,o.name);break;case`loreYear`:if(!a||Number.isNaN(+a))return;i.setYear(+a),e.set(`year`,o.calendar.year);break;case`loreEra`:if(!a.trim())return;i.setEra(a),e.set(`era`,o.calendar.era),e.set(`eraShort`,o.calendar.eraShort),c(`loreEraShort`).value=o.calendar.eraShort;break;case`loreEraShort`:if(!a.trim())return;i.setEra(o.calendar.era,a),e.set(`eraShort`,o.calendar.eraShort);break;case`loreDescription`:i.setDescription(a);break;default:return}t.save()}function _(){e.clear(`mapName`),i.rename(n.getMapName()),t.save(),m()}function v(){e.clear(`era`),e.clear(`eraShort`),i.setEra(n.getEra()),t.save(),m()}function y(){s(l)&&m()}var b={open:d,refresh:y};export{b as LoreEditor};