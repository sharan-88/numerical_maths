/**
 * Inverse Interpolation
 * Finds x for a given y by applying Lagrange interpolation with x and y exchanged.
 */
import { F } from '../../core/utils.js';
import { n, list } from '../../core/readers.js';
import { lagrangeAt, checkData } from '../../core/numerics.js';
import { begin2D, plotCurve, plotPoints, marker, V } from '../../viz/scene.js';

// ---------- Algorithm ----------
export function inverseInterpolation(xs, ys, Y) { checkData(ys, xs, 'y'); return lagrangeAt(ys, xs, Y); }   // roles exchanged

// ---------- Run: read inputs -> compute -> build result + visualization ----------
function runInverse() {
  const xs = list('xs'), ys = list('ys'), Y = n('Y'), r = inverseInterpolation(xs, ys, Y), Q = t => lagrangeAt(ys, xs, t).value;
  return {
    res: [['Target y', Y], ['Calculated x', r.value]],
    warn: (Y < Math.min(...ys) || Y > Math.max(...ys)) ? 'Target y is outside the data range (extrapolation).' : '',
    tables: [{ title: 'Interpolation table (x and y exchanged)', head: ['i', 'y_i', 'x_i', 'L_i(Y)', 'x_i·L_i(Y)'], rows: ys.map((y, i) => [i, y, xs[i], r.L[i], xs[i] * r.L[i]]) }],
    draw() {
      const ya = Math.min(...ys, Y), yb = Math.max(...ys, Y), curve = [];
      for (let k = 0; k <= 200; k++) { const t = ya + (yb - ya) * k / 200; curve.push([Q(t), t]); }
      const xa = Math.min(...xs, r.value), xb = Math.max(...xs, r.value); begin2D(xa - 0.5, xb + 0.5, ya, yb);
      plotCurve(curve); plotPoints(xs.map((x, i) => [x, ys[i]])); plotCurve([[V.x0, Y], [r.value, Y], [r.value, V.y0]], 0xfacc15); marker(r.value, Y);
    } };
}

// ---------- Method definition (registered in js/modules.js) ----------
export default {
  title: "Inverse Interpolation",
  desc: "Finds x for a given y by applying Lagrange interpolation with x and y exchanged.",
  fields: [
    F("xs", "x values", "1, 2, 3, 4", "text"),
    F("ys", "y values", "1, 4, 9, 16", "text"),
    F("Y", "Target y", "6.25"),
  ],
  run: runInverse,
};
