import express from 'express';
import {
  getCalendarEvents,
  getUpcomingEvents
} from '../controllers/calendarController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get calendar events
router.get('/events', getCalendarEvents);

// Get upcoming events
router.get('/upcoming', getUpcomingEvents);

export default router;

