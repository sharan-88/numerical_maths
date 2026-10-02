/**
 * Result panel rendering: key/value results, iteration tables, calculation details.
 */
import { $, esc, fmt } from '../core/utils.js';
import { raw } from '../core/readers.js';
import { heatmap } from '../viz/heatmap.js';

const cell = v => typeof v === 'number' ? (Number.isInteger(v) ? String(v) : fmt(v)) : esc(v);

function tbl(head, rows) {   // 8. ITERATION TABLES are built with this helper
  return `<div class="scroll"><table><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(v => `<td>${cell(v)}</td>`).join('')}</tr>`).join('')}</table></div>`;
}

export function render(method, r) {
  const summary = method.fields.map(f => `${f.label}: ${raw(f.id).replace(/\n/g, ' / ') || '(none)'}`).join('; ');
  let h = `<h3>Method</h3><p>${esc(method.title)}</p><h3>Input summary</h3><p class="mono">${esc(summary)}</p><h3>Result</h3><table class="kv">${r.res.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${cell(v)}</td></tr>`).join('')}</table>`;
  if (r.warn) h += `<div class="warn">⚠ ${esc(r.warn)}</div>`;
  (r.tables || []).forEach(t => h += `<h3>${esc(t.title || 'Iteration table')}</h3>` + tbl(t.head, t.rows));
  if (r.details) h += `<details open><summary>Calculation Details</summary><pre>${esc(r.details)}</pre></details>`;
  $('results').innerHTML = h;
  if (r.heat) { const t = document.createElement('h3'); t.textContent = r.heatTitle; $('results').append(t, heatmap(r.heat)); }
}

export function showError(msg) { const e = $('error'); e.textContent = '❌ ' + msg; e.style.display = msg ? 'block' : 'none'; }
