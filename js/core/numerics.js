/**
 * Numerical helpers shared by several methods.
 */

export function checkData(xs, ys, name = 'x') {
  if (xs.length !== ys.length) throw new Error('x and y lists must have the same number of values.');
  if (xs.length < 2) throw new Error('At least 2 data points are required.');
  if (new Set(xs).size !== xs.length) throw new Error(`${name} values must be distinct.`);
}

export function lagrangeAt(xs, ys, X) {
  const L = xs.map((xi, i) => xs.reduce((p, xj, j) => j === i ? p : p * (X - xj) / (xi - xj), 1));
  return { L, value: L.reduce((s, l, i) => s + l * ys[i], 0) };
}

export function interval(a, b) { if (!(a < b)) throw new Error('Invalid interval: the lower limit a must be less than the upper limit b.'); }
