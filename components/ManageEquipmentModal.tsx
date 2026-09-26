import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui';
import { InventoryItem, RiskLevel } from '../types';

interface ManageMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: InventoryItem | null;
  onSave: (med: InventoryItem) => void;
}

export const ManageEquipmentModal: React.FC<any> = ({
  isOpen,
  onClose,
  medicine,
  onSave
}) => {
  const [formData, setFormData] = useState({
    medicineName: '',
    category: '',
    currentStock: 0,
    dailyUsage: 0,
    incomingStock: 0,
    reorderLevel: 0
  });

  useEffect(() => {
    if (medicine) {
      setFormData({
        medicineName: medicine.medicineName || '',
        category: medicine.category || '',
        currentStock: medicine.currentStock || 0,
        dailyUsage: medicine.dailyUsage || 0,
        incomingStock: medicine.incomingStock || 0,
        reorderLevel: medicine.reorderLevel || 0
      });
    }
  }, [medicine]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-slate-800">Edit Medicine Stock Parameters</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (medicine) {
            onSave({ ...medicine, ...formData });
          }
          onClose();
        }} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700">Medicine Name</label>
            <input 
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={formData.medicineName}
              onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">Current Stock</label>
            <input 
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={formData.currentStock}
              onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">Daily Consumption</label>
            <input 
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={formData.dailyUsage}
              onChange={(e) => setFormData({ ...formData, dailyUsage: Number(e.target.value) })}
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
