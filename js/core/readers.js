/**
 * Input readers + validation. Each throws a clear Error message for bad input.
 */
import { $ } from './utils.js';
import { makeFn } from './parser.js';

let activeFields = [];
export function setActiveFields(f) { activeFields = f; }

export const raw = id => $('f_' + id).value.trim();
const labelOf = id => (activeFields.find(f => f.id === id) || {}).label || id;

export function n(id) { const s = raw(id); if (s === '') throw new Error(`"${labelOf(id)}" is empty.`); const v = Number(s); if (!isFinite(v)) throw new Error(`"${labelOf(id)}" is not a valid number: ${s}`); return v; }

export function pos(id) { const v = n(id); if (v <= 0) throw new Error(`"${labelOf(id)}" must be positive.`); return v; }

export function int(id, lo = 1, hi = 100000) { const v = n(id); if (!Number.isInteger(v) || v < lo || v > hi) throw new Error(`"${labelOf(id)}" must be an integer between ${lo} and ${hi}.`); return v; }

export function list(id) { const s = raw(id); if (!s) throw new Error(`"${labelOf(id)}" is empty.`); const a = s.split(/[\s,;]+/).filter(Boolean).map(Number); if (a.some(v => !isFinite(v))) throw new Error(`"${labelOf(id)}" contains an invalid number.`); return a; }

export const fx = (id, ...vars) => makeFn(raw(id), vars, labelOf(id));
