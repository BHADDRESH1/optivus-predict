import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    vendor: { type: String, required: true, trim: true },
    nextServiceDate: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ['Completed', 'Pending', 'Overdue', 'Scheduled', 'In Progress', 'Escalated', 'Inactive'],
      default: 'Pending'
    },
    technician: { type: String, trim: true, default: '' },
    model: { type: String, trim: true, default: '' },
    serial: { type: String, trim: true, default: '' },
    purchaseDate: { type: Date },
    purchaseCost: { type: String, trim: true },
    warrantyExpiry: { type: Date },
    lifeExpectancy: { type: String, trim: true },
    qrCode: { type: String, trim: true },
    images: [{ type: String }],
    documents: [{ 
      name: String,
      url: String,
      type: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
    maintenanceFrequency: { 
      type: String, 
      enum: ['Monthly', 'Quarterly', 'Bi-Annually', 'Yearly'],
      default: 'Quarterly'
    },
    amcExpiry: { type: Date },
    assignedTechnician: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

equipmentSchema.index({ name: 'text', model: 'text', serial: 'text', id: 'text' });
equipmentSchema.index({ department: 1 });
equipmentSchema.index({ status: 1 });
equipmentSchema.index({ nextServiceDate: 1 });

export default mongoose.model('Equipment', equipmentSchema);

