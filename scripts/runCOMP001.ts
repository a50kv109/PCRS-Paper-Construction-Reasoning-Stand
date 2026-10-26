/**
 * CLI Runner for PCRS Gate 1.7 COMP-001 Compensation Experiment
 */
import { runComp001Experiment } from '../src/core/comp001Compensation';

console.log('================================================================');
console.log('  PCRS THEORY LAB — GATE 1.7: COMP-001 BLIND SPOT TEST          ');
console.log('================================================================\n');

const result = runComp001Experiment();

console.log(`Initial State:      ${JSON.stringify(result.initialState)}`);
console.log(`Intermediate State: ${JSON.stringify(result.intermediateState)}`);
console.log(`Terminal State:     ${JSON.stringify(result.terminalState)}\n`);

console.log(`Intermediate State != Initial: ${JSON.stringify(result.initialState) !== JSON.stringify(result.intermediateState) ? '✓ PASS' : '✗ FAIL'}`);
console.log(`Terminal State == Initial:     ${JSON.stringify(result.initialState) === JSON.stringify(result.terminalState) ? '✓ PASS' : '✗ FAIL'}\n`);

console.log('================================================================');
console.log(`FINAL COMP-001 VERDICT: ${result.summary}`);
console.log('================================================================');

if (!result.passed) {
  process.exit(1);
}
