const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('combined'));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 500,
  message: { success: false, message: 'Trop de requêtes. Veuillez réessayer plus tard.' }
});
app.use(limiter);


app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'OFPPT API Gateway',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    services: {
      auth: process.env.AUTH_SERVICE_URL,
      users: process.env.USER_SERVICE_URL,
      formations: process.env.FORMATION_SERVICE_URL,
      plans: process.env.PLAN_SERVICE_URL,
      notifications: process.env.NOTIFICATION_SERVICE_URL
    }
  });
});


const proxyOptions = (target, apiPrefix) => ({
  target,
  changeOrigin: true,
  pathRewrite: (path, req) => `${apiPrefix}${path}`,
  on: {
    error: (err, req, res) => {
      console.error(`[Gateway] Proxy error to ${target}:`, err.message);
      res.status(503).json({ success: false, message: `Service temporairement indisponible.` });
    },
    proxyReq: (proxyReq, req) => {
      if (req.user) {
        proxyReq.setHeader('X-User-Id', req.user.id);
        proxyReq.setHeader('X-User-Role', req.user.role);
        proxyReq.setHeader('X-User-Email', req.user.email);
      }
    }
  }
});


app.use('/api/auth', createProxyMiddleware(proxyOptions(process.env.AUTH_SERVICE_URL || 'http://auth-service:5001', '/api/auth')));

// User et Intervenant
app.use('/api/users', createProxyMiddleware(proxyOptions(process.env.USER_SERVICE_URL || 'http://user-service:5002', '/api/users')));
app.use('/api/intervenants', createProxyMiddleware(proxyOptions(process.env.USER_SERVICE_URL || 'http://user-service:5002', '/api/intervenants')));
app.use('/api/postulations', createProxyMiddleware(proxyOptions(process.env.USER_SERVICE_URL || 'http://user-service:5002', '/api/postulations')));

// Formations et Thèmes
app.use('/api/themes', createProxyMiddleware(proxyOptions(process.env.FORMATION_SERVICE_URL || 'http://formation-service:5003', '/api/themes')));
app.use('/api/formations', createProxyMiddleware(proxyOptions(process.env.FORMATION_SERVICE_URL || 'http://formation-service:5003', '/api/formations')));

// Plans
app.use('/api/plans', createProxyMiddleware(proxyOptions(process.env.PLAN_SERVICE_URL || 'http://plan-service:5004', '/api/plans')));

// Notifications
app.use('/api/notifications', createProxyMiddleware(proxyOptions(process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:5005', '/api/notifications')));


app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} introuvable.` });
});

app.listen(PORT, () => {
  console.log(`🚀 OFPPT API Gateway running on port ${PORT}`);
  console.log(`   Auth     → ${process.env.AUTH_SERVICE_URL}`);
  console.log(`   Users    → ${process.env.USER_SERVICE_URL}`);
  console.log(`   Formations → ${process.env.FORMATION_SERVICE_URL}`);
  console.log(`   Plans    → ${process.env.PLAN_SERVICE_URL}`);
  console.log(`   Notifs   → ${process.env.NOTIFICATION_SERVICE_URL}`);
});
