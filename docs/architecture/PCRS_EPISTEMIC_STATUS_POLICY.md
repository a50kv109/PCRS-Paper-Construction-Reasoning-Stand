# PCRS — EPISTEMIC STATUS AND AUDIT POLICY

**Документ:** `docs/architecture/PCRS_EPISTEMIC_STATUS_POLICY.md`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Репозиторий:** `pcrs-theory`  
**Фаза:** Architecture Design (Package 1)  
**Дата фиксации:** 24 октября 2026 г.  
**Статус документа:** `RATIFIED / POLICY_SPECIFIED`  

---

## 1. Purpose and Epistemic Core

To enforce rigorous scientific and engineering standards, PCRS strictly separates the **lifecycle status** of architectural artifacts (theories, patterns, specifications) from the **evidence status** of individual empirical or computational claims. An artifact can be fully specified (`SPECIFIED`) while an individual claim produced using it fails verification (`FAILED`).

---

## 2. Knowledge Lifecycle Statuses (Artifact Level)

Every pattern, specification, axiom, or theoretical module must carry one of the following canonical lifecycle statuses:

| Lifecycle Status | Definition | Transition Condition |
| :--- | :--- | :--- |
| **`PROPOSED`** | Advanced as an initial working hypothesis or architectural idea. | Initial repository submission. |
| **`SPECIFIED`** | Has a rigorous formal mathematical, algorithmic, or contract definition. | Inputs, outputs, constraints, and types agreed upon. |
| **`DERIVED`** | Analytically proven or derived via symbolic/geometric methods. | Formal derivation or analytic oracle presentation. |
| **`EXPERIMENT_VERIFIED`** | Confirmed by a reproducible experimental test run. | Passed independent multi-level audit in stated bounds. |
| **`FAILED`** | Review, test, or audit revealed a logical or numerical contradiction. | Documented counterexample or discrepancy ($\Delta > \epsilon$). |
| **`UNSUPPORTED_INPUT`** | Input data exceeds the specified domain of applicability. | Precondition violation detected. |
| **`UNVERIFIED`** | Recorded as a valid structure, but formal audit has not yet been executed. | Awaiting benchmark assignment or test execution. |

*Rule:* Upgrading an artifact's lifecycle status based solely on AI model fluency or successful text generation is strictly prohibited.

---

## 3. Audit Findings and Evidence Statuses (Claim / Execution Level)

When an individual operation, experiment execution, or agent claim is evaluated by the independent verifier, it receives one of the following empirical audit findings:

| Audit Finding Status | Definition |
| :--- | :--- |
| **`CONFIRMED_BY_TEST`** | Verified by direct execution of automated tests with exit code 0 and matching numeric tolerances ($\Delta \le \epsilon$). |
| **`CONFIRMED_BY_ANALYTIC_CHECK`** | Verified by direct comparison against independent mathematical ground truth (analytic oracle). |
| **`IMPLEMENTED_NOT_FULLY_VERIFIED`** | Code or module exists and compiles, but comprehensive independent verification tests are incomplete. |
| **`UNRESOLVED`** | An open gap, anomaly, or ambiguity that has been documented but not yet resolved (e.g., GAP-09). |
| **`OUT_OF_SCOPE`** | Falls outside the boundaries of the current model (e.g., 3D continuous kinematics, physical folding thickness). |

---

## 4. Separation of Concerns: Lifecycle vs. Evidence

- **Pattern Lifecycle (`SPECIFIED`, `EXPERIMENT_VERIFIED`, etc.):** Describes the maturity and formal status of the reasoning pattern or module within the repository.
- **Claim Evidence (`CONFIRMED_BY_TEST`, `UNRESOLVED`, etc.):** Describes the empirical verification outcome of a specific execution run or agent assertion.
- *Rule:* A `SPECIFIED` pattern may yield a `FAILED` execution run if given invalid inputs or encountering numerical divergence. Conversely, an experimental run cannot promote an un-specified pattern to `SPECIFIED` without updating its formal definition.
