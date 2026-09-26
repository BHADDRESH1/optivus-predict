import express from 'express';
import Prediction from '../models/Prediction.js';

const router = express.Router();

const defaultPredictions = [
  {
    predictionId: 'PRED-001',
    medicineId: 'MED-101',
    medicineName: 'Insulin',
    facilityId: 'FAC-01',
    facilityName: 'Hospital A',
    currentStock: 420,
    dailyUsage: 46,
    incomingStock: 0,
    predictedStockoutDate: 'In 9 days',
    daysRemaining: 9,
    riskLevel: 'HIGH',
    confidence: 91,
    explanation: [
      'Current stock is 420 units.',
      'Average daily usage is 46 units.',
      'No incoming stock is currently recorded.',
      'Based on recent consumption patterns, the system estimates approximately 9 days of remaining stock.',
      'Risk level: HIGH.'
    ],
    recommendation: 'Redistribute 100 units from Hospital B (surplus facility) or expedite supplier emergency batch.'
  },
  {
    predictionId: 'PRED-002',
    medicineId: 'MED-102',
    medicineName: 'ORS',
    facilityId: 'FAC-01',
    facilityName: 'Hospital A',
    currentStock: 1200,
    dailyUsage: 100,
    incomingStock: 0,
    predictedStockoutDate: 'In 12 days',
    daysRemaining: 12,
    riskLevel: 'MEDIUM',
    confidence: 84,
    explanation: [
      'Current stock is 1,200 units.',
      'Historical daily usage averaged 100 units/day during active clinics.',
      'Unusual zero-consumption pattern recorded on Thursday and Friday.',
      'Possible reasons: 1. Genuine stockout, 2. Reporting stopped, 3. Data entry problem.',
      'Classification: Requires verification before dispatching stock.'
    ],
    recommendation: 'Initiate telemetry audit and verify dispensary reporting logs with clinical staff.'
  }
];

// GET /api/predictions
router.get('/', async (req, res) => {
  try {
    const list = await Prediction.find().lean();
    if (!list || list.length === 0) return res.json(defaultPredictions);
    res.json(list);
  } catch (err) {
    res.json(defaultPredictions);
  }
});

// GET /api/predictions/:medicineId
router.get('/:medicineId', async (req, res) => {
  try {
    const p = await Prediction.findOne({ medicineId: req.params.medicineId }).lean();
    if (!p) {
      const match = defaultPredictions.find(item => item.medicineId === req.params.medicineId);
      if (match) return res.json(match);
      return res.status(404).json({ message: 'Prediction not found' });
    }
    res.json(p);
  } catch (err) {
    const match = defaultPredictions.find(item => item.medicineId === req.params.medicineId);
    if (match) return res.json(match);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
