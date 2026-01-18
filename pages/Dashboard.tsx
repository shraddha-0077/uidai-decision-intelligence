
import React from 'react';
import { DecisionSignal } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC<{ signals: DecisionSignal[] }> = ({ signals }) => {
  const trendData = [
    { month: 'Jul', value: 400 },
    { month: 'Aug', value: 300 },
    { month: 'Sep', value: 600 },
    { month: 'Oct', value: 800 },
    { month: 'Nov', value: 500 },
    { month: 'Dec', value: 900 },
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6'];
  const pieData = [
    { name: 'High Risk', value: signals.filter(s => s.severity === 'HIGH').length },
    { name: 'Medium Risk', value: signals.filter(s => s.severity === 'MEDIUM').length },
    { name: 'Low Risk', value: signals.filter(s => s.severity === 'LOW').length },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Signals</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-800">{signals.length}</span>
            <span className="text-green-500 text-xs font-bold mb-1">+2 from yesterday</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Critical Bottlenecks</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-red-600">{signals.filter(s => s.severity === 'HIGH').length}</span>
            <span className="text-slate-400 text-xs font-medium mb-1">Requiring immediate action</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Pending Updates</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-800">12.4M</span>
            <span className="text-blue-500 text-xs font-bold mb-1">Biometric cycle peak</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">National Enrolment Anomalies (Anonymized)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Decision Backlog Distribution</h3>
          <div className="flex flex-col md:flex-row items-center justify-around h-64">
            <div className="h-full w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {pieData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{item.value} Active Signals</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4">Urgent Attention Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                <th className="pb-4">District</th>
                <th className="pb-4">Signal Type</th>
                <th className="pb-4">Primary Metric</th>
                <th className="pb-4">Priority</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {signals.map((s) => (
                <tr key={s.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-4 font-semibold text-slate-700">{s.district}</td>
                  <td className="py-4 text-slate-500">{s.type}</td>
                  <td className="py-4 text-slate-800 font-medium">{s.metricValue}% Delta</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      s.severity === 'HIGH' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {s.severity}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                      <span className="text-xs text-blue-500 font-medium">Analyzing</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
