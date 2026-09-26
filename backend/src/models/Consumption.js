import mongoose from 'mongoose';

const consumptionSchema = new mongoose.Schema(
  {
    medicineId: { type: String, required: true },
    medicineName: { type: String, required: true },
    facilityId: { type: String, required: true },
    facilityName: { type: String, required: true },
    date: { type: String, required: true },
    quantityUsed: { type: Number, required: true, default: 0 },
    isAnomaly: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Consumption', consumptionSchema);
