// World model: elevation, climate, biomes, rivers, and place names.
//
// The world is infinite and stateless — every query is a pure function of
// (world coordinate, seed). Nothing is stored, so panning forever costs
// nothing and any coordinate can be revisited exactly.

const WORLD = {
  BASE_SCALE: 0.012,   // world units per screen cell at zoom 1
  // Domain-warp strength in world units. Terrain features are about a unit
  // across, so warping much beyond ~0.5 displaces a sample by most of a feature
  // and shears the field into visible swirls — the map ends up looking combed.
  WARP: 0.45,
  LAT_PERIOD: 52,      // world units for one full pole→equator→pole cycle
  CONTRAST: 1.55,      // stretches fBm away from its mushy 0.5 mean
  RIDGE: 0.34,         // how much ridged noise mountains add
  RIDGE_FREQ: 1.7,     // ridge frequency relative to the base terrain
  RIDGE_OCTAVES: 6,    // ridge detail cap
};

// ---------------------------------------------------------------- elevation

// Domain warping — offsetting the sample point by another noise field — is
// what turns symmetric noise blobs into coastlines with inlets and peninsulas.
function elevationAt(x, y, seed, octaves) {
  const wx = fbm(x * 0.5, y * 0.5, seed + 911, 2, 2, 0.5) - 0.5;
  const wy = fbm(x * 0.5 + 3.7, y * 0.5 + 8.1, seed + 977, 2, 2, 0.5) - 0.5;
  const px = x + wx * WORLD.WARP;
  const py = y + wy * WORLD.WARP;

  let base = fbm(px, py, seed, octaves, 2, 0.5);
  base = (base - 0.5) * WORLD.CONTRAST + 0.5;
  base = clamp01(base);

  // Mountains only grow where the land is already high, so ranges follow the
  // continental interior instead of erupting out of the ocean.
  const mask = smoothstep(0.52, 0.80, base);
  if (mask > 0.001) {
    const ridge = ridgedFbm(px * WORLD.RIDGE_FREQ, py * WORLD.RIDGE_FREQ, seed + 313,
      Math.min(octaves, WORLD.RIDGE_OCTAVES), 2, 0.5);
    base += ridge * mask * WORLD.RIDGE;
  }

  return clamp01(base);
}

function moistureAt(x, y, seed, elev, seaLevel) {
  const m = fbm(x * 0.6 + 100, y * 0.6 - 40, seed + 555, 4, 2, 0.5);
  // Continentality: the further above sea level, the drier — a crude stand-in
  // for distance-from-ocean and rain shadow.
  const dryness = Math.max(0, elev - seaLevel) * 0.95;
  return clamp01(m * 1.15 - dryness * 0.6);
}

function temperatureAt(y, elev, seaLevel) {
  const lat = Math.cos((y / WORLD.LAT_PERIOD) * Math.PI * 2) * 0.5 + 0.5;
  const lapse = Math.max(0, elev - seaLevel) * 1.7;
  return clamp01(lat + 0.06 - lapse);
}

// ------------------------------------------------------------------- biomes

const B = {
  DEEP: 0, OCEAN: 1, SHALLOW: 2, BEACH: 3,
  DESERT: 4, SAVANNA: 5, GRASSLAND: 6, SHRUBLAND: 7,
  TEMPERATE_FOREST: 8, TROPICAL_FOREST: 9, RAINFOREST: 10,
  TAIGA: 11, TUNDRA: 12, ROCK: 13, SNOW: 14,
};

// Index-aligned with B, and with every style's colour table.
const BIOME_NAMES = [
  "Deep ocean", "Ocean", "Shallows", "Beach",
  "Desert", "Savanna", "Grassland", "Shrubland",
  "Temperate forest", "Tropical forest", "Rainforest",
  "Taiga", "Tundra", "Bare rock", "Snow",
];

function classify(e, m, t, seaLevel) {
  if (e < seaLevel - 0.12) return B.DEEP;
  if (e < seaLevel - 0.035) return B.OCEAN;
  if (e < seaLevel) return B.SHALLOW;
  if (e < seaLevel + 0.012) return B.BEACH;

  if (e > 0.88) return B.SNOW;
  if (e > 0.78) return t < 0.32 ? B.SNOW : B.ROCK;

  if (t < 0.20) return e > seaLevel + 0.2 ? B.SNOW : B.TUNDRA;
  if (t < 0.38) return m > 0.45 ? B.TAIGA : B.TUNDRA;

  if (t < 0.68) {
    if (m < 0.28) return B.SHRUBLAND;
    if (m < 0.50) return B.GRASSLAND;
    return B.TEMPERATE_FOREST;
  }

  if (m < 0.24) return B.DESERT;
  if (m < 0.42) return B.SAVANNA;
  if (m < 0.62) return B.TROPICAL_FOREST;
  return B.RAINFOREST;
}

