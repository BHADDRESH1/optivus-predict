import express from 'express';
import Medicine from '../models/Medicine.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Fallback demo data if DB is empty
const defaultMedicines = [
  { medicineId: 'MED-101', name: 'Insulin (Human 100IU/ml)', category: 'Endocrine / Diabetes', unit: 'vials', reorderLevel: 300, description: 'Essential hormone for diabetic patient glycemic control' },
  { medicineId: 'MED-102', name: 'ORS (Oral Rehydration Salts)', category: 'Electrolytes', unit: 'sachets', reorderLevel: 800, description: 'WHO formulation for dehydration management' },
  { medicineId: 'MED-103', name: 'Antivenom (Polyvalent)', category: 'Emergency / Antidote', unit: 'vials', reorderLevel: 50, description: 'Life-saving polyvalent snake antivenom serum' },
  { medicineId: 'MED-104', name: 'Anti-TB Medicine', category: 'Infectious Disease', unit: 'packs', reorderLevel: 100, description: 'Rifampicin + Isoniazid combination therapy' },
  { medicineId: 'MED-105', name: 'Paracetamol 500mg', category: 'Analgesics', unit: 'tablets', reorderLevel: 1000, description: 'First-line fever and mild pain management' },
  { medicineId: 'MED-106', name: 'Amoxicillin 500mg', category: 'Antibiotics', unit: 'capsules', reorderLevel: 300, description: 'Broad spectrum penicillin antibiotic' },
  { medicineId: 'MED-107', name: 'Artemether-Lumefantrine', category: 'Antimalarial', unit: 'strips', reorderLevel: 150, description: 'First-line ACT antimalarial therapeutic' }
];

// GET /api/medicines
router.get('/', async (req, res) => {
  try {
    const list = await Medicine.find().lean();
    if (!list || list.length === 0) {
      return res.json(defaultMedicines);
    }
    res.json(list);
  } catch (err) {
    res.json(defaultMedicines);
  }
});

// GET /api/medicines/:id
router.get('/:id', async (req, res) => {
  try {
    const med = await Medicine.findOne({ medicineId: req.params.id }).lean();
    if (!med) {
      const fallback = defaultMedicines.find(m => m.medicineId === req.params.id);
      if (fallback) return res.json(fallback);
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json(med);
  } catch (err) {
    const fallback = defaultMedicines.find(m => m.medicineId === req.params.id);
    if (fallback) return res.json(fallback);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/medicines
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, category, unit, reorderLevel, description } = req.body;
    const medicineId = `MED-${Date.now().toString().slice(-4)}`;
    const newMed = new Medicine({
      medicineId,
      name,
      category,
      unit: unit || 'units',
      reorderLevel: Number(reorderLevel) || 100,
      description: description || ''
    });
    await newMed.save();
    res.status(201).json(newMed);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/medicines/:id
router.put('/:id', authenticate, async (req, res) => {
  try {
    const updated = await Medicine.findOneAndUpdate(
      { medicineId: req.params.id },
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/medicines/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await Medicine.findOneAndDelete({ medicineId: req.params.id });
    res.json({ message: 'Medicine removed successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
