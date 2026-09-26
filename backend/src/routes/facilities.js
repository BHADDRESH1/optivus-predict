import express from 'express';
import Facility from '../models/Facility.js';

const router = express.Router();

const defaultFacilities = [
  {
    facilityId: 'FAC-01',
    name: 'Hospital A',
    type: 'Tertiary Hospital',
    location: 'Chennai Central',
    medicinesCount: 128,
    highRiskCount: 7,
    alertsCount: 4,
    status: 'Active'
  },
  {
    facilityId: 'FAC-02',
    name: 'Hospital B',
    type: 'General Hospital',
    location: 'Chennai South',
    medicinesCount: 135,
    highRiskCount: 2,
    alertsCount: 1,
    status: 'Active'
  },
  {
    facilityId: 'FAC-03',
    name: 'Metro Health Center',
    type: 'Community Health Clinic',
    location: 'Chennai North',
    medicinesCount: 64,
    highRiskCount: 1,
    alertsCount: 0,
    status: 'Active'
  },
  {
    facilityId: 'FAC-04',
    name: 'Tambaram Sub-Center',
    type: 'Primary Health Center',
    location: 'Tambaram, Chennai',
    medicinesCount: 48,
    highRiskCount: 0,
    alertsCount: 0,
    status: 'Active'
  }
];

// GET /api/facilities
router.get('/', async (req, res) => {
  try {
    const list = await Facility.find().lean();
    if (!list || list.length === 0) return res.json(defaultFacilities);
    res.json(list);
  } catch (err) {
    res.json(defaultFacilities);
  }
});

export default router;
