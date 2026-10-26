/**
 * PCRS Gate 1 Execution Test Suite & Deterministic Runner
 * Module: src/core/testRunner.ts
 *
 * Runs all 15 deterministic tests for PCRS-CORE-EXP-001 (8 tests) and PCRS-CORE-EXP-002 (7 tests).
 * Also runs Gate 1.1 Mathematical Robustness & Oblique Axis Audit tests.
 * Computes exact Float64 discrepancies against bounded tolerances.
 */

import {
  Point2D,
  Matrix2x2,
  reflectPoint,
  reflectPolygon,
  computeReflectionMatrix,
  mulMatrix2x2,
  mulMatrixVec2D,
  dist2D,
  sub2D,
  norm2D,
  det2x2,
  calculateSignedArea,
  calculateUnsignedArea,
  getReflectionTransform,
  composeTransforms,
  applyAffineTransform,
  isValidPoint2D,
} from './reflection';

import {
  verifyIsometry,
  verifyAxisImmobility,
  verifyAreaInvariants,
  classifyContact,
  auditFoldStep,
  auditNonCommutativity,
  frobeniusNorm2x2,
  verifierSignedArea,
  verifierUnsignedArea,
  DEFAULT_TOLERANCES,
  AuditErrorCode,
  ContactType,
} from '../verifier/independentVerifier';

export interface ExecutedTestResult {
  id: string;
  suiteId: 'PCRS-CORE-EXP-001' | 'PCRS-CORE-EXP-002' | 'PCRS-AUDIT-EXT';
  testNumber: number;
  name: string;
  description: string;
  isNegativeTest: boolean;
  passed: boolean;
  discrepancy: number;
  tolerance: number;
  expectedOutcome: string;
  actualOutcome: string;
  errorCode: AuditErrorCode;
  executionTimestamp: string;
  details: string[];
}

export interface FullSuiteReport {
  suiteId: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  allPassed: boolean;
  results: ExecutedTestResult[];
}

/**
 * Executes PCRS-CORE-EXP-001 (8 Tests) with try/catch exception protection
 */
