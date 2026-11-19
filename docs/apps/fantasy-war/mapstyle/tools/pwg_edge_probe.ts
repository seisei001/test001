import { Pipeline } from '../src/gen/pipeline';
import { STAGES } from '../src/gen/stages';
import { resolve } from '../src/shared/config/resolve';
const seed = Number(process.argv[2]); const pins = JSON.parse(process.argv[3] || '{}');
const resolved = resolve({ seed, archetype: 'earth', pins } as any);
const p = new Pipeline(STAGES); let err = '';
await p.run(resolved, 'build', 1, (m: any) => { if (m.type === 'error') err = m.message; }, () => false);
if (err) throw new Error(err);
const hy: any = p.output('hydro')!.extra, n = hy.n, el = hy.elevation, wc = hy.waterClass;
const land = (i: number) => el[i] > 0 && wc[i] !== 1;
let tot = 0; for (let i = 0; i < n * n; i++) if (land(i)) tot++;
const k = 8; const s = { T: 0, B: 0, L: 0, R: 0 };
for (let y = 0; y < k; y++) for (let x = 0; x < n; x++) { if (land(y * n + x)) s.T++; if (land((n - 1 - y) * n + x)) s.B++; }
for (let x = 0; x < k; x++) for (let y = 0; y < n; y++) { if (land(y * n + x)) s.L++; if (land(y * n + n - 1 - x)) s.R++; }
const f = (v: number) => Math.round((100 * v) / (k * n));
console.log(JSON.stringify({ seed, pins, land: Math.round((100 * tot) / (n * n)), T: f(s.T), B: f(s.B), L: f(s.L), R: f(s.R), edgeMax: Math.max(f(s.T), f(s.B), f(s.L), f(s.R)) }));
