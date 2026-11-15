import{i as e,t}from"./rolldown-runtime-COiEfhsA.js";import{_ as n}from"./pack-generator-DTsfQ82D.js";import{A as r,C as i,D as a,S as o,a as s,i as c,j as l,k as u,n as d,r as f,z as p}from"./node-utils-Ds1sVy-v.js";import{t as m}from"./controllers-Dbv1ZRTV.js";import{t as h}from"./dialog-BkeQgjla.js";import{c as g}from"./linear-DMWKWi8f.js";import{O as _,T as v,a as y,i as b,n as x,w as S}from"./index-sNerCVjG.js";import{dt as C,n as w,wn as T}from"./options-model-CrstL1Qd.js";import{H as ee,W as E,_ as te,f as D,p as O}from"./app-DCKsq5m8.js";import{T as k,h as A,x as j}from"./units-CYDspnRH.js";import{t as ne}from"./map-restoration--iF7MIok.js";import{t as re}from"./drag-CCSsgLNP.js";import{t as M}from"./heightmap-generator-C-OtvlxP.js";import{a as ie,u as ae}from"./draw-heightmap-CEyJl1Kw.js";import{M as oe,Pt as se,St as ce,t as N}from"./layers-DjWzCbYN.js";import{n as le,t as ue}from"./brush-circle-N3AsZiVt.js";import{t as de}from"./temperature-generator-BeC9kfd1.js";import{t as fe}from"./services-CiMWa4Oi.js";import{n as pe}from"./file-name-B95gRTjS.js";import{t as P}from"./state-B2hBYDzv.js";import{c as me,s as he}from"./zoom-B8oh1YKy.js";import{t as ge}from"./sortable-list-BzIJXSX4.js";import{a as _e,o as F,t as ve}from"./tooltips-BVQbACdS.js";import{d as ye,f as be,h as xe,y as Se}from"./notices-6lBE5Kkn.js";import{t as Ce}from"./brush-utils-B5xtY9tr.js";import{c as we,n as Te,t as Ee}from"./file-utils-CUGyyqg9.js";import{S as De,m as Oe,x as ke}from"./names-generator-BcJRPzyi.js";import{h as Ae,m as je,p as Me,v as Ne}from"./color-utils-OCVlKvQa.js";var I=18,Pe=.96422,Fe=1,Ie=.82521,Le=4/29,L=6/29,Re=3*L*L,ze=L*L*L;function Be(e){if(e instanceof R)return new R(e.l,e.a,e.b,e.opacity);if(e instanceof B)return qe(e);e instanceof i||(e=u(e));var t=We(e.r),n=We(e.g),r=We(e.b),a=z((.2225045*t+.7168786*n+.0606169*r)/Fe),o,s;return t===n&&n===r?o=s=a:(o=z((.4360747*t+.3850649*n+.1430804*r)/Pe),s=z((.0139322*t+.0971045*n+.7141733*r)/Ie)),new R(116*a-16,500*(o-a),200*(a-s),e.opacity)}function Ve(e,t,n,r){return arguments.length===1?Be(e):new R(e,t,n,r??1)}function R(e,t,n,r){this.l=+e,this.a=+t,this.b=+n,this.opacity=+r}r(R,Ve,l(o,{brighter(e){return new R(this.l+I*(e??1),this.a,this.b,this.opacity)},darker(e){return new R(this.l-I*(e??1),this.a,this.b,this.opacity)},rgb(){var e=(this.l+16)/116,t=isNaN(this.a)?e:e+this.a/500,n=isNaN(this.b)?e:e-this.b/200;return t=Pe*He(t),e=Fe*He(e),n=Ie*He(n),new i(Ue(3.1338561*t-1.6168667*e-.4906146*n),Ue(-.9787684*t+1.9161415*e+.033454*n),Ue(.0719453*t-.2289914*e+1.4052427*n),this.opacity)}}));function z(e){return e>ze?e**(1/3):e/Re+Le}function He(e){return e>L?e*e*e:Re*(e-Le)}function Ue(e){return 255*(e<=.0031308?12.92*e:1.055*e**(1/2.4)-.055)}function We(e){return(e/=255)<=.04045?e/12.92:((e+.055)/1.055)**2.4}function Ge(e){if(e instanceof B)return new B(e.h,e.c,e.l,e.opacity);if(e instanceof R||(e=Be(e)),e.a===0&&e.b===0)return new B(NaN,0<e.l&&e.l<100?0:NaN,e.l,e.opacity);var t=Math.atan2(e.b,e.a)*je;return new B(t<0?t+360:t,Math.sqrt(e.a*e.a+e.b*e.b),e.l,e.opacity)}function Ke(e,t,n,r){return arguments.length===1?Ge(e):new B(e,t,n,r??1)}function B(e,t,n,r){this.h=+e,this.c=+t,this.l=+n,this.opacity=+r}function qe(e){if(isNaN(e.h))return new R(e.l,0,0,e.opacity);var t=e.h*Ae;return new R(e.l,Math.cos(t)*e.c,Math.sin(t)*e.c,e.opacity)}r(B,Ke,l(o,{brighter(e){return new B(this.h,this.c,this.l+I*(e??1),this.opacity)},darker(e){return new B(this.h,this.c,this.l-I*(e??1),this.opacity)},rgb(){return qe(this).rgb()}}));var Je=t(((e,t,n)=>{(function(){function e(e){if(e||={},this.method=e.method||2,this.colors=e.colors||256,this.initColors=e.initColors||4096,this.initDist=e.initDist||.01,this.distIncr=e.distIncr||.005,this.hueGroups=e.hueGroups||10,this.satGroups=e.satGroups||10,this.lumGroups=e.lumGroups||10,this.minHueCols=e.minHueCols||0,this.hueStats=this.minHueCols?new n(this.hueGroups,this.minHueCols):null,this.boxSize=e.boxSize||[64,64],this.boxPxls=e.boxPxls||2,this.palLocked=!1,this.dithKern=e.dithKern||null,this.dithSerp=e.dithSerp||!1,this.dithDelta=e.dithDelta||0,this.histogram={},this.idxrgb=e.palette?e.palette.slice(0):[],this.idxi32=[],this.i32idx={},this.i32rgb={},this.useCache=e.useCache!==!1,this.cacheFreq=e.cacheFreq||10,this.reIndex=e.reIndex||this.idxrgb.length==0,this.colorDist=e.colorDist==`manhattan`?p:d,this.idxrgb.length>0){var t=this;this.idxrgb.forEach(function(e,n){var r=(255<<24|e[2]<<16|e[1]<<8|e[0])>>>0;t.idxi32[n]=r,t.i32idx[r]=n,t.i32rgb[r]=e})}}e.prototype.sample=function(e,t){if(this.palLocked)throw`Cannot sample additional images, palette already assembled.`;var n=S(e,t);switch(this.method){case 1:this.colorStats1D(n.buf32);break;case 2:this.colorStats2D(n.buf32,n.width)}},e.prototype.reduce=function(e,t,n,r){if(this.palLocked||this.buildPal(),n||=this.dithKern,r=r===void 0?this.dithSerp:r,t||=1,n)var i=this.dither(e,n,r);else for(var a=S(e).buf32,o=a.length,i=new Uint32Array(o),s=0;s<o;s++){var c=a[s];i[s]=this.nearestColor(c)}if(t==1)return new Uint8Array(i.buffer);if(t==2){for(var l=[],o=i.length,s=0;s<o;s++){var c=i[s];l[s]=this.i32idx[c]}return l}},e.prototype.dither=function(e,t,n){var r={FloydSteinberg:[[7/16,1,0],[3/16,-1,1],[5/16,0,1],[1/16,1,1]],FalseFloydSteinberg:[[3/8,1,0],[3/8,0,1],[2/8,1,1]],Stucki:[[8/42,1,0],[4/42,2,0],[2/42,-2,1],[4/42,-1,1],[8/42,0,1],[4/42,1,1],[2/42,2,1],[1/42,-2,2],[2/42,-1,2],[4/42,0,2],[2/42,1,2],[1/42,2,2]],Atkinson:[[1/8,1,0],[1/8,2,0],[1/8,-1,1],[1/8,0,1],[1/8,1,1],[1/8,0,2]],Jarvis:[[7/48,1,0],[5/48,2,0],[3/48,-2,1],[5/48,-1,1],[7/48,0,1],[5/48,1,1],[3/48,2,1],[1/48,-2,2],[3/48,-1,2],[5/48,0,2],[3/48,1,2],[1/48,2,2]],Burkes:[[8/32,1,0],[4/32,2,0],[2/32,-2,1],[4/32,-1,1],[8/32,0,1],[4/32,1,1],[2/32,2,1]],Sierra:[[5/32,1,0],[3/32,2,0],[2/32,-2,1],[4/32,-1,1],[5/32,0,1],[4/32,1,1],[2/32,2,1],[2/32,-1,2],[3/32,0,2],[2/32,1,2]],TwoSierra:[[4/16,1,0],[3/16,2,0],[1/16,-2,1],[2/16,-1,1],[3/16,0,1],[2/16,1,1],[1/16,2,1]],SierraLite:[[2/4,1,0],[1/4,-1,1],[1/4,0,1]]};if(!t||!r[t])throw`Unknown dithering kernel: `+t;var i=r[t],a=S(e),o=a.buf32,s=a.width,c=a.height;o.length;for(var l=n?-1:1,u=0;u<c;u++){n&&(l*=-1);for(var d=u*s,f=l==1?0:s-1,p=l==1?s:0;f!==p;f+=l){var m=d+f,h=o[m],g=h&255,_=(h&65280)>>8,v=(h&16711680)>>16,y=this.nearestColor(h),b=y&255,x=(y&65280)>>8,C=(y&16711680)>>16;if(o[m]=255<<24|C<<16|x<<8|b,!(this.dithDelta&&this.colorDist([g,_,v],[b,x,C])<this.dithDelta))for(var w=g-b,T=_-x,ee=v-C,E=l==1?0:i.length-1,te=l==1?i.length:0;E!==te;E+=l){var D=i[E][1]*l,O=i[E][2],k=O*s;if(D+f>=0&&D+f<s&&O+u>=0&&O+u<c){var A=i[E][0],j=m+(k+D),ne=o[j]&255,re=(o[j]&65280)>>8,M=(o[j]&16711680)>>16,ie=Math.max(0,Math.min(255,ne+w*A)),ae=Math.max(0,Math.min(255,re+T*A));o[j]=255<<24|Math.max(0,Math.min(255,M+ee*A))<<16|ae<<8|ie}}}}return o},e.prototype.buildPal=function(e){if(!(this.palLocked||this.idxrgb.length>0&&this.idxrgb.length<=this.colors)){var t=this.histogram,n=T(t,!0);if(n.length==0)throw`Nothing has been sampled, palette cannot be built.`;switch(this.method){case 1:for(var r=this.initColors,i=t[n[r-1]],a=n.slice(0,r),o=r,s=n.length;o<s&&t[n[o]]==i;)a.push(n[o++]);this.hueStats&&this.hueStats.inject(a);break;case 2:var a=n}a=a.map(function(e){return+e}),this.reducePal(a),!e&&this.reIndex&&this.sortPal(),this.useCache&&this.cacheHistogram(a),this.palLocked=!0}},e.prototype.palette=function(e,t){return this.buildPal(t),e?this.idxrgb:new Uint8Array(new Uint32Array(this.idxi32).buffer)},e.prototype.prunePal=function(e){for(var t,n=0;n<this.idxrgb.length;n++)e[n]||(t=this.idxi32[n],this.idxrgb[n]=null,this.idxi32[n]=null,delete this.i32idx[t]);if(this.reIndex){for(var r=[],i=[],a={},n=0,o=0;n<this.idxrgb.length;n++)this.idxrgb[n]&&(t=this.idxi32[n],r[o]=this.idxrgb[n],a[t]=o,i[o]=t,o++);this.idxrgb=r,this.idxi32=i,this.i32idx=a}},e.prototype.reducePal=function(e){if(this.idxrgb.length>this.colors){for(var t=e.length,n={},r=0,i,a=!1,o=0;o<t;o++)r==this.colors&&!a&&(this.prunePal(n),a=!0),i=this.nearestIndex(e[o]),r<this.colors&&!n[i]&&(n[i]=!0,r++);a||=(this.prunePal(n),!0)}else{var s=e.map(function(e){return[e&255,(e&65280)>>8,(e&16711680)>>16]}),t=s.length,c=t,l=this.initDist;if(c>this.colors){for(;c>this.colors;){for(var u=[],o=0;o<t;o++){var d=s[o];if(e[o],d)for(var f=o+1;f<t;f++){var p=s[f],m=e[f];if(p){var h=this.colorDist(d,p);h<l&&(u.push([f,p,m,h]),delete s[f],c--)}}}l+=c>this.colors*3?this.initDist:this.distIncr}if(c<this.colors){y.call(u,function(e,t){return t[3]-e[3]});for(var g=0;c<this.colors;)s[u[g][0]]=u[g][1],c++,g++}}for(var t=s.length,o=0;o<t;o++)s[o]&&(this.idxrgb.push(s[o]),this.idxi32.push(e[o]),this.i32idx[e[o]]=this.idxi32.length-1,this.i32rgb[e[o]]=s[o])}},e.prototype.colorStats1D=function(e){for(var t=this.histogram,n,r=e.length,i=0;i<r;i++)n=e[i],(n&4278190080)>>24&&(this.hueStats&&this.hueStats.check(n),n in t?t[n]++:t[n]=1)},e.prototype.colorStats2D=function(e,t){var n=this.boxSize[0],r=this.boxSize[1],i=n*r,a=C(t,e.length/t,n,r),o=this.histogram,s=this;a.forEach(function(n){var r=Math.max(Math.round(n.w*n.h/i)*s.boxPxls,2),a={},c;w(n,t,function(t){c=e[t],(c&4278190080)>>24&&(s.hueStats&&s.hueStats.check(c),c in o?o[c]++:c in a?++a[c]>=r&&(o[c]=a[c]):a[c]=1)})}),this.hueStats&&this.hueStats.inject(o)},e.prototype.sortPal=function(){var e=this;this.idxi32.sort(function(t,n){var r=e.i32idx[t],i=e.i32idx[n],a=e.idxrgb[r],o=e.idxrgb[i],s=m(a[0],a[1],a[2]),c=m(o[0],o[1],o[2]),l=a[0]==a[1]&&a[1]==a[2]?-1:h(s.h,e.hueGroups),u=(o[0]==o[1]&&o[1]==o[2]?-1:h(c.h,e.hueGroups))-l;if(u)return-u;var d=_(+c.l.toFixed(2))-_(+s.l.toFixed(2));if(d)return-d;var f=g(+c.s.toFixed(2))-g(+s.s.toFixed(2));if(f)return-f}),this.idxi32.forEach(function(t,n){e.idxrgb[n]=e.i32rgb[t],e.i32idx[t]=n})},e.prototype.nearestColor=function(e){var t=this.nearestIndex(e);return t===null?0:this.idxi32[t]},e.prototype.nearestIndex=function(e){if(!((e&4278190080)>>24))return null;if(this.useCache&&``+e in this.i32idx)return this.i32idx[e];for(var t=1e3,n,r=[e&255,(e&65280)>>8,(e&16711680)>>16],i=this.idxrgb.length,a=0;a<i;a++)if(this.idxrgb[a]){var o=this.colorDist(r,this.idxrgb[a]);o<t&&(t=o,n=a)}return n},e.prototype.cacheHistogram=function(e){for(var t=0,n=e[t];t<e.length&&this.histogram[n]>=this.cacheFreq;n=e[t++])this.i32idx[n]=this.nearestIndex(n)};function n(e,t){this.numGroups=e,this.minCols=t,this.stats={};for(var n=-1;n<e;n++)this.stats[n]={num:0,cols:[]};this.groupsFull=0}n.prototype.check=function(e){this.groupsFull==this.numGroups+1&&(this.check=function(){});var t=e&255,n=(e&65280)>>8,r=(e&16711680)>>16,i=t==n&&n==r?-1:h(m(t,n,r).h,this.numGroups),a=this.stats[i],o=this.minCols;a.num++,a.num>o||(a.num==o&&this.groupsFull++,a.num<=o&&this.stats[i].cols.push(e))},n.prototype.inject=function(e){for(var t=-1;t<this.numGroups;t++)if(this.stats[t].num<=this.minCols)switch(v(e)){case`Array`:this.stats[t].cols.forEach(function(t){e.indexOf(t)==-1&&e.push(t)});break;case`Object`:this.stats[t].cols.forEach(function(t){e[t]?e[t]++:e[t]=1})}};var r=.2126,i=.7152,a=.0722;function o(e,t,n){return Math.sqrt(r*e*e+i*t*t+a*n*n)}var s=255,c=255,l=255,u=Math.sqrt(r*s*s+i*c*c+a*l*l);function d(e,t){var n=t[0]-e[0],o=t[1]-e[1],s=t[2]-e[2];return Math.sqrt(r*n*n+i*o*o+a*s*s)/u}var f=r*s+i*c+a*l;function p(e,t){var n=Math.abs(t[0]-e[0]),o=Math.abs(t[1]-e[1]),s=Math.abs(t[2]-e[2]);return(r*n+i*o+a*s)/f}function m(e,t,n){var r,i,a,s,c,l;if(e/=255,t/=255,n/=255,r=Math.max(e,t,n),i=Math.min(e,t,n),c=(r+i)/2,r==i)a=s=0;else{switch(l=r-i,s=c>.5?l/(2-r-i):l/(r+i),r){case e:a=(t-n)/l+(t<n?6:0);break;case t:a=(n-e)/l+2;break;case n:a=(e-t)/l+4}a/=6}return{h:a,s,l:o(e,t,n)}}function h(e,t){var n=1/t,r=n/2;if(e>=1-r||e<=r)return 0;for(var i=1;i<t;i++){var a=i*n;if(e>=a-r&&e<=a+r)return i}}function g(e){return e}function _(e){return e}function v(e){return Object.prototype.toString.call(e).slice(8,-1)}var y=x()?Array.prototype.sort:b;function b(e){var t=v(this[0]);if(t==`Number`||t==`String`){for(var n={},r=this.length,i,a=0;a<r;a++)i=this[a],n[i]||n[i]===0||(n[i]=a);return this.sort(function(t,r){return e(t,r)||n[t]-n[r]})}var n=this.map(function(e){return e});return this.sort(function(t,r){return e(t,r)||n.indexOf(t)-n.indexOf(r)})}function x(){var e=`abcdefghijklmnopqrstuvwxyz`;return e.split(``).sort(function(t,n){return~~(e.indexOf(n)/2.3)-~~(e.indexOf(t)/2.3)}).join(``)==`xyzvwtursopqmnklhijfgdeabc`}function S(e,t){var n,r,i,a,o,s;switch(v(e)){case`HTMLImageElement`:n=document.createElement(`canvas`),n.width=e.naturalWidth,n.height=e.naturalHeight,r=n.getContext(`2d`),r.drawImage(e,0,0);case`Canvas`:case`HTMLCanvasElement`:n||=e,r||=n.getContext(`2d`);case`CanvasRenderingContext2D`:r||=e,n||=r.canvas,i=r.getImageData(0,0,n.width,n.height);case`ImageData`:i||=e,t=i.width,a=v(i.data)==`CanvasPixelArray`?new Uint8Array(i.data):i.data;case`Array`:case`CanvasPixelArray`:a||=new Uint8Array(e);case`Uint8Array`:case`Uint8ClampedArray`:a||=e,o=new Uint32Array(a.buffer);case`Uint32Array`:o||=e,a||=new Uint8Array(o.buffer),t||=o.length,s=o.length/t}return{can:n,ctx:r,imgd:i,buf8:a,buf32:o,width:t,height:s}}function C(e,t,n,r){~~(e/n);var i=e%n;~~(t/r);for(var a=t%r,o=e-i,s=t-a,c=[],l=0;l<t;l+=r)for(var u=0;u<e;u+=n)c.push({x:u,y:l,w:u==o?i:n,h:l==s?a:r});return c}function w(e,t,n){var r=e,i=r.y*t+r.x,a=(r.y+r.h-1)*t+(r.x+r.w-1),o=0,s=t-r.w+1,c=i;do n.call(this,c),c+=++o%r.w==0?s:1;while(c<=a)}function T(e,t){var n=[];for(var r in e)n.push(r);return y.call(n,function(n,r){return t?e[r]-e[n]:e[n]-e[r]})}this.RgbQuant=e,t!==void 0&&t.exports&&(t.exports=e)}).call(n)})),Ye=e(n()),Xe=e(Je()),V=`imagePlacement`,[Ze,Qe]=[10,400],$e=320,et=`
  #${V} > div { width: auto; }
  #${V} canvas { display: block; width: 100%; cursor: grab; touch-action: none; }
  #${V} canvas:active { cursor: grabbing; }
  #${V} .controls { display: flex; align-items: center; gap: .4em; margin-top: .5em; }
  #${V} .controls slider-input { flex: 1; min-width: 0; }
  #${V} .controls input[type=range] { flex: 1; min-width: 0; }
  #${V} .controls input[type=number] { width: 4em; }
`;function tt(e){let{width:t,height:n}=options.map.graph,r={fit:`contain`,zoom:100,x:0,y:0};f(`dialogs`).insertAdjacentHTML(`beforeend`,`<div id="${V}" class="dialog">
      <style>${et}</style>
      <canvas data-tip="${y(`Drag to pan, scroll to zoom. Black area becomes ocean`)}"></canvas>
      <div class="controls" data-tip="${y(`Set how the image fits the map`)}">
        <span>${y(`Fit`)}</span>
        <select class="fit">
          <option value="contain">${y(`Whole image`)}</option>
          <option value="cover">${y(`Fill map`)}</option>
          <option value="stretch">${y(`Stretch`)}</option>
        </select>
        <button type="button" class="center" data-tip="${y(`Center the image`)}">${y(`Center`)}</button>
      </div>
      <div class="controls" data-tip="${y(`Scale the image, in percent`)}">
        <span>${y(`Zoom`)}</span>
        <slider-input min="${Ze}" max="${Qe}" value="100"></slider-input>
      </div>
    </div>`);let i=f(V),a=i.querySelector(`canvas`);a.width=$e,a.height=Math.round($e*n/t);let o=i.querySelector(`.fit`),s=i.querySelector(`slider-input`),c=()=>{s.value=String(Math.round(r.zoom)),nt(a,e,r)};c();let l=e=>{r.zoom=Math.min(Qe,Math.max(Ze,e)),c()};return o.addEventListener(`change`,()=>{r.fit=o.value,c()}),i.querySelector(`.center`).addEventListener(`click`,()=>{r.x=r.y=0,c()}),s.addEventListener(`input`,e=>{e.target===s&&s.valueAsNumber&&l(s.valueAsNumber)}),a.addEventListener(`wheel`,e=>{e.preventDefault(),l(r.zoom*1.1**-Math.sign(e.deltaY))}),a.addEventListener(`pointerdown`,e=>{a.setPointerCapture(e.pointerId);let t={x:e.clientX,y:e.clientY},n=e=>{let{width:n,height:i}=a.getBoundingClientRect();r.x+=(e.clientX-t.x)/n,r.y+=(e.clientY-t.y)/i,t={x:e.clientX,y:e.clientY},c()},i=()=>{a.removeEventListener(`pointermove`,n),a.removeEventListener(`pointerup`,i),a.removeEventListener(`pointercancel`,i)};a.addEventListener(`pointermove`,n),a.addEventListener(`pointerup`,i),a.addEventListener(`pointercancel`,i)}),new Promise(i=>{let a=null;h.open(V,{title:y(`Place image`),width:`22em`,modal:!0,position:{my:`center`,at:`center`,of:`svg`},onClose:()=>{h.destroy(V),i(a)},buttons:[{label:y(`Apply`),onClick:()=>{a=document.createElement(`canvas`),a.width=t,a.height=n,nt(a,e,r),h.close(V)}},{label:y(`Cancel`),onClick:()=>h.close(V)}]})})}function nt(e,t,{fit:n,zoom:r,x:i,y:a}){let{width:o,height:s}=e,c=(n===`contain`?Math.min:Math.max)(o/t.width,s/t.height),l=(n===`stretch`?o:t.width*c)*(r/100),u=(n===`stretch`?s:t.height*c)*(r/100),d=e.getContext(`2d`);d.fillStyle=`#000`,d.fillRect(0,0,o,s),d.drawImage(t,(o-l)/2+i*o,(s-u)/2+a*s,l,u)}var rt=[{stroke:`#888`,width:.4,opacity:.8},{stroke:`#444`,width:.5,opacity:.8},{stroke:`#3d9df0`,width:.8,opacity:1},{stroke:`#1a6fd6`,width:1,opacity:1},{stroke:`#0a49ad`,width:1.2,opacity:1}],it=2,at=14,ot=.5;function st(e){let{cells:t,points:n,spacing:r}=grid,i=e?k.findDeepDepressionLakes(t,options.generation.lakeElevationLimit):[],a=Uint8Array.from(t.h);for(let e of i)for(let t of e)a[t]=19;let{target:o,flux:s,depth:l,river:u}=dt({...t,h:a},ct(a)),p=r/at,m=r*.25,h=_(r*.35,2),g=rt.map(()=>[]),y=[],b=e=>{let t=Math.floor(Math.log2(s[e]/30)/2)+it;return v(t,0,u[e]?rt.length-1:1)},x=e=>_(Math.min(.5+e/30,1),2);for(let e of t.i){if(l[e]>=ot&&y.push(`<polygon points="${k.getPolygon(e)}" fill-opacity="${x(l[e])}"/>`),o[e]===-1)continue;let[t,r]=n[e],[i,a]=n[o[e]],s=i-t,c=a-r,u=Math.hypot(s,c)||1,d=s/u,f=c/u,[p,h]=[t+d*u*.15,r+f*u*.15],[v,S]=[t+d*u*.7,r+f*u*.7],[C,w]=[v-m*(d*.87-f*.5),S-m*(f*.87+d*.5)],[T,ee]=[v-m*(d*.87+f*.5),S-m*(f*.87-d*.5)];g[b(e)].push(`M${_(p,1)},${_(h,1)}L${_(v,1)},${_(S,1)}M${_(C,1)},${_(w,1)}L${_(v,1)},${_(S,1)}L${_(T,1)},${_(ee,1)}`)}let S=g.map((e,t)=>{if(!e.length)return``;let{stroke:n,width:r,opacity:i}=rt[t],a=`stroke="${n}" stroke-width="${_(r*p,2)}" opacity="${i}"`;return`<path d="${e.join(``)}" ${a}/>`}),C=i.flat().map(e=>`<polygon points="${k.getPolygon(e)}"/>`),w=()=>{let e=c(`drainage`);if(e)return e;let t=d(`g`,`drainage`,{"pointer-events":`none`});return f(`debug`).append(t),t};w().innerHTML=`
    <pattern id="drainageHatch" width="${h}" height="${h}" patternUnits="userSpaceOnUse">
      <path d="M0,${h}L${h},0" stroke="#333" stroke-width="${_(.5*p,2)}"/>
    </pattern>
    <pattern id="drainageLakeHatch" width="${h}" height="${h}" patternUnits="userSpaceOnUse">
      <path d="M0,0L${h},${h}" stroke="#1a5fc8" stroke-width="${_(.8*p,2)}"/>
    </pattern>
    <g fill="url(#drainageHatch)" stroke="#000" stroke-width="${_(.3*p,2)}">${y.join(``)}</g>
    <g fill="url(#drainageLakeHatch)" stroke="#1a5fc8" stroke-width="${_(.5*p,2)}">${C.join(``)}</g>
    <g fill="none">${S.join(``)}</g>`}var ct=e=>oe.compute(e,de.compute(e));function lt(){c(`drainage`)?.remove()}var ut=1e-4;function dt(e,t){let{c:n,b:r,h:i}=e,a=e.i.length,o=new Float64Array(a),s=new Uint8Array(a),c=new C;for(let e=0;e<a;e++)i[e]>=20&&!r[e]||(o[e]=i[e],s[e]=1,c.push(e,i[e]));for(;c.length;){let e=c.pop();for(let t of n[e])s[t]||(s[t]=1,o[t]=Math.max(i[t],o[e]+ut),c.push(t,o[t]))}let l=new Int32Array(a).fill(-1),u=new Float32Array(a),d=new Float32Array(a),f=[];for(let e=0;e<a;e++)if(!(i[e]<20||r[e])){f.push(e),d[e]=o[e]-i[e];for(let t of n[e])o[t]<o[l[e]===-1?e:l[e]]&&(l[e]=t)}let p=(k.getCellsDesired()/1e4)**.25;f.sort((e,t)=>o[t]-o[e]);for(let e of f)u[e]=Math.floor(u[e]+t[e]/p),l[e]!==-1&&(u[l[e]]+=u[e]);let m=new Uint8Array(a);for(let e of f)u[e]<30||l[e]===-1||(i[l[e]]>=20&&(m[e]=1),m[l[e]]=1);return{target:l,flux:u,depth:d,river:m}}var ft=Me(ae),H=`heightmapEditor`,pt=[`renderOcean`,`showDrainage`,`allowErosion`],mt=100,U,W=Object.assign([],{n:0}),G=null,ht=null,K=null;function gt(e){U=P.get(H,`filters`,()=>({cellType:`all`})),[`all`,`land`,`water`].includes(U.cellType)||(U.cellType=`all`),P.set(H,`filters`,U);let{mode:t,tool:n}=e||{};M.clearData(),Nt(),p(`#viewbox`).selectAll(`#heights`).remove(),p(`#viewbox`).insert(`g`,`#terrs`).attr(`id`,`heights`),t?J(t,n):St(n)}bt();function _t(){h.destroy(`templateEditor`);let e=`<div id="templateEditor" class="dialog stable">
      <div id="templateTop">
        <i>${y(`Select template`)}: </i>
        <select id="templateSelect" style="width: 16em" data-prev="templateCustom" data-tip="${y(`Select base template`)}">
          <option value="custom" selected>${y(`Custom`)}</option>
          <option value="volcano">${y(`Volcano`)}</option>
          <option value="highIsland">${y(`High Island`)}</option>
          <option value="lowIsland">${y(`Low Island`)}</option>
          <option value="continents">${y(`Continents`)}</option>
          <option value="archipelago">${y(`Archipelago`)}</option>
          <option value="atoll">${y(`Atoll`)}</option>
          <option value="mediterranean">${y(`Mediterranean`)}</option>
          <option value="peninsula">${y(`Peninsula`)}</option>
          <option value="pangea">${y(`Pangea`)}</option>
          <option value="isthmus">${y(`Isthmus`)}</option>
          <option value="shattered">${y(`Shattered`)}</option>
          <option value="taklamakan">${y(`Taklamakan`)}</option>
          <option value="oldWorld">${y(`Old World`)}</option>
          <option value="fractious">${y(`Fractious`)}</option>
        </select>
      </div>
      <div id="templateTools">
        <button data-type="Hill" data-tip="${y(`Hill: small blob`)}">H</button>
        <button data-type="Pit" data-tip="${y(`Pit: round depression`)}">P</button>
        <button data-type="Range" data-tip="${y(`Range: elongated elevation`)}">R</button>
        <button data-type="Trough" data-tip="${y(`Trough: elongated depression`)}">T</button>
        <button data-type="Strait" data-tip="${y(`Strait: centered vertical or horizontal depression`)}">S</button>
        <button data-type="Mask" data-tip="${y(`Mask: lower cells near edges or in map center`)}">M</button>
        <button data-type="Invert" data-tip="${y(`Invert heightmap along the axes`)}">I</button>
        <button data-type="Add" data-tip="${y(`Add or subtract value from all heights in range`)}">+</button>
        <button data-type="Multiply" data-tip="${y(`Multiply all heights in range by factor`)}">*</button>
        <button
          data-type="Smooth"
          data-tip="${y(`Smooth the map replacing cell heights by an average values of its neighbors`)}"
        >
          ~
        </button>
      </div>
      <div id="templateBody" data-changed="0" class="table" style="padding: 2px 0">
        <div data-type="Hill">
          <div class="icon-check" data-tip="${y(`Click to skip the step`)}"></div>
          <div style="width: 4em">${y(`Hill`)}</div>
          <i class="icon-trash-empty pointer" data-tip="${y(`Remove`)}"></i>
          <i class="icon-resize-vertical" data-tip="${y(`Drag to reorder`)}"></i>
          <span
            >y:<input class="templateY" data-tip="${y(`Y axis position in percentage (minY-maxY or Y)`)}" value="47-53"
          /></span>
          <span
            >x:<input class="templateX" data-tip="${y(`X axis position in percentage (minX-maxX or X)`)}" value="65-75"
          /></span>
          <span
            >h:<input
              class="templateHeight"
              data-tip="${y(`Blob maximum height, use hyphen to get a random number in range`)}"
              value="90-100"
          /></span>
          <span
            >n:<input
              class="templateCount"
              data-tip="${y(`Blobs to add, use hyphen to get a random number in range`)}"
              value="1"
          /></span>
        </div>
      </div>
      <div id="templateBottom">
        <button id="templateRun" data-tip="${y(`Execute the template`)}" class="icon-play-circled2"></button>
        <button id="templateUndo" data-tip="${y(`Undo the latest action`)}" class="icon-ccw" disabled></button>
        <button id="templateRedo" data-tip="${y(`Redo the action`)}" class="icon-cw" disabled></button>
        <button id="templateSave" data-tip="${y(`Download the template as a text file`)}" class="icon-download"></button>
        <button id="templateLoad" data-tip="${y(`Open previously downloaded template`)}" class="icon-upload"></button>
        <button
          id="templateCA"
          data-tip="${y(`Find or share custom template on Cartography Assets portal`)}"
          class="icon-drafting-compass"
        ></button>
        <button
          id="templateTutorial"
          data-tip="${y(`Open Template Editor Tutorial`)}"
          class="icon-info"
        ></button>
        <label
          data-tip="${y(`Enter seed for template to generate the same heightmap each time`)}"
        >
          ${y(`Seed`)}: <input id="templateSeed" value="" type="number" min="1" max="999999999" step="1" style="width: 8em" />
        </label>
      </div>
    </div>`;f(`dialogs`).insertAdjacentHTML(`beforeend`,e);let t=f(`templateBody`);ge(t,{items:`div`,handle:`.icon-resize-vertical`}),t.addEventListener(`click`,e=>{let n=e.target;n.classList.contains(`icon-check`)?(n.classList.remove(`icon-check`),n.classList.add(`icon-check-empty`),n.parentElement.style.opacity=`0.5`,t.dataset.changed=`1`):n.classList.contains(`icon-check-empty`)?(n.classList.add(`icon-check`),n.classList.remove(`icon-check-empty`),n.parentElement.style.opacity=`1`):n.classList.contains(`icon-trash-empty`)&&n.parentElement.remove()}),f(`templateEditor`).addEventListener(`keypress`,e=>{e.key===`Enter`&&(e.preventDefault(),cn())}),f(`templateTools`).addEventListener(`click`,en),f(`templateSelect`).addEventListener(`change`,on),f(`templateRun`).addEventListener(`click`,cn),f(`templateCA`).addEventListener(`click`,()=>be(`https://cartographyassets.com/asset-category/specific-assets/azgaars-generator/templates`)),f(`templateTutorial`).addEventListener(`click`,()=>xe(`Heightmap-template-editor`)),f(`templateUndo`).addEventListener(`click`,()=>$(W.n-1)),f(`templateRedo`).addEventListener(`click`,()=>$(W.n+1)),f(`templateSave`).addEventListener(`click`,ln),f(`templateLoad`).addEventListener(`click`,un)}function vt(){h.destroy(`imageConverter`);let e=`<div id="imageConverter" class="dialog stable">
      <div id="convertImageButtons">
        <button id="convertImageLoad" data-tip="${y(`Load image to convert`)}" class="icon-upload"></button>
        <button
          id="convertAutoLum"
          data-tip="${y(`Auto-assign colors based on liminosity (good for monochrome images)`)}"
          class="icon-adjust"
        ></button>
        <button
          id="convertAutoHue"
          data-tip="${y(`Auto-assign colors based on hue (good for colored images)`)}"
          class="icon-paint-roller"
        ></button>
        <button
          id="convertAutoFMG"
          data-tip="${y(`Auto-assign colors using generator scheme (for exported colored heightmaps)`)}"
          class="icon-layer-group"
        ></button>
        <button id="convertColorsButton" data-tip="${y(`Set maximum number of colors`)}" class="icon-signal"></button>
        <input id="convertColors" value="100" style="display: none" />
        <button
          id="convertCancel"
          data-tip="${y(`Cancel the conversion. Previous heightmap will be restored`)}"
          class="icon-cancel"
        ></button>
      </div>
      <div data-tip="${y(`Set opacity of the loaded image`)}" style="padding-top: 0.4em">
        <i>${y(`Overlay opacity`)}:</i><br />
        <input id="convertOverlay" type="range" min="0" max="1" step=".01" value="0" style="width: 12.6em" />
        <input id="convertOverlayNumber" type="number" min="0" max="1" step=".01" value="0" style="width: 4.2em" />
      </div>
      <div data-tip="${y(`Select a color to assign a height value`)}" id="colorsSelect" style="display: none">
        <i>${y(`Set height`)}: </i>
        <span id="colorsSelectValue"></span>
        <span>(<span id="colorsSelectFriendly">0</span>)</span><br />
        <div id="imageConverterPalette"></div>
      </div>
      <div data-tip="${y(`Select a color to re-assign the height value`)}" id="colorsAssigned" style="display: none">
        <i>${y(`Assigned colors`)} (<span id="colorsAssignedNumber"></span>):</i>
        <div id="colorsAssignedContainer" class="colorsContainer"></div>
      </div>
      <div data-tip="${y(`Select a color to assign a height value`)}" id="colorsUnassigned" style="display: none">
        <i>${y(`Unassigned colors`)} (<span id="colorsUnassignedNumber"></span>):</i>
        <div id="colorsUnassignedContainer" class="colorsContainer"></div>
      </div>
      <button
        id="convertComplete"
        data-tip="${b(y(`Complete the conversion`),y(`All unassigned colors will be considered as ocean`))}"
        style="margin: 0.4em 0"
        class="glow"
      >
        ${y(`Complete the conversion`)}
      </button>
    </div>`;f(`dialogs`).insertAdjacentHTML(`beforeend`,e),p(`#imageConverterPalette`).selectAll(`div`).data(Ne(101)).enter().append(`div`).attr(`data-color`,e=>e).style(`background-color`,e=>ft(1-(e<20?e-5:e)/100)).style(`width`,e=>e<40||e>68?`.2em`:`.1em`).on(`touchmove mousemove`,hn).on(`click`,bn),f(`convertImageLoad`).addEventListener(`click`,fn),f(`convertAutoLum`).addEventListener(`click`,()=>xn(`lum`)),f(`convertAutoHue`).addEventListener(`click`,()=>xn(`hue`)),f(`convertAutoFMG`).addEventListener(`click`,()=>xn(`scheme`)),f(`convertColorsButton`).addEventListener(`click`,Sn),f(`convertComplete`).addEventListener(`click`,wn),f(`convertCancel`).addEventListener(`click`,Tn),f(`convertOverlay`).addEventListener(`input`,function(){Cn(+this.value)}),f(`convertOverlayNumber`).addEventListener(`input`,function(){Cn(+this.value)})}var yt=[];function bt(){f(`paintBrushes`).addEventListener(`click`,Pt),f(`applyTemplate`).addEventListener(`click`,Qt),f(`convertImage`).addEventListener(`click`,pn),f(`heightmapPreview`).addEventListener(`click`,On),f(`heightmap3DView`).addEventListener(`click`,O),f(`finalizeHeightmap`).addEventListener(`click`,Tt);for(let e of pt)f(e).addEventListener(`change`,function(){w.set(t=>t.app.heightmapEditor[e]=this.checked),e===`renderOcean`&&X(),e!==`renderOcean`&&xt()})}function xt(){options.app.heightmapEditor.showDrainage?q():lt()}function q(){if(options.app.mode!==`heightmap`||!options.app.heightmapEditor.showDrainage)return;let e=f(`heightmapEditMode`).innerHTML;st(e!==`keep`&&options.app.heightmapEditor.allowErosion)}function St(e){h.message({title:y(`Edit Heightmap`),message:`${y(`Heightmap is a core element on which all other data (rivers, burgs, states etc) is based. So the best edit approach is to erase the secondary data and let the system automatically regenerate it on edit completion.`)}
    <p>${y(`Erase mode also allows you Convert an Image into a heightmap or use Template Editor.`)}</p>
    <p>${y(`You can keep the data, but you won't be able to change the coastline.`)}</p>
    <p>${y(`Try risk mode to change the coastline and keep the data. The data will be restored as much as possible, but it can cause unpredictable errors.`)}</p>
    <p>${y(`Please {{- save}} before editing the heightmap!`,{save:`<span id="modeDialogSave" class="pseudoLink">${y(`save the map`)}</span>`})}</p>
    <p style="margin-bottom: 0">${y(`Check out {{- wiki}} for guidance.`,{wiki:ye(`https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Heightmap-customization`,y(`wiki`))})}</p>`,width:`28em`,buttons:[{label:y(`Erase`),onClick:()=>J(`erase`,e)},{label:y(`Keep`),onClick:()=>J(`keep`,e)},{label:y(`Risk`),onClick:()=>J(`risk`,e)},{label:y(`Cancel`)}]}),f(`modeDialogSave`).addEventListener(`click`,()=>fe.Save.toMachine())}function J(e,t){yt=N.state.active,N.set([]),options.app.mode=`heightmap`,h.closeAll(),F(y(`Heightmap edit mode is active. Click on “Exit Customization” to finalize the heightmap`),!0),f(`options`).querySelectorAll(`.tabcontent`).forEach(e=>{e.style.display=`none`}),f(`options`).querySelector(`.tab > .active`).classList.remove(`active`),f(`heightmapMenu`).style.display=`block`,f(`toolsTab`).classList.add(`active`),f(`heightmapEditMode`).innerHTML=e;for(let e of pt)f(e).checked=options.app.heightmapEditor[e];e===`erase`?(ee(),U.cellType=`all`):e===`keep`?(N.get(`landmass`).getEl().replaceChildren(),U.cellType=`land`):e===`risk`&&(ht=grid.cells.h.slice(),p(`#deftemp`).selectAll(`#land, #water`).selectAll(`path`).remove(),p(`#deftemp`).select(`#featurePaths`).selectAll(`path`).remove(),p(`#viewbox`).selectAll(`#coastline use, #lakes path, #oceanLayers path`).remove(),U.cellType=`all`);let n=c(`cellTypeFilter`);n&&(n.value=U.cellType),P.set(H,`filters`,U),f(`applyTemplate`).style.display=e===`erase`?`inline-block`:`none`,f(`convertImage`).style.display=e===`erase`?`inline-block`:`none`,f(`allowErosionBox`).style.display=e===`keep`?`none`:`inline-block`;let r=f(`heightmapFinalize`);if(sessionStorage.getItem(`noExitButtonAnimation`))r.style.display=`block`;else{sessionStorage.setItem(`noExitButtonAnimation`,`true`),r.style.opacity=`0`;let e=12*f(`uiSize`).value*11;r.style.right=`${(ce.width-e)/2}px`,r.style.bottom=`${ce.height/2}px`,r.style.transform=`scale(2)`,r.style.display=`block`,p(`#heightmapFinalize`).transition().duration(1e3).style(`opacity`,1).transition().duration(2e3).ease(se).style(`right`,`10px`).style(`bottom`,`10px`).style(`transform`,`scale(1)`)}let i=f(`layersPreset`);i.value=`heightmap`,i.disabled=!0,X(),q(),p(`#viewbox`).on(`touchmove mousemove`,Ct),p(`#map`).on(`dblclick.zoom`,null),t===`templateEditor`?Qt():t===`imageConverter`?pn():Pt()}function Ct(e){let[t,n]=s(e,this),r=k.findCell(t,n);f(`heightmapInfoX`).innerHTML=String(_(t)),f(`heightmapInfoY`).innerHTML=String(_(n)),f(`heightmapInfoCell`).innerHTML=String(r),f(`heightmapInfoHeight`).innerHTML=`${grid.cells.h[r]} (${wt(grid.cells.h[r])})`,f(`tooltip`).dataset.main&&_e();let i=c(`brushesButtons`)?.querySelector(`button.pressed`);i&&(i.id===`brushLine`?p(`#debug`).select(`line`).attr(`x2`,t).attr(`y2`,n):i.id===`brushFill`?le():ue(t,n,f(`heightmapBrushRadius`).valueAsNumber))}function wt(e){return`${_(j(e)*A())} ${options.map.units.height.unit}`}async function Tt(){if(p(`#viewbox`).select(`#heights`).selectAll(`*`).size()<200){F(y(`Insufficient land area. There should be at least 200 land cells!`),!1,`error`);return}W=Object.assign([],{n:0}),Z(!0,!0),M.clearData(),options.app.mode=null,f(`heightmapMenu`).style.display=`none`,f(`options`).querySelector(`.tab > button.active`).id===`toolsTab`&&(f(`toolsContent`).style.display=`block`),f(`layersPreset`).disabled=!1,f(`heightmapFinalize`).style.display=`none`,h.closeAll(),te(),ve(),me(),c(`preview`)?.remove(),c(`canvas3d`)&&m.View3d.enterStandard();let e=f(`heightmapEditMode`).innerHTML;try{e===`erase`?await Et():e===`keep`?Dt():e===`risk`&&Ot()}catch(t){x.error(t);let n=y(`Failed to apply the edited heightmap: {{error}}`,{error:t.message});F(e===`risk`?b(n,y(`The map is unchanged`)):n,!1,`error`,6e3)}ht=null,p(`#viewbox`).selectAll(`#heights`).remove(),lt(),N.draw(`ocean`,`landmass`,`lakes`,`coastline`),N.set(yt)}async function Et(){pack.cultures=[],pack.burgs=[],pack.states=[],pack.provinces=[],pack.religions=[],pack.relief=[];let e=options.app.heightmapEditor.allowErosion;await E.run({erosion:e})}function Dt(){for(let e of pack.cells.i)pack.cells.h[e]=grid.cells.h[pack.cells.g[e]]}function Ot(){let e=grid.cells.h;grid.cells.h=ht,ne.applyHeights(e,{erosion:options.app.heightmapEditor.allowErosion}),D(),p(`#ice`).selectAll(`*`).remove()}function Y(){let e=Se(W),t=grid.cells.h.reduce((t,n,r)=>n===e[r]?t:t+1,0);if(F(y(`Cells changed: {{cells}}`,{cells:t})),!t)return;let n=c(`cellTypeFilter`)?.value??U.cellType;if(n===`land`)for(let t of grid.cells.i)(e[t]<20||grid.cells.h[t]<20)&&(grid.cells.h[t]=e[t]);if(n===`water`)for(let t of grid.cells.i)(e[t]>=20||grid.cells.h[t]>=20)&&(grid.cells.h[t]=e[t]);X(),Q()}var kt=e=>ie.getColor(e);function X(){let e=Array.from(grid.cells.i),t=options.app.heightmapEditor.renderOcean?e:e.filter(e=>grid.cells.h[e]>=20);p(`#viewbox`).select(`#heights`).selectAll(`polygon`).data(t).join(`polygon`).attr(`points`,e=>String(k.getPolygon(e))).attr(`id`,e=>`cell${e}`).attr(`fill`,e=>kt(grid.cells.h[e]))}function At(e){let t=options.app.heightmapEditor.renderOcean;e.forEach(e=>{let n=p(`#viewbox`).select(`#heights`).select(`#cell${e}`);!t&&grid.cells.h[e]<20?n.remove():(n.size()||(n=p(`#viewbox`).select(`#heights`).append(`polygon`).attr(`points`,String(k.getPolygon(e))).attr(`id`,`cell${e}`)),n.attr(`fill`,kt(grid.cells.h[e])))})}function jt(){let e=grid.cells.h.reduce((e,t)=>t>=20?e+1:e,0);f(`landmassCounter`).textContent=`${e} (${_(e/grid.cells.i.length*100)}%)`,f(`landmassAverage`).textContent=String(_(ke(grid.cells.h)??0))}function Z(e,t){let n=(n,r)=>{let i=c(n);i&&(i.disabled=e);let a=c(r);a&&(a.disabled=t)};n(`undo`,`redo`),n(`templateUndo`,`templateRedo`)}function Q(e){let t=W.n;if(W=Object.assign(W.slice(0,t),{n:t+1}),W[t]=grid.cells.h.slice(),W.length>mt){let e=W.length-mt;W.splice(0,e),W.n-=e}Z(W.n<=1,!0),e||(jt(),Mt())}function Mt(){c(`preview`)&&kn(),c(`canvas3d`)&&m.View3d.redraw(),q()}function $(e){W.n=e,Z(W.n<=1,W.n>=W.length),W[W.n-1]!==void 0&&(grid.cells.h=W[W.n-1].slice(),X(),jt(),Mt())}function Nt(){W=Object.assign([],{n:0}),Z(!0,!0),Q()}function Pt(){c(`brushesPanel`)||(Ft(),h.open(`brushesPanel`,{title:y(`Paint Brushes`),position:{my:`right top`,at:`right-10 top+10`,of:`svg`},onClose:It}))}function Ft(){h.destroy(`brushesPanel`);let e=`<div id="brushesPanel" class="dialog stable">
    <div id="brushesButtons" style="display: inline-block">
      <button id="brushRaise" data-tip="${y(`Raise brush: increase height of cells in radius by Power value`)}">
        <svg viewBox="15 15 70 70" height="1em" width="1.6em">
          <path d="m20,39 h60 M50,85 v-35 l-12,8 m12,-8 l12,8" fill="none" stroke="#000" stroke-width="5" />
        </svg>
      </button>
      <button id="brushElevate" data-tip="${y(`Elevate brush: drag to gradually increase height of cells in radius by Power value`)}">
        <svg viewBox="15 15 70 70" height="1em" width="1.6em">
          <path d="m20,50 q30,-35 60,0 M50,85 v-35 l-12,8 m12,-8 l12,8" fill="none" stroke="#000" stroke-width="5" />
        </svg>
      </button>
      <button id="brushLower" data-tip="${y(`Lower brush: drag to decrease height of cells in radius by Power value`)}">
        <svg viewBox="15 15 70 70" height="1em" width="1.6em">
          <path d="M50,30 v35 l-12,-8 m12,8 l12,-8 M20,78 h60" fill="none" stroke="#000" stroke-width="5" />
        </svg>
      </button>
      <button id="brushDepress" data-tip="${y(`Depress brush: drag to gradually decrease height of cells in radius by Power value`)}">
        <svg viewBox="15 15 70 70" height="1em" width="1.6em">
          <path d="M50,30 v35 l-12,-8 m12,8 l12,-8 M20,63 q30,35 60,0" fill="none" stroke="#000" stroke-width="5" />
        </svg>
      </button>
      <button id="brushAlign" data-tip="${y(`Align brush: drag to set height of cells in radius to height of the cell at mousepoint`)}">
        <svg viewBox="15 15 70 70" height="1em" width="1.6em">
          <path d="m20,50 h56 m0,20 h-56" fill="none" stroke="#000" stroke-width="5" />
        </svg>
      </button>
      <button id="brushSmooth" data-tip="${y(`Smooth brush: drag to level height of cells in radius to height of adjacent cells`)}">
        <svg viewBox="15 15 70 70" height="1em" width="1.6em">
          <path d="m15,60 q15,-15 30,0 q15,15 35,0" fill="none" stroke="#000" stroke-width="5" />
        </svg>
      </button>
      <button id="brushDisrupt" data-tip="${y(`Disrupt brush: drag to randomize height of cells in radius based on Power value`)}">
        <svg viewBox="15 15 70 70" height="1em" width="1.6em">
          <path d="m15,63 l15,-13 15,20 15,-20 15,19 15,-14" fill="none" stroke="#000" stroke-width="5" />
        </svg>
      </button>
      <button id="brushFill" data-tip="${y(`Fill: click enclosed water or same-height land area to create a cone blob`)}">
        <svg viewBox="20 10 60 60" height="1em" width="1.6em">
          <path d="M30,70 h40 M30,70 q0,-20 20,-20 q20,0 20,20" fill="none" stroke="#000" stroke-width="5" />
          <path d="M50,20 v25 M50,20 l-10,8 M50,20 l10,8" fill="none" stroke="#000" stroke-width="5" />
        </svg>
      </button>
      <button id="brushLine" data-tip="${y(`Line: select two points to change heights along the line`)}">
        <svg viewBox="0 -5 100 100" height="1em" width="1.6em">
          <path d="M0 90 L100 10" fill="none" stroke="#000" stroke-width="7"></path>
        </svg>
      </button>
    </div>
    <div id="brushesSliders" style="display: none">
      <div data-tip="${b(y(`Change brush size`),y(`Shortcut: + to increase; – to decrease`))}">
        <slider-input id="heightmapBrushRadius" data-brush-size min="1" max="100" value="25">
          <div style="width: 3.5em">${y(`Radius`)}:</div>
        </slider-input>
      </div>
      <div data-tip="${y(`Change brush power`)}">
        <slider-input id="heightmapBrushPower" data-brush-size min="1" max="10" value="5">
          <div style="width: 3.5em">${y(`Power`)}:</div>
        </slider-input>
      </div>
    </div>
    <div id="lineSlider" style="display: none">
      <div data-tip="${b(y(`Change tool power`),y(`Shortcut: + to increase; – to decrease`))}">
        <slider-input id="heightmapLinePower" data-brush-size min="-100" max="100" value="30">
          <div style="width: 5.5em">${y(`Power`)}:</div>
        </slider-input>
      </div>
      <div data-tip="${y(`Change line randomness. Zero makes the line as straight as possible`)}">
        <slider-input id="heightmapLineRandomness" min="0" max="100" value="30">
          <div style="width: 5.5em">${y(`Randomness`)}:</div>
        </slider-input>
      </div>
    </div>
    <div data-tip="${y(`Restrict brush to specific cell types`)}" style="margin-bottom: 0.6em">
      <label for="cellTypeFilter"><i>${y(`Cells to change`)}:</i></label>
      <select id="cellTypeFilter">
        <option value="all" ${U.cellType===`all`?`selected`:``}>${y(`all cells`)}</option>
        <option value="land" ${U.cellType===`land`?`selected`:``}>${y(`only land cells`)}</option>
        <option value="water" ${U.cellType===`water`?`selected`:``}>${y(`only water cells`)}</option>
      </select>
    </div>
    <div id="modifyButtons">
      <button id="undo" data-tip="${y(`Undo the latest action (Ctrl + Z)`)}" class="icon-ccw" disabled></button>
      <button id="redo" data-tip="${y(`Redo the action (Ctrl + Y)`)}" class="icon-cw" disabled></button>
      <button id="rescaleShow" data-tip="${y(`Show`)}" class="icon-exchange"></button>
      <button id="rescaleCondShow" data-tip="${y(`Rescaler: change height if condition is fulfilled`)}" class="icon-if"></button>
      <button id="smoothHeights" data-tip="${y(`Smooth all heights a bit`)}" class="icon-smooth"></button>
      <button id="disruptHeights" data-tip="${y(`Disrupt (randomize) heights a bit`)}" class="icon-disrupt"></button>
      <button id="brushClear" data-tip="${y(`Set height for all cells to 0 (erase the map)`)}" class="icon-eraser"></button>
    </div>
    <div id="rescaleSection" style="display: none">
      <button id="rescaleHide" data-tip="${y(`Hide`)}" class="icon-exchange"></button>
      <input id="rescaler" data-tip="${y(`Change height for all cells`)}" type="range" min="-10" max="10" step="1" value="0" />
    </div>
    <div
      id="rescaleCondSection"
      data-tip="${y(`If height is greater or equal to X and less or equal to Y, then perform an operation Z with operand V`)}"
      style="display: none"
    >
      <button id="rescaleCondHide" data-tip="${y(`Hide`)}" class="icon-if"></button>
      <label>h ≥</label>
      <input id="rescaleLower" value="20" type="number" min="0" max="100" />
      <label>≤</label>
      <input id="rescaleHigher" value="100" type="number" min="1" max="100" />
      <label>⇒</label>
      <select id="conditionSign">
        <option value="multiply" selected>×</option>
        <option value="divide">÷</option>
        <option value="add">+</option>
        <option value="subtract">-</option>
        <option value="exponent">^</option>
      </select>
      <input id="rescaleModifier" type="number" value="0.9" min="0" max="1.5" step="0.01" />
      <button id="rescaleExecute" data-tip="${y(`Click to perform an operation`)}" class="icon-play-circled2"></button>
    </div>
  </div>`;f(`dialogs`).insertAdjacentHTML(`beforeend`,e),Lt()}function It(){Rt(),h.destroy(`brushesPanel`)}function Lt(){f(`brushesButtons`).addEventListener(`click`,zt),f(`cellTypeFilter`).addEventListener(`change`,Kt),f(`undo`).addEventListener(`click`,()=>$(W.n-1)),f(`redo`).addEventListener(`click`,()=>$(W.n+1)),f(`rescaleShow`).addEventListener(`click`,()=>{f(`modifyButtons`).style.display=`none`,f(`rescaleSection`).style.display=`block`}),f(`rescaleHide`).addEventListener(`click`,()=>{f(`modifyButtons`).style.display=`block`,f(`rescaleSection`).style.display=`none`}),f(`rescaler`).addEventListener(`change`,e=>qt(e.target.valueAsNumber)),f(`rescaleCondShow`).addEventListener(`click`,()=>{f(`modifyButtons`).style.display=`none`,f(`rescaleCondSection`).style.display=`block`}),f(`rescaleCondHide`).addEventListener(`click`,()=>{f(`modifyButtons`).style.display=`block`,f(`rescaleCondSection`).style.display=`none`}),f(`rescaleExecute`).addEventListener(`click`,Jt),f(`smoothHeights`).addEventListener(`click`,Yt),f(`disruptHeights`).addEventListener(`click`,Xt),f(`brushClear`).addEventListener(`click`,Zt)}function Rt(){let e=document.querySelector(`#brushesButtons > button.pressed`);e&&e.classList.remove(`pressed`),te(),p(`#map`).on(`dblclick.zoom`,null),p(`#viewbox`).on(`touchmove mousemove`,Ct),p(`#debug`).selectAll(`#brushCircle, .lineCircle`).remove(),le(),f(`brushesSliders`).style.display=`none`,f(`lineSlider`).style.display=`none`}function zt(e){let t=e.target.closest(`#brushesButtons > button`);if(!t)return;if(t.classList.contains(`pressed`)){Rt();return}Rt(),t.classList.add(`pressed`);let n=f(`heightmapBrushRadius`).parentElement;n&&(n.style.display=t.id===`brushFill`?`none`:``),t.id===`brushLine`?(f(`lineSlider`).style.display=`block`,p(`#viewbox`).style(`cursor`,`crosshair`).on(`click`,Bt)):t.id===`brushFill`?(f(`brushesSliders`).style.display=`block`,p(`#viewbox`).style(`cursor`,`crosshair`).on(`click`,Vt)):(f(`brushesSliders`).style.display=`block`,p(`#viewbox`).style(`cursor`,`crosshair`).call(re().on(`start`,Wt)))}function Bt(e){let[t,n]=s(e,this),r=k.findCell(t,n),i=p(`#debug`).selectAll(`.lineCircle`);if(!i.size()){p(`#debug`).append(`line`).attr(`id`,`brushCircle`).attr(`x1`,t).attr(`y1`,n).attr(`x2`,t).attr(`y2`,n),p(`#debug`).append(`circle`).attr(`data-cell`,r).attr(`class`,`lineCircle`).attr(`cx`,t).attr(`cy`,n).attr(`fill`,`yellow`).attr(`stroke`,`#333`);return}let a=+i.attr(`data-cell`);p(`#debug`).selectAll(`*`).remove();let o=f(`heightmapLinePower`).valueAsNumber;if(o===0){F(y(`Power should not be zero`),!1,`error`);return}let c=f(`heightmapLineRandomness`).valueAsNumber/200,l=grid.cells.h,u=o>0?M.addRange.bind(M):M.addTrough.bind(M);M.setGraph(grid),u(`1`,String(Math.abs(o)),``,``,a,r,c);let d=M.getHeights(),m=f(`cellTypeFilter`).value,h=[];for(let e=0;e<l.length;e++)d[e]!==l[e]&&(m===`land`&&l[e]<20||m===`water`&&l[e]>=20||(l[e]=d[e],h.push(e)));At(h),Q()}function Vt(e){let[t,n]=s(e,this),r=k.findCell(t,n),i=grid.cells.h[r],a=i<20,o=f(`cellTypeFilter`).value;if(o===`water`){F(y(`Fill brush is not available with 'only water cells' filter`),!1,`error`);return}if(o===`land`&&a){F(y(`Land filter is active, water areas cannot be filled`),!1,`error`);return}let{selection:c,reachedBorder:l}=Ht(r,a,i);if(c.length<3){F(y(`No enclosed area found to fill`),!1,`error`);return}if(a&&l){F(y(`Selected water area is open to map border and is not enclosed`),!1,`error`);return}let u=Ut(c,a,i);u.length&&(At(u),Y())}function Ht(e,t,n){let{h:r,c:i,i:a}=grid.cells,o=new Uint8Array(a.length),s=[e],c=[],l=!1;for(;s.length;){let e=s.pop();o[e]||(o[e]=1,(t?r[e]<20:r[e]===n)&&(c.push(e),grid.cells.b[e]&&(l=!0),i[e].forEach(e=>{o[e]||s.push(e)})))}return{selection:c,reachedBorder:l}}function Ut(e,t,n){let r=f(`heightmapBrushPower`).valueAsNumber*10,{h:i,c:a,i:o}=grid.cells,s=new Uint8Array(o.length),c=new Uint16Array(o.length),l=[];e.forEach(e=>{s[e]=1});let u=[],d=0;for(e.forEach(e=>{a[e].some(e=>!s[e])&&(s[e]=2,u.push(e))});d<u.length;){let e=u[d++],t=c[e]+1;a[e].forEach(e=>{s[e]===1&&(s[e]=2,c[e]=t,u.push(e))})}let p=De(e,e=>c[e])||0,m=t?20:n;return e.forEach(e=>{let t=p?c[e]/p:1,n=Math.max(1,Math.round(r*t)),a=v(m+n,0,100);a!==i[e]&&(i[e]=a,l.push(e))}),l}function Wt(e){let t=f(`heightmapBrushRadius`).valueAsNumber,[n,r]=s(e,this),i=k.findCell(n,r),a=Ce(t/2,(e,n)=>{let r=k.findAll(e,n,t),a=r,o=f(`cellTypeFilter`).value;o===`land`?a=r.filter(e=>grid.cells.h[e]>=20):o===`water`&&(a=r.filter(e=>grid.cells.h[e]<20)),a?.length&&Gt(a,i)});a.moveTo(n,r),e.on(`drag`,e=>{let[n,r]=s(e,this);ue(n,r,t),a.moveTo(n,r)}),e.on(`end`,Y)}function Gt(e,t){let n=f(`heightmapBrushPower`).valueAsNumber,r=g(n,1),i=f(`cellTypeFilter`).value===`land`,a=f(`cellTypeFilter`).value===`water`,o=e=>v(e,i?20:0,a?19:100),s=grid.cells.h,c=document.querySelector(`#brushesButtons > button.pressed`).id;c===`brushRaise`?e.forEach(e=>{s[e]=!a&&s[e]<20?20:o(s[e]+n)}):c===`brushElevate`?e.forEach((t,n)=>{s[t]=o(s[t]+r(n/Math.max(e.length-1,1)))}):c===`brushLower`?e.forEach(e=>{s[e]=o(s[e]-n)}):c===`brushDepress`?e.forEach((t,n)=>{s[t]=o(s[t]-r(n/Math.max(e.length-1,1)))}):c===`brushAlign`?e.forEach(e=>{s[e]=o(s[t])}):c===`brushSmooth`?e.forEach(e=>{s[e]=_(((ke(grid.cells.c[e].filter(e=>i?s[e]>=20:!a||s[e]<20).map(e=>s[e]))??0)+s[e]*(10-n)+.6)/(11-n),1)}):c===`brushDisrupt`&&e.forEach(e=>{s[e]=s[e]<15?s[e]:o(s[e]+n/1.6-Math.random()*n)}),At(e)}function Kt(){let e=f(`cellTypeFilter`);e.value===`land`&&f(`heightmapEditMode`).innerHTML===`keep`&&(F(y(`You cannot change the coastline in 'Keep' edit mode`),!1,`error`),e.value=`all`),U.cellType=e.value,P.set(H,`filters`,U)}function qt(e){let t=f(`cellTypeFilter`).value===`land`,n=f(`cellTypeFilter`).value===`water`;grid.cells.h=grid.cells.h.map(r=>{if(t&&(r<20||r+e<20)||n&&r>=20)return r;let i=S(r+e);return n?Math.min(i,19):i}),Y(),f(`rescaler`).value=`0`}function Jt(){let e=`${f(`rescaleLower`).value}-${f(`rescaleHigher`).value}`,t=f(`conditionSign`).value,n=f(`rescaleModifier`).valueAsNumber;Number.isNaN(n)?F(y(`Operand should be a number`),!1,`error`):(t===`add`||t===`subtract`)&&!Number.isInteger(n)?F(y(`Operand should be an integer`),!1,`error`):(M.setGraph(grid),t===`multiply`?M.modify(e,0,n,0):t===`divide`?M.modify(e,0,1/n,0):t===`add`?M.modify(e,n,1,0):t===`subtract`?M.modify(e,-1*n,1,0):t===`exponent`&&M.modify(e,0,1,n),grid.cells.h=M.getHeights(),Y())}function Yt(){M.setGraph(grid),M.smooth(4,1.5),grid.cells.h=M.getHeights(),Y()}function Xt(){grid.cells.h=grid.cells.h.map(e=>e<15?e:S(e+2.5-Math.random()*4)),Y()}function Zt(){let e=f(`cellTypeFilter`).value;e===`land`?F(y(`Not allowed when 'only land cells' filter is set`),!1,`error`):e===`water`?F(y(`Not allowed when 'only water cells' filter is set`),!1,`error`):grid.cells.h.some(e=>e)?(grid.cells.h=new Uint8Array(grid.cells.i.length),p(`#viewbox`).select(`#heights`).selectAll(`*`).remove(),Q()):F(y(`Heightmap is already cleared, please do not click twice if not required`),!1,`error`)}function Qt(){c(`templateEditor`)||(_t(),h.open(`templateEditor`,{title:y(`Template Editor`),width:`fit-content`,position:{my:`right top`,at:`right-10 top+10`,of:`svg`},onClose:$t}))}function $t(){h.destroy(`templateEditor`)}function en(e){let t=e.target;if(t.tagName!==`BUTTON`)return;let n=t.dataset.type;f(`templateBody`).dataset.changed=`1`,tn(n)}function tn(e,t,n,r,i){let a=f(`templateBody`);a.insertAdjacentHTML(`beforeend`,rn(e,t,n,r,i));let o=a.querySelector(`div:last-child > span > .templateDist`);if(o&&o.addEventListener(`change`,an),n&&o&&o.tagName===`SELECT`){for(let e of Array.from(o.options))e.value===n&&(o.value=n);if(o.value!==n){let e=document.createElement(`option`);e.value=e.innerHTML=n,o.add(e),o.value=n}}}var nn={Hill:y(`Hill`),Pit:y(`Pit`),Range:y(`Range`),Trough:y(`Trough`),Strait:y(`Strait`),Mask:y(`Mask`),Invert:y(`Invert`),Add:y(`Add`),Multiply:y(`Multiply`),Smooth:y(`Smooth`)};function rn(e,t,n,r,i){let a=`<i class="icon-trash-empty pointer" data-tip="${y(`Remove`)}"></i>`,o=`<div class="icon-check" data-tip="${y(`Click to skip the step`)}"></div>`,s=`<i class="icon-resize-vertical" data-tip="${y(`Drag to reorder`)}"></i>`,c=`<div data-type="${e}">${o}<div style="width:4em">${nn[e]??e}</div>${a}${s}`,l=`<span>y:
      <input class="templateY" data-tip="${y(`Placement range percentage along Y axis (minY-maxY)`)}" value=${i||`20-80`} />
    </span>`,u=`<span>x:
      <input class="templateX" data-tip="${y(`Placement range percentage along X axis (minX-maxX)`)}" value=${r||`15-85`} />
    </span>`,d=`<span>h:
      <input class="templateHeight" data-tip="${y(`Blob maximum height, use hyphen to get a random number in range`)}" value=${n||`40-50`} />
    </span>`,f=`<span>n:
      <input class="templateCount" data-tip="${y(`Blobs to add, use hyphen to get a random number in range`)}" value=${t||`1-2`} />
    </span>`;return e===`Hill`||e===`Pit`||e===`Range`||e===`Trough`?`${c}${l}${u}${d}${f}</div>`:e===`Strait`?`${c}
      <span>d:
        <select class="templateDist" data-tip="${y(`Strait direction`)}">
          <option value="vertical" selected>${y(`vertical`)}</option>
          <option value="horizontal">${y(`horizontal`)}</option>
        </select>
      </span>
      <span>w:
        <input class="templateCount" data-tip="${y(`Strait width, use hyphen to get a random number in range`)}" value=${t||`2-7`} />
      </span>
    </div>`:e===`Invert`?`${c}
      <span>${y(`by`)}:
        <select class="templateDist" data-tip="${y(`Mirror heightmap along axis`)}" style="width: 7.8em">
          <option value="x" selected>x</option>
          <option value="y">y</option>
          <option value="xy">${y(`both`)}</option>
        </select>
      </span>
      <span>n:
        <input class="templateCount" data-tip="${y(`Probability of inversion, range 0-1`)}" value=${t||`0.5`} />
      </span>
    </div>`:e===`Mask`?`${c}
      <span>f:
        <input class="templateCount"
          data-tip="${y(`Set masking fraction. 1 - full insulation (prevent land on map edges), 2 - half-insulation, etc. Negative number to inverse the effect`)}"
          type="number" min=-10 max=10 value=${t||1} />
      </span>
    </div>`:e===`Add`?`${c}
      <span>${y(`to`)}:
        <select class="templateDist" data-tip="${y(`Change only land or all cells`)}">
          <option value="all" selected>${y(`all cells`)}</option>
          <option value="land">${y(`land only`)}</option>
          <option value="interval">${y(`Interval`)}</option>
        </select>
      </span>
      <span>v:
        <input class="templateCount" data-tip="${y(`Add value to height of all cells (negative values are allowed)`)}"
        type="number" value=${t||-10} min=-100 max=100 step=1 />
      </span>
    </div>`:e===`Multiply`?`${c}
      <span>${y(`to`)}:
        <select class="templateDist" data-tip="${y(`Change only land or all cells`)}">
          <option value="all" selected>${y(`all cells`)}</option>
          <option value="land">${y(`land only`)}</option>
          <option value="interval">${y(`Interval`)}</option>
        </select>
      </span>
      <span>v:
        <input class="templateCount" data-tip="${y(`Multiply all cells Height by the value`)}" type="number"
          value=${t||1.1} min=0 max=10 step=.1 />
      </span>
    </div>`:e===`Smooth`?`${c}
      <span>f:
        <input class="templateCount" data-tip="${y(`Set smooth fraction. 1 - full smooth, 2 - half-smooth, etc.`)}"
          type="number" min=1 max=10 step=1 value=${t||2} />
      </span>
    </div>`:``}function an(e){let t=e.target;t.value===`interval`&&h.prompt(y(`Set a height interval. Avoid space, use hyphen as a separator`),{default:`17-20`},e=>{let n=document.createElement(`option`);n.value=n.innerHTML=String(e),t.add(n),t.value=String(e)})}function on(e){let t=f(`templateBody`),n=t.querySelectorAll(`div`).length,r=+t.getAttribute(`data-changed`),i=e.target.value;!n||!r?sn(i):h.message({message:y(`Are you sure you want to select a different template? All changes will be lost.`),title:y(`Change Template`),buttons:[{label:y(`Change`),onClick:()=>{sn(i)}},{label:y(`Cancel`)}]})}function sn(e){let t=f(`templateBody`);t.setAttribute(`data-changed`,`0`),t.innerHTML=``;let n=T[e]?.template;if(!n)return;let r=n.split(`
`);if(!r.length)F(y(`Heightmap template: no steps defined`),!1,`error`);else for(let e of r){let t=e.trim().split(` `);tn(t[0],t[1],t[2],t[3],t[4])}}function cn(){let e=f(`templateBody`).querySelectorAll(`#templateBody > div`);if(!e.length)return;let t=f(`templateSeed`).value;Math.random=(0,Ye.default)(t||Oe()),grid.cells.h=new Uint8Array(grid.points.length),M.setGraph(grid),Nt();for(let t of e){if(t.style.opacity===`0.5`)continue;let e=t.querySelector(`.templateCount`)?.value||``,n=t.querySelector(`.templateHeight`)?.value||``,r=t.querySelector(`.templateDist`)?.value||``,i=t.querySelector(`.templateX`)?.value||``,a=t.querySelector(`.templateY`)?.value||``,o=t.dataset.type;o===`Hill`?M.addHill(e,n,i,a):o===`Pit`?M.addPit(e,n,i,a):o===`Range`?M.addRange(e,n,i,a):o===`Trough`?M.addTrough(e,n,i,a):o===`Strait`?M.addStrait(e,r):o===`Mask`?M.mask(+e):o===`Invert`?M.invert(+e,r):o===`Add`?M.modify(r,+e,1):o===`Multiply`?M.modify(r,0,+e):o===`Smooth`&&M.smooth(+e),grid.cells.h=M.getHeights(),Q(`noStat`)}grid.cells.h=M.getHeights(),jt(),X(),Mt()}function ln(){let e=f(`templateBody`);e.dataset.changed=`0`;let t=e.querySelectorAll(`#templateBody > div`);if(!t.length)return;let n=``;for(let e of Array.from(t)){if(e.style.opacity===`0.5`)continue;let t=e.getAttribute(`data-type`),r=e.querySelector(`.templateCount`)?.value||`0`,i=e.querySelector(`.templateHeight`)?.value||e.querySelector(`.templateDist`)?.value||`0`,a=e.querySelector(`.templateX`)?.value||`0`,o=e.querySelector(`.templateY`)?.value||`0`;n+=`${t} ${r} ${i} ${a} ${o}\r\n`}let r=`template_${Date.now()}.txt`;Te(n,r)}function un(){G??=Ee(`.txt`),G.onchange=()=>we(G,dn),G.click()}function dn(e){let t=e.split(/\r?\n/).filter(Boolean);if(!t.length)F(y(`Cannot parse the template, please check the file`),!1,`error`);else{f(`templateBody`).innerHTML=``;for(let e of t){let t=e.split(` `);t.length===5?tn(t[0],t[1],t[2],t[3],t[4]):x.error(`Cannot parse step, wrong arguments count`,e)}}}function fn(){K??=Ee(`image/*`),K.onchange=()=>gn.call(K),K.click()}function pn(){if(c(`imageConverter`))return;fn(),h.closeAll(`#imageConverter`),vt(),h.open(`imageConverter`,{title:y(`Image Converter`),maxHeight:ce.height*.8,width:`20em`,position:{my:`right top`,at:`right-10 top+10`,of:`svg`},beforeClose:Dn});let e=document.createElement(`canvas`);e.id=`canvas`,e.width=options.map.graph.width,e.height=options.map.graph.height,document.body.insertBefore(e,f(`optionsContainer`)),Cn(0),mn(!0),ve(),F(y(`Image Converter is opened. Upload image and assign height value for each color`),!1,`warn`),grid.cells.h=new Uint8Array(grid.cells.i.length),p(`#viewbox`).select(`#heights`).selectAll(`*`).remove(),Q()}function mn(e){for(let t of[`customizeTools`,`customizeOptions`]){let n=f(t);n.inert=e,n.style.opacity=e?`0.5`:``}f(`heightmapFinalize`).style.display=e?`none`:`block`}function hn(){let e=+this.getAttribute(`data-color`);f(`colorsSelectValue`).innerHTML=String(e),f(`colorsSelectFriendly`).innerHTML=wt(e);let t=f(`imageConverterPalette`).querySelector(`.hoveredColor`);t&&(t.className=``),this.className=`hoveredColor`}function gn(){let e=this.files[0];this.value=``;let t=new FileReader,n=new Image;n.onload=async()=>{let e=await tt(n);if(!c(`imageConverter`))return;let t=c(`imageToConvert`);e?(e.id=`imageToConvert`,e.style.display=`none`,t?t.replaceWith(e):document.body.appendChild(e),he(),_n(+f(`convertColors`).value),me()):t||Tn()},t.onloadend=()=>{n.src=t.result},t.readAsDataURL(e)}function _n(e){let t=c(`imageToConvert`);if(!t)return;let n=document.createElement(`canvas`);n.width=grid.cellsX,n.height=grid.cellsY,n.getContext(`2d`).drawImage(t,0,0,grid.cellsX,grid.cellsY);let r=new Xe.default({colors:e});r.sample(n);let i=r.reduce(n),a=r.palette(!0);p(`#viewbox`).select(`#heights`).selectAll(`*`).remove(),p(`#imageConverter`).selectAll(`div.color-div`).remove(),f(`colorsSelect`).style.display=`block`,f(`colorsUnassigned`).style.display=`block`,f(`colorsAssigned`).style.display=`none`,n.remove(),p(`#viewbox`).select(`#heights`).selectAll(`polygon`).data(Array.from(grid.cells.i)).join(`polygon`).attr(`points`,e=>String(k.getPolygon(e))).attr(`id`,e=>`cell${e}`).attr(`fill`,e=>`rgb(${i[e*4]}, ${i[e*4+1]}, ${i[e*4+2]})`).on(`click`,vn);let o=a.map(e=>`rgb(${e[0]}, ${e[1]}, ${e[2]})`);p(`#colorsUnassignedContainer`).selectAll(`div`).data(o).enter().append(`div`).attr(`data-color`,e=>e).style(`background-color`,e=>e).attr(`class`,`color-div`).on(`click`,yn),f(`colorsUnassignedNumber`).innerHTML=String(o.length)}function vn(){let e=this.getAttribute(`fill`);f(`imageConverter`).querySelector(`div[data-color="${e}"]`)?.click()}function yn(){p(`#viewbox`).select(`#heights`).selectAll(`.selectedCell`).attr(`class`,null);let e=this.classList.contains(`selectedColor`),t=f(`imageConverter`).querySelector(`div.selectedColor`);t&&t.classList.remove(`selectedColor`);let n=f(`imageConverterPalette`).querySelector(`div.hoveredColor`);if(n&&n.classList.remove(`hoveredColor`),f(`colorsSelectValue`).innerHTML=f(`colorsSelectFriendly`).innerHTML=`0`,e)return;if(this.classList.add(`selectedColor`),this.dataset.height){let e=+this.dataset.height;f(`imageConverterPalette`).querySelector(`div[data-color="${e}"]`)?.classList.add(`hoveredColor`),f(`colorsSelectValue`).innerHTML=String(e),f(`colorsSelectFriendly`).innerHTML=wt(e)}let r=this.getAttribute(`data-color`);p(`#viewbox`).select(`#heights`).selectAll(`polygon.selectedCell`).classed(`selectedCell`,!1),p(`#viewbox`).select(`#heights`).selectAll(`polygon[fill='${r}']`).classed(`selectedCell`,!0)}function bn(){let e=+this.dataset.color,t=ft(1-(e<20?e-5:e)/100),n=f(`imageConverter`).querySelector(`div.selectedColor`);n.style.backgroundColor=t,n.setAttribute(`data-color`,t),n.setAttribute(`data-height`,String(e)),p(`#viewbox`).select(`#heights`).selectAll(`.selectedCell`).each(function(){this.setAttribute(`fill`,t),this.setAttribute(`data-height`,String(e))}),n.parentNode.id===`colorsUnassignedContainer`&&(f(`colorsAssignedContainer`).appendChild(n),f(`colorsAssigned`).style.display=`block`,f(`colorsUnassignedNumber`).innerHTML=String(f(`colorsUnassignedContainer`).childElementCount-2),f(`colorsAssignedNumber`).innerHTML=String(f(`colorsAssignedContainer`).childElementCount-2))}function xn(e){let t=f(`colorsUnassignedContainer`),n=t.querySelectorAll(`div`);if(!n.length&&(_n(+f(`convertColors`).value),n=t.querySelectorAll(`div`),!n.length)){F(y(`No unassigned colors. Please load an image and click the button again`),!1,`error`);return}let r=e=>{let t=a(e).h;return t>300&&(t-=360),t>170?Math.abs(t-250)/3|0:Math.abs(t-250+20)/3|0},i=e=>{let t=Ve(e).l;return t<13?t/13*20|0:t|0},o=Ne(101).map(e=>kt(e)),s=o.map(e=>a(e).h|0),c=e=>{let t=o.indexOf(e);if(t!==-1)return t;let n=a(e).h,r=s.reduce((e,t)=>Math.abs(t-n)<Math.abs(e-n)?t:e);return s.indexOf(r)},l=[],u=f(`colorsAssignedContainer`);n.forEach(t=>{let n=t.dataset.color,a=e===`hue`?r(n):e===`lum`?i(n):c(n),o=ft(1-(a<20?(a-5)/100:a/100));p(`#viewbox`).select(`#heights`).selectAll(`polygon[fill='${n}']`).attr(`fill`,o).attr(`data-height`,a),l[a]?t.remove():(t.style.backgroundColor=t.dataset.color=o,t.dataset.height=String(a),u.appendChild(t),l[a]=!0)}),Array.from(u.children).sort((e,t)=>+e.dataset.height-t.dataset.height).forEach(e=>{u.appendChild(e)}),f(`colorsAssigned`).style.display=`block`,f(`colorsUnassigned`).style.display=`none`,f(`colorsAssignedNumber`).innerHTML=String(u.childElementCount-2)}function Sn(){h.prompt(`${y(`Set maximum number of colors`)}<br>${y(`An actual number is usually lower and depends on color scheme`)}`,{default:+f(`convertColors`).value,step:1,min:3,max:255},e=>{f(`convertColors`).value=String(e),_n(+e)})}function Cn(e){f(`convertOverlay`).value=f(`convertOverlayNumber`).value=String(e),f(`canvas`).style.opacity=String(e),he()}function wn(){f(`colorsAssignedContainer`).childElementCount<3?F(y(`Please assign colors to heights first`),!1,`error`):(p(`#viewbox`).select(`#heights`).selectAll(`polygon`).each(function(){let e=+(this.dataset.height??`0`)||0,t=+this.id.slice(4);grid.cells.h[t]=e}),p(`#viewbox`).select(`#heights`).selectAll(`polygon`).remove(),Y(),En())}function Tn(){En(),p(`#viewbox`).select(`#heights`).selectAll(`polygon`).remove(),$(W.n-1)}function En(){c(`canvas`)?.remove(),c(`imageToConvert`)?.remove(),mn(!1),p(`#imageConverter`).selectAll(`div.color-div`).remove(),f(`colorsAssigned`).style.display=`none`,f(`colorsUnassigned`).style.display=`none`,f(`colorsSelectValue`).innerHTML=f(`colorsSelectFriendly`).innerHTML=`0`,p(`#viewbox`).style(`cursor`,`default`).on(`.drag`,null),F(y(`Heightmap edit mode is active. Click on “Exit Customization” to finalize the heightmap`),!0),h.destroy(`imageConverter`),Pt()}function Dn(){return h.message({message:y(`Are you sure you want to close the Image Converter? Click “Cancel” to keep editing. Click “Complete” to apply the conversion and close the tool. Click “Close” to discard the conversion and restore the previous heightmap.`),title:y(`Close Image Converter`),buttons:[{label:y(`Cancel`)},{label:y(`Complete`),onClick:()=>{wn()}},{label:y(`Close`),onClick:()=>{En(),p(`#viewbox`).select(`#heights`).selectAll(`polygon`).remove(),$(W.n-1)}}]}),!1}function On(){let e=c(`preview`);if(e){e.remove();return}let t=document.createElement(`canvas`);t.id=`preview`;let n=k.getRaster();t.width=n.width,t.height=n.height,document.body.insertBefore(t,f(`optionsContainer`)),t.addEventListener(`mouseover`,()=>F(y(`Heightmap preview. Click to download a screen-sized image`))),t.addEventListener(`click`,An),kn()}function kn(){let e=f(`preview`).getContext(`2d`),t=k.getRaster(),n=e.createImageData(t.width,t.height);k.rasterize(grid.cells.h,t).forEach((e,t)=>{let r=(e<20?Math.max(e/1.5,0):e)/100*255,i=t*4;n.data[i]=r,n.data[i+1]=r,n.data[i+2]=r,n.data[i+3]=255}),e.putImageData(n,0,0)}function An(){let e=f(`preview`).toDataURL(`image/png`),t=new Image;t.src=e,t.onload=()=>{let e=document.createElement(`canvas`),n=e.getContext(`2d`);e.width=options.map.graph.width,e.height=options.map.graph.height,document.body.insertBefore(e,f(`optionsContainer`)),n.drawImage(t,0,0,options.map.graph.width,options.map.graph.height);let r=e.toDataURL(`image/png`),i=document.createElement(`a`);i.download=`${pe(`Heightmap`)}.png`,i.href=r,i.click(),e.remove()}}var jn={open:gt,redrawDrainage:q};export{jn as HeightmapEditor};