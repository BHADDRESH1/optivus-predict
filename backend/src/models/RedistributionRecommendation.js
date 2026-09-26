import mongoose from 'mongoose';

const redistributionSchema = new mongoose.Schema(
  {
    recommendationId: { type: String, required: true },
    medicineId: { type: String, required: true },
    medicineName: { type: String, required: true },
    sourceFacility: { type: String, required: true },
    destinationFacility: { type: String, required: true },
    sourceStock: { type: Number, required: true },
    sourceProjectedExcess: { type: Number, required: true },
    destinationStock: { type: Number, required: true },
    destinationDailyUsage: { type: Number, required: true },
    destinationDaysRemaining: { type: Number, required: true },
    recommendedQuantity: { type: Number, required: true },
    reason: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['Pending Approval', 'Approved', 'Rejected', 'In Transit'], 
      default: 'Pending Approval' 
    },
    approvedBy: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('RedistributionRecommendation', redistributionSchema);
