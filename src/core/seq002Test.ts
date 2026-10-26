/**
* PCRS — Gate 1.5: Experiment SEQ-002 (Three-Step Dependent Geometry Sequence)
* Module: src/core/seq002Test.ts
*
* Executes a sequential three-operation reflection experiment:
* S0: Initial [1, 2] × [0, 2] rectangle (A=(1,0), B=(2,0), C=(2,2), D=(1,2))
* Op 1: Reflect across x = 1 (Anchor [1,0], Direction [0,1]) -> S1
* Op 2: Reflect across x = 0 (Anchor [0,0], Direction [0,1]) -> S2 (consuming S1)
* Op 3: Reflect across y = 0 (Anchor [0,0], Direction [1,0]) -> S3 (consuming S2)
* Validates intermediate states, coordinate accuracy, isometry, unsigned/signed areas, orientation inversion, and dataflow chaining.
*/

import {
  Point2D,
  reflectPolygon,
  dist2D,
  calculateSignedArea,
  calculateUnsignedArea,
  reflectPoint,
} from './reflection';

export interface Seq002StepResult {
  stepNumber: number;
  stepName: string;
  reflectionAxis: string;
  inputVertices: Point2D[];
  outputVertices: Point2D[];
  expectedVertices: Point2D[];
  signedArea: number;
  unsignedArea: number;
  passed: boolean;
  maxCoordinateDiscrepancy: number;
  details: string[];
}

export interface Seq002ExperimentReport {
  passed: boolean;
  initialState: Point2D[];
  state1: Point2D[];
  state2: Point2D[];
  state3: Point2D[];
  steps: Seq002StepResult[];
  invariants: {
    distancesPreserved: boolean;
    unsignedAreaConstant: boolean;
    orientationAlternation: boolean;
    axisFixedPointsValid: boolean;
    dataflowChainingVerified: boolean;
  };
  summary: string;
}

