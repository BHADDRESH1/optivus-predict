import express from 'express';
import {
  verifyTask,
  getPendingVerifications
} from '../controllers/aiVerificationController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get pending verifications (admin or supervisor only)
router.get('/pending', requireRole('admin'), getPendingVerifications);

// Verify a task (admin or supervisor only)
router.post('/verify/:taskId', requireRole('admin'), verifyTask);

export default router;

