# PCRS — MVP SCOPE

**Документ:** `docs/architecture/PCRS_MVP_SCOPE.md`  
**Статус:** `AUDITED / MVP_DEFINED`

## 1. Required Now
- **Core Kernel:** `src/core/reflection.ts` (Frozen 2D Planar Reflection).
- **Independent Verifier:** `src/verifier/independentVerifier.ts` (Oracle-based).
- **Pattern Standard:** `PatternPassport` (Versioned JSON schema).
- **Experiment Catalog:** Verified chains `SEQ-001` through `COMP-001`.
- **Negative Control:** Dataflow disruption testing.

## 2. Deferred (Post-MVP)
- **Automated Validation:** CI-level `PatternPassport` JSON schema validation.
- **Pattern Orchestrator:** Complex dependency graph management for branching sequences.
- **Enhanced UI:** Visualization of construction history trees.

## 3. Unsupported (Out of Scope)
- **Non-2D:** 3D kinematics, continuous collision detection.
- **Non-Linear:** Folding along curves.
- **Physical Dynamics:** Paper thickness, force modeling, flat-foldability heuristics.
