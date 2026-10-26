/**
 * CLI Runner for PCRS Gate 1.5 SEQ-002 Three-Step Experiment
 */
import { runSeq002Experiment } from '../src/core/seq002Test';

console.log('================================================================');
console.log('  PCRS THEORY LAB — GATE 1.5: SEQ-002 THREE-STEP SEQUENCE       ');
console.log('================================================================\n');

const report = runSeq002Experiment();

console.log(`Initial State S0 [1,2] × [0,2]:`);
console.log(`  A = ${JSON.stringify(report.initialState[0])}`);
console.log(`  B = ${JSON.stringify(report.initialState[1])}`);
console.log(`  C = ${JSON.stringify(report.initialState[2])}`);
console.log(`  D = ${JSON.stringify(report.initialState[3])}\n`);

for (const step of report.steps) {
  console.log(`--- Step ${step.stepNumber}: ${step.stepName} [Axis: ${step.reflectionAxis}] ---`);
  console.log(`  Status:            ${step.passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`  Output Vertices:   ${JSON.stringify(step.outputVertices)}`);
  console.log(`  Expected Vertices: ${JSON.stringify(step.expectedVertices)}`);
  console.log(`  Signed Area:       ${step.signedArea.toFixed(4)}`);
  console.log(`  Unsigned Area:     ${step.unsignedArea.toFixed(4)}`);
  for (const d of step.details) {
    console.log(`  Details:           ${d}`);
  }
  console.log();
}

console.log(`--- Invariant & Independent Checks ---`);
console.log(`  Distances Preserved (Isometry):  ${report.invariants.distancesPreserved ? '✓ PASS' : '✗ FAIL'}`);
console.log(`  Unsigned Area Constant (= 2.0):  ${report.invariants.unsignedAreaConstant ? '✓ PASS' : '✗ FAIL'}`);
console.log(`  Orientation Alternation (+/-/+/-): ${report.invariants.orientationAlternation ? '✓ PASS' : '✗ FAIL'}`);
console.log(`  Axis Fixed Points Valid:         ${report.invariants.axisFixedPointsValid ? '✓ PASS' : '✗ FAIL'}`);
console.log(`  Dataflow Chaining Verified:      ${report.invariants.dataflowChainingVerified ? '✓ PASS' : '✗ FAIL'}\n`);

console.log('================================================================');
console.log(`FINAL SEQ-002 VERDICT: ${report.summary}`);
console.log('================================================================');

if (!report.passed) {
  process.exit(1);
}
