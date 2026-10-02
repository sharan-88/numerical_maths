/**
 * Curve Fitting
 * Least-squares fit using the normal equations.
 */
import { F, fmt, matStr } from '../../core/utils.js';
import { raw, n, list } from '../../core/readers.js';
import { checkData } from '../../core/numerics.js';
import { begin2D, plotFunction, plotPoints, marker, autoY } from '../../viz/scene.js';
import { gaussJordan } from '../module1-equations/gaussJordan.js';

// ---------- Algorithm ----------
export function curveFit(xs, ys, deg, X) {
  checkData(xs, ys, 'x'); if (xs.length < deg + 1) throw new Error(`Need at least ${deg + 1} points for this fit.`);
  const A = [], B = [];
  for (let j = 0; j <= deg; j++) {
    A.push([]); for (let k = 0; k <= deg; k++) A[j].push(xs.reduce((s, x) => s + Math.pow(x, j + k), 0));
    B.push(xs.reduce((s, x, i) => s + ys[i] * Math.pow(x, j), 0));
  }
  const c = gaussJordan(A, B).x, fit = x => c.reduce((s, cj, j) => s + cj * Math.pow(x, j), 0);
  const res = ys.map((y, i) => y - fit(xs[i])), sse = res.reduce((s, r) => s + r * r, 0), mean = ys.reduce((s, y) => s + y, 0) / ys.length;
  const sst = ys.reduce((s, y) => s + (y - mean) ** 2, 0);
  return { c, fit, res, sse, r2: sst ? 1 - sse / sst : 1, A, B, est: fit(X) };
}

// ---------- Run: read inputs -> compute -> build result + visualization ----------
function runCurveFit() {
  const xs = list('xs'), ys = list('ys'), deg = +raw('deg'), X = n('X'), r = curveFit(xs, ys, deg, X), names = 'abc';
  const eq = 'y = ' + r.c.map((c, j) => `${fmt(c, 4)}${j ? '·x' + (j > 1 ? '²' : '') : ''}`).join(' + ');
  return {
    res: [...r.c.map((c, j) => [`Coefficient ${names[j]}`, c]), ['Fitted equation', eq], ['Estimated y at query x', r.est], ['Sum of squared residuals', r.sse], ['R²', r.r2]],
    tables: [{ title: 'Residuals', head: ['x', 'y', 'fitted y', 'residual'], rows: xs.map((x, i) => [x, ys[i], r.fit(x), r.res[i]]) }],
    details: 'Normal equations  A·c = B\nA =\n' + matStr(r.A) + '\nB = [' + r.B.map(v => fmt(v, 4)).join(', ') + ']',
    draw() {
      const a = Math.min(...xs, X) - 0.5, b = Math.max(...xs, X) + 0.5, [y0, y1] = autoY(r.fit, a, b, ys); begin2D(a, b, y0, y1);
      plotFunction(r.fit, a, b); plotPoints(xs.map((x, i) => [x, ys[i]])); marker(X, r.est, 0x34d399);
    } };
}

// ---------- Method definition (registered in js/modules.js) ----------
export default {
  title: "Curve Fitting",
  desc: "Least-squares fit using the normal equations.",
  fields: [
    F("xs", "x values", "1, 2, 3, 4, 5", "text"),
    F("ys", "y values", "2.1, 3.9, 6.2, 7.8, 10.1", "text"),
    F("deg", "Fit type", "1", "select", [["1","Linear: y = a + bx"],["2","Quadratic: y = a + bx + cx²"]]),
    F("X", "Query x", "6"),
  ],
  run: runCurveFit,
};
