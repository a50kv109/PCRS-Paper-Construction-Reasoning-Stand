# PCRS — CONSTRUCTION PRIMITIVES SPECIFICATION

**Document ID:** `docs/research/PCRS_CONSTRUCTION_PRIMITIVES_SPEC.md`  
**Classification:** `DESIGN_SPECIFICATION / RESEARCH_MODULE`  
**Epistemic Status:** `PROPOSED (Design Contract — Frozen Kernel Unmodified)`  
**Mathematical Framework:** 2D Planar Euclidean Geometry (Float64)  
**Calibrated Domain:** $L = \max(|x|, |y|) \le 2$, Tolerance $\varepsilon_{\text{coord}} \le 10^{-7}$  

---

## 1. Executive Summary & Design Scope

Following the architectural audit of **INS-001** (*Constraint ≠ Transformation*) and **INS-002** (*Construction-step representation*), PCRS formalizes the boundary between:
1. **Geometric Constraints**: Intentions such as "bring point $P$ onto line $K$" or "bring point $P_1$ onto point $P_2$".
2. **Constructive Primitives**: Deterministic operators that compute the crease axis (or set of axes) satisfying the constraint.
3. **Transformational Kernel**: The execution engine (`R_L = 2 u u^T - I`) that applies the resulting reflection to points, segments, and polygons.

This document specifies the exact mathematical contracts, input/output structures, singularity conditions, solution multiplicity, numerical calibration domains, and verification rules for three fundamental constructive operations:
- **Primitive A:** `REFLECT_POINT_ACROSS_LINE` (Existent in kernel; here formalized as a constructive primitive contract)
- **Primitive B:** `FIND_FOLD_AXIS_POINT_TO_POINT` (Huzita Axiom 2: Perpendicular bisector)
- **Primitive C:** `FIND_FOLD_AXIS_POINT_TO_LINE` (Huzita Axiom 5: Parabolic tangent envelope and disambiguated point-incidence)

*Constraint Note:* Neither `src/core/reflection.ts` nor `src/verifier/independentVerifier.ts` are modified in this specification step.

---

## 2. Primitive A: `REFLECT_POINT_ACROSS_LINE`

### 2.1. Mathematical Definition & Formulas
Given a 2D line axis $L = (a, u)$ defined by an anchor point $a \in \mathbb{R}^2$ and a unit direction vector $u \in \mathbb{R}^2$ ($\|u\|_2 = 1$), the reflection of point $p \in \mathbb{R}^2$ across $L$ is the unique point $p' \in \mathbb{R}^2$ given by:

$$p' = a + R_L (p - a)$$

where $R_L \in \text{O}(2)$ is the Householder reflection operator:
$$R_L = 2 u u^T - I_2 = \begin{pmatrix} 2 u_x^2 - 1 & 2 u_x u_y \\ 2 u_x u_y & 2 u_y^2 - 1 \end{pmatrix}$$

Alternatively, using the line's unit normal vector $n = (-u_y, u_x)^T$:
$$p' = p - 2 \langle p - a, n \rangle n$$

### 2.2. Input / Output Data Contract
- **Input:**
  - `point`: `Point2D = [number, number]`
  - `axis`: `Line2D = { point: Point2D, direction: Point2D }`
- **Output:**
  - `reflectedPoint`: `Point2D = [number, number]`

### 2.3. Solution Multiplicity & Existence
- **Multiplicity:** Exactly $1$ unique solution for all valid inputs.
- **Algebraic properties:**
  - Involutive: $R_L(R_L(p)) = p$.
  - Affine isometry: $\|R_L(p) - R_L(q)\| = \|p - q\|$.
  - Reverses orientation: $\det(R_L) = -1$.

