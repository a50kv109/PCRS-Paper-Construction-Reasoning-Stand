/**
* PCRS — Gate 1.4: Experiment SEQ-001 (Two Dependent Reflections)
* Module: src/core/seq001Test.ts
*
* Executes a sequential two-operation reflection experiment using the frozen geometry kernel:
* Initial region: [1, 2] × [0, 2]
* Op 1: Reflect across x = 1
* Op 2: Reflect across x = 0 (consuming Op 1's output state)
* Validates vertex coordinates, distance preservation, signed/unsigned area, orientation reversal, and fixed points.
*/

import {
  Point2D,
  reflectPolygon,
  dist2D,
  calculateSignedArea,
  calculateUnsignedArea,
  reflectPoint,
} from './reflection';

export interface Seq001StepResult {
  stepName: string;
  inputVertices: Point2D[];
  outputVertices: Point2D[];
  expectedVertices: Point2D[];
  signedArea: number;
  unsignedArea: number;
  passed: boolean;
  maxCoordinateDiscrepancy: number;
  details: string[];
}

export interface Seq001ExperimentReport {
  passed: boolean;
  initialState: Point2D[];
  intermediateState: Point2D[];
  finalState: Point2D[];
  expectedIntermediate: Point2D[];
  expectedFinal: Point2D[];
  steps: Seq001StepResult[];
  invariants: {
    distancePreserved: boolean;
    areaPreserved: boolean;
    orientationReversedOp1: boolean;
    orientationReversedOp2: boolean;
    axisFixedPointsValid: boolean;
  };
  summary: string;
}

export function runSeq001Experiment(): Seq001ExperimentReport {
  const initial: Point2D[] = [
    [1, 0], // A
    [2, 0], // B
    [2, 2], // C
    [1, 2], // D
  ];

  const expectedIntermediate: Point2D[] = [
    [1, 0], // A1
    [0, 0], // B1
    [0, 2], // C1
    [1, 2], // D1
  ];

  const expectedFinal: Point2D[] = [
    [-1, 0], // A2
    [ 0, 0], // B2
    [ 0, 2], // C2
    [-1, 2], // D2
  ];

  const steps: Seq001StepResult[] = [];

  // Operation 1: Reflect across x = 1 (Anchor [1,0], Direction [0,1])
  const anchor1: Point2D = [1, 0];
  const dir1: Point2D = [0, 1];
  const intermediate = reflectPolygon(initial, anchor1, dir1);

  let maxDelta1 = 0;
  for (let i = 0; i < intermediate.length; i++) {
    const d = dist2D(intermediate[i], expectedIntermediate[i]);
    if (d > maxDelta1) maxDelta1 = d;
  }

  const initialSignedArea = calculateSignedArea(initial);
  const intermediateSignedArea = calculateSignedArea(intermediate);
  const intermediateUnsignedArea = calculateUnsignedArea(intermediate);

  const op1Passed = maxDelta1 <= 1e-7 && Math.abs(intermediateSignedArea - (-initialSignedArea)) < 1e-9;

  steps.push({
    stepName: 'Operation 1: Reflection across x = 1',
    inputVertices: initial,
    outputVertices: intermediate,
    expectedVertices: expectedIntermediate,
    signedArea: intermediateSignedArea,
    unsignedArea: intermediateUnsignedArea,
    passed: op1Passed,
    maxCoordinateDiscrepancy: maxDelta1,
    details: [
      `Max coordinate discrepancy: ${maxDelta1.toExponential(4)}`,
      `Signed area transitioned from ${initialSignedArea} to ${intermediateSignedArea} (orientation reversed)`,
    ],
  });

  // Operation 2: Reflect actual output state of Op 1 across x = 0 (Anchor [0,0], Direction [0,1])
  const anchor2: Point2D = [0, 0];
  const dir2: Point2D = [0, 1];
  const finalState = reflectPolygon(intermediate, anchor2, dir2);

  let maxDelta2 = 0;
  for (let i = 0; i < finalState.length; i++) {
    const d = dist2D(finalState[i], expectedFinal[i]);
    if (d > maxDelta2) maxDelta2 = d;
  }

  const finalSignedArea = calculateSignedArea(finalState);
  const finalUnsignedArea = calculateUnsignedArea(finalState);

  const op2Passed = maxDelta2 <= 1e-7 && Math.abs(finalSignedArea - initialSignedArea) < 1e-9;

  steps.push({
    stepName: 'Operation 2: Reflection across x = 0 (consuming Op 1 output)',
    inputVertices: intermediate,
    outputVertices: finalState,
    expectedVertices: expectedFinal,
    signedArea: finalSignedArea,
    unsignedArea: finalUnsignedArea,
    passed: op2Passed,
    maxCoordinateDiscrepancy: maxDelta2,
    details: [
      `Max coordinate discrepancy: ${maxDelta2.toExponential(4)}`,
      `Signed area transitioned from ${intermediateSignedArea} to ${finalSignedArea} (orientation reversed back to initial)`,
    ],
  });

  // Invariant checks
  // 1. Distance preservation (Initial vs Final pairwise distances)
  let distancePreserved = true;
  for (let i = 0; i < initial.length; i++) {
    for (let j = i + 1; j < initial.length; j++) {
      const dOrig = dist2D(initial[i], initial[j]);
      const dFinal = dist2D(finalState[i], finalState[j]);
      if (Math.abs(dOrig - dFinal) > 1e-7) {
        distancePreserved = false;
      }
    }
  }

  // 2. Area preservation (Unsigned area constant)
  const initialUnsignedArea = calculateUnsignedArea(initial);
  const areaPreserved = Math.abs(initialUnsignedArea - finalUnsignedArea) < 1e-9;

  // 3. Orientation reversal
  const orientationReversedOp1 = Math.abs(intermediateSignedArea + initialSignedArea) < 1e-9;
  const orientationReversedOp2 = Math.abs(finalSignedArea - initialSignedArea) < 1e-9;

  // 4. Fixed points on reflection axes
  // Axis 1: x = 1 (e.g. [1,0] and [1,2] should remain fixed under Op 1)
  const pTest1: Point2D = [1, 1.5];
  const pRef1 = reflectPoint(pTest1, anchor1, dir1);
  const axisFixedPointsValid = dist2D(pTest1, pRef1) <= 1e-9;

  const allPassed = op1Passed && op2Passed && distancePreserved && areaPreserved && orientationReversedOp1 && orientationReversedOp2 && axisFixedPointsValid;

  return {
    passed: allPassed,
    initialState: initial,
    intermediateState: intermediate,
    finalState,
    expectedIntermediate,
    expectedFinal,
    steps,
    invariants: {
      distancePreserved,
      areaPreserved,
      orientationReversedOp1,
      orientationReversedOp2,
      axisFixedPointsValid,
    },
    summary: allPassed
      ? 'PASS — SEQUENTIAL GEOMETRY VERIFIED'
      : 'FAIL — IMPLEMENTATION OR VERIFICATION ERROR',
  };
}
