/**
 * Safe equation parser. Uses math.js (loaded in index.html as global `math`); eval() is never used.
 */

export function makeFn(expr, vars, name = 'Equation') {
  if (!expr) throw new Error(`${name} is empty.`);
  if (/\b(import|createUnit|evaluate|parse|simplify|derivative|compile|help|reviver|chain)\b/.test(expr)) throw new Error(`${name}: this function is not allowed.`);
  let code;
  const scope = a => Object.fromEntries(vars.map((v, i) => [v, a[i]]));
  try { code = math.compile(expr); code.evaluate(scope(vars.map(() => 1.5))); }
  catch (e) { throw new Error(`Invalid equation for ${name} "${expr}": ${e.message}`); }
  return (...a) => { try { const r = code.evaluate(scope(a)); return typeof r === 'number' ? r : NaN; } catch { return NaN; } };
}
