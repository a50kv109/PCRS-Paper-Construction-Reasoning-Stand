/**
* PCRS — Gate 1.6: Experiment SEQ-003 (Error Localization)
* Module: src/core/seq003ErrorLocalization.ts
*
* Tests the test stand's ability to localize the *first* incorrect step in a three-step sequence.
* Injected error: Operation 2 uses reflection axis x = 1 instead of x = 0.
* Validates that Step 1 passes, Step 2 fails (identifying Operation 2 as the first error),
* and Step 3 propagates the error.
*/

import { Point2D, reflectPolygon, dist2D, calculateSignedArea, calculateUnsignedArea } from './reflection';

export interface ErrorLocalizationResult {
  passed: boolean;
  step1Passed: boolean;
  step2Passed: boolean;
  step3Passed: boolean;
  detectedFirstErrorStep: number; // Expected: 2
  s1Actual: Point2D[];
  s2Actual: Point2D[];
  s3Actual: Point2D[];
  expectedS2: Point2D[];
  maxDiscrepancyStep2: number;
  summary: string;
}

export function runSeq003ErrorLocalization(): ErrorLocalizationResult {
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

  // Step 1: Reflection across x = 1 (Correct)
  const s1 = reflectPolygon(s0, [1, 0], [0, 1]);
  let maxDelta1 = 0;
  for (let i = 0; i < s1.length; i++) {
    const d = dist2D(s1[i], expectedS1[i]);
    if (d > maxDelta1) maxDelta1 = d;
  }
  const step1Passed = maxDelta1 <= 1e-7;

  // Step 2 (INJECTED ERROR): Reflection across x = 1 instead of x = 0
  const s2Err = reflectPolygon(s1, [1, 0], [0, 1]);
  let maxDelta2 = 0;
  for (let i = 0; i < s2Err.length; i++) {
    const d = dist2D(s2Err[i], expectedS2[i]);
    if (d > maxDelta2) maxDelta2 = d;
  }
  const step2Passed = maxDelta2 <= 1e-7; // Should be false (error detected)

  // Step 3: Reflection across y = 0 consuming erroneous s2Err
  const s3Err = reflectPolygon(s2Err, [0, 0], [1, 0]);
  const expectedS3: Point2D[] = [
    [-1,  0],
    [ 0,  0],
    [ 0, -2],
    [-1, -2],
  ];
  let maxDelta3 = 0;
  for (let i = 0; i < s3Err.length; i++) {
    const d = dist2D(s3Err[i], expectedS3[i]);
    if (d > maxDelta3) maxDelta3 = d;
  }
  const step3Passed = maxDelta3 <= 1e-7; // Should be false due to propagated error

  // Determine first incorrect step
  let detectedFirstErrorStep = 0;
  if (!step1Passed) {
    detectedFirstErrorStep = 1;
  } else if (!step2Passed) {
    detectedFirstErrorStep = 2;
  } else if (!step3Passed) {
    detectedFirstErrorStep = 3;
  }

  const localizationSuccessful = step1Passed && !step2Passed && detectedFirstErrorStep === 2;

  return {
    passed: localizationSuccessful,
    step1Passed,
    step2Passed,
    step3Passed,
    detectedFirstErrorStep,
    s1Actual: s1,
    s2Actual: s2Err,
    s3Actual: s3Err,
    expectedS2,
    maxDiscrepancyStep2: maxDelta2,
    summary: localizationSuccessful
      ? 'PASS — FIRST INCORRECT STEP LOCALIZED'
      : 'FAIL — ERROR NOT LOCALIZED',
  };
}
