/**
 * Two-Point BVP (Finite Difference)
 * Solves y'' + p(x)y' + q(x)y = r(x), y(a)=α, y(b)=β via a tridiagonal system. Default: y'' = 2 (exact solution y = x²).
 */
import { F, fmt, matStr, chk } from '../../core/utils.js';
import { n, int, fx } from '../../core/readers.js';
import { interval } from '../../core/numerics.js';
import { begin2D, plotCurve, plotPoints, marker } from '../../viz/scene.js';

// ---------- Algorithm ----------
export function finiteDifferenceBVP(p, q, r, a, b, ya, yb, n) {
  interval(a, b); const h = (b - a) / n, m = n - 1, lo = [], di = [], up = [], rhs = [], xs = [];
  for (let i = 0; i <= n; i++) xs.push(a + i * h);
  for (let i = 1; i < n; i++) {
    const x = xs[i], pi = p(x), qi = q(x), ri = r(x);
    chk(pi + qi + ri, `p, q or r is not finite at x = ${fmt(x)}.`);
    lo.push(1 / (h * h) - pi / (2 * h)); di.push(-2 / (h * h) + qi); up.push(1 / (h * h) + pi / (2 * h)); rhs.push(ri);
  }
  rhs[0] -= lo[0] * ya; rhs[m - 1] -= up[m - 1] * yb;
  const c = [], d = [], y = new Array(m);   // Thomas algorithm
  if (Math.abs(di[0]) < 1e-14) throw new Error('Zero pivot in Thomas algorithm.');
  c[0] = up[0] / di[0]; d[0] = rhs[0] / di[0];
  for (let i = 1; i < m; i++) {
    const den = di[i] - lo[i] * c[i - 1]; if (Math.abs(den) < 1e-14) throw new Error('Zero pivot in Thomas algorithm: system is singular.');
    c[i] = up[i] / den; d[i] = (rhs[i] - lo[i] * d[i - 1]) / den;
  }
  y[m - 1] = d[m - 1]; for (let i = m - 2; i >= 0; i--) y[i] = d[i] - c[i] * y[i + 1];
  return { xs, ys: [ya, ...y, yb], lo, di, up, rhs, h };
}

// ---------- Run: read inputs -> compute -> build result + visualization ----------
function runBVP() {
  const p = fx('p', 'x'), q = fx('q', 'x'), rf = fx('r', 'x'), a = n('a'), b = n('b'), ya = n('ya'), yb = n('yb'), N = int('n', 2, 500), r = finiteDifferenceBVP(p, q, rf, a, b, ya, yb, N), m = N - 1;
  let mat = 'Tridiagonal matrix:\n' + (m <= 10 ? matStr(Array.from({ length: m }, (_, i) => Array.from({ length: m }, (_, j) => j === i ? r.di[i] : j === i - 1 ? r.lo[i] : j === i + 1 ? r.up[i] : 0)), 3) : '(matrix too large to print; diagonals used by the Thomas algorithm)');
  const eqs = r.lo.slice(0, 6).map((l, i) => `(${fmt(l, 3)})·y${i} + (${fmt(r.di[i], 3)})·y${i + 1} + (${fmt(r.up[i], 3)})·y${i + 2} = ${fmt(r.rhs[i], 3)}`).join('\n');
  return {
    res: [['h', r.h], ['Unknowns', m], ['y at midpoint', r.ys[Math.floor(N / 2)]]],
    tables: [{ title: 'Numerical solution', head: ['i', 'x', 'y'], rows: r.xs.map((x, i) => [i, x, r.ys[i]]) }],
    details: 'Finite-difference equations (y0 = y(a), y' + N + ' = y(b); first six shown, boundary terms not yet moved to RHS):\n' + eqs + '\n\n' + mat,
    draw() {
      begin2D(a, b, Math.min(...r.ys), Math.max(...r.ys)); plotCurve(r.xs.map((x, i) => [x, r.ys[i]])); plotPoints(r.xs.map((x, i) => [x, r.ys[i]]), 0xf472b6);
      marker(a, ya); marker(b, yb);
    } };
}

// ---------- Method definition (registered in js/modules.js) ----------
export default {
  title: "Two-Point BVP (Finite Difference)",
  desc: "Solves y'' + p(x)y' + q(x)y = r(x), y(a)=α, y(b)=β via a tridiagonal system. Default: y'' = 2 (exact solution y = x²).",
  fields: [
    F("p", "p(x)", "0", "expr"),
    F("q", "q(x)", "0", "expr"),
    F("r", "r(x)", "2", "expr"),
    F("a", "a", "0"),
    F("b", "b", "1"),
    F("ya", "y(a)", "0"),
    F("yb", "y(b)", "1"),
    F("n", "Number of intervals", "10"),
  ],
  run: runBVP,
};
