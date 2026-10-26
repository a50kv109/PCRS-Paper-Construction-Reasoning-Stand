# PCRS — INVARIANT AND EVIDENCE POLICY

**Документ:** `docs/knowledge-reuse/PCRS_INVARIANT_AND_EVIDENCE_POLICY.md`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Репозиторий:** `pcrs-theory`  
**Фаза:** Knowledge Reuse (Package 3)  
**Дата фиксации:** 24 октября 2026 г.  

---

## 1. Principles of Verification

### 1.1. Operation vs. Invariant
- **Geometric Invariant:** A property that *must* hold (e.g., isometry, area constancy, fixed points on an axis).
- **Executable Operation:** An action that *changes* the state (e.g., reflection).
- *Policy:* Operations must be verified *against* invariants. Successful operation execution is not the same as invariant preservation.

### 1.2. Claim vs. Evidence
- **Claim:** An assertion (e.g., "S3 is correct").
- **Evidence:** The trace data, intermediate states, and independent verifier output used to support the claim.
- *Policy:* A claim is not `EXPERIMENT_VERIFIED` unless the evidence record clearly distinguishes intermediate states checked against the analytic oracle.

### 1.3. Physical vs. Geometric Scope
- **Geometric Correctness:** Strictly 2D planar projection and reflection.
- **Physical Feasibility:** Out-of-scope for the current model. No claim regarding physical folding, thickness, or layer order shall be labeled `EXPERIMENT_VERIFIED` based on current core geometry tests.

---

## 2. Recommended Subset for Initial PCRS Release

| Concept | Status | Justification | Evidence Required |
| :--- | :--- | :--- | :--- |
| **Object Passport** | `SPECIFIED` | Required for base identity of folded paper state. | Unit tests of State identity. |
| **Pattern Passport** | `SPECIFIED` | Core structure for reusable knowledge. | Schema validation tests. |
| **P-01 Reflection** | `EXPERIMENT_VERIFIED` | Foundation of all folding models. | Gate 1 test suite. |
| **P-SEQ-CHAIN** | `EXPERIMENT_VERIFIED` | Enables multi-step reasoning validation. | SEQ-001/002/003 logs. |
| **Evidence Contract** | `SPECIFIED` | Needed for independent audit traceability. | Verification report schema validation. |
