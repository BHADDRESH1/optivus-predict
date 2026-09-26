import express from 'express';
import RedistributionRecommendation from '../models/RedistributionRecommendation.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

let defaultRecommendations = [
  {
    id: 'REDIST-001',
    recommendationId: 'REDIST-001',
    medicineId: 'MED-101',
    medicineName: 'Insulin',
    sourceFacility: 'Hospital B',
    destinationFacility: 'Hospital A',
    sourceStock: 500,
    sourceProjectedExcess: 200,
    destinationStock: 420,
    destinationDailyUsage: 46,
    destinationDaysRemaining: 9,
    recommendedQuantity: 100,
    reason: 'Hospital A predicted to run out in 9 days (or 4 days under surge). Hospital B has 200 units projected excess above safety reserve.',
    status: 'Pending Approval',
    createdAt: '2026-09-26 09:30'
  },
  {
    id: 'REDIST-002',
    recommendationId: 'REDIST-002',
    medicineId: 'MED-106',
    medicineName: 'Amoxicillin',
    sourceFacility: 'Hospital B',
    destinationFacility: 'Metro Health Center',
    sourceStock: 600,
    sourceProjectedExcess: 150,
    destinationStock: 120,
    destinationDailyUsage: 15,
    destinationDaysRemaining: 8,
    recommendedQuantity: 75,
    reason: 'Metro Health Center has 8 days of Amoxicillin remaining due to seasonal pediatric surge. Hospital B has surplus.',
    status: 'Pending Approval',
    createdAt: '2026-09-26 11:15'
  }
];

// GET /api/redistribution/recommendations
router.get('/recommendations', async (req, res) => {
  try {
    const list = await RedistributionRecommendation.find().lean();
    if (!list || list.length === 0) return res.json(defaultRecommendations);
    res.json(list);
  } catch (err) {
    res.json(defaultRecommendations);
  }
});

// POST /api/redistribution/recommendations/:id/approve
router.post('/recommendations/:id/approve', authenticate, async (req, res) => {
  try {
    const rec = await RedistributionRecommendation.findOneAndUpdate(
      { recommendationId: req.params.id },
      { $set: { status: 'Approved', approvedBy: req.user?.sub || 'Admin' } },
      { new: true }
    );
    if (!rec) {
      defaultRecommendations = defaultRecommendations.map(r => 
        (r.id === req.params.id || r.recommendationId === req.params.id) 
          ? { ...r, status: 'Approved', approvedBy: 'Admin' } 
          : r
      );
      return res.json({ message: 'Transfer approved', item: defaultRecommendations.find(r => r.id === req.params.id) });
    }
    res.json({ message: 'Transfer approved', item: rec });
  } catch (err) {
    res.json({ message: 'Transfer approved in demo mode' });
  }
});

// POST /api/redistribution/recommendations/:id/reject
router.post('/recommendations/:id/reject', authenticate, async (req, res) => {
  try {
    defaultRecommendations = defaultRecommendations.map(r => 
      (r.id === req.params.id || r.recommendationId === req.params.id) 
        ? { ...r, status: 'Rejected' } 
        : r
    );
    res.json({ message: 'Transfer rejected' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
