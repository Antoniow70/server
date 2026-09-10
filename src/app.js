import express from 'express';
import cors from 'cors';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

// Import module routers
import { authRouter } from './modules/auth/index.js';
import { beneficiariosRouter } from './modules/beneficiarios/index.js';
import { projetosRouter } from './modules/projetos/index.js';
import { equipaRouter } from './modules/equipa/index.js';
import { voluntariosRouter } from './modules/voluntarios/index.js';
import { parceirosRouter } from './modules/parceiros/index.js';
import { doacoesRouter } from './modules/doacoes/index.js';
import { suporteRouter } from './modules/suporte/index.js';
import { uploadRouter } from './modules/upload/index.js';
import { reportsRouter } from './modules/reports/index.js';
import { documentosRouter } from './modules/documentos/index.js';
import { noticiasRouter } from './modules/noticias/index.js';

const app = express();

// ─── Global Middlewares ──────────────────────────────────
const allowedOrigins = [
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : []),
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : []),
  // Explicit production domains
  'https://alem-eight.vercel.app',
  'https://client-theta-one-74.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://0.0.0.0:3000',
  'http://0.0.0.0:5173'
]
  .map(origin => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    // Normalize request origin by removing trailing slash if present
    const normalizedOrigin = origin.replace(/\/$/, '');

    // Check standard allowed list
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // Allow ANY Vercel deployment domain (production and preview)
    if (/^https:\/\/[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.vercel\.app$/.test(normalizedOrigin)) {
      return callback(null, true);
    }

    // Allow requests from local network IPs (e.g. 192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    const isLocalOrNetwork = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/.test(normalizedOrigin);
    if (isLocalOrNetwork || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    console.warn(`[CORS] Origem bloqueada: ${origin}`);
    return callback(new Error(`A política CORS não permite acesso desta origem: ${origin}`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11) choke on 204
};

// Handle preflight requests for ALL routes
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(rateLimiter);

// ─── Health Check ────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API ALEM a funcionar',
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API ALEM a funcionar',
    timestamp: new Date().toISOString()
  });
});

// ─── API Routes ──────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/beneficiarios', beneficiariosRouter);
app.use('/api/projetos', projetosRouter);
app.use('/api/equipa', equipaRouter);
app.use('/api/voluntarios', voluntariosRouter);
app.use('/api/parceiros', parceirosRouter);
app.use('/api/doacoes', doacoesRouter);
app.use('/api/suporte', suporteRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/documentos', documentosRouter);
app.use('/api/noticias', noticiasRouter);

// ─── 404 Handler ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Rota ${req.method} ${req.originalUrl} não encontrada.` });
});

// ─── Global Error Handler ────────────────────────────────
app.use(errorHandler);

export default app;
