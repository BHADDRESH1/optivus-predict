import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Button } from './ui';

interface ResolveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: (notes: string) => void;
  equipment?: string;
  issue?: string;
}

export const ResolveModal: React.FC<ResolveModalProps> = ({
  isOpen,
  onClose,
  onResolve,
  equipment: medicine = 'Insulin (Human 100IU/ml)',
  issue = 'Imminent Stockout Risk',
}) => {
  const [resolutionNotes, setResolutionNotes] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-800">Resolve Medicine Alert</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
          <p className="font-bold">{medicine}</p>
          <p className="mt-0.5">{issue}</p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onResolve(resolutionNotes || 'Replenished via inter-facility transfer.');
          onClose();
        }} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700">Resolution Action Taken</label>
            <textarea
              required
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="e.g. Received 100 units from Hospital B redistribution transfer. Stock extended to 18 days."
              className="w-full px-3 py-2 border rounded-lg mt-1"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              Confirm Resolution
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
