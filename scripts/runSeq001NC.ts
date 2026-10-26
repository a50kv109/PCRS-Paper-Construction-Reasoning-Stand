/**
 * CLI Runner for PCRS Gate 1.4B NC-001 Negative Control
 */
import { runNc001NegativeControl } from '../src/core/seq001NegativeControl';

console.log('================================================================');
console.log('  PCRS THEORY LAB — GATE 1.4B: NC-001 NEGATIVE CONTROL           ');
console.log('================================================================\n');

const result = runNc001NegativeControl();

console.log(`Expected Final State (SEQ-001):`);
console.log(`  ${JSON.stringify(result.expectedFinal)}`);
console.log(`Actual Tampered Final State (NC-001):`);
console.log(`  ${JSON.stringify(result.actualTamperedFinal)}\n`);

console.log(`Discrepancy Detected: ${result.errorDetected ? 'YES (Error Caught)' : 'NO (Error Missed)'}`);
console.log(`Max Coordinate Discrepancy: ${result.maxDiscrepancy.toExponential(4)}`);
console.log(`Discrepant Vertices:`);
for (const v of result.discrepantVertices) {
  console.log(`  - ${v}`);
}
console.log();

console.log('================================================================');
console.log(`FINAL NC-001 VERDICT: ${result.summary}`);
console.log('================================================================');

if (!result.passed) {
  process.exit(1);
}
