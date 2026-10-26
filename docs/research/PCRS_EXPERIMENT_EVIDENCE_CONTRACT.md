# PCRS — EXPERIMENT EVIDENCE CONTRACT

**Document ID:** `docs/research/PCRS_EXPERIMENT_EVIDENCE_CONTRACT.md`  
**Classification:** `NORMATIVE_CONTRACT / EVIDENCE_GOVERNANCE`  
**Epistemic Status:** `CANONICAL`  
**Principle:** Principle of Traceable Geometric Reasoning  
**Scope:** All historical, literature-derived, and empirical origami fold experiments in PCRS  

---

## 1. Principle of Traceable Geometric Reasoning

> **Foundational Law:** Every geometric claim, coordinate value, and fold axis must be strictly traceable to:
> 1. An original authorial intention;
> 2. Formalized mathematical constraints;
> 3. Explicit researcher axioms/assumptions;
> 4. Executed computational operations; and
> 5. Independent, zero-trust numerical audits with negative controls.
>
> If any of these links is omitted, the experiment report is incomplete and its epistemic status MUST be downgraded to `HYPOTHESIS` or `UNVERIFIED`. A ready numerical answer must never conceal an unverified premise.

---

## 2. Mandatory 11-Section Experiment Report Standard

Every experiment report submitted to `EXPERIMENTS/` (e.g., Fujimoto, Miura, Hull, Haga, Justin) MUST adhere to the canonical 11-section template defined below without omitting any section.

```markdown
# PCRS EXPERIMENT REPORT: [EXP-ID] — [TITLE]

## 1. Source Traceability & Bibliographic Anchor
## 2. Verbatim Author Instruction
## 3. Diagrammatic & Visual Observations
## 4. Experimenter Axioms & Coordinate Grounding
## 5. Formalized Geometric Constraints
## 6. Derived Analytical & Closed-Form Objects
## 7. Execution Environment & Computation Trace
## 8. Independent Verifier Audit & Metric Validation
## 9. Negative Control & Fault Injection Audit
## 10. Explicit Unverified Properties & Boundary Gaps
## 11. Epistemic Status & Governance Verdict
```

---

## 3. Section-by-Section Normative Requirements

### Section 1: Source Traceability & Bibliographic Anchor
- **Mandatory Fields:**
  - `Book / Source Title` (in original language and transliteration/translation).
  - `Author(s)` (full name).
  - `Publication Year & Edition / Publisher / ISBN`.
  - `Exact Page Numbers` (e.g., pp. 9–10).
  - `Figure / Diagram Designation` (e.g., Figure 1, Step I, Step II).
- **Prohibition:** Vague attributions like "traditional Japanese fold" or "known Fujimoto crease" are forbidden.

### Section 2: Verbatim Author Instruction
- **Mandatory Fields:**
  - `Original Text`: Exact transcription in original language (e.g., Japanese kanji/kana, French, English).
  - `Faithful Translation`: Literal translation into English or Russian.
- **Rule:** Do not paraphrase into mathematical terms in this section; record the author's exact colloquial or craft phrasing.

### Section 3: Diagrammatic & Visual Observations
- **Mandatory Content:**
  - List all visual features observable in the diagram that are **not explicitly articulated in the text** (e.g., "The fold originates at the bottom-right corner", "The sheet is depicted as a square", "Dotted line indicates valley crease").
  - Identifies implicit craft conventions assumed by origami practitioners.

### Section 4: Experimenter Axioms & Coordinate Grounding
- **Mandatory Content:**
  - Explicitly documents every arbitrary choice made by the analyst to digitize the craft instructions:
    - Origin point $(0,0)$ placement (e.g., bottom-left corner).
    - Coordinate axis orientation (+X right, +Y up).
    - Sheet dimensions (e.g., unit square $[0, 1] \times [0, 1]$ or normalized domain $[-1, 1]$).
    - Aspect ratio assumptions ($1:1$ square vs $\sqrt{2}:1$ A4).

