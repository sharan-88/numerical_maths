/**
 * Shared by the Trapezoidal and Simpson methods: node generation + common input handling.
 */
import { fmt, chk } from '../../core/utils.js';
import { n, int, fx } from '../../core/readers.js';
import { interval } from '../../core/numerics.js';
import { begin2D, plotFunction, plotPoints, autoY } from '../../viz/scene.js';

export function nodes(f, a, b, n) {
  interval(a, b); const h = (b - a) / n, xs = [], ys = [];
  for (let i = 0; i <= n; i++) { const x = a + i * h; xs.push(x); ys.push(chk(f(x), `f(x) is not finite at x = ${fmt(x)}.`)); }
  return { h, xs, ys };
}

export function integrationRun(rule) {
  const f = fx('f', 'x'), a = n('a'), b = n('b'), nn = int('n'), r = rule(f, a, b, nn);
  return { f, a, b, r, nn, draw(fill) {
    const [y0, y1] = autoY(f, a, b, r.ys); begin2D(a, b, Math.min(0, y0), y1); plotFunction(f, a, b); fill();
    plotPoints(r.xs.map((x, i) => [x, r.ys[i]]));
  } };
}
