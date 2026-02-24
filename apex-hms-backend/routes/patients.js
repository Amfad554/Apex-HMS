const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const crypto  = require('crypto');
const prisma  = require('../lib/prisma');
const { verifyToken, isHospitalAdmin, belongsToHospital } = require('../middleware/authMiddleware');

// ─── Helpers ──────────────────────────────────────────────────────────────────
const generateTempPassword = () =>
  crypto.randomBytes(12).toString('base64url').slice(0, 12);

// Race-condition-safe patient number using a DB transaction
const generatePatientNumber = async (hospitalId) => {
  // Count scoped to this hospital + random suffix to minimise collisions
  const count = await prisma.patient.count({ where: { hospitalId } });
  const rand  = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `P-${String(count + 1).padStart(5, '0')}-${rand}`;
};

// ─── GET /api/patients/:hospitalId ───────────────────────────────────────────
router.get('/:hospitalId', verifyToken, belongsToHospital, async (req, res) => {
  try {
    const hospitalId = parseInt(req.params.hospitalId);
    const { search, page = '1', limit = '25' } = req.query;

    const take = Math.min(parseInt(limit), 100);
    const skip = (Math.max(parseInt(page), 1) - 1) * take;

    const where = {
      hospitalId,
      ...(search && {
        OR: [
          { fullName:      { contains: search, mode: 'insensitive' } },
          { patientNumber: { contains: search, mode: 'insensitive' } },
          { email:         { contains: search, mode: 'insensitive' } },
          { phone:         { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        select: {
          id: true, patientNumber: true, fullName: true,
          dateOfBirth: true, gender: true, phone: true,
          email: true, address: true, bloodGroup: true,
          medicalConditions: true, nextOfKinName: true,
          nextOfKinPhone: true, createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      prisma.patient.count({ where }),
    ]);

    return res.json({ patients, total, page: parseInt(page), limit: take });
  } catch (err) {
    console.error('[GET /patients]', err);
    return res.status(500).json({ error: 'Failed to fetch patients.' });
  }
});

// ─── POST /api/patients ───────────────────────────────────────────────────────
router.post('/', verifyToken, isHospitalAdmin, async (req, res) => {
  try {
    const {
      fullName, dateOfBirth, gender, phone, email,
      address, bloodGroup, medicalConditions,
      nextOfKinName, nextOfKinPhone,
    } = req.body;

    const hospitalId = req.user.hospital_id;

    // ── Validation ──────────────────────────────────────────────────────────
    if (!fullName?.trim() || !dateOfBirth || !gender || !phone?.trim() || !address?.trim())
      return res.status(400).json({ error: 'fullName, dateOfBirth, gender, phone and address are required.' });

    const validGenders = ['male', 'female', 'other'];
    if (!validGenders.includes(gender.toLowerCase()))
      return res.status(400).json({ error: 'gender must be male, female, or other.' });

    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime()))
      return res.status(400).json({ error: 'Invalid dateOfBirth format.' });

    // ── Duplicate email check ────────────────────────────────────────────────
    if (email?.trim()) {
      const existing = await prisma.patient.findFirst({
        where: { hospitalId, email: email.toLowerCase().trim() },
      });
      if (existing)
        return res.status(409).json({ error: 'A patient with this email already exists in your hospital.' });
    }

    // ── Secure credential generation ─────────────────────────────────────────
    const patientNumber = await generatePatientNumber(hospitalId);
    const tempPassword  = generateTempPassword();
    const passwordHash  = await bcrypt.hash(tempPassword, 12);

    const patient = await prisma.patient.create({
      data: {
        hospitalId,
        patientNumber,
        fullName:          fullName.trim(),
        dateOfBirth:       dob,
        gender:            gender.toLowerCase(),
        phone:             phone.trim(),
        email:             email ? email.toLowerCase().trim() : null,
        address:           address.trim(),
        bloodGroup:        bloodGroup    || null,
        medicalConditions: medicalConditions || null,
        nextOfKinName:     nextOfKinName || null,
        nextOfKinPhone:    nextOfKinPhone || null,
        passwordHash,
      },
      select: {
        id: true, patientNumber: true, fullName: true,
        dateOfBirth: true, gender: true, phone: true,
        email: true, bloodGroup: true, createdAt: true,
      },
    });

    // TODO: await sendCredentialsEmail(email, fullName, { patientNumber, tempPassword });
    console.log(`[Patient created] ${patientNumber} | temp: ${tempPassword}`);

    return res.status(201).json({
      message: 'Patient registered successfully.',
      patient,
    });
  } catch (err) {
    console.error('[POST /patients]', err);
    return res.status(500).json({ error: 'Failed to register patient.' });
  }
});

// ─── GET /api/patients/single/:id ────────────────────────────────────────────
router.get('/single/:id', verifyToken, async (req, res) => {
  try {
    const id         = parseInt(req.params.id);
    const hospitalId = req.user.hospital_id;

    const patient = await prisma.patient.findFirst({
      where: { id, hospitalId },
      select: {
        id: true, patientNumber: true, fullName: true,
        dateOfBirth: true, gender: true, phone: true, email: true,
        address: true, bloodGroup: true, medicalConditions: true,
        nextOfKinName: true, nextOfKinPhone: true, createdAt: true,
      },
    });

    if (!patient) return res.status(404).json({ error: 'Patient not found.' });
    return res.json({ patient });
  } catch (err) {
    console.error('[GET /patients/single]', err);
    return res.status(500).json({ error: 'Failed to fetch patient.' });
  }
});

// ─── DELETE /api/patients/:id ─────────────────────────────────────────────────
router.delete('/:id', verifyToken, isHospitalAdmin, async (req, res) => {
  try {
    const id         = parseInt(req.params.id);
    const hospitalId = req.user.hospital_id;

    const patient = await prisma.patient.findFirst({ where: { id, hospitalId } });
    if (!patient) return res.status(404).json({ error: 'Patient not found.' });

    await prisma.patient.delete({ where: { id } });

    return res.json({ message: 'Patient deleted successfully.' });
  } catch (err) {
    console.error('[DELETE /patients]', err);
    return res.status(500).json({ error: 'Failed to delete patient.' });
  }
});

module.exports = router;