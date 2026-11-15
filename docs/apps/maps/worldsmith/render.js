// Shared rendering core.
//
// The live canvas and every exporter run through these functions, so an
// exported map is produced by exactly the same code path as the one on screen
// — there is no second, drifting implementation of what the world looks like.

// Relief is measured from the elevation difference between neighbouring cells.
// Two different things change that difference, and they need opposite handling:
//
//   zoom        — a closer view spans less world, so real relief genuinely
//                 flattens. Compensating by sqrt keeps some of that honest
//                 falloff instead of blowing the shading out.
//   supersample — rasterizing the same world span at more pixels shrinks the
//                 per-cell difference for purely technical reasons, so this
//                 one is compensated linearly to keep an exported map looking
//                 exactly like the screen.
function reliefStrength(zoom, supersample, shade) {
  return 55 * Math.sqrt(zoom) * supersample * shade;
}

function computeWorldFields(p) {
  const elev = new Float32Array(p.W * p.H);
  const moist = new Float32Array(p.W * p.H);
  const src = p.sampler;

  // Moisture is only consumed through classify(), which returns a water biome
  // before it ever reads the value — so computing it below sea level is pure
  // waste. Measured at 53.5ms for this pass, of which moisture is roughly a
  // fifth, and a typical view is half ocean. Ocean cells are left at 0.
  const sea = p.seaLevel;
  let i = 0;
  for (let iy = 0; iy < p.H; iy++) {
    const wy = iy * p.scale + p.originY;
    for (let ix = 0; ix < p.W; ix++, i++) {
      const wx = ix * p.scale + p.originX;
      const e = src.elevation(wx, wy);
      elev[i] = e;
      if (e >= sea) moist[i] = src.moisture(wx, wy, e);
    }
  }
  return { elev, moist };
}

// Yielding variants, used by the exporters.
//
// A poster-sized export samples tens of millions of cells; done in one pass it
// locks the tab for many seconds with no way to see progress or back out.
// These slice the work by elapsed time — filling rows until a frame's budget
// is spent, then handing control back — so the page keeps painting and the
// caller can report progress and honour a cancel.
const FRAME_BUDGET_MS = 12;

// Yielding through a MessageChannel rather than setTimeout. setTimeout(0) is
// clamped to ~4ms once calls nest, and browsers throttle it to once a second
// in a background tab — which turns a slice-based export into one that barely
// advances while the user is looking at another tab. A message port is not
// clamped and keeps running when hidden.
const yieldPort = (function () {
  if (typeof MessageChannel === "undefined") return null;
  const ch = new MessageChannel();
  ch.pending = null;
  ch.port1.onmessage = () => {
    const resolve = ch.pending;
    ch.pending = null;
    if (resolve) resolve();
  };
  return ch;
})();

function yieldToBrowser() {
  if (!yieldPort) return new Promise((r) => setTimeout(r, 0));
  return new Promise((resolve) => {
    yieldPort.pending = resolve;
    yieldPort.port2.postMessage(0);
  });
}

async function computeWorldFieldsAsync(p, onProgress, cancelled) {
  const elev = new Float32Array(p.W * p.H);
  const moist = new Float32Array(p.W * p.H);
  const src = p.sampler;
  const sea = p.seaLevel;
  let iy = 0;

  while (iy < p.H) {
    const started = performance.now();
    while (iy < p.H && performance.now() - started < FRAME_BUDGET_MS) {
      const wy = iy * p.scale + p.originY;
      let i = iy * p.W;
      for (let ix = 0; ix < p.W; ix++, i++) {
        const wx = ix * p.scale + p.originX;
        const e = src.elevation(wx, wy);
        elev[i] = e;
        if (e >= sea) moist[i] = src.moisture(wx, wy, e);
      }
      iy++;
    }
    if (onProgress) onProgress(iy / p.H);
    if (cancelled && cancelled()) return null;
    await yieldToBrowser();
  }
  return { elev, moist };
}

