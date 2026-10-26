/**
 * PCRS Zero-Trust Independent Geometric Verifier
 * Module: src/verifier/independentVerifier.ts
 *
 * Implements Principle 2 (Zero-Trust Audit) and Level L1/L2 correctness checks.
 * Completely autonomous from any LLM or UI rendering code.
 *
 * INDEPENDENCE NOTE (Gate 1.1 Audit):
 * To strictly avoid code-sharing vulnerabilities, this module implements its own
 * autonomous Shoelace formula, Euclidean metrics, and vector operations rather than
 * relying on functions exported by the kernel it is auditing.
 */

import { Point2D, Matrix2x2 } from '../core/reflection';

export type ContactType = 'NO_CONTACT' | 'NONE' | 'VERTEX_CONTACT' | 'SEGMENT_CONTACT' | 'AREA_OVERLAP';

export interface BoundedTolerances {
  coord: number; // default 1.0e-7 for L in [0, 2]
  area: number;  // default 1.0e-9 for L in [0, 2]
  axis: number;  // default 1.0e-9
  angle: number; // default 1.0e-6
}

export const DEFAULT_TOLERANCES: BoundedTolerances = {
  coord: 1.0e-7,
  area: 1.0e-9,
  axis: 1.0e-9,
  angle: 1.0e-6,
};

export type AuditErrorCode =
  | 'NONE'
  | 'INVALID_INPUT'
  | 'AXIS_DISPLACEMENT_DETECTED'
  | 'INVARIANT_VIOLATION_ISOMETRY'
  | 'ORIENTATION_INVERSION_FAILED'
  | 'DISCREPANCY_BENCHMARK_AREA'
  | 'DISCREPANCY_CLASSIFICATION'
  | 'TOLERANCE_EXCEEDED'
  | 'NON_COMMUTATIVE_COMPOSITION_MISMATCH'
  | 'DEGENERATE_POLYGON'
  | 'CAPABILITY_GAP';

export interface AuditReport {
  passed: boolean;
  errorCode: AuditErrorCode;
  summary: string;
  metrics: {
    maxCoordDiscrepancy: number;
    maxDistanceDiscrepancy: number;
    axisDiscrepancy: number;
    originalSignedArea: number;
    reflectedSignedArea: number;
    areaDiscrepancy: number;
    computedOverlapArea: number;
    expectedOverlapArea: number;
    detectedContactType: ContactType;
    claimedContactType?: ContactType;
  };
  details: string[];
}

/**
 * Autonomous Euclidean 2-norm and distance implemented independently of kernel
 */
function verifierDist2D(p1: Point2D, p2: Point2D): number {
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Autonomous Gauss Shoelace formula implemented independently of kernel
 */
export function verifierSignedArea(vertices: Point2D[]): number {
  const n = vertices.length;
  if (n < 3) return 0;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const p1 = vertices[i];
    const p2 = vertices[(i + 1) % n];
    sum += p1[0] * p2[1] - p2[0] * p1[1];
  }
  return sum / 2.0;
}

/**
 * Autonomous Unsigned Area calculation
 */
export function verifierUnsignedArea(vertices: Point2D[]): number {
  return Math.abs(verifierSignedArea(vertices));
}

/**
 * Checks isometry invariant: for every vertex pair (i, j),
 * | ||p'_i - p'_j|| - ||p_i - p_j|| | <= eps_coord
 *
 * Scope note: Pairwise vertex distance invariance guarantees rigid isometric motion of vertices.
 * It does not prove interior non-self-intersection of non-convex shapes (which is audited via area).
 */
export function verifyIsometry(
  originalVertices: Point2D[],
  reflectedVertices: Point2D[],
  tol: number = DEFAULT_TOLERANCES.coord
): { passed: boolean; maxDelta: number; worstPair?: [number, number] } {
  if (originalVertices.length !== reflectedVertices.length) {
    return { passed: false, maxDelta: Infinity };
  }
  const n = originalVertices.length;
  let maxDelta = 0;
  let worstPair: [number, number] | undefined = undefined;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const origDist = verifierDist2D(originalVertices[i], originalVertices[j]);
      const reflDist = verifierDist2D(reflectedVertices[i], reflectedVertices[j]);
      const delta = Math.abs(reflDist - origDist);
      if (delta > maxDelta) {
        maxDelta = delta;
        worstPair = [i, j];
      }
    }
  }

  return {
    passed: maxDelta <= tol,
    maxDelta,
    worstPair,
  };
}

/**
 * Checks axis points immobility: ||p' - p|| <= eps_axis
 */
