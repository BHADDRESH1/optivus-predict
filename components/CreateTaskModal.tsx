import React, { useState } from 'react';
import { X, Calendar, Building2, Pill } from 'lucide-react';
import { Button } from './ui';
import { MOCK_MEDICINES, MOCK_FACILITIES } from '../constants';

interface CreateTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (data: any) => void;
  technicians?: string[];
}

export const CreateTaskModal: React.FC<CreateTransferModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    medicineName: 'Insulin (Human 100IU/ml)',
    sourceFacility: 'Hospital B',
    destinationFacility: 'Hospital A',
    quantity: 100,
    dueDate: '2026-09-30',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCreate) {
      onCreate(formData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Schedule Stock Transfer</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700">Medicine</label>
            <select
              value={formData.medicineName}
              onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
            >
              {MOCK_MEDICINES.map(m => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Source (Donor)</label>
              <select
                value={formData.sourceFacility}
                onChange={(e) => setFormData({ ...formData, sourceFacility: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
              >
                {MOCK_FACILITIES.map(f => (
                  <option key={f.id} value={f.name}>{f.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Destination</label>
              <select
                value={formData.destinationFacility}
                onChange={(e) => setFormData({ ...formData, destinationFacility: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
              >
                {MOCK_FACILITIES.map(f => (
                  <option key={f.id} value={f.name}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Transfer Quantity (Units)</label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit">Schedule Order</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