// Paints rows [y0, y1) into an existing ImageData. Split out from
// rasterizeFields so the synchronous and yielding paths share one definition
// of what a pixel looks like.
function rasterizeRows(img, elev, moist, p, style, reliefK, y0, y1) {
  const { W, H, scale, originY, seaLevel: sea } = p;
  const colors = style.colors;
  const coast = style.coast;
  const deep = colors[0], mid = colors[1], shallow = colors[2];
  const data = img.data;

  // Earth is finite in latitude. Fitting the whole planet on a screen wider
  // than 2:1 leaves bands beyond the poles, which are painted as backdrop
  // rather than a stretched copy of the polar row.
  const bounds = p.bounds;
  const voidC = style.void || [0, 0, 0];

  let i = y0 * W, o = y0 * W * 4;
  for (let iy = y0; iy < y1; iy++) {
    const wy = iy * scale + originY;
    const offWorld = bounds && (wy < bounds.y0 || wy > bounds.y1);

    for (let ix = 0; ix < W; ix++, i++, o += 4) {
      const e = elev[i];
      let r, g, b;

      if (offWorld) {
        r = voidC[0]; g = voidC[1]; b = voidC[2];
      } else if (e < sea) {
        // Water reads better as a continuous depth gradient than as bands.
        const d = Math.min(1, (sea - e) / 0.16);
        if (d < 0.5) {
          const f = d * 2;
          r = shallow[0] + (mid[0] - shallow[0]) * f;
          g = shallow[1] + (mid[1] - shallow[1]) * f;
          b = shallow[2] + (mid[2] - shallow[2]) * f;
        } else {
          const f = (d - 0.5) * 2;
          r = mid[0] + (deep[0] - mid[0]) * f;
          g = mid[1] + (deep[1] - mid[1]) * f;
          b = mid[2] + (deep[2] - mid[2]) * f;
        }
      } else {
        const t = p.sampler.temperature(wy, e);
        const c = colors[classify(e, moist[i], t, sea)];

        const iR = ix < W - 1 ? i + 1 : i;
        const iD = iy < H - 1 ? i + W : i;
        const nx = -(elev[iR] - e) * reliefK;
        const ny = -(elev[iD] - e) * reliefK;
        const len = Math.sqrt(nx * nx + ny * ny + 1);
        const dot = (nx * -0.55 + ny * -0.55 + 0.62) / len;
        const shade = Math.min(1.3, Math.max(0.42, 0.62 + dot * 0.55));

        r = c[0] * shade;
        g = c[1] * shade;
        b = c[2] * shade;

        if (coast) {
          const wL = ix > 0 && elev[i - 1] < sea;
          const wU = iy > 0 && elev[i - W] < sea;
          const wR = ix < W - 1 && elev[i + 1] < sea;
          const wD = iy < H - 1 && elev[i + W] < sea;
          if (wL || wU || wR || wD) {
            r = r * 0.35 + coast[0] * 0.65;
            g = g * 0.35 + coast[1] * 0.65;
            b = b * 0.35 + coast[2] * 0.65;
          }
        }
      }

      data[o] = r;
      data[o + 1] = g;
      data[o + 2] = b;
      data[o + 3] = 255;
    }
  }
}

function rasterizeFields(elev, moist, p, style, reliefK) {
  const img = new ImageData(p.W, p.H);
  rasterizeRows(img, elev, moist, p, style, reliefK, 0, p.H);
  return img;
}

async function rasterizeFieldsAsync(elev, moist, p, style, reliefK, onProgress, cancelled) {
  const img = new ImageData(p.W, p.H);
  let iy = 0;

  while (iy < p.H) {
    const started = performance.now();
    let end = iy;
    while (end < p.H && performance.now() - started < FRAME_BUDGET_MS) {
      rasterizeRows(img, elev, moist, p, style, reliefK, end, Math.min(p.H, end + 16));
      end = Math.min(p.H, end + 16);
    }
    iy = end;
    if (onProgress) onProgress(iy / p.H);
    if (cancelled && cancelled()) return null;
    await yieldToBrowser();
  }
  return img;
}

