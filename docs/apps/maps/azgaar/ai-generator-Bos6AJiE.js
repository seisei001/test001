import{t as e}from"./dialog-BkeQgjla.js";import{o as t}from"./tooltips-BVQbACdS.js";import{f as n}from"./notices-6lBE5Kkn.js";import{a as r,i,n as a}from"./index-sNerCVjG.js";import{r as o}from"./node-utils-Ds1sVy-v.js";var s={openai:{keyLink:`https://platform.openai.com/account/api-keys`,generate:f},anthropic:{keyLink:`https://console.anthropic.com/account/keys`,generate:p},ollama:{keyLink:`https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Ollama-text-generation`,generate:m}},c=`gpt-5.6-luna`,l={"gpt-5.6-luna":`openai`,"gpt-5.6-terra":`openai`,"gpt-5.6-sol":`openai`,"gpt-5-mini":`openai`,"gpt-5-nano":`openai`,"claude-opus-4-8":`anthropic`,"claude-sonnet-5":`anthropic`,"claude-haiku-4-5":`anthropic`,"ollama (local models)":`ollama`},u=new Set([`gpt-5.6-luna`,`gpt-5.6-terra`,`gpt-5.6-sol`,`gpt-5-mini`,`gpt-5-nano`,`claude-opus-4-8`,`claude-sonnet-5`]),d=`I'm working on my fantasy map.`;async function f({key:e,model:t,prompt:n,temperature:r,onContent:i}){let a={"Content-Type":`application/json`,Authorization:`Bearer ${e}`},o={model:t,messages:[{role:`system`,content:d},{role:`user`,content:n}],stream:!0};u.has(t)||(o.temperature=r),await h(await fetch(`https://api.openai.com/v1/chat/completions`,{method:`POST`,headers:a,body:JSON.stringify(o)}),e=>{let t=e.choices?.[0]?.delta?.content;t&&i(t)})}async function p({key:e,model:t,prompt:n,temperature:r,onContent:i}){await h(await fetch(`https://api.anthropic.com/v1/messages`,{method:`POST`,headers:{"Content-Type":`application/json`,"x-api-key":e,"anthropic-version":`2023-06-01`,"anthropic-dangerous-direct-browser-access":`true`},body:JSON.stringify({model:t,system:d,messages:[{role:`user`,content:n}],max_tokens:4096,stream:!0,...u.has(t)?{}:{temperature:r}})}),e=>{let t=e.delta?.text;t&&i(t)})}async function m({key:e,model:t,prompt:n,temperature:r,onContent:i}){await h(await fetch(`http://localhost:11434/api/generate`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({model:e,prompt:n,system:d,options:{temperature:r},stream:!0})}),e=>{e.response&&i(e.response)})}async function h(e,t){if(!e.ok){let t=r(`Failed to generate ({{status}} {{statusText}})`,{status:e.status,statusText:e.statusText});try{let n=await e.json();t=n.error?.message||n.error||t}catch(e){a.error(`Failed to parse AI provider error response`,e)}throw Error(t)}if(!e.body)throw Error(`Response has no body to stream`);let n=e.body.getReader(),i=new TextDecoder(`utf-8`),o=``;for(;;){let{done:e,value:r}=await n.read();if(e)break;o+=i.decode(r,{stream:!0});let s=o.split(`
`);for(let e=0;e<s.length-1;e++){let n=s[e].trim();if(n){if(n===`data: [DONE]`)break;try{t(n.startsWith(`data: `)?JSON.parse(n.slice(6)):JSON.parse(n))}catch(e){a.error(`Failed to parse line:`,n,e)}}}o=s.at(-1)??``}}function g(n,i){_(),v(n),e.open(`aiGenerator`,{title:r(`AI Text Generator`),position:{my:`center`,at:`center`,of:`svg`},buttons:[{label:r(`Generate`),onClick:e=>{y(e.target)}},{label:r(`Apply`),onClick:()=>{let n=o(`aiGeneratorResult`).value;if(!n)return t(r(`No result to apply`),!0,`error`,4e3);i(n),e.close(`aiGenerator`)}},{label:r(`Close`),onClick:()=>{e.close(`aiGenerator`)}}]})}function _(){e.destroy(`aiGenerator`);let t=`<div id="aiGenerator" class="dialog stable">
    <div style="display: flex; flex-direction: column; gap: 0.3em; width: 100%">
      <textarea id="aiGeneratorResult" placeholder="${r(`Generated text will appear here`)}" cols="30" rows="10"></textarea>
      <textarea id="aiGeneratorPrompt" placeholder="${r(`Type a prompt here`)}" cols="30" rows="5"></textarea>
      <div style="display: flex; align-items: center; gap: 1em">
        <label for="aiGeneratorModel"
          >${r(`Model`)}:
          <select id="aiGeneratorModel"></select>
        </label>
        <label
          for="aiGeneratorTemperature"
          data-tip="${r(`Temperature controls response randomness; higher values mean more creativity, lower values mean more predictability`)}"
        >
          ${r(`Temperature`)}:
          <input id="aiGeneratorTemperature" type="number" min="-1" max="2" step=".1" class="icon-key" />
        </label>
        <label for="aiGeneratorKey"
          >${r(`Key`)}:
          <input
            id="aiGeneratorKey"
            placeholder="${r(`Enter API key`)}"
            class="icon-key"
            data-tip="${i(r(`Enter API key`),r(`Note: the Generator doesn't store the key or any generated data`))}"
          />
          <button
            id="aiGeneratorKeyHelp"
            class="icon-help-circled"
            data-tip="${r(`Click to see the usage instructions`)}"
          ></button>
        </label>
      </div>
    </div>
  </div>`;o(`dialogs`).insertAdjacentHTML(`beforeend`,t),o(`aiGeneratorKeyHelp`).addEventListener(`click`,()=>{let e=l[o(`aiGeneratorModel`).value];n(s[e].keyLink)})}function v(e){o(`aiGeneratorResult`).value=``,o(`aiGeneratorPrompt`).value=e,o(`aiGeneratorTemperature`).value=localStorage.getItem(`fmg-ai-temperature`)||`1`;let t=o(`aiGeneratorModel`);t.options.length=0,Object.keys(l).forEach(e=>{t.options.add(new Option(e,e))}),t.value=localStorage.getItem(`fmg-ai-model`)??``,t.value&&l[t.value]||(t.value=c);let n=l[t.value];o(`aiGeneratorKey`).value=localStorage.getItem(`fmg-ai-kl-${n}`)||``}async function y(e){let n=o(`aiGeneratorKey`).value;if(!n)return t(r(`Enter API key`),!0,`error`,4e3);let i=o(`aiGeneratorModel`).value;if(!i)return t(r(`Please select a model`),!0,`error`,4e3);localStorage.setItem(`fmg-ai-model`,i);let a=l[i];localStorage.setItem(`fmg-ai-kl-${a}`,n);let c=o(`aiGeneratorPrompt`).value;if(!c)return t(r(`Please enter a prompt`),!0,`error`,4e3);let u=o(`aiGeneratorTemperature`).valueAsNumber;if(Number.isNaN(u))return t(r(`Temperature must be a number`),!0,`error`,4e3);localStorage.setItem(`fmg-ai-temperature`,String(u));try{e.disabled=!0;let t=o(`aiGeneratorResult`);t.disabled=!0,t.value=``,await s[a].generate({key:n,model:i,prompt:c,temperature:u,onContent:e=>{t.value+=e}})}catch(e){let n=e instanceof Error&&e.message||String(e)||r(`Failed to generate text`);return t(n,!0,`error`,4e3)}finally{e.disabled=!1,o(`aiGeneratorResult`).disabled=!1}}var b={open:g};export{b as AiGenerator};