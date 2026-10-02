/**
 * Lagrange Interpolation
 * P(x) = Σ yi·Li(x) through the given data points.
 */
import { F } from '../../core/utils.js';
import { n, list } from '../../core/readers.js';
import { lagrangeAt, checkData } from '../../core/numerics.js';
import { begin2D, plotFunction, plotPoints, marker, autoY } from '../../viz/scene.js';

// ---------- Algorithm ----------
export function lagrangeInterpolation(xs, ys, X) { checkData(xs, ys, 'x'); return lagrangeAt(xs, ys, X); }

// ---------- Run: read inputs -> compute -> build result + visualization ----------
function runLagrange() {
  const xs = list('xs'), ys = list('ys'), X = n('X'), r = lagrangeInterpolation(xs, ys, X), P2 = t => lagrangeAt(xs, ys, t).value;
  return {
    res: [['P(X)', r.value]],
    warn: (X < Math.min(...xs) || X > Math.max(...xs)) ? 'X is outside the data range (extrapolation).' : '',
    tables: [{ title: 'Calculation table', head: ['i', 'x_i', 'y_i', 'L_i(X)', 'y_i·L_i(X)'], rows: xs.map((x, i) => [i, x, ys[i], r.L[i], ys[i] * r.L[i]]) }],
    draw() {
      const a = Math.min(...xs, X) - 0.5, b = Math.max(...xs, X) + 0.5, [y0, y1] = autoY(P2, a, b, ys); begin2D(a, b, y0, y1);
      plotFunction(P2, a, b); plotPoints(xs.map((x, i) => [x, ys[i]])); marker(X, r.value);
    } };
}

// ---------- Method definition (registered in js/modules.js) ----------
export default {
  title: "Lagrange Interpolation",
  desc: "P(x) = Σ yi·Li(x) through the given data points.",
  fields: [
    F("xs", "x values", "1, 2, 3, 4", "text"),
    F("ys", "y values", "1, 4, 9, 16", "text"),
    F("X", "Interpolation point X", "2.5"),
  ],
  run: runLagrange,
};