const HYDRO = {
  // Share of land cells drawn as channel. Declared here because the screen
  // and every exporter must use the same value — duplicating it meant a
  // tweak in one place silently gave exports a different river density.
  LAND_FRACTION: 0.012,
  // How far above a sink water may pool, as a multiple of the field's own mean
  // per-cell elevation change.
  //
  // This has to be relative. Measured across the zoom range, the mean per-cell
  // delta spans about 86x (0.031 at world view down to 0.00036 zoomed in), so
  // any fixed value is wrong nearly everywhere: 0.006 floods almost nothing at
  // world view and drowns most of the frame when zoomed in. Expressing it in
  // units of local relief makes basin size behave the same at every scale.
  LAKE_RISE_FACTOR: 1.2,
  // A lake's extent follows the water reaching it: a minor tributary makes a
  // tarn, a major river makes a real basin. A flat cell budget instead of this
  // let every shallow local minimum flood to the same maximum, which at high
  // zoom (where synthesized detail creates many shallow pits) drowned most of
  // the frame in identical blue blobs.
  LAKE_AREA_PER_FLOW: 5.0,
  LAKE_AREA_EXPONENT: 1.4,
  LAKE_MAX_CELLS: 220,
  // Below this a "lake" is a couple of cells of noise, not a feature.
  LAKE_MIN_CELLS: 4,
  // Only genuine watercourses pool, so a marginal channel ending in a dimple
  // does not become a lake.
  LAKE_MIN_FLOW_RATIO: 1.45,
  // Belt and braces: lakes may never dominate the land area of a view.
  LAKE_TOTAL_LAND_FRACTION: 0.02,
};

// Average absolute elevation change between horizontally adjacent land cells.
// Used as the unit for basin depth so hydrology behaves identically whatever
// world span a view covers.
function meanCellRelief(elev, W, H, seaLevel) {
  let sum = 0, n = 0;
  for (let y = 0; y < H; y++) {
    const row = y * W;
    for (let x = 0; x < W - 1; x++) {
      const i = row + x;
      if (elev[i] < seaLevel) continue;
      sum += Math.abs(elev[i + 1] - elev[i]);
      n++;
    }
  }
  return n ? sum / n : 0;
}

// Floods each endorheic sink to a shallow level so the basin has an extent
// rather than being a single point. A basin that reaches the sea while
// filling was never endorheic, so it is discarded.
function floodBasins(elev, W, H, seaLevel, sinks, flow, threshold, landCells, rise) {
  const lakes = [];
  const claimed = new Uint8Array(W * H);
  const queue = new Int32Array(HYDRO.LAKE_MAX_CELLS * 4);

  // Biggest inflow first, so when the global budget runs out it is the
  // insignificant puddles that get dropped rather than a major basin.
  const ordered = sinks
    .filter((i) => flow[i] / threshold >= HYDRO.LAKE_MIN_FLOW_RATIO)
    .sort((a, b) => flow[b] - flow[a]);

  const budget = Math.max(0, Math.round(landCells * HYDRO.LAKE_TOTAL_LAND_FRACTION));
  let spent = 0;

  for (const start of ordered) {
    if (claimed[start] || spent >= budget) continue;

    const ratio = flow[start] / threshold;
    const target = Math.min(
      HYDRO.LAKE_MAX_CELLS,
      Math.max(HYDRO.LAKE_MIN_CELLS,
        Math.round(HYDRO.LAKE_AREA_PER_FLOW * Math.pow(ratio, HYDRO.LAKE_AREA_EXPONENT))),
      budget - spent,
    );

    const level = elev[start] + rise;
    const cells = [];
    let head = 0, tail = 0;
    queue[tail++] = start;
    claimed[start] = 1;
    let spilled = false;

    while (head < tail && cells.length < target) {
      const c = queue[head++];
      cells.push(c);
      const cx = c % W, cy = (c / W) | 0;

      for (let d = 0; d < 4; d++) {
        const nx = cx + (d === 0 ? 1 : d === 1 ? -1 : 0);
        const ny = cy + (d === 2 ? 1 : d === 3 ? -1 : 0);
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const n = ny * W + nx;
        if (claimed[n]) continue;
        if (elev[n] < seaLevel) { spilled = true; continue; }
        if (elev[n] <= level && tail < queue.length) {
          claimed[n] = 1;
          queue[tail++] = n;
        }
      }
    }

    if (!spilled && cells.length >= HYDRO.LAKE_MIN_CELLS) {
      lakes.push({ cells, sink: start, flow: flow[start] / threshold });
      spent += cells.length;
    }
  }
  return lakes;
}

