/**
 * Fourth-Order Runge-Kutta Method
 * Uses slopes k1..k4: y(n+1) = yn + (k1 + 2k2 + 2k3 + k4)/6.
 */
import { odeSolve, odeRun, odeFields } from './odeCommon.js';

// ---------- Algorithm ----------
export function rungeKutta4(f, x0, y0, h, N) {
  return odeSolve((x, y) => {
    const k1 = h * f(x, y), k2 = h * f(x + h / 2, y + k1 / 2), k3 = h * f(x + h / 2, y + k2 / 2), k4 = h * f(x + h, y + k3), yn = y + (k1 + 2 * k2 + 2 * k3 + k4) / 6;
    return { y: yn, row: [k1, k2, k3, k4, yn] };
  }, f, x0, y0, h, N);
}

// ---------- Run: read inputs -> compute -> build result + visualization ----------
const runRK4 = () => odeRun(rungeKutta4, ['Step', 'x', 'y', 'k1', 'k2', 'k3', 'k4', 'y_next']);

// ---------- Method definition (registered in js/modules.js) ----------
export default {
  title: "Fourth-Order Runge-Kutta Method",
  desc: "Uses slopes k1..k4: y(n+1) = yn + (k1 + 2k2 + 2k3 + k4)/6.",
  fields: odeFields,
  run: runRK4,
};
