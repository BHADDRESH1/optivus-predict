import express from 'express';
import {
  getMaintenanceLogs,
  getMaintenanceLogById,
  createMaintenanceLog,
  updateMaintenanceLog,
  deleteMaintenanceLog
} from '../controllers/maintenanceLogController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all maintenance logs
router.get('/', getMaintenanceLogs);

// Get single maintenance log
router.get('/:id', getMaintenanceLogById);

// Create maintenance log
router.post('/', createMaintenanceLog);

// Update maintenance log
router.put('/:id', updateMaintenanceLog);

// Delete maintenance log (admin only)
router.delete('/:id', requireRole('admin'), deleteMaintenanceLog);

export default router;

