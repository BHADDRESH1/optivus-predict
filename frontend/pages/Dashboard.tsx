import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { Card, Button, RiskBadge } from '../components/ui';
import { 
  MOCK_INVENTORY, 
  MOCK_ALERTS, 
  MOCK_RECOMMENDATIONS 
} from '../constants';
import { 
  Pill, 
  AlertTriangle, 
  TrendingDown, 
  ArrowLeftRight, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedFacility, setSelectedFacility] = useState('All Facilities');

  // KPI Metrics (Demo Prototype values aligned with requirements)
  const kpiData = [
    {
      title: 'Total Medicines',
      value: '128',
      subtitle: 'Across 4 regional facilities',
      icon: Pill,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'High Risk Medicines',
      value: '7',
      subtitle: '< 10 days supply remaining',
      icon: AlertTriangle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200'
    },
    {
      title: 'Predicted Stockouts',
      value: '4',
      subtitle: 'AI forecast next 14 days',
      icon: TrendingDown,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      title: 'Redistribution Opportunities',
      value: '3',
      subtitle: '2 cross-facility matches ready',
      icon: ArrowLeftRight,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    }
  ];

  // Stockout Risk projection chart data (Days vs Projected Units for Insulin and ORS at Hospital A)
  const trendData = [
    { day: 'Day 0 (Today)', insulinStock: 420, orsStock: 1200, safetyBuffer: 150 },
    { day: 'Day 2', insulinStock: 328, orsStock: 1000, safetyBuffer: 150 },
    { day: 'Day 4', insulinStock: 236, orsStock: 800, safetyBuffer: 150 },
    { day: 'Day 6', insulinStock: 144, orsStock: 600, safetyBuffer: 150 },
    { day: 'Day 8', insulinStock: 52, orsStock: 400, safetyBuffer: 150 },
    { day: 'Day 9 (Critical)', insulinStock: 6, orsStock: 300, safetyBuffer: 150 },
    { day: 'Day 10', insulinStock: 0, orsStock: 200, safetyBuffer: 150 }
  ];

  // High-Risk Medicines Table (Section 4.A)
  const highRiskMedicines = [
    {
      medicine: 'Insulin',
      fullName: 'Insulin (Human 100IU/ml)',
      facility: 'Hospital A',
      currentStock: 420,
      dailyUsage: '46/day',
      daysRemaining: '9 days',
      risk: 'HIGH',
      unit: 'vials'
    },
    {
      medicine: 'ORS',
      fullName: 'Oral Rehydration Salts',
      facility: 'Hospital A',
      currentStock: 1200,
      dailyUsage: '100/day',
      daysRemaining: '12 days',
      risk: 'MEDIUM',
      unit: 'sachets'
    },
    {
      medicine: 'Anti-TB Medicine',
      fullName: 'Rifampicin + Isoniazid',
      facility: 'Hospital A',
      currentStock: 150,
      dailyUsage: '12/day',
      daysRemaining: '12 days',
      risk: 'MEDIUM',
      unit: 'packs'
    },
    {
      medicine: 'Antivenom',
      fullName: 'Polyvalent Snake Antivenom',
      facility: 'Hospital A',
      currentStock: 80,
      dailyUsage: '4/day',
      daysRemaining: '20 days',
      risk: 'LOW',
      unit: 'vials'
    },
    {
      medicine: 'Amoxicillin',
      fullName: 'Amoxicillin 500mg',
      facility: 'Hospital B',
      currentStock: 600,
      dailyUsage: '35/day',
      daysRemaining: '17 days',
      risk: 'LOW',
      unit: 'capsules'
    }
  ];

  // Recent Alerts (Section 4.C)
  const recentAlerts = [
    {
      id: 'ALT-1',
      text: 'Insulin at Hospital A may run out in 9 days.',
      type: 'critical',
      tag: 'HIGH STOCKOUT RISK',
      time: '15 mins ago'
    },
    {
      id: 'ALT-2',
      text: 'Unusual zero-consumption pattern detected for ORS.',
      type: 'warning',
      tag: 'ANOMALY DETECTED',
      time: '1 hour ago'
    },
    {
      id: 'ALT-3',
      text: 'Redistribution opportunity found: Hospital B → Hospital A.',
      type: 'info',
      tag: 'SMART REDISTRIBUTION',
      time: '2 hours ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Context Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-6 rounded-2xl shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 backdrop-blur-sm text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
              Sustain-a-thon 2026 • PS-03-S2
            </span>
            <span className="bg-emerald-500/80 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold">
              SDG 3: Good Health & Well-being
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Medicine Supply Dashboard</h1>
          <p className="text-blue-100 text-sm mt-1 max-w-2xl">
            OPTIVUS Predict helps healthcare facilities predict medicine shortages before they happen and recommends preventive action.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => navigate('/admin/stockout-prediction')} 
            className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow"
          >
            <Sparkles size={16} />
            Run Stockout AI
          </Button>
          <Button 
            onClick={() => navigate('/admin/redistribution')} 
            className="bg-blue-600/60 hover:bg-blue-600 text-white border border-blue-400 font-medium"
          >
            <ArrowLeftRight size={16} />
            Smart Redistribution
          </Button>
        </div>
      </div>

      {/* Product Positioning Workflow: PREDICT -> DETECT -> RECOMMEND -> ACT */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-semibold text-slate-500 mb-3">
          <span className="uppercase tracking-wider text-slate-700 font-bold flex items-center gap-1.5">
            <Info size={14} className="text-blue-600" />
            Decision Intelligence Workflow
          </span>
          <span className="text-slate-400">Prototype Demo • Hospital A Hub</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-100 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">1</div>
            <div>
              <p className="text-xs font-bold text-blue-900 uppercase">PREDICT</p>
              <p className="text-[11px] text-blue-700 mt-0.5">Forecast remaining stock days using consumption analytics</p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-100 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0">2</div>
            <div>
              <p className="text-xs font-bold text-amber-900 uppercase">DETECT</p>
              <p className="text-[11px] text-amber-700 mt-0.5">Flag unusual consumption anomalies & reporting gaps</p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-purple-50/70 border border-purple-100 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">3</div>
            <div>
              <p className="text-xs font-bold text-purple-900 uppercase">RECOMMEND</p>
              <p className="text-[11px] text-purple-700 mt-0.5">Identify neighboring facilities with projected excess stock</p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">4</div>
            <div>
              <p className="text-xs font-bold text-emerald-900 uppercase">ACT</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">Administrator reviews & approves smart transfer orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card key={idx} className="border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.title}</p>
                  <p className="text-3xl font-extrabold text-slate-900 mt-1">{kpi.value}</p>
                  <p className="text-xs font-medium text-slate-500 mt-1">{kpi.subtitle}</p>
                </div>
                <div className={`p-3 rounded-xl ${kpi.bgColor} ${kpi.borderColor} border`}>
                  <Icon size={22} className={kpi.color} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Grid: High-Risk Medicines & Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* A. High-Risk Medicines Table (2 Columns wide on desktop) */}
        <div className="lg:col-span-2">
          <Card 
            title="High-Risk Medicines" 
            action={
              <button 
                onClick={() => navigate('/admin/medicine-inventory')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                View Full Inventory <ChevronRight size={14} />
              </button>
            }
            className="shadow-sm border-slate-200 h-full flex flex-col"
          >
            <div className="overflow-x-auto -mx-6 -my-4">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Medicine</th>
                    <th className="py-3 px-4">Facility</th>
                    <th className="py-3 px-4">Current Stock</th>
                    <th className="py-3 px-4">Daily Usage</th>
                    <th className="py-3 px-4">Days Remaining</th>
                    <th className="py-3 px-4">Risk</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {highRiskMedicines.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{row.medicine}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[160px]">{row.fullName}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">{row.facility}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {row.currentStock} <span className="text-xs font-normal text-slate-400">{row.unit}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{row.dailyUsage}</td>
                      <td className="py-3.5 px-4">
                        <span className={`font-bold ${row.risk === 'HIGH' ? 'text-rose-600' : row.risk === 'MEDIUM' ? 'text-amber-600' : 'text-slate-700'}`}>
                          {row.daysRemaining}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <RiskBadge risk={row.risk} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button 
                          onClick={() => navigate('/admin/stockout-prediction')}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Formula: Days Remaining = Current Stock / Average Daily Usage</span>
              <span className="font-semibold text-slate-700">Sample prediction model</span>
            </div>
          </Card>
        </div>

        {/* B. Recent Alerts Card */}
        <div className="lg:col-span-1">
          <Card 
            title="Recent Stock Alerts" 
            action={
              <button 
                onClick={() => navigate('/admin/alerts')} 
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                All Alerts <ChevronRight size={14} />
              </button>
            }
            className="shadow-sm border-slate-200 h-full flex flex-col"
          >
            <div className="space-y-3 flex-1">
              {recentAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    alert.type === 'critical' 
                      ? 'bg-rose-50/60 border-rose-200/80 hover:bg-rose-50' 
                      : alert.type === 'warning'
                      ? 'bg-amber-50/60 border-amber-200/80 hover:bg-amber-50'
                      : 'bg-blue-50/60 border-blue-200/80 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      alert.type === 'critical'
                        ? 'bg-rose-200/70 text-rose-800'
                        : alert.type === 'warning'
                        ? 'bg-amber-200/70 text-amber-800'
                        : 'bg-blue-200/70 text-blue-800'
                    }`}>
                      {alert.tag}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{alert.time}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    {alert.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <Button 
                onClick={() => navigate('/admin/redistribution')}
                variant="outline" 
                className="w-full text-xs font-semibold text-blue-700 bg-blue-50/50 hover:bg-blue-100/60 border-blue-200"
              >
                <ArrowLeftRight size={14} />
                Review Redistribution Opportunity
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* B. Stockout Risk Chart: Projected Depletion Curve */}
      <Card 
        title="Stockout Depletion Trajectory (Hospital A Forecast)" 
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Target Safety Buffer: 150 units</span>
          </div>
        }
        className="shadow-sm border-slate-200"
      >
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInsulin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOrs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
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
              <Area 
                type="monotone" 
                dataKey="insulinStock" 
                name="Insulin Stock (Hospital A - Rapid Drop)" 
                stroke="#ef4444" 
                fillOpacity={1} 
                fill="url(#colorInsulin)" 
                strokeWidth={3} 
              />
              <Area 
                type="monotone" 
                dataKey="orsStock" 
                name="ORS Stock (Hospital A)" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorOrs)" 
                strokeWidth={2} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-center text-xs text-slate-400">
          Notice: Insulin at Hospital A crosses the zero buffer on Day 9 unless replenished via Hospital B transfer.
        </p>
      </Card>
    </div>
  );
};