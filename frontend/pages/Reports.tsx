import React, { useState } from 'react';
import { Card, Button, RiskBadge } from '../components/ui';
import { exportToPDF, exportToExcel } from '../utils/export';
import { 
  FileText, 
  Download, 
  Pill, 
  TrendingDown, 
  ArrowLeftRight, 
  AlertTriangle, 
  FileCheck, 
  Calendar, 
  Building2,
  CheckCircle2
} from 'lucide-react';
import { MOCK_INVENTORY, MOCK_PREDICTIONS, MOCK_RECOMMENDATIONS } from '../constants';
import { AlertsPage } from './Alerts';
import { StockoutPrediction as PredictiveMaintenance } from './StockoutPrediction';

export { AlertsPage, PredictiveMaintenance };

export const ReportsPage: React.FC = () => {
  const [activeReport, setActiveReport] = useState<'inventory' | 'stockout' | 'consumption' | 'redistribution' | 'anomaly'>('inventory');

  const handleExportPDF = () => {
    const titles = {
      inventory: 'Medicine Inventory Report',
      stockout: 'Stockout Risk & Depletion Report',
      consumption: 'Historical Consumption Report',
      redistribution: 'Inter-Facility Redistribution Audit',
      anomaly: 'Data Quality & Telemetry Anomaly Report'
    };

    exportToPDF({
      title: titles[activeReport],
      hospitalId: 'Hospital A (Chennai Hub)',
      totalMedicines: 128,
      highRiskCount: 7
    });
  };

  const handleExportExcel = () => {
    exportToExcel({
      hospitalId: 'Hospital A (Chennai Hub)',
      items: MOCK_INVENTORY
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Medicine Intelligence Reports</h1>
            <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
              Compliance & Supply Audit
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Generate and export verified audit reports for procurement, clinical governance, and regional authorities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportPDF} className="font-semibold text-xs">
            <FileText size={16} /> Export PDF Report
          </Button>
          <Button variant="outline" onClick={handleExportExcel} className="font-semibold text-xs">
            <Download size={16} /> Export Excel / CSV
          </Button>
        </div>
      </div>

      {/* Report Types Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'inventory', label: 'Medicine Inventory Report', icon: Pill },
          { id: 'stockout', label: 'Stockout Risk Report', icon: TrendingDown },
          { id: 'consumption', label: 'Consumption Report', icon: Calendar },
          { id: 'redistribution', label: 'Redistribution Report', icon: ArrowLeftRight },
          { id: 'anomaly', label: 'Anomaly & Data Quality', icon: AlertTriangle }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReport === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all border ${
                isActive 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Report Content Panels */}
      {activeReport === 'inventory' && (
        <Card title="Medicine Inventory Report (Current Tally)" className="border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3">Medicine</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Facility</th>
                  <th className="py-3 px-3">Opening</th>
                  <th className="py-3 px-3">Received (+)</th>
                  <th className="py-3 px-3">Issued (-)</th>
                  <th className="py-3 px-3">Current Stock</th>
                  <th className="py-3 px-3">Daily Usage</th>
                  <th className="py-3 px-3">Days Remaining</th>
                  <th className="py-3 px-3">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_INVENTORY.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-bold text-slate-900">{item.medicineName}</td>
                    <td className="py-3 px-3 text-slate-600">{item.category}</td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{item.facilityName}</td>
                    <td className="py-3 px-3 text-slate-600">{item.openingStock}</td>
                    <td className="py-3 px-3 text-emerald-600 font-medium">+{item.receivedStock}</td>
                    <td className="py-3 px-3 text-rose-600 font-medium">-{item.issuedStock}</td>
                    <td className="py-3 px-3 font-extrabold text-slate-900">{item.currentStock} {item.unit}</td>
                    <td className="py-3 px-3 text-slate-600">{item.dailyUsage}/day</td>
                    <td className="py-3 px-3 font-bold text-slate-800">{item.daysRemaining} days</td>
                    <td className="py-3 px-3"><RiskBadge risk={item.risk} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeReport === 'stockout' && (
        <Card title="Stockout Risk & Depletion Forecast Report" className="border-slate-200 shadow-sm">
          <div className="space-y-4">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">4 Medicines Identified at Risk of Imminent Stockout</p>
                <p className="mt-0.5 text-rose-700">Priority 1: Insulin at Hospital A (9 days remaining at current 46 units/day rate).</p>
              </div>
              <Button onClick={handleExportPDF} className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs">
                Export Executive Risk Memo
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-3">Medicine</th>
                    <th className="py-3 px-3">Facility</th>
                    <th className="py-3 px-3">Current Stock</th>
                    <th className="py-3 px-3">Consumption Rate</th>
                    <th className="py-3 px-3">Stockout Estimate</th>
                    <th className="py-3 px-3">Confidence</th>
                    <th className="py-3 px-3">Mitigation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_PREDICTIONS.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-bold text-slate-900">{p.medicineName}</td>
                      <td className="py-3 px-3 text-slate-700">{p.facilityName}</td>
                      <td className="py-3 px-3 font-bold text-slate-800">{p.currentStock} units</td>
                      <td className="py-3 px-3 text-slate-600">{p.dailyUsage} units/day</td>
                      <td className="py-3 px-3 font-extrabold text-rose-600">{p.predictedDays} days</td>
                      <td className="py-3 px-3 text-blue-600 font-bold">{p.confidence}% (Sample AI)</td>
                      <td className="py-3 px-3 text-slate-600 max-w-xs">{p.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {activeReport === 'consumption' && (
        <Card title="Historical Consumption & Demand Surge Report" className="border-slate-200 shadow-sm">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <p className="font-bold text-slate-800">Weekly Aggregated Dispensary Consumption Telemetry:</p>
            <p className="text-slate-600">
              Insulin consumption grew from 280 units/week to 322 units/week (+15% surge).
              ORS demand increased to 700 sachets/week during summer clinic intake.
            </p>
          </div>
        </Card>
      )}

      {activeReport === 'redistribution' && (
        <Card title="Inter-Facility Redistribution Audit Ledger" className="border-slate-200 shadow-sm">
          <div className="space-y-3">
            {MOCK_RECOMMENDATIONS.map((r) => (
              <div key={r.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{r.medicineName} — {r.recommendedQuantity} units</p>
                  <p className="text-slate-500 mt-0.5">Route: {r.sourceFacility} &rarr; {r.destinationFacility}</p>
                  <p className="text-slate-600 mt-1 italic">{r.reason}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full">
                    {r.status}
                  </span>
                  <p className="text-slate-400 text-[10px] mt-1">{r.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeReport === 'anomaly' && (
        <Card title="Dispensary Telemetry & Anomaly Report" className="border-slate-200 shadow-sm">
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2 text-xs text-slate-700">
            <div className="font-bold text-amber-900 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-600" />
              ORS Telemetry Pattern Flagged: 2 Consecutive Zero-Consumption Days
            </div>
            <p>
              Monday (45 units), Tuesday (48 units), Wednesday (42 units), Thursday (0 units), Friday (0 units).
            </p>
            <p className="font-semibold text-slate-800">
              Audit Status: Requires verification — distinguishing genuine stockout from transmission outage.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};