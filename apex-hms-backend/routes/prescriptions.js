const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { verifyToken, isHospitalStaffOrAdmin } = require('../middleware/authMiddleware');

// Apply protection to all prescription routes
router.use(verifyToken, isHospitalStaffOrAdmin);

// 1. GET all prescriptions for a specific patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    const prescriptions = await prisma.prescription.findMany({
      where: {
        patientId: patientId,
        hospitalId: req.user.hospitalId // Security: Only see prescriptions from your hospital
      },
      orderBy: { createdAt: 'desc' },
      include: {
        doctor: { // Optional: include doctor name from staff/user table
          select: { fullName: true }
        }
      }
    });

    res.json({ prescriptions });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
});

// 2. CREATE a new prescription
router.post('/', async (req, res) => {
  try {
    const { 
      patientId, 
      medicationName, 
      dosage, 
      frequency, 
      duration, 
      instructions 
    } = req.body;

    // hospitalId and doctorId come from the logged-in user's token
    const newPrescription = await prisma.prescription.create({
      data: {
        patientId,
        hospitalId: req.user.hospitalId,
        doctorId: req.user.id, 
        medicationName,
        dosage,
        frequency,
        duration,
        instructions,
        dateIssued: new Date()
      }
    });

    res.status(201).json({ 
      message: 'Prescription issued successfully', 
      prescription: newPrescription 
    });
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({ error: 'Failed to create prescription' });
  }
});

// 3. DELETE a prescription (if made in error)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.prescription.deleteMany({
      where: {
        id: id,
        hospitalId: req.user.hospitalId // Security: Can't delete from other hospitals
      }
    });

    res.json({ message: 'Prescription removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;