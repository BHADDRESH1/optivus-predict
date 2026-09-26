import React, { useState } from 'react';
import { Card, Button, RiskBadge } from '../components/ui';
import { MOCK_PREDICTIONS, MOCK_FACILITIES } from '../constants';
import { 
  TrendingDown, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeftRight, 
  Calendar, 
  Building2, 
  Pill, 
  Sliders, 
  Info,
  Clock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export const StockoutPrediction: React.FC = () => {
  const navigate = useNavigate();

  // Selection states
  const [selectedFacility, setSelectedFacility] = useState('Hospital A');
  const [selectedMedicine, setSelectedMedicine] = useState('Insulin');
  const [dateRange, setDateRange] = useState('Next 14 Days');

  // Dynamic simulation parameters (Section 9 & 21: Changing consumption changes days-to-stockout)
  const [simulatedUsage, setSimulatedUsage] = useState<number>(46);
  const baseStock = 420;
  const incomingStock = 0;

  // Real-time calculation based on simulation
  // 420 / 46 = 9.13 ≈ 9 days
  // 420 / 50 = 8.4 ≈ 8 days
  const dynamicDaysRemaining = Math.max(1, Math.round((baseStock / simulatedUsage) * 10) / 10);
  const displayDays = Math.round(dynamicDaysRemaining);
  const dynamicRisk = dynamicDaysRemaining <= 10 ? 'HIGH' : dynamicDaysRemaining <= 15 ? 'MEDIUM' : 'LOW';

  // Projection points for chart based on simulatedUsage
  const chartData = [
    { day: 'Day 0 (Now)', units: baseStock, threshold: 100 },
    { day: 'Day 2', units: Math.max(0, Math.round(baseStock - simulatedUsage * 2)), threshold: 100 },
    { day: 'Day 4', units: Math.max(0, Math.round(baseStock - simulatedUsage * 4)), threshold: 100 },
    { day: 'Day 6', units: Math.max(0, Math.round(baseStock - simulatedUsage * 6)), threshold: 100 },
    { day: 'Day 8', units: Math.max(0, Math.round(baseStock - simulatedUsage * 8)), threshold: 100 },
    { day: `Day ${displayDays} (Stockout)`, units: 0, threshold: 100 }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Stockout Prediction</h1>
            <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <Sparkles size={12} /> Predictive ML Model
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Predict medicine shortages before they affect patients.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={() => navigate('/admin/redistribution')}
            className="font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
          >
            <ArrowLeftRight size={16} />
            Check Redistribution Matches
          </Button>
        </div>
      </div>

      {/* Filter Bar (Section 7) */}
      <Card className="border-slate-200 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Building2 size={14} className="text-blue-600" /> Facility
            </label>
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Hospital A">Hospital A (Chennai Central)</option>
              <option value="Hospital B">Hospital B (Chennai South)</option>
              <option value="Metro Health Center">Metro Health Center</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Pill size={14} className="text-blue-600" /> Medicine
            </label>
            <select
              value={selectedMedicine}
              onChange={(e) => setSelectedMedicine(e.target.value)}
              className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Insulin">Insulin (Human 100IU/ml)</option>
              <option value="ORS">ORS (Oral Rehydration Salts)</option>
              <option value="Anti-TB Medicine">Anti-TB Medicine</option>
              <option value="Antivenom">Antivenom (Polyvalent)</option>
              <option value="Amoxicillin">Amoxicillin 500mg</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Calendar size={14} className="text-blue-600" /> Forecast Window
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Next 7 Days">Next 7 Days (Short Term)</option>
              <option value="Next 14 Days">Next 14 Days (Standard Window)</option>
              <option value="Next 30 Days">Next 30 Days (Monthly Outlook)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Main Prediction Cards (Section 7) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Stock</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{baseStock} <span className="text-xs font-normal text-slate-400">units</span></p>
          <p className="text-[11px] text-slate-400 mt-1">Verified physical tally</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Daily Usage</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{simulatedUsage} <span className="text-xs font-normal text-slate-400">units/day</span></p>
          <p className="text-[11px] text-blue-600 mt-1 font-medium">Historical baseline</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Incoming Stock</p>
          <p className="text-2xl font-black text-slate-500 mt-1">{incomingStock} <span className="text-xs font-normal text-slate-400">units</span></p>
          <p className="text-[11px] text-slate-400 mt-1">No pending POs</p>
        </div>

        <div className="p-4 bg-rose-50/70 rounded-xl border border-rose-200 shadow-sm">
          <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">Predicted Stockout</p>
          <p className="text-2xl font-black text-rose-600 mt-1">
            {displayDays} <span className="text-sm font-bold">days</span>
          </p>
          <p className="text-[11px] text-rose-700 mt-1 font-medium">Approx. {dynamicDaysRemaining} days</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Level</p>
          <div className="mt-2">
            <RiskBadge risk={dynamicRisk} className="text-sm py-1 px-3" />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">&lt; 10 days safety zone</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confidence</p>
          <p className="text-2xl font-black text-blue-600 mt-1">91%</p>
          <p className="text-[11px] text-slate-400 mt-1">Sample AI Prototype</p>
        </div>
      </div>

      {/* Interactive Simulation: Adjust Consumption (Section 9 & 21) */}
      <Card className="border-blue-200 bg-blue-50/40 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders size={18} className="text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Interactive Consumption Simulation</h3>
              <span className="text-[11px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Demo Experiment</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Test how increasing consumption shifts the stockout date (e.g. from 46 units/day to 50 units/day).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSimulatedUsage(46)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${simulatedUsage === 46 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
            >
              Standard (46/day → 9 days)
            </button>
            <button
              onClick={() => setSimulatedUsage(50)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${simulatedUsage === 50 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
            >
              Surge (+10% / 50/day → 8 days)
            </button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-blue-100/70 flex items-center gap-4">
          <input
            type="range"
            min="30"
            max="70"
            value={simulatedUsage}
            onChange={(e) => setSimulatedUsage(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="shrink-0 text-right min-w-[120px]">
            <span className="text-sm font-extrabold text-blue-900">{simulatedUsage} units/day</span>
            <div className="text-[10px] text-slate-500">420 / {simulatedUsage} = {dynamicDaysRemaining}d</div>
          </div>
        </div>
      </Card>

      {/* Grid: Explanation & Depletion Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 8: "Why is this medicine at risk?" */}
        <Card 
          title="Why is this medicine at risk?" 
          className="border-slate-200 shadow-sm"
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-xl flex items-start gap-3">
              <ShieldAlert className="text-rose-600 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-xs font-bold text-rose-900 uppercase">Immediate Stockout Imminent</p>
                <p className="text-xs text-rose-700 mt-0.5">
                  At current rates of consumption, Hospital A will exhaust all insulin supplies within {displayDays} days without an intervention.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Current stock is <strong className="text-slate-900">{baseStock} units</strong>.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Average daily usage is <strong className="text-slate-900">{simulatedUsage} units/day</strong>.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>No incoming stock is currently recorded in the procurement ledger.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>
                  Based on recent consumption patterns, the system estimates approximately <strong className="text-rose-600">{displayDays} days</strong> of remaining stock.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                <span>Risk level: <strong className="text-rose-600 font-extrabold">{dynamicRisk}</strong>.</span>
              </div>
            </div>

            {/* Recommendation Link Box */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-900 uppercase">Smart Redistribution Opportunity</p>
                  <p className="text-xs text-emerald-800 mt-1">
                    Hospital B (Chennai South) has 500 units of Insulin with 200 units projected excess above safety reserve.
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <Button 
                  onClick={() => navigate('/admin/redistribution')}
                  className="w-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Review Transfer: 100 units from Hospital B → Hospital A <ArrowRight size={14} />
                </Button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic text-center">
              Sample prediction based on historical usage and AI stockout forecast model (Demo prototype).
            </p>
          </div>
        </Card>

        {/* Depletion Curve Graph */}
        <Card title="Depletion Timeline Projection" className="border-slate-200 shadow-sm">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <ReferenceLine y={100} label={{ value: 'Safety Threshold', fill: '#f59e0b', fontSize: 11, position: 'top' }} stroke="#f59e0b" strokeDasharray="4 4" />
                <Line 
                  type="monotone" 
                  dataKey="units" 
                  name="Projected Units Remaining" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 7 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-500 flex items-center justify-between">
            <span>Critical Zero Threshold: <strong className="text-slate-800">Day {displayDays}</strong></span>
            <span>Safety Buffer: <strong className="text-amber-700">100 units</strong></span>
          </div>
        </Card>
      </div>
    </div>
  );
};
