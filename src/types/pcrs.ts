export type KnowledgeStatus =
  | 'PROPOSED'
  | 'SPECIFIED'
  | 'DERIVED'
  | 'EXPERIMENT_VERIFIED'
  | 'FAILED'
  | 'UNSUPPORTED_INPUT'
  | 'UNVERIFIED'
  | 'REVIEWED'
  | 'AUDITED'
  | 'CANDIDATE'
  | 'ACCEPTED'
  | 'REJECTED';

export type VerificationLevel = 'L0' | 'L1' | 'L2' | 'L3';

export interface UnresolvedQuestion {
  id: string;
  question: string;
  proposedAnswer?: string;
  status: 'OPEN' | 'IN_DISCUSSION' | 'RESOLVED';
}

export interface PCRSDocument {
  id: string;
  path: string;
  title: string;
  category: 'ROOT' | 'THEORY' | 'ARCHITECTURE' | 'EXPERIMENTS' | 'DECISIONS';
  status: KnowledgeStatus;
  version: string;
  summary: string;
  content: string;
  unresolvedQuestions: UnresolvedQuestion[];
}

export interface GeometricTestCase {
  id: string;
  experimentId: 'PCRS-CORE-EXP-001' | 'PCRS-CORE-EXP-002' | 'PCRS-EXP-001' | 'PCRS-EXP-002' | 'CUSTOM';
  name: string;
  description: string;
  status: KnowledgeStatus;
  line: {
    p1: [number, number];
    p2: [number, number];
    label: string;
  };
  staticFaceVertices: Array<[number, number]>;
  movingFaceVertices: Array<[number, number]>;
  reflectedVertices: Array<[number, number]>;
  overlapPolygon: Array<[number, number]>;
  analyticalArea: number;
  contactType: 'AREA_OVERLAP' | 'SEGMENT_CONTACT' | 'VERTEX_CONTACT' | 'NO_CONTACT';
  notes: string;
}