### Section 5: Formalized Geometric Constraints
- **Mandatory Content:**
  - Translates craft instructions into algebraic equations and incidence relations:
    - Directrix line equation $K(x, y) = 0$.
    - Target point mapping $R_L(P) \in K$.
    - Fixed corner / through-point constraint $Q \in L$.
    - Huzita-Hatori axiom classification (Axiom 1 through 7).

### Section 6: Derived Analytical & Closed-Form Objects
- **Mandatory Content:**
  - Analytical derivations, radicals, and exact algebraic values:
    - Target point coordinates $T = (x_T, y_T)$.
    - Normal vector $n$ and unit direction vector $u$.
    - Anchor point $a$ (often midpoint).
    - Crease line equation $y = m x + c$ or $A x + B y + C = 0$.
    - Householder matrix $R_L$.
    - Exact angles (e.g., $\theta = 30^\circ$, $\tan(30^\circ) = 1/\sqrt{3}$).

### Section 7: Execution Environment & Computation Trace
- **Mandatory Content:**
  - Detailed execution record:
    - Execution Engine: State whether executed via native PCRS TypeScript test runner (`npm run test:...`) or via an external runtime.
    - If external runtime was used: State the exact technical impediment blocking the native runner and provide a checksum/re-implementation trace.
    - IEEE 754 precision level (Float64).
    - Complete numeric transformation table for all paper vertices.

### Section 8: Independent Verifier Audit & Metric Validation
- **Mandatory Content:**
  - Reports output of `src/verifier/independentVerifier.ts` or autonomous verification equations:
    - Maximum coordinate discrepancy: $\Delta_{\text{coord}} = \|p_{\text{actual}} - p_{\text{expected}}\|_\infty$.
    - Isometry check: $\max |d(p'_i, p'_j) - d(p_i, p_j)|$.
    - Unsigned area preservation: $|A_{\text{refl}}| \equiv |A_{\text{orig}}|$.
    - Orientation inversion check: $\text{sign}(A_{\text{refl}}) = -\text{sign}(A_{\text{orig}})$.
    - Axis fixed-point drift: $\|R_L(a) - a\|$.
    - Calibrated tolerance check ($\varepsilon \le 10^{-7}$).

### Section 9: Negative Control & Fault Injection Audit
- **Mandatory Content:**
  - Injects a deliberate defect into the fold parameters (e.g., perturbed angle $+0.5^\circ$, shifted anchor $\Delta x = 0.001$, or corrupted vertex coordinate).
  - Executes the verifier against the tampered data.
  - Proves that the independent verifier successfully flags the error (`PASS — ERROR CAUGHT`) with a non-zero discrepancy.

### Section 10: Explicit Unverified Properties & Boundary Gaps
- **Mandatory Content:**
  - An honest, exhaustive list of physical and topological properties that were **not** verified by this 2D rigid reflection model:
    - Paper thickness ($t = 0$ assumed).
    - Physical bend radius / elastoplastic deformation.
    - Multi-layer paper self-intersection / facet collision (3D).
    - Kawasaki / Maekawa local flat-foldability theorem at internal vertices (if applicable).
    - Non-creased facet distortion.

### Section 11: Epistemic Status & Governance Verdict
- **Allowed Statuses:**
  - `PROPOSED`: Theoretical model or paper fold sequence formulated but not yet numerically executed in PCRS.
  - `HYPOTHESIS`: Analytical derivation complete, but verified only in external runtime or pending negative controls.
  - `EXPERIMENT_VERIFIED`: Executed, verified by independent verifier against calibrated tolerance ($10^{-7}$), and negative control confirmed.
  - `FALSIFIED`: Contradicted by geometry or failed verification thresholds.
- **Sign-off:** Governance record with date, author/agent ID, and linked pattern passport ID.

---

## 4. Verification & Audit Checklist

Before accepting any experiment report into the PCRS repository, the auditor MUST verify:
- [ ] Are all 11 sections present with substantive content?
- [ ] Is there an unambiguous citation of book title and page number?
- [ ] Are researcher-added assumptions clearly separated from author instructions?
- [ ] Did the verifier evaluate both positive benchmark and negative control?
- [ ] Are unverified physical properties openly disclosed?
- [ ] Does the epistemic status strictly match the evidence tier?
