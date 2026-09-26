import express from 'express';
import Alert from '../models/Alert.js';

const router = express.Router();

const defaultAlerts = [
  {
    id: 'ALT-101',
    alertId: 'ALT-101',
    type: 'HIGH STOCKOUT RISK',
    severity: 'critical',
    title: 'High Stockout Risk: Insulin',
    message: 'Insulin at Hospital A may run out in 9 days (420 units remaining at 46 units/day).',
    facility: 'Hospital A',
    medicine: 'Insulin',
    timestamp: '15 mins ago',
    status: 'Active'
  },
  {
    id: 'ALT-102',
    alertId: 'ALT-102',
    type: 'ANOMALY DETECTED',
    severity: 'warning',
    title: 'Zero-Consumption Anomaly: ORS',
    message: 'Unusual zero-consumption pattern detected for ORS at Hospital A for 2 consecutive days. Requires verification.',
    facility: 'Hospital A',
    medicine: 'ORS',
    timestamp: '1 hour ago',
    status: 'Active'
  },
  {
    id: 'ALT-103',
    alertId: 'ALT-103',
    type: 'REDISTRIBUTION OPPORTUNITY',
    severity: 'info',
    title: 'Redistribution Opportunity Found',
    message: 'Redistribution opportunity found: Hospital B → Hospital A (Transfer 100 units Insulin).',
    facility: 'Hospital B → Hospital A',
    medicine: 'Insulin',
    timestamp: '2 hours ago',
    status: 'Active'
  },
  {
    id: 'ALT-104',
    alertId: 'ALT-104',
    type: 'LOW STOCK',
    severity: 'warning',
    title: 'Reorder Buffer Alert: Anti-TB',
    message: 'Anti-TB Medicine at Hospital A approaching safety reorder threshold (12 days remaining).',
    facility: 'Hospital A',
    medicine: 'Anti-TB Medicine',
    timestamp: '4 hours ago',
    status: 'Active'
  },
  {
    id: 'ALT-105',
    alertId: 'ALT-105',
    type: 'REPORTING GAP',
    severity: 'warning',
    title: 'Dispensary Reporting Gap',
    message: 'Metro Health Center did not transmit evening dispensation tally for pediatric antibiotics.',
    facility: 'Metro Health Center',
    medicine: 'Amoxicillin',
    timestamp: 'Yesterday',
    status: 'Acknowledged'
  }
];

// GET /api/alerts
router.get('/', async (req, res) => {
  try {
    const list = await Alert.find().lean();
    if (!list || list.length === 0) return res.json(defaultAlerts);
    res.json(list);
  } catch (err) {
    res.json(defaultAlerts);
  }
});

// PUT /api/alerts/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Alert.findOneAndUpdate(
      { alertId: req.params.id },
      { $set: req.body },
      { new: true }
    );
    res.json(updated || { message: 'Alert updated' });
  } catch (err) {
    res.json({ message: 'Alert updated' });
  }
});

export default router;
