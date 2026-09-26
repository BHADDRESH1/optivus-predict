import React, { useState } from 'react';
import { X, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Button } from './ui';

interface ScheduleStockoutActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule?: (data: any) => void;
  equipment?: string;
  department?: string;
  riskLevel?: string;
  recommendation?: string;
  predictedFailure?: string;
}

export const ScheduleActionModal: React.FC<ScheduleActionModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  equipment: medicineName = 'Insulin (Human 100IU/ml)',
  recommendation = 'Redistribute 100 units from Hospital B or expedite supplier batch',
}) => {
  const [formData, setFormData] = useState({
    scheduledDate: new Date().toISOString().split('T')[0],
    actionType: 'Inter-Hospital Redistribution',
    priority: 'High',
    notes: recommendation,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-800">Schedule Stockout Prevention Action</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
          <p className="font-bold">{medicineName}</p>
          <p className="mt-1">{recommendation}</p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          if (onSchedule) onSchedule(formData);
          onClose();
        }} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700">Action Type</label>
            <select
              value={formData.actionType}
              onChange={(e) => setFormData({ ...formData, actionType: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-white mt-1"
            >
              <option value="Inter-Hospital Redistribution">Inter-Hospital Redistribution Transfer</option>
              <option value="Supplier Emergency Order">Supplier Emergency Order Expedite</option>
              <option value="Dispensary Telemetry Verification">Dispensary Telemetry Verification</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700">Execution Target Date</label>
            <input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg mt-1"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit">Confirm Action</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
