# PCRS — KNOWLEDGE REUSE MATRIX

**Документ:** `docs/knowledge-reuse/PCRS_KNOWLEDGE_REUSE_MATRIX.md`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Репозиторий:** `pcrs-theory`  
**Фаза:** Knowledge Reuse (Package 3)  
**Дата фиксации:** 24 октября 2026 г.  

---

## 1. Matrix of Concepts

| Candidate Concept | Disposition | Rationale | Source Status | Target Contract | Dependencies | Validation Plan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Pattern Bank Fields** | **ADAPT** | Mapped to new `Pattern Passport` schema. | `DOCUMENTED_ONLY` | Pattern Passport | Core API | Functional schema test |
| **FSS Pattern Library** | **REFERENCE_ONLY** | Crystallographic context incompatible with planar paper folding. | `DOCUMENTED_ONLY` | None | N/A | Compare conceptual structure |
| **Evidence Contract** | **ADAPT** | PCRS requires State/Trace/Report separation. | `PROPOSED` | Evidence Record | Core/Verifier | Formal verification test |
| **Object Passport** | **REUSE** | Core entity for maintaining object identity. | `SPECIFIED` | Object Passport | Core | Identity test |
| **Invariant Catalog** | **REUSE** | Essential for zero-trust verifier. | `SPECIFIED` | Pattern Passport | Independent Verifier | Analytic oracle check |
| **Agent Access Contract** | **REJECT** | Outside current deterministic core scope (agent-based). | `PROPOSED` | None | None | N/A |

---

## 2. Summary of Findings
- The Universal Pattern Bank CSV file and FSS implementation files are `NOT_FOUND` in the local repository.
- Reused concepts are primarily architectural principles and contract structures, not algorithmic implementations.
- No semantic mismatches were identified for the adapted contracts, as adaptation for 2D geometry was strictly enforced.