export function runCoreExp001(): FullSuiteReport {
  const results: ExecutedTestResult[] = [];
  const now = new Date().toISOString();

  // Test 01: Vertex Reflection across x = 1
  try {
    const F2: Point2D[] = [[1, 0], [2, 0], [2, 2], [1, 2]];
    const lineAnchor: Point2D = [1, 0];
    const lineDir: Point2D = [0, 1]; // vertical line x = 1 has direction along y
    const expectedR_F2: Point2D[] = [[1, 0], [0, 0], [0, 2], [1, 2]];

    const calculatedR_F2 = reflectPolygon(F2, lineAnchor, lineDir);
    let maxDelta = 0;
    for (let i = 0; i < F2.length; i++) {
      const delta = dist2D(calculatedR_F2[i], expectedR_F2[i]);
      if (delta > maxDelta) maxDelta = delta;
    }

    const passed = maxDelta <= DEFAULT_TOLERANCES.coord;
    results.push({
      id: 'EXP-001-TEST-01',
      suiteId: 'PCRS-CORE-EXP-001',
      testNumber: 1,
      name: 'Преобразование вершин RL',
      description: 'Отражение вершин F2 через ось сгиба x = 1 по формуле R = 2uu^T - I',
      isNegativeTest: false,
      passed,
      discrepancy: maxDelta,
      tolerance: DEFAULT_TOLERANCES.coord,
      expectedOutcome: '[(1,0), (0,0), (0,2), (1,2)]',
      actualOutcome: JSON.stringify(calculatedR_F2),
      errorCode: passed ? 'NONE' : 'TOLERANCE_EXCEEDED',
      executionTimestamp: now,
      details: [`Max coordinate error: ${maxDelta.toExponential(4)} <= ${DEFAULT_TOLERANCES.coord}`],
    });
  } catch (err: any) {
    results.push({
      id: 'EXP-001-TEST-01',
      suiteId: 'PCRS-CORE-EXP-001',
      testNumber: 1,
      name: 'Преобразование вершин RL',
      description: 'Отражение вершин F2 через ось сгиба x = 1',
      isNegativeTest: false,
      passed: false,
      discrepancy: Infinity,
      tolerance: DEFAULT_TOLERANCES.coord,
      expectedOutcome: '[(1,0), (0,0), (0,2), (1,2)]',
      actualOutcome: `EXCEPTION_THROWN: ${err.message}`,
      errorCode: 'INVALID_INPUT',
      executionTimestamp: now,
      details: [err.stack || err.message],
    });
  }

  // Test 02: Stationary axis points
  try {
    const lineAnchor: Point2D = [1, 0];
    const lineDir: Point2D = [0, 1];
    const axisPoints: Point2D[] = [[1, 0], [1, 1], [1, 2]];
    const reflectedAxis = axisPoints.map((p) => reflectPoint(p, lineAnchor, lineDir));

    const axisCheck = verifyAxisImmobility(axisPoints, reflectedAxis, DEFAULT_TOLERANCES.axis);
    results.push({
      id: 'EXP-001-TEST-02',
      suiteId: 'PCRS-CORE-EXP-001',
      testNumber: 2,
      name: 'Неподвижность оси сгиба L',
      description: 'Проверка условия: для всех p на оси сгиба ||R_L(p) - p|| == 0',
      isNegativeTest: false,
      passed: axisCheck.passed,
      discrepancy: axisCheck.maxDisplacement,
      tolerance: DEFAULT_TOLERANCES.axis,
      expectedOutcome: '||R_L(p) - p|| <= 1e-9 (displacement = 0.0)',
      actualOutcome: `max displacement = ${axisCheck.maxDisplacement.toExponential(4)}`,
      errorCode: axisCheck.passed ? 'NONE' : 'AXIS_DISPLACEMENT_DETECTED',
      executionTimestamp: now,
      details: [`Axis immobility discrepancy: ${axisCheck.maxDisplacement.toExponential(4)}`],
    });
  } catch (err: any) {
    results.push({
      id: 'EXP-001-TEST-02',
      suiteId: 'PCRS-CORE-EXP-001',
      testNumber: 2,
      name: 'Неподвижность оси сгиба L',
      description: 'Проверка неподвижности оси',
      isNegativeTest: false,
      passed: false,
      discrepancy: Infinity,
      tolerance: DEFAULT_TOLERANCES.axis,
      expectedOutcome: '||R_L(p) - p|| == 0.0',
      actualOutcome: `EXCEPTION_THROWN: ${err.message}`,
      errorCode: 'INVALID_INPUT',
      executionTimestamp: now,
      details: [err.message],
    });
  }

  // Test 03: Distance preservation (Isometry)
  try {
    const lineAnchor: Point2D = [1, 0];
    const lineDir: Point2D = [0, 1];
    const p: Point2D = [1, 0];
    const q: Point2D = [2, 2];
    const origDist = dist2D(p, q); // sqrt(5)
    const pPrime = reflectPoint(p, lineAnchor, lineDir);
    const qPrime = reflectPoint(q, lineAnchor, lineDir);
    const reflDist = dist2D(pPrime, qPrime);
    const delta = Math.abs(reflDist - origDist);

    const passed = delta <= DEFAULT_TOLERANCES.coord;
    results.push({
      id: 'EXP-001-TEST-03',
      suiteId: 'PCRS-CORE-EXP-001',
      testNumber: 3,
      name: 'Сохранение расстояний (Изометрия)',
      description: 'Сохранение евклидовой длины диагонали грани при отражении (d = sqrt(5))',
      isNegativeTest: false,
      passed,
      discrepancy: delta,
      tolerance: DEFAULT_TOLERANCES.coord,
      expectedOutcome: `d = sqrt(5) ≈ ${origDist.toFixed(7)}`,
      actualOutcome: `d' = ${reflDist.toFixed(7)} (diff = ${delta.toExponential(4)})`,
      errorCode: passed ? 'NONE' : 'INVARIANT_VIOLATION_ISOMETRY',
      executionTimestamp: now,
      details: [`Original: ${origDist.toFixed(10)}, Reflected: ${reflDist.toFixed(10)}`],
    });
  } catch (err: any) {
    results.push({
      id: 'EXP-001-TEST-03',
      suiteId: 'PCRS-CORE-EXP-001',
      testNumber: 3,
      name: 'Сохранение расстояний (Изометрия)',
      description: 'Изометрия диагонали',
      isNegativeTest: false,
      passed: false,
      discrepancy: Infinity,
      tolerance: DEFAULT_TOLERANCES.coord,
      expectedOutcome: 'd == d_orig',
      actualOutcome: `EXCEPTION_THROWN: ${err.message}`,
      errorCode: 'INVALID_INPUT',
      executionTimestamp: now,
      details: [err.message],
    });
  }

  // Test 04: Signed area inversion & unsigned area preservation
  try {
    const F2: Point2D[] = [[1, 0], [2, 0], [2, 2], [1, 2]]; // CCW order, Area = +2.0
    const lineAnchor: Point2D = [1, 0];
    const lineDir: Point2D = [0, 1];
    const R_F2 = reflectPolygon(F2, lineAnchor, lineDir);

    const areaCheck = verifyAreaInvariants(F2, R_F2, DEFAULT_TOLERANCES.area);
    const passed = areaCheck.passed;
    results.push({
      id: 'EXP-001-TEST-04',
      suiteId: 'PCRS-CORE-EXP-001',
      testNumber: 4,
      name: 'Инверсия знаковой площади и сохранение геометрической',
      description: 'Гауссова площадь меняет знак (+2.0 -> -2.0) при сохранении обхода вершин; модуль сохраняется',
      isNegativeTest: false,
      passed,
      discrepancy: areaCheck.signedSumDelta,
      tolerance: DEFAULT_TOLERANCES.area,
      expectedOutcome: 'A_signed_refl = -2.0, |A_refl| = 2.0',
      actualOutcome: `A_orig = ${areaCheck.origSigned.toFixed(7)}, A_refl = ${areaCheck.reflSigned.toFixed(7)}`,
      errorCode: passed ? 'NONE' : 'ORIENTATION_INVERSION_FAILED',
      executionTimestamp: now,
      details: [`Signed sum diff: ${areaCheck.signedSumDelta.toExponential(4)}, Unsigned diff: ${areaCheck.unsignedDelta.toExponential(4)}`],
    });
  } catch (err: any) {
    results.push({
      id: 'EXP-001-TEST-04',
      suiteId: 'PCRS-CORE-EXP-001',
      testNumber: 4,
      name: 'Инверсия знаковой площади',
      description: 'Гауссова знаковая площадь',
      isNegativeTest: false,
      passed: false,
      discrepancy: Infinity,
      tolerance: DEFAULT_TOLERANCES.area,
      expectedOutcome: 'A_signed_refl = -A_signed_orig',
      actualOutcome: `EXCEPTION_THROWN: ${err.message}`,
      errorCode: 'INVALID_INPUT',
      executionTimestamp: now,
      details: [err.message],
    });
  }

  // Test 05: Contact before fold (Segment contact)
  try {
    const F1: Point2D[] = [[0, 0], [1, 0], [1, 2], [0, 2]];
    const F2: Point2D[] = [[1, 0], [2, 0], [2, 2], [1, 2]];

    const contact = classifyContact(F1, F2, DEFAULT_TOLERANCES);
    const passed = contact.contactType === 'SEGMENT_CONTACT' && contact.overlapArea <= DEFAULT_TOLERANCES.area;

    results.push({
      id: 'EXP-001-TEST-05',
      suiteId: 'PCRS-CORE-EXP-001',
      testNumber: 5,
      name: 'Контакт до сгиба (Смежные грани)',
      description: 'До сгиба грани F1 и F2 имеют общий отрезок x=1; площадь перекрытия строго равна 0.0',
      isNegativeTest: false,
      passed,
      discrepancy: contact.overlapArea,
      tolerance: DEFAULT_TOLERANCES.area,
      expectedOutcome: 'Class: SEGMENT_CONTACT, Area = 0.0',
      actualOutcome: `Class: ${contact.contactType}, Area = ${contact.overlapArea.toFixed(7)}`,
      errorCode: passed ? 'NONE' : 'DISCREPANCY_CLASSIFICATION',
      executionTimestamp: now,
      details: ['Valid 1D segment contact detected. Anti-hallucination verified: not AREA_OVERLAP.'],
    });
  } catch (err: any) {
    results.push({
      id: 'EXP-001-TEST-05',
      suiteId: 'PCRS-CORE-EXP-001',
      testNumber: 5,
      name: 'Контакт до сгиба',
      description: 'Смежные грани до сгиба',
      isNegativeTest: false,
      passed: false,
      discrepancy: Infinity,
      tolerance: DEFAULT_TOLERANCES.area,
      expectedOutcome: 'Class: SEGMENT_CONTACT, Area = 0.0',
      actualOutcome: `EXCEPTION_THROWN: ${err.message}`,
      errorCode: 'INVALID_INPUT',
      executionTimestamp: now,
      details: [err.message],
    });
  }

  // Test 06: Full fold overlap (Area overlap S = 2.0)
  try {
    const F1: Point2D[] = [[0, 0], [1, 0], [1, 2], [0, 2]];
    const F2: Point2D[] = [[1, 0], [2, 0], [2, 2], [1, 2]];
    const lineAnchor: Point2D = [1, 0];
    const lineDir: Point2D = [0, 1];
    const R_F2 = reflectPolygon(F2, lineAnchor, lineDir);

    const contact = classifyContact(F1, R_F2, DEFAULT_TOLERANCES);
    const areaDelta = Math.abs(contact.overlapArea - 2.0);
    const passed = contact.contactType === 'AREA_OVERLAP' && areaDelta <= DEFAULT_TOLERANCES.area;

    results.push({
      id: 'EXP-001-TEST-06',
      suiteId: 'PCRS-CORE-EXP-001',
      testNumber: 6,
      name: 'Перекрытие после полного сгиба',
      description: 'После сгиба пополам отраженная грань точно накладывается на базовую (S = 2.0)',
      isNegativeTest: false,
      passed,
      discrepancy: areaDelta,
      tolerance: DEFAULT_TOLERANCES.area,
      expectedOutcome: 'Class: AREA_OVERLAP, Area = 2.0',
      actualOutcome: `Class: ${contact.contactType}, Area = ${contact.overlapArea.toFixed(7)}`,
      errorCode: passed ? 'NONE' : 'DISCREPANCY_BENCHMARK_AREA',
      executionTimestamp: now,
      details: [`Overlap polygon vertices: ${contact.overlapPolygon.length}, Area diff: ${areaDelta.toExponential(4)}`],
    });
  } catch (err: any) {
    results.push({
      id: 'EXP-001-TEST-06',
      suiteId: 'PCRS-CORE-EXP-001',
      testNumber: 6,
      name: 'Перекрытие после полного сгиба',
      description: 'Полное наложение грани',
      isNegativeTest: false,
      passed: false,
      discrepancy: Infinity,
      tolerance: DEFAULT_TOLERANCES.area,
      expectedOutcome: 'Class: AREA_OVERLAP, Area = 2.0',
      actualOutcome: `EXCEPTION_THROWN: ${err.message}`,
      errorCode: 'INVALID_INPUT',
      executionTimestamp: now,
      details: [err.message],
    });
  }

  // Test 07: Partial fold overlap of smaller face (S = 1.0)
  try {
    const F1: Point2D[] = [[0, 0], [1, 0], [1, 2], [0, 2]];
    const F3: Point2D[] = [[1, 0], [2, 0], [2, 1], [1, 1]]; // Area = 1.0
    const lineAnchor: Point2D = [1, 0];
    const lineDir: Point2D = [0, 1];
    const R_F3 = reflectPolygon(F3, lineAnchor, lineDir);

    const contact = classifyContact(F1, R_F3, DEFAULT_TOLERANCES);
    const areaDelta = Math.abs(contact.overlapArea - 1.0);
    const passed = contact.contactType === 'AREA_OVERLAP' && areaDelta <= DEFAULT_TOLERANCES.area;

    results.push({
      id: 'EXP-001-TEST-07',
      suiteId: 'PCRS-CORE-EXP-001',
      testNumber: 7,
      name: 'Частичное перекрытие меньшей грани',
      description: 'Отражение грани высотой 1 на грань высотой 2 даёт перекрытие ровно S = 1.0',
      isNegativeTest: false,
      passed,
      discrepancy: areaDelta,
      tolerance: DEFAULT_TOLERANCES.area,
      expectedOutcome: 'Class: AREA_OVERLAP, Area = 1.0',
      actualOutcome: `Class: ${contact.contactType}, Area = ${contact.overlapArea.toFixed(7)}`,
      errorCode: passed ? 'NONE' : 'DISCREPANCY_BENCHMARK_AREA',
      executionTimestamp: now,
      details: [`Overlap Area: ${contact.overlapArea.toFixed(7)}, Delta: ${areaDelta.toExponential(4)}`],
    });
  } catch (err: any) {
    results.push({
      id: 'EXP-001-TEST-07',
      suiteId: 'PCRS-CORE-EXP-001',
      testNumber: 7,
      name: 'Частичное перекрытие меньшей грани',
      description: 'Частичное наложение грани',
      isNegativeTest: false,
      passed: false,
      discrepancy: Infinity,
      tolerance: DEFAULT_TOLERANCES.area,
      expectedOutcome: 'Class: AREA_OVERLAP, Area = 1.0',
      actualOutcome: `EXCEPTION_THROWN: ${err.message}`,
      errorCode: 'INVALID_INPUT',
      executionTimestamp: now,
      details: [err.message],
    });
  }

  // Test 08: Negative test: deliberate displacement detection
  try {
    const F2: Point2D[] = [[1, 0], [2, 0], [2, 2], [1, 2]];
    const corruptedR_F2: Point2D[] = [[1, 0], [-0.0001, 0], [0, 2], [1, 2]]; // displaced by 1e-4

    const isoCheck = verifyIsometry(F2, corruptedR_F2, DEFAULT_TOLERANCES.coord);
    const caughtByVerifier = !isoCheck.passed && isoCheck.maxDelta > 1e-5;

    results.push({
      id: 'EXP-001-TEST-08',
      suiteId: 'PCRS-CORE-EXP-001',
      testNumber: 8,
      name: 'Негативный контроль: обнаружение смещения',
      description: 'Подача искусственно искажённой вершины (смещение delta = 10⁻⁴) должна быть забракована валидатором',
      isNegativeTest: true,
      passed: caughtByVerifier,
      discrepancy: isoCheck.maxDelta,
      tolerance: DEFAULT_TOLERANCES.coord,
      expectedOutcome: 'Отказ валидатора (INVARIANT_VIOLATION_ISOMETRY / TOLERANCE_EXCEEDED)',
      actualOutcome: caughtByVerifier
        ? `Успешно забраковано (обнаружено смещение Δ = ${isoCheck.maxDelta.toExponential(4)})`
        : 'Ошибка: валидатор пропустил брак!',
      errorCode: caughtByVerifier ? 'INVARIANT_VIOLATION_ISOMETRY' : 'NONE',
      executionTimestamp: now,
      details: ['Zero-Trust negative control passed: intentional hallucination/displacement was caught.'],
    });
  } catch (err: any) {
    results.push({
      id: 'EXP-001-TEST-08',
      suiteId: 'PCRS-CORE-EXP-001',
      testNumber: 8,
      name: 'Негативный контроль: обнаружение смещения',
      description: 'Негативный контроль',
      isNegativeTest: true,
      passed: false,
      discrepancy: Infinity,
      tolerance: DEFAULT_TOLERANCES.coord,
      expectedOutcome: 'Rejection',
      actualOutcome: `EXCEPTION_THROWN: ${err.message}`,
      errorCode: 'INVALID_INPUT',
      executionTimestamp: now,
      details: [err.message],
    });
  }

  const passedTests = results.filter((r) => r.passed).length;
  return {
    suiteId: 'PCRS-CORE-EXP-001',
    totalTests: results.length,
    passedTests,
    failedTests: results.length - passedTests,
    allPassed: passedTests === results.length,
    results,
  };
}

