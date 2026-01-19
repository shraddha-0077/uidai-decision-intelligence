
export enum UserRole {
  ANALYST = 'ANALYST',
  COMPLIANCE_OFFICER = 'COMPLIANCE_OFFICER',
  STATE_NODAL_OFFICER = 'STATE_NODAL_OFFICER',
  SYSTEM = 'SYSTEM',
  DISTRICT_OFFICER = 'DISTRICT_OFFICER'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface LFIMetrics {
  pendencyRatio: number;
  updateRatio: number;
  throughput: number;
  complexity: number;
  volatility: number; 
  capacityUtilization: number; // Added for CRS
}

export interface AgeSegmentMetrics {
  segment: '0-5' | '6-15' | '16-60' | '60+';
  averageDelay: number;
  volume: number;
  updateType: 'BIO_UPDATE' | 'DEMO_UPDATE' | 'NEW_ENROLL';
}

export interface ForecastPoint {
  month: string;
  projectedVolume: number;
  confidenceLower: number;
  confidenceUpper: number;
}

export interface DistrictALDPI {
  id: string;
  name: string;
  state: string;
  coords: { x: number; y: number };
  metrics: LFIMetrics;
  crs: number; // Composite Risk Score (0.0 - 1.0)
  // Added lfi to match internal engine logic and resolve property access errors
  lfi: number;
  trend: 'UP' | 'DOWN';
  daysToRisk: number;
  lastAudit: string;
  status: 'CRITICAL' | 'MODERATE' | 'HEALTHY';
  ageAnalysis: AgeSegmentMetrics[]; // Multivariate component
  forecast: ForecastPoint[]; // Predictive component
}

export enum LifecycleStatus {
  DETECTED = 'DETECTED',
  EXPLAINED = 'EXPLAINED',
  REVIEWED = 'REVIEWED',
  ACTION_INITIATED = 'ACTION_INITIATED',
  RESOLVED = 'RESOLVED'
}

export interface LifecycleEntry {
  status: LifecycleStatus;
  timestamp: string;
  actor: string;
  role: UserRole;
  note: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  targetId: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface InactionRisk {
  projection14d: number;
  projection30d: number;
  impactSummary: string;
  potentialLossOfSLA: string;
}

export interface DecisionSignal {
  id: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  type: string;
  district: string;
  title: string;
  dataSummary: string;
  whyItMatters: string;
  recommendedAction: string;
  justification: string;
  provenance: string;
  metricValue: number;
  crs: number;
  lifecycleStatus: LifecycleStatus;
  history: LifecycleEntry[];
  assignedRole: UserRole;
  confidence: number;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  freshness: string;
  biasRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  ruleTrace: string[];
  inactionRisk: InactionRisk;
  anomalyDetected: boolean;
  anomalyDetails?: string;
}

export interface DatasetMetadata {
  id: string;
  name: string;
  uploadDate: string;
  source: string;
  coverage: string;
  records: number;
}