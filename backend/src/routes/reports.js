import express from 'express';
import {
  getDashboardStats,
  getComplianceReport,
  getEquipmentReport,
  getTaskReport
} from '../controllers/reportsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Dashboard statistics
router.get('/dashboard', getDashboardStats);

// Compliance report
router.get('/compliance', getComplianceReport);

// Equipment report
router.get('/equipment', getEquipmentReport);

// Task report
router.get('/tasks', getTaskReport);

export default router;

