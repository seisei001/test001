// Real Earth as a world source.
//
// Elevation is sampled from an embedded heightmap built from the NOAA ETOPO1
// global relief model (Amante & Eakins 2009, public domain) — real measured
// elevation and bathymetry in metres, with no clipping: Everest and the
// Challenger Deep are both inside the encoding range. Climate is *not*
// measured data — it is a physical model driven by real latitude and real
// elevation (see below), which is why the Sahara comes out dry and the Amazon
// wet without any climate dataset.

const EARTH = {
  SRC: "data/earth-heightmap.png",
  // 12-bit elevation code per pixel: R carries the high 8 bits, G the low 4
  // in its high nibble. Split across two 8-bit channels because browsers
  // quantise 16-bit grayscale PNGs to 8 bits on canvas readback; two 8-bit
  // channels come back exact. Constants mirrored in
  // tools/build-earth-heightmap.mjs; CI fails if the two files disagree.
  ELEV_MIN: -11000,  // metres at code 0
  ELEV_MAX: 9000,    // metres at code CODE_MAX — a 4.9 m step
  CODE_MAX: 4095,
  SEA_LEVEL: 0.42,   // where sea level sits in the app's 0..1 elevation space
  LAND_MAX: 9000,    // metres spanned by app elevations SEA_LEVEL..1
  OCEAN_MIN: 11000,  // metres spanned by app elevations 0..SEA_LEVEL
  // World units are degrees. At 0.18°/cell the default view covers roughly
  // half the planet, which leaves somewhere to pan in both axes; a value that
  // fits all 180° of latitude on screen would pin vertical panning entirely.
  DEG_PER_CELL: 0.18,
};

const EarthData = (function () {
  "use strict";

  let width = 0, height = 0, codes = null, status = "idle", detail = "";

  // Code → app-space elevation, precomputed once. 4096 entries make the
  // piecewise metres→elevation conversion a single array read per tap.
  const LUT = new Float64Array(EARTH.CODE_MAX + 1);
  for (let c = 0; c <= EARTH.CODE_MAX; c++) {
    const m = c / EARTH.CODE_MAX * (EARTH.ELEV_MAX - EARTH.ELEV_MIN) + EARTH.ELEV_MIN;
    LUT[c] = m >= 0
      ? EARTH.SEA_LEVEL + (1 - EARTH.SEA_LEVEL) * (m / EARTH.LAND_MAX)
      : EARTH.SEA_LEVEL * (1 - (-m) / EARTH.OCEAN_MIN);
  }

  function state() { return status; }
  function message() { return detail; }

  function load() {
    if (status === "ready") return Promise.resolve(true);
    if (status === "loading") return pending;
    status = "loading";

    pending = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        width = img.naturalWidth;
        height = img.naturalHeight;
        // Decoded in horizontal strips: a full-frame getImageData of the
        // 8192×4096 source is a ~134 MB RGBA allocation, which is the kind
        // of spike that kills the tab on phones. 512-row strips cap it at
        // ~17 MB while the resident copy is packed to one code per texel.
        const STRIP = 512;
        const c = document.createElement("canvas");
        c.width = width;
        c.height = Math.min(STRIP, height);
        const cx = c.getContext("2d", { willReadFrequently: true });
        try {
          codes = new Uint16Array(width * height);
          for (let y0 = 0; y0 < height; y0 += STRIP) {
            const rows = Math.min(STRIP, height - y0);
            cx.drawImage(img, 0, y0, width, rows, 0, 0, width, rows);
            const data = cx.getImageData(0, 0, width, rows).data;
            let o = y0 * width;
            for (let i = 0, n = width * rows; i < n; i++, o++) {
              // R = high 8 bits, G's high nibble = low 4 bits.
              codes[o] = (data[i * 4] << 4) | (data[i * 4 + 1] >> 4);
            }
          }
          status = "ready";
          resolve(true);
        } catch (err) {
          // Reading pixels back from a file:// image taints the canvas, so
          // Earth needs a local server even though everything else does not.
          status = "blocked";
          detail = location.protocol === "file:"
            ? "Earth needs a local web server — run: python3 -m http.server 8000"
            : "Could not read the heightmap: " + err.message;
          resolve(false);
        }
      };
      img.onerror = () => {
        status = "error";
        detail = "Could not load " + EARTH.SRC;
        resolve(false);
      };
      img.src = EARTH.SRC;
    });
    return pending;
  }
  let pending = null;

  // 12-bit code to the app's 0..1 elevation. Linear in metres — with 4.9 m
  // steps there is no need for the old square-root precision squeeze.
  function decode(code) {
    return LUT[Math.max(0, Math.min(EARTH.CODE_MAX, code | 0))];
  }

  // World coordinates are degrees: x is longitude+180 and wraps, y is
  // 90−latitude and clamps at the poles.
  function elevationAt(wx, wy) {
    if (!codes) return EARTH.SEA_LEVEL;

    let u = (wx / 360) * width;
    u = ((u % width) + width) % width;
    let v = (wy / 180) * height;
    v = v < 0 ? 0 : v > height - 1.0001 ? height - 1.0001 : v;

    const x0 = u | 0, y0 = v | 0;
    // Smootherstep rather than raw linear weights. Straight bilinear over a
    // quantised heightmap shows its lattice as diamond-shaped facets once you
    // zoom past one texel per pixel; easing the weights hides the seams.
    const fx = smootherstep(u - x0), fy = smootherstep(v - y0);
    const x1 = (x0 + 1) % width;
    const y1 = y0 + 1 < height ? y0 + 1 : y0;

    const r0 = y0 * width, r1 = y1 * width;
    const e00 = LUT[codes[r0 + x0]], e10 = LUT[codes[r0 + x1]];
    const e01 = LUT[codes[r1 + x0]], e11 = LUT[codes[r1 + x1]];

    return (e00 + (e10 - e00) * fx) * (1 - fy) + (e01 + (e11 - e01) * fx) * fy;
  }

  function texelDegrees() { return width ? 360 / width : 1; }

  // Local relief across one source texel. Detail synthesis uses this so the
  // invented roughness follows the real terrain — plains stay flat, mountains
  // get rugged — instead of being sprinkled uniformly over the planet.
  function roughnessAt(wx, wy) {
    const d = texelDegrees();
    const c = elevationAt(wx, wy);
    return Math.max(
      Math.abs(elevationAt(wx + d, wy) - c),
      Math.abs(elevationAt(wx, wy + d) - c),
    );
  }

  function metresAt(wx, wy) {
    const e = elevationAt(wx, wy);
    return e >= EARTH.SEA_LEVEL
      ? (e - EARTH.SEA_LEVEL) / (1 - EARTH.SEA_LEVEL) * EARTH.LAND_MAX
      : -((EARTH.SEA_LEVEL - e) / EARTH.SEA_LEVEL) * EARTH.OCEAN_MIN;
  }

  return { load, state, message, elevationAt, metresAt, decode, roughnessAt, texelDegrees };
})();