// A world source supplies elevation and climate at a world coordinate. The
// renderer, the drainage solver and the exporters all work through this, so
// generated worlds and real Earth share one pipeline.
function makeGeneratedSampler(seed, octaves, seaLevel) {
  return {
    elevation: (x, y) => elevationAt(x, y, seed, octaves),
    moisture: (x, y, e) => moistureAt(x, y, seed, e, seaLevel),
    temperature: (y, e) => temperatureAt(y, e, seaLevel),
  };
}

function biomeAt(x, y, seed, octaves, seaLevel) {
  const e = elevationAt(x, y, seed, octaves);
  const m = moistureAt(x, y, seed, e, seaLevel);
  const t = temperatureAt(y, e, seaLevel);
  return classify(e, m, t, seaLevel);
}

// -------------------------------------------------------------------- style

// Five cartographic treatments over the same world. `shade` scales the
// relief lighting, `coast` draws a shoreline stroke, `grain` overlays paper,
// `contour` strokes elevation contour lines when that overlay is on.
const STYLES = {
  natural: {
    label: "Natural",
    colors: [
      [20, 44, 76], [32, 72, 112], [60, 112, 152], [216, 202, 160],
      [222, 199, 148], [193, 186, 122], [143, 165, 101], [156, 157, 117],
      [94, 129, 83], [76, 132, 78], [56, 108, 68],
      [76, 108, 95], [164, 170, 154], [140, 133, 124], [240, 242, 240],
    ],
    shade: 1.0,
    coast: null,
    void: [10, 14, 20],
    grain: 0,
    vignette: 0.26,
    river: "#2f74ad",
    contour: "#4a3a24",
    labelInk: "#ffffff",
    labelHalo: "rgba(8,14,20,0.72)",
    labelFont: '-apple-system, "Segoe UI", system-ui, sans-serif',
    labelTracking: 0.06,
  },
  parchment: {
    label: "Parchment",
    colors: [
      [172, 186, 187], [188, 200, 198], [206, 214, 208], [233, 219, 186],
      [232, 214, 173], [224, 205, 163], [212, 196, 155], [219, 202, 161],
      [196, 184, 144], [190, 178, 139], [181, 170, 133],
      [194, 187, 155], [216, 209, 185], [201, 188, 162], [238, 231, 213],
    ],
    shade: 0.82,
    coast: [107, 92, 66],
    void: [44, 38, 28],
    grain: 0.55,
    vignette: 0.44,
    river: "#4a5f74",
    contour: "#6b5c42",
    labelInk: "#4a3b28",
    labelHalo: "rgba(240,231,209,0.85)",
    labelFont: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif',
    labelTracking: 0.08,
    italic: true,
  },
  atlas: {
    label: "Atlas",
    colors: [
      [152, 186, 214], [174, 203, 226], [198, 220, 236], [236, 227, 202],
      [239, 224, 176], [227, 219, 167], [206, 219, 172], [215, 214, 175],
      [175, 203, 167], [161, 198, 159], [142, 186, 147],
      [178, 198, 186], [215, 219, 211], [206, 199, 190], [249, 249, 249],
    ],
    shade: 0.3,
    coast: [122, 146, 166],
    void: [226, 231, 236],
    grain: 0,
    vignette: 0.1,
    river: "#4f8cc0",
    contour: "#7d95a9",
    labelInk: "#39434f",
    labelHalo: "rgba(255,255,255,0.82)",
    labelFont: '-apple-system, "Segoe UI", system-ui, sans-serif',
    labelTracking: 0.07,
  },
  // Pen and ink: the terrain is carried almost entirely by relief shading and
  // the coast stroke over near-white paper, the way survey maps were engraved.
  // Biome tints are kept within a few points of each other on purpose — at
  // full saturation this style is just Natural with worse colours.
  ink: {
    label: "Ink",
    colors: [
      [211, 216, 213], [222, 226, 221], [233, 235, 228], [246, 242, 228],
      [244, 238, 220], [240, 234, 214], [236, 232, 212], [238, 233, 216],
      [228, 226, 206], [226, 224, 204], [220, 219, 200],
      [230, 228, 210], [240, 238, 224], [232, 228, 216], [250, 249, 244],
    ],
    shade: 1.18,
    coast: [45, 38, 30],
    void: [236, 232, 220],
    grain: 0.5,
    vignette: 0.3,
    river: "#3a3f45",
    contour: "#57503f",
    labelInk: "#33291c",
    labelHalo: "rgba(247,243,232,0.9)",
    labelFont: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif',
    labelTracking: 0.09,
    italic: true,
  },
  // Night: dark-ground palette with the value ordering preserved — water
  // darkest, snow brightest — so relief and coastlines still read at a glance
  // on a dark screen.
  night: {
    label: "Night",
    colors: [
      [4, 10, 20], [10, 22, 38], [22, 42, 62], [58, 60, 52],
      [72, 66, 48], [64, 66, 44], [48, 62, 44], [56, 60, 46],
      [38, 54, 40], [32, 56, 38], [26, 48, 34],
      [34, 46, 42], [58, 62, 60], [56, 52, 50], [225, 232, 238],
    ],
    shade: 1.0,
    coast: null,
    void: [2, 4, 8],
    grain: 0,
    vignette: 0.5,
    river: "#5ab4e8",
    contour: "#8ba3b8",
    labelInk: "#e8f0f5",
    labelHalo: "rgba(2,8,14,0.8)",
    labelFont: '-apple-system, "Segoe UI", system-ui, sans-serif',
    labelTracking: 0.06,
  },
};

