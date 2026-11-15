import{r as e}from"./node-utils-Ds1sVy-v.js";import{S as t,b as n,t as r,x as i}from"./names-generator-BcJRPzyi.js";import{n as a}from"./file-name-B95gRTjS.js";import{t as o}from"./min-CCch3uox.js";import{t as s}from"./app-DCKsq5m8.js";import{t as c}from"./dialog-BkeQgjla.js";import{o as l}from"./tooltips-BVQbACdS.js";import{b as u,f as d}from"./notices-6lBE5Kkn.js";import{c as f,n as p,t as m}from"./file-utils-CUGyyqg9.js";import{O as h,a as g,i as _,m as v,n as y}from"./index-sNerCVjG.js";var b=null;function x(){options.app.mode||(c.closeAll(`#namesbaseEditor, .stable`),S(),w(),T(),c.open(`namesbaseEditor`,{resizable:!0,title:g(`Namesbase Editor`),width:`60vw`,position:{my:`center`,at:`center`,of:`svg`},onClose:C}))}function S(){c.destroy(`namesbaseEditor`);let t=`<div id="namesbaseEditor" class="dialog stable textual">
      <div id="namesbaseBasesTop">
        <span>${g(`Select base`)}: </span>
        <select id="namesbaseSelect" data-tip="${g(`Select base to edit`)}" style="width: 12em" value="0"></select>
        <span style="margin-left: 2px">${g(`Names data`)}: </span>
      </div>
      <div id="namesbaseBody" style="margin-block: 2px; width: auto">
        <textarea
          id="namesbaseTextarea"
          data-base="0"
          rows="13"
          data-tip="${g(`Names data: a comma separated list of source names used for names generation`)}"
          placeholder="${g(`Provide a names data: a comma separated list of source names`)}"
          autocorrect="off"
          spellcheck="false"
          style="resize: none"
        ></textarea>
        <div>
          <span>${g(`Name`)}: </span>
          <input
            id="namesbaseName"
            data-tip="${g(`Type to change a base name`)}"
            placeholder="${g(`Base name`)}"
            autocorrect="off"
            spellcheck="false"
            style="width: 12em"
          />
          <span>${g(`Length`)}: </span>
          <input id="namesbaseMin" data-tip="${g(`Recommended minimum name length`)}" type="number" min="2" max="100" />
          <input id="namesbaseMax" data-tip="${g(`Recommended maximum name length`)}" type="number" min="2" value="10" />
          <span>${g(`Doubled`)}: </span>
          <input
            id="namesbaseDouble"
            data-tip="${g(`Populate with letters that can be used twice in a row (geminates)`)}"
            autocorrect="off"
            spellcheck="false"
            style="width: 10em"
          />
        </div>
        <fieldset>
          <legend>${g(`Generated examples`)}:</legend>
          <div id="namesbaseExamples" data-tip="${g(`Examples. Click to re-generate`)}"></div>
        </fieldset>
      </div>
      <div id="namesbaseBottom">
        <button
          id="namesbaseUpdateExamples"
          data-tip="${g(`Re-generate examples based on provided data`)}"
          class="icon-arrows-cw"
        ></button>
        <button id="namesbaseAdd" data-tip="${g(`Add`)}" class="icon-plus"></button>
        <button id="namesbaseDefault" data-tip="${g(`Restore default namesbase`)}" class="icon-cancel"></button>
        <button id="namesbaseDownload" data-tip="${g(`Download namesbase to PC`)}" class="icon-download"></button>
        <button
          id="namesbaseUpload"
          data-tip="${g(`Upload a namesbase from PC, replacing the current set`)}"
          class="icon-upload"
        ></button>
        <button
          id="namesbaseUploadExtend"
          data-tip="${g(`Upload a namesbase from PC, extending the current set`)}"
          class="icon-up-circled2"
        ></button>
        <button
          id="namesbaseCA"
          data-tip="${g(`Find or share custom namesbase on Cartography Assets portal`)}"
          class="icon-drafting-compass"
        ></button>
        <button
          id="namesbaseAnalyze"
          data-tip="${g(`Analyze namesbase to get a validity and quality overview`)}"
          class="icon-flask"
        ></button>
        <button
          id="namesbaseSpeak"
          data-tip="${_(g(`Speak the examples`),g(`You can change voice and language in options`))}"
          class="icon-voice"
        ></button>
      </div>
    </div>`;e(`dialogs`).insertAdjacentHTML(`beforeend`,t),e(`namesbaseSelect`).addEventListener(`change`,T),e(`namesbaseTextarea`).addEventListener(`change`,D),e(`namesbaseUpdateExamples`).addEventListener(`click`,E),e(`namesbaseExamples`).addEventListener(`click`,E),e(`namesbaseName`).addEventListener(`input`,e=>O(e.target.value)),e(`namesbaseMin`).addEventListener(`input`,e=>k(e.target.value)),e(`namesbaseMax`).addEventListener(`input`,e=>A(e.target.value)),e(`namesbaseDouble`).addEventListener(`input`,e=>j(e.target.value)),e(`namesbaseAdd`).addEventListener(`click`,N),e(`namesbaseAnalyze`).addEventListener(`click`,M),e(`namesbaseDefault`).addEventListener(`click`,P),e(`namesbaseDownload`).addEventListener(`click`,F),e(`namesbaseUpload`).addEventListener(`click`,()=>I(!0)),e(`namesbaseUploadExtend`).addEventListener(`click`,()=>I(!1)),e(`namesbaseCA`).addEventListener(`click`,()=>d(`https://cartographyassets.com/asset-category/specific-assets/azgaars-generator/namebases/`)),e(`namesbaseSpeak`).addEventListener(`click`,()=>s(e(`namesbaseExamples`).textContent??``))}function C(){c.destroy(`namesbaseEditor`)}function w(){let t=e(`namesbaseSelect`);t.innerHTML=``,r.nameBases.forEach((e,n)=>{t.options.add(new Option(e.name,String(n)))})}function T(){let t=+e(`namesbaseSelect`).value;r.nameBases[t]?(e(`namesbaseTextarea`).value=r.nameBases[t].b,e(`namesbaseName`).value=r.nameBases[t].name,e(`namesbaseMin`).value=String(r.nameBases[t].min),e(`namesbaseMax`).value=String(r.nameBases[t].max),e(`namesbaseDouble`).value=r.nameBases[t].d,E()):l(g(`Namesbase {{base}} is not defined`,{base:t}),!1,`error`)}function E(){let t=+e(`namesbaseSelect`).value,n=``;for(let e=0;e<7;e++){let i=r.getBase(t);if(i===void 0){n=g(`Cannot generate examples. Please verify the data`);break}e&&(n+=`, `),n+=i}e(`namesbaseExamples`).innerHTML=n}function D(){let t=+e(`namesbaseSelect`).value,n=e(`namesbaseTextarea`);if(n.value.split(`,`).length<3){l(g(`The names data provided is too short or incorrect`),!1,`error`);return}let i=n.value.replace(/[/|]/g,``);r.nameBases[t].b=i,n.value=i,r.updateChain(t)}function O(t){let n=+e(`namesbaseSelect`).value,i=e(`namesbaseSelect`),a=t.replace(/[/|]/g,``);i.options[i.selectedIndex].innerHTML=a,r.nameBases[n].name=a}function k(t){let n=+e(`namesbaseSelect`).value;+t>r.nameBases[n].max?l(g(`Minimal length cannot be greater than maximal`),!1,`error`):r.nameBases[n].min=+t}function A(t){let n=+e(`namesbaseSelect`).value;+t<r.nameBases[n].min?l(g(`Maximal length should be greater than minimal`),!1,`error`):r.nameBases[n].max=+t}function j(t){let n=+e(`namesbaseSelect`).value;r.nameBases[n].d=t}function M(){let a=e(`namesbaseTextarea`).value,s=a.toLowerCase().split(`,`),d=s.length;if(!a||!d){l(g(`Names data should not be empty`),!1,`error`);return}let f=r.calculateChain(a),p=Object.values(f),m=h(i(p.map(e=>e.length))??0),_=s.map(e=>e.length),v=a.match(/[\u0080-\uFFFF]/gu)?u(a.match(/[\u0080-\uFFFF]/gu).join(``).toLowerCase().split(``)).join(``):`none`,y=s.flatMap(e=>e.match(/[^\w\s]|(.)(?=\1)/g)??[]),b=u(y).filter(e=>y.filter(t=>t===e).length>3),x=b.length?b.join(``):`none`,S=u(s.filter((e,t,n)=>n.indexOf(e)!==t)).join(`, `)||`none`,C=i(s.map(e=>+e.includes(` `)))??0;c.message({message:`<div style="line-height: 1.6em; max-width: 20em">
      <div data-tip="${g(`Number of names provided`)}">${g(`Namesbase length`)}: ${d} ${d<30?`<span data-tip="${g(`Namesbase contains < 30 names - not enough to generate reasonable data`)}" style="color:red">[${g(`not enough`)}]</span>`:d<100?`<span data-tip="${g(`Namesbase contains < 100 names - not enough to generate good names`)}" style="color:darkred">[${g(`low`)}]</span>`:d<=400?`<span data-tip="${g(`Namesbase contains a reasonable number of samples`)}" style="color:green">[${g(`good`)}]</span>`:`<span data-tip="${g(`Namesbase contains > 400 names. That is too much, try to reduce it to ~300 names`)}" style="color:darkred">[${g(`overmuch`)}]</span>`}</div>
      <div data-tip="${g(`Average number of generation variants for each key in the chain`)}">${g(`Namesbase variety`)}: ${m} ${m<15?`<span data-tip="${g(`Namesbase average variety < 15 - generated names will be too repetitive`)}" style="color:red">[${g(`low`)}]</span>`:m<30?`<span data-tip="${g(`Namesbase average variety < 30 - names can be too repetitive`)}" style="color:orange">[${g(`mean`)}]</span>`:`<span data-tip="${g(`Namesbase variety is good`)}" style="color:green">[${g(`good`)}]</span>`}</div>
      <hr />
      <div data-tip="${g(`The shortest name length`)}">${g(`Min name length`)}: ${o(_)}</div>
      <div data-tip="${g(`The longest name length`)}">${g(`Max name length`)}: ${t(_)}</div>
      <div data-tip="${g(`Average name length`)}">${g(`Mean name length`)}: ${h(i(_)??0,1)}</div>
      <div data-tip="${g(`Common name length`)}">${g(`Median name length`)}: ${n(_)}</div>
      <hr />
      <div data-tip="${g(`Characters outside of Basic Latin have bad font support`)}">${g(`Non-basic chars`)}: ${v}</div>
      <div data-tip="${g(`Characters that are frequently (more than 3 times) doubled`)}">${g(`Doubled chars`)}: ${x}</div>
      <div data-tip="${g(`Names used more than one time`)}">${g(`Duplicates`)}: ${S}</div>
      <div data-tip="${g(`Percentage of names containing space character`)}">${g(`Multi-word names`)}: ${h(C*100,2)}%</div>
    </div>`,title:g(`Data Analysis`),width:`auto`,position:{my:`left top-30`,at:`right+10 top`,of:`#namesbaseEditor`}})}function N(){let t=r.nameBases.length,n=`This,is,an,example,of,name,base,showing,correct,format,It,should,have,at,least,one,hundred,names,separated,with,comma`;r.nameBases.push({name:`Base${t}`,i:t,min:5,max:12,d:``,m:0,b:n}),e(`namesbaseSelect`).add(new Option(`Base${t}`,String(t))),e(`namesbaseSelect`).value=String(t),e(`namesbaseTextarea`).value=n,e(`namesbaseName`).value=`Base${t}`,e(`namesbaseMin`).value=`5`,e(`namesbaseMax`).value=`12`,e(`namesbaseDouble`).value=``,e(`namesbaseExamples`).innerHTML=g(`Please provide names data`)}function P(){c.confirm({title:g(`Restore default data`),message:g(`Are you sure you want to restore default namesbase?`),confirm:g(`Restore`),onConfirm:()=>{r.clearChains(),r.nameBases=r.getNameBases(),w(),T()}})}function F(){let e=r.nameBases.map(e=>`${e.name}|${e.min}|${e.max}|${e.d}|${e.m}|${e.b}`).join(`\r
`),t=`${a(`Namesbase`)}.txt`;p(e,t)}function I(e){b??=m(`.txt`),b.onchange=()=>f(b,t=>L(t,e)),b.click()}function L(e,t=!0){let n=e.replace(/\r\n|\r/g,`
`).split(`
`).filter(Boolean);if(!n.length){l(_(g(`Cannot load a namesbase`),g(`Please check the data format`)),!1,`error`);return}r.clearChains(),t&&(r.nameBases=[]);let i=[];if(n.forEach((e,t)=>{try{let[t,n,i,a,o,s]=e.split(`|`),c=t?.replace(R,``);if(!c)throw Error(g(`Name is missing`));let l=s?.replace(R,``);if(!l)throw Error(g(`Names are missing`));r.nameBases.push({name:c,i:r.nameBases.length,min:+n,max:+i,d:a,m:+o,b:l})}catch(n){i.push({id:t+1,line:e,error:n.message}),y.error(n)}}),i.length>0){y.error(`Namesbase upload errors`,i);let e=i.map(({id:e,line:t,error:n})=>`<li style="padding:0.6em 0;border-top:1px solid #ddd;">
            <div>
              ${g(`Line {{number}}`,{number:e})}:
              <span style="color:#8b0000">${v(n)}.</span> ${g(`Data`)}:
            </div>
            <div style="margin-top:0.35em;font-family:var(--font-monospace,monospace);line-height:1.4;word-break:break-word;color:#333;">
              ${v(t)||`<i>${g(`empty line`)}</i>`}
            </div>
          </li>`).join(``);c.message({message:`<div>
        <p style="margin:0.75em;">
          <strong>${g(`File parsing error. Only {{added}} out of {{total}} namebases added.`,{added:n.length-i.length,total:n.length})}</strong>
          ${g(`Each namebase should be on its own line and follow the format: name|min|max|duplication|m|names. Parameters should be separated with the | character, and this character should not be used within the parameters. Another prohibited character is /. The most common issue is names and other parameters being on two separate lines.`)}
          <ul style="margin:0.5em;">
            <li><code>name</code>: ${g(`name of the base.`)}</li>
            <li><code>min</code>: ${g(`minimal recommended length of generated names. It should be a number.`)}</li>
            <li><code>max</code>: ${g(`maximal recommended length of generated names. It should be a number greater than minimal length.`)}</li>
            <li><code>duplication</code>: ${g(`characters that can be duplicated in generated names. For example lkd means names like “Kalla”, “Mikkor”, “Dalddur” are possible. This parameter can be empty.`)}</li>
            <li><code>m</code>: ${g(`unused parameter, populate with 0.`)}</li>
            <li><code>names</code>: ${g(`names data, separated with commas. It should contain at least 3 names to be valid.`)}</li>
          </ul>
        </p>
        <div>
          <ul style="margin:0;padding-left:1.5em;">
            ${e}
          </ul>
        </div>
      </div>`,title:g(`Parsing error`),width:`min(72vw, 68em)`,position:{my:`center center-4em`,at:`center`,of:`svg`},buttons:[{label:g(`Continue`)}]})}w(),T()}var R=/[|/]/g,z={open:x};export{z as NamesbaseEditor};