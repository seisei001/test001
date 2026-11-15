import{o as e,r as t,t as n}from"./services-CiMWa4Oi.js";import{t as r}from"./markdown-CKLBkj6p.js";import{t as i}from"./dialog-BkeQgjla.js";import{a,i as o,r as s}from"./index-sNerCVjG.js";import c from"./Changelog-GZNXEwiW.js";var l={version:`1.157.0`,title:`Economy rework`,image:new URL(`header-BI_T7gYY.jpg`,import.meta.url).href},u=/^\*\*\[(\d+\.\d+(?:\.\d+)?)\]\([^)]*\)(?:\s*-\s*(\d{4}-\d{2}-\d{2}))?\*\*/;function d(e){let t=[];for(let n of e.split(`
`)){let e=n.match(u);e?t.push({version:p(e[1]),date:e[2],changes:[]}):n.startsWith(`- `)&&t.at(-1)?.changes.push(n.slice(2).trim())}return t}function f(e){return r(e.map(e=>`- ${m(e)}`).join(`
`))}var p=e=>e.split(`.`).length===2?`${e}.0`:e,m=e=>e.replace(/_(\[[^\]]+\]\([^)\s]+\))_/g,`*$1*`).replace(/(^|\s)_([^_\s][^_]*?)_(?=[\s.,;:!?)]|$)/g,`$1*$2*`),h=`https://www.patreon.com/azgaar`,g=`https://github.com/Azgaar/Fantasy-Map-Generator/wiki`,_=5,v=`<style>
  #releaseNotes .dialog-message { max-width: none; } /* the dialog's own width already fits the screen */
  .releaseNotes { --rule: color-mix(in srgb, var(--bg-main) 30%, transparent); display: grid; gap: 1em; padding: .4em 0 .2em; }
  .releaseNotes h3 { margin: 0; font: normal 1.75em/1.1 var(--serif); color: var(--dark-solid); }
  .releaseNotes header p { margin: .35em 0 0; color: #666; }
  .releaseNotes .post { display: block; position: relative; aspect-ratio: 16 / 5.5; background: center / cover no-repeat; color: #fff; text-decoration: none; }
  .releaseNotes .post::before { content: ""; position: absolute; inset: 0; background: linear-gradient(0deg, color-mix(in srgb, var(--dark-solid) 85%, transparent), transparent 65%); }
  .releaseNotes .caption { position: absolute; left: 1em; right: 1em; bottom: .8em; display: grid; gap: .15em; }
  .releaseNotes .caption small { font-size: .9em; opacity: .85; }
  .releaseNotes .caption b { font: normal 1.45em/1.15 var(--serif); }
  .releaseNotes .post:hover b { text-decoration: underline; text-underline-offset: .15em; }
  .releaseNotes .releases { height: 24em; overflow-y: auto; scrollbar-width: thin; padding-right: .5em; display: grid; gap: 1em; align-content: start; }
  .releaseNotes .releases.more { mask-image: linear-gradient(#000 75%, transparent); }
  .releaseNotes .releases h4 { margin: 0 0 .3em; display: flex; justify-content: space-between; align-items: baseline; gap: 1em; font-size: 1em; color: var(--dark-solid); }
  .releaseNotes .releases h4 span { font-weight: normal; color: #888; font-size: .9em; }
  .releaseNotes .releases ul { margin: 0; padding: 0; list-style: none; display: grid; gap: .25em; }
  .releaseNotes .releases li { position: relative; padding-left: 1.1em; line-height: 1.35; }
  .releaseNotes .releases li::before { content: "–"; position: absolute; left: .1em; color: var(--header); }
  .releaseNotes .releases li a, .releaseNotes .releases > a { color: var(--dark-solid); }
  .releaseNotes .releases > a { justify-self: start; }
  .releaseNotesLinks { float: left; display: flex; flex-wrap: wrap; gap: 0 .9em; margin: .95em 0 .4em .6em; }
  .releaseNotesLinks a { color: #666; text-decoration: none; }
  .releaseNotesLinks a:hover { color: var(--dark-solid); text-decoration: underline; text-underline-offset: .2em; }
</style>`,y=`<nav class="releaseNotesLinks">
  <a href="${g}/Quick-Start-Tutorial" target="_blank">${a(`Tutorial`)}</a>
  <a href="${g}/Hotkeys" target="_blank">${a(`Hotkeys`)}</a>
  <a href="https://discordapp.com/invite/X7E84HU" target="_blank">Discord</a>
  <a href="https://www.reddit.com/r/FantasyMapGenerator" target="_blank">Reddit</a>
  <a href="https://github.com/Azgaar/Fantasy-Map-Generator" target="_blank">GitHub</a>
  <a href="${h}" target="_blank">Patreon</a>
</nav>`;function b({afterUpdate:e=!1}={}){let t=document.createElement(`div`);t.className=`releaseNotes`,t.innerHTML=v+x(e),i.message({id:`releaseNotes`,title:a(`Generator update`),message:t,width:`min(42em, calc(100vw - 32px))`,footer:y,buttons:[{label:a(`Interactive Tour`),onClick:()=>void n.UiTour.start()},{label:a(`Close`)}]});let r=t.querySelector(`.releases`),o=()=>r.classList.toggle(`more`,r.scrollTop+r.clientHeight<r.scrollHeight-2);r.addEventListener(`scroll`,o),o()}function x(n){let r=d(c),i=r.filter(({version:n})=>!e(n,t).isNewer).slice(0,_),s=r.find(({version:e})=>e===l.version)?.date,u=t.split(`.`).slice(0,2).join(`.`),p=a(`Older maps are updated automatically when you load them`);return`
    <header>
      <h3>${a(`Azgaar's Fantasy Map Generator`)} v${u}</h3>
      <p>${n?o(p,a(`Press F1 to open this again`)):p}</p>
    </header>
    <a class="post" href="${h}/posts" target="_blank" style="background-image: url('${l.image}')">
      <span class="caption">
        <small>${s?a(`Latest post on Patreon, {{date}}`,{date:S(s)}):a(`Latest post on Patreon`)}</small>
        <b>${l.title}</b>
      </span>
    </a>
    <div class="releases">
      ${i.map(({version:e,date:t,changes:n})=>`<section>
            <h4>v${e}${t?`<span>${S(t)}</span>`:``}</h4>
            ${f(n)}
          </section>`).join(``)}
      <a href="${g}/Changelog" target="_blank">${a(`Changelog`)}</a>
    </div>`}var S=e=>new Date(e).toLocaleDateString(s.language,{day:`numeric`,month:`short`,year:`numeric`,timeZone:`UTC`}),C={open:b};export{C as ReleaseNotes};