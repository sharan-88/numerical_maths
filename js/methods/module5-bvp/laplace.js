/**
 * Laplace Equation (Finite Difference)
 * ∇²u = 0 on a rectangle; Gauss-Seidel with u(i,j) = [u(i+1,j)+u(i−1,j)+u(i,j+1)+u(i,j−1)]/4.
 */
import { F, fmt, matStr, sample } from '../../core/utils.js';
import { n, pos, int } from '../../core/readers.js';
import { begin3D, drawSurface, setHint } from '../../viz/scene.js';

// ---------- Algorithm ----------
export function laplaceEquation(R, C, top, bottom, left, right, max, tol) {
  const avg = (top + bottom + left + right) / 4;
  const u = Array.from({ length: R }, (_, i) => Array.from({ length: C }, (_, j) => i === 0 ? top : i === R - 1 ? bottom : j === 0 ? left : j === C - 1 ? right : avg));
  const hist = []; let conv = false, delta = Infinity;
  for (let it = 1; it <= max; it++) {
    delta = 0;
    for (let i = 1; i < R - 1; i++) for (let j = 1; j < C - 1; j++) {
      const v = (u[i + 1][j] + u[i - 1][j] + u[i][j + 1] + u[i][j - 1]) / 4; delta = Math.max(delta, Math.abs(v - u[i][j])); u[i][j] = v;
    }
    hist.push([it, delta]); if (delta < tol) { conv = true; break; }
  }
  return { u, hist, conv, delta };
}

// ---------- Run: read inputs -> compute -> build result + visualization ----------
function runLaplace() {
  const R = int('rows', 3, 60), C = int('cols', 3, 60), max = int('max'), tol = pos('tol'), s = laplaceEquation(R, C, n('top'), n('bottom'), n('left'), n('right'), max, tol);
  return {
    res: [['Iterations', s.hist.length], ['Maximum change', s.delta], ['Converged', s.conv ? 'Yes' : 'No']],
    warn: s.conv ? '' : 'Maximum iterations reached before the tolerance was met.',
    tables: [{ head: ['Iteration', 'Maximum Change'], rows: sample(s.hist, 15) }],
    details: 'Final grid (row 1 = top boundary)\n' + matStr(s.u, 3),
    heat: s.u, heatTitle: 'Heatmap (top row = top boundary)',
    draw() { begin3D(''); const [lo, hi] = drawSurface(s.u); setHint(`Surface: x, z = grid position, height = potential (${fmt(lo, 2)} to ${fmt(hi, 2)}) · drag = rotate, scroll = zoom`); }
  };
}

// ---------- Method definition (registered in js/modules.js) ----------
export default {
  title: "Laplace Equation (Finite Difference)",
  desc: "∇²u = 0 on a rectangle; Gauss-Seidel with u(i,j) = [u(i+1,j)+u(i−1,j)+u(i,j+1)+u(i,j−1)]/4.",
  fields: [
    F("rows", "Grid rows", "8"),
    F("cols", "Grid columns", "8"),
    F("top", "Top boundary", "100"),
    F("bottom", "Bottom boundary", "0"),
    F("left", "Left boundary", "0"),
    F("right", "Right boundary", "0"),
    F("max", "Maximum iterations", "2000"),
    F("tol", "Tolerance", "0.00001"),
  ],
  run: runLaplace,
};
