import express from 'express';
import {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment
} from '../controllers/equipmentController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all equipment
router.get('/', getEquipment);

// Get single equipment
router.get('/:id', getEquipmentById);

// Create equipment (admin or supervisor only)
router.post('/', requireRole('admin'), createEquipment);

// Update equipment (admin or supervisor only)
router.put('/:id', requireRole('admin'), updateEquipment);

// Delete equipment (admin only)
router.delete('/:id', requireRole('admin'), deleteEquipment);

export default router;

