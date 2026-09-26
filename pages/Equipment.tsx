import React, { useState } from 'react';
import { MedicineInventory } from './MedicineInventory';
import { Card, Button, RiskBadge } from '../components/ui';
import { MOCK_INVENTORY, MOCK_MEDICINES } from '../constants';
import { useNavigate, useParams } from 'react-router-dom';
import { Pill, ArrowLeft, Building2, Calendar, TrendingDown, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

export const EquipmentList: React.FC = () => {
  return <MedicineInventory />;
};

export const EquipmentRegistration: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Add Medicine to Central Inventory</h2>
          <p className="text-slate-500 text-sm">Register new therapeutic batch into the regional network.</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin/medicine-inventory')}>
          <ArrowLeft size={16} /> Back to Inventory
        </Button>
      </div>

      <Card className="p-6">
        <p className="text-sm text-slate-600">
          To add and calculate medicine stock, use the interactive <strong>+ Add Medicine</strong> action on the Medicine Inventory page.
        </p>
        <div className="mt-4">
          <Button onClick={() => navigate('/admin/medicine-inventory')}>
            Go to Medicine Inventory
          </Button>
        </div>
      </Card>
    </div>
  );
};

export const EquipmentDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const med = MOCK_INVENTORY.find(item => item.id === id || item.medicineId === id) || MOCK_INVENTORY[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/admin/medicine-inventory')} className="p-2 h-10 w-10">
            <ArrowLeft size={18} />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">{med.medicineName}</h2>
              <RiskBadge risk={med.risk} />
            </div>
            <p className="text-slate-500 text-xs font-mono">{med.medicineId} • {med.category}</p>
          </div>
        </div>

        <Button onClick={() => navigate('/admin/stockout-prediction')}>
          <TrendingDown size={16} /> View Stockout Forecast
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs text-slate-400 font-semibold uppercase">Current Verified Stock</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{med.currentStock} {med.unit}</p>
          <p className="text-xs text-slate-500 mt-1">Facility: {med.facilityName}</p>
        </Card>

        <Card className="p-4">
          <p className="text-xs text-slate-400 font-semibold uppercase">Daily Consumption Rate</p>
          <p className="text-3xl font-extrabold text-blue-600 mt-1">{med.dailyUsage} {med.unit}/day</p>
          <p className="text-xs text-slate-500 mt-1">Historical moving average</p>
        </Card>

        <Card className="p-4">
          <p className="text-xs text-slate-400 font-semibold uppercase">Estimated Days Remaining</p>
          <p className={`text-3xl font-extrabold mt-1 ${med.risk === 'HIGH' ? 'text-rose-600' : 'text-slate-900'}`}>
            {med.daysRemaining} days
          </p>
          <p className="text-xs text-slate-500 mt-1">Reorder Level: {med.reorderLevel} {med.unit}</p>
        </Card>
      </div>
    </div>
  );
};

export default EquipmentList;