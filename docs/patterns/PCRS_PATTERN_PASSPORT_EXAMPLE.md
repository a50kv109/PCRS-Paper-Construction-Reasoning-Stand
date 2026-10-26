# PCRS — PATTERN PASSPORT WORKED EXAMPLE: REFLECTION ACROSS X=A

**Документ:** `docs/patterns/PCRS_PATTERN_PASSPORT_EXAMPLE.md`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Репозиторий:** `pcrs-theory`  
**Фаза:** Schema Design (Package 2)  
**Дата фиксации:** 24 октября 2026 г.  
**Статус документа:** `RATIFIED / WORKED_EXAMPLE_SPECIFIED`  

---

## 1. Overview
This passport defines the **Reflection across x = a** operation. It serves as an illustrative example of the canonical PCRS schema.

```json
{
  "identity": {
    "pattern_id": "P-REFLECT-XA",
    "name": "Reflection across x=a",
    "description": "Performs a 2D planar reflection of a point (x,y) across the vertical line x=a. Formula: x' = 2a - x, y' = y.",
    "schema_version": "1.0.0",
    "pattern_version": "1.0.0",
    "lifecycle_status": "EXPERIMENT_VERIFIED"
  },
  "definition": {
    "rule": "x' = 2a - x; y' = y",
    "purpose": "To model the rigid fold transformation of paper across a vertical crease line.",
    "category": "Geometric Transformation",
    "domain": "2D Planar Geometry",
    "scope": "Rigid planar reflection"
  },
  "applicability": {
    "preconditions": ["Input point is finite", "a is a finite real number"],
    "required_properties": ["Finite numeric coordinates"],
    "supported_inputs": ["Any 2D point"],
    "unsupported_inputs": ["None"],
    "degeneracies": ["None"]
  },
  "inputs_and_outputs": {
    "inputs": [{ "name": "p", "type": "Point2D" }, { "name": "a", "type": "number" }],
    "coordinate_system": "Cartesian Float64",
    "output_descriptor": { "name": "p'", "type": "Point2D" },
    "error_conditions": ["INVALID_COORDINATE"]
  },
  "execution_semantics": {
    "operation_description": "Applies the formula x' = 2a - x; y' = y to the input point p.",
    "dependency_references": ["src/core/reflection.ts"],
    "state_transition_semantics": "State_{k+1} = ReflectXa(State_k, a)",
    "proposal_vs_execution": "Agent proposes reflection; core computes transformed coordinates."
  },
  "verification_contract": {
    "postconditions": ["Distance from axis is preserved", "y-coordinate is invariant"],
    "analytic_oracle": "Independent analytic calculation x' = 2a - x",
    "tolerance_policy": { "coord": 1.0e-7 },
    "positive_tests": ["Test Case reflection_x_a_01"],
    "negative_controls": ["Test Case reflection_x_a_NaN_Input"],
    "invariant_checks": ["verifyIsometry"]
  },
  "evidence_and_provenance": {
    "evidence_identifiers": ["SEQ-001"],
    "reproduction_commands": ["npm run test:seq001"],
    "evidence_status": "CONFIRMED_BY_TEST",
    "known_gaps": []
  },
  "limitations": {
    "scope_boundaries": ["Planar reflection only"],
    "unresolved_assumptions": ["Zero thickness"],
    "unsupported_claims": ["Does not prove physical foldability"]
  },
  "dependencies_and_relations": {
    "prerequisite_patterns": [],
    "related_patterns": ["P-01 Rigid Fold Reflection"],
    "core_capabilities": ["2D reflection kernel"],
    "linked_experiments": ["SEQ-001"]
  },
  "maintenance": {
    "author": "PCRS Theory Lab",
    "revision_history": [{ "version": "1.0.0", "date": "2026-10-24", "note": "Initial release" }],
    "deprecation_links": []
  }
}
```
