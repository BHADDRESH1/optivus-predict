import React, { useState } from 'react';
import { X, AlertTriangle, ArrowUp } from 'lucide-react';
import { Button } from './ui';

interface EscalateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEscalate: (level: string, assignee: string, notes: string) => void;
  currentLevel?: string;
  currentAssignee?: string;
  equipment?: string;
}

export const EscalateModal: React.FC<EscalateModalProps> = ({
  isOpen,
  onClose,
  onEscalate,
  currentLevel = 'Dispensary Pharmacist',
  currentAssignee = 'Priya Rajendran',
  equipment: medicine = 'Insulin (Human 100IU/ml)',
}) => {
  const [level, setLevel] = useState<string>('Pharmacy Supervisor');
  const [assignee, setAssignee] = useState<string>('Dr. Suresh Kumar (Admin)');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-800">Escalate Stockout Alert</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
          <p className="font-bold">{medicine}</p>
          <p className="mt-0.5">Escalate urgent procurement or regional stock redistribution order.</p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onEscalate(level, assignee, notes);
          onClose();
        }} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700">Escalation Tier</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white mt-1"
            >
              <option value="Pharmacy Supervisor">Pharmacy Supervisor</option>
              <option value="Hospital Head">Hospital Head / Medical Director</option>
              <option value="Regional Supply Officer">Regional Supply Officer (TNMSC)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700">Assignee</label>
            <input
              type="text"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700">Justification / Clinical Impact</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Critical ICU requirement in 4 days..."
              className="w-full px-3 py-2 border rounded-lg mt-1"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit">Escalate Alert</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
