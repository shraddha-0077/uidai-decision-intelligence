
import React, { useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setStep(2);
      setLoading(false);
    }, 1000);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const user = await mockBackend.authenticate(email, otp);
    if (user) {
      onLoginSuccess(user);
    } else {
      setError('Invalid OTP. Please use 123456 for the demo.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200 mb-4 font-black text-2xl">
            UA
          </div>
          <h1 className="text-2xl font-bold text-slate-900">UIDAI Decision Intelligence</h1>
          <p className="text-slate-500 mt-2 text-sm">Official Policy & Analytical Support Environment</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
          {step === 1 ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Government ID / Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@uidai.gov.in"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Send OTP'}
              </button>
              <p className="text-[10px] text-center text-slate-400 italic">Access is logged and audited by UIDAI Compliance Cell.</p>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Verify Identity (OTP)</label>
                <button type="button" onClick={() => setStep(1)} className="text-[10px] font-bold text-blue-600 hover:underline">Change Email</button>
              </div>
              <p className="text-xs text-slate-500 mb-4">OTP sent to: <span className="font-semibold">{email}</span></p>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                className="w-full px-4 py-3 text-center text-2xl tracking-widest font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Access Portal'}
              </button>
              <p className="text-[10px] text-center text-slate-400">Hint: Use <span className="font-bold">123456</span> for demo.</p>
            </form>
          )}
        </div>
        
        <div className="mt-8 text-center text-[10px] text-slate-400 uppercase tracking-widest font-semibold flex flex-col gap-2">
          <span>Security Level: Advanced Tier-2 (STQC Certified)</span>
          <span>© 2024 Unique Identification Authority of India</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
