# PCRS — CONTEXT AND EVIDENCE BASELINE

**Документ:** `docs/architecture/PCRS_CONTEXT_AND_EVIDENCE_BASELINE.md`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Репозиторий:** `pcrs-theory`  
**Фаза:** Architecture Context Initialization & Evidence Baseline  
**Дата фиксации:** 24 октября 2026 г.  
**Статус документа:** `RATIFIED / BASELINE_ESTABLISHED`  

---

## 1. Mission and System Boundaries

### 1.1. Mission
PCRS (Paper Construction Reasoning Stand) is a deterministic research system designed to study geometric constructions, origami kinematics, and planar folding operations. Its primary goal is to establish a mathematically rigorous, verifiable, and extensible framework for spatial reasoning by AI agents while enforcing independent verification of all claims.

### 1.2. Governing Architecture
$$\text{AGENT PROPOSES} \longrightarrow \text{CORE COMPUTES} \longrightarrow \text{INDEPENDENT VERIFIER CHECKS} \longrightarrow \text{EXPERIMENT REFINES THE PATTERN}$$

### 1.3. System Boundaries & Explicit Scope
- **In Scope:** Zero-thickness 2D planar folding models, single and multi-step rigid reflections, 2D polygon overlap and contact classification (area overlap, edge contact, vertex contact, disjoint), floating-point tolerance policies ($\epsilon$).
- **Out of Scope / Deferred:** 3D continuous folding kinematics, paper thickness, physical layer stacking order ($Z$-order), continuous collision-free motion planning, and physical assemblability (`OUT_OF_SCOPE`).

---

## 2. Current Repository Structure Relevant to the Mission

The inspected workspace (`pcrs-theory`) contains the following structural components:
- `PROJECT_CHARTER.md` — Project charter, knowledge lifecycle statuses, and core principles.
- `GLOSSARY.md` — Formal definitions of geometric objects, crease lines, static/moving regions, and contact categories.
- `THEORY/` — Fundamental axioms (`FOUNDATIONS.md`), geometric models (`GEOMETRIC_MODEL.md`), fold operations (`FOLD_OPERATIONS.md`), and correctness levels (`CORRECTNESS_LEVELS.md`).
- `ARCHITECTURE/` — System overview, state/trace/report contracts, and verification protocol.
- `EXPERIMENTS/` — Acceptance and verification reports (Gate 0.3, Gate 1, Gate 1.1, Gate 1.2) and origami reference audit documents (`AIRPLANE-AUDIT.md`, `BOAT-AUDIT.md`, `OPERATION-CAPABILITY-MATRIX.md`, `SEQ-001-REPORT.md`, `NC-001-NEGATIVE-CONTROL.md`, `SEQ-002-REPORT.md`, `SEQ-003-ERROR-LOCALIZATION.md`, `SKILL-PASSPORT-STANDARD-DISCOVERY.md`).
- `src/` — Implementation files:
  - `src/core/reflection.ts` — Model A 2D reflection kernel and affine transformations (`VERIFIED_IN_SOURCE`).
  - `src/core/testRunner.ts` — Test runner for Gate 1 core tests (`CONFIRMED_BY_TEST`).
  - `src/core/seq001Test.ts`, `seq001NegativeControl.ts`, `seq002Test.ts`, `seq003ErrorLocalization.ts` — Executable sequential experiments and negative controls (`CONFIRMED_BY_TEST`).
  - `src/verifier/independentVerifier.ts` — Autonomous zero-trust geometric verifier (`VERIFIED_IN_SOURCE`).
- `scripts/` — CLI execution scripts (`runTests.ts`, `runSeq001.ts`, `runSeq001NC.ts`, `runSEQ002.ts`, `runSEQ003.ts`).

---

## 3. Existing Architecture and Contracts, with File References

