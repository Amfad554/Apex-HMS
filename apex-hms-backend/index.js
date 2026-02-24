const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const hospitalRoutes = require('./routes/hospitals');
const adminRoutes = require('./routes/admin');
const patientRoutes = require('./routes/patients');
const staffRoutes = require('./routes/staff');
const appointmentRoutes = require('./routes/appointments');
const prescriptionRoutes = require('./routes/prescriptions');
const medicalRecordRoutes = require('./routes/medicalRecords');

// ── New auth routes (staff/patient login, change-password, /me) ──
const staffPatientAuthRoutes = require('./routes/staff');

// Initialize Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'HMS Backend Server is running',
    timestamp: new Date().toISOString()
  });
});

// ── API Routes ──────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/auth', staffPatientAuthRoutes); // staff/patient login, /me, change-password
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/medical-records', medicalRecordRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ── Start server ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  const dbStatus = process.env.DATABASE_URL ? 'Connected (Neon/Prisma)' : 'Not configured';
  console.log(`
  ╔════════════════════════════════════════╗
  ║    🏥 HMS Backend Server Running       ║
  ║    Port: ${PORT}                         ║
  ║    Environment: ${process.env.NODE_ENV || 'development'}      ║
  ║    Database: ${dbStatus}               ║
  ╚════════════════════════════════════════╝
  `);

  // ── Neon DB keep-alive (prevents cold starts on free tier) ────
  const prisma = require('./lib/prisma');
  setInterval(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('[keep-alive] DB pinged');
    } catch (e) {
      console.error('[keep-alive] ping failed:', e.message);
    }
  }, 4 * 60 * 1000); // every 4 minutes
});

module.exports = app;