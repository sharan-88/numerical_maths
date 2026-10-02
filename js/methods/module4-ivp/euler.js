/**
 * Euler's Method
 * Solves dy/dx = f(x,y), y(x0)=y0 using y(n+1) = yn + h·f(xn,yn).
 */
import { odeSolve, odeRun, odeFields } from './odeCommon.js';

// ---------- Algorithm ----------
export function eulerMethod(f, x0, y0, h, N) {
  const r = odeSolve((x, y) => { const s = f(x, y); return { y: y + h * s, row: [s] }; }, f, x0, y0, h, N);
  r.rows.push([N, r.xs[N], r.ys[N], f(r.xs[N], r.ys[N])]); return r;
}

// ---------- Run: read inputs -> compute -> build result + visualization ----------
const runEuler = () => odeRun(eulerMethod, ['Step', 'x', 'y', 'f(x,y)']);

// ---------- Method definition (registered in js/modules.js) ----------
export default {
  title: "Euler's Method",
  desc: "Solves dy/dx = f(x,y), y(x0)=y0 using y(n+1) = yn + h·f(xn,yn).",
  fields: odeFields,
  run: runEuler,
};
