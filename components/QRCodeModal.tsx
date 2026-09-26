import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useReactToPrint } from 'react-to-print';
import { X, Printer, Download, Pill } from 'lucide-react';
import { Button } from './ui';
import { InventoryItem } from '../types';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: InventoryItem | any | null;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, medicine }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Medicine_QR_${medicine?.medicineId || medicine?.id || 'Medicine'}`,
  });

  if (!isOpen || !medicine) return null;

  const qrData = JSON.stringify({
    id: medicine.id || medicine.medicineId,
    name: medicine.medicineName || medicine.name,
    category: medicine.category,
    facility: medicine.facilityName,
    currentStock: medicine.currentStock
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200">
        <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Pill size={18} />
            <h3 className="font-bold text-sm">Medicine Batch QR Label</h3>
          </div>
          <button onClick={onClose} className="text-blue-100 hover:text-white"><X size={18} /></button>
        </div>

        <div ref={printRef} className="p-6 text-center space-y-4">
          <div className="inline-block p-4 bg-white rounded-xl border-2 border-slate-200 shadow-xs">
            <QRCodeSVG value={qrData} size={180} level="H" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">{medicine.medicineName || medicine.name}</h4>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{medicine.medicineId || medicine.id} • {medicine.facilityName || 'Hospital A'}</p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
          <Button variant="outline" className="flex-1 text-xs" onClick={onClose}>Close</Button>
          <Button className="flex-1 text-xs" onClick={() => handlePrint()}>
            <Printer size={14} /> Print Label
          </Button>
        </div>
      </div>
    </div>
  );
};
