// Live canvas: view state, interaction, and UI wiring.
//
// The actual drawing lives in render.js, shared with the exporters. Nothing
// here touches the network.

(function () {
  "use strict";

  const canvas = document.getElementById("terrain");
  const ctx = canvas.getContext("2d");
  const buffer = document.createElement("canvas");
  const bctx = buffer.getContext("2d");

  const el = (id) => document.getElementById(id);
  const ui = {
    seed: el("seed"), randomize: el("randomize"),
    detail: el("detail"), detailVal: el("detailVal"),
    sea: el("sea"), seaVal: el("seaVal"), flood: el("flood"),
    style: el("style"),
    rivers: el("rivers"), labels: el("labels"),
    contours: el("contours"), grid: el("grid"),
    goto: el("goto"),
    source: el("source"), genOnly: Array.from(document.querySelectorAll(".gen-only")),
    earthOnly: Array.from(document.querySelectorAll(".earth-only")),
    inspector: el("inspector"), inspectorBody: el("inspectorBody"),
    inspectorClose: el("inspectorClose"), inspectorDot: el("inspectorDot"),
    detailNote: el("detailNote"),
    exportFormat: el("exportFormat"), exportSize: el("exportSize"),
    exportSizeRow: el("exportSizeRow"), exportSizeLabel: el("exportSizeLabel"),
    exportNote: el("exportNote"), exportRun: el("exportRun"),
    exportCancel: el("exportCancel"), exportProgress: el("exportProgress"),
    exportBar: el("exportBar"),
    zoomIn: el("zoomIn"), zoomOut: el("zoomOut"),
    copyLink: el("copyLink"),
    panel: el("panel"), toggle: el("toggle"), busy: el("busy"),
    status: el("status"),
  };

  const DRAG_DIVISOR = 7;
  const QUALITY_DIVISOR = 2.4;
  const MIN_ZOOM = 0.35;
  const MAX_ZOOM = 24;
  const LABEL_BUDGET = 16;

  const state = {
    source: "generated", // or "earth"
    seed: 1337,
    offsetX: 0,
    offsetY: 0,
    zoom: 1,
    octaves: 5,
    seaLevel: 0.42,
    style: "natural",
    showRivers: true,
    showLabels: true,
    showContours: false,
    showGrid: false,
  };

  const isEarth = () => state.source === "earth";

  // World units differ per source: generated worlds are unbounded and use an
  // arbitrary unit, Earth uses degrees and is 360 wide.
  const baseScale = () => (isEarth() ? EARTH.DEG_PER_CELL : WORLD.BASE_SCALE);
  const sampler = () => (isEarth()
    ? makeEarthSampler(state.octaves, baseScale() / state.zoom)
    : makeGeneratedSampler(state.seed, Math.max(2, state.octaves), state.seaLevel));

  // Cached per-view results, keyed so that changing only the style or sea
  // level never re-runs the expensive elevation pass.
  let fields = null;
  let fieldKey = "";
  let vectors = null;
  let vectorKey = "";
  let grain = null;

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const dprOf = () => canvas.width / canvas.clientWidth;

  // ------------------------------------------------------------------ params

  // The view is defined by the quality grid: that many cells at the base cell
  // scale is the world span on screen. Coarser grids (the drag preview) must
  // cover the same span with fewer cells, so their per-cell scale grows by
  // the cell-count ratio. Deriving both from one place is what keeps a drag
  // frame showing the same world as the frame it interrupts — scaling only
  // the cell count, as this once did, cropped every drag preview to a ~3×
  // zoom of the view's top-left corner.
  function qualityGridW() {
    return Math.max(64, Math.round(canvas.width / QUALITY_DIVISOR));
  }

  function rasterParams(W, H, cellScale) {
    return {
      W, H,
      originX: state.offsetX,
      originY: state.offsetY,
      scale: cellScale || baseScale() / state.zoom,
      seed: state.seed,
      octaves: state.octaves,
      seaLevel: state.seaLevel,
      sampler: sampler(),
      bounds: isEarth() ? { y0: 0, y1: 180 } : null,
    };
  }

  function viewKey(W, H) {
    return [state.source, state.seed, state.offsetX.toFixed(4), state.offsetY.toFixed(4),
      state.zoom.toFixed(4), state.octaves, W, H].join("|");
  }

  function projector(W, H, cellScale) {
    const scale = cellScale || baseScale() / state.zoom;
    const ppuX = (canvas.width / W) / scale;
    const ppuY = (canvas.height / H) / scale;
    return {
      x: (wx) => (wx - state.offsetX) * ppuX,
      y: (wy) => (wy - state.offsetY) * ppuY,
    };
  }

  // ------------------------------------------------------------------ render

  function ensureFields(p) {
    const key = viewKey(p.W, p.H);
    if (fieldKey === key && fields) return;
    fields = computeWorldFields(p);
    fieldKey = key;
  }

  // Contours drawn where Earth has no world — beyond the poles — would mirror
  // the clamped polar row into the backdrop, so rows outside the bounds are
  // rejected during the build rather than clipped at paint time.
  function contourRowTest(p) {
    if (!p.bounds) return null;
    return (iy) => {
      const wy = iy * p.scale + p.originY;
      return wy >= p.bounds.y0 && wy <= p.bounds.y1;
    };
  }

  function ensureVectors(W, H) {
    const key = viewKey(W, H) + "|" + state.seaLevel.toFixed(3) +
      (state.showContours ? "|c" : "");
    if (vectorKey === key && vectors) return;

    const p = rasterParams(W, H);
    vectors = {
      hydrology: buildHydrology(fields.elev, W, H, state.seaLevel, HYDRO.LAND_FRACTION,
        iceExcluder(fields.elev, fields.moist, p)),
      contours: state.showContours
        ? buildContours(fields.elev, W, H,
            contourLevelsFor(state.source, state.seaLevel), contourRowTest(p))
        : null,
      gridW: W,
      // Segments are in cell coordinates. Recording the world origin of that
      // grid lets a drag re-project them against the world rather than pinning
      // them to the screen while the terrain slides underneath.
      origin: { x: p.originX, y: p.originY, scale: p.scale },
      labels: labelsFor({
        x0: p.originX, y0: p.originY,
        x1: p.originX + W * p.scale, y1: p.originY + H * p.scale,
      }),
    };
    vectorKey = key;
  }

  // Earth gets real place names; invented ones would caption the Sahara with
  // something like "Drusel Peaks".
  function labelsFor(view) {
    return isEarth()
      ? earthLabels(view, state.seaLevel)
      : collectLabels(view, state.seed, state.octaves, state.seaLevel, LABEL_BUDGET);
  }

  // ------------------------------------------------- summary and provenance

  // How much of the elevation on screen is synthesized rather than sampled.
  // 0 for generated worlds (all of it is generated) and for Earth at or below
  // the data's own resolution.
  function earthSyntheticShare() {
    if (!isEarth() || state.octaves === 0 || EarthData.state() !== "ready") return 0;
    return clamp(1 - (baseScale() / state.zoom) / EarthData.texelDegrees(), 0, 1);
  }

  const BIOME_SUMMARY_LIMIT = 3;

  // Textual equivalent of the map. The canvas is unreadable to assistive
  // technology, so this is where a screen-reader user finds out what the
  // current view actually contains.
  function updateSummary() {
    if (!fields || !vectors) return;
    const { elev, moist } = fields;
    const sea = state.seaLevel;
    const p = rasterParams(vectors.gridW, Math.round(elev.length / vectors.gridW));

    let land = 0, minE = 1, maxE = 0, tSum = 0;
    const census = new Array(BIOME_NAMES.length).fill(0);
    // Every 3rd cell: the numbers are a summary, not an export, and this keeps
    // the pass off the critical path at full resolution.
    const STRIDE = 3;
    let sampled = 0;
    for (let i = 0; i < elev.length; i += STRIDE) {
      const e = elev[i];
      const wy = ((i / vectors.gridW) | 0) * p.scale + p.originY;
      const t = p.sampler.temperature(wy, e);
      census[classify(e, moist[i], t, sea)]++;
      sampled++;
      if (e >= sea) { land++; tSum += t; }
      if (e < minE) minE = e;
      if (e > maxE) maxE = e;
    }

    const landPct = sampled ? Math.round(land / sampled * 100) : 0;
    const topBiomes = census
      .map((n, b) => ({ n, b }))
      .filter((x) => x.n > 0 && x.b > B.BEACH)
      .sort((a, b) => b.n - a.n)
      .slice(0, BIOME_SUMMARY_LIMIT)
      .map((x) => BIOME_NAMES[x.b].toLowerCase());

    const hyd = vectors.hydrology;
    const metres = (e) => (isEarth()
      ? `${Math.round((e - EARTH.SEA_LEVEL) / (1 - EARTH.SEA_LEVEL) * EARTH.LAND_MAX)} m`
      : e.toFixed(2));

    el("sumMode").textContent = isEarth() ? "Earth (measured)" : `Generated · seed ${state.seed}`;
    el("sumLand").textContent = `${landPct}% of view`;
    el("sumElev").textContent = isEarth()
      ? `${metres(maxE)} peak`
      : `${minE.toFixed(2)}–${maxE.toFixed(2)}`;
    el("sumClimate").textContent = topBiomes.length ? topBiomes.join(", ") : "open ocean";
    // Outlets vs basins is the interesting distinction, so state both.
    el("sumRivers").textContent = `${hyd.outlets} reaching the sea`;
    el("sumLakes").textContent = hyd.basins
      ? `${hyd.basins} inland basin${hyd.basins === 1 ? "" : "s"}`
      : "none";
    el("sumPlaces").textContent = String(vectors.labels.length);
  }

  // Separates what is measured from what is calculated from what is invented.
  // Rebuilt on every state change because the answer genuinely differs between
  // modes and zoom levels.
  function updateProvenance() {
    const rows = [];
    const add = (kind, label, text) => rows.push({ kind, label, text });

    if (isEarth()) {
      add("measured", "Measured",
        "Elevation and seafloor sampled from the NOAA ETOPO1 global relief model, " +
        `about ${Math.round(EarthData.texelDegrees() * 111)} km per sample at ` +
        "12-bit precision (5 m steps). Nothing is clipped — Everest and the " +
        "Challenger Deep are both in range.");
      add("derived", "Derived",
        "Temperature from real latitude and real elevation at a 6.5 °C/km lapse rate. " +
        "Precipitation from the general circulation, not a precipitation dataset. " +
        "Biomes follow from those two.");
      add("derived", "Derived",
        "Rivers and lakes from D8 flow accumulation over the measured elevation.");

      const synth = earthSyntheticShare();
      if (synth > 0.01) {
        add("generated", "Invented",
          `Terrain detail below the data's resolution is fractal synthesis, currently ` +
          `${Math.round(synth * 100)}% blended in. Set Detail to 0 for measured elevation only.`);
      } else {
        add("measured", "Measured",
          "No synthesized terrain at this zoom — relief shown is measured elevation.");
      }
      add("measured", "Measured", "Place names are real geographic names.");
    } else {
      add("generated", "Invented",
        `Elevation is domain-warped fractal noise from seed ${state.seed}. ` +
        "Nothing here corresponds to a real place.");
      add("derived", "Derived",
        "Temperature from latitude and elevation; moisture from noise and continentality; " +
        "biomes follow from both.");
      add("derived", "Derived",
        "Rivers and lakes from D8 flow accumulation over that elevation.");
      add("generated", "Invented", "Place names are procedurally assembled syllables.");
    }

    el("provenance").innerHTML = rows.map((r) =>
      `<div class="prov-row"><span class="prov-tag prov-${r.kind}">${r.label}</span>` +
      `<span>${r.text}</span></div>`).join("");
  }

  // On Earth the control adds synthesized relief, and only once the view is
  // zoomed past what the heightmap can resolve. Saying so beats leaving the
  // slider looking broken at world view.
  function syncDetailNote() {
    if (!isEarth()) {
      ui.detailNote.hidden = true;
      return;
    }
    ui.detailNote.hidden = false;
    if (state.octaves === 0) {
      ui.detailNote.textContent = "Measured elevation only.";
      return;
    }
    const active = 1 - (baseScale() / state.zoom) / EarthData.texelDegrees();
    ui.detailNote.textContent = active > 0.01
      ? `Adding synthesized relief (${Math.round(active * 100)}%). Zoom in for more.`
      : "Zoom in past the data resolution to add detail.";
  }

  function panelRect() {
    if (ui.panel.classList.contains("hidden")) return null;
    const dpr = dprOf();
    const r = ui.panel.getBoundingClientRect();
    return { x0: r.left * dpr, y0: r.top * dpr, x1: r.right * dpr, y1: r.bottom * dpr };
  }

  function render(hq) {
    // Any synchronous repaint supersedes whatever refine pass was in flight;
    // letting it finish would smear a stale frame over this newer one.
    cancelRefine();
    const divisor = hq ? QUALITY_DIVISOR : DRAG_DIVISOR;
    const W = Math.max(64, Math.round(canvas.width / divisor));
    const H = Math.max(48, Math.round(canvas.height / divisor));
    const style = STYLES[state.style];
    // Same world span whatever the grid: coarser cells, not a smaller view.
    // The supersample ratio hands relief the same compensation exports use,
    // so a drag preview is a blurrier version of the frame it replaces, not
    // a differently-lit one.
    const supersample = W / qualityGridW();
    const cellScale = (baseScale() / state.zoom) / supersample;
    const p = rasterParams(W, H, cellScale);
    const dpr = dprOf();

    ensureFields(p);
    const img = rasterizeFields(fields.elev, fields.moist, p, style,
      reliefStrength(state.zoom, supersample, style.shade));

    buffer.width = W;
    buffer.height = H;
    bctx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(buffer, 0, 0, W, H, 0, 0, canvas.width, canvas.height);

    if (hq) ensureVectors(W, H);
    paintDecorations(projector(W, H, cellScale), style, {
      x0: p.originX, y0: p.originY,
      x1: p.originX + W * p.scale, y1: p.originY + H * p.scale,
    });

    if (hq) {
      updateSummary();
      updateProvenance();
    }
  }

  // Everything drawn over the terrain raster: hydrology, contours, the Earth
  // grid, labels, overlays and the inspector. Shared by the interactive
  // render and the native-resolution refine pass so the two can never drift.
  function paintDecorations(project, style, view) {
    const dpr = dprOf();

    if (state.showRivers && vectors) {
      // Lakes go under the channels so a river visibly runs into its basin.
      paintLakes(ctx, vectors.hydrology.lakes, vectors.gridW, style, project, vectors.origin);
      paintRivers(ctx, vectors.hydrology.segments, style, project, vectors.origin, dpr);
    }
    if (state.showContours && vectors && vectors.contours) {
      paintContours(ctx, vectors.contours, style, project, vectors.origin, dpr);
    }
    if (state.showGrid && isEarth()) {
      paintGraticule(ctx, style, project, view, {
        width: canvas.width, height: canvas.height, unit: dpr,
      });
      const degPerPx = (view.x1 - view.x0) / canvas.width;
      const latMid = 90 - (view.y0 + view.y1) / 2;
      const latClamped = clamp(latMid, -89, 89);
      paintScaleBar(ctx, style, {
        width: canvas.width, height: canvas.height, unit: dpr,
        kmPerPx: degPerPx * 111.32 * Math.cos(latClamped * Math.PI / 180),
        latDeg: latMid,
      });
    }
    if (state.showLabels && vectors) {
      const avoid = panelRect();
      paintLabels(ctx, vectors.labels, style, project, {
        size: 13 * dpr,
        width: canvas.width,
        height: canvas.height,
        marginX: 60 * dpr,
        marginY: 30 * dpr,
        avoid: avoid ? [avoid] : [],
      });
    }

    if (!grain && style.grain > 0) grain = makeGrainCanvas(180);
    paintOverlays(ctx, canvas.width, canvas.height, style, grain);

    // The inspector is pinned to a world coordinate, so every repaint —
    // including the coarse ones during a drag — re-projects it.
    refreshInspector();
  }

  // ------------------------------------------------------------------ refine

  // The quality grid is deliberately coarser than the canvas — that is what
  // keeps interaction fast — but at rest that coarseness *is* the blur: the
  // settled frame was being upscaled 2.4×. Once a frame settles, this
  // re-samples the same view near native resolution through the yielding
  // pipeline the exporters already use, and swaps it in. Any interaction
  // cancels it instantly, so the cost is only ever paid while the map is
  // sitting still.
  const REFINE_DIVISOR = 1.2;
  // On very large windows the async pass is capped so it finishes in a
  // couple of seconds instead of monopolising the tab.
  const REFINE_MAX_CELLS = 4.5e6;

  let refineJob = null;

  function cancelRefine() {
    if (refineJob) refineJob.cancelled = true;
    refineJob = null;
  }

  async function startRefine() {
    cancelRefine();
    const divisor = Math.max(REFINE_DIVISOR,
      Math.sqrt((canvas.width * canvas.height) / REFINE_MAX_CELLS));
    const W = Math.max(64, Math.round(canvas.width / divisor));
    const H = Math.max(48, Math.round(canvas.height / divisor));
    const Wq = qualityGridW();
    if (W <= Wq * 1.05) return; // tiny window: the quality grid is already native

    const style = STYLES[state.style];
    const supersample = W / Wq;
    const cellScale = (baseScale() / state.zoom) / supersample;
    const p = rasterParams(W, H, cellScale);

    const job = { cancelled: false };
    refineJob = job;
    const cancelled = () => job.cancelled;

    const f = await computeWorldFieldsAsync(p, null, cancelled);
    if (!f || job.cancelled) return;
    const img = await rasterizeFieldsAsync(f.elev, f.moist, p, style,
      reliefStrength(state.zoom, supersample, style.shade), null, cancelled);
    if (!img || job.cancelled) return;

    buffer.width = W;
    buffer.height = H;
    bctx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(buffer, 0, 0, W, H, 0, 0, canvas.width, canvas.height);
    // Vectors come from the cached quality-grid solve — they are strokes, so
    // they are resolution-independent; only the raster needed re-sampling.
    paintDecorations(projector(W, H, cellScale), style, {
      x0: p.originX, y0: p.originY,
      x1: p.originX + W * p.scale, y1: p.originY + H * p.scale,
    });
    if (refineJob === job) refineJob = null;
  }

  let frame = null;
  function schedule(hq) {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = null;
      render(hq);
    });
  }

  // A full-detail pass blocks for a couple hundred milliseconds, so the busy
  // indicator is given a chance to paint before the thread is handed to the
  // generator.
  //
  // requestAnimationFrame is the natural way to wait for that paint, but
  // browsers suspend it entirely while a tab is hidden. Scheduling the *first*
  // render through rAF alone meant a page opened in a background tab — a
  // cmd-click, a restored session, "open link in new tab" — never rendered at
  // all: the callback simply never ran, the canvas stayed black, and the busy
  // indicator was stuck on until something else forced a redraw.
  //
  // So: rAF when visible (guarantees the indicator paints first), and a plain
  // task when hidden, where there is no paint to wait for anyway.
  // Tokened so that when a new interaction supersedes an in-flight cycle,
  // the old cycle's completion cannot switch the indicator off while the new
  // cycle's refine is still running.
  let heavyToken = 0;

  function deferHeavy(work) {
    const token = ++heavyToken;
    ui.busy.classList.add("on");
    const settle = () => {
      if (token === heavyToken) ui.busy.classList.remove("on");
    };
    const run = () => {
      let result;
      try {
        result = work();
      } catch (err) {
        settle();
        throw err;
      }
      // The busy dot covers the whole cycle, refine included — it goes out
      // when the frame on screen is the best frame this view will get.
      if (result && typeof result.then === "function") result.then(settle, settle);
      else settle();
    };
    if (document.hidden) {
      yieldToBrowser().then(run);
    } else {
      requestAnimationFrame(() => setTimeout(run, 0));
    }
  }

  function renderHQ() {
    syncDetailNote();
    deferHeavy(() => {
      render(true);
      return startRefine();
    });
  }

  // Belt and braces for the case above: if anything was skipped while hidden,
  // repaint on the way back. Cheap — the field cache makes this a no-op when
  // the view is already current.
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) renderHQ();
  });

  // Earth is finite: longitude wraps, latitude stops at the poles. Generated
  // worlds are unbounded and need none of this.
  function earthFitZoom() {
    const W = qualityGridW();
    const H = Math.max(48, Math.round(canvas.height / QUALITY_DIVISOR));
    // Cover, not contain. Latitude is finite, so on any viewport taller than
    // 2:1 a contain fit letterboxes the planet between void bands — on a
    // portrait window more than half the screen was black backdrop. Filling
    // the frame crops longitude instead, and longitude wraps, so whatever is
    // cropped is a pan away; the void never stops being void. Screens wider
    // than 2:1 still see the whole planet, where the two fits agree.
    const scale = Math.min(360 / W, 180 / H);
    return clamp(EARTH.DEG_PER_CELL / scale, MIN_ZOOM, MAX_ZOOM);
  }

  function clampView() {
    if (!isEarth()) return;
    const W = Math.max(64, Math.round(canvas.width / QUALITY_DIVISOR));
    const H = Math.max(48, Math.round(canvas.height / QUALITY_DIVISOR));
    const scale = baseScale() / state.zoom;
    const spanY = H * scale;

    state.offsetX = ((state.offsetX % 360) + 360) % 360;
    state.offsetY = spanY >= 180
      ? (180 - spanY) / 2
      : clamp(state.offsetY, 0, 180 - spanY);
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  }

  let statusTimer = null;
  function setStatus(text, ms) {
    ui.status.textContent = text;
    clearTimeout(statusTimer);
    if (ms) statusTimer = setTimeout(() => { ui.status.textContent = ""; }, ms);
  }

  // --------------------------------------------------------------- url state

  function syncURL() {
    const p = new URLSearchParams({
      w: state.source,
      seed: state.seed,
      x: state.offsetX.toFixed(2),
      y: state.offsetY.toFixed(2),
      z: state.zoom.toFixed(2),
      d: state.octaves,
      s: state.seaLevel.toFixed(3),
      t: state.style,
      r: state.showRivers ? 1 : 0,
      l: state.showLabels ? 1 : 0,
      c: state.showContours ? 1 : 0,
      g: state.showGrid ? 1 : 0,
    });
    history.replaceState(null, "", "#" + p.toString());
  }

  // Reports whether the link carried an explicit viewport. A link that only
  // names the world (#w=earth) should still be framed to fit, not dropped at
  // the default zoom, which starts at the dateline and cuts Asia off.
  let urlHadView = false;

  function restoreFromURL() {
    if (!location.hash) return;
    const p = new URLSearchParams(location.hash.slice(1));
    const num = (k, fallback) => (p.has(k) && isFinite(parseFloat(p.get(k))) ? parseFloat(p.get(k)) : fallback);

    if (p.get("w") === "earth") state.source = "earth";
    state.seed = Math.trunc(num("seed", state.seed));
    state.offsetX = num("x", 0);
    state.offsetY = num("y", 0);
    urlHadView = p.has("z") && p.has("x") && p.has("y");
    state.zoom = clamp(num("z", 1), MIN_ZOOM, MAX_ZOOM);
    state.octaves = clamp(Math.trunc(num("d", 5)), 0, 8);
    state.seaLevel = clamp(num("s", 0.42), 0.25, 0.62);
    // hasOwnProperty, not a truthy lookup. `STYLES["__proto__"]` — and
    // "constructor", "toString", "valueOf" — resolve to inherited members of
    // Object.prototype, which are truthy, so a plain existence check let those
    // through as a style name. The renderer then read `.colors` off
    // Object.prototype, got undefined, and threw: blank canvas, dead app, from
    // nothing worse than a malformed shared link.
    const styleKey = p.get("t");
    if (styleKey && Object.prototype.hasOwnProperty.call(STYLES, styleKey)) {
      state.style = styleKey;
    }
    if (p.has("r")) state.showRivers = p.get("r") === "1";
    if (p.has("l")) state.showLabels = p.get("l") === "1";
    if (p.has("c")) state.showContours = p.get("c") === "1";
    if (p.has("g")) state.showGrid = p.get("g") === "1";
  }

  // -------------------------------------------------------------- inspector

  // Click a point, get the truth about it: the values are read through the
  // same sampler the renderer uses, so the card can never disagree with the
  // pixel under it. The probe is pinned to a world coordinate — pan and zoom
  // re-project it, and a reroll or sea-level change re-reads it.
  let inspecting = null; // { wx, wy } in world units, or null

  // Qualitative bands mirror the thresholds classify() uses, so "arid" here
  // and "desert" on the map never contradict each other.
  const qualTemp = (t) => (t < 0.2 ? "frigid" : t < 0.38 ? "cold" : t < 0.68 ? "temperate" : "hot");
  const qualMoist = (m) => (m < 0.24 ? "arid" : m < 0.42 ? "semi-arid" : m < 0.62 ? "moist" : "wet");

  function fmtLatLon(wx, wy) {
    const lat = 90 - wy;
    let lon = ((wx - 180) % 360 + 540) % 360 - 180;
    if (lon === -180) lon = 180;
    const deg = (v) => (Math.round(Math.abs(v) * 10) / 10).toString();
    return `${deg(lat)}°${lat >= 0 ? "N" : "S"} ${deg(lon)}°${lon >= 0 ? "E" : "W"}`;
  }

  function inspectorRows(wx, wy, s) {
    const water = s.biome <= B.SHALLOW;
    if (isEarth()) {
      const m = Math.round(EarthData.metresAt(wx, wy));
      const rows = [
        ["Location", fmtLatLon(wx, wy)],
        [water ? "Depth" : "Elevation", `${m.toLocaleString()} m`],
        ["Biome", BIOME_NAMES[s.biome]],
        // The 0..1 temperature spans roughly −30 to +30 °C (see earth.js).
        // Modelled, not measured — say so on the card itself.
        ["Temp.", `≈ ${Math.round(s.temperature * 60 - 30)} °C · modelled`],
      ];
      if (!water) rows.push(["Moisture", qualMoist(s.moisture) + " · modelled"]);
      return rows;
    }
    return [
      ["Point", `${wx.toFixed(2)}, ${wy.toFixed(2)}`],
      ["Elevation", s.elevation.toFixed(3)],
      ["Biome", BIOME_NAMES[s.biome]],
      ["Climate", qualTemp(s.temperature) + (water ? "" : " · " + qualMoist(s.moisture))],
    ];
  }

  function inspectAt(cssX, cssY) {
    const ppu = pixelsPerUnit();
    const wx = state.offsetX + cssX / ppu;
    const wy = state.offsetY + cssY / ppu;
    if (isEarth() && (wy < 0 || wy > 180)) return; // beyond the poles
    inspecting = { wx, wy };
    refreshInspector();
  }

  function closeInspector() {
    inspecting = null;
    ui.inspector.hidden = true;
    ui.inspectorDot.hidden = true;
  }

  function refreshInspector() {
    if (!inspecting) return;
    const { wx, wy } = inspecting;

    const ppu = pixelsPerUnit();
    const px = (wx - state.offsetX) * ppu;
    const py = (wy - state.offsetY) * ppu;
    const vw = window.innerWidth, vh = window.innerHeight;
    if (px < -20 || py < -20 || px > vw + 20 || py > vh + 20) {
      // Panned out of view: keep the probe, hide the chrome until it returns.
      ui.inspector.hidden = true;
      ui.inspectorDot.hidden = true;
      return;
    }

    const s = samplePoint(sampler(), wx, wy, state.seaLevel);
    ui.inspectorBody.innerHTML = inspectorRows(wx, wy, s)
      .map(([dt, dd]) => `<div><dt>${dt}</dt><dd>${dd}</dd></div>`).join("");

    ui.inspectorDot.style.left = px + "px";
    ui.inspectorDot.style.top = py + "px";
    ui.inspectorDot.hidden = false;

    ui.inspector.hidden = false;
    const r = ui.inspector.getBoundingClientRect();
    ui.inspector.style.left = clamp(px + 16, 8, vw - r.width - 8) + "px";
    ui.inspector.style.top = clamp(py + 16, 8, vh - r.height - 8) + "px";
  }

  ui.inspectorClose.addEventListener("click", closeInspector);

  // ----------------------------------------------------------- interactions

  let dragging = false;
  let moved = false;
  let lastX = 0, lastY = 0;

  // CSS pixels per world unit of the frame on screen. Derived from the
  // quality grid because that grid defines the view — deriving it from the
  // drag grid, as this once did, made every pan move the world at a third of
  // cursor speed and anchored wheel zooms to the wrong point.
  function pixelsPerUnit() {
    const scale = baseScale() / state.zoom;
    return (canvas.width / qualityGridW()) / scale / dprOf();
  }

  function panStart(x, y) {
    dragging = true;
    moved = false;
    lastX = x;
    lastY = y;
    canvas.classList.add("grabbing");
  }

  function panMove(x, y) {
    if (!dragging) return;
    const ppu = pixelsPerUnit();
    state.offsetX -= (x - lastX) / ppu;
    state.offsetY -= (y - lastY) / ppu;
    lastX = x;
    lastY = y;
    moved = true;
    clampView();
    schedule(false);
  }

  function panEnd() {
    if (!dragging) return;
    dragging = false;
    canvas.classList.remove("grabbing");
    if (moved) { renderHQ(); syncURL(); }
  }

  canvas.addEventListener("mousedown", (e) => panStart(e.clientX, e.clientY));
  window.addEventListener("mousemove", (e) => panMove(e.clientX, e.clientY));
  window.addEventListener("mouseup", (e) => {
    // A press that never moved is a click, and a click on the map is a probe.
    // `dragging` is only ever set by a mousedown on the canvas itself, so
    // panel clicks can't reach this.
    const wasTap = dragging && !moved && e.target === canvas;
    panEnd();
    if (wasTap) inspectAt(e.clientX, e.clientY);
  });

  // Touch: one finger pans, two pinch to zoom, double-tap zooms in. Reading
  // only touches[0] — as this did — leaves a touchscreen with no way to zoom
  // at all.
  let pinch = null;
  let lastTapAt = 0;
  let lastTapX = 0, lastTapY = 0;

  function pinchOf(touches) {
    const a = touches[0], b = touches[1];
    return {
      dist: Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY),
      cx: (a.clientX + b.clientX) / 2,
      cy: (a.clientY + b.clientY) / 2,
    };
  }

  canvas.addEventListener("touchstart", (e) => {
    if (e.touches.length >= 2) {
      pinch = pinchOf(e.touches);
      dragging = false;
      return;
    }
    pinch = null;
    panStart(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  canvas.addEventListener("touchmove", (e) => {
    if (e.touches.length >= 2) {
      const now = pinchOf(e.touches);
      if (pinch && pinch.dist > 0 && now.dist > 0) {
        zoomBy(now.dist / pinch.dist, now.cx, now.cy);
        // Dragging two fingers together should also pan, as it does in maps.
        const ppu = pixelsPerUnit();
        state.offsetX -= (now.cx - pinch.cx) / ppu;
        state.offsetY -= (now.cy - pinch.cy) / ppu;
        clampView();
        moved = true;
        schedule(false);
      }
      pinch = now;
      return;
    }
    panMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  canvas.addEventListener("touchend", (e) => {
    if (e.touches.length >= 1) {
      // Lifting one finger of a pinch hands control back to a single-finger pan.
      pinch = null;
      panStart(e.touches[0].clientX, e.touches[0].clientY);
      return;
    }

    const wasPinching = pinch !== null;
    pinch = null;

    if (!dragging && wasPinching) {
      renderHQ();
      syncURL();
      return;
    }

    const tapped = dragging && !moved;
    const touch = e.changedTouches[0];
    panEnd();

    if (tapped && touch) {
      const now = Date.now();
      const near = Math.hypot(touch.clientX - lastTapX, touch.clientY - lastTapY) < 40;
      if (now - lastTapAt < 320 && near) {
        zoomBy(1.8, touch.clientX, touch.clientY);
        renderHQ();
        syncURL();
        lastTapAt = 0;
      } else {
        lastTapAt = now;
        lastTapX = touch.clientX;
        lastTapY = touch.clientY;
        // A single tap probes the point, same as a mouse click. If a second
        // tap turns this into a double-tap zoom, the probe stays pinned to
        // its world coordinate and simply re-projects.
        inspectAt(touch.clientX, touch.clientY);
      }
    }
  });

  function zoomBy(factor, cx, cy) {
    const ppu = pixelsPerUnit();
    const wx = state.offsetX + cx / ppu;
    const wy = state.offsetY + cy / ppu;
    state.zoom = clamp(state.zoom * factor, MIN_ZOOM, MAX_ZOOM);
    const ppu2 = pixelsPerUnit();
    state.offsetX = wx - cx / ppu2;
    state.offsetY = wy - cy / ppu2;
    clampView();
  }

  let wheelTimer = null;
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoomBy(Math.exp(-e.deltaY * 0.0015), e.clientX, e.clientY);
    schedule(false);
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { renderHQ(); syncURL(); }, 160);
  }, { passive: false });

  // Keyboard: arrows pan, +/- zoom, R rerolls, H hides the panel.
  window.addEventListener("keydown", (e) => {
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT" || tag === "SELECT" || e.metaKey || e.ctrlKey || e.altKey) return;

    const step = e.shiftKey ? 240 : 80;
    const ppu = pixelsPerUnit();
    let handled = true;

    switch (e.key) {
      case "ArrowLeft": state.offsetX -= step / ppu; break;
      case "ArrowRight": state.offsetX += step / ppu; break;
      case "ArrowUp": state.offsetY -= step / ppu; break;
      case "ArrowDown": state.offsetY += step / ppu; break;
      case "+": case "=": zoomBy(1.25, canvas.clientWidth / 2, canvas.clientHeight / 2); break;
      case "-": case "_": zoomBy(0.8, canvas.clientWidth / 2, canvas.clientHeight / 2); break;
      case "r": case "R": reroll(); return;
      case "h": case "H": ui.panel.classList.toggle("hidden"); renderHQ(); return;
      case "Escape": closeInspector(); return;
      default: handled = false;
    }

    if (!handled) return;
    e.preventDefault();
    renderHQ();
    syncURL();
  });

  // ------------------------------------------------------------- ui wiring

  // Switching source changes what a world coordinate means, so the view is
  // reset to that source's natural starting point rather than carried across.
  function applySource(next, opts) {
    stopFlood();
    // World coordinates mean different things per source, so a pinned probe
    // from the other world would report nonsense. Drop it.
    closeInspector();
    state.source = next;
    for (const node of ui.genOnly) node.hidden = isEarth();
    for (const node of ui.earthOnly) node.hidden = !isEarth();

    ui.detail.min = isEarth() ? "0" : "2";
    if (!isEarth() && state.octaves < 2) state.octaves = 2;
    ui.detail.value = String(state.octaves);
    ui.detailVal.textContent = state.octaves;
    syncDetailNote();

    if (isEarth() && !(opts && opts.keepView)) {
      // Fill the frame with the classic world-map framing: equator centred,
      // longitude centred near 10°E so that when a tall viewport forces a
      // crop it lands mid-Pacific rather than through a continent. (An
      // earlier framing started at the dateline and cut Asia off entirely.)
      state.zoom = earthFitZoom();
      const scale = baseScale() / state.zoom;
      const W = qualityGridW();
      const H = Math.max(48, Math.round(canvas.height / QUALITY_DIVISOR));
      state.offsetX = 190 - (W * scale) / 2;
      state.offsetY = Math.max(0, (180 - H * scale) / 2);
    } else if (!isEarth() && !(opts && opts.keepView)) {
      state.zoom = 1;
      state.offsetX = 0;
      state.offsetY = 0;
    }

    if (!isEarth()) {
      clampView();
      renderHQ();
      syncURL();
      return;
    }

    setStatus("Loading Earth elevation data…");
    EarthData.load().then((ok) => {
      if (!ok) {
        setStatus(EarthData.message(), 12000);
        return;
      }
      clampView();
      renderHQ();
      syncURL();
      setStatus("", 1);
    });
  }

  function reroll() {
    state.seed = Math.floor(Math.random() * 1e9);
    ui.seed.value = state.seed;
    renderHQ();
    syncURL();
  }

  ui.seed.addEventListener("change", () => {
    const v = parseInt(ui.seed.value, 10);
    state.seed = isFinite(v) ? v : 0;
    renderHQ();
    syncURL();
  });

  ui.source.addEventListener("change", () => applySource(ui.source.value));

  ui.randomize.addEventListener("click", reroll);

  ui.detail.addEventListener("input", () => {
    state.octaves = parseInt(ui.detail.value, 10);
    ui.detailVal.textContent = state.octaves;
    renderHQ();
    syncURL();
  });

  function setSeaLevel(v) {
    state.seaLevel = v;
    ui.sea.value = String(Math.round(v * 1000));
    const pct = Math.round(v * 100);
    ui.seaVal.textContent = pct + "%";
    ui.sea.setAttribute("aria-valuetext", pct + " percent");
    // Sea level does not change the elevation field, only how it is read.
    render(true);
  }

  ui.sea.addEventListener("input", () => {
    stopFlood();
    setSeaLevel(parseInt(ui.sea.value, 10) / 1000);
  });
  ui.sea.addEventListener("change", () => { renderHQ(); syncURL(); });

  // ------------------------------------------------------- flood animation

  // Sweeps the sea from the current level to the maximum, drains it to the
  // minimum, and settles back where it started — the "watch the continents
  // drown" demo as a button instead of a steady hand on the slider. Purely a
  // view animation: it ends on the value it began with, and nothing about it
  // enters the URL or the exports.
  let flood = null; // { start, phase, last, raf }

  function stopFlood(atRest) {
    if (!flood) return;
    cancelAnimationFrame(flood.raf);
    flood = null;
    ui.flood.textContent = "▶";
    ui.flood.setAttribute("aria-pressed", "false");
    if (!atRest) { renderHQ(); syncURL(); }
  }

  ui.flood.addEventListener("click", () => {
    if (flood) { stopFlood(); return; }

    const MIN = parseInt(ui.sea.min, 10) / 1000;
    const MAX = parseInt(ui.sea.max, 10) / 1000;
    const RATE = 0.085; // elevation units per second — a full sweep in ~4s

    flood = { start: state.seaLevel, phase: 0, last: performance.now(), raf: 0 };
    ui.flood.textContent = "■";
    ui.flood.setAttribute("aria-pressed", "true");

    // rAF while the page is visible, a message-port task while it is hidden —
    // the same split deferHeavy uses, for the same reason: browsers suspend
    // rAF entirely in a hidden tab, and an animation scheduled only through
    // it would silently freeze mid-flood the moment the tab lost focus.
    const scheduleTick = () => {
      if (!flood) return;
      if (document.hidden) yieldToBrowser().then(() => tick(performance.now()));
      else flood.raf = requestAnimationFrame(tick);
    };

    const tick = (now) => {
      if (!flood) return;
      // Capped so a backgrounded tab resuming does not leap a whole phase.
      const dt = Math.min(0.05, (now - flood.last) / 1000);
      flood.last = now;
      let s = state.seaLevel;

      if (flood.phase === 0) {
        s += RATE * dt;
        if (s >= MAX) { s = MAX; flood.phase = 1; }
      } else if (flood.phase === 1) {
        s -= RATE * dt;
        if (s <= MIN) { s = MIN; flood.phase = 2; }
      } else {
        s += RATE * dt;
        if (s >= flood.start) {
          setSeaLevel(flood.start);
          stopFlood(true);
          renderHQ();
          syncURL();
          return;
        }
      }

      setSeaLevel(s);
      scheduleTick();
    };
    scheduleTick();
  });

  ui.style.addEventListener("change", () => {
    state.style = ui.style.value;
    grain = null;
    renderHQ();
    syncURL();
  });

  ui.rivers.addEventListener("change", () => {
    state.showRivers = ui.rivers.checked;
    renderHQ();
    syncURL();
  });

  ui.labels.addEventListener("change", () => {
    state.showLabels = ui.labels.checked;
    renderHQ();
    syncURL();
  });

  ui.contours.addEventListener("change", () => {
    state.showContours = ui.contours.checked;
    renderHQ();
    syncURL();
  });

  ui.grid.addEventListener("change", () => {
    state.showGrid = ui.grid.checked;
    renderHQ();
    syncURL();
  });

  // Jump straight to a named Earth feature. Oceans and continents get a wide
  // framing; mountain ranges, deserts and islands a closer one.
  const CONTINENT_SCALE = new Set([
    "Africa", "Europe", "Asia", "North America", "South America",
    "Australia", "Antarctica", "Greenland", "Siberia",
  ]);

  ui.goto.addEventListener("change", () => {
    const name = ui.goto.value;
    ui.goto.value = "";
    const place = EARTH_PLACES.find((entry) => entry[0] === name);
    if (!place || !isEarth()) return;

    const [, lat, lon, water] = place;
    state.zoom = clamp(water || CONTINENT_SCALE.has(name) ? 1.5 : 3.5, MIN_ZOOM, MAX_ZOOM);
    const scale = baseScale() / state.zoom;
    const W = Math.max(64, Math.round(canvas.width / QUALITY_DIVISOR));
    const H = Math.max(48, Math.round(canvas.height / QUALITY_DIVISOR));
    state.offsetX = (lon + 180) - (W * scale) / 2;
    state.offsetY = (90 - lat) - (H * scale) / 2;
    clampView();
    renderHQ();
    syncURL();
  });

  ui.copyLink.addEventListener("click", async () => {
    syncURL();
    try {
      await navigator.clipboard.writeText(location.href);
      setStatus("Link copied to clipboard", 1800);
    } catch (err) {
      window.prompt("Copy this link:", location.href);
    }
  });

  ui.toggle.addEventListener("click", () => {
    const hidden = ui.panel.classList.toggle("hidden");
    ui.toggle.setAttribute("aria-expanded", String(!hidden));
    ui.toggle.setAttribute("aria-label", hidden ? "Show control panel" : "Hide control panel");
    renderHQ();
  });

  // ---------------------------------------------------------------- exports

  function syncExportControls() {
    const spec = Exporter.FORMATS[ui.exportFormat.value];
    ui.exportNote.textContent = spec.note || "";
    ui.exportNote.hidden = !spec.note;

    if (spec.sizes.length === 0) {
      ui.exportSizeRow.hidden = true;
      return;
    }
    ui.exportSizeRow.hidden = false;
    ui.exportSizeLabel.textContent = spec.sizeLabel;
    ui.exportSize.innerHTML = "";
    for (const [value, label] of spec.sizes) {
      const opt = document.createElement("option");
      opt.value = String(value);
      opt.textContent = label;
      ui.exportSize.appendChild(opt);
    }
    ui.exportSize.value = String(spec.def);
  }

  ui.exportFormat.addEventListener("change", syncExportControls);

  // Exports run in yielding slices so the page keeps responding; this tracks
  // the one in flight so it can be reported on and cancelled.
  let exportJob = null;

  function endExport() {
    exportJob = null;
    ui.exportRun.disabled = false;
    ui.exportCancel.hidden = true;
    ui.exportProgress.hidden = true;
    ui.exportBar.style.width = "0%";
  }

  ui.exportRun.addEventListener("click", () => {
    if (exportJob) return;
    stopFlood(); // an export mid-animation would capture an arbitrary frame

    const format = ui.exportFormat.value;
    const size = parseInt(ui.exportSize.value, 10) || 0;
    const W = Math.max(64, Math.round(canvas.width / QUALITY_DIVISOR));
    const H = Math.max(48, Math.round(canvas.height / QUALITY_DIVISOR));

    const view = {
      W, H,
      originX: state.offsetX,
      originY: state.offsetY,
      scale: baseScale() / state.zoom,
      zoom: state.zoom,
      dpr: dprOf(),
      seed: state.seed,
      octaves: state.octaves,
      seaLevel: state.seaLevel,
      style: state.style,
      showRivers: state.showRivers,
      showLabels: state.showLabels,
      showContours: state.showContours,
      showGrid: state.showGrid,
      source: state.source,
      bounds: isEarth() ? { y0: 0, y1: 180 } : null,
      makeSampler: (cellDeg) => (isEarth()
        ? makeEarthSampler(state.octaves, cellDeg)
        : makeGeneratedSampler(state.seed, Math.max(2, state.octaves), state.seaLevel)),
      labels: labelsFor,
    };

    exportJob = { cancelled: false };
    const job = exportJob;

    ui.exportRun.disabled = true;
    ui.exportCancel.hidden = false;
    ui.exportProgress.hidden = false;
    ui.exportBar.style.width = "0%";
    setStatus("Rendering export…");

    // Only touch the DOM when the whole percent changes; writing style and
    // text on every slice would cost more than the slice itself.
    let shownPct = -1;
    const report = (f) => {
      if (job.cancelled) return;
      const pct = Math.max(0, Math.min(100, Math.round(f * 100)));
      if (pct === shownPct) return;
      shownPct = pct;
      ui.exportBar.style.width = pct + "%";
      ui.exportProgress.setAttribute("aria-valuenow", String(pct));
      setStatus(`Rendering export… ${pct}%`);
    };

    Exporter.run(format, size, view, report, () => job.cancelled)
      .then((summary) => {
        if (job.cancelled) { setStatus("Export cancelled", 2500); return; }
        setStatus("Exported " + summary, 3500);
      })
      .catch((err) => setStatus("Export failed: " + err.message, 5000))
      .finally(() => { if (exportJob === job) endExport(); });
  });

  ui.exportCancel.addEventListener("click", () => {
    if (exportJob) {
      exportJob.cancelled = true;
      setStatus("Cancelling…");
    }
  });

  ui.zoomIn.addEventListener("click", () => {
    zoomBy(1.6, canvas.clientWidth / 2, canvas.clientHeight / 2);
    renderHQ();
    syncURL();
  });

  ui.zoomOut.addEventListener("click", () => {
    zoomBy(1 / 1.6, canvas.clientWidth / 2, canvas.clientHeight / 2);
    renderHQ();
    syncURL();
  });

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resizeCanvas(); renderHQ(); }, 140);
  });

  // ------------------------------------------------------------------- init

  for (const key of Object.keys(STYLES)) {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = STYLES[key].label;
    ui.style.appendChild(opt);
  }

  for (const key of Object.keys(Exporter.FORMATS)) {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = Exporter.FORMATS[key].label;
    ui.exportFormat.appendChild(opt);
  }

  // Alphabetical, so the jump list is scannable; EARTH_PLACES is grouped by
  // feature kind for the labeller's benefit, not the reader's.
  {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Jump to a place…";
    ui.goto.appendChild(opt);
    for (const [name] of [...EARTH_PLACES].sort((a, b) => a[0].localeCompare(b[0]))) {
      const o = document.createElement("option");
      o.value = name;
      o.textContent = name;
      ui.goto.appendChild(o);
    }
  }

  restoreFromURL();
  ui.seed.value = state.seed;
  ui.detail.value = state.octaves;
  ui.detailVal.textContent = state.octaves;
  ui.sea.value = Math.round(state.seaLevel * 1000);
  ui.seaVal.textContent = Math.round(state.seaLevel * 100) + "%";
  ui.style.value = state.style;
  ui.rivers.checked = state.showRivers;
  ui.labels.checked = state.showLabels;
  ui.contours.checked = state.showContours;
  ui.grid.checked = state.showGrid;
  ui.source.value = state.source;
  for (const node of ui.genOnly) node.hidden = isEarth();
  for (const node of ui.earthOnly) node.hidden = !isEarth();
  ui.detail.min = isEarth() ? "0" : "2";
  if (!isEarth() && state.octaves < 2) state.octaves = 2;
  ui.detail.value = String(state.octaves);
  ui.detailVal.textContent = state.octaves;
  syncExportControls();

  resizeCanvas();
  if (isEarth()) {
    // A shared link with a viewport keeps it; a bare #w=earth gets framed.
    applySource("earth", { keepView: urlHadView });
  } else {
    renderHQ();
  }
})();
