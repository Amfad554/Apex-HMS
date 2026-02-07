const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma'); // Import your Prisma client
const { verifyToken, isHospitalStaffOrAdmin, belongsToHospital } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes in this file
router.use(verifyToken, isHospitalStaffOrAdmin);

// 1. GET all patients for a hospital
router.get('/hospital/:hospitalId', belongsToHospital, async (req, res) => {
  try {
    const { hospitalId } = req.params;

    const patients = await prisma.patient.findMany({
      where: { hospitalId: hospitalId }, // Or parseInt(hospitalId) if using Int IDs
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        patientNumber: true,
        fullName: true,
        dateOfBirth: true,
        gender: true,
        phone: true,
        email: true,
        bloodGroup: true,
        createdAt: true
      }
    });

    res.json({ patients });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// 2. GET single patient
router.get('/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await prisma.patient.findFirst({
      where: {
        id: patientId,
        hospitalId: req.user.hospitalId // Security: Ensure staff belongs to the same hospital
      }
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Prisma doesn't return the password unless you explicitly select it, 
    // but just in case:
    if (patient.password) delete patient.password;

    res.json({ patient });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

// 3. CREATE new patient
router.post('/hospital/:hospitalId', belongsToHospital, async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const {
      fullName,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      bloodGroup,
      medicalConditions,
      nextOfKinName,
      nextOfKinPhone
    } = req.body;

    // Generate patient number using Prisma count
    const patientCount = await prisma.patient.count({
      where: { hospitalId: hospitalId }
    });
    const patientNumber = `P${String(patientCount + 1).padStart(6, '0')}`;

    const newPatient = await prisma.patient.create({
      data: {
        hospitalId,
        patientNumber,
        fullName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        phone,
        email,
        address,
        bloodGroup,
        medicalConditions,
        nextOfKinName,
        nextOfKinPhone
      }
    });

    res.status(201).json({
      message: 'Patient registered successfully',
      patient: newPatient
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Failed to create patient' });
  }
});

// 4. UPDATE patient
router.put('/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const updateData = req.body;

    // Security: findFirst ensures the patient belongs to the hospital of the staff
    const updatedPatient = await prisma.patient.updateMany({
      where: {
        id: patientId,
        hospitalId: req.user.hospitalId
      },
      data: updateData
    });

    if (updatedPatient.count === 0) {
      return res.status(404).json({ error: 'Patient not found or unauthorized' });
    }

    res.json({ message: 'Patient updated successfully' });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ error: 'Failed to update patient' });
  }
});

// 5. DELETE patient
router.delete('/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    const deleted = await prisma.patient.deleteMany({
      where: {
        id: patientId,
        hospitalId: req.user.hospitalId
      }
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: 'Patient not found or unauthorized' });
    }

    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ error: 'Failed to delete patient' });
  }
});

module.exports = router;