/**
 * Executes PCRS-CORE-EXP-002 (7 Tests) with try/catch exception protection
 */
export function runCoreExp002(): FullSuiteReport {
  const results: ExecutedTestResult[] = [];
  const now = new Date().toISOString();

  // Test 01: Forward composition on intersecting axes (theta = 45 deg)
  try {
    const u1: Point2D = [1, 0];
    const u2: Point2D = [Math.SQRT1_2, Math.SQRT1_2];

    const R1 = computeReflectionMatrix(u1);
    const R2 = computeReflectionMatrix(u2);
    const TA = mulMatrix2x2(R2, R1); // [ [0, -1], [1, 0] ]

    const testPoint: Point2D = [1, 0];
    const transformed = mulMatrixVec2D(TA, testPoint);
    const expected: Point2D = [0, 1];
    const delta = dist2D(transformed, expected);

    const passed = delta <= DEFAULT_TOLERANCES.coord;
    results.push({
      id: 'EXP-002-TEST-01',
      suiteId: 'PCRS-CORE-EXP-002',
      testNumber: 1,
      name: 'Прямая композиция TA = R2 * R1 (θ = 45°)',
      description: 'Композиция сгибов относительно y=0 и y=x даёт вращение на +2θ = +90°; p(1,0) -> (0,1)',
      isNegativeTest: false,
      passed,
      discrepancy: delta,
      tolerance: DEFAULT_TOLERANCES.coord,
      expectedOutcome: 'T_A(1, 0) = (0, 1) [Rot(+90°)]',
      actualOutcome: `(${transformed[0].toFixed(7)}, ${transformed[1].toFixed(7)})`,
      errorCode: passed ? 'NONE' : 'TOLERANCE_EXCEEDED',
      executionTimestamp: now,
      details: [`Matrix TA: [[${TA[0][0].toFixed(4)}, ${TA[0][1].toFixed(4)}], [${TA[1][0].toFixed(4)}, ${TA[1][0].toFixed(4)}]]`],
    });
  } catch (err: any) {
    results.push({
      id: 'EXP-002-TEST-01',
      suiteId: 'PCRS-CORE-EXP-002',
      testNumber: 1,
      name: 'Прямая композиция TA = R2 * R1',
      description: 'Композиция на 45 градусах',
      isNegativeTest: false,
      passed: false,
      discrepancy: Infinity,
      tolerance: DEFAULT_TOLERANCES.coord,
      expectedOutcome: '(0, 1)',
      actualOutcome: `EXCEPTION_THROWN: ${err.message}`,
      errorCode: 'INVALID_INPUT',
      executionTimestamp: now,
      details: [err.message],
    });
  }

  // Test 02: Reverse composition TB = R1 * R2
  try {
    const u1: Point2D = [1, 0];
    const u2: Point2D = [Math.SQRT1_2, Math.SQRT1_2];

    const R1 = computeReflectionMatrix(u1);
    const R2 = computeReflectionMatrix(u2);
    const TB = mulMatrix2x2(R1, R2); // [ [0, 1], [-1, 0] ]

    const testPoint: Point2D = [1, 0];
    const transformed = mulMatrixVec2D(TB, testPoint);
    const expected: Point2D = [0, -1];
    const delta = dist2D(transformed, expected);

    const passed = delta <= DEFAULT_TOLERANCES.coord;
    results.push({
      id: 'EXP-002-TEST-02',
      suiteId: 'PCRS-CORE-EXP-002',
      testNumber: 2,
      name: 'Обратная композиция TB = R1 * R2 (θ = 45°)',
      description: 'Композиция в обратном порядке даёт вращение на -2θ = -90°; p(1,0) -> (0,-1)',
      isNegativeTest: false,
      passed,
      discrepancy: delta,
      tolerance: DEFAULT_TOLERANCES.coord,
      expectedOutcome: 'T_B(1, 0) = (0, -1) [Rot(-90°)]',
      actualOutcome: `(${transformed[0].toFixed(7)}, ${transformed[1].toFixed(7)})`,
      errorCode: passed ? 'NONE' : 'TOLERANCE_EXCEEDED',
      executionTimestamp: now,
      details: [`Matrix TB: [[${TB[0][0].toFixed(4)}, ${TB[0][1].toFixed(4)}], [${TB[1][0].toFixed(4)}, ${TB[1][0].toFixed(4)}]]`],
    });
  } catch (err: any) {
    results.push({
      id: 'EXP-002-TEST-02',
      suiteId: 'PCRS-CORE-EXP-002',
      testNumber: 2,
      name: 'Обратная композиция TB = R1 * R2',
      description: 'Композиция в обратном порядке',
      isNegativeTest: false,
      passed: false,
      discrepancy: Infinity,
      tolerance: DEFAULT_TOLERANCES.coord,
      expectedOutcome: '(0, -1)',
      actualOutcome: `EXCEPTION_THROWN: ${err.message}`,
      errorCode: 'INVALID_INPUT',
      executionTimestamp: now,
      details: [err.message],
    });
  }

  // Test 03: Non-commutativity proof ||TA - TB||_F != 0
  try {
    const u1: Point2D = [1, 0];
    const u2: Point2D = [Math.SQRT1_2, Math.SQRT1_2];
    const R1 = computeReflectionMatrix(u1);
    const R2 = computeReflectionMatrix(u2);
    const TA = mulMatrix2x2(R2, R1);
    const TB = mulMatrix2x2(R1, R2);

    const audit = auditNonCommutativity(TA, TB, DEFAULT_TOLERANCES.coord);
    const expectedFrobenius = Math.sqrt(8);
    const frobDiff = Math.abs(audit.frobeniusDelta - expectedFrobenius);
    const passed = !audit.isCommutative && frobDiff <= DEFAULT_TOLERANCES.coord;

    results.push({
      id: 'EXP-002-TEST-03',
      suiteId: 'PCRS-CORE-EXP-002',
      testNumber: 3,
      name: 'Доказательство некоммутативности сгибов (R2*R1 ≠ R1*R2)',
      description: 'Норма Фробениуса разности матриц ||TA - TB||_F строго равна sqrt(8) ≈ 2.828427',
      isNegativeTest: false,
      passed,
      discrepancy: frobDiff,
      tolerance: DEFAULT_TOLERANCES.coord,
      expectedOutcome: `||TA - TB||_F = sqrt(8) ≈ ${expectedFrobenius.toFixed(6)}`,
      actualOutcome: `||TA - TB||_F = ${audit.frobeniusDelta.toFixed(6)} (isCommutative = ${audit.isCommutative})`,
      errorCode: passed ? 'NONE' : 'NON_COMMUTATIVE_COMPOSITION_MISMATCH',
      executionTimestamp: now,
      details: [`Strict non-commutativity established. Order of folds is strictly non-interchangeable.`],
    });
  } catch (err: any) {
    results.push({
      id: 'EXP-002-TEST-03',
      suiteId: 'PCRS-CORE-EXP-002',
      testNumber: 3,
      name: 'Доказательство некоммутативности',
      description: 'Некоммутативность',
      isNegativeTest: false,
      passed: false,
      discrepancy: Infinity,
      tolerance: DEFAULT_TOLERANCES.coord,
      expectedOutcome: 'Non-commutative',
      actualOutcome: `EXCEPTION_THROWN: ${err.message}`,
      errorCode: 'INVALID_INPUT',
      executionTimestamp: now,
      details: [err.message],
    });
  }

  // Test 04: Parallel axes translation (d = 2, translation = 2d = 4)
  try {
    const tf1 = getReflectionTransform([1, 0], [0, 1]); // x = 1
    const tf2 = getReflectionTransform([3, 0], [0, 1]); // x = 3
    const comp = composeTransforms(tf2, tf1); // T_P = R2 o R1

    const p: Point2D = [0.5, 1.5];
    const pPrime = applyAffineTransform(comp, p);
    const expected: Point2D = [p[0] + 4, p[1]];
    const delta = dist2D(pPrime, expected);

    const passed = delta <= DEFAULT_TOLERANCES.coord;
    results.push({
      id: 'EXP-002-TEST-04',
      suiteId: 'PCRS-CORE-EXP-002',
      testNumber: 4,
      name: 'Параллельные оси: чистый перенос (Δx = 2d = 4.0)',
      description: 'Композиция двух параллельных сгибов на расстоянии d=2 даёт сдвиг на 2d = 4.0',
      isNegativeTest: false,
      passed,
      discrepancy: delta,
      tolerance: DEFAULT_TOLERANCES.coord,
      expectedOutcome: `p' = (${expected[0]}, ${expected[1]})`,
      actualOutcome: `p' = (${pPrime[0].toFixed(7)}, ${pPrime[1].toFixed(7)})`,
      errorCode: passed ? 'NONE' : 'TOLERANCE_EXCEEDED',
      executionTimestamp: now,
      details: [`Translation vector: (${comp.translation[0].toFixed(6)}, ${comp.translation[1].toFixed(6)})`],
    });
  } catch (err: any) {
    results.push({
      id: 'EXP-002-TEST-04',
      suiteId: 'PCRS-CORE-EXP-002',
      testNumber: 4,
      name: 'Параллельные оси',
      description: 'Параллельный сдвиг',
      isNegativeTest: false,
      passed: false,
      discrepancy: Infinity,
      tolerance: DEFAULT_TOLERANCES.coord,
      expectedOutcome: 'Translation by 4.0',
      actualOutcome: `EXCEPTION_THROWN: ${err.message}`,
      errorCode: 'INVALID_INPUT',
      executionTimestamp: now,
      details: [err.message],
    });
  }

  // Test 05: Closed 4-step orthogonal cycle (T = (R2*R1)^2 = +I)
  try {
    const u1: Point2D = [1, 0]; // y = 0
    const u2: Point2D = [0, 1]; // x = 0
    const R1 = computeReflectionMatrix(u1);
    const R2 = computeReflectionMatrix(u2);
    const step2 = mulMatrix2x2(R2, R1); // -I
    const closed = mulMatrix2x2(step2, step2); // (-I)^2 = +I

    const identity: Matrix2x2 = [[1, 0], [0, 1]];
    const frobDiff = frobeniusNorm2x2([
      [closed[0][0] - identity[0][0], closed[0][1] - identity[0][1]],
      [closed[1][0] - identity[1][0], closed[1][1] - identity[1][1]],
    ]);

    const passed = frobDiff <= DEFAULT_TOLERANCES.coord;
    results.push({
      id: 'EXP-002-TEST-05',
      suiteId: 'PCRS-CORE-EXP-002',
      testNumber: 5,
      name: 'Замкнутый ортогональный 4-шаговый цикл (T = +I)',
      description: 'Для перпендикулярных сгибов двойное повторение пары возвращает тождественное преобразование',
      isNegativeTest: false,
      passed,
      discrepancy: frobDiff,
      tolerance: DEFAULT_TOLERANCES.coord,
      expectedOutcome: 'T_closed = +I [[1, 0], [0, 1]]',
      actualOutcome: `[[${closed[0][0].toFixed(6)}, ${closed[0][1].toFixed(6)}], [${closed[1][0].toFixed(6)}, ${closed[1][0].toFixed(6)}]]`,
      errorCode: passed ? 'NONE' : 'TOLERANCE_EXCEEDED',
      executionTimestamp: now,
      details: [`Closure proven analytically and in Float64 matrix arithmetic.`],
    });
  } catch (err: any) {
    results.push({
      id: 'EXP-002-TEST-05',
      suiteId: 'PCRS-CORE-EXP-002',
      testNumber: 5,
      name: 'Замкнутый цикл',
      description: 'Тождественное преобразование',
      isNegativeTest: false,
      passed: false,
      discrepancy: Infinity,
      tolerance: DEFAULT_TOLERANCES.coord,
      expectedOutcome: 'T = +I',
      actualOutcome: `EXCEPTION_THROWN: ${err.message}`,
      errorCode: 'INVALID_INPUT',
      executionTimestamp: now,
      details: [err.message],
    });
  }

  // Test 06: Negative test: Agent falsely claims commutativity R2*R1 == R1*R2
  try {
    const u1: Point2D = [1, 0];
    const u2: Point2D = [Math.SQRT1_2, Math.SQRT1_2];
    const R1 = computeReflectionMatrix(u1);
    const R2 = computeReflectionMatrix(u2);
    const TA = mulMatrix2x2(R2, R1);
    const TB = mulMatrix2x2(R1, R2);

    const claimedCommutative = true;
    const audit = auditNonCommutativity(TA, TB, DEFAULT_TOLERANCES.coord);
    const caught = claimedCommutative !== audit.isCommutative;

    results.push({
      id: 'EXP-002-TEST-06',
      suiteId: 'PCRS-CORE-EXP-002',
      testNumber: 6,
      name: 'Негативный контроль: ложное заявление о коммутативности',
      description: 'Ложное утверждение агента о коммутативности сгибов отбраковывается независимым валидатором',
      isNegativeTest: true,
      passed: caught,
      discrepancy: audit.frobeniusDelta,
      tolerance: DEFAULT_TOLERANCES.coord,
      expectedOutcome: 'Отказ с вердиктом NON_COMMUTATIVE_COMPOSITION_MISMATCH',
      actualOutcome: caught
        ? `Ложь выявлена и отклонена (разность ||TA - TB|| = ${audit.frobeniusDelta.toFixed(4)})`
        : 'Ошибка: ложное заявление было принято!',
      errorCode: caught ? 'NON_COMMUTATIVE_COMPOSITION_MISMATCH' : 'NONE',
      executionTimestamp: now,
      details: ['Zero-Trust negative control passed: false commutativity claim was caught and flagged.'],
    });
  } catch (err: any) {
    results.push({
      id: 'EXP-002-TEST-06',
      suiteId: 'PCRS-CORE-EXP-002',
      testNumber: 6,
      name: 'Негативный контроль: ложная коммутативность',
      description: 'Негативный контроль',
      isNegativeTest: true,
      passed: false,
      discrepancy: Infinity,
      tolerance: DEFAULT_TOLERANCES.coord,
      expectedOutcome: 'Rejection',
      actualOutcome: `EXCEPTION_THROWN: ${err.message}`,
      errorCode: 'INVALID_INPUT',
      executionTimestamp: now,
      details: [err.message],
    });
  }

  // Test 07: Case 2.2 Corner fold with benchmark area S = 0.125
  try {
    const staticFace: Point2D[] = [[0, 0], [0.5, 0], [1.0, 0.5], [1.0, 1.0], [0, 1.0]];
    const movingFace: Point2D[] = [[0.5, 0], [1.0, 0], [1.0, 0.5]]; // triangle with base 0.5, height 0.5 -> Area = 0.125
    const lineAnchor: Point2D = [0.5, 0];
    const lineDir: Point2D = [1.0 - 0.5, 0.5 - 0]; // (0.5, 0.5)

    const reflectedFace = reflectPolygon(movingFace, lineAnchor, lineDir);
    const contact = classifyContact(staticFace, reflectedFace, DEFAULT_TOLERANCES);
    const areaDelta = Math.abs(contact.overlapArea - 0.125);
    const passed = contact.contactType === 'AREA_OVERLAP' && areaDelta <= DEFAULT_TOLERANCES.area;

    results.push({
      id: 'EXP-002-TEST-07',
      suiteId: 'PCRS-CORE-EXP-002',
      testNumber: 7,
      name: 'Случай 2.2: Сгиб угла (Исправленный эталон S = 0.125 = 1/8)',
      description: 'Сгиб угла единичного листа: треугольник отражается внутрь листа, перекрытие ровно S = 0.125',
      isNegativeTest: false,
      passed,
      discrepancy: areaDelta,
      tolerance: DEFAULT_TOLERANCES.area,
      expectedOutcome: 'Class: AREA_OVERLAP, Area = 0.1250000',
      actualOutcome: `Class: ${contact.contactType}, Area = ${contact.overlapArea.toFixed(7)}`,
      errorCode: passed ? 'NONE' : 'DISCREPANCY_BENCHMARK_AREA',
      executionTimestamp: now,
      details: [
        `Moving face area: ${calculateUnsignedArea(movingFace).toFixed(6)}`,
        `Reflected face area: ${calculateUnsignedArea(reflectedFace).toFixed(6)}`,
        `Overlap area with static sheet: ${contact.overlapArea.toFixed(6)} (exact 1/8)`,
      ],
    });
  } catch (err: any) {
    results.push({
      id: 'EXP-002-TEST-07',
      suiteId: 'PCRS-CORE-EXP-002',
      testNumber: 7,
      name: 'Случай 2.2: Сгиб угла',
      description: 'Сгиб угла',
      isNegativeTest: false,
      passed: false,
      discrepancy: Infinity,
      tolerance: DEFAULT_TOLERANCES.area,
      expectedOutcome: 'Class: AREA_OVERLAP, Area = 0.125',
      actualOutcome: `EXCEPTION_THROWN: ${err.message}`,
      errorCode: 'INVALID_INPUT',
      executionTimestamp: now,
      details: [err.message],
    });
  }

  const passedTests = results.filter((r) => r.passed).length;
  return {
    suiteId: 'PCRS-CORE-EXP-002',
    totalTests: results.length,
    passedTests,
    failedTests: results.length - passedTests,
    allPassed: passedTests === results.length,
    results,
  };
}