// ------------------------------------------------------------------ climate

// Temperature from real latitude and real elevation. The 0..1 scale spans
// roughly −30 °C to +30 °C, and the lapse rate is the standard 6.5 °C/km.
function earthTemperature(wy, e) {
  const lat = 90 - wy;
  const c = Math.cos(Math.abs(lat) * Math.PI / 180);
  const base = 0.08 + 0.87 * Math.pow(Math.max(0, c), 1.1);
  const km = e >= EARTH.SEA_LEVEL
    ? (e - EARTH.SEA_LEVEL) / (1 - EARTH.SEA_LEVEL) * EARTH.LAND_MAX / 1000
    : 0;
  return clamp01(base - km * 0.108);
}

// Precipitation from the general circulation: rising air at the equator and
// the polar front makes those bands wet, descending air under the subtropical
// highs and over the poles makes those dry. This single curve is what puts
// deserts at ±28° — the Sahara, Kalahari, Arabian and Australian belts — and
// rainforest on the equator, without any precipitation dataset.
function earthMoisture(wx, wy, e) {
  const a = Math.abs(90 - wy);
  const band = (centre, spread) => Math.exp(-((a - centre) * (a - centre)) / (2 * spread * spread));

  let m = 0.30
    + 0.55 * band(0, 9)     // intertropical convergence
    - 0.28 * band(28, 11)   // subtropical highs
    + 0.30 * band(55, 13)   // polar front
    - 0.22 * band(90, 14);  // polar desert

  // Local variation so biome edges are not perfect horizontal stripes, plus a
  // mild drying with altitude standing in for rain shadow.
  m += (fbm(wx * 0.25, wy * 0.25, 7717, 3, 2, 0.5) - 0.5) * 0.22;
  if (e > EARTH.SEA_LEVEL) m -= (e - EARTH.SEA_LEVEL) * 0.35;

  return clamp01(m);
}

