/**
 * Fixed Point Iteration Method
 * Solves x = g(x) using x(n+1) = g(xn) until |x(n+1) − xn| < tolerance.
 */
import { F, fmt, chk } from '../../core/utils.js';
import { n, pos, int, fx } from '../../core/readers.js';
import { begin2D, plotCurve, plotFunction, marker } from '../../viz/scene.js';

// ---------- Algorithm ----------
export function fixedPointIteration(g, x0, tol, max) {
  const rows = []; let x = x0, conv = false, err = NaN;
  for (let i = 1; i <= max; i++) {
    const gx = chk(g(x), `g(x) is not finite at iteration ${i} (x = ${fmt(x)}). Check for division by zero or domain errors.`);
    err = Math.abs(gx - x); rows.push([i, x, gx, err]); x = gx;
    if (Math.abs(x) > 1e12) throw new Error('Non-convergent: the iteration diverges (|x| > 1e12). Choose a different g(x) or x0.');
    if (err < tol) { conv = true; break; }
  }
  return { root: x, rows, conv, err };
}

// ---------- Run: read inputs -> compute -> build result + visualization ----------
function runFixedPoint() {
  const g = fx('g', 'x'), x0 = n('x0'), tol = pos('tol'), max = int('max'), r = fixedPointIteration(g, x0, tol, max);
  return {
    res: [['Root', r.root], ['Iterations', r.rows.length], ['Final error', r.err]],
    warn: r.conv ? '' : "Did not converge within the maximum iterations (|g'(x)| is probably ≥ 1 near the root).",
    tables: [{ head: ['Iteration', 'x_n', 'g(x_n)', 'Error'], rows: r.rows }],
    draw() {
      const xs = [x0, r.root, ...r.rows.map(q => q[1])], lo = Math.min(...xs), hi = Math.max(...xs), w = Math.max(hi - lo, 1), a = lo - w * 0.3, b = hi + w * 0.3;
      begin2D(a, b, a, b); plotFunction(g, a, b); plotCurve([[a, a], [b, b]], 0xfacc15);
      const web = [[x0, x0]]; r.rows.forEach(q => { web.push([q[1], q[2]], [q[2], q[2]]); }); plotCurve(web, 0xf472b6); marker(r.root, r.root);
    } };
}

// ---------- Method definition (registered in js/modules.js) ----------
export default {
  title: "Fixed Point Iteration Method",
  desc: "Solves x = g(x) using x(n+1) = g(xn) until |x(n+1) − xn| < tolerance.",
  fields: [
    F("g", "g(x)", "(x + 4/x)/2", "expr"),
    F("x0", "Initial guess x0", "1"),
    F("tol", "Tolerance", "0.000001"),
    F("max", "Maximum iterations", "50"),
  ],
  run: runFixedPoint,
};
