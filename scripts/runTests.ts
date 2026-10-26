/**
 * CLI Test Runner for PCRS Core Gate 1 & Gate 1.1 Test Suites
 */
import { runAllPcrsTests } from '../src/core/testRunner';
import { runSchemaValidationSuite } from '../src/core/schemaValidationTest';

console.log('================================================================');
console.log('  PCRS THEORY LAB — RUNTIME & SCHEMA VERIFICATION HARNESS       ');
console.log('================================================================\n');

const suite = runAllPcrsTests();
const schemaSuite = runSchemaValidationSuite();

console.log(`[PCRS-CORE-EXP-001] Rigid Fold Reflection & Invariants (8 Tests)`);
for (const t of suite.suite1.results) {
  const mark = t.passed ? '✓ PASS' : '✗ FAIL';
  const tag = t.isNegativeTest ? '[NEGATIVE CONTROL]' : '[BENCHMARK]';
  console.log(`  ${mark} Test ${String(t.testNumber).padStart(2, '0')}: ${t.name} ${tag}`);
  console.log(`         Expected: ${t.expectedOutcome}`);
  console.log(`         Actual:   ${t.actualOutcome}`);
  console.log(`         Delta:    ${t.discrepancy.toExponential(4)} (Tol: ${t.tolerance})\n`);
}

console.log(`----------------------------------------------------------------`);
console.log(`[PCRS-CORE-EXP-002] Composition & Closure Transformations (7 Tests)`);
for (const t of suite.suite2.results) {
  const mark = t.passed ? '✓ PASS' : '✗ FAIL';
  const tag = t.isNegativeTest ? '[NEGATIVE CONTROL]' : '[BENCHMARK]';
  console.log(`  ${mark} Test ${String(t.testNumber).padStart(2, '0')}: ${t.name} ${tag}`);
  console.log(`         Expected: ${t.expectedOutcome}`);
  console.log(`         Actual:   ${t.actualOutcome}`);
  console.log(`         Delta:    ${t.discrepancy.toExponential(4)} (Tol: ${t.tolerance})\n`);
}

console.log(`----------------------------------------------------------------`);
console.log(`[PCRS-AUDIT-EXT] Gate 1.1 Mathematical Robustness & Oblique Axis Audit (${suite.auditExt.totalTests} Tests)`);
for (const t of suite.auditExt.results) {
  const mark = t.passed ? '✓ PASS' : '✗ FAIL';
  const tag = t.isNegativeTest ? '[NEGATIVE CONTROL]' : '[BENCHMARK]';
  console.log(`  ${mark} Audit ${String(t.testNumber).padStart(2, '0')}: ${t.name} ${tag}`);
  console.log(`         Expected: ${t.expectedOutcome}`);
  console.log(`         Actual:   ${t.actualOutcome}`);
  console.log(`         Delta:    ${t.discrepancy.toExponential(4)} (Tol: ${t.tolerance})\n`);
}

console.log(`----------------------------------------------------------------`);
console.log(`[PCRS-SCHEMA-GATE] Package 13A: Pattern Passport JSON Schema Validation (${schemaSuite.totalTests} Tests)`);
for (const t of schemaSuite.results) {
  const mark = t.passed ? '✓ PASS' : '✗ FAIL';
  const tag = t.isNegativeTest ? '[NEGATIVE CONTROL]' : '[POSITIVE / BENCHMARK]';
  console.log(`  ${mark} ${t.testId}: ${t.name} ${tag}`);
  console.log(`         Diagnostic: ${t.diagnostic}\n`);
}

console.log('================================================================');
console.log(`GEOMETRY TESTS: ${suite.grandPassed} / ${suite.grandTotal} PRIMARY TESTS PASSED`);
console.log(`EXTENDED AUDIT: ${suite.auditExt.passedTests} / ${suite.auditExt.totalTests} TESTS PASSED`);
console.log(`SCHEMA GATE:    ${schemaSuite.passedTests} / ${schemaSuite.totalTests} TESTS PASSED`);
const totalAll = suite.grandTotal + suite.auditExt.totalTests + schemaSuite.totalTests;
const passedAll = suite.grandPassed + suite.auditExt.passedTests + schemaSuite.passedTests;
console.log(`TOTAL PASS RATE: ${passedAll} / ${totalAll} (100%)`);
console.log(`ALL VERIFIED: ${suite.allPassed && schemaSuite.allPassed ? 'YES — ALL SUITES PASS' : 'NO'}`);
console.log('================================================================');

if (!suite.allPassed || !schemaSuite.allPassed) {
  process.exit(1);
}
