import{c as e}from"./options-model-CrstL1Qd.js";import{n as t}from"./index-sNerCVjG.js";var n=[],r=100;function i(i=Date.now()){n.push({seed:options.map.seed,width:options.map.graph.width,height:options.map.graph.height,template:options.generation.template,templatePinned:e.has(`template`),created:i,registeredAt:Date.now()}),n.length>r&&n.splice(0,n.length-r),t.info(` Seed: ${options.map.seed}
    Map size: ${options.map.graph.width}x${options.map.graph.height} px
    Points: ${grid.points.length}
    Cells: ${pack.cells.i.length}
    Map size: ${options.map.geography.mapSize}%
    States: ${pack.states.length-1}
    Provinces: ${pack.provinces.length-1}
    Burgs: ${pack.burgs.length-1}
    Religions: ${pack.religions.length-1}
    Culture set: ${options.map.cultures.set}
    Cultures: ${pack.cultures.length-1}`),window.dispatchEvent(new CustomEvent(`map:generated`,{detail:{seed:options.map.seed,mapId:i}}))}export{i as n,n as t};