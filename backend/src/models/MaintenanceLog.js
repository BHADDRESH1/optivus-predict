import mongoose from 'mongoose';

const maintenanceLogSchema = new mongoose.Schema(
  {
    equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
    type: { 
      type: String, 
      enum: ['Routine Maintenance', 'Repair', 'Installation', 'Inspection', 'Calibration', 'Emergency'],
      required: true
    },
    technician: { type: String, required: true, trim: true },
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { 
      type: String, 
      enum: ['Completed', 'Pending', 'In Progress', 'Cancelled'],
      default: 'Completed'
    },
    notes: { type: String, trim: true },
    cost: { type: Number },
    duration: { type: Number }, // in minutes
    partsReplaced: [{ 
      name: String,
      partNumber: String,
      cost: Number
    }],
    images: [{ type: String }],
    documents: [{ 
      name: String,
      url: String,
      type: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
    scheduledDate: { type: Date },
    completedDate: { type: Date, default: Date.now },
    nextServiceDate: { type: Date },
  },
  { timestamps: true }
);

maintenanceLogSchema.index({ equipmentId: 1 });
maintenanceLogSchema.index({ technicianId: 1 });
maintenanceLogSchema.index({ completedDate: -1 });
maintenanceLogSchema.index({ type: 1 });

export default mongoose.model('MaintenanceLog', maintenanceLogSchema);

