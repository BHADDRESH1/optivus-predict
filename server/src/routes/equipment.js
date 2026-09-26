import express from 'express';
import { equipment } from '../data.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, (req, res) => res.json(equipment));

router.post('/', auth, (req, res) => {
  const item = { ...req.body, id: equipment.length + 1 };
  equipment.push(item);
  res.status(201).json(item);
});

export default router;
