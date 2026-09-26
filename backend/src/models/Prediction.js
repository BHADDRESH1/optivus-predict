import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema(
  {
    predictionId: { type: String, required: true },
    medicineId: { type: String, required: true },
    medicineName: { type: String, required: true },
    facilityId: { type: String, required: true },
    facilityName: { type: String, required: true },
    currentStock: { type: Number, required: true },
    dailyUsage: { type: Number, required: true },
    incomingStock: { type: Number, default: 0 },
    predictedStockoutDate: { type: String, required: true },
    daysRemaining: { type: Number, required: true },
    riskLevel: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'HIGH' },
    confidence: { type: Number, default: 91 },
    explanation: [{ type: String }],
    recommendation: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Prediction', predictionSchema);
