/**
 * Registry of the 5 modules x 3 methods = 15 methods.
 */
import fixedPoint from './methods/module1-equations/fixedPoint.js';
import secant from './methods/module1-equations/secant.js';
import gaussJordan from './methods/module1-equations/gaussJordan.js';
import lagrange from './methods/module2-interpolation/lagrange.js';
import inverseInterpolation from './methods/module2-interpolation/inverseInterpolation.js';
import curveFitting from './methods/module2-interpolation/curveFitting.js';
import trapezoidal from './methods/module3-calculus/trapezoidal.js';
import simpson from './methods/module3-calculus/simpson.js';
import differentiation from './methods/module3-calculus/differentiation.js';
import euler from './methods/module4-ivp/euler.js';
import modifiedEuler from './methods/module4-ivp/modifiedEuler.js';
import rungeKutta4 from './methods/module4-ivp/rungeKutta4.js';
import heatEquation from './methods/module5-bvp/heatEquation.js';
import twoPointBVP from './methods/module5-bvp/twoPointBVP.js';
import laplace from './methods/module5-bvp/laplace.js';

export const MODULES = [
  { name: "Module I", title: "Solution of Equations", methods: [fixedPoint, secant, gaussJordan] },
  { name: "Module II", title: "Interpolation & Approximation", methods: [lagrange, inverseInterpolation, curveFitting] },
  { name: "Module III", title: "Differentiation & Integration", methods: [trapezoidal, simpson, differentiation] },
  { name: "Module IV", title: "Initial Value Problems", methods: [euler, modifiedEuler, rungeKutta4] },
  { name: "Module V", title: "Boundary Value Problems", methods: [heatEquation, twoPointBVP, laplace] },
];
