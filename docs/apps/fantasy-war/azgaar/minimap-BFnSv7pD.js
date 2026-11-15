import{St as e}from"./layers-DjWzCbYN.js";import{t}from"./dialog-BkeQgjla.js";import{a as n,m as r}from"./zoom-B8oh1YKy.js";import{O as i,T as a,a as o}from"./index-sNerCVjG.js";import{i as s,r as c}from"./node-utils-Ds1sVy-v.js";var l;function u(){t.closeAll(`#minimap, .stable`),d(),m(),l??=n(m),t.open(`minimap`,{title:o(`Minimap`),width:`auto`,position:{my:`left bottom`,at:`left+10 bottom-25`,of:`svg`},onClose:f})}function d(){t.destroy(`minimap`);let e=`<div id="minimap" class="dialog stable">
      <div id="minimapViewportWrap">
        <svg id="minimapSurface" preserveAspectRatio="xMidYMid meet" aria-label="${o(`Map minimap`)}">
          <use id="minimapMapUse" href="#viewbox"></use>
          <rect id="minimapViewport"></rect>
        </svg>
      </div>
    </div>`;c(`dialogs`).insertAdjacentHTML(`beforeend`,e),c(`minimapSurface`).addEventListener(`click`,p),s(`minimapStyles`)?.remove();let n=document.createElement(`style`);n.id=`minimapStyles`,n.textContent=`
    #minimap {
      padding: 0;
      overflow: hidden;
      background: transparent;
    }

    #minimapViewportWrap {
      position: relative;
      width: 20em;
      border: 0;
    }

    #minimapSurface {
      display: block;
      width: 100%;
      height: auto;
      cursor: crosshair;
    }

    #minimapMapUse {
      pointer-events: none;
    }

    #minimapViewport {
      fill: rgba(190, 255, 137, 0.1);
      stroke: #624954;
      stroke-width: 1;
      stroke-dasharray: 4;
      vector-effect: non-scaling-stroke;
      pointer-events: none;
    }
  `,document.head.append(n)}function f(){l?.(),l=void 0,t.destroy(`minimap`),s(`minimapStyles`)?.remove()}function p(t){let n=s(`minimapSurface`);if(!n)return;let i=n.createSVGPoint();i.x=t.clientX,i.y=t.clientY;let o=n.getScreenCTM();if(!o)return;let c=i.matrixTransform(o.inverse()),l=a(c.x,0,options.map.graph.width),u=a(c.y,0,options.map.graph.height);r(l,u,e.scale,450)}function m(){let t=s(`minimapSurface`),n=s(`minimapViewport`),r=s(`minimapMapUse`);if(!t||!n||!r)return;t.setAttribute(`viewBox`,`0 0 ${options.map.graph.width} ${options.map.graph.height}`);let a=e.scale?1/e.scale:1;r.setAttribute(`transform`,`translate(${i(-e.x*a,3)} ${i(-e.y*a,3)}) scale(${i(a,6)})`);let o=Math.max(0,-e.x*a),c=Math.max(0,-e.y*a),l=Math.min(options.map.graph.width,o+e.width*a),u=Math.min(options.map.graph.height,c+e.height*a);n.setAttribute(`x`,String(i(o,3))),n.setAttribute(`y`,String(i(c,3))),n.setAttribute(`width`,String(i(Math.max(0,l-o),3))),n.setAttribute(`height`,String(i(Math.max(0,u-c),3)))}var h={open:u};export{h as Minimap};