import React, { useState } from 'react';
import { Card, Button } from '../components/ui';
import { MOCK_FACILITIES } from '../constants';
import { Facility } from '../types';
import { 
  Building2, 
  MapPin, 
  Pill, 
  AlertTriangle, 
  Bell, 
  Plus, 
  CheckCircle2, 
  ArrowLeftRight, 
  Search,
  ExternalLink,
  Shield,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FacilitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState<Facility[]>(MOCK_FACILITIES);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFacilities = facilities.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Connected Healthcare Facilities</h1>
            <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {facilities.length} Regional Nodes
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Regional healthcare network node monitoring for multi-facility stock sharing and redistribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => navigate('/admin/redistribution')}
            className="font-semibold shadow-sm"
          >
            <ArrowLeftRight size={16} />
            Check Redistribution Matches
          </Button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Connected Hospitals & Clinics</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{facilities.length}</p>
          <p className="text-xs text-slate-400 mt-1">Chennai Regional Health Network</p>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tracked Medicines</p>
          <p className="text-3xl font-extrabold text-blue-600 mt-1">375</p>
          <p className="text-xs text-slate-400 mt-1">Across all dispensary nodes</p>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total High-Risk Items</p>
          <p className="text-3xl font-extrabold text-rose-600 mt-1">10</p>
          <p className="text-xs text-slate-400 mt-1">7 at Hospital A, 2 at Hospital B, 1 Metro</p>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Redistribution Balance</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-1">Active</p>
          <p className="text-xs text-slate-400 mt-1">Hospital B ready to supply Hospital A</p>
        </Card>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder="Search facilities by name, location, or facility type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
        />
      </div>

      {/* Facility Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFacilities.map((fac) => (
          <div 
            key={fac.id}
            className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">{fac.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-semibold text-slate-700">{fac.type}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {fac.location}</span>
                  </div>
                </div>
              </div>

              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {fac.status}
              </span>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs">
              <div className="p-2">
                <p className="text-slate-400">Total Medicines</p>
                <p className="text-xl font-extrabold text-slate-900 mt-0.5">{fac.medicinesCount}</p>
              </div>
              <div className="p-2 border-x border-slate-200">
                <p className="text-slate-400">High Risk (&lt;10d)</p>
                <p className={`text-xl font-extrabold mt-0.5 ${fac.highRiskCount > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {fac.highRiskCount}
                </p>
              </div>
              <div className="p-2">
                <p className="text-slate-400">Active Alerts</p>
                <p className={`text-xl font-extrabold mt-0.5 ${fac.alertsCount > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                  {fac.alertsCount}
                </p>
              </div>
            </div>

            {/* Role in Redistribution Network */}
            <div className="text-xs text-slate-600">
              {fac.name === 'Hospital A' && (
                <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-100 text-rose-800 font-medium">
                  Status: <strong>Recipient Priority</strong> — Facing acute Insulin stockout in 9 days.
                </div>
              )}
              {fac.name === 'Hospital B' && (
                <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-800 font-medium">
                  Status: <strong>Donor Facility</strong> — Holds 200 units surplus Insulin available for transfer.
                </div>
              )}
              {fac.name === 'Metro Health Center' && (
                <div className="p-2.5 bg-slate-100 rounded-lg text-slate-700 font-medium">
                  Status: <strong>Satellite Clinic</strong> — Stable stock buffers; daily reporting active.
                </div>
              )}
              {fac.name === 'Tambaram Sub-Center' && (
                <div className="p-2.5 bg-slate-100 rounded-lg text-slate-700 font-medium">
                  Status: <strong>Primary Dispensary</strong> — Primary health supplies stable.
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => navigate('/admin/medicine-inventory')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                View Facility Inventory &rarr;
              </button>
              <button
                onClick={() => navigate('/admin/redistribution')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                Check Transfer Matches
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
