const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { verifyToken, belongsToHospital } = require('../middleware/authMiddleware');

// 1. GET all appointments for a hospital
// Accessible by Hospital Staff/Admins
router.get('/hospital/:hospitalId', verifyToken, belongsToHospital, async (req, res) => {
  try {
    const { hospitalId } = req.params;

    const appointments = await prisma.appointment.findMany({
      where: { hospitalId: hospitalId },
      include: {
        patient: { select: { fullName: true, patientNumber: true } },
        doctor: { select: { fullName: true } }
      },
      orderBy: { appointmentDate: 'asc' }
    });

    res.json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// 2. BOOK a new appointment
router.post('/hospital/:hospitalId', verifyToken, async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { patientId, doctorId, appointmentDate, reason, type } = req.body;

    const newAppointment = await prisma.appointment.create({
      data: {
        hospitalId,
        patientId,
        doctorId,
        appointmentDate: new Date(appointmentDate),
        reason,
        type: type || 'General', // e.g., Consultation, Follow-up, Emergency
        status: 'Scheduled'      // Default status
      }
    });

    res.status(201).json({ 
      message: 'Appointment booked successfully', 
      appointment: newAppointment 
    });
  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// 3. UPDATE appointment status (e.g., Completed, Cancelled)
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status }
    });

    res.json({ message: `Appointment marked as ${status}`, updated });
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;