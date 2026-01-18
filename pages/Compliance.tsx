
import React from 'react';

const Compliance: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <div className="inline-block px-4 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
          Audit Reference: DS-UIDAI-2024-ETH
        </div>
        <h1 className="text-4xl font-bold text-slate-900">Compliance & Ethical AI Framework</h1>
        <p className="text-slate-500 text-lg">Ensuring Privacy, Sovereignty, and Trust in Aadhaar Ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl font-bold">01</div>
          <h3 className="text-xl font-bold text-slate-800">No Raw PII Storage</h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            This application implements <strong>Zero-Persistence for PII</strong>. Aadhaar numbers, biometric data, and specific residential addresses are stripped at the ingestion layer.
          </p>
          <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4 font-medium">
            <li>Masked IDs generated using SHA-256 Hashing with Salt.</li>
            <li>No storage of 12-digit Aadhaar numbers in any database.</li>
            <li>Aggregated data at District/Sub-district level only.</li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-xl font-bold">02</div>
          <h3 className="text-xl font-bold text-slate-800">Mock Integration Disclaimer</h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            In compliance with UIDAI security policies, all Aadhaar authentication and data-sync APIs are currently <strong>environmentally mocked</strong>.
          </p>
          <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4 font-medium">
            <li>e-KYC responses are simulated for demo purposes.</li>
            <li>Enrolment status checks are rule-based mocks.</li>
            <li>No production CIDR traffic is routed through this portal.</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-10 overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-6">UIDAI Data Governance Pledge</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="shrink-0 text-xl">✓</div>
              <div>
                <h4 className="font-bold text-slate-100">Decision Bias Mitigation</h4>
                <p className="text-slate-400 text-sm">All AI-driven insights are reviewed by a human Policy Administrator. AI acts as a signal detector, not a primary decision-maker.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 text-xl">✓</div>
              <div>
                <h4 className="font-bold text-slate-100">Transparency & Explainability</h4>
                <p className="text-slate-400 text-sm">Every recommendation is backed by raw statistical logic displayed in the 'What the data shows' section of the insight cards.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
      </div>

      <div className="text-center p-8 border border-slate-200 rounded-2xl bg-slate-50">
        <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-4">Certified By</p>
        <div className="flex justify-center gap-8 opacity-50 grayscale">
          <div className="font-black text-slate-600 italic">STQC</div>
          <div className="font-black text-slate-600 italic">CDAC</div>
          <div className="font-black text-slate-600 italic">MeitY</div>
        </div>
      </div>
    </div>
  );
};

export default Compliance;
