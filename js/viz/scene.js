/**
 * Three.js scene + all reusable drawing functions (2D plots drawn in the XY plane, 3D surfaces/planes in space).
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { $, fmt } from '../core/utils.js';
import { lagrangeAt } from '../core/numerics.js';

let renderer, scene, camera, controls;
export let group, V = null;   // V = current 2D view window
const labels = [];   // axis labels currently shown

export function setHint(text) { $('hint').textContent = text; }

export function initScene() {
  const wrap = $('canvas-wrap');
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  wrap.appendChild(renderer.domElement);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1220);
  camera = new THREE.PerspectiveCamera(50, 1, 0.1, 500);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  group = new THREE.Group();
  scene.add(group);
  const resize = () => {
    const w = wrap.clientWidth, h = wrap.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(wrap); resize();
  (function loop() { requestAnimationFrame(loop); controls.update(); renderer.render(scene, camera); updateLabels(); })();
}

export function clearScene() {
  labels.forEach(l => l.el.remove());
  labels.length = 0;
  while (group.children.length) {
    const o = group.children.pop();
    o.traverse(c => { if (c.geometry) c.geometry.dispose(); if (c.material) { if (c.material.map) c.material.map.dispose(); c.material.dispose(); } });
  }
  $('hint').textContent = '';
}

const P = (x, y, z = 0) => new THREE.Vector3((x - V.cx) * V.sx, (y - V.cy) * V.sy, z);

function niceStep(range) {
  const raw0 = range / 8, p = Math.pow(10, Math.floor(Math.log10(raw0)));
  return [1, 2, 5, 10].map(m => m * p).find(s => s >= raw0);
}

// Axis labels are plain HTML text laid over the canvas (crisp, never clipped by 3D).
function label(text, pos, axis) {
  const el = document.createElement('div');
  el.className = 'axis-label ' + axis;
  el.textContent = text;
  $('labels').appendChild(el);
  labels.push({ el, pos });
}
function updateLabels() {
  const w = renderer.domElement.clientWidth, h = renderer.domElement.clientHeight;
  labels.forEach(({ el, pos }) => {
    const v = pos.clone().project(camera);
    el.style.display = v.z < 1 ? 'block' : 'none';
    el.style.left = (v.x + 1) / 2 * w + 'px';
    el.style.top = (1 - v.y) / 2 * h + 'px';
  });
}

const segLine = (a, b, color) => group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), new THREE.LineBasicMaterial({ color })));

export function drawGrid() {   // 2D grid + tick labels
  const sx = niceStep(V.x1 - V.x0), sy = niceStep(V.y1 - V.y0);
  for (let x = Math.ceil(V.x0 / sx) * sx; x <= V.x1; x += sx) {
    segLine(P(x, V.y0, -0.02), P(x, V.y1, -0.02), 0x1e2d4d);
    label(String(+x.toPrecision(6)), P(x, V.y0), 'x');
  }
  for (let y = Math.ceil(V.y0 / sy) * sy; y <= V.y1; y += sy) {
    segLine(P(V.x0, y, -0.02), P(V.x1, y, -0.02), 0x1e2d4d);
    label(String(+y.toPrecision(6)), P(V.x0, y), 'y');
  }
}

export function drawAxes() {
  if (V.y0 <= 0 && V.y1 >= 0) segLine(P(V.x0, 0), P(V.x1, 0), 0x94a3b8);
  if (V.x0 <= 0 && V.x1 >= 0) segLine(P(0, V.y0), P(0, V.y1), 0x94a3b8);
}

export function begin2D(x0, x1, y0, y1) {
  if (!(x1 > x0)) { x0 -= 1; x1 += 1; }
  if (!(y1 > y0)) { y0 -= 1; y1 += 1; }
  const px = (x1 - x0) * 0.08, py = (y1 - y0) * 0.08;
  V = { x0: x0 - px, x1: x1 + px, y0: y0 - py, y1: y1 + py };
  V.cx = (V.x0 + V.x1) / 2; V.cy = (V.y0 + V.y1) / 2; V.sx = 14 / (V.x1 - V.x0); V.sy = 9 / (V.y1 - V.y0);
  camera.position.set(0, 0, 21); controls.target.set(0, 0, 0); controls.update();
  drawGrid(); drawAxes();
  $('hint').textContent = `x ∈ [${fmt(V.x0, 3)}, ${fmt(V.x1, 3)}]  y ∈ [${fmt(V.y0, 3)}, ${fmt(V.y1, 3)}] · drag = rotate, scroll = zoom`;
}

export function begin3D(text, centered = false) {
  V = null;
  camera.position.set(9, 8, 12); controls.target.set(0, centered ? 0 : 1.5, 0); controls.update();
  const grid = new THREE.GridHelper(10, 10, 0x64748b, 0x1e2d4d); group.add(grid);
  const o = centered ? [0, 0, 0] : [-5, 0, 5], L = centered ? [5, 5, 5] : [10, 5, -10];
  const v = (a, b, c) => new THREE.Vector3(a, b, c);
  segLine(v(...o), v(o[0] + (centered ? 5 : L[0]), o[1], o[2]), 0xef4444);
  segLine(v(...o), v(o[0], o[1] + L[1], o[2]), 0x22c55e);
  segLine(v(...o), v(o[0], o[1], o[2] + (centered ? 5 : L[2])), 0x3b82f6);
  $('hint').textContent = text + ' · drag = rotate, scroll = zoom';
}

export function plotCurve(pts, color = 0x38bdf8) {   // pts: [[x,y],...] ; null breaks the line
  let seg = [];
  const flush = () => { if (seg.length > 1) group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(seg), new THREE.LineBasicMaterial({ color }))); seg = []; };
  pts.forEach(p => p ? seg.push(P(p[0], p[1])) : flush()); flush();
}

export function plotFunction(f, a, b, color = 0x38bdf8) {
  const pts = [], m = V.y1 - V.y0;
  for (let i = 0; i <= 400; i++) { const x = a + (b - a) * i / 400, y = f(x); pts.push(isFinite(y) && y > V.y0 - m && y < V.y1 + m ? [x, y] : null); }
  plotCurve(pts, color);
}

export function plotPoints(pts, color = 0xf472b6, size = 9) {
  const g = new THREE.BufferGeometry().setFromPoints(pts.map(p => P(p[0], p[1], 0.05)));
  group.add(new THREE.Points(g, new THREE.PointsMaterial({ color, size, sizeAttenuation: false })));
}

export function marker(x, y, color = 0xef4444) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 16), new THREE.MeshBasicMaterial({ color }));
  m.position.copy(P(x, y, 0.1)); group.add(m);
}

function fillPoly(pts, color, op = 0.3) {
  const sh = new THREE.Shape(pts.map(p => { const q = P(p[0], p[1]); return new THREE.Vector2(q.x, q.y); }));
  const m = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op, side: THREE.DoubleSide, depthWrite: false }));
  m.position.z = -0.01; group.add(m);
}

export function drawTrapezoids(xs, ys) {
  for (let i = 0; i < xs.length - 1; i++) {
    const poly = [[xs[i], 0], [xs[i], ys[i]], [xs[i + 1], ys[i + 1]], [xs[i + 1], 0]];
    fillPoly(poly, 0x34d399, 0.35); plotCurve([...poly, poly[0]], 0x34d399);
  }
}

export function drawParabolicSegments(xs, f) {
  for (let i = 0; i + 2 < xs.length; i += 2) {
    const px = [xs[i], xs[i + 1], xs[i + 2]], py = px.map(f), curve = [];
    for (let k = 0; k <= 24; k++) { const t = px[0] + (px[2] - px[0]) * k / 24; curve.push([t, lagrangeAt(px, py, t).value]); }
    fillPoly([[px[0], 0], ...curve, [px[2], 0]], 0xa78bfa, 0.35); plotCurve(curve, 0xa78bfa);
    plotCurve([[px[0], 0], [px[0], py[0]]], 0xa78bfa); plotCurve([[px[2], 0], [px[2], py[2]]], 0xa78bfa);
  }
}

export function drawSolutionPath(xs, ys, color = 0xfacc15) { plotCurve(xs.map((x, i) => [x, ys[i]]), color); plotPoints(xs.map((x, i) => [x, ys[i]]), 0xf472b6); }

export function drawPlane(normal, center, color, size = 7) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }));
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal.clone().normalize());
  m.position.copy(center); group.add(m);
}

export function drawSurface(g) {   // rows -> z axis, columns -> x axis, value -> height (colour-coded)
  const R = g.length, C = g[0].length; let lo = Infinity, hi = -Infinity;
  g.forEach(r => r.forEach(v => { lo = Math.min(lo, v); hi = Math.max(hi, v); }));
  const span = hi - lo || 1, ps = [], col = [], idx = [], c = new THREE.Color();
  for (let i = 0; i < R; i++) for (let j = 0; j < C; j++) {
    const t = (g[i][j] - lo) / span; ps.push(j / (C - 1) * 10 - 5, t * 4, i / (R - 1) * 10 - 5);
    c.setHSL((1 - t) * 0.66, 0.85, 0.5); col.push(c.r, c.g, c.b);
  }
  for (let i = 0; i < R - 1; i++) for (let j = 0; j < C - 1; j++) { const a = i * C + j, d = a + C; idx.push(a, d, a + 1, a + 1, d, d + 1); }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(ps, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); geo.setIndex(idx);
  group.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide })));
  group.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.2 })));
  return [lo, hi];
}

export function autoY(f, a, b, extra = []) {
  const v = [0, ...extra];
  for (let i = 0; i <= 200; i++) { const y = f(a + (b - a) * i / 200); if (isFinite(y)) v.push(y); }
  v.sort((p, q) => p - q); const k = Math.floor(v.length * 0.02);
  return [v[k], v[v.length - 1 - k]];
}
