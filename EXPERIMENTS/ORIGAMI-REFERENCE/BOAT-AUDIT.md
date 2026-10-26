# PCRS — GATE 1.3: TRADITIONAL PAPER BOAT CONTROL EXPERIMENT AUDIT

**Документ:** `EXPERIMENTS/ORIGAMI-REFERENCE/BOAT-AUDIT.md`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Репозиторий:** `pcrs-theory`  
**Фаза:** Gate 1.3 (Control Experiment: Airplane & Boat)  
**Дата фиксации:** 24 октября 2026 г.  
**Статус документа:** `RATIFIED / CONTROL_AUDIT_COMPLETE`  
**Связанные документы:** `PROJECT_CHARTER.md`, `EXPERIMENTS/GATE-1.2-CLOSURE-REPORT.md`, `EXPERIMENTS/ORIGAMI-REFERENCE/OPERATION-CAPABILITY-MATRIX.md`

---

## 1. Purpose and Scope

This document records an independent geometric audit of the traditional **Paper Boat** (hat / box / boat base) folding sequence against the frozen 2D geometry kernel (**Model A**) developed during Gate 1.

**Strict Rule:** In accordance with Gate 1.3 safety protocols, the geometry kernel is **frozen**. No code modifications were made. We evaluate which steps of the paper boat folding process map to valid 2D planar reflections and convex polygon clipping, and where the limitations of Model A are encountered.

---

## 2. Boat Folding Sequence Breakdown

The traditional paper boat sequence involves the following operational stages:

1. **Initial Sheet ($S_0$):** Rectangular sheet of paper (e.g., domain $[0, 2] \times [0, 3]$).
2. **Centerline Halving ($L_1$):** Folding the sheet in half vertically or horizontally.
3. **Corner Inward Folds ($L_2, L_3$):** Folding top corners down to meet the center crease (forming a house/pentagon or trapezoidal hat shape).
4. **Brim Flap Folds ($L_4, L_5$):** Folding bottom rectangular strips up on front and back (producing a classic paper hat).
5. **Center Open & Flatten (Diamond Base):** Pulling the center opening apart perpendicularly and flattening the structure into a square or diamond shape.
6. **Brim Upward Folds:** Folding bottom triangle tips up to form a smaller triangle (smaller hat).
7. **Final Open & Pull (Boat Base):** Pulling the center apart again and flattening into the final boat structure.

---

## 3. Step-by-Step Kernel Execution and Mapping

### Step 1 & 2: Rectangular Sheet and Halving Crease
- **Geometry:** Initial polygon `[[0,0], [2,0], [2,3], [0,3]]`. Halving crease along $y = 1.5$.
- **Kernel Evaluation:** Fully supported axis-aligned reflection (`reflectPolygon`) and convex intersection (`intersectPolygons`). Isometry invariant holds ($\Delta < 10^{-16}$).
- **Epistemic Status:** `CONFIRMED`.

### Step 3 & 4: Corner Diagonal Folds and Brim Folding
- **Geometry:** Folding corners along diagonal lines to form the paper hat.
- **Kernel Evaluation:** When modeled as symmetric diagonal reflections of convex polygonal flaps across boundary lines, these operations execute correctly within floating-point tolerance ($\epsilon_{\text{coord}} = 10^{-7}$).
- **Epistemic Status:** `CONFIRMED (CONVEX SUBSET)`.

### Step 5 & 7: Center Opening, Topological Inversion, and Diamond Flattening
- **Operation:** Pulling open 3D pockets and flattening them into new 2D polygonal configurations (diamond base and boat base).
- **Kernel Evaluation:** In origami mathematics, opening a pocket and flattening it involves reversing crease assignments (converting mountain folds to valley folds and vice versa) and performing non-affine topological transformations. Model A is strictly a rigid affine reflection kernel operating on explicitly declared linear reflection axes. It lacks graph-based crease topology management, pocket kinematics, and non-affine flattening algorithms.
- **Epistemic Status:** `UNSUPPORTED_BY_CURRENT_KERNEL / TOPOLOGICAL_OUT_OF_SCOPE`.

---

## 4. Audit Conclusions for Paper Boat

1. **Initial Folding Phases Validated:** The preparatory steps of the paper boat (halving, corner folding, and brim folding) are fully executable as a sequence of rigid 2D reflections and convex polygon intersections.
2. **Topological Limitations:** The core mechanism of the paper boat—opening a pocket and flattening it into a diamond/boat shape—requires topological crease reversal and multi-layer kinematic reasoning, which lie beyond the scope of Model A.
3. **Verdict:** `PASS FOR PREPARATORY FOLDING SUBSET; TOPOLOGICAL OPENING OUT OF SCOPE`.
