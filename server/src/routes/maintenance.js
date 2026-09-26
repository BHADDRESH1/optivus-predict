import express from 'express';
import { maintenance } from '../data.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, (req, res) => res.json(maintenance));

router.post('/', auth, (req, res) => {
  const item = { ...req.body, id: maintenance.length + 1, createdAt: new Date() };
  maintenance.push(item);
  res.status(201).json(item);
});

export default router;
