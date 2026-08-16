import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env or backend .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import { logger } from './utils/logger.js';
import contactRouter from './routes/contact.js';

const app = express();

// Security headers with open CSP for smooth local development & Angular styles/fonts
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Restrict CORS to your actual frontend origin in production.
app.use(
  cors({
    origin: '*',
    methods: ['POST', 'GET'],
  })
);

app.use(express.json({ limit: '20kb' }));

// Basic request logging (method, path, status, latency) without bodies.
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info('request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      ms: Date.now() - start,
      ip: req.ip,
    });
  });
  next();
});

// Health check endpoint
app.get('/health', (_req, res) => res.json({ ok: true }));

// Recent logs view endpoint (for easy inspection)
app.get('/api/logs', (_req, res) => {
  const logFilePath = path.resolve(__dirname, 'logs/combined.log');
  if (!fs.existsSync(logFilePath)) {
    return res.json({ ok: true, logs: [] });
  }

  try {
    const data = fs.readFileSync(logFilePath, 'utf8');
    const lines = data.trim().split('\n').filter(Boolean);
    const recent = lines.slice(-50).map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return { message: l };
      }
    });
    res.json({ ok: true, count: recent.length, logs: recent });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// API Routes
app.use('/api/contact', contactRouter);

// Serve built Angular frontend static files if present
const distPath = path.resolve(__dirname, '../frontend/dist/portfolio-frontend');
const distBrowserPath = path.join(distPath, 'browser');
const staticPath = fs.existsSync(distBrowserPath)
  ? distBrowserPath
  : fs.existsSync(distPath)
    ? distPath
    : null;

if (staticPath) {
  logger.info('serving_static_frontend', { path: staticPath });
  app.use(express.static(staticPath));

  // Catch-all SPA route: Send index.html for any frontend navigation routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

// Generic error handler — never leak stack traces to clients.
app.use((err, _req, res, _next) => {
  logger.error('unhandled_error', { error: err.message });
  res.status(500).json({ ok: false, message: 'Internal server error.' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`server_started`, {
    port: PORT,
    env: process.env.NODE_ENV || 'development',
    url: `http://localhost:${PORT}`,
  });
});
