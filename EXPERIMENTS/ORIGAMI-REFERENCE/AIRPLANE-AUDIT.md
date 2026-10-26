# PCRS — GATE 1.3: PAPER AIRPLANE CONTROL EXPERIMENT AUDIT

**Документ:** `EXPERIMENTS/ORIGAMI-REFERENCE/AIRPLANE-AUDIT.md`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Репозиторий:** `pcrs-theory`  
**Фаза:** Gate 1.3 (Control Experiment: Airplane & Boat)  
**Дата фиксации:** 24 октября 2026 г.  
**Статус документа:** `RATIFIED / CONTROL_AUDIT_COMPLETE`  
**Связанные документы:** `PROJECT_CHARTER.md`, `EXPERIMENTS/GATE-1.2-CLOSURE-REPORT.md`, `EXPERIMENTS/ORIGAMI-REFERENCE/OPERATION-CAPABILITY-MATRIX.md`

---

## 1. Purpose and Scope

This document records an independent geometric audit of the traditional **Paper Airplane** folding sequence against the frozen 2D geometry kernel (**Model A**) developed during Gate 1. 

**Strict Rule:** In accordance with Gate 1.3 safety protocols, the geometry kernel (`src/core/reflection.ts`, `src/verifier/independentVerifier.ts`) is **frozen**. No code modifications were made to make the control experiment pass. We evaluate what subset of the airplane folding sequence can be executed using the public API of Model A and where the geometric limits of 2D planar reflections are reached.

---

## 2. Airplane Folding Sequence Breakdown

A standard dart-style paper airplane folding sequence consists of the following operational steps:

1. **Initial Sheet ($S_0$):** Rectangular or square sheet of paper (e.g., domain $[0, 2] \times [0, 4]$ or $[0, 2] \times [0, 2]$).
2. **Centerline Crease ($L_1$):** Folding the paper in half along its longitudinal axis ($x = x_{\text{center}}$) to create a reference symmetry line.
3. **Nose Diagonal Folds ($L_2, L_3$):** Folding the top-left and top-right corners inward along diagonal lines meeting at the centerline to form a triangular nose cone.
4. **Wing Flap Folds ($L_4, L_5$):** Folding the outer wings down along lines parallel to or anchored near the centerline.
5. **Fuselage Locking / Stabilizers:** Secondary folds along the bottom edges.

---

## 3. Step-by-Step Kernel Execution and Mapping

### Step 1: Initial Rectangular Sheet ($S_0$)
- **Geometry:** Polygon vertices: `[[0, 0], [2, 0], [2, 4], [0, 4]]`.
- **Kernel Evaluation:** Fully valid input. Evaluated by `independentVerifierSignedArea` (Area = 8.0).
- **Epistemic Status:** `CONFIRMED`.

### Step 2: Centerline Reflection ($L_1: x = 1.0$)
- **Line Definition:** Anchor `[1.0, 0.0]`, Direction `[0.0, 1.0]`.
- **Operation:** Reflecting the left half $[0, 1] \times [0, 4]$ across $x = 1.0$.
- **Kernel Evaluation:** Executed via `reflectPolygon` and `intersectPolygons`. Isometry invariant holds ($\Delta < 10^{-16}$), area conserved, contact classification identified as `SEGMENT_CONTACT` along the crease line.
- **Epistemic Status:** `CONFIRMED`.

### Step 3: Diagonal Nose Folds ($L_2, L_3$)
- **Line Definition:** Oblique lines passing through top corners (e.g., `[2, 4]` to `[1, 3]`).
- **Operation:** Folding triangular flaps inward.
- **Kernel Evaluation:** When treated as convex polygonal regions (e.g., triangular corner flaps), reflections and overlap intersection are fully supported by `reflectPolygon` and `intersectPolygons` (`CONVEX_ONLY`).
- **Epistemic Status:** `CONFIRMED (CONVEX SUBSET)`.

### Step 4: Wing Flap Folds ($L_4, L_5$) & 3D Dihedral Angles
- **Operation:** Folding wings down to form the body of the airplane.
- **Kernel Evaluation:** In physical origami, wing folds create a 3D dihedral angle where paper layers protrude out of the 2D plane. Model A is strictly a 2D planar reflection and projection engine. It does not model $z$-axis elevation, multi-layer stacking order ($Z$-order), or paper thickness.
- **Epistemic Status:** `UNSUPPORTED_BY_CURRENT_KERNEL / OUT_OF_SCOPE`.

---

## 4. Audit Conclusions for Paper Airplane

1. **Exact Mathematical Executability:** The initial layout, centerline symmetry, and primary diagonal nose-cone folding steps are fully supported by Model A 2D reflection and convex clipping primitives, maintaining floating-point precision within established tolerances ($\epsilon_{\text{coord}} = 10^{-7}, \epsilon_{\text{area}} = 10^{-9}$).
2. **Structural Boundary:** Multi-layer thickness, out-of-plane 3D dihedral rotations, and non-convex overlapping of wing assemblies cannot be simulated by a 2D planar kernel without extending the architecture into 3D kinematics (which belongs to future roadmap phases beyond Gate 1).
3. **Verdict:** `PASS FOR 2D PROJECTION SUBSET; OUT OF SCOPE FOR 3D KINEMATICS`.
