import express from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all users (admin only)
router.get('/', requireRole('admin'), getUsers);

// Get single user
router.get('/:id', getUser);

// Create user (admin only)
router.post('/', requireRole('admin'), createUser);

// Update user (admin or self)
router.put('/:id', updateUser);

// Delete user (admin only)
router.delete('/:id', requireRole('admin'), deleteUser);

export default router;

