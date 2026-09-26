import React, { useState } from 'react';
import { Card, Button, RiskBadge } from '../components/ui';
import { MOCK_RECOMMENDATIONS } from '../constants';
import { RedistributionRecommendation } from '../types';
import { 
  ArrowLeftRight, 
  Building2, 
  Pill, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Truck, 
  Check, 
  X,
  FileCheck,
  Info,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Redistribution: React.FC = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<RedistributionRecommendation[]>(MOCK_RECOMMENDATIONS);
  const [selectedRec, setSelectedRec] = useState<RedistributionRecommendation | null>(null);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [transferNotes, setTransferNotes] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const handleOpenReview = (rec: RedistributionRecommendation) => {
    setSelectedRec(rec);
    setApprovalModalOpen(true);
    setActionSuccessMessage(null);
  };

  const handleApprove = () => {
    if (!selectedRec) return;
    setRecommendations(prev => prev.map(item => {
      if (item.id === selectedRec.id) {
        return {
          ...item,
          status: 'Approved',
          approvedBy: 'Admin (You)'
        };
      }
      return item;
    }));
    setActionSuccessMessage(`Successfully approved transfer order ${selectedRec.id}: 100 units of ${selectedRec.medicineName} scheduled from ${selectedRec.sourceFacility} to ${selectedRec.destinationFacility}.`);
    setApprovalModalOpen(false);
  };

  const handleReject = () => {
    if (!selectedRec) return;
    setRecommendations(prev => prev.map(item => {
      if (item.id === selectedRec.id) {
        return {
          ...item,
          status: 'Rejected',
          approvedBy: 'Rejected by Admin'
        };
      }
      return item;
    }));
    setActionSuccessMessage(`Transfer recommendation ${selectedRec.id} rejected by administrator.`);
    setApprovalModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Smart Stock Redistribution</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <ShieldCheck size={13} /> Zero-Waste Supply Balancing
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Algorithmically match healthcare facilities facing projected stockouts with facilities holding verified excess inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-600 shrink-0" />
            <span>Administrator approval required for all transfers</span>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 size={18} className="text-emerald-600" />
            {actionSuccessMessage}
          </div>
          <button onClick={() => setActionSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Primary Two-Facility Comparison Card (Section 11) */}
      <Card 
        title="Active Two-Facility Redistribution Match (Insulin)" 
        action={
          <span className="text-xs font-bold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">
            Match Score: 98%
          </span>
        }
        className="border-blue-200 shadow-md overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Facility A: Critical Shortage */}
          <div className="p-5 rounded-2xl bg-rose-50/70 border-2 border-rose-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="text-rose-600" size={20} />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">HOSPITAL A</h3>
                  <p className="text-xs text-rose-700 font-medium">Requesting Facility (Regional Hub)</p>
                </div>
              </div>
              <RiskBadge risk="HIGH" />
            </div>

            <div className="space-y-2 text-sm divide-y divide-rose-100 text-slate-700">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Medicine:</span>
                <span className="font-bold text-slate-900">Insulin (Human 100IU/ml)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Current Stock:</span>
                <span className="font-extrabold text-slate-900">100 units (Critical Buffer)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Daily Usage:</span>
                <span className="font-semibold text-slate-800">25 units/day</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Predicted Stockout:</span>
                <span className="font-black text-rose-600 text-base">4 days remaining</span>
              </div>
            </div>

            <div className="p-2.5 bg-rose-100/70 rounded-lg text-xs text-rose-900 font-semibold flex items-center gap-2">
              <AlertTriangle size={14} className="text-rose-600 shrink-0" />
              Predicted stockout &lt; 5 day emergency threshold
            </div>
          </div>

          {/* Facility B: Surplus / Available Excess */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="text-emerald-700" size={20} />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">HOSPITAL B</h3>
                  <p className="text-xs text-emerald-700 font-medium">Donor Facility (Surplus Facility)</p>
                </div>
              </div>
              <RiskBadge risk="LOW" />
            </div>

            <div className="space-y-2 text-sm divide-y divide-emerald-100 text-slate-700">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Medicine:</span>
                <span className="font-bold text-slate-900">Insulin (Human 100IU/ml)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Current Stock:</span>
                <span className="font-extrabold text-slate-900">500 units</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Projected Requirement:</span>
                <span className="font-semibold text-slate-800">300 units (Next 30 days)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Projected Excess:</span>
                <span className="font-black text-emerald-700 text-base">200 units surplus</span>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-100/70 rounded-lg text-xs text-emerald-900 font-semibold flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-700 shrink-0" />
              Exceeds local 30-day safety reserve by 200 units
            </div>
          </div>
        </div>

        {/* Redistribution Opportunity Banner & Action */}
        <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
                <span className="text-xs font-extrabold text-blue-900 uppercase tracking-wider">
                  Redistribution Opportunity Detected
                </span>
              </div>
              <p className="text-base font-bold text-slate-900 mt-1">
                Consider transferring 100 units of Insulin from Hospital B to Hospital A.
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Reason: Hospital A predicted to run out in 4 days. Transfer extends buffer to 8+ days without putting Hospital B at risk.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <Button 
                onClick={() => handleOpenReview(recommendations[0])}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 shadow-md text-sm"
              >
                Review Recommendation
              </Button>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-blue-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <ShieldCheck size={14} className="text-blue-600" />
              Automated safety verification passed: Hospital B maintains &gt; 30 days reserve after transfer.
            </span>
            <span className="font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
              Administrator approval required
            </span>
          </div>
        </div>
      </Card>

      {/* Redistribution Recommendations Ledger Table */}
      <Card title="Pending & Completed Redistribution Orders" className="border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Transfer Route</th>
                <th className="py-3 px-4">Medicine</th>
                <th className="py-3 px-4">Suggested Transfer</th>
                <th className="py-3 px-4">Trigger / Rationale</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recommendations.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{rec.sourceFacility}</span>
                      <ArrowLeftRight size={13} className="text-blue-600" />
                      <span>{rec.destinationFacility}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Order ID: {rec.id}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{rec.medicineName}</div>
                  </td>
                  <td className="py-3.5 px-4 font-black text-blue-700 text-base">
                    {rec.recommendedQuantity} units
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 max-w-sm">
                    {rec.reason}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
                      rec.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : rec.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {rec.status === 'Approved' && <Check size={12} />}
                      {rec.status === 'Rejected' && <X size={12} />}
                      {rec.status === 'Pending Approval' && <Clock size={12} />}
                      {rec.status}
                    </span>
                    {rec.approvedBy && (
                      <div className="text-[10px] text-slate-400 mt-0.5">{rec.approvedBy}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {rec.status === 'Pending Approval' ? (
                      <button
                        onClick={() => handleOpenReview(rec)}
                        className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                      >
                        Review
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Archived</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Redistribution Algorithmic Rule Engine (Section 12) */}
      <Card title="Redistribution Logic & Rule Engine (Sustain-a-thon Prototype)" className="border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Shortage Condition (Facility A)
            </div>
            <p className="text-slate-600">
              <code>Predicted Stockout &lt; 10 Days</code> AND <code>Current Stock &lt; Safety Buffer</code>
            </p>
            <p className="text-slate-400 text-[11px] pt-1">
              Triggers regional procurement search across all connected satellite dispensaries.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Surplus Condition (Facility B)
            </div>
            <p className="text-slate-600">
              <code>Projected Stock &gt; 30 Days Demand</code> AND <code>Expiry Buffer &gt; 90 Days</code>
            </p>
            <p className="text-slate-400 text-[11px] pt-1">
              Ensures the donor facility does not face shortage after fulfilling transfer.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Optimization & Governance
            </div>
            <p className="text-slate-600">
              <code>Transfer Quantity = min(Excess, Demand Deficit)</code>
            </p>
            <p className="text-slate-400 text-[11px] pt-1 font-semibold text-blue-700">
              Human-in-the-loop: Never auto-transfers without explicit administrator authorization.
            </p>
          </div>
        </div>
      </Card>

      {/* Administrator Review Modal (Section 11) */}
      {approvalModalOpen && selectedRec && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-blue-600 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Review Redistribution Order</h3>
                <p className="text-xs text-blue-100">Order ID: {selectedRec.id}</p>
              </div>
              <button 
                onClick={() => setApprovalModalOpen(false)}
                className="text-blue-100 hover:text-white p-1 rounded-md"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
                <p className="text-xs font-bold text-blue-900 uppercase">Recommended Stock Movement</p>
                <div className="flex items-center gap-3 mt-2 text-base font-extrabold text-slate-900">
                  <span className="bg-white px-3 py-1 rounded-lg border border-slate-200">{selectedRec.sourceFacility}</span>
                  <ArrowLeftRight size={18} className="text-blue-600 shrink-0" />
                  <span className="bg-white px-3 py-1 rounded-lg border border-slate-200">{selectedRec.destinationFacility}</span>
                </div>
                <p className="text-sm font-bold text-blue-700 mt-2">
                  Quantity: {selectedRec.recommendedQuantity} units of {selectedRec.medicineName}
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p><strong className="text-slate-800">Reason:</strong> {selectedRec.reason}</p>
                <p><strong className="text-slate-800">Cold Chain Compliance:</strong> Verified refrigerated transport route (&lt; 45 mins)</p>
                <p><strong className="text-slate-800">Governance:</strong> Requires authorized system admin signature</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Optional Dispatch Notes / Driver Instructions:
                </label>
                <textarea
                  rows={2}
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  placeholder="e.g. Schedule for urgent dispatch with morning courier..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-semibold flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                <span>The system will not transfer stock without your confirmation.</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleReject}
                  className="text-rose-600 hover:bg-rose-50 border-rose-200 font-bold"
                >
                  <XCircle size={16} />
                  Reject Transfer
                </Button>
                <Button 
                  type="button" 
                  onClick={handleApprove}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  <CheckCircle2 size={16} />
                  Approve Transfer (100 units)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
