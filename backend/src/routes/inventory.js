import express from 'express';
import Inventory from '../models/Inventory.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const defaultInventory = [
  {
    id: 'INV-001',
    medicineId: 'MED-101',
    medicineName: 'Insulin',
    category: 'Endocrine / Diabetes',
    facilityId: 'FAC-01',
    facilityName: 'Hospital A',
    openingStock: 500,
    receivedStock: 100,
    issuedStock: 180,
    currentStock: 420,
    dailyUsage: 46,
    incomingStock: 0,
    reorderLevel: 300,
    daysRemaining: 9,
    risk: 'HIGH',
    unit: 'vials',
    lastUpdated: 'Today at 08:30 AM'
  },
  {
    id: 'INV-002',
    medicineId: 'MED-102',
    medicineName: 'ORS',
    category: 'Electrolytes',
    facilityId: 'FAC-01',
    facilityName: 'Hospital A',
    openingStock: 1500,
    receivedStock: 200,
    issuedStock: 500,
    currentStock: 1200,
    dailyUsage: 100,
    incomingStock: 0,
    reorderLevel: 800,
    daysRemaining: 12,
    risk: 'MEDIUM',
    unit: 'sachets',
    lastUpdated: 'Today at 09:15 AM'
  },
  {
    id: 'INV-003',
    medicineId: 'MED-103',
    medicineName: 'Antivenom',
    category: 'Emergency / Antidote',
    facilityId: 'FAC-01',
    facilityName: 'Hospital A',
    openingStock: 100,
    receivedStock: 0,
    issuedStock: 20,
    currentStock: 80,
    dailyUsage: 4,
    incomingStock: 20,
    reorderLevel: 50,
    daysRemaining: 20,
    risk: 'LOW',
    unit: 'vials',
    lastUpdated: 'Yesterday at 04:45 PM'
  },
  {
    id: 'INV-004',
    medicineId: 'MED-104',
    medicineName: 'Anti-TB Medicine',
    category: 'Infectious Disease',
    facilityId: 'FAC-01',
    facilityName: 'Hospital A',
    openingStock: 200,
    receivedStock: 50,
    issuedStock: 100,
    currentStock: 150,
    dailyUsage: 12,
    incomingStock: 0,
    reorderLevel: 100,
    daysRemaining: 12,
    risk: 'MEDIUM',
    unit: 'packs',
    lastUpdated: 'Today at 07:10 AM'
  },
  {
    id: 'INV-005',
    medicineId: 'MED-105',
    medicineName: 'Paracetamol',
    category: 'Analgesics',
    facilityId: 'FAC-01',
    facilityName: 'Hospital A',
    openingStock: 3000,
    receivedStock: 1000,
    issuedStock: 1500,
    currentStock: 2500,
    dailyUsage: 120,
    incomingStock: 500,
    reorderLevel: 1000,
    daysRemaining: 21,
    risk: 'LOW',
    unit: 'tablets',
    lastUpdated: 'Today at 10:00 AM'
  },
  {
    id: 'INV-006',
    medicineId: 'MED-101',
    medicineName: 'Insulin',
    category: 'Endocrine / Diabetes',
    facilityId: 'FAC-02',
    facilityName: 'Hospital B',
    openingStock: 600,
    receivedStock: 100,
    issuedStock: 200,
    currentStock: 500,
    dailyUsage: 20,
    incomingStock: 100,
    reorderLevel: 250,
    daysRemaining: 25,
    risk: 'LOW',
    unit: 'vials',
    lastUpdated: 'Today at 08:00 AM'
  },
  {
    id: 'INV-007',
    medicineId: 'MED-106',
    medicineName: 'Amoxicillin',
    category: 'Antibiotics',
    facilityId: 'FAC-02',
    facilityName: 'Hospital B',
    openingStock: 800,
    receivedStock: 200,
    issuedStock: 400,
    currentStock: 600,
    dailyUsage: 35,
    incomingStock: 100,
    reorderLevel: 300,
    daysRemaining: 17,
    risk: 'LOW',
    unit: 'capsules',
    lastUpdated: 'Yesterday at 05:20 PM'
  },
  {
    id: 'INV-008',
    medicineId: 'MED-107',
    medicineName: 'Artemether-Lumefantrine',
    category: 'Antimalarial',
    facilityId: 'FAC-03',
    facilityName: 'Metro Health Center',
    openingStock: 350,
    receivedStock: 50,
    issuedStock: 180,
    currentStock: 220,
    dailyUsage: 18,
    incomingStock: 0,
    reorderLevel: 150,
    daysRemaining: 12,
    risk: 'MEDIUM',
    unit: 'strips',
    lastUpdated: 'Today at 06:40 AM'
  }
];

// GET /api/inventory
router.get('/', async (req, res) => {
  try {
    const list = await Inventory.find().lean();
    if (!list || list.length === 0) return res.json(defaultInventory);
    res.json(list);
  } catch (err) {
    res.json(defaultInventory);
  }
});

// GET /api/inventory/:facilityId
router.get('/:facilityId', async (req, res) => {
  try {
    const list = await Inventory.find({ facilityId: req.params.facilityId }).lean();
    if (!list || list.length === 0) {
      const filtered = defaultInventory.filter(i => i.facilityId === req.params.facilityId);
      return res.json(filtered);
    }
    res.json(list);
  } catch (err) {
    const filtered = defaultInventory.filter(i => i.facilityId === req.params.facilityId);
    res.json(filtered);
  }
});

export default router;