### 2.4. Singularities & Degenerate Cases
- **Degenerate direction vector:** If $\|u\|_2 = 0$ or non-finite (NaN, $\pm\infty$), execution MUST reject the input with error code `ZERO_DIRECTION_VECTOR` or `INVALID_COORDINATE`.
- **Point lies on axis:** If $\langle p - a, n \rangle = 0$, $p$ is a fixed point ($p' = p$). Displacement $\|p' - p\| = 0$. This is a valid, non-exceptional boundary state.

### 2.5. Applicability Domain & Numerical Tolerances
- **Precondition Domain:** $L_{\text{domain}} = \max(\|p\|_\infty, \|a\|_\infty) \le 2$.
- **Coordinate Discrepancy Bound:** $\varepsilon_{\text{coord}} \le 1.0 \times 10^{-7}$.
- **Axis Fixed-Point Discrepancy:** $\varepsilon_{\text{axis}} \le 1.0 \times 10^{-9}$.

### 2.6. Independent Verification Rules
1. **Orthogonality Check:** The displacement vector $p' - p$ must be strictly orthogonal to the axis direction $u$:
   $$|\langle p' - p, u \rangle| \le 1.0 \times 10^{-9}$$
2. **Midpoint Incidence Check:** The midpoint $m = \frac{p + p'}{2}$ must lie exactly on the axis line $L$:
   $$|\langle m - a, n \rangle| \le 1.0 \times 10^{-9}$$
3. **Equidistance Check:** The distance from $p$ to anchor $a$ must equal the distance from $p'$ to $a$:
   $$\left| \|p - a\| - \|p' - a\| \right| \le 1.0 \times 10^{-7}$$

### 2.7. Reference Positive & Negative Test Scenarios
- **Positive Benchmark:** $p = (1, 0)$, Axis anchor $a = (0, 0)$, direction $u = (0, 1)$ ($y$-axis). Expected $p' = (-1, 0)$. Verified delta $= 0.0$.
- **Negative Control:** Injected displacement $\delta = 10^{-4}$ into $p'$ coordinates. Verification rule fails with `INVARIANT_VIOLATION_ISOMETRY`.

---

## 3. Primitive B: `FIND_FOLD_AXIS_POINT_TO_POINT`

### 3.1. Mathematical Definition & Formulas
Given two points $P_1, P_2 \in \mathbb{R}^2$ with $P_1 \ne P_2$, find the unique fold axis line $L = (a, u)$ such that reflection across $L$ maps $P_1$ to $P_2$ ($R_L(P_1) = P_2$).

By Euclidean geometry, $L$ is the **perpendicular bisector** of segment $P_1 P_2$:
1. **Anchor point $a$:** The midpoint of the segment:
   $$a = M = \frac{P_1 + P_2}{2} = \left( \frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2} \right)^T$$
2. **Displacement vector $\Delta$:**
   $$\Delta = P_2 - P_1 = (x_2 - x_1, y_2 - y_1)^T, \quad d = \|\Delta\|_2 = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$
3. **Normal vector $n$:** Along the segment:
   $$n = \frac{\Delta}{d} = \left( \frac{x_2 - x_1}{d}, \frac{y_2 - y_1}{d} \right)^T$$
4. **Unit direction vector $u$:** Orthogonal to $n$ (rotated by $+90^\circ$):
   $$u = (-n_y, n_x)^T = \left( -\frac{y_2 - y_1}{d}, \frac{x_2 - x_1}{d} \right)^T$$

### 3.2. Input / Output Data Contract
- **Input:**
  - `p1`: `Point2D`
  - `p2`: `Point2D`
- **Output:**
  - `axis`: `Line2D = { point: Point2D, direction: Point2D }`
  - `status`: `'UNIQUE_SOLUTION' | 'COINCIDENT_POINTS' | 'INVALID_INPUT'`

### 3.3. Solution Multiplicity & Existence
- **$P_1 \ne P_2$ ($\|P_1 - P_2\| > 10^{-12}$):** Exactly **1 unique line** (Huzita Axiom 2).
- **$P_1 = P_2$ ($\|P_1 - P_2\| \le 10^{-12}$):** **Infinitely many lines**. Any line passing through $P_1$ trivially reflects $P_1$ onto itself. Must return status `COINCIDENT_POINTS` and reject ambiguous single-line assumption.

### 3.4. Singularities & Degenerate Cases
- **Coincidence ($P_1 \approx P_2$):** Division by zero in $\|\Delta\|$. Throws `SINGULAR_INPUT_COINCIDENT_POINTS`.
- **Non-finite coordinates:** Throws `INVALID_COORDINATE`.

### 3.5. Applicability Domain & Numerical Tolerances
- **Precondition Domain:** $\max(\|P_1\|_\infty, \|P_2\|_\infty) \le 2$.
- **Separation Threshold:** $\|P_1 - P_2\|_2 \ge 1.0 \times 10^{-10}$.
- **Tolerance on Midpoint & Reflection:** $\varepsilon_{\text{coord}} \le 1.0 \times 10^{-7}$.

### 3.6. Independent Verification Rules
1. **Reflection Closure:** Evaluating `REFLECT_POINT_ACROSS_LINE(P1, L)` must yield $P_2$ within $\|R_L(P_1) - P_2\|_2 \le 1.0 \times 10^{-7}$.
2. **Equidistance Verification:** $\|M - P_1\|_2 = \|M - P_2\|_2$ within $1.0 \times 10^{-12}$.
3. **Orthogonality of Axis to Chord:** $|\langle P_2 - P_1, u \rangle| \le 1.0 \times 10^{-9}$.

### 3.7. Reference Positive & Negative Test Scenarios
- **Positive Benchmark:** $P_1 = (1, 0)$, $P_2 = (0, 1)$.  
  $\Delta = (-1, 1)^T$, $d = \sqrt{2}$.  
  Midpoint $M = (0.5, 0.5)$.  
  Direction $u = (-1/\sqrt{2}, -1/\sqrt{2}) \equiv (1/\sqrt{2}, 1/\sqrt{2})$. Line: $y = x$.  
  $R_L(1, 0) = (0, 1)$. Discrepancy $= 0.0$.
- **Negative Control:** Pass $P_1 = (1, 1)$, $P_2 = (1, 1)$. Trapped with error `SINGULAR_INPUT_COINCIDENT_POINTS`.

---

## 4. Primitive C: `FIND_FOLD_AXIS_POINT_TO_LINE`

### 4.1. Mathematical Nature & Solution Multiplicity (The Envelope Problem)
A foundational insight of computational origami is that the constraint **"fold point $P$ onto line $K$"** does **NOT** yield a unique fold line.

#### The 1-Parameter Family (Parabolic Tangent Envelope)
Let $P \in \mathbb{R}^2$ be a point and $K$ a line ($a_k, u_k$). For every point $T \in K$, there is a fold axis $L_T$ that maps $P$ to $T$, namely the perpendicular bisector of segment $PT$.
As $T$ varies continuously along the directrix line $K$, the family of fold axes $\{L_T\}_{T \in K}$ forms the **envelope of tangents to a parabola** with:
- **Focus:** Point $P$
- **Directrix:** Line $K$

**Architectural Law:** Any software module claiming that "fold point to line" produces a single unique line without additional constraints is mathematically false.

### 4.2. Disambiguating Formulations

To obtain a discrete, finite solution set, PCRS specifies two distinct variants of Primitive C:

#### Variant C1 — Point-Incidence Disambiguation (Huzita Axiom 5)
Find a fold line $L$ that reflects point $P$ onto line $K$ **and passes through a given point $Q$** ($Q \in L$).

##### Derivation & Analytical Solution:
1. Let the directrix line $K$ be parameterized by $T(t) = a_k + t u_k$, where $a_k$ is an anchor, $u_k$ is unit direction, and $t \in \mathbb{R}$.
2. If $L$ passes through $Q$ and reflects $P$ onto $T(t)$, then $L$ is the perpendicular bisector of $P T(t)$.
3. Because $Q \in L$, $Q$ is equidistant from $P$ and $T(t)$:
   $$\|T(t) - Q\|_2^2 = \|P - Q\|_2^2$$
4. Expanding this quadratic equation in $t$:
   $$\|(a_k - Q) + t u_k\|_2^2 = \|P - Q\|_2^2$$
   $$\|u_k\|_2^2 t^2 + 2 \langle a_k - Q, u_k \rangle t + \|a_k - Q\|_2^2 - \|P - Q\|_2^2 = 0$$
   Since $\|u_k\|_2 = 1$, this simplifies to standard quadratic form $A t^2 + B t + C = 0$:
   $$A = 1$$
   $$B = 2 \langle a_k - Q, u_k \rangle$$
   $$C = \|a_k - Q\|_2^2 - \|P - Q\|_2^2$$
5. Discriminant:
   $$D = B^2 - 4AC = 4 \left( \langle a_k - Q, u_k \rangle^2 - \|a_k - Q\|_2^2 + \|P - Q\|_2^2 \right)$$
   Let $n_k = (-u_{k,y}, u_{k,x})^T$ be the unit normal to line $K$. Using the Pythagorean identity $\|v\|^2 = \langle v, u_k \rangle^2 + \langle v, n_k \rangle^2$, this simplifies to:
   $$D = 4 \left( \|P - Q\|_2^2 - \text{dist}(Q, K)^2 \right)$$

##### Solution Multiplicity for Variant C1:
- **$D < -1.0 \times 10^{-12}$ (0 solutions):** $\|P - Q\| < \text{dist}(Q, K)$. The point $Q$ lies in the interior of the parabola; no real tangent lines pass through $Q$. Returns empty array `[]`.
- **$|D| \le 1.0 \times 10^{-12}$ (1 solution):** $\|P - Q\| = \text{dist}(Q, K)$. $Q$ lies on the parabola itself. Exactly 1 tangent line passes through $Q$. Single root:
  $$t = -\frac{B}{2} = -\langle a_k - Q, u_k \rangle$$
- **$D > 1.0 \times 10^{-12}$ (2 solutions):** $\|P - Q\| > \text{dist}(Q, K)$. $Q$ lies in the exterior of the parabola. Exactly 2 distinct tangent lines pass through $Q$:
  $$t_{1,2} = \frac{-B \pm \sqrt{D}}{2}$$
  For each real root $t_i$, the target point on line $K$ is $T_i = a_k + t_i u_k$, and the corresponding axis $L_i$ is computed via:
  $$L_i = \text{FIND\_FOLD\_AXIS\_POINT\_TO\_POINT}(P, T_i)$$

#### Variant C2 — Target-Parameter Disambiguation
An explicit coordinate target $T \in K$ or scalar parameter $t \in \mathbb{R}$ is supplied by the caller, directly invoking `FIND_FOLD_AXIS_POINT_TO_POINT(P, T)`.

### 4.3. Input / Output Data Contract (Variant C1 — Huzita Axiom 5)
- **Input:**
  - `p`: `Point2D` (point to be folded)
  - `line`: `Line2D` (target directrix line $K$)
  - `throughPoint`: `Point2D` (point $Q$ through which the fold line must pass)
- **Output:**
  - `axes`: `Array<Line2D>` (0, 1, or 2 lines)
  - `targetPoints`: `Array<Point2D>` (corresponding mapped points on $K$)
  - `discriminant`: `number`
  - `multiplicity`: `0 | 1 | 2`

### 4.4. Singularities & Degenerate Cases
- **$P \in K$ (Point already lies on the directrix):**
  - $\text{dist}(P, K) = 0$. The parabola degenerates into a ray along the normal to $K$ at $P$.
  - If $Q = P$, any line through $P$ maps $P$ to itself ($P \in K$).
- **$Q = P$ with $P \notin K$:**
  - $\|P - Q\| = 0$. Since $\text{dist}(Q, K) > 0$, $D < 0$, giving $0$ solutions (no fold line through $P$ can reflect $P$ onto $K$).
- **Line direction degenerate:** $\|u_k\| = 0$ throws `ZERO_DIRECTION_VECTOR`.

### 4.5. Applicability Domain & Numerical Bounds
- **Precondition Domain:** $\max(\|P\|_\infty, \|Q\|_\infty, \|a_k\|_\infty) \le 2$.
- **Discriminant Zero-Tolerance:** $|D| \le 1.0 \times 10^{-10}$ treated as double root (multiplicity 1).
- **Coordinate Tolerance:** $\varepsilon_{\text{coord}} \le 1.0 \times 10^{-7}$.

### 4.6. Independent Verification Rules for Variant C1
For each generated candidate line $L_i = (M_i, u_i)$:
1. **Through-Point Incidence:** $Q$ must lie on $L_i$:
   $$\left| \langle Q - M_i, (-u_{i,y}, u_{i,x})^T \rangle \right| \le 1.0 \times 10^{-9}$$
2. **Target Incidence on Line $K$:** $T_i = R_{L_i}(P)$ must lie on directrix line $K$:
   $$\left| \langle T_i - a_k, (-u_{k,y}, u_{k,x})^T \rangle \right| \le 1.0 \times 10^{-7}$$
3. **Isometry & Reflection:** $\|R_{L_i}(P) - T_i\|_2 \le 1.0 \times 10^{-9}$.

### 4.7. Reference Positive & Negative Test Scenarios
- **Positive Scenario (2 Solutions — Huzita Axiom 5):**
  - Point $P = (0, 1)$.
  - Directrix $K$: $y = 0$ ($a_k = (0, 0), u_k = (1, 0)$).
  - Through-point $Q = (2, 2)$.
  - $\text{dist}(Q, K) = 2$.
  - $\|P - Q\| = \sqrt{(2-0)^2 + (2-1)^2} = \sqrt{4 + 1} = \sqrt{5} \approx 2.236068$.
  - Because $\|P - Q\| > \text{dist}(Q, K)$ ($\sqrt{5} > 2$), $D = 4(5 - 4) = 4 > 0$.
  - Exactly **2 solutions**:
    $a_k - Q = (-2, -2)$. $\langle a_k - Q, u_k \rangle = -2$.
    $t^2 - 4t + (8 - 5) = t^2 - 4t + 3 = (t - 1)(t - 3) = 0$.
    Roots: $t_1 = 1$, $t_2 = 3$.
    Target points on $y=0$: $T_1 = (1, 0)$, $T_2 = (3, 0)$.
    Axes:
    - Axis 1 ($P(0,1) \to T_1(1,0)$): Midpoint $M_1 = (0.5, 0.5)$, normal $\Delta_1 = (1, -1)$, direction $u_1 = (1, 1)/\sqrt{2}$. Equation: $y - 0.5 = 1 \cdot (x - 0.5) \implies y = x$. Passes through $Q(2,2)$!
    - Axis 2 ($P(0,1) \to T_2(3,0)$): Midpoint $M_2 = (1.5, 0.5)$, normal $\Delta_2 = (3, -1)$, direction $u_2 = (1, 3)/\sqrt{10}$. Equation: $y - 2 = 3(x - 2) \implies y = 3x - 4$. At $x = 1.5, y = 0.5$. Passes through $Q(2,2)$!
- **Negative Scenario (0 Solutions):**
  - Point $P = (0, 2)$, Directrix $K: y = 0$, Through-point $Q = (0, 0.5)$.
  - $\text{dist}(Q, K) = 0.5$, $\|P - Q\| = 1.5$.
  - Here if $Q$ is chosen such that $\|P - Q\| < \text{dist}(Q, K)$, e.g., $P = (0, 0.5)$, Directrix $K: y = 0$, $Q = (0, 2)$:
    $\text{dist}(Q, K) = 2$, $\|P - Q\| = 1.5$.
    $D = 4(1.5^2 - 2^2) = 4(2.25 - 4) = -7 < 0$.
    Algorithm returns $0$ solutions (`multiplicity: 0, axes: []`).
- **Negative Control:** Fabricate a single fictitious axis without checking $Q \in L_i$. Caught by verifier rule `Through-Point Incidence`.

---

## 5. Architectural Comparison Matrix

| Attribute | Primitive A (`REFLECT_POINT`) | Primitive B (`POINT_TO_POINT`) | Primitive C (`POINT_TO_LINE`) |
| :--- | :--- | :--- | :--- |
| **Mathematical Base** | Householder reflection matrix | Perpendicular bisector | Parabola tangent envelope |
| **Huzita Equivalent** | Transformational Kernel (L0) | Axiom 2 | Axiom 5 (with through-point $Q$) |
| **Number of Solutions** | Always exactly 1 | 1 (if $P_1 \ne P_2$); $\infty$ (if $P_1 = P_2$) | 0, 1, or 2 (Variant C1); $\infty$ (Unconstrained) |
| **Singular Input** | $\|u\| = 0$ | $P_1 = P_2$ | $\|P - Q\| < \text{dist}(Q, K)$ or degenerate $K$ |
| **Float64 Stability** | Linear, robust to machine precision | Direct midpoint + normalization | Quadratic formula with determinant clamping |
| **Verification Gate** | Isometry + Midpoint incidence | Reflection closure + chord orthogonality | Point incidence + line incidence + reflection |

---

## 6. Implementation Readiness & Transition Plan

1. **Gate Current Status:** `SPECIFICATION_ONLY` (Frozen kernel remains protected).
2. **Next Gate Requirement:** Before coding primitives into `src/core/`, an experimental test suite mimicking `scripts/runTests.ts` must be drafted with unit fixtures for all degenerate cases.
3. **Traceability:** This specification directly satisfies **INS-001** and **INS-002**, laying the mathematical ground for verified origami crease generation.
