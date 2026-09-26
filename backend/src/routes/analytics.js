import express from 'express';

const router = express.Router();

const consumptionData = {
  daily: [
    { day: 'Mon', usage: 40, normalMin: 38, normalMax: 44 },
    { day: 'Tue', usage: 42, normalMin: 38, normalMax: 44 },
    { day: 'Wed', usage: 45, normalMin: 38, normalMax: 44 },
    { day: 'Thu', usage: 48, normalMin: 38, normalMax: 44 },
    { day: 'Fri', usage: 50, normalMin: 38, normalMax: 44 }
  ],
  anomalies: [
    {
      medicine: 'ORS',
      facility: 'Hospital A',
      pattern: [
        { day: 'Mon', count: 45 },
        { day: 'Tue', count: 48 },
        { day: 'Wed', count: 42 },
        { day: 'Thu', count: 0 },
        { day: 'Fri', count: 0 }
      ],
      flag: 'Unusual zero-consumption pattern detected',
      status: 'Requires verification'
    }
  ]
};

// GET /api/analytics/consumption
router.get('/consumption', (req, res) => {
  res.json(consumptionData);
});

export default router;
