/**
 * CLI Runner for PCRS Gate 1.6 SEQ-003 Error Localization
 */
import { runSeq003ErrorLocalization } from '../src/core/seq003ErrorLocalization';

console.log('================================================================');
console.log('  PCRS THEORY LAB — GATE 1.6: SEQ-003 ERROR LOCALIZATION        ');
console.log('================================================================\n');

const result = runSeq003ErrorLocalization();

console.log(`Step 1 Validation (x = 1): ${result.step1Passed ? '✓ PASS (Correct)' : '✗ FAIL'}`);
console.log(`Step 2 Validation (Injected Error x = 1 instead of x = 0): ${result.step2Passed ? '✗ FAIL (Missed error)' : '✓ PASS (Error correctly detected & rejected)'}`);
console.log(`Step 3 Validation (Propagated Error): ${result.step3Passed ? '✗ FAIL' : '✓ PASS (Discrepancy confirmed)'}\n`);

console.log(`Detected First Incorrect Step: Operation ${result.detectedFirstErrorStep} (Expected: Operation 2)`);
console.log(`Max Discrepancy at Step 2:     ${result.maxDiscrepancyStep2.toExponential(4)}`);
console.log(`Actual S2 (Erroneous):       ${JSON.stringify(result.s2Actual)}`);
console.log(`Expected S2 (Correct):       ${JSON.stringify(result.expectedS2)}\n`);

console.log('================================================================');
console.log(`FINAL SEQ-003 VERDICT: ${result.summary}`);
console.log('================================================================');

if (!result.passed) {
  process.exit(1);
}