export function verifyAxisImmobility(
  axisPoints: Point2D[],
  reflectedAxisPoints: Point2D[],
  tol: number = DEFAULT_TOLERANCES.axis
): { passed: boolean; maxDisplacement: number } {
  let maxDisplacement = 0;
  for (let i = 0; i < axisPoints.length; i++) {
    const disp = verifierDist2D(axisPoints[i], reflectedAxisPoints[i]);
    if (disp > maxDisplacement) {
      maxDisplacement = disp;
    }
  }
  return {
    passed: maxDisplacement <= tol,
    maxDisplacement,
  };
}

/**
 * Checks signed and unsigned area invariants:
 * 1. Area_unsigned(P') == Area_unsigned(P) within eps_area
 * 2. Area_signed(P') == -Area_signed(P) within eps_area (when original vertex order is preserved)
 */
export function verifyAreaInvariants(
  originalVertices: Point2D[],
  reflectedVertices: Point2D[],
  tol: number = DEFAULT_TOLERANCES.area
): {
  passed: boolean;
  origSigned: number;
  reflSigned: number;
  signedSumDelta: number;
  unsignedDelta: number;
} {
  const origSigned = verifierSignedArea(originalVertices);
  const reflSigned = verifierSignedArea(reflectedVertices);

  const origUnsigned = Math.abs(origSigned);
  const reflUnsigned = Math.abs(reflSigned);

  const unsignedDelta = Math.abs(reflUnsigned - origUnsigned);
  // Reflection strictly inverts orientation: signed sum should equal 0
  const signedSumDelta = Math.abs(reflSigned + origSigned);

  const passed = unsignedDelta <= tol && signedSumDelta <= tol;

  return {
    passed,
    origSigned,
    reflSigned,
    signedSumDelta,
    unsignedDelta,
  };
}

/**
 * Sutherland-Hodgman Polygon Clipping for computing exact polygon intersection in 2D.
 *
 * CONTRACT & SCOPE BOUNDARY (Gate 1.1):
 * - Strictly supports CONVEX polygons (or subject polygon convex and clipping polygon convex).
 * - For concave or self-crossing polygons, Sutherland-Hodgman is not mathematically closed;
 *   such cases are outside Gate 1 Model A scope.
 */
export function clipConvexPolygons(
  subjectPolygon: Point2D[],
  clipPolygon: Point2D[],
  tols: BoundedTolerances = DEFAULT_TOLERANCES
): Point2D[] {
  let outputList = [...subjectPolygon];

  const cpLen = clipPolygon.length;
  if (cpLen < 3 || subjectPolygon.length < 3) return [];

  // Determine clipping polygon orientation (CCW vs CW)
  const isCCW = verifierSignedArea(clipPolygon) > 0;
  const planeEps = tols.area * 0.1; // scale-aware halfplane tolerance

  for (let i = 0; i < cpLen; i++) {
    const edgeStart = clipPolygon[i];
    const edgeEnd = clipPolygon[(i + 1) % cpLen];

    const inputList = [...outputList];
    outputList = [];
    if (inputList.length === 0) break;

    let s = inputList[inputList.length - 1];

    for (let j = 0; j < inputList.length; j++) {
      const p = inputList[j];

      // Cross product to test if point is inside halfplane
      const isInside = (pt: Point2D): boolean => {
        const cross = (edgeEnd[0] - edgeStart[0]) * (pt[1] - edgeStart[1]) -
                      (edgeEnd[1] - edgeStart[1]) * (pt[0] - edgeStart[0]);
        return isCCW ? cross >= -planeEps : cross <= planeEps;
      };

      if (isInside(p)) {
        if (!isInside(s)) {
          const intersection = lineIntersection(s, p, edgeStart, edgeEnd);
          if (intersection) outputList.push(intersection);
        }
        outputList.push(p);
      } else if (isInside(s)) {
        const intersection = lineIntersection(s, p, edgeStart, edgeEnd);
        if (intersection) outputList.push(intersection);
      }
      s = p;
    }
  }

  return cleanPolygonVertices(outputList, tols.coord);
}

/**
 * Computes intersection of two infinite lines passing through (p1, p2) and (p3, p4)
 */
function lineIntersection(p1: Point2D, p2: Point2D, p3: Point2D, p4: Point2D): Point2D | null {
  const d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]);
  if (Math.abs(d) < 1e-14) return null;

  const t = ((p1[0] - p3[0]) * (p3[1] - p4[1]) - (p1[1] - p3[1]) * (p3[0] - p4[0])) / d;
  return [
    p1[0] + t * (p2[0] - p1[0]),
    p1[1] + t * (p2[1] - p1[1]),
  ];
}

