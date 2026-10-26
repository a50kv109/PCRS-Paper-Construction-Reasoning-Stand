# PCRS — GATE 1.3: CONTROL EXPERIMENT CLOSURE REPORT (AIRPLANE & BOAT)

**Документ:** `EXPERIMENTS/ORIGAMI-REFERENCE/CONTROL-EXPERIMENT-REPORT.md`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Репозиторий:** `pcrs-theory`  
**Фаза:** Gate 1.3 (Control Experiment: Airplane & Boat)  
**Дата фиксации:** 24 октября 2026 г.  
**Статус документа:** `RATIFIED / GATE_1.3_CLOSED`  
**Связанные документы:** `PROJECT_CHARTER.md`, `EXPERIMENTS/GATE-1.2-CLOSURE-REPORT.md`, `EXPERIMENTS/ORIGAMI-REFERENCE/AIRPLANE-AUDIT.md`, `EXPERIMENTS/ORIGAMI-REFERENCE/BOAT-AUDIT.md`, `EXPERIMENTS/ORIGAMI-REFERENCE/OPERATION-CAPABILITY-MATRIX.md`

---

## 1. Executive Summary and Objectives

Gate 1.3 conducted a control experiment and end-to-end validation of the frozen 2D geometry kernel (**Model A**) using two classical origami reference scenarios:
1. **The Paper Airplane** (dart folding sequence).
2. **The Paper Boat** (traditional hat/box/boat base sequence).

**Primary Directive:** The geometry kernel (`src/core/reflection.ts`, `src/verifier/independentVerifier.ts`) and its established test suites (18/18 passing tests) remained strictly **frozen**. No code modifications were introduced to force compatibility.

---

## 2. Summary of Findings

1. **Kernel Invariant Preservation:** Both control experiments confirmed that Model A correctly executes axis-aligned and oblique linear reflections, preserves distance and area metrics within numerical tolerances ($\epsilon_{\text{coord}} = 10^{-7}, \epsilon_{\text{area}} = 10^{-9}$), and correctly passes through independent zero-trust verification.
2. **Preparatory Folding Executability:** Initial sheet layouts, centerline symmetry creases, diagonal corner folds, and preliminary brim reflections map directly to supported 2D convex polygon reflection and clipping operations (`CONFIRMED`).
3. **Model Boundaries Identified:** Advanced origami maneuvers—such as multi-layer thickness tracking, out-of-plane 3D dihedral rotation, non-convex intersection clipping, and topological pocket flattening—are mathematically outside the scope of Model A (`UNSUPPORTED_BY_CURRENT_KERNEL / OUT_OF_SCOPE`).

---

## 3. Final Verdict

### VERNBICT: `GATE 1.3 CONTROL EXPERIMENT CLOSED — FROZEN KERNEL VALIDATED WITH DOCUMENTED MODEL BOUNDARIES`

- **Core Kernel Integrity:** Intact and verified (18/18 tests passing, exit code 0).
- **Epistemic Rigor:** All traditional folding operations successfully categorized in the Operation Capability Matrix.
- **Next Steps:** Gate 1 and its control experiments are fully complete. No further work on Model A is required; any future exploration of 3D kinematics or non-convex models belongs to subsequent research gates.
