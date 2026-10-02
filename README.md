# Interactive Numerical Methods Visualizer

A client-side project for the VTU course **Numerical Methods and Applications**. It needs no backend and no database; everything runs in the browser.

## 1. Problem statement
Numerical methods are hard to grasp from formulas alone. This tool lets a student enter a problem, see the numerical answer with the working, and see a 2D/3D picture of what the algorithm did.

## 2. Objectives
- Implement 15 methods (5 modules × 3) as real JavaScript algorithms, with no hard-coded answers.
- Validate inputs and show clear error messages.
- Visualise each method with Three.js (rotate / zoom).

## 3. Technologies
HTML5, CSS3, vanilla JavaScript (ES modules), Three.js r160 + OrbitControls (CDN), math.js 12.4 (CDN) as a safe expression parser. `eval()` is never used; math.js compiles the typed expressions, and a few risky function names are blocked.

## 4. Modules and topics
| Module | Methods |
|---|---|
| I Solution of Equations | Fixed Point Iteration, Secant, Gauss-Jordan |
| II Interpolation & Approximation | Lagrange, Inverse Interpolation, Curve Fitting (linear / quadratic) |
| III Differentiation & Integration | Trapezoidal, Simpson's 1/3, Numerical Differentiation (forward / backward / central) |
| IV Initial Value Problems | Euler, Modified Euler, Runge-Kutta 4 |
| V Boundary Value Problems | 1-D Heat (explicit), Two-point BVP (finite difference), Laplace (finite difference) |

## 5. How the methods work (short)
- **Fixed point:** repeat x(n+1)=g(xn) until |Δx| < tol; a cobweb diagram is drawn.
- **Secant:** x2 = x1 − f(x1)(x1−x0)/(f(x1)−f(x0)); the last secant line is drawn.
- **Gauss-Jordan:** augmented matrix, partial pivoting, normalise, eliminate above and below; 3×3 systems are drawn as planes.
- **Lagrange / Inverse:** P(x)=Σ yi·Li(x); inverse swaps the roles of x and y.
- **Curve fitting:** normal equations solved with Gauss-Jordan.
- **Trapezoidal / Simpson:** composite rules, drawn as trapezoids / parabolic arcs.
- **ODE methods:** step-by-step tables (Euler slope, predictor/corrector, k1..k4).
- **Heat:** explicit scheme, stability check r = αΔt/Δx² ≤ 0.5.
- **BVP:** y'' ≈ (y₍ᵢ₊₁₎−2yᵢ+y₍ᵢ₋₁₎)/h², y' ≈ (y₍ᵢ₊₁₎−y₍ᵢ₋₁₎)/2h gives a tridiagonal system, solved by the Thomas algorithm.
- **Laplace:** five-point formula with Gauss-Seidel sweeps until the maximum change < tolerance.

## 5b. Project structure
```
numerical-methods-visualizer/
├── index.html              page shell (loads math.js + Three.js from CDN)
├── style.css
├── README.md
└── js/
    ├── main.js             entry point: sidebar, method switching, Solve / Reset
    ├── modules.js          registry of the 5 modules x 3 methods
    ├── core/
    │   ├── utils.js        formatting + small helpers
    │   ├── parser.js       safe equation parser (math.js, no eval)
    │   ├── readers.js      input reading + validation (clear error messages)
    │   └── numerics.js     helpers shared by several methods
    ├── viz/
    │   ├── scene.js        Three.js scene + reusable drawing functions
    │   └── heatmap.js      2D heatmap canvas
    ├── ui/
    │   └── results.js      result panel, iteration tables, details
    └── methods/            ONE FILE PER METHOD (algorithm + run + visualization)
        ├── module1-equations/       fixedPoint.js, secant.js, gaussJordan.js
        ├── module2-interpolation/   lagrange.js, inverseInterpolation.js, curveFitting.js
        ├── module3-calculus/        trapezoidal.js, simpson.js, differentiation.js (+ integrationCommon.js)
        ├── module4-ivp/             euler.js, modifiedEuler.js, rungeKutta4.js (+ odeCommon.js)
        └── module5-bvp/             heatEquation.js, twoPointBVP.js, laplace.js
```
Each method file contains its algorithm function, a `run` function (reads inputs, computes, builds the result and the drawing) and a default export describing the title, description and input fields. To add a method, create a file and register it in `js/modules.js`.

## 6. How to run
1. Open the folder in VS Code and install the **Live Server** extension.
2. Right-click `index.html` → **Open with Live Server**.
3. An internet connection is needed once for the CDN libraries (Three.js, math.js).

(Opening `index.html` by double-click may fail because ES modules need http://.)

## 7. Test cases and expected outputs (defaults)
| Method | Result |
|---|---|
| Fixed point g=(x+4/x)/2, x0=1 | 2 |
| Secant x²−4, x0=1, x1=3 | 2 |
| Gauss-Jordan sample system | x=1, y=2, z=−1 |
| Lagrange at 2.5 | 6.25 |
| Inverse interpolation, y=6.25 | ≈ 2.5273 (cubic through the 4 nodes; true value 2.5) |
| Curve fit (linear default data) | y ≈ 0.05 + 1.99x |
| Trapezoidal / Simpson (x², 0..4, n=8) | 21.5 / 21.333333 |
| Euler / Modified Euler / RK4 (y−x²+1, h=0.1, 10 steps) | 2.5438 / 2.6348 / 2.6409 |
| Heat default (r = 0.4) | stable, centre ≈ 41.43 after 50 steps |
| BVP y''=2, y(0)=0, y(1)=1 | y = x², midpoint 0.25 |
| Laplace 8×8, top = 100 | converges in about 60 iterations |

## 8. Limitations
- Gauss-Jordan is limited to 10 equations; its 3D view works for 3×3 only.
- Plots use automatic scaling; very steep functions may look clipped.
- Heat and Laplace use rectangular uniform grids only.
- Needs a WebGL-capable browser and internet for the CDN scripts.

## 9. Future enhancements
Newton-Raphson and other methods, step-by-step animation, export of tables to CSV, offline bundled libraries, non-uniform grids.
