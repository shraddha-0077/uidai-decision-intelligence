
import { User, UserRole, DistrictALDPI, DatasetMetadata, DecisionSignal, LifecycleStatus, AuditLogEntry, AgeSegmentMetrics } from '../types';
import { calculateCRS, projectInactionRisk, generateForecast } from './aldpiEngine';

const STORAGE_KEY = 'uidai_decision_engine_v3_2026';

interface AppState {
  signals: DecisionSignal[];
  auditLogs: AuditLogEntry[];
  datasets: DatasetMetadata[];
}

const generateAgeAnalysis = (): AgeSegmentMetrics[] => [
  { segment: '0-5', averageDelay: 4.2, volume: 12400, updateType: 'NEW_ENROLL' },
  { segment: '6-15', averageDelay: 2.1, volume: 8500, updateType: 'BIO_UPDATE' },
  { segment: '16-60', averageDelay: 1.8, volume: 45000, updateType: 'DEMO_UPDATE' },
  { segment: '60+', averageDelay: 5.5, volume: 3200, updateType: 'BIO_UPDATE' }
];

const getInitialSignals = (): DecisionSignal[] => [
  {
    id: 'sig-2026-001',
    severity: 'HIGH',
    type: 'LATENCY',
    district: 'Bellary',
    title: 'Biometric Update Surcharge: 60+ Segment',
    dataSummary: 'Multivariate Analysis shows a 3.5x delay spike for Bio-updates in the 60+ age band.',
    whyItMatters: 'Critical for elderly pension disbursement via DBT; delay directly impacts livelihood.',
    recommendedAction: 'Authorized prioritization of Pension-linkage updates at Level 1 centers.',
    justification: 'Explainable Rule Trace: Backlog (0.82) > Threshold (0.65). Age segment delta is 2.4 sigma from baseline.',
    provenance: 'Source: UIDAI_ENROLL_2026_V1; Model: Multivariate Age-Region Scorer.',
    metricValue: 82,
    crs: 0.82,
    lifecycleStatus: LifecycleStatus.EXPLAINED,
    assignedRole: UserRole.ANALYST,
    confidence: 91,
    confidenceLevel: 'HIGH',
    freshness: '22 minutes ago',
    biasRisk: 'LOW',
    ruleTrace: [
      'Pendency Ratio 0.82 (Threshold: 0.65)',
      'Capacity Utilization 94% (Threshold: 85%)',
      'Age Segment [60+] Mean Delay: 5.5d (Threshold: 3.0d)'
    ],
    inactionRisk: projectInactionRisk(0.82, 'UP'),
    anomalyDetected: true,
    anomalyDetails: '3× spike in biometric updates in Pincode 583101.',
    history: [
      { status: LifecycleStatus.DETECTED, timestamp: '2024-12-11 10:00', actor: 'ALIS-Firewall', role: UserRole.SYSTEM, note: 'Multivariate anomaly detected in Bellary Cluster.' }
    ]
  }
];

const getStoredState = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  return {
    signals: getInitialSignals(),
    auditLogs: [],
    datasets: [
      { id: 'ds-2026-01', name: 'Official_UIDAI_Hackathon_2026_Enrolment.csv', uploadDate: '2024-12-10', source: 'UIDAI Data Portal', coverage: 'National', records: 5000000 }
    ]
  };
};

const saveState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const mockBackend = {
  getSignals: (): DecisionSignal[] => getStoredState().signals,
  
  getDistricts: (): DistrictALDPI[] => {
    const SEED_DATA = [
      { name: 'Bengaluru', state: 'Karnataka', coords: { x: 3, y: 8 } },
      { name: 'Bellary', state: 'Karnataka', coords: { x: 3, y: 7 } },
      { name: 'Mumbai', state: 'Maharashtra', coords: { x: 1, y: 4 } },
      { name: 'Patna', state: 'Bihar', coords: { x: 7, y: 3 } },
      { name: 'Gurgaon', state: 'Haryana', coords: { x: 4, y: 1 } },
      { name: 'Lucknow', state: 'Uttar Pradesh', coords: { x: 6, y: 2 } }
    ];
    return SEED_DATA.map((d, i) => {
      const metrics = { 
        pendencyRatio: 0.15 + Math.random() * 0.7, 
        updateRatio: 0.4 + Math.random() * 0.5, 
        throughput: 0.3 + Math.random() * 0.6, 
        complexity: 0.2 + Math.random() * 0.5,
        volatility: Math.random() * 0.3,
        capacityUtilization: 0.6 + Math.random() * 0.35
      };
      const crs = calculateCRS(metrics);
      return {
        id: `dist-2026-${i}`,
        ...d,
        metrics,
        crs,
        lfi: crs,
        trend: crs > 0.55 ? 'UP' : 'DOWN',
        daysToRisk: crs > 0.6 ? Math.floor(Math.random() * 10) + 2 : 30,
        lastAudit: '2024-12-11',
        status: crs > 0.65 ? 'CRITICAL' : (crs > 0.4 ? 'MODERATE' : 'HEALTHY'),
        ageAnalysis: generateAgeAnalysis(),
        forecast: generateForecast(150000 + Math.random() * 100000)
      } as DistrictALDPI;
    });
  },

  authenticate: (email: string, otp: string): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (otp === '123456') {
          resolve({ id: `u-2026-${Date.now()}`, email, name: 'Sr. UIDAI Administrator', role: UserRole.ANALYST });
        } else {
          resolve(null);
        }
      }, 600);
    });
  },

  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const state = getStoredState();
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit-2026-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    state.auditLogs = [newEntry, ...state.auditLogs];
    saveState(state);
  },
  
  getAuditLogs: (): AuditLogEntry[] => getStoredState().auditLogs,
  getDatasets: (): DatasetMetadata[] => getStoredState().datasets,
  updateSignal: (updated: DecisionSignal) => {
    const state = getStoredState();
    state.signals = state.signals.map(s => s.id === updated.id ? updated : s);
    saveState(state);
  }
};
