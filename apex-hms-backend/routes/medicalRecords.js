const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { verifyToken, isHospitalStaffOrAdmin } = require('../middleware/authMiddleware');

// Apply protection to all medical records
router.use(verifyToken, isHospitalStaffOrAdmin);

// 1. GET all medical records for a specific patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    const records = await prisma.medicalRecord.findMany({
      where: {
        patientId: patientId,
        hospitalId: req.user.hospitalId // Security: Prevent cross-hospital data leaks
      },
      orderBy: { createdAt: 'desc' },
      include: {
        doctor: {
          select: { fullName: true } // Assuming your Staff/User model has fullName
        }
      }
    });

    res.json({ records });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Failed to fetch medical records' });
  }
});

// 2. CREATE a new medical record (Consultation Note)
router.post('/', async (req, res) => {
  try {
    const { 
      patientId, 
      diagnosis, 
      symptoms, 
      treatmentPlan, 
      notes, 
      vitals // e.g., BP, Heart Rate, Weight
    } = req.body;

    const newRecord = await prisma.medicalRecord.create({
      data: {
        patientId,
        hospitalId: req.user.hospitalId,
        doctorId: req.user.id, // The logged-in staff member
        diagnosis,
        symptoms,
        treatmentPlan,
        notes,
        vitals: vitals || {}, // Store as JSON if using PostgreSQL/MySQL
        visitDate: new Date()
      }
    });

    res.status(201).json({ 
      message: 'Medical record added successfully', 
      record: newRecord 
    });
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ error: 'Failed to create medical record' });
  }
});

module.exports = router;