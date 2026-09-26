import React, { useState } from 'react';
import { Card, Button, RiskBadge } from '../components/ui';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  Building2, 
  Pill, 
  Calendar,
  AlertCircle,
  FileSearch,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ConsumptionAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMedicine, setSelectedMedicine] = useState('Insulin');
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Trend Data for Insulin (Section 9: Mon 40, Tue 42, Wed 45, Thu 48, Fri 50 -> increasing trend!)
  const insulinDailyData = [
    { day: 'Monday', usage: 40, baseline: 40, forecast: 41 },
    { day: 'Tuesday', usage: 42, baseline: 40, forecast: 43 },
    { day: 'Wednesday', usage: 45, baseline: 41, forecast: 46 },
    { day: 'Thursday', usage: 48, baseline: 41, forecast: 49 },
    { day: 'Friday', usage: 50, baseline: 42, forecast: 51 },
    { day: 'Saturday', usage: 46, baseline: 42, forecast: 47 },
    { day: 'Sunday', usage: 44, baseline: 41, forecast: 45 }
  ];

  // Weekly Aggregated Consumption
  const weeklyData = [
    { week: 'Week 1', Insulin: 280, ORS: 650, Paracetamol: 820, Amoxicillin: 220 },
    { week: 'Week 2', Insulin: 295, ORS: 680, Paracetamol: 810, Amoxicillin: 235 },
    { week: 'Week 3', Insulin: 310, ORS: 710, Paracetamol: 840, Amoxicillin: 250 },
    { week: 'Week 4', Insulin: 322, ORS: 700, Paracetamol: 850, Amoxicillin: 245 },
  ];

  // Section 10: Anomaly Detection Dataset
  // Recorded: Mon: 45, Tue: 48, Wed: 42, Thu: 0, Fri: 0 -> Unusual zero drop!
  const anomalyDataset = [
    { day: 'Mon', recorded: 45, normalRangeLow: 40, normalRangeHigh: 50, status: 'Normal' },
    { day: 'Tue', recorded: 48, normalRangeLow: 40, normalRangeHigh: 50, status: 'Normal' },
    { day: 'Wed', recorded: 42, normalRangeLow: 40, normalRangeHigh: 50, status: 'Normal' },
    { day: 'Thu', recorded: 0, normalRangeLow: 40, normalRangeHigh: 50, status: 'Anomaly (Zero Drop)' },
    { day: 'Fri', recorded: 0, normalRangeLow: 40, normalRangeHigh: 50, status: 'Anomaly (Zero Drop)' },
  ];

  // High-consumption medicines
  const highConsumptionMedicines = [
    { name: 'Paracetamol 500mg', daily: '120 tabs/day', weekly: '840 tabs', trend: '+4%', status: 'Stable' },
    { name: 'ORS (Oral Rehydration)', daily: '100 sachets/day', weekly: '700 sachets', trend: '+8%', status: 'Surge' },
    { name: 'Insulin (Human 100IU)', daily: '46-50 vials/day', weekly: '322 vials', trend: '+15%', status: 'Critical Surge' },
    { name: 'Amoxicillin 500mg', daily: '35 caps/day', weekly: '245 caps', trend: '+2%', status: 'Stable' },
    { name: 'Artemether-Lumefantrine', daily: '18 strips/day', weekly: '126 strips', trend: '+12%', status: 'Seasonal Surge' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Medicine Consumption Analytics</h1>
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
              Time Series Telemetry
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Historical demand patterns, surge detection, and dispensary anomaly telemetry.
          </p>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setTimeframe('daily')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${timeframe === 'daily' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${timeframe === 'weekly' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${timeframe === 'monthly' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Main Consumption Trend Chart (Section 9) */}
      <Card 
        title="Insulin Consumption Trend: Surge Pattern (Hospital A)" 
        action={
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1 text-rose-600 font-bold">
              <TrendingUp size={14} /> +25% consumption increase Mon → Fri
            </span>
          </div>
        }
        className="border-slate-200 shadow-sm"
      >
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={insulinDailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle"/>
              <Area type="monotone" dataKey="usage" name="Actual Daily Units Issued" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsage)" strokeWidth={3} />
              <Area type="monotone" dataKey="baseline" name="Expected Baseline (40 units)" stroke="#94a3b8" fill="none" strokeWidth={2} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-lg">
            <p className="text-slate-400">Monday Baseline</p>
            <p className="text-base font-bold text-slate-800">40 units</p>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg">
            <p className="text-slate-400">Friday Surge</p>
            <p className="text-base font-bold text-rose-600">50 units (+25%)</p>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg">
            <p className="text-slate-400">Impact on Stockout</p>
            <p className="text-base font-bold text-amber-600">Shortened by 1.6 days</p>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg">
            <p className="text-slate-400">Recommended Action</p>
            <p className="text-base font-bold text-blue-600">Hospital B Transfer</p>
          </div>
        </div>
      </Card>

      {/* Section 10: Data Quality & Anomaly Detection (MANDATORY REQUIREMENT) */}
      <Card 
        title="Data Quality & Anomaly Detection" 
        action={
          <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1">
            <AlertTriangle size={12} /> Verification Required
          </span>
        }
        className="border-amber-200 bg-amber-50/20 shadow-sm"
      >
        <div className="p-4 bg-white rounded-xl border border-amber-200 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Unusual Consumption Pattern Detected
                </h4>
                <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded">
                  Requires verification
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Dispensary telemetry recorded normal usage of 40–50 units/day for Monday–Wednesday, followed by an immediate drop to 0 units on Thursday and Friday.
              </p>
            </div>
            
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-900 text-xs font-extrabold rounded-lg border border-amber-300">
                <FileSearch size={14} />
                Requires Verification
              </span>
            </div>
          </div>

          {/* Anomaly Table / Recorded Comparison */}
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            {anomalyDataset.map((item, i) => (
              <div 
                key={i} 
                className={`p-3 rounded-lg border ${
                  item.recorded === 0 
                    ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold' 
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <p className="text-[11px] text-slate-500 font-medium">{item.day}</p>
                <p className={`text-xl font-black mt-1 ${item.recorded === 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                  {item.recorded} <span className="text-[10px] font-normal">units</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Norm: 40-50</p>
                {item.recorded === 0 && (
                  <span className="inline-block mt-1 text-[9px] font-extrabold px-1.5 py-0.5 bg-rose-200/80 text-rose-800 rounded">
                    FLAGGED
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Root-Cause Possibility Analysis (Section 10 requirement) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Possible Explanations (Distinguishing genuine stockout from reporting gap):
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[11px]">1</span>
                  Genuine Stockout
                </p>
                <p className="text-slate-500 text-[11px] mt-1">
                  Physical inventory reached zero on Wednesday evening, preventing any dispensations on Thursday and Friday.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[11px]">2</span>
                  Reporting Stopped
                </p>
                <p className="text-slate-500 text-[11px] mt-1">
                  Network gateway outage or dispensary staff shift transition delayed daily stock logs upload.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[11px]">3</span>
                  Data Entry Problem
                </p>
                <p className="text-slate-500 text-[11px] mt-1">
                  Manual batch tally entry was omitted or entered under an incorrect inventory barcode ID.
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="italic">
                "System policy: Do not automatically classify as stockout. Flag as 'Requires verification' to prevent false procurement alarms."
              </span>
              <button 
                onClick={() => navigate('/admin/alerts')}
                className="text-xs font-bold text-blue-600 hover:underline shrink-0"
              >
                Open Audit Ticket &rarr;
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Multi-Medicine Weekly Aggregates & High Consumption Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Weekly Regional Consumption Comparison" className="border-slate-200 shadow-sm">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="Insulin" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ORS" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Amoxicillin" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="High-Consumption Medicines (Active Monitoring)" className="border-slate-200 shadow-sm">
          <div className="space-y-3">
            {highConsumptionMedicines.map((med, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <div>
                  <p className="font-bold text-slate-800 text-sm">{med.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Average: {med.daily} • Weekly: {med.weekly}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                    med.status === 'Critical Surge' 
                      ? 'bg-rose-100 text-rose-700' 
                      : med.status === 'Surge'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {med.trend}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{med.status}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
