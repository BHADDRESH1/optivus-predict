import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema(
  {
    facilityId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, default: 'Hospital' },
    location: { type: String, required: true, trim: true },
    medicinesCount: { type: Number, default: 0 },
    highRiskCount: { type: Number, default: 0 },
    alertsCount: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export default mongoose.model('Facility', facilitySchema);
