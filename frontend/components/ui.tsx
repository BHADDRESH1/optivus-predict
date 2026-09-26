import React, { useEffect, useState } from 'react';
import { Status, AiStatus } from '../types';
import { Check, Clock, AlertTriangle, AlertCircle, Loader2, Ban, QrCode, X, Camera } from 'lucide-react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; action?: React.ReactNode }> = ({ children, className = '', title, action }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {(title || action) && (
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        {title && <h3 className="font-semibold text-slate-800">{title}</h3>}
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'danger' }> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
    secondary: "bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-500 shadow-sm",
    outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const StatusBadge: React.FC<{ status: Status | string }> = ({ status }) => {
  const styles: Record<string, string> = {
    [Status.IN_STOCK]: "bg-emerald-100 text-emerald-800 border-emerald-200",
    [Status.LOW_STOCK]: "bg-amber-100 text-amber-800 border-amber-200",
    [Status.CRITICAL]: "bg-rose-100 text-rose-800 border-rose-200",
    [Status.SURPLUS]: "bg-blue-100 text-blue-800 border-blue-200",
    [Status.REORDERED]: "bg-purple-100 text-purple-800 border-purple-200",
    [Status.COMPLETED]: "bg-green-100 text-green-700 border-green-200",
    [Status.PENDING]: "bg-yellow-100 text-yellow-700 border-yellow-200",
    [Status.ACTIVE]: "bg-green-100 text-green-700 border-green-200",
    [Status.INACTIVE]: "bg-slate-100 text-slate-500 border-slate-200",
    'Active': "bg-green-100 text-green-700 border-green-200",
  };

  const icons: Record<string, React.ElementType> = {
    [Status.IN_STOCK]: Check,
    [Status.LOW_STOCK]: AlertTriangle,
    [Status.CRITICAL]: AlertCircle,
    [Status.SURPLUS]: Check,
    [Status.REORDERED]: Clock,
    [Status.COMPLETED]: Check,
    [Status.PENDING]: Clock,
    [Status.ACTIVE]: Check,
    [Status.INACTIVE]: Ban,
  };

  const Icon = icons[status] || Clock;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      <Icon size={12} />
      {status}
    </span>
  );
};

export const RiskBadge: React.FC<{ risk: 'HIGH' | 'MEDIUM' | 'LOW' | string; className?: string }> = ({ risk, className = '' }) => {
  const upper = (risk || '').toUpperCase();
  if (upper === 'HIGH') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200 ${className}`}>
        <AlertCircle size={12} className="text-rose-600" />
        HIGH
      </span>
    );
  }
  if (upper === 'MEDIUM') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 ${className}`}>
        <AlertTriangle size={12} className="text-amber-600" />
        MEDIUM
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 ${className}`}>
      <Check size={12} className="text-emerald-600" />
      LOW
    </span>
  );
};

export const AiStatusBadge: React.FC<{ status: AiStatus | string }> = ({ status }) => {
  const styles: Record<string, string> = {
    [AiStatus.VERIFIED]: "bg-emerald-50 text-emerald-700 border-emerald-200",
    [AiStatus.REJECTED]: "bg-rose-50 text-rose-700 border-rose-200",
    [AiStatus.PROCESSING]: "bg-blue-50 text-blue-700 border-blue-200 animate-pulse",
    [AiStatus.NEEDS_REVIEW]: "bg-amber-50 text-amber-700 border-amber-200",
    [AiStatus.ANOMALY]: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${styles[status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
      {status === AiStatus.PROCESSING && <Loader2 size={12} className="animate-spin" />}
      {status === AiStatus.VERIFIED && <Check size={12} />}
      {status}
    </span>
  );
};

export const QrScannerModal: React.FC<{ isOpen: boolean; onClose: () => void; onScan: (data: string) => void }> = ({ isOpen, onClose, onScan }) => {
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'found'>('idle');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let successTimer: ReturnType<typeof setTimeout>;

    if (isOpen) {
      setScanStatus('scanning');
      // Simulate finding a code after 2 seconds
      timer = setTimeout(() => {
        setScanStatus('found');
        successTimer = setTimeout(() => {
          onScan('MED-101'); // Mock finding Insulin batch
          setScanStatus('idle');
        }, 800);
      }, 2000);
    } else {
      setScanStatus('idle');
    }
    return () => {
      clearTimeout(timer);
      clearTimeout(successTimer);
    };
  }, [isOpen, onScan]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-black rounded-2xl overflow-hidden relative border border-slate-700 shadow-2xl">
        <div className="absolute top-4 right-4 z-10">
          <button onClick={onClose} className="text-white bg-white/20 p-2 rounded-full hover:bg-white/30 backdrop-blur-sm transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="aspect-[3/4] relative bg-slate-900 flex items-center justify-center">
          {/* Camera Viewfinder UI */}
          <div className="absolute inset-0 opacity-50">
            <div className="w-full h-full border-2 border-slate-800 grid grid-cols-3 grid-rows-3">
              <div className="border border-slate-800/30"></div><div className="border border-slate-800/30"></div><div className="border border-slate-800/30"></div>
              <div className="border border-slate-800/30"></div><div className="border border-slate-800/30"></div><div className="border border-slate-800/30"></div>
              <div className="border border-slate-800/30"></div><div className="border border-slate-800/30"></div><div className="border border-slate-800/30"></div>
            </div>
          </div>

          <div className={`w-64 h-64 border-2 rounded-lg relative transition-colors duration-300 ${scanStatus === 'found' ? 'border-green-500' : 'border-white/50'}`}>
            {scanStatus === 'scanning' && (
              <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
            )}
            
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-white rounded-tl-sm"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-white rounded-tr-sm"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-white rounded-bl-sm"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-white rounded-br-sm"></div>
          </div>
          
          {scanStatus === 'found' && (
            <div className="absolute bottom-10 bg-green-500 text-white px-4 py-2 rounded-full font-bold animate-bounce flex items-center gap-2">
              <QrCode size={18} />
              Medicine Found: MED-101 (Insulin)
            </div>
          )}
        </div>
        
        <div className="p-6 text-center space-y-4 bg-slate-900">
          <div className="flex justify-center items-center gap-2 text-white font-medium text-lg">
            <Camera size={24} />
            <h3>Scan Medicine QR / Barcode</h3>
          </div>
          <p className="text-slate-400 text-sm">Align the barcode or QR package label within the frame to verify medicine inventory.</p>
          <Button className="w-full bg-slate-800 text-slate-200 border border-slate-700" onClick={onClose}>Cancel</Button>
        </div>
      </div>
      <style>{`
         @keyframes scan {
            0% { top: 0; }
            50% { top: 100%; }
            100% { top: 0; }
         }
      `}</style>
    </div>
  );
};