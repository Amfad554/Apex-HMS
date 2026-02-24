const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const crypto  = require('crypto');
const prisma  = require('../lib/prisma');
const { verifyToken, isHospitalAdmin, belongsToHospital } = require('../middleware/authMiddleware');

// ─── Secure temp password generator ──────────────────────────────────────────
const generateTempPassword = () =>
  crypto.randomBytes(12).toString('base64url').slice(0, 12);

// ─── GET /api/staff/:hospitalId ───────────────────────────────────────────────
router.get('/:hospitalId', verifyToken, belongsToHospital, async (req, res) => {
  try {
    const hospitalId = parseInt(req.params.hospitalId);
    const { search, role, page = '1', limit = '25' } = req.query;

    const take = Math.min(parseInt(limit), 100);
    const skip = (Math.max(parseInt(page), 1) - 1) * take;

    const where = {
      hospitalId,
      ...(role && { role }),
      ...(search && {
        OR: [
          { fullName:    { contains: search, mode: 'insensitive' } },
          { email:       { contains: search, mode: 'insensitive' } },
          { department:  { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [staff, total] = await Promise.all([
      prisma.hospitalStaff.findMany({
        where,
        select: {
          id: true, fullName: true, email: true, role: true,
          specialty: true, department: true, phone: true,
          status: true, createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      prisma.hospitalStaff.count({ where }),
    ]);

    return res.json({ staff, total, page: parseInt(page), limit: take });
  } catch (err) {
    console.error('[GET /staff]', err);
    return res.status(500).json({ error: 'Failed to fetch staff.' });
  }
});

// ─── POST /api/staff ──────────────────────────────────────────────────────────
router.post('/', verifyToken, isHospitalAdmin, async (req, res) => {
  try {
    const { fullName, email, role, department, specialty, phone } = req.body;
    const hospitalId = req.user.hospital_id;

    // ── Validation ──────────────────────────────────────────────────────────
    if (!fullName?.trim() || !email?.trim() || !role)
      return res.status(400).json({ error: 'fullName, email and role are required.' });

    const validRoles = ['doctor', 'nurse', 'pharmacist', 'lab_staff', 'receptionist'];
    if (!validRoles.includes(role))
      return res.status(400).json({ error: `Role must be one of: ${validRoles.join(', ')}` });

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.hospitalStaff.findFirst({
      where: { hospitalId, email: normalizedEmail },
    });
    if (existing)
      return res.status(409).json({ error: 'A staff member with this email already exists in your hospital.' });

    // ── Secure credential generation ─────────────────────────────────────────
    const tempPassword = generateTempPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const staff = await prisma.hospitalStaff.create({
      data: {
        hospitalId,
        fullName:   fullName.trim(),
        email:      normalizedEmail,
        role,
        department: department?.trim() || null,
        specialty:  specialty?.trim()  || null,
        phone:      phone?.trim()      || null,
        passwordHash,
        status:     'active',
      },
      select: {
        id: true, fullName: true, email: true, role: true,
        department: true, specialty: true, phone: true,
        status: true, createdAt: true,
      },
    });

    // TODO: await sendCredentialsEmail(normalizedEmail, fullName, tempPassword);
    // Log server-side only until email is configured — NEVER send in response body
    console.log(`[Staff created] ${normalizedEmail} | temp: ${tempPassword}`);

    return res.status(201).json({
      message: 'Staff member added successfully. Credentials logged server-side until email is configured.',
      staff,
    });
  } catch (err) {
    console.error('[POST /staff]', err);
    return res.status(500).json({ error: 'Failed to add staff member.' });
  }
});

// ─── PATCH /api/staff/:id/status ─────────────────────────────────────────────
router.patch('/:id/status', verifyToken, isHospitalAdmin, async (req, res) => {
  try {
    const id         = parseInt(req.params.id);
    const hospitalId = req.user.hospital_id;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status))
      return res.status(400).json({ error: 'Status must be active or inactive.' });

    const staff = await prisma.hospitalStaff.findFirst({ where: { id, hospitalId } });
    if (!staff) return res.status(404).json({ error: 'Staff member not found.' });

    const updated = await prisma.hospitalStaff.update({
      where: { id },
      data:  { status },
      select: { id: true, fullName: true, status: true },
    });

    return res.json({ message: `Staff marked as ${status}.`, staff: updated });
  } catch (err) {
    console.error('[PATCH /staff/status]', err);
    return res.status(500).json({ error: 'Failed to update staff status.' });
  }
});

// ─── DELETE /api/staff/:id ────────────────────────────────────────────────────
router.delete('/:id', verifyToken, isHospitalAdmin, async (req, res) => {
  try {
    const id         = parseInt(req.params.id);
    const hospitalId = req.user.hospital_id;

    const staff = await prisma.hospitalStaff.findFirst({ where: { id, hospitalId } });
    if (!staff) return res.status(404).json({ error: 'Staff member not found.' });

    await prisma.hospitalStaff.delete({ where: { id } });

    return res.json({ message: 'Staff member removed successfully.' });
  } catch (err) {
    console.error('[DELETE /staff]', err);
    return res.status(500).json({ error: 'Failed to delete staff member.' });
  }
});

module.exports = router;