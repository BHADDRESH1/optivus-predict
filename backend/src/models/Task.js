import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    equipmentName: { type: String, required: true, trim: true },
    equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },
    technician: { type: String, required: true, trim: true },
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ['Completed', 'Pending', 'Overdue', 'Scheduled', 'In Progress', 'Escalated', 'Inactive'],
      default: 'Pending'
    },
    whatsappStatus: { 
      type: String, 
      enum: ['Sent', 'Delivered', 'Read', 'Failed'],
      default: 'Sent'
    },
    aiStatus: { 
      type: String, 
      enum: ['Processing', 'Verified', 'Rejected', 'Needs Review'],
      default: 'Processing'
    },
    priority: { 
      type: String, 
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    description: { type: String, trim: true },
    notes: { type: String, trim: true },
    completedAt: { type: Date },
    completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    images: [{ type: String }],
    documents: [{ 
      name: String,
      url: String,
      type: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
    escalationLevel: { 
      type: String, 
      enum: ['Technician', 'Supervisor', 'Vendor', 'Management'],
      default: 'Technician'
    },
    escalatedTo: { type: String, trim: true },
    escalationDate: { type: Date },
  },
  { timestamps: true }
);

taskSchema.index({ equipmentId: 1 });
taskSchema.index({ technicianId: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ aiStatus: 1 });

export default mongoose.model('Task', taskSchema);

