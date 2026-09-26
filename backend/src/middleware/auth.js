import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
    const token = header.replace('Bearer ', '');
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = { sub: payload.sub, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  // Allow both 'admin' and 'Admin' roles
  const userRole = req.user.role?.toLowerCase();
  const requiredRole = role?.toLowerCase();
  if (userRole !== requiredRole && userRole !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};