// -------------------------------------------------------------------- rivers

// Rivers come from flow accumulation over the elevation grid the renderer has
// already built, not from tracing each spring independently. Independent
// traces produce isolated squiggles that mostly die in the first few steps;
// accumulation produces a real drainage network, where tributaries merge and
// a channel widens with the area it drains.
//
// This is the standard D8 method: every cell drains to its lowest neighbour,
// cells are processed from high to low, and each passes its accumulated flow
// downstream. Cells carrying more than a threshold become river segments.
function buildDrainage(elev, W, H) {
  const n = W * H;
  const down = new Int32Array(n).fill(-1);
  const flow = new Float32Array(n).fill(1);

  // Steepest-descent neighbour, 8-connected. Diagonals are distance-weighted
  // so they do not win purely by reaching further.
  const DX = [1, -1, 0, 0, 1, 1, -1, -1];
  const DY = [0, 0, 1, -1, 1, -1, 1, -1];
  const INV = [1, 1, 1, 1, Math.SQRT1_2, Math.SQRT1_2, Math.SQRT1_2, Math.SQRT1_2];

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const e = elev[i];
      let best = -1;
      let bestSlope = 0;
      for (let d = 0; d < 8; d++) {
        const nx = x + DX[d];
        const ny = y + DY[d];
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const j = ny * W + nx;
        const slope = (e - elev[j]) * INV[d];
        if (slope > bestSlope) { bestSlope = slope; best = j; }
      }
      down[i] = best;
    }
  }

  // Counting sort by elevation so cells can be processed strictly downhill.
  const BINS = 2048;
  const counts = new Int32Array(BINS + 1);
  const bin = new Int32Array(n);
  for (let i = 0; i < n; i++) {
    const b = Math.min(BINS - 1, (elev[i] * BINS) | 0);
    bin[i] = b;
    counts[b]++;
  }
  let acc = 0;
  for (let b = BINS - 1; b >= 0; b--) { const c = counts[b]; counts[b] = acc; acc += c; }
  const order = new Int32Array(n);
  for (let i = 0; i < n; i++) order[counts[bin[i]]++] = i;

  for (let k = 0; k < n; k++) {
    const i = order[k];
    const j = down[i];
    if (j >= 0) flow[j] += flow[i];
  }

  return { down, flow };
}

// Picks the flow threshold that turns accumulation into a drawable network,
// by taking a high percentile of the flow over land rather than a fixed
// number — so the density holds steady whatever fraction of the view is sea.
function drainageThreshold(elev, flow, seaLevel, targetFraction) {
  const BINS = 512;
  const hist = new Int32Array(BINS);
  let land = 0;
  for (let i = 0; i < flow.length; i++) {
    if (elev[i] < seaLevel) continue;
    land++;
    const b = Math.min(BINS - 1, (Math.log2(flow[i] + 1) * 24) | 0);
    hist[b]++;
  }
  if (land === 0) return Infinity;

  const want = land * targetFraction;
  let seen = 0;
  for (let b = BINS - 1; b >= 0; b--) {
    seen += hist[b];
    if (seen >= want) return Math.pow(2, b / 24) - 1;
  }
  return 1;
}

