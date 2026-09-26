import React, { useState } from 'react';
import { Card, Button, RiskBadge } from '../components/ui';
import { exportReportToPDF, exportReportToExcel, exportReportToCSV } from '../utils/export';
import { 
  FileText, 
  Download, 
  Pill, 
  TrendingDown, 
  ArrowLeftRight, 
  AlertTriangle, 
  Calendar, 
  Building2,
  CheckCircle2,
  Loader2,
  XCircle,
  Eye,
  Check,
  X,
  RefreshCw,
  ShieldCheck,
  Info,
  Clock,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import { MOCK_INVENTORY, MOCK_PREDICTIONS, MOCK_RECOMMENDATIONS } from '../constants';
import { RedistributionRecommendation } from '../types';

export const ReportsPage: React.FC = () => {
  // Active Tab
  const [activeReport, setActiveReport] = useState<'inventory' | 'stockout' | 'consumption' | 'redistribution' | 'anomaly'>('inventory');

  // Loading & Action feedback states
  const [pdfLoading, setPdfLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Live mutable state for Redistribution recommendations (ensures Approve/Reject buttons actually update state & exports)
  const [recommendations, setRecommendations] = useState<RedistributionRecommendation[]>(MOCK_RECOMMENDATIONS);

  // Anomaly verification state
  const [orsAnomalyStatus, setOrsAnomalyStatus] = useState<string>('Requires verification');
  const [isAnomalyVerified, setIsAnomalyVerified] = useState<boolean>(false);

  // Consumption view toggle
  const [consumptionWindow, setConsumptionWindow] = useState<'7d' | '30d'>('7d');

  // Modal state for View Details
  const [selectedRecDetails, setSelectedRecDetails] = useState<RedistributionRecommendation | null>(null);

  // Helper to show temporary notification
  const notify = (type: 'success' | 'error' | 'info', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  // 1. Export PDF Action
  const handleExportPDF = async () => {
    if (pdfLoading || excelLoading) return;
    setPdfLoading(true);

    try {
      const filename = await exportReportToPDF({
        reportType: activeReport,
        hospitalId: 'Hospital A (Chennai Central Hub)',
        inventory: MOCK_INVENTORY,
        predictions: MOCK_PREDICTIONS,
        recommendations: recommendations,
        anomalies: [
          {
            facility: 'Hospital A (Chennai Central)',
            medicine: 'ORS (Oral Rehydration Salts)',
            issue: 'Abrupt 2-Day Zero Consumption Drop',
            type: 'Telemetry Reporting Anomaly',
            severity: orsAnomalyStatus,
            status: isAnomalyVerified ? 'Verified by Clinical Admin (Data Lag)' : 'Pending Clinical Log Audit',
            explanation: 'Mon (45), Tue (48), Wed (42), Thu (0), Fri (0). Verified as dispensary logging gap. Distinguishing from stockout prevents false emergency procurement.'
          }
        ]
      });
      notify('success', `PDF downloaded successfully: ${filename}`);
    } catch (err: any) {
      console.error('PDF export error:', err);
      notify('error', 'PDF download failed. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  // 2. Export Excel Action
  const handleExportExcel = async () => {
    if (pdfLoading || excelLoading) return;
    setExcelLoading(true);

    try {
      const filename = await exportReportToExcel({
        reportType: activeReport,
        hospitalId: 'Hospital A (Chennai Central Hub)',
        inventory: MOCK_INVENTORY,
        predictions: MOCK_PREDICTIONS,
        recommendations: recommendations,
        anomalies: [
          {
            facility: 'Hospital A',
            medicine: 'ORS',
            issue: 'Abrupt 2-Day Zero Consumption Drop',
            type: 'Reporting Anomaly',
            severity: orsAnomalyStatus,
            status: isAnomalyVerified ? 'Verified (Data Lag)' : 'Pending Clinical Log Audit',
            explanation: 'Dispensary logging gap on Thu/Fri. Distinguishing from genuine stockout avoids false emergency re-orders.'
          }
        ]
      });
      notify('success', `Excel report downloaded successfully: ${filename}`);
    } catch (err: any) {
      console.error('Excel export error:', err);
      notify('error', 'Export failed. Please try again.');
    } finally {
      setExcelLoading(false);
    }
  };

  // 3. Approve Redistribution Recommendation
  const handleApproveRecommendation = (id: string) => {
    setRecommendations(prev => prev.map(rec => {
      if (rec.id === id) {
        return {
          ...rec,
          status: 'Approved (Dispatched)',
          createdAt: `Approved ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} by Admin`
        };
      }
      return rec;
    }));
    notify('success', 'Transfer approved! Cold-chain transit dispatched and inventory ledger updated.');
  };

  // 4. Reject Redistribution Recommendation
  const handleRejectRecommendation = (id: string) => {
    setRecommendations(prev => prev.map(rec => {
      if (rec.id === id) {
        return {
          ...rec,
          status: 'Rejected',
          createdAt: `Rejected ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} by Admin`
        };
      }
      return rec;
    }));
    notify('info', 'Transfer recommendation marked as Rejected.');
  };

  // 5. Toggle Anomaly Verification
  const handleVerifyAnomaly = () => {
    if (!isAnomalyVerified) {
      setIsAnomalyVerified(true);
      setOrsAnomalyStatus('Verified: Transmission Lag');
      notify('success', 'ORS anomaly verified as reporting transmission lag. Emergency re-order suppressed.');
    } else {
      setIsAnomalyVerified(false);
      setOrsAnomalyStatus('Requires verification');
      notify('info', 'ORS telemetry reset to pending verification state.');
    }
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

        {/* Action Buttons with Proper States */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button 
            onClick={handleExportPDF} 
            disabled={pdfLoading || excelLoading}
            className="font-semibold text-xs bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 shadow-xs flex items-center gap-2 min-w-[155px] justify-center"
          >
            {pdfLoading ? (
              <>
                <Loader2 size={15} className="animate-spin text-blue-600" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileText size={15} className="text-rose-600" />
                <span>Export PDF Report</span>
              </>
            )}
          </Button>

          <Button 
            onClick={handleExportExcel} 
            disabled={pdfLoading || excelLoading}
            className="font-semibold text-xs bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 shadow-xs flex items-center gap-2 min-w-[155px] justify-center"
          >
            {excelLoading ? (
              <>
                <Loader2 size={15} className="animate-spin text-emerald-600" />
                <span>Generating Excel...</span>
              </>
            ) : (
              <>
                <FileSpreadsheet size={15} className="text-emerald-600" />
                <span>Export Excel / CSV</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Notification Banner */}
      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
            : statusMessage.type === 'error'
            ? 'bg-rose-50 text-rose-900 border-rose-200'
            : 'bg-blue-50 text-blue-900 border-blue-200'
        }`}>
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' && <CheckCircle2 size={16} className="text-emerald-600" />}
            {statusMessage.type === 'error' && <XCircle size={16} className="text-rose-600" />}
            {statusMessage.type === 'info' && <Info size={16} className="text-blue-600" />}
            <span>{statusMessage.text}</span>
          </div>
          <button 
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Report Types Tabs (Section 5) */}
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
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all border cursor-pointer ${
                isActive 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Medicine Inventory Report */}
      {activeReport === 'inventory' && (
        <Card title="Medicine Inventory Report (Current Physical & Projected Tally)" className="border-slate-200 shadow-sm">
          <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
            <span>Verified Dispensary Ledger • Formula: Current = Opening + Received - Issued</span>
            <span className="font-semibold text-slate-700">Displaying {MOCK_INVENTORY.length} Items</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3">Medicine</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Facility</th>
                  <th className="py-3 px-3 text-right">Opening</th>
                  <th className="py-3 px-3 text-right">Received (+)</th>
                  <th className="py-3 px-3 text-right">Issued (-)</th>
                  <th className="py-3 px-3 text-right">Current Stock</th>
                  <th className="py-3 px-3 text-right">Daily Usage</th>
                  <th className="py-3 px-3 text-right">Days Remaining</th>
                  <th className="py-3 px-3 text-center">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_INVENTORY.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{item.medicineName}</td>
                    <td className="py-3 px-3 text-slate-600">{item.category}</td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{item.facilityName}</td>
                    <td className="py-3 px-3 text-right text-slate-600">{item.openingStock}</td>
                    <td className="py-3 px-3 text-right text-emerald-600 font-medium">+{item.receivedStock}</td>
                    <td className="py-3 px-3 text-right text-rose-600 font-medium">-{item.issuedStock}</td>
                    <td className="py-3 px-3 text-right font-extrabold text-slate-900">{item.currentStock} {item.unit}</td>
                    <td className="py-3 px-3 text-right text-slate-600">{item.dailyUsage}/day</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800">{item.daysRemaining} days</td>
                    <td className="py-3 px-3 text-center"><RiskBadge risk={item.risk} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 2: Stockout Risk Report */}
      {activeReport === 'stockout' && (
        <Card title="Stockout Risk & Depletion Forecast Report" className="border-slate-200 shadow-sm">
          <div className="space-y-4">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-sm">4 Medicines Identified at Risk of Imminent Stockout</p>
                <p className="mt-0.5 text-rose-700">Priority 1: Insulin at Hospital A (9 days remaining at current 46 units/day burn velocity).</p>
              </div>
              <Button 
                onClick={handleExportPDF} 
                disabled={pdfLoading}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-xs"
              >
                {pdfLoading ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                <span>Export Executive Risk Memo</span>
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
                    <th className="py-3 px-3">Risk</th>
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
                      <td className="py-3 px-3"><RiskBadge risk={p.riskLevel} /></td>
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

      {/* Tab 3: Consumption Report */}
      {activeReport === 'consumption' && (
        <Card title="Historical Consumption & Demand Surge Telemetry" className="border-slate-200 shadow-sm">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <p className="font-bold text-slate-800 text-sm">Dispensary Consumption Velocity Analysis</p>
                <p className="text-slate-600 mt-0.5">Tracking outpatient consumption velocity vs historical baselines.</p>
              </div>

              {/* Time Window Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConsumptionWindow('7d')}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition-all ${
                    consumptionWindow === '7d' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  7-Day Telemetry
                </button>
                <button
                  onClick={() => setConsumptionWindow('30d')}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition-all ${
                    consumptionWindow === '30d' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  30-Day Outlook
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">Insulin (Human 100IU/ml)</h4>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full font-bold text-[10px]">+15% Demand Surge</span>
                </div>
                <p className="text-xs text-slate-600">
                  Daily consumption increased from 40 units/day (Mon) to 50 units/day (Fri). Weekly total: {consumptionWindow === '7d' ? '322 units' : '1,380 units'}.
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Burn Rate: <strong className="text-slate-800">46 units/day</strong></span>
                  <span>Safety Buffer: <strong className="text-rose-600">9 Days Left</strong></span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">ORS (Oral Rehydration Salts)</h4>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px]">Zero-Burn Pattern</span>
                </div>
                <p className="text-xs text-slate-600">
                  Mon (45), Tue (48), Wed (42), Thu (0), Fri (0). Telemetry indicates possible terminal outage rather than drop in need.
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Active Average: <strong className="text-slate-800">100 units/day</strong></span>
                  <span>Verification: <strong className="text-amber-600">Pending Review</strong></span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Redistribution Report (Section 1, 7, 8, 11) */}
      {activeReport === 'redistribution' && (
        <Card title="Inter-Facility Redistribution Audit Ledger" className="border-slate-200 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-blue-600 shrink-0" />
                <span>All inter-hospital rebalancing requests require human administrator authorization before cold-chain dispatch.</span>
              </div>
              <span className="font-bold text-blue-800">{recommendations.length} Active Records</span>
            </div>

            <div className="space-y-3">
              {recommendations.map((r) => {
                const isApproved = r.status.toLowerCase().includes('approved');
                const isRejected = r.status.toLowerCase().includes('rejected');
                return (
                  <div key={r.id} className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 text-xs transition-all hover:bg-slate-50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-black text-slate-900 text-sm">
                            {r.medicineName} — <span className="text-blue-600">{r.recommendedQuantity} units</span>
                          </p>
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            isApproved 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : isRejected
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            {r.status}
                          </span>
                        </div>
                        <p className="text-slate-600 font-semibold mt-1">
                          Route: <span className="text-slate-900 font-bold">{r.sourceFacility}</span> &rarr; <span className="text-slate-900 font-bold">{r.destinationFacility}</span>
                        </p>
                        <p className="text-slate-600 mt-1 italic leading-relaxed max-w-3xl">
                          {r.reason}
                        </p>
                      </div>

                      {/* Interactive Buttons (Approve, Reject, View Details) */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setSelectedRecDetails(r)}
                          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
                          title="View clinical justification and telemetry details"
                        >
                          <Eye size={13} className="text-slate-500" />
                          <span>Details</span>
                        </button>

                        {!isApproved && (
                          <button
                            onClick={() => handleApproveRecommendation(r.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
                            title="Approve this medicine transfer"
                          >
                            <Check size={13} />
                            <span>Approve</span>
                          </button>
                        )}

                        {!isRejected && (
                          <button
                            onClick={() => handleRejectRecommendation(r.id)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
                            title="Reject this recommendation"
                          >
                            <X size={13} />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Source Available Surplus: <strong className="text-slate-800">{r.sourceProjectedExcess} units</strong></span>
                      <span>Target Remaining Runway: <strong className="text-rose-600">{r.destinationDaysRemaining} days</strong></span>
                      <span className="italic">{r.createdAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Tab 5: Anomaly & Data Quality Report */}
      {activeReport === 'anomaly' && (
        <Card title="Dispensary Telemetry & Anomaly Report" className="border-slate-200 shadow-sm">
          <div className="space-y-4">
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3 text-xs text-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="font-bold text-amber-950 flex items-center gap-2 text-sm">
                  <AlertTriangle size={18} className="text-amber-600 shrink-0" />
                  <span>ORS Telemetry Pattern Flagged: 2 Consecutive Zero-Consumption Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    isAnomalyVerified 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-amber-200/80 text-amber-900 border border-amber-300'
                  }`}>
                    {orsAnomalyStatus}
                  </span>
                  <Button 
                    onClick={handleVerifyAnomaly}
                    className={`text-xs font-bold py-1.5 px-3 rounded-lg shadow-xs ${
                      isAnomalyVerified ? 'bg-slate-200 text-slate-800 hover:bg-slate-300' : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    {isAnomalyVerified ? 'Reset Verification' : 'Verify as Data Lag'}
                  </Button>
                </div>
              </div>

              <p className="leading-relaxed">
                Dispensary terminal recorded: Monday (45 units), Tuesday (48 units), Wednesday (42 units), Thursday (0 units), Friday (0 units).
              </p>

              <div className="p-3 bg-white/80 rounded-lg border border-amber-200 text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Clinical Evaluation:</p>
                <p>
                  Zero consumption on peak clinic days typically indicates network transmission dropouts or shift-change documentation backlog rather than zero patients requiring hydration salts.
                </p>
                <p className="text-emerald-700 font-semibold pt-1">
                  &bull; Action: Telemetry verification suppresses expensive false-positive emergency orders while staff reconciles physical paper log.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Details Modal */}
      {selectedRecDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ArrowLeftRight size={18} className="text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Redistribution Audit Details</h3>
              </div>
              <button 
                onClick={() => setSelectedRecDetails(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px] block">Medicine</span>
                  <strong className="text-slate-900 text-sm">{selectedRecDetails.medicineName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px] block">Recommended Transfer</span>
                  <strong className="text-blue-600 text-sm">{selectedRecDetails.recommendedQuantity} units</strong>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px] block">Source (Donor)</span>
                  <strong className="text-slate-800">{selectedRecDetails.sourceFacility}</strong>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px] block">Destination (Deficit)</span>
                  <strong className="text-slate-800">{selectedRecDetails.destinationFacility}</strong>
                </div>
              </div>

              <div>
                <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-1">Reason / Clinical Context</span>
                <p className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-slate-700 leading-relaxed">
                  {selectedRecDetails.reason}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Source Surplus Buffer</span>
                  <span className="font-bold text-emerald-700">+{selectedRecDetails.sourceProjectedExcess} units excess</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Destination Runway</span>
                  <span className="font-bold text-rose-600">{selectedRecDetails.destinationDaysRemaining} days remaining</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button 
                variant="outline"
                onClick={() => setSelectedRecDetails(null)}
                className="text-xs font-semibold"
              >
                Close
              </Button>
              {selectedRecDetails.status.toLowerCase().includes('pending') && (
                <Button 
                  onClick={() => {
                    handleApproveRecommendation(selectedRecDetails.id);
                    setSelectedRecDetails(null);
                  }}
                  className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Check size={14} /> Approve & Dispatch
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};