import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import itemsRoutes from './src/routes/items.js';
import usersRoutes from './src/routes/users.js';
import alertRoutes from './src/routes/alerts.js';
import medicinesRoutes from './src/routes/medicines.js';
import inventoryRoutes from './src/routes/inventory.js';
import predictionsRoutes from './src/routes/predictions.js';
import analyticsRoutes from './src/routes/analytics.js';
import redistributionRoutes from './src/routes/redistribution.js';
import facilitiesRoutes from './src/routes/facilities.js';
import { errorHandler } from './src/middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Security
app.use(helmet());

// CORS - support both origin reflection for credentials and explicit CORS_ORIGIN
const allowedOrigin = process.env.CORS_ORIGIN;
app.use(cors({
  origin: allowedOrigin && allowedOrigin !== '*' ? allowedOrigin.split(',').map(s => s.trim()) : true,
  credentials: true
}));

// Request logger
app.use(morgan('dev'));

// Body
app.use(express.json());

// Rate limiter
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// DB auto-connect middleware for serverless invocations
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    // Continue; route handlers or demo mode will handle gracefully
  }
  next();
});

// Health Checks
app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'OPTIVUS Predict', time: new Date() }));
app.get('/health', (req, res) => res.json({ status: 'ok', app: 'OPTIVUS Predict', time: new Date() }));

// Core Authentication & Users
app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/users', usersRoutes);

// Medicine Domain API Endpoints (Section 16)
app.use('/api/medicines', medicinesRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/predictions', predictionsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/redistribution', redistributionRoutes);
app.use('/api/facilities', facilitiesRoutes);
app.use('/api/alerts', alertRoutes);

// Error handler
app.use(errorHandler);

// Start for local development
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
  }
};

if (!process.env.VERCEL) {
  start();
}

export default app;
