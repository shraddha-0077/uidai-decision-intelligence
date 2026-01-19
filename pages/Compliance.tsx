
import React from 'react';

const Compliance: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <div className="inline-block px-4 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
          UIDAI Data Hackathon 2026 Evaluation Pillar
        </div>
        <h1 className="text-4xl font-bold text-slate-900">Governance & Compliance Framework</h1>
        <p className="text-slate-500 text-lg">Ensuring billion-scale decision intelligence remains privacy-first.</p>
      </div>

      {/* Disclaimers Table */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="bg-slate-50 p-8 border-b border-slate-200">
           <h3 className="font-black uppercase text-xs text-slate-500 tracking-widest">Compliance Assertions</h3>
        </div>
        <div className="p-8 space-y-10">
          <div className="flex gap-6">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-xl">👤</div>
            <div>
              <h4 className="font-black text-slate-900 text-lg">PII Masking Protocol</h4>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                UDIS is strictly PII-agnostic. All Aadhaar numbers displayed (e.g., <strong>XXXX-XXXX-1234</strong>) are masked placeholders. No real citizen data enters the decision engine; only aggregated, anonymized regional telemetry is processed.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-xl">⚙️</div>
            <div>
              <h4 className="font-black text-slate-900 text-lg">Decision-Support vs. Automation</h4>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                UDIS does not automate policy decisions. It provides a <strong>Composite Risk Score (CRS)</strong> and <strong>Cost of Inaction</strong> projections to support human judgment. All policy actions require a digital signature from a verified UIDAI principal.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-xl">📖</div>
            <div>
              <h4 className="font-black text-slate-900 text-lg">Audit & RTI Explainability</h4>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                Every AI-synthesized recommendation is accompanied by an <strong>Explainable Rule Trace</strong>. This ensures that any regional intervention can be justified under RTI disclosures or parliamentary audits with a clear "paper trail" of logic.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-10 bg-slate-900 text-white rounded-[3rem] text-center border border-slate-800 shadow-2xl">
         <h3 className="text-2xl font-black mb-4">Official Disclaimer</h3>
         <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
           This system is an MVP for the UIDAI Data Hackathon 2026. It complies with the <strong>Digital Personal Data Protection (DPDP) Act 2023</strong> and UIDAI’s zero-trust architectural guidelines.
         </p>
      </div>
    </div>
  );
};

export default Compliance;
