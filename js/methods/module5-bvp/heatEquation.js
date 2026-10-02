/**
 * 1-D Heat Equation (Explicit)
 * u_t = α u_xx with u(i,n+1) = u(i,n) + r[u(i+1,n) − 2u(i,n) + u(i−1,n)], r = αΔt/Δx² ≤ 0.5.
 */
import { F, fmt, matStr, sample } from '../../core/utils.js';
import { n, pos, int } from '../../core/readers.js';
import { begin3D, drawSurface, setHint } from '../../viz/scene.js';

// ---------- Algorithm ----------
export function heatEquationExplicit(L, N, alpha, dt, steps, T0, TL, TR) {
  const dx = L / (N - 1), r = alpha * dt / (dx * dx);
  if (r > 0.5) throw new Error(`Unstable: r = αΔt/Δx² = ${fmt(r, 4)} > 0.5. Reduce Δt or the number of points (Δx).`);
  let u = Array.from({ length: N }, (_, i) => i === 0 ? TL : i === N - 1 ? TR : T0); const grid = [u];
  for (let t = 0; t < steps; t++) {
    const nu = u.slice(); for (let i = 1; i < N - 1; i++) nu[i] = u[i] + r * (u[i + 1] - 2 * u[i] + u[i - 1]);
    grid.push(nu); u = nu;
  }
  return { grid, dx, r };
}

// ---------- Run: read inputs -> compute -> build result + visualization ----------
function runHeat() {
  const L = pos('L'), N = int('N', 3, 200), alpha = pos('alpha'), dt = pos('dt'), steps = int('steps', 1, 2000), r = heatEquationExplicit(L, N, alpha, dt, steps, n('T0'), n('TL'), n('TR'));
  const g = r.grid, idx = sample([...g.keys()], 12), fin = g[steps];
  return {
    res: [['Δx', r.dx], ['Δt', dt], ['r = αΔt/Δx²', r.r], ['Grid size (time × space)', `${steps + 1} × ${N}`], ['Final centre temperature', fin[Math.floor(N / 2)]], ['Final temperature profile', fin.map(v => fmt(v, 3)).join(', ')]],
    tables: [{ title: 'Temperature at selected time steps', head: ['Time Step', 'Temperature Values'], rows: idx.map(t => [`${t} (t=${fmt(t * dt, 4)})`, g[t].map(v => fmt(v, 2)).join('  ')]) }],
    details: 'Temperature matrix (rows = time steps, columns = x positions)\n' + matStr(g.slice(0, 80), 3) + (g.length > 80 ? '\n...' : ''),
    heat: g, heatTitle: 'Heatmap (x → right, time ↓ down)',
    draw() { begin3D(''); const [lo, hi] = drawSurface(g); setHint(`Surface: x = position, depth = time, height = temperature (${fmt(lo, 2)} to ${fmt(hi, 2)}) · drag = rotate, scroll = zoom`); }
  };
}

// ---------- Method definition (registered in js/modules.js) ----------
export default {
  title: "1-D Heat Equation (Explicit)",
  desc: "u_t = α u_xx with u(i,n+1) = u(i,n) + r[u(i+1,n) − 2u(i,n) + u(i−1,n)], r = αΔt/Δx² ≤ 0.5.",
  fields: [
    F("L", "Length L", "1"),
    F("N", "Number of spatial points", "11"),
    F("alpha", "Thermal diffusivity α", "1"),
    F("dt", "Time step Δt", "0.004"),
    F("steps", "Number of time steps", "50"),
    F("T0", "Initial temperature", "0"),
    F("TL", "Left boundary temperature", "100"),
    F("TR", "Right boundary temperature", "0"),
  ],
  run: runHeat,
};
