/**
* PCRS — Gate 1.4B: Negative Control NC-001 (Dataflow Disruption Test)
* Module: src/core/seq001NegativeControl.ts
*
* Intentionally introduces a dataflow error: Operation 2 receives the initial state
* instead of Operation 1's output state. Asserts that the test harness successfully
* detects the resulting coordinate discrepancy (specifically at vertices B and C).
*/

import { Point2D, reflectPolygon, dist2D } from './reflection';

export interface NegativeControlResult {
  passed: boolean;
  errorDetected: boolean;
  expectedFinal: Point2D[];
  actualTamperedFinal: Point2D[];
  maxDiscrepancy: number;
  discrepantVertices: string[];
  summary: string;
}

export function runNc001NegativeControl(): NegativeControlResult {
  const initial: Point2D[] = [
    [1, 0], // A
    [2, 0], // B
    [2, 2], // C
    [1, 2], // D
  ];

  const expectedFinal: Point2D[] = [
    [-1, 0], // A2
    [ 0, 0], // B2
    [ 0, 2], // C2
    [-1, 2], // D2
  ];

  // Operation 1: Reflect across x = 1 (Anchor [1,0], Direction [0,1])
  const intermediate = reflectPolygon(initial, [1, 0], [0, 1]);

  // NC-001 INJECTION: Operation 2 erroneously receives `initial` instead of `intermediate`
  const tamperedFinal = reflectPolygon(initial, [0, 0], [0, 1]);

  // Expected tampered coordinates:
  // A' = (-1, 0)
  // B' = (-2, 0)
  // C' = (-2, 2)
  // D' = (-1, 2)

  let maxDiscrepancy = 0;
  const discrepantVertices: string[] = [];
  const vertexLabels = ['A', 'B', 'C', 'D'];

  for (let i = 0; i < tamperedFinal.length; i++) {
    const d = dist2D(tamperedFinal[i], expectedFinal[i]);
    if (d > maxDiscrepancy) maxDiscrepancy = d;
    if (d > 1e-7) {
      discrepantVertices.push(`${vertexLabels[i]} (Expected: ${JSON.stringify(expectedFinal[i])}, Actual: ${JSON.stringify(tamperedFinal[i])}, Delta: ${d.toFixed(2)})`);
    }
  }

  // The negative control succeeds if discrepancy is detected (> 1e-7)
  const errorDetected = maxDiscrepancy > 1e-7;

  return {
    passed: errorDetected,
    errorDetected,
    expectedFinal,
    actualTamperedFinal: tamperedFinal,
    maxDiscrepancy,
    discrepantVertices,
    summary: errorDetected
      ? 'PASS — NEGATIVE CONTROL DETECTED THE INJECTED ERROR'
      : 'FAIL — NEGATIVE CONTROL MISSED THE INJECTED ERROR',
  };
}
