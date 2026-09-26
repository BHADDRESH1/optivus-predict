import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    medicineId: { type: String, required: true },
    medicineName: { type: String, required: true },
    category: { type: String, required: true },
    facilityId: { type: String, required: true },
    facilityName: { type: String, required: true },
    openingStock: { type: Number, required: true, default: 0 },
    receivedStock: { type: Number, required: true, default: 0 },
    issuedStock: { type: Number, required: true, default: 0 },
    currentStock: { type: Number, required: true, default: 0 },
    dailyUsage: { type: Number, required: true, default: 1 },
    incomingStock: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 100 },
    daysRemaining: { type: Number, default: 30 },
    risk: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'LOW' },
    unit: { type: String, default: 'units' },
    lastUpdated: { type: String, default: 'Today' },
  },
  { timestamps: true }
);

export default mongoose.model('Inventory', inventorySchema);
