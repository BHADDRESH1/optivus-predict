import React, { useState } from 'react';
import { Card, Button, RiskBadge } from '../components/ui';
import { MOCK_ALERTS } from '../constants';
import { MedicineAlert } from '../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Search, 
  ArrowLeftRight, 
  ShieldAlert, 
  Bell, 
  Check, 
  Pill,
  Building2,
  FileSearch,
  Truck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<MedicineAlert[]>(MOCK_ALERTS);
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Acknowledged' } : a));
  };

  const handleResolve = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Resolved' } : a));
  };

  const filteredAlerts = alerts.filter(a => {
    const matchFilter = filterType === 'All' || a.type === filterType || (filterType === 'Active' && a.status === 'Active');
    const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        a.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        a.medicine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        a.facility.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'HIGH STOCKOUT RISK': return <ShieldAlert size={20} className="text-rose-600" />;
      case 'ANOMALY DETECTED': return <AlertTriangle size={20} className="text-amber-600" />;
      case 'REDISTRIBUTION OPPORTUNITY': return <ArrowLeftRight size={20} className="text-blue-600" />;
      case 'REPORTING GAP': return <FileSearch size={20} className="text-yellow-600" />;
      case 'INCOMING STOCK DELAY': return <Truck size={20} className="text-purple-600" />;
      default: return <Bell size={20} className="text-slate-600" />;
    }
  };

  const getAlertBadgeStyle = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'success': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Medicine Supply Alerts</h1>
            <span className="bg-rose-100 text-rose-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {alerts.filter(a => a.status === 'Active').length} Active
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Real-time notifications for predicted stockouts, telemetry anomalies, and redistribution matches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setAlerts(prev => prev.map(a => ({ ...a, status: 'Acknowledged' })))}
            variant="outline"
            className="text-xs font-semibold"
          >
            Acknowledge All
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-slate-200 shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search alerts by medicine, facility, or alert type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {['All', 'Active', 'HIGH STOCKOUT RISK', 'ANOMALY DETECTED', 'REDISTRIBUTION OPPORTUNITY', 'LOW STOCK'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-all ${
                  filterType === t 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <Card className="text-center py-12 text-slate-400">
            No matching medicine alerts found.
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-5 rounded-2xl border transition-all ${
                alert.status === 'Resolved' 
                  ? 'bg-slate-50/60 border-slate-200 opacity-60' 
                  : alert.severity === 'critical'
                  ? 'bg-rose-50/50 border-rose-200 hover:shadow-sm'
                  : alert.severity === 'warning'
                  ? 'bg-amber-50/50 border-amber-200 hover:shadow-sm'
                  : 'bg-blue-50/50 border-blue-200 hover:shadow-sm'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs shrink-0">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getAlertBadgeStyle(alert.severity)}`}>
                        {alert.type}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Building2 size={12} className="text-slate-400" />
                        {alert.facility}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Pill size={12} className="text-slate-400" />
                        {alert.medicine}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock size={11} /> {alert.timestamp}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{alert.title}</h4>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed max-w-3xl">
                      {alert.message}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {alert.type === 'REDISTRIBUTION OPPORTUNITY' && (
                    <button
                      onClick={() => navigate('/admin/redistribution')}
                      className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                    >
                      View Match
                    </button>
                  )}
                  {alert.type === 'HIGH STOCKOUT RISK' && (
                    <button
                      onClick={() => navigate('/admin/stockout-prediction')}
                      className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors"
                    >
                      Forecast Model
                    </button>
                  )}
                  {alert.status === 'Active' && (
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  {alert.status !== 'Resolved' && (
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Check size={13} />
                      Resolve
                    </button>
                  )}
                  {alert.status === 'Resolved' && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 size={14} /> Resolved
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