// Turns the drainage grid into a described hydrology rather than a bare list
// of line segments.
//
// Not every river reaches the sea, and that is not a bug: an endorheic basin
// — the Caspian, the Okavango, the Great Basin — is where a real drainage
// network terminates inland. Previously those channels simply stopped in open
// terrain, which reads as broken rendering. Classifying the terminus lets the
// renderer draw a lake there, so the same correct result now looks deliberate.
//
// `excludes` optionally rejects a cell — used to keep channels off permanent
// ice, where the drainage maths is happy to route flow that is really a
// glacier.
function buildHydrology(elev, W, H, seaLevel, landFraction, excludes) {
  const { down, flow } = buildDrainage(elev, W, H);
  const threshold = drainageThreshold(elev, flow, seaLevel, landFraction);
  if (!isFinite(threshold)) {
    return { segments: [], lakes: [], outlets: 0, basins: 0, riverCells: 0, threshold: Infinity };
  }

  const segments = [];
  const sinks = [];
  let outlets = 0;
  let riverCells = 0;
  let landCells = 0;

  for (let i = 0; i < flow.length; i++) {
    if (elev[i] >= seaLevel) landCells++;
    if (elev[i] < seaLevel || flow[i] < threshold) continue;
    if (excludes && excludes(i)) continue;
    riverCells++;

    const j = down[i];
    if (j < 0) {
      // No lower neighbour anywhere: flow pools here instead of continuing.
      sinks.push(i);
      continue;
    }
    // Draining into a below-sea-level cell is a river mouth.
    if (elev[j] < seaLevel) outlets++;
    segments.push(i % W, (i / W) | 0, j % W, (j / W) | 0, flow[i] / threshold);
  }

  const rise = HYDRO.LAKE_RISE_FACTOR * meanCellRelief(elev, W, H, seaLevel);
  const lakes = floodBasins(elev, W, H, seaLevel, sinks, flow, threshold, landCells, rise);
  return { segments, lakes, outlets, basins: lakes.length, riverCells, landCells, threshold };
}

// Kept as the narrow entry point for callers that only want the line work.
function riverSegmentsFrom(elev, W, H, seaLevel, landFraction, excludes) {
  return buildHydrology(elev, W, H, seaLevel, landFraction, excludes).segments;
}

// Builds the ice test for a given field, or null when nothing is frozen.
function iceExcluder(elev, moist, p) {
  return (i) => {
    const wy = ((i / p.W) | 0) * p.scale + p.originY;
    const e = elev[i];
    return classify(e, moist[i], p.sampler.temperature(wy, e), p.seaLevel) === B.SNOW;
  };
}

const RIVER_BANDS = 5;

// Channel width grows with the square root of drained area, which spans
// roughly 1×–3× the threshold — mapped across the bands linearly, since a log
// scale would collapse almost every channel into a single width.
function riverBandOf(flowRatio) {
  const strength = Math.sqrt(flowRatio);
  return Math.min(RIVER_BANDS - 1, Math.max(0, Math.round((strength - 1) * 2)));
}

function riverBandWidth(band, unit) {
  return (1.0 + band * 0.8) * unit;
}

