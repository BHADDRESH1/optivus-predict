import React, { useState } from 'react';
import { Card, Button, RiskBadge } from '../components/ui';
import { MOCK_PREDICTIONS, MOCK_FACILITIES, MOCK_INVENTORY, MOCK_MEDICINES } from '../constants';
import { RiskLevel } from '../types';
import { 
  TrendingDown, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeftRight, 
  Calendar, 
  Building2, 
  Pill, 
  Sliders, 
  Info,
  Clock,
  ArrowRight,
  ShieldAlert,
  Loader2,
  CheckCircle,
  FileText,
  Activity,
  Layers,
  HelpCircle,
  PackageCheck
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export const StockoutPrediction: React.FC = () => {
  const navigate = useNavigate();

  // Selection states (SELECT phase)
  const [selectedFacility, setSelectedFacility] = useState('Hospital A');
  const [selectedMedicine, setSelectedMedicine] = useState('Insulin');
  const [dateRange, setDateRange] = useState('Next 14 Days');

  // Prediction workflow states (PREDICT phase)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [hasPredicted, setHasPredicted] = useState(false);

  // Dynamic simulation parameters (REPORT phase)
  const [simulatedUsage, setSimulatedUsage] = useState<number>(46);
  const [baseStock, setBaseStock] = useState<number>(420);
  const [incomingStock, setIncomingStock] = useState<number>(0);

  // Find matching items from existing data structures
  const activeInventory = MOCK_INVENTORY.find(item => 
    (item.facilityName.toLowerCase().includes(selectedFacility.toLowerCase()) || 
     selectedFacility.toLowerCase().includes(item.facilityName.toLowerCase())) &&
    (item.medicineName.toLowerCase().includes(selectedMedicine.toLowerCase()) || 
     selectedMedicine.toLowerCase().includes(item.medicineName.toLowerCase()))
  ) || MOCK_INVENTORY.find(item => 
    item.medicineName.toLowerCase().includes(selectedMedicine.toLowerCase()) || 
    selectedMedicine.toLowerCase().includes(item.medicineName.toLowerCase())
  ) || MOCK_INVENTORY[0];

  const activePrediction = MOCK_PREDICTIONS.find(p => 
    p.medicineName.toLowerCase().includes(selectedMedicine.toLowerCase()) ||
    selectedMedicine.toLowerCase().includes(p.medicineName.toLowerCase())
  ) || MOCK_PREDICTIONS[0];

  // Reset prediction when any input changes
  const handleFacilityChange = (val: string) => {
    setSelectedFacility(val);
    setHasPredicted(false);
  };

  const handleMedicineChange = (val: string) => {
    setSelectedMedicine(val);
    setHasPredicted(false);
  };

  const handleWindowChange = (val: string) => {
    setDateRange(val);
    setHasPredicted(false);
  };

  // Explicit PREDICT action trigger
  const handleRunPrediction = () => {
    setIsAnalyzing(true);
    setAnalysisStep(1); // Checking current stock

    // Sync base parameters with selected inventory
    const current = activeInventory.currentStock;
    const usage = activeInventory.dailyUsage;
    const incoming = activeInventory.incomingStock;
    setBaseStock(current);
    setSimulatedUsage(usage);
    setIncomingStock(incoming);

    setTimeout(() => {
      setAnalysisStep(2); // Analyzing consumption history
    }, 350);

    setTimeout(() => {
      setAnalysisStep(3); // Checking incoming stock
    }, 750);

    setTimeout(() => {
      setAnalysisStep(4); // Calculating stockout risk
    }, 1150);

    setTimeout(() => {
      setIsAnalyzing(false);
      setHasPredicted(true);
    }, 1550);
  };

  // Real-time calculation based on simulation
  // 420 / 46 = 9.13 ≈ 9 days
  // 420 / 50 = 8.4 ≈ 8 days
  const dynamicDaysRemaining = Math.max(1, Math.round((baseStock / (simulatedUsage || 1)) * 10) / 10);
  const displayDays = Math.round(dynamicDaysRemaining);
  const dynamicRisk: RiskLevel = dynamicDaysRemaining <= 10 ? 'HIGH' : dynamicDaysRemaining <= 15 ? 'MEDIUM' : 'LOW';

  // Projection points for chart based on current simulation
  const chartData = [
    { day: 'Day 0 (Now)', units: baseStock, threshold: 100 },
    { day: 'Day 2', units: Math.max(0, Math.round(baseStock - simulatedUsage * 2)), threshold: 100 },
    { day: 'Day 4', units: Math.max(0, Math.round(baseStock - simulatedUsage * 4)), threshold: 100 },
    { day: 'Day 6', units: Math.max(0, Math.round(baseStock - simulatedUsage * 6)), threshold: 100 },
    { day: 'Day 8', units: Math.max(0, Math.round(baseStock - simulatedUsage * 8)), threshold: 100 },
    { day: `Day ${displayDays} (Stockout)`, units: 0, threshold: 100 }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Stockout Prediction</h1>
            <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <Sparkles size={12} /> Predictive ML Model
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Predict medicine shortages before they affect patients through demand velocity forecasting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Requirement 10: Enabled only after prediction */}
          <Button 
            onClick={() => hasPredicted && navigate('/admin/redistribution')}
            disabled={!hasPredicted}
            className={`font-semibold transition-all shadow-sm flex items-center gap-2 ${
              hasPredicted 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400/30' 
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
            }`}
            title={hasPredicted ? 'Navigate to inter-facility redistribution' : 'Run prediction first to unlock redistribution matches'}
          >
            <ArrowLeftRight size={16} />
            Check Redistribution Matches
          </Button>
        </div>
      </div>

      {/* Requirement 13: Journey Stepper (SELECT → PREDICT → REPORT → REDISTRIBUTE) */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[620px] text-xs font-bold">
          {/* Step 1: SELECT */}
          <div className="flex items-center gap-2 text-blue-600">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px]">1</span>
            <span>SELECT PARAMETERS</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200"></div>

          {/* Step 2: PREDICT */}
          <div className={`flex items-center gap-2 ${isAnalyzing ? 'text-purple-600 animate-pulse' : hasPredicted ? 'text-blue-600' : 'text-slate-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
              hasPredicted ? 'bg-blue-600 text-white' : isAnalyzing ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              2
            </span>
            <span>PREDICT STOCKOUT</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200"></div>

          {/* Step 3: REPORT */}
          <div className={`flex items-center gap-2 ${hasPredicted ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
              hasPredicted ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              3
            </span>
            <span>DETAILED REPORT</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200"></div>

          {/* Step 4: REDISTRIBUTE */}
          <div className={`flex items-center gap-2 ${hasPredicted ? 'text-emerald-700 font-extrabold cursor-pointer hover:underline' : 'text-slate-400'}`} onClick={() => hasPredicted && navigate('/admin/redistribution')}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
              hasPredicted ? 'bg-emerald-600 text-white ring-2 ring-emerald-300' : 'bg-slate-200 text-slate-500'
            }`}>
              4
            </span>
            <span>REDISTRIBUTE</span>
          </div>
        </div>
      </div>

      {/* Filter Bar & Prominent Predict Button (Requirement 1, 2, 3, 4) */}
      <Card className="border-slate-200 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Building2 size={14} className="text-blue-600" /> Facility
            </label>
            <select
              value={selectedFacility}
              onChange={(e) => handleFacilityChange(e.target.value)}
              className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Hospital A">Hospital A (Chennai Central)</option>
              <option value="Hospital B">Hospital B (Chennai South)</option>
              <option value="Metro Health Center">Metro Health Center</option>
              <option value="Tambaram Sub-Center">Tambaram Sub-Center</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Pill size={14} className="text-blue-600" /> Medicine
            </label>
            <select
              value={selectedMedicine}
              onChange={(e) => handleMedicineChange(e.target.value)}
              className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Insulin">Insulin (Human 100IU/ml)</option>
              <option value="ORS">ORS (Oral Rehydration Salts)</option>
              <option value="Anti-TB Medicine">Anti-TB Medicine (Fixed Dose)</option>
              <option value="Antivenom">Antivenom (Polyvalent)</option>
              <option value="Amoxicillin">Amoxicillin 500mg</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Calendar size={14} className="text-blue-600" /> Forecast Window
            </label>
            <select
              value={dateRange}
              onChange={(e) => handleWindowChange(e.target.value)}
              className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Next 7 Days">Next 7 Days (Short Term)</option>
              <option value="Next 14 Days">Next 14 Days (Standard Window)</option>
              <option value="Next 30 Days">Next 30 Days (Monthly Outlook)</option>
            </select>
          </div>

          {/* Requirement 4: Prominent Primary Button */}
          <div>
            <Button
              onClick={handleRunPrediction}
              disabled={isAnalyzing}
              className="w-full py-2.5 font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all rounded-lg flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span className="text-base">🔮</span>
                  <span>Predict Stockout</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Requirement 6: Loading State Animation */}
      {isAnalyzing && (
        <Card className="border-indigo-100 bg-indigo-50/40 p-6 shadow-sm">
          <div className="max-w-xl mx-auto text-center space-y-4">
            <div className="inline-flex p-3 bg-white rounded-full shadow-sm text-indigo-600 animate-pulse">
              <Sparkles size={28} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Running AI Stockout Simulation Engine</h3>
              <p className="text-xs text-slate-500 mt-1">
                Evaluating consumption telemetry for <span className="font-semibold text-slate-800">{selectedMedicine}</span> at <span className="font-semibold text-slate-800">{selectedFacility}</span>
              </p>
            </div>

            {/* Checklist of 4 analysis steps */}
            <div className="bg-white rounded-xl p-4 border border-indigo-100 text-left space-y-2.5 shadow-xs">
              <div className="flex items-center gap-3 text-xs">
                {analysisStep >= 1 ? (
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0"></div>
                )}
                <span className={analysisStep >= 1 ? 'font-semibold text-slate-800' : 'text-slate-400'}>
                  1. Checking current verified physical stock...
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                {analysisStep >= 2 ? (
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0"></div>
                )}
                <span className={analysisStep >= 2 ? 'font-semibold text-slate-800' : 'text-slate-400'}>
                  2. Analyzing 14-day consumption history & moving velocity...
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                {analysisStep >= 3 ? (
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0"></div>
                )}
                <span className={analysisStep >= 3 ? 'font-semibold text-slate-800' : 'text-slate-400'}>
                  3. Checking incoming supplier purchase orders & transit records...
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                {analysisStep >= 4 ? (
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0"></div>
                )}
                <span className={analysisStep >= 4 ? 'font-semibold text-slate-800' : 'text-slate-400'}>
                  4. Calculating depletion trajectory & stockout risk score...
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Requirement 5: Clean Empty / Ready State before clicking button */}
      {!hasPredicted && !isAnalyzing && (
        <Card className="border-dashed border-2 border-slate-300 p-12 text-center bg-slate-50/50">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
              <Sparkles size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Ready for Stockout Prediction</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Select the inputs and click <strong className="text-blue-600">Predict Stockout</strong> to analyze.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Active Target: {selectedMedicine} @ {selectedFacility} ({dateRange})</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Results Section (Only rendered when hasPredicted === true) */}
      {hasPredicted && !isAnalyzing && (
        <>
          {/* Requirement 7: KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Stock</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{baseStock} <span className="text-xs font-normal text-slate-400">units</span></p>
              <p className="text-[11px] text-slate-400 mt-1">Verified physical tally</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Daily Usage</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{simulatedUsage} <span className="text-xs font-normal text-slate-400">units/day</span></p>
              <p className="text-[11px] text-blue-600 mt-1 font-medium">Historical baseline</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Incoming Stock</p>
              <p className="text-2xl font-black text-slate-500 mt-1">{incomingStock} <span className="text-xs font-normal text-slate-400">units</span></p>
              <p className="text-[11px] text-slate-400 mt-1">{incomingStock > 0 ? 'Confirmed in transit' : 'No pending POs'}</p>
            </div>

            <div className="p-4 bg-rose-50/70 rounded-xl border border-rose-200 shadow-sm">
              <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">Predicted Stockout</p>
              <p className="text-2xl font-black text-rose-600 mt-1">
                {displayDays} <span className="text-sm font-bold">days</span>
              </p>
              <p className="text-[11px] text-rose-700 mt-1 font-medium">Approx. {dynamicDaysRemaining} days runway</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Level</p>
              <div className="mt-2">
                <RiskBadge risk={dynamicRisk} className="text-sm py-1 px-3" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">{dynamicDaysRemaining <= 10 ? '< 10 days safety zone' : 'Normal operating buffer'}</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confidence</p>
              <p className="text-2xl font-black text-blue-600 mt-1">{activePrediction.confidence || 91}%</p>
              {/* Requirement 11: Sample AI Prototype wording */}
              <p className="text-[11px] text-slate-400 mt-1">Sample AI Prototype</p>
            </div>
          </div>

          {/* Requirement 8: Detailed Prediction Report */}
          <Card 
            title="Detailed Prediction Report" 
            className="border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="space-y-6">
              {/* Report Header Metadata Summary */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 uppercase font-semibold block text-[10px]">Selected Facility</span>
                  <strong className="text-slate-900 text-sm">{selectedFacility}</strong>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold block text-[10px]">Selected Medicine</span>
                  <strong className="text-slate-900 text-sm">{selectedMedicine}</strong>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold block text-[10px]">Forecast Window</span>
                  <strong className="text-slate-800">{dateRange}</strong>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold block text-[10px]">Current Stock</span>
                  <strong className="text-slate-900">{baseStock} units</strong>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold block text-[10px]">Incoming Deliveries</span>
                  <strong className="text-slate-900">{incomingStock} units</strong>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold block text-[10px]">Calculated Risk</span>
                  <div className="mt-0.5"><RiskBadge risk={dynamicRisk} /></div>
                </div>
              </div>

              {/* Report Narrative & Driver Factors */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-blue-600" />
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Prediction Analysis & Drivers</h4>
                  </div>

                  <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="text-rose-600 shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="text-xs font-bold text-rose-900 uppercase">Stockout Forecast Assessment</p>
                        <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                          At the observed daily burn velocity of <strong className="font-extrabold">{simulatedUsage} units/day</strong>, 
                          <span className="font-semibold"> {selectedFacility}</span> will reach zero stock in approximately 
                          <strong className="font-extrabold text-rose-800"> {displayDays} days</strong> without scheduled supplier deliveries.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-900 text-xs mb-2">Why this medicine is at risk:</p>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                      <span>Verified current physical inventory stands at <strong className="text-slate-900">{baseStock} units</strong>.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                      <span>Average daily consumption rate is currently <strong className="text-slate-900">{simulatedUsage} units/day</strong> based on 14-day trailing outpatient usage.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                      <span>Incoming verified shipments: <strong className="text-slate-900">{incomingStock} units</strong> (central procurement cycle is not scheduled for this window).</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0"></span>
                      <span>Estimated days of remaining buffer: <strong className="text-rose-600 font-extrabold">{displayDays} days</strong> ({dynamicDaysRemaining} exact days).</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0"></span>
                      <span>Model Confidence: <strong className="text-purple-700 font-bold">{activePrediction.confidence || 91}%</strong> (Sample AI Prototype).</span>
                    </div>
                  </div>
                </div>

                {/* Redistribution Action Box in Report */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight size={16} className="text-emerald-600" />
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Recommended Inter-Facility Rebalancing</h4>
                  </div>

                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Redistribution Opportunity</span>
                        <h5 className="text-sm font-black text-emerald-950 mt-0.5">Hospital B (Surplus Hub) → {selectedFacility}</h5>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-200/60 text-emerald-800 text-[10px] font-extrabold rounded-md">Surplus: +200 units</span>
                    </div>

                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Hospital B holds 500 units of Insulin with only 300 units projected consumption over 30 days. Transferring 100 units immediately extends {selectedFacility}&apos;s operating runway past 11 days.
                    </p>

                    <Button 
                      onClick={() => navigate('/admin/redistribution')}
                      className="w-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center justify-center gap-2 py-2.5 rounded-lg"
                    >
                      <span>Check Redistribution Matches</span>
                      <ArrowRight size={14} />
                    </Button>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <HelpCircle size={13} className="text-blue-500" /> Note on Decision Intelligence
                    </div>
                    <p>
                      This prediction is derived using exponential moving average depletion velocity combined with local facility inventory balances. Human administrator authorization is required prior to initiating cold-chain dispatch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Requirement 9: Demo Experiment / Scenario Simulation */}
          <Card className="border-blue-200 bg-blue-50/40 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sliders size={18} className="text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Interactive Consumption Simulation</h3>
                  <span className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Demo Experiment / Scenario Simulation
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Adjust patient consumption rate to test how surges impact stockout runway in real time.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSimulatedUsage(46)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${simulatedUsage === 46 ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                >
                  Standard (46/day → 9 days)
                </button>
                <button
                  onClick={() => setSimulatedUsage(50)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${simulatedUsage === 50 ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                >
                  Surge (50/day → 8 days)
                </button>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-100/70 flex items-center gap-4">
              <input
                type="range"
                min="20"
                max="80"
                value={simulatedUsage}
                onChange={(e) => setSimulatedUsage(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="shrink-0 text-right min-w-[140px]">
                <span className="text-sm font-extrabold text-blue-900">{simulatedUsage} units/day</span>
                <div className="text-[10px] text-slate-500">{baseStock} / {simulatedUsage} = {dynamicDaysRemaining}d remaining</div>
              </div>
            </div>
          </Card>

          {/* Depletion Curve Graph */}
          <Card title="Depletion Timeline Projection" className="border-slate-200 shadow-sm">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <ReferenceLine y={100} label={{ value: 'Safety Threshold (100 units)', fill: '#f59e0b', fontSize: 11, position: 'top' }} stroke="#f59e0b" strokeDasharray="4 4" />
                  <Line 
                    type="monotone" 
                    dataKey="units" 
                    name="Projected Stock Level" 
                    stroke="#ef4444" 
                    strokeWidth={3} 
                    dot={{ r: 5, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 7 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-500 flex items-center justify-between">
              <span>Projected Critical Zero Depletion: <strong className="text-slate-800">Day {displayDays}</strong></span>
              <span>Reserve Safety Buffer: <strong className="text-amber-700">100 units</strong></span>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
