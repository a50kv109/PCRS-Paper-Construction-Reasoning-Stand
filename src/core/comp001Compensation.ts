/**
* PCRS — Gate 1.7: Experiment COMP-001 (Compensating Transformations)
* Module: src/core/comp001Compensation.ts
*
* Demonstrates the terminal-state blind spot: Applying a reflection F twice (F(F(S)) = S)
* returns the polygon to its initial state, potentially masking the intermediate excursion.
*/

import { Point2D, reflectPolygon, dist2D } from './reflection';

export interface Comp001Result {
  passed: boolean;
  initialState: Point2D[];
  intermediateState: Point2D[];
  terminalState: Point2D[];
  summary: string;
}

export function runComp001Experiment(): Comp001Result {
  const initial: Point2D[] = [
    [1, 0], // A
    [2, 0], // B
    [2, 2], // C
    [1, 2], // D
  ];

  // Reflection across x = 1
  const anchor: Point2D = [1, 0];
  const dir: Point2D = [0, 1];

  const intermediate = reflectPolygon(initial, anchor, dir);
  const terminal = reflectPolygon(intermediate, anchor, dir);

  // Checks
  const intermediateChanged = intermediate.some((p, i) => dist2D(p, initial[i]) > 1e-7);
  const terminalMatchesInitial = terminal.every((p, i) => dist2D(p, initial[i]) < 1e-7);

  const passed = intermediateChanged && terminalMatchesInitial;

  return {
    passed,
    initialState: initial,
    intermediateState: intermediate,
    terminalState: terminal,
    summary: passed
      ? 'PASS — COMP-001 TERMINAL-STATE BLIND SPOT DEMONSTRATED'
      : 'FAIL — COMP-001 DID NOT DEMONSTRATE BLIND SPOT',
  };
}
