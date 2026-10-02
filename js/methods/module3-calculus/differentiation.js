/**
 * Numerical Differentiation
 * Approximates f'(x) with forward, backward or central differences.
 */
import { F, chk } from '../../core/utils.js';
import { raw, n, pos, fx } from '../../core/readers.js';
import { begin2D, plotFunction, plotPoints, marker, autoY } from '../../viz/scene.js';

// ---------- Algorithm ----------
export function numericalDifferentiation(f, x, h, kind) {
  const fp = f(x + h), fm = f(x - h), f0 = f(x);
  const d = kind === 'forward' ? (fp - f0) / h : kind === 'backward' ? (f0 - fm) / h : (fp - fm) / (2 * h);
  return chk(d, 'f(x) is not finite near the chosen point.');
}

// ---------- Run: read inputs -> compute -> build result + visualization ----------
function runDifferentiation() {
  const f = fx('f', 'x'), x = n('x'), h = pos('h'), kind = raw('kind'), d = numericalDifferentiation(f, x, h, kind), res = [['Method', kind], ["f'(x) ≈", d]];
  if (raw('exact')) { const e = fx('exact', 'x')(x); res.push(['Exact f\'(x)', e], ['Absolute error', Math.abs(e - d)]); }
  return {
    res, draw() {
      const a = x - 2, b = x + 2, [y0, y1] = autoY(f, a, b); begin2D(a, b, y0, y1); plotFunction(f, a, b);
      plotFunction(t => f(x) + d * (t - x), a, b, 0xfacc15); marker(x, f(x));
      plotPoints([[x + h, f(x + h)], [x - h, f(x - h)]].filter(p => (kind !== 'forward' || p[0] > x) && (kind !== 'backward' || p[0] < x)), 0xf472b6);
    } };
}

// ---------- Method definition (registered in js/modules.js) ----------
export default {
  title: "Numerical Differentiation",
  desc: "Approximates f'(x) with forward, backward or central differences.",
  fields: [
    F("f", "f(x)", "sin(x)", "expr"),
    F("x", "Point x", "1"),
    F("h", "Step h", "0.1"),
    F("kind", "Method", "central", "select", [["forward","Forward"],["backward","Backward"],["central","Central"]]),
    F("exact", "Exact f'(x) (optional)", "cos(x)", "expr"),
  ],
  run: runDifferentiation,
};
