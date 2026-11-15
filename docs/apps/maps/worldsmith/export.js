// Export formats.
//
// Every image export re-rasterizes the world at the requested resolution
// through render.js rather than upscaling the screen canvas, so a poster-sized
// map carries real detail instead of enlarged pixels.

const Exporter = (function () {
  "use strict";

  // ---------------------------------------------------------------- plumbing

  function download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  }

  function stamp(view) {
    return view.source === "earth" ? "worldsmith-earth" : `worldsmith-${view.seed}`;
  }

  // Builds the raster parameters for an export that covers the same world span
  // as the view on screen, at a different pixel resolution.
  function paramsFor(view, outW, outH) {
    const spanX = view.W * view.scale;
    return {
      W: outW,
      H: outH,
      originX: view.originX,
      originY: view.originY,
      scale: spanX / outW,
      seed: view.seed,
      octaves: view.octaves,
      seaLevel: view.seaLevel,
      // Built for this output's own resolution: an export rasterizes finer
      // than the screen, so it earns proportionally more synthesized detail.
      sampler: view.makeSampler(spanX / outW),
      bounds: view.bounds,
    };
  }

  function projectorFor(p, outW, outH) {
    const ppuX = outW / (p.W * p.scale);
    const ppuY = outH / (p.H * p.scale);
    return {
      x: (wx) => (wx - p.originX) * ppuX,
      y: (wy) => (wy - p.originY) * ppuY,
    };
  }

  // Progress is reported in two weighted phases because sampling the world
  // dominates: rasterizing the same grid is a fraction of the cost.
  function phased(report, from, to) {
    return (f) => report && report(from + (to - from) * f);
  }

  // Renders the full map — raster, rivers, labels, overlays — at any size.
  async function renderMap(view, outW, outH, report, cancelled) {
    const style = STYLES[view.style];
    const p = paramsFor(view, outW, outH);
    const supersample = view.scale / p.scale;

    const fields = await computeWorldFieldsAsync(p, phased(report, 0, 0.75), cancelled);
    if (!fields) return null;
    const { elev, moist } = fields;

    const reliefK = reliefStrength(view.zoom, supersample, style.shade);
    const img = await rasterizeFieldsAsync(elev, moist, p, style, reliefK,
      phased(report, 0.75, 0.97), cancelled);
    if (!img) return null;

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(img, 0, 0);

    const project = projectorFor(p, outW, outH);
    const origin = { x: p.originX, y: p.originY, scale: p.scale };

    let segments = [];
    if (view.showRivers) {
      const hydro = buildHydrology(elev, p.W, p.H, p.seaLevel, HYDRO.LAND_FRACTION,
        iceExcluder(elev, moist, p));
      segments = hydro.segments;
      paintLakes(ctx, hydro.lakes, p.W, style, project, origin);
      paintRivers(ctx, segments, style, project, origin, supersample);
    }

    if (view.showContours) {
      const contours = buildContours(elev, p.W, p.H,
        contourLevelsFor(view.source, p.seaLevel), boundsRowTest(p));
      paintContours(ctx, contours, style, project, origin, supersample);
    }

    if (view.showGrid && view.source === "earth") {
      const unit = supersample * view.dpr;
      paintGraticule(ctx, style, project, worldBounds(p), { width: outW, height: outH, unit });
      paintScaleBar(ctx, style, {
        width: outW, height: outH, unit,
        kmPerPx: kmPerPixel(p, outW), latDeg: 90 - (p.originY + p.H * p.scale / 2),
      });
    }

    paintOverlays(ctx, outW, outH, style, style.grain > 0 ? makeGrainCanvas(180) : null);

    let labels = [];
    let placed = [];
    if (view.showLabels) {
      labels = view.labels(worldBounds(p));
      placed = paintLabels(ctx, labels, style, project, {
        size: 13 * supersample * view.dpr,
        width: outW,
        height: outH,
        marginX: outW * 0.04,
        marginY: outH * 0.03,
        avoid: [],
      });
    }

    return { canvas, ctx, elev, moist, p, project, origin, segments, placed, supersample, style };
  }

  function worldBounds(p) {
    return {
      x0: p.originX,
      y0: p.originY,
      x1: p.originX + p.W * p.scale,
      y1: p.originY + p.H * p.scale,
    };
  }

  // Row predicate keeping contours out of the beyond-the-poles void bands.
  function boundsRowTest(p) {
    if (!p.bounds) return null;
    return (iy) => {
      const wy = iy * p.scale + p.originY;
      return wy >= p.bounds.y0 && wy <= p.bounds.y1;
    };
  }

  // Kilometres per output pixel, east–west at the view's centre latitude.
  function kmPerPixel(p, outW) {
    const degPerPx = (p.W * p.scale) / outW;
    const lat = Math.min(89, Math.max(-89, 90 - (p.originY + p.H * p.scale / 2)));
    return degPerPx * 111.32 * Math.cos(lat * Math.PI / 180);
  }

  // ------------------------------------------------------------------ image

  async function mapPNG(view, outW, report, cancelled) {
    const outH = Math.round(outW * (view.H / view.W));
    const result = await renderMap(view, outW, outH, report, cancelled);
    if (!result) return null;
    if (report) report(0.99);
    download(await canvasToBlob(result.canvas), `${stamp(view)}-${outW}x${outH}.png`);
    return `${outW}×${outH} PNG`;
  }

  // ------------------------------------------------------------- heightmaps

  // Square, because that is what terrain importers expect. Sizes are 2^n+1 so
  // they drop straight into Unity and Unreal without resampling.
  async function heightField(view, size, report, cancelled) {
    const spanX = view.W * view.scale;
    const spanY = view.H * view.scale;
    const span = Math.min(spanX, spanY);
    const p = {
      W: size,
      H: size,
      // Centre the square on the view rather than anchoring a corner.
      originX: view.originX + (spanX - span) / 2,
      originY: view.originY + (spanY - span) / 2,
      scale: span / size,
      seed: view.seed,
      octaves: view.octaves,
      seaLevel: view.seaLevel,
      sampler: view.makeSampler(span / size),
    };

    const elev = new Float32Array(size * size);
    let y = 0;
    while (y < size) {
      const started = performance.now();
      while (y < size && performance.now() - started < 12) {
        const wy = y * p.scale + p.originY;
        let i = y * size;
        for (let x = 0; x < size; x++, i++) {
          elev[i] = p.sampler.elevation(x * p.scale + p.originX, wy);
        }
        y++;
      }
      if (report) report(y / size);
      if (cancelled && cancelled()) return null;
      await new Promise((r) => setTimeout(r, 0));
    }
    return { elev, p };
  }

  async function heightmapPNG(view, size, report, cancelled) {
    const field = await heightField(view, size, phased(report, 0, 0.95), cancelled);
    if (!field) return null;
    const { elev } = field;
    const img = new ImageData(size, size);
    for (let i = 0, o = 0; i < elev.length; i++, o += 4) {
      const v = Math.round(Math.min(1, Math.max(0, elev[i])) * 255);
      img.data[o] = img.data[o + 1] = img.data[o + 2] = v;
      img.data[o + 3] = 255;
    }
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    canvas.getContext("2d").putImageData(img, 0, 0);
    download(await canvasToBlob(canvas), `${stamp(view)}-heightmap-${size}.png`);
    return `${size}×${size} 8-bit heightmap`;
  }

  // Raw 16-bit little-endian, the format Unity's terrain importer and World
  // Machine read directly. 8 bits per sample produces visible terracing on
  // real terrain, which is why this is offered alongside the PNG.
  async function heightmapRaw(view, size, report, cancelled) {
    const field = await heightField(view, size, phased(report, 0, 0.95), cancelled);
    if (!field) return null;
    const { elev } = field;
    const out = new Uint16Array(elev.length);
    for (let i = 0; i < elev.length; i++) {
      out[i] = Math.round(Math.min(1, Math.max(0, elev[i])) * 65535);
    }
    download(new Blob([out.buffer], { type: "application/octet-stream" }),
      `${stamp(view)}-heightmap-${size}.r16`);
    return `${size}×${size} 16-bit RAW`;
  }

  // -------------------------------------------------------------------- svg

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));
  }

  // The terrain is a raster by nature, so it is embedded as an image and the
  // rivers and labels ride on top as real vectors — those are the parts worth
  // editing in Illustrator or Inkscape, or printing at size.
  async function mapSVG(view, outW, report, cancelled) {
    const outH = Math.round(outW * (view.H / view.W));
    const style = STYLES[view.style];
    const p = paramsFor(view, outW, outH);
    const supersample = view.scale / p.scale;

    const fields = await computeWorldFieldsAsync(p, phased(report, 0, 0.75), cancelled);
    if (!fields) return null;
    const { elev, moist } = fields;

    const img = await rasterizeFieldsAsync(elev, moist, p, style,
      reliefStrength(view.zoom, supersample, style.shade),
      phased(report, 0.75, 0.95), cancelled);
    if (!img) return null;

    const base = document.createElement("canvas");
    base.width = outW;
    base.height = outH;
    const bctx = base.getContext("2d");
    bctx.putImageData(img, 0, 0);
    paintOverlays(bctx, outW, outH, style, style.grain > 0 ? makeGrainCanvas(180) : null);

    const project = projectorFor(p, outW, outH);
    const origin = { x: p.originX, y: p.originY, scale: p.scale };
    const parts = [];

    if (view.showRivers) {
      // The same solver the screen and the PNG exporter use. Calling the
      // segments-only helper here meant SVG exports silently shipped without
      // lakes while every other output had them.
      const hydro = buildHydrology(elev, p.W, p.H, p.seaLevel, HYDRO.LAND_FRACTION,
        iceExcluder(elev, moist, p));
      const segments = hydro.segments;
      const bands = [];
      for (let b = 0; b < 5; b++) bands.push([]);
      for (let i = 0; i < segments.length; i += 5) bands[riverBandOf(segments[i + 4])].push(i);

      const wx = (cx) => origin.x + (cx + 0.5) * origin.scale;
      const wy = (cy) => origin.y + (cy + 0.5) * origin.scale;

      // Lakes first so channels draw over them, matching the canvas order.
      if (hydro.lakes.length) {
        const cellPx = Math.abs(project.x(origin.x + origin.scale) - project.x(origin.x));
        const r = Math.max(0.6, cellPx * 0.78);
        parts.push(`<g id="lakes" fill="${style.river}" opacity="0.95">`);
        for (const lake of hydro.lakes) {
          for (const c of lake.cells) {
            const cx = project.x(wx(c % p.W)).toFixed(1);
            const cy = project.y(wy((c / p.W) | 0)).toFixed(1);
            parts.push(`<circle cx="${cx}" cy="${cy}" r="${r.toFixed(2)}"/>`);
          }
        }
        parts.push(`</g>`);
      }

      parts.push(`<g id="rivers" fill="none" stroke="${style.river}" stroke-linecap="round" opacity="0.92">`);
      for (let b = 0; b < 5; b++) {
        if (bands[b].length === 0) continue;
        const d = bands[b].map((i) =>
          `M${project.x(wx(segments[i])).toFixed(1)} ${project.y(wy(segments[i + 1])).toFixed(1)}` +
          `L${project.x(wx(segments[i + 2])).toFixed(1)} ${project.y(wy(segments[i + 3])).toFixed(1)}`).join("");
        parts.push(`<path stroke-width="${riverBandWidth(b, supersample).toFixed(2)}" d="${d}"/>`);
      }
      parts.push(`</g>`);
    }

    if (view.showContours) {
      // Real vectors, one path per level — the point of exporting SVG is that
      // an editor can restyle or thin these without touching the raster.
      const contours = buildContours(elev, p.W, p.H,
        contourLevelsFor(view.source, p.seaLevel), boundsRowTest(p));
      const wx = (cx) => origin.x + (cx + 0.5) * origin.scale;
      const wy = (cy) => origin.y + (cy + 0.5) * origin.scale;
      parts.push(`<g id="contours" fill="none" stroke="${style.contour}" stroke-linecap="round">`);
      for (const c of contours) {
        if (c.segs.length === 0) continue;
        let d = "";
        for (let i = 0; i < c.segs.length; i += 4) {
          d += `M${project.x(wx(c.segs[i])).toFixed(1)} ${project.y(wy(c.segs[i + 1])).toFixed(1)}` +
               `L${project.x(wx(c.segs[i + 2])).toFixed(1)} ${project.y(wy(c.segs[i + 3])).toFixed(1)}`;
        }
        parts.push(`<path stroke-width="${((c.major ? 0.95 : 0.55) * supersample).toFixed(2)}"` +
          ` opacity="${c.major ? 0.5 : 0.32}" d="${d}"/>`);
      }
      parts.push(`</g>`);
    }

    if (view.showGrid && view.source === "earth") {
      const unit = supersample * view.dpr;
      const layout = graticuleLayout(worldBounds(p));
      const topY = project.y(layout.y0).toFixed(1);
      const botY = project.y(layout.y1).toFixed(1);

      parts.push(`<g id="graticule" stroke="${style.labelInk}" opacity="0.22"` +
        ` stroke-width="${Math.max(0.5, 0.6 * unit).toFixed(2)}">`);
      for (const m of layout.meridians) {
        const px = project.x(m.wx).toFixed(1);
        parts.push(`<line x1="${px}" y1="${topY}" x2="${px}" y2="${botY}"/>`);
      }
      for (const pr of layout.parallels) {
        const py = project.y(pr.wy).toFixed(1);
        parts.push(`<line x1="0" y1="${py}" x2="${outW}" y2="${py}"/>`);
      }
      parts.push(`</g>`);

      parts.push(`<g id="graticule-labels" font-family="${esc(style.labelFont)}"` +
        ` font-size="${(10 * unit).toFixed(1)}" font-weight="600" fill="${style.labelInk}">`);
      const labelY = Math.min(outH - 6 * unit, parseFloat(botY) - 6 * unit).toFixed(1);
      for (const m of layout.meridians) {
        const px = project.x(m.wx);
        if (px < 20 * unit || px > outW - 20 * unit) continue;
        parts.push(`<text x="${px.toFixed(1)}" y="${labelY}" text-anchor="middle">${esc(m.text)}</text>`);
      }
      for (const pr of layout.parallels) {
        const py = project.y(pr.wy);
        if (py < 14 * unit || py > outH - 14 * unit) continue;
        parts.push(`<text x="${(outW - 8 * unit).toFixed(1)}" y="${py.toFixed(1)}"` +
          ` text-anchor="end" dominant-baseline="middle">${esc(pr.text)}</text>`);
      }
      parts.push(`</g>`);

      const spec = scaleBarSpec(kmPerPixel(p, outW), unit,
        90 - (p.originY + p.H * p.scale / 2));
      if (spec) {
        const x0 = (outW - spec.widthPx) / 2, y = outH - 26 * unit, x1 = x0 + spec.widthPx;
        parts.push(`<g id="scale-bar" stroke="${style.labelInk}" stroke-linecap="round"` +
          ` stroke-width="${(2 * unit).toFixed(2)}">`);
        parts.push(`<line x1="${x0.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y.toFixed(1)}"/>`);
        for (const xe of [x0, x1]) {
          parts.push(`<line x1="${xe.toFixed(1)}" y1="${(y - 5 * unit).toFixed(1)}"` +
            ` x2="${xe.toFixed(1)}" y2="${(y + 5 * unit).toFixed(1)}"/>`);
        }
        parts.push(`<text x="${((x0 + x1) / 2).toFixed(1)}" y="${(y - 7 * unit).toFixed(1)}"` +
          ` stroke="none" fill="${style.labelInk}" font-family="${esc(style.labelFont)}"` +
          ` font-size="${(11 * unit).toFixed(1)}" font-weight="600" text-anchor="middle">${esc(spec.text)}</text>`);
        parts.push(`</g>`);
      }
    }

    if (view.showLabels) {
      // Placement is decided by the same routine the canvas uses, on a scratch
      // context, so the SVG and the PNG put names in the same places.
      const labels = view.labels(worldBounds(p));
      const size = 13 * supersample * view.dpr;
      const scratch = document.createElement("canvas").getContext("2d");
      const placed = paintLabels(scratch, labels, style, project, {
        size, width: outW, height: outH,
        marginX: outW * 0.04, marginY: outH * 0.03, avoid: [],
      });

      parts.push(`<g id="labels" font-family="${esc(style.labelFont)}" font-size="${size.toFixed(1)}"` +
        ` font-weight="600"${style.italic ? ' font-style="italic"' : ""}` +
        ` letter-spacing="${(size * style.labelTracking).toFixed(2)}" text-anchor="middle">`);
      for (const l of placed) {
        const common = `x="${l.x.toFixed(1)}" y="${l.y.toFixed(1)}" dominant-baseline="middle"`;
        parts.push(`<text ${common} stroke="${style.labelHalo}" stroke-width="${(size * 0.25).toFixed(2)}"` +
          ` stroke-linejoin="round" fill="none">${esc(l.text)}</text>`);
        parts.push(`<text ${common} fill="${l.fill}">${esc(l.text)}</text>`);
      }
      parts.push(`</g>`);
    }

    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"` +
      ` width="${outW}" height="${outH}" viewBox="0 0 ${outW} ${outH}">\n` +
      `<title>${esc("Worldsmith map — seed " + view.seed)}</title>\n` +
      `<image x="0" y="0" width="${outW}" height="${outH}" xlink:href="${base.toDataURL("image/png")}"/>\n` +
      parts.join("\n") + `\n</svg>\n`;

    download(new Blob([svg], { type: "image/svg+xml" }), `${stamp(view)}-${outW}x${outH}.svg`);
    return `${outW}×${outH} SVG`;
  }

  // ------------------------------------------------------------------- json

  // Everything needed to reconstruct or script against this map: the exact
  // parameters, a biome census, and every named place with its world position.
  async function worldJSON(view, report, cancelled) {
    const outW = 1024;
    const outH = Math.round(outW * (view.H / view.W));
    const p = paramsFor(view, outW, outH);
    const fields = await computeWorldFieldsAsync(p, report, cancelled);
    if (!fields) return null;
    const { elev, moist } = fields;

    const census = new Array(BIOME_NAMES.length).fill(0);
    let land = 0, minE = 1, maxE = 0;
    for (let i = 0, iy = 0; iy < p.H; iy++) {
      const wy = iy * p.scale + p.originY;
      for (let ix = 0; ix < p.W; ix++, i++) {
        const e = elev[i];
        if (e < minE) minE = e;
        if (e > maxE) maxE = e;
        if (e >= p.seaLevel) land++;
        census[classify(e, moist[i], p.sampler.temperature(wy, e), p.seaLevel)]++;
      }
    }

    const total = p.W * p.H;
    const biomes = {};
    for (let b = 0; b < census.length; b++) {
      if (census[b] > 0) biomes[BIOME_NAMES[b]] = +(census[b] / total * 100).toFixed(2);
    }

    const bounds = worldBounds(p);
    const places = view.labels(bounds)
      .map((l) => ({
        name: l.text,
        x: +l.x.toFixed(3),
        y: +l.y.toFixed(3),
        biome: BIOME_NAMES[l.biome],
      }));

    const data = {
      generator: "Worldsmith",
      generatorUrl: "https://github.com/TheDatawiz-dot/Worldsmith",
      exported: new Date().toISOString(),
      permalink: location.href,
      world: {
        source: view.source,
        seed: view.seed,
        octaves: view.octaves,
        seaLevel: +view.seaLevel.toFixed(3),
        style: view.style,
      },
      view: {
        origin: { x: +view.originX.toFixed(4), y: +view.originY.toFixed(4) },
        span: { x: +(view.W * view.scale).toFixed(4), y: +(view.H * view.scale).toFixed(4) },
        zoom: +view.zoom.toFixed(3),
        bounds: {
          x0: +bounds.x0.toFixed(4), y0: +bounds.y0.toFixed(4),
          x1: +bounds.x1.toFixed(4), y1: +bounds.y1.toFixed(4),
        },
      },
      statistics: {
        landFraction: +(land / total).toFixed(4),
        elevationMin: +minE.toFixed(4),
        elevationMax: +maxE.toFixed(4),
        biomePercent: biomes,
      },
      places,
    };

    download(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
      `${stamp(view)}.json`);
    return `${places.length} places, ${Object.keys(biomes).length} biomes`;
  }

  // ------------------------------------------------------------------ router

  function run(format, size, view, report, cancelled) {
    switch (format) {
      case "png": return mapPNG(view, size, report, cancelled);
      case "svg": return mapSVG(view, size, report, cancelled);
      case "heightPng": return heightmapPNG(view, size, report, cancelled);
      case "heightRaw": return heightmapRaw(view, size, report, cancelled);
      case "json": return worldJSON(view, report, cancelled);
      default: return Promise.reject(new Error("Unknown export format: " + format));
    }
  }

  // Which size choices make sense for each format, and what the control should
  // be called. Heightmaps are square and 2^n+1; pictures are by output width.
  const FORMATS = {
    png: {
      label: "Map image (PNG)", sizeLabel: "Width",
      sizes: [[1920, "1920 px"], [2560, "2560 px"], [3840, "3840 px · 4K"], [5120, "5120 px · poster"]],
      def: 2560,
    },
    svg: {
      label: "Vector map (SVG)", sizeLabel: "Width",
      sizes: [[1920, "1920 px"], [2560, "2560 px"], [3840, "3840 px · 4K"]],
      def: 2560,
      note: "Rivers, contours, graticule and labels stay editable vectors.",
    },
    heightPng: {
      label: "Heightmap (PNG, 8-bit)", sizeLabel: "Resolution",
      sizes: [[513, "513²"], [1025, "1025²"], [2049, "2049²"], [4097, "4097²"]],
      def: 1025,
      note: "Grayscale elevation for Blender, Photoshop, or a displacement map.",
    },
    heightRaw: {
      label: "Heightmap (RAW, 16-bit)", sizeLabel: "Resolution",
      sizes: [[513, "513²"], [1025, "1025²"], [2049, "2049²"], [4097, "4097²"]],
      def: 1025,
      note: "Drops straight into Unity or Unreal terrain. No 8-bit terracing.",
    },
    json: {
      label: "World data (JSON)", sizeLabel: null, sizes: [], def: 0,
      note: "Seed, bounds, biome census, and every place name with coordinates.",
    },
  };

  return { run, FORMATS };
})();