// Lakes are drawn as overlapping discs, one per flooded cell. At the cell
// sizes involved a rectangle fill produces a visible staircase; overlapping
// discs merge into an organic shoreline for a fraction of the effort of
// extracting a real contour.
function paintLakes(ctx, lakes, gridW, style, project, origin) {
  if (!lakes || lakes.length === 0) return;

  // On-screen size of one cell, derived from the projection so this is
  // correct at any zoom and for any export resolution.
  const cellPx = Math.abs(project.x(origin.x + origin.scale) - project.x(origin.x));
  const r = Math.max(0.6, cellPx * 0.78);

  ctx.save();
  ctx.fillStyle = style.river;
  ctx.globalAlpha = 0.95;
  ctx.beginPath();
  for (const lake of lakes) {
    for (const c of lake.cells) {
      const px = project.x(origin.x + ((c % gridW) + 0.5) * origin.scale);
      const py = project.y(origin.y + (((c / gridW) | 0) + 0.5) * origin.scale);
      ctx.moveTo(px + r, py);
      ctx.arc(px, py, r, 0, Math.PI * 2);
    }
  }
  ctx.fill();
  ctx.restore();
}

// Grouped into width bands so the whole network draws in a handful of paths
// rather than one stroke call per cell.
function paintRivers(ctx, segments, style, project, origin, unit) {
  if (!segments || segments.length === 0) return;

  const bands = [];
  for (let b = 0; b < RIVER_BANDS; b++) bands.push([]);
  for (let i = 0; i < segments.length; i += 5) bands[riverBandOf(segments[i + 4])].push(i);

  const wx = (cx) => origin.x + (cx + 0.5) * origin.scale;
  const wy = (cy) => origin.y + (cy + 0.5) * origin.scale;

  ctx.save();
  ctx.strokeStyle = style.river;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalAlpha = 0.92;

  for (let b = 0; b < RIVER_BANDS; b++) {
    if (bands[b].length === 0) continue;
    ctx.lineWidth = riverBandWidth(b, unit);
    ctx.beginPath();
    for (const i of bands[b]) {
      ctx.moveTo(project.x(wx(segments[i])), project.y(wy(segments[i + 1])));
      ctx.lineTo(project.x(wx(segments[i + 2])), project.y(wy(segments[i + 3])));
    }
    ctx.stroke();
  }
  ctx.restore();
}