export function runSeq002Experiment(): Seq002ExperimentReport {
  const s0: Point2D[] = [
    [1, 0], // A
    [2, 0], // B
    [2, 2], // C
    [1, 2], // D
  ];

  const expectedS1: Point2D[] = [
    [1, 0], // A1
    [0, 0], // B1
    [0, 2], // C1
    [1, 2], // D1
  ];

  const expectedS2: Point2D[] = [
    [-1, 0], // A2
    [ 0, 0], // B2
    [ 0, 2], // C2
    [-1, 2], // D2
  ];

  const expectedS3: Point2D[] = [
    [-1,  0], // A3
    [ 0,  0], // B3
    [ 0, -2], // C3
    [-1, -2], // D3
  ];

  const steps: Seq002StepResult[] = [];

  // Operation 1: Reflect across x = 1 (Anchor [1,0], Direction [0,1])
  const anchor1: Point2D = [1, 0];
  const dir1: Point2D = [0, 1];
  const s1 = reflectPolygon(s0, anchor1, dir1);

  let maxDelta1 = 0;
  for (let i = 0; i < s1.length; i++) {
    const d = dist2D(s1[i], expectedS1[i]);
    if (d > maxDelta1) maxDelta1 = d;
  }
  const sa0 = calculateSignedArea(s0);
  const sa1 = calculateSignedArea(s1);
  const ua1 = calculateUnsignedArea(s1);
  const op1Passed = maxDelta1 <= 1e-7 && Math.abs(sa1 - (-sa0)) < 1e-9;

  steps.push({
    stepNumber: 1,
    stepName: 'Operation 1: Reflection across x = 1',
    reflectionAxis: 'x = 1',
    inputVertices: s0,
    outputVertices: s1,
    expectedVertices: expectedS1,
    signedArea: sa1,
    unsignedArea: ua1,
    passed: op1Passed,
    maxCoordinateDiscrepancy: maxDelta1,
    details: [
      `Max coordinate discrepancy: ${maxDelta1.toExponential(4)}`,
      `Signed area transitioned from ${sa0} to ${sa1} (orientation inverted)`,
    ],
  });

  // Operation 2: Reflect across x = 0 (Anchor [0,0], Direction [0,1]) consuming s1
  const anchor2: Point2D = [0, 0];
  const dir2: Point2D = [0, 1];
  const s2 = reflectPolygon(s1, anchor2, dir2);

  let maxDelta2 = 0;
  for (let i = 0; i < s2.length; i++) {
    const d = dist2D(s2[i], expectedS2[i]);
    if (d > maxDelta2) maxDelta2 = d;
  }
  const sa2 = calculateSignedArea(s2);
  const ua2 = calculateUnsignedArea(s2);
  const op2Passed = maxDelta2 <= 1e-7 && Math.abs(sa2 - sa0) < 1e-9;

  steps.push({
    stepNumber: 2,
    stepName: 'Operation 2: Reflection across x = 0 (consuming S1)',
    reflectionAxis: 'x = 0',
    inputVertices: s1,
    outputVertices: s2,
    expectedVertices: expectedS2,
    signedArea: sa2,
    unsignedArea: ua2,
    passed: op2Passed,
    maxCoordinateDiscrepancy: maxDelta2,
    details: [
      `Max coordinate discrepancy: ${maxDelta2.toExponential(4)}`,
      `Signed area transitioned from ${sa1} to ${sa2} (orientation restored to initial sign)`,
    ],
  });

  // Operation 3: Reflect across y = 0 (Anchor [0,0], Direction [1,0]) consuming s2
  const anchor3: Point2D = [0, 0];
  const dir3: Point2D = [1, 0]; // Horizontal line y = 0 has direction along x-axis [1,0]
  const s3 = reflectPolygon(s2, anchor3, dir3);

  let maxDelta3 = 0;
  for (let i = 0; i < s3.length; i++) {
    const d = dist2D(s3[i], expectedS3[i]);
    if (d > maxDelta3) maxDelta3 = d;
  }
  const sa3 = calculateSignedArea(s3);
  const ua3 = calculateUnsignedArea(s3);
  const op3Passed = maxDelta3 <= 1e-7 && Math.abs(sa3 - sa1) < 1e-9;

  steps.push({
    stepNumber: 3,
    stepName: 'Operation 3: Reflection across y = 0 (consuming S2)',
    reflectionAxis: 'y = 0',
    inputVertices: s2,
    outputVertices: s3,
    expectedVertices: expectedS3,
    signedArea: sa3,
    unsignedArea: ua3,
    passed: op3Passed,
    maxCoordinateDiscrepancy: maxDelta3,
    details: [
      `Max coordinate discrepancy: ${maxDelta3.toExponential(4)}`,
      `Signed area transitioned from ${sa2} to ${sa3} (orientation inverted again)`,
    ],
  });

  // Invariant checks
  // 1. Isometry (pairwise distance preservation across s0 -> s1 -> s2 -> s3)
  let distancesPreserved = true;
  for (let i = 0; i < s0.length; i++) {
    for (let j = i + 1; j < s0.length; j++) {
      const d0 = dist2D(s0[i], s0[j]);
      const d1 = dist2D(s1[i], s1[j]);
      const d2 = dist2D(s2[i], s2[j]);
      const d3 = dist2D(s3[i], s3[j]);
      if (Math.abs(d0 - d1) > 1e-7 || Math.abs(d0 - d2) > 1e-7 || Math.abs(d0 - d3) > 1e-7) {
        distancesPreserved = false;
      }
    }
  }

  // 2. Unsigned area constant (= 2.0)
  const ua0 = calculateUnsignedArea(s0);
  const unsignedAreaConstant =
    Math.abs(ua0 - 2.0) < 1e-9 &&
    Math.abs(ua1 - 2.0) < 1e-9 &&
    Math.abs(ua2 - 2.0) < 1e-9 &&
    Math.abs(ua3 - 2.0) < 1e-9;

  // 3. Orientation alternation (+2, -2, +2, -2)
  const orientationAlternation =
    Math.abs(sa0 - 2.0) < 1e-9 &&
    Math.abs(sa1 - (-2.0)) < 1e-9 &&
    Math.abs(sa2 - 2.0) < 1e-9 &&
    Math.abs(sa3 - (-2.0)) < 1e-9;

  // 4. Fixed points on axes
  // Axis 1: x = 1 -> [1, 1] fixed under Op 1
  const p1 = reflectPoint([1, 1], anchor1, dir1);
  const fix1 = dist2D([1, 1], p1) <= 1e-9;

  // Axis 2: x = 0 -> [0, 1] fixed under Op 2
  const p2 = reflectPoint([0, 1], anchor2, dir2);
  const fix2 = dist2D([0, 1], p2) <= 1e-9;

  // Axis 3: y = 0 -> [1, 0] fixed under Op 3
  const p3 = reflectPoint([1, 0], anchor3, dir3);
  const fix3 = dist2D([1, 0], p3) <= 1e-9;

  const axisFixedPointsValid = fix1 && fix2 && fix3;

  // 5. Dataflow chaining
  const dataflowChainingVerified =
    s1 === steps[0].outputVertices &&
    s2 === steps[1].outputVertices &&
    steps[1].inputVertices === s1 &&
    steps[2].inputVertices === s2;

  const allPassed =
    op1Passed &&
    op2Passed &&
    op3Passed &&
    distancesPreserved &&
    unsignedAreaConstant &&
    orientationAlternation &&
    axisFixedPointsValid &&
    dataflowChainingVerified;

  return {
    passed: allPassed,
    initialState: s0,
    state1: s1,
    state2: s2,
    state3: s3,
    steps,
    invariants: {
      distancesPreserved,
      unsignedAreaConstant,
      orientationAlternation,
      axisFixedPointsValid,
      dataflowChainingVerified,
    },
    summary: allPassed
      ? 'PASS — THREE-STEP SEQUENCE VERIFIED'
      : 'FAIL — MATHEMATICAL OR DATAFLOW CHECK FAILED',
  };
}
