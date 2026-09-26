import express from 'express';
import { reports } from '../data.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, (req, res) => res.json(reports));

router.post('/', auth, (req, res) => {
  const item = { ...req.body, id: reports.length + 1, createdAt: new Date() };
  reports.push(item);
  res.status(201).json(item);
});

export default router;
