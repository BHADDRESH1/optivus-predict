import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    medicineId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    unit: { type: String, required: true, default: 'units' },
    reorderLevel: { type: Number, required: true, default: 100 },
    description: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Medicine', medicineSchema);
