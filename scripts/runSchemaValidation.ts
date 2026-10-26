/**
 * CLI Runner for PCRS Package 13A: JSON Schema Validation Gate
 */
import { runSchemaValidationSuite } from '../src/core/schemaValidationTest';

console.log('================================================================');
console.log('  PCRS THEORY LAB — PACKAGE 13A: JSON SCHEMA VALIDATION GATE     ');
console.log('================================================================\n');

const suite = runSchemaValidationSuite();

console.log(`Schema Standard: ${suite.schemaVersion}`);
console.log(`Total Validation Tests: ${suite.totalTests}\n`);

for (const t of suite.results) {
  const mark = t.passed ? '✓ PASS' : '✗ FAIL';
  const tag = t.isNegativeTest ? '[NEGATIVE CONTROL]' : '[POSITIVE / BENCHMARK]';
  console.log(`  ${mark} ${t.testId}: ${t.name} ${tag}`);
  console.log(`         Описание:    ${t.description}`);
  console.log(`         Диагностика: ${t.diagnostic}\n`);
}

console.log('================================================================');
console.log(`RESULT: ${suite.passedTests} / ${suite.totalTests} TESTS PASSED`);
console.log(`SCHEMA GATE VERDICT: ${suite.allPassed ? 'PASS — JSON SCHEMA VALIDATION GATE SATISFIED' : 'FAIL — SCHEMA GATE NOT SATISFIED'}`);
console.log('================================================================');

if (!suite.allPassed) {
  process.exit(1);
}
