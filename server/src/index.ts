import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import columnRoutes from './routes/columnRoutes.js';
import tweetRoutes from './routes/tweetRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { config } from './utils/config.js';
import { startScheduler } from './jobs/scheduler.js';

const app = express();

app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/tweets', tweetRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use(errorHandler);

startScheduler();

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
