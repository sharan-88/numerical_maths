/**
 * Trapezoidal Rule
 * I ≈ h/2 [f(a) + 2Σf(xi) + f(b)].
 */
import { F } from '../../core/utils.js';
import { drawTrapezoids } from '../../viz/scene.js';
import { integrationRun, nodes } from './integrationCommon.js';

// ---------- Algorithm ----------
export function trapezoidalRule(f, a, b, n) {
  const { h, xs, ys } = nodes(f, a, b, n);
  return { h, xs, ys, I: h / 2 * (ys[0] + 2 * ys.slice(1, n).reduce((s, v) => s + v, 0) + ys[n]) };
}

// ---------- Run: read inputs -> compute -> build result + visualization ----------
function runTrapezoidal() {
  const c = integrationRun(trapezoidalRule), r = c.r;
  return { res: [['h', r.h], ['Integral ≈', r.I]], tables: [{ title: 'Function values', head: ['i', 'x_i', 'f(x_i)'], rows: r.xs.map((x, i) => [i, x, r.ys[i]]) }], draw: () => c.draw(() => drawTrapezoids(r.xs, r.ys)) };
}

// ---------- Method definition (registered in js/modules.js) ----------
export default {
  title: "Trapezoidal Rule",
  desc: "I ≈ h/2 [f(a) + 2Σf(xi) + f(b)].",
  fields: [
    F("f", "f(x)", "x*x", "expr"),
    F("a", "Lower limit a", "0"),
    F("b", "Upper limit b", "4"),
    F("n", "Intervals n", "8"),
  ],
  run: runTrapezoidal,
};
