import{r as e}from"./controls-PVwY0m2s.js";import{c as t,n}from"./options-model-CrstL1Qd.js";import{t as r}from"./temperature-generator-BeC9kfd1.js";import{n as i,t as a}from"./layers-DjWzCbYN.js";import{t as o}from"./dialog-BkeQgjla.js";import{f as s,m as c}from"./app-DCKsq5m8.js";import{a as l}from"./index-sNerCVjG.js";import{r as u,t as d}from"./node-utils-Ds1sVy-v.js";var f=`unitsEditor`,p=`
    <div id="unitsBody" style="margin-left: 1.1em">
      <div class="unitsHeader" style="margin-top: 0.4em">
        <span class="icon-map-signs"></span>
        <label>${l(`Distance`)}:</label>
      </div>
      <div data-tip="${l(`Select a distance unit or provide a custom name`)}">
        <label>${l(`Distance unit`)}:</label>
        <select id="distanceUnitInput">
          <option value="mi" selected>${l(`Mile (mi)`)}</option>
          <option value="km">${l(`Kilometer (km)`)}</option>
          <option value="lg">${l(`League (lg)`)}</option>
          <option value="vr">${l(`Versta (vr)`)}</option>
          <option value="nmi">${l(`Nautical mile (nmi)`)}</option>
          <option value="nlg">${l(`Nautical league (nlg)`)}</option>
          <option value="custom_name">${l(`Custom name`)}</option>
        </select>
      </div>
      <div data-tip="${l(`Select how many distance units are in one pixel`)}">
        <i data-locked="0" id="lock_distanceScale" class="icon-lock-open"></i>
        <slider-input id="distanceScaleInput" min=".01" max="20" step=".1" value="3">
          <label>${l(`1 map pixel`)}:</label>
        </slider-input>
      </div>
      <div data-tip="${l(`Area unit name, type “square” to add ² to the distance unit`)}">
        <label>${l(`Area unit`)}:</label>
        <input id="areaUnit" type="text" value="square" />
      </div>
      <div class="unitsHeader">
        <span class="icon-signal"></span>
        <label>${l(`Altitude`)}:</label>
      </div>
      <div data-tip="${l(`Select an altitude unit or provide a custom name`)}">
        <label>${l(`Height unit`)}:</label>
        <select id="heightUnit">
          <option value="ft" selected>${l(`Feet (ft)`)}</option>
          <option value="m">${l(`Meters (m)`)}</option>
          <option value="f">${l(`Fathoms (f)`)}</option>
          <option value="custom_name">${l(`Custom name`)}</option>
        </select>
      </div>
      <div
        data-tip="${l(`Set height exponent, i.e. a value for altitude change sharpness. Altitude affects temperature and hence biomes`)}"
      >
        <slider-input
          id="heightExponentInput"
         
          min="1.5"
          max="2.2"
          step=".01"
          value="2"
        >
          <label>${l(`Exponent`)}:</label>
        </slider-input>
      </div>
      <div class="unitsHeader" data-tip="${l(`Select Temperature scale`)}">
        <span class="icon-temperature-high"></span>
        <label>${l(`Temperature`)}:</label>
      </div>
      <div>
        <label>${l(`Temperature scale`)}:</label>
        <select id="temperatureScale">
          <option value="°C" selected>${l(`degree Celsius (°C)`)}</option>
          <option value="°F">${l(`degree Fahrenheit (°F)`)}</option>
          <option value="K">${l(`Kelvin (K)`)}</option>
          <option value="°R">${l(`degree Rankine (°R)`)}</option>
          <option value="°De">${l(`degree Delisle (°De)`)}</option>
          <option value="°N">${l(`degree Newton (°N)`)}</option>
          <option value="°Ré">${l(`degree Réaumur (°Ré)`)}</option>
          <option value="°Rø">${l(`degree Rømer (°Rø)`)}</option>
        </select>
      </div>
      <div class="unitsHeader">
        <span class="icon-bank"></span>
        <label>${l(`Money`)}:</label>
      </div>
      <div data-tip="${l(`Select the name of the map's money or provide a custom one. One unit, shown as 🟡, is a gold coin of a troy ounce (31 g). The plural adds an “s”`)}">
        <label>${l(`Money unit`)}:</label>
        <select id="moneyUnit">
          <option value="uncia" selected>${l(`Uncia`)}</option>
          <option value="mark">${l(`Mark`)}</option>
          <option value="crown">${l(`Crown`)}</option>
          <option value="sovereign">${l(`Sovereign`)}</option>
          <option value="talent">${l(`Talent`)}</option>
          <option value="florin">${l(`Florin`)}</option>
          <option value="custom_name">${l(`Custom name`)}</option>
        </select>
      </div>
      <div class="unitsHeader">
        <span class="icon-male"></span>
        <label>${l(`Population`)}:</label>
      </div>
      <div data-tip="${l(`Set how many people are in one population point`)}">
        <slider-input
          id="populationRateInput"
         
          min="10"
          max="10000"
          step="10"
          value="1000"
        >
          <label>${l(`1 population point`)}:</label>
        </slider-input>
      </div>
      <div data-tip="${l(`Set urban population modifier. Change to increase or decrease burgs population`)}">
        <slider-input id="urbanizationInput" min=".01" max="5" step=".01" value="1">
          <label>${l(`Urbanization rate`)}:</label>
        </slider-input>
      </div>
      <div data-tip="${l(`Set urban density: average population per building in Medieval Fantasy City Generator`)}">
        <slider-input id="urbanDensityInput" min="1" max="200" step="1" value="10">
          <label>${l(`Urban density`)}:</label>
        </slider-input>
      </div>
    </div>
    <div id="unitsBottom">
      <button id="unitsAltitudeLegend" data-tip="${l(`Toggle Legend box`)}" class="icon-list-bullet"></button>
      <button id="unitsRestore" data-tip="${l(`Reset to default`)}" class="icon-ccw"></button>
    </div>