// Returns the labels it actually drew, so callers (the SVG exporter) can
// reuse the same placement decisions instead of recomputing them.
function paintLabels(ctx, labels, style, project, opts) {
  const placed = [];
  if (!labels || labels.length === 0) return placed;

  const size = opts.size;
  ctx.save();
  ctx.font = `${style.italic ? "italic " : ""}600 ${size}px ${style.labelFont}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = `${style.labelTracking}em`;
  ctx.lineJoin = "round";

  for (const label of labels) {
    const x = project.x(label.x);
    const y = project.y(label.y);
    if (x < opts.marginX || y < opts.marginY ||
        x > opts.width - opts.marginX || y > opts.height - opts.marginY) continue;

    let blocked = false;
    for (const r of opts.avoid || []) {
      if (x > r.x0 - size * 3 && x < r.x1 + size * 3 &&
          y > r.y0 - size * 1.5 && y < r.y1 + size * 1.5) { blocked = true; break; }
    }
    if (blocked) continue;

    const w = ctx.measureText(label.text).width;
    for (const q of placed) {
      if (Math.abs(x - q.x) < (w + q.w) / 2 + size && Math.abs(y - q.y) < size * 2) {
        blocked = true;
        break;
      }
    }
    if (blocked) continue;

    const fill = label.water && style.italic ? "#5a6b7a" : style.labelInk;
    placed.push({ x, y, w, text: label.text, fill });

    ctx.lineWidth = size * 0.25;
    ctx.strokeStyle = style.labelHalo;
    ctx.strokeText(label.text, x, y);
    ctx.fillStyle = fill;
    ctx.fillText(label.text, x, y);
  }

  ctx.restore();
  return placed;
}

// ----------------------------------------------------------------- contours

// One honest probe of the world at a point, through whichever sampler is
// active. The inspector UI and the tests read exactly the values the renderer
// would paint there — moisture is skipped below sea level for the same reason
// computeWorldFields skips it: classify() never reads it for water.
function samplePoint(sampler, x, y, seaLevel) {
  const e = sampler.elevation(x, y);
  const m = e >= seaLevel ? sampler.moisture(x, y, e) : 0;
  const t = sampler.temperature(y, e);
  return { elevation: e, moisture: m, temperature: t, biome: classify(e, m, t, seaLevel) };
}

// Contour levels are fixed in elevation space — round metres on Earth, even
// steps above sea on generated worlds — so the same terrain always carries the
// same lines: zooming refines a contour's shape but never moves it.
function contourLevelsFor(source, seaLevel) {
  const out = [];
  if (source === "earth") {
    // Round-metre intervals, the convention of every topographic map. The
    // metres↔elevation relation is linear (the square in the byte encoding is
    // undone at decode), so this is exact, not approximate.
    const STEP_M = 500;
    for (let m = STEP_M; m <= EARTH.LAND_MAX; m += STEP_M) {
      const level = EARTH.SEA_LEVEL + (1 - EARTH.SEA_LEVEL) * (m / EARTH.LAND_MAX);
      if (level <= seaLevel + 0.005) continue; // drowned by a raised sea
      out.push({ level, major: m % 2000 === 0, label: m + " m" });
    }
  } else {
    const STEP = 0.05;
    for (let k = 1; k <= 11; k++) {
      const level = seaLevel + k * STEP;
      if (level >= 0.985) break;
      out.push({ level, major: k % 4 === 0, label: level.toFixed(2) });
    }
  }
  return out;
}

// Marching squares over the elevation grid. Each square of four samples is
// classified by which corners sit at or above the level, and the crossing
// points are interpolated along the edges. Output is per-level segment lists
// in the same cell coordinates the river segments use, so one projection
// serves both. `rowOk` optionally rejects rows — used to keep contours out of
// the beyond-the-poles void bands on Earth, where the clamped polar row would
// otherwise mirror its coastline into the backdrop.
function buildContours(elev, W, H, levels, rowOk) {
  const out = levels.map((l) => ({ level: l.level, major: l.major, segs: [] }));
  if (levels.length === 0) return out;
  const lvl = levels.map((l) => l.level);
  const first = lvl[0];

  for (let y = 0; y < H - 1; y++) {
    if (rowOk && !(rowOk(y) && rowOk(y + 1))) continue;
    const row = y * W;
    for (let x = 0; x < W - 1; x++) {
      const i = row + x;
      const tl = elev[i], tr = elev[i + 1], bl = elev[i + W], br = elev[i + W + 1];
      let lo = tl < tr ? tl : tr, hi = tl > tr ? tl : tr;
      if (bl < lo) lo = bl; else if (bl > hi) hi = bl;
      if (br < lo) lo = br; else if (br > hi) hi = br;
      if (hi < first) continue;

      for (let k = 0; k < lvl.length; k++) {
        const L = lvl[k];
        if (L <= lo) continue; // all four corners at or above: no crossing
        if (L > hi) break;     // levels ascend, nothing further crosses either

        // Edge crossings, interpolated. Each is only evaluated for cases
        // where its two corners genuinely straddle L, so the denominators
        // are never zero.
        const segs = out[k].segs;
        const top = () => x + (L - tl) / (tr - tl);
        const bottom = () => x + (L - bl) / (br - bl);
        const left = () => y + (L - tl) / (bl - tl);
        const right = () => y + (L - tr) / (br - tr);

        switch ((tl >= L ? 8 : 0) | (tr >= L ? 4 : 0) | (br >= L ? 2 : 0) | (bl >= L ? 1 : 0)) {
          case 1: case 14: segs.push(x, left(), bottom(), y + 1); break;
          case 2: case 13: segs.push(bottom(), y + 1, x + 1, right()); break;
          case 3: case 12: segs.push(x, left(), x + 1, right()); break;
          case 4: case 11: segs.push(top(), y, x + 1, right()); break;
          case 6: case 9: segs.push(top(), y, bottom(), y + 1); break;
          case 7: case 8: segs.push(top(), y, x, left()); break;
          // Saddles: two opposite corners above. Either pairing is a valid
          // contour; this one is applied consistently in both directions.
          case 5: segs.push(top(), y, x + 1, right(), x, left(), bottom(), y + 1); break;
          case 10: segs.push(top(), y, x, left(), bottom(), y + 1, x + 1, right()); break;
        }
      }
    }
  }
  return out;
}

// Minor contours in one path, majors in a second, heavier one — two stroke
// calls for the whole overlay regardless of how many levels are on screen.
function paintContours(ctx, contours, style, project, origin, unit) {
  if (!contours || contours.length === 0) return;

  const wx = (cx) => origin.x + (cx + 0.5) * origin.scale;
  const wy = (cy) => origin.y + (cy + 0.5) * origin.scale;

  ctx.save();
  ctx.strokeStyle = style.contour;
  ctx.lineCap = "round";

  for (const major of [false, true]) {
    ctx.lineWidth = (major ? 0.95 : 0.55) * unit;
    ctx.globalAlpha = major ? 0.5 : 0.32;
    ctx.beginPath();
    let any = false;
    for (const c of contours) {
      if (c.major !== major) continue;
      const s = c.segs;
      for (let i = 0; i < s.length; i += 4) {
        ctx.moveTo(project.x(wx(s[i])), project.y(wy(s[i + 1])));
        ctx.lineTo(project.x(wx(s[i + 2])), project.y(wy(s[i + 3])));
        any = true;
      }
    }
    if (any) ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- graticule

// Where to put the latitude/longitude grid for a given Earth view. The layout
// is computed once here so the canvas painter and the SVG exporter make the
// same choices — spacing, which lines, and what each is labelled.
function graticuleLayout(view) {
  const spanX = view.x1 - view.x0;
  const STEPS = [60, 45, 30, 15, 10, 5, 2, 1, 0.5, 0.25];
  let step = STEPS[0];
  for (const s of STEPS) {
    if (spanX / s <= 12) step = s;
    else break;
  }

  const deg = (v) => (Math.abs(v) % 1 ? Math.abs(v).toFixed(1) : String(Math.abs(v)));

  const meridians = [];
  for (let wx = Math.ceil(view.x0 / step) * step; wx <= view.x1; wx += step) {
    let lon = ((wx - 180) % 360 + 540) % 360 - 180;
    if (lon === -180) lon = 180;
    const suffix = lon === 0 || Math.abs(lon) === 180 ? "" : lon > 0 ? "E" : "W";
    meridians.push({ wx, text: `${deg(lon)}°${suffix}` });
  }

  const parallels = [];
  const yStart = Math.max(0, Math.ceil(view.y0 / step) * step);
  const yEnd = Math.min(180, view.y1);
  for (let wyv = yStart; wyv <= yEnd; wyv += step) {
    const lat = 90 - wyv;
    const suffix = lat === 0 ? "" : lat > 0 ? "N" : "S";
    parallels.push({ wy: wyv, text: `${deg(lat)}°${suffix}` });
  }

  // Latitude is finite: lines and meridian ends clip to the poles.
  return { step, meridians, parallels, y0: Math.max(0, view.y0), y1: Math.min(180, view.y1) };
}

function paintGraticule(ctx, style, project, view, opts) {
  const layout = graticuleLayout(view);
  const unit = opts.unit;
  const topY = project.y(layout.y0);
  const botY = project.y(layout.y1);

  ctx.save();
  ctx.strokeStyle = style.labelInk;
  ctx.globalAlpha = 0.22;
  ctx.lineWidth = Math.max(0.5, 0.6 * unit);
  ctx.beginPath();
  for (const m of layout.meridians) {
    const px = project.x(m.wx);
    ctx.moveTo(px, topY);
    ctx.lineTo(px, botY);
  }
  for (const p of layout.parallels) {
    const py = project.y(p.wy);
    ctx.moveTo(0, py);
    ctx.lineTo(opts.width, py);
  }
  ctx.stroke();

  ctx.globalAlpha = 1;
  ctx.font = `600 ${10 * unit}px ${style.labelFont}`;
  ctx.lineWidth = 3 * unit;
  ctx.strokeStyle = style.labelHalo;
  ctx.fillStyle = style.labelInk;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  const labelY = Math.min(opts.height - 6 * unit, botY - 6 * unit);
  for (const m of layout.meridians) {
    const px = project.x(m.wx);
    if (px < 20 * unit || px > opts.width - 20 * unit) continue;
    ctx.strokeText(m.text, px, labelY);
    ctx.fillText(m.text, px, labelY);
  }
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (const p of layout.parallels) {
    const py = project.y(p.wy);
    if (py < 14 * unit || py > opts.height - 14 * unit) continue;
    ctx.strokeText(p.text, opts.width - 8 * unit, py);
    ctx.fillText(p.text, opts.width - 8 * unit, py);
  }
  ctx.restore();
}

// A round-number bar sized to the view. Kilometres east–west genuinely shrink
// with latitude, so the label states which latitude the bar is true at rather
// than pretending one bar fits the whole frame.
function scaleBarSpec(kmPerPx, unit, latDeg) {
  if (!(kmPerPx > 0) || !isFinite(kmPerPx)) return null;
  const targetPx = 120 * unit;
  const raw = kmPerPx * targetPx;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  let km = mag;
  for (const m of [5, 2, 1]) {
    if (m * mag <= raw) { km = m * mag; break; }
  }
  if (km < 1) km = 1;
  const lat = Math.round(latDeg);
  const at = lat === 0 ? "the equator" : `${Math.abs(lat)}°${lat > 0 ? "N" : "S"}`;
  return { km, widthPx: km / kmPerPx, text: `${km.toLocaleString()} km · at ${at}` };
}

function paintScaleBar(ctx, style, opts) {
  const spec = scaleBarSpec(opts.kmPerPx, opts.unit, opts.latDeg);
  if (!spec) return;
  const unit = opts.unit;
  // Bottom centre: on screen the control panel owns the lower left and the
  // zoom buttons the lower right, and both corners crop worse when printed.
  const x0 = (opts.width - spec.widthPx) / 2;
  const y = opts.height - 26 * unit;
  const x1 = x0 + spec.widthPx;

  ctx.save();
  ctx.lineCap = "round";
  // Halo pass first so the bar stays legible over any terrain colour.
  for (const [color, w] of [[style.labelHalo, 5 * unit], [style.labelInk, 2 * unit]]) {
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.moveTo(x0, y - 5 * unit);
    ctx.lineTo(x0, y + 5 * unit);
    ctx.moveTo(x1, y - 5 * unit);
    ctx.lineTo(x1, y + 5 * unit);
    ctx.stroke();
  }
  ctx.font = `600 ${11 * unit}px ${style.labelFont}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.lineWidth = 3 * unit;
  ctx.strokeStyle = style.labelHalo;
  ctx.strokeText(spec.text, (x0 + x1) / 2, y - 7 * unit);
  ctx.fillStyle = style.labelInk;
  ctx.fillText(spec.text, (x0 + x1) / 2, y - 7 * unit);
  ctx.restore();
}

function makeGrainCanvas(size) {
  const g = document.createElement("canvas");
  g.width = g.height = size;
  const gc = g.getContext("2d");
  const img = gc.createImageData(size, size);
  const rnd = mulberry32(99);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + (rnd() - 0.5) * 90;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  gc.putImageData(img, 0, 0);
  return g;
}

function paintOverlays(ctx, width, height, style, grainCanvas) {
  if (style.grain > 0 && grainCanvas) {
    ctx.save();
    ctx.globalCompositeOperation = "overlay";
    ctx.globalAlpha = style.grain * 0.5;
    ctx.fillStyle = ctx.createPattern(grainCanvas, "repeat");
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  if (style.vignette > 0) {
    const grad = ctx.createRadialGradient(
      width / 2, height / 2, Math.min(width, height) * 0.32,
      width / 2, height / 2, Math.max(width, height) * 0.75,
    );
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, `rgba(24,16,6,${style.vignette})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }
}