/**
 * Removes duplicate adjacent vertices within epsilon
 */
function cleanPolygonVertices(pts: Point2D[], eps: number = 1e-9): Point2D[] {
  if (pts.length === 0) return [];
  const res: Point2D[] = [];
  for (let i = 0; i < pts.length; i++) {
    const cur = pts[i];
    const prev = res[res.length - 1];
    if (!prev || verifierDist2D(cur, prev) > eps) {
      res.push(cur);
    }
  }
  // Check wrapping edge
  if (res.length > 1 && verifierDist2D(res[0], res[res.length - 1]) <= eps) {
    res.pop();
  }
  return res;
}

/**
 * Computes overlap polygon and its exact area between two planar convex polygons
 */
export function computeOverlap(
  polyA: Point2D[],
  polyB: Point2D[],
  tols: BoundedTolerances = DEFAULT_TOLERANCES
): { polygon: Point2D[]; area: number } {
  const overlapPoly = clipConvexPolygons(polyA, polyB, tols);
  const area = verifierUnsignedArea(overlapPoly);
  return { polygon: overlapPoly, area };
}

/**
 * Normalizes ContactType to handle 'NONE' and 'NO_CONTACT' interchangeability
 */
export function normalizeContactType(ct: ContactType): 'NO_CONTACT' | 'VERTEX_CONTACT' | 'SEGMENT_CONTACT' | 'AREA_OVERLAP' {
  if (ct === 'NONE') return 'NO_CONTACT';
  return ct;
}

/**
 * Classifies contact manifold between two polygons:
 * - NO_CONTACT / NONE: disjoint (distance > eps)
 * - VERTEX_CONTACT: single common point
 * - SEGMENT_CONTACT: 1D common edge (area == 0, segment length > eps)
 * - AREA_OVERLAP: 2D interior overlap (area > eps_area)
 */
export function classifyContact(
  polyA: Point2D[],
  polyB: Point2D[],
  tol: BoundedTolerances = DEFAULT_TOLERANCES
): { contactType: ContactType; overlapArea: number; overlapPolygon: Point2D[] } {
  const { polygon: overlapPoly, area } = computeOverlap(polyA, polyB, tol);

  if (area > tol.area) {
    return {
      contactType: 'AREA_OVERLAP',
      overlapArea: area,
      overlapPolygon: overlapPoly,
    };
  }

  // Check boundary interactions (edge-edge or vertex-vertex)
  let sharedVertices = 0;
  for (const va of polyA) {
    for (const vb of polyB) {
      if (verifierDist2D(va, vb) <= tol.coord) {
        sharedVertices++;
      }
    }
  }

  // Check segment coincidence
  let sharedSegmentFound = false;
  for (let i = 0; i < polyA.length; i++) {
    const a1 = polyA[i];
    const a2 = polyA[(i + 1) % polyA.length];
    for (let j = 0; j < polyB.length; j++) {
      const b1 = polyB[j];
      const b2 = polyB[(j + 1) % polyB.length];

      // If endpoints match in either order
      const direct = verifierDist2D(a1, b1) <= tol.coord && verifierDist2D(a2, b2) <= tol.coord;
      const reverse = verifierDist2D(a1, b2) <= tol.coord && verifierDist2D(a2, b1) <= tol.coord;
      if (direct || reverse) {
        sharedSegmentFound = true;
        break;
      }
    }
    if (sharedSegmentFound) break;
  }

  if (sharedSegmentFound || sharedVertices >= 2) {
    return {
      contactType: 'SEGMENT_CONTACT',
      overlapArea: 0.0,
      overlapPolygon: [],
    };
  }

  if (sharedVertices === 1) {
    return {
      contactType: 'VERTEX_CONTACT',
      overlapArea: 0.0,
      overlapPolygon: [],
    };
  }

  return {
    contactType: 'NO_CONTACT',
    overlapArea: 0.0,
    overlapPolygon: [],
  };
}

/**
 * Audits a complete single fold step:
 * 1. Checks input validity
 * 2. Checks isometry
 * 3. Checks axis immobility
 * 4. Checks area preservation & sign inversion
 * 5. Checks overlap area against benchmark expected value
 * 6. Checks contact type against expected category
 */
