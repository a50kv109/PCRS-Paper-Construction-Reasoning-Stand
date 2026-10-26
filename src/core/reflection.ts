/**
 * PCRS Geometry Core — Model A: 2D Planar Reflection Kernel
 * Module: src/core/reflection.ts
 *
 * Implements rigid planar reflections and affine transformations in Float64.
 * Formulas:
 *   R = 2 * u * u^T - I
 *   p' = a + R * (p - a)
 *
 * All functions are pure, deterministic, and free of DOM or rendering dependencies (Level L0).
 * Enforces explicit input validation: rejects NaN, Infinity, and zero/degenerate direction vectors.
 */

export type Point2D = [number, number];
export type Matrix2x2 = [[number, number], [number, number]];

export interface AffineTransform2D {
  matrix: Matrix2x2;
  translation: Point2D;
}

export interface Line2D {
  point: Point2D;      // Anchor point 'a'
  direction: Point2D;  // Direction vector 'u' (automatically normalized if not unit)
}

/**
 * Validates that a numeric value is a finite number (not NaN, not +/-Infinity).
 */
export function isValidNumber(val: unknown): val is number {
  return typeof val === 'number' && !Number.isNaN(val) && Number.isFinite(val);
}

/**
 * Validates that a 2D point has valid finite coordinates.
 */
export function isValidPoint2D(p: unknown): p is Point2D {
  return (
    Array.isArray(p) &&
    p.length === 2 &&
    isValidNumber(p[0]) &&
    isValidNumber(p[1])
  );
}

/**
 * Asserts that a 2D point is valid and finite; throws descriptive Error otherwise.
 */
export function assertValidPoint2D(p: Point2D, label: string = 'point'): void {
  if (!isValidPoint2D(p)) {
    throw new Error(`INVALID_COORDINATE: ${label} must have finite numeric [x, y] coordinates, received: ${JSON.stringify(p)}`);
  }
}

/**
 * Asserts that a direction vector is valid, finite, and non-zero.
 */
export function assertValidDirection2D(u: Point2D, label: string = 'direction vector'): void {
  assertValidPoint2D(u, label);
  const lenSq = u[0] * u[0] + u[1] * u[1];
  if (lenSq === 0 || !Number.isFinite(lenSq)) {
    throw new Error(`ZERO_DIRECTION_VECTOR: ${label} must be a non-zero vector, received: [${u[0]}, ${u[1]}]`);
  }
}

/**
 * 2D Vector subtraction: a - b
 */
export function sub2D(a: Point2D, b: Point2D): Point2D {
  assertValidPoint2D(a, 'vector a');
  assertValidPoint2D(b, 'vector b');
  return [a[0] - b[0], a[1] - b[1]];
}

/**
 * 2D Vector addition: a + b
 */
export function add2D(a: Point2D, b: Point2D): Point2D {
  assertValidPoint2D(a, 'vector a');
  assertValidPoint2D(b, 'vector b');
  return [a[0] + b[0], a[1] + b[1]];
}

/**
 * Scalar multiplication: s * v
 */
export function scale2D(v: Point2D, s: number): Point2D {
  assertValidPoint2D(v, 'vector v');
  if (!isValidNumber(s)) {
    throw new Error(`INVALID_SCALAR: scalar multiplier must be a finite number, received: ${s}`);
  }
  return [v[0] * s, v[1] * s];
}

/**
 * Dot product: a · b
 */
export function dot2D(a: Point2D, b: Point2D): number {
  assertValidPoint2D(a, 'vector a');
  assertValidPoint2D(b, 'vector b');
  return a[0] * b[0] + a[1] * b[1];
}

/**
 * Euclidean 2-norm: ||v||_2
 */
