import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    alertId: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'HIGH STOCKOUT RISK',
        'ANOMALY DETECTED',
        'LOW STOCK',
        'REDISTRIBUTION OPPORTUNITY',
        'REPORTING GAP',
        'INCOMING STOCK DELAY'
      ],
      required: true,
    },
    severity: {
      type: String,
      enum: ['critical', 'warning', 'info', 'success'],
      default: 'warning',
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    facility: { type: String, required: true },
    medicine: { type: String, required: true },
    status: {
      type: String,
      enum: ['Active', 'Resolved', 'Acknowledged'],
      default: 'Active',
    },
    timestamp: { type: String, default: 'Just now' },
  },
  { timestamps: true }
);

export default mongoose.model('Alert', alertSchema);
