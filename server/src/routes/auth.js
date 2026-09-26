import express from 'express';
import { users } from '../data.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = Buffer.from(`${user.id}:${user.username}`).toString('base64');
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

export default router;