export function norm2D(v: Point2D): number {
  assertValidPoint2D(v, 'vector v');
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

/**
 * Euclidean distance between two points
 */
export function dist2D(p1: Point2D, p2: Point2D): number {
  return norm2D(sub2D(p1, p2));
}

/**
 * Normalize vector to unit length
 */
export function normalize2D(v: Point2D): Point2D {
  assertValidDirection2D(v, 'vector to normalize');
  const n = norm2D(v);
  return [v[0] / n, v[1] / n];
}

/**
 * Computes 2x2 reflection matrix R = 2 * u * u^T - I for direction vector u
 */
export function computeReflectionMatrix(u: Point2D): Matrix2x2 {
  assertValidDirection2D(u, 'reflection axis direction');
  const [ux, uy] = normalize2D(u);
  return [
    [2 * ux * ux - 1, 2 * ux * uy],
    [2 * ux * uy, 2 * uy * uy - 1],
  ];
}

/**
 * Determinant of 2x2 matrix
 */
export function det2x2(m: Matrix2x2): number {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

/**
 * Multiply 2x2 matrix by 2D vector: m * v
 */
export function mulMatrixVec2D(m: Matrix2x2, v: Point2D): Point2D {
  assertValidPoint2D(v, 'vector to multiply');
  return [
    m[0][0] * v[0] + m[0][1] * v[1],
    m[1][0] * v[0] + m[1][1] * v[1],
  ];
}

/**
 * Multiply two 2x2 matrices: A * B
 */
export function mulMatrix2x2(a: Matrix2x2, b: Matrix2x2): Matrix2x2 {
  return [
    [
      a[0][0] * b[0][0] + a[0][1] * b[1][0],
      a[0][0] * b[0][1] + a[0][1] * b[1][1],
    ],
    [
      a[1][0] * b[0][0] + a[1][1] * b[1][0],
      a[1][0] * b[0][1] + a[1][1] * b[1][1],
    ],
  ];
}

/**
 * Reflects a single point across line defined by anchor point 'a' and direction vector 'u'.
 * Formula: p' = a + R * (p - a)
 */
export function reflectPoint(
  p: Point2D,
  lineAnchor: Point2D,
  lineDir: Point2D
): Point2D {
  assertValidPoint2D(p, 'point p');
  assertValidPoint2D(lineAnchor, 'line anchor a');
  assertValidDirection2D(lineDir, 'line direction u');

  const R = computeReflectionMatrix(lineDir);
  const diff = sub2D(p, lineAnchor);
  const rotated = mulMatrixVec2D(R, diff);
  return add2D(lineAnchor, rotated);
}

/**
 * Alternative standard formula using unit normal n:
 * p' = p - 2 * ((p - lineAnchor) · n) * n
 */
export function reflectPointViaNormal(
  p: Point2D,
  lineAnchor: Point2D,
  normal: Point2D
): Point2D {
  assertValidPoint2D(p, 'point p');
  assertValidPoint2D(lineAnchor, 'line anchor a');
  assertValidDirection2D(normal, 'line normal n');

  const n = normalize2D(normal);
  const diff = sub2D(p, lineAnchor);
  const projection = dot2D(diff, n);
  return [p[0] - 2 * projection * n[0], p[1] - 2 * projection * n[1]];
}

/**
 * Reflects an array of polygon vertices across line.
 * Preserves the original vertex indexing sequence.
 */
export function reflectPolygon(
  vertices: Point2D[],
  lineAnchor: Point2D,
  lineDir: Point2D
): Point2D[] {
  if (!Array.isArray(vertices) || vertices.length === 0) {
    throw new Error('INVALID_POLYGON: vertices must be a non-empty array of 2D points');
  }
  for (let i = 0; i < vertices.length; i++) {
    assertValidPoint2D(vertices[i], `vertex[${i}]`);
  }
  assertValidPoint2D(lineAnchor, 'line anchor a');
  assertValidDirection2D(lineDir, 'line direction u');

  return vertices.map((v) => reflectPoint(v, lineAnchor, lineDir));
}

/**
 * Constructs an AffineTransform2D representation for reflection across a line.
 * p' = R * p + (a - R * a)
 */
export function getReflectionTransform(lineAnchor: Point2D, lineDir: Point2D): AffineTransform2D {
  assertValidPoint2D(lineAnchor, 'line anchor a');
  assertValidDirection2D(lineDir, 'line direction u');

  const R = computeReflectionMatrix(lineDir);
  const Ra = mulMatrixVec2D(R, lineAnchor);
  const translation: Point2D = [lineAnchor[0] - Ra[0], lineAnchor[1] - Ra[1]];
  return { matrix: R, translation };
}

/**
 * Applies affine transformation to a point: p' = M * p + t
 */
export function applyAffineTransform(tf: AffineTransform2D, p: Point2D): Point2D {
  assertValidPoint2D(p, 'point p');
  const rotated = mulMatrixVec2D(tf.matrix, p);
  return add2D(rotated, tf.translation);
}

/**
 * Composes two affine transformations: T_composite = T2 o T1 (applies T1 first, then T2)
 * Matrix: M_comp = M2 * M1
 * Translation: t_comp = M2 * t1 + t2
 */
export function composeTransforms(t2: AffineTransform2D, t1: AffineTransform2D): AffineTransform2D {
  const matrix = mulMatrix2x2(t2.matrix, t1.matrix);
  const m2t1 = mulMatrixVec2D(t2.matrix, t1.translation);
  const translation = add2D(m2t1, t2.translation);
  return { matrix, translation };
}

/**
 * Signed area of a polygon via Gauss Shoelace formula.
 * Returns > 0 for Counter-Clockwise (CCW), < 0 for Clockwise (CW).
 */
export function calculateSignedArea(vertices: Point2D[]): number {
  if (!Array.isArray(vertices) || vertices.length < 3) return 0;
  const n = vertices.length;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const p1 = vertices[i];
    const p2 = vertices[(i + 1) % n];
    assertValidPoint2D(p1, `vertex[${i}]`);
    assertValidPoint2D(p2, `vertex[${(i + 1) % n}]`);
    sum += p1[0] * p2[1] - p2[0] * p1[1];
  }
  return sum / 2.0;
}

/**
 * Unsigned (geometric) area of a polygon: |calculateSignedArea|
 */
export function calculateUnsignedArea(vertices: Point2D[]): number {
  return Math.abs(calculateSignedArea(vertices));
}
