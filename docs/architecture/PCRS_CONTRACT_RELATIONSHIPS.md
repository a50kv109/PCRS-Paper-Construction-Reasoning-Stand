# PCRS — CONTRACT RELATIONSHIPS & ARCHITECTURE GRAPH

**Документ:** `docs/architecture/PCRS_CONTRACT_RELATIONSHIPS.md`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Репозиторий:** `pcrs-theory`  
**Фаза:** Architecture Design (Package 1)  
**Дата фиксации:** 24 октября 2026 г.  
**Статус документа:** `RATIFIED / RELATIONSHIPS_SPECIFIED`  

---

## 1. Purpose and Architecture Design Principles

To prevent monolithic schema bloat, the PCRS architecture strictly separates four distinct contracts:
1. **Object Passport** — Defines what an object is, its identity, canonical state reference, geometry, provenance, and constraints.
2. **Pattern Passport** — Defines reusable reasoning knowledge, preconditions, required inputs, intended effect, postconditions, and independent verification criteria.
3. **Experiment Contract** — Defines a controlled test hypothesis, initial state, planned operations, expected observations, acceptance criteria, and negative controls.
4. **Evidence Record** — Records actual input/output states, executed operations, measurements, verifier results, failure reasons, and execution provenance.

---

## 2. Contract Relationship Graph (Mermaid)

```mermaid
graph TD
    subgraph Core Ontology Entities
        OBJ[OBJECT] --> ID[IDENTITY]
        OBJ --> ST[STATE]
        ST --> REP[REPRESENTATION]
        ST --> TOP[TOPOLOGY]
        OP[OPERATION] --> CST[CONSTRAINT]
        CL[CLAIM] --> VER[VERIFICATION]
        VER --> EV[EVIDENCE]
        TR[TRACE] --> OP
    end

    subgraph Four Core Contracts
        OPASS[Object Passport] --> OBJ
        OPASS --> ST
        OPASS --> ID
        
        PPASS[Pattern Passport] --> OP
        PPASS --> CST
        PPASS --> PAT[PATTERN]
        
        ECONT[Experiment Contract] --> E0[Initial State]
        ECONT --> PLAN[Planned Operations]
        ECONT --> NC[Negative Controls]
        
        EREC[Evidence Record] --> ACT[Actual States]
        EREC --> TR
        EREC --> MEAS[MEASUREMENT]
        EREC --> VER
        EREC --> PROV[PROVENANCE]
    end

    %% Cross-Contract References
    ECONT -.->|Governs execution| EREC
    PPASS -.->|Validates operation| OPASS
    EREC -.->|References object state| OPASS
    EREC -.->|References pattern used| PPASS
```

---

## 3. Reference Rules Between Contracts

1. **Object Passport $\leftrightarrow$ Evidence Record:** An Evidence Record references the specific Object Passport version and state identifier evaluated during an operation.
2. **Pattern Passport $\leftrightarrow$ Evidence Record:** When an operation executed within an experiment instantiates a registered pattern, the Evidence Record references the `pattern_id` and checks whether postconditions matched the Pattern Passport criteria.
3. **Experiment Contract $\leftrightarrow$ Evidence Record:** An Experiment Contract acts as the specification (plan), while the Evidence Record acts as the immutable log of execution (actual realization).
4. **Producer Claim $\leftrightarrow$ Verifier Evaluation:** Agent claims reference specific states or operations; the independent verifier evaluates them and outputs an Evidence Record without trusting the producer's internal assumptions.