export function auditFoldStep(params: {
  originalFace: Point2D[];
  reflectedFace: Point2D[];
  axisPoints: Point2D[];
  reflectedAxisPoints: Point2D[];
  baseStaticFace: Point2D[];
  expectedOverlapArea: number;
  expectedContactType: ContactType;
  claimedContactType?: ContactType;
  tolerances?: Partial<BoundedTolerances>;
}): AuditReport {
  const tols = { ...DEFAULT_TOLERANCES, ...params.tolerances };
  const details: string[] = [];

  // 1. Isometry audit
  const isoCheck = verifyIsometry(params.originalFace, params.reflectedFace, tols.coord);
  if (!isoCheck.passed) {
    details.push(`Isometry violation: max distance discrepancy ${isoCheck.maxDelta.toExponential(3)} > ${tols.coord}`);
    return {
      passed: false,
      errorCode: 'INVARIANT_VIOLATION_ISOMETRY',
      summary: `Нарушение изометрии грани: искажение расстояний превысило допуск (Δ = ${isoCheck.maxDelta.toExponential(3)})`,
      metrics: {
        maxCoordDiscrepancy: isoCheck.maxDelta,
        maxDistanceDiscrepancy: isoCheck.maxDelta,
        axisDiscrepancy: 0,
        originalSignedArea: 0,
        reflectedSignedArea: 0,
        areaDiscrepancy: 0,
        computedOverlapArea: 0,
        expectedOverlapArea: params.expectedOverlapArea,
        detectedContactType: 'NO_CONTACT',
      },
      details,
    };
  }

  // 2. Axis immobility audit
  const axisCheck = verifyAxisImmobility(params.axisPoints, params.reflectedAxisPoints, tols.axis);
  if (!axisCheck.passed) {
    details.push(`Axis displacement detected: max displacement ${axisCheck.maxDisplacement.toExponential(3)} > ${tols.axis}`);
    return {
      passed: false,
      errorCode: 'AXIS_DISPLACEMENT_DETECTED',
      summary: `Смещение точек оси сгиба: точки оси не остались неподвижными (смещение = ${axisCheck.maxDisplacement.toExponential(3)})`,
      metrics: {
        maxCoordDiscrepancy: axisCheck.maxDisplacement,
        maxDistanceDiscrepancy: isoCheck.maxDelta,
        axisDiscrepancy: axisCheck.maxDisplacement,
        originalSignedArea: 0,
        reflectedSignedArea: 0,
        areaDiscrepancy: 0,
        computedOverlapArea: 0,
        expectedOverlapArea: params.expectedOverlapArea,
        detectedContactType: 'NO_CONTACT',
      },
      details,
    };
  }

  // 3. Area and Orientation audit
  const areaCheck = verifyAreaInvariants(params.originalFace, params.reflectedFace, tols.area);
  if (areaCheck.unsignedDelta > tols.area) {
    details.push(`Area preservation failed: unsigned area diff ${areaCheck.unsignedDelta.toExponential(3)} > ${tols.area}`);
    return {
      passed: false,
      errorCode: 'TOLERANCE_EXCEEDED',
      summary: `Нарушение сохранения площади: площадь изменилась на ${areaCheck.unsignedDelta.toExponential(3)}`,
      metrics: {
        maxCoordDiscrepancy: 0,
        maxDistanceDiscrepancy: isoCheck.maxDelta,
        axisDiscrepancy: axisCheck.maxDisplacement,
        originalSignedArea: areaCheck.origSigned,
        reflectedSignedArea: areaCheck.reflSigned,
        areaDiscrepancy: areaCheck.unsignedDelta,
        computedOverlapArea: 0,
        expectedOverlapArea: params.expectedOverlapArea,
        detectedContactType: 'NO_CONTACT',
      },
      details,
    };
  }

  if (areaCheck.signedSumDelta > tols.area) {
    details.push(`Orientation inversion failed: signed sum ${areaCheck.signedSumDelta.toExponential(3)} > ${tols.area}`);
    return {
      passed: false,
      errorCode: 'ORIENTATION_INVERSION_FAILED',
      summary: `Сбой инверсии ориентации: знак Гауссовой площади не инвертировался при отражении`,
      metrics: {
        maxCoordDiscrepancy: 0,
        maxDistanceDiscrepancy: isoCheck.maxDelta,
        axisDiscrepancy: axisCheck.maxDisplacement,
        originalSignedArea: areaCheck.origSigned,
        reflectedSignedArea: areaCheck.reflSigned,
        areaDiscrepancy: areaCheck.signedSumDelta,
        computedOverlapArea: 0,
        expectedOverlapArea: params.expectedOverlapArea,
        detectedContactType: 'NO_CONTACT',
      },
      details,
    };
  }

  // 4. Overlap & Contact Classification
  const contactResult = classifyContact(params.baseStaticFace, params.reflectedFace, tols);
  const areaDiff = Math.abs(contactResult.overlapArea - params.expectedOverlapArea);

  if (areaDiff > tols.area) {
    details.push(`Overlap area discrepancy: computed ${contactResult.overlapArea.toFixed(7)}, expected ${params.expectedOverlapArea.toFixed(7)} (diff ${areaDiff.toExponential(3)})`);
    return {
      passed: false,
      errorCode: 'DISCREPANCY_BENCHMARK_AREA',
      summary: `Расхождение площади перекрытия с эталоном: вычислено ${contactResult.overlapArea.toFixed(6)}, ожидалось ${params.expectedOverlapArea.toFixed(6)}`,
      metrics: {
        maxCoordDiscrepancy: 0,
        maxDistanceDiscrepancy: isoCheck.maxDelta,
        axisDiscrepancy: axisCheck.maxDisplacement,
        originalSignedArea: areaCheck.origSigned,
        reflectedSignedArea: areaCheck.reflSigned,
        areaDiscrepancy: areaDiff,
        computedOverlapArea: contactResult.overlapArea,
        expectedOverlapArea: params.expectedOverlapArea,
        detectedContactType: contactResult.contactType,
        claimedContactType: params.claimedContactType,
      },
      details,
    };
  }

  const expectedNormalized = normalizeContactType(params.expectedContactType);
  const detectedNormalized = normalizeContactType(contactResult.contactType);

  if (detectedNormalized !== expectedNormalized) {
    details.push(`Contact class discrepancy: computed ${contactResult.contactType}, expected ${params.expectedContactType}`);
    return {
      passed: false,
      errorCode: 'DISCREPANCY_CLASSIFICATION',
      summary: `Неверная классификация контакта: обнаружен ${contactResult.contactType}, ожидался ${params.expectedContactType}`,
      metrics: {
        maxCoordDiscrepancy: 0,
        maxDistanceDiscrepancy: isoCheck.maxDelta,
        axisDiscrepancy: axisCheck.maxDisplacement,
        originalSignedArea: areaCheck.origSigned,
        reflectedSignedArea: areaCheck.reflSigned,
        areaDiscrepancy: 0,
        computedOverlapArea: contactResult.overlapArea,
        expectedOverlapArea: params.expectedOverlapArea,
        detectedContactType: contactResult.contactType,
        claimedContactType: params.claimedContactType,
      },
      details,
    };
  }

  // All invariants and benchmarks verified successfully
  details.push(`All L0–L2 invariants passed: Isometry (max Δ = ${isoCheck.maxDelta.toExponential(3)}), Axis immobility (disp = ${axisCheck.maxDisplacement.toExponential(3)}), Area exactness (diff = ${areaDiff.toExponential(3)}), Contact = ${contactResult.contactType}`);

  return {
    passed: true,
    errorCode: 'NONE',
    summary: `Верификация успешно пройдена: все аналитические инварианты строго соблюдены (контакт: ${contactResult.contactType}, S = ${contactResult.overlapArea.toFixed(6)})`,
    metrics: {
      maxCoordDiscrepancy: 0,
      maxDistanceDiscrepancy: isoCheck.maxDelta,
      axisDiscrepancy: axisCheck.maxDisplacement,
      originalSignedArea: areaCheck.origSigned,
      reflectedSignedArea: areaCheck.reflSigned,
      areaDiscrepancy: areaDiff,
      computedOverlapArea: contactResult.overlapArea,
      expectedOverlapArea: params.expectedOverlapArea,
      detectedContactType: contactResult.contactType,
      claimedContactType: params.claimedContactType,
    },
    details,
  };
}

/**
 * Frobenius norm of 2x2 matrix: ||M||_F = sqrt(sum M_ij^2)
 */
export function frobeniusNorm2x2(m: Matrix2x2): number {
  return Math.sqrt(
    m[0][0] * m[0][0] +
    m[0][1] * m[0][1] +
    m[1][0] * m[1][0] +
    m[1][1] * m[1][1]
  );
}

/**
 * Audits matrix non-commutativity claim: T_A - T_B
 */
export function auditNonCommutativity(
  mA: Matrix2x2,
  mB: Matrix2x2,
  tol: number = DEFAULT_TOLERANCES.coord
): { isCommutative: boolean; frobeniusDelta: number } {
  const diff: Matrix2x2 = [
    [mA[0][0] - mB[0][0], mA[0][1] - mB[0][1]],
    [mA[1][0] - mB[1][0], mA[1][1] - mB[1][1]],
  ];
  const delta = frobeniusNorm2x2(diff);
  return {
    isCommutative: delta <= tol,
    frobeniusDelta: delta,
  };
}
