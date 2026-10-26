# PCRS — LEGACY FIELD MAPPING FOR PATTERN PASSPORTS

**Документ:** `docs/patterns/PCRS_LEGACY_FIELD_MAPPING.md`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Репозиторий:** `pcrs-theory`  
**Фаза:** Schema Design (Package 2)  
**Дата фиксации:** 24 октября 2026 г.  
**Статус документа:** `RATIFIED / MAPPING_SPECIFIED`  

---

## 1. Overview
The legacy reference bank `Universal_Engineering_Stand_Pattern_Bank_v0_4.csv` is **unavailable** in the current project environment. Therefore, no mapping against actual content could be performed. 

This document defines the expected mapping strategy based on the field names provided in the requirement, ensuring future compatibility if the legacy bank is recovered.

---

## 2. Theoretical Field Mapping Table

| Legacy CSV Field | New Canonical Schema Section / Field | Mapping Action |
| :--- | :--- | :--- |
| `pattern_id` | `identity.pattern_id` | Direct Mapping |
| `name` | `identity.name` | Direct Mapping |
| `category` | `definition.category` | Direct Mapping |
| `rule` | `definition.rule` | Direct Mapping |
| `purpose` | `definition.purpose` | Direct Mapping |
| `scope` | `definition.scope` + `limitations.scope_boundaries` | Split Mapping |
| `applicability` | `applicability` (structured) | Expanded Mapping |
| `dependencies` | `dependencies_and_relations` | Expanded Mapping |
| `implementation` | `execution_semantics` | Structured Mapping |
| `verification` | `verification_contract` | Structured Mapping |
| `evidence` | `evidence_and_provenance` | Structured Mapping |
| `limitations` | `limitations` | Expanded Mapping |
| `priority` | *Excluded* | Not relevant to schema |
| `source` | `maintenance.author` / provenance | Structured Mapping |
| `implementation_status`| `identity.lifecycle_status` + `evidence_status` | Merged / Refined |
| `notes` | `maintenance.revision_history` | Restructured |
