/**
 * Entry point: builds the sidebar, switches methods, handles Solve / Reset.
 */
import { $ } from './core/utils.js';
import { setActiveFields } from './core/readers.js';
import { initScene, clearScene, begin2D } from './viz/scene.js';
import { render, showError } from './ui/results.js';
import { MODULES } from './modules.js';
import { initResizers } from './ui/resizer.js';

let current = null;   // the selected method definition

function buildSidebar() {
  $('sidebar').innerHTML = MODULES.map((m, mi) => `
    <div class="mod" id="mod${mi}">
      <button class="modbtn" data-m="${mi}">${m.name}<small>${m.title}</small></button>
      <ul>${m.methods.map((t, i) => `<li data-m="${mi}" data-i="${i}">${t.title}</li>`).join('')}</ul>
    </div>`).join('');
  document.querySelectorAll('.modbtn').forEach(b => b.onclick = () => selectMethod(+b.dataset.m, 0));
  document.querySelectorAll('.mod li').forEach(li => li.onclick = () => selectMethod(+li.dataset.m, +li.dataset.i));
}

function fieldHTML(f) {
  const input = f.type === 'area' ? `<textarea id="f_${f.id}" rows="4"></textarea>`
    : f.type === 'select' ? `<select id="f_${f.id}">${f.opts.map(o => `<option value="${o[0]}">${o[1]}</option>`).join('')}</select>`
    : `<input id="f_${f.id}" type="text" autocomplete="off">`;
  return `<label>${f.label}${input}</label>`;
}

function selectMethod(mi, i) {
  current = MODULES[mi].methods[i];
  setActiveFields(current.fields);
  document.querySelectorAll('.mod').forEach((d, k) => d.classList.toggle('open', k === mi));
  document.querySelectorAll('.mod li').forEach(li => li.classList.toggle('active', +li.dataset.m === mi && +li.dataset.i === i));
  $('mTitle').textContent = current.title;
  $('mDesc').textContent = current.desc;
  $('fields').innerHTML = current.fields.map(fieldHTML).join('');
  resetAll();
}

function resetAll() {
  current.fields.forEach(f => { $('f_' + f.id).value = f.def; });
  $('results').innerHTML = '';
  showError('');
  clearScene();
  begin2D(-5, 5, -5, 5);
}

function solve() {
  showError('');
  try {
    const result = current.run();   // numbers + tables + draw()
    render(current, result);
    clearScene();
    result.draw();
  } catch (e) { showError(e.message); }
}

initScene();
initResizers();
buildSidebar();
$('solveBtn').onclick = solve;
$('resetBtn').onclick = resetAll;
$('panel').addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.tagName === 'INPUT') solve(); });
selectMethod(0, 0);
