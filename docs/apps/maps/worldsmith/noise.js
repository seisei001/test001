// Noise primitives. Deterministic, seeded, dependency-free.
//
// Everything the world is built from bottoms out here: an integer-lattice
// hash, bilinear interpolation with a smootherstep curve (value noise), and
// two ways of stacking octaves — standard fBm for rolling terrain, ridged
// fBm for mountain spines.

function hash2(x, y, seed) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(seed | 0, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function smootherstep(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Gradient (Perlin-style) noise, returned in 0..1.
//
// Value noise — interpolating the hashed values themselves — is simpler, but it
// leaves the lattice visible: features line up with the grid, and once the
// domain is warped that bias smears into directional streaks across the
// terrain. Gradient noise hashes a *direction* at each lattice corner and
// interpolates the dot product with the offset instead, which is isotropic and
// has no such signature.
const GRAD2 = [
  [1, 1], [-1, 1], [1, -1], [-1, -1],
  [1, 0], [-1, 0], [0, 1], [0, -1],
];

function gradNoise2D(x, y, seed) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = smootherstep(xf);
  const v = smootherstep(yf);

  const g00 = GRAD2[(hash2(xi, yi, seed) * 8) & 7];
  const g10 = GRAD2[(hash2(xi + 1, yi, seed) * 8) & 7];
  const g01 = GRAD2[(hash2(xi, yi + 1, seed) * 8) & 7];
  const g11 = GRAD2[(hash2(xi + 1, yi + 1, seed) * 8) & 7];

  const n00 = g00[0] * xf + g00[1] * yf;
  const n10 = g10[0] * (xf - 1) + g10[1] * yf;
  const n01 = g01[0] * xf + g01[1] * (yf - 1);
  const n11 = g11[0] * (xf - 1) + g11[1] * (yf - 1);

  // Raw output spans about ±sqrt(2)/2, so this recentres it into 0..1.
  return lerp(lerp(n00, n10, u), lerp(n01, n11, u), v) * 0.7071 + 0.5;
}

// Fractal Brownian motion: octaves at rising frequency, falling amplitude.
function fbm(x, y, seed, octaves, lacunarity, gain) {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  let norm = 0;

  for (let i = 0; i < octaves; i++) {
    sum += amp * gradNoise2D(x * freq, y * freq, seed + i * 101);
    norm += amp;
    amp *= gain;
    freq *= lacunarity;
  }

  return norm > 0 ? sum / norm : 0;
}

// Ridged fBm: folding the noise about its midpoint turns smooth hills into
// sharp crests — this is what gives mountain ranges an actual spine.
function ridgedFbm(x, y, seed, octaves, lacunarity, gain) {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  let norm = 0;

  for (let i = 0; i < octaves; i++) {
    const n = gradNoise2D(x * freq, y * freq, seed + i * 131);
    let r = 1 - Math.abs(n * 2 - 1);
    r *= r;
    sum += amp * r;
    norm += amp;
    amp *= gain;
    freq *= lacunarity;
  }

  return norm > 0 ? sum / norm : 0;
}

// Small, fast seeded PRNG — used for naming, not for terrain.
function mulberry32(a) {
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
