import { users } from '../data.js';

export default function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing authorization header' });
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = Buffer.from(token, 'base64').toString('ascii').split(':');
    const id = Number(decoded[0]);
    const user = users.find((u) => u.id === id);
    if (!user) throw new Error('Invalid');
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
