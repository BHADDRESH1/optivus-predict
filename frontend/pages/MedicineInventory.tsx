import React, { useState, useMemo } from 'react';
import { Card, Button, RiskBadge } from '../components/ui';
import { MOCK_INVENTORY, MOCK_FACILITIES, MOCK_MEDICINES } from '../constants';
import { InventoryItem, RiskLevel } from '../types';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  RefreshCw, 
  TrendingDown, 
  Pill, 
  Building2, 
  ArrowUpDown,
  Calculator,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { normalizeRole, getRoleInfo, hasPermission } from '../permissions';

export const MedicineInventory: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentRole = normalizeRole(user?.role);
  const roleInfo = getRoleInfo(currentRole);
  const canAddMedicine = hasPermission(user?.role, 'inventory.edit_master');
  const isViewOnly = currentRole === Role.HOSPITAL_HEAD;

  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortField, setSortField] = useState<keyof InventoryItem>('daysRemaining');
  const [sortAsc, setSortAsc] = useState(true);

  // Add Medicine Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    medicineName: '',
    category: 'Endocrine / Diabetes',
    facilityName: 'Hospital A',
    openingStock: 500,
    receivedStock: 100,
    issuedStock: 180,
    dailyUsage: 46,
    incomingStock: 0,
    reorderLevel: 300,
    unit: 'vials'
  });

  // Dynamic formula calculation for modal (Section 6)
  // Current Stock = Opening Stock + Received Stock - Issued/Used Stock
  const calculatedCurrentStock = Math.max(0, Number(formData.openingStock || 0) + Number(formData.receivedStock || 0) - Number(formData.issuedStock || 0));
  // Estimated Days to Stockout = Current Stock / Average Daily Consumption
  const calculatedDaysRemaining = formData.dailyUsage > 0 
    ? Math.round((calculatedCurrentStock / Number(formData.dailyUsage)) * 10) / 10 
    : 0;
  const calculatedRisk: RiskLevel = calculatedDaysRemaining <= 10 ? 'HIGH' : calculatedDaysRemaining <= 15 ? 'MEDIUM' : 'LOW';

  // Filter & Search Logic
  const filteredItems = useMemo(() => {
    return inventory.filter(item => {
      const matchSearch = item.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.facilityName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchFacility = selectedFacility === 'All' || item.facilityName === selectedFacility;
      const matchRisk = selectedRisk === 'All' || item.risk === selectedRisk;
      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchSearch && matchFacility && matchRisk && matchCategory;
    }).sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      return sortAsc 
        ? String(aVal).localeCompare(String(bVal)) 
        : String(bVal).localeCompare(String(aVal));
    });
  }, [inventory, searchTerm, selectedFacility, selectedRisk, selectedCategory, sortField, sortAsc]);

  const handleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleAddMedicineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: InventoryItem = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      medicineId: `MED-${Date.now().toString().slice(-3)}`,
      medicineName: formData.medicineName || 'New Medicine',
      category: formData.category,
      facilityId: formData.facilityName === 'Hospital A' ? 'FAC-01' : 'FAC-02',
      facilityName: formData.facilityName,
      openingStock: Number(formData.openingStock),
      receivedStock: Number(formData.receivedStock),
      issuedStock: Number(formData.issuedStock),
      currentStock: calculatedCurrentStock,
      dailyUsage: Number(formData.dailyUsage),
      incomingStock: Number(formData.incomingStock),
      reorderLevel: Number(formData.reorderLevel),
      daysRemaining: Math.round(calculatedDaysRemaining),
      risk: calculatedRisk,
      unit: formData.unit,
      lastUpdated: 'Just now'
    };

    setInventory([newItem, ...inventory]);
    setIsAddModalOpen(false);
  };

  // Categories list
  const categories = Array.from(new Set(inventory.map(i => i.category)));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Medicine Inventory</h1>
            <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Live Monitoring
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Monitor medicine stock across healthcare facilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {canAddMedicine && (
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="shadow-sm font-semibold"
            >
              <Plus size={18} />
              + Add Medicine
            </Button>
          )}

          {isViewOnly && (
            <div className="px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50 text-teal-800 text-xs font-bold flex items-center gap-1.5">
              <span>Executive View (Read-Only)</span>
            </div>
          )}

          {currentRole === Role.PHARMACIST && (
            <div className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <span>Dispensary Stock Mode</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-slate-200 shadow-sm p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by medicine, category, or facility..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Facility Filter */}
          <div className="flex items-center gap-2 min-w-[170px]">
            <Building2 size={16} className="text-slate-400 shrink-0" />
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Facilities</option>
              <option value="Hospital A">Hospital A</option>
              <option value="Hospital B">Hospital B</option>
              <option value="Metro Health Center">Metro Health Center</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div className="flex items-center gap-2 min-w-[150px]">
            <Filter size={16} className="text-slate-400 shrink-0" />
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Risk Levels</option>
              <option value="HIGH">HIGH Risk (&lt;10d)</option>
              <option value="MEDIUM">MEDIUM Risk (10-15d)</option>
              <option value="LOW">LOW Risk (&gt;15d)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 min-w-[170px]">
            <Pill size={16} className="text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Categories</option>
              {categories.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Main Medicine Inventory Table */}
      <Card className="border-slate-200 shadow-sm overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('medicineName')}>
                  <div className="flex items-center gap-1">Medicine <ArrowUpDown size={12} /></div>
                </th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Facility</th>
                <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('currentStock')}>
                  <div className="flex items-center gap-1">Current Stock <ArrowUpDown size={12} /></div>
                </th>
                <th className="py-3.5 px-4">Daily Usage</th>
                <th className="py-3.5 px-4">Incoming Stock</th>
                <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('daysRemaining')}>
                  <div className="flex items-center gap-1">Days Remaining <ArrowUpDown size={12} /></div>
                </th>
                <th className="py-3.5 px-4">Risk</th>
                <th className="py-3.5 px-4">Last Updated</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-slate-400">
                    No medicine records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.medicineName}</div>
                      <div className="text-[11px] text-slate-400">Reorder at: {item.reorderLevel} {item.unit}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{item.facilityName}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-slate-900 text-base">{item.currentStock}</span>{' '}
                      <span className="text-xs text-slate-400">{item.unit}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {item.dailyUsage} <span className="text-xs font-normal text-slate-400">{item.unit}/day</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {item.incomingStock > 0 ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          +{item.incomingStock} {item.unit}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className={`font-black text-sm ${item.risk === 'HIGH' ? 'text-rose-600' : item.risk === 'MEDIUM' ? 'text-amber-600' : 'text-emerald-700'}`}>
                        {item.daysRemaining} days
                      </div>
                      <div className="text-[10px] text-slate-400">AI Est. Stockout</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge risk={item.risk} />
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">{item.lastUpdated}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigate('/admin/stockout-prediction')}
                        className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
                        title="View AI Stockout Prediction"
                      >
                        Predict
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary Bar */}
        <div className="p-4 bg-slate-50/60 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            Showing <span className="font-semibold text-slate-700">{filteredItems.length}</span> of <span className="font-semibold text-slate-700">{inventory.length}</span> total medicine entries
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> High Risk: {inventory.filter(i => i.risk === 'HIGH').length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Medium Risk: {inventory.filter(i => i.risk === 'MEDIUM').length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Stable: {inventory.filter(i => i.risk === 'LOW').length}
            </span>
          </div>
        </div>
      </Card>

      {/* Add Medicine Modal (Sections 5 & 6) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 my-8">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-blue-600 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Add Medicine to Inventory</h3>
                <p className="text-xs text-blue-100 mt-0.5">Enter stock parameters. Current stock and stockout prediction are auto-calculated.</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-blue-100 hover:text-white p-1 rounded-md"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddMedicineSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Medicine Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Insulin (Human 100IU/ml)"
                    value={formData.medicineName}
                    onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <input 
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Endocrine / Diabetes"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Healthcare Facility *</label>
                  <select
                    value={formData.facilityName}
                    onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Hospital A">Hospital A (Chennai Central)</option>
                    <option value="Hospital B">Hospital B (Chennai South)</option>
                    <option value="Metro Health Center">Metro Health Center</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Opening Stock</label>
                  <input 
                    type="number"
                    min="0"
                    value={formData.openingStock}
                    onChange={(e) => setFormData({ ...formData, openingStock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Received Stock (+)</label>
                  <input 
                    type="number"
                    min="0"
                    value={formData.receivedStock}
                    onChange={(e) => setFormData({ ...formData, receivedStock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Issued / Used Stock (-)</label>
                  <input 
                    type="number"
                    min="0"
                    value={formData.issuedStock}
                    onChange={(e) => setFormData({ ...formData, issuedStock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Average Daily Usage</label>
                  <input 
                    type="number"
                    min="1"
                    value={formData.dailyUsage}
                    onChange={(e) => setFormData({ ...formData, dailyUsage: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Incoming Stock (In-transit)</label>
                  <input 
                    type="number"
                    min="0"
                    value={formData.incomingStock}
                    onChange={(e) => setFormData({ ...formData, incomingStock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reorder Safety Level</label>
                  <input 
                    type="number"
                    min="0"
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Real-time Calculation Panel (Section 6) */}
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase mb-2">
                  <Calculator size={14} className="text-blue-600" />
                  Live Stock & Prediction Formula
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <p className="text-slate-400">Current Stock</p>
                    <p className="text-base font-extrabold text-blue-700 mt-0.5">
                      {calculatedCurrentStock} units
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{formData.openingStock} + {formData.receivedStock} - {formData.issuedStock}</p>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <p className="text-slate-400">Predicted Stockout</p>
                    <p className={`text-base font-extrabold mt-0.5 ${calculatedRisk === 'HIGH' ? 'text-rose-600' : calculatedRisk === 'MEDIUM' ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {calculatedDaysRemaining} days
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{calculatedCurrentStock} / {formData.dailyUsage}</p>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 col-span-2 sm:col-span-1">
                    <p className="text-slate-400">Calculated Risk</p>
                    <div className="mt-1">
                      <RiskBadge risk={calculatedRisk} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Medicine Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
