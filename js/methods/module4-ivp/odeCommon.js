/**
 * Shared by Euler, Modified Euler and RK4: default fields, generic marching driver, common run().
 */
import { F, chk } from '../../core/utils.js';
import { n, int, fx } from '../../core/readers.js';
import { begin2D, marker, drawSolutionPath } from '../../viz/scene.js';

export const odeFields = [F('f', 'f(x, y)', 'y - x*x + 1', 'expr'), F('x0', 'x0', '0'), F('y0', 'y0', '0.5'), F('h', 'Step size h', '0.1'), F('steps', 'Number of steps', '10')];

export function odeSolve(step, f, x0, y0, h, N) {   // generic driver; step() returns {y, row}
  const xs = [x0], ys = [y0], rows = [];
  for (let i = 0; i < N; i++) {
    const r = step(xs[i], ys[i]); chk(r.y, `Solution became non-finite at step ${i + 1}.`);
    rows.push([i, xs[i], ys[i], ...r.row]); xs.push(x0 + (i + 1) * h); ys.push(r.y);
  }
  return { xs, ys, rows };
}

export function odeRun(solver, head, withRows) {
  const f = fx('f', 'x', 'y'), x0 = n('x0'), y0 = n('y0'), h = n('h'), N = int('steps');
  if (h === 0) throw new Error('Step size h cannot be zero.');
  const r = solver(f, x0, y0, h, N);
  return { res: [['x_final', r.xs[N]], ['y_final', r.ys[N]], ['Steps', N]], tables: [{ head, rows: r.rows }], draw() {
    begin2D(Math.min(...r.xs), Math.max(...r.xs), Math.min(...r.ys), Math.max(...r.ys)); drawSolutionPath(r.xs, r.ys); marker(x0, y0, 0x34d399);
  } };
}
