import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all tasks
router.get('/', getTasks);

// Get single task
router.get('/:id', getTaskById);

// Create task (admin or supervisor only)
router.post('/', requireRole('admin'), createTask);

// Update task
router.put('/:id', updateTask);

// Delete task (admin only)
router.delete('/:id', requireRole('admin'), deleteTask);

export default router;

