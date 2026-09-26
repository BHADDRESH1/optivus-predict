import React, { useState } from 'react';
import { Redistribution } from './Redistribution';
import { ConsumptionAnalytics } from './ConsumptionAnalytics';
import { Card, Button, RiskBadge } from '../components/ui';
import { MOCK_INVENTORY, MOCK_PREDICTIONS } from '../constants';
import { Calendar, Truck, Clock, CheckCircle2, AlertTriangle, Pill, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MaintenanceTasks: React.FC = () => {
  return <Redistribution />;
};

export const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const schedule = [
    { date: 'Monday, Sep 28', time: '09:00 AM', event: 'Scheduled Delivery: 500 Paracetamol', facility: 'Hospital A', supplier: 'Tamil Nadu Medical Services Corp', status: 'Confirmed' },
    { date: 'Wednesday, Sep 30', time: '11:30 AM', event: 'Approved Redistribution: 100 units Insulin Transfer', facility: 'Hospital B → Hospital A', supplier: 'Cold-Chain Medical Van', status: 'Pending Transfer' },
    { date: 'Friday, Oct 02', time: '02:00 PM', event: 'Emergency Restock: 20 units Antivenom', facility: 'Hospital A', supplier: 'Central Medical Stores', status: 'Scheduled' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Medicine Delivery & Transfer Schedule</h1>
          <p className="text-slate-500 text-sm mt-1">Calendar of verified dispensary replenishment shipments and inter-hospital transfers.</p>
        </div>
        <Button onClick={() => navigate('/admin/redistribution')}>
          Manage Redistribution
        </Button>
      </div>

      <div className="space-y-3">
        {schedule.map((item, idx) => (
          <Card key={idx} className="p-4 border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.event}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Route/Node: {item.facility} • Carrier: {item.supplier}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right text-xs">
                  <p className="font-semibold text-slate-700">{item.date}</p>
                  <p className="text-slate-400">{item.time}</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  {item.status}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const AiVerificationPage: React.FC = () => {
  return <ConsumptionAnalytics />;
};

export default MaintenanceTasks;