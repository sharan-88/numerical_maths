/**
 * Gauss-Jordan Method
 * Solves an n×n system with partial pivoting. Enter each row as: coefficients followed by the constant.
 */
import * as THREE from 'three';
import { F, fmt, matStr } from '../../core/utils.js';
import { raw } from '../../core/readers.js';
import { begin3D, drawPlane, group } from '../../viz/scene.js';

// ---------- Algorithm ----------
export function gaussJordan(A, b) {
  const n = A.length, M = A.map((r, i) => [...r, b[i]]), cp = () => M.map(r => [...r]), steps = [{ t: 'Original augmented matrix [A | B]', m: cp() }];
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-12) throw new Error('Singular matrix: zero pivot found, no unique solution.');
    if (p !== c) { [M[p], M[c]] = [M[c], M[p]]; steps.push({ t: `Swap R${c + 1} <-> R${p + 1} (partial pivoting)`, m: cp() }); }
    const pv = M[c][c]; M[c] = M[c].map(v => v / pv); steps.push({ t: `R${c + 1} = R${c + 1} / ${fmt(pv, 4)} (normalise)`, m: cp() });
    for (let r = 0; r < n; r++) {
      if (r === c || M[r][c] === 0) continue;
      const k = M[r][c]; M[r] = M[r].map((v, j) => v - k * M[c][j]); steps.push({ t: `R${r + 1} = R${r + 1} - (${fmt(k, 4)})·R${c + 1}`, m: cp() });
    }
  }
  return { x: M.map(r => r[n]), M, steps };
}

// ---------- Run: read inputs -> compute -> build result + visualization ----------
function runGaussJordan() {
  const rows = raw('mat').split('\n').map(s => s.trim()).filter(Boolean).map(s => s.split(/[\s,;]+/).map(Number)), N = rows.length;
  if (N < 2 || N > 10) throw new Error('Invalid matrix: use between 2 and 10 equations.');
  if (rows.some(r => r.length !== N + 1 || r.some(v => !isFinite(v)))) throw new Error(`Invalid matrix: each row needs exactly ${N + 1} valid numbers (${N} coefficients + constant).`);
  const A = rows.map(r => r.slice(0, N)), B = rows.map(r => r[N]), r = gaussJordan(A, B);
  return {
    res: r.x.map((v, i) => [N <= 3 ? 'xyz'[i] : `x${i + 1}`, v]),
    details: r.steps.map(s => s.t + '\n' + matStr(s.m)).join('\n\n') + '\n\nFinal reduced row echelon form is the last matrix above.',
    draw() {
      if (N !== 3) { begin3D('3D plane view is available for 3×3 systems only', true); return; }
      begin3D('Each equation is a plane; the red sphere is their intersection', true);
      const s = 4 / Math.max(1, ...r.x.map(Math.abs)), c = new THREE.Vector3(...r.x.map(v => v * s));
      A.forEach((row, i) => drawPlane(new THREE.Vector3(...row), c, [0x38bdf8, 0x34d399, 0xfacc15][i]));
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({ color: 0xef4444 })); m.position.copy(c); group.add(m);
    } };
}

// ---------- Method definition (registered in js/modules.js) ----------
export default {
  title: "Gauss-Jordan Method",
  desc: "Solves an n×n system with partial pivoting. Enter each row as: coefficients followed by the constant.",
  fields: [
    F("mat", "Augmented matrix [A | B] (one row per line)", "10 -1 2 6\n-1 11 -1 22\n2 -1 10 -10", "area"),
  ],
  run: runGaussJordan,
};
