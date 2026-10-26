# PCRS — PATTERN PASSPORT CANONICAL SCHEMA

**Документ:** `docs/patterns/PCRS_PATTERN_PASSPORT_SCHEMA.md`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Репозиторий:** `pcrs-theory`  
**Фаза:** Architecture Design (Package 2)  
**Дата фиксации:** 24 октября 2026 г.  
**Статус документа:** `RATIFIED / SCHEMA_SPECIFIED`  

---

## 1. Purpose and Scope
This document defines the canonical, versioned schema for **Pattern Passports** in the PCRS framework. A Pattern Passport is a machine-readable contract describing reusable geometric knowledge, strategies, and operational structures. It enforces a strict separation between mathematical specification, implementation status, and empirical verification evidence.

---

## 2. Passport Sections

1. **Identity:** `pattern_id` (string), `name` (string), `description` (string), `schema_version` (string), `pattern_version` (string), `lifecycle_status` (Enum).
2. **Definition:** `rule` (string), `purpose` (string), `category` (string), `domain` (string), `scope` (string).
3. **Applicability:** `preconditions` (list), `required_properties` (list), `supported_inputs` (list), `unsupported_inputs` (list), `degeneracies` (list).
4. **Inputs and Outputs:** `inputs` (descriptor list), `coordinate_system` (string), `output_descriptor` (object), `error_conditions` (list).
5. **Execution Semantics:** `operation_description` (string), `dependency_references` (list), `state_transition_semantics` (string), `proposal_vs_execution` (string).
6. **Verification Contract:** `postconditions` (list), `analytic_oracle` (string), `tolerance_policy` (object), `positive_tests` (list), `negative_controls` (list), `invariant_checks` (list).
7. **Evidence and Provenance:** `evidence_identifiers` (list), `reproduction_commands` (list), `evidence_status` (Enum), `known_gaps` (list).
8. **Limitations:** `scope_boundaries` (list), `unresolved_assumptions` (list), `unsupported_claims` (list).
9. **Dependencies and Relations:** `prerequisite_patterns` (list), `related_patterns` (list), `core_capabilities` (list), `linked_experiments` (list).
10. **Maintenance:** `author` (string), `revision_history` (list), `deprecation_links` (list).

---

## 3. Lifecycle and Evidence Statuses
- **Lifecycle Statuses:** `PROPOSED`, `SPECIFIED`, `DERIVED`, `EXPERIMENT_VERIFIED`, `FAILED`, `UNSUPPORTED_INPUT`, `UNVERIFIED`.
- **Evidence Statuses:** `CONFIRMED_BY_TEST`, `CONFIRMED_BY_ANALYTIC_CHECK`, `IMPLEMENTED_NOT_FULLY_VERIFIED`, `UNRESOLVED`, `OUT_OF_SCOPE`, `UNVERIFIED`.
