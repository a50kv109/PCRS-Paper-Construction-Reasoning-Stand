# PCRS — CONTRACT ONTOLOGY

**Документ:** `docs/architecture/PCRS_CONTRACT_ONTOLOGY.md`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Репозиторий:** `pcrs-theory`  
**Фаза:** Architecture Design (Package 1)  
**Дата фиксации:** 24 октября 2026 г.  
**Статус документа:** `RATIFIED / ONTOLOGY_SPECIFIED`  

---

## 1. Purpose and Scope

This document defines the conceptual entity ontology for the PCRS (Paper Construction Reasoning Stand) framework. It establishes precise definitions, ownership, required/optional status, and relationships for foundational geometric reasoning entities, ensuring that AI-generated proposals, core computations, independent verifications, and experimental evidence remain strictly separated and rigorously typed.

---

## 2. Entity Ontology Table

| Entity Name | Definition | Ownership | Required / Optional | Direct Relationships |
| :--- | :--- | :--- | :--- | :--- |
| **OBJECT** | The fundamental geometric entity under study (e.g., a paper sheet $\mathcal{S}$, polygon, crease line). | System / Object Registry | Required | Governed by `IDENTITY`, bound to `STATE`. |
| **IDENTITY** | The formal rule or invariant condition determining whether an object remains the same object across transformations. | Object Passport | Required | Associated with `OBJECT`. |
| **STATE** | An immutable, complete geometric and topological configuration of an object at a discrete time step $t_k$. | State Manager / Core | Required | References `OBJECT`, encapsulated in `OBJECT_PASSPORT`. |
| **REPRESENTATION** | A visual presentation, SVG rendering, coordinate projection, or human-readable format of a state. | UI / Rendering Engine | Optional (Secondary) | Derived from `STATE`. *Rule: Representation $\neq$ Object.* |
| **OPERATION** | A defined geometric transformation or construction action (e.g., rigid reflection $R_L$, clipping). | Kernel / Core Engine | Required | Applied to `STATE`, recorded in `TRACE`. |
| **CONSTRAINT** | A strict precondition, invariant rule, or boundary condition that must hold for an operation or state. | Pattern / Core Contract | Required | Constrains `OPERATION` and `STATE`. |
| **PATTERN** | Reusable geometric knowledge, strategy, or operation structure governing problem-solving approaches. | Pattern Library | Required | Governed by `PATTERN_PASSPORT`. |
| **EXPERIMENT** | A controlled, reproducible test of a hypothesis or operational behavior within explicit bounds. | Experiment Runner | Required | Governed by `EXPERIMENT_CONTRACT`. |
| **TRACE** | The ordered history of requested, accepted, executed, and rejected operations ($\langle O_1, O_2, \dots \rangle$). | Execution Engine | Required | Links `STATE` transitions to `OPERATION`. |
| **MEASUREMENT** | A computed or observed quantitative value with explicit methodology, precision, and units. | Verifier / Core | Required | Referenced in `EVIDENCE_RECORD`. |
| **CLAIM** | A formal assertion produced by an agent or producer that can be evaluated for correctness. | Agent / Producer | Required | Evaluated through `VERIFICATION`. |
| **VERIFICATION** | The independent procedure and outcome used to evaluate a specific claim against ground truth or invariants. | Independent Verifier | Required | Produces `VERIFICATION_REPORT` / `EVIDENCE`. |
| **EVIDENCE** | The recorded empirical or analytical basis supporting a verification result (logs, deltas, metrics). | Verifier / Audit Log | Required | Contained in `EVIDENCE_RECORD`. |
| **PROVENANCE** | The formal pedigree, source lineage, software version, and history of data, claims, and artifacts. | System Audit | Required | Attached to Passports and Evidence Records. |
| **TOPOLOGY** | The relational adjacency, boundary connectivity, and neighborhood structure of geometric primitives. | Core Geometry | Optional (Specialized) | Part of `STATE` in advanced folding models. |
| **REFERENCE_FRAME** | The coordinate system basis (e.g., global Cartesian frame) relative to which coordinates are defined. | Core Geometry | Optional (Specialized) | Bound to `OBJECT_PASSPORT`. |
| **CONSTRUCTION_HISTORY** | The complete derivational tree of geometric primitives built via folding and intersection steps. | Trace / Core | Optional (Specialized) | Extended form of `TRACE`. |
| **SIGNATURE** | A cryptographic or structural hash ensuring data integrity and version binding of artifacts. | System Audit | Optional (Specialized) | Attached to `EVIDENCE_RECORD`. *Rule: Signature $\neq$ Geometric Truth.* |

---

## 3. Specialized Entities Evaluation for Initial PCRS Scope

- **TOPOLOGY:** *Necessary.* Required for distinguishing internal crease lines from boundary intersections and tracking polygon adjacency.
- **REFERENCE_FRAME:** *Necessary.* Required for unambiguous definition of 2D coordinates in Model A.
- **CONSTRUCTION_HISTORY:** *Optional / Deferred.* For single and multi-step reflections (Gate 1 through 1.6), a linear `TRACE` is sufficient. Full derivational trees are deferred to multi-branch origami routing gates.
- **SIGNATURE:** *Optional.* Useful for data integrity and artifact versioning, but explicitly noted as non-proof of geometric correctness.
