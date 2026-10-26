/**
 * CLI Runner for PCRS Gate 1.4 SEQ-001 Sequential Experiment
 */
import { runSeq001Experiment } from '../src/core/seq001Test';

console.log('================================================================');
console.log('  PCRS THEORY LAB — GATE 1.4: SEQ-001 SEQUENTIAL EXPERIMENT     ');
console.log('================================================================\n');

const report = runSeq001Experiment();

console.log(`Initial State [1,2] × [0,2]:`);
console.log(`  A = ${JSON.stringify(report.initialState[0])}`);
console.log(`  B = ${JSON.stringify(report.initialState[1])}`);
console.log(`  C = ${JSON.stringify(report.initialState[2])}`);
console.log(`  D = ${JSON.stringify(report.initialState[3])}\n`);

for (const step of report.steps) {
  console.log(`--- ${step.stepName} ---`);
  console.log(`  Status: ${step.passed ? '✓ PASS' : '✗ FAIL'}`);
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
console.log(`  Distance Preserved (Isometry): ${report.invariants.distancePreserved ? '✓ PASS' : '✗ FAIL'}`);
console.log(`  Area Preserved (Unsigned = 2.0): ${report.invariants.areaPreserved ? '✓ PASS' : '✗ FAIL'}`);
console.log(`  Orientation Reversed Op 1:     ${report.invariants.orientationReversedOp1 ? '✓ PASS' : '✗ FAIL'}`);
console.log(`  Orientation Restored Op 2:     ${report.invariants.orientationReversedOp2 ? '✓ PASS' : '✗ FAIL'}`);
console.log(`  Axis Fixed Points Valid:       ${report.invariants.axisFixedPointsValid ? '✓ PASS' : '✗ FAIL'}\n`);

console.log('================================================================');
console.log(`FINAL SEQ-001 VERDICT: ${report.summary}`);
console.log('================================================================');

if (!report.passed) {
  process.exit(1);
}
