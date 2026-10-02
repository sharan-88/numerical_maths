/**
 * Simpson's 1/3 Rule
 * I ≈ h/3 [f0 + 4(odd) + 2(even) + fn]; n must be even.
 */
import { F } from '../../core/utils.js';
import { drawParabolicSegments } from '../../viz/scene.js';
import { integrationRun, nodes } from './integrationCommon.js';

// ---------- Algorithm ----------
export function simpsonOneThird(f, a, b, n) {
  if (n % 2 !== 0) throw new Error("Simpson's 1/3 rule requires an even number of intervals n.");
  const { h, xs, ys } = nodes(f, a, b, n); let s = ys[0] + ys[n];
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * ys[i];
  return { h, xs, ys, I: h / 3 * s };
}

// ---------- Run: read inputs -> compute -> build result + visualization ----------
function runSimpson() {
  const c = integrationRun(simpsonOneThird), r = c.r;
  return { res: [['h', r.h], ['Integral ≈', r.I]], tables: [{ title: 'Function values', head: ['i', 'x_i', 'f(x_i)', 'weight'], rows: r.xs.map((x, i) => [i, x, r.ys[i], i === 0 || i === c.nn ? 1 : i % 2 ? 4 : 2]) }], draw: () => c.draw(() => drawParabolicSegments(r.xs, c.f)) };
}

// ---------- Method definition (registered in js/modules.js) ----------
export default {
  title: "Simpson's 1/3 Rule",
  desc: "I ≈ h/3 [f0 + 4(odd) + 2(even) + fn]; n must be even.",
  fields: [
    F("f", "f(x)", "x*x", "expr"),
    F("a", "Lower limit a", "0"),
    F("b", "Upper limit b", "4"),
    F("n", "Intervals n (even)", "8"),
  ],
  run: runSimpson,
};
