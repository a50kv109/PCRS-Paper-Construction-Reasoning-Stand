# PCRS — CONSTRUCTION PRIMITIVES SPECIFICATION

**Document ID:** `docs/research/PCRS_CONSTRUCTION_PRIMITIVES_SPEC.md`  
**Classification:** `DESIGN_SPECIFICATION / RESEARCH_MODULE`  
**Epistemic Status:** `PROPOSED (Design Contract — Frozen Kernel Unmodified)`  
**Mathematical Framework:** 2D Planar Euclidean Geometry (Float64)  
**Calibrated Domain:** $L = \max(|x|, |y|) \le 2$, Tolerance $\varepsilon_{\text{coord}} \le 10^{-7}$  

---

## 1. Executive Summary & Architectural Scope

Following the architectural audit of **INS-001** (*Constraint ≠ Transformation*) and **INS-002** (*Construction-step representation*), PCRS establishes a rigorous tripartite separation:

1. **Geometric Constraints**: High-level craft or geometrical intentions (e.g., "bring point $P$ onto line $L_0$", "crease passing through landmark $R$").
2. **Constructive Primitives**: Deterministic mathematical solvers that compute the exact fold axis (or parameterize the admissible solution family) satisfying the constraints.
3. **Transformational Kernel**: The execution engine (`R_L = 2 u u^T - I`) that applies the resulting isometry to points, segments, and polygons.

### The Critical Architectural Distinction in Primitive C
A primary finding of the mathematical review is that **the phrase "fold point $P$ onto line $L_0$" does NOT specify a unique axis or a finite set of axes**. Without an additional constraint, the set of fold axes is an **infinite 1-parameter family** (the envelope of tangent lines to a parabola).

Therefore, PCRS strictly divides Primitive C into two distinct mathematical tasks:
- **Task C1 (`POINT_TO_LINE_UNCONSTRAINED`):** The continuous 1-parameter family (envelope manifold).
- **Task C2 (`POINT_TO_LINE_THROUGH_POINT` — Huzita Axiom 5):** The discrete problem obtained when the fold axis is constrained to pass through a given reference point $R$.

*Governance Note:* Neither `src/core/reflection.ts` nor `src/verifier/independentVerifier.ts` are modified by this document.

---

## 2. Primitive A: `REFLECT_POINT_ACROSS_LINE`

### 2.1. Mathematical Definition & Formulas
Given a 2D line axis $L = (a, u)$ defined by an anchor point $a \in \mathbb{R}^2$ and a unit direction vector $u \in \mathbb{R}^2$ ($\|u\|_2 = 1$), the reflection of point $p \in \mathbb{R}^2$ across $L$ is the unique point $p' \in \mathbb{R}^2$ given by:

$$p' = a + R_L (p - a)$$

where $R_L \in \text{O}(2)$ is the Householder reflection operator:
$$R_L = 2 u u^T - I_2 = \begin{pmatrix} 2 u_x^2 - 1 & 2 u_x u_y \\ 2 u_x u_y & 2 u_y^2 - 1 \end{pmatrix}$$

Alternatively, using the line's unit normal vector $n = (-u_y, u_x)^T$:
$$p' = p - 2 \langle p - a, n \rangle n$$

Both formulas are mathematically equivalent in exact arithmetic:
$$p - a = \langle p - a, u \rangle u + \langle p - a, n \rangle n$$
$$R_L (p - a) = \langle p - a, u \rangle u - \langle p - a, n \rangle n = (p - a) - 2 \langle p - a, n \rangle n$$
$$p' = a + R_L (p - a) = p - 2 \langle p - a, n \rangle n$$

### 2.2. Input / Output Data Contract
- **Input:**
  - `point`: `Point2D = [number, number]`
  - `axis`: `Line2D = { point: Point2D, direction: Point2D }`
- **Output:**
  - `reflectedPoint`: `Point2D = [number, number]`

### 2.3. Solution Multiplicity & Existence
- **Multiplicity:** Always exactly **1 unique solution** for any valid inputs (involutive affine isometry, bijection $\mathbb{R}^2 \to \mathbb{R}^2$).
- **Algebraic invariants:**
  - Involutive: $R_L(R_L(p)) = p$.
  - Distance-preserving: $\|R_L(p) - R_L(q)\|_2 = \|p - q\|_2$.
  - Orientation-reversing: $\det(R_L) = -1$.