// -------------------------------------------------------------- place names

// Syllables are assembled onset + vowel + optional coda. The lists are split
// so a cluster onset never lands straight after a coda — that pileup is what
// turns generated names into unpronounceable mush. Single vowels are repeated
// in the list to weight them above diphthongs for the same reason.
const ONSET_SIMPLE = ["b", "d", "f", "g", "h", "k", "l", "m", "n", "p", "r", "s", "t", "v", "w", "z"];
const ONSET_CLUSTER = ["br", "dr", "gr", "kr", "tr", "th", "sh", "fl", "gl", "st", "cr"];
const VOWEL = ["a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "ae", "ai", "ea", "ou"];
const CODA = ["l", "ll", "m", "n", "r", "rn", "s", "th", "ck", "d"];

const FEATURE = [
  ["Deep", "Abyss", "Expanse"], ["Sea", "Ocean", "Waters"], ["Bay", "Sound", "Shallows"],
  ["Shore", "Strand", "Coast"], ["Sands", "Waste", "Dunes"], ["Savanna", "Flats", "Veldt"],
  ["Plains", "Downs", "Meadows"], ["Scrub", "Heath", "Barrens"], ["Wood", "Forest", "Weald"],
  ["Jungle", "Wilds", "Canopy"], ["Deepwood", "Tangle", "Rainforest"],
  ["Taiga", "Pinewood", "Boreal"], ["Tundra", "Reach", "Frostlands"],
  ["Crags", "Bluffs", "Ridge"], ["Peaks", "Spires", "Summits"],
];

function pick(arr, rnd) {
  return arr[Math.floor(rnd() * arr.length) % arr.length];
}

function makeWord(rnd) {
  const syllables = rnd() < 0.28 ? 3 : 2;
  let s = "";

  for (let i = 0; i < syllables; i++) {
    const last = i === syllables - 1;
    // Cluster onsets word-initially only — real languages overwhelmingly do
    // this, and allowing them mid-word is what produced "Stistkull".
    const onset = i === 0 && rnd() < 0.35
      ? pick(ONSET_CLUSTER, rnd)
      : pick(ONSET_SIMPLE, rnd);

    s += onset + pick(VOWEL, rnd);
    if (last ? rnd() < 0.6 : rnd() < 0.15) s += pick(CODA, rnd);
  }

  return s.charAt(0).toUpperCase() + s.slice(1);
}

function collectLabels(view, seed, octaves, seaLevel, budget) {
  let cell = 2.6;
  const spanX = view.x1 - view.x0;
  const spanY = view.y1 - view.y0;
  while ((spanX / cell) * (spanY / cell) > 90) cell *= 2;

  const cx0 = Math.floor(view.x0 / cell);
  const cx1 = Math.ceil(view.x1 / cell);
  const cy0 = Math.floor(view.y0 / cell);
  const cy1 = Math.ceil(view.y1 / cell);

  const out = [];
  for (let cy = cy0; cy <= cy1 && out.length < budget; cy++) {
    for (let cx = cx0; cx <= cx1 && out.length < budget; cx++) {
      if (hash2(cx, cy, seed + 8181) > 0.55) continue;

      const px = (cx + 0.15 + hash2(cx, cy, seed + 21) * 0.7) * cell;
      const py = (cy + 0.15 + hash2(cx, cy, seed + 29) * 0.7) * cell;

      const biome = biomeAt(px, py, seed, Math.min(octaves, 5), seaLevel);
      if (biome === B.BEACH) continue; // too thin a band to name

      const rnd = mulberry32((cx * 73856093) ^ (cy * 19349663) ^ (seed * 83492791));
      const kind = FEATURE[biome];
      const water = biome <= B.SHALLOW;

      out.push({
        x: px,
        y: py,
        text: `${makeWord(rnd)} ${kind[Math.floor(rnd() * kind.length) % kind.length]}`,
        water,
        // Carried along so consumers report the biome the name was chosen
        // from, rather than re-deriving it at a different octave count and
        // disagreeing with the name.
        biome,
      });
    }
  }
  return out;
}
