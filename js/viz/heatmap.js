/**
 * 2D heatmap (canvas) used by the heat and Laplace methods.
 */

export function heatmap(g) {
  const R = g.length, C = g[0].length, cell = Math.max(4, Math.floor(340 / Math.max(R, C)));
  const cv = document.createElement('canvas'); cv.className = 'heat'; cv.width = C * cell; cv.height = R * cell;
  const ctx = cv.getContext('2d'); let lo = Infinity, hi = -Infinity;
  g.forEach(r => r.forEach(v => { lo = Math.min(lo, v); hi = Math.max(hi, v); }));
  g.forEach((r, i) => r.forEach((v, j) => { ctx.fillStyle = `hsl(${(1 - (v - lo) / (hi - lo || 1)) * 240},85%,50%)`; ctx.fillRect(j * cell, i * cell, cell, cell); }));
  return cv;
}
