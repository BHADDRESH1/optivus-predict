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
  Info,
  CheckCircle2,
  BarChart3,
  Users,
  AlertCircle,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { normalizeRole, getRoleInfo } from '../permissions';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedFacility, setSelectedFacility] = useState('All Facilities');

  const currentRole = normalizeRole(user?.role);
  const roleInfo = getRoleInfo(currentRole);

  // Dynamic KPI Metrics tailored by active Role
  const kpiData = (() => {
    switch (currentRole) {
      case Role.ADMIN:
        return [
          {
            title: 'Total Facilities',
            value: '4',
            subtitle: 'Across regional network',
            icon: Building2,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-200',
            path: '/admin/facilities'
          },
          {
            title: 'Total Medicines',
            value: '128',
            subtitle: 'Active formulations tracked',
            icon: Pill,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            path: '/admin/medicine-inventory'
          },
          {
            title: 'High Risk Medicines',
            value: '7',
            subtitle: '< 10 days supply remaining',
            icon: AlertTriangle,
            color: 'text-rose-600',
            bgColor: 'bg-rose-50',
            borderColor: 'border-rose-200',
            path: '/admin/stockout-prediction'
          },
          {
            title: 'Predicted Stockouts',
            value: '4',
            subtitle: 'AI forecast next 14 days',
            icon: TrendingDown,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            path: '/admin/stockout-prediction'
          },
          {
            title: 'Redistribution Matches',
            value: '3',
            subtitle: '2 cross-facility matches ready',
            icon: ArrowLeftRight,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200',
            path: '/admin/redistribution'
          },
          {
            title: 'Critical Alerts',
            value: '3',
            subtitle: 'System-wide anomalies & gaps',
            icon: AlertCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            path: '/admin/alerts'
          }
        ];

      case Role.HOSPITAL_HEAD:
        return [
          {
            title: 'Medicine Availability',
            value: '94.2%',
            subtitle: 'Facility service level score',
            icon: ShieldCheck,
            color: 'text-teal-600',
            bgColor: 'bg-teal-50',
            borderColor: 'border-teal-200',
            path: '/admin/medicine-inventory'
          },
          {
            title: 'Critical Stockouts',
            value: '2',
            subtitle: 'Imminent shortages < 7 days',
            icon: TrendingDown,
            color: 'text-rose-600',
            bgColor: 'bg-rose-50',
            borderColor: 'border-rose-200',
            path: '/admin/stockout-prediction'
          },
          {
            title: 'High Risk Medicines',
            value: '7',
            subtitle: 'Under intensive surveillance',
            icon: AlertTriangle,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            path: '/admin/stockout-prediction'
          },
          {
            title: 'Pending Decisions',
            value: '2',
            subtitle: 'Redistribution awaiting approval',
            icon: ArrowLeftRight,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            path: '/admin/redistribution'
          },
          {
            title: 'Critical Alerts',
            value: '1',
            subtitle: 'Urgent executive escalation',
            icon: AlertCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            path: '/admin/alerts'
          }
        ];

      case Role.SUPERVISOR:
        return [
          {
            title: 'Current Inventory',
            value: '128',
            subtitle: 'Central pharmacy formulations',
            icon: Pill,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            path: '/admin/medicine-inventory'
          },
          {
            title: 'Low Stock Medicines',
            value: '12',
            subtitle: 'At or below reorder level',
            icon: AlertTriangle,
            color: 'text-rose-600',
            bgColor: 'bg-rose-50',
            borderColor: 'border-rose-200',
            path: '/admin/medicine-inventory'
          },
          {
            title: 'Stockout Threats',
            value: '7',
            subtitle: 'Predicted supply runout',
            icon: TrendingDown,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            path: '/admin/stockout-prediction'
          },
          {
            title: 'Daily Consumption',
            value: '1,840',
            subtitle: 'Average units dispensed/day',
            icon: BarChart3,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-200',
            path: '/admin/analytics'
          },
          {
            title: 'Transfer Requests',
            value: '2',
            subtitle: 'Submitted for executive review',
            icon: ArrowLeftRight,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200',
            path: '/admin/redistribution'
          },
          {
            title: 'Expiring Batches',
            value: '3',
            subtitle: 'Batches expiring within 60 days',
            icon: Calendar,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            path: '/admin/reports'
          }
        ];

      case Role.PHARMACIST:
      default:
        return [
          {
            title: 'Medicines Available',
            value: '64',
            subtitle: 'Dispensary active stock lines',
            icon: Pill,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200',
            path: '/admin/medicine-inventory'
          },
          {
            title: 'Low Stock Items',
            value: '3',
            subtitle: 'Immediate reorder needed',
            icon: AlertTriangle,
            color: 'text-rose-600',
            bgColor: 'bg-rose-50',
            borderColor: 'border-rose-200',
            path: '/admin/alerts'
          },
          {
            title: "Today's Dispensing",
            value: '246',
            subtitle: 'Patient prescriptions served',
            icon: CheckCircle2,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            path: '/admin/medicine-inventory'
          },
          {
            title: 'Dispensary Alerts',
            value: '1',
            subtitle: 'Insulin replenishment needed',
            icon: AlertCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            path: '/admin/alerts'
          },
          {
            title: 'Attention Required',
            value: '2',
            subtitle: 'ORS & Insulin fast-dispensing',
            icon: TrendingDown,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            path: '/admin/medicine-inventory'
          }
        ];
    }
  })();

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
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="bg-white/20 backdrop-blur-sm text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
              Sustain-a-thon 2026 • PS-03-S2
            </span>
            <span className="bg-emerald-500/80 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold">
              SDG 3: Good Health & Well-being
            </span>
            <span className="bg-purple-500/80 text-white text-xs px-2.5 py-0.5 rounded-full font-bold uppercase">
              {roleInfo.badge}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Medicine Supply Dashboard</h1>
          <p className="text-blue-100 text-sm mt-1 max-w-2xl">
            {roleInfo.description}
          </p>
        </div>

        {/* Role-Specific Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {currentRole === Role.ADMIN && (
            <>
              <Button 
                onClick={() => navigate('/admin/users')} 
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <Users size={14} />
                <span>Users / Admin</span>
              </Button>
              <Button 
                onClick={() => navigate('/admin/facilities')} 
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <Building2 size={14} />
                <span>Facilities</span>
              </Button>
              <Button 
                onClick={() => navigate('/admin/stockout-prediction')} 
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold text-xs py-2 px-3 flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles size={14} />
                <span>Run AI</span>
              </Button>
            </>
          )}

          {currentRole === Role.HOSPITAL_HEAD && (
            <>
              <Button 
                onClick={() => navigate('/admin/redistribution')} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 flex items-center gap-1.5 ring-2 ring-emerald-400/40"
              >
                <ArrowLeftRight size={14} />
                <span>Approve Transfers</span>
              </Button>
              <Button 
                onClick={() => navigate('/admin/reports')} 
                className="bg-white text-teal-800 hover:bg-teal-50 font-semibold text-xs py-2 px-3 flex items-center gap-1.5 shadow-sm"
              >
                <FileText size={14} />
                <span>Executive Reports</span>
              </Button>
            </>
          )}

          {currentRole === Role.SUPERVISOR && (
            <>
              <Button 
                onClick={() => navigate('/admin/stockout-prediction')} 
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold text-xs py-2 px-3 flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles size={14} />
                <span>Run Stockout AI</span>
              </Button>
              <Button 
                onClick={() => navigate('/admin/medicine-inventory')} 
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <Pill size={14} />
                <span>Manage Stock</span>
              </Button>
            </>
          )}

          {currentRole === Role.PHARMACIST && (
            <>
              <Button 
                onClick={() => navigate('/admin/medicine-inventory')} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 flex items-center gap-1.5 shadow-sm"
              >
                <Pill size={14} />
                <span>Dispense Medicine</span>
              </Button>
              <Button 
                onClick={() => navigate('/admin/alerts')} 
                className="bg-white text-emerald-800 hover:bg-emerald-50 font-semibold text-xs py-2 px-3 flex items-center gap-1.5 shadow-sm"
              >
                <AlertTriangle size={14} />
                <span>Dispensary Alerts</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Active Role Executive Scope Card */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={`px-2.5 py-1 rounded-full font-bold text-xs border ${roleInfo.badgeColor}`}>
            Active: {roleInfo.label}
          </span>
          <span className="text-xs text-slate-500 font-medium hidden md:inline">
            Role Responsibility: {roleInfo.description}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider">Authorized Facility Scope:</span>
          <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            {roleInfo.scope}
          </span>
        </div>
      </div>

      {/* Product Positioning Workflow: PREDICT -> DETECT -> RECOMMEND -> ACT */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-semibold text-slate-500 mb-3">
          <span className="uppercase tracking-wider text-slate-700 font-bold flex items-center gap-1.5">
            <Info size={14} className="text-blue-600" />
            Decision Intelligence Workflow
          </span>
          <span className="text-slate-400">Interactive Pipeline • Click any step to inspect</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div 
            onClick={() => navigate('/admin/stockout-prediction')}
            className="p-3 rounded-lg bg-blue-50/70 border border-blue-100 flex items-start gap-3 cursor-pointer hover:bg-blue-100/70 hover:shadow-xs transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">1</div>
            <div>
              <p className="text-xs font-bold text-blue-900 uppercase">PREDICT</p>
              <p className="text-[11px] text-blue-700 mt-0.5">Forecast remaining stock days using consumption analytics</p>
            </div>
          </div>
          <div 
            onClick={() => navigate('/admin/analytics')}
            className="p-3 rounded-lg bg-amber-50/70 border border-amber-100 flex items-start gap-3 cursor-pointer hover:bg-amber-100/70 hover:shadow-xs transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0">2</div>
            <div>
              <p className="text-xs font-bold text-amber-900 uppercase">DETECT</p>
              <p className="text-[11px] text-amber-700 mt-0.5">Flag unusual consumption anomalies & reporting gaps</p>
            </div>
          </div>
          <div 
            onClick={() => navigate('/admin/redistribution')}
            className="p-3 rounded-lg bg-purple-50/70 border border-purple-100 flex items-start gap-3 cursor-pointer hover:bg-purple-100/70 hover:shadow-xs transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">3</div>
            <div>
              <p className="text-xs font-bold text-purple-900 uppercase">RECOMMEND</p>
              <p className="text-[11px] text-purple-700 mt-0.5">Identify neighboring facilities with projected excess stock</p>
            </div>
          </div>
          <div 
            onClick={() => navigate('/admin/redistribution')}
            className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-start gap-3 cursor-pointer hover:bg-emerald-100/70 hover:shadow-xs transition-all"
          >
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
            <Card 
              key={idx} 
              onClick={() => kpi.path && navigate(kpi.path)}
              className="border-slate-200 hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.title}</p>
                  <p className="text-3xl font-extrabold text-slate-900 mt-1">{kpi.value}</p>
                  <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
                    <span>{kpi.subtitle}</span>
                    <ChevronRight size={12} className="text-slate-400" />
                  </p>
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