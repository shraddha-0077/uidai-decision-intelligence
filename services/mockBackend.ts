
import { User, UserRole, DatasetMetadata, DecisionSignal, AnonymizedRecord } from '../types';

const STORAGE_KEY = 'uidai_decision_intel_data';

export const mockBackend = {
  getDatasets: (): DatasetMetadata[] => {
    return [
      { id: '1', name: 'Enrollment_South_Q3.csv', uploadDate: '2024-11-15', source: 'K Karnataka RO', coverage: 'Karnataka State', records: 45000 },
      { id: '2', name: 'Update_Cycles_Urban_Oct.csv', uploadDate: '2024-10-20', source: 'HQ Operations', coverage: 'Tier 1 Cities', records: 120000 },
    ];
  },

  getSignals: (): DecisionSignal[] => {
    return [
      {
        id: 's1',
        type: 'RISK',
        title: 'Low Biometric Update Velocity',
        district: 'Bellary, Karnataka',
        severity: 'HIGH',
        dataSummary: 'Biometric update rates fell by 22% in the 15-18 age bracket over the last 60 days.',
        whyItMatters: 'Mandatory biometric updates are crucial for ensuring seamless authentication for scholarship disbursements. Delay risks exclusion errors.',
        recommendedAction: 'Coordinate with State Education Dept to organize mandatory update camps in secondary schools by Jan 2025.',
        metricValue: 22,
        trend: 'DOWN'
      },
      {
        id: 's2',
        type: 'COVERAGE',
        title: '0-5 Age Group Coverage Gap',
        district: 'Gumla, Jharkhand',
        severity: 'MEDIUM',
        dataSummary: 'Only 45% of estimated newborns in Gumla district have been issued Bal Aadhaar.',
        whyItMatters: 'Gap in early-age enrolment delays access to nutritional programs and state healthcare schemes.',
        recommendedAction: 'Deploy mobile enrolment vans to Anganwadi centers in rural blocks of Gumla.',
        metricValue: 45,
        trend: 'STABLE'
      },
      {
        id: 's3',
        type: 'ANOMALY',
        title: 'Unexplained Spike in Rejections',
        district: 'Pune, Maharashtra',
        severity: 'HIGH',
        dataSummary: 'Pune Enrolment Center #450 reports 40% rejection rate for "Document Mismatch".',
        whyItMatters: 'Systemic spike indicates potential operator training issue or fraudulent document attempt at a specific center.',
        recommendedAction: 'Immediate audit of Center #450 and temporary suspension of operator credentials pending verification.',
        metricValue: 40,
        trend: 'UP'
      }
    ];
  },

  authenticate: (email: string, otp: string): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (otp === '123456') {
          resolve({
            id: 'u1',
            email,
            name: 'Pankaj Kumar',
            role: email.includes('admin') ? UserRole.ADMIN : UserRole.ANALYST
          });
        } else {
          resolve(null);
        }
      }, 800);
    });
  }
};
