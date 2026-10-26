# PCRS — GATE 1.3: OPERATION CAPABILITY MATRIX

**Документ:** `EXPERIMENTS/ORIGAMI-REFERENCE/OPERATION-CAPABILITY-MATRIX.md`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Репозиторий:** `pcrs-theory`  
**Фаза:** Gate 1.3 (Control Experiment: Airplane & Boat)  
**Дата фиксации:** 24 октября 2026 г.  
**Статус документа:** `RATIFIED / MATRIX_COMPLETE`  
**Связанные документы:** `PROJECT_CHARTER.md`, `EXPERIMENTS/GATE-1.2-CLOSURE-REPORT.md`, `EXPERIMENTS/ORIGAMI-REFERENCE/AIRPLANE-AUDIT.md`, `EXPERIMENTS/ORIGAMI-REFERENCE/BOAT-AUDIT.md`

---

## 1. Overview

This matrix maps traditional paper construction operations against the verified capabilities, mathematical tolerances, and architectural boundaries of the frozen 2D geometry kernel (**Model A**) established in Gate 1.

---

## 2. Capability and Limitation Matrix

| Operation / Fold Type | Origami Description | Model A 2D Kernel Support | Mathematical Feasibility | Epistemic Status | Limitation / Gap Reference |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Axis-Aligned Reflection** ($x=c, y=c$) | Folding paper along horizontal or vertical grid lines | **Fully Supported** (`reflectPolygon`) | Exact (Float64, $\Delta \le 10^{-16}$) | `CONFIRMED` | GAP-01 (Convex restriction) |
| **Oblique Reflection** (Arbitrary angle $\theta$) | Folding across tilted crease lines with irrational coordinates | **Fully Supported** (`Line2D` with anchor & unit vector) | Exact ($\Delta \le 10^{-16}$, orthogonal matrix check) | `CONFIRMED` | GAP-08 (Oblique robustness) |
| **Convex Polygon Overlap** | Calculating intersection and overlap area of folded regions | **Fully Supported** (`intersectPolygons` via Sutherland-Hodgman) | Exact for convex regions ($\epsilon_{\text{area}} \le 10^{-9}$) | `CONFIRMED` | GAP-09 (Scale-independent tolerance) |
| **Non-Convex Polygon Clipping** | Intersecting complex non-convex folded polygons | **Unsupported** (Algorithm restricted to convex) | N/A | `CONTRADICTED / OUT_OF_SCOPE` | GAP-01 (Convex only clipping) |
| **Multi-Layer Stacking ($Z$-Order)** | Tracking overlapping paper sheets and relative depth layers | **Unsupported** (Pure 2D planar projection) | N/A | `OUT_OF_SCOPE` | Explicit Gate 1 boundary |
| **3D Dihedral Angles & Elevation** | Simulating 3D folds out of plane ($z$-axis bending) | **Unsupported** (2D planar domain only) | N/A | `OUT_OF_SCOPE` | Model A scope boundary |
| **Topological Crease Inversion** | Reversing crease assignment (mountain $\leftrightarrow$ valley) | **Unsupported** (No crease graph topology) | N/A | `UNSUPPORTED_BY_CURRENT_KERNEL` | Architectural boundary |
| **Pocket Opening & Flattening** | Pulling open 3D paper pockets (boat/diamond base) | **Unsupported** (Requires kinematic flattening) | N/A | `UNSUPPORTED_BY_CURRENT_KERNEL` | Architectural boundary |

---

## 3. Summary of Architectural Boundaries

1. **Model A Scope:** Perfectly adequate for 2D rigid planar reflections, isometric invariant verification, and convex region intersection.
2. **First Core Limits:** As demonstrated in the Airplane and Boat control experiments, complex multi-step origami structures involving non-convex intersections, topological pocket opening, and 3D layering require higher-order models (Model B / Model C) which remain explicitly deferred beyond Gate 1.
