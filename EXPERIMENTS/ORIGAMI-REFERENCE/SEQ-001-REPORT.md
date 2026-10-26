# PCRS — GATE 1.4: EXPERIMENT SEQ-001 EXECUTION REPORT

**Документ:** `EXPERIMENTS/ORIGAMI-REFERENCE/SEQ-001-REPORT.md`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Репозиторий:** `pcrs-theory`  
**Фаза:** Gate 1.4 (First Executable Sequential Experiment SEQ-001)  
**Дата фиксации:** 24 октября 2026 г.  
**Статус документа:** `RATIFIED / SEQ-001_COMPLETED`  
**Связанные документы:** `PROJECT_CHARTER.md`, `EXPERIMENTS/GATE-1.2-CLOSURE-REPORT.md`, `EXPERIMENTS/ORIGAMI-REFERENCE/OPERATION-CAPABILITY-MATRIX.md`

---

## 1. Executive Summary and Objective

Gate 1.4 implements and executes the first genuine multi-operation sequential experiment (**SEQ-001**) using the frozen PCRS geometry kernel. Unlike Gate 1.3 (which was a documentation-only audit), SEQ-001 executes two dependent 2D planar reflections where the output state of Operation 1 becomes the direct input state of Operation 2.

**Strict Constraint Compliance:**
- **Frozen Kernel Unmodified:** `src/core/reflection.ts` and `src/verifier/independentVerifier.ts` were strictly untouched.
- **Existing Tests Untouched:** Existing Gate 1 test suite (18/18 tests) remains 100% intact and passing.
- **No Physical Simulation Claims:** SEQ-001 verifies pure 2D planar geometric transformations and arithmetic invariants, not physical paper folding.

---

## 2. Test Specifications and Implementation

- **Test File Path:** `src/core/seq001Test.ts`
- **Runner Script Path:** `scripts/runSeq001.ts` (Command: `npm run test:seq001`)

### Initial State ($S_0$)
- **Domain Region:** $[1, 2] \times [0, 2]$
- **Vertices (Counter-Clockwise order):**
  - $A = (1, 0)$
  - $B = (2, 0)$
  - $C = (2, 2)$
  - $D = (1, 2)$

### Operation 1: Reflection across $x = 1$
- **Line Definition:** Anchor $a_1 = [1, 0]$, Direction $u_1 = [0, 1]$
- **Analytic Transformation:** $x' = 2 - x, \; y' = y$
- **Expected Intermediate State ($S_1^{\text{exp}}$):**
  - $A_1 = (1, 0)$
  - $B_1 = (0, 0)$
  - $C_1 = (0, 2)$
  - $D_1 = (1, 2)$
- **Actual Intermediate State ($S_1^{\text{act}}$):** `[[1,0], [0,0], [0,2], [1,2]]` (Max discrepancy $\Delta = 0.0000e+0$)

### Operation 2: Reflection across $x = 0$ (Consuming $S_1^{\text{act}}$)
- **Line Definition:** Anchor $a_2 = [0, 0]$, Direction $u_2 = [0, 1]$
- **Analytic Transformation:** $x' = -x, \; y' = y$
- **Expected Final State ($S_2^{\text{exp}}$):**
  - $A_2 = (-1, 0)$
  - $B_2 = (0, 0)$
  - $C_2 = (0, 2)$
  - $D_2 = (-1, 2)$
- **Actual Final State ($S_2^{\text{act}}$):** `[[-1,0], [0,0], [0,2], [-1,2]]` (Max discrepancy $\Delta = 0.0000e+0$)

---

## 3. Invariant Checks and Independent Verification Results

1. **Vertex Coordinates:** All intermediate and final vertex coordinates matched independent analytic expectations within tolerance $\epsilon_{\text{coord}} = 10^{-7}$ ($\Delta = 0.0000e+0$).
2. **Distance Preservation (Isometry):** All pairwise Euclidean distances between initial vertices and final vertices remained invariant ($\Delta \le 10^{-7}$).
3. **Area Preservation:** Unsigned area remained constant at $2.0$ throughout the sequence ($\Delta = 0.0000e+0$).
4. **Orientation Reversal (Signed Area):**
   - Initial Signed Area: $+2.0$
   - Intermediate Signed Area (after Op 1): $-2.0$ (Orientation reversed)
   - Final Signed Area (after Op 2): $+2.0$ (Orientation restored to initial)
5. **Fixed Points on Reflection Axes:** Points lying on reflection axes ($x=1$ and $x=0$) demonstrated zero displacement ($\Delta \le 10^{-9}$).
6. **Data Flow Verification:** Operation 2 consumed the actual array returned by Operation 1, confirming sequential execution state chaining.

---

## 4. Execution Commands and Verification Log

- **Commands Executed:**
  ```bash
  npm test && npm run test:seq001 && npm run lint && npm run build
  ```
- **Exit Code:** `0`
- **Test Counts:**
  - Gate 1 Core & Audit Suite: 18 / 18 tests passed (`npm test`)
  - Gate 1.4 Sequential Experiment: SEQ-001 passed (`npm run test:seq001`)
  - TypeScript Linter (`tsc --noEmit`): 0 errors
  - Production Build (`vite build`): Success (Exit code 0)

---

## 5. File Changes Ledger

| File Path | Action | Description | Frozen Kernel Untouched? |
| :--- | :--- | :--- | :--- |
| `src/core/reflection.ts` | Unchanged | Core reflection kernel | **YES** |
| `src/verifier/independentVerifier.ts` | Unchanged | Independent Zero-Trust Verifier | **YES** |
| `src/core/seq001Test.ts` | Created | SEQ-001 execution & invariant test suite | N/A |
| `scripts/runSeq001.ts` | Created | CLI runner script for SEQ-001 | N/A |
| `package.json` | Modified | Added `"test:seq001"` script | N/A |
| `EXPERIMENTS/ORIGAMI-REFERENCE/SEQ-001-REPORT.md` | Created | SEQ-001 execution closure report | N/A |

---

## Final Verdict

**PASS — SEQUENTIAL GEOMETRY VERIFIED**