1. **Deterministic Core (`src/core/reflection.ts`):**
   - Implements pure, deterministic 2D planar reflections ($R = 2uu^T - I, p' = a + R(p-a)$) and explicit input validation (`VERIFIED_IN_SOURCE`).
2. **Independent Verifier (`src/verifier/independentVerifier.ts`):**
   - Implements autonomous Gauss Shoelace formulas, Euclidean metrics, and isometry/area invariant checks completely independent of core computational functions (`VERIFIED_IN_SOURCE`).
3. **State, Trace, and Report Separation (`ARCHITECTURE/STATE_TRACE_REPORT.md`):**
   - Strictly separates geometric configurations (State), chronological operation sequences (Trace), and audit verdicts (Report) (`VERIFIED_IN_SOURCE`).

---

## 4. Reported Experiments versus Independently Confirmed Evidence

| Experiment / Gate | Claim / Reported Status | Evidence Label | Actual Verification Status |
| :--- | :--- | :--- | :--- |
| **Gate 1 / 1.1 / 1.2** | 18/18 tests passed, build & type-check success | `CONFIRMED_BY_TEST` | Verified via `npm test`, `npm run lint`, `npm run build` (exit code 0). |
| **Gate 1.3** | Airplane & boat folding sequence audit | `DOCUMENTED_ONLY` | Confirmed as documentation-only analysis (`AIRPLANE-AUDIT.md`, `BOAT-AUDIT.md`); no multi-step simulation code was added. |
| **SEQ-001** | Two-step dependent reflection sequence | `CONFIRMED_BY_TEST` | Executed and verified via `src/core/seq001Test.ts` and `scripts/runSeq001.ts`. |
| **NC-001** | Negative control for dataflow disruption | `CONFIRMED_BY_TEST` | Executed and verified via `src/core/seq001NegativeControl.ts` (detected $\Delta = 2.0$ on vertices B and C). |
| **SEQ-002** | Three-step dependent geometry sequence | `CONFIRMED_BY_TEST` | Executed and verified via `src/core/seq002Test.ts` (all 3 steps passed against analytic oracle). |
| **SEQ-003** | Error localization in three-step sequence | `CONFIRMED_BY_TEST` | Executed and verified via `src/core/seq003ErrorLocalization.ts` (correctly localized error to Operation 2). |

---

## 5. Existing Pattern / Passport / Evidence Concepts That Can Be Reused

1. **Universal Engineering Stand Pattern Bank (`Universal_Engineering_Stand_Pattern_Bank_v0_4.csv`):**
   - Reusable reference for separation of concerns, single source of truth, deterministic core behavior, explicit boundary validation, and provenance (`DOCUMENT_ONLY / EXTERNAL_REFERENCE`).
2. **Fedorov Symmetry Stand (FSS) Concepts:**
   - `PATTERN_LIBRARY`, `INVARIANTS_CATALOG`, `Evidence Contract`, `Object Passport`, and `Agent Access Contract` (`PROPOSED / ARCHITECTURAL_IDEA`).
3. **Pattern Passport v0.1 Schema:**
   - Fields: `trigger`, `input`, `operation`, `expected_relation`, `invariants`, `independent_oracle`, `failure_cases`, `scope_limit`, `epistemic_status` (`PROPOSED`).

---

## 6. Missing Artifacts and Unresolved Questions

1. **Scale-Independent Tolerance Policy (GAP-09):** A robust scale-invariant epsilon policy across arbitrary coordinate magnitudes remains documented as an open research gap.
2. **Machine-Readable Pattern Catalog:** A formal JSON/YAML registry connecting spatial pattern passports (`docs/PATTERN-LIBRARY/`) to automated test harnesses.

---

## 7. Proposed Follow-Up Packages (Ordered by Dependency)

1. **Package 1: Pattern Library Schema Formalization** (`docs/PATTERN-LIBRARY/PATTERN-SCHEMA.md`).
2. **Package 2: Spatial Pattern Passports Implementation** (`P-01` through `P-09` passport files).
3. **Package 3: Automated Evidence Binding** (linking test runner metrics directly to pattern passport verification criteria).

---

## 8. Summary of Knowns, Reported Facts, and Unknowns

- **Known (Verified / Tested):** Model A reflection kernel, independent verifier, Gate 1 test suite (18/18), SEQ-001, NC-001, SEQ-002, and SEQ-003 are fully implemented, tested, and verified with exit code 0 (`VERIFIED_IN_SOURCE`, `CONFIRMED_BY_TEST`).
- **Reported Only:** Gate 1.3 airplane/boat folding sequence is confirmed to be documentation analysis without multi-step execution code (`DOCUMENTED_ONLY`).
- **Unknown / Deferred:** 3D continuous kinematics, physical layer stacking order, and non-convex intersection clipping algorithms (`OUT_OF_SCOPE`).