`;function m(){options.app.mode||(o.closeAll(`#unitsEditor, .stable`),h(),o.open(`unitsEditor`,{title:l(`Units Editor`),position:{my:`right top`,at:`right-10 top+10`,of:`svg`}}))}function h(){o.destroy(f),u(`dialogs`).insertAdjacentHTML(`beforeend`,`<div id="${f}" class="dialog stable">${p}</div>`),b(),x(),c(u(f),_)}var g=[`distanceUnit`,`distanceScale`,`areaUnit`,`heightUnit`,`heightExponent`,`temperatureScale`,`moneyUnit`,`populationRate`,`urbanization`,`urbanDensity`];function _(e){let{distance:t,area:n,height:r,temperature:i,money:a,population:o}=options.map.units;if(e===`distanceUnit`)return t.unit;if(e===`distanceScale`)return t.scale;if(e===`areaUnit`)return n.unit;if(e===`heightUnit`)return r.unit;if(e===`heightExponent`)return r.exponent;if(e===`temperatureScale`)return i.unit;if(e===`moneyUnit`)return a.unit;if(e===`populationRate`)return o.scale;if(e===`urbanization`)return o.urbanization.rate;if(e===`urbanDensity`)return o.urbanization.density}var v=[`areaUnit`,`heightUnit`,`temperatureScale`,`moneyUnit`],y=e=>u(v.includes(e)?e:`${e}Input`);function b(){d(u(`distanceUnitInput`),options.map.units.distance.unit),d(u(`heightUnit`),options.map.units.height.unit),d(u(`moneyUnit`),options.map.units.money.unit);for(let e of g)y(e).value=String(_(e))}function x(){u(f).addEventListener(`change`,S),u(`unitsAltitudeLegend`).addEventListener(`click`,i.toggleAltitude),u(`unitsRestore`).addEventListener(`click`,T)}function S(e){let o=e.target,c=o.value,{units:l}=options.map;switch(o.id){case`distanceUnitInput`:if(c===`custom_name`){C(o,`distance`);return}l.distance.unit=c,t.set(`distanceUnit`,c),w();break;case`distanceScaleInput`:l.distance.scale=+c,t.set(`distanceScale`,+c),w();break;case`areaUnit`:l.area.unit=c,t.set(`areaUnit`,c);break;case`heightUnit`:if(c===`custom_name`){C(o,`height`);return}l.height.unit=c,t.set(`heightUnit`,c),a.draw(`heightmap`);break;case`heightExponentInput`:l.height.exponent=+c,t.set(`heightExponent`,+c),r.generate(),a.draw(`temperature`,`heightmap`);break;case`temperatureScale`:l.temperature.unit=c,t.set(`temperatureScale`,c),a.draw(`temperature`);break;case`moneyUnit`:if(c===`custom_name`){C(o,`money`);return}l.money.unit=c,t.set(`moneyUnit`,c);break;case`populationRateInput`:l.population.scale=+c,t.set(`populationRate`,+c),a.draw(`military`),s();break;case`urbanizationInput`:l.population.urbanization.rate=+c,t.set(`urbanization`,+c);break;case`urbanDensityInput`:l.population.urbanization.density=+c,t.set(`urbanDensity`,+c);break;default:return}i.refreshAltitude(),n.save()}function C(e,r){b();let s={distance:l(`Provide a custom name for a distance unit`),height:l(`Provide a custom name for a height unit`),money:l(`Provide a custom name for the money, in the singular`)};o.prompt(s[r],{default:``},o=>{let s=String(o).trim();s&&(e.options.add(new Option(s,s,!1,!0)),r===`money`?(options.map.units.money.unit=s,t.set(`moneyUnit`,s)):r===`distance`?(options.map.units.distance.unit=s,t.set(`distanceUnit`,s),w()):(options.map.units.height.unit=s,t.set(`heightUnit`,s),a.draw(`heightmap`),i.refreshAltitude()),n.save())})}function w(){a.draw(`scaleBar`),e()}function T(){options.map.units=n.getDefaultOptions().map.units;for(let e of g)t.clear(e);n.save(),b(),r.generate(),w(),a.draw(`temperature`,`heightmap`),i.refreshAltitude()}var E={open:m};export{E as UnitsEditor};