/**
 * Small helpers: DOM shortcut, number formatting, text helpers.
 */

export const $ = id => document.getElementById(id);

export const F = (id, label, def, type = 'num', opts) => ({ id, label, def, type, opts });

export const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

export function fmt(v, d = 6) {
  if (typeof v !== 'number' || !isFinite(v)) return String(v);
  const a = Math.abs(v);
  return (a !== 0 && (a >= 1e9 || a < 1e-7)) ? v.toExponential(4) : v.toFixed(d);
}

export const matStr = (M, d = 4) => M.map(r => r.map(v => fmt(v, d).padStart(11)).join('')).join('\n');

export const sample = (arr, k = 14) => arr.length <= k ? arr : Array.from({ length: k }, (_, i) => arr[Math.round(i * (arr.length - 1) / (k - 1))]);

export const chk = (v, msg) => { if (!isFinite(v)) throw new Error(msg); return v; };
