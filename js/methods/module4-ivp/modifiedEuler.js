/**
 * Modified Euler's Method
 * Predictor-corrector: y* = yn + h·f(xn,yn); y(n+1) = yn + h/2 [f(xn,yn) + f(xn+1,y*)].
 */
import { odeSolve, odeRun, odeFields } from './odeCommon.js';

// ---------- Algorithm ----------
export function modifiedEuler(f, x0, y0, h, N) {
  return odeSolve((x, y) => { const yp = y + h * f(x, y), yc = y + h / 2 * (f(x, y) + f(x + h, yp)); return { y: yc, row: [yp, yc] }; }, f, x0, y0, h, N);
}

// ---------- Run: read inputs -> compute -> build result + visualization ----------
const runModifiedEuler = () => odeRun(modifiedEuler, ['Step', 'x', 'y', 'Predictor', 'Corrector']);

// ---------- Method definition (registered in js/modules.js) ----------
export default {
  title: "Modified Euler's Method",
  desc: "Predictor-corrector: y* = yn + h·f(xn,yn); y(n+1) = yn + h/2 [f(xn,yn) + f(xn+1,y*)].",
  fields: odeFields,
  run: runModifiedEuler,
};