/**
 * Gate 1.1 Extended Audit: Oblique Axis & Mathematical Robustness Tests
 */
export function runGate11AuditTests(): FullSuiteReport {
  const results: ExecutedTestResult[] = [];
  const now = new Date().toISOString();

  // Audit Test 01: Arbitrary Oblique Axis (theta = 30 deg, irrational coords)
  try {
    const theta = Math.PI / 6; // 30 deg
    const u: Point2D = [Math.cos(theta), Math.sin(theta)]; // [sqrt(3)/2, 1/2]
    const a: Point2D = [0.35, 0.72]; // arbitrary anchor

    const R = computeReflectionMatrix(u);
    const RTR = mulMatrix2x2(
      [[R[0][0], R[1][0]], [R[0][1], R[1][1]]],
      R
    );
    const identity: Matrix2x2 = [[1, 0], [0, 1]];
    const rtrDiff = frobeniusNorm2x2([
      [RTR[0][0] - identity[0][0], RTR[0][1] - identity[0][1]],
      [RTR[1][0] - identity[1][0], RTR[1][1] - identity[1][1]],
    ]);
    const det = det2x2(R);
    const detDiff = Math.abs(det - (-1.0));

    // Axis point test: a + 1.5 * u
    const axisPt: Point2D = [a[0] + 1.5 * u[0], a[1] + 1.5 * u[1]];
    const reflAxisPt = reflectPoint(axisPt, a, u);
    const axisDisp = dist2D(axisPt, reflAxisPt);

    const passed = rtrDiff <= DEFAULT_TOLERANCES.coord && detDiff <= DEFAULT_TOLERANCES.coord && axisDisp <= DEFAULT_TOLERANCES.axis;
    results.push({
      id: 'AUDIT-EXT-01',
      suiteId: 'PCRS-AUDIT-EXT',
      testNumber: 1,
      name: 'Произвольная наклонная ось (θ = 30°, иррациональные координаты)',
      description: 'Проверка R^T*R = I, det(R) = -1, неподвижности оси для произвольного угла с иррациональными тригонометрическими компонентами',
      isNegativeTest: false,
      passed,
      discrepancy: Math.max(rtrDiff, detDiff, axisDisp),
      tolerance: DEFAULT_TOLERANCES.coord,
      expectedOutcome: '||R^T*R - I|| <= 1e-7, det(R) = -1.0, axis disp <= 1e-9',
      actualOutcome: `||R^T*R - I|| = ${rtrDiff.toExponential(3)}, det(R) = ${det.toFixed(7)}, disp = ${axisDisp.toExponential(3)}`,
      errorCode: passed ? 'NONE' : 'TOLERANCE_EXCEEDED',
      executionTimestamp: now,
      details: ['Arbitrary angle reflection validated. General direction is mathematically rigorous.'],
    });
  } catch (err: any) {
    results.push({
      id: 'AUDIT-EXT-01',
      suiteId: 'PCRS-AUDIT-EXT',
      testNumber: 1,
      name: 'Наклонная ось (θ = 30°)',
      description: 'Проверка наклонной оси',
      isNegativeTest: false,
      passed: false,
      discrepancy: Infinity,
      tolerance: DEFAULT_TOLERANCES.coord,
      expectedOutcome: 'PASS',
      actualOutcome: `EXCEPTION_THROWN: ${err.message}`,
      errorCode: 'INVALID_INPUT',
      executionTimestamp: now,
      details: [err.message],
    });
  }

  // Audit Test 02: Negative Control - Zero Direction Vector [0, 0] Rejection
  try {
    let caughtZero = false;
    try {
      computeReflectionMatrix([0, 0]);
    } catch (e: any) {
      if (e.message && e.message.includes('ZERO_DIRECTION_VECTOR')) {
        caughtZero = true;
      }
    }

    results.push({
      id: 'AUDIT-EXT-02',
      suiteId: 'PCRS-AUDIT-EXT',
      testNumber: 2,
      name: 'Защита от вырожденного вектора направления [0, 0]',
      description: 'Ядро обязано явно выбрасывать ZERO_DIRECTION_VECTOR и не допускать деления на ноль молча',
      isNegativeTest: true,
      passed: caughtZero,
      discrepancy: 0,
      tolerance: 0,
      expectedOutcome: 'Исключение ZERO_DIRECTION_VECTOR',
      actualOutcome: caughtZero ? 'Успешно перехвачено: ZERO_DIRECTION_VECTOR' : 'Сбой: вырожденный вектор не был отклонён!',
      errorCode: caughtZero ? 'NONE' : 'INVALID_INPUT',
      executionTimestamp: now,
      details: ['Zero direction vector protection verified.'],
    });
  } catch (err: any) {
    results.push({
      id: 'AUDIT-EXT-02',
      suiteId: 'PCRS-AUDIT-EXT',
      testNumber: 2,
      name: 'Защита от [0, 0]',
      description: 'Проверка вырожденного вектора',
      isNegativeTest: true,
      passed: false,
      discrepancy: Infinity,
      tolerance: 0,
      expectedOutcome: 'Exception',
      actualOutcome: err.message,
      errorCode: 'INVALID_INPUT',
      executionTimestamp: now,
      details: [err.message],
    });
  }

  // Audit Test 03: Negative Control - Non-Numeric (NaN / Infinity) Coordinate Rejection
  try {
    let caughtNaN = false;
    try {
      reflectPoint([NaN, 1.0], [0, 0], [1, 0]);
    } catch (e: any) {
      if (e.message && e.message.includes('INVALID_COORDINATE')) {
        caughtNaN = true;
      }
    }

    results.push({
      id: 'AUDIT-EXT-03',
      suiteId: 'PCRS-AUDIT-EXT',
      testNumber: 3,
      name: 'Защита от нечисловых координат (NaN / Infinity)',
      description: 'Ядро обязано выбрасывать INVALID_COORDINATE при передаче нечисловых значений и не допускать тихого прохождения NaN',
      isNegativeTest: true,
      passed: caughtNaN,
      discrepancy: 0,
      tolerance: 0,
      expectedOutcome: 'Исключение INVALID_COORDINATE',
      actualOutcome: caughtNaN ? 'Успешно перехвачено: INVALID_COORDINATE' : 'Сбой: NaN прошел молча!',
      errorCode: caughtNaN ? 'NONE' : 'INVALID_INPUT',
      executionTimestamp: now,
      details: ['NaN/Infinity rejection verified.'],
    });
  } catch (err: any) {
    results.push({
      id: 'AUDIT-EXT-03',
      suiteId: 'PCRS-AUDIT-EXT',
      testNumber: 3,
      name: 'Защита от NaN',
      description: 'Проверка NaN',
      isNegativeTest: true,
      passed: false,
      discrepancy: Infinity,
      tolerance: 0,
      expectedOutcome: 'Exception',
      actualOutcome: err.message,
      errorCode: 'INVALID_INPUT',
      executionTimestamp: now,
      details: [err.message],
    });
  }

  const passedTests = results.filter((r) => r.passed).length;
  return {
    suiteId: 'PCRS-AUDIT-EXT',
    totalTests: results.length,
    passedTests,
    failedTests: results.length - passedTests,
    allPassed: passedTests === results.length,
    results,
  };
}

/**
 * Runs both test suites and returns full aggregate statistics
 */
export function runAllPcrsTests(): {
  suite1: FullSuiteReport;
  suite2: FullSuiteReport;
  auditExt: FullSuiteReport;
  grandTotal: number;
  grandPassed: number;
  allPassed: boolean;
} {
  const s1 = runCoreExp001();
  const s2 = runCoreExp002();
  const ext = runGate11AuditTests();
  const grandTotal = s1.totalTests + s2.totalTests;
  const grandPassed = s1.passedTests + s2.passedTests;
  return {
    suite1: s1,
    suite2: s2,
    auditExt: ext,
    grandTotal,
    grandPassed,
    allPassed: grandPassed === grandTotal && ext.allPassed,
  };
}
