# PCRS — EXPERIMENT CATALOG INDEX

**Документ:** `EXPERIMENTS/ORIGAMI-REFERENCE/EXPERIMENT_INDEX.md`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Репозиторий:** `pcrs-theory`  
**Дата актуализации:** 24 октября 2026 г.  

---

## 1. Overview
This index catalogues all confirmed and proposed experiments for the PCRS geometry reasoning core (Model A).

---

## 2. Catalog

| ID | Description | Status | Report Link |
| :--- | :--- | :--- | :--- |
| **SEQ-001** | Two-step dependent reflection sequence | `EXPERIMENT_VERIFIED` | [SEQ-001-REPORT.md](./SEQ-001-REPORT.md) |
| **NC-001** | Dataflow negative control | `EXPERIMENT_VERIFIED` | [NC-001-NEGATIVE-CONTROL.md](./NC-001-NEGATIVE-CONTROL.md) |
| **SEQ-002** | Three-step dependent geometry sequence | `EXPERIMENT_VERIFIED` | [SEQ-002-REPORT.md](./SEQ-002-REPORT.md) |
| **SEQ-003** | Error localization in 3-step sequence | `EXPERIMENT_VERIFIED` | [SEQ-003-ERROR-LOCALIZATION.md](./SEQ-003-ERROR-LOCALIZATION.md) |
| **COMP-001** | Terminal-state blind spot (Compensation) | `EXPERIMENT_VERIFIED` | [COMP-001-COMPENSATION.md](./COMP-001-COMPENSATION.md) |

---

## 3. Implementation Status Summary
- **Validated Experiments:** SEQ-001, NC-001, SEQ-002, SEQ-003, COMP-001 are fully implemented and passing all tests.
- **Frozen Kernel:** `src/core/reflection.ts` and `src/verifier/independentVerifier.ts` are untouched across all experiments.
