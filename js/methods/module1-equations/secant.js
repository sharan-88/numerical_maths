/**
 * Secant Method
 * Finds a root of f(x) = 0 using two starting points and secant lines.
 */
import { F, fmt, chk } from '../../core/utils.js';
import { n, pos, int, fx } from '../../core/readers.js';
import { begin2D, plotFunction, plotPoints, marker, autoY } from '../../viz/scene.js';

// ---------- Algorithm ----------
export function secantMethod(f, x0, x1, tol, max) {
  let a = x0, b = x1, rows = [], conv = false, err = NaN, x2 = b;
  for (let i = 1; i <= max; i++) {
    const fa = chk(f(a), `f(${fmt(a)}) is not finite.`), fb = chk(f(b), `f(${fmt(b)}) is not finite.`);
    if (fa === fb) throw new Error('Division by zero: f(x1) = f(x0), the secant is horizontal. Choose different starting points.');
    x2 = b - fb * (b - a) / (fb - fa); err = Math.abs(x2 - b);
    rows.push([i, a, b, x2, f(x2), err]); a = b; b = x2;
    if (err < tol) { conv = true; break; }
  }
  return { root: x2, rows, conv, err };
}

// ---------- Run: read inputs -> compute -> build result + visualization ----------
function runSecant() {
  const f = fx('f', 'x'), x0 = n('x0'), x1 = n('x1'), tol = pos('tol'), max = int('max');
  if (x0 === x1) throw new Error('x0 and x1 must be different.');
  const r = secantMethod(f, x0, x1, tol, max), last = r.rows[r.rows.length - 1];
  return {
    res: [['Root', r.root], ['f(root)', f(r.root)], ['Iterations', r.rows.length], ['Final error', r.err]],
    warn: r.conv ? '' : 'Did not converge within the maximum iterations.',
    tables: [{ head: ['Iteration', 'x0', 'x1', 'x2', 'f(x2)', 'Error'], rows: r.rows }],
    draw() {
      const xs = r.rows.flatMap(q => [q[1], q[2], q[3]]), lo = Math.min(...xs), hi = Math.max(...xs), w = Math.max(hi - lo, 1), a = lo - w * 0.3, b = hi + w * 0.3;
      const [y0, y1] = autoY(f, a, b); begin2D(a, b, y0, y1); plotFunction(f, a, b);
      const fa = f(last[1]), m = (f(last[2]) - fa) / (last[2] - last[1]); plotFunction(x => fa + m * (x - last[1]), a, b, 0xfacc15);
      plotPoints(xs.map(x => [x, 0]), 0xf472b6); marker(r.root, 0);
    } };
}

// ---------- Method definition (registered in js/modules.js) ----------
export default {
  title: "Secant Method",
  desc: "Finds a root of f(x) = 0 using two starting points and secant lines.",
  fields: [
    F("f", "f(x)", "x*x - 4", "expr"),
    F("x0", "x0", "1"),
    F("x1", "x1", "3"),
    F("tol", "Tolerance", "0.000001"),
    F("max", "Maximum iterations", "50"),
  ],
  run: runSecant,
};
