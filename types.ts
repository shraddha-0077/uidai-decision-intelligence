
export enum UserRole {
  ADMIN = 'ADMIN',
  ANALYST = 'ANALYST'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface DatasetMetadata {
  id: string;
  name: string;
  uploadDate: string;
  source: string;
  coverage: string;
  records: number;
}

export interface DecisionSignal {
  id: string;
  type: 'RISK' | 'ANOMALY' | 'COVERAGE' | 'DEMOGRAPHIC';
  title: string;
  district: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  dataSummary: string;
  whyItMatters: string;
  recommendedAction: string;
  metricValue: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface AnonymizedRecord {
  maskedId: string;
  district: string;
  state: string;
  ageGroup: string;
  gender: string;
  enrolmentType: 'NEW' | 'UPDATE';
  timestamp: string;
  status: 'SUCCESS' | 'FAILURE' | 'PENDING';
}
