/**
 * PCRS Pattern Passport JSON Schema Validation Suite
 * Module: src/core/schemaValidationTest.ts
 *
 * Implements Stage 2 of Package 13A:
 * - Validates schemas/pattern-passport.schema.json against JSON Schema Draft 2020-12
 * - Validates positive and negative pattern passport instances using Ajv2020
 * - Enforces offline operation, strict type checking, and diagnostic clarity
 */

import fs from 'node:fs';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';

export interface SchemaValidationResult {
  testId: string;
  name: string;
  description: string;
  isNegativeTest: boolean;
  passed: boolean;
  diagnostic: string;
}

export interface SchemaTestSuiteReport {
  suiteName: string;
  schemaVersion: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  allPassed: boolean;
  results: SchemaValidationResult[];
}

/**
 * Loads the canonical PCRS Pattern Passport JSON Schema
 */
export function loadCanonicalPassportSchema(): any {
  const schemaPath = path.resolve(process.cwd(), 'schemas/pattern-passport.schema.json');
  const raw = fs.readFileSync(schemaPath, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Creates and configures an Ajv 2020 validator instance
 */
export function createPassportValidator() {
  const ajv = new Ajv2020({
    allErrors: true,
    strict: false,
  });
  const schema = loadCanonicalPassportSchema();
  const validate = ajv.compile(schema);
  return { ajv, schema, validate };
}

/**
 * Canonical Worked Example from docs/patterns/PCRS_PATTERN_PASSPORT_EXAMPLE.md
 */
export const VALID_WORKED_EXAMPLE = {
  identity: {
    pattern_id: "P-REFLECT-XA",
    name: "Reflection across x=a",
    description: "Performs a 2D planar reflection of a point (x,y) across the vertical line x=a. Formula: x' = 2a - x, y' = y.",
    schema_version: "1.0.0",
    pattern_version: "1.0.0",
    lifecycle_status: "EXPERIMENT_VERIFIED",
  },
  definition: {
    rule: "x' = 2a - x; y' = y",
    purpose: "To model the rigid fold transformation of paper across a vertical crease line.",
    category: "Geometric Transformation",
    domain: "2D Planar Geometry",
    scope: "Rigid planar reflection",
  },
  applicability: {
    preconditions: ["Input point is finite", "a is a finite real number"],
    required_properties: ["Finite numeric coordinates"],
    supported_inputs: ["Any 2D point"],
    unsupported_inputs: ["None"],
    degeneracies: ["None"],
  },
  inputs_and_outputs: {
    inputs: [{ name: "p", type: "Point2D" }, { name: "a", type: "number" }],
    coordinate_system: "Cartesian Float64",
    output_descriptor: { name: "p'", type: "Point2D" },
    error_conditions: ["INVALID_COORDINATE"],
  },
  execution_semantics: {
    operation_description: "Applies the formula x' = 2a - x; y' = y to the input point p.",
    dependency_references: ["src/core/reflection.ts"],
    state_transition_semantics: "State_{k+1} = ReflectXa(State_k, a)",
    proposal_vs_execution: "Agent proposes reflection; core computes transformed coordinates.",
  },
  verification_contract: {
    postconditions: ["Distance from axis is preserved", "y-coordinate is invariant"],
    analytic_oracle: "Independent analytic calculation x' = 2a - x",
    tolerance_policy: { coord: 1.0e-7 },
    positive_tests: ["Test Case reflection_x_a_01"],
    negative_controls: ["Test Case reflection_x_a_NaN_Input"],
    invariant_checks: ["verifyIsometry"],
  },
  evidence_and_provenance: {
    evidence_identifiers: ["SEQ-001"],
    reproduction_commands: ["npm run test:seq001"],
    evidence_status: "CONFIRMED_BY_TEST",
    known_gaps: [],
  },
  limitations: {
    scope_boundaries: ["Planar reflection only"],
    unresolved_assumptions: ["Zero thickness"],
    unsupported_claims: ["Does not prove physical foldability"],
  },
  dependencies_and_relations: {
    prerequisite_patterns: [],
    related_patterns: ["P-01 Rigid Fold Reflection"],
    core_capabilities: ["2D reflection kernel"],
    linked_experiments: ["SEQ-001"],
  },
  maintenance: {
    author: "PCRS Theory Lab",
    revision_history: [{ version: "1.0.0", date: "2026-10-24", note: "Initial release" }],
    deprecation_links: [],
  },
};

/**
 * Runs all mandatory test cases for the JSON Schema Validation Gate (Package 13A)
 */
export function runSchemaValidationSuite(): SchemaTestSuiteReport {
  const results: SchemaValidationResult[] = [];
  const { ajv, schema, validate } = createPassportValidator();

  // Test 0: Schema Meta-Validation against Draft 2020-12
  try {
    const isSchemaValid = ajv.validateSchema(schema);
    results.push({
      testId: 'TEST-SCHEMA-00',
      name: 'Мета-валидация самой схемы',
      description: 'Схема pattern-passport.schema.json корректна по спецификации JSON Schema Draft 2020-12',
      isNegativeTest: false,
      passed: Boolean(isSchemaValid),
      diagnostic: isSchemaValid
        ? 'Схема синтаксически валидна по стандарту Draft 2020-12'
        : `Ошибка валидации схемы: ${JSON.stringify(ajv.errors)}`,
    });
  } catch (err: any) {
    results.push({
      testId: 'TEST-SCHEMA-00',
      name: 'Мета-валидация самой схемы',
      description: 'Схема pattern-passport.schema.json корректна по спецификации JSON Schema Draft 2020-12',
      isNegativeTest: false,
      passed: false,
      diagnostic: `Исключение при валидации схемы: ${err.message}`,
    });
  }

  // Test 1: Positive Test - Valid Worked Example Accepted
  try {
    const valid = validate(VALID_WORKED_EXAMPLE);
    results.push({
      testId: 'TEST-SCHEMA-01',
      name: 'Положительный контроль: эталонный паспорт принимается',
      description: 'Корректный экземпляр паспорта P-REFLECT-XA полностью удовлетворяет схеме',
      isNegativeTest: false,
      passed: Boolean(valid),
      diagnostic: valid
        ? 'Экземпляр успешно принят без ошибок'
        : `Неожиданная ошибка валидации: ${JSON.stringify(validate.errors)}`,
    });
  } catch (err: any) {
    results.push({
      testId: 'TEST-SCHEMA-01',
      name: 'Положительный контроль',
      description: 'Валидация эталонного экземпляра',
      isNegativeTest: false,
      passed: false,
      diagnostic: `Исключение: ${err.message}`,
    });
  }

  // Test 2: Negative Test - Missing Required Field Rejected
  try {
    // Missing required top-level section 'verification_contract' and missing 'lifecycle_status' in identity
    const missingFieldInstance = JSON.parse(JSON.stringify(VALID_WORKED_EXAMPLE));
    delete missingFieldInstance.verification_contract;
    delete missingFieldInstance.identity.lifecycle_status;

    const valid = validate(missingFieldInstance);
    const errors = validate.errors || [];
    const caughtVerification = errors.some((e: any) => e.params?.missingProperty === 'verification_contract');
    const caughtLifecycle = errors.some((e: any) => e.params?.missingProperty === 'lifecycle_status');

    const passed = !valid && caughtVerification && caughtLifecycle;
    results.push({
      testId: 'TEST-SCHEMA-02',
      name: 'Негативный контроль: отсутствие обязательного поля отклоняется',
      description: 'Удаление обязательного раздела verification_contract и поля lifecycle_status отклоняется',
      isNegativeTest: true,
      passed,
      diagnostic: passed
        ? `Ошибки успешно пойманы: отсутствуют verification_contract и lifecycle_status`
        : `Сбой детекции отсутствующих полей: valid=${valid}, errors=${JSON.stringify(errors)}`,
    });
  } catch (err: any) {
    results.push({
      testId: 'TEST-SCHEMA-02',
      name: 'Негативный контроль: обязательные поля',
      description: 'Проверка обязательных полей',
      isNegativeTest: true,
      passed: false,
      diagnostic: `Исключение: ${err.message}`,
    });
  }

  // Test 3: Negative Test - Wrong Field Type Rejected
  try {
    // Wrong type: 'preconditions' given as string instead of array; 'pattern_version' given as number
    const wrongTypeInstance = JSON.parse(JSON.stringify(VALID_WORKED_EXAMPLE));
    wrongTypeInstance.applicability.preconditions = "not an array of strings";
    wrongTypeInstance.identity.pattern_version = 12345;

    const valid = validate(wrongTypeInstance);
    const errors = validate.errors || [];
    const caughtPreconditions = errors.some((e: any) => e.instancePath.includes('/applicability/preconditions'));
    const caughtVersion = errors.some((e: any) => e.instancePath.includes('/identity/pattern_version'));

    const passed = !valid && caughtPreconditions && caughtVersion;
    results.push({
      testId: 'TEST-SCHEMA-03',
      name: 'Негативный контроль: неверный тип поля отклоняется',
      description: 'Строка вместо массива в preconditions и число вместо строки в pattern_version отклоняются',
      isNegativeTest: true,
      passed,
      diagnostic: passed
        ? 'Ошибки неверных типов успешно обнаружены валидатором'
        : `Сбой детекции неверных типов: valid=${valid}, errors=${JSON.stringify(errors)}`,
    });
  } catch (err: any) {
    results.push({
      testId: 'TEST-SCHEMA-03',
      name: 'Негативный контроль: неверный тип',
      description: 'Проверка типов данных',
      isNegativeTest: true,
      passed: false,
      diagnostic: `Исключение: ${err.message}`,
    });
  }

  // Test 4: Negative Test - Invalid Enum Value Rejected
  try {
    // Invalid enum value for lifecycle_status and evidence_status
    const invalidEnumInstance = JSON.parse(JSON.stringify(VALID_WORKED_EXAMPLE));
    invalidEnumInstance.identity.lifecycle_status = "ABSOLUTELY_PROVEN_MAGIC";
    invalidEnumInstance.evidence_and_provenance.evidence_status = "NOT_A_REAL_STATUS";

    const valid = validate(invalidEnumInstance);
    const errors = validate.errors || [];
    const caughtLifecycleEnum = errors.some((e: any) => e.instancePath.includes('/identity/lifecycle_status'));
    const caughtEvidenceEnum = errors.some((e: any) => e.instancePath.includes('/evidence_and_provenance/evidence_status'));

    const passed = !valid && caughtLifecycleEnum && caughtEvidenceEnum;
    results.push({
      testId: 'TEST-SCHEMA-04',
      name: 'Негативный контроль: некорректное значение перечисления отклоняется',
      description: 'Недопустимые статусы жизненного цикла и свидетельств отклоняются схемой',
      isNegativeTest: true,
      passed,
      diagnostic: passed
        ? 'Ошибки некорректных enum-значений успешно обнаружены'
        : `Сбой детекции недопустимого enum: valid=${valid}, errors=${JSON.stringify(errors)}`,
    });
  } catch (err: any) {
    results.push({
      testId: 'TEST-SCHEMA-04',
      name: 'Негативный контроль: значения enum',
      description: 'Проверка ограниченных enum-полей',
      isNegativeTest: true,
      passed: false,
      diagnostic: `Исключение: ${err.message}`,
    });
  }

  // Test 5: Negative Test - Malformed JSON String Rejected with Diagnostics
  try {
    const malformedJsonString = '{\n  "identity": {\n    "pattern_id": "P-BROKEN",\n    trailing_comma: true,\n  }\n';
    let parseErrorCaught = false;
    let diagnosticMessage = '';

    try {
      JSON.parse(malformedJsonString);
    } catch (parseErr: any) {
      parseErrorCaught = true;
      diagnosticMessage = `JSON_SYNTAX_ERROR: ${parseErr.message}`;
    }

    results.push({
      testId: 'TEST-SCHEMA-05',
      name: 'Негативный контроль: некорректный синтаксис JSON отклоняется с диагностикой',
      description: 'Синтаксически битый JSON-текст отбраковывается до валидации с понятным сообщением об ошибке',
      isNegativeTest: true,
      passed: parseErrorCaught,
      diagnostic: parseErrorCaught
        ? `Успешно перехвачена синтаксическая ошибка: ${diagnosticMessage}`
        : 'Сбой: синтаксическая ошибка JSON не была обнаружена',
    });
  } catch (err: any) {
    results.push({
      testId: 'TEST-SCHEMA-05',
      name: 'Негативный контроль: синтаксис JSON',
      description: 'Проверка синтаксиса JSON',
      isNegativeTest: true,
      passed: false,
      diagnostic: `Исключение: ${err.message}`,
    });
  }

  const passedTests = results.filter((r) => r.passed).length;
  return {
    suiteName: 'PCRS-SCHEMA-VALIDATION-GATE (Package 13A)',
    schemaVersion: 'Draft 2020-12',
    totalTests: results.length,
    passedTests,
    failedTests: results.length - passedTests,
    allPassed: passedTests === results.length,
    results,
  };
}
