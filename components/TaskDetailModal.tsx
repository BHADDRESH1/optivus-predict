import React from 'react';
import { X, Calendar, Pill, Building2, CheckCircle, Clock } from 'lucide-react';
import { Button } from './ui';

interface TransferDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: any;
}

export const TaskDetailModal: React.FC<TransferDetailModalProps> = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-800">Transfer Order Details</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="p-3 bg-blue-50 rounded-xl space-y-2 text-xs">
          <p className="font-bold text-blue-900 text-sm">{task.medicineName || task.equipmentName || 'Insulin'}</p>
          <p className="text-slate-600">Route: Hospital B &rarr; Hospital A</p>
          <p className="text-slate-600">Recommended Transfer: 100 units</p>
          <p className="text-slate-600">Status: {task.status || 'Scheduled'}</p>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};