// The heightmap has a fixed resolution, so zooming past roughly one texel per
// screen cell just magnifies blur. Past that point this adds fractal relief
// scaled to the local roughness, which fills in plausible detail below what
// the data can resolve. It fades to nothing as soon as the data out-resolves
// the screen, so a world view is always the measured terrain and nothing else.
//
// `cellDeg` is the current degrees-per-cell; `octaves` comes from the Detail
// control. Passing 0 octaves disables synthesis entirely.
function makeEarthSampler(octaves, cellDeg) {
  const texel = EarthData.texelDegrees();
  const fade = octaves > 0 ? clamp01(1 - cellDeg / texel) : 0;

  if (fade <= 0.01) {
    return {
      elevation: (x, y) => EarthData.elevationAt(x, y),
      moisture: (x, y, e) => earthMoisture(x, y, e),
      temperature: (y, e) => earthTemperature(y, e),
      synthetic: 0,
    };
  }

  const freq = 1 / texel;
  return {
    elevation(x, y) {
      const e = EarthData.elevationAt(x, y);
      if (e < EARTH.SEA_LEVEL) return e; // leave the sea floor as measured
      // Fade out approaching the shore. Perturbing cells that sit within a few
      // hundred metres of sea level pushes them across it and shreds the
      // coastline into speckle — and real coastal plains are flat anyway.
      const coast = clamp01((e - EARTH.SEA_LEVEL) / 0.02);
      if (coast <= 0) return e;

      const rough = EarthData.roughnessAt(x, y);
      // Amplitude follows local relief. The small floor used to be 0.004 to
      // hide the 8-bit source's quantisation terraces; at 12 bits there are
      // no terraces to hide, so flat plains now stay honestly flat.
      const amp = rough * 2.2 + 0.0015;
      const d = fbm(x * freq, y * freq, 4242, octaves, 2, 0.5) - 0.5;
      return clamp01(e + d * amp * fade * coast);
    },
    moisture: (x, y, e) => earthMoisture(x, y, e),
    temperature: (y, e) => earthTemperature(y, e),
    synthetic: fade,
  };
}

// ------------------------------------------------------------------- labels

// Real places, so the map is not captioned with invented names. Coordinates
// are approximate centres, converted to world units on use.
const EARTH_PLACES = [
  ["Pacific Ocean", 0, -150, true], ["Atlantic Ocean", 5, -30, true],
  ["Indian Ocean", -20, 75, true], ["Southern Ocean", -60, 40, true],
  ["Arctic Ocean", 85, 0, true], ["Mediterranean Sea", 35, 18, true],
  ["Caribbean Sea", 15, -75, true], ["Bay of Bengal", 15, 88, true],
  ["Gulf of Mexico", 25, -90, true], ["North Sea", 56, 3, true],
  ["Red Sea", 20, 38, true], ["Coral Sea", -18, 152, true],
  ["Hudson Bay", 60, -86, true], ["Sea of Japan", 40, 135, true],

  ["Africa", 2, 21, false], ["Europe", 50, 15, false],
  ["Asia", 50, 95, false], ["North America", 48, -100, false],
  ["South America", -12, -58, false], ["Australia", -25, 134, false],
  ["Antarctica", -80, 30, false], ["Greenland", 74, -42, false],

  ["Himalaya", 29, 84, false], ["Andes", -20, -68, false],
  ["Rocky Mountains", 45, -111, false], ["Alps", 46.5, 10, false],
  ["Ural Mountains", 60, 59, false], ["Atlas Mountains", 31, -6, false],
  ["Great Dividing Range", -30, 151, false], ["Appalachians", 38, -80, false],

  ["Sahara", 23, 13, false], ["Arabian Desert", 22, 47, false],
  ["Gobi Desert", 43, 105, false], ["Kalahari", -23, 22, false],
  ["Atacama", -24, -69, false], ["Great Sandy Desert", -21, 125, false],

  ["Amazon Basin", -4, -62, false], ["Congo Basin", -1, 22, false],
  ["Siberia", 62, 100, false], ["Great Plains", 41, -100, false],
  ["Tibetan Plateau", 33, 88, false], ["Scandinavia", 63, 15, false],
  ["Madagascar", -19, 47, false], ["Japan", 36, 138, false],
  ["Borneo", 0.5, 114, false], ["New Guinea", -5, 141, false],
];

// Same shape collectLabels returns, so the renderer needs no special case.
function earthLabels(view, seaLevel) {
  const out = [];
  for (const [name, lat, lon, water] of EARTH_PLACES) {
    const wy = 90 - lat;
    // Longitude wraps, so test the label at every world copy the view spans.
    const base = lon + 180;
    for (let k = -1; k <= 1; k++) {
      const wx = base + k * 360;
      if (wx < view.x0 - 2 || wx > view.x1 + 2) continue;
      if (wy < view.y0 - 2 || wy > view.y1 + 2) continue;
      const e = EarthData.elevationAt(wx, wy);
      out.push({
        x: wx, y: wy, text: name, water,
        biome: classify(e, earthMoisture(wx, wy, e), earthTemperature(wy, e), seaLevel),
      });
    }
  }
  return out;
}