### 2.4. Singularities, Normalization & Degenerate Cases
- **Direction vector normalization:** If direction $u_{\text{raw}}$ has $\|u_{\text{raw}}\|_2 \ne 1$, it must be normalized: $u = u_{\text{raw}} / \|u_{\text{raw}}\|_2$.
- **Zero direction vector:** If $\|u_{\text{raw}}\|_2 = 0$ (or $< 10^{-14}$), execution must reject with `ZERO_DIRECTION_VECTOR`.
- **Non-finite coordinates:** Any coordinate containing NaN, $+\infty$, or $-\infty$ must be rejected with `INVALID_COORDINATE`.
- **Point on axis:** If $\langle p - a, n \rangle = 0$, $p$ is a fixed point ($p' = p$). Displacement $\|p' - p\| = 0$. This is regular and non-exceptional.

### 2.5. Applicability Domain & Numerical Bounds
- **Precondition Domain:** $L_{\text{domain}} = \max(\|p\|_\infty, \|a\|_\infty) \le 2$.
- **Coordinate Discrepancy Bound:** $\varepsilon_{\text{coord}} \le 1.0 \times 10^{-7}$.
- **Axis Fixed-Point Discrepancy:** $\varepsilon_{\text{axis}} \le 1.0 \times 10^{-9}$.

### 2.6. Independent Verification Rules
1. **Displacement Orthogonality:** $\left| \langle p' - p, u \rangle \right| \le 1.0 \times 10^{-9}$.
2. **Midpoint Line Incidence:** $\left| \langle \frac{p + p'}{2} - a, n \rangle \right| \le 1.0 \times 10^{-9}$.
3. **Anchor Equidistance:** $\left| \|p - a\|_2 - \|p' - a\|_2 \right| \le 1.0 \times 10^{-7}$.

### 2.7. Reference Positive & Negative Test Scenarios
- **Positive Benchmark:** $p = (1, 0)$, $a = (0, 0)$, $u = (0, 1)$. Output $p' = (-1, 0)$, $\Delta = 0.0$.
- **Negative Control:** Injected coordinate perturbation $\delta = 10^{-4}$ into $p'$. Verification rule flags `INVARIANT_VIOLATION_ISOMETRY`.

---

## 3. Primitive B: `FIND_FOLD_AXIS_POINT_TO_POINT`

### 3.1. Mathematical Definition & Formulas (Huzita Axiom 2)
Given two points $P_1, P_2 \in \mathbb{R}^2$, find the fold axis $L = (a, u)$ such that reflection across $L$ maps $P_1$ to $P_2$ ($R_L(P_1) = P_2$).

By Euclidean geometry, any point $X$ on an axis reflecting $P_1$ to $P_2$ must satisfy $\|X - P_1\|_2 = \|X - P_2\|_2$. The locus of all such points is uniquely the **perpendicular bisector** of segment $P_1 P_2$:
1. **Anchor point $a$:** Segment midpoint:
   $$a = M = \frac{P_1 + P_2}{2} = \left( \frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2} \right)^T$$
2. **Displacement vector $\Delta$:**
   $$\Delta = P_2 - P_1 = (x_2 - x_1, y_2 - y_1)^T, \quad d = \|\Delta\|_2 = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$
3. **Unit normal vector $n$:**
   $$n = \frac{\Delta}{d} = \left( \frac{x_2 - x_1}{d}, \frac{y_2 - y_1}{d} \right)^T$$
4. **Unit direction vector $u$:** Orthogonal to $n$ ($+90^\circ$ rotation):
   $$u = (-n_y, n_x)^T = \left( -\frac{y_2 - y_1}{d}, \frac{x_2 - x_1}{d} \right)^T$$

### 3.2. Input / Output Data Contract
- **Input:**
  - `p1`: `Point2D`
  - `p2`: `Point2D`
- **Output:**
  - `axis`: `Line2D | null`
  - `multiplicity`: `'ONE' | 'INFINITE' | 'ZERO'`
  - `status`: `'UNIQUE_SOLUTION' | 'COINCIDENT_POINTS_INFINITE_SOLUTIONS' | 'NUMERICAL_INSTABILITY' | 'INVALID_COORDINATE'`

### 3.3. Mathematical Classification of Solutions
- **Case 1: $P_1 \ne P_2$ ($d \ge \varepsilon_{\text{sep}}$):**
  - **Number of solutions:** Exactly **1 unique line**.
- **Case 2: $P_1 = P_2$ ($d = 0$):**
  - **Number of solutions:** **Infinitely many lines ($\infty$)**.
  - *Proof:* Any line passing through $P_1$ trivially leaves $P_1$ fixed ($R_L(P_1) = P_1$).
  - *Architectural Rule:* The system MUST NOT pick an arbitrary line (e.g. horizontal or vertical) and return it as the solution. It must return `multiplicity: 'INFINITE'` with `status: 'COINCIDENT_POINTS_INFINITE_SOLUTIONS'`.
- **Case 3: Numerical Near-Coincidence ($0 < d < \varepsilon_{\text{sep}} = 1.0 \times 10^{-10}$):**
  - Floating-point subtraction $P_2 - P_1$ suffers severe cancellation; the direction angle $\theta = \text{atan2}(\Delta_y, \Delta_x)$ is dominated by subnormal noise.
  - Must return `status: 'NUMERICAL_INSTABILITY'` to prevent catastrophic angular errors.
- **Case 4: Non-finite inputs (NaN, $\pm\infty$):**
  - Throws `INVALID_COORDINATE`.

### 3.4. Applicability Domain & Numerical Bounds
- **Precondition Domain:** $\max(\|P_1\|_\infty, \|P_2\|_\infty) \le 2$.
- **Separation Threshold:** $\varepsilon_{\text{sep}} = 1.0 \times 10^{-10}$.
- **Coordinate Discrepancy Bound:** $\varepsilon_{\text{coord}} \le 1.0 \times 10^{-7}$.

### 3.5. Independent Verification Rules
1. **Reflection Closure:** $\|R_L(P_1) - P_2\|_2 \le 1.0 \times 10^{-7}$.
2. **Midpoint Equidistance:** $\left| \|M - P_1\|_2 - \|M - P_2\|_2 \right| \le 1.0 \times 10^{-12}$.
3. **Axis-to-Chord Orthogonality:** $\left| \langle P_2 - P_1, u \rangle \right| \le 1.0 \times 10^{-9}$.

### 3.6. Positive & Negative Test Scenarios
- **Positive Test (Unique solution):** $P_1 = (1, 0), P_2 = (0, 1) \implies L: y = x$. Delta $= 0.0$.
- **Infinite Solutions Test:** $P_1 = (1, 1), P_2 = (1, 1) \implies \text{status} = \text{'COINCIDENT\_POINTS\_INFINITE\_SOLUTIONS'}$.
- **Numerical Instability Test:** $P_1 = (1, 1), P_2 = (1 + 10^{-13}, 1) \implies \text{status} = \text{'NUMERICAL\_INSTABILITY'}$.
- **Negative Control:** Fabricated axis with $5^\circ$ angular tilt rejected by verifier rule `Reflection Closure`.

---

## 4. Primitive C: Critical Examination of Point-to-Line Folding

### 4.1. Task C1: `POINT_TO_LINE_UNCONSTRAINED` (1-Parameter Envelope Family)

#### Mathematical Definition
Given point $P \in \mathbb{R}^2$ and directrix line $L_0 = (a_0, u_0)$, find all fold lines $A$ such that reflection of $P$ across $A$ lies on $L_0$:
$$R_A(P) \in L_0$$

#### Analytical Characterization & Solution Multiplicity
Let $Q(t) = a_0 + t u_0$ ($t \in \mathbb{R}$) be an arbitrary point on $L_0$.
For every choice of parameter $t$, there exists a unique perpendicular bisector between $P$ and $Q(t)$:
$$A(t) = \text{FIND\_FOLD\_AXIS\_POINT\_TO\_POINT}(P, Q(t))$$
- Midpoint: $M(t) = \frac{P + Q(t)}{2} = \frac{P + a_0 + t u_0}{2}$.
- Normal: $n(t) = \frac{Q(t) - P}{\|Q(t) - P\|_2}$.
- Direction: $u_A(t) = (-n_y(t), n_x(t))^T$.

**Theorem (The Parabolic Envelope):**  
As parameter $t$ sweeps through $\mathbb{R}$, the family of lines $\{A(t)\}_{t \in \mathbb{R}}$ constitutes the **envelope of tangent lines to the parabola** whose focus is $P$ and whose directrix is line $L_0$.

**Conclusion on Multiplicity for Task C1:**  
- **Number of solutions:** **Infinitely many ($\infty$, a 1-parameter continuous family)**.
- **Architectural Law:** Any claim that Task C1 has "0, 1, or 2 solutions" is mathematically false. The count 0, 1, or 2 is mathematically meaningful **only** when an additional constraint (such as passing through a point $R$, or having a specified angle) is imposed.
- **Implementation Form:** Task C1 cannot return a single `Line2D` or discrete list. It must be modeled as a parametric generator:
  $$\text{getAxis}(t: \text{number}): \text{Line2D}$$

---

### 4.2. Task C2: `POINT_TO_LINE_THROUGH_POINT` (Huzita Axiom 5)

#### Mathematical Definition
Given point $P \in \mathbb{R}^2$, directrix line $L_0 = (a_0, u_0)$, and a reference through-point $R \in \mathbb{R}^2$, find all fold lines $A$ such that:
$$R_A(P) \in L_0 \quad \text{AND} \quad R \in A$$

#### Complete Derivation of the Quadratic Equation
1. Let $Q \in L_0$ be the reflected image of $P$: $Q = R_A(P)$.
2. Since $A$ is the perpendicular bisector of segment $PQ$, and $R \in A$, the point $R$ must be equidistant from $P$ and $Q$:
   $$\|Q - R\|_2^2 = \|P - R\|_2^2$$
3. Parameterize $Q(t) = a_0 + t u_0$, where $a_0$ is the anchor, $u_0$ is unit direction ($\|u_0\|_2 = 1$), and $t \in \mathbb{R}$:
   $$\|(a_0 - R) + t u_0\|_2^2 = \|P - R\|_2^2$$
4. Let vector $w = a_0 - R$. Expanding the squared norm:
   $$\|u_0\|_2^2 t^2 + 2 \langle w, u_0 \rangle t + \|w\|_2^2 - \|P - R\|_2^2 = 0$$
   Since $\|u_0\|_2 = 1$, this simplifies to:
   $$t^2 + 2 \langle a_0 - R, u_0 \rangle t + \left( \|a_0 - R\|_2^2 - \|P - R\|_2^2 \right) = 0$$
5. Discriminant Analysis:
   $$D/4 = \langle a_0 - R, u_0 \rangle^2 - \left( \|a_0 - R\|_2^2 - \|P - R\|_2^2 \right)$$
   Decomposing $w = a_0 - R$ into components parallel to $u_0$ and normal to $n_0 = (-u_{0,y}, u_{0,x})^T$:
   $$\|w\|_2^2 = \langle w, u_0 \rangle^2 + \langle w, n_0 \rangle^2 = \langle w, u_0 \rangle^2 + \text{dist}(R, L_0)^2$$
   Substituting this into the discriminant:
   $$D/4 = \langle w, u_0 \rangle^2 - \left( \langle w, u_0 \rangle^2 + \text{dist}(R, L_0)^2 - \|P - R\|_2^2 \right) = \|P - R\|_2^2 - \text{dist}(R, L_0)^2$$
   $$D = 4 \left( \|P - R\|_2^2 - \text{dist}(R, L_0)^2 \right)$$

#### Classification of Solutions for Task C2

| Geometric Condition | Discriminant $D$ | Multiplicity | Geometric Meaning |
| :--- | :--- | :--- | :--- |
| $\|P - R\|_2 < \text{dist}(R, L_0)$ | $D < 0$ | **0 solutions** | Circle $\mathcal{C}(R, \|P-R\|)$ does not reach line $L_0$; point $R$ lies in the interior of the parabola. |
| $\|P - R\|_2 = \text{dist}(R, L_0)$ and $P \ne R$ | $D = 0$ | **1 solution** | Circle $\mathcal{C}(R, \|P-R\|)$ is tangent to $L_0$; $R$ lies on the parabola. Exactly 1 tangent line passes through $R$. |
| $\|P - R\|_2 > \text{dist}(R, L_0)$ | $D > 0$ | **2 solutions** | Circle $\mathcal{C}(R, \|P-R\|)$ intersects $L_0$ in two distinct points $Q_1, Q_2$; $R$ lies in the exterior of the parabola. |
| $P = R$ and $R \in L_0$ | $D = 0$ | **$\infty$ solutions** | Degenerate coincidence: $P$ already lies on $L_0$ and $R = P$. Any line through $P$ reflects $P$ onto itself on $L_0$. |

#### Detailed Analysis of Special and Boundary Cases for Task C2

1. **Special Case 1: Reference point $R$ lies on the directrix line $L_0$ ($R \in L_0$):**
   - $\text{dist}(R, L_0) = 0$.
   - If $P \ne R$, then $\|P - R\|_2 > 0$, hence $D = 4 \|P - R\|_2^2 > 0$ (**always 2 solutions**).
   - Roots: $t_{1,2} = -\langle a_0 - R, u_0 \rangle \pm \|P - R\|_2$.
   - Target points: $Q_{1,2} = R \pm \|P - R\|_2 u_0$.
   - *Geometric insight:* $\triangle P R Q_i$ is an isosceles triangle with apex $R$ ($\|R - P\| = \|R - Q_i\|$). The two fold lines $A_1, A_2$ are simply the internal and external angle bisectors of $\angle P R Q$!
2. **Special Case 2: Focus point $P$ lies on the directrix line $L_0$ ($P \in L_0$):**
   - $\text{dist}(P, L_0) = 0$.
   - Since $P \in L_0$, the distance from any point $R$ to $P$ satisfies $\|P - R\|_2 \ge \text{dist}(R, L_0)$.
   - If $P$ is the orthogonal projection of $R$ onto $L_0$, $\|P - R\| = \text{dist}(R, L_0) \implies D = 0$ (1 solution, the perpendicular to $L_0$ at $P$).
   - Otherwise, $\|P - R\| > \text{dist}(R, L_0) \implies D > 0$ (2 solutions: one leaves $Q_1 = P$, the second reflects $P$ across to $Q_2 \in L_0$).
3. **Special Case 3: $R = P$ with $P \notin L_0$:**
   - $\|P - R\| = 0$, while $\text{dist}(R, L_0) = \text{dist}(P, L_0) > 0$.
   - $D = 4(0 - \text{dist}^2) < 0$. **Always 0 solutions**.
   - *Intuition:* A crease passing through $P$ leaves $P$ fixed; it cannot move $P$ onto $L_0$ unless $P$ is already on $L_0$.

#### Input / Output Data Contract for Task C2
- **Input:**
  - `p`: `Point2D` (point to be reflected)
  - `line`: `Line2D` (target line $L_0$)
  - `throughPoint`: `Point2D` (reference point $R \in A$)
- **Output:**
  - `axes`: `Array<Line2D>` (length 0, 1, or 2)
  - `targetPoints`: `Array<Point2D>` (length 0, 1, or 2)
  - `discriminant`: `number`
  - `multiplicity`: `'ZERO' | 'ONE' | 'TWO' | 'INFINITE'`
  - `status`: `'SUCCESS' | 'NO_REAL_ROOTS' | 'COINCIDENT_DEGENERATE_INFINITE' | 'INVALID_INPUT'`

#### Independent Verification Rules for Task C2
For each solution axis $A_i = (M_i, u_{A_i})$:
1. **Through-Point Incidence:** $R$ must lie on $A_i$:
   $$\left| \langle R - M_i, (-u_{A_i,y}, u_{A_i,x})^T \rangle \right| \le 1.0 \times 10^{-9}$$
2. **Target Incidence on Directrix:** $Q_i = R_{A_i}(P)$ must lie on $L_0$:
   $$\left| \langle Q_i - a_0, (-u_{0,y}, u_{0,x})^T \rangle \right| \le 1.0 \times 10^{-7}$$
3. **Isometry & Reflection:** $\|R_{A_i}(P) - Q_i\|_2 \le 1.0 \times 10^{-9}$.

---

## 5. Connection to Literature & Book Instructions

### The Semantic Gap in Craft Instructions
In historical origami literature (e.g. Shuzo Fujimoto, *Solid Origami*, 1976, pp. 9–10), the instruction states:
> *«Make the mid-line AB. Bring corner ア onto the mid-line and crease the resulting fold (Cイ).»*

### Why Task C2 Does Not Automatically Follow From Text Alone
1. **Missing Reference Point in Text:** The verbal instruction only specifies "bring corner ア onto mid-line". It does **not** verbally state "the crease line must pass through corner C".
2. **Diagrammatic Grounding:** The reader looks at Figure 1/Step I and observes that corner C (bottom-right) remains stationary, acting as a pivot.
3. **Branch Disambiguation:** As proven above, Task C2 with $P = \text{corner}$ and $R = C$ yields **two distinct mathematical fold axes** ($D > 0$).
   - *Branch 1:* Crease passes from C to the left edge of the paper square (the intended fold Cイ).
   - *Branch 2:* Crease passes from C across the bottom/extended boundary (reflecting the corner outside the square flap).
4. **Conclusion for PCRS Reasoning Stand:**
   An automated agent or human researcher MUST NOT claim that the text alone defines the fold. The full traceable reasoning chain requires:
   $$\text{Author Text} + \text{Diagram Pivot Observation } (R = C) + \text{Paper Boundary Clipping } ([0,1]^2) + \text{Branch Selection } (t_1 \text{ vs } t_2)$$

---

## 6. Architectural Audit & Synthesis Matrix

| Feature | Primitive A | Primitive B | Primitive C1 | Primitive C2 |
| :--- | :--- | :--- | :--- | :--- |
| **Operation Name** | `REFLECT_POINT` | `POINT_TO_POINT` | `POINT_TO_LINE_UNCONSTRAINED` | `POINT_TO_LINE_THROUGH_POINT` |
| **Mathematical Nature** | Householder Isometry | Perpendicular Bisector | Parabola Tangent Envelope | Huzita Axiom 5 (Circle-Line Intersection) |
| **Input Data** | Point $p$, Axis $L(a, u)$ | Points $P_1, P_2$ | Point $P$, Directrix $L_0(a_0, u_0)$ | Point $P$, Directrix $L_0$, Through-point $R$ |
| **Output Data** | Point $p'$ | Axis $L$, multiplicity | Parametric generator $A(t)$ | Axes array $[A_1, A_2]$, targets $[Q_1, Q_2]$ |
| **Multiplicity** | Exactly $1$ | $1$ ($P_1 \ne P_2$); $\infty$ ($P_1 = P_2$) | Infinitely many ($\infty$, 1-parameter family) | $0, 1, 2$ (or $\infty$ if $P = R \in L_0$) |
| **Degenerate Inputs** | $\|u\| = 0$, NaN/$\infty$ | $\|P_1 - P_2\| < 10^{-10}$ | $P \in L_0$, $\|u_0\| = 0$ | $P = R$, $R \in L_0$, $\|P-R\| < \text{dist}(R, L_0)$ |
| **Independent Verification** | Midpoint on axis, orthogonality | $R_L(P_1) = P_2$, chord $\perp u$ | Check tangency to parabola | $R \in A_i$, $R_{A_i}(P) \in L_0$, isometry |
| **Missing Craft Premises** | None (pure transform) | None (pure bisector) | Target parameter $t$ or through-point $R$ | Pivot landmark $R$ from diagram + branch selection |
| **Readiness Status** | `VERIFIED_IN_KERNEL` | `SPEC_READY_FOR_TESTS` | `SPEC_CONCEPTUAL_FAMILY` | `SPEC_READY_FOR_TESTS` |

---

## 7. Minimal Proposed Amendments to Repository Specifications

1. **Adopt C1 vs C2 Split in Architecture:** Formally document that "point to line" is a 1-parameter family, while Huzita Axiom 5 is a 2-point/1-line constrained problem.
2. **Numerical Stability Threshold in Primitive B:** Require explicit $\varepsilon_{\text{sep}} = 1.0 \times 10^{-10}$ check to guard against subnormal cancellation noise.
3. **Traceability Requirement for Craft Experiments:** In `docs/research/PCRS_EXPERIMENT_EVIDENCE_CONTRACT.md`, mandate that every fold referencing Axiom 5 must explicitly declare how pivot point $R$ was derived (text vs diagram) and how branch $t_1$ vs $t_2$ was selected.
4. **Code Protection Maintained:** Do NOT modify `src/core/reflection.ts` or `src/verifier/independentVerifier.ts` until standalone test suites for B and C2 are drafted and reviewed.
