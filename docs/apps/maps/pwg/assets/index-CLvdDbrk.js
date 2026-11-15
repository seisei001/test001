(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={worldSize:1024,planetSize:4096,axialTilt:23.4,landFraction:.4,tectonicActivity:.5,geologicAge:.5,latNorth:65,latSouth:20,temperatureOffset:0,humidity:1,plateMul:1,plateSizeSkew:.4,continentMul:1,continentSizeSkew:.5,islandAbundance:1,coastRoughness:1.25,seaLevelRise:0,mapEdgeContinent:0,impactHistory:1,strataShare:.15,karstShare:.06,poleEquatorGradient:1};function t(t,n,r,i,a={}){for(let n of Object.keys(i))if(!(n in e))throw Error(`archetype ${t}: unknown bias ${n}`);return{id:t,label:n,blurb:r,bias:{...e,...i},pins:a}}var n=[t(`earth`,`Earth-like`,`Temperate-to-subtropical realm with a few continents, ranges and great rivers.`,{}),t(`archipelago`,`Archipelago`,`Mostly sea: island arcs, shelf islands and drowned ranges.`,{landFraction:.18,islandAbundance:2,continentMul:.6,coastRoughness:1.32,seaLevelRise:60}),t(`pangaea`,`Pangaea`,`One great landmass with a dry interior.`,{landFraction:.55,continentSizeSkew:.9,islandAbundance:.5},{continentCount:[1,1]}),t(`rift`,`Rift & great lakes`,`A continent pulling apart: rift valleys, long deep lakes, volcanoes.`,{tectonicActivity:.7,landFraction:.5,humidity:.95,latNorth:22,latSouth:-8},{riftCount:[2,3]}),t(`fjordland`,`Fjordland`,`Cold, high-latitude coast with glaciated mountains and drowned valleys.`,{latNorth:72,latSouth:55,temperatureOffset:-1,humidity:1.3,seaLevelRise:120,coastRoughness:1.4,tectonicActivity:.55,axialTilt:28},{fjords:!0}),t(`desert`,`Desert world`,`Hot and dry: ergs, mesas, salt flats and wadis.`,{latNorth:40,latSouth:10,temperatureOffset:3,humidity:.35,landFraction:.55,strataShare:.45,mapEdgeContinent:1}),t(`volcanic`,`Volcanic island chain`,`Hotspots and island arcs in warm seas, reefs and atolls.`,{landFraction:.15,tectonicActivity:.85,islandAbundance:1.8,latNorth:30,latSouth:5,humidity:1.2},{hotspotCount:[2,3]}),t(`iceage`,`Ice age`,`Glaciers reach low elevations; steppe and tundra expand.`,{temperatureOffset:-6,humidity:.75,latNorth:70,latSouth:25,poleEquatorGradient:1.15}),t(`hothouse`,`Hothouse tropics`,`No ice, rainforests far from the equator.`,{temperatureOffset:8,humidity:1.3,latNorth:75,latSouth:15,poleEquatorGradient:.6}),t(`craton`,`Old craton`,`Ancient, worn-down land: low relief, inselbergs, surviving impact craters.`,{tectonicActivity:.15,geologicAge:.9,impactHistory:2.5,karstShare:.12})],r=`earth`;function i(e){return n.find(t=>t.id===e)??n[0]}var a=class{a;b;c;d;constructor(e){let t=e>>>0,n=()=>{t=t+2654435769>>>0;let e=t;return e=Math.imul(e^e>>>16,2246822507)>>>0,e=Math.imul(e^e>>>13,3266489909)>>>0,(e^e>>>16)>>>0};this.a=n(),this.b=n(),this.c=n(),this.d=n();for(let e=0;e<12;e++)this.nextU32()}nextU32(){let e=(this.a+this.b>>>0)+this.d>>>0;return this.d=this.d+1>>>0,this.a=this.b^this.b>>>9,this.b=this.c+(this.c<<3)>>>0,this.c=this.c<<21|this.c>>>11,this.c=this.c+e>>>0,e}float(){return this.nextU32()/4294967296}range(e,t){return e+(t-e)*this.float()}int(e){return Math.floor(this.float()*e)}stateHash(){return(this.a^Math.imul(this.b,31)^Math.imul(this.c,131)^Math.imul(this.d,1031))>>>0}};function o(e){return e^=e>>>16,e=Math.imul(e,2246822507),e^=e>>>13,e=Math.imul(e,3266489909),e^=e>>>16,e>>>0}function s(e,t){return o((e^Math.imul(t>>>0,2654435761))+2135587861)}function c(e,t=2166136261){for(let n=0;n<e.length;n++)t=Math.imul(t^e.charCodeAt(n),16777619);return o(t)}function l(e,t=19088743){if(e==null)return s(t,57005);switch(typeof e){case`number`:return Number.isInteger(e)&&Math.abs(e)<2**31?s(s(t,1),e):c(String(e),s(t,2));case`string`:return c(e,s(t,3));case`boolean`:return s(s(t,4),+!!e);case`object`:{if(Array.isArray(e)){let n=s(t,5+e.length);for(let t of e)n=l(t,n);return n}let n=e,r=s(t,6);for(let e of Object.keys(n).sort())r=l(n[e],c(e,r));return r}default:throw Error(`hashValue: unsupported ${typeof e}`)}}function u(e,...t){let n=o(e>>>0);for(let e of t)n=typeof e==`number`?s(n,e):c(e,n);return new a(n)}var d=(e,t,n)=>Math.min(n,Math.max(t,e)),f=(e,t)=>[e,t],p=e=>e.str(`worldShape`)===`sphere`,m=e=>p(e)?e.num(`planetSize`)/Math.sqrt(Math.PI):e.num(`worldSize`),h=[`worldShape`,`worldSize`,`planetSize`],g=e=>Math.log2(m(e)/1024),_=e=>m(e)**2*e.num(`landFraction`),v=e=>({kind:`number`,...e}),y=e=>({kind:`draw`,...e}),b=e=>({kind:`spread`,...e}),x=e=>({kind:`span`,...e}),S=e=>({kind:`enum`,...e}),C=e=>({kind:`toggle`,...e});function w(e){let t=.7+.6*e.num(`tectonicActivity`),n=5*(m(e)/1024)**.8*t;return(p(e)?Math.min(n,(8+4*Math.log2(m(e)/2048))*t):n)*e.bias(`plateMul`)}function T(e,t){return!e.shapes||e.shapes.includes(t)}var E=[S({id:`worldShape`,label:`World shape`,level:0,section:`world`,stage:`plates`,help:`A flat square map, or a whole planet shown as a globe.`,options:[{value:`flat`,label:`Flat`},{value:`sphere`,label:`Sphere`}],deps:[],auto:()=>`flat`}),v({id:`worldSize`,label:`World size`,level:0,section:`world`,stage:`plates`,shapes:[`flat`],help:`Width of the square world. Bigger worlds get more of everything, not sparser features.`,min:256,max:4096,step:1,unit:`km`,log:!0,integer:!0,deps:[],auto:e=>e.bias(`worldSize`)}),v({id:`planetSize`,label:`Planet size`,level:0,section:`world`,stage:`plates`,shapes:[`sphere`],help:`Circumference of the planet; one cube face spans a quarter of it. 4,096 km is a small planet, 40,030 km Earth.`,min:2048,max:40030,step:1,unit:`km`,log:!0,integer:!0,deps:[],auto:e=>e.bias(`planetSize`)}),v({id:`planetRadius`,label:`Radius`,level:0,section:`world`,stage:`plates`,shapes:[`sphere`],readonly:!0,help:`Planet radius, from the circumference.`,min:0,max:1e4,step:1,unit:`km`,integer:!0,deps:[`planetSize`],auto:e=>Math.round(e.num(`planetSize`)/(2*Math.PI))}),v({id:`planetArea`,label:`Surface area`,level:0,section:`world`,stage:`plates`,shapes:[`sphere`],readonly:!0,help:`Total surface area, land and sea.`,min:0,max:600,step:.1,unit:`M km²`,deps:[`planetSize`],auto:e=>e.num(`planetSize`)**2/Math.PI/1e6}),v({id:`landFraction`,label:`Land fraction`,level:0,section:`world`,stage:`base`,help:`Share of the world above sea level.`,min:.05,max:.8,step:.01,deps:[],auto:e=>e.bias(`landFraction`)}),v({id:`tectonicActivity`,label:`Tectonic activity`,level:0,section:`world`,stage:`plates`,help:`Dead craton (0) to very active (1): more plates, higher peaks, more volcanoes and rifts.`,min:0,max:1,step:.01,deps:[],auto:e=>e.bias(`tectonicActivity`)}),v({id:`geologicAge`,label:`Geologic age`,level:0,section:`world`,stage:`plates`,help:`Young (0) to old (1): old worlds are lower and rounder, with wider valleys and surviving craters.`,min:0,max:1,step:.01,deps:[],auto:e=>e.bias(`geologicAge`)}),x({id:`latitudeSpan`,label:`Latitude span`,level:0,section:`world`,stage:`climate`,shapes:[`flat`],help:`Virtual latitude from the north edge to the south edge. Drives the climate belts.`,min:-90,max:90,step:1,unit:`°`,deps:[],auto:e=>f(e.bias(`latNorth`),e.bias(`latSouth`))}),v({id:`axialTilt`,label:`Axial tilt`,level:0,section:`world`,stage:`climate`,shapes:[`sphere`],help:`Tilt of the spin axis: sets the strength of the seasons and how far the climate belts swing.`,min:0,max:45,step:.1,unit:`°`,deps:[],auto:e=>e.bias(`axialTilt`)}),v({id:`temperatureOffset`,label:`Temperature offset`,level:0,section:`world`,stage:`climate`,help:`Shifts every temperature: ice ages below zero, hothouse worlds above.`,min:-15,max:15,step:.5,unit:`°C`,deps:[],auto:e=>e.bias(`temperatureOffset`)}),v({id:`humidity`,label:`Humidity`,level:0,section:`world`,stage:`climate`,help:`Scales how much moisture the oceans supply.`,min:.2,max:2.5,step:.05,deps:[],auto:e=>e.bias(`humidity`)}),S({id:`quality`,label:`Quality`,level:0,section:`world`,stage:`plates`,help:`Grid resolutions and iteration counts. Fast is for exploring settings.`,options:[{value:`fast`,label:`Fast`},{value:`standard`,label:`Standard`},{value:`high`,label:`High`}],deps:[],auto:()=>`standard`}),y({id:`plateCount`,label:`Tectonic plates`,level:1,section:`structure`,stage:`plates`,help:`Number of major plates. Collisions between them raise mountain ranges.`,min:2,max:40,step:1,integer:!0,deps:[...h,`tectonicActivity`],auto:e=>{let t=w(e);return f(Math.max(2,Math.round(.8*t)),Math.max(2,Math.round(1.2*t)))}}),v({id:`meanPlateDiameter`,label:`Mean plate size`,level:1,section:`structure`,stage:`plates`,help:`Typical plate diameter, from world size and plate count. Change it via the plate count.`,min:0,max:5e3,step:1,unit:`km`,integer:!0,readonly:!0,deps:[...h,`plateCount`],auto:e=>Math.round(Math.sqrt(m(e)**2/e.mid(`plateCount`)))}),v({id:`plateSizeSkew`,label:`Plate size skew`,level:1,section:`structure`,stage:`plates`,help:`Similar-sized plates (0) to one or two giants plus fragments (1).`,min:0,max:1,step:.01,deps:[],auto:e=>e.bias(`plateSizeSkew`)}),y({id:`microplateCount`,label:`Microplates`,level:1,section:`structure`,stage:`plates`,help:`Small plates squeezed between the major ones.`,min:0,max:12,step:1,integer:!0,deps:[`plateCount`,`tectonicActivity`],auto:e=>f(0,Math.round(.2*e.mid(`plateCount`)+2*e.num(`tectonicActivity`)))}),v({id:`continentalShare`,label:`Continental crust`,level:1,section:`structure`,stage:`plates`,help:`Share of the world covered by continental crust (land plus continental shelf).`,min:.05,max:.95,step:.01,deps:[`landFraction`],auto:e=>d(e.num(`landFraction`)+.1,.05,.95)}),y({id:`continentCount`,label:`Continents`,level:1,section:`structure`,stage:`plates`,target:!0,help:`Number of large landmasses (islands not counted).`,min:1,max:12,step:1,integer:!0,deps:[...h,`landFraction`],auto:e=>{let t=d((1.6+1*g(e)+3*(e.num(`landFraction`)-.4))*e.bias(`continentMul`),1,12);return f(d(Math.round(t-.8),1,12),d(Math.round(t+1),1,12))}}),v({id:`continentSizeSkew`,label:`Continent size skew`,level:1,section:`structure`,stage:`plates`,help:`Equal continents (0) to one dominant continent plus small ones (1).`,min:0,max:1,step:.01,deps:[`continentCount`],auto:e=>e.mid(`continentCount`)<=1?1:e.bias(`continentSizeSkew`)}),v({id:`islandAbundance`,label:`Island abundance`,level:1,section:`structure`,stage:`base`,help:`Scales island arcs, shelf islands, archipelagos and drowned ranges.`,min:0,max:2,step:.05,deps:[`landFraction`],auto:e=>d(e.bias(`islandAbundance`)*(1+.8*(.4-e.num(`landFraction`))),0,2)}),v({id:`coastRoughness`,label:`Coast roughness`,level:1,section:`structure`,stage:`base`,help:`Target fractal dimension of coastlines. Fjord and ria coasts sit at the high end.`,min:1.1,max:1.45,step:.01,deps:[`geologicAge`],auto:e=>d(e.bias(`coastRoughness`)+.06*(.5-e.num(`geologicAge`)),1.1,1.45)}),y({id:`hotspotCount`,label:`Hotspots`,level:1,section:`structure`,stage:`stamps`,help:`Mantle plumes that build volcanic island chains and shield volcanoes.`,min:0,max:30,step:1,integer:!0,deps:[...h,`tectonicActivity`],auto:e=>{let t=(m(e)/1024)**1.5;return f(0,Math.round(1+2*e.num(`tectonicActivity`)*(p(e)?Math.min(t,25):t)))}}),v({id:`seaLevelRise`,label:`Sea-level rise`,level:1,section:`structure`,stage:`refine`,help:`Raises the sea after erosion: valleys drown into rias, hills become islands.`,min:0,max:200,step:5,unit:`m`,deps:[],auto:e=>e.bias(`seaLevelRise`)}),S({id:`mapEdge`,label:`Beyond the map`,level:1,section:`structure`,stage:`plates`,shapes:[`flat`],help:`Ocean keeps everything inside the map; continent lets rivers drain off-map and dry air arrive.`,options:[{value:`ocean`,label:`Ocean`},{value:`continent`,label:`Continent`}],deps:[],auto:e=>e.bias(`mapEdgeContinent`)>.5?`continent`:`ocean`}),v({id:`boundaryWarp`,label:`Boundary irregularity`,level:1,section:`structure`,stage:`plates`,help:`How irregular plate boundaries are.`,min:0,max:1,step:.01,deps:[`geologicAge`],auto:e=>d(.3+.5*e.num(`geologicAge`),0,1)}),y({id:`mountainRangeCount`,label:`Mountain ranges`,level:2,section:`mountains`,stage:`plates`,target:!0,help:`Major ranges from plate collisions. Steers which plate boundaries converge.`,min:0,max:30,step:1,integer:!0,deps:[`plateCount`,`tectonicActivity`],auto:e=>{let t=.5*e.mid(`plateCount`)*(.5+e.num(`tectonicActivity`));return f(d(Math.floor(.6*t),0,30),d(Math.ceil(1.2*t),1,30))}}),b({id:`rangeLength`,label:`Range length`,level:2,section:`mountains`,stage:`base`,help:`Length of collision ranges. Grows with plate size, since boundaries are longer.`,min:20,max:4e3,step:10,unit:`km`,log:!0,integer:!0,deps:[`meanPlateDiameter`],auto:e=>f(Math.round(.55*e.num(`meanPlateDiameter`)),Math.round(1.2*e.num(`meanPlateDiameter`)))}),b({id:`rangeWidth`,label:`Range width`,level:2,section:`mountains`,stage:`base`,help:`Width of the uplifted belt across a range.`,min:10,max:800,step:5,unit:`km`,log:!0,integer:!0,deps:[`rangeLength`,`tectonicActivity`],auto:e=>{let t=e.mid(`rangeLength`)*(.8+.4*e.num(`tectonicActivity`));return f(Math.round(.22*t),Math.round(.4*t))}}),b({id:`peakHeight`,label:`Peak height`,level:2,section:`mountains`,stage:`base`,help:`Spread of the highest summits of each range. Drives uplift in the erosion model.`,min:200,max:9e3,step:50,unit:`m`,integer:!0,deps:[`tectonicActivity`,`geologicAge`,...h],auto:e=>{let t=e.num(`tectonicActivity`),n=1-.45*(e.num(`geologicAge`)-.5),r=(1500+2e3*t)*n,i=Math.min(9e3,(3e3+4e3*t+(p(e)?0:500*Math.max(0,g(e))))*n);return f(Math.round(r/50)*50,Math.round(i/50)*50)}}),v({id:`plateauChance`,label:`Plateau chance`,level:2,section:`mountains`,stage:`base`,help:`Chance that a continental collision builds a high plateau behind it.`,min:0,max:1,step:.01,deps:[`tectonicActivity`,...h,`peakHeight`],auto:e=>d((.1+.3*e.num(`tectonicActivity`)+.1*g(e))*(e.range(`peakHeight`)[1]/5e3),0,1)}),y({id:`riftCount`,label:`Rifts`,level:2,section:`mountains`,stage:`plates`,target:!0,help:`Continental rift valleys where plates pull apart.`,min:0,max:10,step:1,integer:!0,deps:[`tectonicActivity`,`plateCount`,`continentalShare`],auto:e=>f(0,d(Math.round(.8*e.num(`tectonicActivity`)*e.mid(`plateCount`)*(.6+e.num(`continentalShare`))),1,10))}),v({id:`volcanism`,label:`Volcanism`,level:2,section:`mountains`,stage:`stamps`,help:`Scales arc volcano density and hotspot output.`,min:0,max:2,step:.05,deps:[`tectonicActivity`],auto:e=>2*e.num(`tectonicActivity`)}),v({id:`calderaShare`,label:`Caldera share`,level:2,section:`mountains`,stage:`landforms`,help:`Fraction of large volcanoes that have collapsed into calderas.`,min:0,max:1,step:.01,deps:[`volcanism`,`geologicAge`],auto:e=>d(.05+.1*e.num(`volcanism`)+.1*e.num(`geologicAge`),0,1)}),v({id:`impactHistory`,label:`Impact history`,level:2,section:`mountains`,stage:`stamps`,help:`How heavily the world has been bombarded.`,min:0,max:3,step:.05,deps:[],auto:e=>e.bias(`impactHistory`)}),y({id:`craterCount`,label:`Impact craters`,level:2,section:`mountains`,stage:`stamps`,help:`Visible impact craters. Rare on Earth-like worlds; old worlds keep more, mostly degraded.`,min:0,max:30,step:1,integer:!0,deps:[...h,`landFraction`,`geologicAge`,`impactHistory`],auto:e=>{let t=_(e)/1e5*.2*(.5+e.num(`geologicAge`))*e.num(`impactHistory`);return t<=2?f(0,d(Math.ceil(2*t),0,30)):f(Math.floor(.5*t),d(Math.ceil(1.5*t),1,30))}}),b({id:`craterDiameter`,label:`Crater diameter`,level:2,section:`mountains`,stage:`stamps`,help:`Size spread of impact craters.`,min:.5,max:300,step:.5,unit:`km`,log:!0,deps:h,auto:e=>f(3,Math.min(300,Math.round(40*Math.sqrt(m(e)/1024))))}),v({id:`strataShare`,label:`Layered rock`,level:2,section:`mountains`,stage:`base`,help:`Share of land on layered sedimentary rock: mesas, escarpments and canyons.`,min:0,max:1,step:.01,deps:[`geologicAge`],auto:e=>d(e.bias(`strataShare`)*(.7+.6*e.num(`geologicAge`)),0,1)}),v({id:`karstShare`,label:`Limestone (karst)`,level:2,section:`mountains`,stage:`base`,help:`Share of land on limestone: sinkholes, towers and disappearing rivers.`,min:0,max:.5,step:.01,deps:[],auto:e=>e.bias(`karstShare`)}),v({id:`poleEquatorGradient`,label:`Pole–equator gradient`,level:2,section:`climate`,stage:`climate`,help:`How much colder high latitudes are than the tropics.`,min:.4,max:1.5,step:.05,deps:[],auto:e=>e.bias(`poleEquatorGradient`)}),v({id:`windOverrideAngle`,label:`Wind override angle`,level:2,section:`climate`,stage:`climate`,help:`Direction the override wind blows toward (0° = north).`,min:0,max:360,step:5,unit:`°`,deps:[],auto:()=>0}),v({id:`windOverrideStrength`,label:`Wind override`,level:2,section:`climate`,stage:`climate`,help:`Blend between the latitude wind bands (0) and the override direction (1).`,min:0,max:1,step:.05,deps:[],auto:()=>0}),C({id:`oceanCurrents`,label:`Ocean currents`,level:2,section:`climate`,stage:`climate`,help:`Warm and cold coastal currents (fog deserts, mild west coasts).`,deps:[`worldShape`,`mapEdge`],auto:e=>p(e)||e.str(`mapEdge`)===`ocean`}),v({id:`moistureLength`,label:`Moisture reach`,level:2,section:`climate`,stage:`climate`,help:`How far inland ocean moisture travels before raining out.`,min:300,max:4e3,step:50,unit:`km`,integer:!0,deps:h,auto:e=>{let t=1500*(m(e)/1024)**.4;return Math.round((p(e)?Math.min(t,3e3):t)/50)*50}}),v({id:`seasonality`,label:`Seasonality`,level:2,section:`climate`,stage:`climate`,help:`Strength of summer/winter contrast.`,min:0,max:2,step:.05,deps:[`worldShape`,`latitudeSpan`,`axialTilt`],auto:e=>{if(p(e))return d(e.num(`axialTilt`)/23.4,0,2);let[t,n]=e.range(`latitudeSpan`);return d(.6+.4*Math.abs((t+n)/2)/45,0,2)}}),v({id:`glaciation`,label:`Glaciation`,level:2,section:`climate`,stage:`glacial`,help:`Ice extent and how low glaciers reach. Drives fjords, cirques and lake districts.`,min:0,max:2,step:.05,deps:[`temperatureOffset`,`worldShape`,`latitudeSpan`,`peakHeight`],auto:e=>{let[t,n]=e.range(`latitudeSpan`);return d(.25+.5*((p(e)?65:Math.max(Math.abs(t),Math.abs(n)))-45)/20+.25*(e.range(`peakHeight`)[1]-3e3)/2e3-e.num(`temperatureOffset`)/12,0,2)}}),C({id:`fjords`,label:`Fjords`,level:2,section:`climate`,stage:`glacial`,help:`Allow glaciers to carve troughs below sea level on cold mountainous coasts.`,deps:[`glaciation`,`peakHeight`],auto:e=>e.num(`glaciation`)>=.9&&e.range(`peakHeight`)[1]>=3e3}),v({id:`riverDensity`,label:`River density`,level:2,section:`water`,stage:`hydro`,target:!0,help:`How small a catchment starts a river.`,min:.2,max:3,step:.05,deps:[`humidity`],auto:e=>Math.sqrt(e.num(`humidity`))}),v({id:`lakeDensity`,label:`Lake density`,level:2,section:`water`,stage:`hydro`,help:`Scales lakes the grid cannot resolve (kettles, tarns, ponds) and the lake/breach balance.`,min:0,max:5,step:.05,deps:[`glaciation`,`humidity`],auto:e=>(.7+.2*e.num(`glaciation`))*Math.sqrt(e.num(`humidity`))}),v({id:`meanderStrength`,label:`Meanders`,level:2,section:`water`,stage:`hydro`,help:`Global multiplier on meandering; each reach still meanders by its own slope.`,min:0,max:3,step:.05,deps:[],auto:()=>1}),v({id:`wetlandShare`,label:`Wetlands`,level:2,section:`water`,stage:`hydro`,target:!0,help:`Share of land that is marsh, swamp, bog or fen.`,min:0,max:.3,step:.005,deps:[`humidity`],auto:e=>d(.07*e.num(`humidity`)**1.5,.005,.1)}),v({id:`waveEnergy`,label:`Wave energy`,level:2,section:`water`,stage:`hydro`,help:`High waves smooth deltas into arcs and cusps.`,min:0,max:1,step:.05,deps:[],auto:()=>.5}),v({id:`tideRange`,label:`Tides`,level:2,section:`water`,stage:`hydro`,help:`Large tides turn river mouths into estuaries.`,min:0,max:1,step:.05,deps:[],auto:()=>.3}),...[`relief`,`water`,`volcanic`,`coast`,`ice`,`arid`,`karst`].map(e=>v({id:`density_${e}`,label:`Density: ${e}`,level:2,section:`features`,stage:`stamps`,help:`Multiplies the rate of ${e} landmarks (research note 05, §4).`,min:0,max:3,step:.05,deps:[],auto:()=>1})),y({id:`heroCount`,label:`Hero landmarks`,level:2,section:`features`,stage:`stamps`,help:`Guaranteed spectacular landmarks: a great canyon, massif, crater, fjord coast…`,min:0,max:12,step:1,integer:!0,deps:h,auto:e=>{let t=m(e);return p(e)?t>8e3?f(8,12):f(5,8):t<768?f(2,4):t<=1024?f(3,5):f(5,8)}}),S({id:`lemGrid`,label:`Erosion grid`,level:3,section:`advanced`,stage:`base`,shapes:[`flat`],help:`Resolution of the landscape-evolution model.`,options:[{value:`256`,label:`256²`},{value:`512`,label:`512²`},{value:`1024`,label:`1024²`}],deps:[`quality`,`worldSize`],auto:e=>e.str(`quality`)===`fast`?`256`:e.str(`quality`)===`high`&&e.num(`worldSize`)>2048?`1024`:`512`}),S({id:`macroGrid`,label:`Macro grid`,level:3,section:`advanced`,stage:`refine`,shapes:[`flat`],help:`Resolution of hydrology, climate and biomes.`,options:[{value:`512`,label:`512²`},{value:`1024`,label:`1024²`},{value:`2048`,label:`2048²`}],deps:[`quality`,`worldSize`],auto:e=>e.str(`quality`)===`fast`?`512`:e.str(`quality`)===`high`&&e.num(`worldSize`)>2048?`2048`:`1024`}),S({id:`detailGrid`,label:`Detail grid`,level:3,section:`advanced`,stage:`gpu`,shapes:[`flat`],help:`Resolution of the GPU detail heightmap.`,options:[{value:`2048`,label:`2048²`},{value:`4096`,label:`4096²`}],deps:[`quality`],auto:e=>e.str(`quality`)===`fast`?`2048`:`4096`}),S({id:`faceGrid`,label:`Face grid`,level:3,section:`advanced`,stage:`base`,shapes:[`sphere`],help:`Cells per cube-face edge of the macro grid (six faces); the erosion grid has half as many.`,options:[{value:`256`,label:`6 × 256²`},{value:`512`,label:`6 × 512²`},{value:`1024`,label:`6 × 1024²`}],deps:[`quality`],auto:e=>e.str(`quality`)===`fast`?`256`:e.str(`quality`)===`high`?`1024`:`512`}),v({id:`lemIterations`,label:`Erosion iterations`,level:3,section:`advanced`,stage:`lem`,help:`Landscape-evolution steps. Older worlds erode longer.`,min:10,max:400,step:1,integer:!0,deps:[`geologicAge`,`quality`],auto:e=>{let t=e.str(`quality`)===`fast`?.75:e.str(`quality`)===`high`?1.25:1;return Math.round((60+60*e.num(`geologicAge`))*t)}}),v({id:`latitudeWarp`,label:`Latitude warp`,level:3,section:`advanced`,stage:`climate`,help:`Wobble of the climate belts so isotherms and desert edges do not follow straight rows.`,min:0,max:8,step:.5,unit:`°`,deps:[],auto:()=>3}),v({id:`windNoise`,label:`Wind noise`,level:3,section:`advanced`,stage:`climate`,help:`Random swing of the prevailing wind direction.`,min:0,max:45,step:1,unit:`°`,deps:[],auto:()=>20}),v({id:`orographicStrength`,label:`Orographic rain`,level:3,section:`advanced`,stage:`climate`,help:`Extra rain per metre-per-km of windward rise.`,min:0,max:.2,step:.005,deps:[],auto:()=>.08}),v({id:`rainShadowCap`,label:`Rain-shadow cap`,level:3,section:`advanced`,stage:`climate`,help:`Steepest windward rise that still adds rain; lower values soften rain shadows.`,min:10,max:150,step:5,unit:`m/km`,deps:[],auto:()=>60}),v({id:`recycling`,label:`Moisture recycling`,level:3,section:`advanced`,stage:`climate`,help:`Share of rain that vegetation re-evaporates; keeps continental interiors from drying out.`,min:0,max:.7,step:.05,deps:[],auto:()=>.35})],D=new Map(E.map(e=>[e.id,e])),O={world:`World`,structure:`Structure`,mountains:`Mountains & tectonics`,climate:`Climate`,water:`Water`,features:`Features`,advanced:`Advanced`},k=[`plates`,`base`,`stamps`,`lem`,`refine`,`climate`,`glacial`,`landforms`,`hydro`,`biome`,`registry`];function A(e){return e.kind===`draw`||e.kind===`spread`||e.kind===`span`}var j=`@auto`;function M(e=E){let t=new Map(e.map(e=>[e.id,e])),n=new Map,r=[],i=(e,a)=>{let o=n.get(e.id);if(o!==2){if(o===1)throw Error(`parameter cycle: ${[...a,e.id].join(` → `)}`);n.set(e.id,1);for(let n of e.deps){let r=t.get(n);if(!r)throw Error(`${e.id} depends on unknown ${n}`);i(r,[...a,e.id])}n.set(e.id,2),r.push(e)}};for(let t of e)i(t,[]);return r}var N=M();function ee(e,t){let n=Math.min(e.max,Math.max(e.min,t));if(e.integer)return Math.min(e.max,Math.max(e.min,Math.round(n/Math.max(1,e.step))*Math.max(1,e.step)));let r=Math.max(0,-Math.floor(Math.log10(e.step)+1e-9));return Math.min(e.max,Math.max(e.min,Number((Math.round(n/e.step)*e.step).toFixed(r+2))))}function te(e,t){let n=Array.isArray(e)?e:[null,null],r=Array.isArray(t)&&e!==`@auto`?t:[null,null],i=e=>n[e]==null?r[e]==null?[null,`auto`]:[r[e],`preset`]:[n[e],`set`],[a,o]=i(0),[s,c]=i(1);return{pin:[a,s],src:[o,c]}}function ne(e,t,n,r){switch(n===`@auto`&&(n=void 0),e.kind){case`number`:return{value:ee(e,typeof n==`number`?n:t),source:typeof n==`number`?r:`auto`};case`enum`:{let i=typeof n==`string`&&e.options.some(e=>e.value===n)?n:null;return{value:i??t,source:i===null?`auto`:r}}case`toggle`:return{value:typeof n==`boolean`?n:t,source:typeof n==`boolean`?r:`auto`};default:{let i=t,a=Array.isArray(n)?n:[null,null],o=ee(e,a[0]??i[0]),s=ee(e,a[1]??i[1]),c=[a[0]==null?`auto`:r,a[1]==null?`auto`:r];return e.kind!==`span`&&o>s&&(c[0]!==`auto`&&c[1]===`auto`?s=o:c[1]!==`auto`&&c[0]===`auto`?o=s:[o,s]=[s,o]),{value:[o,s],source:c}}}}function re(e,t){let n=`unit`in e&&e.unit?e.unit:``;return Array.isArray(t)?n===`°`?`${P(t[0])}°${e.kind===`span`?` → `:`–`}${P(t[1])}°`:`${P(t[0])}${e.kind===`span`?` → `:`–`}${P(t[1])}${n?` ${n}`:``}`:typeof t==`number`?`${P(t)}${n===`°`?`°`:n?` ${n}`:``}`:typeof t==`boolean`?t?`on`:`off`:e.kind===`enum`?e.options.find(e=>e.value===t)?.label??String(t):String(t)}function P(e){if(Number.isInteger(e))return String(e);let t=Math.abs(e);return t>=100?e.toFixed(0):t>=10?e.toFixed(1):e.toFixed(2)}function ie(e,t){let n=D.get(e);return n?re(n,t):String(t)}function ae(e){let t=i(e.archetype),n={},r={},a={},o={},s={},c=null,l=e=>{if(c&&!c.deps.includes(e))throw Error(`${c.id}.auto reads undeclared dep ${e}`);let t=n[e];if(t===void 0)throw Error(`${e} read before it was resolved`);return t},d={num:e=>l(e),range:e=>l(e),mid:e=>{let t=l(e);return Array.isArray(t)?(t[0]+t[1])/2:t},str:e=>l(e),bool:e=>l(e),bias:e=>{let n=t.bias[e];if(n===void 0)throw Error(`unknown archetype bias ${e}`);return n},archetype:t.id};for(let i of N){c=i;let l=i.auto(d);c=null,r[i.id]=l;let f=i.readonly?void 0:e.pins[i.id],p=i.readonly?void 0:t.pins[i.id];if(A(i)){let e=te(f,p),{value:t}=ne(i,l,e.pin,`set`);n[i.id]=t,a[i.id]=e.src}else{let{value:e,source:t}=ne(i,l,f??p,f===void 0&&p!==void 0?`preset`:`set`);n[i.id]=e,a[i.id]=t}let m=n.worldShape,h=i.deps.filter(e=>T(D.get(e),m)&&(e!==`worldShape`||m!==`flat`));if(o[i.id]=h.length?`← ${h.map(e=>`${D.get(e).label.toLowerCase()} ${re(D.get(e),n[e])}`).join(`, `)}`:`← archetype ${t.label}`,i.kind===`draw`){let[t,r]=n[i.id],a=u(e.seed,`config`,i.id).float();s[i.id]=i.integer?t+Math.floor(a*(r-t+1)):t+a*(r-t)}}return{seed:e.seed,archetype:t.id,values:n,autos:r,sources:a,drawn:s,provenance:o,warnings:oe(n,s)}}function oe(e,t){let n=[],r=e.worldShape===`sphere`?e.planetSize/Math.sqrt(Math.PI):e.worldSize,i=r*r*e.landFraction,a=t.continentCount,o=i/a;return o<5e3&&n.push({ids:[`continentCount`,`landFraction`,e.worldShape===`sphere`?`planetSize`:`worldSize`],message:`Continents will be very small (≈ ${Math.round(o).toLocaleString(`en-US`)} km² each).`}),a>t.plateCount+t.microplateCount&&n.push({ids:[`continentCount`,`plateCount`],message:`More continents than plates: several continents will share a plate.`}),t.mountainRangeCount>t.plateCount+t.microplateCount-1+2&&n.push({ids:[`mountainRangeCount`,`plateCount`],message:`Few plate boundaries for this many ranges: some ranges will be short or intra-plate.`}),e.peakHeight[1]>6e3&&e.tectonicActivity<.25&&n.push({ids:[`peakHeight`,`tectonicActivity`],message:`Very high peaks on a quiet world: uplift will be concentrated in few ranges.`}),n}function se(e,t,n){let r={...e.pins};return n===void 0?delete r[t]:r[t]=n,{...e,pins:r}}function ce(e){let t=ae(e),n={};for(let e of E)e.readonly||(n[e.id]=A(e)?[...t.values[e.id]]:t.values[e.id]);return{...e,pins:n}}function le(e){let t=new URLSearchParams;t.set(`seed`,String(e.seed>>>0)),e.archetype!==`earth`&&t.set(`a`,e.archetype);let n=e.pins.worldShape===`sphere`;for(let r of Object.keys(e.pins).sort()){let i=e.pins[r];if(r===`worldShape`&&i===`flat`)continue;let a=D.get(r);n&&a&&!T(a,`sphere`)||t.set(r,de(i))}return t.toString()}function ue(e,t){let n=new URLSearchParams(e),r=n.get(`seed`),a=r!==null&&/^\d+$/.test(r)?Number(r)>>>0:t>>>0,o=i(n.get(`a`)??`earth`).id,s={};for(let[e,t]of n){let n=D.get(e);if(!n||n.readonly)continue;let r=fe(n.kind,t);r!==void 0&&(s[e]=r)}return{seed:a,archetype:o,pins:s}}function de(e){return Array.isArray(e)?`${e[0]??``}~${e[1]??``}`:typeof e==`boolean`?e?`1`:`0`:String(e)}function fe(e,t){if(t===`@auto`)return j;let n=e=>e===``?null:Number.isFinite(Number(e))?Number(e):null;switch(e){case`number`:{let e=n(t);return e===null?void 0:e}case`toggle`:return t===`1`||t!==`0`&&void 0;case`enum`:return t;default:{let e=t.split(`~`);if(e.length!==2)return;let r=n(e[0]),i=n(e[1]);return r===null&&i===null?void 0:[r,i]}}}function pe(e,t){let n=URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.download=t,r.rel=`noopener`,r.style.display=`none`,document.body.append(r),r.click(),r.remove(),setTimeout(()=>URL.revokeObjectURL(n),6e4)}function me(e,t,n){pe(new Blob([e],{type:n}),t)}async function he(e,t,n){let r=new ImageData(new Uint8ClampedArray(n.buffer,n.byteOffset,n.byteLength),e,t);if(typeof OffscreenCanvas<`u`){let n=new OffscreenCanvas(e,t);return n.getContext(`2d`).putImageData(r,0,0),n.convertToBlob({type:`image/png`})}let i=document.createElement(`canvas`);return i.width=e,i.height=t,i.getContext(`2d`).putImageData(r,0,0),new Promise((e,t)=>i.toBlob(n=>n?e(n):t(Error(`PNG encoding failed`)),`image/png`))}async function ge(e){try{return await navigator.clipboard.writeText(e),!0}catch{let t=document.createElement(`textarea`);t.value=e,t.setAttribute(`readonly`,``),t.style.cssText=`position:fixed;opacity:0;left:0;top:0`,document.body.append(t),t.select();let n=!1;try{n=document.execCommand(`copy`)}catch{n=!1}return t.remove(),n}}function _e(e,t,n){let r=t===n?``:`-${t.replace(/[^a-z0-9-]+/gi,`-`)}`;return`world-${e>>>0}${r}`}var ve=[137,80,78,71,13,10,26,10],ye=null;function be(e,t=0,n=e.length){if(!ye){ye=new Uint32Array(256);for(let e=0;e<256;e++){let t=e;for(let e=0;e<8;e++)t=t&1?3988292384^t>>>1:t>>>1;ye[e]=t>>>0}}let r=4294967295;for(let i=t;i<n;i++)r=ye[(r^e[i])&255]^r>>>8;return(r^4294967295)>>>0}var xe=async e=>{let t=new Blob([e]).stream().pipeThrough(new CompressionStream(`deflate`));return new Uint8Array(await new Response(t).arrayBuffer())};function Se(e,t,n,r,i=xe){if(n.length!==e*t)return Promise.reject(Error(`PNG: expected ${e*t} samples, got ${n.length}`));let a=new Uint8Array(e*t*2);for(let e=0;e<n.length;e++)a[2*e]=n[e]>>>8,a[2*e+1]=n[e]&255;return Ce({width:e,height:t,colorType:0,bitDepth:16,pixels:a,...r?{text:r}:{}},i)}async function Ce(e,t=xe){let{width:n,height:r}=e,i=(e.colorType===6?4:1)*(e.bitDepth/8),a=n*i;if(e.pixels.length!==a*r)throw Error(`PNG: expected ${a*r} bytes, got ${e.pixels.length}`);let o=await t(we(e.pixels,a,r,i)),s=new Uint8Array(13),c=new DataView(s.buffer);c.setUint32(0,n),c.setUint32(4,r),s[8]=e.bitDepth,s[9]=e.colorType;let l=[[`IHDR`,s]];for(let[t,n]of Object.entries(e.text??{}))l.push([`tEXt`,Ee(`${t.slice(0,79)}\0${n}`)]);l.push([`IDAT`,o],[`IEND`,new Uint8Array]);let u=ve.length+l.reduce((e,[,t])=>e+12+t.length,0),d=new Uint8Array(u),f=new DataView(d.buffer);d.set(ve,0);let p=ve.length;for(let[e,t]of l){f.setUint32(p,t.length);for(let t=0;t<4;t++)d[p+4+t]=e.charCodeAt(t);d.set(t,p+8),f.setUint32(p+8+t.length,be(d,p+4,p+8+t.length)),p+=12+t.length}return d}function we(e,t,n,r){let i=new Uint8Array((t+1)*n),a=Array.from({length:5},()=>new Uint8Array(t));for(let o=0;o<n;o++){let n=o*t,s=o>0?n-t:-1,c=0,l=1/0;for(let i=0;i<5;i++){let o=a[i],u=0;for(let a=0;a<t;a++){let t=e[n+a],c=a>=r?e[n+a-r]:0,l=s>=0?e[s+a]:0,d=s>=0&&a>=r?e[s+a-r]:0,f=t-Te(i,c,l,d)&255;o[a]=f,u+=f<128?f:256-f}u<l&&(l=u,c=i)}i[o*(t+1)]=c,i.set(a[c],o*(t+1)+1)}return i}function Te(e,t,n,r){switch(e){case 1:return t;case 2:return n;case 3:return t+n>>>1;case 4:{let e=t+n-r,i=Math.abs(e-t),a=Math.abs(e-n),o=Math.abs(e-r);return i<=a&&i<=o?t:a<=o?n:r}default:return 0}}function Ee(e){let t=new Uint8Array(e.length);for(let n=0;n<e.length;n++){let r=e.charCodeAt(n);t[n]=r<256?r:63}return t}var De=`procedural-world/1`,Oe=(e,t)=>{let n=10**t;return Math.round(e*n)/n};function ke(e){let t=e.elevation,n=new Map(e.landmarks.map(e=>[e.id,e])),r=[...e.landmarks].sort((e,t)=>Number(t.hero)-Number(e.hero)||t.importance-e.importance||e.id-t.id).map(e=>({id:e.id,name:e.name,kind:e.kind,tier:e.tier,hero:e.hero,importance:Oe(e.importance,4),xKm:Oe(e.x/1e3,3),yKm:Oe(e.y/1e3,3),extentKm:Oe(e.extentM/1e3,3),facts:Object.fromEntries(Object.entries(e.data).filter(([,e])=>Number.isFinite(e)).map(([e,t])=>[e,Oe(t,3)]))}));return{format:De,exportedAt:(e.now??new Date).toISOString(),shareUrl:e.shareUrl,query:e.query,spec:{seed:e.spec.seed,archetype:e.spec.archetype,pins:{...e.spec.pins}},resolved:{...e.resolved},world:t?{sizeKm:t.worldKm,grid:t.w,cellKm:Oe(t.worldKm/t.w,6),elevationM:[Oe(t.min,2),Oe(t.max,2)],seaLevelM:0}:null,heightmap:t?Ae(t):null,traits:e.traits?{...e.traits,heroNames:e.traits.heroes.map(e=>n.get(e)?.name??`#${e}`)}:null,landmarks:r}}function Ae(e){let t=Math.floor(e.min),n=Math.max(t+1,Math.ceil(e.max));return{encoding:`uint16-linear`,minM:t,maxM:n,width:e.w,height:e.h,seaLevelValue:Math.round(Math.min(1,Math.max(0,-t/(n-t)))*65535)}}function je(e,t=Ae(e)){let n=new Uint16Array(e.w*e.h),r=65535/(t.maxM-t.minM);for(let i=0;i<n.length;i++){let a=e.data[i];n[i]=Number.isFinite(a)?Math.round(Math.min(65535,Math.max(0,(a-t.minM)*r))):0}return n}function Me(e,t=12){let{w:n,h:r,data:i}=e,a=new Uint8ClampedArray(n*r*4),o=e.worldKm*1e3/n,s=(e,t)=>i[Math.min(r-1,Math.max(0,t))*n+Math.min(n-1,Math.max(0,e))],c=Ne(-.6,-.6,.75);for(let l=0;l<r;l++)for(let r=0;r<n;r++){let u=i[l*n+r],d;if(e.kind===`categorical`)d=Ie(Math.round(u));else if(e.kind===`scalar`)d=Le((u-e.min)/Math.max(1e-6,e.max-e.min));else{let e=(s(r+1,l)-s(r-1,l))/(2*o),n=(s(r,l+1)-s(r,l-1))/(2*o),i=Ne(-e*t,-n*t,1),a=Math.min(1.6,Math.max(0,(i[0]*c[0]+i[1]*c[1]+i[2]*c[2])/c[2])),f=u<0?.25:.85,p=1+(.35+.65*a-1)*f,m=Fe(u);d=[m[0]*p,m[1]*p,m[2]*p]}let f=(l*n+r)*4;a[f]=d[0]*255,a[f+1]=d[1]*255,a[f+2]=d[2]*255,a[f+3]=255}return a}function Ne(e,t,n){let r=Math.hypot(e,t,n)||1;return[e/r,t/r,n/r]}var Pe=(e,t,n)=>{let r=Math.min(1,Math.max(0,n));return[e[0]+(t[0]-e[0])*r,e[1]+(t[1]-e[1])*r,e[2]+(t[2]-e[2])*r]};function Fe(e){return e<0?Pe([.33,.62,.74],[.04,.12,.27],Math.min(1,-e/5e3)**.45):e<400?Pe([.36,.55,.33],[.55,.64,.38],e/400):e<1200?Pe([.55,.64,.38],[.78,.7,.47],(e-400)/800):e<2500?Pe([.78,.7,.47],[.56,.44,.34],(e-1200)/1300):e<4e3?Pe([.56,.44,.34],[.75,.73,.72],(e-2500)/1500):Pe([.75,.73,.72],[.97,.97,.98],(e-4e3)/2e3)}function Ie(e){let t=((e*.61803398875+.13)%1+1)%1,n=[0,4,2].map(e=>Math.min(1,Math.max(0,Math.abs(((t*6+e)%6+6)%6-3)-1)));return[0,1,2].map(e=>(.5+(n[e]-.5)*.55)*.85+.08)}function Le(e){let t=Math.min(1,Math.max(0,e)),n=[[.2777,.0054,.3341],[.105,1.4046,1.3846],[-.3309,.2148,.0951],[-4.6342,-5.7991,-19.3324],[6.2283,14.1799,56.6906],[4.7764,-13.7451,-65.353],[-5.4355,4.6459,26.3124]];return[0,1,2].map(e=>{let r=n[6][e];for(let i=5;i>=0;i--)r=n[i][e]+t*r;return r})}function Re(e){let t=()=>{let t=e.spec();return _e(t.seed,t.archetype,r)},n=()=>`${location.origin}${location.pathname}?${le(e.spec())}`;return[{id:`screenshot`,label:`Screenshot (PNG)`,hint:`The current 3D view with labels`,async run(){if(e.mode()!==`3d`)return`Switch to the 3D view first`;let n=e.world.capture(performance.now()/1e3);return n?(pe(await he(n.width,n.height,n.pixels),`${t()}-view.png`),`Saved ${n.width}×${n.height} screenshot`):`The graphics context is lost; try again in a moment`}},{id:`heightmap`,label:`Heightmap (16-bit PNG)`,hint:`Macro elevation grid (scale in the world JSON)`,async run(){let n=e.layer(`elevation`);if(!n)return`No elevation yet`;let r=Ae(n),i={Software:`Procedural World`,Description:`Elevation, metres = ${r.minM} + v / 65535 * ${r.maxM-r.minM}; ${n.worldKm} km square, row 0 = north`};return me(await Se(n.w,n.h,je(n,r),i),`${t()}-height-${n.w}.png`,`image/png`),`Saved ${n.w}² heightmap (${r.minM} … ${r.maxM} m)`}},{id:`colormap`,label:`Colour map (PNG)`,hint:`The selected layer at grid resolution`,async run(){let n=e.shownLayer();if(!n)return`No layer yet`;let r=Me(n);return pe(await he(n.w,n.h,r),`${t()}-${n.id}-${n.w}.png`),`Saved ${n.label} (${n.w}²)`}},{id:`json`,label:`World (JSON)`,hint:`Seed, settings, traits and named places`,run(){let r=e.spec(),i=ke({spec:r,query:le(r),shareUrl:n(),resolved:ae(r).values,elevation:e.layer(`elevation`)??null,traits:e.traits(),landmarks:e.landmarks()});return me(new TextEncoder().encode(JSON.stringify(i,null,2)),`${t()}.json`,`application/json`),`Saved world with ${i.landmarks.length} named places`}},{id:`link`,label:`Copy share link`,hint:`Seed, preset and your settings in a URL`,async run(){let e=n();return await ge(e)?`Link copied`:`Copy this link:\n${e}`}}]}var ze=`modulepreload`,Be=function(e,t){return new URL(e,t).href},Ve={},He=function(e){return e.pathname.endsWith(`.css`)},Ue=function(e,t,n){if(t in e)return e[t];let r=n();if(!r){e[t]=void 0;return}let i=r.then(()=>{e[t]=void 0},n=>{throw e[t]=void 0,n});return e[t]=i,i},We=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=Be(t,n);let r=s(t),i=He(r);return Ue(Ve,r.href,()=>{if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let t=document.createElement(`link`);if(t.rel=i?`stylesheet`:ze,i||(t.as=`script`),t.crossOrigin=``,t.href=r.href,a&&t.setAttribute(`nonce`,a),document.head.appendChild(t),i)return new Promise((e,n)=>{t.addEventListener(`load`,e),t.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${r}`)))})})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},Ge=class{onEvent;reqId=0;worker=null;mainPipeline=null;constructor(e){this.onEvent=e,new URLSearchParams(location.search).get(`gen`)===`main`?this.mainPipeline=We(()=>import(`./inThread-DtpJhNKS.js`).then(e=>e.createInThreadRunner(e=>this.deliver(e))),[],import.meta.url):(this.worker=new Worker(new URL(new URL(`gen.worker-BOK1Slmm.js`,import.meta.url).href,``+import.meta.url),{type:`module`}),this.worker.onmessage=e=>this.deliver(e.data),this.worker.onerror=e=>this.onEvent({type:`error`,reqId:this.reqId,message:e.message}))}generate(e,t){let n={type:`generate`,reqId:++this.reqId,resolved:e,mode:t};return this.worker?this.worker.postMessage(n):this.mainPipeline.then(e=>e(n)),n.reqId}deliver(e){e.reqId===this.reqId&&this.onEvent(e)}},Ke=[[[1,0,0],[0,1,0],[0,0,-1]],[[0,1,0],[-1,0,0],[0,0,-1]],[[-1,0,0],[0,-1,0],[0,0,-1]],[[0,-1,0],[1,0,0],[0,0,-1]],[[0,0,1],[0,1,0],[1,0,0]],[[0,0,-1],[0,1,0],[-1,0,0]]],F=Float64Array.from(Ke.flatMap(e=>e[0])),I=Float64Array.from(Ke.flatMap(e=>e[1])),L=Float64Array.from(Ke.flatMap(e=>e[2])),qe=Math.PI/4;function Je(e,t,n,r,i=0){let a=Math.tan(t),o=Math.tan(n),s=e*3,c=F[s]+a*I[s]+o*L[s],l=F[s+1]+a*I[s+1]+o*L[s+1],u=F[s+2]+a*I[s+2]+o*L[s+2],d=1/Math.sqrt(1+a*a+o*o);r[i]=c*d,r[i+1]=l*d,r[i+2]=u*d}function Ye(e,t,n){let r=Math.abs(e),i=Math.abs(t),a=Math.abs(n);return r>=i&&r>=a?e>0?0:2:i>=a?t>0?1:3:n>0?4:5}function Xe(e,t,n,r,i){let a=Ye(e,t,n),o=a*3,s=e*F[o]+t*F[o+1]+n*F[o+2],c=(e*I[o]+t*I[o+1]+n*I[o+2])/s,l=(e*L[o]+t*L[o+1]+n*L[o+2])/s,u=r/(2*qe);i[0]=a,i[1]=(Math.atan(c)+qe)*u,i[2]=(Math.atan(l)+qe)*u}var Ze=new Float64Array(3);function Qe(e,t,n,r){Xe(e,t,n,r,Ze);let i=Math.min(r-1,Math.max(0,Math.floor(Ze[1]))),a=Math.min(r-1,Math.max(0,Math.floor(Ze[2])));return(Ze[0]*r+a)*r+i}function $e(e,t,n,r,i,a=0){Je(e,t/r-qe,n/r-qe,i,a)}function et(e,t,n,r,i){let a=Ye(e,t,n),o=a*3,s=e*F[o]+t*F[o+1]+n*F[o+2];i[0]=a,i[1]=(Math.atan((e*I[o]+t*I[o+1]+n*I[o+2])/s)+qe)*r,i[2]=(Math.atan((e*L[o]+t*L[o+1]+n*L[o+2])/s)+qe)*r}function tt(e,t){return Math.max(9e3,e.extentM*2/(2*Math.tan(t/2)))}function nt(e,t){if(e.face===void 0)return null;let n=new Float64Array(3);return $e(e.face,e.x,e.y,t,n),{x:n[0],y:n[1],z:n[2]}}function rt(e,t,n=1){return`${Math.abs(e).toFixed(n)}° ${e>=0?`N`:`S`}, ${Math.abs(t).toFixed(n)}° ${t>=0?`E`:`W`}`}function it(e,t){let n=nt(e,t);return n?rt(Math.asin(Math.max(-1,Math.min(1,n.z)))*180/Math.PI,Math.atan2(n.y,n.x)*180/Math.PI):``}function at(e,t){let n=Math.max(2e3,e.extentM*.6);return t>n?0:e.importance*(1-t/n)+.001}function ot(e,t,n){let r=null,i=0;for(let a of e){if(a.face!==void 0)continue;let e=at(a,Math.hypot(a.x-t,a.y-n));e>i&&(i=e,r=a)}return r}function st(e,t,n){let r=Math.hypot(t.x,t.y,t.z)||1,i=t.x/r,a=t.y/r,o=t.z/r,s=new Float64Array(3),c=null,l=0;for(let t of e){if(t.face===void 0)continue;$e(t.face,t.x,t.y,n,s);let e=i*s[0]+a*s[1]+o*s[2],r=at(t,n*Math.acos(Math.max(-1,Math.min(1,e))));r>l&&(l=r,c=t)}return c}var ct=1100,lt=8,ut=.0016,dt=.01,ft=140,pt=class{canvas;cam;bounds;keys=new Set;pointerInside=!1;px=0;py=0;dragging=!1;dragWorldX=0;dragWorldY=0;zoomTarget;zoomAnchorX=0;zoomAnchorY=0;lastWheelAt=-1/0;lastWheelKind=`mouse`;edgePan=!1;enabled=!0;touching=!1;constructor(e,t,n){this.canvas=e,this.cam=t,this.bounds=n,this.zoomTarget=t.zoom,e.addEventListener(`pointermove`,this.onMove),e.addEventListener(`pointerdown`,this.onDown),e.addEventListener(`pointerup`,this.onUp),e.addEventListener(`pointerenter`,()=>{this.pointerInside=!0}),e.addEventListener(`pointerleave`,()=>{this.pointerInside=!1}),e.addEventListener(`wheel`,this.onWheel,{passive:!1}),this.installSafariGestures(),window.addEventListener(`keydown`,e=>{ht(e.target)||this.keys.add(e.code)}),window.addEventListener(`keyup`,e=>this.keys.delete(e.code)),window.addEventListener(`blur`,()=>{this.keys.clear(),this.pointerInside=!1})}centerOn(e,t){this.cam.centerX=e,this.cam.centerY=t}setZoom(e){this.zoomTarget=e,this.cam.zoom=e}panScreen(e,t){this.cam.centerX-=e/this.cam.zoom,this.cam.centerY-=t/this.cam.zoom}pinchAt(e,t,n){let r=this.clampZoom(this.cam.zoom*n);this.cam.zoomAt(e,t,r),this.zoomTarget=r}update(e){if(!this.enabled)return;let t=this.cam;if(Math.abs(this.zoomTarget-t.zoom)>1e-4*t.zoom){let n=1-Math.exp(-18*e);t.zoomAt(this.zoomAnchorX,this.zoomAnchorY,t.zoom+(this.zoomTarget-t.zoom)*n)}if(!this.dragging){let n=0,r=0,i=this.keys;if(i.has(`ArrowLeft`)&&--n,i.has(`ArrowRight`)&&(n+=1),i.has(`ArrowUp`)&&--r,i.has(`ArrowDown`)&&(r+=1),this.edgePan&&this.pointerInside&&document.hasFocus()&&(this.px<=lt&&--n,this.px>=t.viewW-lt&&(n+=1),this.py<=lt&&--r,this.py>=t.viewH-lt&&(r+=1)),n!==0||r!==0){let i=Math.hypot(n,r),a=ct*e/t.zoom/i;t.centerX+=n*a,t.centerY+=r*a}}let n=this.bounds();t.clampTo(n.w,n.h)}onMove=e=>{this.pointerInside=!0,this.px=e.offsetX,this.py=e.offsetY,this.dragging&&(this.cam.centerX=this.dragWorldX-(e.offsetX-this.cam.viewW*.5)/this.cam.zoom,this.cam.centerY=this.dragWorldY-(e.offsetY-this.cam.viewH*.5)/this.cam.zoom)};onDown=e=>{this.enabled&&(e.button===0||e.button===1)&&(e.preventDefault(),this.dragging=!0,this.dragWorldX=this.cam.screenToWorldX(e.offsetX),this.dragWorldY=this.cam.screenToWorldY(e.offsetY),this.canvas.setPointerCapture(e.pointerId))};onUp=e=>{(e.button===0||e.button===1)&&(this.dragging=!1,this.canvas.hasPointerCapture(e.pointerId)&&this.canvas.releasePointerCapture(e.pointerId))};onWheel=e=>{if(!this.enabled)return;e.preventDefault();let t=performance.now(),n=e.deltaMode===1?16:e.deltaMode===2?this.cam.viewH:1,r=e.deltaX*n,i=e.deltaY*n;if(e.ctrlKey){let t=this.clampZoom(this.cam.zoom*Math.exp(-i*dt));this.cam.zoomAt(e.offsetX,e.offsetY,t),this.zoomTarget=t;return}let a=t-this.lastWheelAt<ft?this.lastWheelKind:mt(e);this.lastWheelAt=t,this.lastWheelKind=a,a===`trackpad`?(this.cam.centerX+=r/this.cam.zoom,this.cam.centerY+=i/this.cam.zoom):(this.zoomTarget=this.clampZoom(this.zoomTarget*Math.exp(-i*ut)),this.zoomAnchorX=e.offsetX,this.zoomAnchorY=e.offsetY)};installSafariGestures(){let e=1,t=0,n=0;this.canvas.addEventListener(`gesturestart`,r=>{if(r.preventDefault(),this.touching||!this.enabled)return;let i=r;e=this.cam.zoom;let a=this.canvas.getBoundingClientRect();t=i.clientX-a.left,n=i.clientY-a.top}),this.canvas.addEventListener(`gesturechange`,r=>{if(r.preventDefault(),this.touching||!this.enabled)return;let i=this.clampZoom(e*r.scale);this.cam.zoomAt(t,n,i),this.zoomTarget=i}),this.canvas.addEventListener(`gestureend`,e=>e.preventDefault())}clampZoom(e){return Math.min(this.cam.maxZoom,Math.max(this.cam.minZoom,e))}};function mt(e){if(e.deltaMode!==0)return`mouse`;if(e.deltaX!==0)return`trackpad`;let t=e.deltaY;return t!==0&&t%4.000244140625==0||Number.isInteger(t)&&Math.abs(t)>=100?`mouse`:`trackpad`}function ht(e){return e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e instanceof HTMLSelectElement}var gt=.0016,_t=.01,vt=140,yt=.006,bt=.005,xt=.8,St=1.6,Ct=1.4,wt=.9,Tt=4,Et=10,Dt=12,Ot=Math.PI/180*10,kt=Math.PI/180*30,At=class{canvas;cam;enabled=!0;onTap;touching=!1;keys=new Set;lastWheelAt=-1/0;lastWheelKind=`mouse`;mouseMode=`none`;mouseId=-1;grabbed=null;downX=0;downY=0;lastX=0;lastY=0;moved=!1;pts=new Map;touchMode=`idle`;touchGrab=null;tStart=new Map;tLast={cx:0,cy:0,d:1,a:0};constructor(e,t){this.canvas=e,this.cam=t,e.style.touchAction=`none`,e.addEventListener(`pointerdown`,this.onDown),e.addEventListener(`pointermove`,this.onMove),e.addEventListener(`pointerup`,this.onUp),e.addEventListener(`pointercancel`,this.onUp),window.addEventListener(`pointerup`,this.onUp),e.addEventListener(`wheel`,this.onWheel,{passive:!1}),e.addEventListener(`contextmenu`,e=>{this.enabled&&e.preventDefault()}),this.installSafariGestures(),window.addEventListener(`keydown`,this.onKeyDown),window.addEventListener(`keyup`,e=>this.keys.delete(e.code)),window.addEventListener(`blur`,()=>this.reset())}update(e){if(!this.enabled){(this.keys.size||this.mouseMode!==`none`||this.pts.size)&&this.reset();return}let t=this.keys;if(t.size===0)return;let n=this.cam,r=0,i=0;if(t.has(`ArrowLeft`)&&--r,t.has(`ArrowRight`)&&(r+=1),t.has(`ArrowUp`)&&(i+=1),t.has(`ArrowDown`)&&--i,(r!==0||i!==0)&&this.mouseMode!==`grab`){let t=xt*n.metresPerPixel()*n.viewW*e/Math.hypot(r,i);n.panBy(r*t,i*t/Math.cos(n.pitch))}let a=0;(t.has(`Equal`)||t.has(`NumpadAdd`))&&--a,(t.has(`Minus`)||t.has(`NumpadSubtract`))&&(a+=1),a!==0&&n.zoomAt(n.viewW/2,n.viewH/2,Math.exp(a*St*e));let o=0,s=0;t.has(`KeyQ`)&&--o,t.has(`KeyE`)&&(o+=1),t.has(`KeyR`)&&(s+=1),t.has(`KeyF`)&&--s,(o!==0||s!==0)&&n.rotateBy(o*Ct*e,s*wt*e)}reset(){this.keys.clear(),this.mouseMode=`none`,this.grabbed=null,this.pts.clear(),this.touchMode=`idle`,this.touching=!1}onKeyDown=e=>{!this.enabled||ht(e.target)||e.metaKey||e.ctrlKey||e.altKey||(e.code===`Home`?(e.preventDefault(),this.cam.fitWorld()):e.code===`KeyN`?this.cam.resetNorth():(e.code.startsWith(`Arrow`)&&e.preventDefault(),this.keys.add(e.code)))};onDown=e=>{if(!this.enabled)return;if(e.pointerType===`touch`){this.touchDown(e);return}if(this.mouseMode!==`none`)return;let t=e.button===1||e.button===2||e.button===0&&e.ctrlKey;if(t||e.button===0){e.preventDefault(),this.mouseMode=t?`rotate`:`grab`,this.mouseId=e.pointerId,this.downX=this.lastX=e.offsetX,this.downY=this.lastY=e.offsetY,this.moved=!1,this.grabbed=t?null:this.cam.pick(e.offsetX,e.offsetY);try{this.canvas.setPointerCapture(e.pointerId)}catch{}}};onMove=e=>{if(!this.enabled)return;if(e.pointerType===`touch`){this.touchMove(e);return}if(this.mouseMode===`none`||e.pointerId!==this.mouseId)return;let t=e.offsetX,n=e.offsetY;Math.hypot(t-this.downX,n-this.downY)>Tt&&(this.moved=!0),this.mouseMode===`grab`?this.grabbed&&this.cam.dragTo(this.grabbed,t,n):this.cam.rotateBy((t-this.lastX)*yt,-(n-this.lastY)*bt),this.lastX=t,this.lastY=n};onUp=e=>{if(e.pointerType===`touch`){e.currentTarget===this.canvas&&this.touchUp(e);return}if(this.mouseMode===`none`||e.pointerId!==this.mouseId)return;let t=this.mouseMode===`grab`;this.mouseMode=`none`,this.grabbed=null,this.canvas.hasPointerCapture(e.pointerId)&&this.canvas.releasePointerCapture(e.pointerId),t&&!this.moved&&this.enabled&&e.type===`pointerup`&&this.onTap?.(this.downX,this.downY)};onWheel=e=>{if(!this.enabled)return;e.preventDefault();let t=this.cam,n=performance.now(),r=e.deltaMode===1?16:e.deltaMode===2?t.viewH:1,i=e.deltaX*r,a=e.deltaY*r;if(e.ctrlKey){t.pinchAt(e.offsetX,e.offsetY,Math.exp(a*_t));return}let o=n-this.lastWheelAt<vt?this.lastWheelKind:mt(e);if(this.lastWheelAt=n,this.lastWheelKind=o,o===`trackpad`){let e=t.metresPerPixel();t.panBy(i*e,-a*e/Math.cos(t.pitch))}else t.zoomAt(e.offsetX,e.offsetY,Math.exp(a*gt))};installSafariGestures(){let e=1,t=0,n=0,r=0;this.canvas.addEventListener(`gesturestart`,i=>{if(i.preventDefault(),this.touching||!this.enabled)return;let a=i;e=1,t=0;let o=this.canvas.getBoundingClientRect();n=a.clientX-o.left,r=a.clientY-o.top}),this.canvas.addEventListener(`gesturechange`,i=>{if(i.preventDefault(),this.touching||!this.enabled)return;let a=i;a.scale>0&&this.cam.pinchAt(n,r,e/a.scale);let o=a.rotation-t;o!==0&&this.cam.rotateAt(n,r,-o*(Math.PI/180)),e=a.scale,t=a.rotation}),this.canvas.addEventListener(`gestureend`,e=>e.preventDefault())}local(e){let t=this.canvas.getBoundingClientRect();return{x:e.clientX-t.left,y:e.clientY-t.top}}touchDown(e){e.preventDefault();try{this.canvas.setPointerCapture(e.pointerId)}catch{}let t=this.local(e);this.pts.set(e.pointerId,t),this.touching=!0,this.pts.size===1?(this.touchMode=`pending`,this.downX=t.x,this.downY=t.y,this.touchGrab=this.cam.pick(t.x,t.y)):this.pts.size===2&&this.startTwo()}touchMove(e){if(!this.pts.has(e.pointerId))return;e.preventDefault();let t=this.local(e);switch(this.pts.set(e.pointerId,t),this.touchMode){case`pending`:if(Math.hypot(t.x-this.downX,t.y-this.downY)<=Et)break;this.touchMode=`pan`,this.touchGrab&&this.cam.dragTo(this.touchGrab,t.x,t.y);break;case`pan`:this.touchGrab&&this.cam.dragTo(this.touchGrab,t.x,t.y);break;case`decide`:this.decideTwo();break;case`gesture`:{let e=this.two();if(!e)break;let t=this.tLast;this.cam.panScreen(e.cx-t.cx,e.cy-t.cy,e.cx,e.cy),this.cam.pinchAt(e.cx,e.cy,t.d/e.d),this.cam.rotateAt(e.cx,e.cy,-jt(e.a-t.a)),this.tLast=e;break}case`tilt`:{let e=this.two();if(!e)break;this.cam.rotateBy(0,-(e.cy-this.tLast.cy)*bt),this.tLast=e;break}}}touchUp(e){if(this.pts.has(e.pointerId)){if(this.pts.delete(e.pointerId),this.canvas.hasPointerCapture(e.pointerId)&&this.canvas.releasePointerCapture(e.pointerId),this.pts.size===0)this.touchMode===`pending`&&e.type===`pointerup`&&this.enabled&&this.onTap?.(this.downX,this.downY),this.touchMode=`idle`,this.touchGrab=null,this.touching=!1;else if(this.pts.size>=2)this.startTwo();else{let e=this.pts.values().next().value;this.touchMode=`pan`,this.touchGrab=this.cam.pick(e.x,e.y)}}}startTwo(){let e=this.two();e&&(this.touchMode=`decide`,this.tStart=new Map([...this.pts].slice(0,2).map(([e,t])=>[e,{...t}])),this.tLast=e)}decideTwo(){let e=[];for(let[t,n]of this.tStart){let r=this.pts.get(t);r&&e.push({x:r.x-n.x,y:r.y-n.y})}if(e.length<2)return;let[t,n]=e;if(Math.max(Math.hypot(t.x,t.y),Math.hypot(n.x,n.y))<Dt)return;let r=e=>Math.abs(Math.atan2(Math.abs(e.x),Math.abs(e.y)))<=kt,i=Math.abs(jt(Math.atan2(t.y,t.x)-Math.atan2(n.y,n.x)))<=Ot&&r(t)&&r(n)&&Math.sign(t.y)===Math.sign(n.y);this.touchMode=i?`tilt`:`gesture`;let a=this.two();if(!a)return;let o=this.twoOf([...this.tStart.values()]);if(o&&(this.tLast=o),i)this.cam.rotateBy(0,-(a.cy-this.tLast.cy)*bt),this.tLast=a;else{let e=this.tLast;this.cam.panScreen(a.cx-e.cx,a.cy-e.cy,a.cx,a.cy),this.cam.pinchAt(a.cx,a.cy,e.d/a.d),this.cam.rotateAt(a.cx,a.cy,-jt(a.a-e.a)),this.tLast=a}}two(){return this.twoOf([...this.pts.values()])}twoOf(e){let t=e[0],n=e[1];return!t||!n?null:{cx:(t.x+n.x)/2,cy:(t.y+n.y)/2,d:Math.max(1,Math.hypot(t.x-n.x,t.y-n.y)),a:Math.atan2(n.y-t.y,n.x-t.x)}}};function jt(e){return Math.atan2(Math.sin(e),Math.cos(e))}function Mt(e,t,n){return{xKm:e/1e3,yKm:(n-t)/1e3}}var Nt=class{centerX=0;centerY=0;zoom=1;viewW=1;viewH=1;dpr=1;minZoom=.05;maxZoom=400;viewMatrix(e){let t=2*this.zoom/this.viewW,n=-2*this.zoom/this.viewH;return e[0]=t,e[1]=0,e[2]=0,e[3]=0,e[4]=n,e[5]=0,e[6]=-this.centerX*t,e[7]=-this.centerY*n,e[8]=1,e}screenToWorldX(e){return this.centerX+(e-this.viewW*.5)/this.zoom}screenToWorldY(e){return this.centerY+(e-this.viewH*.5)/this.zoom}worldToScreenX(e){return(e-this.centerX)*this.zoom+this.viewW*.5}worldToScreenY(e){return(e-this.centerY)*this.zoom+this.viewH*.5}get pxPerUnit(){return this.zoom*this.dpr}zoomAt(e,t,n){let r=this.screenToWorldX(e),i=this.screenToWorldY(t);this.zoom=Math.min(this.maxZoom,Math.max(this.minZoom,n)),this.centerX=r-(e-this.viewW*.5)/this.zoom,this.centerY=i-(t-this.viewH*.5)/this.zoom}fit(e,t,n={top:0,right:0,bottom:0,left:0}){let r=Math.max(1,this.viewW-n.left-n.right),i=Math.max(1,this.viewH-n.top-n.bottom),a=.94*Math.min(r/e,i/t);this.minZoom=a*.5,this.maxZoom=Math.max(a*256,a),this.zoom=a,this.centerX=e/2+(n.right-n.left)/2/a,this.centerY=t/2+(n.bottom-n.top)/2/a}clampTo(e,t){let n=this.viewW/this.zoom/2,r=this.viewH/this.zoom/2;this.centerX=Math.min(e+n*.5,Math.max(-n*.5,this.centerX)),this.centerY=Math.min(t+r*.5,Math.max(-r*.5,this.centerY))}},Pt=class{idleFps;settleMs=250;lastBusy=-1/0;lastDraw=-1/0;constructor(e=30){this.idleFps=e}shouldDraw(e,t,n){t&&(this.lastBusy=e);let r;return r=e-this.lastBusy<this.settleMs?!0:!n||this.idleFps<=0?!1:e-this.lastDraw>=1e3/this.idleFps-4,r&&(this.lastDraw=e),r}wake(e=performance.now()){this.lastBusy=e}},Ft=new WeakMap;function It(e,t){let n=Ft.get(e);return n||Ft.set(e,n={}),n[t]??=t===`net`?Bt(e):Lt(e)}function Lt(e){let t=e.w,n=4*t,r=2*t,i=new Float32Array(n*r),a=e.data,o=new Float64Array(n),s=new Float64Array(n);for(let e=0;e<n;e++){let t=(e+.5)/n*2*Math.PI-Math.PI;o[e]=Math.cos(t),s[e]=Math.sin(t)}let c=new Float64Array(3);for(let e=0;e<r;e++){let l=Math.PI/2-(e+.5)/r*Math.PI,u=Math.cos(l),d=Math.sin(l);for(let r=0;r<n;r++){Xe(u*o[r],u*s[r],d,t,c);let l=Math.min(t-1,Math.floor(c[1])),f=Math.min(t-1,Math.floor(c[2]));i[e*n+r]=a[(c[0]*t+f)*t+l]}}return Rt(e,n,r,i,`equirect`)}function Rt(e,t,n,r,i){let{faces:a,...o}=e;return{...o,w:t,h:n,worldKm:4*e.worldKm,data:r,projection:i}}var zt=[[1,1],[2,1],[3,1],[0,1],[1,0],[1,2]];function Bt(e){let t=e.w,n=4*t,r=3*t,i=new Float32Array(n*r).fill(NaN);for(let r=0;r<6;r++){let[a,o]=zt[r];for(let s=0;s<t;s++){let c=(o*t+s)*n+a*t,l=(r*t+s)*t;for(let n=0;n<t;n++)i[c+n]=e.data[l+n]}}return Rt(e,n,r,i,`net`)}function Vt(e,t,n){return[90-n/(e.worldKm/2)*180,t/e.worldKm*360-180]}var Ht=168,Ut=84,Wt=class{cam;el;ctx;base=null;dragging=!1;dpr;constructor(e,t){this.cam=t,this.el=document.createElement(`canvas`),this.el.className=`minimap minimap-globe`,this.dpr=Math.min(window.devicePixelRatio||1,2),this.el.width=Ht*this.dpr,this.el.height=Ut*this.dpr,this.el.style.width=`${Ht}px`,this.el.style.height=`${Ut}px`,this.el.hidden=!0,e.prepend(this.el),this.ctx=this.el.getContext(`2d`);let n=e=>{let t=this.el.getBoundingClientRect(),n=(e.clientX-t.left)/t.width*360-180,r=90-(e.clientY-t.top)/t.height*180;this.cam.flyToLatLon(Math.max(-89.5,Math.min(89.5,r)),n)};this.el.addEventListener(`pointerdown`,e=>{this.dragging=!0,this.el.setPointerCapture(e.pointerId),n(e)}),this.el.addEventListener(`pointermove`,e=>{this.dragging&&n(e)}),this.el.addEventListener(`pointerup`,()=>this.dragging=!1)}setTerrain(e){let t=It(e,`equirect`),n=this.el.width,r=this.el.height,i=this.ctx.createImageData(n,r),a=t.data,o=t.worldKm*1e3/t.w;for(let e=0;e<r;e++){let s=Math.min(t.h-2,Math.floor(e/r*t.h));for(let r=0;r<n;r++){let c=Math.min(t.w-2,Math.floor(r/n*t.w)),l=a[s*t.w+c],u=(a[s*t.w+c+1]-l)/o,d=(a[(s+1)*t.w+c]-l)/o,f=l>0?Math.min(1.4,Math.max(.45,1-6*(u+d))):1,[p,m,h]=Gt(l),g=(e*n+r)*4;i.data[g]=p*f,i.data[g+1]=m*f,i.data[g+2]=h*f,i.data[g+3]=255}}this.base=i}draw(){if(!this.base||this.el.hidden)return;let e=this.ctx,t=this.el.width,n=this.el.height;e.putImageData(this.base,0,0);let r=this.cam,i=r.radius,a=[],o=(e,o,s,c)=>{for(let l=0;l<12;l++){let u=l/12,d=r.sphereHit(e+(s-e)*u,o+(c-o)*u,i),f=Math.hypot(d.x,d.y,d.z),p=Math.asin(d.z/f),m=Math.atan2(d.y,d.x);a.push([(m/Math.PI+1)/2*t,(.5-p/Math.PI)*n])}},s=r.viewW,c=r.viewH;o(0,0,s,0),o(s,0,s,c),o(s,c,0,c),o(0,c,0,0),e.lineWidth=Math.max(1,t/160),e.strokeStyle=`rgba(255,255,255,0.9)`,e.beginPath(),a.forEach(([n,r],i)=>{let o=a[(i+a.length-1)%a.length];i===0||Math.abs(n-o[0])>t/2?e.moveTo(n,r):e.lineTo(n,r)});let[l,u]=a[0],d=a[a.length-1];Math.abs(l-d[0])<=t/2&&e.lineTo(l,u),e.stroke();let[f,p]=r.latLon();e.fillStyle=`rgba(255,255,255,0.95)`,e.beginPath(),e.arc((p+180)/360*t,(90-f)/180*n,2*this.dpr,0,2*Math.PI),e.fill()}};function Gt(e){if(e<0){let t=Math.min(1,-e/5e3)**.45;return[84-74*t,158-128*t,189-120*t]}let t=[[0,92,140,84],[400,140,163,97],[1200,199,179,120],[2500,143,112,87],[4e3,191,186,184],[6e3,247,247,250]];for(let n=1;n<t.length;n++)if(e<=t[n][0]){let r=t[n-1],i=t[n],a=(e-r[0])/(i[0]-r[0]);return[r[1]+(i[1]-r[1])*a,r[2]+(i[2]-r[2])*a,r[3]+(i[3]-r[3])*a]}return[247,247,250]}var Kt=-9e3;function qt(e,t,n){let r=e.w,i=Float32Array.from(t.data),a=n?Float32Array.from(n.data):new Float32Array(r*r);for(let e=0;e<2;e++){let e=i.slice(),t=a.slice();for(let n=0;n<r;n++)for(let o=0;o<r;o++){let s=n*r+o;if(e[s]>-9e3)continue;let c=-9001,l=0;for(let i=-1;i<=1;i++)for(let a=-1;a<=1;a++){let s=o+a,u=n+i;if(s<0||u<0||s>=r||u>=r)continue;let d=u*r+s;e[d]>c&&(c=e[d],l=t[d])}c>-9e3&&(i[s]=c,a[s]===0&&(a[s]=l))}}return{level:i,cls:a}}function Jt(e,t){let n=e.data,r=new Float32Array(n.length);for(let e=0;e<n.length;e++){let i=t?t[e]:n[e]<0?0:-9001;r[e]=i>-9e3?Math.max(n[e],i):Math.max(n[e],0)}return r}var Yt=class{size;n;cell;data;surface;minPyr=[];maxPyr=[];exaggeration=1;constructor(e,t=null){this.n=e.w,this.size=e.worldKm*1e3,this.cell=this.size/this.n,this.data=e.data instanceof Float32Array?e.data:Float32Array.from(e.data),this.surface=Jt(e,t);let n=this.surface,r=n.slice();this.minPyr.push(n),this.maxPyr.push(r);for(let e=this.n;e>1;e>>=1){let t=e>>1,i=new Float32Array(t*t),a=new Float32Array(t*t);for(let o=0;o<t;o++)for(let s=0;s<t;s++){let c=2*o*e+2*s;i[o*t+s]=Math.min(n[c],n[c+1],n[c+e],n[c+e+1]),a[o*t+s]=Math.max(r[c],r[c+1],r[c+e],r[c+e+1])}this.minPyr.push(i),this.maxPyr.push(a),n=i,r=a}}elevationAt(e,t){return this.bilinear(this.data,e,t)}heightAt(e,t){return this.bilinear(this.surface,e,t)*this.exaggeration}bilinear(e,t,n){let r=Math.min(this.n-1,Math.max(0,t/this.cell-.5)),i=Math.min(this.n-1,Math.max(0,(this.size-n)/this.cell-.5)),a=Math.floor(r),o=Math.floor(i),s=Math.min(this.n-1,a+1),c=Math.min(this.n-1,o+1),l=r-a,u=i-o,d=this.n,f=e[o*d+a]+(e[o*d+s]-e[o*d+a])*l;return f+(e[c*d+a]+(e[c*d+s]-e[c*d+a])*l-f)*u}rangeOver(e,t,n){let r=Math.max(0,Math.min(this.minPyr.length-1,Math.floor(Math.log2(Math.max(1,n/this.cell))))),i=this.n>>r,a=this.size/i,o=Math.max(0,Math.floor(e/a)),s=Math.min(i-1,Math.floor((e+n)/a)),c=Math.max(0,Math.floor((this.size-(t+n))/a)),l=Math.min(i-1,Math.floor((this.size-t)/a)),u=1/0,d=-1/0,f=this.minPyr[r],p=this.maxPyr[r];for(let e=c;e<=l;e++)for(let t=o;t<=s;t++)u=Math.min(u,f[e*i+t]),d=Math.max(d,p[e*i+t]);return[u*this.exaggeration,d*this.exaggeration]}get maxHeight(){return this.maxPyr[this.maxPyr.length-1][0]*this.exaggeration}raycast(e,t){let n=this.maxHeight+1,r=0,i=1/0,a=(e,t,n,a)=>{if(Math.abs(t)<1e-12)return e>=n&&e<=a;let o=(n-e)/t,s=(a-e)/t;return o>s&&([o,s]=[s,o]),r=Math.max(r,o),i=Math.min(i,s),r<=i};if(!a(e.x,t.x,0,this.size)||!a(e.y,t.y,0,this.size)||!a(e.z,t.z,-1,n))return null;let o=Math.hypot(t.x,t.y,t.z),s=.5*this.cell/Math.max(1e-9,Math.hypot(t.x,t.y)/o)/o,c=n=>e.z+t.z*n-this.heightAt(e.x+t.x*n,e.y+t.y*n),l=r;if(c(l)<=0)return Xt(e,t,l);let u=Math.min(s,(i-r)/2);for(let n=r+u;n<=i+u;n+=u){let r=Math.min(n,i);if(c(r)<=0){let n=l,i=r;for(let e=0;e<24;e++){let e=(n+i)/2;c(e)>0?n=e:i=e}return Xt(e,t,i)}if(l=r,r===i)break}return null}};function Xt(e,t,n){return{x:e.x+t.x*n,y:e.y+t.y*n,z:e.z+t.z*n}}var Zt=168,Qt=class{cam;el;ctx;base=null;worldM=1;dragging=!1;constructor(e,t){this.cam=t,this.el=document.createElement(`canvas`),this.el.className=`minimap`;let n=Math.min(window.devicePixelRatio||1,2);this.el.width=Zt*n,this.el.height=Zt*n,this.el.style.width=`${Zt}px`,this.el.style.height=`${Zt}px`,e.prepend(this.el),this.ctx=this.el.getContext(`2d`);let r=e=>{let t=this.el.getBoundingClientRect(),n=(e.clientX-t.left)/t.width*this.worldM,r=this.worldM-(e.clientY-t.top)/t.height*this.worldM;this.cam.flyTo(n,r)};this.el.addEventListener(`pointerdown`,e=>{this.dragging=!0,this.el.setPointerCapture(e.pointerId),r(e)}),this.el.addEventListener(`pointermove`,e=>{this.dragging&&r(e)}),this.el.addEventListener(`pointerup`,()=>this.dragging=!1)}setTerrain(e,t=null){let n=t&&t.w===e.w?t.data:null,r=this.el.width,i=this.ctx.createImageData(r,r),a=e.w,o=e.data,s=e.worldKm*1e3/a;for(let e=0;e<r;e++)for(let t=0;t<r;t++){let c=Math.min(a-2,Math.floor(t/r*a)),l=Math.min(a-2,Math.floor(e/r*a)),u=o[l*a+c],d=n?n[l*a+c]:Kt-1,f=d>-9e3&&d>u&&u>=0?-Math.min(400,d-u)*3:u,p=(o[l*a+c+1]-f)/s,m=(o[(l+1)*a+c]-f)/s,h=f>0?Math.min(1.4,Math.max(.45,1-6*(p+m))):1,[g,_,v]=$t(f),y=(e*r+t)*4;i.data[y]=g*h,i.data[y+1]=_*h,i.data[y+2]=v*h,i.data[y+3]=255}this.base=i,this.worldM=e.worldKm*1e3}draw(){if(!this.base)return;let e=this.ctx,t=this.el.width;e.putImageData(this.base,0,0);let n=this.cam,r=[],i=[[0,0],[n.viewW,0],[n.viewW,n.viewH],[0,n.viewH]];for(let[e,a]of i){let i=n.planeHit(e,a,0);i&&r.push([i.x/this.worldM*t,(1-i.y/this.worldM)*t])}r.length<3||(e.beginPath(),r.forEach(([t,n],r)=>r===0?e.moveTo(t,n):e.lineTo(t,n)),e.closePath(),e.fillStyle=`rgba(255,255,255,0.12)`,e.fill(),e.lineWidth=Math.max(1,t/160),e.strokeStyle=`rgba(255,255,255,0.9)`,e.stroke())}};function $t(e){if(e<0){let t=Math.min(1,-e/5e3)**.45;return[84-74*t,158-128*t,189-120*t]}let t=[[0,92,140,84],[400,140,163,97],[1200,199,179,120],[2500,143,112,87],[4e3,191,186,184],[6e3,247,247,250]];for(let n=1;n<t.length;n++)if(e<=t[n][0]){let r=t[n-1],i=t[n],a=(e-r[0])/(i[0]-r[0]);return[r[1]+(i[1]-r[1])*a,r[2]+(i[2]-r[2])*a,r[3]+(i[3]-r[3])*a]}return[247,247,250]}function en(e,t,n,r){let i=tn(e,t,e.VERTEX_SHADER,n),a=tn(e,t,e.FRAGMENT_SHADER,r),o=e.createProgram();if(e.attachShader(o,i),e.attachShader(o,a),e.linkProgram(o),!e.getProgramParameter(o,e.LINK_STATUS))throw Error(`[${t}] link failed: ${e.getProgramInfoLog(o)??``}`);return e.deleteShader(i),e.deleteShader(a),o}function tn(e,t,n,r){let i=e.createShader(n);if(e.shaderSource(i,r),e.compileShader(i),!e.getShaderParameter(i,e.COMPILE_STATUS)){let a=e.getShaderInfoLog(i)??``,o=r.split(`
`).map((e,t)=>`${String(t+1).padStart(3)}: ${e}`).join(`
`);throw Error(`[${t}] ${n===e.VERTEX_SHADER?`vertex`:`fragment`} shader: ${a}\n${o}`)}return i}function nn(e,t,n){let r={};for(let i of n)r[i]=e.getUniformLocation(t,i);return r}function rn(e){let t=e.createBuffer();return e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,1,1,-1,-1,1,1,-1,1]),e.STATIC_DRAW),t}var an=`#version 300 es
precision highp float;
layout(location = 0) in vec2 a_pos;   // unit square
uniform mat3 u_view;
uniform float u_worldKm;
uniform float u_aspect;              // height / width (1 for square maps, ½ for equirectangular globes)
out vec2 v_uv;
void main() {
  v_uv = a_pos;
  vec3 c = u_view * vec3(a_pos * vec2(u_worldKm, u_worldKm * u_aspect), 1.0);
  gl_Position = vec4(c.xy, 0.0, 1.0);
}`,on=`#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 v_uv;
uniform sampler2D u_tex;
uniform ivec2 u_size;
uniform int u_mode;          // 0 elevation, 1 categorical, 2 scalar
uniform float u_min, u_max;
uniform float u_cellM;       // cell size in metres
uniform float u_exag;        // hillshade exaggeration
out vec4 o;

float fetchC(ivec2 t) { return texelFetch(u_tex, clamp(t, ivec2(0), u_size - 1), 0).r; }

// Manual bilinear: R32F is not filterable everywhere (research 04 §1.3).
float heightAt(vec2 p) {
  vec2 q = p - 0.5;
  ivec2 i = ivec2(floor(q));
  vec2 f = q - vec2(i);
  float a = fetchC(i), b = fetchC(i + ivec2(1, 0)), c = fetchC(i + ivec2(0, 1)), d = fetchC(i + ivec2(1, 1));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

vec3 ramp(float t, vec3 a, vec3 b) { return mix(a, b, clamp(t, 0.0, 1.0)); }

vec3 hypsometric(float h) {
  if (h < 0.0) {
    float d = clamp(-h / 5000.0, 0.0, 1.0);
    return mix(vec3(0.33, 0.62, 0.74), vec3(0.04, 0.12, 0.27), pow(d, 0.45));
  }
  if (h < 400.0)  return ramp(h / 400.0, vec3(0.36, 0.55, 0.33), vec3(0.55, 0.64, 0.38));
  if (h < 1200.0) return ramp((h - 400.0) / 800.0, vec3(0.55, 0.64, 0.38), vec3(0.78, 0.70, 0.47));
  if (h < 2500.0) return ramp((h - 1200.0) / 1300.0, vec3(0.78, 0.70, 0.47), vec3(0.56, 0.44, 0.34));
  if (h < 4000.0) return ramp((h - 2500.0) / 1500.0, vec3(0.56, 0.44, 0.34), vec3(0.75, 0.73, 0.72));
  return ramp((h - 4000.0) / 2000.0, vec3(0.75, 0.73, 0.72), vec3(0.97, 0.97, 0.98));
}

vec3 categorical(float id) {
  float h = fract(id * 0.61803398875 + 0.13);
  vec3 k = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return mix(vec3(0.5), k, 0.55) * 0.85 + 0.08;
}

vec3 viridis(float t) {
  t = clamp(t, 0.0, 1.0);
  const vec3 c0 = vec3(0.2777, 0.0054, 0.3341), c1 = vec3(0.1050, 1.4046, 1.3846), c2 = vec3(-0.3309, 0.2148, 0.0951);
  const vec3 c3 = vec3(-4.6342, -5.7991, -19.3324), c4 = vec3(6.2283, 14.1799, 56.6906), c5 = vec3(4.7764, -13.7451, -65.3530);
  const vec3 c6 = vec3(-5.4355, 4.6459, 26.3124);
  return c0 + t * (c1 + t * (c2 + t * (c3 + t * (c4 + t * (c5 + t * c6)))));
}

const vec4 BACKGROUND = vec4(0.035, 0.04, 0.05, 1.0);

void main() {
  vec2 p = v_uv * vec2(u_size);
  if (u_mode == 1) {
    float id = fetchC(ivec2(floor(p)));
    // NaN marks cells outside the raster (the gaps of a cube-net projection).
    o = isnan(id) ? BACKGROUND : vec4(categorical(floor(id + 0.5)), 1.0);
    return;
  }
  float h = heightAt(p);
  if (isnan(h)) {
    o = BACKGROUND;
    return;
  }
  if (u_mode == 2) {
    o = vec4(viridis((h - u_min) / max(1e-6, u_max - u_min)), 1.0);
    return;
  }
  // Elevation: hypsometric tint + north-west hillshade (light from the top-left of the map).
  float e = 0.5;
  float dx = (heightAt(p + vec2(e, 0.0)) - heightAt(p - vec2(e, 0.0))) / (2.0 * e * u_cellM);
  float dy = (heightAt(p + vec2(0.0, e)) - heightAt(p - vec2(0.0, e))) / (2.0 * e * u_cellM);
  vec3 n = normalize(vec3(-dx * u_exag, -dy * u_exag, 1.0));
  vec3 L = normalize(vec3(-0.6, -0.6, 0.75));
  float shade = isnan(dx + dy) ? 1.0 : clamp(dot(n, L) / L.z, 0.0, 1.6);
  vec3 c = hypsometric(h);
  float k = h < 0.0 ? 0.25 : 0.85;
  c *= mix(1.0, 0.35 + 0.65 * shade, k);
  // Thin coastline.
  float w = fwidth(h);
  c = mix(c, vec3(0.05, 0.09, 0.14), (1.0 - smoothstep(0.0, 1.5 * w, abs(h))) * 0.6);
  o = vec4(c, 1.0);
}`,sn={elevation:0,categorical:1,scalar:2},cn=class{canvas;gl;prog;u;vao;tex;layer=null;view=new Float32Array(9);exaggeration=12;constructor(e){this.canvas=e;let t=e.getContext(`webgl2`,{antialias:!1,alpha:!1});if(!t)throw Error(`WebGL2 is not available in this browser.`);this.gl=t,this.prog=en(t,`raster`,an,on),this.u=nn(t,this.prog,[`u_view`,`u_worldKm`,`u_aspect`,`u_tex`,`u_size`,`u_mode`,`u_min`,`u_max`,`u_cellM`,`u_exag`]),this.vao=t.createVertexArray(),t.bindVertexArray(this.vao);let n=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array([0,0,1,0,1,1,0,0,1,1,0,1]),t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),t.bindVertexArray(null),this.tex=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.tex),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}setLayer(e){let t=this.gl,n=e.data instanceof Float32Array?e.data:Float32Array.from(e.data);t.bindTexture(t.TEXTURE_2D,this.tex),t.pixelStorei(t.UNPACK_ALIGNMENT,1),t.texImage2D(t.TEXTURE_2D,0,t.R32F,e.w,e.h,0,t.RED,t.FLOAT,n),this.layer=e}resize(e){let t=Math.min(window.devicePixelRatio||1,2),n=this.canvas.clientWidth,r=this.canvas.clientHeight;e.viewW=n,e.viewH=r,e.dpr=t;let i=Math.max(1,Math.round(n*t)),a=Math.max(1,Math.round(r*t));(this.canvas.width!==i||this.canvas.height!==a)&&(this.canvas.width=i,this.canvas.height=a)}draw(e){let t=this.gl;t.viewport(0,0,this.canvas.width,this.canvas.height),t.clearColor(.035,.04,.05,1),t.clear(t.COLOR_BUFFER_BIT);let n=this.layer;n&&(t.useProgram(this.prog),t.uniformMatrix3fv(this.u.u_view,!1,e.viewMatrix(this.view)),t.uniform1f(this.u.u_worldKm,n.worldKm),t.uniform1f(this.u.u_aspect,n.h/n.w),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.tex),t.uniform1i(this.u.u_tex,0),t.uniform2i(this.u.u_size,n.w,n.h),t.uniform1i(this.u.u_mode,sn[n.kind]),t.uniform1f(this.u.u_min,n.min),t.uniform1f(this.u.u_max,n.max),t.uniform1f(this.u.u_cellM,n.worldKm*1e3/n.w),t.uniform1f(this.u.u_exag,this.exaggeration),t.bindVertexArray(this.vao),t.drawArrays(t.TRIANGLES,0,6),t.bindVertexArray(null))}};function ln(e,t,n){let r=Math.floor(t/e.worldKm*e.w),i=Math.floor(n/e.worldKm*e.w);if(r<0||i<0||r>=e.w||i>=e.h)return null;let a=e.data[i*e.w+r];return Number.isNaN(a)?null:a}var un=/\b(adreno|mali|powervr|immortalis|xclipse|videocore|sgx)\b/i;function dn(e){return e.mobileUA||un.test(e.renderer)||e.coarsePointer&&e.minScreenCss<=1100||e.deviceMemoryGB!==null&&e.deviceMemoryGB<=2?`low`:e.deviceMemoryGB!==null&&e.deviceMemoryGB<=4?`medium`:`high`}function fn(e){switch(e){case`low`:return{tier:e,maxPixelRatio:2.25,denseScale:.75,msaa:0,maxDetail:2048,vertexPx:4,idleFps:30};case`medium`:return{tier:e,maxPixelRatio:1.5,denseScale:1,msaa:2,maxDetail:2048,vertexPx:3.5,idleFps:30};case`high`:return{tier:e,maxPixelRatio:2,denseScale:1,msaa:4,maxDetail:4096,vertexPx:3,idleFps:30}}}function pn(e,t){return fn(e===`auto`?dn(t):e)}function mn(e,t){let n=Math.max(1,t||1);return Math.min(e.maxPixelRatio,n>=2.5?n*e.denseScale:n)}function hn(e){return e===`auto`||e===`high`||e===`medium`||e===`low`?e:null}function gn(e){let t=navigator,n=``;if(e){let t=e.getExtension(`WEBGL_debug_renderer_info`);n=String(e.getParameter(t?t.UNMASKED_RENDERER_WEBGL:e.RENDERER)??``)}let r=t.userAgentData?.mobile??/Android|iPhone|iPad|iPod|Mobile/i.test(t.userAgent);return{devicePixelRatio:window.devicePixelRatio||1,coarsePointer:matchMedia(`(pointer: coarse)`).matches,minScreenCss:Math.min(screen.width,screen.height),deviceMemoryGB:typeof t.deviceMemory==`number`?t.deviceMemory:null,renderer:n,mobileUA:r}}function _n(){return vn(new Float64Array(16))}function vn(e){return e.fill(0),e[0]=e[5]=e[10]=e[15]=1,e}var R=new Float64Array(16);function yn(e,t,n){for(let e=0;e<4;e++){let r=n[e*4],i=n[e*4+1],a=n[e*4+2],o=n[e*4+3];for(let n=0;n<4;n++)R[e*4+n]=t[n]*r+t[4+n]*i+t[8+n]*a+t[12+n]*o}return e.set(R),e}function bn(e,t,n,r,i){let a=1/Math.tan(t/2);return e.fill(0),e[0]=a/n,e[5]=a,e[10]=(i+r)/(r-i),e[11]=-1,e[14]=2*i*r/(r-i),e}function xn(e,t,n,r){let i=1/Math.tan(t/2);return e.fill(0),e[0]=i/n,e[5]=i,e[11]=-1,e[14]=r,e}function Sn(e,t,n,r){let i=n.x-t.x,a=n.y-t.y,o=n.z-t.z,s=Math.hypot(i,a,o);i/=s,a/=s,o/=s;let c=a*r.z-o*r.y,l=o*r.x-i*r.z,u=i*r.y-a*r.x;s=Math.hypot(c,l,u),c/=s,l/=s,u/=s;let d=l*o-u*a,f=u*i-c*o,p=c*a-l*i;return e[0]=c,e[1]=d,e[2]=-i,e[3]=0,e[4]=l,e[5]=f,e[6]=-a,e[7]=0,e[8]=u,e[9]=p,e[10]=-o,e[11]=0,e[12]=-(c*t.x+l*t.y+u*t.z),e[13]=-(d*t.x+f*t.y+p*t.z),e[14]=i*t.x+a*t.y+o*t.z,e[15]=1,e}function Cn(e,t){let n=t[0],r=t[1],i=t[2],a=t[3],o=t[4],s=t[5],c=t[6],l=t[7],u=t[8],d=t[9],f=t[10],p=t[11],m=t[12],h=t[13],g=t[14],_=t[15],v=n*s-r*o,y=n*c-i*o,b=n*l-a*o,x=r*c-i*s,S=r*l-a*s,C=i*l-a*c,w=u*h-d*m,T=u*g-f*m,E=u*_-p*m,D=d*g-f*h,O=d*_-p*h,k=f*_-p*g,A=v*k-y*O+b*D+x*E-S*T+C*w;if(!A)return null;let j=1/A;return R[0]=(s*k-c*O+l*D)*j,R[1]=(i*O-r*k-a*D)*j,R[2]=(h*C-g*S+_*x)*j,R[3]=(f*S-d*C-p*x)*j,R[4]=(c*E-o*k-l*T)*j,R[5]=(n*k-i*E+a*T)*j,R[6]=(g*b-m*C-_*y)*j,R[7]=(u*C-f*b+p*y)*j,R[8]=(o*O-s*E+l*w)*j,R[9]=(r*E-n*O-a*w)*j,R[10]=(m*S-h*b+_*v)*j,R[11]=(d*b-u*S-p*v)*j,R[12]=(s*T-o*D-c*w)*j,R[13]=(n*D-r*T+i*w)*j,R[14]=(h*y-m*x-g*v)*j,R[15]=(u*x-d*y+f*v)*j,e.set(R),e}var wn=Math.PI/180,Tn=60*wn,En=100,Dn=30,On=1.1,kn=1.3,An=.1,jn=2,Mn=2e5,Nn=3e3,Pn=42*wn,Fn=1.42;function In(e){let t=Math.log(Mn/e)/Math.log(Mn/Nn),n=Math.min(1,Math.max(0,t));return Pn*n*n*(3-2*n)}var Ln=class{target={x:0,y:0,z:0};distance=1e3;pitch=0;bearing=0;fovY=32*wn;viewW=1;viewH=1;reversedZ=!1;autoTilt=!0;ground;zoomPending=0;zoomAnchor=null;bearingGoal=null;flight=null;constructor(e){this.ground=e,this.fitWorld()}setGround(e){let t=e.size!==this.ground.size;this.ground=e,t?this.fitWorld():(this.reseat(),this.settle())}get moving(){return this.flight!==null||this.zoomPending!==0||this.bearingGoal!==null}eye(){let e=Math.sin(this.pitch)*this.distance;return{x:this.target.x-e*Math.sin(this.bearing),y:this.target.y-e*Math.cos(this.bearing),z:this.target.z+this.distance*Math.cos(this.pitch)}}basis(){let e=Math.sin(this.bearing),t=Math.cos(this.bearing),n=Math.sin(this.pitch),r=Math.cos(this.pitch);return{r:{x:t,y:-e,z:0},u:{x:e*r,y:t*r,z:n},f:{x:e*n,y:t*n,z:-r}}}clearance(){let e=this.eye();return Math.max(1,e.z-this.groundAt(e.x,e.y))}near(){let e=this.clearance();if(this.reversedZ)return Math.max(1,Math.min(5e-4*e,.5*e));let t=Math.min(5e3,Math.max(1,.3*e));return Math.max(t,this.farStandard(t)/1e5)}far(){return this.reversedZ?1/0:this.farStandard(Math.min(5e3,Math.max(1,.3*this.clearance())))}farStandard(e){let t=this.eye(),n=this.ground.size,r=Math.min(0,this.target.z)-1e3,i=0;for(let e of[0,n])for(let a of[0,n])i=Math.max(i,Math.hypot(e-t.x,a-t.y,r-t.z));return Math.max(2*e,Math.min(i*1.05,1e5*e))}viewProjRelative(e,t){let n=this.eye(),{u:r}=this.basis(),i=Sn(new Float64Array(16),{x:n.x-t.x,y:n.y-t.y,z:n.z-t.z},{x:this.target.x-t.x,y:this.target.y-t.y,z:this.target.z-t.z},r),a=this.viewW/this.viewH,o=new Float64Array(16);return this.reversedZ?xn(o,this.fovY,a,this.near()):bn(o,this.fovY,a,this.near(),this.far()),e.set(yn(o,o,i)),e}frustumPlanesRelative(e,t){let n=this.eye(),r=n.x-t.x,i=n.y-t.y,a=n.z-t.z,{r:o,u:s,f:c}=this.basis(),l=Math.tan(this.fovY/2),u=l*(this.viewW/this.viewH),d=(t,n,r,i,a,o,s)=>{let c=Math.hypot(n,r,i);n/=c,r/=c,i/=c,e[t*4]=n,e[t*4+1]=r,e[t*4+2]=i,e[t*4+3]=-(n*a+r*o+i*s)};d(0,o.x+c.x*u,o.y+c.y*u,o.z+c.z*u,r,i,a),d(1,-o.x+c.x*u,-o.y+c.y*u,-o.z+c.z*u,r,i,a),d(2,s.x+c.x*l,s.y+c.y*l,s.z+c.z*l,r,i,a),d(3,-s.x+c.x*l,-s.y+c.y*l,-s.z+c.z*l,r,i,a);let f=this.near();d(4,c.x,c.y,c.z,r+c.x*f,i+c.y*f,a+c.z*f);let p=this.far();return Number.isFinite(p)?d(5,-c.x,-c.y,-c.z,r+c.x*p,i+c.y*p,a+c.z*p):(e[20]=-c.x,e[21]=-c.y,e[22]=-c.z,e[23]=1/0),e}screenRay(e,t){let{r:n,u:r,f:i}=this.basis(),a=Math.tan(this.fovY/2),o=(2*e/this.viewW-1)*a*(this.viewW/this.viewH),s=(1-2*t/this.viewH)*a,c=i.x+n.x*o+r.x*s,l=i.y+n.y*o+r.y*s,u=i.z+n.z*o+r.z*s,d=Math.hypot(c,l,u);return{o:this.eye(),d:{x:c/d,y:l/d,z:u/d}}}project(e){let t=this.eye(),{r:n,u:r,f:i}=this.basis(),a=e.x-t.x,o=e.y-t.y,s=e.z-t.z,c=a*i.x+o*i.y+s*i.z;if(c<=1e-9)return null;let l=Math.tan(this.fovY/2),u=l*(this.viewW/this.viewH),d=(a*n.x+o*n.y+s*n.z)/c/u,f=(a*r.x+o*r.y+s*r.z)/c/l;return{sx:(d+1)*.5*this.viewW,sy:(1-f)*.5*this.viewH}}planeHit(e,t,n){let{o:r,d:i}=this.screenRay(e,t);if(Math.abs(i.z)<1e-12)return null;let a=(n-r.z)/i.z;return a>0?{x:r.x+i.x*a,y:r.y+i.y*a,z:n}:null}pick(e,t){let{o:n,d:r}=this.screenRay(e,t);return this.ground.raycast(n,r)??this.planeHit(e,t,this.target.z)}metresPerPixel(){return 2*this.distance*Math.tan(this.fovY/2)/this.viewH}fitDistance(){let e=Math.tan(this.fovY/2)*Math.min(1,this.viewW/this.viewH);return this.ground.size/2/e*On}minMetresPerPixel=8;minDistance(){let e=this.minMetresPerPixel*Math.max(1,this.viewH)/(2*Math.tan(this.fovY/2));return Math.max(En,e)}maxDistance(){return this.fitDistance()*kn}zoomAt(e,t,n){this.flight=null,this.zoomAnchor=this.pick(e,t);let r=Math.log(this.minDistance()/this.distance),i=Math.log(this.maxDistance()/this.distance);this.zoomPending=Math.min(i,Math.max(r,this.zoomPending+Math.log(n)))}pinchAt(e,t,n){this.flight=null,this.zoomPending=0,this.zoomAbout(this.pick(e,t),n),this.settle()}panScreen(e,t,n=this.viewW/2,r=this.viewH/2){this.flight=null;let i=this.pick(n-e,r-t);i&&this.anchorAt(i,n,r),this.settle()}dragTo(e,t,n){this.flight=null,this.anchorAt(e,t,n),this.settle()}panBy(e,t){this.flight=null;let n=Math.sin(this.bearing),r=Math.cos(this.bearing);this.target.x+=r*e+n*t,this.target.y+=-n*e+r*t,this.settle()}rotateBy(e,t){this.flight=null,this.bearingGoal=null,this.bearing=Rn(this.bearing+e),t!==0&&(this.autoTilt=!1,this.pitch=this.clampPitch(this.pitch+t)),this.settle()}rotateAt(e,t,n){this.flight=null,this.bearingGoal=null;let r=this.pick(e,t);this.bearing=Rn(this.bearing+n),r&&this.anchorAt(r,e,t),this.settle()}resetNorth(){this.bearingGoal=0}fitWorld(){let e=this.ground.size;this.flight=null,this.zoomPending=0,this.bearingGoal=null,this.autoTilt=!0,this.target.x=e/2,this.target.y=e/2,this.target.z=this.groundAt(e/2,e/2),this.bearing=0,this.pitch=0,this.distance=this.fitDistance()}flyTo(e,t,n=this.distance){this.zoomPending=0;let r=Math.min(this.maxDistance(),Math.max(this.minDistance(),n)),i=2*Math.tan(this.fovY/2)*Math.max(1,this.viewW/this.viewH),a=this.distance*i,o=r*i,s=e-this.target.x,c=t-this.target.y,l=Math.hypot(s,c),u=Fn*Fn,d=0,f;if(l<1e-6*Math.max(a,o))f=Math.abs(Math.log(o/a))/Fn;else{let e=(o*o-a*a+u*u*l*l)/(2*a*u*l),t=(o*o-a*a-u*u*l*l)/(2*o*u*l);d=Math.log(Math.sqrt(e*e+1)-e),f=(Math.log(Math.sqrt(t*t+1)-t)-d)/Fn}this.flight=f>1e-6?{x0:this.target.x,y0:this.target.y,dx:l>0?s/l:0,dy:l>0?c/l:0,u1:l,w0:a,w1:o,r0:d,S:f,kw:i,d1:r,x1:e,y1:t,T:Math.min(2.2,Math.max(.4,.45*f)),t:0}:null}update(e){if(this.flight&&this.stepFlight(e),this.zoomPending!==0){let t=1-Math.exp(-18*e),n=this.zoomPending*t;Math.abs(this.zoomPending-n)<1e-4&&(n=this.zoomPending),this.zoomPending-=n;let r=this.distance;this.zoomAbout(this.zoomAnchor,Math.exp(n)),this.distance===r&&(this.zoomPending=0),this.zoomPending===0&&(this.zoomAnchor=null)}if(this.bearingGoal!==null){let t=Rn(this.bearingGoal-this.bearing);Math.abs(t)<1e-4?(this.bearing=this.bearingGoal,this.bearingGoal=null):this.bearing=Rn(this.bearing+t*(1-Math.exp(-10*e)))}this.reseat(),this.settle()}stepFlight(e){let t=this.flight;t.t=Math.min(t.T,t.t+e);let n=t.t/t.T,r=(n<.5?4*n*n*n:1-(-2*n+2)**3/2)*t.S,i,a;if(t.u1<1e-6*Math.max(t.w0,t.w1))i=0,a=t.w0*Math.exp(Math.sign(t.w1-t.w0)*Fn*r);else{let e=Fn*Fn;i=t.w0/e*(Math.cosh(t.r0)*Math.tanh(Fn*r+t.r0)-Math.sinh(t.r0)),a=t.w0*Math.cosh(t.r0)/Math.cosh(Fn*r+t.r0)}let o=t.t>=t.T;this.target.x=o?t.x1:t.x0+t.dx*i,this.target.y=o?t.y1:t.y0+t.dy*i,this.setDistance(o?t.d1:a/t.kw),o&&(this.flight=null)}setDistance(e){let t=this.distance;if(this.distance=Math.min(this.maxDistance(),Math.max(this.minDistance(),e)),this.autoTilt){let e=this.pitch-In(t),n=Math.exp(-3*Math.abs(Math.log(this.distance/t)));this.pitch=In(this.distance)+e*n}this.pitch=this.clampPitch(this.pitch)}zoomAbout(e,t){let n=e?this.project(e):null;this.setDistance(this.distance*t),e&&n&&this.anchorAt(e,n.sx,n.sy)}anchorAt(e,t,n){let r=this.planeHit(t,n,e.z);r&&(this.target.x+=e.x-r.x,this.target.y+=e.y-r.y)}reseat(){let e=this.eye(),{f:t}=this.basis(),n=this.ground.raycast(e,t);if(!n||!Number.isFinite(n.x+n.y+n.z))return;let r=Math.hypot(n.x-e.x,n.y-e.y,n.z-e.z);r>.001&&(this.target.x=n.x,this.target.y=n.y,this.target.z=n.z,this.distance=r)}settle(){this.distance=Math.min(this.maxDistance(),Math.max(this.minDistance(),this.distance)),this.pitch=this.clampPitch(this.pitch);let e=this.ground.size,t=An*this.metresPerPixel()*this.viewW;this.target.x=Math.min(e+t,Math.max(-t,this.target.x)),this.target.y=Math.min(e+t,Math.max(-t,this.target.y));let n=Math.cos(this.pitch);for(let e=0;e<6;e++){let e=this.eye(),t=this.groundAt(e.x,e.y)+Dn-e.z;if(t<=1e-6)break;this.distance+=t/n+.01}}clampPitch(e){let t=jn*this.ground.size,n=this.fovY/2,r=e=>e+n>=Math.PI/2-1e-6?1/0:this.distance*(Math.cos(e)*Math.tan(e+n)-Math.sin(e)),i=Tn;if(r(i)>t){let e=0;for(let n=0;n<30;n++){let n=(e+i)/2;r(n)>t?i=n:e=n}i=e}return Math.min(i,Math.max(0,e))}groundAt(e,t){let n=this.ground.size;return this.ground.heightAt(Math.min(n,Math.max(0,e)),Math.min(n,Math.max(0,t)))}};function Rn(e){let t=2*Math.PI;return e%=t,e>Math.PI?e-=t:e<=-Math.PI&&(e+=t),e}var zn=null;function Bn(){if(zn)return zn;let e=[],t=new Float64Array(3),n=new Float64Array(3),r=new Float64Array(3),i=Math.PI/4;for(let a=0;a<6;a++)for(let o=0;o<4;o++){let s=i*(1+1e-6),c=(e,t)=>{let n=o===0?-s:o===1?s:e,r=o===2?-s:o===3?s:e;Je(a,n,r,t)};c(-i*.5,t),c(i*.5,n),Xe(t[0],t[1],t[2],2,r);let l=r[0],u=[r[1],r[2]];Xe(n[0],n[1],n[2],2,r);let d=[r[1],r[2]],f=u[0]<.01&&d[0]<.01?0:u[0]>1.99&&d[0]>1.99?1:u[1]<.01&&d[1]<.01?2:3,p=e=>f===0||f===1?e[1]:e[0];e.push({face:l,side:f,flip:p(u)>p(d)})}return zn=e}function Vn(e,t,n,r,i){let a=Bn()[t*4+n],o=a.flip?e-1-r:r,s=Math.min(i,e-1),c,l;switch(a.side){case 0:c=s,l=o;break;case 1:c=e-1-s,l=o;break;case 2:c=o,l=s;break;default:c=o,l=e-1-s}return(a.face*e+l)*e+c}function Hn(e,t,n=2,r=1){let i=t+2*n,a=new Float32Array(6*i*i*r);for(let i=0;i<6;i++)Un(e,t,i,n,r,a);return a}function Un(e,t,n,r,i,a){let o=t+2*r,s=t*t;{let c=n*o*o,l=(t,n,r)=>{let s=(c+n*o+t)*i;for(let t=0;t<i;t++)a[s+t]=e[r*i+t]};for(let e=0;e<t;e++)for(let i=0;i<t;i++)l(i+r,e+r,n*s+e*t+i);for(let e=1;e<=r;e++)for(let i=0;i<t;i++)l(r-e,r+i,Vn(t,n,0,i,e-1)),l(r+t-1+e,r+i,Vn(t,n,1,i,e-1)),l(r+i,r-e,Vn(t,n,2,i,e-1)),l(r+i,r+t-1+e,Vn(t,n,3,i,e-1));let u=(e,t,n)=>a[(c+t*o+e)*i+n],d=(e,t,n,r)=>{a[(c+t*o+e)*i+n]=r},f=r,p=r+t-1;for(let e=1;e<=r;e++)for(let t=1;t<=r;t++)for(let[n,r]of[[-1,-1],[1,-1],[-1,1],[1,1]]){let a=n<0?f:p,o=r<0?f:p,s=a+n*t,c=o+r*e;for(let n=0;n<i;n++){let r=u(s,o,n),i=u(a,c,n);d(s,c,n,t===1&&e===1?(r+i+u(a,o,n))/3:.5*(r+i))}}}}function Wn(e,t,n,r){let i=Math.abs(e),a=Math.abs(t),o=Math.abs(n),s=i>=a&&i>=o?e>0?0:2:a>=o?t>0?1:3:n>0?4:5,c=s*3,l=e*F[c]+t*F[c+1]+n*F[c+2];r[0]=s,r[1]=Math.atan((e*I[c]+t*I[c+1]+n*I[c+2])/l),r[2]=Math.atan((e*L[c]+t*L[c+1]+n*L[c+2])/l)}function Gn(e,t,n,r,i,a=!1){e.bindTexture(e.TEXTURE_2D_ARRAY,t),e.pixelStorei(e.UNPACK_ALIGNMENT,1);let[o,s,c]=i===`r32f`?[e.R32F,e.RED,e.FLOAT]:i===`rgba16f`?[e.RGBA16F,e.RGBA,e.FLOAT]:[e.RGBA8,e.RGBA,e.UNSIGNED_BYTE];e.texImage3D(e.TEXTURE_2D_ARRAY,0,o,r,r,6,0,s,c,n);let l=a?e.LINEAR:e.NEAREST;e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MIN_FILTER,l),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MAG_FILTER,l),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}function Kn(e,t){let n=e.createTexture();return Gn(e,n,t===`rgba8`?new Uint8Array(24):new Float32Array(t===`r32f`?6:24),1,t),n}var qn=-9e3;function Jn(e,t){let n=e.w,r=n*n,i=Float32Array.from(e.data),a=t&&t.w===n?Float32Array.from(t.data):new Float32Array(6*r),o=[];for(let e=0;e<2;e++){let e=i.slice(),t=a.slice();for(let s=0;s<6;s++)for(let c=0;c<n;c++)for(let l=0;l<n;l++){let u=s*r+c*n+l;if(e[u]>qn)continue;o.length=0;for(let e=-1;e<=1;e++)for(let t=-1;t<=1;t++){let i=l+t,a=c+e,u=i<0||i>=n,d=a<0||a>=n;u&&d||(u?o.push(Vn(n,s,i<0?0:1,a,0)):d?o.push(Vn(n,s,a<0?2:3,i,0)):o.push(s*r+a*n+i))}let d=-9001,f=0;for(let n of o)e[n]>d&&(d=e[n],f=t[n]);d>qn&&(i[u]=d,a[u]===0&&(a[u]=f))}}return{level:i,cls:a}}function Yn(e,t,n){let r=e.x*t.x+e.y*t.y+e.z*t.z,i=e.x*e.x+e.y*e.y+e.z*e.z-n*n,a=r*r-i;if(a<0)return null;let o=Math.sqrt(a),s=r>0?-r-o:-r+o,c=s,l=s===0?0:i/s;return c>l&&([c,l]=[l,c]),[c,l]}var Xn=class{radius;level;constructor(e,t=0){this.radius=e,this.level=t}get maxHeight(){return this.level}heightAtDir(){return this.level}raycast(e,t){let n=Yn(e,t,this.radius+this.level);if(!n||n[1]<0)return null;let r=n[0]>=0?n[0]:n[1];return{x:e.x+t.x*r,y:e.y+t.y*r,z:e.z+t.z*r}}},Zn=class{radius;n;delta;cellM;data;padded;m;minPyr=[];maxPyr=[];exaggeration=1;fa=new Float64Array(3);constructor(e,t=null){let n=e.w;this.n=n,this.radius=(e.radiusKm??e.worldKm*4/(2*Math.PI))*1e3,this.delta=Math.PI/2/n,this.cellM=this.delta*this.radius,this.data=e.data instanceof Float32Array?e.data:Float32Array.from(e.data);let r=new Float32Array(this.data.length);if(t&&t.length===r.length)for(let e=0;e<r.length;e++)r[e]=t[e]>qn?Math.max(this.data[e],t[e]):Math.max(0,this.data[e]);else for(let e=0;e<r.length;e++)r[e]=Math.max(0,this.data[e]);this.m=n+4,this.padded=Hn(r,n);let i=this.m;for(let e=0;e<6;e++){let t=new Float32Array(n*n),r=new Float32Array(n*n);for(let a=0;a<n;a++)for(let o=0;o<n;o++){let s=1/0,c=-1/0;for(let t=0;t<3;t++){let n=e*i*i+(a+2-1+t)*i+o+2-1;for(let e=0;e<3;e++){let t=this.padded[n+e];s=Math.min(s,t),c=Math.max(c,t)}}t[a*n+o]=s,r[a*n+o]=c}let a=[t],o=[r];for(let e=n;e>1;e>>=1){let n=e>>1,i=new Float32Array(n*n),s=new Float32Array(n*n);for(let a=0;a<n;a++)for(let o=0;o<n;o++){let c=2*a*e+2*o;i[a*n+o]=Math.min(t[c],t[c+1],t[c+e],t[c+e+1]),s[a*n+o]=Math.max(r[c],r[c+1],r[c+e],r[c+e+1])}a.push(i),o.push(s),t=i,r=s}this.minPyr.push(a),this.maxPyr.push(o)}}get maxHeight(){let e=0;for(let t=0;t<6;t++)e=Math.max(e,this.maxPyr[t][this.maxPyr[t].length-1][0]);return e*this.exaggeration}surfaceAt(e,t,n){let r=this.m,i=Math.min(r-1.001,Math.max(0,(t+Math.PI/4)/this.delta-.5+2)),a=Math.min(r-1.001,Math.max(0,(n+Math.PI/4)/this.delta-.5+2)),o=Math.floor(i),s=Math.floor(a),c=i-o,l=a-s,u=this.padded,d=e*r*r+s*r+o,f=u[d]+(u[d+1]-u[d])*c;return f+(u[d+r]+(u[d+r+1]-u[d+r])*c-f)*l}elevationAtDir(e,t,n){Wn(e,t,n,this.fa);let r=this.n,i=Math.min(r-1,Math.max(0,Math.floor((this.fa[1]+Math.PI/4)/this.delta))),a=Math.min(r-1,Math.max(0,Math.floor((this.fa[2]+Math.PI/4)/this.delta)));return this.data[(this.fa[0]*r+a)*r+i]}heightAtDir(e,t,n){return Wn(e,t,n,this.fa),this.surfaceAt(this.fa[0],this.fa[1],this.fa[2])*this.exaggeration}rangeOver(e,t,n,r){let i=this.n,a=this.minPyr[e],o=Math.max(0,Math.min(a.length-1,Math.floor(Math.log2(Math.max(1,r/this.delta))))),s=i>>o,c=Math.PI/2/s,l=Math.PI/4,u=Math.max(0,Math.floor((t+l)/c)),d=Math.min(s-1,Math.floor((t+r+l)/c)),f=Math.max(0,Math.floor((n+l)/c)),p=Math.min(s-1,Math.floor((n+r+l)/c)),m=a[o],h=this.maxPyr[e][o],g=1/0,_=-1/0;for(let e=f;e<=p;e++)for(let t=u;t<=d;t++)g=Math.min(g,m[e*s+t]),_=Math.max(_,h[e*s+t]);return[g*this.exaggeration,_*this.exaggeration]}raycast(e,t){let n=this.radius,r=Yn(e,t,n+this.maxHeight+1);if(!r||r[1]<0)return null;let i=Math.max(0,r[0]),a=r[1],o=Yn(e,t,n);o&&o[0]>=0&&(a=Math.min(a,o[0]));let s=r=>{let i=e.x+t.x*r,a=e.y+t.y*r,o=e.z+t.z*r;return Math.sqrt(i*i+a*a+o*o)-n-this.heightAtDir(i,a,o)},c=i;if(s(c)<=0)return Qn(e,t,c);let l=Math.min(.5*this.cellM,Math.max(1e-6,(a-i)/2));for(let n=i+l;n<=a+l;n+=l){let r=Math.min(n,a);if(s(r)<=0){let n=c,i=r;for(let e=0;e<30;e++){let e=(n+i)/2;s(e)>0?n=e:i=e}return Qn(e,t,i)}if(c=r,r===a)break}return null}};function Qn(e,t,n){return{x:e.x+t.x*n,y:e.y+t.y*n,z:e.z+t.z*n}}var $n=Math.PI/180,er=100,tr=30,nr=1.1,rr=1.15/nr,ir=1.42,ar=Math.sin(85*$n),or=10*$n,sr=class{dir={x:1,y:0,z:0};targetH=0;distance=1e6;pitch=0;fovY=32*$n;viewW=1;viewH=1;reversedZ=!1;autoTilt=!0;minMetresPerPixel=40;east={x:0,y:1,z:0};fb=0;inCap=!1;ground;zoomPending=0;zoomAnchor=null;bearingGoal=null;flight=null;constructor(e){this.ground=e,this.lookAtLatLon(15,0),this.fitWorld()}get radius(){return this.ground.radius}setGround(e){let t=e.radius!==this.ground.radius;this.ground=e,t?this.fitWorld():(this.targetH=this.groundAtDir(this.dir),this.settle())}get moving(){return this.flight!==null||this.zoomPending!==0||this.bearingGoal!==null}get target(){let e=this.ground.radius+this.targetH;return{x:this.dir.x*e,y:this.dir.y*e,z:this.dir.z*e}}latLon(){let e=this.dir;return[Math.asin(Math.max(-1,Math.min(1,e.z)))/$n,Math.atan2(e.y,e.x)/$n]}get bearing(){if(!this.inCap)return this.fb;let e=hr(this.dir);if(!e)return this.fb;let{e:t,n}=this.frame(),r=Math.sin(this.fb),i=Math.cos(this.fb),a=cr(z(t,r),z(n,i)),o=fr(this.dir,e);return Math.atan2(dr(a,e),dr(a,o))}lookAtLatLon(e,t){let n=e*$n,r=t*$n;this.setFrame({x:Math.cos(n)*Math.cos(r),y:Math.cos(n)*Math.sin(r),z:Math.sin(n)},null),this.fb=0,this.targetH=this.groundAtDir(this.dir)}frame(){return{e:this.east,n:fr(this.dir,this.east),u:this.dir}}axes(){let e=this.basis(),{e:t,n}=this.frame();return{...e,fh:cr(z(t,Math.sin(this.fb)),z(n,Math.cos(this.fb)))}}basis(){let{e,n:t,u:n}=this.frame(),r=Math.sin(this.fb),i=Math.cos(this.fb),a=Math.sin(this.pitch),o=Math.cos(this.pitch);return{r:cr(z(e,i),z(t,-r)),u:lr(z(e,r*o),z(t,i*o),z(n,a)),f:lr(z(e,r*a),z(t,i*a),z(n,-o))}}eye(){let e=this.target,{f:t}=this.basis();return{x:e.x-t.x*this.distance,y:e.y-t.y*this.distance,z:e.z-t.z*this.distance}}clearance(){let e=this.eye(),t=Math.hypot(e.x,e.y,e.z);return Math.max(1,t-this.ground.radius-this.ground.heightAtDir(e.x,e.y,e.z))}altitude(){let e=this.eye();return Math.hypot(e.x,e.y,e.z)-this.ground.radius}near(){let e=this.clearance();if(this.reversedZ)return Math.max(1,Math.min(5e-4*e,.5*e));let t=Math.min(5e4,Math.max(1,.3*e));return Math.max(t,this.farStandard()/1e5)}far(){return this.reversedZ?1/0:this.farStandard()}farStandard(){let e=this.eye(),t=this.ground.radius,n=t+this.ground.maxHeight+1e3,r=Math.hypot(e.x,e.y,e.z);return 1.05*(Math.sqrt(Math.max(0,r*r-t*t))+Math.sqrt(n*n-t*t))+1e3}viewProjRelative(e,t){let n=this.eye(),{u:r,f:i}=this.basis(),a={x:n.x-t.x,y:n.y-t.y,z:n.z-t.z},o=Sn(new Float64Array(16),a,{x:a.x+i.x,y:a.y+i.y,z:a.z+i.z},r),s=this.viewW/this.viewH,c=new Float64Array(16);return this.reversedZ?xn(c,this.fovY,s,this.near()):bn(c,this.fovY,s,this.near(),this.far()),e.set(yn(c,c,o)),e}frustumPlanesRelative(e,t){let n=this.eye(),r=n.x-t.x,i=n.y-t.y,a=n.z-t.z,{r:o,u:s,f:c}=this.basis(),l=Math.tan(this.fovY/2),u=l*(this.viewW/this.viewH),d=(t,n,r,i,a,o,s)=>{let c=Math.hypot(n,r,i);n/=c,r/=c,i/=c,e[t*4]=n,e[t*4+1]=r,e[t*4+2]=i,e[t*4+3]=-(n*a+r*o+i*s)};d(0,o.x+c.x*u,o.y+c.y*u,o.z+c.z*u,r,i,a),d(1,-o.x+c.x*u,-o.y+c.y*u,-o.z+c.z*u,r,i,a),d(2,s.x+c.x*l,s.y+c.y*l,s.z+c.z*l,r,i,a),d(3,-s.x+c.x*l,-s.y+c.y*l,-s.z+c.z*l,r,i,a);let f=this.near();d(4,c.x,c.y,c.z,r+c.x*f,i+c.y*f,a+c.z*f);let p=this.far();return Number.isFinite(p)?d(5,-c.x,-c.y,-c.z,r+c.x*p,i+c.y*p,a+c.z*p):(e[20]=-c.x,e[21]=-c.y,e[22]=-c.z,e[23]=1/0),e}screenRay(e,t){let{r:n,u:r,f:i}=this.basis(),a=Math.tan(this.fovY/2),o=(2*e/this.viewW-1)*a*(this.viewW/this.viewH),s=(1-2*t/this.viewH)*a,c=lr(i,z(n,o),z(r,s));return{o:this.eye(),d:pr(c)}}project(e){let t=this.eye(),{r:n,u:r,f:i}=this.basis(),a=ur(e,t),o=dr(a,i);if(o<=1e-9)return null;let s=Math.tan(this.fovY/2),c=s*(this.viewW/this.viewH),l=dr(a,n)/o/c,u=dr(a,r)/o/s;return{sx:(l+1)*.5*this.viewW,sy:(1-u)*.5*this.viewH}}pick(e,t){let{o:n,d:r}=this.screenRay(e,t);return this.ground.raycast(n,r)}sphereHit(e,t,n){let{o:r,d:i}=this.screenRay(e,t),a=Yn(r,i,n);return a&&a[1]>=0?cr(r,z(i,a[0]>=0?a[0]:a[1])):z(pr(cr(r,z(i,Math.max(0,-dr(r,i))))),n)}metresPerPixel(){return 2*this.distance*Math.tan(this.fovY/2)/this.viewH}halfFov(){return Math.atan(Math.tan(this.fovY/2)*Math.min(1,this.viewW/this.viewH))}fitDistance(){let e=this.ground.radius;return e/Math.sin(this.halfFov())*nr-e-this.targetH}minDistance(){let e=this.minMetresPerPixel*Math.max(1,this.viewH)/(2*Math.tan(this.fovY/2));return Math.max(er,e)}maxDistance(){let e=this.ground.radius;return e/Math.sin(this.halfFov())*nr*rr-e-this.targetH}zoomAt(e,t,n){this.flight=null,this.zoomAnchor=this.pick(e,t);let r=Math.log(this.minDistance()/this.distance),i=Math.log(this.maxDistance()/this.distance);this.zoomPending=Math.min(i,Math.max(r,this.zoomPending+Math.log(n)))}pinchAt(e,t,n){this.flight=null,this.zoomPending=0,this.zoomAbout(this.pick(e,t),n),this.settle()}panScreen(e,t,n=this.viewW/2,r=this.viewH/2){this.flight=null;let i=this.pick(n-e,r-t);i&&this.anchorAt(i,n,r),this.settle()}dragTo(e,t,n){this.flight=null,this.anchorAt(e,t,n),this.settle()}panBy(e,t){this.flight=null;let{e:n,n:r}=this.frame(),i=Math.sin(this.fb),a=Math.cos(this.fb),o=cr(z(cr(z(n,a),z(r,-i)),e),z(cr(z(n,i),z(r,a)),t)),s=Math.hypot(o.x,o.y,o.z);s>0&&this.rotateRig(pr(fr(this.dir,o)),s/(this.ground.radius+this.targetH)),this.settle()}rotateBy(e,t){this.flight=null,this.bearingGoal=null,this.fb=Rn(this.fb+e),t!==0&&(this.autoTilt=!1,this.pitch=this.clampPitch(this.pitch+t)),this.settle()}rotateAt(e,t,n){this.flight=null,this.bearingGoal=null;let r=this.pick(e,t);this.fb=Rn(this.fb+n),r&&this.anchorAt(r,e,t),this.settle()}resetNorth(){this.bearingGoal=0}fitWorld(){this.flight=null,this.zoomPending=0,this.bearingGoal=null,this.autoTilt=!0,this.fb=Rn(this.fb-this.bearing),this.pitch=0,this.targetH=this.groundAtDir(this.dir),this.distance=this.fitDistance()}flyToDir(e,t=this.distance){this.zoomPending=0;let n=Math.min(this.maxDistance(),Math.max(this.minDistance(),t)),r=pr(e),i=2*Math.tan(this.fovY/2)*Math.max(1,this.viewW/this.viewH),a=this.distance*i,o=n*i,s=fr(this.dir,r),c=Math.hypot(s.x,s.y,s.z),l=Math.atan2(c,dr(this.dir,r)),u=c>1e-12?z(s,1/c):this.frame().e,d=l*this.ground.radius,f=ir*ir,p=0,m;if(d<1e-6*Math.max(a,o))m=Math.abs(Math.log(o/a))/ir;else{let e=(o*o-a*a+f*f*d*d)/(2*a*f*d),t=(o*o-a*a-f*f*d*d)/(2*o*f*d);p=Math.log(Math.sqrt(e*e+1)-e),m=(Math.log(Math.sqrt(t*t+1)-t)-p)/ir}this.flight=m>1e-6?{axis:u,angle:l,done:0,u1:d,w0:a,w1:o,r0:p,S:m,kw:i,d1:n,T:Math.min(2.4,Math.max(.4,.45*m)),t:0}:null}flyToLatLon(e,t,n=this.distance){let r=e*$n,i=t*$n;this.flyToDir({x:Math.cos(r)*Math.cos(i),y:Math.cos(r)*Math.sin(i),z:Math.sin(r)},n)}update(e){if(this.flight&&this.stepFlight(e),this.zoomPending!==0){let t=1-Math.exp(-18*e),n=this.zoomPending*t;Math.abs(this.zoomPending-n)<1e-4&&(n=this.zoomPending),this.zoomPending-=n;let r=this.distance;this.zoomAbout(this.zoomAnchor,Math.exp(n)),this.distance===r&&(this.zoomPending=0),this.zoomPending===0&&(this.zoomAnchor=null)}if(this.bearingGoal!==null){let t=Rn(this.bearingGoal-this.bearing);Math.abs(t)<1e-4?(this.fb=Rn(this.fb+t),this.bearingGoal=null):this.fb=Rn(this.fb+t*(1-Math.exp(-10*e)))}this.reseat(),this.settle()}stepFlight(e){let t=this.flight;t.t=Math.min(t.T,t.t+e);let n=t.t/t.T,r=(n<.5?4*n*n*n:1-(-2*n+2)**3/2)*t.S,i,a;if(t.u1<1e-6*Math.max(t.w0,t.w1))i=0,a=t.w0*Math.exp(Math.sign(t.w1-t.w0)*ir*r);else{let e=ir*ir;i=t.w0/e*(Math.cosh(t.r0)*Math.tanh(ir*r+t.r0)-Math.sinh(t.r0)),a=t.w0*Math.cosh(t.r0)/Math.cosh(ir*r+t.r0)}let o=t.t>=t.T,s=o?t.angle:t.u1>0?t.angle*i/t.u1:0;this.rotateRig(t.axis,s-t.done),t.done=s,this.targetH=this.groundAtDir(this.dir),this.setDistance(o?t.d1:a/t.kw),o&&(this.flight=null)}setDistance(e){let t=this.distance;if(this.distance=Math.min(this.maxDistance(),Math.max(this.minDistance(),e)),this.autoTilt){let e=this.pitch-In(t),n=Math.exp(-3*Math.abs(Math.log(this.distance/t)));this.pitch=In(this.distance)+e*n}this.pitch=this.clampPitch(this.pitch)}zoomAbout(e,t){let n=e?this.project(e):null;this.setDistance(this.distance*t),e&&n&&this.anchorAt(e,n.sx,n.sy)}anchorAt(e,t,n){let r=Math.hypot(e.x,e.y,e.z);if(!(r>0))return;let i=()=>{let r=this.project(e);return r?Math.hypot(r.sx-t,r.sy-n):1/0},a=this.saveRig(),o=i(),s=this.sphereHit(t,n,r),c=fr(s,e),l=Math.hypot(c.x,c.y,c.z)/(r*r);l>1e-13&&this.rotateRig(z(c,1/(l*r*r)),Math.atan2(l,dr(s,e)/(r*r)));let u=i();u<=o||(this.restoreRig(a),u=o);let d=Math.max(1e-9,.5*this.metresPerPixel()/this.ground.radius);for(let r=0;r<12&&u>1e-5;r++){let r=this.project(e);if(!r)return;let a=r.sx-t,o=r.sy-n,s=this.saveRig(),{e:c,n:l}=this.frame(),f=[{...c},{...l}],p=[];for(let t of f){this.rotateRig(t,d);let n=this.project(e);if(this.restoreRig(s),!n)return;p.push((n.sx-r.sx)/d,(n.sy-r.sy)/d)}let m=p[0]*p[3]-p[2]*p[1];if(!(Math.abs(m)>1e-12))return;let h=(-a*p[3]+o*p[2])/m,g=(-o*p[0]+a*p[1])/m,_=cr(z(f[0],h),z(f[1],g)),v=Math.hypot(_.x,_.y,_.z);if(!(v>0))return;let y=!1;for(let e=0;e<6&&!y;e++,v*=.5){this.rotateRig(pr(_),Math.min(v,.3));let e=i();e<u?(u=e,y=!0):this.restoreRig(s)}if(!y)return}}saveRig(){return[{...this.dir},{...this.east},this.fb,this.inCap]}restoreRig([e,t,n,r]){Object.assign(this.dir,e),Object.assign(this.east,t),this.fb=n,this.inCap=r}rotateRig(e,t){t!==0&&this.setFrame(pr(mr(this.dir,e,t)),mr(this.east,e,t))}setFrame(e,t){let n=Math.abs(e.z)>ar,r=t?pr(ur(t,z(e,dr(t,e)))):null;if(!n||!r){let t=hr(e)??r??{x:0,y:1,z:0};if(this.inCap&&r){let n=Math.sin(this.fb),i=Math.cos(this.fb),a=cr(z(r,n),z(fr(e,r),i));this.fb=Math.atan2(dr(a,t),dr(a,fr(e,t)))}r=t}this.dir.x=e.x,this.dir.y=e.y,this.dir.z=e.z,this.east.x=r.x,this.east.y=r.y,this.east.z=r.z,this.inCap=n}reseat(){let e=this.eye(),t=this.basis(),n=this.ground.raycast(e,t.f);if(!n||!Number.isFinite(n.x+n.y+n.z))return;let r=Math.hypot(n.x-e.x,n.y-e.y,n.z-e.z);if(!(r>.001))return;let i=this.target;if(Math.hypot(n.x-i.x,n.y-i.y,n.z-i.z)<.001+1e-9*r)return;let a=Math.sin(this.pitch),o=Math.cos(this.pitch),s=cr(z(t.f,a),z(t.u,o)),c=Math.hypot(n.x,n.y,n.z),l=z(n,1/c);this.setFrame(l,this.east);let{e:u,n:d}=this.frame();this.pitch=Math.acos(Math.max(-1,Math.min(1,-dr(t.f,l)))),this.fb=Math.atan2(dr(s,u),dr(s,d)),this.targetH=c-this.ground.radius,this.distance=r}settle(){this.distance=Math.min(this.maxDistance(),Math.max(this.minDistance(),this.distance)),this.pitch=this.clampPitch(this.pitch);let e=Math.cos(this.pitch);for(let t=0;t<6;t++){let t=this.eye(),n=Math.hypot(t.x,t.y,t.z),r=this.ground.radius+this.ground.heightAtDir(t.x,t.y,t.z)+tr-n;if(r<=1e-6)break;this.distance+=r/Math.max(.2,e)+.01}}clampPitch(e){let t=this.ground.radius,n=Math.acos(Math.min(1,t/(t+this.targetH+this.distance))),r=Math.max(0,Math.min(Tn,Math.PI/2+or-this.fovY/2-n));return Math.min(r,Math.max(0,e))}groundAtDir(e){return this.ground.heightAtDir(e.x,e.y,e.z)}};function cr(e,t){return{x:e.x+t.x,y:e.y+t.y,z:e.z+t.z}}function lr(e,t,n){return{x:e.x+t.x+n.x,y:e.y+t.y+n.y,z:e.z+t.z+n.z}}function ur(e,t){return{x:e.x-t.x,y:e.y-t.y,z:e.z-t.z}}function z(e,t){return{x:e.x*t,y:e.y*t,z:e.z*t}}function dr(e,t){return e.x*t.x+e.y*t.y+e.z*t.z}function fr(e,t){return{x:e.y*t.z-e.z*t.y,y:e.z*t.x-e.x*t.z,z:e.x*t.y-e.y*t.x}}function pr(e){let t=Math.hypot(e.x,e.y,e.z);return t>0?z(e,1/t):{x:0,y:0,z:1}}function mr(e,t,n){let r=Math.cos(n),i=Math.sin(n),a=fr(t,e),o=dr(t,e)*(1-r);return{x:e.x*r+a.x*i+t.x*o,y:e.y*r+a.y*i+t.y*o,z:e.z*r+a.z*i+t.z*o}}function hr(e){let t=-e.y,n=e.x,r=Math.hypot(t,n);return r<1e-9?null:{x:t/r,y:n/r,z:0}}function gr(e,t,n){if(!(t>=1&&n>=1&&Number.isFinite(t)&&Number.isFinite(n)))return!1;for(let r of e)r.viewW=t,r.viewH=n;return!0}var _r=`
uniform vec3 u_eyeP;        // eye, planet-centred (m)
uniform float u_planetR;    // sea-level radius (m)
uniform float u_atmTop;     // radius of the top of the atmosphere (m)
uniform float u_atmH;       // density scale height (m)
uniform vec3 u_beta;        // Rayleigh scattering coefficients at sea level (1/m)
uniform vec3 u_atmSun;      // unit vector toward the light that lights the air
uniform float u_atmSunI;    // its intensity (0 = no light)

vec3 atmosphereK(vec3 ro, vec3 rd, float tMax, int steps, float k, out vec3 trans) {
  vec3 beta = u_beta * k;
  trans = vec3(1.0);
  float b = dot(ro, rd);
  float c = dot(ro, ro) - u_atmTop * u_atmTop;
  float disc = b * b - c;
  if (disc <= 0.0) return vec3(0.0);
  float s = sqrt(disc);
  float t0 = max(0.0, -b - s);
  float t1 = min(tMax, -b + s);
  if (t1 <= t0) return vec3(0.0);
  float ds = (t1 - t0) / float(steps);
  vec3 tau = vec3(0.0);
  vec3 sum = vec3(0.0);
  for (int i = 0; i < 16; i++) {
    if (i >= steps) break;
    vec3 p = ro + rd * (t0 + (float(i) + 0.5) * ds);
    float r = length(p);
    float rho = exp(-max(0.0, r - u_planetR) / u_atmH);
    vec3 dTau = beta * rho * ds;
    float mu = dot(p / r, u_atmSun);
    // Light reaching the sample: Chapman-like optical depth toward the sun, cut by the planet's shadow
    // (soft over the few degrees the sun takes to set at that height).
    float dip = acos(clamp(u_planetR / r, 0.0, 1.0));
    float lit = smoothstep(-dip - 0.06, -dip + 0.04, mu);
    vec3 tauSun = beta * u_atmH * rho / max(0.06, mu + 0.12);
    sum += exp(-(tau + 0.5 * dTau) - tauSun) * rho * ds * lit;
    tau += dTau;
  }
  trans = exp(-tau);
  float cs = dot(rd, u_atmSun);
  float phase = 0.75 * (1.0 + cs * cs);
  // Rayleigh plus a little forward glow and grey multiple-scattering fill, so skies read light blue.
  vec3 ray = sum * beta * phase;
  vec3 fill = sum * dot(beta, vec3(0.33)) * 0.35;
  float mie = 0.04 * pow(max(cs, 0.0), 8.0);
  return (ray + fill + mie * sum * beta.b) * u_atmSunI;
}
// The sky and the limb: the full air.
vec3 atmosphere(vec3 ro, vec3 rd, float tMax, int steps, out vec3 trans) {
  return atmosphereK(ro, rd, tMax, steps, 1.0, trans);
}
`,vr=`
vec3 terrainTone(vec3 c) {
  return min(c, vec3(0.8)) + 0.2 * (1.0 - exp(-max(c - 0.8, vec3(0.0)) / 0.2));
}
`,yr=.25;function br(e){let t=e*1.025,n=(t-e)*.25;return{top:t,H:n,beta:[.05/n,.11/n,.27/n]}}var xr=`#version 300 es
layout(location = 0) in vec2 a_pos;
out vec2 v_ndc;
void main() {
  v_ndc = a_pos;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`,Sr=`#version 300 es
precision highp float;
in vec2 v_ndc;
uniform mat4 u_invViewProj;   // camera-relative (eye at the origin)
uniform float u_nearZ;
uniform vec3 u_sunDisc;       // unit vector toward the real sun (sun disc)
${_r}
out vec4 o;

float starHash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

void main() {
  vec4 a = u_invViewProj * vec4(v_ndc, u_nearZ, 1.0);
  vec4 b = u_invViewProj * vec4(v_ndc, 0.5, 1.0);
  vec3 rd = normalize(b.xyz / b.w - a.xyz / a.w);
  vec3 ro = u_eyeP;
  // Up to the sea sphere: behind the planet the terrain pass draws over this.
  float tb = dot(ro, rd);
  float tc = dot(ro, ro) - u_planetR * u_planetR;
  float disc = tb * tb - tc;
  float tMax = 1e30;
  bool hit = disc > 0.0 && -tb - sqrt(disc) > 0.0;
  if (hit) tMax = -tb - sqrt(disc);
  vec3 trans;
  vec3 sky = atmosphere(ro, rd, tMax, 12, trans);
  // Space: near black with a sparse star field, dimmed behind the air.
  vec3 space = vec3(0.004, 0.006, 0.012);
  vec3 cell = floor(rd * 1400.0);
  float st = starHash(cell);
  if (st > 0.9992) space += vec3(0.6) * (st - 0.9992) / 0.0008;
  vec3 col = hit ? sky : space * trans + sky;
  // The sun's disc and a soft glow around it.
  float cs = max(dot(rd, u_sunDisc), 0.0);
  if (!hit) col += trans * (vec3(1.0, 0.95, 0.85) * smoothstep(0.99995, 0.99999, cs) * 6.0 + vec3(1.0, 0.9, 0.7) * 0.25 * pow(cs, 400.0));
  // Simple tone map (the scattering can exceed 1 at the limb).
  col = 1.0 - exp(-col * 1.2);
  o = vec4(pow(col, vec3(1.0 / 1.1)), 1.0);
}`,Cr=[`u_eyeP`,`u_planetR`,`u_atmTop`,`u_atmH`,`u_beta`,`u_atmSun`,`u_atmSunI`],wr=new WeakMap;function Tr(e,t,n){let r=wr.get(t);if(!r){r={};for(let n of Cr)r[n]=e.getUniformLocation(t,n);wr.set(t,r)}let i=br(n.radius);e.uniform3f(r.u_eyeP,n.eye.x,n.eye.y,n.eye.z),e.uniform1f(r.u_planetR,n.radius),e.uniform1f(r.u_atmTop,i.top),e.uniform1f(r.u_atmH,i.H),e.uniform3f(r.u_beta,i.beta[0],i.beta[1],i.beta[2]),e.uniform3f(r.u_atmSun,n.sun[0],n.sun[1],n.sun[2]),e.uniform1f(r.u_atmSunI,n.sunI)}var Er=class{gl;prog;u;vao;inv=_n();inv32=new Float32Array(16);constructor(e){this.gl=e,this.prog=en(e,`globe-sky`,xr,Sr),this.u=nn(e,this.prog,[`u_invViewProj`,`u_nearZ`,`u_sunDisc`]),this.vao=e.createVertexArray(),e.bindVertexArray(this.vao),e.bindBuffer(e.ARRAY_BUFFER,rn(e)),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null)}draw(e,t,n,r){if(!Cn(this.inv,e))return;this.inv32.set(this.inv);let i=this.gl;i.useProgram(this.prog),i.uniformMatrix4fv(this.u.u_invViewProj,!1,this.inv32),i.uniform1f(this.u.u_nearZ,t?1:-1),i.uniform3f(this.u.u_sunDisc,r[0],r[1],r[2]),Tr(i,this.prog,n),i.bindVertexArray(this.vao),i.drawArrays(i.TRIANGLES,0,6),i.bindVertexArray(null)}},B={WATER:0,ICE:1,POLAR_DESERT:2,TUNDRA:3,BOREAL:4,TEMP_CONIFER:5,TEMP_BROADLEAF:6,TEMP_RAINFOREST:7,STEPPE:8,MEDITERRANEAN:9,HOT_DESERT:10,COLD_DESERT:11,XERIC_SHRUB:12,SAVANNA:13,TROP_DRY_FOREST:14,TROP_RAINFOREST:15,CLOUD_FOREST:16,ALPINE_MEADOW:17,NIVAL:18,MANGROVE:19,SALT_MARSH:20,MARSH:21,BOG:22,BEACH:23,SALT_FLAT:24,ROCK:25,SWAMP:26,FEN:27},V=(e,t,n,r,i)=>({id:e,name:t,canopy:n,satellite:r,stylised:i}),Dr=[V(B.WATER,`Water`,0,[40,80,110],[60,120,170]),V(B.ICE,`Ice sheet / glacier`,0,[236,240,245],[250,252,255]),V(B.POLAR_DESERT,`Polar desert`,0,[170,160,150],[205,200,190]),V(B.TUNDRA,`Tundra`,.05,[124,124,92],[170,180,130]),V(B.BOREAL,`Boreal forest (taiga)`,.6,[44,62,38],[70,110,70]),V(B.TEMP_CONIFER,`Temperate coniferous forest`,.7,[40,66,40],[60,120,80]),V(B.TEMP_BROADLEAF,`Temperate broadleaf forest`,.75,[62,94,46],[110,160,80]),V(B.TEMP_RAINFOREST,`Temperate rainforest`,.95,[30,64,36],[40,120,70]),V(B.STEPPE,`Grassland / steppe`,.05,[150,148,96],[200,200,120]),V(B.MEDITERRANEAN,`Mediterranean shrubland`,.35,[118,118,78],[165,160,95]),V(B.HOT_DESERT,`Hot desert`,0,[214,186,140],[235,210,160]),V(B.COLD_DESERT,`Cold desert`,0,[176,162,136],[205,190,160]),V(B.XERIC_SHRUB,`Xeric shrubland`,.15,[170,150,108],[200,180,120]),V(B.SAVANNA,`Savanna`,.2,[156,146,84],[200,190,100]),V(B.TROP_DRY_FOREST,`Tropical dry forest`,.6,[98,110,58],[140,160,70]),V(B.TROP_RAINFOREST,`Tropical rainforest`,.98,[26,66,26],[40,130,50]),V(B.CLOUD_FOREST,`Montane / cloud forest`,.9,[34,72,44],[60,130,90]),V(B.ALPINE_MEADOW,`Alpine meadow`,.02,[120,130,88],[160,190,120]),V(B.NIVAL,`Alpine rock / nival`,0,[128,122,116],[165,160,155]),V(B.MANGROVE,`Mangrove`,.9,[36,70,46],[60,110,80]),V(B.SALT_MARSH,`Salt marsh`,.1,[100,110,80],[140,160,110]),V(B.MARSH,`Freshwater marsh`,.3,[60,80,56],[90,130,100]),V(B.BOG,`Bog`,.1,[110,100,70],[150,140,100]),V(B.BEACH,`Beach / dunes`,0,[226,212,178],[240,225,180]),V(B.SALT_FLAT,`Salt flat`,0,[232,230,222],[245,245,240]),V(B.ROCK,`Bare rock / scree`,0,[120,114,108],[160,150,140]),V(B.SWAMP,`Swamp`,.8,[34,62,40],[55,105,75]),V(B.FEN,`Fen`,.15,[100,112,78],[140,160,110])],Or=`
vec3 ramp(float t, vec3 a, vec3 b) { return mix(a, b, clamp(t, 0.0, 1.0)); }

// Hypsometric tint: green lowlands, tan uplands, grey rock, white summits. Ocean by depth.
vec3 hypsometric(float h) {
  if (h < 0.0) {
    float d = clamp(-h / 5000.0, 0.0, 1.0);
    return mix(vec3(0.33, 0.62, 0.74), vec3(0.04, 0.12, 0.27), pow(d, 0.45));
  }
  if (h < 400.0)  return ramp(h / 400.0, vec3(0.36, 0.55, 0.33), vec3(0.55, 0.64, 0.38));
  if (h < 1200.0) return ramp((h - 400.0) / 800.0, vec3(0.55, 0.64, 0.38), vec3(0.78, 0.70, 0.47));
  if (h < 2500.0) return ramp((h - 1200.0) / 1300.0, vec3(0.78, 0.70, 0.47), vec3(0.56, 0.44, 0.34));
  if (h < 4000.0) return ramp((h - 2500.0) / 1500.0, vec3(0.56, 0.44, 0.34), vec3(0.75, 0.73, 0.72));
  return ramp((h - 4000.0) / 2000.0, vec3(0.75, 0.73, 0.72), vec3(0.97, 0.97, 0.98));
}

vec3 categorical(float id) {
  float h = fract(id * 0.61803398875 + 0.13);
  vec3 k = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return mix(vec3(0.5), k, 0.55) * 0.85 + 0.08;
}

vec3 viridis(float t) {
  t = clamp(t, 0.0, 1.0);
  const vec3 c0 = vec3(0.2777, 0.0054, 0.3341), c1 = vec3(0.1050, 1.4046, 1.3846), c2 = vec3(-0.3309, 0.2148, 0.0951);
  const vec3 c3 = vec3(-4.6342, -5.7991, -19.3324), c4 = vec3(6.2283, 14.1799, 56.6906), c5 = vec3(4.7764, -13.7451, -65.3530);
  const vec3 c6 = vec3(-5.4355, 4.6459, 26.3124);
  return c0 + t * (c1 + t * (c2 + t * (c3 + t * (c4 + t * (c5 + t * c6)))));
}`;function kr(e,t,n){return e<-6?t<.3?B.POLAR_DESERT:B.TUNDRA:e<2?t<.3?B.COLD_DESERT:t<.6?B.STEPPE:B.BOREAL:n&&e>=8&&e<20&&t>=.3&&t<1.3?B.MEDITERRANEAN:e<10?t<.2?B.COLD_DESERT:t<.65?B.STEPPE:e<6?B.TEMP_CONIFER:B.TEMP_BROADLEAF:e<18?t<.2?e<14?B.COLD_DESERT:B.HOT_DESERT:t<.5?B.XERIC_SHRUB:t<.75?B.STEPPE:t>2.5&&e<16?B.TEMP_RAINFOREST:B.TEMP_BROADLEAF:t<.2?B.HOT_DESERT:t<.5?B.XERIC_SHRUB:t<.9?B.SAVANNA:t<1.4?B.TROP_DRY_FOREST:B.TROP_RAINFOREST}function Ar(e,t){let n=new Float32Array(12288);for(let r=0;r<64;r++){let i=10**(2*(r+.5)/64-1);for(let a=0;a<64;a++){let o=Dr[kr(-20+50*(a+.5)/64,i,t)],s=e===`satellite`?o.satellite:o.stylised,c=(r*64+a)*3;n[c]=s[0],n[c+1]=s[1],n[c+2]=s[2]}}let r=Mr(n,64,2),i=new Uint8Array(16384);for(let e=0;e<4096;e++)i[e*4]=r[e*3],i[e*4+1]=r[e*3+1],i[e*4+2]=r[e*3+2],i[e*4+3]=255;return i}function jr(e){let t=new Uint8Array(128);for(let n of Dr){let r=e===`satellite`?n.satellite:n.stylised;t.set([r[0],r[1],r[2],255],n.id*4)}return t}function Mr(e,t,n){let r=Math.ceil(n*3),i=[],a=0;for(let e=-r;e<=r;e++){let t=Math.exp(-(e*e)/(2*n*n));i.push(t),a+=t}let o=(e,n,o)=>{let s=new Float32Array(e.length);for(let c=0;c<t;c++)for(let l=0;l<t;l++)for(let u=0;u<3;u++){let d=0;for(let a=-r;a<=r;a++){let s=Math.min(t-1,Math.max(0,l+a*n)),f=Math.min(t-1,Math.max(0,c+a*o));d+=e[(f*t+s)*3+u]*i[a+r]}s[(c*t+l)*3+u]=d/a}return s};return o(o(e,1,0),0,1)}var Nr=2048,Pr=class{instances=new Float32Array(Nr*6);count=0;ranges=[];get levelRanges(){return this.ranges}select(e,t,n,r,i){let a=e.size/2**i.maxDepth/32*i.pxPerRad/i.vertexPx;this.ranges=[];for(let t=0;t<=i.maxDepth;t++)this.ranges.push(Math.max(a*2**t,e.size/2**(i.maxDepth-t)*1.6));return this.count=0,this.visit(e,0,0,e.size,i.maxDepth,t,n,r,i.boundsPad),this.count}visit(e,t,n,r,i,a,o,s,c){let[l,u]=e.rangeOver(t,n,r),d=l-c,f=u+c;if(!Ir(s,t-o.x,n-o.y,d-o.z,t+r-o.x,n+r-o.y,f-o.z))return;if(i===0||!Fr(a,this.ranges[i-1],t,n,d,r,f)){this.emit(t,n,r,i,o);return}let p=r/2;this.visit(e,t,n,p,i-1,a,o,s,c),this.visit(e,t+p,n,p,i-1,a,o,s,c),this.visit(e,t,n+p,p,i-1,a,o,s,c),this.visit(e,t+p,n+p,p,i-1,a,o,s,c)}emit(e,t,n,r,i){if(this.count>=2048)return;let a=this.ranges[r],o=this.count++*6,s=this.instances;s[o]=e-i.x,s[o+1]=t-i.y,s[o+2]=n,s[o+3]=r,s[o+4]=a*.7,s[o+5]=a}};function Fr(e,t,n,r,i,a,o){let s=Math.max(n-e.x,0,e.x-(n+a)),c=Math.max(r-e.y,0,e.y-(r+a)),l=Math.max(i-e.z,0,e.z-o);return s*s+c*c+l*l<=t*t}function Ir(e,t,n,r,i,a,o){for(let s=0;s<6;s++){let c=e[s*4],l=e[s*4+1],u=e[s*4+2],d=e[s*4+3];if(!Number.isFinite(d))continue;let f=c>=0?i:t,p=l>=0?a:n,m=u>=0?o:r;if(c*f+l*p+u*m+d<0)return!1}return!0}var Lr=2048,Rr=Math.PI/4,zr=class{instances=new Float32Array(Lr*10);nodes=[];culled=[];count=0;horizonCulled=0;keepNodes=!1;ranges=[];pts=new Float64Array(54);d=new Float64Array(3);get levelRanges(){return this.ranges}static depthFor(e){return Math.max(1,Math.round(Math.log2(e/4)))}select(e,t,n,r){let i=e.radius,a=Math.PI/2*i,o=a/2**r.maxDepth/32*r.pxPerRad/r.vertexPx;this.ranges=[];for(let e=0;e<=r.maxDepth;e++)this.ranges.push(Math.max(o*2**e,a/2**(r.maxDepth-e)*1.6));this.count=0,this.horizonCulled=0,this.nodes.length=0,this.culled.length=0;for(let i=0;i<6;i++)this.visit(e,i,-Rr,-Rr,Math.PI/2,r.maxDepth,t,n,r.boundsPad);return this.count}visit(e,t,n,r,i,a,o,s,c){let l=e.radius,[u,d]=e.rangeOver(t,n,r,i),f=l+Math.max(0,u-c),p=(l+d+c)/Math.cos(Math.min(i,1.5)/2),m=this.pts,h=0;for(let e=0;e<3;e++)for(let a=0;a<3;a++){Je(t,n+a*i/2,r+e*i/2,this.d);for(let e of[f,p])m[h++]=this.d[0]*e,m[h++]=this.d[1]*e,m[h++]=this.d[2]*e}let g=1/0,_=1/0,v=1/0,y=-1/0,b=-1/0,x=-1/0;for(let e=0;e<54;e+=3)g=Math.min(g,m[e]),y=Math.max(y,m[e]),_=Math.min(_,m[e+1]),b=Math.max(b,m[e+1]),v=Math.min(v,m[e+2]),x=Math.max(x,m[e+2]);if(!Hr(s,g-o.x,_-o.y,v-o.z,y-o.x,b-o.y,x-o.z))return;if(Br(m,18,o,l*(1-1e-7))){this.horizonCulled++,this.keepNodes&&this.culled.push({face:t,a0:n,b0:r,size:i,level:a});return}if(a===0||!Vr(o,this.ranges[a-1],g,_,v,y,b,x)){this.emit(e,t,n,r,i,a,o);return}let S=i/2;this.visit(e,t,n,r,S,a-1,o,s,c),this.visit(e,t,n+S,r,S,a-1,o,s,c),this.visit(e,t,n,r+S,S,a-1,o,s,c),this.visit(e,t,n+S,r+S,S,a-1,o,s,c)}emit(e,t,n,r,i,a,o){if(this.count>=2048)return;let s=this.ranges[a],c=n+i/2,l=r+i/2;Je(t,c,l,this.d);let u=e.radius,d=this.count++*10,f=this.instances;f[d]=t,f[d+1]=c,f[d+2]=l,f[d+3]=i,f[d+4]=this.d[0]*u-o.x,f[d+5]=this.d[1]*u-o.y,f[d+6]=this.d[2]*u-o.z,f[d+7]=a,f[d+8]=s*.7,f[d+9]=s,this.keepNodes&&this.nodes.push({face:t,a0:n,b0:r,size:i,level:a})}};function Br(e,t,n,r){let i=n.x*n.x+n.y*n.y+n.z*n.z-r*r;if(i<=0)return!1;for(let r=0;r<t;r++){let t=e[r*3]-n.x,a=e[r*3+1]-n.y,o=e[r*3+2]-n.z,s=t*t+a*a+o*o,c=n.x*t+n.y*a+n.z*o,l=c*c-s*i;if(c>=0||l<0||!((-c-Math.sqrt(l))/s<1))return!1}return!0}function Vr(e,t,n,r,i,a,o,s){let c=Math.max(n-e.x,0,e.x-a),l=Math.max(r-e.y,0,e.y-o),u=Math.max(i-e.z,0,e.z-s);return c*c+l*l+u*u<=t*t}function Hr(e,t,n,r,i,a,o){for(let s=0;s<6;s++){let c=e[s*4],l=e[s*4+1],u=e[s*4+2],d=e[s*4+3];if(!Number.isFinite(d))continue;let f=c>=0?i:t,p=l>=0?a:n,m=u>=0?o:r;if(c*f+l*p+u*m+d<0)return!1}return!0}var H={M1:2376512323,M2:3625334849,M3:3407524639,F1:2146121005,F2:2221713035,OCT:2654435769,SEED_BAKE:1540483477,SEED_DUNE:1759714724,TILE:65536,TILE_BIAS:64,RIDGE_HI:.7,RIDGE_MAX:1.3,DAMP:2,FADE_LO:.25,FADE_HI:.5,MAX_OCT:8,MIN_LAMBDA:16,AMP_BASE:2,AMP_ROUGH:60,LAM_REF:512,LAM_EXP:.7,DUNE_LX:256,DUNE_LY:1024,DUNE_AMP:10,DUNE_MEAN:.45,DUNE_MAX:.55,SHORE_MARGIN:1,BAKE_BASE:8,BAKE_ROUGH:150,BAKE_LAM_REF:2048,DRY:-9e3},Ur=e=>2**Math.floor(Math.log2(Math.max(1,e)));function Wr(e,t,n,r){let i=e/t,a=e/n,o=Math.min(Ur(3*i),H.TILE/2),s=Math.max(1,Math.min(H.MAX_OCT,Math.round(Math.log2(o/H.MIN_LAMBDA))+1)),c=Math.min(2*Ur(2*a-1),H.TILE/2),l=Math.max(0,Math.min(5,Math.floor(Math.log2(c/(2*i)))+1));return{seed:r>>>0,size:e,detailN:t,macroN:n,texel:i,macroCell:a,lam0:o,octaves:s,ampScale:(o/H.LAM_REF)**H.LAM_EXP,bakeLam0:c,bakeOct:l,bakeAmpScale:(c/H.BAKE_LAM_REF)**H.LAM_EXP}}function U(e,t,n){let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)}var W=(e,t,n)=>Math.min(n,Math.max(t,e)),Gr=e=>e>0?1:e<0?-1:0;function Kr(e,t){return 1-U(H.FADE_LO,H.FADE_HI,e/t)}function qr(e,t){return e+Math.imul(t,H.OCT)>>>0}function Jr(e,t,n){let r=(Math.imul(e,H.M1)^Math.imul(t,H.M2)^Math.imul(n,H.M3))>>>0;return r^=r>>>16,r=Math.imul(r,H.F1)>>>0,r^=r>>>15,r=Math.imul(r,H.F2)>>>0,r^=r>>>16,r>>>0}function Yr(e,t,n){return(Jr(e,t,n)>>>8)*(2/16777216)-1}function Xr(e,t,n,r,i,a){let o=Math.floor(e*(1/H.TILE)),s=Math.floor(t*(1/H.TILE)),c=(e-o*H.TILE)/n,l=(t-s*H.TILE)/r,u=Math.floor(c),d=Math.floor(l),f=c-u,p=l-d,m=(o+H.TILE_BIAS)*(H.TILE/n)+u,h=(s+H.TILE_BIAS)*(H.TILE/r)+d,g=f*f*f*(f*(f*6-15)+10),_=p*p*p*(p*(p*6-15)+10),v=30*f*f*(f*(f-2)+1),y=30*p*p*(p*(p-2)+1),b=Yr(m,h,i),x=Yr(m+1,h,i),S=Yr(m,h+1,i),C=Yr(m+1,h+1,i),w=x-b,T=S-b,E=b-x-S+C;return a[0]=b+w*g+T*_+E*g*_,a[1]=v*(w+E*_)/n,a[2]=y*(T+E*g)/r,a}var Zr=new Float64Array(3);function Qr(e,t,n,r,i,a,o,s,c,l,u){if(a<=0)return u;let d=a/(2*(1-.5**i)*H.RIDGE_MAX),f=r,p=s,m=c;for(let r=0;r<H.MAX_OCT&&!(r>=i);r++){let i=Kr(n,f);if(i<=0)break;Xr(e,t,f,f,qr(l,r),Zr);let a=Gr(Zr[0]),s=Zr[0]+(H.RIDGE_HI-2*Math.abs(Zr[0])-Zr[0])*o,c=Zr[1]+(-2*a*Zr[1]-Zr[1])*o,h=Zr[2]+(-2*a*Zr[2]-Zr[2])*o,g=1/(1+H.DAMP*(p*p+m*m)),_=i*d*g;u[0]+=_*s,u[1]+=_*c,u[2]+=_*h,p+=d*c,m+=d*h,d*=.5,f*=.5}return u}function $r(e,t,n,r,i,a){if(r<=0)return a;let o=Kr(n,H.DUNE_LX);if(o<=0)return a;Xr(e,t,H.DUNE_LX,H.DUNE_LY,(i^H.SEED_DUNE)>>>0,Zr);let s=1-Math.abs(Zr[0]),c=Gr(Zr[0]),l=o*r;return a[0]+=l*(s*s-H.DUNE_MEAN),a[1]+=l*-2*s*c*Zr[1],a[2]+=l*-2*s*c*Zr[2],a}function ei(e,t,n,r,i){let a=Math.floor(n),o=Math.floor(r),s=n-a,c=r-o,l=W(a,0,t-1),u=W(a+1,0,t-1),d=W(o,0,t-1),f=W(o+1,0,t-1),p=e[d*t+l],m=e[d*t+u],h=e[f*t+l],g=e[f*t+u],_=p+(m-p)*s;return i[0]=_+(h+(g-h)*s-_)*c,i[1]=m-p+(g-h-(m-p))*c,i[2]=h-p+(g-m-(h-p))*s,i}var ti=(e,t)=>t===0?((-.5*e+1)*e-.5)*e:t===1?(1.5*e-2.5)*e*e+1:t===2?((-1.5*e+2)*e+.5)*e:(.5*e-.5)*e*e,ni=(e,t)=>t===0?(-1.5*e+2)*e-.5:t===1?(4.5*e-5)*e:t===2?(-4.5*e+4)*e+.5:(1.5*e-1)*e;function ri(e,t,n,r,i){let a=Math.floor(n),o=Math.floor(r),s=n-a,c=r-o,l=0,u=0,d=0,f=1/0,p=-1/0;for(let n=0;n<4;n++){let r=W(o+n-1,0,t-1)*t,i=0,m=0;for(let o=0;o<4;o++){let c=e[r+W(a+o-1,0,t-1)];i+=ti(s,o)*c,m+=ni(s,o)*c,o>=1&&o<=2&&n>=1&&n<=2&&(f=Math.min(f,c),p=Math.max(p,c))}l+=ti(c,n)*i,u+=ti(c,n)*m,d+=ni(c,n)*i}return i[0]=l,i[1]=u,i[2]=d,i[3]=f,i[4]=p,i}function ii(e,t){return t>H.DRY?e<t?[-1e30,t-.5]:[t+.5,1e30]:[e>=.5?.5:-1e30,1e30]}function ai(e,t,n,r,i,a,o,s,c){let l=.5*r,u;if(e<l){let r=e/l;u=t+(n-t)*r*r}else{let t=e-l;u=Math.max(n+.002*Math.min(t,i)+a*Math.max(0,t-i),s)}let d=Math.min(c,.4*o),f=o-d;if(e>f){let t=(e-f)/d;u+=2e3*t*t}return u}var oi=new Float64Array(5),si=new Float64Array(5),ci=new Float64Array(5),li=class{src;amp=1;size;constructor(e){this.src=e,this.size=e.size}q(e,t,n){return[t/this.size*e-.5,(this.size-n)/this.size*e-.5]}macroBilinear(e,t,n=new Float64Array(3)){let r=this.src.macroN,[i,a]=this.q(r,e,t);ei(this.src.macro,r,i,a,n);let o=r/this.size;return n[1]*=o,n[2]*=-o,n}macroBicubic(e,t,n=new Float64Array(5)){let r=this.src.macroN,[i,a]=this.q(r,e,t);ri(this.src.macro,r,i,a,n);let o=r/this.size;return n[1]*=o,n[2]*=-o,n}waterLevelAt(e,t){let n=this.src.water;if(!n)return 0;let r=this.src.macroN,[i,a]=this.q(r,e,t);return ei(n,r,i,a,ci)[0]}surfaceHeightMacro(e,t){let n=this.src.macroN,[r,i]=this.q(n,e,t),a=Math.floor(r),o=Math.floor(i),s=r-a,c=i-o,l=(e,t)=>{let r=W(t,0,n-1)*n+W(e,0,n-1),i=this.src.macro[r],a=this.src.water?this.src.water[r]:i<0?0:-1e4;return a>H.DRY?Math.max(i,a):Math.max(i,0)},u=l(a,o),d=l(a+1,o),f=l(a,o+1),p=l(a+1,o+1),m=u+(d-u)*s;return m+(f+(p-f)*s-m)*c}detailWeight(e){let t=this.src.params;return t?1-U(t.texel,2*t.texel,e):0}control(e,t,n){let r=this.src.control,i=this.src.controlN;if(!r)return n.fill(0,0,4),n;let a=e/this.size*i-.5,o=(this.size-t)/this.size*i-.5,s=Math.floor(a),c=Math.floor(o),l=a-s,u=o-c,d=W(s,0,i-1),f=W(s+1,0,i-1),p=W(c,0,i-1),m=W(c+1,0,i-1);for(let e=0;e<4;e++){let t=r[(p*i+d)*4+e],a=r[(p*i+f)*4+e],o=r[(m*i+d)*4+e],s=r[(m*i+f)*4+e],c=t+(a-t)*l,h=o+(s-o)*l;n[e]=(c+(h-c)*u)/255}return n}detailBase(e,t,n,r){let i=this.src.params,a=this.src.detail;if(!a)return this.macroBicubic(e,t,si),r[0]=si[0],r[1]=si[1],r[2]=si[2],r;let o=i.detailN,[s,c]=this.q(o,e,t);ei(a,o,s,c,r);let l=1-U(.25*i.texel,.5*i.texel,n);if(l>0){ri(a,o,s,c,si),(si[0]<si[3]||si[0]>si[4])&&(si[0]=W(si[0],si[3],si[4]),si[1]=r[1],si[2]=r[2]);for(let e=0;e<3;e++)r[e]+=(si[e]-r[e])*l}let u=o/this.size;return r[1]*=u,r[2]*=-u,r}sample(e,t,n,r=new Float64Array(3)){let i=this.src.params;if(!i)return this.macroBilinear(e,t,r);let a=this.detailWeight(n);if(a<=0)return this.macroBilinear(e,t,r);if(this.detailBase(e,t,n,r),a<1){this.macroBilinear(e,t,oi);for(let e=0;e<3;e++)r[e]=oi[e]+(r[e]-oi[e])*a}if(n>=.5*i.lam0)return r;let o=this.control(e,t,ci),s=o[0],c=o[1],l=o[2],u=o[3],d=this.amp*(H.AMP_BASE+H.AMP_ROUGH*s)*i.ampScale*(1-l),f=this.amp*H.DUNE_AMP*u*(1-l),p=this.src.water?this.waterLevelAt(e,t):0,m=p>H.DRY?Math.abs(r[0]-p)-H.SHORE_MARGIN:1e9,h=d+H.DUNE_MAX*f,g=h>0?W(m/h,0,1):0;return d*=g,f*=g,Qr(e,t,n,i.lam0,i.octaves,d,c,r[1],r[2],i.seed,r),$r(e,t,n,f,i.seed,r),r}terrainHeight(e,t,n){return this.sample(e,t,n,ui)[0]}terrainGradient(e,t,n){let r=this.sample(e,t,n,ui);return[r[1],r[2]]}terrainSurface(e,t,n){if(!this.src.params)return this.surfaceHeightMacro(e,t);let r=this.detailWeight(n),i=r<1?this.surfaceHeightMacro(e,t):0;if(r<=0)return i;let a=this.sample(e,t,n,ui)[0],o=this.src.water?this.waterLevelAt(e,t):0;return i+((o>H.DRY?Math.max(a,o):Math.max(a,0))-i)*r}},ui=new Float64Array(3),di=class{fn;hf;pad;pxFoot=100;maxSlope=3;constructor(e,t,n=300){this.fn=e,this.hf=t,this.pad=n}get size(){return this.hf.size}heightAt(e,t,n=this.pxFoot){let r=this.hf.size;return this.fn.terrainSurface(W(e,0,r),W(t,0,r),this.foot(n))*this.hf.exaggeration}detailHeightAt(e,t,n=this.pxFoot){let r=this.hf.size;return this.fn.terrainHeight(W(e,0,r),W(t,0,r),this.foot(n))}foot(e){return e>0||(e=this.pxFoot>0?this.pxFoot:100),Math.min(e,1e9)}raycast(e,t,n=this.pxFoot){n=this.foot(n);let r=this.hf.size,i=this.hf.exaggeration,a=this.hf.maxHeight+this.pad*i+1,o=0,s=1/0,c=(e,t,n,r)=>{if(Math.abs(t)<1e-12)return e>=n&&e<=r;let i=(n-e)/t,a=(r-e)/t;return i>a&&([i,a]=[a,i]),o=Math.max(o,i),s=Math.min(s,a),o<=s};if(!c(e.x,t.x,0,r)||!c(e.y,t.y,0,r)||!c(e.z,t.z,-12e3*i,a))return null;let l=Math.hypot(t.x,t.y),u=this.maxSlope*i*l+Math.abs(t.z),d=Math.max(.25*n,1)/Math.max(1e-9,Math.hypot(l,t.z)),f=r=>e.z+t.z*r-this.heightAt(e.x+t.x*r,e.y+t.y*r,n),p=o,m=f(p);if(m<=0)return fi(e,t,p);for(let n=0;n<1e5&&p<s;n++){let n=Math.max(d,m/Math.max(1e-9,u)),r=Math.min(s,p+n),i=f(r);if(i<=0){let n=p,i=r;for(let e=0;e<30;e++){let e=.5*(n+i);f(e)>0?n=e:i=e}return fi(e,t,i)}if(r>=s)break;p=r,m=i}return null}};function fi(e,t,n){return{x:e.x+t.x*n,y:e.y+t.y*n,z:e.z+t.z*n}}var G={M4:695872825,SEED_COAST:1013904242,TEXEL_TARGET:250,K_MIN:2,K_MAX:16,MARGIN:12,APRON:48,BLEND:8,COAST_DISP:700,COAST_MIN:2,COAST_MAX:60,COAST_RELAX:1e3,WET_FADE:.05,WET_DROP:1e3};function pi(e,t){return e-G.WET_DROP*(1-Math.min(1,Math.max(0,t/G.WET_FADE)))}var mi=e=>2**Math.round(Math.log2(Math.max(1e-9,e)));function hi(e,t,n){let r=t*Math.PI/2/e,i=Math.min(G.K_MAX,Math.max(G.K_MIN,mi(r/G.TEXEL_TARGET))),a=e*i,o=Math.max(1,Math.ceil(a/n));for(;a%o!==0||a/o%i!==0||(a/o+2*G.MARGIN)%4!=0;)o++;let s=a/o,c=Math.PI/2/a;return{n:e,radius:t,k:i,F:a,N:s,T:o,M:G.MARGIN,A:G.APRON,B:G.BLEND,delta:c,texelM:t*c}}var gi=(e,t,n,r)=>(e*r+n)*r+t;function _i(e,t){let n=e%t,r=(e-n)/t,i=r%t;return[(r-i)/t,n,i]}var vi=e=>e.N+2*e.M;function yi(e,t,n){let[r,i,a]=_i(t,e.T),o=e.N*e.delta,s=-Math.PI/4+i*o,c=-Math.PI/4+a*o;Je(r,s+o/2,c+o/2,n);let l=n[0],u=n[1],d=n[2],f=0,p=new Float64Array(3);for(let[e,t]of[[s,c],[s+o,c],[s,c+o],[s+o,c+o]])Je(r,e,t,p),f=Math.max(f,Math.acos(Math.min(1,l*p[0]+u*p[1]+d*p[2])));return f}function bi(e,t,n){return U(0,1,(e+n)/(2*n))*U(0,1,(t+n-e)/(2*n))}function xi(e,t,n){return e>.5?0:t>.5?1:e<-.5?2:t<-.5?3:n>.5?4:5}function Si(e,t,n,r,i){let a=e*3,o=t*F[a]+n*F[a+1]+r*F[a+2];return i[0]=Math.atan2(t*I[a]+n*I[a+1]+r*I[a+2],o),i[1]=Math.atan2(t*L[a]+n*L[a+1]+r*L[a+2],o),i}function Ci(e,t,n,r,i,a,o,s=1){let c=Math.tan(t),l=Math.tan(n),u=1+c*c+l*l,d=Math.sqrt(u),f=(1+c*c)/d,p=(1+l*l)/d,m=a*f*(1-c*c/u),h=a*f*(-(c*l)/u),g=a*f*(-c/u),_=a*p*(-(c*l)/u),v=a*p*(1-l*l/u),y=a*p*(-l/u),b=m*m+h*h+g*g,x=_*_+v*v+y*y,S=m*_+h*v+g*y,C=b*x-S*S,w=(r*x-i*S)/C,T=(i*b-r*S)/C,E=w*m+T*_,D=w*h+T*v,O=w*g+T*y,k=e*3;o[s]=E*I[k]+D*L[k]+O*F[k],o[s+1]=E*I[k+1]+D*L[k+1]+O*F[k+1],o[s+2]=E*I[k+2]+D*L[k+2]+O*F[k+2]}function wi(e,t,n,r){let i=(Math.imul(e,H.M1)^Math.imul(t,H.M2)^Math.imul(n,G.M4)^Math.imul(r,H.M3))>>>0;return i^=i>>>16,i=Math.imul(i,H.F1)>>>0,i^=i>>>15,i=Math.imul(i,H.F2)>>>0,i^=i>>>16,i>>>0}var Ti=(e,t,n,r)=>(wi(e,t,n,r)>>>8)*(2/16777216)-1;function Ei(e,t,n,r,i,a){let o=e/r,s=t/r,c=n/r,l=Math.floor(o),u=Math.floor(s),d=Math.floor(c),f=o-l,p=s-u,m=c-d,h=f*f*f*(f*(f*6-15)+10),g=p*p*p*(p*(p*6-15)+10),_=m*m*m*(m*(m*6-15)+10),v=30*f*f*(f*(f-2)+1),y=30*p*p*(p*(p-2)+1),b=30*m*m*(m*(m-2)+1),x=Ti(l,u,d,i),S=Ti(l+1,u,d,i),C=Ti(l,u+1,d,i),w=Ti(l+1,u+1,d,i),T=Ti(l,u,d+1,i),E=Ti(l+1,u,d+1,i),D=Ti(l,u+1,d+1,i),O=Ti(l+1,u+1,d+1,i),k=S-x,A=C-x,j=T-x,M=x-S-C+w,N=x-C-T+D,ee=x-S-T+E,te=-x+S+C-w+T-E-D+O;return a[0]=x+k*h+A*g+j*_+M*h*g+N*g*_+ee*_*h+te*h*g*_,a[1]=v*(k+M*g+ee*_+te*g*_)/r,a[2]=y*(A+N*_+M*h+te*_*h)/r,a[3]=b*(j+ee*h+N*g+te*h*g)/r,a}var Di=new Float64Array(4);function Oi(e,t,n,r,i,a,o,s,c,l,u,d){if(s<=0)return d;let f=s/(2*(1-.5**o)*H.RIDGE_MAX),p=a,m=l[1],h=l[2],g=l[3];for(let a=0;a<H.MAX_OCT&&!(a>=o);a++){let o=Kr(i,p);if(o<=0)break;Ei(e,t,n,p,qr(u,a),Di);let s=Di[1]*r[0]+Di[2]*r[1]+Di[3]*r[2],l=Di[1]-s*r[0],_=Di[2]-s*r[1],v=Di[3]-s*r[2],y=Di[0]>0?1:Di[0]<0?-1:0,b=Di[0]+(H.RIDGE_HI-2*Math.abs(Di[0])-Di[0])*c,x=l+(-2*y*l-l)*c,S=_+(-2*y*_-_)*c,C=v+(-2*y*v-v)*c,w=o*f/(1+H.DAMP*(m*m+h*h+g*g));d[0]+=w*b,d[1]+=w*x,d[2]+=w*S,d[3]+=w*C;let T=f*(1+c);m+=T*l,h+=T*_,g+=T*v,f*=.5,p*=.5}return d}function ki(e,t){let n=Wr(e.F*e.texelM,e.F,e.n,t);return{seed:n.seed,texelM:n.texel,macroCell:n.macroCell,lam0:n.lam0,octaves:n.octaves,ampScale:n.ampScale,bakeLam0:n.bakeLam0,bakeOct:n.bakeOct,bakeAmpScale:n.bakeAmpScale}}function Ai(e,t){let n=(H.BAKE_BASE+H.BAKE_ROUGH)*e.bakeAmpScale,r=(H.AMP_BASE+H.AMP_ROUGH)*e.ampScale;return Math.ceil(t+n+G.COAST_MAX+r+50)}var ji=Math.PI/4,Mi=new Float64Array(4),Ni=new Float64Array(5),Pi=new Float64Array(4),Fi=new Float64Array(4),Ii=new Float64Array(3),Li=new Float64Array(3),Ri=(e,t)=>t===0?((-.5*e+1)*e-.5)*e:t===1?(1.5*e-2.5)*e*e+1:t===2?((-1.5*e+2)*e+.5)*e:(.5*e-.5)*e*e,zi=(e,t)=>t===0?(-1.5*e+2)*e-.5:t===1?(4.5*e-5)*e:t===2?(-4.5*e+4)*e+.5:(1.5*e-1)*e,Bi=new Float64Array(16),Vi=new Float64Array(9),Hi=new Float64Array(9);function Ui(e,t,n,r,i,a){let o=Math.floor(r),s=Math.floor(i),c=r-o,l=i-s,u=0,d=0,f=0;for(let r=0;r<4;r++){let i=t+(s+r-1)*n+o-1,a=0,p=0;for(let t=0;t<4;t++){let n=e[i+t];Bi[r*4+t]=n,a+=Ri(c,t)*n,p+=zi(c,t)*n}u+=Ri(l,r)*a,d+=Ri(l,r)*p,f+=zi(l,r)*a}return Wi(c,l,a),a[0]=Math.min(a[4],Math.max(a[3],u)),a[1]=d,a[2]=f,a}function Wi(e,t,n){for(let e=0;e<3;e++)for(let t=0;t<3;t++){let n=Bi[e*4+t],r=Bi[e*4+t+1],i=Bi[e*4+t+4],a=Bi[e*4+t+5];Vi[e*3+t]=Math.max(n,r,i,a),Hi[e*3+t]=Math.min(n,r,i,a)}let r=e<.5?0:1,i=t<.5?0:1,a=e<.5?e+.5:e-.5,o=t<.5?t+.5:t-.5,s=i*3+r,c=e=>{let t=e[s]+(e[s+1]-e[s])*a;return t+(e[s+3]+(e[s+4]-e[s+3])*a-t)*o};n[3]=c(Hi),n[4]=c(Vi)}function Gi(e,t,n,r,i,a){let o=Math.floor(r),s=Math.floor(i),c=r-o,l=i-s,u=Math.min(n-1,Math.max(0,o)),d=Math.min(n-1,Math.max(0,o+1)),f=Math.min(n-1,Math.max(0,s)),p=Math.min(n-1,Math.max(0,s+1)),m=e[t+f*n+u],h=e[t+f*n+d],g=e[t+p*n+u],_=e[t+p*n+d],v=m+(h-m)*c;return a[0]=v+(g+(_-g)*c-v)*l,a[1]=h-m+(_-g-(h-m))*l,a[2]=g-m+(_-h-(g-m))*c,a}var Ki=class{src;amp=1;n;radius;delta;m;constructor(e){this.src=e,this.n=e.n,this.radius=e.radius,this.delta=Math.PI/2/e.n,this.m=e.n+4}macroBilinear(e,t,n,r){let i=this.m,a=Math.min(i-1.001,Math.max(0,(t+ji)/this.delta-.5+2)),o=Math.min(i-1.001,Math.max(0,(n+ji)/this.delta-.5+2));return Gi(this.src.macroPad,e*i*i,i,a,o,Mi),r[0]=Mi[0],Ci(e,t,n,Mi[1]/this.delta,Mi[2]/this.delta,this.radius,r),r}surfaceMacro(e,t,n){let r=this.m,i=Math.min(r-1.001,Math.max(0,(t+ji)/this.delta-.5+2)),a=Math.min(r-1.001,Math.max(0,(n+ji)/this.delta-.5+2)),o=Math.floor(i),s=Math.floor(a),c=i-o,l=a-s,u=this.src.surfacePad??null,d=u??this.src.macroPad,f=e*r*r+s*r+o,p=u?e=>e:e=>e>0?e:0,m=p(d[f])+(p(d[f+1])-p(d[f]))*c;return m+(p(d[f+r])+(p(d[f+r+1])-p(d[f+r]))*c-m)*l}macroCubic(e,t,n,r){let i=this.m,a=Math.min(i-2.001,Math.max(1,(t+ji)/this.delta-.5+2)),o=Math.min(i-2.001,Math.max(1,(n+ji)/this.delta-.5+2));return Ui(this.src.macroPad,e*i*i,i,a,o,Ni),r[0]=Ni[0],Ci(e,t,n,Ni[1]/this.delta,Ni[2]/this.delta,this.radius,r),r}waterLevel(e,t,n){let r=this.src.waterPad;if(!r)return 0;let i=this.m,a=Math.min(i-1.001,Math.max(0,(t+ji)/this.delta-.5+2)),o=Math.min(i-1.001,Math.max(0,(n+ji)/this.delta-.5+2));Gi(r,e*i*i,i,a,o,Mi);let s=Mi[0],c=this.src.wetPad;return!c||s<=H.DRY?s:(Gi(c,e*i*i,i,a,o,Mi),pi(s,Mi[0]))}detailWeight(e){let t=this.src.params;return t?1-U(t.texelM,2*t.texelM,e):0}control(e,t,n,r){let i=this.src.control;if(!i)return r.fill(0),r;let a=this.m,o=(t+ji)/this.delta+2-.5,s=(n+ji)/this.delta+2-.5,c=Math.floor(o),l=Math.floor(s),u=o-c,d=s-l,f=Math.min(a-1,Math.max(0,c)),p=Math.min(a-1,Math.max(0,c+1)),m=Math.min(a-1,Math.max(0,l)),h=Math.min(a-1,Math.max(0,l+1)),g=e*a*a;for(let e=0;e<4;e++){let t=i[(g+m*a+f)*4+e],n=i[(g+m*a+p)*4+e],o=i[(g+h*a+f)*4+e],s=i[(g+h*a+p)*4+e],c=t+(n-t)*u;r[e]=(c+(o+(s-o)*u-c)*d)/255}return r}tileBase(e,t,n,r,i,a,o,s){let c=this.src.tiles;if(this.macroCubic(e,t,n,s),!c)return s;let l=c.lattice,{N:u,T:d,M:f,B:p,F:m}=l,h=u+2*f,g=this.src.params,_=1-U(.25*g.texelM,.5*g.texelM,o),v=0,y=0,b=0,x=0,S=0,C=0,w=(t+ji)/l.delta,T=(n+ji)/l.delta,E=e*3;for(let o=-1;o<4;o++){let s=e,g=t,D=n;if(o>=0){if(!(o===0?w<p:o===1?w>m-p:o===2?T<p:T>m-p))continue;let e=o===0||o===2?-1:1,t=o<2?I:L;s=xi(e*t[E],e*t[E+1],e*t[E+2]),Si(s,r,i,a,Ii),g=Ii[0],D=Ii[1]}let O=(g+ji)/l.delta,k=(D+ji)/l.delta,A=Math.max(0,Math.floor((O-p)/u)),j=Math.min(d-1,Math.floor((O+p)/u)),M=Math.max(0,Math.floor((k-p)/u)),N=Math.min(d-1,Math.floor((k+p)/u));for(let e=M;e<=N;e++)for(let t=A;t<=j;t++){let n=O-t*u,r=k-e*u,i=bi(n,u,p)*bi(r,u,p);if(i<=0)continue;v+=i;let a=c.tile(gi(s,t,e,d));if(!a||!a.data||a.fade<=0)continue;let o=n+f-.5,m=r+f-.5;if(Gi(a.data,0,h,o,m,Pi),_>0){Ui(a.data,0,h,o,m,Ni);for(let e=0;e<3;e++)Pi[e]+=(Ni[e]-Pi[e])*_}Ci(s,g,D,Pi[1]/l.delta,Pi[2]/l.delta,l.radius,Fi);let w=i*a.fade;y+=w,b+=w*Pi[0],x+=w*Fi[1],S+=w*Fi[2],C+=w*Fi[3]}}if(y<=0||v<=0)return s;let D=v-y;return s[0]=(b+D*s[0])/v,s[1]=(x+D*s[1])/v,s[2]=(S+D*s[2])/v,s[3]=(C+D*s[3])/v,s}sample(e,t,n,r,i=new Float64Array(4)){let a=this.src.params;if(this.macroBilinear(e,t,n,i),!a)return i;let o=this.detailWeight(r);if(o<=0)return i;Je(e,t,n,Li);let s=i[0],c=i[1],l=i[2],u=i[3];if(this.tileBase(e,t,n,Li[0],Li[1],Li[2],r,i),o<1&&(i[0]=s+(i[0]-s)*o,i[1]=c+(i[1]-c)*o,i[2]=l+(i[2]-l)*o,i[3]=u+(i[3]-u)*o),r>=.5*a.lam0)return i;let d=this.control(e,t,n,Fi),f=this.amp*(H.AMP_BASE+H.AMP_ROUGH*d[0])*a.ampScale*(1-d[2]),p=d[1],m=this.waterLevel(e,t,n),h=m>H.DRY?Math.abs(i[0]-m)-H.SHORE_MARGIN:1e9,g=f>0?Math.min(1,Math.max(0,h/f)):0,_=this.radius;return Oi(Li[0]*_,Li[1]*_,Li[2]*_,Li,r,a.lam0,a.octaves,f*g,p,i,a.seed,i),i}surface(e,t,n,r){let i=this.detailWeight(r),a=i<1?this.surfaceMacro(e,t,n):0;if(i<=0)return a;let o=this.sample(e,t,n,r,qi)[0],s=this.waterLevel(e,t,n);return a+((s>H.DRY?Math.max(o,s):Math.max(o,0))-a)*i}},qi=new Float64Array(4),Ji=class{fn;hf;pad;pxFoot=1e3;maxSlope=3;fa=new Float64Array(3);constructor(e,t,n){this.fn=e,this.hf=t,this.pad=n}get radius(){return this.hf.radius}get maxHeight(){return this.hf.maxHeight+this.pad*this.hf.exaggeration}foot(e){return e>0||(e=this.pxFoot>0?this.pxFoot:1e3),Math.min(e,1e9)}macroOnly(e){return this.fn.detailWeight(e)<=0}heightAtDir(e,t,n,r=this.pxFoot){let i=this.foot(r);return this.macroOnly(i)?this.hf.heightAtDir(e,t,n):(Wn(e,t,n,this.fa),this.fn.surface(this.fa[0],this.fa[1],this.fa[2],i)*this.hf.exaggeration)}elevationAtDir(e,t,n,r=this.pxFoot){return Wn(e,t,n,this.fa),this.fn.sample(this.fa[0],this.fa[1],this.fa[2],this.foot(r),qi)[0]}raycast(e,t,n=this.pxFoot){let r=this.foot(n);if(this.macroOnly(r))return this.hf.raycast(e,t);let i=this.hf.radius,a=Yn(e,t,i+this.maxHeight+1);if(!a||a[1]<0)return null;let o=Math.max(0,a[0]),s=a[1],c=Yn(e,t,i);c&&c[0]>=0&&(s=Math.min(s,c[0]));let l=this.hf.exaggeration,u=1+this.maxSlope*l,d=Math.max(.25*r,.5),f=n=>{let a=e.x+t.x*n,o=e.y+t.y*n,s=e.z+t.z*n;return Math.sqrt(a*a+o*o+s*s)-i-this.heightAtDir(a,o,s,r)},p=o,m=f(p);if(m<=0)return Yi(e,t,p);for(let n=0;n<2e4&&p<s;n++){let n=Math.min(s,p+Math.max(d,m/u)),r=f(n);if(r<=0){let r=p,i=n;for(let e=0;e<30;e++){let e=.5*(r+i);f(e)>0?r=e:i=e}return Yi(e,t,i)}if(n>=s)break;p=n,m=r}return s<a[1]?Yi(e,t,s):null}};function Yi(e,t,n){return{x:e.x+t.x*n,y:e.y+t.y*n,z:e.z+t.z*n}}var Xi=e=>`0x${(e>>>0).toString(16)}u`,K=e=>Number.isInteger(e)?`${e}.0`:`${e}`,Zi=`
const uint G_M1 = ${Xi(H.M1)};
const uint G_M2 = ${Xi(H.M2)};
const uint G_M3 = ${Xi(H.M3)};
const uint G_M4 = ${Xi(G.M4)};
const uint G_F1 = ${Xi(H.F1)};
const uint G_F2 = ${Xi(H.F2)};
const uint G_OCT = ${Xi(H.OCT)};
const uint G_SEED_BAKE = ${Xi(H.SEED_BAKE)};
const uint G_SEED_COAST = ${Xi(G.SEED_COAST)};
const float G_TILE = ${K(H.TILE)};
const float G_RIDGE_HI = ${K(H.RIDGE_HI)};
const float G_RIDGE_MAX = ${K(H.RIDGE_MAX)};
const float G_DAMP = ${K(H.DAMP)};
const float G_FADE_LO = ${K(H.FADE_LO)};
const float G_FADE_HI = ${K(H.FADE_HI)};
const int G_MAX_OCT = ${H.MAX_OCT};
const float G_AMP_BASE = ${K(H.AMP_BASE)};
const float G_AMP_ROUGH = ${K(H.AMP_ROUGH)};
const float G_SHORE_MARGIN = ${K(H.SHORE_MARGIN)};
const float G_BAKE_BASE = ${K(H.BAKE_BASE)};
const float G_BAKE_ROUGH = ${K(H.BAKE_ROUGH)};
const float G_COAST_DISP = ${K(G.COAST_DISP)};
const float G_COAST_MIN = ${K(G.COAST_MIN)};
const float G_COAST_MAX = ${K(G.COAST_MAX)};
const float G_COAST_RELAX = ${K(G.COAST_RELAX)};
const float G_WET_FADE = ${K(G.WET_FADE)};
const float G_WET_DROP = ${K(G.WET_DROP)};
float gWetLevel(float wl, float wet) { return wl - G_WET_DROP * (1.0 - clamp(wet / G_WET_FADE, 0.0, 1.0)); }

uint gHash(ivec3 c, uint s) {
  uint h = (uint(c.x) * G_M1) ^ (uint(c.y) * G_M2) ^ (uint(c.z) * G_M4) ^ (s * G_M3);
  h ^= h >> 16u; h *= G_F1; h ^= h >> 15u; h *= G_F2; h ^= h >> 16u;
  return h;
}
float gVal(ivec3 c, uint s) { return float(gHash(c, s) >> 8u) * (2.0 / 16777216.0) - 1.0; }

// Value noise at the point tile·G_TILE + l (m) on a lattice of spacing lam: (n, dn/dx, dn/dy, dn/dz) per metre.
vec4 gNoise(vec3 l, ivec3 tile, float lam, uint s) {
  vec3 q = l / lam;
  vec3 fq = floor(q);
  vec3 fr = q - fq;
  ivec3 i = tile * int(G_TILE / lam) + ivec3(fq);
  vec3 w = fr * fr * fr * (fr * (fr * 6.0 - 15.0) + 10.0);
  vec3 dw = 30.0 * fr * fr * (fr * (fr - 2.0) + 1.0);
  float a = gVal(i, s), b = gVal(i + ivec3(1, 0, 0), s), c = gVal(i + ivec3(0, 1, 0), s), d = gVal(i + ivec3(1, 1, 0), s);
  float e = gVal(i + ivec3(0, 0, 1), s), g = gVal(i + ivec3(1, 0, 1), s), h = gVal(i + ivec3(0, 1, 1), s), k = gVal(i + ivec3(1, 1, 1), s);
  float k1 = b - a, k2 = c - a, k3 = e - a, k4 = a - b - c + d, k5 = a - c - e + h, k6 = a - b - e + g;
  float k7 = -a + b + c - d + e - g - h + k;
  float n = a + k1 * w.x + k2 * w.y + k3 * w.z + k4 * w.x * w.y + k5 * w.y * w.z + k6 * w.z * w.x + k7 * w.x * w.y * w.z;
  vec3 gr = dw * vec3(k1 + k4 * w.y + k6 * w.z + k7 * w.y * w.z, k2 + k5 * w.z + k4 * w.x + k7 * w.z * w.x, k3 + k6 * w.x + k5 * w.y + k7 * w.x * w.y) / lam;
  return vec4(n, gr);
}

// Damped, ridged fBm on the sphere, faded per octave by footprint; gradients in the tangent plane at up.
vec4 gFbm(vec3 l, ivec3 tile, vec3 up, float pxFoot, float lam0, int oct, float amp, float ridge, vec3 g0, uint seed) {
  vec4 acc = vec4(0.0);
  if (amp <= 0.0) return acc;
  float a = amp / (2.0 * (1.0 - exp2(-float(oct))) * G_RIDGE_MAX);
  float lam = lam0;
  vec3 ds = g0;
  for (int k = 0; k < G_MAX_OCT; k++) {
    if (k >= oct) break;
    float fw = 1.0 - smoothstep(G_FADE_LO, G_FADE_HI, pxFoot / lam);
    if (fw <= 0.0) break;
    vec4 n = gNoise(l, tile, lam, seed + uint(k) * G_OCT);
    n.yzw -= dot(n.yzw, up) * up;
    vec3 un = n.yzw;
    float sg = sign(n.x);
    n = mix(n, vec4(G_RIDGE_HI - 2.0 * abs(n.x), -2.0 * sg * n.yzw), ridge);
    float c = fw * a / (1.0 + G_DAMP * dot(ds, ds));
    acc += c * n;
    // Ungated (fading an octave never changes the others), and unridged so damping is continuous at creases.
    ds += a * (1.0 + ridge) * un;
    a *= 0.5;
    lam *= 0.5;
  }
  return acc;
}

// fBm at an absolute planet-centred point (the tile build; float32 is ample for its >= 2-texel octaves).
vec4 gFbmAt(vec3 P, vec3 up, float pxFoot, float lam0, int oct, float amp, float ridge, vec3 g0, uint seed) {
  ivec3 tile = ivec3(floor(P / G_TILE));
  return gFbm(P - vec3(tile) * G_TILE, tile, up, pxFoot, lam0, oct, amp, ridge, g0, seed);
}
`,Qi=`
${Zi}
uniform highp sampler2DArray u_tiles;    // R32F tiles: core + margin, one layer per slot
uniform highp sampler2DArray u_tileIdx;  // RG32F, T x T per face layer: (slot or -1, fade)
uniform highp sampler2DArray u_gCtl;     // RGBA8 linear, padded like u_height: roughness, rock, water, -
uniform int u_gOn;
uniform int u_gTiles;
uniform int u_tN, u_tM, u_tT;
uniform float u_tDelta;
uniform float u_gTexel;
uniform uint u_gSeed;
uniform float u_gAmp, u_gAmpScale, u_gLam0;
uniform int u_gOct;
uniform ivec3 u_gTile;   // noise origin: the eye's 65 536 m lattice tile
uniform vec3 u_gOff;     // eye − tile·G_TILE (m)

const int G_B = ${G.BLEND};

vec3 gChartGrad(int g, vec2 ang, vec2 gab) {
  vec2 t = tan(ang);
  float L2 = 1.0 + t.x * t.x + t.y * t.y;
  float L = sqrt(L2);
  float sa = (1.0 + t.x * t.x) / L, sb = (1.0 + t.y * t.y) / L;
  vec3 ta = u_radius * sa * vec3(1.0 - t.x * t.x / L2, -t.x * t.y / L2, -t.x / L2);
  vec3 tb = u_radius * sb * vec3(-t.x * t.y / L2, 1.0 - t.y * t.y / L2, -t.y / L2);
  float aa = dot(ta, ta), bb = dot(tb, tb), ab = dot(ta, tb);
  float det = aa * bb - ab * ab;
  vec3 lg = ((gab.x * bb - gab.y * ab) * ta + (gab.y * aa - gab.x * ab) * tb) / det;
  return lg.x * u_faceE[g] + lg.y * u_faceS[g] + lg.z * u_faceC[g];
}

int gFaceOfAxis(vec3 v) { return v.x > 0.5 ? 0 : v.y > 0.5 ? 1 : v.x < -0.5 ? 2 : v.y < -0.5 ? 3 : v.z > 0.5 ? 4 : 5; }
vec2 gChartAngles(int g, vec3 d) { float c = dot(d, u_faceC[g]); return vec2(atan(dot(d, u_faceE[g]), c), atan(dot(d, u_faceS[g]), c)); }
float gW1(float x) { float B = float(G_B), N = float(u_tN); return smoothstep(0.0, 1.0, (x + B) / (2.0 * B)) * smoothstep(0.0, 1.0, (N + B - x) / (2.0 * B)); }

float gDetailWeight(float pxFoot) { return u_gOn == 0 ? 0.0 : 1.0 - smoothstep(u_gTexel, 2.0 * u_gTexel, pxFoot); }

float gMacroFetch(ivec2 t, int f) { return texelFetch(u_height, ivec3(t, f), 0).r; }

// Bilinear raw macro (= heightAt(f, ang).x) and its tangent gradient.
vec4 gMacroBil(int f, vec2 ang) {
  float delta = 1.5707963267948966 / float(u_hn);
  int m = u_hn + 2 * PAD;
  vec2 p = clamp((ang + QUARTER) / delta - 0.5 + float(PAD), vec2(0.0), vec2(float(m) - 1.001));
  ivec2 i = ivec2(floor(p));
  vec2 fr = p - vec2(i);
  float a = gMacroFetch(i, f), b = gMacroFetch(i + ivec2(1, 0), f), c = gMacroFetch(i + ivec2(0, 1), f), d = gMacroFetch(i + ivec2(1, 1), f);
  float ab = mix(a, b, fr.x), cd = mix(c, d, fr.x);
  vec2 g = vec2(mix(b - a, d - c, fr.y), mix(c - a, d - b, fr.x));
  return vec4(mix(ab, cd, fr.y), gChartGrad(f, ang, g / delta));
}

vec4 gCr(float t) { return vec4(((-0.5 * t + 1.0) * t - 0.5) * t, (1.5 * t - 2.5) * t * t + 1.0, ((-1.5 * t + 2.0) * t + 0.5) * t, (0.5 * t - 0.5) * t * t); }
vec4 gCrd(float t) { return vec4((-1.5 * t + 2.0) * t - 0.5, (4.5 * t - 5.0) * t, (-4.5 * t + 4.0) * t + 0.5, (1.5 * t - 1.0) * t); }

// Continuous clamp envelope for a Catmull-Rom over the 4×4 block h (row-major): the 2×2-texel cell
// extremes of the 3×3 cells around the point, interpolated on the dual grid of cell centres. At a cell
// centre this is the flat maps' four-texel clamp; unlike that clamp it never jumps at texel edges.
vec2 gEnvelope(float h[16], vec2 fr) {
  float mn[9], mx[9];
  for (int cy = 0; cy < 3; cy++) {
    for (int cx = 0; cx < 3; cx++) {
      int k = cy * 4 + cx;
      mn[cy * 3 + cx] = min(min(h[k], h[k + 1]), min(h[k + 4], h[k + 5]));
      mx[cy * 3 + cx] = max(max(h[k], h[k + 1]), max(h[k + 4], h[k + 5]));
    }
  }
  int sx = fr.x < 0.5 ? 0 : 1, sy = fr.y < 0.5 ? 0 : 1;
  vec2 t = vec2(fr.x < 0.5 ? fr.x + 0.5 : fr.x - 0.5, fr.y < 0.5 ? fr.y + 0.5 : fr.y - 0.5);
  int k = sy * 3 + sx;
  float lo = mix(mix(mn[k], mn[k + 1], t.x), mix(mn[k + 3], mn[k + 4], t.x), t.y);
  float hi = mix(mix(mx[k], mx[k + 1], t.x), mix(mx[k + 3], mx[k + 4], t.x), t.y);
  return vec2(lo, hi);
}

// Catmull-Rom of the macro (the base where no tile is resident), envelope-clamped; the tiles start from
// this cubic too (unclamped there: the water bounds do that job).
vec4 gMacroCubic(int f, vec2 ang) {
  float delta = 1.5707963267948966 / float(u_hn);
  int m = u_hn + 2 * PAD;
  vec2 p = clamp((ang + QUARTER) / delta - 0.5 + float(PAD), vec2(1.0), vec2(float(m) - 2.001));
  ivec2 i = ivec2(floor(p));
  vec2 fr = p - vec2(i);
  vec4 wx = gCr(fr.x), wy = gCr(fr.y), dx = gCrd(fr.x), dy = gCrd(fr.y);
  float v = 0.0, gx = 0.0, gy = 0.0;
  float hb[16];
  for (int y = 0; y < 4; y++) {
    float rv = 0.0, rd = 0.0;
    for (int x = 0; x < 4; x++) {
      float h = gMacroFetch(i + ivec2(x - 1, y - 1), f);
      hb[y * 4 + x] = h;
      rv += wx[x] * h;
      rd += dx[x] * h;
    }
    v += wy[y] * rv;
    gx += wy[y] * rd;
    gy += dy[y] * rv;
  }
  vec2 env = gEnvelope(hb, fr);
  return vec4(clamp(v, env.x, env.y), gChartGrad(f, ang, vec2(gx, gy) / delta));
}

float gTileFetch(ivec2 t, int slot) { int W = u_tN + 2 * u_tM; return texelFetch(u_tiles, ivec3(clamp(t, ivec2(0), ivec2(W - 1)), slot), 0).r; }

// Tile height and texel gradient at stored coordinates q (texel centres at integers): bilinear, and the
// envelope-clamped Catmull-Rom blended in by tb (continuous at texel edges, no overshoot over channels).
vec3 gTileSample(int slot, vec2 q, float tb) {
  ivec2 i = ivec2(floor(q));
  vec2 fr = q - vec2(i);
  float a = gTileFetch(i, slot), b = gTileFetch(i + ivec2(1, 0), slot), c = gTileFetch(i + ivec2(0, 1), slot), d = gTileFetch(i + ivec2(1, 1), slot);
  vec3 r = vec3(mix(mix(a, b, fr.x), mix(c, d, fr.x), fr.y), mix(b - a, d - c, fr.y), mix(c - a, d - b, fr.x));
  if (tb > 0.0) {
    vec4 wx = gCr(fr.x), wy = gCr(fr.y), dx = gCrd(fr.x), dy = gCrd(fr.y);
    float v = 0.0, gx = 0.0, gy = 0.0;
    float hb[16];
    for (int y = 0; y < 4; y++) {
      float rv = 0.0, rd = 0.0;
      for (int x = 0; x < 4; x++) {
        float h = gTileFetch(i + ivec2(x - 1, y - 1), slot);
        hb[y * 4 + x] = h;
        rv += wx[x] * h;
        rd += dx[x] * h;
      }
      v += wy[y] * rv;
      gx += wy[y] * rd;
      gy += dy[y] * rv;
    }
    vec2 env = gEnvelope(hb, fr);
    r = mix(r, vec3(clamp(v, env.x, env.y), gx, gy), tb);
  }
  return r;
}

// Resident tiles blended by partition-of-unity weights (each in its own face chart); the Catmull-Rom macro takes the share of missing or fading tiles.
vec4 gTileBase(int f, vec2 ang, vec3 dir, float pxFoot) {
  vec4 fb = gMacroCubic(f, ang);
  if (u_gTiles == 0) return fb;
  int N = u_tN, T = u_tT, F = u_tN * u_tT;
  float B = float(G_B);
  float tb = 1.0 - smoothstep(0.25 * u_gTexel, 0.5 * u_gTexel, pxFoot);
  float wsum = 0.0, wres = 0.0;
  vec4 acc = vec4(0.0);
  vec2 pf = (ang + QUARTER) / u_tDelta;
  for (int side = -1; side < 4; side++) {
    int g = f;
    vec2 ga = ang;
    if (side >= 0) {
      bool nearEdge = side == 0 ? pf.x < B : side == 1 ? pf.x > float(F) - B : side == 2 ? pf.y < B : pf.y > float(F) - B;
      if (!nearEdge) continue;
      float sg = (side == 0 || side == 2) ? -1.0 : 1.0;
      g = gFaceOfAxis(sg * (side < 2 ? u_faceE[f] : u_faceS[f]));
      ga = gChartAngles(g, dir);
    }
    vec2 p = (ga + QUARTER) / u_tDelta;
    ivec2 i0 = max(ivec2(0), ivec2(floor((p - B) / float(N))));
    ivec2 i1 = min(ivec2(T - 1), ivec2(floor((p + B) / float(N))));
    for (int iy = i0.y; iy <= i1.y; iy++) {
      for (int ix = i0.x; ix <= i1.x; ix++) {
        vec2 uv = p - vec2(float(ix * N), float(iy * N));
        float w = gW1(uv.x) * gW1(uv.y);
        if (w <= 0.0) continue;
        wsum += w;
        vec2 sf = texelFetch(u_tileIdx, ivec3(ix, iy, g), 0).rg;
        if (sf.x < 0.0 || sf.y <= 0.0) continue;
        vec3 s = gTileSample(int(sf.x + 0.5), uv + float(u_tM) - 0.5, tb);
        float wf = w * sf.y;
        wres += wf;
        acc += wf * vec4(s.x, gChartGrad(g, ga, s.yz / u_tDelta));
      }
    }
  }
  if (wres <= 0.0 || wsum <= 0.0) return fb;
  return (acc + (wsum - wres) * fb) / wsum;
}

vec4 globeSample(int f, vec2 ang, vec3 rel, float pxFoot) {
  vec4 m = gMacroBil(f, ang);
  float t = gDetailWeight(pxFoot);
  if (t <= 0.0) return m;
  vec3 dir = faceDirOf(f, ang);
  vec4 b = gTileBase(f, ang, dir, pxFoot);
  if (t < 1.0) b = mix(m, b, t);
  if (pxFoot >= 0.5 * u_gLam0) return b;
  float delta = 1.5707963267948966 / float(u_hn);
  float mm = float(u_hn + 2 * PAD);
  vec4 ctl = textureLod(u_gCtl, vec3(((ang + QUARTER) / delta + float(PAD)) / mm, float(f)), 0.0);
  float amp = u_gAmp * (G_AMP_BASE + G_AMP_ROUGH * ctl.r) * u_gAmpScale * (1.0 - ctl.b);
  float wl = gWaterLevel(f, ang);
  float room = wl > -9000.0 ? abs(b.x - wl) - G_SHORE_MARGIN : 1e9;
  float s = amp > 0.0 ? clamp(room / amp, 0.0, 1.0) : 0.0;
  b += gFbm(u_gOff + rel, u_gTile, dir, pxFoot, u_gLam0, u_gOct, amp * s, ctl.g, b.yzw, u_gSeed);
  return b;
}

float globeSurface(int f, vec2 ang, vec3 rel, float pxFoot) {
  float t = gDetailWeight(pxFoot);
  float s0 = t < 1.0 ? heightAt(f, ang).y : 0.0;
  if (t <= 0.0) return s0;
  float h = globeSample(f, ang, rel, pxFoot).x;
  float wl = gWaterLevel(f, ang);
  return mix(s0, wl > -9000.0 ? max(h, wl) : max(h, 0.0), t);
}
`,$i=[`u_tiles`,`u_tileIdx`,`u_gCtl`,`u_gOn`,`u_gTiles`,`u_tN`,`u_tM`,`u_tT`,`u_tDelta`,`u_gTexel`,`u_gSeed`,`u_gAmp`,`u_gAmpScale`,`u_gLam0`,`u_gOct`,`u_gTile`,`u_gOff`],ea=class{src=null;enabled=!0;amp=1;locs=new WeakMap;dummyF=null;dummyRG=null;dummyC=null;get active(){let e=this.src;return this.enabled&&e!==null&&e.params!==null&&e.controlTex!==null}bind(e,t,n,r){let i=this.locs.get(t);if(!i){i={};for(let n of $i)i[n]=e.getUniformLocation(t,n);this.locs.set(t,i)}let a=this.active?this.src:null,o=a?.params??null,s=a?.lattice??null,c=a!==null&&s!==null&&a.residentCount>0&&a.tileTex!==null&&a.idxTex!==null,l=(t,r,i)=>{e.activeTexture(e.TEXTURE0+n+t),e.bindTexture(e.TEXTURE_2D_ARRAY,r),e.uniform1i(i,n+t)};l(0,c?a.tileTex:this.dummy(e,`f`),i.u_tiles),l(1,c?a.idxTex:this.dummy(e,`rg`),i.u_tileIdx),l(2,a?.controlTex??this.dummy(e,`c`),i.u_gCtl),e.uniform1i(i.u_gOn,+!!o),e.uniform1i(i.u_gTiles,+!!c),e.uniform1i(i.u_tN,s?s.N:1),e.uniform1i(i.u_tM,s?s.M:0),e.uniform1i(i.u_tT,s?s.T:1),e.uniform1f(i.u_tDelta,s?s.delta:1),e.uniform1f(i.u_gTexel,o?o.texelM:1),e.uniform1ui(i.u_gSeed,o?o.seed>>>0:0),e.uniform1f(i.u_gAmp,this.amp),e.uniform1f(i.u_gAmpScale,o?o.ampScale:1),e.uniform1f(i.u_gLam0,o?o.lam0:512),e.uniform1i(i.u_gOct,o?o.octaves:0);let[u,d]=ta(r);return e.uniform3i(i.u_gTile,u[0],u[1],u[2]),e.uniform3f(i.u_gOff,d[0],d[1],d[2]),e.activeTexture(e.TEXTURE0),n+3}dummy(e,t){let n=t===`f`?this.dummyF:t===`rg`?this.dummyRG:this.dummyC;if(n)return n;let r=e.createTexture();return e.bindTexture(e.TEXTURE_2D_ARRAY,r),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MAG_FILTER,e.NEAREST),t===`f`?e.texImage3D(e.TEXTURE_2D_ARRAY,0,e.R32F,1,1,1,0,e.RED,e.FLOAT,new Float32Array(1)):t===`rg`?e.texImage3D(e.TEXTURE_2D_ARRAY,0,e.RG32F,1,1,6,0,e.RG,e.FLOAT,new Float32Array(12).fill(-1)):e.texImage3D(e.TEXTURE_2D_ARRAY,0,e.RGBA8,1,1,6,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array(24)),t===`f`?this.dummyF=r:t===`rg`?this.dummyRG=r:this.dummyC=r,r}dispose(e){for(let t of[this.dummyF,this.dummyRG,this.dummyC])t&&e.deleteTexture(t);this.dummyF=this.dummyRG=this.dummyC=null}};function ta(e){let t=[Math.floor(e.x/H.TILE),Math.floor(e.y/H.TILE),Math.floor(e.z/H.TILE)];return[t,[e.x-t[0]*H.TILE,e.y-t[1]*H.TILE,e.z-t[2]*H.TILE]]}var na=e=>Number.isInteger(e)?`${e}.0`:`${e}`,ra=`
#define PAD 2
#define QUARTER 0.7853981633974483
uniform vec3 u_faceC[6];
uniform vec3 u_faceE[6];
uniform vec3 u_faceS[6];
uniform highp sampler2DArray u_height;   // R32F raw elevation (m), 6 padded layers
uniform highp sampler2DArray u_surf;     // R32F rendered surface (m): the water lid max(h, water level)
uniform int u_hn;                        // cells per face side

vec3 faceDirOf(int f, vec2 ang) {
  vec2 t = tan(ang);
  return normalize(u_faceC[f] + t.x * u_faceE[f] + t.y * u_faceS[f]);
}

// Hand-filtered bilinear over the padded layers: never leaves the face's texture layer.
// w.x = raw elevation, w.y = rendered surface (the sea at 0, lakes at their level).
vec2 heightAt(int f, vec2 ang) {
  float delta = 1.5707963267948966 / float(u_hn);
  int m = u_hn + 2 * PAD;
  vec2 p = clamp((ang + QUARTER) / delta - 0.5 + float(PAD), vec2(0.0), vec2(float(m) - 1.001));
  ivec2 i = ivec2(floor(p));
  vec2 fr = p - vec2(i);
  float a = texelFetch(u_height, ivec3(i, f), 0).r;
  float b = texelFetch(u_height, ivec3(i + ivec2(1, 0), f), 0).r;
  float c = texelFetch(u_height, ivec3(i + ivec2(0, 1), f), 0).r;
  float d = texelFetch(u_height, ivec3(i + ivec2(1, 1), f), 0).r;
  float raw = mix(mix(a, b, fr.x), mix(c, d, fr.x), fr.y);
  float sa = texelFetch(u_surf, ivec3(i, f), 0).r;
  float sb = texelFetch(u_surf, ivec3(i + ivec2(1, 0), f), 0).r;
  float sc = texelFetch(u_surf, ivec3(i + ivec2(0, 1), f), 0).r;
  float sd = texelFetch(u_surf, ivec3(i + ivec2(1, 1), f), 0).r;
  float s = mix(mix(sa, sb, fr.x), mix(sc, sd, fr.x), fr.y);
  return vec2(raw, s);
}

uniform highp sampler2DArray u_wlevel;  // R32F padded water level (m, < −9000 dry), spread 2 rings past the shore
uniform highp sampler2DArray u_wclass;  // R32F padded water class (0 land, 1 ocean, 2 lake, 3 river, 4 wetland, 5 playa, 6 salt lake)
uniform int u_hasWater;
// Water level (bilinear, as the flat terrain's waterLevelAt) and class (nearest) on the height grid.
float waterLevelAt(int f, vec2 ang) {
  float delta = 1.5707963267948966 / float(u_hn);
  int m = u_hn + 2 * PAD;
  vec2 p = clamp((ang + QUARTER) / delta - 0.5 + float(PAD), vec2(0.0), vec2(float(m) - 1.001));
  ivec2 i = ivec2(floor(p));
  vec2 fr = p - vec2(i);
  float a = texelFetch(u_wlevel, ivec3(i, f), 0).r;
  float b = texelFetch(u_wlevel, ivec3(i + ivec2(1, 0), f), 0).r;
  float c = texelFetch(u_wlevel, ivec3(i + ivec2(0, 1), f), 0).r;
  float d = texelFetch(u_wlevel, ivec3(i + ivec2(1, 1), f), 0).r;
  return mix(mix(a, b, fr.x), mix(c, d, fr.x), fr.y);
}
float waterClassAt(int f, vec2 ang) {
  float delta = 1.5707963267948966 / float(u_hn);
  ivec2 t = ivec2(floor((ang + QUARTER) / delta)) + PAD;
  return texelFetch(u_wclass, ivec3(clamp(t, ivec2(0), ivec2(u_hn + 2 * PAD - 1)), f), 0).r;
}
// Water level the close-zoom detail respects (globeDetail.ts): the prepared levels without river cells
// (rivers are ribbons over carved channels; their levels would flood the detailed valley floors), or the
// sea at 0. Same addressing as waterLevelAt.
uniform highp sampler2DArray u_wlevelD;
uniform highp sampler2DArray u_wetD;   // R32F padded real-water mask (cells with their own level, not rivers)
float gWaterLevel(int f, vec2 ang) {
  if (u_hasWater == 0) return 0.0;
  float delta = 1.5707963267948966 / float(u_hn);
  int m = u_hn + 2 * PAD;
  vec2 p = clamp((ang + QUARTER) / delta - 0.5 + float(PAD), vec2(0.0), vec2(float(m) - 1.001));
  ivec2 i = ivec2(floor(p));
  vec2 fr = p - vec2(i);
  float a = texelFetch(u_wlevelD, ivec3(i, f), 0).r;
  float b = texelFetch(u_wlevelD, ivec3(i + ivec2(1, 0), f), 0).r;
  float c = texelFetch(u_wlevelD, ivec3(i + ivec2(0, 1), f), 0).r;
  float d = texelFetch(u_wlevelD, ivec3(i + ivec2(1, 1), f), 0).r;
  float wl = mix(mix(a, b, fr.x), mix(c, d, fr.x), fr.y);
  if (wl <= -9000.0) return wl;
  a = texelFetch(u_wetD, ivec3(i, f), 0).r;
  b = texelFetch(u_wetD, ivec3(i + ivec2(1, 0), f), 0).r;
  c = texelFetch(u_wetD, ivec3(i + ivec2(0, 1), f), 0).r;
  d = texelFetch(u_wetD, ivec3(i + ivec2(1, 1), f), 0).r;
  float wet = mix(mix(a, b, fr.x), mix(c, d, fr.x), fr.y);
  return wl - ${na(G.WET_DROP)} * (1.0 - clamp(wet / ${na(G.WET_FADE)}, 0.0, 1.0));   // = globeHeightFn.wetLevel
}`,ia=`#version 300 es
precision highp float;
precision highp int;
layout(location = 0) in vec2 a_grid;     // 0..GRID
layout(location = 1) in vec4 a_node;     // face, centre angles a and b, size (rad)
layout(location = 2) in vec3 a_centre;   // node centre at sea level, relative to the eye (m, from float64)
layout(location = 3) in vec3 a_lod;      // level, morph start, morph end (m)
uniform mat4 u_viewProj;
uniform float u_radius;
uniform float u_exag;
uniform float u_pxScale;   // 2·tan(fovY/2) / viewport height: metres per pixel per metre of distance
${ra}
${Qi}
${_r}
out vec2 v_ang;
flat out int v_face;
out vec3 v_rel;
out vec3 v_relSea;   // the sea-level point dir·R relative to the eye (noise argument, precise)
out vec3 v_air;     // aerial perspective: in-scattered light and transmittance, per vertex (smooth)
out vec3 v_trans;

// Offset of the direction at angles c0 + off from the node centre's direction, in a form without
// large cancellations: tan(a) − tan(a0) = sin(a − a0) / (cos a · cos a0), and
// F/|F| − F0/|F0| = dF/L − F0 (2 F0·dF + dF·dF) / (L L0 (L + L0)).
vec3 dirOffset(int f, vec2 c0, vec2 off, vec3 F0, float L0) {
  vec2 dXY = sin(off) / (cos(c0 + off) * cos(c0));
  vec3 dF = dXY.x * u_faceE[f] + dXY.y * u_faceS[f];
  float L = length(F0 + dF);
  float q = 2.0 * dot(F0, dF) + dot(dF, dF);
  return dF / L - F0 * (q / (L * L0 * (L + L0)));
}

void main() {
  int f = int(a_node.x + 0.5);
  vec2 c0 = a_node.yz;
  float S = a_node.w;
  vec2 t0 = tan(c0);
  vec3 F0 = u_faceC[f] + t0.x * u_faceE[f] + t0.y * u_faceS[f];
  float L0 = length(F0);
  vec3 dir0 = F0 / L0;
  // Unmorphed position for the morph distance.
  vec2 offA = (a_grid / 32.0 - 0.5) * S;
  vec3 ddA = dirOffset(f, c0, offA, F0, L0);
  float hA = heightAt(f, c0 + offA).y * u_exag;
  float d0 = length(a_centre + u_radius * ddA + hA * (dir0 + ddA));
  float k = clamp((d0 - a_lod.y) / (a_lod.z - a_lod.y), 0.0, 1.0);
  vec2 g = a_grid - fract(a_grid * 0.5) * 2.0 * k;
  vec2 off = (g / 32.0 - 0.5) * S;
  vec3 dd = dirOffset(f, c0, off, F0, L0);
  vec2 ang = c0 + off;
  vec3 relSea = a_centre + u_radius * dd;
  // Geometry can't hold wavelengths under ~2 vertex spacings: the footprint is at least the spacing and
  // grows with the morph, so detail octaves fade together with vertex snapping (as on flat maps).
  float foot = max(d0 * u_pxScale, S * u_radius / 32.0 * (1.0 + k));
  float h = (u_gOn == 1 ? globeSurface(f, ang, relSea, foot) : heightAt(f, ang).y) * u_exag;
  vec3 rel = relSea + h * (dir0 + dd);
  v_ang = ang;
  v_face = f;
  v_rel = rel;
  v_relSea = relSea;
  vec3 trans;
  v_air = atmosphereK(u_eyeP, normalize(rel), length(rel), 8, ${yr.toFixed(2)}, trans);
  v_trans = trans;
  gl_Position = u_viewProj * vec4(rel, 1.0);
}`,aa=`#version 300 es
precision highp float;
precision highp int;
precision highp sampler2DArray;
in vec2 v_ang;
flat in int v_face;
in vec3 v_rel;
in vec3 v_relSea;
in vec3 v_air;
in vec3 v_trans;
uniform float u_radius;
uniform float u_exag;
uniform float u_normalExag;
uniform sampler2DArray u_grad;     // RGBA16F + mips, unpadded: 3D surface gradient (planet axes)
uniform sampler2DArray u_climate;  // RGBA16F padded: mean T (°C), aridity (biome stage, else a proxy), summer rain share, half-range (°C)
uniform int u_cn;                  // climate cells per face side
uniform int u_hasClimate;
uniform sampler2DArray u_cover;    // RGBA8 padded (climate grid): snow/ice, bare rock, sand (beach, salt flat, erg), marsh/bog/mangrove
uniform int u_hasCover;            // 1 once the biome stage exists (else the climate proxy colours)
uniform sampler2DArray u_veg;      // RGBA8 padded (climate grid): canopy cover, the biome stage's own biome colour (gba)
uniform int u_hasVeg;
uniform sampler2D u_lut;
uniform int u_palette;             // 0 biome LUT colours, 1 hypsometric
uniform sampler2DArray u_layer;    // padded draped layer
uniform int u_ln;
uniform int u_layerMode;           // 0 realistic, 1 categorical, 2 scalar
uniform float u_layerMin, u_layerMax;
uniform vec3 u_sunCarto;           // cartographic sun in (screen right, screen up, local up) coordinates
uniform vec3 u_camRight, u_camUp;  // camera axes (planet axes)
uniform vec3 u_sunReal;            // unit vector toward the real sun
uniform float u_realK;             // 0 near the surface (cartographic light), 1 at globe zoom (real sun)
uniform vec3 u_lightCol, u_ambient;   // light colours at the target (from the sun model)
uniform int u_realistic;
uniform vec2 u_season;             // seasonal phase (cos, sin); (1, 0) at the warm peak
uniform float u_time;
${ra}
${Qi}
${Or}
${vr}
out vec4 o;

float hash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}
// 3D value noise: continuous across face seams (the cube faces' 2D coordinates are not).
float vnoise3(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash13(i), hash13(i + vec3(1, 0, 0)), u.x), mix(hash13(i + vec3(0, 1, 0)), hash13(i + vec3(1, 1, 0)), u.x), u.y),
    mix(mix(hash13(i + vec3(0, 0, 1)), hash13(i + vec3(1, 0, 1)), u.x), mix(hash13(i + vec3(0, 1, 1)), hash13(i + 1.0), u.x), u.y),
    u.z);
}
// Value-noise fBm (0–1, mean 0.5), up to 4 octaves.
float fbm3(vec3 p, int oct) {
  float s = 0.0, w = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) {
    if (i >= oct) break;
    s += a * vnoise3(p);
    w += a;
    p = p * 2.03 + 17.1;
    a *= 0.5;
  }
  return s / w;
}

// Sea ice from the water's temperature now: a concentration that ramps over several degrees, its
// threshold moved by domain-warped 3D noise (continuous across faces) so the edge is ragged instead
// of a climate contour, then split into floes and polynyas, which fade to the concentration once they
// are under a few pixels. Thin ice at the margin is grey, the pack is blue-white.
void seaIce(vec3 P, float t, float pxFoot, out float ice, out vec3 iceCol) {
  vec3 q = P / 1000.0;
  vec3 w = vec3(vnoise3(q / 240.0), vnoise3(q / 240.0 + 5.2), vnoise3(q / 240.0 + 9.7)) - 0.5;
  vec3 qw = q + w * 180.0;
  float conc = smoothstep(-2.5, -11.0, t + 9.0 * (fbm3(qw / 170.0, 4) - 0.5));
  float floeK = 1.0 - smoothstep(2500.0, 9000.0, pxFoot);
  // Called inside the water branch, so the edge width comes from the pixel footprint, not fwidth.
  float x = conc + 1.8 * (fbm3(qw / 16.0 + 3.0, 3) - 0.5);
  float aa = 0.03 + 1.2 * pxFoot / 16000.0;
  float floes = smoothstep(0.5 - aa, 0.5 + aa, x) * smoothstep(0.02, 0.2, conc);
  ice = mix(conc, floes, floeK) * 0.97;
  iceCol = mix(vec3(0.52, 0.60, 0.66), vec3(0.84, 0.89, 0.93), smoothstep(0.15, 0.85, conc));
  // Thicker and thinner ice in patches (the pack is not one sheet).
  iceCol *= 0.86 + 0.2 * fbm3(qw / 22.0 + 31.0, 3);
}

// Cubic B-spline of the raw elevation over 4×4 padded texels (PAD = 2 covers it at face edges):
// rounds the 2 km cells' stair-step coastlines when they are many pixels wide.
float heightSmooth(int f, vec2 ang) {
  float delta = 1.5707963267948966 / float(u_hn);
  int m = u_hn + 2 * PAD;
  vec2 p = clamp((ang + QUARTER) / delta - 0.5 + float(PAD), vec2(1.0), vec2(float(m) - 2.001));
  ivec2 i = ivec2(floor(p));
  vec2 t = p - vec2(i);
  vec2 s = 1.0 - t;
  vec2 w0 = s * s * s / 6.0;
  vec2 w1 = (4.0 - 6.0 * t * t + 3.0 * t * t * t) / 6.0;
  vec2 w2 = (4.0 - 6.0 * s * s + 3.0 * s * s * s) / 6.0;
  vec2 w3 = t * t * t / 6.0;
  float acc = 0.0;
  for (int y = 0; y < 4; y++) {
    float wy = y == 0 ? w0.y : y == 1 ? w1.y : y == 2 ? w2.y : w3.y;
    float row = 0.0;
    for (int x = 0; x < 4; x++) {
      float wx = x == 0 ? w0.x : x == 1 ? w1.x : x == 2 ? w2.x : w3.x;
      row += wx * texelFetch(u_height, ivec3(i + ivec2(x - 1, y - 1), f), 0).r;
    }
    acc += wy * row;
  }
  return acc;
}

vec4 climateAt(int f, vec2 ang) {
  float delta = 1.5707963267948966 / float(u_cn);
  float m = float(u_cn + 2 * PAD);
  vec2 p = ((ang + QUARTER) / delta + float(PAD)) / m;
  return texture(u_climate, vec3(p, float(f)));
}
vec4 coverAt(int f, vec2 ang) {
  float delta = 1.5707963267948966 / float(u_cn);
  float m = float(u_cn + 2 * PAD);
  vec2 p = ((ang + QUARTER) / delta + float(PAD)) / m;
  return texture(u_cover, vec3(p, float(f)));
}
vec4 vegAt(int f, vec2 ang) {
  float delta = 1.5707963267948966 / float(u_cn);
  float m = float(u_cn + 2 * PAD);
  vec2 p = ((ang + QUARTER) / delta + float(PAD)) / m;
  return texture(u_veg, vec3(p, float(f)));
}
float layerFetch(ivec2 t, int f) { return texelFetch(u_layer, ivec3(clamp(t, ivec2(0), ivec2(u_ln + 2 * PAD - 1)), f), 0).r; }
float layerAt(int f, vec2 ang, bool nearest) {
  float delta = 1.5707963267948966 / float(u_ln);
  vec2 p = (ang + QUARTER) / delta + float(PAD);
  if (nearest) return layerFetch(ivec2(floor(p)), f);
  p -= 0.5;
  ivec2 i = ivec2(floor(p));
  vec2 fr = p - vec2(i);
  return mix(mix(layerFetch(i, f), layerFetch(i + ivec2(1, 0), f), fr.x), mix(layerFetch(i + ivec2(0, 1), f), layerFetch(i + ivec2(1, 1), f), fr.x), fr.y);
}

// Sun model colours for a local sun elevation (sine mu), as lighting/sun.ts at that elevation.
void dayLight(float mu, out vec3 light, out vec3 amb) {
  float day = smoothstep(-0.05, 0.08, mu);
  float warm = 1.0 - smoothstep(0.05, 0.45, mu);
  float night = 1.0 - smoothstep(-0.12, 0.0, mu);
  light = mix(vec3(1.0), vec3(1.0, 0.62, 0.36), warm) * day * (1.0 - 0.3 * warm) + vec3(0.55, 0.68, 1.0) * 0.22 * night * 0.5;
  float fill = 1.0 + 0.5 * warm * day;
  amb = mix(vec3(0.10, 0.13, 0.24) * 0.6, mix(vec3(fill), vec3(1.08, 0.92, 0.86) * fill, warm * day), smoothstep(-0.14, 0.25, mu));
}

void main() {
  int f = v_face;
  vec2 ang = v_ang;
  vec3 up = faceDirOf(f, ang);
  vec2 hs = heightAt(f, ang);
  float delta = 1.5707963267948966 / float(u_hn);
  float texelsPerPx = length(fwidth(ang)) / delta;
  // Close up, smooth the cell structure of the coast (bilinear far out, where cells are a few px).
  float smoothK = 1.0 - smoothstep(0.08, 0.25, texelsPerPx);
  float pxFoot = length(fwidth(v_rel));
  // Close-zoom detail (streamed tiles + 3D octaves) replaces the B-spline rounding when it exists.
  float tD = gDetailWeight(pxFoot);
  vec4 ds = tD > 0.0 ? globeSample(f, ang, v_relSea, pxFoot) : vec4(hs.x, 0.0, 0.0, 0.0);
  float h = u_gOn == 1 ? ds.x : smoothK > 0.0 ? mix(hs.x, heightSmooth(f, ang), smoothK) : hs.x;
  // Water: the sea, plus lakes from the hydrology stage's levels (as the flat terrain's water lid).
  // With detail the level fades to the riverless one the detailed surface was built against.
  float wl = u_hasWater == 1 ? mix(waterLevelAt(f, ang), gWaterLevel(f, ang), tD) : -10000.0;
  float cls = u_hasWater == 1 ? waterClassAt(f, ang) : 0.0;
  // Lakes by class, or by a level above the sea where the spread rings meet other classes.
  bool lake = cls > 1.5 && cls < 2.5 || cls > 5.5 || wl > 0.05;
  // Every class but river cells (drawn as ribbons): coastal wetland or beach cells reached by the
  // spread sea level keep a smooth shoreline instead of the nearest class's cell outline.
  bool water = u_hasWater == 1 ? wl > h && !(cls > 2.5 && cls < 3.5) : h < 0.0;
  // Mipmapped gradient: smooth normals, no aliasing when cells are smaller than a pixel.
  vec3 grad = textureLod(u_grad, vec3((ang + QUARTER) / 1.5707963267948966, float(f)), max(0.0, log2(max(texelsPerPx, 1e-6)) - 0.5)).xyz;
  grad -= dot(grad, up) * up;
  if (tD > 0.0) grad = mix(grad, ds.yzw, tD);
  vec3 n = normalize(up - grad * u_normalExag);

  // Light: the screen-relative cartographic sun in every pixel's own tangent frame, blended to the real sun.
  vec3 rt = normalize(u_camRight - dot(u_camRight, up) * up);
  vec3 ut = normalize(u_camUp - dot(u_camUp, up) * up);
  vec3 Lc = normalize(u_sunCarto.x * rt + u_sunCarto.y * ut + u_sunCarto.z * up);
  vec3 L = normalize(mix(Lc, u_sunReal, u_realK));
  vec3 lightCol = u_lightCol, amb = u_ambient;
  if (u_realK > 0.0) {
    vec3 lr, ar;
    dayLight(dot(up, u_sunReal), lr, ar);
    lightCol = mix(lightCol, lr, u_realK);
    amb = mix(amb, ar, u_realK);
  }

  vec3 V = normalize(-v_rel);
  vec3 P = up * (u_radius + hs.y * u_exag);
  vec4 cl = u_hasClimate == 1 ? climateAt(f, ang) : vec4(15.0, 1.0, 0.5, 10.0);
  float tNow = cl.r + cl.a * u_season.x;
  vec3 col;
  if (water && u_layerMode == 0) {
    float depth = lake ? max(0.0, wl - h) : -h;
    vec3 shallow = lake ? vec3(0.22, 0.48, 0.52) : vec3(0.24, 0.56, 0.62);
    vec3 deep = lake ? vec3(0.05, 0.16, 0.24) : vec3(0.03, 0.10, 0.22);
    col = mix(shallow, deep, pow(clamp(depth / (lake ? 400.0 : 4000.0), 0.0, 1.0), 0.35));
    col = mix(col, vec3(0.42, 0.68, 0.70), (1.0 - smoothstep(0.0, lake ? 15.0 : 60.0, depth)) * 0.6);
    // Sea and lake ice where the water is cold now (lakes freeze sooner).
    float ice = 0.0;
    vec3 iceCol = vec3(0.0);
    if (u_hasClimate == 1 && u_realistic == 1) {
      seaIce(P, lake ? tNow + 4.5 : tNow, pxFoot, ice, iceCol);
    }
    float fres = 0.02 + 0.98 * pow(1.0 - max(dot(up, V), 0.0), 5.0);
    col = mix(col, vec3(0.55, 0.65, 0.78) * amb, fres * 0.5);
    float spec = pow(max(dot(reflect(-L, up), V), 0.0), 90.0);
    col = mix(col, iceCol * (0.75 + 0.3 * max(dot(n, L), 0.0)), ice);
    col *= 0.35 * amb + 0.65 * lightCol;
    col += spec * 0.45 * lightCol * (1.0 - ice);
  } else {
    if (u_layerMode == 1) col = categorical(floor(layerAt(f, ang, true) + 0.5));
    else if (u_layerMode == 2) col = viridis((layerAt(f, ang, false) - u_layerMin) / max(1e-6, u_layerMax - u_layerMin));
    else if (u_hasClimate == 1 && u_palette == 0) {
      // Biome-table colours over temperature and aridity (the biome stage's P/PET once it exists, else
      // a proxy from precipitation), varied by 3D noise; the biome stage's cover (sand, marsh, rock,
      // perennial snow) as on flat maps, else rock on steep slopes and snow from temperature.
      float fine = 1.0 - smoothstep(600.0, 2500.0, pxFoot);
      float t = cl.r + 3.0 * (vnoise3(P / 35000.0) - 0.5);
      float ai = max(0.02, cl.g) * exp(0.4 * (vnoise3(P / 28000.0 + 11.0) - 0.5));
      vec2 luv = clamp(vec2((t + 20.0) / 50.0, log(ai * 10.0) / log(10.0) / 2.0), 0.5 / 64.0, 1.0 - 0.5 / 64.0);
      float drySummer = smoothstep(0.45, 0.30, cl.b);
      col = mix(texture(u_lut, vec2(luv.x, 0.5 * luv.y)).rgb, texture(u_lut, vec2(luv.x, 0.5 + 0.5 * luv.y)).rgb, drySummer);
      if (u_hasVeg == 1) {
        // Half the biome stage's own colour: the zonal table alone blurs savanna and dry forest (or
        // steppe and woodland) into one tan, so forests the stage found (and named) read as open land.
        vec4 vg = vegAt(f, ang);
        col = mix(col, vg.gba, 0.5) * (1.0 - 0.1 * vg.r);   // dense canopy reads darker (as flat maps)
      }
      col *= 0.88 + 0.24 * vnoise3(P / 90000.0 + 3.0);
      col *= mix(1.0, 0.9 + 0.2 * vnoise3(P / 3500.0), fine);
      float slope = length(grad);
      vec3 rockCol = vec3(0.44, 0.42, 0.40) * (0.85 + 0.3 * vnoise3(P / 6000.0));
      float snowBreak = 0.35 * (vnoise3(P / 7000.0) - 0.5) - 0.3 * smoothstep(0.6, 1.2, slope);
      if (u_hasCover == 1) {
        vec4 cv = coverAt(f, ang);
        col = mix(col, vec3(0.86, 0.80, 0.66), smoothstep(0.15, 0.7, cv.b) * 0.9);   // beach / dunes / salt / erg
        col = mix(col, vec3(0.24, 0.32, 0.22), smoothstep(0.15, 0.8, cv.a) * 0.5);   // marsh / bog / mangrove
        col = mix(col, rockCol, max(smoothstep(0.2, 0.75, cv.g), smoothstep(0.35, 0.75, slope)) * 0.85);
        float snow = smoothstep(0.35, 0.95, 0.85 * cv.r + snowBreak);
        // Seasonal snow where it is below freezing now but not at the warm peak (as on flat maps).
        float sSnow = u_realistic == 1 ? max(0.0, smoothstep(1.5, -3.0, tNow) - smoothstep(1.5, -3.0, cl.r + cl.a)) * smoothstep(0.08, 0.3, ai) : 0.0;
        snow = max(snow, smoothstep(0.15, 0.7, sSnow + 0.6 * snowBreak));
        col = mix(col, vec3(0.90, 0.92, 0.96), snow * 0.85);
      } else {
        col = mix(col, rockCol, smoothstep(0.35, 0.75, slope) * 0.85);
        float snowT = u_realistic == 1 ? min(tNow, cl.r + 2.0) : cl.r;
        float snow = smoothstep(0.35, 0.95, smoothstep(-1.0, -7.0, snowT + 4.0 * snowBreak) + snowBreak);
        col = mix(col, vec3(0.90, 0.92, 0.96), snow * 0.85 * smoothstep(0.05, 0.25, ai));
      }
    } else col = hypsometric(h);
    float lambert = max(dot(n, L), 0.0);
    float sky = 0.5 + 0.5 * dot(n, up);
    bool biomeLit = u_layerMode == 0 && u_hasClimate == 1 && u_palette == 0;
    col *= biomeLit ? 0.30 * sky * amb + 1.25 * lambert * lightCol : 0.28 * sky * amb + 0.95 * lambert * lightCol;
  }
  // Aerial perspective through the same atmosphere as the sky and the limb (integrated per vertex).
  col = col * v_trans + v_air;
  col = terrainTone(col);
  o = vec4(pow(col, vec3(1.0 / 1.1)), 1.0);
}`,oa={elevation:0,categorical:1,scalar:2},sa=class{gl;prog;u;vao;instBuf;indexCount;heightTex;gradTex;climateTex;coverTex;vegTex;veg=null;vegPalette=null;surfTex;wlevelTex;wlevelDTex;wetDTex;wclassTex;hasCover=0;hasWater=0;layerTex;lutTex;palette=`satellite`;lutPalette=null;hn=1;radius=1;cn=1;hasClimate=0;ln=1;layerMode=0;layerMin=0;layerMax=1;constructor(e){this.gl=e,this.prog=en(e,`globe`,ia,aa),this.u=nn(e,this.prog,`u_viewProj.u_radius.u_exag.u_normalExag.u_faceC.u_faceE.u_faceS.u_height.u_hn.u_grad.u_climate.u_cn.u_hasClimate.u_lut.u_palette.u_layer.u_ln.u_layerMode.u_layerMin.u_layerMax.u_sunCarto.u_camRight.u_camUp.u_sunReal.u_realK.u_lightCol.u_ambient.u_realistic.u_season.u_time.u_surf.u_cover.u_hasCover.u_wlevel.u_wclass.u_hasWater.u_pxScale.u_wlevelD.u_wetD.u_veg.u_hasVeg`.split(`.`));let t=new Float32Array(2178);for(let e=0,n=0;e<=32;e++)for(let r=0;r<=32;r++)t[n++]=r,t[n++]=e;let n=new Uint16Array(6144);for(let e=0,t=0;e<32;e++)for(let r=0;r<32;r++){let i=e*33+r,a=i+1,o=i+32+1,s=o+1;n.set([i,o,a,a,o,s],t),t+=6}this.indexCount=n.length,this.vao=e.createVertexArray(),e.bindVertexArray(this.vao);let r=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),this.instBuf=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.instBuf),e.bufferData(e.ARRAY_BUFFER,Lr*10*4,e.DYNAMIC_DRAW);let i=(t,n,r)=>{e.enableVertexAttribArray(t),e.vertexAttribPointer(t,n,e.FLOAT,!1,40,r),e.vertexAttribDivisor(t,1)};i(1,4,0),i(2,3,16),i(3,3,28);let a=e.createBuffer();e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,a),e.bufferData(e.ELEMENT_ARRAY_BUFFER,n,e.STATIC_DRAW),e.bindVertexArray(null),this.heightTex=Kn(e,`r32f`),this.gradTex=Kn(e,`rgba16f`),this.climateTex=Kn(e,`rgba16f`),this.coverTex=Kn(e,`rgba8`),this.vegTex=Kn(e,`rgba8`),this.surfTex=Kn(e,`r32f`),this.wlevelTex=Kn(e,`r32f`),this.wlevelDTex=Kn(e,`r32f`),this.wetDTex=Kn(e,`r32f`),this.wclassTex=Kn(e,`r32f`),this.layerTex=Kn(e,`r32f`),this.lutTex=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.lutTex),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array(4))}setTerrain(e,t,n=null,r=null,i=null){let a=this.gl,o=e.w,s=t.radius;this.hn=o,this.radius=s,Gn(a,this.heightTex,Hn(e.data,o),o+4,`r32f`),Gn(a,this.surfTex,t.padded,o+4,`r32f`),this.hasWater=+!!n,n&&(Gn(a,this.wlevelTex,Hn(n.level,o),o+4,`r32f`),Gn(a,this.wlevelDTex,Hn(r??n.level,o),o+4,`r32f`),Gn(a,this.wetDTex,i??Hn(new Float32Array(6*o*o).fill(1),o),o+4,`r32f`),Gn(a,this.wclassTex,Hn(n.cls,o),o+4,`r32f`));let c=ca(e.data,o,s);a.bindTexture(a.TEXTURE_2D_ARRAY,this.gradTex),a.pixelStorei(a.UNPACK_ALIGNMENT,1);let l=o;for(let e=0;l>=1&&(a.texImage3D(a.TEXTURE_2D_ARRAY,e,a.RGBA16F,l,l,6,0,a.RGBA,a.FLOAT,c),l!==1);e++)c=fa(c,l),l>>=1;a.texParameteri(a.TEXTURE_2D_ARRAY,a.TEXTURE_MIN_FILTER,a.LINEAR_MIPMAP_LINEAR),a.texParameteri(a.TEXTURE_2D_ARRAY,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D_ARRAY,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D_ARRAY,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE)}setSurface(e){if(this.hasClimate=+!!e,!e)return;let t=e.temperature.w,n=6*t*t,r=e=>e&&e.w===t&&e.faces===6?e:null,i=r(e.precip),a=r(e.summerRain),o=r(e.tempRange),s=r(e.aridity??null),c=new Float32Array(n*4);for(let t=0;t<n;t++){let n=e.temperature.data[t],r=58.93*Math.min(30,Math.max(0,n));c[t*4]=n,c[t*4+1]=s?s.data[t]:i?Math.min(10,i.data[t]/Math.max(150,r)):1,c[t*4+2]=a?a.data[t]:.5,c[t*4+3]=o?o.data[t]:10}this.cn=t,Gn(this.gl,this.climateTex,Hn(c,t,2,4),t+4,`rgba16f`,!0);let l=r(e.biome??null),u=r(e.snow??null);if(this.hasCover=l&&u&&s?1:0,l&&u&&s){let n=ua(l.data,u.data,r(e.erg??null)?.data??null,t);Gn(this.gl,this.coverTex,n,t+4,`rgba8`,!0)}this.veg=l&&s?{biome:l.data,canopy:r(e.canopy??null)?.data??null,clim:c,n:t}:null,this.vegPalette=null}setDrape(e){!e||e.kind===`elevation`||e.faces!==6?this.layerMode=0:(this.ln=e.w,Gn(this.gl,this.layerTex,Hn(e.data,e.w),e.w+4,`r32f`),this.layerMode=oa[e.kind],this.layerMin=e.min,this.layerMax=e.max)}get layerModeRealistic(){return this.layerMode===0}get realistic(){return this.layerMode===0&&this.hasClimate===1&&this.palette!==`hypsometric`}ensureVeg(){let e=this.palette===`stylised`?`stylised`:`satellite`;if(!this.veg||this.vegPalette===e)return;this.vegPalette=e;let t=this.veg;Gn(this.gl,this.vegTex,ma(t.biome,t.canopy,t.clim,t.n,e),t.n+4,`rgba8`,!0)}ensureLut(){let e=this.palette===`stylised`?`stylised`:`satellite`;if(this.lutPalette===e)return;this.lutPalette=e;let t=new Uint8Array(32768);t.set(Ar(e,!1),0),t.set(Ar(e,!0),16384);let n=this.gl;n.bindTexture(n.TEXTURE_2D,this.lutTex),n.texImage2D(n.TEXTURE_2D,0,n.RGBA8,64,128,0,n.RGBA,n.UNSIGNED_BYTE,t)}draw(e){let t=this.gl,n=this.u;t.useProgram(this.prog),this.ensureLut(),this.ensureVeg(),t.bindBuffer(t.ARRAY_BUFFER,this.instBuf),t.bufferSubData(t.ARRAY_BUFFER,0,e.instances,0,e.count*10),t.uniformMatrix4fv(n.u_viewProj,!1,e.viewProj),t.uniform1f(n.u_radius,this.radius),t.uniform1f(n.u_exag,e.exaggeration),t.uniform1f(n.u_normalExag,e.normalExaggeration),t.uniform3fv(n.u_faceC,F),t.uniform3fv(n.u_faceE,I),t.uniform3fv(n.u_faceS,L),t.uniform1i(n.u_hn,this.hn),t.uniform1i(n.u_cn,this.cn),t.uniform1i(n.u_hasClimate,this.hasClimate),t.uniform1i(n.u_palette,+(this.palette===`hypsometric`)),t.uniform1i(n.u_ln,this.ln),t.uniform1i(n.u_layerMode,this.layerMode),t.uniform1f(n.u_layerMin,this.layerMin),t.uniform1f(n.u_layerMax,this.layerMax),t.uniform3f(n.u_sunCarto,e.sunCarto[0],e.sunCarto[1],e.sunCarto[2]),t.uniform3f(n.u_camRight,e.camRight.x,e.camRight.y,e.camRight.z),t.uniform3f(n.u_camUp,e.camUp.x,e.camUp.y,e.camUp.z),t.uniform3f(n.u_sunReal,e.sunReal[0],e.sunReal[1],e.sunReal[2]),t.uniform1f(n.u_realK,e.realK),t.uniform3f(n.u_lightCol,e.light[0],e.light[1],e.light[2]),t.uniform3f(n.u_ambient,e.ambient[0],e.ambient[1],e.ambient[2]),t.uniform1i(n.u_realistic,+!!e.realistic),t.uniform2f(n.u_season,e.season[0],e.season[1]),t.uniform1f(n.u_time,e.time),t.uniform1f(n.u_pxScale,e.pxScale);let r=(e,n,r)=>{t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D_ARRAY,n),t.uniform1i(r,e)};r(0,this.heightTex,n.u_height),r(1,this.gradTex,n.u_grad),r(2,this.climateTex,n.u_climate),r(3,this.layerTex,n.u_layer),r(5,this.surfTex,n.u_surf),r(6,this.coverTex,n.u_cover),r(7,this.wlevelTex,n.u_wlevel),r(12,this.wlevelDTex,n.u_wlevelD),r(13,this.wetDTex,n.u_wetD),r(8,this.wclassTex,n.u_wclass),r(14,this.vegTex,n.u_veg),t.uniform1i(n.u_hasVeg,+!!this.veg),t.uniform1i(n.u_hasCover,this.hasCover),t.uniform1i(n.u_hasWater,this.hasWater),t.activeTexture(t.TEXTURE4),t.bindTexture(t.TEXTURE_2D,this.lutTex),t.uniform1i(n.u_lut,4),e.detail.bind(t,this.prog,9,e.eye),Tr(t,this.prog,e.atmos),t.bindVertexArray(this.vao),t.drawElementsInstanced(t.TRIANGLES,this.indexCount,t.UNSIGNED_SHORT,0,e.count),t.bindVertexArray(null)}};function ca(e,t,n){let r=t+4,i=Hn(e,t),a=new Float32Array(6*t*t*4),o=Math.PI/2/t,s=Math.PI/4,c=Float64Array.from({length:t+2},(e,t)=>Math.tan((t-.5)*o-s)),l=(e,t,r)=>{let i=c[e+1],a=c[t+1],o=n/Math.sqrt(1+i*i+a*a);r[0]=i*o,r[1]=a*o,r[2]=o},u=new Float64Array(t*t*9),d=new Float64Array(3),f=new Float64Array(3),p=new Float64Array(3),m=new Float64Array(3);for(let e=0;e<t;e++)for(let n=0;n<t;n++){l(n+1,e,d),l(n-1,e,f),l(n,e+1,p),l(n,e-1,m);let r=(e*t+n)*9,i=0,a=0,o=0;for(let e=0;e<3;e++){let t=d[e]-f[e],n=p[e]-m[e];u[r+e]=t,u[r+3+e]=n,i+=t*t,a+=n*n,o+=t*n}let s=i*a-o*o;u[r+6]=a/s,u[r+7]=o/s,u[r+8]=i/s}let h=e=>e>0?e:0;for(let o=0;o<6;o++){let s=o*3,c=I[s],l=I[s+1],d=I[s+2],f=L[s],p=L[s+1],m=L[s+2],g=F[s],_=F[s+1],v=F[s+2];for(let s=0;s<t;s++){let y=o*r*r+(s+2)*r+2;for(let b=0;b<t;b++){if(b===0||s===0||b===t-1||s===t-1){la(e,t,n,o,b,s,a);continue}let x=y+b,S=h(i[x+1])-h(i[x-1]),C=h(i[x+r])-h(i[x-r]),w=(s*t+b)*9,T=S*u[w+6]-C*u[w+7],E=C*u[w+8]-S*u[w+7],D=T*u[w]+E*u[w+3],O=T*u[w+1]+E*u[w+4],k=T*u[w+2]+E*u[w+5],A=((o*t+s)*t+b)*4;a[A]=D*c+O*f+k*g,a[A+1]=D*l+O*p+k*_,a[A+2]=D*d+O*m+k*v}}}return a}function la(e,t,n,r,i,a,o){let s=new Float64Array(3),c=(o,c)=>{let l=i+o,u=a+c,d=l<0?Vn(t,r,0,a,0):l>=t?Vn(t,r,1,a,0):u<0?Vn(t,r,2,i,0):u>=t?Vn(t,r,3,i,0):(r*t+u)*t+l,f=Math.floor(d/(t*t)),p=d-f*t*t,m=Math.floor(p/t);return Je(f,((p-m*t+.5)/t-.5)*(Math.PI/2),((m+.5)/t-.5)*(Math.PI/2),s),[s[0]*n,s[1]*n,s[2]*n,Math.max(0,e[d])]},l=c(1,0),u=c(-1,0),d=c(0,1),f=c(0,-1),p=[l[0]-u[0],l[1]-u[1],l[2]-u[2]],m=[d[0]-f[0],d[1]-f[1],d[2]-f[2]],h=l[3]-u[3],g=d[3]-f[3],_=p[0]*p[0]+p[1]*p[1]+p[2]*p[2],v=m[0]*m[0]+m[1]*m[1]+m[2]*m[2],y=p[0]*m[0]+p[1]*m[1]+p[2]*m[2],b=_*v-y*y,x=(h*v-g*y)/b,S=(g*_-h*y)/b,C=((r*t+a)*t+i)*4;o[C]=x*p[0]+S*m[0],o[C+1]=x*p[1]+S*m[1],o[C+2]=x*p[2]+S*m[2]}function ua(e,t,n,r){let i=6*r*r,a=new Float32Array(i*4);for(let r=0;r<i;r++){let i=e[r];a[r*4]=Math.max(t[r],+(i===B.ICE)),a[r*4+1]=+(i===B.ROCK||i===B.NIVAL),a[r*4+2]=Math.max(+(i===B.BEACH||i===B.SALT_FLAT),n?.6*n[r]/255:0),a[r*4+3]=+(i===B.MARSH||i===B.BOG||i===B.SALT_MARSH||i===B.MANGROVE||i===B.SWAMP||i===B.FEN)}return da(a,r)}function da(e,t){let n=6*t*t,r=Hn(e,t,1,4),i=t+2,a=new Float32Array(n*4);for(let e=0;e<6;e++)for(let n=0;n<t;n++)for(let o=0;o<t;o++){let s=((e*t+n)*t+o)*4;for(let t=0;t<4;t++){let c=0;for(let a=0;a<3;a++)for(let s=0;s<3;s++)c+=r[((e*i+n+a)*i+o+s)*4+t];a[s+t]=c/9}}let o=Hn(a,t,2,4);return Uint8Array.from(o,e=>Math.round(255*Math.min(1,Math.max(0,e))))}function fa(e,t){let n=t>>1,r=new Float32Array(6*n*n*4);for(let i=0;i<6;i++)for(let a=0;a<n;a++)for(let o=0;o<n;o++)for(let s=0;s<4;s++){let c=((i*t+2*a)*t+2*o)*4+s;r[((i*n+a)*n+o)*4+s]=.25*(e[c]+e[c+4]+e[c+4*t]+e[c+4*t+4])}return r}var pa=new Set([B.WATER,B.ICE,B.ROCK,B.NIVAL,B.BEACH,B.SALT_FLAT]);function ma(e,t,n,r,i){let a=6*r*r,o=new Float32Array(a*4);for(let r=0;r<a;r++){let a=e[r];pa.has(a)&&(a=kr(n[r*4],n[r*4+1],n[r*4+2]<.375));let s=Dr[a],c=i===`satellite`?s.satellite:s.stylised;o[r*4]=t?t[r]:s.canopy,o[r*4+1]=c[0]/255,o[r*4+2]=c[1]/255,o[r*4+3]=c[2]/255}return da(o,r)}var ha=e=>`0x${(e>>>0).toString(16)}u`,q=e=>Number.isInteger(e)?`${e}.0`:`${e}`,ga=`
const uint DN_M1 = ${ha(H.M1)};
const uint DN_M2 = ${ha(H.M2)};
const uint DN_M3 = ${ha(H.M3)};
const uint DN_F1 = ${ha(H.F1)};
const uint DN_F2 = ${ha(H.F2)};
const uint DN_OCT = ${ha(H.OCT)};
const uint DN_SEED_BAKE = ${ha(H.SEED_BAKE)};
const uint DN_SEED_DUNE = ${ha(H.SEED_DUNE)};
const float DN_TILE = ${q(H.TILE)};
const int DN_TILE_BIAS = ${H.TILE_BIAS};
const float DN_RIDGE_HI = ${q(H.RIDGE_HI)};
const float DN_RIDGE_MAX = ${q(H.RIDGE_MAX)};
const float DN_DAMP = ${q(H.DAMP)};
const float DN_FADE_LO = ${q(H.FADE_LO)};
const float DN_FADE_HI = ${q(H.FADE_HI)};
const int DN_MAX_OCT = ${H.MAX_OCT};
const float DN_AMP_BASE = ${q(H.AMP_BASE)};
const float DN_AMP_ROUGH = ${q(H.AMP_ROUGH)};
const float DN_DUNE_LX = ${q(H.DUNE_LX)};
const float DN_DUNE_LY = ${q(H.DUNE_LY)};
const float DN_DUNE_AMP = ${q(H.DUNE_AMP)};
const float DN_DUNE_MEAN = ${q(H.DUNE_MEAN)};
const float DN_DUNE_MAX = ${q(H.DUNE_MAX)};
const float DN_SHORE_MARGIN = ${q(H.SHORE_MARGIN)};
const float DN_BAKE_BASE = ${q(H.BAKE_BASE)};
const float DN_BAKE_ROUGH = ${q(H.BAKE_ROUGH)};
const float DN_DRY = ${q(H.DRY)};

uint dnHash(ivec2 c, uint s) {
  uint h = (uint(c.x) * DN_M1) ^ (uint(c.y) * DN_M2) ^ (s * DN_M3);
  h ^= h >> 16u; h *= DN_F1; h ^= h >> 15u; h *= DN_F2; h ^= h >> 16u;
  return h;
}
float dnVal(ivec2 c, uint s) { return float(dnHash(c, s) >> 8u) * (2.0 / 16777216.0) - 1.0; }

// Value noise on a lattice of spacing lam (m, powers of two) at world point w; returns (n, dn/dx, dn/dy)
// per metre. w is split into a 65 536 m tile and a local offset before scaling (research 04 §1.6).
vec3 dnNoise(vec2 w, vec2 lam, uint s) {
  vec2 t = floor(w * (1.0 / DN_TILE));
  vec2 q = (w - t * DN_TILE) / lam;
  vec2 fq = floor(q);
  vec2 f = q - fq;
  ivec2 i = (ivec2(t) + DN_TILE_BIAS) * ivec2(DN_TILE / lam) + ivec2(fq);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);
  float a = dnVal(i, s), b = dnVal(i + ivec2(1, 0), s), c = dnVal(i + ivec2(0, 1), s), d = dnVal(i + ivec2(1, 1), s);
  float k1 = b - a, k2 = c - a, k4 = a - b - c + d;
  return vec3(a + k1 * u.x + k2 * u.y + k4 * u.x * u.y, du * vec2(k1 + k4 * u.y, k2 + k4 * u.x) / lam);
}

// Derivative-damped, optionally ridged fBm faded per octave by footprint; |h| <= amp. Returns (h, grad).
vec3 dnFbm(vec2 w, float pxFoot, float lam0, int oct, float amp, float ridge, vec2 g0, uint seed) {
  vec3 acc = vec3(0.0);
  if (amp <= 0.0) return acc;
  float a = amp / (2.0 * (1.0 - exp2(-float(oct))) * DN_RIDGE_MAX);
  float lam = lam0;
  vec2 ds = g0;
  for (int k = 0; k < DN_MAX_OCT; k++) {
    if (k >= oct) break;
    float fw = 1.0 - smoothstep(DN_FADE_LO, DN_FADE_HI, pxFoot / lam);
    if (fw <= 0.0) break;
    vec3 n = dnNoise(w, vec2(lam), seed + uint(k) * DN_OCT);
    float sg = sign(n.x);
    n = mix(n, vec3(DN_RIDGE_HI - 2.0 * abs(n.x), -2.0 * sg * n.yz), ridge);
    float c = fw * a / (1.0 + DN_DAMP * dot(ds, ds));
    acc += c * n;
    ds += a * n.yz;   // ungated: fading an octave never changes the others
    a *= 0.5;
    lam *= 0.5;
  }
  return acc;
}

// Dune field, crests running north-south; |h| <= DN_DUNE_MAX * amp.
vec3 dnDunes(vec2 w, float pxFoot, float amp, uint seed) {
  if (amp <= 0.0) return vec3(0.0);
  float fw = 1.0 - smoothstep(DN_FADE_LO, DN_FADE_HI, pxFoot / DN_DUNE_LX);
  if (fw <= 0.0) return vec3(0.0);
  vec3 n = dnNoise(w, vec2(DN_DUNE_LX, DN_DUNE_LY), seed ^ DN_SEED_DUNE);
  float v = 1.0 - abs(n.x);
  float c = fw * amp;
  return c * vec3(v * v - DN_DUNE_MEAN, -2.0 * v * sign(n.x) * n.yz);
}

float dnFetch(sampler2D s, int n, ivec2 t) { return texelFetch(s, clamp(t, ivec2(0), ivec2(n - 1)), 0).r; }

// Bilinear value and texel-space gradient at texel coordinates q (integer q = texel centres).
vec3 dnBilinear(sampler2D s, int n, vec2 q) {
  ivec2 i = ivec2(floor(q));
  vec2 f = q - vec2(i);
  float a = dnFetch(s, n, i), b = dnFetch(s, n, i + ivec2(1, 0)), c = dnFetch(s, n, i + ivec2(0, 1)), d = dnFetch(s, n, i + ivec2(1, 1));
  float ab = mix(a, b, f.x), cd = mix(c, d, f.x);
  return vec3(mix(ab, cd, f.y), mix(b - a, d - c, f.y), mix(c - a, d - b, f.x));
}

vec4 dnCr(float t) { return vec4(((-0.5 * t + 1.0) * t - 0.5) * t, (1.5 * t - 2.5) * t * t + 1.0, ((-1.5 * t + 2.0) * t + 0.5) * t, (0.5 * t - 0.5) * t * t); }
vec4 dnCrd(float t) { return vec4((-1.5 * t + 2.0) * t - 0.5, (4.5 * t - 5.0) * t, (-4.5 * t + 4.0) * t + 0.5, (1.5 * t - 1.0) * t); }

// Catmull-Rom value and texel-space gradient; mm = min/max of the four nearest texels.
vec3 dnBicubic(sampler2D s, int n, vec2 q, out vec2 mm) {
  ivec2 i = ivec2(floor(q));
  vec2 f = q - vec2(i);
  vec4 wx = dnCr(f.x), wy = dnCr(f.y), dx = dnCrd(f.x), dy = dnCrd(f.y);
  float v = 0.0, gx = 0.0, gy = 0.0;
  mm = vec2(1e30, -1e30);
  for (int y = 0; y < 4; y++) {
    float rv = 0.0, rd = 0.0;
    for (int x = 0; x < 4; x++) {
      float h = dnFetch(s, n, i + ivec2(x - 1, y - 1));
      rv += wx[x] * h;
      rd += dx[x] * h;
      if (x >= 1 && x <= 2 && y >= 1 && y <= 2) mm = vec2(min(mm.x, h), max(mm.y, h));
    }
    v += wy[y] * rv;
    gx += wy[y] * rd;
    gy += dy[y] * rv;
  }
  return vec3(v, gx, gy);
}
`,_a=`
${ga}
uniform highp sampler2D u_detail;   // R32F detail elevation (m), row 0 = north
uniform sampler2D u_detailCtl;      // RGBA8 linear: roughness, rock, water/channel proximity, dunes
uniform int u_detailN;
uniform int u_hasDetail;
uniform uint u_detailSeed;
uniform float u_detailAmp;          // global multiplier (1 = default)
uniform float u_detailAmpScale;     // (lam0 / LAM_REF)^LAM_EXP
uniform float u_detailLam0;         // longest shader octave (m)
uniform int u_detailOct;

vec2 dnQ(vec2 w, int n) { return vec2(w.x, u_size - w.y) / u_size * float(n) - 0.5; }
vec3 dnToWorld(vec3 v, int n) { float k = float(n) / u_size; return vec3(v.x, v.y * k, -v.z * k); }
vec3 dnMacro(vec2 w) { return dnToWorld(dnBilinear(u_height, u_hn, dnQ(w, u_hn)), u_hn); }

float detailWeight(float pxFoot) {
  if (u_hasDetail == 0) return 0.0;
  float t = u_size / float(u_detailN);
  return 1.0 - smoothstep(t, 2.0 * t, pxFoot);
}

float detailWaterLevel(vec2 w) { return u_hasWater == 1 ? waterLevelAt(w) : 0.0; }

vec3 detailSample(vec2 w, float pxFoot) {
  float t = detailWeight(pxFoot);
  if (t <= 0.0) return dnMacro(w);
  float texel = u_size / float(u_detailN);
  vec2 q = dnQ(w, u_detailN);
  vec3 b = dnBilinear(u_detail, u_detailN, q);
  float tb = 1.0 - smoothstep(0.25 * texel, 0.5 * texel, pxFoot);
  if (tb > 0.0) {
    vec2 mm;
    vec3 c = dnBicubic(u_detail, u_detailN, q, mm);
    if (c.x < mm.x || c.x > mm.y) c = vec3(clamp(c.x, mm.x, mm.y), b.yz);
    b = mix(b, c, tb);
  }
  b = dnToWorld(b, u_detailN);
  if (t < 1.0) b = mix(dnMacro(w), b, t);
  if (pxFoot >= 0.5 * u_detailLam0) return b;
  vec4 ctl = textureLod(u_detailCtl, vec2(w.x, u_size - w.y) / u_size, 0.0);
  float amp = u_detailAmp * (DN_AMP_BASE + DN_AMP_ROUGH * ctl.r) * u_detailAmpScale * (1.0 - ctl.b);
  float dAmp = u_detailAmp * DN_DUNE_AMP * ctl.a * (1.0 - ctl.b);
  float wl = detailWaterLevel(w);
  float room = wl > DN_DRY ? abs(b.x - wl) - DN_SHORE_MARGIN : 1e9;
  float tot = amp + DN_DUNE_MAX * dAmp;
  float s = tot > 0.0 ? clamp(room / tot, 0.0, 1.0) : 0.0;
  b += dnFbm(w, pxFoot, u_detailLam0, u_detailOct, amp * s, ctl.g, b.yz, u_detailSeed);
  b += dnDunes(w, pxFoot, dAmp * s, u_detailSeed);
  return b;
}

float terrainHeight(vec2 w, float pxFoot) { return detailSample(w, pxFoot).x; }
vec2 terrainGradient(vec2 w, float pxFoot) { return detailSample(w, pxFoot).yz; }

float terrainSurface(vec2 w, float pxFoot) {
  float t = detailWeight(pxFoot);
  float s0 = t < 1.0 ? surfaceHeight(w) : 0.0;
  if (t <= 0.0) return s0;
  float h = terrainHeight(w, pxFoot);
  float wl = detailWaterLevel(w);
  float s = wl > DN_DRY ? max(h, wl) : max(h, 0.0);
  return mix(s0, s, t);
}
`,va=[`u_detail`,`u_detailCtl`,`u_detailN`,`u_hasDetail`,`u_detailSeed`,`u_detailAmp`,`u_detailAmpScale`,`u_detailLam0`,`u_detailOct`],ya=class{map=null;enabled=!0;amp=1;locs=new WeakMap;dummyF=null;dummyC=null;constructor(e=null){this.map=e}get active(){let e=this.map;return this.enabled&&e!==null&&e.ready&&e.texture!==null&&e.params!==null}bind(e,t,n){let r=this.locs.get(t);if(!r){r={};for(let n of va)r[n]=e.getUniformLocation(t,n);this.locs.set(t,r)}let i=this.active,a=this.map,o=i&&a?a.params:null;return e.activeTexture(e.TEXTURE0+n),e.bindTexture(e.TEXTURE_2D,i&&a?a.texture:this.dummy(e,!0)),e.uniform1i(r.u_detail,n),e.activeTexture(e.TEXTURE0+n+1),e.bindTexture(e.TEXTURE_2D,i&&a?a.control:this.dummy(e,!1)),e.uniform1i(r.u_detailCtl,n+1),e.uniform1i(r.u_hasDetail,+!!i),e.uniform1i(r.u_detailN,o?o.detailN:1),e.uniform1ui(r.u_detailSeed,o?o.seed>>>0:0),e.uniform1f(r.u_detailAmp,this.amp),e.uniform1f(r.u_detailAmpScale,o?o.ampScale:1),e.uniform1f(r.u_detailLam0,o?o.lam0:512),e.uniform1i(r.u_detailOct,o?o.octaves:0),e.activeTexture(e.TEXTURE0),n+2}dummy(e,t){let n=t?this.dummyF:this.dummyC;return n||(n=e.createTexture(),e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),t?e.texImage2D(e.TEXTURE_2D,0,e.R32F,1,1,0,e.RED,e.FLOAT,new Float32Array([0])):e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array(4)),t?this.dummyF=n:this.dummyC=n,n)}dispose(e){this.dummyF&&e.deleteTexture(this.dummyF),this.dummyC&&e.deleteTexture(this.dummyC),this.dummyF=this.dummyC=null}},ba={thermalSteps:24,hydraulicSteps:null,anchorMetres:60,talus:.75,thermalRate:.5,readback:!0,hydro:{dt:.05,K:20,rain:.02,Kc:.2,Ks:.3,Kd:.1,Ke:.02,amin:.05,dmax:.004,maxStep:.002},gpuMtexPerMs:8},xa=-12e3,Sa=12e3,Ca=new Float32Array(32).fill(1),wa=new Float32Array(32),Ta=new Float32Array(32);Ca[B.WATER]=.3,Ca[B.ICE]=.35,Ca[B.POLAR_DESERT]=.7,Ca[B.TUNDRA]=.8,Ca[B.HOT_DESERT]=.5,Ca[B.COLD_DESERT]=.7,Ca[B.BEACH]=.2,Ca[B.SALT_FLAT]=.05;for(let e of[B.MARSH,B.BOG,B.SALT_MARSH,B.MANGROVE])Ca[e]=.15;Ca[B.ROCK]=1.25,Ca[B.NIVAL]=1.25,wa[B.ROCK]=1,wa[B.NIVAL]=1,Ta[B.HOT_DESERT]=1,Ta[B.COLD_DESERT]=.5,Ta[B.BEACH]=.4,Ta[B.XERIC_SHRUB]=.2;var Ea=e=>e.data instanceof Float32Array?e.data:Float32Array.from(e.data);function Da(e,t,n,r,i,a,o){for(let s=a;s<o;s++){let a=Math.max(0,s-1),o=Math.min(t-1,s+1);for(let c=0;c<t;c++){let l=Math.max(0,c-1),u=Math.min(t-1,c+1),d=(e[s*t+u]-e[s*t+l])/(Math.max(1,u-l)*n),f=(e[o*t+c]-e[a*t+c])/(Math.max(1,o-a)*n);r[s*t+c]=Math.hypot(d,f);let p=1/0,m=-1/0;for(let n=a;n<=o;n++)for(let r=l;r<=u;r++){let i=e[n*t+r];i<p&&(p=i),i>m&&(m=i)}i[s*t+c]=m-p}}}function Oa(e,t,n,r){if(!e||e.n===0)return{segs:new Float32Array,count:0};let i=new Float32Array(e.n*12),a=new Float64Array(3),o=0;for(let s=0;s<e.n;s++){let c=e.down[s];if(c<0||c>=e.n)continue;let l=e.x[s],u=e.y[s],d=e.x[c],f=e.y[c];if(!Number.isFinite(l+u+d+f))continue;let p=Math.max(1,e.width[s]),m=e.zWater[s],h=Math.min(e.zWater[c],m),g=Math.min(e.zBed[s],m),_=Math.min(e.zBed[c],g,h),v=.5*(l+d),y=.5*(u+f),b=ei(t,n,v/r.size*n-.5,y/r.size*n-.5,a)[0],x=Math.max(1.05*r.texel,p*(6+-4.5*U(.005,.08,b))),S=Math.min(.8,Math.max(.01,1.2*b)),C=.5*p+x+2*r.macroCell,w=o*12;i[w]=l,i[w+1]=u,i[w+2]=d,i[w+3]=f,i[w+4]=g,i[w+5]=_,i[w+6]=m,i[w+7]=h,i[w+8]=p,i[w+9]=x,i[w+10]=S,i[w+11]=C,o++}return{segs:i.subarray(0,o*12),count:o}}function*ka(e,t,n,r,i){let{n:a,size:o,macro:s,water:c,slope:l,relief:u,params:d}=t,f=o/n,p=n*n,m=new Float64Array(3),h=new Float32Array(p),g=e.biome?e.biome.data:null,_=e.biome?e.biome.w:1,v=e.discharge?e.discharge.data:null,y=e.discharge?e.discharge.w:1;for(let e=0;e<n;e++){let t=(e+.5)*f;for(let i=0;i<n;i++){let l=(i+.5)*f,u=l/o*a-.5,d=t/o*a-.5,p=ei(s,a,u,d,m)[0],g=c?ei(c,a,u,d,m)[0]:0,_=g>H.DRY&&p<g;if(!_&&r){let e=r[Math.min(a-1,Math.floor(t/o*a))*a+Math.min(a-1,Math.floor(l/o*a))];_=e===4||e===5}h[e*n+i]=_?0:1e9}(e&31)==31&&(yield 0)}yield*Aa(h,n);let b=new Float32Array(p);for(let e=0;e<p;e++)b[e]=1-U(150,900,h[e]*f),(e&524287)==524287&&(yield 0);for(let e=0;e<t.segCount;e++){let r=e*12,i=t.segs[r],a=t.segs[r+1],o=t.segs[r+2],s=t.segs[r+3],c=.5*t.segs[r+8]+t.segs[r+9],l=c+2*f,u=Math.max(0,Math.floor((Math.min(i,o)-l)/f)),d=Math.min(n-1,Math.ceil((Math.max(i,o)+l)/f)),p=Math.max(0,Math.floor((Math.min(a,s)-l)/f)),m=Math.min(n-1,Math.ceil((Math.max(a,s)+l)/f)),h=o-i,g=s-a,_=h*h+g*g;for(let e=p;e<=m;e++){let t=(e+.5)*f;for(let r=u;r<=d;r++){let o=(r+.5)*f,s=_>0?Math.min(1,Math.max(0,((o-i)*h+(t-a)*g)/_)):0,u=Math.hypot(o-i-s*h,t-a-s*g);if(u>=l)continue;let d=1-U(c,l,u);d>b[e*n+r]&&(b[e*n+r]=d)}}(e&2047)==2047&&(yield 0)}for(let e=0;e<n;e++){let t=(e+.5)*f;for(let r=0;r<n;r++){let s=(r+.5)*f,c=s/o*a-.5,p=t/o*a-.5,h=Math.max(0,ei(l,a,c,p,m)[0]),x=Math.max(0,ei(u,a,c,p,m)[0]*(d.macroCell>=1e3?1e3/d.macroCell:1)),S=g?g[Math.min(_-1,Math.floor(t/o*_))*_+Math.min(_-1,Math.floor(s/o*_))]&31:6,C=b[e*n+r];if(v){let e=v[Math.min(y-1,Math.floor(t/o*y))*y+Math.min(y-1,Math.floor(s/o*y))];C=Math.max(C,.5*U(1,2.5,e))}let w=Math.min(1,Math.max(.03,(.65*U(.02,.35,h)+.45*U(30,900,x))*Ca[S])),T=Math.max(wa[S],U(.25,.6,h))*(1-C),E=Ta[S]*(1-U(.02,.08,h))*(1-.7*C),D=(e*n+r)*4;i[D]=Math.round(255*w),i[D+1]=Math.round(255*T),i[D+2]=Math.round(255*Math.min(1,C)),i[D+3]=Math.round(255*E)}(e&31)==31&&(yield 0)}}function*Aa(e,t){let n=Math.SQRT2;for(let r=0;r<t;r++){for(let i=0;i<t;i++){let a=r*t+i,o=e[a];i>0&&(o=Math.min(o,e[a-1]+1)),r>0&&(o=Math.min(o,e[a-t]+1),i>0&&(o=Math.min(o,e[a-t-1]+n)),i<t-1&&(o=Math.min(o,e[a-t+1]+n))),e[a]=o}(r&255)==255&&(yield 0)}for(let r=t-1;r>=0;r--){for(let i=t-1;i>=0;i--){let a=r*t+i,o=e[a];i<t-1&&(o=Math.min(o,e[a+1]+1)),r<t-1&&(o=Math.min(o,e[a+t]+1),i<t-1&&(o=Math.min(o,e[a+t+1]+n)),i>0&&(o=Math.min(o,e[a+t-1]+n))),e[a]=o}r&255||(yield 0)}}function*ja(e,t){let n=e.elevation,r=n.w,i=n.worldKm*1e3,a=Ea(n),o=null,s=null;if(e.waterLevel&&e.waterLevel.w===r){let t=qt(n,e.waterLevel,e.waterClass&&e.waterClass.w===r?e.waterClass:null);o=t.level,s=t.cls}yield 0;let c=Wr(i,t,r,e.seed),l=new Float32Array(r*r),u=new Float32Array(r*r);for(let e=0;e<r;e+=128)Da(a,r,i/r,l,u,e,Math.min(r,e+128)),yield 0;let{segs:d,count:f}=Oa(e.rivers,l,r,c);yield 0;let p=Math.min(2048,t,Math.max(256,2*r)),m=new Uint8Array(p*p*4),h={size:i,n:r,macro:a,water:o,params:c,slope:l,relief:u,segs:d,segCount:f};return yield*ka(e,h,p,s,m),{...h,control:m,controlN:p}}function Ma(e,t,n){return(H.BAKE_BASE+H.BAKE_ROUGH*e)*n.bakeAmpScale*(1-t)}function*Na(e,t,n){let r=e.params,i=r.detailN,{n:a,size:o,macro:s,water:c}=e,l=r.texel,u=new Float32Array(i*i),d=new Float32Array(i*i),f=new Float32Array(i*i),p=new Float64Array(5),m=new Float64Array(3),h=new Float64Array(3),g=new Float64Array(4),_=e.controlN,v=a/o;for(let t=0;t<i;t++){let n=(t+.5)*l,y=o-n;for(let b=0;b<i;b++){let x=(b+.5)*l,S=x*v-.5,C=n*v-.5;ri(s,a,S,C,p);let w=ei(s,a,S,C,m)[0],[T,E]=ii(w,c?ei(c,a,S,C,m)[0]:0);Ia(e.control,_,x/o,n/o,g),h[0]=h[1]=h[2]=0,r.bakeOct>0&&Qr(x,y,l,r.bakeLam0,r.bakeOct,Ma(g[0],g[2],r),g[1],p[1]*v,-p[2]*v,(r.seed^H.SEED_BAKE)>>>0,h);let D=t*i+b;u[D]=p[0]+h[0],d[D]=T,f[D]=E}(t&15)==15&&(yield 0)}for(let t=0;t<e.segCount;t++)Fa(e,t,d,f),(t&1023)==1023&&(yield 0);for(let e=0;e<i*i;e++)u[e]=Math.min(Math.max(u[e],d[e]),f[e]);yield 0;let y=u,b=new Float32Array(i*i);for(let e=0;e<t;e++){for(let e=0;e<i;e++)Pa(y,b,d,f,i,e,n.talus*l,n.thermalRate),(e&255)==255&&(yield 0);[y,b]=[b,y]}return y}function Pa(e,t,n,r,i,a,o,s){for(let c=0;c<i;c++){let l=a*i+c,u=e[l],d=0;for(let t=-1;t<=1;t++){let n=Math.min(i-1,Math.max(0,a+t));for(let r=-1;r<=1;r++){if(r===0&&t===0)continue;let a=Math.min(i-1,Math.max(0,c+r)),s=e[n*i+a]-u,l=o*(r!==0&&t!==0?Math.SQRT2:1),f=Math.abs(s)-l;f>0&&(d+=s>0?f:-f)}}t[l]=Math.min(Math.max(u+s*.125*d,n[l]),r[l])}}function Fa(e,t,n,r){let i=e.params,a=i.detailN,o=i.texel,s=e.segs,c=t*12,l=s[c],u=s[c+1],d=s[c+2],f=s[c+3],p=s[c+11],m=Math.max(0,Math.floor((Math.min(l,d)-p)/o)),h=Math.min(a-1,Math.ceil((Math.max(l,d)+p)/o)),g=Math.max(0,Math.floor((Math.min(u,f)-p)/o)),_=Math.min(a-1,Math.ceil((Math.max(u,f)+p)/o)),v=d-l,y=f-u,b=v*v+y*y;for(let e=g;e<=_;e++){let t=(e+.5)*o;for(let d=m;d<=h;d++){let f=(d+.5)*o,m=b>0?Math.min(1,Math.max(0,((f-l)*v+(t-u)*y)/b)):0,h=Math.hypot(f-l-m*v,t-u-m*y);if(h>=p)continue;let g=s[c+4]+(s[c+5]-s[c+4])*m,_=s[c+6]+(s[c+7]-s[c+6])*m,x=e*a+d,S=ai(h,g,_,s[c+8],s[c+9],s[c+10],p,n[x],i.macroCell);S<r[x]&&(r[x]=S)}}}function Ia(e,t,n,r,i){let a=n*t-.5,o=r*t-.5,s=Math.floor(a),c=Math.floor(o),l=a-s,u=o-c,d=Math.min(t-1,Math.max(0,s)),f=Math.min(t-1,Math.max(0,s+1)),p=Math.min(t-1,Math.max(0,c)),m=Math.min(t-1,Math.max(0,c+1));for(let n=0;n<4;n++){let r=e[(p*t+d)*4+n],a=e[(p*t+f)*4+n],o=e[(m*t+d)*4+n],s=e[(m*t+f)*4+n],c=r+(a-r)*l;i[n]=(c+(o+(s-o)*l-c)*u)/255}}var La=`#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
${ga}
uniform sampler2D u_macro;   // R32F macro elevation (n²), row 0 = north
uniform sampler2D u_wl;      // R32F prepared water level, < -9000 dry
uniform int u_hasWater;
uniform int u_n;
uniform float u_size;
uniform int u_D;
float bTexel() { return u_size / float(u_D); }
float bCell() { return u_size / float(u_n); }
vec2 bMacroQ(vec2 pm) { return pm / u_size * float(u_n) - 0.5; }
// Water bounds (lo, hi) at map point pm (m, y from north); mirrors heightFn.waterBounds.
vec2 bBounds(vec2 pm) {
  vec2 q = bMacroQ(pm);
  float hb = dnBilinear(u_macro, u_n, q).x;
  float wl = u_hasWater == 1 ? dnBilinear(u_wl, u_n, q).x : 0.0;
  if (wl > DN_DRY) return hb < wl ? vec2(-1e30, wl - 0.5) : vec2(wl + 0.5, 1e30);
  return vec2(hb >= 0.5 ? 0.5 : -1e30, 1e30);
}
float bDepth(float z) { return clamp((z - (${xa}.0)) / (24000.0), 0.0, 1.0); }
`,Ra=`#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.5, 1.0);
}`,za=e=>`${e}
out float o;
void main() {
  vec2 b = bBounds(gl_FragCoord.xy * bTexel());
  if (b.y > 1e29) discard;
  o = b.y;
  gl_FragDepth = bDepth(b.y);
}`,Ba=`#version 300 es
precision highp float;
layout(location = 0) in vec4 a_seg;
layout(location = 1) in vec4 a_z;
layout(location = 2) in vec4 a_w;
uniform float u_size;
flat out vec4 v_seg;
flat out vec4 v_z;
flat out vec4 v_w;
void main() {
  vec2 a = a_seg.xy, b = a_seg.zw, d = b - a;
  float L = length(d);
  vec2 t = L > 1e-3 ? d / L : vec2(1.0, 0.0);
  vec2 nr = vec2(-t.y, t.x);
  float E = a_w.w;
  int id = gl_VertexID;
  vec2 p = ((id & 1) == 0 ? a - t * E : b + t * E) + nr * ((id & 2) == 0 ? -E : E);
  v_seg = a_seg;
  v_z = a_z;
  v_w = a_w;
  gl_Position = vec4(p / u_size * 2.0 - 1.0, 0.5, 1.0);
}`,Va=e=>`${e}
flat in vec4 v_seg;
flat in vec4 v_z;
flat in vec4 v_w;
out float o;
float dnCarve(float r, float zb, float zw, float w, float fp, float sv, float ext, float lo, float cell) {
  float half_ = 0.5 * w;
  float z;
  if (r < half_) { float u = r / half_; z = zb + (zw - zb) * u * u; }
  else { float x = r - half_; z = max(zw + 0.002 * min(x, fp) + sv * max(0.0, x - fp), lo); }
  float rampW = min(cell, 0.4 * ext);
  float e0 = ext - rampW;
  if (r > e0) { float t = (r - e0) / rampW; z += 2000.0 * t * t; }
  return z;
}
void main() {
  vec2 p = gl_FragCoord.xy * bTexel();
  vec2 a = v_seg.xy, ab = v_seg.zw - v_seg.xy;
  float L2 = dot(ab, ab);
  float t = L2 > 0.0 ? clamp(dot(p - a, ab) / L2, 0.0, 1.0) : 0.0;
  float r = length(p - a - t * ab);
  float ext = v_w.w;
  if (r >= ext) discard;
  float zb = mix(v_z.x, v_z.y, t), zw = mix(v_z.z, v_z.w, t);
  float z = dnCarve(r, zb, zw, v_w.x, v_w.y, v_w.z, ext, bBounds(p).x, bCell());
  o = z;
  gl_FragDepth = bDepth(z);
}`,Ha=e=>`${e}
uniform sampler2D u_cap;
uniform sampler2D u_ctl;
uniform uint u_seed;
uniform float u_bakeLam0;
uniform int u_bakeOct;
uniform float u_bakeAmpScale;
out float o;
void main() {
  vec2 pm = gl_FragCoord.xy * bTexel();
  vec2 mm;
  vec3 m = dnBicubic(u_macro, u_n, bMacroQ(pm), mm);
  float k = float(u_n) / u_size;
  vec4 c = textureLod(u_ctl, pm / u_size, 0.0);
  float amp = (DN_BAKE_BASE + DN_BAKE_ROUGH * c.r) * u_bakeAmpScale * (1.0 - c.b);
  vec3 nz = u_bakeOct > 0 ? dnFbm(vec2(pm.x, u_size - pm.y), bTexel(), u_bakeLam0, u_bakeOct, amp, c.g, vec2(m.y * k, -m.z * k), u_seed ^ DN_SEED_BAKE) : vec3(0.0);
  vec2 b = bBounds(pm);
  o = min(max(m.x + nz.x, b.x), texelFetch(u_cap, ivec2(gl_FragCoord.xy), 0).r);
}`,Ua=e=>`${e}
uniform sampler2D u_h;
uniform sampler2D u_cap;
uniform float u_talus;
uniform float u_rate;
out float o;
void main() {
  ivec2 c = ivec2(gl_FragCoord.xy);
  float h = dnFetch(u_h, u_D, c);
  float acc = 0.0;
  for (int dy = -1; dy <= 1; dy++) {
    for (int dx = -1; dx <= 1; dx++) {
      if (dx == 0 && dy == 0) continue;
      float d = dnFetch(u_h, u_D, c + ivec2(dx, dy)) - h;
      float T = u_talus * ((dx != 0 && dy != 0) ? 1.41421356 : 1.0);
      acc += sign(d) * max(0.0, abs(d) - T);
    }
  }
  vec2 b = bBounds(gl_FragCoord.xy * bTexel());
  o = min(max(h + u_rate * 0.125 * acc, b.x), texelFetch(u_cap, c, 0).r);
}`,Wa=e=>`${e}
uniform sampler2D u_h;
out float o;
void main() { o = texelFetch(u_h, ivec2(gl_FragCoord.xy), 0).r; }`,Ga=e=>`${e}
uniform sampler2D u_A;   // RGBA32F: terrain b (texel units), water d, sediment s
uniform sampler2D u_F;   // RGBA32F: outflow L, R, T (row-1, north), B (row+1)
uniform int u_T;
uniform ivec2 u_org;
uniform float u_dt;
uniform float u_K;
uniform float u_rain;
vec4 tA(ivec2 c) { return texelFetch(u_A, clamp(c, ivec2(0), ivec2(u_T - 1)), 0); }
vec4 tF(ivec2 c) { return texelFetch(u_F, clamp(c, ivec2(0), ivec2(u_T - 1)), 0); }
`,Ka=e=>`${e}
uniform sampler2D u_h;
uniform ivec2 u_org;
out vec4 o;
void main() { o = vec4(dnFetch(u_h, u_D, ivec2(gl_FragCoord.xy) + u_org) / bTexel(), 0.0, 0.0, 0.0); }`,qa=e=>`${Ga(e)}
out vec4 o;
void main() {
  ivec2 c = ivec2(gl_FragCoord.xy);
  vec4 s = tA(c);
  float r = u_dt * u_rain;
  float dr = s.y + r;
  float H = s.x + dr;
  vec4 sl = tA(c - ivec2(1, 0)), sr = tA(c + ivec2(1, 0)), st = tA(c - ivec2(0, 1)), sb = tA(c + ivec2(0, 1));
  vec4 hn = vec4(
    c.x > 0 ? sl.x + sl.y + r : H,
    c.x < u_T - 1 ? sr.x + sr.y + r : H,
    c.y > 0 ? st.x + st.y + r : H,
    c.y < u_T - 1 ? sb.x + sb.y + r : H);
  vec4 nf = max(vec4(0.0), tF(c) + u_dt * u_K * (H - hn));
  float sum = nf.x + nf.y + nf.z + nf.w;
  o = sum > 0.0 ? nf * min(1.0, dr / (sum * u_dt)) : vec4(0.0);
}`,Ja=e=>`${Ga(e)}
uniform float u_Kc;
uniform float u_Ks;
uniform float u_Kd;
uniform float u_amin;
uniform float u_dmax;
uniform float u_maxStep;
layout(location = 0) out vec4 oA;
layout(location = 1) out vec4 oV;
void main() {
  ivec2 c = ivec2(gl_FragCoord.xy);
  vec4 s = tA(c);
  float dr = s.y + u_dt * u_rain;
  vec4 f = tF(c);
  float inL = c.x > 0 ? tF(c - ivec2(1, 0)).y : 0.0;
  float inR = c.x < u_T - 1 ? tF(c + ivec2(1, 0)).x : 0.0;
  float inT = c.y > 0 ? tF(c - ivec2(0, 1)).w : 0.0;
  float inB = c.y < u_T - 1 ? tF(c + ivec2(0, 1)).z : 0.0;
  float d2 = max(0.0, dr + u_dt * (inL + inR + inT + inB - (f.x + f.y + f.z + f.w)));
  float db = max(0.5 * (dr + d2), 1e-6);
  vec2 v = 0.5 * vec2(inL - f.x + f.y - inR, inT - f.z + f.w - inB) / db;
  float g = 0.5 * length(vec2(tA(c + ivec2(1, 0)).x - tA(c - ivec2(1, 0)).x, tA(c + ivec2(0, 1)).x - tA(c - ivec2(0, 1)).x));
  float sinA = g / sqrt(1.0 + g * g);
  float C = u_Kc * max(sinA, u_amin) * length(v) * clamp(d2 / u_dmax, 0.0, 1.0);
  float b = s.x, sed = s.z;
  if (C > sed) { float e = min(u_Ks * (C - sed) * u_dt, u_maxStep); b -= e; sed += e; }
  else { float e = min(u_Kd * (sed - C) * u_dt, u_maxStep); b += e; sed -= e; }
  oA = vec4(b, d2, sed, 0.0);
  oV = vec4(v, 0.0, 0.0);
}`,Ya=e=>`${Ga(e)}
uniform sampler2D u_V;
uniform sampler2D u_h;
uniform sampler2D u_cap;
uniform float u_Ke;
out vec4 o;
float sedAt(vec2 p) {
  ivec2 i = ivec2(floor(p));
  vec2 f = p - vec2(i);
  return mix(mix(tA(i).z, tA(i + ivec2(1, 0)).z, f.x), mix(tA(i + ivec2(0, 1)).z, tA(i + ivec2(1, 1)).z, f.x), f.y);
}
void main() {
  ivec2 c = ivec2(gl_FragCoord.xy);
  vec4 s = tA(c);
  vec2 v = texelFetch(u_V, c, 0).xy;
  float vl = length(v) * u_dt;
  if (vl > 0.9) v *= 0.9 / vl;
  float sed = sedAt(vec2(c) - v * u_dt);
  float d = s.y * (1.0 - u_Ke * u_dt);
  ivec2 g = c + u_org;
  float cell = bTexel();
  float b = s.x * cell;
  if (isnan(b) || isinf(b) || abs(b) > 1e5 || isnan(sed) || isnan(d) || isinf(d)) { b = dnFetch(u_h, u_D, g); sed = 0.0; d = 0.0; }
  vec2 bd = bBounds((vec2(g) + 0.5) * cell);
  b = min(max(b, bd.x), dnFetch(u_cap, u_D, g));
  if (bd.y < 1e29) { d = 0.0; sed = 0.0; }
  o = vec4(b / cell, d, max(sed, 0.0), 0.0);
}`,Xa=e=>`${e}
uniform sampler2D u_A;
uniform ivec2 u_org;
out float o;
void main() { o = texelFetch(u_A, ivec2(gl_FragCoord.xy) - u_org, 0).x * bTexel(); }`,Za=e=>`${e}
uniform sampler2D u_h;
out float o;
void main() {
  ivec2 cell = ivec2(gl_FragCoord.xy);
  int k = max(1, u_D / u_n);
  int st = max(1, k / 4);
  float sum = 0.0, cnt = 0.0;
  for (int j = 0; j < 4; j++) {
    if (j * st >= k) break;
    for (int i = 0; i < 4; i++) {
      if (i * st >= k) break;
      ivec2 t = cell * k + ivec2(i, j) * st + st / 2;
      vec2 mm;
      float up = dnBicubic(u_macro, u_n, bMacroQ((vec2(t) + 0.5) * bTexel()), mm).x;
      sum += dnFetch(u_h, u_D, t) - up;
      cnt += 1.0;
    }
  }
  o = sum / cnt;
}`,Qa=e=>`${e}
uniform sampler2D u_src;
uniform ivec2 u_dir;
out float o;
void main() {
  ivec2 c = ivec2(gl_FragCoord.xy);
  float s = 0.0, w = 0.0;
  for (int i = -6; i <= 6; i++) {
    float k = exp(-float(i * i) / 8.0);
    s += k * dnFetch(u_src, u_n, c + u_dir * i);
    w += k;
  }
  o = s / w;
}`,$a=e=>`${e}
uniform sampler2D u_h;
uniform sampler2D u_low;
uniform sampler2D u_cap;
uniform float u_a;
out float o;
void main() {
  ivec2 c = ivec2(gl_FragCoord.xy);
  vec2 pm = gl_FragCoord.xy * bTexel();
  float low = dnBilinear(u_low, u_n, bMacroQ(pm)).x;
  float h = dnFetch(u_h, u_D, c) - low + clamp(low, -u_a, u_a);
  vec2 b = bBounds(pm);
  o = min(max(h, b.x), texelFetch(u_cap, c, 0).r);
}`,eo=e=>`${e}
uniform sampler2D u_h;
out vec4 o;
void main() {
  ivec2 b = ivec2(int(gl_FragCoord.x) * 4, int(gl_FragCoord.y));
  o = vec4(texelFetch(u_h, b, 0).r, texelFetch(u_h, b + ivec2(1, 0), 0).r, texelFetch(u_h, b + ivec2(2, 0), 0).r, texelFetch(u_h, b + ivec2(3, 0), 0).r);
}`;function to(e){return{cap:[Ra,za(e)],carve:[Ba,Va(e)],base:[Ra,Ha(e)],thermal:[Ra,Ua(e)],copy:[Ra,Wa(e)],hinit:[Ra,Ka(e)],hflux:[Ra,qa(e)],hwater:[Ra,Ja(e)],hadvect:[Ra,Ya(e)],hwrite:[Ra,Xa(e)],adown:[Ra,Za(e)],ablur:[Ra,Qa(e)],afinal:[Ra,$a(e)],pack:[Ra,eo(e)]}}var no=to(La),ro=-1,io=1024,ao=48,oo=class{gl;texture=null;control;size=0;ready=!1;cpuHeights=null;params=null;controlData=null;controlSize=0;progress=0;gpu;opts;stats={path:`none`,prepMs:0,cpuBuildMs:0,passes:0,gpuEstMs:0,readbackMs:0,totalMs:0,segments:0};version=0;job=null;fence=null;progs={};locs=new Map;fbo;vao;temps=new Set;macroWater=null;passesTotal=1;passesDone=0;t0=0;syncMode=!1;unitsUsed=0;constructor(e,t={}){this.gl=e,this.opts={...ba,...t,hydro:{...ba.hydro,...t.hydro??{}}},this.gpu=e.getExtension(`EXT_color_buffer_float`)!==null&&this.probe(),this.fbo=e.createFramebuffer(),this.vao=e.createVertexArray(),this.control=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.control),so(e,e.LINEAR),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array(4))}get boundsPad(){let e=this.params;if(!e)return 0;let t=(H.BAKE_BASE+H.BAKE_ROUGH)*e.bakeAmpScale,n=(H.AMP_BASE+H.AMP_ROUGH)*e.ampScale+H.DUNE_AMP*H.DUNE_MAX;return Math.ceil(this.opts.anchorMetres+t+n+50)}get cpuReady(){return this.cpuHeights!==null}get building(){return this.job!==null}heightSources(){let e=this.macroWater;return e?{size:e.worldSize,macro:e.macro,macroN:e.n,water:e.water,params:this.ready?this.params:null,detail:this.ready?this.cpuHeights:null,control:this.controlData,controlN:this.controlSize}:null}build(e){this.cancel(),this.releaseResult();let t=this.gl,n=Math.min(t.getParameter(t.MAX_TEXTURE_SIZE),t.getParameter(t.MAX_RENDERBUFFER_SIZE)),r=this.gpu&&e.size===4096&&n>=4096?4096:2048;this.t0=performance.now(),this.stats={path:this.gpu?`gpu`:`cpu`,prepMs:0,cpuBuildMs:0,passes:0,gpuEstMs:0,readbackMs:0,totalMs:0,segments:0},this.progress=0,this.job=this.gpu?this.gpuPipeline(e,r):this.cpuPipeline(e,r)}step(e=4){let t=this.job;if(!t)return!0;let n=this.gl;if(this.fence){if(n.clientWaitSync(this.fence,0,0)===n.TIMEOUT_EXPIRED)return!1;n.deleteSync(this.fence),this.fence=null}let r=0,i=!1,a=!1;return this.withState(()=>{for(;r<e;){let e=performance.now(),n=t.next();if(r+=performance.now()-e,n.done){a=!0;break}if(n.value===ro)break;n.value>0&&(i=!0,r+=n.value)}}),i&&!a&&(this.fence=n.fenceSync(n.SYNC_GPU_COMMANDS_COMPLETE,0)),a&&this.finishJob(),a}finishSync(){let e=this.job;if(e){this.syncMode=!0;try{this.withState(()=>{for(;!e.next().done;);})}finally{this.syncMode=!1}this.fence&&=(this.gl.deleteSync(this.fence),null),this.finishJob()}}dispose(){this.cancel(),this.releaseResult();let e=this.gl;for(let t of Object.values(this.progs))t&&e.deleteProgram(t);this.progs={},e.deleteFramebuffer(this.fbo),e.deleteVertexArray(this.vao),e.deleteTexture(this.control)}finishJob(){this.job=null,this.progress=1,this.stats.totalMs=performance.now()-this.t0,this.version++}cancel(){this.job&&this.job.return(void 0),this.job=null,this.fence&&this.gl.deleteSync(this.fence),this.fence=null,this.freeTemps()}releaseResult(){this.texture&&this.gl.deleteTexture(this.texture),this.texture=null,this.ready=!1,this.cpuHeights=null,this.version++}freeTemps(){let e=this.gl;for(let t of this.temps)t instanceof WebGLTexture?e.deleteTexture(t):t instanceof WebGLRenderbuffer?e.deleteRenderbuffer(t):t instanceof WebGLBuffer?e.deleteBuffer(t):e.deleteVertexArray(t);this.temps.clear()}free(e){if(!e)return;let t=this.gl;this.temps.delete(e),e instanceof WebGLTexture?t.deleteTexture(e):e instanceof WebGLRenderbuffer?t.deleteRenderbuffer(e):t.deleteBuffer(e)}probe(){let e=this.gl,t=e.createFramebuffer(),n=e.getParameter(e.FRAMEBUFFER_BINDING),r=!0,i=[];e.bindFramebuffer(e.FRAMEBUFFER,t);for(let[t,n]of[[e.R32F,e.RED],[e.RG32F,e.RG],[e.RGBA32F,e.RGBA]]){let a=e.createTexture();i.push(a),e.bindTexture(e.TEXTURE_2D,a),so(e,e.NEAREST),e.texImage2D(e.TEXTURE_2D,0,t,4,4,0,n,e.FLOAT,null),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,a,0),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE&&(r=!1)}e.bindFramebuffer(e.FRAMEBUFFER,n),e.deleteFramebuffer(t);for(let t of i)e.deleteTexture(t);return r}withState(e){let t=this.gl,n=t.getParameter(t.DRAW_FRAMEBUFFER_BINDING),r=t.getParameter(t.READ_FRAMEBUFFER_BINDING),i=t.getParameter(t.VIEWPORT),a=t.getParameter(t.CURRENT_PROGRAM),o=t.getParameter(t.VERTEX_ARRAY_BINDING),s=t.getParameter(t.ARRAY_BUFFER_BINDING),c=[t.DEPTH_TEST,t.BLEND,t.SCISSOR_TEST,t.CULL_FACE].map(e=>[e,t.isEnabled(e)]),l=t.getParameter(t.DEPTH_WRITEMASK),u=t.getParameter(t.DEPTH_FUNC);for(let[e]of c)t.disable(e);try{e()}finally{t.bindFramebuffer(t.DRAW_FRAMEBUFFER,n),t.bindFramebuffer(t.READ_FRAMEBUFFER,r),t.viewport(i[0],i[1],i[2],i[3]),t.useProgram(a),t.bindVertexArray(o),t.bindBuffer(t.ARRAY_BUFFER,s),t.bindBuffer(t.PIXEL_PACK_BUFFER,null);for(let[e,n]of c)n?t.enable(e):t.disable(e);t.depthMask(l),t.depthFunc(u),t.activeTexture(t.TEXTURE0)}}prog(e){let t=this.progs[e];if(!t){let[n,r]=no[e];t=en(this.gl,`detail-${e}`,n,r),this.progs[e]=t}return t}loc(e,t){let n=this.locs.get(e);return n||(n=new Map,this.locs.set(e,n)),n.has(t)||n.set(t,this.gl.getUniformLocation(e,t)),n.get(t)??null}tex(e,t,n,r,i=null,a){let o=this.gl,s=o.createTexture();return o.bindTexture(o.TEXTURE_2D,s),so(o,o.NEAREST),o.pixelStorei(o.UNPACK_ALIGNMENT,1),o.texImage2D(o.TEXTURE_2D,0,e,n,r,0,t,a??o.FLOAT,i),this.temps.add(s),s}use(e,t,n){let r=this.gl,i=this.prog(e);r.useProgram(i),r.uniform1i(this.loc(i,`u_hasWater`),+!!t.water),r.uniform1i(this.loc(i,`u_n`),t.n),r.uniform1f(this.loc(i,`u_size`),t.size),r.uniform1i(this.loc(i,`u_D`),t.D);let a={u_macro:t.macroTex,u_wl:t.wlTex,...n},o=0;for(let[e,t]of Object.entries(a))r.activeTexture(r.TEXTURE0+o),r.bindTexture(r.TEXTURE_2D,t),r.uniform1i(this.loc(i,e),o),o++;for(let e=o;e<this.unitsUsed;e++)r.activeTexture(r.TEXTURE0+e),r.bindTexture(r.TEXTURE_2D,null);return this.unitsUsed=o,i}target(e,t,n,r=null,i){let a=this.gl;a.bindFramebuffer(a.FRAMEBUFFER,this.fbo);for(let t=0;t<2;t++)a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+t,a.TEXTURE_2D,e[t]??null,0);a.framebufferRenderbuffer(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.RENDERBUFFER,r),a.drawBuffers(e.length===2?[a.COLOR_ATTACHMENT0,a.COLOR_ATTACHMENT1]:[a.COLOR_ATTACHMENT0]),i?a.viewport(i[0],i[1],i[2],i[3]):a.viewport(0,0,t,n)}quad(){let e=this.gl;e.bindVertexArray(this.vao),e.drawArrays(e.TRIANGLES,0,3),this.passesDone++,this.stats.passes++,this.progress=Math.min(.99,this.passesDone/this.passesTotal)}est(e,t){let n=e/1e6*t/this.opts.gpuMtexPerMs;return this.stats.gpuEstMs+=n,Math.max(.01,n)}*prep(e,t){let n=performance.now(),r=yield*ja(e,t);this.stats.prepMs=performance.now()-n,this.stats.segments=r.segCount,this.params=r.params,this.size=t,this.controlData=r.control,this.controlSize=r.controlN,this.macroWater={macro:r.macro,water:r.water,n:r.n,worldSize:r.size};let i=this.gl;return i.bindTexture(i.TEXTURE_2D,this.control),i.pixelStorei(i.UNPACK_ALIGNMENT,1),i.texImage2D(i.TEXTURE_2D,0,i.RGBA8,r.controlN,r.controlN,0,i.RGBA,i.UNSIGNED_BYTE,r.control),r}*cpuPipeline(e,t){let n=yield*this.prep(e,t),r=performance.now(),i=Na(n,Math.min(4,this.opts.thermalSteps),this.opts),a=i.next(),o=0,s=t/16+n.segCount/1024+1+Math.min(4,this.opts.thermalSteps)*t/256;for(;!a.done;)o++,this.progress=Math.min(.99,o/s),yield 0,a=i.next();let c=a.value;this.stats.cpuBuildMs=performance.now()-r;let l=this.gl,u=l.createTexture();l.bindTexture(l.TEXTURE_2D,u),so(l,l.NEAREST),l.pixelStorei(l.UNPACK_ALIGNMENT,1),l.texImage2D(l.TEXTURE_2D,0,l.R32F,t,t,0,l.RED,l.FLOAT,c),this.texture=u,this.cpuHeights=c,this.ready=!0,this.version++}*gpuPipeline(e,t){let n=yield*this.prep(e,t),r=this.gl,i=this.opts,a=n.n,o=i.hydraulicSteps??(t>=4096?24:40),s=Math.min(t,io),c=Math.ceil(t/s),l=Math.floor(i.thermalSteps/2),u=i.thermalSteps-l;this.passesTotal=3+i.thermalSteps+(o>0?1+c*c*(2+3*o):0)+4+ +!!i.readback,this.passesDone=0;let d=this.tex(r.R32F,r.RED,a,a,n.macro),f=this.tex(r.R32F,r.RED,a,a,n.water??new Float32Array(a*a).fill(-1e4)),p={n:a,D:t,size:n.size,water:n.water!==null,macroTex:d,wlTex:f};for(let e of Object.keys(no))o===0&&e.startsWith(`h`)||(this.prog(e),yield 0);let m=this.tex(r.R32F,r.RED,t,t),h=r.createRenderbuffer();this.temps.add(h),r.bindRenderbuffer(r.RENDERBUFFER,h),r.renderbufferStorage(r.RENDERBUFFER,r.DEPTH_COMPONENT32F,t,t);let g=()=>{this.target([m],t,t,h),r.enable(r.DEPTH_TEST),r.depthFunc(r.LESS),r.depthMask(!0)};if(g(),r.clearBufferfv(r.COLOR,0,[1e6,0,0,0]),r.clearBufferfv(r.DEPTH,0,[1]),this.use(`cap`,p,{}),this.quad(),yield this.est(t*t,1),n.segCount>0){let e=r.createVertexArray(),t=r.createBuffer();this.temps.add(e),this.temps.add(t),r.bindVertexArray(e),r.bindBuffer(r.ARRAY_BUFFER,t),r.bufferData(r.ARRAY_BUFFER,n.segs,r.STATIC_DRAW),r.bindVertexArray(null);let i=16384;for(let a=0;a<n.segCount;a+=i){let o=Math.min(i,n.segCount-a);g(),this.use(`carve`,p,{}),r.bindVertexArray(e),r.bindBuffer(r.ARRAY_BUFFER,t);for(let e=0;e<3;e++)r.enableVertexAttribArray(e),r.vertexAttribPointer(e,4,r.FLOAT,!1,48,a*12*4+e*16),r.vertexAttribDivisor(e,1);r.drawArraysInstanced(r.TRIANGLE_STRIP,0,4,o),r.bindVertexArray(null);let s=0;for(let e=a;e<a+o;e++){let t=e*12,r=n.segs[t+11];s+=(Math.hypot(n.segs[t+2]-n.segs[t],n.segs[t+3]-n.segs[t+1])+2*r)*2*r}this.stats.passes++,yield this.est(s/(n.params.texel*n.params.texel),2)}this.passesDone++,this.temps.delete(e),r.deleteVertexArray(e),this.free(t)}r.disable(r.DEPTH_TEST),this.target([m],t,t,null),this.free(h);let _=this.tex(r.R32F,r.RED,t,t),v=this.tex(r.R32F,r.RED,t,t);{let e=this.use(`base`,p,{u_cap:m,u_ctl:this.control}),i=n.params;r.uniform1ui(this.loc(e,`u_seed`),i.seed>>>0),r.uniform1f(this.loc(e,`u_bakeLam0`),i.bakeLam0),r.uniform1i(this.loc(e,`u_bakeOct`),i.bakeOct),r.uniform1f(this.loc(e,`u_bakeAmpScale`),i.bakeAmpScale),this.target([_],t,t),this.quad(),yield this.est(t*t,4)}let y=function*(e){for(let a=0;a<e;a++){let e=this.use(`thermal`,p,{u_h:_,u_cap:m});r.uniform1f(this.loc(e,`u_talus`),i.talus*n.params.texel),r.uniform1f(this.loc(e,`u_rate`),i.thermalRate),this.target([v],t,t),this.quad(),[_,v]=[v,_],yield this.est(t*t,1.5)}};if(yield*y.call(this,l),o>0){this.use(`copy`,p,{u_h:_}),this.target([v],t,t),this.quad(),yield this.est(t*t,.3);let e=c>1?ao:0,n=s+2*e,a=this.tex(r.RGBA32F,r.RGBA,n,n),l=this.tex(r.RGBA32F,r.RGBA,n,n),u=this.tex(r.RGBA32F,r.RGBA,n,n),d=this.tex(r.RGBA32F,r.RGBA,n,n),f=this.tex(r.RG32F,r.RG,n,n),h=i.hydro,g=(e,t)=>{r.uniform1i(this.loc(e,`u_T`),n),r.uniform2i(this.loc(e,`u_org`),t[0],t[1]),r.uniform1f(this.loc(e,`u_dt`),h.dt),r.uniform1f(this.loc(e,`u_K`),h.K),r.uniform1f(this.loc(e,`u_rain`),h.rain)};for(let i=0;i<c;i++)for(let y=0;y<c;y++){let c=[y*s-e,i*s-e],b=a,x=l,S=u,C=d,w=this.use(`hinit`,p,{u_h:_});r.uniform2i(this.loc(w,`u_org`),c[0],c[1]),this.target([b],n,n),this.quad(),this.target([S],n,n),r.clearBufferfv(r.COLOR,0,[0,0,0,0]),yield this.est(n*n,.5);for(let e=0;e<o;e++)w=this.use(`hflux`,p,{u_A:b,u_F:S}),g(w,c),this.target([C],n,n),this.quad(),[S,C]=[C,S],w=this.use(`hwater`,p,{u_A:b,u_F:S}),g(w,c),r.uniform1f(this.loc(w,`u_Kc`),h.Kc),r.uniform1f(this.loc(w,`u_Ks`),h.Ks),r.uniform1f(this.loc(w,`u_Kd`),h.Kd),r.uniform1f(this.loc(w,`u_amin`),h.amin),r.uniform1f(this.loc(w,`u_dmax`),h.dmax),r.uniform1f(this.loc(w,`u_maxStep`),h.maxStep),this.target([x,f],n,n),this.quad(),w=this.use(`hadvect`,p,{u_A:x,u_F:S,u_V:f,u_h:_,u_cap:m}),g(w,c),r.uniform1f(this.loc(w,`u_Ke`),h.Ke),this.target([b],n,n),this.quad(),yield this.est(n*n,3);w=this.use(`hwrite`,p,{u_A:b}),r.uniform2i(this.loc(w,`u_org`),c[0],c[1]);let T=y*s,E=i*s;this.target([v],t,t,null,[T,E,Math.min(s,t-T),Math.min(s,t-E)]),this.quad(),yield this.est(s*s,.3)}for(let e of[a,l,u,d,f])this.free(e);[_,v]=[v,_]}yield*y.call(this,u);{let e=this.tex(r.R32F,r.RED,a,a),n=this.tex(r.R32F,r.RED,a,a);this.use(`adown`,p,{u_h:_}),this.target([e],a,a),this.quad(),yield this.est(a*a*16,2);let o=this.use(`ablur`,p,{u_src:e});r.uniform2i(this.loc(o,`u_dir`),1,0),this.target([n],a,a),this.quad(),o=this.use(`ablur`,p,{u_src:n}),r.uniform2i(this.loc(o,`u_dir`),0,1),this.target([e],a,a),this.quad(),yield this.est(a*a,2),o=this.use(`afinal`,p,{u_h:_,u_low:e,u_cap:m}),r.uniform1f(this.loc(o,`u_a`),i.anchorMetres),this.target([v],t,t),this.quad(),[_,v]=[v,_],yield this.est(t*t,1.5),this.free(e),this.free(n)}if(this.free(m),this.free(v),this.free(d),this.free(f),r.bindFramebuffer(r.FRAMEBUFFER,this.fbo),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,null,0),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT1,r.TEXTURE_2D,null,0),this.temps.delete(_),this.texture=_,this.ready=!0,this.version++,!i.readback)return;let b=performance.now(),x=this.tex(r.RGBA32F,r.RGBA,t/4,t);this.use(`pack`,p,{u_h:_}),this.target([x],t/4,t),this.quad(),r.bindFramebuffer(r.READ_FRAMEBUFFER,this.fbo),r.readBuffer(r.COLOR_ATTACHMENT0);let S=new Float32Array(t*t);if(this.syncMode)r.readPixels(0,0,t/4,t,r.RGBA,r.FLOAT,S);else{let e=r.createBuffer();this.temps.add(e),r.bindBuffer(r.PIXEL_PACK_BUFFER,e),r.bufferData(r.PIXEL_PACK_BUFFER,t*t*4,r.STREAM_READ),r.readPixels(0,0,t/4,t,r.RGBA,r.FLOAT,0),r.bindBuffer(r.PIXEL_PACK_BUFFER,null);let n=r.fenceSync(r.SYNC_GPU_COMMANDS_COMPLETE,0);if(r.flush(),n)try{for(;r.clientWaitSync(n,0,0)===r.TIMEOUT_EXPIRED;)yield ro}finally{r.deleteSync(n)}let i=2097152;for(let n=0;n<t*t;n+=i)r.bindBuffer(r.PIXEL_PACK_BUFFER,e),r.getBufferSubData(r.PIXEL_PACK_BUFFER,n*4,S,n,Math.min(i,t*t-n)),r.bindBuffer(r.PIXEL_PACK_BUFFER,null),yield 0;this.free(e)}this.free(x),this.cpuHeights=S,this.stats.readbackMs=performance.now()-b,this.version++}};function so(e,t){e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}var co=Math.PI/4;function*lo(e,t){let n=e.n,r=n+4,i=6*n*n,a=function*(e,t){let i=new Float32Array(6*r*r*t);for(let r=0;r<6;r++)Un(e,n,r,2,t,i),yield 0;return i},o=yield*a(e.elevation,1),s=e.waterLevel??null,c=s?yield*a(s,1):new Float32Array(6*r*r),l=s?c:null,u=e.radius*Math.PI/2/n,d=new Float32Array(i),f=new Float32Array(i*4),p=e.waterClass??null,m=e.discharge??null,h=e.biome??null,g=e=>{let t=c[e];return t>-9e3&&o[e]<t},_=e=>g(e)&&Math.abs(c[e])<.5;for(let e=0;e<6;e++)for(let t=0;t<n;t++){for(let i=0;i<n;i++){let a=e*r*r+(t+2)*r+i+2,s=(e*n+t)*n+i,c=1/0,l=-1/0,v=!1,y=!1;for(let e=-1;e<=1;e++)for(let t=-1;t<=1;t++){let n=a+e*r+t,i=o[n];i<c&&(c=i),i>l&&(l=i),_(n)?v=!0:g(n)||(y=!0)}d[s]=v&&y?1:0;let b=(o[a+1]-o[a-1])/(2*u),x=(o[a+r]-o[a-r])/(2*u),S=Math.hypot(b,x),C=(l-c)*(u>=1e3?1e3/u:1),w=h?h[s]&31:6,T=+!!g(a);p&&(p[s]===2||p[s]===3||p[s]===6)&&(T=1),m&&(T=Math.max(T,.5*U(1,2.5,m[s]))),f[s*4]=Math.min(1,Math.max(.03,(.65*U(.02,.35,S)+.45*U(30,900,C))*Ca[w])),f[s*4+1]=Math.max(wa[w],U(.25,.6,S))*(1-T),f[s*4+2]=T}(t&15)==15&&(yield 0)}let v=yield*a(d,1),y=e.waterRaw??null,b=new Float32Array(i);for(let e=0;e<i;e++)b[e]=y?+(y[e]>-9e3&&!(p&&p[e]===3)):1;let x=yield*a(b,1),S=yield*a(f,4),C=new Uint8Array(S.length);for(let e=0;e<S.length;e++)C[e]=Math.round(255*Math.min(1,Math.max(0,S[e]))),(e&1048575)==1048575&&(yield 0);let w=null,T=null,E=null,D=e.rivers??null;if(D&&D.graph.n>0){let e=D.graph.n;w=new Float32Array(e*3);let n=new Int32Array(e),r=6*t.T*t.T;E=new Int32Array(r+1);let i=new Float64Array(3);for(let r=0;r<e;r++){D.nodeDir(r,i),w[r*3]=i[0],w[r*3+1]=i[1],w[r*3+2]=i[2];let e=wo(t,i[0],i[1],i[2]);n[r]=e,E[e+1]++,(r&32767)==32767&&(yield 0)}for(let e=0;e<r;e++)E[e+1]+=E[e];let a=E.slice(0,r);T=new Int32Array(e);for(let t=0;t<e;t++)T[a[n[t]]++]=t;yield 0}return{lattice:t,params:ki(t,e.seed),n,radius:e.radius,macroPad:o,waterPad:c,levelPad:l,surfacePad:e.surfacePad??null,coastPad:v,wetPad:x,controlPad:C,riverDirs:w,riverOrder:T,riverStart:E,riverMap:w?new Int32Array(D.graph.n).fill(-1):null,rivers:D}}function uo(e,t,n,r,i,a=1,o=0){let s=fo;Wn(n,r,i,s);let c=t+4,l=Math.PI/2/t,u=Math.min(c-1.001,Math.max(0,(s[1]+co)/l-.5+2)),d=Math.min(c-1.001,Math.max(0,(s[2]+co)/l-.5+2)),f=Math.floor(u),p=Math.floor(d),m=u-f,h=d-p,g=s[0]*c*c+p*c+f,_=t=>e[t*a+o],v=_(g)+(_(g+1)-_(g))*m;return v+(_(g+c)+(_(g+c+1)-_(g+c))*m-v)*h}var fo=new Float64Array(3),po=new Float64Array(3);function mo(e,t){let n=e.lattice,[r,i,a]=_i(t,n.T),{N:o,A:s,k:c,n:l}=n,u=o+2*s,d=u/c,f=i*o-s,p=a*o-s,m=f/c,h=p/c,g=l+4,_=new Float32Array(d*d),v=new Float32Array(d*d),y=new Float32Array(d*d),b=new Float32Array(d*d),x=new Uint8Array(d*d*4),S=new Float64Array(3),C=c*n.delta;for(let t=0;t<d;t++)for(let n=0;n<d;n++){let i=m+n,a=h+t,o=t*d+n;if(i>=0&&a>=0&&i<l&&a<l){let t=r*g*g+(a+2)*g+i+2;_[o]=e.macroPad[t],v[o]=e.waterPad[t],y[o]=e.coastPad[t],b[o]=e.wetPad[t];for(let n=0;n<4;n++)x[o*4+n]=e.controlPad[t*4+n]}else{Je(r,-co+(i+.5)*C,-co+(a+.5)*C,S),_[o]=uo(e.macroPad,l,S[0],S[1],S[2]),v[o]=uo(e.waterPad,l,S[0],S[1],S[2]),y[o]=uo(e.coastPad,l,S[0],S[1],S[2]),b[o]=uo(e.wetPad,l,S[0],S[1],S[2]);for(let t=0;t<4;t++)x[o*4+t]=Math.round(uo(e.controlPad,l,S[0],S[1],S[2],4,t))}}let w=n.texelM,T=c*w,E=new Float32Array(d*d);for(let e=0;e<d;e++)for(let t=0;t<d;t++){let n=Math.max(0,t-1),r=Math.min(d-1,t+1),i=Math.max(0,e-1),a=Math.min(d-1,e+1),o=(_[e*d+r]-_[e*d+n])/(Math.max(1,r-n)*T),s=(_[a*d+t]-_[i*d+t])/(Math.max(1,a-i)*T);E[e*d+t]=Math.hypot(o,s)}let D=Wr(u*w,u,d,e.params.seed),{segs:O,count:k}=ho(e,r,f,p,u,E,d,D);return{key:t,face:r,D:u,nl:d,k:c,ox:f,oy:p,a0:-co+f*n.delta,b0:-co+p*n.delta,delta:n.delta,texelM:w,radius:n.radius,seed:e.params.seed,globe:e.params,params:D,macro:_,water:v,coast:y,wet:b,control:x,slope:E,segs:O,segCount:k}}function ho(e,t,n,r,i,a,o,s){let c=e.rivers,l=e.riverDirs,u=e.riverOrder,d=e.riverStart,f=e.riverMap;if(!c||!l||!u||!d||!f)return{segs:new Float32Array,count:0};let p=c.graph,m=e.lattice,h=i*m.texelM,g=.25*h+20*m.k*m.texelM,_=gi(t,Math.floor((n+m.A)/m.N),Math.floor((r+m.A)/m.N),m.T),v=new Float64Array(3),y=new Float64Array(3),b=yi(m,_,v),x=[],S=e=>{f[e]>=0||(f[e]=x.length,x.push(e))};for(let e=0;e<d.length-1;e++){if(d[e+1]===d[e])continue;let t=yi(m,e,y);if(!(Math.acos(Math.min(1,v[0]*y[0]+v[1]*y[1]+v[2]*y[2]))>b+t+g/m.radius))for(let t=d[e];t<d[e+1];t++)S(u[t])}let C=x.length;for(let e=0;e<C;e++){let t=p.down[x[e]];t>=0&&t<p.n&&S(t)}let w=x.length,T=new Float32Array(w).fill(NaN),E=new Float32Array(w).fill(NaN),D=new Float32Array(w),O=new Float32Array(w),k=new Float32Array(w),A=new Int32Array(w).fill(-1),j=t*3,M=new Float64Array(2);for(let e=0;e<w;e++){let i=x[e];if(D[e]=p.zWater[i],O[e]=p.zBed[i],k[e]=p.width[i],e<C){let t=p.down[i];A[e]=t>=0&&t<p.n?f[t]:-1}let a=l[i*3],o=l[i*3+1],s=l[i*3+2];if(a*F[j]+o*F[j+1]+s*F[j+2]<.3)continue;Si(t,a,o,s,M);let c=((M[0]+co)/m.delta-n)*m.texelM,u=((M[1]+co)/m.delta-r)*m.texelM;c<-g||u<-g||c>h+g||u>h+g||(T[e]=c,E[e]=u)}for(let e of x)f[e]=-1;return Oa({n:w,x:T,y:E,zWater:D,zBed:O,width:k,down:A},a,o,s)}function go(e,t,n,r=1){let i=n*G.COAST_RELAX;if(t>H.DRY){let n=pi(t,r);return e<n?[-1e30,n-.5+i]:[n+.5-i,1e30]}return[e>=.5?.5-i:-1e30,1e30]}function _o(e,t,n,r,i){let a=n*t-.5,o=r*t-.5,s=Math.floor(a),c=Math.floor(o),l=a-s,u=o-c,d=Math.min(t-1,Math.max(0,s)),f=Math.min(t-1,Math.max(0,s+1)),p=Math.min(t-1,Math.max(0,c)),m=Math.min(t-1,Math.max(0,c+1));for(let n=0;n<4;n++){let r=e[(p*t+d)*4+n],a=e[(p*t+f)*4+n],o=e[(m*t+d)*4+n],s=e[(m*t+f)*4+n],c=r+(a-r)*l;i[n]=(c+(o+(s-o)*l-c)*u)/255}}function*vo(e,t,n){let{D:r,nl:i,k:a,texelM:o,radius:s}=e,c=e.globe,l=new Float32Array(r*r),u=new Float32Array(r*r),d=new Float32Array(r*r),f=new Float64Array(5),p=new Float64Array(3),m=new Float64Array(4),h=new Float64Array(3),g=new Float64Array(4),_=new Float64Array(4),v=new Float64Array(4),y=a*o,b=a*e.delta;for(let t=0;t<r;t++){let n=e.b0+(t+.5)*e.delta,x=(t+.5)/a-.5;for(let S=0;S<r;S++){let C=e.a0+(S+.5)*e.delta,w=(S+.5)/a-.5;Je(e.face,C,n,h),ri(e.macro,i,w,x,f);let T=ei(e.macro,i,w,x,p)[0],E=ei(e.water,i,w,x,p)[0],D=ei(e.coast,i,w,x,p)[0],[O,k]=go(T,E,D,ei(e.wet,i,w,x,p)[0]);_o(e.control,i,(S+.5)/r,(t+.5)/r,m),Ci(e.face,C,n,f[1]/b,f[2]/b,s,g),_.fill(0);let A=(H.BAKE_BASE+H.BAKE_ROUGH*m[0])*c.bakeAmpScale*(1-m[2]),j=h[0]*s,M=h[1]*s,N=h[2]*s;c.bakeOct>0&&Oi(j,M,N,h,o,c.bakeLam0,c.bakeOct,A,m[1],g,(c.seed^H.SEED_BAKE)>>>0,_);let ee=Math.min(G.COAST_MAX,Math.max(G.COAST_MIN,Math.hypot(f[1],f[2])/y*G.COAST_DISP))*D,te=0;ee>0&&c.bakeOct>0&&(v.fill(0),te=Oi(j,M,N,h,o,.5*c.bakeLam0,c.bakeOct,ee,0,v,(c.seed^G.SEED_COAST)>>>0,new Float64Array(4))[0]);let ne=t*r+S;l[ne]=f[0]+_[0]+te,u[ne]=O,d[ne]=k}(t&3)==3&&(yield 0)}if(e.segCount>0){let t=yo(e);for(let e=0;e<r*r;e++)t[e]>u[e]&&(u[e]=t[e])}for(let t=0;t<e.segCount;t++)Fa(e,t,u,d);for(let e=0;e<r*r;e++)l[e]=Math.min(Math.max(l[e],u[e]),d[e]);yield 0;let x=l,S=new Float32Array(r*r);for(let e=0;e<t;e++){for(let e=0;e<r;e++)Pa(x,S,u,d,r,e,n.talus*o,n.thermalRate),(e&255)==255&&(yield 0);[x,S]=[S,x]}return x}function yo(e){let t=e.D,n=e.texelM,r=new Float32Array(t*t).fill(1/0),i=e.segs;for(let a=0;a<e.segCount;a++){let e=a*12,o=i[e],s=i[e+1],c=i[e+2],l=i[e+3],u=.5*i[e+8],d=u+i[e+9],f=Math.max(0,Math.floor((Math.min(o,c)-d)/n)),p=Math.min(t-1,Math.ceil((Math.max(o,c)+d)/n)),m=Math.max(0,Math.floor((Math.min(s,l)-d)/n)),h=Math.min(t-1,Math.ceil((Math.max(s,l)+d)/n)),g=c-o,_=l-s,v=g*g+_*_;for(let a=m;a<=h;a++){let c=(a+.5)*n;for(let l=f;l<=p;l++){let f=(l+.5)*n,p=v>0?Math.min(1,Math.max(0,((f-o)*g+(c-s)*_)/v)):0,m=Math.hypot(f-o-p*g,c-s-p*_);if(m>=d)continue;let h=i[e+4]+(i[e+5]-i[e+4])*p,y=i[e+6]+(i[e+7]-i[e+6])*p,b=m/u,x=(m<u?h+(y-h)*b*b:y)-1;x<r[a*t+l]&&(r[a*t+l]=x)}}}for(let e=0;e<r.length;e++)r[e]===1/0&&(r[e]=-1e30);return r}function bo(e,t){let n=t.N+2*t.A,r=vi(t),i=t.A-t.M,a=new Float32Array(r*r);for(let t=0;t<r;t++)a.set(e.subarray((t+i)*n+i,(t+i)*n+i+r),t*r);return a}var xo=.4,So=2.5,Co=class{lattice;slots;slotOf=new Map;keyOf;ready;fade;data;lastWanted;frame=0;wanted=[];wantedSet=new Set;centres;radii;constructor(e,t){this.lattice=e,this.slots=t,this.keyOf=new Int32Array(t).fill(-1),this.ready=new Uint8Array(t),this.fade=new Float32Array(t),this.data=Array(t).fill(null),this.lastWanted=new Float64Array(t).fill(-1);let n=6*e.T*e.T;this.centres=new Float32Array(n*3),this.radii=new Float32Array(n);let r=new Float64Array(3);for(let t=0;t<n;t++)this.radii[t]=yi(e,t,r)+e.B*e.delta,this.centres.set(r,t*3)}get tileCount(){return this.radii.length}get residentCount(){let e=0;for(let t=0;t<this.slots;t++)this.ready[t]&&e++;return e}tile(e){let t=this.slotOf.get(e);return t===void 0||!this.ready[t]?null:{data:this.data[t],fade:this.fade[t]}}tileView(e,t){let n=this.lattice,r=n.radius,i=t.eye,a=Math.hypot(i.x,i.y,i.z),o=this.centres[e*3],s=this.centres[e*3+1],c=this.centres[e*3+2],l=Math.acos(Math.max(-1,Math.min(1,(i.x*o+i.y*s+i.z*c)/a))),u=Math.max(0,l-this.radii[e]),d=Math.max(0,Math.sqrt(Math.max(0,a*a+r*r-2*a*r*Math.cos(u)))-t.maxHeight),f=!0;a>r+t.maxHeight&&(f=u<Math.acos(r/a)+Math.acos(r/(r+t.maxHeight)));let p=!0;if(t.planes&&f&&d>0){let[a,o,s]=_i(e,n.T),c=n.N*n.delta,l=new Float64Array(3),u=new Float64Array(54),d=1/0,m=1/0,h=1/0,g=-1/0,_=-1/0,v=-1/0,y=0,b=r,x=(r+t.maxHeight)/Math.cos(Math.min(1.5,c+2*n.B*n.delta)/2);for(let e=0;e<3;e++)for(let t=0;t<3;t++){Je(a,-co+o*c+t*c/2,-co+s*c+e*c/2,l);for(let e of[b,x]){let t=l[0]*e,n=l[1]*e,r=l[2]*e;u[y++]=t,u[y++]=n,u[y++]=r,d=Math.min(d,t),g=Math.max(g,t),m=Math.min(m,n),_=Math.max(_,n),h=Math.min(h,r),v=Math.max(v,r)}}let S=n.B*n.texelM*2;p=Hr(t.planes,d-S-i.x,m-S-i.y,h-S-i.z,g+S-i.x,_+S-i.y,v+S-i.z),Br(u,18,i,r*(1-1e-7))&&(f=!1)}return{dist:d,visible:f,inFrustum:p}}plan(e){this.frame++;let t=So*this.lattice.texelM/Math.max(1e-12,e.pxScale),n=[];for(let r=0;r<this.tileCount;r++){let i=this.tileView(r,e);!i.visible||i.dist>t||n.push({key:r,score:i.dist+(i.inFrustum?0:4*t)})}n.sort((e,t)=>e.score-t.score||e.key-t.key),this.wanted=n.slice(0,this.slots).map(e=>e.key),this.wantedSet=new Set(this.wanted);for(let e of this.wanted){let t=this.slotOf.get(e);t!==void 0&&(this.lastWanted[t]=this.frame)}return this.wanted}next(){for(let e of this.wanted)if(!this.slotOf.has(e))return e;return-1}acquire(e){let t=this.slotOf.get(e);if(t!==void 0)return t;let n=-1;for(let e=0;e<this.slots;e++){if(this.keyOf[e]<0){n=e;break}!this.wantedSet.has(this.keyOf[e])&&this.ready[e]&&(n<0||this.lastWanted[e]<this.lastWanted[n])&&(n=e)}return n<0?-1:(this.evictSlot(n),this.keyOf[n]=e,this.slotOf.set(e,n),this.lastWanted[n]=this.frame,n)}commit(e,t=null){let n=this.slotOf.get(e);n!==void 0&&(this.ready[n]=1,this.fade[n]=0,t&&(this.data[n]=t))}setData(e,t){let n=this.slotOf.get(e);n!==void 0&&(this.data[n]=t)}release(e){let t=this.slotOf.get(e);t!==void 0&&this.evictSlot(t)}tick(e){let t=!1;for(let n=0;n<this.slots;n++)!this.ready[n]||this.fade[n]>=1||(this.fade[n]=Math.min(1,this.fade[n]+Math.max(0,e)/xo),t=!0);return t}writeIndex(e){e.fill(0);for(let t=0;t<e.length;t+=2)e[t]=-1;for(let t=0;t<this.slots;t++){let n=this.keyOf[t];n<0||!this.ready[t]||(e[n*2]=t,e[n*2+1]=this.fade[t])}}clear(){for(let e=0;e<this.slots;e++)this.evictSlot(e);this.wanted=[],this.wantedSet.clear()}evictSlot(e){let t=this.keyOf[e];t>=0&&this.slotOf.delete(t),this.keyOf[e]=-1,this.ready[e]=0,this.fade[e]=0,this.data[e]=null,this.lastWanted[e]=-1}};function wo(e,t,n,r){let i=po;Wn(t,n,r,i);let a=Math.min(e.T-1,Math.max(0,Math.floor((i[1]+co)/(e.N*e.delta)))),o=Math.min(e.T-1,Math.max(0,Math.floor((i[2]+co)/(e.N*e.delta))));return gi(i[0],a,o,e.T)}var To={tileN:1024,slots:12,thermalSteps:ba.thermalSteps,hydraulicSteps:24,anchorMetres:ba.anchorMetres,talus:ba.talus,thermalRate:ba.thermalRate,hydro:ba.hydro,gpuMtexPerMs:5,readback:!0,idleFreeMs:5e3};function Eo(e){switch(e){case`low`:return{tileN:512,slots:8,hydraulicSteps:16,thermalSteps:16};case`medium`:return{tileN:1024,slots:8};case`high`:return{tileN:1024,slots:12}}}var Do=`#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
${ga}
${Zi}
uniform sampler2D u_macro;   // R32F local macro (nl x nl), row = chart b
uniform sampler2D u_wl;      // R32F local water level, < -9000 dry
uniform sampler2D u_coast;   // R32F local coastal band (0..1)
uniform sampler2D u_wet;     // R32F local real-water mask (effective water level)
uniform sampler2D u_floor;   // R32F per texel: river channel floor − 1 m (min of capsules), 1e30 where none
uniform int u_hasWater;
uniform int u_n;
uniform float u_size;
uniform int u_D;
float bTexel() { return u_size / float(u_D); }
float bCell() { return u_size / float(u_n); }
vec2 bMacroQ(vec2 pm) { return pm / u_size * float(u_n) - 0.5; }
// Water bounds (lo, hi), mirrors detailTiles.tileBounds: the flat rule, relaxed inside the coastal band.
vec2 bBounds(vec2 pm) {
  vec2 q = bMacroQ(pm);
  float hb = dnBilinear(u_macro, u_n, q).x;
  float wl = u_hasWater == 1 ? dnBilinear(u_wl, u_n, q).x : 0.0;
  float c = dnBilinear(u_coast, u_n, q).x * G_COAST_RELAX;
  // Erosion may not dig carved channels deeper than their bed (ribbons would float above them).
  float fl = texelFetch(u_floor, clamp(ivec2(pm / bTexel()), ivec2(0), ivec2(u_D - 1)), 0).r;
  if (fl > 1e29) fl = -1e30;
  if (wl > DN_DRY) {
    wl = gWetLevel(wl, dnBilinear(u_wet, u_n, q).x);
    return hb < wl ? vec2(fl, wl - 0.5 + c) : vec2(max(wl + 0.5 - c, fl), 1e30);
  }
  return vec2(max(hb >= 0.5 ? 0.5 - c : -1e30, fl), 1e30);
}
float bDepth(float z) { return clamp((z - (${xa}.0)) / (${Sa-xa}.0), 0.0, 1.0); }
`,Oo=`${Do}
uniform sampler2D u_cap;
uniform sampler2D u_ctl;
uniform uint u_seed;
uniform float u_bakeLam0;
uniform int u_bakeOct;
uniform float u_bakeAmpScale;
uniform vec3 u_tC;
uniform vec3 u_tE;
uniform vec3 u_tS;
uniform vec2 u_org;
uniform float u_delta;
uniform float u_R;
out float o;
void main() {
  vec2 pm = gl_FragCoord.xy * bTexel();
  vec2 t = tan(u_org + gl_FragCoord.xy * u_delta);
  vec3 up = normalize(u_tC + t.x * u_tE + t.y * u_tS);
  vec3 P = up * u_R;
  vec2 mm;
  vec3 m = dnBicubic(u_macro, u_n, bMacroQ(pm), mm);
  vec3 et = normalize(u_tE - dot(u_tE, up) * up);
  vec3 st = normalize(u_tS - dot(u_tS, up) * up);
  vec3 g0 = (m.y * et + m.z * st) / bCell();
  vec4 c = textureLod(u_ctl, pm / u_size, 0.0);
  float amp = (G_BAKE_BASE + G_BAKE_ROUGH * c.r) * u_bakeAmpScale * (1.0 - c.b);
  float nz = u_bakeOct > 0 ? gFbmAt(P, up, bTexel(), u_bakeLam0, u_bakeOct, amp, c.g, g0, u_seed ^ G_SEED_BAKE).x : 0.0;
  float coast = dnBilinear(u_coast, u_n, bMacroQ(pm)).x;
  float ac = clamp(length(m.yz) / bCell() * G_COAST_DISP, G_COAST_MIN, G_COAST_MAX) * coast;
  float cz = ac > 0.0 && u_bakeOct > 0 ? gFbmAt(P, up, bTexel(), 0.5 * u_bakeLam0, u_bakeOct, ac, 0.0, vec3(0.0), u_seed ^ G_SEED_COAST).x : 0.0;
  vec2 b = bBounds(pm);
  o = min(max(m.x + nz + cz, b.x), texelFetch(u_cap, ivec2(gl_FragCoord.xy), 0).r);
}`,ko=`${Do}
flat in vec4 v_seg;
flat in vec4 v_z;
flat in vec4 v_w;
out float o;
void main() {
  vec2 p = gl_FragCoord.xy * bTexel();
  vec2 a = v_seg.xy, ab = v_seg.zw - v_seg.xy;
  float L2 = dot(ab, ab);
  float t = L2 > 0.0 ? clamp(dot(p - a, ab) / L2, 0.0, 1.0) : 0.0;
  float r = length(p - a - t * ab);
  float half_ = 0.5 * v_w.x;
  if (r >= half_ + v_w.y) discard;
  float zb = mix(v_z.x, v_z.y, t), zw = mix(v_z.z, v_z.w, t);
  float u = r / half_;
  float z = (r < half_ ? zb + (zw - zb) * u * u : zw) - 1.0;
  o = z;
  gl_FragDepth = bDepth(z);
}`,Ao=`${Do}
uniform sampler2D u_h;
uniform int u_off;
out float o;
void main() { o = texelFetch(u_h, ivec2(gl_FragCoord.xy) + u_off, 0).r; }`,jo=`${Do}
uniform sampler2D u_h;
uniform int u_off;
out vec4 o;
void main() {
  ivec2 b = ivec2(int(gl_FragCoord.x) * 4, int(gl_FragCoord.y)) + u_off;
  o = vec4(texelFetch(u_h, b, 0).r, texelFetch(u_h, b + ivec2(1, 0), 0).r, texelFetch(u_h, b + ivec2(2, 0), 0).r, texelFetch(u_h, b + ivec2(3, 0), 0).r);
}`,Mo=to(Do),No={cap:Mo.cap,carve:Mo.carve,thermal:Mo.thermal,copy:Mo.copy,hinit:Mo.hinit,hflux:Mo.hflux,hwater:Mo.hwater,hadvect:Mo.hadvect,hwrite:Mo.hwrite,adown:Mo.adown,ablur:Mo.ablur,afinal:Mo.afinal,tfloor:[Mo.carve[0],ko],tbase:[Ra,Oo],textract:[Ra,Ao],tpack:[Ra,jo]},Po=-1,Fo=class{gl;params=null;lattice=null;controlTex=null;tileTex=null;idxTex=null;cache=null;fn=null;boundsPad=0;gpu;opts;stats={path:`none`,prepMs:0,compileMs:0,built:0,lastTileMs:0,lastTileCpuMs:0,lastReadbackMs:0,maxSliceMs:0,meanTileMs:0,gpuScale:2.5,sliceGpuMs:[]};version=0;prepared=null;job=null;jobKey=-1;fence=null;progs={};compiled=!1;locs=new Map;fbo;vao;scratch=null;idxData=null;idxDirty=!1;lastBuild=0;unitsUsed=0;tileTotalMs=0;gpuScale=2.5;timer;queries=[];get timerBusy(){return this.queries.length>4}constructor(e,t={}){this.gl=e,this.opts={...To,...t,hydro:{...To.hydro,...t.hydro??{}}},this.gpu=e.getExtension(`EXT_color_buffer_float`)!==null&&Lo(e),this.timer=e.getExtension(`EXT_disjoint_timer_query_webgl2`),this.fbo=e.createFramebuffer(),this.vao=e.createVertexArray()}get residentCount(){return this.cache?this.cache.residentCount:0}get busy(){if(this.job)return!0;let e=this.cache;if(!e)return!1;for(let t=0;t<e.slots;t++)if(e.ready[t]&&e.fade[t]<1)return!0;return e.next()>=0}setWorld(e){if(this.cancel(),this.releaseWorld(),!e)return;let t=hi(e.n,e.radius,this.opts.tileN);this.lattice=t,this.stats={...this.stats,path:this.gpu?`gpu`:`cpu`,prepMs:0,built:0,lastTileMs:0,lastTileCpuMs:0,lastReadbackMs:0,maxSliceMs:0,meanTileMs:0,sliceGpuMs:[]},this.tileTotalMs=0,this.job=this.prepJob(e,t),this.jobKey=-1}update(e,t,n){let r=performance.now(),i=!1,a=this.cache;if(a&&this.prepared&&(a.plan(e),!this.job)){let e=a.next();e>=0&&a.acquire(e)>=0&&(this.job=this.tileJob(e),this.jobKey=e,this.idxDirty=!0)}return this.pollTimers(),this.job&&(i=this.step(n)||i),a&&a.tick(t)&&(this.idxDirty=!0),this.idxDirty&&(this.uploadIndex(),i=!0),!this.job&&this.scratch&&performance.now()-this.lastBuild>this.opts.idleFreeMs&&this.freeScratch(),this.stats.maxSliceMs=Math.max(this.stats.maxSliceMs,performance.now()-r),i}dispose(){this.cancel(),this.releaseWorld();let e=this.gl;for(let t of Object.values(this.progs))t&&e.deleteProgram(t);this.progs={},this.compiled=!1;for(let{q:t}of this.queries)e.deleteQuery(t);this.queries=[],e.deleteFramebuffer(this.fbo),e.deleteVertexArray(this.vao)}memoryBytes(){let e=this.lattice,t=e?vi(e):0,n=this.tileTex&&e?t*t*4*this.opts.slots:0,r=this.prepared?this.prepared.n+4:0,i=this.controlTex?6*r*r*4:0,a=this.scratch,o=a?a.D*a.D:0,s=a?o*92+a.nl*a.nl*28+t*t*4*2:0,c=0;if(this.cache)for(let e of this.cache.data)e&&(c+=e.byteLength);return this.prepared&&(c+=this.prepared.macroPad.byteLength*3+this.prepared.controlPad.byteLength),{tiles:n,control:i,scratch:s,cpu:c}}step(e){let t=this.job;if(!t)return!1;let n=this.gl;if(this.fence){if(n.clientWaitSync(this.fence,0,0)===n.TIMEOUT_EXPIRED)return!1;n.deleteSync(this.fence),this.fence=null}let r=0,i=!1,a=!1,o=0,s=this.residentCount,c=this.timer,l=c&&!this.timerBusy?n.createQuery():null;return l&&n.beginQuery(c.TIME_ELAPSED_EXT,l),this.withState(()=>{for(;r<e;){let e=performance.now(),n=t.next();if(r+=performance.now()-e,n.done){a=!0;break}if(n.value===Po)break;n.value>0&&(i=!0,o+=n.value,r+=n.value*this.gpuScale)}}),l&&(n.endQuery(c.TIME_ELAPSED_EXT),this.queries.push({q:l,est:o})),i&&!a&&(this.fence=n.fenceSync(n.SYNC_GPU_COMMANDS_COMPLETE,0)),a&&(this.job=null,this.jobKey=-1,this.lastBuild=performance.now()),this.residentCount!==s}pollTimers(){let e=this.gl,t=this.timer;if(!t||this.queries.length===0)return;let n=e.getParameter(t.GPU_DISJOINT_EXT);for(;this.queries.length>0;){let{q:t,est:r}=this.queries[0];if(!e.getQueryParameter(t,e.QUERY_RESULT_AVAILABLE))break;let i=e.getQueryParameter(t,e.QUERY_RESULT)/1e6;e.deleteQuery(t),this.queries.shift(),!n&&(this.stats.sliceGpuMs.push(i),this.stats.sliceGpuMs.length>256&&this.stats.sliceGpuMs.shift(),!(r<.3)&&(this.gpuScale=Math.min(20,Math.max(.25,.7*this.gpuScale+i/r*.3))))}this.stats.gpuScale=this.gpuScale}cancel(){this.job&&this.job.return(void 0),this.job=null,this.jobKey>=0&&this.cache&&this.cache.release(this.jobKey),this.jobKey=-1,this.fence&&this.gl.deleteSync(this.fence),this.fence=null}releaseWorld(){let e=this.gl;for(let t of[this.controlTex,this.tileTex,this.idxTex])t&&e.deleteTexture(t);this.controlTex=this.tileTex=this.idxTex=null,this.freeScratch(),this.cache=null,this.prepared=null,this.params=null,this.lattice=null,this.fn=null,this.idxData=null,this.version++}*prepJob(e,t){let n=performance.now(),r=yield*lo(e,t),i=this.gl;this.controlTex=i.createTexture(),Gn(i,this.controlTex,r.controlPad,r.n+4,`rgba8`,!0),yield 0;let a=vi(t);this.tileTex=i.createTexture(),i.bindTexture(i.TEXTURE_2D_ARRAY,this.tileTex),i.texStorage3D(i.TEXTURE_2D_ARRAY,1,i.R32F,a,a,this.opts.slots),Io(i),this.idxTex=i.createTexture(),i.bindTexture(i.TEXTURE_2D_ARRAY,this.idxTex),i.texStorage3D(i.TEXTURE_2D_ARRAY,1,i.RG32F,t.T,t.T,6),Io(i),this.idxData=new Float32Array(6*t.T*t.T*2),this.cache=new Co(t,this.opts.slots),this.uploadIndex(),this.prepared=r,this.params=r.params,this.boundsPad=Ai(r.params,this.opts.anchorMetres),this.fn=new Ki({n:r.n,radius:r.radius,macroPad:r.macroPad,surfacePad:r.surfacePad,waterPad:r.levelPad,wetPad:r.levelPad?r.wetPad:null,control:r.controlPad,params:r.params,tiles:this.cache}),this.stats.prepMs=performance.now()-n,this.version++}uploadIndex(){let e=this.gl,t=this.cache,n=this.lattice;t&&n&&this.idxTex&&this.idxData&&(t.writeIndex(this.idxData),e.bindTexture(e.TEXTURE_2D_ARRAY,this.idxTex),e.pixelStorei(e.UNPACK_ALIGNMENT,1),e.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,n.T,n.T,6,e.RG,e.FLOAT,this.idxData),this.idxDirty=!1)}*tileJob(e){let t=performance.now(),n=0,r=this.prepared,i=r.lattice,a=performance.now(),o=mo(r,e);if(n+=performance.now()-a,yield 0,!this.gpu){let r=performance.now(),a=yield*vo(o,Math.min(4,this.opts.thermalSteps),this.opts);n+=performance.now()-r;let s=bo(a,i),c=vi(i),l=this.gl;l.bindTexture(l.TEXTURE_2D_ARRAY,this.tileTex),l.pixelStorei(l.UNPACK_ALIGNMENT,1),l.texSubImage3D(l.TEXTURE_2D_ARRAY,0,0,0,this.cache.slotOf.get(e),c,c,1,l.RED,l.FLOAT,s),this.cache.commit(e,s),this.finishTile(t,n,0);return}this.compiled||(yield*this.compileAll());let s=yield*this.gpuTile(o,e);this.finishTile(t,n,s)}finishTile(e,t,n){let r=performance.now()-e;this.stats.built++,this.stats.lastTileMs=r,this.stats.lastTileCpuMs=t,this.stats.lastReadbackMs=n,this.tileTotalMs+=r,this.stats.meanTileMs=this.tileTotalMs/this.stats.built,this.idxDirty=!0}*compileAll(){let e=this.gl,t=performance.now(),n=e.getExtension(`KHR_parallel_shader_compile`),r=[];for(let t of Object.keys(No)){if(this.progs[t])continue;let[i,a]=No[t],o=e.createShader(e.VERTEX_SHADER);e.shaderSource(o,i),e.compileShader(o);let s=e.createShader(e.FRAGMENT_SHADER);e.shaderSource(s,a),e.compileShader(s);let c=e.createProgram();e.attachShader(c,o),e.attachShader(c,s),e.linkProgram(c),r.push([t,c,o,s]),n||(yield 0)}if(n)for(;r.some(([,t])=>!e.getProgramParameter(t,n.COMPLETION_STATUS_KHR));)yield Po;for(let[t,n,i,a]of r){if(!e.getProgramParameter(n,e.LINK_STATUS)){let r=`${e.getShaderInfoLog(i)??``}${e.getShaderInfoLog(a)??``}${e.getProgramInfoLog(n)??``}`;throw Error(`[globe-tile-${t}] ${r}`)}e.deleteShader(i),e.deleteShader(a),this.progs[t]=n}this.compiled=!0,this.stats.compileMs=performance.now()-t}loc(e,t){let n=this.locs.get(e);return n||(n=new Map,this.locs.set(e,n)),n.has(t)||n.set(t,this.gl.getUniformLocation(e,t)),n.get(t)??null}tex2d(e,t,n=!1){let r=this.gl,i=r.createTexture();r.bindTexture(r.TEXTURE_2D,i),r.texStorage2D(r.TEXTURE_2D,1,e,t,t);let a=n?r.LINEAR:r.NEAREST;return r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,a),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,a),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),i}ensureScratch(e,t){let n=this.scratch;if(n&&n.D===e&&n.nl===t)return n;this.freeScratch();let r=this.gl,i=vi(this.lattice),a=e=>this.tex2d(r.R32F,e),o=()=>this.tex2d(r.RGBA32F,e),s=r.createRenderbuffer();r.bindRenderbuffer(r.RENDERBUFFER,s),r.renderbufferStorage(r.RENDERBUFFER,r.DEPTH_COMPONENT32F,e,e);let c=r.createTexture();r.bindTexture(r.TEXTURE_2D,c),r.texStorage2D(r.TEXTURE_2D,1,r.RGBA32F,i/4,i);let l=r.createBuffer();r.bindBuffer(r.PIXEL_PACK_BUFFER,l),r.bufferData(r.PIXEL_PACK_BUFFER,i*i*4,r.STREAM_READ),r.bindBuffer(r.PIXEL_PACK_BUFFER,null);let u={D:e,nl:t,macro:a(t),wl:a(t),coast:a(t),wet:a(t),ctl:this.tex2d(r.RGBA8,t,!0),cap:a(e),floor:a(e),depth:s,hA:a(e),hB:a(e),A0:o(),A1:o(),F0:o(),F1:o(),V:this.tex2d(r.RG32F,e),low:a(t),low2:a(t),pack:c,pbo:l,segBuf:r.createBuffer(),segVao:r.createVertexArray()};return this.scratch=u,u}freeScratch(){let e=this.scratch;if(!e)return;let t=this.gl;for(let n of[e.macro,e.wl,e.coast,e.wet,e.ctl,e.cap,e.floor,e.hA,e.hB,e.A0,e.A1,e.F0,e.F1,e.V,e.low,e.low2,e.pack])t.deleteTexture(n);t.deleteRenderbuffer(e.depth),t.deleteBuffer(e.pbo),t.deleteBuffer(e.segBuf),t.deleteVertexArray(e.segVao),this.scratch=null}use(e,t,n,r){let i=this.gl,a=this.progs[e];i.useProgram(a),i.uniform1i(this.loc(a,`u_hasWater`),1),i.uniform1i(this.loc(a,`u_n`),t.nl),i.uniform1f(this.loc(a,`u_size`),t.D*t.texelM),i.uniform1i(this.loc(a,`u_D`),t.D);let o={u_macro:n.macro,u_wl:n.wl,u_coast:n.coast,u_wet:n.wet,u_floor:n.floor,...r},s=0;for(let[e,t]of Object.entries(o))i.activeTexture(i.TEXTURE0+s),i.bindTexture(i.TEXTURE_2D,t),i.uniform1i(this.loc(a,e),s),s++;for(let e=s;e<this.unitsUsed;e++)i.activeTexture(i.TEXTURE0+e),i.bindTexture(i.TEXTURE_2D,null);return this.unitsUsed=s,a}target(e,t,n,r=null){let i=this.gl;i.bindFramebuffer(i.FRAMEBUFFER,this.fbo);for(let t=0;t<2;t++)i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+t,i.TEXTURE_2D,e[t]??null,0);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,r),i.drawBuffers(e.length===2?[i.COLOR_ATTACHMENT0,i.COLOR_ATTACHMENT1]:[i.COLOR_ATTACHMENT0]),i.viewport(0,0,t,n)}quad(){let e=this.gl;e.bindVertexArray(this.vao),e.drawArrays(e.TRIANGLES,0,3)}est(e,t){return Math.max(.01,e/1e6*t/this.opts.gpuMtexPerMs)}*gpuTile(e,t){let n=this.gl,r=this.opts,i=this.lattice,a=e.D,o=e.nl,s=this.ensureScratch(a,o),c=(e,t,r,i)=>{n.bindTexture(n.TEXTURE_2D,e),n.pixelStorei(n.UNPACK_ALIGNMENT,1),n.texSubImage2D(n.TEXTURE_2D,0,0,0,o,o,r,i,t)};if(c(s.macro,e.macro,n.RED,n.FLOAT),c(s.wl,e.water,n.RED,n.FLOAT),c(s.coast,e.coast,n.RED,n.FLOAT),c(s.wet,e.wet,n.RED,n.FLOAT),c(s.ctl,e.control,n.RGBA,n.UNSIGNED_BYTE),this.target([s.floor],a,a,s.depth),n.clearBufferfv(n.COLOR,0,[1e30,0,0,0]),e.segCount>0){n.enable(n.DEPTH_TEST),n.depthFunc(n.LESS),n.depthMask(!0),n.clearBufferfv(n.DEPTH,0,[1]),n.bindVertexArray(s.segVao),n.bindBuffer(n.ARRAY_BUFFER,s.segBuf),n.bufferData(n.ARRAY_BUFFER,e.segs,n.STREAM_DRAW),n.bindVertexArray(null);let t=16384;for(let r=0;r<e.segCount;r+=t){let i=Math.min(t,e.segCount-r);this.target([s.floor],a,a,s.depth),n.enable(n.DEPTH_TEST),n.depthFunc(n.LESS),this.use(`tfloor`,e,s,{u_floor:s.low}),n.bindVertexArray(s.segVao),n.bindBuffer(n.ARRAY_BUFFER,s.segBuf);for(let e=0;e<3;e++)n.enableVertexAttribArray(e),n.vertexAttribPointer(e,4,n.FLOAT,!1,48,r*12*4+e*16),n.vertexAttribDivisor(e,1);n.drawArraysInstanced(n.TRIANGLE_STRIP,0,4,i),n.bindVertexArray(null),yield this.est(i*4096,2)}n.disable(n.DEPTH_TEST)}let l=()=>{this.target([s.cap],a,a,s.depth),n.enable(n.DEPTH_TEST),n.depthFunc(n.LESS),n.depthMask(!0)};if(l(),n.clearBufferfv(n.COLOR,0,[1e6,0,0,0]),n.clearBufferfv(n.DEPTH,0,[1]),this.use(`cap`,e,s,{}),this.quad(),yield this.est(a*a,1),e.segCount>0){let t=16384;for(let r=0;r<e.segCount;r+=t){let i=Math.min(t,e.segCount-r);l(),this.use(`carve`,e,s,{}),n.bindVertexArray(s.segVao),n.bindBuffer(n.ARRAY_BUFFER,s.segBuf);for(let e=0;e<3;e++)n.enableVertexAttribArray(e),n.vertexAttribPointer(e,4,n.FLOAT,!1,48,r*12*4+e*16),n.vertexAttribDivisor(e,1);n.drawArraysInstanced(n.TRIANGLE_STRIP,0,4,i),n.bindVertexArray(null),yield this.est(i*4096,2)}}n.disable(n.DEPTH_TEST);let u=s.hA,d=s.hB;{let t=this.use(`tbase`,e,s,{u_cap:s.cap,u_ctl:s.ctl}),r=e.globe,i=e.face*3;n.uniform1ui(this.loc(t,`u_seed`),r.seed>>>0),n.uniform1f(this.loc(t,`u_bakeLam0`),r.bakeLam0),n.uniform1i(this.loc(t,`u_bakeOct`),r.bakeOct),n.uniform1f(this.loc(t,`u_bakeAmpScale`),r.bakeAmpScale),n.uniform3f(this.loc(t,`u_tC`),F[i],F[i+1],F[i+2]),n.uniform3f(this.loc(t,`u_tE`),I[i],I[i+1],I[i+2]),n.uniform3f(this.loc(t,`u_tS`),L[i],L[i+1],L[i+2]),n.uniform2f(this.loc(t,`u_org`),e.a0,e.b0),n.uniform1f(this.loc(t,`u_delta`),e.delta),n.uniform1f(this.loc(t,`u_R`),e.radius),this.target([u],a,a),this.quad(),yield this.est(a*a,6)}let f=Math.floor(r.thermalSteps/2),p=function*(t){for(let i=0;i<t;i++){let t=this.use(`thermal`,e,s,{u_h:u,u_cap:s.cap});n.uniform1f(this.loc(t,`u_talus`),r.talus*e.texelM),n.uniform1f(this.loc(t,`u_rate`),r.thermalRate),this.target([d],a,a),this.quad(),[u,d]=[d,u],yield this.est(a*a,1.5)}};if(yield*p.call(this,f),r.hydraulicSteps>0){this.use(`copy`,e,s,{u_h:u}),this.target([d],a,a),this.quad();let t=r.hydro,i=e=>{n.uniform1i(this.loc(e,`u_T`),a),n.uniform2i(this.loc(e,`u_org`),0,0),n.uniform1f(this.loc(e,`u_dt`),t.dt),n.uniform1f(this.loc(e,`u_K`),t.K),n.uniform1f(this.loc(e,`u_rain`),t.rain)},o=s.F0,c=s.F1,l=this.use(`hinit`,e,s,{u_h:u});n.uniform2i(this.loc(l,`u_org`),0,0),this.target([s.A0],a,a),this.quad(),this.target([o],a,a),n.clearBufferfv(n.COLOR,0,[0,0,0,0]),yield this.est(a*a,.8);for(let d=0;d<r.hydraulicSteps;d++)l=this.use(`hflux`,e,s,{u_A:s.A0,u_F:o}),i(l),this.target([c],a,a),this.quad(),[o,c]=[c,o],l=this.use(`hwater`,e,s,{u_A:s.A0,u_F:o}),i(l),n.uniform1f(this.loc(l,`u_Kc`),t.Kc),n.uniform1f(this.loc(l,`u_Ks`),t.Ks),n.uniform1f(this.loc(l,`u_Kd`),t.Kd),n.uniform1f(this.loc(l,`u_amin`),t.amin),n.uniform1f(this.loc(l,`u_dmax`),t.dmax),n.uniform1f(this.loc(l,`u_maxStep`),t.maxStep),this.target([s.A1,s.V],a,a),this.quad(),l=this.use(`hadvect`,e,s,{u_A:s.A1,u_F:o,u_V:s.V,u_h:u,u_cap:s.cap}),i(l),n.uniform1f(this.loc(l,`u_Ke`),t.Ke),this.target([s.A0],a,a),this.quad(),yield this.est(a*a,3);l=this.use(`hwrite`,e,s,{u_A:s.A0}),n.uniform2i(this.loc(l,`u_org`),0,0),this.target([d],a,a),this.quad(),[u,d]=[d,u],yield this.est(a*a,.3)}yield*p.call(this,r.thermalSteps-f);{this.use(`adown`,e,s,{u_h:u}),this.target([s.low],o,o),this.quad();let t=this.use(`ablur`,e,s,{u_src:s.low});n.uniform2i(this.loc(t,`u_dir`),1,0),this.target([s.low2],o,o),this.quad(),t=this.use(`ablur`,e,s,{u_src:s.low2}),n.uniform2i(this.loc(t,`u_dir`),0,1),this.target([s.low],o,o),this.quad(),t=this.use(`afinal`,e,s,{u_h:u,u_low:s.low,u_cap:s.cap}),n.uniform1f(this.loc(t,`u_a`),r.anchorMetres),this.target([d],a,a),this.quad(),[u,d]=[d,u],yield this.est(a*a,2)}let m=vi(i),h=i.A-i.M,g=this.cache.slotOf.get(t);if(g===void 0)return 0;{let t=this.use(`textract`,e,s,{u_h:u});n.uniform1i(this.loc(t,`u_off`),h),n.bindFramebuffer(n.FRAMEBUFFER,this.fbo),n.framebufferTextureLayer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,this.tileTex,0,g),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT1,n.TEXTURE_2D,null,0),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.RENDERBUFFER,null),n.drawBuffers([n.COLOR_ATTACHMENT0]),n.viewport(0,0,m,m),this.quad(),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,null,0)}if(this.cache.commit(t),this.idxDirty=!0,!r.readback)return 0;let _=performance.now();{let t=this.use(`tpack`,e,s,{u_h:u});n.uniform1i(this.loc(t,`u_off`),h),this.target([s.pack],m/4,m),this.quad(),n.bindFramebuffer(n.READ_FRAMEBUFFER,this.fbo),n.readBuffer(n.COLOR_ATTACHMENT0),n.bindBuffer(n.PIXEL_PACK_BUFFER,s.pbo),n.readPixels(0,0,m/4,m,n.RGBA,n.FLOAT,0),n.bindBuffer(n.PIXEL_PACK_BUFFER,null)}let v=n.fenceSync(n.SYNC_GPU_COMMANDS_COMPLETE,0);if(n.flush(),v)try{for(;n.clientWaitSync(v,0,0)===n.TIMEOUT_EXPIRED;)yield Po}finally{n.deleteSync(v)}let y=new Float32Array(m*m),b=262144;for(let e=0;e<m*m;e+=b)n.bindBuffer(n.PIXEL_PACK_BUFFER,s.pbo),n.getBufferSubData(n.PIXEL_PACK_BUFFER,e*4,y,e,Math.min(b,m*m-e)),n.bindBuffer(n.PIXEL_PACK_BUFFER,null),yield 0;return this.cache.slotOf.get(t)===g&&this.cache.setData(t,y),performance.now()-_}withState(e){let t=this.gl,n=t.getParameter(t.DRAW_FRAMEBUFFER_BINDING),r=t.getParameter(t.READ_FRAMEBUFFER_BINDING),i=t.getParameter(t.VIEWPORT),a=t.getParameter(t.CURRENT_PROGRAM),o=t.getParameter(t.VERTEX_ARRAY_BINDING),s=t.getParameter(t.ARRAY_BUFFER_BINDING),c=[t.DEPTH_TEST,t.BLEND,t.SCISSOR_TEST,t.CULL_FACE].map(e=>[e,t.isEnabled(e)]),l=t.getParameter(t.DEPTH_WRITEMASK),u=t.getParameter(t.DEPTH_FUNC);for(let[e]of c)t.disable(e);try{e()}finally{t.bindFramebuffer(t.DRAW_FRAMEBUFFER,n),t.bindFramebuffer(t.READ_FRAMEBUFFER,r),t.viewport(i[0],i[1],i[2],i[3]),t.useProgram(a),t.bindVertexArray(o),t.bindBuffer(t.ARRAY_BUFFER,s),t.bindBuffer(t.PIXEL_PACK_BUFFER,null);for(let[e,n]of c)n?t.enable(e):t.disable(e);t.depthMask(l),t.depthFunc(u),t.activeTexture(t.TEXTURE0)}}};function Io(e){e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}function Lo(e){let t=e.createFramebuffer(),n=e.getParameter(e.FRAMEBUFFER_BINDING),r=!0,i=[];e.bindFramebuffer(e.FRAMEBUFFER,t);for(let t of[e.R32F,e.RG32F,e.RGBA32F]){let n=e.createTexture();i.push(n),e.bindTexture(e.TEXTURE_2D,n),e.texStorage2D(e.TEXTURE_2D,1,t,4,4),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE&&(r=!1)}e.bindFramebuffer(e.FRAMEBUFFER,n),e.deleteFramebuffer(t);for(let t of i)e.deleteTexture(t);return r}var Ro=`#version 300 es
layout(location = 0) in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`,zo=`#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
in vec2 v_uv;
uniform sampler2D u_surface;   // R32F rendered surface (m), row 0 = north
uniform int u_n;
uniform float u_cell;          // m
uniform float u_exag;
uniform vec3 u_sun;            // unit vector toward the sun (world: x east, y north, z up)
uniform int u_doAO;
out vec4 o;

float hAt(vec2 p) {            // p in texel units (x east, y = row south)
  vec2 q = p - 0.5;
  ivec2 i = ivec2(floor(q));
  vec2 f = q - vec2(i);
  ivec2 mx = ivec2(u_n - 1);
  float a = texelFetch(u_surface, clamp(i, ivec2(0), mx), 0).r;
  float b = texelFetch(u_surface, clamp(i + ivec2(1, 0), ivec2(0), mx), 0).r;
  float c = texelFetch(u_surface, clamp(i + ivec2(0, 1), ivec2(0), mx), 0).r;
  float d = texelFetch(u_surface, clamp(i + ivec2(1, 1), ivec2(0), mx), 0).r;
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y) * u_exag;
}

// Tangent of the highest horizon along texel-space direction dir (|dir| = 1), doubling step sizes.
float horizonTan(vec2 p, vec2 dir, float h0) {
  float best = -1e9;
  float t = 0.75;
  for (int k = 0; k < 40; k++) {
    vec2 q = p + dir * t;
    if (q.x < 0.0 || q.y < 0.0 || q.x > float(u_n) || q.y > float(u_n)) break;
    best = max(best, (hAt(q) - h0) / (t * u_cell));
    t *= 1.16;
  }
  return best;
}

void main() {
  vec2 p = v_uv * float(u_n);
  float h0 = hAt(p);
  // Texel space has y pointing south, world y points north.
  vec2 sunDir = normalize(vec2(u_sun.x, -u_sun.y));
  float sunTan = u_sun.z / max(1e-4, length(u_sun.xy));
  float hor = horizonTan(p, sunDir, h0);
  // Soft penumbra: the sun's disc plus some atmospheric softness (~2.5°), wider at low sun (M9) where
  // long shadows would otherwise show the 1 km raster.
  float soft = mix(0.1, 0.045, smoothstep(0.15, 0.6, atan(sunTan)));
  float vis = smoothstep(-soft, soft, atan(sunTan) - atan(hor));
  float ao = 1.0;
  float fog = 0.0;
  if (u_doAO == 1) {
    float occl = 0.0;
    // Valley-fog potential (M9): low against the surroundings (1.5–9 km) with relief around, so fog
    // pools on valley floors and sheltered shores but not over open sea or featureless plains.
    float h0m = h0 / u_exag;
    float lo = h0m, hi = h0m;
    for (int k = 0; k < 8; k++) {
      float a = float(k) * 0.7853982 + 0.3;
      vec2 dir = vec2(cos(a), sin(a));
      float ht = max(0.0, horizonTan(p, dir, h0));
      occl += sin(atan(ht));
      for (int j = 0; j < 3; j++) {
        float r = max(1.0, (j == 0 ? 1500.0 : j == 1 ? 4000.0 : 9000.0) / u_cell);
        float hs = hAt(p + dir * r) / u_exag;
        lo = min(lo, hs);
        hi = max(hi, hs);
      }
    }
    ao = 1.0 - occl / 8.0;
    fog = (1.0 - smoothstep(10.0, 200.0, h0m - lo)) * smoothstep(40.0, 300.0, hi - h0m);
  }
  o = vec4(vis, ao, fog, 1.0);
}`,Bo=class{gl;prog;u;quad;vao;surfaceTex;texture;aoTexture;fbo;n=0;cell=1;lastKey=``;aoKey=``;lastRun=0;ready=!1;minIntervalMs=0;constructor(e){this.gl=e,this.prog=en(e,`horizon`,Ro,zo),this.u=nn(e,this.prog,[`u_surface`,`u_n`,`u_cell`,`u_exag`,`u_sun`,`u_doAO`]),this.quad=rn(e),this.vao=e.createVertexArray(),e.bindVertexArray(this.vao),e.bindBuffer(e.ARRAY_BUFFER,this.quad),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null),this.surfaceTex=e.createTexture(),this.texture=Vo(e),this.aoTexture=Vo(e),this.fbo=e.createFramebuffer()}setSurface(e,t,n){let r=this.gl;r.bindTexture(r.TEXTURE_2D,this.surfaceTex),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.NEAREST),r.pixelStorei(r.UNPACK_ALIGNMENT,1),r.texImage2D(r.TEXTURE_2D,0,r.R32F,t,t,0,r.RED,r.FLOAT,e);for(let e of[this.texture,this.aoTexture])r.bindTexture(r.TEXTURE_2D,e),r.texImage2D(r.TEXTURE_2D,0,r.RGBA8,t,t,0,r.RGBA,r.UNSIGNED_BYTE,null);this.n=t,this.cell=n/t,this.lastKey=``,this.aoKey=``,this.ready=!1}update(e,t){if(this.n===0)return;let n=`${Math.round(Math.atan2(e[0],e[1])*180/Math.PI/1.5)}|${Math.round(e[2]*100)}|${t}`;if(n===this.lastKey)return;let r=String(t),i=r!==this.aoKey,a=performance.now();if(this.ready&&!i&&a-this.lastRun<this.minIntervalMs)return;this.lastRun=a;let o=this.gl;o.useProgram(this.prog),o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,this.surfaceTex),o.uniform1i(this.u.u_surface,0),o.uniform1i(this.u.u_n,this.n),o.uniform1f(this.u.u_cell,this.cell),o.uniform1f(this.u.u_exag,t),o.uniform3f(this.u.u_sun,e[0],e[1],e[2]),o.bindFramebuffer(o.FRAMEBUFFER,this.fbo),o.viewport(0,0,this.n,this.n),o.bindVertexArray(this.vao),i&&(o.uniform1i(this.u.u_doAO,1),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,this.aoTexture,0),o.drawArrays(o.TRIANGLES,0,6),this.aoKey=r),o.uniform1i(this.u.u_doAO,0),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,this.texture,0),o.drawArrays(o.TRIANGLES,0,6),o.bindVertexArray(null),o.bindFramebuffer(o.FRAMEBUFFER,null),this.lastKey=n,this.ready=!0}};function Vo(e){let t=e.createTexture();return e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array([255,255,255,255])),t}var Ho=new Set([`river`,`lake`,`ocean`,`sea`,`bay`,`gulf`,`strait`,`fjord`,`lagoon`,`reef`]),Uo=new Set([`continent`,`range`,`ocean`,`sea`]),Wo=new Set([`peak`,`hill`,`pass`,`volcano`,`waterfall`,`cape`,`caldera`,`crater`]);function Go(e){switch(e){case`continent`:return[17,26];case`ocean`:return[16,24];case`sea`:return[13,19];case`range`:return[11.5,17];case`island`:case`archipelago`:case`gulf`:case`desert`:case`erg`:case`icecap`:case`plateau`:case`grassland`:return[11.5,16];case`river`:case`fjord`:case`strait`:return[11,14.5];default:return[11,14.5]}}function Ko(e){let t=Uo.has(e.kind),[n,r]=Go(e.kind),i=Math.min(1,Math.max(0,e.importance)),a=n+(r-n)*Math.sqrt(i);e.hero&&(a*=1.1);let o=.02;e.kind===`range`?o=.32:e.kind===`continent`||e.kind===`ocean`?o=.24:t?o=.14:(e.kind===`river`||e.kind===`fjord`||e.kind===`strait`)&&(o=.06);let s=`point`;return e.path&&e.path.length>=4&&(e.kind===`river`||e.kind===`fjord`||e.kind===`strait`||e.kind===`canyon`||e.kind===`gorge`||e.kind===`rift`)?s=`path`:Number.isFinite(e.angle)&&(s=`rotated`),{style:+!!Ho.has(e.kind),caps:t,letterSpacingEm:o,sizePx:a,mode:s,offsetEm:Wo.has(e.kind)?-.85:0,emphasis:+!!e.hero}}function qo(e,t){let n=e.name.trim();return t.caps?n.toLocaleUpperCase():n}var Jo=0x56bc75e2d63100000,Yo={f:new Float64Array,z:new Float64Array,v:new Uint16Array,outer:new Float64Array,inner:new Float64Array};function Xo(e,t){let n=Math.max(e,t);if(Yo.f.length<n||Yo.outer.length<e*t){let r=Math.max(n,Yo.f.length),i=Math.max(e*t,Yo.outer.length);Yo={f:new Float64Array(r),z:new Float64Array(r+1),v:new Uint16Array(r),outer:new Float64Array(i),inner:new Float64Array(i)}}}function Zo(e,t,n,r){let{f:i,z:a,v:o}=Yo;for(let a=0;a<r;a++)i[a]=e[t+a*n];o[0]=0,a[0]=-0x56bc75e2d63100000,a[1]=Jo;let s=0;for(let e=1;e<r;e++){let t;do{let n=o[s];t=(i[e]-i[n]+e*e-n*n)/(e-n)/2}while(t<=a[s]&&--s>-1);s++,o[s]=e,a[s]=t,a[s+1]=Jo}s=0;for(let c=0;c<r;c++){for(;a[s+1]<c;)s++;let r=o[s],l=c-r;e[t+c*n]=i[r]+l*l}}function Qo(e,t,n){Xo(t,n);for(let r=0;r<t;r++)Zo(e,r,t,n);for(let r=0;r<n;r++)Zo(e,r*t,1,t)}function $o(e,t,n,r,i=new Uint8Array(t*n)){Xo(t,n);let a=t*n,o=Yo.outer,s=Yo.inner;for(let t=0;t<a;t++){let n=e[t]/255;if(n>=1)o[t]=0,s[t]=Jo;else if(n<=0)o[t]=Jo,s[t]=0;else{let e=.5-n;o[t]=e>0?e*e:0,s[t]=e<0?e*e:0}}Qo(o,t,n),Qo(s,t,n);for(let e=0;e<a;e++){let t=.5-(Math.sqrt(o[e])-Math.sqrt(s[e]))/(2*r);i[e]=Math.round(255*Math.min(1,Math.max(0,t)))}return i}var es=class{w;h;gap;shelves=[];nextY=0;constructor(e,t,n=1){this.w=e,this.h=t,this.gap=n}pack(e,t){let n=e+this.gap,r=t+this.gap,i=null;for(let e of this.shelves)e.h>=r&&e.h<=r*1.4&&e.x+n<=this.w&&(!i||e.h<i.h)&&(i=e);if(!i){if(this.nextY+r>this.h||n>this.w)return null;i={y:this.nextY,h:r,x:0},this.shelves.push(i),this.nextY+=r}let a={x:i.x,y:i.y};return i.x+=n,a}resize(e,t){this.w=e,this.h=t}},ts=40,ns=10,rs=11,is=1024,as=512,os=4096,ss=`Georgia, 'Times New Roman', 'Noto Serif', 'DejaVu Serif', 'Liberation Serif', serif`,cs=class{gl;fontPx=ts;spread=ns;width=is;height=as;texture;data=new Uint8Array(is*as);packer=new es(is,as,1);map=new Map;ctx;canvasSize=120;dirtyY0=1/0;dirtyY1=-1;resized=!0;constructor(e){this.gl=e;let t=this.canvasSize,n=(typeof OffscreenCanvas<`u`?new OffscreenCanvas(t,t):Object.assign(document.createElement(`canvas`),{width:t,height:t})).getContext(`2d`,{willReadFrequently:!0});if(!n)throw Error(`Canvas2D is not available for the label glyph atlas.`);this.ctx=n,this.texture=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.texture),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindTexture(e.TEXTURE_2D,null)}get count(){return this.map.size}glyph(e,t){let n=e+t,r=this.map.get(n);return r||(r=this.rasterise(e,t),this.map.set(n,r)),r}flush(){let e=this.gl;if(!(!this.resized&&this.dirtyY1<0)){if(e.bindTexture(e.TEXTURE_2D,this.texture),e.pixelStorei(e.UNPACK_ALIGNMENT,1),this.resized)e.texImage2D(e.TEXTURE_2D,0,e.R8,this.width,this.height,0,e.RED,e.UNSIGNED_BYTE,this.data);else{let t=this.dirtyY0,n=this.dirtyY1;e.texSubImage2D(e.TEXTURE_2D,0,0,t,this.width,n-t,e.RED,e.UNSIGNED_BYTE,this.data.subarray(t*this.width,n*this.width))}e.pixelStorei(e.UNPACK_ALIGNMENT,4),this.resized=!1,this.dirtyY0=1/0,this.dirtyY1=-1}}dispose(){this.gl.deleteTexture(this.texture)}rasterise(e,t){let n=this.ctx;n.font=`${e===1?`italic `:``}${ts}px ${ss}`,n.textBaseline=`alphabetic`,n.textAlign=`left`;let r=n.measureText(t),i=r.width,a=Math.ceil(r.actualBoundingBoxLeft),o=Math.ceil(r.actualBoundingBoxRight),s=Math.ceil(r.actualBoundingBoxAscent),c=Math.ceil(r.actualBoundingBoxDescent),l=Math.min(this.canvasSize-22,a+o),u=Math.min(this.canvasSize-22,s+c),d={ax:0,ay:0,aw:0,ah:0,left:0,top:0,advance:i};if(l<=0||u<=0||t.trim()===``)return d;let f=l+22,p=u+22;n.clearRect(0,0,f,p),n.fillStyle=`#000`,n.fillText(t,rs+a,rs+s);let m=n.getImageData(0,0,f,p).data,h=new Uint8Array(f*p);for(let e=0;e<h.length;e++)h[e]=m[4*e+3];let g=$o(h,f,p,ns),_=this.packer.pack(f,p);for(;!_&&this.height<os;)this.grow(),_=this.packer.pack(f,p);if(!_)return d;for(let e=0;e<p;e++)this.data.set(g.subarray(e*f,(e+1)*f),(_.y+e)*this.width+_.x);return this.dirtyY0=Math.min(this.dirtyY0,_.y),this.dirtyY1=Math.max(this.dirtyY1,_.y+p),{ax:_.x,ay:_.y,aw:f,ah:p,left:-a-rs,top:-s-rs,advance:i}}grow(){let e=Math.min(os,this.height*2),t=new Uint8Array(this.width*e);t.set(this.data),this.data=t,this.height=e,this.packer.resize(this.width,e),this.resized=!0}};function ls(e){let t=[];for(let n of e.normalize(`NFC`))t.length>0&&/\p{M}/u.test(n)?t[t.length-1]+=n:t.push(n);return t}var us={padding:4,cellPx:64,stableFrames:3,densityW:120,densityH:40,edgeInset:2},ds=class{cell;cols=1;rows=1;heads=new Int32Array(1);next=new Int32Array(256);ref=new Int32Array(256);box=new Float32Array(1024);nBoxes=0;nEntries=0;x0=0;y0=0;constructor(e=64){this.cell=e}reset(e,t,n=0){this.x0=-n,this.y0=-n,this.cols=Math.max(1,Math.ceil((e+2*n)/this.cell)),this.rows=Math.max(1,Math.ceil((t+2*n)/this.cell)),this.heads.length<this.cols*this.rows&&(this.heads=new Int32Array(this.cols*this.rows)),this.heads.fill(-1,0,this.cols*this.rows),this.nBoxes=0,this.nEntries=0}get size(){return this.nBoxes}span(e,t,n,r){return[Math.min(r-1,Math.max(0,Math.floor((e-n)/this.cell))),Math.min(r-1,Math.max(0,Math.floor((t-n)/this.cell)))]}insert(e,t,n,r){let i=this.nBoxes++;if(this.box.length<this.nBoxes*4){let e=new Float32Array(this.box.length*2);e.set(this.box),this.box=e}this.box[i*4]=e,this.box[i*4+1]=t,this.box[i*4+2]=n,this.box[i*4+3]=r;let[a,o]=this.span(e,n,this.x0,this.cols),[s,c]=this.span(t,r,this.y0,this.rows);for(let e=s;e<=c;e++)for(let t=a;t<=o;t++){let n=this.nEntries++;if(this.next.length<=n){let e=new Int32Array(this.next.length*2);e.set(this.next),this.next=e;let t=new Int32Array(this.ref.length*2);t.set(this.ref),this.ref=t}let r=e*this.cols+t;this.ref[n]=i,this.next[n]=this.heads[r],this.heads[r]=n}}hits(e,t,n,r){let[i,a]=this.span(e,n,this.x0,this.cols),[o,s]=this.span(t,r,this.y0,this.rows),c=this.box;for(let l=o;l<=s;l++)for(let o=i;o<=a;o++)for(let i=this.heads[l*this.cols+o];i>=0;i=this.next[i]){let a=this.ref[i]*4;if(e<c[a+2]&&n>c[a]&&t<c[a+3]&&r>c[a+1])return!0}return!1}},fs=class{opts;prev=new Set;stable=new Map;grid;anchors;order=[];constructor(e={}){this.opts={...us,...e},this.grid=new ds(this.opts.cellPx),this.anchors=new ds(Math.max(this.opts.densityW,this.opts.densityH))}wasPlaced(e){return this.prev.has(e)}get pending(){return this.stable.size}reset(){this.prev.clear(),this.stable.clear()}place(e,t,n,r){let i=this.opts,a=this.prev,o=this.order;o.length=e.length;for(let t=0;t<e.length;t++)o[t]=t;let s=(t,n)=>{let r=e[t],i=e[n];if(!!r.force!=!!i.force)return r.force?-1:1;if(r.hero!==i.hero)return r.hero?-1:1;if(r.importance!==i.importance)return i.importance-r.importance;let o=a.has(r.id);return o===a.has(i.id)?r.id-i.id:o?-1:1},c=!0;for(let e=1;e<o.length&&c;e++)s(e-1,e)>0&&(c=!1);c||o.sort(s),this.grid.reset(t,n,64),this.anchors.reset(t,n,64);let l=Math.max(1,Math.ceil(t*n/(i.densityW*i.densityH))),u=[],d=new Set,f=new Map,p=i.padding,m=i.densityW/2,h=i.densityH/2,g=i.edgeInset;for(let s of o){if(u.length>=l)break;let o=e[s],c=a.has(o.id),_=!!o.force;if(!(o.ax>=0&&o.ax<=t&&o.ay>=0&&o.ay<=n)||!_&&this.anchors.hits(o.ax-.001,o.ay-.001,o.ax+.001,o.ay+.001))continue;let v=o.boxes??(r?r(o,s):null);if(!v||v.length<4)continue;let y=!0,b=!1,x=!1;for(let e=0;e<v.length;e+=4){let r=v[e],i=v[e+1],a=v[e+2],o=v[e+3];(r<g||i<g||a>t-g||o>n-g)&&(y=!1),a>0&&r<t&&o>0&&i<n&&(b=!0),!x&&this.grid.hits(r-p,i-p,a+p,o+p)&&(x=!0)}if(!x&&!(c?!b:!y)){if(!c&&!_){let e=(this.stable.get(o.id)??0)+1;if(f.set(o.id,e),e<i.stableFrames)continue}for(let e=0;e<v.length;e+=4)this.grid.insert(v[e],v[e+1],v[e+2],v[e+3]);this.anchors.insert(o.ax-m,o.ay-h,o.ax+m,o.ay+h),d.add(o.id),u.push({id:o.id,index:s,boxes:v})}}return this.prev=d,this.stable=f,u}},ps=class{ex=0;ey=0;ez=0;rx=1;ry=0;rz=0;ux=0;uy=1;uz=0;fx=0;fy=0;fz=-1;tx=1;ty=1;w=1;h=1;pxScale=1;sx=0;sy=0;depth=0;update(e){let t=e.eye();if(this.ex=t.x,this.ey=t.y,this.ez=t.z,e.axes){let{r:t,u:n,f:r}=e.axes();this.rx=t.x,this.ry=t.y,this.rz=t.z,this.ux=n.x,this.uy=n.y,this.uz=n.z,this.fx=r.x,this.fy=r.y,this.fz=r.z}else{let t=Math.sin(e.bearing),n=Math.cos(e.bearing),r=Math.sin(e.pitch),i=Math.cos(e.pitch);this.rx=n,this.ry=-t,this.rz=0,this.ux=t*i,this.uy=n*i,this.uz=r,this.fx=t*r,this.fy=n*r,this.fz=-i}this.w=e.viewW,this.h=e.viewH,this.ty=Math.tan(e.fovY/2),this.tx=this.ty*(e.viewW/e.viewH),this.pxScale=2*this.ty/Math.max(1,e.viewH)}project(e,t,n,r=.001){let i=e-this.ex,a=t-this.ey,o=n-this.ez,s=i*this.fx+a*this.fy+o*this.fz;if(this.depth=s,!(s>r))return!1;let c=(i*this.rx+a*this.ry+o*this.rz)/s/this.tx,l=(i*this.ux+a*this.uy+o*this.uz)/s/this.ty;return this.sx=(c+1)*.5*this.w,this.sy=(1-l)*.5*this.h,!0}mppAtDepth(e=this.depth){return e*this.pxScale}};function ms(e,t,n,r=1){let i=e.length,a=n&&n.centres.length===i?n:{centres:new Float32Array(i),widths:new Float32Array(i),length:0},o=0;for(let n=0;n<i;n++){let s=e[n]*r;a.widths[n]=s,a.centres[n]=o+s/2,o+=s+(n<i-1?t:0)}return a.length=o,a}var hs=Math.PI*2,gs=new Float64Array(256),_s=new Float32Array(192),vs=new Float64Array(256),ys=4;function bs(e){return e%=hs,e>Math.PI?e-=hs:e<=-Math.PI&&(e+=hs),e}function xs(e,t,n,r={}){let i=r.maxTurn??25*Math.PI/180,a=r.minRatio??1.05,o=Math.max(1,r.windows??17),s=n.centres.length;if(t<2||s===0)return null;gs.length<t&&(gs=new Float64Array(Math.max(t,gs.length*2)));let c=gs;for(let n=1;n<t;n++)c[n]=c[n-1]+Math.hypot(e[2*n]-e[2*n-2],e[2*n+1]-e[2*n-1]);let l=c[t-1],u=n.length;if(!(l>=u*a)||u<=0)return null;let d=0,f=(n,r)=>{for(n=Math.min(l,Math.max(0,n)),d>t-2&&(d=t-2);d>0&&c[d]>n;)d--;for(;d<t-2&&c[d+1]<n;)d++;let i=c[d+1]-c[d],a=i>0?(n-c[d])/i:0;r.x=e[2*d]+(e[2*d+2]-e[2*d])*a,r.y=e[2*d+1]+(e[2*d+3]-e[2*d+1])*a},p={x:new Float32Array(s),y:new Float32Array(s),angle:new Float32Array(s),flipped:!1,maxTurn:0,cost:1/0};_s.length<3*s&&(_s=new Float32Array(Math.max(3*s,_s.length*2)));let m=_s.subarray(0,s),h=_s.subarray(s,2*s),g=_s.subarray(2*s,3*s),_={x:0,y:0},v={x:0,y:0},y={x:0,y:0},b=l-u;vs.length<t&&(vs=new Float64Array(Math.max(t,vs.length*2)));let x=vs;x[0]=0;let S=Math.atan2(e[3]-e[1],e[2]-e[0]);for(let n=1;n<t-1;n++){let t=Math.atan2(e[2*n+3]-e[2*n+1],e[2*n+2]-e[2*n]);x[n]=x[n-1]+Math.abs(bs(t-S)),S=t}x[t-1]=x[Math.max(0,t-2)];let C=e=>{let n=0,r=t-1;for(;n<r;){let t=n+r+1>>1;c[t]<=e?n=t:r=t-1}return n},w=[],T=[];for(let e=0;e<o;e++){let t=o===1?b/2:b*e/(o-1);w.push(t),T.push(x[C(t+u)]-x[C(t)]+.5*Math.abs(t+u/2-l/2)/l)}let E=w.map((e,t)=>t).sort((e,t)=>T[e]-T[t]),D=0,O=0;for(let e of E){if(D>=ys||O>=2)break;D++;let t=w[e];f(t,_),f(t+u,v);let r=v.x-_.x,a=v.y-_.y,o=r<-1e-6||Math.abs(r)<=1e-6&&a<0,c=0,d=0,b=!0;for(let e=0;e<s;e++){let r=n.centres[e],i=o?t+u-r:t+r,a=Math.max(n.widths[e]/2,2);f(i,y),m[e]=y.x,h[e]=y.y,f(i-a,_),f(i+a,v);let s=Math.atan2(v.y-_.y,v.x-_.x);if(o&&(s=bs(s+Math.PI)),Math.cos(s)<-.17){b=!1;break}if(g[e]=s,e>0){let t=Math.abs(bs(s-g[e-1]));t>c&&(c=t),d+=t}}if(!b||c>i)continue;let x=d+2*c+.5*Math.abs(t+u/2-l/2)/l;O++,x<p.cost&&(p.x.set(m),p.y.set(h),p.angle.set(g),p.flipped=o,p.maxTurn=c,p.cost=x)}return Number.isFinite(p.cost)?p:null}var Ss=.25,Cs=.35,ws=.5,Ts=2e3,Es=48,Ds=8,Os=.03,ks=1.2,As=2,js=new Set([`continent`,`ocean`,`sea`]),Ms=.4;function Ns(e,t,n,r){let i=-1/0;for(let a=0;a+3<e.length;a+=4)for(let[o,s]of[[e[a],e[a+1]],[e[a+2],e[a+1]],[e[a],e[a+3]],[e[a+2],e[a+3]]])i=Math.max(i,Math.hypot(o-t,s-n)-r);return i}function Ps(e){let t=Math.PI*2;return e%=t,e>Math.PI?e-=t:e<=-Math.PI&&(e+=t),e}function Fs(e,t,n){let r=e.lm.id===n;return r===(t.lm.id===n)?e.lm.hero===t.lm.hero?e.lm.importance===t.lm.importance?t.lm.id-e.lm.id:e.lm.importance-t.lm.importance:e.lm.hero?1:-1:r?1:-1}var Is=class{glyphs;placer;proj=new ps;stats={candidates:0,placed:0,glyphs:0,placeMs:0};instances=new Float32Array(16384);instanceCount=0;infos=[];byId=new Map;states=new Map;highlightId=null;frameNo=0;lastTime=-1;epoch=0;lastGround=null;lastExag=NaN;dpr=1;cands=[];candPool=[];candInfo=[];hits=[];drawnList=[];occBudget=0;frame=null;viewVersion=0;viewKey=new Float64Array(16);radius=0;pt=new Float64Array(3);scratch=new Float32Array(4096);runs=[];constructor(e,t={}){this.glyphs=e,this.placer=new fs(t)}setLandmarks(e,t,n=0){this.radius=n,this.infos=[],this.byId.clear(),this.states.clear(),this.hits=[],this.placer.reset();for(let r of e){if(!r.name||!Number.isFinite(r.x)||!Number.isFinite(r.y))continue;let e=n>0;if(e!==(r.face!==void 0))continue;let i=Ko(r),a=qo(r,i),o=ls(a).map(e=>this.glyphs.glyph(i.style,e));if(o.length===0)continue;let s=null,c=null,l=null,u=null;if(e&&(l=new Float64Array(3),$e(r.face,r.x,r.y,n,l),Number.isFinite(r.angle))){let e=new Float64Array(3),t=1e-4*n;$e(r.face,r.x+Math.cos(r.angle)*t,r.y-Math.sin(r.angle)*t,n,e),u=Float64Array.from([e[0]-l[0],e[1]-l[1],e[2]-l[2]]);let i=Math.hypot(u[0],u[1],u[2])||1;for(let e=0;e<3;e++)u[e]/=i}if(i.mode===`path`&&r.path&&e&&r.pathFace){let e=Math.min(r.pathFace.length,Math.floor(r.path.length/2)),t=Math.max(1,Math.ceil(e/Ts)),i=[];for(let n=0;n<e;n+=t)i.push(n);(e-1)%t!=0&&i.push(e-1),s=new Float64Array(i.length*3),i.forEach((e,t)=>$e(r.pathFace[e],r.path[2*e],r.path[2*e+1],n,s,3*t));let a=i.length,o=Math.min(a,9);c=new Int32Array(o);for(let e=0;e<o;e++)c[e]=Math.round((a-1)*e/Math.max(1,o-1))}else if(i.mode===`path`&&r.path&&!e){let e=Math.floor(r.path.length/2),n=Math.max(1,Math.ceil(e/Ts)),i=Math.ceil(e/n)+((e-1)%n==0?0:1);s=new Float64Array(i*2);let a=0;for(let i=0;i<e;i+=n)s[a++]=r.path[2*i],s[a++]=t-r.path[2*i+1];(e-1)%n!=0&&(s[a++]=r.path[2*(e-1)],s[a++]=t-r.path[2*(e-1)+1]);let o=a/2,l=Math.min(o,9);c=new Int32Array(l);for(let e=0;e<l;e++)c[e]=Math.round((o-1)*e/Math.max(1,l-1));s=s.subarray(0,a)}let d=o.length,f={lm:r,st:i,text:a,glyphs:o,adv:Float32Array.from(o,e=>e.advance),wx:r.x,wy:t-r.y,z:0,zEpoch:-1,dir:l,tan:u,path:s,pathZ:s?new Float32Array(s.length/(e?3:2)):null,pathEpoch:-1,samples:c,sizePx:i.sizePx,ax:0,ay:0,gx:new Float32Array(d),gy:new Float32Array(d),ga:new Float32Array(d),boxes:new Float32Array(4),run:void 0,layoutView:-1,layoutSize:0,hasLayout:!1,occFrame:-1,occluded:!1};this.infos.push(f),this.byId.set(r.id,f)}this.infos.sort((e,t)=>-Fs(e,t,null))}highlight(e){this.highlightId=e}get animating(){for(let e of this.states.values())if(e.opacity!==e.target)return!0;return this.placer.pending>0}get drawn(){return this.drawnList}hitTest(e,t){for(let n of this.hits){let r=n.boxes;for(let i=0;i<r.length;i+=4)if(e>=r[i]-3&&e<=r[i+2]+3&&t>=r[i+1]-3&&t<=r[i+3]+3)return n.lm}return null}update(e){let t=Ls();this.frame=e,this.frameNo++;let n=this.lastTime<0?0:Math.min(.1,Math.max(0,e.timeSec-this.lastTime));this.lastTime=e.timeSec,this.dpr=Math.max(1,e.dpr||1);let r=e.cam,i=this.proj;i.update(r);let a=e.globe??e.ground;(a!==this.lastGround||e.exaggeration!==this.lastExag)&&(this.epoch++,this.lastGround=a,this.lastExag=e.exaggeration),this.bumpView(r);let o=r.viewW,s=r.viewH,c=Math.hypot(o,s),l=r.metresPerPixel(),u=r.pitch>Os,d=this.highlightId,f=this.placer,p=this.cands;p.length=0,this.candInfo.length=0,this.occBudget=Es;let m=d===null?void 0:this.byId.get(d);for(let t=m?-1:0;t<this.infos.length;t++){let n=t<0?m:this.infos[t];if(t>=0&&n===m)continue;let r=n.lm,a=r.id===d,h=f.wasPlaced(r.id),g=this.zOf(n,e),_=0,v=0,y=0,b=!1;if(this.projectAnchor(n,g)&&(_=i.sx,v=i.sy,y=i.depth,b=_>=0&&_<=o&&v>=0&&v<=s),!b&&n.path&&n.samples){this.ensurePathZ(n,e);for(let e of n.samples)if(this.projectVertex(n,e)&&i.sx>=0&&i.sx<=o&&i.sy>=0&&i.sy<=s){_=i.sx,v=i.sy,y=i.depth,b=!0;break}}if(!b)continue;let x=y*i.pxScale;if(!a&&x>r.maxMpp*(h?ks:1)||!a&&!n.path&&r.extentM/x>3*c)continue;let S=u?Math.min(1.08,Math.max(.72,(l/x)**.35)):1;n.sizePx=n.st.sizePx*S;let C=this.candPool[p.length]??(this.candPool[p.length]={id:0,hero:!1,importance:0,ax:0,ay:0,boxes:null});C.id=r.id,C.hero=r.hero,C.importance=r.importance,C.ax=_,C.ay=v,C.boxes=null,C.force=a,p.push(C),this.candInfo.push(n)}let h=f.place(p,o,s,(t,n)=>{let r=this.candInfo[n];return!r.path&&this.occluded(r,e,u)||!this.layout(r)?null:(r.path&&(t.ax=r.ax,t.ay=r.ay),r.boxes)});this.hits.length=0;let g=new Set;for(let e of h){let t=this.candInfo[e.index];g.add(e.id),this.hits.push(t);let n=this.states.get(e.id);n||this.states.set(e.id,n={info:t,opacity:0,target:1}),n.target=1}let _=n/Ss,v=[];for(let[e,t]of this.states)g.has(e)||(t.target=0),t.opacity=t.target>t.opacity?Math.min(t.target,t.opacity+_):Math.max(t.target,t.opacity-_),t.target===0&&t.opacity<=0?this.states.delete(e):v.push(t);v.sort((e,t)=>Fs(e.info,t.info,d)),this.stats.candidates=p.length,this.stats.placed=h.length,this.stats.placeMs=Ls()-t,this.buildInstances(v),this.frame=null}bumpView(e){let t=this.proj,n=this.viewKey,r=[t.ex,t.ey,t.ez,e.pitch,e.bearing,e.fovY,e.viewW,e.viewH,this.dpr,this.epoch,t.fx,t.fy,t.fz,t.rx,t.ry,t.rz],i=!1;for(let e=0;e<r.length;e++)n[e]!==r[e]&&(n[e]=r[e],i=!0);i&&this.viewVersion++}zOf(e,t){if(e.zEpoch!==this.epoch){if(e.dir){let n=e.dir;e.z=t.globe?t.globe.heightAtDir(n[0],n[1],n[2]):0}else if(t.ground){let n=t.ground.size;e.z=t.ground.heightAt(Math.min(n,Math.max(0,e.wx)),Math.min(n,Math.max(0,e.wy)))}else e.z=0;Number.isFinite(e.z)||(e.z=0),e.zEpoch=this.epoch}return e.z}ensurePathZ(e,t){if(e.pathEpoch===this.epoch||!e.path||!e.pathZ)return;let n=e.path,r=e.pathZ;if(e.dir)for(let e=0;e<r.length;e++){let i=t.globe?t.globe.heightAtDir(n[3*e],n[3*e+1],n[3*e+2]):0;r[e]=Number.isFinite(i)?i:0}else if(t.ground){let e=t.ground.size;for(let i=0;i<r.length;i++){let a=t.ground.heightAt(Math.min(e,Math.max(0,n[2*i])),Math.min(e,Math.max(0,n[2*i+1])));r[i]=Number.isFinite(a)?a:0}}else r.fill(0);e.pathEpoch=this.epoch}projectDir(e,t,n,r){let i=this.proj,a=this.radius+r,o=e*a,s=t*a,c=n*a,l=i.ex-o,u=i.ey-s,d=i.ez-c;return l*e+u*t+d*n>.3*Math.hypot(l,u,d)&&i.project(o,s,c)}projectAnchor(e,t){let n=e.dir;return n?this.projectDir(n[0],n[1],n[2],t):this.proj.project(e.wx,e.wy,t)}projectVertex(e,t){let n=e.path,r=e.pathZ;return e.dir?this.projectDir(n[3*t],n[3*t+1],n[3*t+2],r[t]):this.proj.project(n[2*t],n[2*t+1],r[t])}anchorWorld(e,t,n){let r=e.dir;if(!r)return n[0]=e.wx,n[1]=e.wy,n[2]=t,[0,0,1];let i=this.radius+t;return n[0]=r[0]*i,n[1]=r[1]*i,n[2]=r[2]*i,[r[0],r[1],r[2]]}occluded(e,t,n){if(!n)return!1;let r=e.dir?t.globe:t.ground;if(!r)return!1;if(e.occFrame>=0&&this.frameNo-e.occFrame<Ds)return e.occluded;if(this.occBudget<=0)return e.occFrame>=0&&e.occluded;this.occBudget--;let i=this.proj,a=this.pt,[o,s,c]=this.anchorWorld(e,e.z,a),l=Math.hypot(a[0]-i.ex,a[1]-i.ey,a[2]-i.ez),u=Math.max(5,.002*l),d=a[0]+o*u-i.ex,f=a[1]+s*u-i.ey,p=a[2]+c*u-i.ez,m=Math.hypot(d,f,p),h=!1;if(m>1){let e=r.raycast({x:i.ex,y:i.ey,z:i.ez},{x:d/m,y:f/m,z:p/m});e&&(h=Math.hypot(e.x-i.ex,e.y-i.ey,e.z-i.ez)<m*.985-20)}return e.occFrame=this.frameNo,e.occluded=h,h}snap(e){return Math.round(e*this.dpr)/this.dpr}textRunFor(e){return e.run=ms(e.adv,e.st.letterSpacingEm*e.sizePx,e.run,e.sizePx/this.glyphs.fontPx),e.run}layout(e){return e.layoutView===this.viewVersion&&e.layoutSize===e.sizePx||(e.layoutView=this.viewVersion,e.layoutSize=e.sizePx,e.hasLayout=e.path?this.layoutPath(e):this.layoutAnchor(e)&&(!e.dir||this.fitDisc(e))),e.hasLayout}fitDisc(e){let t=this.proj,n=e.dir,r=this.radius,i=Math.hypot(t.ex,t.ey,t.ez);if(!(i>r*1.0001)||!t.project(0,0,0))return!0;let a=t.sx,o=t.sy,s=t.ex/i,c=t.ey/i,l=t.ez/i,u=n[0]*s+n[1]*c+n[2]*l,d=n[0]-u*s,f=n[1]-u*c,p=n[2]-u*l,m=Math.hypot(d,f,p);if(m<1e-9)return!0;d/=m,f/=m,p/=m;let h=r/i,g=Math.sqrt(1-h*h);if(!t.project(r*(h*s+g*d),r*(h*c+g*f),r*(h*l+g*p)))return!0;let _=Math.hypot(t.sx-a,t.sy-o)-As,v=Ns(e.boxes,a,o,_);if(v<=0)return!0;if(!js.has(e.lm.kind)||v>Ms*_)return!1;let y=e.boxes,b=0,x=0;for(let e=0;e+3<y.length;e+=4)b+=y[e]+y[e+2],x+=y[e+1]+y[e+3];b/=y.length/2,x/=y.length/2;let S=Math.hypot(a-b,o-x);if(S<1e-6)return!1;let C=(a-b)/S*(v+1),w=(o-x)/S*(v+1);for(let t=0;t<e.gx.length;t++)e.gx[t]+=C,e.gy[t]+=w;for(let e=0;e+3<y.length;e+=4)y[e]+=C,y[e+2]+=C,y[e+1]+=w,y[e+3]+=w;return e.ax+=C,e.ay+=w,Ns(y,a,o,_)<=0}layoutAnchor(e){let t=this.frame,n=this.proj,r=this.zOf(e,t);if(!this.projectAnchor(e,r))return!1;let i=n.sx,a=n.sy,o=n.depth,s=e.sizePx,c=this.textRunFor(e),l=c.length,u=e.glyphs.length,d=e.st.offsetEm*s;if(e.ax=i,e.ay=a,e.st.mode===`rotated`){let t=Math.max(1,40*o*n.pxScale),s=0,f;if(e.tan){let i=this.pt;this.anchorWorld(e,r,i);let a=e.tan;f=n.project(i[0]+a[0]*t,i[1]+a[1]*t,i[2]+a[2]*t)}else f=n.project(e.wx+Math.cos(e.lm.angle)*t,e.wy+Math.sin(e.lm.angle)*t,r);f&&(s=Math.atan2(n.sy-a,n.sx-i),Math.cos(s)<0&&(s=Ps(s+Math.PI)));let p=Math.cos(s),m=Math.sin(s),h=i-m*d,g=a+p*d;for(let t=0;t<u;t++){let n=c.centres[t]-l/2;e.gx[t]=h+p*n,e.gy[t]=g+m*n,e.ga[t]=s}return this.chunkBoxes(e,3,c),!0}let f=this.snap(a+d+Cs*s)-Cs*s,p=this.snap(i-l/2);for(let t=0;t<u;t++)e.gx[t]=p+c.centres[t],e.gy[t]=f,e.ga[t]=0;return e.boxes.length!==4&&(e.boxes=new Float32Array(4)),e.boxes[0]=p,e.boxes[1]=f-ws*s,e.boxes[2]=p+l,e.boxes[3]=f+ws*s,!0}chunkBoxes(e,t,n){let r=e.glyphs.length,i=Math.ceil(r/t);e.boxes.length!==i*4&&(e.boxes=new Float32Array(i*4));let a=ws*e.sizePx;for(let o=0;o<i;o++){let i=1/0,s=1/0,c=-1/0,l=-1/0;for(let u=o*t;u<Math.min(r,(o+1)*t);u++){let t=Math.abs(Math.cos(e.ga[u])),r=Math.abs(Math.sin(e.ga[u])),o=n.widths[u]/2+.5*e.st.letterSpacingEm*e.sizePx,d=t*o+r*a,f=r*o+t*a;i=Math.min(i,e.gx[u]-d),c=Math.max(c,e.gx[u]+d),s=Math.min(s,e.gy[u]-f),l=Math.max(l,e.gy[u]+f)}e.boxes[o*4]=i,e.boxes[o*4+1]=s,e.boxes[o*4+2]=c,e.boxes[o*4+3]=l}}layoutPath(e){let t=this.frame,n=this.proj;this.ensurePathZ(e,t);let r=e.pathZ.length;this.scratch.length<r*2&&(this.scratch=new Float32Array(r*2));let i=this.scratch,a=n.w,o=n.h,s=this.runs;s.length=0;let c=0,l=0;for(let t=0;t<r;t++)if(!(this.projectVertex(e,t)&&n.sx>=4&&n.sx<=a-4&&n.sy>=4&&n.sy<=o-4))c-l>=2&&s.push(l,c),l=c;else{if(c>l&&t<r-1){let e=n.sx-i[2*c-2],t=n.sy-i[2*c-1];if(e*e+t*t<4)continue}i[2*c]=n.sx,i[2*c+1]=n.sy,c++}if(c-l>=2&&s.push(l,c),s.length===0)return!1;let u=this.textRunFor(e),d=null;for(let e=0;e<s.length;e+=2){let t=s[e],n=s[e+1],r=xs(i.subarray(2*t,2*n),n-t,u);r&&(!d||r.cost<d.cost)&&(d=r)}if(!d)return!1;e.gx.set(d.x),e.gy.set(d.y),e.ga.set(d.angle);let f=Math.floor(e.glyphs.length/2);return e.ax=d.x[f],e.ay=d.y[f],this.chunkBoxes(e,2,u),!0}buildInstances(e){let t=0;for(let n of e)t+=n.info.glyphs.length;this.drawnList=[],this.instances.length<t*16&&(this.instances=new Float32Array(Math.ceil(t*1.5)*16));let n=this.instances,r=this.glyphs.fontPx,i=0,a=0;for(let t of e){let e=t.info;if(e.layoutView!==this.viewVersion){let t=e.hasLayout;!this.layout(e)&&t&&!e.dir&&(e.hasLayout=!0)}if(!e.hasLayout)continue;this.drawnList.push(e.lm);let o=e.sizePx,s=o/r,c=e.st.style,l=e.st.emphasis,u=+(e.lm.id===this.highlightId),d=t.opacity*t.opacity*(3-2*t.opacity),f=Cs*o;for(let t=0;t<e.glyphs.length;t++){let r=e.glyphs[t];r.aw!==0&&(n[i]=e.gx[t],n[i+1]=e.gy[t],n[i+2]=e.ga[t],n[i+3]=c,n[i+4]=-.5*r.advance*s+r.left*s,n[i+5]=f+r.top*s,n[i+6]=r.aw*s,n[i+7]=r.ah*s,n[i+8]=r.ax,n[i+9]=r.ay,n[i+10]=r.aw,n[i+11]=r.ah,n[i+12]=d,n[i+13]=l,n[i+14]=u,n[i+15]=s,i+=16,a++)}}this.instanceCount=a,this.stats.glyphs=a}};function Ls(){return typeof performance<`u`?performance.now():Date.now()}var Rs=`#version 300 es
precision highp float;
layout(location = 0) in vec2 a_corner;   // 0..1
layout(location = 1) in vec4 a_pos;      // glyph centre x, y (CSS px), angle, style
layout(location = 2) in vec4 a_quad;     // glyph-local quad ox, oy, w, h (CSS px)
layout(location = 3) in vec4 a_rect;     // atlas rect (px)
layout(location = 4) in vec4 a_misc;     // opacity, emphasis, highlight, CSS px per atlas px
uniform vec2 u_view;     // CSS px
uniform vec2 u_atlas;    // atlas size (px)
uniform float u_spread;  // SDF spread (atlas px)
out vec2 v_uv;
out float v_k;
flat out vec4 v_misc;
flat out float v_style;
void main() {
  vec2 local = a_quad.xy + a_corner * a_quad.zw;
  float c = cos(a_pos.z), s = sin(a_pos.z);
  vec2 p = a_pos.xy + vec2(c * local.x - s * local.y, s * local.x + c * local.y);
  gl_Position = vec4(p.x / u_view.x * 2.0 - 1.0, 1.0 - p.y / u_view.y * 2.0, 0.0, 1.0);
  v_uv = (a_rect.xy + a_corner * a_rect.zw) / u_atlas;
  v_k = 1.0 / (2.0 * u_spread * a_misc.w);   // SDF value change per CSS px
  v_misc = a_misc;
  v_style = a_pos.w;
}`,zs=`#version 300 es
precision highp float;
in vec2 v_uv;
in float v_k;
flat in vec4 v_misc;
flat in float v_style;
uniform sampler2D u_tex;
uniform float u_dpr;
uniform vec3 u_landText;
uniform vec4 u_landHalo;
uniform vec3 u_waterText;
uniform vec4 u_waterHalo;
uniform vec4 u_hlHalo;
out vec4 o;
void main() {
  float d = texture(u_tex, v_uv).r;
  float emph = v_misc.y, hl = v_misc.z;
  float aa = 0.6 * v_k / u_dpr;                        // ~0.6 device px of anti-aliasing
  float edge = 0.5 - emph * 0.3 * v_k;                 // heroes: ~0.3 CSS px bolder
  float text = smoothstep(edge - aa, edge + aa, d);
  float haloPx = 1.7 + 0.3 * emph + 0.6 * hl;
  float he = max(0.02, edge - haloPx * v_k);
  float halo = smoothstep(he - aa - 0.8 * v_k, he + aa, d);   // soft outer edge
  bool water = v_style > 0.5;
  vec3 tc = water ? u_waterText : u_landText;
  vec4 hc = water ? u_waterHalo : u_landHalo;
  hc = mix(hc, u_hlHalo, hl);
  float ha = halo * hc.a * (1.0 - text);
  float a = text + ha;
  if (a * v_misc.x < 0.004) discard;
  vec3 premul = tc * text + hc.rgb * ha;
  o = vec4(premul, a) * v_misc.x;                      // premultiplied, faded
}`,Bs=class{gl;enabled=!0;atlas;engine;colors={landText:[.1,.09,.08],landHalo:[.98,.96,.91,.82],waterText:[.8,.91,1],waterHalo:[.03,.12,.23,.72],highlightHalo:[1,.82,.3,.95]};prog;u;vao;cornerBuf;instBuf;instCapacity=0;constructor(e){this.gl=e,this.atlas=new cs(e),this.engine=new Is(this.atlas),this.prog=en(e,`labels`,Rs,zs),this.u=nn(e,this.prog,[`u_view`,`u_atlas`,`u_spread`,`u_tex`,`u_dpr`,`u_landText`,`u_landHalo`,`u_waterText`,`u_waterHalo`,`u_hlHalo`]),this.vao=e.createVertexArray(),this.cornerBuf=e.createBuffer(),this.instBuf=e.createBuffer(),e.bindVertexArray(this.vao),e.bindBuffer(e.ARRAY_BUFFER,this.cornerBuf),e.bufferData(e.ARRAY_BUFFER,new Float32Array([0,0,1,0,1,1,0,0,1,1,0,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.instBuf);for(let t=0;t<4;t++)e.enableVertexAttribArray(1+t),e.vertexAttribPointer(1+t,4,e.FLOAT,!1,64,t*16),e.vertexAttribDivisor(1+t,1);e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null)}setLandmarks(e,t,n=0){this.engine.setLandmarks(e,t,n)}highlight(e){this.engine.highlight(e)}hitTest(e,t){return this.enabled?this.engine.hitTest(e,t):null}get animating(){return this.enabled&&this.engine.animating}get stats(){return this.engine.stats}draw(e){if(!this.enabled)return;let t=this.engine;if(t.update(e),t.instanceCount===0)return;let n=this.gl;this.atlas.flush(),n.bindBuffer(n.ARRAY_BUFFER,this.instBuf);let r=t.instances.subarray(0,t.instanceCount*16);r.length>this.instCapacity&&(this.instCapacity=Math.max(r.length,this.instCapacity*2,4096),n.bufferData(n.ARRAY_BUFFER,this.instCapacity*4,n.DYNAMIC_DRAW)),n.bufferSubData(n.ARRAY_BUFFER,0,r),n.bindBuffer(n.ARRAY_BUFFER,null),n.useProgram(this.prog);let i=this.u,a=this.colors;n.uniform2f(i.u_view,e.cam.viewW,e.cam.viewH),n.uniform2f(i.u_atlas,this.atlas.width,this.atlas.height),n.uniform1f(i.u_spread,this.atlas.spread),n.uniform1f(i.u_dpr,Math.max(1,e.dpr)),n.uniform3fv(i.u_landText,a.landText),n.uniform4fv(i.u_landHalo,a.landHalo),n.uniform3fv(i.u_waterText,a.waterText),n.uniform4fv(i.u_waterHalo,a.waterHalo),n.uniform4fv(i.u_hlHalo,a.highlightHalo),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.atlas.texture),n.uniform1i(i.u_tex,0);let o=n.isEnabled(n.DEPTH_TEST),s=n.isEnabled(n.CULL_FACE);n.disable(n.DEPTH_TEST),n.disable(n.CULL_FACE),n.depthMask(!1),n.enable(n.BLEND),n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA),n.bindVertexArray(this.vao),n.drawArraysInstanced(n.TRIANGLES,0,6,t.instanceCount),n.bindVertexArray(null),n.disable(n.BLEND),n.depthMask(!0),o&&n.enable(n.DEPTH_TEST),s&&n.enable(n.CULL_FACE)}dispose(){let e=this.gl;e.deleteProgram(this.prog),e.deleteVertexArray(this.vao),e.deleteBuffer(this.cornerBuf),e.deleteBuffer(this.instBuf),this.atlas.dispose()}},Vs=`#version 300 es
layout(location = 0) in vec2 a_pos;
out vec2 v_ndc;
void main() {
  v_ndc = a_pos;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`,Hs=`#version 300 es
precision highp float;
in vec2 v_ndc;
uniform mat4 u_invViewProj;
uniform vec3 u_horizon;
uniform vec3 u_zenith;
uniform vec3 u_sun;
uniform vec3 u_glow;     // sun glow colour × strength (0 at night)
uniform float u_nearZ;   // NDC depth of the near plane: 1 with reversed-Z, −1 otherwise
out vec4 o;
void main() {
  vec4 a = u_invViewProj * vec4(v_ndc, u_nearZ, 1.0);
  vec4 b = u_invViewProj * vec4(v_ndc, 0.5, 1.0);
  vec3 d = normalize(b.xyz / b.w - a.xyz / a.w);
  float up = d.z;
  vec3 c = mix(u_horizon, u_zenith, smoothstep(0.0, 0.45, up));
  c = mix(c, u_horizon * 0.3, smoothstep(0.0, -0.25, up));   // below the horizon: beyond the world edge
  c += u_glow * pow(max(dot(d, u_sun), 0.0), 64.0);
  o = vec4(pow(c, vec3(1.0 / 1.1)), 1.0);
}`,Us=class{gl;prog;u;vao;inv=_n();inv32=new Float32Array(16);constructor(e){this.gl=e,this.prog=en(e,`sky`,Vs,Hs),this.u=nn(e,this.prog,[`u_invViewProj`,`u_horizon`,`u_zenith`,`u_sun`,`u_glow`,`u_nearZ`]),this.vao=e.createVertexArray(),e.bindVertexArray(this.vao),e.bindBuffer(e.ARRAY_BUFFER,rn(e)),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null)}draw(e,t,n,r){if(!Cn(this.inv,e))return;this.inv32.set(this.inv);let i=this.gl;i.useProgram(this.prog),i.uniformMatrix4fv(this.u.u_invViewProj,!1,this.inv32),i.uniform3f(this.u.u_horizon,t.horizon[0],t.horizon[1],t.horizon[2]),i.uniform3f(this.u.u_zenith,t.zenith[0],t.zenith[1],t.zenith[2]),i.uniform3f(this.u.u_glow,t.glow[0],t.glow[1],t.glow[2]),i.uniform3f(this.u.u_sun,n[0],n[1],n[2]),i.uniform1f(this.u.u_nearZ,r?1:-1),i.bindVertexArray(this.vao),i.drawArrays(i.TRIANGLES,0,6),i.bindVertexArray(null)}},Ws=`
uniform sampler2D u_clim2;    // RGBA8 linear: r seasonal half-range T/30 °C, g cloudiness/humidity, b deciduous, a conifer
uniform float u_cloudAmount;  // 0 = clouds off
uniform vec2 u_cloudDrift;    // wind drift of the cloud field (m)
uniform float u_cloudZ;       // cloud base in render space (m, exaggerated)
uniform float u_fogK;         // valley-fog strength from the sun and the season (0 at the default)
uniform vec3 u_lightCol;      // direct light colour × intensity (1 at the default)
uniform vec3 u_ambient;       // ambient light multiplier (1 at the default)

float atHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float atNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(atHash(i), atHash(i + vec2(1, 0)), u.x), mix(atHash(i + vec2(0, 1)), atHash(i + 1.0), u.x), u.y);
}

float cloudDensity(vec2 w, float foot) {
  float cover = u_cloudAmount * texture(u_clim2, vec2(w.x, u_size - w.y) / u_size).g;
  if (cover < 0.01) return 0.0;
  vec2 p = w + u_cloudDrift;
  // Weather systems (~100 km) modulate the cover; cumulus-scale octaves fade out below ~4 px.
  float big = atNoise(p / 110000.0 + 3.1);
  float n = 0.45 * atNoise(p / 9000.0);
  float amp = 0.3;
  float lam = 3400.0;
  for (int k = 0; k < 3; k++) {
    float f = 1.0 - smoothstep(lam * 0.25, lam * 0.5, foot);
    n += amp * mix(0.5, atNoise(p / lam + float(k) * 7.31), f);
    amp *= 0.55;
    lam *= 0.38;
  }
  float c = clamp(cover * (0.3 + 1.2 * big), 0.0, 1.0);
  float t = 1.0 - c;
  return smoothstep(t - 0.05, t + 0.3, n) * smoothstep(0.02, 0.2, c);
}

// The cloud above a surface point along the light direction; soft (low octaves only).
float cloudShadow(vec2 w, float z, float foot) {
  if (u_cloudAmount <= 0.0 || z >= u_cloudZ) return 1.0;
  vec2 q = w + u_sun.xy / max(u_sun.z, 0.15) * (u_cloudZ - z);
  return 1.0 - 0.6 * cloudDensity(q, max(foot, 400.0));
}

float valleyFog(vec2 w, float pot, float humid, float foot) {
  if (u_fogK <= 0.0 || pot <= 0.004) return 0.0;
  float fine = 1.0 - smoothstep(250.0, 500.0, foot);
  float n = 0.65 * atNoise((w + 0.25 * u_cloudDrift) / 3500.0) + 0.35 * mix(0.5, atNoise(w / 1000.0 + 5.3), fine);
  return smoothstep(0.2, 0.85, pot * (0.4 + 0.9 * humid) + 0.45 * (n - 0.5)) * u_fogK;
}

vec3 fogColor() {
  return mix(u_hazeColor, vec3(0.92, 0.93, 0.95), 0.6) * min(vec3(1.0), 0.75 * u_ambient + 0.35 * u_lightCol);
}
`,Gs=[`u_clim2`,`u_cloudAmount`,`u_cloudDrift`,`u_cloudZ`,`u_fogK`,`u_lightCol`,`u_ambient`],Ks=new WeakMap;function qs(e,t,n,r){let i=Ks.get(t);if(!i){i={};for(let n of Gs)i[n]=e.getUniformLocation(t,n);Ks.set(t,i)}e.activeTexture(e.TEXTURE0+r),e.bindTexture(e.TEXTURE_2D,n.clim2),e.uniform1i(i.u_clim2,r),e.uniform1f(i.u_cloudAmount,n.cloudAmount),e.uniform2f(i.u_cloudDrift,n.cloudDrift[0],n.cloudDrift[1]),e.uniform1f(i.u_cloudZ,n.cloudZ),e.uniform1f(i.u_fogK,n.fogK),e.uniform3f(i.u_lightCol,n.light[0],n.light[1],n.light[2]),e.uniform3f(i.u_ambient,n.ambient[0],n.ambient[1],n.ambient[2])}var Js=`#version 300 es
precision highp float;
layout(location = 0) in vec2 a_pos;
uniform mat4 u_viewProj;
uniform vec3 u_origin;
uniform float u_extent;
uniform float u_cloudZ;
out vec3 v_rel;
void main() {
  // A horizontal sheet at the cloud base, centred under the camera (camera-relative coordinates).
  v_rel = vec3(a_pos * u_extent, u_cloudZ - u_origin.z);
  gl_Position = u_viewProj * vec4(v_rel, 1.0);
}`,Ys=`#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
in vec3 v_rel;
uniform vec3 u_origin;
uniform float u_size;
uniform vec3 u_sun;
uniform vec3 u_hazeColor;
uniform float u_haze;
uniform float u_alpha;
${Ws}
out vec4 o;
void main() {
  vec2 w = v_rel.xy + u_origin.xy;
  float foot = length(fwidth(w));
  float edge = min(min(w.x, w.y), min(u_size - w.x, u_size - w.y));
  float d = cloudDensity(w, foot) * smoothstep(-40000.0, 0.0, edge);
  if (d < 0.01) discard;
  // Thinner cloud toward the sun means this is the sunlit flank.
  vec2 sd = u_sun.xy / max(1e-3, length(u_sun.xy));
  float toward = cloudDensity(w + sd * 1800.0, max(foot, 700.0));
  float lit = clamp(0.75 + 1.2 * (d - toward), 0.35, 1.0);
  // Thick cores read brighter (tops in the sun), thin edges greyer and more transparent.
  vec3 col = (0.82 + 0.18 * d) * (u_lightCol * (0.5 + 0.38 * lit) + u_ambient * vec3(0.55, 0.60, 0.68) * 0.32);
  col = mix(col, u_hazeColor, 1.0 - exp(-length(v_rel) * u_haze));
  o = vec4(pow(col, vec3(1.0 / 1.1)), d * d * (3.0 - 2.0 * d) * u_alpha);
}`,Xs=class{gl;prog;u;vao;constructor(e){this.gl=e,this.prog=en(e,`clouds`,Js,Ys),this.u=nn(e,this.prog,[`u_viewProj`,`u_origin`,`u_extent`,`u_cloudZ`,`u_size`,`u_sun`,`u_hazeColor`,`u_haze`,`u_alpha`]),this.vao=e.createVertexArray(),e.bindVertexArray(this.vao),e.bindBuffer(e.ARRAY_BUFFER,rn(e)),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null)}draw(e){if(e.alpha<=0||e.atmos.cloudAmount<=0||e.origin.z<=e.atmos.cloudZ)return;let t=this.gl;t.useProgram(this.prog);let n=Math.hypot(e.origin.x-e.worldSize/2,e.origin.y-e.worldSize/2);t.uniformMatrix4fv(this.u.u_viewProj,!1,e.viewProj),t.uniform3f(this.u.u_origin,e.origin.x,e.origin.y,e.origin.z),t.uniform1f(this.u.u_extent,e.worldSize*.75+n+5e4),t.uniform1f(this.u.u_cloudZ,e.atmos.cloudZ),t.uniform1f(this.u.u_size,e.worldSize),t.uniform3f(this.u.u_sun,e.sun[0],e.sun[1],e.sun[2]),t.uniform3f(this.u.u_hazeColor,e.hazeColor[0],e.hazeColor[1],e.hazeColor[2]),t.uniform1f(this.u.u_haze,e.haze),t.uniform1f(this.u.u_alpha,e.alpha),qs(t,this.prog,e.atmos,0),t.enable(t.BLEND),t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE),t.depthMask(!1),t.bindVertexArray(this.vao),t.drawArrays(t.TRIANGLES,0,6),t.bindVertexArray(null),t.depthMask(!0),t.disable(t.BLEND)}},Zs=45*Math.PI/180,Qs=.55,$s=40*Math.PI/180;function ec(e){return 23.44*Math.PI/180*Math.sin(2*Math.PI*(e-.22))}function tc(e,t,n=Zs){let r=(e-12)/24*2*Math.PI,i=ec(t);return[-Math.cos(i)*Math.sin(r),Math.sin(i)*Math.cos(n)-Math.cos(i)*Math.sin(n)*Math.cos(r),Math.sin(i)*Math.sin(n)+Math.cos(i)*Math.cos(n)*Math.cos(r)]}var nc=(()=>{let e=12,t=20;for(let n=0;n<50;n++){let n=.5*(e+t);Math.asin(tc(n,.55)[2])>$s?e=n:t=n}return .5*(e+t)})(),rc=(()=>{let e=tc(nc,Qs);return Math.atan2(e[0],e[1])})(),ic={time:nc,season:Qs,sun:!0,seasons:!0,clouds:!0,animate:!1},ac=.22,oc=[.62,.7,.78],sc=[.22,.38,.62],cc=[.9,.62,.44],lc=[.2,.27,.48],uc=[.05,.07,.12],dc=[.012,.02,.05];function fc(e,t,n,r=Zs){let i=tc(e,t,r),a=i[2],o=Math.sqrt(Math.max(0,1-a*a)),s=n-Math.PI/4+(Math.atan2(i[0],i[1])-rc),c=[Math.sin(s)*o,Math.cos(s)*o,a],l=yc(-.05,.08,a),u=1-yc(.05,.45,a),d=1-yc(-.12,0,a),f=yc(-.15,.05,a),p=vc([1,1,1],[1,.62,.36],u),m=l*(1-.3*u),h=.22*d,g,_;if(a>-.03){let e=Math.max(a,.03),t=Math.sqrt(1-e*e);g=[Math.sin(s)*t,Math.cos(s)*t,e],_=[p[0]*m,p[1]*m,p[2]*m]}else{let e=Math.sin(35*Math.PI/180),t=Math.cos(35*Math.PI/180);g=[-Math.sin(s)*t,-Math.cos(s)*t,e],_=[.55*h,.68*h,1*h]}let v=yc(-.14,.25,a),y=1+.5*u*l,b=vc([.1,.13,.24],vc([y,y,y],[1.08*y,.92*y,.86*y],u*l),v),x=1-yc(0,.35,a),S=vc(uc,vc(oc,cc,x),f),C=vc(dc,vc(sc,lc,x),f),w=.35+.45*u,T=vc([1,.92,.75],[1,.55,.28],u).map(e=>e*w*l),E=e<12?1:.2,D=(1-yc(.08,.5,a))*_c(.55,1,E)*_c(1,.6,d);return{dir:g,sunDir:c,sinEl:a,light:_,ambient:b,skyHorizon:S,skyZenith:C,glow:T,fog:D}}function pc(e){let t=2*Math.PI*(e-Qs);return{cos:Math.cos(t),sin:Math.sin(t)}}function mc(e){let t=Math.round((e%24+24)%24*60)%1440;return`${String(Math.floor(t/60)).padStart(2,`0`)}:${String(t%60).padStart(2,`0`)}`}var hc=[`Jan`,`Feb`,`Mar`,`Apr`,`May`,`Jun`,`Jul`,`Aug`,`Sep`,`Oct`,`Nov`,`Dec`];function gc(e){let t=(e%1+1)%1*12,n=Math.floor(t);return`${t-n<1/3?`early`:t-n<2/3?`mid`:`late`} ${hc[n]}`}function _c(e,t,n){return e+(t-e)*n}function vc(e,t,n){return[_c(e[0],t[0],n),_c(e[1],t[1],n),_c(e[2],t[2],n)]}function yc(e,t,n){let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)}var bc=`
uniform sampler2D u_height;   // R32F, row 0 = north
uniform int u_hn;             // height raster size (cells per side)
uniform float u_size;         // world size (m)
uniform vec3 u_origin;        // camera-relative origin (world m), split hi/lo not needed below 4096 km for M2

uniform sampler2D u_water;    // R32F water level (m), < -9000 = dry; same grid as u_height
uniform int u_hasWater;

float hFetch(ivec2 t) { return texelFetch(u_height, clamp(t, ivec2(0), ivec2(u_hn - 1)), 0).r; }
float wFetch(ivec2 t) {
  if (u_hasWater == 0) return hFetch(t) < 0.0 ? 0.0 : -10000.0;
  return texelFetch(u_water, clamp(t, ivec2(0), ivec2(u_hn - 1)), 0).r;
}
// Rendered surface per texel: the water lid max(terrain, water level).
float sFetch(ivec2 t) {
  float h = hFetch(t), wl = wFetch(t);
  return wl > -9000.0 ? max(h, wl) : max(h, 0.0);
}

// Manual bilinear (R32F is not filterable everywhere; research 04 §1.3). w = world xy (m).
float rawHeight(vec2 w) {
  vec2 p = vec2(w.x, u_size - w.y) / u_size * float(u_hn) - 0.5;
  ivec2 i = ivec2(floor(p));
  vec2 f = p - vec2(i);
  float a = hFetch(i), b = hFetch(i + ivec2(1, 0)), c = hFetch(i + ivec2(0, 1)), d = hFetch(i + ivec2(1, 1));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float surfaceHeight(vec2 w) {
  vec2 p = vec2(w.x, u_size - w.y) / u_size * float(u_hn) - 0.5;
  ivec2 i = ivec2(floor(p));
  vec2 f = p - vec2(i);
  float a = sFetch(i), b = sFetch(i + ivec2(1, 0)), c = sFetch(i + ivec2(0, 1)), d = sFetch(i + ivec2(1, 1));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Bilinear water level (levels are pre-extended around water bodies, so this is smooth at shores).
float waterLevelAt(vec2 w) {
  vec2 p = vec2(w.x, u_size - w.y) / u_size * float(u_hn) - 0.5;
  ivec2 i = ivec2(floor(p));
  vec2 f = p - vec2(i);
  return mix(mix(wFetch(i), wFetch(i + ivec2(1, 0)), f.x), mix(wFetch(i + ivec2(0, 1)), wFetch(i + ivec2(1, 1)), f.x), f.y);
}`,xc=`#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
layout(location = 0) in vec2 a_grid;      // 0..GRID
layout(location = 1) in vec4 a_node;      // rel x, rel y, size, level
layout(location = 2) in vec2 a_morph;     // morph start, end (m)
uniform mat4 u_viewProj;
uniform float u_exag;
uniform float u_pxScale;  // metres per pixel per metre of distance: 2·tan(fovY/2)/viewH
${bc}
${_a}
out vec3 v_world;     // absolute world xy (z unused: the FS recomputes the height per pixel)
out float v_dist;
void main() {
  float size = a_node.z;
  vec2 rel0 = a_node.xy + a_grid / 32.0 * size;
  vec2 w0 = rel0 + u_origin.xy;
  float d0 = length(vec3(rel0, surfaceHeight(w0) * u_exag - u_origin.z));
  // Geomorph toward the coarser grid near the end of this level's range.
  float k = clamp((d0 - a_morph.x) / (a_morph.y - a_morph.x), 0.0, 1.0);
  vec2 g = a_grid - fract(a_grid * 0.5) * 2.0 * k;
  vec2 rel = a_node.xy + g / 32.0 * size;
  vec2 w = rel + u_origin.xy;
  // Geometry can't hold wavelengths under ~2 vertex spacings: the footprint is at least the spacing,
  // and grows with the morph factor so detail octaves fade together with vertex snapping.
  float spacing = size / 32.0;
  float foot = max(d0 * u_pxScale, spacing * (1.0 + k));
  float z = terrainSurface(w, foot) * u_exag;   // water lid: sea at 0, lakes at their level
  vec3 pos = vec3(rel, z - u_origin.z);
  v_world = vec3(w, 0.0);
  v_dist = length(pos);
  gl_Position = u_viewProj * vec4(pos, 1.0);
}`,Sc=`#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
in vec3 v_world;
in float v_dist;
uniform vec3 u_sun;          // unit vector toward the sun
uniform float u_normalExag;  // lighting exaggeration (stronger when zoomed out)
uniform float u_cell;        // height raster cell size (m)
uniform float u_haze;        // haze density (1/m)
uniform vec3 u_hazeColor;
uniform float u_time;
uniform sampler2D u_grad;    // RG16F + mipmaps: surface dh/dx, dh/dy (world axes) at texel centres
uniform sampler2D u_wclass;  // R32F water class (0 land, 1 ocean, 2 lake, 3 river, 4 wetland, 5 playa, 6 salt lake)
uniform int u_hasClass;
uniform sampler2D u_masks;   // RGBA8, linear: r wetland, g salt flat (blurred one cell)
uniform sampler2D u_climate; // RGBA16F, linear: mean T (°C), aridity P/PET, summer rain share, canopy
uniform sampler2D u_cover;   // RGBA8, linear: snow/ice, bare rock, sand (beach + salt flat), marsh/bog/mangrove
uniform sampler2D u_lut;     // biome colour LUT over (T, aridity) in rows 0–63, its dry-summer variant in 64–127
uniform sampler2D u_biomePal; // 32×1 biome colours (biome map mode)
uniform int u_hasSurface;
uniform sampler2D u_sunVis;  // horizon pass: r = sun visibility
uniform sampler2D u_ao;      // horizon pass: r/g = ambient occlusion in g
uniform int u_hasLight;
uniform sampler2D u_reef;    // RGBA8 linear landform masks: r reef, g erg (sand sea), b crater ejecta, a cliff
uniform int u_hasReef;
uniform int u_palette;       // 0 biome LUT (satellite / stylised), 1 hypsometric
uniform sampler2D u_layer;   // optional draped layer
uniform ivec2 u_layerSize;
uniform int u_layerMode;     // 0 realistic, 1 categorical, 2 scalar, 3 biome palette
uniform float u_layerMin, u_layerMax;
uniform float u_exag;
uniform int u_realistic;     // 1: season, vegetation, clouds and fog apply (realistic colouring only)
uniform vec2 u_season;       // seasonal temperature cycle (cos, sin) of the phase; (1, 0) at the warm peak (default)
${bc}
${_a}
${Or}
${Ws}
out vec4 o;

// Mipmapped, hardware-filtered gradient: smooth normals, and detail below a pixel averages out
// instead of aliasing into blocky shading when 1 km cells are only a few pixels wide.
vec2 gradAt(vec2 w) {
  vec2 uv = vec2(w.x, u_size - w.y) / u_size;
  float texelsPerPx = length(fwidth(w)) / u_cell;
  return textureLod(u_grad, uv, max(0.0, log2(max(texelsPerPx, 1e-6)) - 0.5)).rg;
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1, 0)), u.x), mix(hash12(i + vec2(0, 1)), hash12(i + 1.0), u.x), u.y);
}
float fbm3(vec2 p) { return 0.5 * vnoise(p) + 0.3 * vnoise(p * 2.03 + 7.1) + 0.2 * vnoise(p * 4.1 - 3.3); }

// Tree crowns on a jittered grid of spacing S (m), research 04 §6: a Worley-style 3×3 search for the
// nearest crown relative to its radius (jitter ±0.4 hides the lattice). Coverage, the sunlit side and
// the ground shadow all come from that one crown, so each cell costs a hash and a dot product.
// Returns x crown coverage, y sunlit side of the crown, z crown shadow on the ground.
vec3 crownLayer(vec2 w, float S, float dens, vec2 sunDir, float shOff, float rMin, float seed) {
  vec2 g = w / S;
  vec2 b = floor(g) - 1.0;
  float best = 1e9;
  vec2 bd = vec2(9.0);
  float br = 1.0;
  for (int k = 0; k < 9; k++) {
    vec2 cell = b + vec2(float(k % 3), float(k / 3));
    float hh = hash12(cell + seed);
    if (hh >= dens) continue;
    // Jitter and size come from the hash's fractional digits (one hash per cell).
    vec2 d = g - cell - 0.5 - 0.8 * (fract(hh * vec2(97.13, 61.71) + 0.31) - 0.5);
    float r = rMin + 0.12 * fract(hh * 37.1);
    float q = dot(d, d) / (r * r);
    if (q < best) { best = q; bd = d; br = r; }
  }
  if (best > 4.0) return vec3(0.0);
  float cov = 1.0 - smoothstep(0.6, 1.0, sqrt(best));
  float lit = cov * clamp(0.5 + 0.7 * dot(bd, sunDir) / br, 0.0, 1.0);
  float sh = 1.0 - smoothstep(0.5 * br, br, length(bd + sunDir * shOff));
  return vec3(cov, lit, sh);
}

// Biome colour from climate (research 03 §3.4, §5.3): LUT over jittered (T, aridity), dry-summer
// blend, colour variation at three scales, canopy, then overrides (sand, marsh, rock, snow).
vec3 landColor(vec2 w, float h, vec3 n, float pxFoot, vec2 grad, vec4 c2) {
  vec2 uv = vec2(w.x, u_size - w.y) / u_size;
  vec4 cl = texture(u_climate, uv);
  vec4 cv = texture(u_cover, uv);
  // Footprint fade so sub-pixel noise doesn't shimmer.
  float fine = 1.0 - smoothstep(600.0, 2500.0, pxFoot);
  // Season (M9): T(s) = annual mean + half-range·cos(phase), carried by the lapse rate from the macro
  // grid to the detailed surface so snowlines follow ridges. Every term is zero at the warm peak.
  bool seasonal = u_realistic == 1 && u_season.x < 0.9999;
  float tAmp = c2.r * 30.0;
  float tLapse = seasonal ? -0.0065 * (h - rawHeight(w)) : 0.0;
  float tNow = cl.r + tAmp * u_season.x + tLapse;
  float tPeak = cl.r + tAmp + tLapse;
  float winter = max(0.0, -u_season.x);
  float t = cl.r + 3.0 * (fbm3(w / 35000.0) - 0.5);
  float ai = max(0.02, cl.g) * exp(0.4 * (fbm3(w / 28000.0 + 11.0) - 0.5));
  vec2 luv = clamp(vec2((t + 20.0) / 50.0, log(ai * 10.0) / log(10.0) / 2.0), 0.5 / 64.0, 1.0 - 0.5 / 64.0);
  // Dry-summer (Mediterranean) colours green up in the wet winter.
  float drySummer = smoothstep(0.45, 0.30, cl.b) * (1.0 - 0.7 * winter);
  vec3 c = mix(texture(u_lut, vec2(luv.x, 0.5 * luv.y)).rgb, texture(u_lut, vec2(luv.x, 0.5 + 0.5 * luv.y)).rgb, drySummer);
  c *= 0.88 + 0.24 * fbm3(w / 90000.0 + 3.0);                    // geology scale
  c *= mix(1.0, 0.9 + 0.2 * vnoise(w / 3500.0), fine);           // field / patch mosaic
  c *= 1.0 - 0.1 * cl.a;                                         // dense canopy reads darker
  float forest = smoothstep(0.2, 0.7, cl.a);
  float sSnow = 0.0;
  float bare = 0.0;
  if (seasonal) {
    // Deciduous trees: autumn colours while cooling through ~14 → 5 °C, bare below; leaves return later in spring.
    float decid = c2.b * forest;
    float leafNow = smoothstep(4.0, 9.0, tNow - 2.0 * smoothstep(0.0, 0.25, -u_season.y));
    float leafPeak = smoothstep(4.0, 9.0, tPeak);
    bare = decid * max(0.0, leafPeak - leafNow);
    float autumn = decid * leafNow * smoothstep(0.0, 0.25, u_season.y) * (1.0 - smoothstep(8.0, 14.0, tNow));
    vec3 autumnC = mix(vec3(0.46, 0.25, 0.10), vec3(0.50, 0.41, 0.15), vnoise(w / 650.0)) * (0.8 + 0.5 * dot(c, vec3(0.3, 0.5, 0.2)) / 0.3);
    c = mix(c, autumnC, autumn * 0.65);
    c = mix(c, vec3(0.38, 0.34, 0.29) * (0.9 + 0.2 * vnoise(w / 2000.0)), bare * 0.7);
    // Grass browns in its dry season (summer-rain climates) and goes dormant in frost.
    float grassy = smoothstep(0.1, 0.3, ai) * (1.0 - smoothstep(1.2, 2.5, ai)) * (1.0 - 0.6 * forest);
    float dormant = max(0.0, smoothstep(5.0, -1.0, tNow) - smoothstep(5.0, -1.0, tPeak));
    float straw = clamp(max(0.6 * dormant, smoothstep(0.55, 0.8, cl.b) * winter), 0.0, 1.0) * grassy;
    c = mix(c, c * vec3(1.3, 1.08, 0.68) + vec3(0.07, 0.05, 0.0), straw * 0.75);
    // Seasonal snow where the place is below freezing now but not at the warm peak; needs some precipitation.
    sSnow = max(0.0, smoothstep(1.5, -3.0, tNow) - smoothstep(1.5, -3.0, tPeak)) * smoothstep(0.08, 0.3, ai);
  }
  if (u_hasReef == 1) {
    vec4 lm = texture(u_reef, uv);
    // Sand seas: warmer, redder sand with dune ridges (≈2 km wavelength) until the detail map takes over.
    float erg = smoothstep(0.05, 0.9, lm.g + 0.25 * (fbm3(w / 14000.0 + 5.0) - 0.5));
    float dunes = 0.5 + 0.5 * sin(dot(w, vec2(0.94, 0.34)) / 320.0 + 4.0 * fbm3(w / 9000.0));
    float duneFade = 1.0 - smoothstep(250.0, 700.0, pxFoot);
    c = mix(c, vec3(0.82, 0.64, 0.42) * (0.92 + 0.12 * dunes * duneFade), erg * 0.55);
    c = mix(c, c * 1.25 + 0.05, smoothstep(0.2, 0.9, lm.b) * 0.5);   // bright crater ejecta
  }
  c = mix(c, vec3(0.86, 0.80, 0.66), smoothstep(0.15, 0.7, cv.b) * 0.9);   // beach / dunes / salt
  c = mix(c, vec3(0.24, 0.32, 0.22), smoothstep(0.15, 0.8, cv.a) * 0.5);   // marsh / bog / mangrove
  float slope = length(grad);
  float rock = max(smoothstep(0.2, 0.75, cv.g), smoothstep(0.35, 0.75, slope));
  vec3 rockCol = vec3(0.44, 0.42, 0.40) * (0.85 + 0.3 * fbm3(w / 6000.0));
  c = mix(c, rockCol, rock * 0.85);
  // Snow lingers on poleward (north-facing) and gentle slopes; elevation noise breaks the snowline.
  float snowBreak = 0.15 * n.y + 0.35 * (fbm3(w / 7000.0) - 0.5) + 0.15 * (vnoise(w / 1800.0) - 0.5) * fine
    - 0.3 * smoothstep(0.6, 1.2, slope);
  float snow = smoothstep(0.35, 0.95, 0.85 * cv.r + snowBreak);
  vec3 snowCol = vec3(0.90, 0.92, 0.96);
  c = mix(c, snowCol, snow * 0.85);
  if (u_realistic == 0) return c;
  // Seasonal snow lies on open ground; the canopy hides most of it (crowns are drawn over it below).
  float ground = sSnow > 0.0 ? smoothstep(0.15, 0.7, sSnow + 0.6 * snowBreak) * (1.0 - rock * 0.6) : 0.0;
  vec3 gapC = mix(c, snowCol, ground * 0.85);
  c = mix(c, snowCol, ground * 0.85 * (1.0 - 0.6 * forest * (1.0 - 0.5 * bare)));

  // Vegetation (M9, research 04 §6): stand clumps (~40 m) below ~25 m/px and tree crowns (~13 m)
  // below ~7 m/px, each faded by pixel footprint to the flat canopy colour (no shimmer).
  float dens = smoothstep(0.12, 0.8, cl.a) * (1.0 - rock) * (1.0 - snow);
  float fadeClump = 1.0 - smoothstep(12.0, 26.0, pxFoot);
  if (dens < 0.02 || fadeClump <= 0.0) return c;
  // Conifers by temperature and biome: bluer, smaller crowns with crisper shadows.
  float conif = clamp(max(c2.a, 1.0 - smoothstep(0.0, 7.0, cl.r)) * (1.0 - c2.b), 0.0, 1.0);
  vec3 tint = mix(vec3(0.98, 1.03, 0.90), vec3(0.86, 1.0, 1.08), conif);   // hue only, ~unit luminance
  float sl = length(u_sun.xy);
  vec2 sd = sl > 1e-3 ? u_sun.xy / sl : vec2(0.0, 1.0);
  float shOff = clamp(0.1 * sl / max(u_sun.z, 0.05), 0.04, 0.25);
  // Crowns are lit on the sun side; gaps read darker in a closed forest and as open ground in
  // woodland. Each layer is divided by its expected mean (Poisson coverage) so the fade to the flat
  // canopy colour keeps the same tone at every zoom.
  float gapK = mix(1.05, mix(0.74, 0.9, conif), dens);
  float D1 = 0.2 + 0.65 * dens;
  vec3 k1 = crownLayer(w, 40.0, D1, sd, shOff, 0.42, 3.7);
  float cm1 = 1.0 - exp(-0.55 * D1);
  float e1 = cm1 * mix(1.03, 0.9, conif) + (1.0 - cm1) * gapK * (1.0 - 0.12 * cm1);
  vec3 crown1 = mix(c * tint, vec3(0.36, 0.33, 0.28), bare * 0.5) * mix(0.85 + 0.35 * k1.y, 0.78 + 0.25 * k1.y, conif);
  vec3 mid = mix(gapC * gapK * (1.0 - 0.35 * k1.z), crown1, k1.x) / e1;
  vec3 col = mix(c, mid, fadeClump * 0.8);
  float fadeCrown = 1.0 - smoothstep(3.5, 7.0, pxFoot);
  if (fadeCrown > 0.0) {
    float D2 = min(0.95, dens * mix(0.55, 1.15, k1.x));
    float r2 = mix(0.58, 0.42, conif) + 0.06;
    vec3 k2 = crownLayer(w, 13.0, D2, sd, shOff, r2 - 0.06, 11.9);
    float cm2 = 1.0 - exp(-3.14 * 0.72 * r2 * r2 * dens * 0.85);
    float e2 = cm2 * mix(0.98, 0.8, conif) + (1.0 - cm2) * gapK * (1.0 - 0.15 * cm2);
    vec3 crown2 = mix(c * tint, vec3(0.36, 0.33, 0.28), bare * 0.6) * mix(0.72 + 0.52 * k2.y, 0.62 + 0.36 * k2.y, conif);
    vec3 near = mix(gapC * gapK * (1.0 - 0.45 * k2.z), crown2, k2.x) / e2;
    col = mix(col, near, fadeCrown * 0.85);
  }
  return col;
}

float layerFetch(ivec2 t) { return texelFetch(u_layer, clamp(t, ivec2(0), u_layerSize - 1), 0).r; }
float layerAt(vec2 w, bool nearest) {
  vec2 p = vec2(w.x, u_size - w.y) / u_size * vec2(u_layerSize);
  if (nearest) return layerFetch(ivec2(floor(p)));
  p -= 0.5;
  ivec2 i = ivec2(floor(p));
  vec2 f = p - vec2(i);
  return mix(mix(layerFetch(i), layerFetch(i + ivec2(1, 0)), f.x), mix(layerFetch(i + ivec2(0, 1)), layerFetch(i + ivec2(1, 1)), f.x), f.y);
}

void main() {
  vec2 w = v_world.xy;
  // Per-pixel height: the vertex-interpolated value shows coarse LOD triangles in water colour.
  float pxFoot0 = length(fwidth(w));
  vec3 ds = detailSample(w, pxFoot0);
  float h = ds.x;
  vec2 wp = vec2(w.x, u_size - w.y) / u_size * float(u_hn);
  float cls = u_hasClass == 1 ? texelFetch(u_wclass, clamp(ivec2(floor(wp)), ivec2(0), ivec2(u_hn - 1)), 0).r : (h < 0.0 ? 1.0 : 0.0);
  float wl = waterLevelAt(w);
  bool lake = cls > 1.5 && cls < 2.5 || cls > 5.5;
  bool water = u_hasWater == 1 ? wl > h && (lake || cls > 0.5 && cls < 1.5) : h < 0.0;
  // Mipmapped macro gradient far away, detail gradient (incl. fine octaves) close up.
  vec2 gr = mix(gradAt(w), ds.yz, detailWeight(pxFoot0));
  vec3 n = normalize(vec3(-gr * u_normalExag, 1.0));

  vec3 col;
  vec2 luv = vec2(w.x, u_size - w.y) / u_size;
  float sunVis = u_hasLight == 1 ? texture(u_sunVis, luv).r : 1.0;
  vec2 aoFog = u_hasLight == 1 ? texture(u_ao, luv).gb : vec2(1.0, 0.0);
  float ao = aoFog.x;
  vec4 c2 = texture(u_clim2, luv);
  // Cloud shadows dim the direct light (realistic view only).
  float cs = u_realistic == 1 ? cloudShadow(w, h * u_exag, pxFoot0) : 1.0;
  if (water && u_layerMode == 0) {
    // Water: depth colour, animated wave normals faded by footprint, Fresnel sky, sun glint, shore foam.
    float depth = lake ? max(0.0, wl - h) : -h;
    float pxFoot = length(fwidth(w));
    vec3 shallow = vec3(0.24, 0.56, 0.62), deep = vec3(0.03, 0.10, 0.22);
    if (lake) { shallow = vec3(0.22, 0.48, 0.52); deep = vec3(0.05, 0.16, 0.24); }
    if (cls > 5.5) { shallow = vec3(0.55, 0.78, 0.76); deep = vec3(0.30, 0.58, 0.62); }
    col = mix(shallow, deep, pow(clamp(depth / (lake ? 400.0 : 4000.0), 0.0, 1.0), 0.35));
    col = mix(col, vec3(0.42, 0.68, 0.70), (1.0 - smoothstep(0.0, 60.0, depth)) * 0.6);
    if (u_hasReef == 1 && !lake) {
      // Reefs: turquoise shallows with a pale crest where the reef nearly reaches the surface.
      float reef = texture(u_reef, luv).r;
      col = mix(col, vec3(0.38, 0.80, 0.78), smoothstep(0.1, 0.6, reef) * (1.0 - smoothstep(10.0, 60.0, depth)) * 0.85);
      col = mix(col, vec3(0.80, 0.88, 0.82), smoothstep(0.55, 0.95, reef) * (1.0 - smoothstep(0.0, 8.0, depth)) * 0.6);
    }
    // Lake and sea ice in cold seasons (and in places that never thaw), broken into floes at the edge.
    float ice = 0.0;
    if (u_realistic == 1) {
      float tw = texture(u_climate, luv).r + c2.r * 30.0 * u_season.x;
      ice = lake ? smoothstep(-0.5, -5.0, tw) : smoothstep(-4.0, -10.0, tw);
      if (ice > 0.0) {
        float floes = vnoise(w / 2200.0) * 0.6 + 0.4 * mix(0.5, vnoise(w / 380.0), 1.0 - smoothstep(60.0, 120.0, pxFoot));
        ice = smoothstep(0.35, 0.55, ice + 0.4 * (floes - 0.5)) * min(1.0, ice * 3.0);
      }
    }
    // Waves: three scrolling noise layers; each fades out once its wavelength is under ~4 px.
    vec2 g = vec2(0.0);
    float amp = 0.06;
    float wl0 = 900.0;
    for (int k = 0; k < 3; k++) {
      float fade = 1.0 - smoothstep(wl0 / 8.0, wl0 / 4.0, pxFoot);
      vec2 dir = vec2(cos(float(k) * 2.1 + 0.4), sin(float(k) * 2.1 + 0.4));
      vec2 q = w / wl0 + dir * u_time * (0.05 + 0.03 * float(k));
      float e = 0.07;
      float c0 = vnoise(q);
      g += fade * amp * vec2(vnoise(q + vec2(e, 0.0)) - c0, vnoise(q + vec2(0.0, e)) - c0) / e;
      amp *= 0.6;
      wl0 *= 0.33;
    }
    vec3 nw = normalize(vec3(-g, 1.0));
    // View vector: positions are camera-relative, so the eye sits at u_origin.
    vec3 V = normalize(vec3(u_origin.xy - w, u_origin.z));
    float fres = 0.02 + 0.98 * pow(1.0 - max(dot(nw, V), 0.0), 5.0);
    col = mix(col, u_hazeColor * 0.9, fres * 0.6);
    float spec = pow(max(dot(reflect(-u_sun, nw), V), 0.0), 120.0);
    col += spec * 0.5 * sunVis * cs * (1.0 - ice);
    // Foam: a bright line at the shore at any zoom; moving surf bands when close.
    // Shore line ~1.5 px wide at any zoom: depth / |d(depth)/dpx| is the distance to the shore in pixels.
    float foam = 1.0 - smoothstep(0.5, 2.0, depth / max(fwidth(depth), 1e-3));
    float bands = smoothstep(0.55, 0.9, sin(depth * 0.9 - u_time * 1.6 + 6.0 * vnoise(w / 120.0)));
    foam = max(foam * 0.6, bands * (1.0 - smoothstep(0.0, 6.0, depth)) * (1.0 - smoothstep(4.0, 20.0, pxFoot)));
    col = mix(col, vec3(0.86, 0.90, 0.90), foam);
    if (ice > 0.0) {
      vec3 iceC = vec3(0.80, 0.86, 0.90) * (0.92 + 0.12 * vnoise(w / 900.0)) * (0.75 + 0.3 * max(dot(n, u_sun), 0.0));
      col = mix(col, iceC, ice * 0.95);
    }
    col *= mix(0.85, 1.0, sunVis * cs) * (0.35 * u_ambient + 0.65 * u_lightCol);
  } else {
    if (u_layerMode == 1) col = categorical(floor(layerAt(w, true) + 0.5));
    else if (u_layerMode == 2) col = viridis((layerAt(w, false) - u_layerMin) / max(1e-6, u_layerMax - u_layerMin));
    else if (u_layerMode == 3) col = pow(texelFetch(u_biomePal, ivec2(int(layerAt(w, true) + 0.5), 0), 0).rgb, vec3(1.1));
    else if (u_hasSurface == 1 && u_palette == 0) col = landColor(w, h, n, pxFoot0, gr, c2);
    else col = hypsometric(h);
    if (u_layerMode == 0 && u_hasClass == 1) {
      vec2 m = texture(u_masks, vec2(w.x, u_size - w.y) / u_size).rg;
      col = mix(col, vec3(0.90, 0.88, 0.82), smoothstep(0.2, 0.7, m.g) * 0.85);   // salt flat
      col = mix(col, vec3(0.30, 0.40, 0.28), smoothstep(0.15, 0.8, m.r) * 0.32);  // wetland
    }
    float lambert = max(dot(n, u_sun), 0.0);
    float sky = 0.5 + 0.5 * n.z;
    // Biome colours are muted satellite tones: give them more light than the bright hypsometric tints.
    bool biomeLit = u_layerMode == 0 && u_hasSurface == 1 && u_palette == 0;
    lambert *= sunVis * cs;
    sky *= mix(0.55, 1.0, ao) * mix(0.9, 1.0, cs);
    col *= biomeLit ? 0.30 * sky * u_ambient + 1.25 * lambert * u_lightCol : 0.28 * sky * u_ambient + 0.95 * lambert * u_lightCol;
  }
  // Valley fog (M9): pools where the horizon pass found low ground with relief around, in humid air.
  if (u_realistic == 1) col = mix(col, fogColor(), valleyFog(w, aoFog.y, c2.g, pxFoot0));
  col = mix(col, u_hazeColor, 1.0 - exp(-v_dist * u_haze));
  o = vec4(pow(col, vec3(1.0 / 1.1)), 1.0);
}`,Cc={elevation:0,categorical:1,scalar:2},wc=class{gl;prog;u;vao;instBuf;indexCount;heightTex;layerTex;gradTex;waterTex;classTex;maskTex;climateTex;coverTex;lutTex;climate2;paletteTex;reefTex;hasReef=0;hasSurface=0;palette=`satellite`;lutPalette=null;hasWater=0;hasClass=0;hn=1;size=1;layerSize=[1,1];layerMode=0;layerMin=0;layerMax=1;constructor(e){this.gl=e,this.prog=en(e,`terrain`,xc,Sc),this.u=nn(e,this.prog,`u_viewProj.u_exag.u_pxScale.u_height.u_hn.u_size.u_origin.u_sun.u_normalExag.u_cell.u_haze.u_hazeColor.u_time.u_grad.u_water.u_hasWater.u_wclass.u_hasClass.u_masks.u_climate.u_cover.u_lut.u_realistic.u_season.u_biomePal.u_hasSurface.u_palette.u_sunVis.u_ao.u_hasLight.u_reef.u_hasReef.u_layer.u_layerSize.u_layerMode.u_layerMin.u_layerMax`.split(`.`));let t=new Float32Array(2178);for(let e=0,n=0;e<=32;e++)for(let r=0;r<=32;r++)t[n++]=r,t[n++]=e;let n=new Uint16Array(6144);for(let e=0,t=0;e<32;e++)for(let r=0;r<32;r++){let i=e*33+r,a=i+1,o=i+32+1,s=o+1;n.set([i,o,a,a,o,s],t),t+=6}this.indexCount=n.length,this.vao=e.createVertexArray(),e.bindVertexArray(this.vao);let r=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),this.instBuf=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.instBuf),e.bufferData(e.ARRAY_BUFFER,Nr*6*4,e.DYNAMIC_DRAW),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,4,e.FLOAT,!1,24,0),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,2,e.FLOAT,!1,24,16),e.vertexAttribDivisor(2,1);let i=e.createBuffer();e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,i),e.bufferData(e.ELEMENT_ARRAY_BUFFER,n,e.STATIC_DRAW),e.bindVertexArray(null),this.heightTex=Pc(e),this.layerTex=Pc(e),this.gradTex=Pc(e),this.waterTex=Pc(e),this.classTex=Pc(e),this.maskTex=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.maskTex),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array(4)),this.climateTex=jc(e),this.coverTex=jc(e),this.lutTex=jc(e),this.climate2=jc(e),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array([0,128,0,0])),this.paletteTex=jc(e),this.reefTex=jc(e)}setLandformMasks(e){if(this.hasReef=+!!e,!e)return;let t=e.n,n=new Uint8Array(t*t*4),r=(e,r)=>{if(e&&e.w===t)for(let i=0;i<t*t;i++)n[i*4+r]=e.data[i]};r(e.reef,0),r(e.erg,1),r(e.crater,2),r(e.cliff,3);let i=this.gl;i.bindTexture(i.TEXTURE_2D,this.reefTex),i.pixelStorei(i.UNPACK_ALIGNMENT,1),i.texImage2D(i.TEXTURE_2D,0,i.RGBA8,t,t,0,i.RGBA,i.UNSIGNED_BYTE,n)}setSurface(e){let t=this.gl;if(this.hasSurface=+!!e,!e)return;let n=e.temperature.w,r=n*n,i=new Float32Array(r*4);for(let t=0;t<r;t++)i[t*4]=e.temperature.data[t],i[t*4+1]=e.aridity.data[t],i[t*4+2]=e.summerRain?e.summerRain.data[t]:.5,i[t*4+3]=e.canopy.data[t];t.bindTexture(t.TEXTURE_2D,this.climateTex),t.texImage2D(t.TEXTURE_2D,0,t.RGBA16F,n,n,0,t.RGBA,t.FLOAT,i),t.bindTexture(t.TEXTURE_2D,this.coverTex),t.texImage2D(t.TEXTURE_2D,0,t.RGBA8,n,n,0,t.RGBA,t.UNSIGNED_BYTE,Ac(e.biome,e.snow,n)),t.bindTexture(t.TEXTURE_2D,this.climate2),t.pixelStorei(t.UNPACK_ALIGNMENT,1),t.texImage2D(t.TEXTURE_2D,0,t.RGBA8,n,n,0,t.RGBA,t.UNSIGNED_BYTE,Dc(e,n))}get realistic(){return this.layerMode===0&&this.hasSurface===1&&this.palette!==`hypsometric`}setTerrain(e,t){Fc(this.gl,this.heightTex,e),this.hn=e.w,this.size=e.worldKm*1e3,t&&(Ic(this.gl,this.waterTex,t.level,e.w),Ic(this.gl,this.classTex,t.cls,e.w),this.gl.bindTexture(this.gl.TEXTURE_2D,this.maskTex),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA8,e.w,e.w,0,this.gl.RGBA,this.gl.UNSIGNED_BYTE,Nc(t.cls,e.w))),this.hasWater=+!!t,this.hasClass=+!!t;let n=this.gl;n.bindTexture(n.TEXTURE_2D,this.gradTex);let r=Tc(Jt(e,t?.level??null),e),i=e.w;for(let e=0;i>=1&&(n.texImage2D(n.TEXTURE_2D,e,n.RG16F,i,i,0,n.RG,n.FLOAT,r),i!==1);e++)r=Mc(r,i),i>>=1;n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR_MIPMAP_LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR)}setDrape(e){!e||e.kind===`elevation`?this.layerMode=0:(Fc(this.gl,this.layerTex,e),this.layerSize=[e.w,e.h],this.layerMode=e.id===`biome`?3:Cc[e.kind],this.layerMin=e.min,this.layerMax=e.max)}ensureLut(){let e=this.palette===`stylised`?`stylised`:`satellite`;if(this.lutPalette===e)return;this.lutPalette=e;let t=this.gl,n=new Uint8Array(32768);n.set(Ar(e,!1),0),n.set(Ar(e,!0),16384),t.bindTexture(t.TEXTURE_2D,this.lutTex),t.texImage2D(t.TEXTURE_2D,0,t.RGBA8,64,128,0,t.RGBA,t.UNSIGNED_BYTE,n),t.bindTexture(t.TEXTURE_2D,this.paletteTex),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texImage2D(t.TEXTURE_2D,0,t.RGBA8,32,1,0,t.RGBA,t.UNSIGNED_BYTE,jr(e))}draw(e){let t=this.gl;t.useProgram(this.prog),t.bindBuffer(t.ARRAY_BUFFER,this.instBuf),t.bufferSubData(t.ARRAY_BUFFER,0,e.instances,0,e.count*6),t.uniformMatrix4fv(this.u.u_viewProj,!1,e.viewProj),t.uniform1f(this.u.u_exag,e.exaggeration),t.uniform1f(this.u.u_pxScale,e.pxScale),t.uniform3f(this.u.u_origin,e.origin.x,e.origin.y,e.origin.z),t.uniform1i(this.u.u_hn,this.hn),t.uniform1f(this.u.u_size,this.size),t.uniform1f(this.u.u_cell,this.size/this.hn),t.uniform3f(this.u.u_sun,e.sun[0],e.sun[1],e.sun[2]),t.uniform1f(this.u.u_normalExag,e.normalExaggeration),t.uniform1f(this.u.u_haze,e.haze),t.uniform3f(this.u.u_hazeColor,e.hazeColor[0],e.hazeColor[1],e.hazeColor[2]),t.uniform1f(this.u.u_time,e.time),t.uniform1i(this.u.u_layerMode,this.layerMode),t.uniform2i(this.u.u_layerSize,this.layerSize[0],this.layerSize[1]),t.uniform1f(this.u.u_layerMin,this.layerMin),t.uniform1f(this.u.u_layerMax,this.layerMax),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.heightTex),t.uniform1i(this.u.u_height,0),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,this.layerTex),t.uniform1i(this.u.u_layer,1),t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_2D,this.gradTex),t.uniform1i(this.u.u_grad,2),t.activeTexture(t.TEXTURE3),t.bindTexture(t.TEXTURE_2D,this.waterTex),t.uniform1i(this.u.u_water,3),t.uniform1i(this.u.u_hasWater,this.hasWater),t.activeTexture(t.TEXTURE4),t.bindTexture(t.TEXTURE_2D,this.classTex),t.uniform1i(this.u.u_wclass,4),t.uniform1i(this.u.u_hasClass,this.hasClass),t.activeTexture(t.TEXTURE5),t.bindTexture(t.TEXTURE_2D,this.maskTex),t.uniform1i(this.u.u_masks,5),this.ensureLut();let n=(e,n,r)=>{t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,n),t.uniform1i(r,e)};n(6,this.climateTex,this.u.u_climate),n(7,this.coverTex,this.u.u_cover),n(8,this.lutTex,this.u.u_lut);let r=this.realistic;t.uniform1i(this.u.u_realistic,+!!r),t.uniform2f(this.u.u_season,r?e.season[0]:1,r?e.season[1]:0),qs(t,this.prog,{...e.atmos,clim2:this.climate2},9),n(10,this.paletteTex,this.u.u_biomePal),n(15,this.reefTex,this.u.u_reef),t.uniform1i(this.u.u_hasReef,this.hasReef),t.uniform1i(this.u.u_hasSurface,this.hasSurface),t.uniform1i(this.u.u_palette,+(this.palette===`hypsometric`)),t.uniform1i(this.u.u_hasLight,+!!e.lighting),e.lighting&&(n(11,e.lighting.sun,this.u.u_sunVis),n(12,e.lighting.ao,this.u.u_ao)),e.detail&&e.detail.bind(t,this.prog,13),t.bindVertexArray(this.vao),t.drawElementsInstanced(t.TRIANGLES,this.indexCount,t.UNSIGNED_SHORT,0,e.count),t.bindVertexArray(null)}};function Tc(e,t){let n=t.w,r=t.worldKm*1e3/n,i=new Float32Array(n*n*2);for(let t=0;t<n;t++){let a=Math.max(0,t-1),o=Math.min(n-1,t+1);for(let s=0;s<n;s++){let c=Math.max(0,s-1),l=Math.min(n-1,s+1),u=t=>e[t];i[(t*n+s)*2]=(u(t*n+l)-u(t*n+c))/((l-c)*r),i[(t*n+s)*2+1]=(u(a*n+s)-u(o*n+s))/((o-a)*r)}}return i}function Ec(e){switch(e){case B.TEMP_BROADLEAF:return[.85,.1];case B.BOREAL:return[.15,.85];case B.TEMP_CONIFER:return[.05,.9];case B.TEMP_RAINFOREST:return[.1,.6];case B.CLOUD_FOREST:return[0,.25];case B.MEDITERRANEAN:return[.1,.3];case B.SWAMP:return[.35,.15];case B.FEN:return[.3,.3];default:return[0,0]}}function Dc(e,t){let n=t*t,r=e.tempRange&&e.tempRange.w===t?e.tempRange.data:null,i=e.precip&&e.precip.w===t?e.precip.data:null,a=new Float32Array(n),o=new Float32Array(n),s=new Float32Array(n);for(let t=0;t<n;t++)a[t]=.12+.78*(i?kc(150,2200,i[t]):kc(.1,1.6,e.aridity.data[t])),[o[t],s[t]]=Ec(e.biome.data[t]);let c=Oc(Oc(a,t,5),t,5),l=Oc(o,t,1),u=Oc(s,t,1),d=new Uint8Array(n*4);for(let e=0;e<n;e++)d[e*4]=Math.round(255*Math.min(1,Math.max(0,(r?r[e]:10)/30))),d[e*4+1]=Math.round(255*c[e]),d[e*4+2]=Math.round(255*l[e]),d[e*4+3]=Math.round(255*u[e]);return d}function Oc(e,t,n){let r=new Float32Array(t*t),i=new Float32Array(t*t),a=1/(2*n+1);for(let i=0;i<t;i++)for(let o=0;o<t;o++){let s=0;for(let r=-n;r<=n;r++)s+=e[i*t+Math.min(t-1,Math.max(0,o+r))];r[i*t+o]=s*a}for(let e=0;e<t;e++)for(let o=0;o<t;o++){let s=0;for(let i=-n;i<=n;i++)s+=r[Math.min(t-1,Math.max(0,e+i))*t+o];i[e*t+o]=s*a}return i}function kc(e,t,n){let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)}function Ac(e,t,n){let r=new Float32Array(n*n*4);for(let i=0;i<n*n;i++){let n=e.data[i];r[i*4]=Math.max(t.data[i],+(n===B.ICE)),r[i*4+1]=+(n===B.ROCK||n===B.NIVAL),r[i*4+2]=+(n===B.BEACH||n===B.SALT_FLAT),r[i*4+3]=+(n===B.MARSH||n===B.BOG||n===B.SALT_MARSH||n===B.MANGROVE||n===B.SWAMP||n===B.FEN)}let i=new Uint8Array(n*n*4);for(let e=0;e<n;e++)for(let t=0;t<n;t++)for(let a=0;a<4;a++){let o=0;for(let i=-1;i<=1;i++)for(let s=-1;s<=1;s++){let c=Math.min(n-1,Math.max(0,t+s)),l=Math.min(n-1,Math.max(0,e+i));o+=r[(l*n+c)*4+a]}i[(e*n+t)*4+a]=Math.round(255*o/9)}return i}function jc(e){let t=e.createTexture();return e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array(4)),t}function Mc(e,t){let n=t>>1,r=new Float32Array(n*n*2);for(let i=0;i<n;i++)for(let a=0;a<n;a++)for(let o=0;o<2;o++){let s=(2*i*t+2*a)*2+o;r[(i*n+a)*2+o]=.25*(e[s]+e[s+2]+e[s+2*t]+e[s+2*t+2])}return r}function Nc(e,t){let n=new Uint8Array(t*t*4);for(let r=0;r<t;r++)for(let i=0;i<t;i++){let a=0,o=0,s=0;for(let n=-1;n<=1;n++)for(let c=-1;c<=1;c++){let l=Math.min(t-1,Math.max(0,i+c)),u=e[Math.min(t-1,Math.max(0,r+n))*t+l];u===4&&a++,u===5&&o++,s++}let c=(r*t+i)*4;n[c]=255*a/s,n[c+1]=255*o/s,n[c+3]=255}return n}function Pc(e){let t=e.createTexture();return e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.R32F,1,1,0,e.RED,e.FLOAT,new Float32Array([0])),t}function Fc(e,t,n){Ic(e,t,n.data instanceof Float32Array?n.data:Float32Array.from(n.data),n.w)}function Ic(e,t,n,r){e.bindTexture(e.TEXTURE_2D,t),e.pixelStorei(e.UNPACK_ALIGNMENT,1),e.texImage2D(e.TEXTURE_2D,0,e.R32F,r,r,0,e.RED,e.FLOAT,n)}var J={SOURCE:1,CONFLUENCE:2,MOUTH_SEA:4,MOUTH_LAKE:8,LAKE_TERMINAL:16,SINK_DRY:32,LAKE_IN:64,LAKE_OUT:128,WATERFALL:256,RAPIDS:512,EPHEMERAL:1024,BRAIDED:2048,DISTRIBUTARY:4096,DELTA:8192};function Lc(e){let t={};if(e.rivers){let n=e.rivers;t.rivers={n:n.n,x:n.x.slice(),y:n.y.slice(),zWater:n.zWater.slice(),zBed:n.zBed.slice(),q:n.q.slice(),area:n.area.slice(),width:n.width.slice(),depth:n.depth.slice(),strahler:n.strahler.slice(),down:n.down.slice(),flags:n.flags.slice(),reachStart:n.reachStart.slice(),reachLen:n.reachLen.slice(),reachDown:n.reachDown.slice(),reachMinArea:n.reachMinArea.slice()},n.face&&(t.rivers.face=n.face.slice())}return e.lakes&&(t.lakes=e.lakes.map(e=>({...e}))),e.landmarks&&(t.landmarks=e.landmarks.map(e=>e.path?{...e,data:{...e.data},path:e.path.slice()}:{...e,data:{...e.data}})),e.traits&&(t.traits={...e.traits,traits:[...e.traits.traits],heroes:[...e.traits.heroes]}),t}var Rc=.2,zc=31557600,Bc=1,Vc=2,Hc=3,Uc=6,Wc=0,Gc=1,Kc=2,qc=3,Jc=0,Yc=1,Xc=2,Zc=3,Qc=0,$c=1,el=2,tl=4e4,nl=[1,0,-1,0,1,-1,-1,1],rl=[0,1,0,-1,1,1,-1,-1],il=[1,1,1,1,Math.SQRT2,Math.SQRT2,Math.SQRT2,Math.SQRT2];function al(e,t){let n=e*1e6*t/1e3/zc;return{q:n,width:Math.min(8,Math.max(1,4*(t<100?1.5:1)*Math.sqrt(n))),depth:Math.min(1.5,Math.max(.1,.35*n**.4))}}function ol(e,t,n){let r=Math.floor(e),i=Math.floor(t),a=e-r,c=t-i,l=(e,t)=>o(s(s(n,e),t))/2147483648-1,u=a*a*(3-2*a),d=c*c*(3-2*c),f=l(r,i)+(l(r+1,i)-l(r,i))*u;return f+(l(r,i+1)+(l(r+1,i+1)-l(r,i+1))*u-f)*d}var sl=0;function cl(e,t,n,r,i,a,o,s){let c=n-e,l=r-t,u=o-i,d=s-a,f=c*d-l*u;if(Math.abs(f)<1e-12)return-1;let p=i-e,m=a-t,h=(p*d-m*u)/f;if(h<0||h>1)return-1;let g=(p*l-m*c)/f;return g<0||g>1?-1:(sl=g,h)}var Y=new class{ox=0;oy=0;bin=1;nb=1;head=new Int32Array(1);count=0;next=new Int32Array(1024);ax=new Float64Array(1024);ay=new Float64Array(1024);bx=new Float64Array(1024);by=new Float64Array(1024);za=new Float64Array(1024);zb=new Float64Array(1024);kind=new Uint8Array(1024);ref=new Int32Array(1024);sub=new Int32Array(1024);eSeg=new Int32Array(4096);eNext=new Int32Array(4096);eCount=0;reset(e,t,n,r){this.ox=e,this.oy=t,this.nb=r,this.bin=n/r,this.head.length<r*r&&(this.head=new Int32Array(r*r)),this.head.fill(-1,0,r*r),this.count=0,this.eCount=0,this.boxOn=!1}growSegs(){let e=this.ax.length*2,t=t=>{let n=new Float64Array(e);return n.set(t),n},n=t=>{let n=new Int32Array(e);return n.set(t),n};this.ax=t(this.ax),this.ay=t(this.ay),this.bx=t(this.bx),this.by=t(this.by),this.za=t(this.za),this.zb=t(this.zb);let r=new Uint8Array(e);r.set(this.kind),this.kind=r,this.ref=n(this.ref),this.sub=n(this.sub),this.next=n(this.next)}add(e,t,n,r,i,a,o,s,c){let{ox:l,oy:u,bin:d,nb:f}=this,p=Math.max(0,Math.floor((Math.min(e,n)-l)/d)),m=Math.min(f-1,Math.floor((Math.max(e,n)-l)/d)),h=Math.max(0,Math.floor((Math.min(t,r)-u)/d)),g=Math.min(f-1,Math.floor((Math.max(t,r)-u)/d));if(p>m||h>g)return;this.count>=this.ax.length&&this.growSegs();let _=this.count++;this.ax[_]=e,this.ay[_]=t,this.bx[_]=n,this.by[_]=r,this.za[_]=s,this.zb[_]=c,this.kind[_]=i,this.ref[_]=a,this.sub[_]=o;for(let e=h;e<=g;e++)for(let t=p;t<=m;t++){if(this.eCount>=this.eSeg.length){let e=new Int32Array(this.eSeg.length*2);e.set(this.eSeg),this.eSeg=e;let t=new Int32Array(this.eNext.length*2);t.set(this.eNext),this.eNext=t}let n=this.eCount++,r=e*f+t;this.eSeg[n]=_,this.eNext[n]=this.head[r],this.head[r]=n}}hitSeg=-1;hitSegU=0;firstHit(e,t,n,r){let{ox:i,oy:a,bin:o,nb:s}=this,c=Math.max(0,Math.floor((Math.min(e,n)-i)/o)),l=Math.min(s-1,Math.floor((Math.max(e,n)-i)/o)),u=Math.max(0,Math.floor((Math.min(t,r)-a)/o)),d=Math.min(s-1,Math.floor((Math.max(t,r)-a)/o)),f=2;this.hitSeg=-1;for(let i=u;i<=d;i++)for(let a=c;a<=l;a++)for(let o=this.head[i*s+a];o>=0;o=this.eNext[o]){let i=this.eSeg[o],a=cl(e,t,n,r,this.ax[i],this.ay[i],this.bx[i],this.by[i]);a>=0&&(a<f||a===f&&i<this.hitSeg)&&(f=a,this.hitSeg=i,this.hitSegU=sl)}return this.hitSeg>=0?f:-1}nearX=0;nearY=0;nearSeg=-1;nearU=0;boxOn=!1;bx0=0;by0=0;bx1=0;by1=0;nearest(e,t,n){let{ox:r,oy:i,bin:a,nb:o}=this,s=Math.floor((e-r)/a),c=Math.floor((t-i)/a),l=n*n,u=!1,d=Math.min(o,Math.ceil(n/a)+1);for(let n=0;n<=d&&!(u&&(n-1)*a>Math.sqrt(l));n++)for(let r=c-n;r<=c+n;r++){if(r<0||r>=o)continue;let i=r===c-n||r===c+n;for(let a=s-n;a<=s+n;a+=i?1:2*n){if(a>=0&&a<o)for(let n=this.head[r*o+a];n>=0;n=this.eNext[n]){let r=this.eSeg[n],i=this.ax[r],a=this.ay[r],o=this.bx[r]-i,s=this.by[r]-a,c=o*o+s*s,d=0,f=1;if(this.boxOn){let e=[-o,o,-s,s],t=[i-this.bx0,this.bx1-i,a-this.by0,this.by1-a];for(let n=0;n<4&&d<=f;n++)if(e[n]===0)t[n]<0&&(f=-1);else{let r=t[n]/e[n];e[n]<0?d=Math.max(d,r):f=Math.min(f,r)}if(d>f)continue}let p=c>0?Math.min(f,Math.max(d,((e-i)*o+(t-a)*s)/c)):d,m=i+o*p,h=a+s*p,g=(m-e)*(m-e)+(h-t)*(h-t);g<l&&(l=g,this.nearX=m,this.nearY=h,this.nearSeg=r,this.nearU=p,u=!0)}if(n===0)break}}return u?Math.sqrt(l):1/0}},ll=class{input;n;cellM;cellKm2;seed;rcv;areaCells;mainDonor;order;startZ;kind;anchor;runoffMm;thresholdKm2;stats={creeks:0,sinks:0,trunkCuts:0,forcedJoins:0,forcedEdge:0,forcedStuck:0,danglingEnds:0,prepareMs:0};step;cls;rStart;rList;rStamp;stampId=0;rawMemo=new Map;cutMemo=new Map;constructor(e){this.input=e;let t=performance.now(),{n,cellM:r,elevation:i,rivers:a}=e,o=n*n;this.n=n,this.cellM=r,this.cellKm2=(r/1e3)**2,this.seed=e.seed>>>0,this.step=Math.min(40,Math.max(20,r/32));let s=new Uint8Array(o);for(let t=0;t<o;t++)s[t]=Math.round(e.waterClass[t]);this.cls=s;let c=new Int32Array(o).fill(-1),l=new Float64Array(o).fill(1/0),u=(e,t)=>Math.min(n-1,Math.max(0,Math.floor(t/r)))*n+Math.min(n-1,Math.max(0,Math.floor(e/r)));for(let e=0;e<a.n;e++){let t=u(a.x[e],a.y[e]),i=(t%n+.5)*r,o=(Math.floor(t/n)+.5)*r,s=(a.x[e]-i)**2+(a.y[e]-o)**2;(s<l[t]||s===l[t]&&e<c[t])&&(l[t]=s,c[t]=e)}this.anchor=c;let d=new Uint8Array(o);for(let e=0;e<o;e++){let t=s[e];t===Bc||t===Vc||t===Hc||t===Uc?d[e]=Kc:c[e]>=0?d[e]=Gc:d[e]=Wc}let f=new Uint32Array(o+1),p=(e,t)=>{let i=a.down[e],o=Math.min(a.x[e],a.x[i]),s=Math.max(a.x[e],a.x[i]),c=Math.min(a.y[e],a.y[i]),l=Math.max(a.y[e],a.y[i]),u=Math.max(0,Math.floor(o/r)),d=Math.min(n-1,Math.floor(s/r)),f=Math.max(0,Math.floor(c/r)),p=Math.min(n-1,Math.floor(l/r));for(let e=f;e<=p;e++)for(let r=u;r<=d;r++)t(e*n+r)};for(let e=0;e<a.n;e++)a.down[e]>=0&&p(e,e=>f[e+1]++);for(let e=0;e<o;e++)f[e+1]+=f[e];let m=new Int32Array(f[o]),h=f.slice(0,o);for(let e=0;e<a.n;e++)a.down[e]>=0&&p(e,t=>m[h[t]++]=e);this.rStart=f,this.rList=m,this.rStamp=new Int32Array(a.n);let g=new Int32Array(o).fill(-1);for(let e=0;e<n;e++)for(let t=0;t<n;t++){let r=e*n+t;if(d[r]===Kc)continue;let a=0;for(let o=0;o<8;o++){let s=t+nl[o],c=e+rl[o];if(s<0||c<0||s>=n||c>=n)continue;let l=c*n+s,u=(i[r]-i[l])/il[o];u>a&&(a=u,g[r]=l)}}for(let e=0;e<o;e++)d[e]===Wc&&g[e]<0&&(d[e]=qc,this.stats.sinks++);this.kind=d,this.rcv=g;let _=new Int32Array(o);for(let e=0;e<o;e++)g[e]>=0&&_[g[e]]++;let v=new Int32Array(o),y=0,b=0;for(let e=0;e<o;e++)_[e]===0&&(v[b++]=e);let x=new Float32Array(o),S=new Uint8Array(o),C=new Uint8Array(o),w=new Uint8Array(o);for(let e=0;e<o;e++)d[e]!==Kc&&(x[e]=1);for(;y<b;){let e=v[y++];w[e]=S[e]===0?1:C[e]>=2?S[e]+1:S[e];let t=g[e];t<0||(x[t]+=x[e],w[e]>S[t]?(S[t]=w[e],C[t]=1):w[e]===S[t]&&C[t]++,--_[t]===0&&(v[b++]=t))}let T=new Int32Array(o).fill(-1);for(let e=0;e<o;e++){let t=g[e];if(t<0)continue;let n=T[t];(n<0||x[e]>x[n])&&(T[t]=e)}this.areaCells=x,this.mainDonor=T,this.order=w;let E=1/0;for(let e=0;e<a.n;e++)a.flags[e]&J.SOURCE&&!(a.flags[e]&J.DISTRIBUTARY)&&(E=Math.min(E,a.area[e]));this.thresholdKm2=Number.isFinite(E)&&E>0?E:8;let D=new Float32Array(o);for(let t=0;t<o;t++)if(e.runoff)D[t]=e.runoff[t];else if(d[t]!==Kc){let n=10**e.dischargeLog[t];D[t]=Math.min(3e3,n*zc*1e3/(x[t]*this.cellKm2*1e6))}let O=new Float32Array(o);for(let e=0;e<n;e++)for(let t=0;t<n;t++){let r=0,i=0;for(let a=-1;a<=1;a++)for(let o=-1;o<=1;o++){let s=t+o,c=e+a;s<0||c<0||s>=n||c>=n||d[c*n+s]===Kc||(r+=D[c*n+s],i++)}O[e*n+t]=i>0?r/i:D[e*n+t]}this.runoffMm=O;let k=new Float32Array(o),A=new Float64Array(o).fill(1/0);for(let e=0;e<b;e++){let t=v[e];if(d[t]===Kc)continue;let n=Math.min(i[t]-this.trunkGeom(t).depth,A[t]);k[t]=n;let r=g[t];r>=0&&(A[r]=Math.min(A[r],n))}for(let e=b-1;e>=0;e--){let t=v[e];if(d[t]!==Wc)continue;let n=g[t],r=d[n]===Wc||d[n]===qc?k[n]:d[n]===Gc?a.zWater[c[n]]:-1/0;r>k[t]&&(k[t]=r)}this.startZ=k,this.stats.prepareMs=performance.now()-t}trunkAreaKm2(e){return this.kind[e]===Wc?Math.min(this.areaCells[e]*this.cellKm2,.98*this.thresholdKm2):0}hasCreeks(e){return this.kind[e]!==Kc}trunkGeom(e){return al(Math.min(this.areaCells[e]*this.cellKm2,.98*this.thresholdKm2),this.runoffMm?this.runoffMm[e]:500)}centre(e){return[(e%this.n+.5)*this.cellM,(Math.floor(e/this.n)+.5)*this.cellM]}target(e){if(this.kind[e]===Gc){let t=this.anchor[e];return[this.input.rivers.x[t],this.input.rivers.y[t]]}return this.centre(e)}cellClass(e,t){let{n,cellM:r}=this,i=Math.floor(e/r),a=Math.floor(t/r);return i<0||a<0||i>=n||a>=n?Bc:this.cls[a*n+i]}raw(e){let t=this.rawMemo.get(e);if(t!==void 0)return t;this.rawMemo.size>tl&&this.rawMemo.clear();let n=null;if(this.kind[e]===Wc){let t=this.rcv[e],[r,i]=this.centre(e),[a,c]=this.target(t),l=this.mainDonor[e],[u,d]=l>=0&&this.kind[l]===Wc?this.centre(l):[2*r-a,2*i-c],f=this.kind[t]===Wc?this.rcv[t]:-1,[p,m]=f>=0&&this.kind[f]!==Kc?this.target(f):[2*a-r,2*c-i],h=Math.hypot(a-r,c-i),g=Math.max(2,Math.ceil(h/(1.6*this.step))),_=(o(s(s(this.seed,1985),e))/4294967296-.5)*.16*h,v=h>0?-(c-i)/h:0,y=h>0?(a-r)/h:0,b=new Float64Array(g+1),x=new Float64Array(g+1),S=1/0,C=1/0,w=-1/0,T=-1/0;for(let e=0;e<=g;e++){let t=e/g,n=t*t,o=n*t,s=-.5*o+n-.5*t,l=1.5*o-2.5*n+1,f=-1.5*o+2*n+.5*t,h=.5*o-.5*n,E=_*Math.sin(Math.PI*t),D=e===0?r:e===g?a:s*u+l*r+f*a+h*p+E*v,O=e===0?i:e===g?c:s*d+l*i+f*c+h*m+E*y;b[e]=D,x[e]=O,S=Math.min(S,D),C=Math.min(C,O),w=Math.max(w,D),T=Math.max(T,O)}let E=this.kind[t];n={xs:b,ys:x,segs:g,x0:S,y0:C,x1:w,y1:T,endKind:E===Gc?Yc:E===Kc?Xc:E===qc?Zc:Jc}}return this.rawMemo.set(e,n),n}bigger(e,t){let n=this.areaCells[e],r=this.areaCells[t];return n>r||n===r&&e>t}riverHitNode=-1;riverHitU=0;riverHit(e,t,n,r){let{n:i,cellM:a}=this,o=this.input.rivers,s=Math.max(0,Math.floor(Math.min(e,n)/a)),c=Math.min(i-1,Math.floor(Math.max(e,n)/a)),l=Math.max(0,Math.floor(Math.min(t,r)/a)),u=Math.min(i-1,Math.floor(Math.max(t,r)/a)),d=2;this.riverHitNode=-1;for(let a=l;a<=u;a++)for(let l=s;l<=c;l++){let s=a*i+l;for(let i=this.rStart[s];i<this.rStart[s+1];i++){let a=this.rList[i],s=o.down[a],c=cl(e,t,n,r,o.x[a],o.y[a],o.x[s],o.y[s]);c>=0&&(c<d||c===d&&a<this.riverHitNode)&&(d=c,this.riverHitNode=a,this.riverHitU=sl)}}return this.riverHitNode>=0?d:-1}trunk(e){let t=this.cutMemo.get(e);if(t!==void 0)return t;this.cutMemo.size>tl&&this.cutMemo.clear();let n=this.raw(e),r=null;return n&&(r=this.cutTrunk(e,n)),this.cutMemo.set(e,r),r}cutTrunk(e,t){let{n}=this,r=this.input.rivers,{xs:i,ys:a,segs:o}=t,s=this.rcv[e],c=o,l=t.endKind===Zc?J.SINK_DRY:J.CONFLUENCE,u=t.endKind===Jc||t.endKind===Zc?this.startZ[s]:t.endKind===Yc?r.zWater[this.anchor[s]]:-1/0;for(let e=0;e<o;e++){let n=this.riverHit(i[e],a[e],i[e+1],a[e+1]);if(n>=0&&!(t.endKind===Yc&&e===o-1&&n>.999)){c=e+n,l=J.CONFLUENCE;let t=this.riverHitNode;u=r.zWater[t]+(r.zWater[r.down[t]]-r.zWater[t])*this.riverHitU;break}let s=this.cellClass(i[e+1],a[e+1]);if(s===Bc||s===Vc||s===Hc||s===Uc){c=e+1,l=s===Bc?J.MOUTH_SEA:s===Hc?J.CONFLUENCE:J.MOUTH_LAKE,u=-1/0;break}}let d=e%n,f=Math.floor(e/n),p=-1,m=0;for(let r=-2;r<=2;r++)for(let l=-2;l<=2;l++){let u=d+l,h=f+r;if(u<0||h<0||u>=n||h>=n||l===0&&r===0)continue;let g=h*n+u;if(this.kind[g]!==Wc||g===s||!this.bigger(g,e))continue;let _=this.raw(g);if(_.x0>t.x1||_.x1<t.x0||_.y0>t.y1||_.y1<t.y0)continue;let v=null;for(let e=0;e<Math.ceil(c)&&e<o;e++){let t=i[e],n=a[e],r=i[e+1],s=a[e+1];if(!(Math.max(t,r)<_.x0||Math.min(t,r)>_.x1||Math.max(n,s)<_.y0||Math.min(n,s)>_.y1))for(let l=0;l<_.segs;l++){let u=cl(t,n,r,s,_.xs[l],_.ys[l],_.xs[l+1],_.ys[l+1]);if(u<0||e+u>=c||e+u<=1e-9)continue;let d=t+(r-t)*u,f=n+(s-n)*u;if((d-i[0])**2+(f-a[0])**2<.25||(d-i[o])**2+(f-a[o])**2<.25)continue;let h=l+sl;v??=this.trunk(g),!(!v||h>v.cutParam)&&(c=e+u,p=g,m=h)}}}if(p>=0){let e=this.trunk(p);l=J.CONFLUENCE,u=this.zAtParam(e,m),this.stats.trunkCuts++}let h=Math.max(1,Math.min(o,Math.ceil(c-1e-9))),g=c-(h-1),_=h+1,v=new Float64Array(_),y=new Float64Array(_);for(let e=0;e<h;e++)v[e]=i[e],y[e]=a[e];v[h]=i[h-1]+(i[h]-i[h-1])*g,y[h]=a[h-1]+(a[h]-a[h-1])*g;let b=this.trunkGeom(e),x=new Float64Array(_),S=this.startZ[e],C=S,w=this.input.heightAt;for(let e=0;e<_;e++)e>0&&(C=Math.min(C,w(v[e],y[e])-b.depth)),x[e]=C;if(u>-1/0){let e=Math.min(u,S);for(let t=0;t<_;t++)x[t]=Math.max(x[t],e);x[_-1]=e}return{cell:e,xs:v,ys:y,zs:x,count:_,cutParam:c,endFlag:l,areaKm2:this.trunkAreaKm2(e),q:b.q,width:b.width,depth:b.depth,strahler:Math.min(255,this.order[e]+1),ephemeral:this.runoffMm[e]<100}}zAtParam(e,t){let n=Math.min(e.count-2,Math.floor(t)),r=Math.min(1,Math.max(0,t-n));if(n===e.count-2){let t=e.cutParam-n,i=t>0?Math.min(1,r/t):1;return e.zs[n]+(e.zs[n+1]-e.zs[n])*i}return e.zs[n]+(e.zs[n+1]-e.zs[n])*r}cell(e,t={}){let n=new fl,r=this.trunk(e);return r&&n.addTrunk(r,this.mainDonor[e]<0||this.kind[this.mainDonor[e]]===Kc),!t.trunksOnly&&this.kind[e]!==Kc&&this.growCreeks(e,n),n.finish()}growCreeks(e,t){let{n,cellM:r,step:i}=this,a=this.input.rivers,o=this.input.heightAt,c=e%n,l=Math.floor(e/n),d=(c+.5)*r,f=(l+.5)*r;Y.reset((c-2)*r,(l-2)*r,5*r,40);let p=++this.stampId,m=[];for(let e=-2;e<=2;e++)for(let t=-2;t<=2;t++){let r=c+t,i=l+e;if(r<0||i<0||r>=n||i>=n)continue;let o=i*n+r;for(let e=this.rStart[o];e<this.rStart[o+1];e++){let t=this.rList[e];if(this.rStamp[t]===p)continue;this.rStamp[t]=p;let n=a.down[t];Y.add(a.x[t],a.y[t],a.x[n],a.y[n],Qc,t,0,a.zWater[t],a.zWater[n])}this.kind[o]===qc&&m.push(o);let s=this.trunk(o);if(s)for(let e=0;e+1<s.count;e++)Y.add(s.xs[e],s.ys[e],s.xs[e+1],s.ys[e+1],$c,o,e,s.zs[e],s.zs[e+1])}let h=u(this.seed,`creeks`,e),g=this.runoffMm[e],_=Rc*(g>=100?1:g>=20?.8:.8+(20-Math.max(0,g))/20*1.7),v=Math.min(64,Math.max(1,Math.round(this.cellKm2/_*(.8+.4*h.float())))),y=.5*Math.sqrt(_)*1e3,b=.3*Math.sqrt(_)*1e3,x=[],S=[],C=[];for(let e=0;e<v*10&&x.length<v;e++){let e=(c+h.float())*r,t=(l+h.float())*r,n=!0;for(let r=0;r<x.length&&n;r++)(x[r]-e)**2+(S[r]-t)**2<y*y&&(n=!1);!n||Y.nearest(e,t,b)<b||(x.push(e),S.push(t),C.push(o(e,t)))}let w=x.map((e,t)=>t).sort((e,t)=>C[t]-C[e]||e-t),T=[],E=this.cellKm2/Math.max(1,w.length),D=.5*i,O=.5*r-.5;Y.boxOn=!0,Y.bx0=d-O,Y.by0=f-O,Y.bx1=d+O,Y.by1=f+O;let k=Math.ceil(2.5*r/i),A=s(this.seed,24301);for(let e of w){let t=x[e],n=S[e],a=C[e],s={xs:[t],ys:[n],hs:[a],endFlag:-1,joinCreek:-1,joinSub:0,joinU:0,endZ:-1/0,tribs:[],share:E},c=0,l=0,u=0,p=0,h=99,g=0,_=!1,v=0;for(let e=0;e<k&&!_;e++){let e,y;if(v===0)e=(o(t+D,n)-a)/D,y=(o(t,n+D)-a)/D;else{let r=v===1?2*i:6*i;e=(o(t+r,n)-o(t-r,n))/(2*r),y=(o(t,n+r)-o(t,n-r))/(2*r)}let b=Math.hypot(e,y),x=0,S=0,C=0,w=0;if(b>1e-5){C=-e/b,w=-y/b;let r=.45*ol(t/170,n/170,A),i=Math.cos(r),a=Math.sin(r);x=C*i-w*a,S=C*a+w*i}let T=x*c+S*l<.2?1.2:.45;x+=T*c,S+=T*l;let E=Math.max(Math.abs(t-d),Math.abs(n-f))/r,k=Math.min(1,Math.max(0,(E-.28)/.17)),j=k*k*(3-2*k),M=.3+(b<.004?1.5:0)+2.5*j+Math.max(0,g/r-.8)*3+1.2*v;h>=(M>1?2:4)&&(Y.nearest(t,n,1.5*r)<1/0?(u=Y.nearX,p=Y.nearY):M=0,h=0),h++;let N=Math.hypot(u-t,p-n);if(M>0&&N>1e-6){let e=(u-t)/N,r=(p-n)/N;b>=.01&&e*C+r*w<0&&M<1&&(M*=.2),x+=M*e,S+=M*r}let ee=Math.hypot(x,S);ee<1e-9&&(x=N>1e-6?(u-t)/N:1,S=N>1e-6?(p-n)/N:0,ee=1),x/=ee,S/=ee,b>=.01&&x*C+S*w<.3&&M<1&&(x=C+.3*c,S=w+.3*l,ee=Math.hypot(x,S),x/=ee,S/=ee);let te=t+x*i,ne=n+S*i;if(Math.abs(te-d)>O||Math.abs(ne-f)>O){this.stats.forcedEdge++;break}if(this.tryEnd(s,t,n,te,ne,m)){_=!0;break}let re=!1;for(let e=0;e+2<s.xs.length&&!re;e++)re=cl(t,n,te,ne,s.xs[e],s.ys[e],s.xs[e+1],s.ys[e+1])>=0;let P=s.xs.length-8,ie=P>=0&&(s.xs[P]-te)**2+(s.ys[P]-ne)**2<4*i*i;if(re||ie){if(v>=2){this.stats.forcedStuck++;break}if(v++,c=0,l=0,re)continue}t=te,n=ne,a=o(t,n),s.xs.push(t),s.ys.push(n),s.hs.push(a),c=x,l=S,g+=i}_||this.forceJoin(s,t,n,m);let y=T.length;T.push(s),this.stats.creeks++,s.joinCreek>=0&&T[s.joinCreek].tribs.push(y);for(let e=0;e+1<s.xs.length;e++)Y.add(s.xs[e],s.ys[e],s.xs[e+1],s.ys[e+1],el,y,e,0,0)}Y.boxOn=!1,this.emitCreeks(T,t,g)}tryEnd(e,t,n,r,i,a){let o=Y.firstHit(t,n,r,i);if(o>=0)return this.joinAt(e,t+(r-t)*o,n+(i-n)*o,Y.hitSeg,Y.hitSegU),!0;let s=.3*this.step;if(Y.nearest(r,i,s)<s){let r=Y.nearX,i=Y.nearY,a=Y.nearSeg,o=Y.nearU,s=Math.hypot(r-t,i-n)||1,c=Y.firstHit(t,n,r+(r-t)/s*.01,i+(i-n)/s*.01);if(c>=0&&Y.hitSeg!==a){let a=r+(r-t)/s*.01,o=i+(i-n)/s*.01;this.joinAt(e,t+(a-t)*c,n+(o-n)*c,Y.hitSeg,Y.hitSegU)}else this.joinAt(e,r,i,a,o);return!0}let c=this.cellClass(r,i);if(c===Bc||c===Vc||c===Hc||c===Uc)return e.xs.push(r),e.ys.push(i),e.hs.push(this.input.heightAt(r,i)),e.endFlag=c===Bc?J.MOUTH_SEA:c===Hc?J.CONFLUENCE:J.MOUTH_LAKE,!0;for(let t of a){let[n,a]=this.centre(t);if((n-r)**2+(a-i)**2<this.step*this.step)return e.xs.push(n),e.ys.push(a),e.hs.push(this.input.heightAt(n,a)),e.endFlag=J.SINK_DRY,!0}return!1}joinAt(e,t,n,r,i){let a=e.xs.length;this.eraseLoop(e,e.xs[a-1],e.ys[a-1],t,n),e.xs.push(t),e.ys.push(n),e.hs.push(this.input.heightAt(t,n)),e.endFlag=J.CONFLUENCE,Y.kind[r]===el?(e.joinCreek=Y.ref[r],e.joinSub=Y.sub[r],e.joinU=i):e.endZ=Y.za[r]+(Y.zb[r]-Y.za[r])*i}eraseLoop(e,t,n,r,i){let a=-1,o=-1,s=0;for(let c=0;c+2<e.xs.length;c++){let l=cl(t,n,r,i,e.xs[c],e.ys[c],e.xs[c+1],e.ys[c+1]);l>a&&(a=l,o=c,s=sl)}if(o<0)return[t,n];let c=e.xs[o]+(e.xs[o+1]-e.xs[o])*s,l=e.ys[o]+(e.ys[o+1]-e.ys[o])*s,u=e.hs[o]+(e.hs[o+1]-e.hs[o])*s;return e.xs.length=e.ys.length=e.hs.length=o+1,e.xs.push(c),e.ys.push(l),e.hs.push(u),[c,l]}forceJoin(e,t,n,r){this.stats.forcedJoins++;let i=Y.nearest(t,n,3*this.cellM),a=Y.nearX,o=Y.nearY;if(i===1/0){if(!r.length){e.endFlag=J.SINK_DRY,this.stats.danglingEnds++;return}[a,o]=this.centre(r[0])}[t,n]=this.eraseLoop(e,t,n,a,o);let s=Math.hypot(a-t,o-n),c=s>0?a+(a-t)/s*.01:a,l=s>0?o+(o-n)/s*.01:o;this.tryEnd(e,t,n,c,l,r)||(e.xs.push(a),e.ys.push(o),e.hs.push(this.input.heightAt(a,o)),e.endFlag=i===1/0?J.SINK_DRY:J.CONFLUENCE)}emitCreeks(e,t,n){let r=e.length;if(r===0)return;let i=[];for(let t of e){let e=[0];for(let n=1;n<t.xs.length;n++)e.push(e[n-1]+Math.hypot(t.xs[n]-t.xs[n-1],t.ys[n]-t.ys[n-1]));i.push(e)}let a=new Float64Array(r),o=new Uint8Array(r),s=e.map(()=>[]);for(let t=0;t<r;t++){let n=e[t].xs.length-1-1e-6;for(let r of e[t].tribs){let i=Math.min(n,e[r].joinSub+e[r].joinU);e[r].joinSub=Math.floor(i),e[r].joinU=i-Math.floor(i),s[t].push([i,r])}}for(let e of s)e.sort((e,t)=>e[0]-t[0]||e[1]-t[1]);for(let t=r-1;t>=0;t--){let n=e[t].share,r=1;for(let[,e]of s[t])n+=a[e],r=o[e]>r?o[e]:o[e]===r?r+1:r;a[t]=n,o[t]=r}let c=new Int32Array(r),l=e.map(()=>[]),u=[],d=t.size;for(let t=0;t<r;t++){let n=e[t],r=[],a=0,o=s[t];for(let e=0;e<n.xs.length;e++){for(;a<o.length&&o[a][0]<e;){let e=o[a][0],s=Math.floor(e),c=e-s,l=n.xs[s]+(n.xs[s+1]-n.xs[s])*c,u=n.ys[s]+(n.ys[s+1]-n.ys[s])*c,d=n.hs[s]+(n.hs[s+1]-n.hs[s])*c,f=i[t][s]+(i[t][s+1]-i[t][s])*c;r.push({x:l,y:u,hgt:d,s:f,param:e,j:o[a][1]}),a++}r.push({x:n.xs[e],y:n.ys[e],hgt:n.hs[e],s:i[t][e],param:e,j:-1})}u.push(r),c[t]=d;for(let e=0;e<r.length;e++)r[e].j>=0&&l[t].push(d+e);d+=r.length}let f=[],p=[];for(let s=0;s<r;s++){let r=e[s],c=u[s],l=i[s][i[s].length-1]||1,d=new Float64Array(c.length),m=0;for(let e=0;e<c.length;e++)c[e].j>=0&&(m+=a[c[e].j]),d[e]=r.share*(.35+.65*Math.min(1,c[e].s/l))+m;let h=r.endZ;r.joinCreek>=0&&(h=ul(f[r.joinCreek],p[r.joinCreek],r.joinSub+r.joinU));let g=new Float64Array(c.length),_=1/0,v=Array.from(d,e=>al(e,n));for(let e=0;e<c.length;e++)_=Math.min(_,c[e].hgt-v[e].depth),g[e]=_;if(h>-1/0){for(let e=0;e<c.length;e++)g[e]=Math.max(g[e],h);g[c.length-1]=h}f.push(g),p.push(Float64Array.from(c,e=>e.param));let y=1,b=n<100?J.EPHEMERAL:0;for(let e=0;e<c.length;e++){if((e===0||c[e].j>=0)&&t.beginReach(),c[e].j>=0){let t=o[c[e].j];y=t>y?t:t===y?y+1:y}let n=b;e===0&&(n|=J.SOURCE),c[e].j>=0&&(n|=J.CONFLUENCE),e===c.length-1&&r.endFlag>0&&(n|=r.endFlag);let i=v[e],a=t.size;t.node(c[e].x,c[e].y,g[e],g[e]-i.depth,i.q,d[e],i.width,i.depth,y,n),e>0&&c[e].j>=0&&t.link(a-1,a)}}for(let n=0;n<r;n++){let r=e[n];if(r.joinCreek<0)continue;let i=r.joinCreek,a=dl(u[i],n);t.link(c[n]+u[n].length-1,c[i]+a)}}};function ul(e,t,n){for(let r=0;r+1<e.length;r++)if(t[r+1]>=n){let i=t[r+1]-t[r],a=i>0?Math.min(1,Math.max(0,(n-t[r])/i)):0;return e[r]+(e[r+1]-e[r])*a}return e[e.length-1]}function dl(e,t){for(let n=0;n<e.length;n++)if(e[n].j===t)return n;throw Error(`creeks: junction node missing`)}var fl=class{f=[[],[],[],[],[],[],[],[],[],[]];down=[];flags=[];rs=[];rl=[];get size(){return this.down.length}beginReach(){this.rs.push(this.down.length),this.rl.push(0)}node(e,t,n,r,i,a,o,s,c,l){let u=this.rl.length-1,d=this.down.length;this.rl[u]>0&&(this.down[d-1]=d);let f=[e,t,n,r,i,a,o,s,c];for(let e=0;e<9;e++)this.f[e].push(f[e]);this.down.push(-1),this.flags.push(l),this.rl[u]++}link(e,t){this.down[e]=t}addTrunk(e,t){this.beginReach();for(let n=0;n<e.count;n++){let r=e.ephemeral?J.EPHEMERAL:0;n===0&&t&&(r|=J.SOURCE),n===e.count-1&&(r|=e.endFlag),this.node(e.xs[n],e.ys[n],e.zs[n],e.zs[n]-e.depth,e.q,e.areaKm2,e.width,e.depth,e.strahler,r)}}finish(){let e=this.down.length,t=this.rs.length,n=Float32Array.from(this.f[5]),r=Int32Array.from(this.down),i=Uint32Array.from(this.rs),a=Uint32Array.from(this.rl),o=new Int32Array(t).fill(-1),s=new Float32Array(t),c=new Map;for(let e=0;e<t;e++)c.set(i[e],e);for(let e=0;e<t;e++){let t=i[e]+a[e]-1,l=r[t];o[e]=l>=0?c.get(l)??-1:-1;let u=1/0;for(let r=i[e];r<=t;r++)u=Math.min(u,n[r]);s[e]=Number.isFinite(u)?u:0}return{n:e,x:Float32Array.from(this.f[0]),y:Float32Array.from(this.f[1]),zWater:Float32Array.from(this.f[2]),zBed:Float32Array.from(this.f[3]),q:Float32Array.from(this.f[4]),area:n,width:Float32Array.from(this.f[6]),depth:Float32Array.from(this.f[7]),strahler:Uint8Array.from(this.f[8]),down:r,flags:Uint16Array.from(this.flags),reachStart:i,reachLen:a,reachDown:o,reachMinArea:s}}};function pl(){return ml([])}function ml(e){let t=0,n=0;for(let r of e)t+=r.n,n+=r.reachStart.length;let r={n:t,x:new Float32Array(t),y:new Float32Array(t),zWater:new Float32Array(t),zBed:new Float32Array(t),q:new Float32Array(t),area:new Float32Array(t),width:new Float32Array(t),depth:new Float32Array(t),strahler:new Uint8Array(t),down:new Int32Array(t),flags:new Uint16Array(t),reachStart:new Uint32Array(n),reachLen:new Uint32Array(n),reachDown:new Int32Array(n),reachMinArea:new Float32Array(n)},i=0,a=0;for(let t of e){r.x.set(t.x,i),r.y.set(t.y,i),r.zWater.set(t.zWater,i),r.zBed.set(t.zBed,i),r.q.set(t.q,i),r.area.set(t.area,i),r.width.set(t.width,i),r.depth.set(t.depth,i),r.strahler.set(t.strahler,i),r.flags.set(t.flags,i);for(let e=0;e<t.n;e++)r.down[i+e]=t.down[e]>=0?t.down[e]+i:-1;for(let e=0;e<t.reachStart.length;e++)r.reachStart[a+e]=t.reachStart[e]+i,r.reachLen[a+e]=t.reachLen[e],r.reachDown[a+e]=t.reachDown[e]>=0?t.reachDown[e]+a:-1,r.reachMinArea[a+e]=t.reachMinArea[e];i+=t.n,a+=t.reachStart.length}return r}var hl=new WeakMap;function gl(e){let t=hl.get(e);return t||(t=new ll(e),hl.set(e,t)),t}var _l=0,vl=1,yl=2,bl=class{budgetMs=4;lodC=49;maxCells=2e4;maxNodes=6e5;mergeIntervalMs=120;maxRadiusPx=2e3;stats={cellsGenerated:0,genMs:0,mergeMs:0,lastNodes:0,desired:0,pending:0};ctx=null;cache=new Map;nodes=0;desired=[];desiredTier=new Uint8Array;inDesired=new Uint32Array;desiredStamp=0;queuePos=0;viewKey=``;changed=!1;shown=!1;lastMerge=-1/0;constructor(){}setWorld(e,t){if(this.cache.clear(),this.nodes=0,this.desired=[],this.queuePos=0,this.viewKey=``,this.changed=!0,!e){this.ctx=null;return}this.ctx=gl({...e,heightAt:t});let n=e.n*e.n;this.desiredTier=new Uint8Array(n),this.inDesired=new Uint32Array(n)}get context(){return this.ctx}update(e){let t=this.ctx;if(!t)return this.clearOnce();let n=this.keyOf(e,t);n!==this.viewKey&&(this.viewKey=n,this.plan(e,t),this.changed=!0);let r=performance.now(),i=r;for(;this.queuePos<this.desired.length&&i-r<this.budgetMs;){let e=this.desired[this.queuePos++],n=this.desiredTier[e],r=this.cache.get(e);if(r&&r.tier>=n)continue;let a=t.cell(e,{trunksOnly:n<yl});r&&(this.nodes-=r.g.n),this.cache.delete(e),this.cache.set(e,{tier:n,g:a}),this.nodes+=a.n,this.stats.cellsGenerated++,this.changed=!0,i=performance.now()}if(this.stats.genMs=i-r,this.stats.pending=this.desired.length-this.queuePos,!this.changed)return null;let a=this.queuePos>=this.desired.length;if(!a&&i-this.lastMerge<this.mergeIntervalMs)return null;this.evict();let o=this.shown,s=this.merge(i,a);return s.n===0&&!o?null:s}clearOnce(){return!this.shown&&!this.changed?null:(this.shown=!1,this.changed=!1,pl())}keyOf(e,t){let n=t.cellM/2,r=(e,t)=>Math.round(Math.log(Math.max(1e-6,e))/t),i=e.eye?`${Math.round(e.eye.x/n)},${Math.round(e.eye.y/n)},${r(Math.max(1,e.eye.z),.05)}`:``;return`${Math.round(e.centerX/n)},${Math.round(e.centerY/n)},${r(e.radiusM,.1)},${r(e.metresPerPixel,.05)},${i}`}aVis(e){let t=this.lodC*e/1e3;return t*t}plan(e,t){let{n,cellM:r}=t,i=++this.desiredStamp,a=[],o=[],s=e.metresPerPixel;if(s<=1e3*Math.sqrt(.98*t.thresholdKm2)/this.lodC*1.05){let c=Math.min(e.radiusM,this.maxRadiusPx*s),l=t.input.elevation,u=Math.min(n-1,Math.max(0,Math.floor(e.centerY/r)))*n+Math.min(n-1,Math.max(0,Math.floor(e.centerX/r))),d=e.eye?Math.hypot(e.eye.x-e.centerX,e.eye.y-e.centerY,e.eye.z-Math.max(0,l[u])):0,f=Math.max(0,Math.floor((e.centerX-c)/r)),p=Math.min(n-1,Math.floor((e.centerX+c)/r)),m=Math.max(0,Math.floor((e.centerY-c)/r)),h=Math.min(n-1,Math.floor((e.centerY+c)/r)),g=.5*t.cellKm2,_=c+.75*r;for(let u=m;u<=h;u++)for(let m=f;m<=p;m++){let f=(m+.5)*r,p=(u+.5)*r,h=Math.hypot(f-e.centerX,p-e.centerY);if(h>_)continue;let v=u*n+m,y=s;e.eye&&d>0&&(y=s*Math.hypot(e.eye.x-f,e.eye.y-p,e.eye.z-Math.max(0,l[v]))/d);let b=this.aVis(y),x=_l;t.hasCreeks(v)&&b<g?x=yl:t.trunkAreaKm2(v)>b&&(x=vl),x!==_l&&(this.desiredTier[v]=x,this.inDesired[v]=i,a.push(v),o.push(y*(1+h/Math.max(1,c))))}}let c=a.map((e,t)=>t).sort((e,t)=>o[e]-o[t]||a[e]-a[t]);this.desired=c.map(e=>a[e]),this.queuePos=0,this.stats.desired=this.desired.length;for(let e of this.desired){let t=this.cache.get(e);t&&(this.cache.delete(e),this.cache.set(e,t))}}evict(){if(this.cache.size<=this.maxCells&&this.nodes<=this.maxNodes)return;let e=this.desiredStamp;for(let[t,n]of this.cache){if(this.cache.size<=this.maxCells&&this.nodes<=this.maxNodes)break;this.inDesired[t]!==e&&(this.cache.delete(t),this.nodes-=n.g.n)}}merge(e,t){let n=performance.now(),r=ml(this.desired.filter(e=>this.cache.has(e)).sort((e,t)=>e-t).map(e=>this.cache.get(e).g));return this.lastMerge=e,t&&(this.changed=!1),this.shown=r.n>0,this.stats.mergeMs=performance.now()-n,this.stats.lastNodes=r.n,r}},xl=12,Sl=`#version 300 es
precision highp float;
layout(location = 0) in vec4 a_dirZ;     // unit direction (planet axes), water surface (m)
layout(location = 1) in vec4 a_side;     // unit side vector, sign
layout(location = 2) in vec4 a_info;     // width, area, along, flags
uniform mat4 u_viewProj;
uniform float u_radius;
uniform float u_exag;
uniform float u_pxScale;   // metres per pixel per metre of distance: 2·tan(fov/2)/viewH
uniform float u_minPx;
uniform float u_lodC;      // A_vis = (lodC · m/px / 1000)² km²
uniform vec3 u_sunReal;
uniform float u_realK;
uniform vec3 u_lightCol, u_ambient;
${_r}
out float v_alpha;
out float v_along;
out float v_side;
out float v_flags;
out float v_widthPx;
out vec3 v_light;
out vec3 v_air;
out vec3 v_trans;

// The globe terrain's sun-model colours for a local sun elevation (globePass.ts dayLight).
void dayLight(float mu, out vec3 light, out vec3 amb) {
  float day = smoothstep(-0.05, 0.08, mu);
  float warm = 1.0 - smoothstep(0.05, 0.45, mu);
  float night = 1.0 - smoothstep(-0.12, 0.0, mu);
  light = mix(vec3(1.0), vec3(1.0, 0.62, 0.36), warm) * day * (1.0 - 0.3 * warm) + vec3(0.55, 0.68, 1.0) * 0.22 * night * 0.5;
  float fill = 1.0 + 0.5 * warm * day;
  amb = mix(vec3(0.10, 0.13, 0.24) * 0.6, mix(vec3(fill), vec3(1.08, 0.92, 0.86) * fill, warm * day), smoothstep(-0.14, 0.25, mu));
}

void main() {
  vec3 up = a_dirZ.xyz;
  // Eye-relative position: both terms are float32 planet-scale values, so the error stays near the
  // representation step of the radius (cm on small planets, under a metre at Earth radius).
  vec3 rel = up * (u_radius + a_dirZ.w * u_exag) - u_eyeP;
  float dist = max(1.0, length(rel));
  float mpp = dist * u_pxScale;
  float aVis = pow(u_lodC * mpp / 1000.0, 2.0);
  v_alpha = smoothstep(aVis, aVis * 1.8, a_info.y);
  float halfW = max(0.5 * a_info.x, 0.5 * u_minPx * mpp);
  v_widthPx = 2.0 * halfW / mpp;
  // Lift slightly along the local vertical so the ribbon wins against the (coarser) terrain surface.
  rel += up * max(2.0, 0.0008 * dist);
  rel += a_side.xyz * a_side.w * halfW;
  v_along = a_info.z;
  v_side = a_side.w;
  v_flags = a_info.w;
  vec3 lr, ar;
  dayLight(dot(up, u_sunReal), lr, ar);
  v_light = 0.35 * mix(u_ambient, ar, u_realK) + 0.65 * mix(u_lightCol, lr, u_realK);
  vec3 trans;
  v_air = atmosphereK(u_eyeP, normalize(rel), length(rel), 6, ${yr.toFixed(2)}, trans);
  v_trans = trans;
  gl_Position = u_viewProj * vec4(rel, 1.0);
  if (v_alpha <= 0.0) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);   // culled: outside the clip volume
}`,Cl=`#version 300 es
precision highp float;
in float v_alpha;
in float v_along;
in float v_side;
in float v_flags;
in float v_widthPx;
in vec3 v_light;
in vec3 v_air;
in vec3 v_trans;
uniform float u_time;
${vr}
out vec4 o;
void main() {
  int flags = int(v_flags + 0.5);
  vec3 col = vec3(0.20, 0.45, 0.56);
  float streak = sin((v_along - u_time * 40.0) * 0.02 + 3.0 * sin(v_side * 2.0 + v_along * 0.003));
  col += 0.05 * smoothstep(0.6, 1.0, streak) * smoothstep(3.0, 10.0, v_widthPx);
  col *= 1.0 - 0.18 * abs(v_side) * smoothstep(2.0, 6.0, v_widthPx);
  if ((flags & ${J.WATERFALL}) != 0) col = mix(col, vec3(0.92, 0.95, 0.97), 0.6 + 0.2 * sin(u_time * 9.0 + v_along));
  else if ((flags & ${J.RAPIDS}) != 0) col = mix(col, vec3(0.80, 0.88, 0.92), 0.25 * smoothstep(4.0, 12.0, v_widthPx));
  col *= v_light;
  // Aerial perspective and tone mapping as the globe terrain.
  col = col * v_trans + v_air;
  col = terrainTone(col);
  float a = v_alpha;
  if ((flags & ${J.EPHEMERAL}) != 0) a *= step(0.45, fract(v_along / 400.0)) * 0.7;
  a *= mix(0.85, 1.0, smoothstep(1.0, 3.0, v_widthPx)) * (1.0 - smoothstep(0.75, 1.0, abs(v_side)) * 0.6);
  if (a <= 0.01) discard;
  o = vec4(pow(col, vec3(1.0 / 1.1)), a);
}`,wl=class{gl;prog;u;vao;vbo;ibo;indexCount=0;radius=1;minPx=1.3;lodC=49;constructor(e){this.gl=e,this.prog=en(e,`globeRivers`,Sl,Cl),this.u=nn(e,this.prog,[`u_viewProj`,`u_radius`,`u_exag`,`u_pxScale`,`u_minPx`,`u_lodC`,`u_time`,`u_sunReal`,`u_realK`,`u_lightCol`,`u_ambient`]),this.vao=e.createVertexArray(),this.vbo=e.createBuffer(),this.ibo=e.createBuffer(),e.bindVertexArray(this.vao),e.bindBuffer(e.ARRAY_BUFFER,this.vbo);for(let t=0;t<3;t++)e.enableVertexAttribArray(t),e.vertexAttribPointer(t,4,e.FLOAT,!1,48,t*16);e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ibo),e.bindVertexArray(null)}setRivers(e,t){let n=this.gl;this.radius=t;let r=e&&e.face?Tl(e,t):null;r?(n.bindVertexArray(null),n.bindBuffer(n.ARRAY_BUFFER,this.vbo),n.bufferData(n.ARRAY_BUFFER,r.verts,n.STATIC_DRAW),n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,this.ibo),n.bufferData(n.ELEMENT_ARRAY_BUFFER,r.idx,n.STATIC_DRAW),this.indexCount=r.idx.length):this.indexCount=0}draw(e){if(this.indexCount===0)return;let t=this.gl,n=this.u;t.useProgram(this.prog),t.uniformMatrix4fv(n.u_viewProj,!1,e.viewProj),t.uniform1f(n.u_radius,this.radius),t.uniform1f(n.u_exag,e.exaggeration),t.uniform1f(n.u_pxScale,e.pxScale),t.uniform1f(n.u_minPx,this.minPx),t.uniform1f(n.u_lodC,this.lodC),t.uniform1f(n.u_time,e.time),t.uniform3f(n.u_sunReal,e.sunReal[0],e.sunReal[1],e.sunReal[2]),t.uniform1f(n.u_realK,e.realK),t.uniform3f(n.u_lightCol,e.light[0],e.light[1],e.light[2]),t.uniform3f(n.u_ambient,e.ambient[0],e.ambient[1],e.ambient[2]),Tr(t,this.prog,e.atmos),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.depthMask(!1),t.bindVertexArray(this.vao),t.drawElements(t.TRIANGLES,this.indexCount,t.UNSIGNED_INT,0),t.bindVertexArray(null),t.depthMask(!0),t.disable(t.BLEND)}};function Tl(e,t){let n=e.face;if(!n||e.n===0)return null;let r=new Float64Array(3*e.n);for(let i=0;i<e.n;i++)$e(n[i],e.x[i],e.y[i],t,r,3*i);let i=e.reachStart.length,a=0;for(let t=0;t<i;t++)a+=e.reachLen[t]+1;let o=new Float32Array(a*2*xl),s=new Uint32Array(a*6),c=0,l=0,u=[],d=(e,n)=>t*Math.hypot(r[3*n]-r[3*e],r[3*n+1]-r[3*e+1],r[3*n+2]-r[3*e+2]);for(let t=0;t<i;t++){u.length=0;let n=e.reachStart[t];for(let r=0;r<e.reachLen[t];r++)u.push(n+r);let i=u[u.length-1];if(e.down[i]>=0&&u.push(e.down[i]),u.length<2)continue;let a=0,f=c;for(let n=0;n<u.length;n++){let i=u[n],s=u[Math.max(0,n-1)],l=u[Math.min(u.length-1,n+1)],f=r[3*i],p=r[3*i+1],m=r[3*i+2],h=r[3*l]-r[3*s],g=r[3*l+1]-r[3*s+1],_=r[3*l+2]-r[3*s+2],v=p*_-m*g,y=m*h-f*_,b=f*g-p*h,x=Math.hypot(v,y,b)||1;v/=x,y/=x,b/=x,n>0&&(a+=d(u[n-1],i));let S=n===u.length-1&&u.length>e.reachLen[t]?u[n-1]:i;for(let t of[-1,1]){let n=c*xl;o[n]=f,o[n+1]=p,o[n+2]=m,o[n+3]=e.zWater[i],o[n+4]=v,o[n+5]=y,o[n+6]=b,o[n+7]=t,o[n+8]=e.width[S],o[n+9]=e.area[S],o[n+10]=a,o[n+11]=e.flags[i],c++}}for(let e=0;e<u.length-1;e++){let t=f+2*e;s[l++]=t,s[l++]=t+1,s[l++]=t+2,s[l++]=t+1,s[l++]=t+3,s[l++]=t+2}}return{verts:o.subarray(0,c*xl),idx:s.subarray(0,l)}}var El=10,Dl=`#version 300 es
precision highp float;
layout(location = 0) in vec3 a_center;
layout(location = 1) in vec3 a_side;     // unit side vector xy, sign
layout(location = 2) in vec4 a_info;     // width, area, along, flags
uniform mat4 u_viewProj;
uniform vec3 u_origin;
uniform float u_exag;
uniform float u_pxScale;   // metres per pixel per metre of distance: 2·tan(fov/2)/viewH
uniform float u_minPx;
uniform float u_lodC;      // A_vis = (lodC · m/px / 1000)² km²
out float v_alpha;
out float v_along;
out float v_side;
out float v_flags;
out float v_widthPx;
out vec3 v_world;    // world xy (m), render height
void main() {
  v_world = vec3(a_center.xy, a_center.z * u_exag);
  vec3 rel = a_center - u_origin;
  rel.z = a_center.z * u_exag - u_origin.z;
  float dist = max(1.0, length(rel));
  float mpp = dist * u_pxScale;
  float aVis = pow(u_lodC * mpp / 1000.0, 2.0);
  v_alpha = smoothstep(aVis, aVis * 1.8, a_info.y);
  float halfW = max(0.5 * a_info.x, 0.5 * u_minPx * mpp);
  v_widthPx = 2.0 * halfW / mpp;
  // Lift slightly toward the camera so the ribbon wins against the (coarser) terrain surface.
  rel.z += max(2.0, 0.0008 * dist);
  rel.xy += a_side.xy * a_side.z * halfW;
  v_along = a_info.z;
  v_side = a_side.z;
  v_flags = a_info.w;
  gl_Position = u_viewProj * vec4(rel, 1.0);
  if (v_alpha <= 0.0) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);   // culled: outside the clip volume
}`,Ol=`#version 300 es
precision highp float;
in float v_alpha;
in float v_along;
in float v_side;
in float v_flags;
in float v_widthPx;
in vec3 v_world;
uniform float u_time;
uniform int u_atmos;         // 1: light colours, cloud shadows and valley fog (realistic view)
uniform float u_size;
uniform vec3 u_sun;
uniform vec3 u_hazeColor;
uniform sampler2D u_fogPot;  // horizon pass AO texture: b = valley-fog potential
${Ws}
out vec4 o;
float hash(float x) { return fract(sin(x * 12.9898) * 43758.5453); }
void main() {
  int flags = int(v_flags + 0.5);
  vec3 col = vec3(0.20, 0.45, 0.56);
  // Flow streaks scroll downstream; fade them out on ribbons only a few pixels wide.
  float streak = sin((v_along - u_time * 40.0) * 0.02 + 3.0 * sin(v_side * 2.0 + v_along * 0.003));
  col += 0.05 * smoothstep(0.6, 1.0, streak) * smoothstep(3.0, 10.0, v_widthPx);
  col *= 1.0 - 0.18 * abs(v_side) * smoothstep(2.0, 6.0, v_widthPx);     // darker banks
  if ((flags & ${J.WATERFALL}) != 0) col = mix(col, vec3(0.92, 0.95, 0.97), 0.6 + 0.2 * sin(u_time * 9.0 + v_along));
  else if ((flags & ${J.RAPIDS}) != 0) col = mix(col, vec3(0.80, 0.88, 0.92), 0.25 * smoothstep(4.0, 12.0, v_widthPx));
  if (u_atmos == 1) {
    // Same light as the water lid, so ribbons don't glow at night, under clouds or in fog.
    float foot = max(1.0, length(fwidth(v_world.xy)));
    float cs = cloudShadow(v_world.xy, v_world.z, foot);
    col *= mix(0.85, 1.0, cs) * (0.35 * u_ambient + 0.65 * u_lightCol);
    vec2 uv = vec2(v_world.x, u_size - v_world.y) / u_size;
    col = mix(col, fogColor(), valleyFog(v_world.xy, texture(u_fogPot, uv).b, texture(u_clim2, uv).g, foot));
  }
  float a = v_alpha;
  if ((flags & ${J.EPHEMERAL}) != 0) a *= step(0.45, fract(v_along / 400.0)) * 0.7;  // dashed wadis
  // Soft edges for ribbons that are only a pixel or two wide.
  a *= mix(0.85, 1.0, smoothstep(1.0, 3.0, v_widthPx)) * (1.0 - smoothstep(0.75, 1.0, abs(v_side)) * 0.6);
  if (a <= 0.01) discard;
  o = vec4(pow(col, vec3(1.0 / 1.1)), a);
}`,kl=class{gl;prog;u;vao;vbo;ibo;indexCount=0;minPx=1.3;lodC=49;constructor(e){this.gl=e,this.prog=en(e,`rivers`,Dl,Ol),this.u=nn(e,this.prog,[`u_viewProj`,`u_origin`,`u_exag`,`u_pxScale`,`u_minPx`,`u_lodC`,`u_time`,`u_atmos`,`u_size`,`u_sun`,`u_hazeColor`,`u_fogPot`]),this.vao=e.createVertexArray(),this.vbo=e.createBuffer(),this.ibo=e.createBuffer(),e.bindVertexArray(this.vao),e.bindBuffer(e.ARRAY_BUFFER,this.vbo),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,3,e.FLOAT,!1,40,0),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,3,e.FLOAT,!1,40,12),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,4,e.FLOAT,!1,40,24),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ibo),e.bindVertexArray(null)}setRivers(e,t){let n=this.gl;if(!e||e.n===0){this.indexCount=0;return}let r=e.reachStart.length,i=0;for(let t=0;t<r;t++)i+=e.reachLen[t]+1;let a=new Float32Array(i*2*El),o=new Uint32Array(i*6),s=0,c=0,l=[],u=[];for(let n=0;n<r;n++){l.length=0,u.length=0;let r=e.reachStart[n];for(let t=0;t<e.reachLen[n];t++)u.push(r+t);let i=u[u.length-1];if(e.down[i]>=0&&u.push(e.down[i]),u.length<2)continue;let d=0,f=s;for(let r=0;r<u.length;r++){let i=u[r],o=u[Math.max(0,r-1)],c=u[Math.min(u.length-1,r+1)],l=e.x[c]-e.x[o],f=-(e.y[c]-e.y[o]),p=Math.hypot(l,f)||1;l/=p,f/=p,r>0&&(d+=Math.hypot(e.x[i]-e.x[u[r-1]],e.y[i]-e.y[u[r-1]]));let m=r===u.length-1&&u.length>e.reachLen[n]?u[r-1]:i;for(let n of[-1,1]){let r=s*El;a[r]=e.x[i],a[r+1]=t-e.y[i],a[r+2]=e.zWater[i],a[r+3]=-f,a[r+4]=l,a[r+5]=n,a[r+6]=e.width[m],a[r+7]=e.area[m],a[r+8]=d,a[r+9]=e.flags[i],s++}}for(let e=0;e<u.length-1;e++){let t=f+2*e;o[c++]=t,o[c++]=t+1,o[c++]=t+2,o[c++]=t+1,o[c++]=t+3,o[c++]=t+2}}n.bindVertexArray(null),n.bindBuffer(n.ARRAY_BUFFER,this.vbo),n.bufferData(n.ARRAY_BUFFER,a.subarray(0,s*El),n.STATIC_DRAW),n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,this.ibo),n.bufferData(n.ELEMENT_ARRAY_BUFFER,o.subarray(0,c),n.STATIC_DRAW),this.indexCount=c}draw(e){if(this.indexCount===0)return;let t=this.gl;if(t.useProgram(this.prog),t.uniformMatrix4fv(this.u.u_viewProj,!1,e.viewProj),t.uniform3f(this.u.u_origin,e.origin.x,e.origin.y,e.origin.z),t.uniform1f(this.u.u_exag,e.exaggeration),t.uniform1f(this.u.u_pxScale,e.pxScale),t.uniform1f(this.u.u_minPx,this.minPx),t.uniform1f(this.u.u_lodC,this.lodC),t.uniform1f(this.u.u_time,e.time),t.uniform1i(this.u.u_atmos,+!!e.atmos),e.atmos){let n=e.atmos;t.uniform1f(this.u.u_size,n.size),t.uniform3f(this.u.u_sun,n.sun[0],n.sun[1],n.sun[2]),t.uniform3f(this.u.u_hazeColor,n.hazeColor[0],n.hazeColor[1],n.hazeColor[2]),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,n.fogPot),t.uniform1i(this.u.u_fogPot,1),qs(t,this.prog,n.frame,0)}t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.depthMask(!1),t.bindVertexArray(this.vao),t.drawElements(t.TRIANGLES,this.indexCount,t.UNSIGNED_INT,0),t.bindVertexArray(null),t.depthMask(!0),t.disable(t.BLEND)}},Al=3200,jl=[9,4],Ml=class{size;constructor(e){this.size=e}heightAt(){return 0}raycast(e,t){if(Math.abs(t.z)<1e-12)return null;let n=-e.z/t.z;return n<0?null:{x:e.x+t.x*n,y:e.y+t.y*n,z:0}}},Nl=class{canvas;gl;cam;globeCam;hf=null;globeHf=null;sphere=!1;reversedZ;exaggeration=1.5;nodes=0;quality=fn(`high`);contextLost=!1;onContextChange;selector=new Pr;sphereSelector=new zr;terrain;rivers;creekPass;creeks=new bl;horizon;sky;clouds;globe;globeRivers;globeSky;view={...ic};cloudDrift=[0,0];lastTime=-1;detail;detailU;detailSeen=-1;ground=null;globeDetail;globeDetailU;globeDetailSeen=-1;globeGround=null;globeDetailTier=``;lastGlobeTime=-1;labels;creekWorld=null;src={terrain:null,surface:null,masks:null,rivers:null,landmarks:[],highlight:null,drape:null,detail:null,globe:null,globeWater:null,globeWaterD:null,globeWaterRaw:null,globeWetPad:null,globeSurface:null,globeDrape:null,globeDetail:null,globeDetailOpts:null};drawnKey=``;dirty=!0;fbSamples=-1;viewProj=new Float32Array(16);planes=new Float64Array(24);fbo=null;colorRb=null;depthRb=null;fbW=0;fbH=0;dpr=1;fittedSize=-1;fittedRadius=-1;constructor(e){this.canvas=e;let t=e.getContext(`webgl2`,{antialias:!1,alpha:!0,premultipliedAlpha:!1,depth:!1,powerPreference:`high-performance`});if(!t)throw Error(`WebGL2 is not available in this browser.`);this.gl=t,this.reversedZ=this.enableClipControl(),this.cam=new Ln(new Ml(1024e3)),this.cam.reversedZ=this.reversedZ,this.globeCam=new sr(new Xn(652e3)),this.globeCam.reversedZ=this.reversedZ,this.initGpu(),e.addEventListener(`webglcontextlost`,e=>{e.preventDefault(),this.contextLost=!0,this.onContextChange?.(!0)}),e.addEventListener(`webglcontextrestored`,()=>this.restore())}enableClipControl(){let e=this.gl.getExtension(`EXT_clip_control`);return e&&e.clipControlEXT(e.LOWER_LEFT_EXT,e.ZERO_TO_ONE_EXT),e!==null}initGpu(){let e=this.gl,t=this.terrain?.palette,n=this.labels?.enabled??!0;this.terrain=new wc(e),this.globe=new sa(e),this.globeRivers=new wl(e),t&&(this.terrain.palette=this.globe.palette=t),this.globeSky=new Er(e),this.rivers=new kl(e),this.creekPass=new kl(e),this.creekPass.lodC=35,this.creeks.lodC=35,this.horizon=new Bo(e),this.sky=new Us(e),this.detail=new oo(e),this.detailU=new ya(this.detail),this.detailSeen=-1,this.newGlobeDetail(),this.labels=new Bs(e),this.clouds=new Xs(e),this.labels.enabled=n,this.fbo=this.colorRb=this.depthRb=null,this.fbW=this.fbH=0,this.fbSamples=-1}restore(){if(this.gl.isContextLost())return;this.enableClipControl()!==this.reversedZ&&console.warn(`EXT_clip_control availability changed after a context restore`),this.contextLost=!1,this.initGpu();let e=this.src;e.terrain&&this.uploadTerrain(...e.terrain,!0),this.terrain.setSurface(e.surface),this.terrain.setLandformMasks(e.masks),this.terrain.setDrape(e.drape),this.rivers.setRivers(e.rivers?.face?null:e.rivers,this.hf?.size??0),this.labels.setLandmarks(e.landmarks,...this.labelSpace()),this.labels.highlight(e.highlight),this.setCreekWorld(this.creekWorld),e.detail&&this.detail.build(e.detail),e.globe&&this.globeHf&&this.globe.setTerrain(e.globe,this.globeHf,e.globeWater,e.globeWaterD,e.globeWetPad),this.globeRivers.setRivers(e.rivers?.face?e.rivers:null,this.globeHf?.radius??1),this.globeDetail.setWorld(e.globeDetail),this.globe.setSurface(e.globeSurface),this.globe.setDrape(e.globeDrape),this.dirty=!0,this.onContextChange?.(!1)}setQuality(e){this.quality=e,this.dirty=!0,this.globeDetail&&e.tier!==this.globeDetailTier&&!this.contextLost&&(this.globeDetail.dispose(),this.newGlobeDetail(),this.globeDetail.setWorld(this.src.globeDetail))}newGlobeDetail(){this.globeDetail=new Fo(this.gl,Eo(this.quality.tier)),this.globeDetailTier=this.quality.tier,this.globeDetailU??=new ea,this.globeDetailU.src=this.globeDetail,this.globeDetailSeen=-1,this.globeGround=null}buildDetail(e){this.src.detail=e,this.ground=null,this.dirty=!0,this.contextLost||this.detail.build(e)}get needsFrame(){return this.contextLost?!1:this.sphere?this.dirty||this.globeCam.moving||this.globeDetail.busy||this.labels.animating||this.viewKey()!==this.drawnKey:this.dirty||this.cam.moving||this.labels.animating||this.detail.building||this.viewKey()!==this.drawnKey}get activeCam(){return this.sphere?this.globeCam:this.cam}viewKey(){if(this.sphere){let e=this.globeCam,t=e.dir;return`g|${t.x}|${t.y}|${t.z}|${e.targetH}|${e.distance}|${e.pitch}|${e.bearing}|${this.canvas.width}x${this.canvas.height}|${this.exaggeration}`}let e=this.cam,t=e.target;return`${t.x}|${t.y}|${t.z}|${e.distance}|${e.pitch}|${e.bearing}|${this.canvas.width}x${this.canvas.height}|${this.exaggeration}`}setTerrain(e,t=null,n=null){this.sphere=!1,this.src.terrain=[e,t,n];let r=this.uploadTerrain(e,t,n);this.cam.setGround(r),this.fittedSize!==r.size&&(this.fittedSize=r.size,this.cam.fitWorld())}uploadTerrain(e,t,n,r=!1){let i=t!==null&&t.w===e.w?qt(e,t,n&&n.w===e.w?n:null):null,a=this.hf;return(!a||!r)&&(a=new Yt(e,i?.level??null),a.exaggeration=this.exaggeration,this.hf=a),this.dirty=!0,this.contextLost||(this.terrain.setTerrain(e,i),this.horizon.setSurface(a.surface,a.n,a.size)),a}setExaggeration(e){this.exaggeration=e,this.hf&&(this.hf.exaggeration=e),this.globeHf&&(this.globeHf.exaggeration=e)}setGlobe(e,t=null,n=null){this.sphere=!0,this.src.globe=e;let r=t&&t.faces===6&&t.w===e.w?Jn(t,n):null;this.src.globeWater=r,this.src.globeWaterD=r&&t&&n?Jn(Ll(t,n),n).level:null,this.src.globeWaterRaw=r&&t?t.data:null,this.src.globeWetPad=r&&t?Hn(Il(t,n),e.w):null;let i=new Zn(e,r?.level??null);i.exaggeration=this.exaggeration,this.globeHf=i,this.globeGround=null,this.globeCam.setGround(i),this.globeCam.minMetresPerPixel=40,this.fittedRadius!==i.radius&&(this.fittedRadius=i.radius,this.globeCam.fitWorld(),this.src.landmarks.length&&this.labels.setLandmarks(this.src.landmarks,...this.labelSpace())),this.dirty=!0,this.contextLost||(this.globe.setTerrain(e,i,r,this.src.globeWaterD,this.src.globeWetPad),this.globeRivers.setRivers(this.src.rivers?.face?this.src.rivers:null,i.radius)),this.rebuildGlobeDetail()}setGlobeDetail(e){let t=this.src.globeDetailOpts;t===e||t&&e&&t.seed===e.seed&&t.discharge===e.discharge&&t.biome===e.biome||(this.src.globeDetailOpts=e,this.rebuildGlobeDetail())}rebuildGlobeDetail(){let e=this.globeHf,t=this.src.globeDetailOpts,n=this.src.globeWater,r=this.src.rivers,i=t=>t&&e&&t.length===e.data.length?t:null;this.src.globeDetail=e&&t?{n:e.n,radius:e.radius,elevation:e.data,surfacePad:e.padded,seed:t.seed,waterLevel:this.src.globeWaterD??n?.level??null,waterClass:n?.cls??null,waterRaw:this.src.globeWaterRaw,discharge:i(t.discharge),biome:i(t.biome),rivers:r?.face?Fl(r,r.face,e.radius):null}:null,this.dirty=!0,this.contextLost||this.globeDetail.setWorld(this.src.globeDetail)}clearGlobe(){this.sphere=!1,this.globeHf=null,this.globeGround=null,this.src.globe=this.src.globeSurface=this.src.globeDrape=null,this.src.globeWater=this.src.globeWaterD=this.src.globeWaterRaw=this.src.globeWetPad=null,this.src.globeDetail=null,this.contextLost||this.globeDetail.setWorld(null),this.dirty=!0}setGlobeSurface(e){this.src.globeSurface=e,this.dirty=!0,this.contextLost||this.globe.setSurface(e)}setGlobeDrape(e){this.src.globeDrape=e,this.dirty=!0,this.contextLost||this.globe.setDrape(e)}setSurface(e){this.src.surface=e,this.dirty=!0,this.contextLost||this.terrain.setSurface(e)}setLandformMasks(e){this.src.masks=e,this.dirty=!0,this.contextLost||this.terrain.setLandformMasks(e)}setPalette(e){this.terrain.palette=e,this.globe.palette=e,this.dirty=!0}setCreekWorld(e){this.creekWorld=e,this.dirty=!0;let t=this.hf;if(!e||!t||e.elevation.w!==t.n){this.creeks.setWorld(null,()=>0),this.contextLost||this.creekPass.setRivers(null,0);return}let n=t.size;this.creeks.setWorld({n:e.elevation.w,cellM:n/e.elevation.w,seed:e.seed,elevation:e.elevation.data,waterClass:e.waterClass.data,dischargeLog:e.discharge.data,rivers:e.rivers},this.ground?(e=>(t,r)=>e.detailHeightAt(t,n-r,30))(this.ground):(e,r)=>t.elevationAt(e,n-r)),this.contextLost||this.creekPass.setRivers(null,n)}updateCreeks(){let e=this.hf;if(!e)return;let t=this.cam,n=e.size,r=0;for(let[e,n]of[[0,0],[t.viewW,0],[0,t.viewH],[t.viewW,t.viewH]]){let i=t.planeHit(e,n,t.target.z)??t.pick(e,n);r=Math.max(r,i?Math.hypot(i.x-t.target.x,i.y-t.target.y):1/0)}let i=t.eye(),a=this.creeks.update({centerX:t.target.x,centerY:n-t.target.y,radiusM:Math.min(r,6e4),metresPerPixel:t.metresPerPixel(),eye:{x:i.x,y:n-i.y,z:i.z/this.exaggeration}});a&&this.creekPass.setRivers(a,n)}setLandmarks(e){this.src.landmarks=e,this.dirty=!0,this.labels.setLandmarks(e,...this.labelSpace())}labelSpace(){return this.sphere&&this.globeHf?[0,this.globeHf.radius]:[this.hf?.size??1024e3,0]}highlightLandmark(e){this.src.highlight=e,this.dirty=!0,this.labels.highlight(e)}setRivers(e){let t=this.src.rivers;this.src.rivers=e,this.dirty=!0,!this.contextLost&&(this.rivers.setRivers(e?.face?null:e,this.hf?.size??0),this.globeRivers.setRivers(e?.face&&this.globeHf?e:null,this.globeHf?.radius??1),e!==t&&this.sphere&&this.globeHf&&(e?.face||this.src.globeDetail?.rivers)&&this.rebuildGlobeDetail())}setDrape(e){this.src.drape=e,this.dirty=!0,this.contextLost||this.terrain.setDrape(e)}resize(){this.dpr=mn(this.quality,window.devicePixelRatio||1);let e=this.canvas.clientWidth,t=this.canvas.clientHeight;if(!gr([this.cam,this.globeCam],e,t))return;let n=Math.max(1,Math.round(e*this.dpr)),r=Math.max(1,Math.round(t*this.dpr));(this.canvas.width!==n||this.canvas.height!==r)&&(this.canvas.width=n,this.canvas.height=r)}capture(e){if(this.contextLost)return null;this.draw(e);let t=this.gl,n=this.canvas.width,r=this.canvas.height,i=new Uint8Array(n*r*4);t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.readPixels(0,0,n,r,t.RGBA,t.UNSIGNED_BYTE,i);let a=new Uint8Array(n*r*4),o=n*4;for(let e=0;e<r;e++)a.set(i.subarray((r-1-e)*o,(r-e)*o),e*o);for(let e=3;e<a.length;e+=4)a[e]=255;return{width:n,height:r,pixels:a}}draw(e){if(this.contextLost)return;let t=this.gl;if(this.dirty=!1,this.drawnKey=this.viewKey(),this.sphere){this.drawGlobe(e);return}this.stepDetail();let n=this.canvas.width,r=this.canvas.height;this.ensureTargets(n,r),t.bindFramebuffer(t.FRAMEBUFFER,this.fbo),t.viewport(0,0,n,r);let i=this.terrain.realistic,a=i&&this.view.seasons?this.view.season:Qs,o=fc(i&&this.view.sun?this.view.time:nc,a,this.cam.bearing),s=o.skyHorizon,c=this.lastTime<0?0:Math.min(.1,Math.max(0,e-this.lastTime));this.lastTime=e;let l=this.view.animate?60:1;this.cloudDrift=[(this.cloudDrift[0]-jl[0]*c*l)%2e7,(this.cloudDrift[1]-jl[1]*c*l)%2e7],t.clearColor(s[0]*.25,s[1]*.27,s[2]*.32,1),t.clearDepth(+!this.reversedZ),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);let u=this.hf;if(u){t.enable(t.DEPTH_TEST),t.depthFunc(this.reversedZ?t.GEQUAL:t.LEQUAL);let c=this.cam,l=c.eye();c.viewProjRelative(this.viewProj,l),c.frustumPlanesRelative(this.planes,l);let d=c.viewH/(2*Math.tan(c.fovY/2)),f=Math.ceil(Math.log2(u.size/512)),p=this.detail.ready?this.detail.boundsPad*this.exaggeration:50;this.nodes=this.selector.select(u,l,l,this.planes,{maxDepth:f,vertexPx:this.quality.vertexPx,pxPerRad:d,boundsPad:p}),this.ground&&(this.ground.pxFoot=Math.max(c.metresPerPixel(),u.size/2**f/32));let m=Math.max(1,l.z-u.heightAt(l.x,l.y)),h=Math.sin(c.pitch),g=o.dir;this.horizon.minIntervalMs=this.view.animate?120:0,this.horizon.update(g,this.exaggeration*1.5),t.bindFramebuffer(t.FRAMEBUFFER,this.fbo),t.viewport(0,0,n,r),t.disable(t.DEPTH_TEST),this.sky.draw(this.viewProj,{horizon:s,zenith:o.skyZenith,glow:o.glow},o.sunDir,this.reversedZ),t.enable(t.DEPTH_TEST);let _=pc(a),v=i?.5*o.fog*(1+.3*Math.max(0,-_.cos)):0,y={cloudAmount:i&&this.view.clouds?.7:0,cloudDrift:this.cloudDrift,cloudZ:Al*this.exaggeration,fogK:v,light:o.light,ambient:o.ambient},b=h*h*1.2/(m*25)+1e-9;this.terrain.draw({lighting:this.horizon.ready?{sun:this.horizon.texture,ao:this.horizon.aoTexture}:null,pxScale:2*Math.tan(c.fovY/2)/Math.max(1,c.viewH),detail:this.detailU,viewProj:this.viewProj,origin:l,instances:this.selector.instances,count:this.nodes,exaggeration:this.exaggeration,normalExaggeration:this.exaggeration*(1.4+5*Pl(5e3,6e5,m)),sun:g,haze:b,hazeColor:s,time:e,season:[_.cos,_.sin],atmos:y});let x={...y,clim2:this.terrain.climate2},S={viewProj:this.viewProj,origin:l,exaggeration:this.exaggeration,pxScale:2*Math.tan(c.fovY/2)/Math.max(1,c.viewH),time:e,atmos:i&&this.horizon.ready?{frame:x,fogPot:this.horizon.aoTexture,size:u.size,sun:g,hazeColor:s}:null};this.updateCreeks(),this.creekPass.draw(S),this.rivers.draw(S),this.clouds.draw({viewProj:this.viewProj,origin:l,worldSize:u.size,sun:g,haze:b,hazeColor:s,alpha:.6*Pl(15e3,45e3,m)*(1-.45*Pl(2e5,12e5,m)),atmos:x}),t.disable(t.DEPTH_TEST),this.labels.draw({cam:c,ground:this.ground??u,dpr:this.dpr,timeSec:e,exaggeration:this.exaggeration}),t.disable(t.DEPTH_TEST)}t.bindFramebuffer(t.READ_FRAMEBUFFER,this.fbo),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.blitFramebuffer(0,0,n,r,0,0,n,r,t.COLOR_BUFFER_BIT,t.NEAREST),t.bindFramebuffer(t.FRAMEBUFFER,null)}drawGlobe(e){let t=this.gl,n=this.canvas.width,r=this.canvas.height;this.ensureTargets(n,r),t.bindFramebuffer(t.FRAMEBUFFER,this.fbo),t.viewport(0,0,n,r),t.clearColor(0,0,0,1),t.clearDepth(+!this.reversedZ),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);let i=this.globeHf,a=this.globeCam;if(i){let n=i.radius,r=a.eye();a.viewProjRelative(this.viewProj,r),a.frustumPlanesRelative(this.planes,r);let o=a.viewH/(2*Math.tan(a.fovY/2)),s=2*Math.tan(a.fovY/2)/Math.max(1,a.viewH),c=this.globeDetail,l=this.lastGlobeTime<0?0:Math.min(.1,Math.max(0,e-this.lastGlobeTime));this.lastGlobeTime=e;let u=c.params!==null&&c.fn!==null,d=u?c.boundsPad*this.exaggeration:0;c.update({eye:r,pxScale:s,planes:this.planes,maxHeight:i.maxHeight+d},l,a.moving?2:3),this.syncGlobeGround(i);let f=Math.PI/2*n,p=u?Math.max(zr.depthFor(i.n),Math.ceil(Math.log2(f/512))):zr.depthFor(i.n);if(this.nodes=this.sphereSelector.select(i,r,this.planes,{maxDepth:p,vertexPx:this.quality.vertexPx,pxPerRad:o,boundsPad:d}),this.globeGround){let e=a.metresPerPixel();this.globeGround.pxFoot=Math.max(Number.isFinite(e)?e:1e6,f/2**p/32)}let m=this.globe.realistic,h=m&&this.view.sun,g=m&&this.view.seasons,_=h?this.view.time:nc,v=g?this.view.season:h?ac:Qs,[y,b]=a.latLon(),x=h?fc(((_+b/15)%24+24)%24,v,a.bearing,y*Math.PI/180):fc(_,Qs,a.bearing),S=a.bearing,C=x.dir,w=[C[0]*Math.cos(S)-C[1]*Math.sin(S),C[0]*Math.sin(S)+C[1]*Math.cos(S),C[2]],T=a.axes(),E=a.dir,D=[w[0]*T.r.x+w[1]*T.fh.x+w[2]*E.x,w[0]*T.r.y+w[1]*T.fh.y+w[2]*E.y,w[0]*T.r.z+w[1]*T.fh.z+w[2]*E.z],O=ec(v),k=-(_-12)/24*2*Math.PI,A=[Math.cos(O)*Math.cos(k),Math.cos(O)*Math.sin(k),Math.sin(O)],j=a.clearance(),M=h?Pl(.03*n,.4*n,a.altitude()):0,N={eye:r,radius:n,sun:h?A:D,sunI:1};t.disable(t.DEPTH_TEST),this.globeSky.draw(this.viewProj,this.reversedZ,N,N.sun),t.enable(t.DEPTH_TEST),t.depthFunc(this.reversedZ?t.GEQUAL:t.LEQUAL);let ee=pc(v);this.globe.draw({viewProj:this.viewProj,instances:this.sphereSelector.instances,count:this.nodes,exaggeration:this.exaggeration,normalExaggeration:this.exaggeration*(1.4+5*Pl(5e3,6e5,j)),sunCarto:w,camRight:T.r,camUp:T.u,sunReal:A,realK:M,light:x.light,ambient:x.ambient,realistic:m,season:g?[ee.cos,ee.sin]:m?[0,0]:[1,0],time:e,atmos:N,detail:this.globeDetailU,eye:r,pxScale:s}),this.globe.layerModeRealistic&&this.globeRivers.draw({viewProj:this.viewProj,exaggeration:this.exaggeration,pxScale:2*Math.tan(a.fovY/2)/Math.max(1,a.viewH),time:e,sunReal:A,realK:M,light:x.light,ambient:x.ambient,atmos:N}),t.disable(t.DEPTH_TEST),this.labels.draw({cam:a,ground:null,globe:this.globeGround??i,dpr:this.dpr,timeSec:e,exaggeration:this.exaggeration})}t.bindFramebuffer(t.READ_FRAMEBUFFER,this.fbo),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.blitFramebuffer(0,0,n,r,0,0,n,r,t.COLOR_BUFFER_BIT,t.NEAREST),t.bindFramebuffer(t.FRAMEBUFFER,null)}syncGlobeGround(e){let t=this.globeDetail;t.version!==this.globeDetailSeen&&(this.globeDetailSeen=t.version,t.fn&&t.params?(t.fn.amp=this.globeDetailU.amp,this.globeGround=new Ji(t.fn,e,t.boundsPad),this.globeCam.setGround(this.globeGround),this.globeCam.minMetresPerPixel=8):this.globeGround&&(this.globeGround=null,this.globeCam.setGround(e),this.globeCam.minMetresPerPixel=40))}stepDetail(){if(this.detail.building&&this.detail.step(this.cam.moving?3:10),this.detail.version===this.detailSeen||!this.hf)return;this.detailSeen=this.detail.version;let e=this.detail.heightSources();e&&(this.ground=new di(new li(e),this.hf,this.detail.boundsPad),this.cam.setGround(this.ground),e.detail&&this.setCreekWorld(this.creekWorld))}ensureTargets(e,t){let n=this.gl,r=Math.max(0,Math.min(this.quality.msaa,n.getParameter(n.MAX_SAMPLES)));this.fbo&&e===this.fbW&&t===this.fbH&&r===this.fbSamples||(this.fbo||(this.fbo=n.createFramebuffer(),this.colorRb=n.createRenderbuffer(),this.depthRb=n.createRenderbuffer()),n.bindRenderbuffer(n.RENDERBUFFER,this.colorRb),n.renderbufferStorageMultisample(n.RENDERBUFFER,r,n.RGBA8,e,t),n.bindRenderbuffer(n.RENDERBUFFER,this.depthRb),n.renderbufferStorageMultisample(n.RENDERBUFFER,r,n.DEPTH_COMPONENT32F,e,t),n.bindFramebuffer(n.FRAMEBUFFER,this.fbo),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,this.colorRb),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.RENDERBUFFER,this.depthRb),n.bindFramebuffer(n.FRAMEBUFFER,null),this.fbW=e,this.fbH=t,this.fbSamples=r)}};function Pl(e,t,n){let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)}function Fl(e,t,n){return{graph:e,nodeDir:(r,i)=>$e(t[r],e.x[r],e.y[r],n,i)}}function Il(e,t){let n=e.data,r=t&&t.data.length===n.length?t.data:null,i=new Float32Array(n.length);for(let e=0;e<n.length;e++)i[e]=+(n[e]>-9e3&&!(r&&r[e]===3));return i}function Ll(e,t){let n=Float32Array.from(e.data),r=t.data;if(r.length===n.length)for(let e=0;e<n.length;e++)r[e]===3&&(n[e]=-1e4);return{...e,data:n}}var Rl=[[`Mountains`,[`range`,`peak`,`hill`,`pass`,`volcano`,`caldera`,`plateau`,`rift`,`canyon`,`gorge`,`mesa-field`]],[`Rivers & lakes`,[`river`,`lake`,`waterfall`,`delta`]],[`Seas & coasts`,[`ocean`,`sea`,`gulf`,`bay`,`strait`,`lagoon`,`fjord`,`reef`,`atoll`]],[`Lands`,[`continent`,`island`,`archipelago`,`peninsula`,`cape`,`isthmus`,`plain`]],[`Ice, deserts & forests`,[`icecap`,`glacier`,`desert`,`erg`,`forest`,`grassland`,`wetland`,`karst`]],[`Impacts`,[`crater`]]],zl={continent:`Continent`,island:`Island`,archipelago:`Archipelago`,peninsula:`Peninsula`,cape:`Cape`,isthmus:`Isthmus`,ocean:`Ocean`,sea:`Sea`,gulf:`Gulf`,bay:`Bay`,strait:`Strait`,lagoon:`Lagoon`,range:`Mountain range`,peak:`Peak`,volcano:`Volcano`,caldera:`Caldera`,crater:`Impact crater`,plateau:`Plateau`,rift:`Rift`,"mesa-field":`Mesas`,canyon:`Canyon`,river:`River`,lake:`Lake`,waterfall:`Waterfall`,delta:`Delta`,fjord:`Fjord`,glacier:`Glacier`,icecap:`Ice cap`,desert:`Desert`,erg:`Sand sea`,forest:`Forest`,wetland:`Wetland`,karst:`Karst`,reef:`Reef`,atoll:`Atoll`,plain:`Plain`,hill:`Hill`,grassland:`Open country`,pass:`Pass`,gorge:`Gorge`},Bl=12,Vl=class{cb;el;body;search;landmarks=[];traits=null;radiusM=0;expanded=new Set;constructor(e,t){this.cb=t,this.el=document.createElement(`aside`),this.el.className=`atlas hidden`;let n=document.createElement(`div`);n.className=`atlas-head`;let r=document.createElement(`span`);r.className=`atlas-title`,r.textContent=`Atlas`;let i=document.createElement(`button`);i.className=`atlas-close`,i.type=`button`,i.textContent=`✕`,i.setAttribute(`aria-label`,`Close atlas`),i.addEventListener(`click`,()=>this.toggle(!1)),n.append(r,i),this.search=document.createElement(`input`),this.search.className=`atlas-search`,this.search.type=`search`,this.search.placeholder=`Search places…`,this.search.addEventListener(`input`,()=>this.render()),this.body=document.createElement(`div`),this.body.className=`atlas-body`,this.el.append(n,this.search,this.body),e.append(this.el)}get open(){return!this.el.classList.contains(`hidden`)}toggle(e=!this.open){this.el.classList.toggle(`hidden`,!e)}set(e,t,n=0){this.landmarks=e,this.traits=t,this.radiusM=n,this.render()}render(){let e=this.search.value.trim().toLowerCase(),t=[],n=new Map(this.landmarks.map(e=>[e.id,e]));if(!e&&this.traits&&this.traits.headline){let e=document.createElement(`section`);e.className=`atlas-traits`;let r=document.createElement(`p`);r.className=`atlas-headline`,r.textContent=this.traits.headline;let i=document.createElement(`ul`);for(let e of this.traits.traits){let t=document.createElement(`li`);t.textContent=e,i.append(t)}e.append(r,i),t.push(e);let a=this.traits.heroes.map(e=>n.get(e)).filter(e=>!!e);a.length&&t.push(this.section(`Highlights`,a,!0))}let r=t=>!e||t.name.toLowerCase().includes(e)||zl[t.kind].toLowerCase().includes(e);for(let[e,n]of Rl){let i=this.landmarks.filter(e=>n.includes(e.kind)&&r(e)).sort((e,t)=>t.importance-e.importance);i.length&&t.push(this.section(e,i,!1))}if(t.length===0){let e=document.createElement(`p`);e.className=`atlas-empty`,e.textContent=this.landmarks.length?`No matches.`:`Landmarks appear when the world finishes generating.`,t.push(e)}this.body.replaceChildren(...t)}section(e,t,n){let r=document.createElement(`section`);r.className=n?`atlas-section atlas-heroes`:`atlas-section`;let i=document.createElement(`h3`);i.textContent=`${e} · ${t.length}`,r.append(i);let a=this.expanded.has(e)||this.search.value.trim()!==``;for(let e of a?t:t.slice(0,Bl))r.append(this.row(e));if(!a&&t.length>Bl){let n=document.createElement(`button`);n.type=`button`,n.className=`atlas-more`,n.textContent=`Show ${t.length-Bl} more`,n.addEventListener(`click`,()=>{this.expanded.add(e),this.render()}),r.append(n)}return r}row(e){let t=document.createElement(`button`);t.type=`button`,t.className=e.hero?`atlas-row hero`:`atlas-row`;let n=document.createElement(`span`);n.className=`atlas-name`,n.textContent=e.name;let r=document.createElement(`span`);return r.className=`atlas-meta`,r.textContent=[zl[e.kind],Hl(e)].filter(Boolean).join(` · `),t.append(n,r),this.radiusM>0&&e.face!==void 0&&(t.title=it(e,this.radiusM)),t.addEventListener(`click`,()=>this.cb.onSelect(e)),t.addEventListener(`pointerenter`,()=>this.cb.onHover(e)),t.addEventListener(`pointerleave`,()=>this.cb.onHover(null)),t}};function Hl(e){let t=e.data,n=e=>e>=100?Math.round(e).toLocaleString(`en-US`):e.toFixed(e>=10?0:1);return t.heightM!==void 0&&(e.kind===`peak`||e.kind===`volcano`||e.kind===`range`||e.kind===`plateau`)?`${Math.round(t.heightM).toLocaleString(`en-US`)} m`:t.lengthKm===void 0?t.areaKm2===void 0?t.depthM===void 0?t.dropM===void 0?t.diameterKm===void 0?e.extentM>=1e3?`${n(e.extentM/1e3)} km`:``:`${n(t.diameterKm)} km across`:`${Math.round(t.dropM)} m drop`:`${Math.round(t.depthM)} m deep`:`${n(t.areaKm2)} km²`:`${n(t.lengthKm)} km long`}var Ul=.012,Wl=3,Gl=class{cam;el;rose;lastBearing=NaN;lastPitch=NaN;constructor(e,t){this.cam=t,this.el=document.createElement(`div`),this.el.className=`compass`,this.el.tabIndex=0,this.el.setAttribute(`role`,`button`),this.el.setAttribute(`aria-label`,`Compass: click for north up, drag to rotate`),this.el.title=`Click: north up · drag: rotate`,this.rose=document.createElement(`div`),this.rose.className=`compass-rose`,this.rose.innerHTML=`<svg viewBox="-16 -16 32 32" aria-hidden="true"><path class="compass-n" d="M0 -12 L4 0 L-4 0 Z"/><path class="compass-s" d="M0 12 L4 0 L-4 0 Z"/><text class="compass-label" x="0" y="-12.5" text-anchor="middle">N</text></svg>`,this.el.append(this.rose),e.append(this.el);let n=0,r=0,i=!1,a=!1;this.el.addEventListener(`pointerdown`,e=>{e.button===0&&(e.preventDefault(),e.stopPropagation(),i=!0,a=!1,n=r=e.clientX,this.el.setPointerCapture(e.pointerId))}),this.el.addEventListener(`pointermove`,e=>{i&&(Math.abs(e.clientX-n)>Wl&&(a=!0),a&&this.cam.rotateBy(-(e.clientX-r)*Ul,0),r=e.clientX)});let o=e=>{i&&(i=!1,this.el.hasPointerCapture(e.pointerId)&&this.el.releasePointerCapture(e.pointerId),!a&&e.type===`pointerup`&&this.cam.resetNorth())};this.el.addEventListener(`pointerup`,o),this.el.addEventListener(`pointercancel`,o),this.el.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),this.cam.resetNorth())}),this.update()}update(){let e=this.cam.bearing,t=this.cam.pitch;(e!==this.lastBearing||t!==this.lastPitch)&&(this.lastBearing=e,this.lastPitch=t,this.rose.style.transform=`rotateX(${t.toFixed(4)}rad) rotate(${(-e).toFixed(4)}rad)`)}},Kl=14,ql=3,Jl=(e,t,n)=>Math.min(n,Math.max(t,e)),Yl=e=>e.log===!0&&e.min>0&&e.max>e.min;function Xl(e){let t=String(e),n=t.indexOf(`e-`);if(n>=0)return Number(t.slice(n+2));let r=t.indexOf(`.`);return r<0?0:t.length-r-1}function Zl(e,t){let n=Jl(e,t.min,t.max);return t.step>0&&(n=t.min+Math.round((n-t.min)/t.step)*t.step),t.integer&&(n=Math.round(n)),n=Jl(n,t.min,t.max),Number(n.toFixed(Xl(t.step)))}function Ql(e,t){if(t.max<=t.min)return 0;let n=Jl(e,t.min,t.max);return Yl(t)?Math.log(n/t.min)/Math.log(t.max/t.min):(n-t.min)/(t.max-t.min)}function $l(e,t){let n=Jl(e,0,1);return Zl(Yl(t)?t.min*(t.max/t.min)**n:t.min+n*(t.max-t.min),t)}function eu(e,t,n,r){if(Yl(r)){let i=$l(Ql(e,r)+t*(n?.1:.01),r);return i===e?Zl(e+t*r.step,r):i}return Zl(e+t*r.step*(n?10:1),r)}var tu=class{el;opts;count;thumbs=[];fill;arrow;vals;listeners={input:new Set,change:new Set};drag=null;keyPending=null;constructor(e,t=[e.min,e.max]){this.opts=e,this.count=e.thumbs??2,this.vals=[Zl(t[0],e),Zl(this.count===1?t[0]:t[1],e)],this.el=document.createElement(`div`),this.el.className=`rs`,this.el.style.setProperty(`--rs-thumb`,`${Kl}px`),e.span&&(this.el.dataset.span=``),this.count===1&&(this.el.dataset.single=``);let n=document.createElement(`div`);n.className=`rs-track`,this.fill=document.createElement(`div`),this.fill.className=`rs-fill`,n.append(this.fill),this.el.append(n),this.arrow=e.span?document.createElement(`span`):null,this.arrow&&(this.arrow.className=`rs-arrow`,this.arrow.setAttribute(`aria-hidden`,`true`),this.el.append(this.arrow));for(let e=0;e<this.count;e++)this.thumbs.push(this.makeThumb(e));this.el.addEventListener(`pointerdown`,e=>this.onPointerDown(e)),this.el.addEventListener(`pointermove`,e=>this.onPointerMove(e)),this.el.addEventListener(`pointerup`,e=>this.onPointerUp(e)),this.el.addEventListener(`pointercancel`,()=>this.endDrag()),this.el.addEventListener(`lostpointercapture`,()=>this.endDrag()),this.render()}get values(){return this.vals}get dragging(){return this.drag!==null}setValues(e){let t=Zl(e[0],this.opts),n=this.count===1?t:Zl(e[1],this.opts);(t!==this.vals[0]||n!==this.vals[1])&&(this.vals=[t,n],this.render())}setThumbStates(e){this.thumbs.forEach((t,n)=>t.dataset.state=e[n]);let t=e.slice(0,this.count);this.el.dataset.fill=t.includes(`set`)?`set`:t.includes(`preset`)?`preset`:`auto`}on(e,t){return this.listeners[e].add(t),()=>this.listeners[e].delete(t)}makeThumb(e){let t=document.createElement(`div`);t.className=`rs-thumb`,t.dataset.thumb=String(e),t.dataset.state=`auto`,t.tabIndex=0,t.setAttribute(`role`,`slider`),t.setAttribute(`aria-orientation`,`horizontal`),t.setAttribute(`aria-valuemin`,String(this.opts.min)),t.setAttribute(`aria-valuemax`,String(this.opts.max));let n=this.opts.labels?.[e]??(this.count===1?`value`:this.opts.span?[`from`,`to`][e]:[`min`,`max`][e]);return t.setAttribute(`aria-label`,n??`value`),t.addEventListener(`keydown`,t=>this.onKeyDown(t,e)),t.addEventListener(`keyup`,()=>this.flushKey()),t.addEventListener(`blur`,()=>this.flushKey()),this.el.append(t),t}render(){let e=this.vals.map(e=>Ql(e,this.opts));this.thumbs.forEach((t,n)=>{t.style.setProperty(`--p`,String(e[n])),t.setAttribute(`aria-valuenow`,String(this.vals[n])),t.setAttribute(`aria-valuetext`,this.opts.format?this.opts.format(this.vals[n]):String(this.vals[n]))});let[t,n]=this.count===1?[0,e[0]]:[Math.min(e[0],e[1]),Math.max(e[0],e[1])];if(this.el.style.setProperty(`--a`,String(t)),this.el.style.setProperty(`--b`,String(n)),this.arrow){let t=Math.sign(e[1]-e[0]);this.arrow.textContent=t>0?`→`:t<0?`←`:``,this.el.dataset.dir=t<0?`rev`:`fwd`}}emit(e,t){let n={thumb:t,values:this.vals};for(let t of this.listeners[e])t(n)}setThumb(e,t){let n=[...this.vals];return n[e]=t,this.count===1?n[1]=t:this.opts.span||(e===0&&t>n[1]&&(n[1]=t),e===1&&t<n[0]&&(n[0]=t)),n[0]===this.vals[0]&&n[1]===this.vals[1]?!1:(this.vals=n,this.render(),this.raise(e),this.emit(`input`,e),!0)}raise(e){this.thumbs.forEach((t,n)=>t.classList.toggle(`rs-top`,n===e))}onKeyDown(e,t){let n=this.vals[t],r=e.shiftKey||e.key===`PageUp`||e.key===`PageDown`,i;switch(e.key){case`ArrowRight`:case`ArrowUp`:case`PageUp`:i=eu(n,1,r,this.opts);break;case`ArrowLeft`:case`ArrowDown`:case`PageDown`:i=eu(n,-1,r,this.opts);break;case`Home`:i=this.opts.min;break;case`End`:i=this.opts.max;break;default:return}e.preventDefault(),this.setThumb(t,i)&&(this.keyPending=t)}flushKey(){if(this.keyPending===null)return;let e=this.keyPending;this.keyPending=null,this.emit(`change`,e)}posFromX(e){let t=this.el.getBoundingClientRect(),n=t.width-Kl;return n>0?(e-t.left-Kl/2)/n:0}thumbPos(e){return Ql(this.vals[e],this.opts)}pickThumb(e){if(this.count===1)return 0;let t=this.el.getBoundingClientRect().width-Kl,n=t>0?Kl/2/t:0,r=Math.abs(e-this.thumbPos(0)),i=Math.abs(e-this.thumbPos(1));return Math.abs(this.thumbPos(0)-this.thumbPos(1))<=n&&Math.min(r,i)<=n?null:r<=i?0:1}thumbForDirection(e){let t=this.thumbPos(0),n=this.thumbPos(1);return t===n?+(e>0):+(e>0==n>t)}onPointerDown(e){if(e.button!==0||this.drag)return;let t=this.posFromX(e.clientX),n=e.target instanceof HTMLElement?e.target.closest(`.rs-thumb`):null,r=n!==null,i=this.pickThumb(t);i===null&&!r&&(i=this.thumbForDirection(t-this.thumbPos(0))),r&&i!==null&&(i=Number(n.dataset.thumb));let a=e.pointerType===`touch`;this.drag={pointerId:e.pointerId,thumb:i,startX:e.clientX,grab:r&&i!==null?t-this.thumbPos(i):0,onThumb:r,touch:a,moved:!1,changed:!1},this.el.setPointerCapture(e.pointerId),a||e.preventDefault(),i!==null&&this.thumbs[i].focus({preventScroll:!0}),!r&&!a&&i!==null&&this.dragTo(i,t)}onPointerMove(e){let t=this.drag;if(!t||e.pointerId!==t.pointerId)return;let n=e.clientX-t.startX;!t.moved&&Math.abs(n)<ql||(t.moved=!0,t.thumb===null&&(t.thumb=this.thumbForDirection(n),this.thumbs[t.thumb].focus({preventScroll:!0})),this.dragTo(t.thumb,this.posFromX(e.clientX)-t.grab))}onPointerUp(e){let t=this.drag;if(t&&e.pointerId===t.pointerId){if(!t.moved&&!t.onThumb&&t.touch){let n=this.posFromX(e.clientX);this.dragTo(t.thumb??this.thumbForDirection(n-this.thumbPos(0)),n)}this.endDrag()}}dragTo(e,t){this.drag&&(this.drag.thumb=e,this.setThumb(e,$l(t,this.opts))&&(this.drag.changed=!0))}endDrag(){let e=this.drag;e&&(this.drag=null,this.el.hasPointerCapture(e.pointerId)&&this.el.releasePointerCapture(e.pointerId),e.changed&&e.thumb!==null&&this.emit(`change`,e.thumb))}},nu=`pwg.configPanel.collapsed`,ru=[`advanced`],iu=.1,au={auto:`AUTO`,preset:`PRESET`,set:`SET`};function X(e,t=``,n=``){let r=document.createElement(e);return t&&(r.className=t),n&&(r.textContent=n),r}function ou(e,t){e.textContent!==t&&(e.textContent=t)}function su(e,t){e.title!==t&&(e.title=t)}function cu(e){if(Array.isArray(e))return e;let t=e??`auto`;return[t,t]}function lu(e){let[t,n]=cu(e);return{state:t===`set`||n===`set`?`set`:t===`preset`||n===`preset`?`preset`:`auto`,partial:t!==n}}function uu(e){return Array.isArray(e)?[e[0],e[1]]:e}function du(e){return Array.isArray(e)?`${e[0]},${e[1]}`:String(e)}function fu(){try{let e=localStorage.getItem(nu);if(e!==null){let t=JSON.parse(e);if(Array.isArray(t))return new Set(t.filter(e=>typeof e==`string`&&e in O))}}catch{}return new Set(ru)}function pu(e){try{localStorage.setItem(nu,JSON.stringify([...e]))}catch{}}function mu(e,t){return Array.isArray(e)?t>=Math.min(e[0],e[1])&&t<=Math.max(e[0],e[1]):typeof e!=`number`||Math.abs(t-e)<=iu*Math.max(Math.abs(e),1e-9)}function hu(e){return{min:e.min,max:e.max,step:e.step,log:e.log,integer:e.integer}}function gu(e,t){let n=new tu({...hu(e),thumbs:1,labels:[e.label,e.label],format:t=>ie(e.id,t)}),r=(n,r)=>t.setPin(e.id,n.values[0],r);return n.on(`input`,e=>r(e,!1)),n.on(`change`,e=>r(e,!0)),{el:n.el,inline:!1,update(e,t){n.setValues([e,e]);let r=cu(t)[0];n.setThumbStates([r,r])}}}function _u(e,t,n){let r=cu(e.resolved.sources[t]),i=e=>e===n.thumb||r[e]===`set`?n.values[e]:null;return[i(0),i(1)]}function vu(e,t){let n=e.kind===`span`?[`${e.label} from`,`${e.label} to`]:[`${e.label} min`,`${e.label} max`],r=new tu({...hu(e),span:e.kind===`span`,labels:n,format:t=>ie(e.id,t)}),i=(n,r)=>t.setPin(e.id,_u(t,e.id,n),r);return r.on(`input`,e=>i(e,!1)),r.on(`change`,e=>i(e,!0)),{el:r.el,inline:!1,update(e,t){r.setValues(e),r.setThumbStates(cu(t))}}}function yu(e,t){let n=X(`select`,`pp-select`);n.setAttribute(`aria-label`,e.label);for(let t of e.options){let e=X(`option`,``,t.label);e.value=t.value,n.append(e)}return n.addEventListener(`change`,()=>t.setPin(e.id,n.value,!0)),{el:n,inline:!0,update(e,t){n.value!==e&&(n.value=e),n.dataset.state=cu(t)[0]}}}function bu(e,t){let n=X(`input`,`pp-check`);return n.type=`checkbox`,n.setAttribute(`aria-label`,e.label),n.addEventListener(`change`,()=>t.setPin(e.id,n.checked,!0)),{el:n,inline:!0,update(e,t){n.checked=e===!0,n.dataset.state=cu(t)[0]}}}function xu(e,t){if(e.readonly)return null;if(A(e))return vu(e,t);switch(e.kind){case`number`:return gu(e,t);case`enum`:return yu(e,t);case`toggle`:return bu(e,t)}}var Su=class{el;def;host;control;labelEl=X(`span`,`pp-label`);valueEl=X(`span`,`pp-value`);warnEl=X(`span`,`pp-warn`,`⚠`);chipEl=X(`button`,`pp-chip`);resetEl=X(`button`,`pp-reset`,`↺`);drewEl=X(`span`,`pp-drew`);outcomeEl=X(`span`,`pp-outcome`);searchText;lastKey=null;shapeOk=!0;constructor(e,t){this.def=e,this.host=t,this.control=xu(e,t),this.searchText=`${e.label} ${e.id} ${e.help}`.toLowerCase(),this.el=X(`div`,`pp-row`),this.el.dataset.id=e.id,this.el.dataset.kind=e.kind,e.readonly&&(this.el.dataset.readonly=``),this.el.addEventListener(`animationend`,()=>this.el.classList.remove(`pp-flash`)),this.build()}build(){let{def:e}=this;this.labelEl.textContent=e.label,e.target&&this.labelEl.append(X(`span`,`pp-target`,` 🎯`));let t=X(`div`,`pp-row-head`);if(t.append(this.labelEl),this.control?.inline?t.append(this.control.el):t.append(this.valueEl),this.warnEl.hidden=!0,t.append(this.warnEl),e.readonly||(this.chipEl.type=`button`,this.chipEl.addEventListener(`click`,()=>this.onChipClick()),this.resetEl.type=`button`,this.resetEl.setAttribute(`aria-label`,`Reset ${e.label}`),this.resetEl.addEventListener(`click`,()=>this.host.setPin(e.id,void 0,!0)),t.append(this.chipEl,this.resetEl)),this.el.append(t),this.control&&!this.control.inline){let e=X(`div`,`pp-row-ctrl`);e.append(this.control.el),this.el.append(e)}if(e.kind===`draw`||e.target){let e=X(`div`,`pp-row-note`);e.append(this.drewEl,this.outcomeEl),this.el.append(e)}}matches(e){return e===``||this.searchText.includes(e)}render(e){let{def:t}=this,n=e.resolved.values[t.id],r=e.resolved.sources[t.id],{state:i,partial:a}=lu(r);this.el.dataset.state=i,this.control?.update(n,r),ou(this.valueEl,n===void 0?``:ie(t.id,n)),this.renderChip(i,a,r),this.resetEl.hidden=!e.pinned,this.renderWarnings(e.warnings),this.renderNotes(e);let o=this.tooltip(e.resolved,i);su(this.labelEl,o),su(this.valueEl,o);let s=du(n),c=this.lastKey!==null&&s!==this.lastKey;return this.lastKey=s,c}flash(){this.el.classList.remove(`pp-flash`),this.el.offsetWidth,this.el.classList.add(`pp-flash`)}renderChip(e,t,n){if(this.def.readonly)return;ou(this.chipEl,au[e]),this.chipEl.dataset.state=e,this.chipEl.classList.toggle(`pp-partial`,t);let r=A(this.def)?cu(n).map((e,t)=>`${(this.def.kind===`span`?[`from`,`to`]:[`min`,`max`])[t]}: ${au[e]}`).join(` · `):au[e],i=e===`auto`?`Click to pin the current value.`:e===`set`?`Click to return to AUTO.`:`Set by the archetype. Click to use AUTO instead; ↺ restores the preset.`;su(this.chipEl,`${r}\n${i}`)}renderWarnings(e){this.warnEl.hidden=e.length===0,su(this.warnEl,e.join(`
`))}renderNotes(e){let t=e.resolved.drawn[this.def.id];if(ou(this.drewEl,this.def.kind===`draw`&&t!==void 0?`drew ${P(t)}`:``),e.outcome===void 0||!this.def.target){ou(this.outcomeEl,``);return}let n=mu(e.resolved.values[this.def.id],e.outcome);ou(this.outcomeEl,`→ got ${P(e.outcome)} ${n?`✓`:`⚠`}`),this.outcomeEl.dataset.ok=String(n),this.outcomeEl.classList.toggle(`pp-stale`,e.outcomeStale),su(this.outcomeEl,e.outcomeStale?`From the last generated world; settings have changed since.`:`Realised in the generated world.`)}tooltip(e,t){let{def:n}=this,r=[n.help],i=e.provenance[n.id];i&&r.push(`AUTO ${i}`);let a=e.autos[n.id];return t!==`auto`&&a!==void 0&&r.push(`${au[t]}; auto would be ${ie(n.id,a)}`),r.push(`id: ${n.id}`),r.join(`
`)}onChipClick(){let{state:e}=lu(this.host.resolved.sources[this.def.id]);if(e===`auto`){let e=this.host.resolved.values[this.def.id];e!==void 0&&this.host.setPin(this.def.id,uu(e),!0)}else e===`set`?this.host.setPin(this.def.id,void 0,!0):this.host.setPin(this.def.id,j,!0)}},Cu=class{id;el;rows=[];head=X(`button`,`pp-section-head`);countEl=X(`span`,`pp-section-count`);body=X(`div`,`pp-section-body`);constructor(e,t,n){this.id=e,this.el=X(`section`,`pp-section`),this.el.dataset.section=e,this.head.type=`button`,this.head.append(X(`span`,`pp-caret`,`▸`),X(`span`,`pp-section-title`,O[e]),this.countEl),this.head.addEventListener(`click`,()=>{let t=!this.collapsed;this.setCollapsed(t),n(e,t)}),this.body.id=`pp-section-${e}`,this.head.setAttribute(`aria-controls`,this.body.id),this.el.append(this.head,this.body),this.setCollapsed(t)}get collapsed(){return this.el.classList.contains(`pp-collapsed`)}setCollapsed(e){this.el.classList.toggle(`pp-collapsed`,e),this.head.setAttribute(`aria-expanded`,String(!e))}add(e){this.rows.push(e),this.body.append(e.el)}setPinnedCount(e){ou(this.countEl,e>0?`${e} set`:``)}filter(e){let t=!1;for(let n of this.rows){let r=n.shapeOk&&n.matches(e);n.el.hidden=!r,t||=r}return this.el.hidden=!t,t}},wu=class{specValue;resolvedValue;outcomes={};outcomesStale=!1;cb;rootEl=X(`div`,`pp-root`);archetypeEl=X(`select`,`pp-select pp-archetype`);shapeEls=new Map;shapeShown=null;resetAllEl=X(`button`,`pp-btn`,`Reset all`);pinAllEl=X(`button`,`pp-btn`,`Pin all`);searchEl=X(`input`,`pp-search`);warningsEl=X(`ul`,`pp-warnings`);warningsKey=``;sections=[];rows=new Map;constructor(e,t,n){this.specValue=t,this.resolvedValue=ae(t),this.cb=n,this.rootEl.append(this.buildHeader(),this.buildBody()),e.append(this.rootEl),this.render(null)}setSpec(e){this.specValue=e,this.resolvedValue=ae(e),this.outcomesStale=!0,this.render(null)}setOutcomes(e){this.outcomes=e,this.outcomesStale=!1,this.render(null)}buildHeader(){let e=X(`div`,`pp-header`);this.archetypeEl.setAttribute(`aria-label`,`Archetype`);for(let e of n){let t=X(`option`,``,e.label);t.value=e.id,t.title=e.blurb,this.archetypeEl.append(t)}this.archetypeEl.addEventListener(`change`,()=>this.edit({...this.specValue,archetype:this.archetypeEl.value},!0,null)),this.resetAllEl.type=`button`,this.resetAllEl.title=`Clear all your pins (archetype presets stay).`,this.resetAllEl.addEventListener(`click`,()=>{let e=this.specValue.pins.worldShape;this.edit({...this.specValue,pins:e===void 0?{}:{worldShape:e}},!0,null)}),this.pinAllEl.type=`button`,this.pinAllEl.title=`Pin every value as it is now, freezing the world against formula changes.`,this.pinAllEl.addEventListener(`click`,()=>this.edit(ce(this.specValue),!0,null)),this.searchEl.type=`search`,this.searchEl.placeholder=`Search parameters…`,this.searchEl.setAttribute(`aria-label`,`Search parameters`),this.searchEl.addEventListener(`input`,()=>this.applySearch());let t=X(`div`,`pp-shape`);t.setAttribute(`role`,`radiogroup`),t.setAttribute(`aria-label`,`World shape`);for(let[e,n,r]of[[`flat`,`Flat`,`A square map with edges`],[`sphere`,`Sphere`,`A whole planet: terrain and climate for now, shown as a 2D map`]]){let i=X(`button`,`pp-shape-btn`,n);i.type=`button`,i.title=r,i.setAttribute(`role`,`radio`),i.addEventListener(`click`,()=>this.host().setPin(`worldShape`,e===`flat`?void 0:e,!0)),this.shapeEls.set(e,i),t.append(i)}let r=X(`div`,`pp-head-line`);return r.append(this.archetypeEl,this.resetAllEl,this.pinAllEl),e.append(t,r,this.searchEl,this.warningsEl),e}buildBody(){let e=X(`div`,`pp-body`),t=fu(),n=(e,n)=>{n?t.add(e):t.delete(e),pu(t)},r=this.host();for(let i of Object.keys(O)){let a=new Cu(i,t.has(i),n);for(let e of E){if(e.section!==i||e.id===`worldShape`)continue;let t=new Su(e,r);this.rows.set(e.id,t),a.add(t)}a.rows.length!==0&&(this.sections.push(a),e.append(a.el))}return e}host(){let e=this;return{get spec(){return e.specValue},get resolved(){return e.resolvedValue},setPin(t,n,r){e.edit(se(e.specValue,t,n),r,t)}}}edit(e,t,n){this.specValue=e,this.resolvedValue=ae(e),this.outcomesStale=!0,this.render(n??``),this.cb.onSpecChange(e,t)}render(e){let t=this.resolvedValue;this.renderHeader(),this.renderShape(t.values.worldShape);let n=this.renderWarnings(t);for(let r of this.rows.values()){let i=r.def.id;r.render({resolved:t,pinned:this.specValue.pins[i]!==void 0,warnings:n.get(i)??[],outcome:this.outcomes[i],outcomeStale:this.outcomesStale})&&e!==null&&i!==e&&r.flash()}for(let e of this.sections)e.setPinnedCount(e.rows.filter(e=>this.specValue.pins[e.def.id]!==void 0).length)}renderHeader(){let e=this.specValue,t=Object.keys(e.pins).some(e=>e!==`worldShape`),n=i(e.archetype);this.archetypeEl.value!==n.id&&(this.archetypeEl.value=n.id);for(let e of this.archetypeEl.options){let r=i(e.value);ou(e,t&&r.id===n.id?`Custom (based on ${r.label})`:r.label)}su(this.archetypeEl,n.blurb),this.resetAllEl.disabled=!t}renderShape(e){for(let[t,n]of this.shapeEls)n.classList.toggle(`pp-on`,t===e),n.setAttribute(`aria-checked`,String(t===e));if(e!==this.shapeShown){this.shapeShown=e;for(let t of this.rows.values())t.shapeOk=T(t.def,e);this.applySearch()}}renderWarnings(e){let t=new Map;for(let n of e.warnings)for(let e of n.ids)t.set(e,[...t.get(e)??[],n.message]);let n=e.warnings.map(e=>`${e.ids.join(`,`)}:${e.message}`).join(`
`);return n!==this.warningsKey&&(this.warningsKey=n,this.warningsEl.replaceChildren(...e.warnings.map(e=>this.warningItem(e.ids,e.message)))),this.warningsEl.hidden=e.warnings.length===0,t}warningItem(e,t){let n=X(`li`,`pp-warning`),r=X(`button`,`pp-warning-btn`,`⚠ ${t}`);return r.type=`button`,r.title=`Show the parameters involved`,r.addEventListener(`click`,()=>this.reveal(e)),n.append(r),n}reveal(e){let t=e.map(e=>this.rows.get(e)).filter(e=>e!==void 0);for(let e of t){let t=this.sections.find(t=>t.rows.includes(e));t?.collapsed&&t.setCollapsed(!1),e.flash()}t[0]?.el.scrollIntoView({block:`nearest`,behavior:`smooth`})}applySearch(){let e=this.searchEl.value.trim().toLowerCase();this.rootEl.classList.toggle(`pp-searching`,e!==``);for(let t of this.sections)t.filter(e)}},Tu=class{anchor;el;status;qualityNote;busy=!1;constructor(e,t,n){this.anchor=t,this.el=document.createElement(`div`),this.el.className=`export-menu hidden`,this.el.setAttribute(`role`,`menu`);let r=document.createElement(`div`);r.className=`export-title`,r.textContent=`Export`,this.el.append(r);for(let e of n.actions){let t=document.createElement(`button`);t.type=`button`,t.className=`export-item`,t.dataset.id=e.id,t.setAttribute(`role`,`menuitem`),t.innerHTML=`<span class="export-label"></span><span class="export-hint"></span>`,t.querySelector(`.export-label`).textContent=e.label,t.querySelector(`.export-hint`).textContent=e.hint,t.addEventListener(`click`,()=>void this.runAction(e,t)),this.el.append(t)}this.status=document.createElement(`div`),this.status.className=`export-status`,this.status.setAttribute(`aria-live`,`polite`);let i=document.createElement(`label`);i.className=`export-quality`,i.textContent=`Render quality `;let a=document.createElement(`select`);for(let[e,t]of n.quality.options){let n=document.createElement(`option`);n.value=e,n.textContent=t,a.append(n)}a.value=n.quality.value,this.qualityNote=document.createElement(`div`),this.qualityNote.className=`export-hint`,this.qualityNote.textContent=n.quality.note(),a.addEventListener(`change`,()=>{n.quality.onChange(a.value),this.qualityNote.textContent=n.quality.note()}),i.append(a),this.el.append(this.status,i,this.qualityNote),e.append(this.el),t.addEventListener(`click`,()=>this.toggle()),document.addEventListener(`pointerdown`,e=>{this.open&&!this.el.contains(e.target)&&!t.contains(e.target)&&this.toggle(!1)}),window.addEventListener(`keydown`,e=>{e.key===`Escape`&&this.open&&this.toggle(!1)})}get open(){return!this.el.classList.contains(`hidden`)}toggle(e=!this.open){this.el.classList.toggle(`hidden`,!e),this.anchor.setAttribute(`aria-expanded`,String(e)),e&&(this.status.textContent=``)}async runAction(e,t){if(!this.busy){this.busy=!0,t.disabled=!0,this.status.textContent=`${e.label}…`;try{let t=await e.run();this.status.textContent=t??`${e.label}: done`}catch(t){console.error(t),this.status.textContent=`${e.label} failed: ${t instanceof Error?t.message:String(t)}`}finally{this.busy=!1,t.disabled=!1}}}},Eu=`pwg.view`,Du=.4,Ou=class{onChange;el;s;time;timeOut;season;seasonOut;sunOn;seasonsOn;clouds;play;last=0;constructor(e,t){this.onChange=t,this.s={...ic,...ku(),animate:!1},this.el=document.createElement(`div`),this.el.className=`view-ctl`,this.el.innerHTML=`<label class="exag" title="Time of day (double-click: default afternoon)"><input type="checkbox" class="view-on" title="Time of day on/off (off: fixed map light)" />time <input type="range" min="0" max="24" step="0.05" /><span class="view-out"></span><button type="button" class="view-play" title="Animate the time of day (T)">▶</button></label><label class="exag" title="Season (double-click: default summer)"><input type="checkbox" class="view-on" title="Seasons on/off (off: default season on flat maps, annual mean on globes)" />season <input type="range" min="0" max="1" step="0.005" /><span class="view-out"></span></label><label class="exag view-check" title="Clouds and cloud shadows"><input type="checkbox" /> clouds</label>`;let n=this.el.querySelectorAll(`input`),r=this.el.querySelectorAll(`.view-out`);this.sunOn=n[0],this.time=n[1],this.seasonsOn=n[2],this.season=n[3],this.clouds=n[4],this.timeOut=r[0],this.seasonOut=r[1],this.play=this.el.querySelector(`.view-play`),e.append(this.el),this.time.addEventListener(`input`,()=>this.set({time:Number(this.time.value)})),this.season.addEventListener(`input`,()=>this.set({season:Number(this.season.value)})),this.clouds.addEventListener(`change`,()=>this.set({clouds:this.clouds.checked})),this.sunOn.addEventListener(`change`,()=>this.set(this.sunOn.checked?{sun:!0}:{sun:!1,animate:!1})),this.seasonsOn.addEventListener(`change`,()=>this.set({seasons:this.seasonsOn.checked})),this.time.addEventListener(`dblclick`,()=>this.set({time:ic.time})),this.season.addEventListener(`dblclick`,()=>this.set({season:ic.season})),this.play.addEventListener(`click`,e=>{e.preventDefault(),this.toggleAnimate()}),window.addEventListener(`keydown`,e=>{ht(e.target)||e.metaKey||e.ctrlKey||e.code!==`KeyT`||!this.s.sun||this.toggleAnimate()}),this.sync(),this.onChange(this.s)}toggleAnimate(){this.set({animate:!this.s.animate}),this.s.animate&&(this.last=performance.now(),requestAnimationFrame(this.tick))}tick=e=>{if(!this.s.animate)return;let t=Math.min(.5,Math.max(0,(e-this.last)/1e3));this.last=e,this.set({time:(this.s.time+t*Du)%24},!1),requestAnimationFrame(this.tick)};set(e,t=!0){Object.assign(this.s,e),this.sync(),this.onChange(this.s),t&&Au(this.s)}sync(){this.time.value=String(this.s.time),this.timeOut.textContent=mc(this.s.time),this.season.value=String(this.s.season),this.seasonOut.textContent=gc(this.s.season),this.clouds.checked=this.s.clouds,this.sunOn.checked=this.s.sun,this.seasonsOn.checked=this.s.seasons,this.time.disabled=this.play.disabled=!this.s.sun,this.season.disabled=!this.s.seasons,this.timeOut.classList.toggle(`off`,!this.s.sun),this.seasonOut.classList.toggle(`off`,!this.s.seasons),this.play.textContent=this.s.animate?`❚❚`:`▶`,this.play.classList.toggle(`on`,this.s.animate)}};function ku(){try{let e=JSON.parse(localStorage.getItem(Eu)??`{}`),t={};return typeof e.time==`number`&&e.time>=0&&e.time<=24&&(t.time=e.time),typeof e.season==`number`&&e.season>=0&&e.season<=1&&(t.season=e.season),typeof e.clouds==`boolean`&&(t.clouds=e.clouds),typeof e.sun==`boolean`&&(t.sun=e.sun),typeof e.seasons==`boolean`&&(t.seasons=e.seasons),t}catch{return{}}}function Au(e){try{localStorage.setItem(Eu,JSON.stringify({time:e.time,season:e.season,sun:e.sun,seasons:e.seasons,clouds:e.clouds}))}catch{}}var ju=[[`plates`,`Plates`],[`base`,`Base elevation`],[`stamps`,`Volcanoes & craters`],[`lem`,`Erosion`],[`refine`,`Refine`],[`climate`,`Climate`],[`glacial`,`Glaciers & fjords`],[`landforms`,`Landforms`],[`hydro`,`Rivers & lakes`],[`biome`,`Biomes`],[`registry`,`Landmarks & names`]],Mu={plates:60,base:300,stamps:40,lem:2300,refine:2600,climate:230,glacial:220,landforms:310,hydro:570,biome:110,registry:220},Nu=class{bar;status;segs=new Map;labels=new Map(ju);state=new Map;measured={preview:{},build:{}};mode=`build`;steps=ju;hideTimer=0;constructor(e,t){this.status=e,this.status.classList.add(`gen-status`),this.bar=document.createElement(`div`),this.bar.className=`gen-bar`,this.bar.setAttribute(`role`,`progressbar`),this.bar.setAttribute(`aria-label`,`World generation progress`),this.bar.setAttribute(`aria-valuemin`,`0`);for(let[e]of ju){let t=document.createElement(`div`);t.className=`gen-seg`,t.append(document.createElement(`i`)),this.bar.append(t),this.segs.set(e,t)}this.bar.setAttribute(`aria-valuemax`,String(ju.length)),t.append(this.bar)}start(e,t=`flat`){this.mode=e,this.steps=t===`sphere`?ju.filter(([e])=>k.includes(e)):ju;for(let[e,t]of this.segs)t.style.display=this.steps.some(([t])=>t===e)?``:`none`;this.bar.setAttribute(`aria-valuemax`,String(this.steps.length)),clearTimeout(this.hideTimer),this.bar.classList.remove(`finished`,`failed`),this.status.classList.remove(`finished`,`failed`);for(let[e]of this.steps)this.state.set(e,`pending`);this.layout(),this.render()}stageStart(e,t){this.labels.set(e,t),this.state.set(e,`running`),this.render()}stageDone(e,t,n,r,i){this.labels.set(e,t),this.state.set(e,r?`cached`:`done`),r||(this.measured[this.mode][e]=Math.max(1,n));let a=this.segs.get(e);a&&(a.title=i?`${t}\n${i}`:t),this.render()}finish(){for(let[e]of this.steps)this.state.get(e)!==`cached`&&this.state.set(e,`done`);this.render(),this.bar.classList.add(`finished`),this.status.classList.add(`finished`),this.hideTimer=window.setTimeout(()=>this.status.classList.add(`faded`),2500)}fail(){this.bar.classList.add(`failed`),this.status.classList.add(`failed`),this.status.textContent=`Generation failed (see console)`}layout(){let e=this.measured[this.mode],t=this.mode===`preview`?.25:1;for(let[n]of this.steps){let r=e[n]??(Mu[n]??100)*t,i=this.segs.get(n);i.style.flexGrow=String(Math.max(r,40)),i.style.setProperty(`--expected`,`${Math.round(r)}ms`)}}render(){let e=0,t=null;for(let[n]of this.steps){let r=this.state.get(n)??`pending`;this.segs.get(n).className=`gen-seg ${r}`,(r===`done`||r===`cached`)&&e++,r===`running`&&(t=n)}this.bar.setAttribute(`aria-valuenow`,String(e)),this.status.classList.remove(`faded`);let n=this.steps.length,r=this.mode===`preview`?`Preview`:`Building`;e===n?this.status.textContent=this.mode===`preview`?`Preview ready`:`World ready`:t?this.status.textContent=`${r} · ${this.labels.get(t)} · ${e+1} of ${n}`:this.status.textContent=`${r} · ${e} of ${n}`}},Pu=900,Fu=`pwg.layer`,Iu=`pwg.mode`,Lu=`pwg.palette`,Ru=`pwg.quality`,zu=`pwg.sphereProjection`,Z=e=>document.getElementById(e),Bu=Z(`view`),Vu=Z(`seed`),Hu=new Nu(Z(`progress`),Z(`topbar`)),Uu=Z(`layer-select`),Wu=Z(`legend`),Gu=Z(`inspect`),Ku=ue(location.search,rf()),Q=new Map,qu=af(Fu)??`elevation`,Ju=-1,Yu=0,Xu=null,Zu=[],Qu=null,$u={},$=new Nl(Bu),ed=new At(Bu,$.cam),td=new Qt(Z(`layers`),$.cam),nd=new Wt(Z(`layers`),$.globeCam),rd=new Gl(Z(`compass-host`),$.cam);Z(`legend`).before(new Ou(Z(`layers`),e=>Object.assign($.view,e)).el);var id=new Nt,ad=new cn(Bu),od=new pt(Bu,id,()=>({w:Jd(),h:Yd()}));Object.assign(window,{__pwg:{world:$,orbit:ed,layers:()=>Q}});var sd=af(Iu)===`2d`?`2d`:`3d`,cd=null,ld=null,ud,dd=null,fd=af(zu)===`net`?`net`:`equirect`,pd=null,md={elev:null,water:null,temp:null,biome:null,drape:void 0},hd=gn($.gl),gd=hn(new URLSearchParams(location.search).get(`quality`))??hn(af(Ru))??`auto`,_d=()=>{$.setQuality(pn(gd,hd)),document.body.dataset.quality=$.quality.tier,vd.wake()},vd=new Pt($.quality.idleFps);_d();var yd=document.createElement(`div`);yd.className=`view-notice hidden`,yd.setAttribute(`role`,`status`),document.body.append(yd);var bd=0;function xd(e){yd.textContent=e,yd.classList.remove(`hidden`),clearTimeout(bd),bd=window.setTimeout(()=>yd.classList.add(`hidden`),4500)}var Sd=document.createElement(`button`);Sd.type=`button`,Sd.className=`projection-toggle`,Sd.hidden=!0,Sd.title=`Show the planet as an equirectangular map or as the six cube faces (P)`,Sd.addEventListener(`click`,()=>Cd()),Wu.after(Sd);function Cd(){fd=fd===`net`?`equirect`:`net`,of(zu,fd),Hd()}var wd=document.createElement(`div`);wd.className=`gl-lost hidden`,wd.setAttribute(`role`,`status`),document.body.append(wd);var Td=0;$.onContextChange=e=>{if(wd.classList.toggle(`hidden`,!e),clearTimeout(Td),e){wd.textContent=`Graphics context lost — restoring…`,Td=window.setTimeout(()=>{wd.innerHTML=`Graphics context lost. <button type="button">Reload</button>`,wd.querySelector(`button`).addEventListener(`click`,()=>location.reload())},6e3);return}ad=new cn(Bu);let t=Q.get(Vd());t&&ad.setLayer(t),vd.wake()},new Tu(document.body,Z(`export-toggle`),{actions:Re({world:$,spec:()=>Ku,mode:()=>sd,layer:e=>{let t=Q.get(e);return t?.faces===6?It(t,`equirect`):t},shownLayer:()=>pd??Q.get(Vd()),landmarks:()=>Zu,traits:()=>Qu}),quality:{value:gd,options:[[`auto`,`Auto`],[`high`,`High`],[`medium`,`Medium`],[`low`,`Low (mobile)`]],onChange(e){gd=hn(e)??`auto`,of(Ru,gd),_d()},note:()=>{let e=$.quality;return`${e.tier}: ${e.msaa?`${e.msaa}× MSAA`:`no MSAA`}, ≤ ${e.maxPixelRatio}× pixels, ${e.maxDetail}² detail (next build)`}}}),new ResizeObserver(()=>{document.documentElement.style.setProperty(`--topbar-h`,`${Math.ceil(Z(`topbar`).getBoundingClientRect().bottom)+8}px`)}).observe(Z(`topbar`));var Ed=Z(`layers`),Dd=e=>{Ed.classList.toggle(`collapsed`,e),Z(`layers-toggle`).setAttribute(`aria-expanded`,String(!e))};Dd(window.matchMedia(`(max-width: 760px)`).matches),Z(`layers-toggle`).addEventListener(`click`,()=>Dd(!Ed.classList.contains(`collapsed`)));var Od=new wu(Z(`panel`),Ku,{onSpecChange(e,t){Ku=e,nf(),t&&Fd()}});function kd(e){$.highlightLandmark(e.id);let t=$.globeHf?.radius,n=$.sphere&&t?nt(e,t):null;n?$.globeCam.flyToDir(n,tt(e,$.globeCam.fovY)):e.face===void 0&&$.cam.flyTo(e.x,($.hf?.size??1024e3)-e.y,tt(e,$.cam.fovY))}var Ad=new Vl(document.body,{onSelect(e){kd(e)},onHover(e){$.highlightLandmark(e?e.id:null)}});ed.onTap=(e,t)=>{Wd(e,t);let n=$.labels.hitTest(e,t);n?kd(n):$.highlightLandmark(null)},Bu.addEventListener(`pointermove`,e=>{sd===`3d`&&(Bu.style.cursor=$.labels.hitTest(e.offsetX,e.offsetY)?`pointer`:``)});var jd=new Ge(zd);Vu.value=String(Ku.seed),Vu.addEventListener(`change`,()=>{let e=Number(Vu.value.trim());Number.isFinite(e)?tf(Math.floor(Math.abs(e))>>>0):Vu.value=String(Ku.seed)}),Z(`dice`).addEventListener(`click`,()=>tf(rf())),Z(`build`).addEventListener(`click`,()=>Id(`build`)),Z(`panel-toggle`).addEventListener(`click`,()=>Z(`panel`).classList.toggle(`open`)),Z(`mode`).addEventListener(`click`,()=>ef(sd===`3d`?`2d`:`3d`)),Z(`atlas-toggle`).addEventListener(`click`,()=>Ad.toggle());var Md=Z(`palette`);Md.value=af(Lu)??`satellite`;var Nd=()=>{let e=Md.value;$.setPalette(e===`stylised`?`stylised`:e===`hypsometric`?`hypsometric`:`satellite`),of(Lu,e)};Md.addEventListener(`change`,Nd),Nd();var Pd=Z(`exag`);Pd.addEventListener(`input`,()=>{$.setExaggeration(Number(Pd.value)),Z(`exag-value`).textContent=Pd.value}),Uu.addEventListener(`change`,()=>{qu=Uu.value,of(Fu,qu),Hd()}),window.addEventListener(`keydown`,e=>{ht(e.target)||e.metaKey||e.ctrlKey||(e.code===`KeyB`&&Id(`build`),e.code===`KeyV`&&ef(sd===`3d`?`2d`:`3d`),e.code===`KeyP`&&pd&&Cd(),e.code===`KeyA`&&Ad.toggle(),e.code===`Home`&&sd===`2d`&&qd())}),Bu.addEventListener(`pointermove`,e=>Wd(e.offsetX,e.offsetY)),Bu.addEventListener(`pointerleave`,()=>Gu.textContent=``),Bu.addEventListener(`dblclick`,()=>sd===`2d`?qd():void 0),ef(sd),nf(),Id(`build`),requestAnimationFrame($d);function Fd(){Id(`preview`),clearTimeout(Yu),Yu=window.setTimeout(()=>Id(`build`),Pu)}function Id(e){e===`build`&&clearTimeout(Yu);let t=ae(Ku),n=t.values.worldShape;n!==dd&&(dd!==null&&Ld(),dd=n),Hu.start(e,n),$u={},jd.generate(t,e)}function Ld(){Q.clear(),Uu.replaceChildren(),Xu=null,Zu=[],Qu=null,$.setRivers(null),$.setLandmarks([]),Ad.set([],null),pd=null,$.clearGlobe(),md={elev:null,water:null,temp:null,biome:null,drape:void 0},cd=null,ld=null,ud=void 0,Rd()}function Rd(){ed.cam=$.activeCam,rd.cam=$.activeCam,td.el.hidden=$.sphere,nd.el.hidden=!$.sphere}function zd(e){switch(e.type){case`stage-start`:Hu.stageStart(e.stage,e.label);break;case`stage-done`:{let t=Object.entries(e.stats).map(([e,t])=>`${e}: ${P(t)}`).join(`
`);Hu.stageDone(e.stage,e.label,e.ms,e.cached,`${e.cached?`cached`:`${Math.round(e.ms)} ms`}\n${t}`);for(let t of e.layers)Q.set(t.id,t);e.vectors?.rivers&&(Xu=e.vectors.rivers,$.setRivers(Xu)),e.vectors?.landmarks&&(Zu=e.vectors.landmarks,Qu=e.vectors.traits??null,$.setLandmarks(Zu),Ad.set(Zu,e.vectors.traits??null,$.globeHf?.radius)),$u={...$u,...e.outcomes},Od.setOutcomes($u),Bd(),Hd();break}case`error`:console.error(e.message),Hu.fail();break;case`done`:Hu.finish()}}function Bd(){let e=[...Q.keys()];if(Uu.options.length===e.length)return;let t=(e,t)=>{let n=document.createElement(`option`);return n.value=e,n.textContent=t,n},n=document.createElement(`optgroup`);n.label=`Data layers`,n.append(...e.filter(e=>e!==`elevation`).map(e=>t(e,`${Q.get(e).label}  (${Q.get(e).stage})`))),Uu.replaceChildren(...Q.has(`elevation`)?[t(`elevation`,`World (final, realistic)`)]:[],n),Uu.value=Vd()}function Vd(){return Q.has(qu)?qu:[...Q.keys()].at(-1)??qu}function Hd(){Uu.value=Vd();let e=Q.get(Vd());if(!e)return;if(e.faces===6){Ud(e);return}pd=null,Sd.hidden=!0,ad.setLayer(e),vd.wake();let t=Q.get(`elevation`),n=Q.get(`waterLevel`),r=n&&n.stage===t?.stage?n:null;if(t&&(t!==cd?.elev||r!==cd.water)){cd={elev:t,water:r};let e=Q.get(`waterClass`);$.setTerrain(t,r,e&&e.stage===t.stage?e:null),$.setRivers(Xu),td.setTerrain(t,r);let n=e=>{let n=Q.get(e);return n&&n.w===t.w?n:null};$.setLandformMasks({reef:n(`reef`),erg:n(`erg`),crater:n(`crater`),cliff:n(`cliff`),n:t.w});let i=Q.get(`waterClass`),a=Q.get(`discharge`);$.setCreekWorld(Xu&&i&&a&&i.stage===t.stage&&a.stage===t.stage?{elevation:t,waterClass:i,discharge:a,rivers:Xu,seed:Ku.seed}:null)}let i=Q.get(`biome`);if(i&&i!==ld&&t&&i.w===t.w){let e=Q.get(`temperature`),n=Q.get(`aridity`),r=Q.get(`canopy`),a=Q.get(`snow`);if(e&&n&&r&&a){ld=i,$.setSurface({temperature:e,aridity:n,summerRain:Q.get(`summerRain`)??null,canopy:r,snow:a,biome:i,tempRange:Q.get(`tempRange`)??null,precip:Q.get(`precip`)??null});let o=Q.get(`waterLevel`),s=Q.get(`waterClass`),c=Q.get(`discharge`);o&&s&&c&&t.stage===`hydro`&&$.buildDetail({elevation:t,waterLevel:o,waterClass:s,discharge:c,biome:i,rivers:Xu,seed:Ku.seed,size:ae(Ku).values.detailGrid===`2048`||$.quality.maxDetail===2048?2048:4096})}}let a=e.id===`elevation`?null:e;a!==ud&&(ud=a,$.setDrape(a)),Rd(),Ju!==e.worldKm&&(Ju=e.worldKm,qd());let o=(e.worldKm/e.w).toFixed(2);Wu.textContent=e.kind===`categorical`?`${e.w}² cells · ${o} km/cell · ${e.max+1} classes`:`${e.w}² cells · ${o} km/cell · ${P(e.min)} … ${P(e.max)} ${e.unit}`}function Ud(e){let t=It(e,fd);pd=t,ad.setLayer(t),vd.wake();let n=Q.get(`elevation`)??Q.get(`lemElevation`)??Q.get(`h0`),r=Q.get(`waterLevel`),i=r&&r.faces===6&&r.stage===n?.stage?r:null;if(n&&n.faces===6&&(n!==md.elev||i!==md.water)){!md.elev&&sd===`3d`&&xd(`Globe view: no clouds on spheres yet`),md.elev=n,md.water=i;let e=Q.get(`waterClass`);$.setGlobe(n,i,e&&e.stage===n.stage?e:null),nd.setTerrain(n)}if(n&&n.faces===6){let e=e=>{let t=Q.get(e);return t&&t.faces===6&&t.w===n.w?t:null},t=e(`discharge`);$.setGlobeDetail({seed:Ku.seed,discharge:t&&t.stage===n.stage?t.data:null,biome:e(`biome`)?.data??null})}let a=Q.get(`temperature`),o=e=>{let t=Q.get(e);return t&&t.faces===6&&a&&t.w===a.w?t:null},s=o(`biome`);a&&a.faces===6&&(a!==md.temp||s!==md.biome)&&(md.temp=a,md.biome=s,$.setGlobeSurface({temperature:a,precip:Q.get(`precip`)??null,summerRain:Q.get(`summerRain`)??null,tempRange:Q.get(`tempRange`)??null,aridity:s?o(`aridity`):null,biome:s,snow:s?o(`snow`):null,erg:s?o(`erg`):null,canopy:s?o(`canopy`):null}));let c=e.kind===`elevation`?null:e;c!==md.drape&&(md.drape=c,$.setGlobeDrape(c)),Rd(),Sd.hidden=!1,Sd.textContent=fd===`net`?`Show map`:`Show cube net`;let l=`${t.projection}:${t.worldKm}`;Ju!==l&&(Ju=l,qd());let u=(e.worldKm/e.w).toFixed(2);Wu.textContent=e.kind===`categorical`?`6 × ${e.w}² cells · ${u} km/cell · ${e.max+1} classes`:`6 × ${e.w}² cells · ${u} km/cell · ${P(e.min)} … ${P(e.max)} ${e.unit}`}function Wd(e,t){let n=id.screenToWorldX(e),r=id.screenToWorldY(t);if(sd===`3d`&&$.sphere){Kd(e,t);return}if(pd){Gd(pd,n,r);return}if(sd===`3d`){let i=$.cam.pick(e,t);if(!i||!$.hf){Gu.textContent=``;return}({xKm:n,yKm:r}=Mt(i.x,i.y,$.hf.size))}let i=Q.get(Vd()),a=Q.get(`elevation`);if(!i)return;let o=ln(i,n,r);if(o===null){Gu.textContent=``;return}let s=[`${n.toFixed(1)} km, ${r.toFixed(1)} km`,`${i.label}: ${P(o)} ${i.unit}`],c=ot(Zu,n*1e3,r*1e3);c&&s.unshift(`${c.name} (${zl[c.kind].toLowerCase()})`),a&&a!==i&&s.push(`Elevation: ${P(ln(a,n,r)??0)} m`),Gu.textContent=s.join(`
`)}function Gd(e,t,n){let r=ln(e,t,n);if(r===null){Gu.textContent=``;return}let i=[`${e.label}: ${P(r)} ${e.unit}`];if(e.projection===`equirect`){let[r,a]=Vt(e,t,n);i.unshift(rt(r,a));let o=$.globeHf?.radius??0,s=r*Math.PI/180,c=a*Math.PI/180,l=o>0?st(Zu,{x:Math.cos(s)*Math.cos(c),y:Math.cos(s)*Math.sin(c),z:Math.sin(s)},o):null;l&&i.unshift(`${l.name} (${zl[l.kind].toLowerCase()})`)}let a=Q.get(`elevation`);if(a&&a.label!==e.label&&a.faces===6){let r=ln(It(a,e.projection),t,n);r!==null&&i.push(`Elevation: ${P(r)} m`)}Gu.textContent=i.join(`
`)}function Kd(e,t){let n=$.globeCam.pick(e,t),r=Q.get(Vd());if(!n||!r||r.faces!==6){Gu.textContent=``;return}let i=Math.hypot(n.x,n.y,n.z),a=Math.asin(n.z/i)*180/Math.PI,o=Math.atan2(n.y,n.x)*180/Math.PI,s=e=>e.data[Qe(n.x,n.y,n.z,e.w)],c=[rt(a,o,2),`${r.label}: ${P(s(r))} ${r.unit}`],l=$.globeHf?st(Zu,n,$.globeHf.radius):null;l&&c.unshift(`${l.name} (${zl[l.kind].toLowerCase()})`);let u=Q.get(`elevation`);u&&u!==r&&u.faces===6&&c.push(`Elevation: ${P(s(u))} m`),Gu.textContent=c.join(`
`)}function qd(){ad.resize(id);let e=Z(`panel`),t=getComputedStyle(e).transform===`none`||window.innerWidth>760,n=Z(`topbar`).getBoundingClientRect().bottom;id.fit(Jd(),Yd(),{top:n,right:t?window.innerWidth-e.getBoundingClientRect().left:0,bottom:0,left:0}),od.setZoom(id.zoom)}function Jd(){return pd?.worldKm??Q.get(Vd())?.worldKm??1024}function Yd(){return pd?pd.worldKm*pd.h/pd.w:Jd()}var Xd=performance.now(),Zd=new Float32Array(9),Qd=``;function $d(e){let t=Math.min(.1,(e-Xd)/1e3);if(Xd=e,sd===`3d`)$.resize(),ed.update(t),$.sphere?$.globeCam.update(t):$.cam.update(t),vd.shouldDraw(e,$.needsFrame,!0)&&($.draw(e/1e3),$.sphere?nd.draw():td.draw(),rd.update());else{ad.resize(id),od.update(t);let n=`${id.viewMatrix(Zd).join(`,`)}|${Bu.width}x${Bu.height}`;vd.shouldDraw(e,n!==Qd,!1)&&(Qd=n,ad.draw(id))}requestAnimationFrame($d)}function ef(e){sd=e,vd.wake(),of(Iu,e),ed.enabled=e===`3d`,od.enabled=e===`2d`,document.body.classList.toggle(`mode-2d`,e===`2d`),Z(`mode`).textContent=e===`3d`?`2D`:`3D`,e===`2d`&&qd()}function tf(e){Ku={...Ku,seed:e},Vu.value=String(e),Od.setSpec(Ku),nf(),Id(`build`)}function nf(){history.replaceState(null,``,`${location.pathname}?${le(Ku)}`)}function rf(){return Math.floor(Math.random()*1e9)}function af(e){try{return localStorage.getItem(e)}catch{return null}}function of(e,t){try{localStorage.setItem(e,t)}catch{}}export{l as _,F as a,Ye as c,Xe as d,Je as f,c as g,s as h,Dr as i,et as l,k as m,Lc as n,I as o,$e as p,B as r,L as s,J as t,Qe as u,u as v,a as y};
