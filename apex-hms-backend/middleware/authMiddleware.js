const jwt = require('jsonwebtoken');

// Verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Check if user is Super Admin
const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Access denied. Super Admin only.' });
  }
  next();
};

// Check if user is Hospital Admin
const isHospitalAdmin = (req, res, next) => {
  if (req.user.role !== 'hospital_admin') {
    return res.status(403).json({ error: 'Access denied. Hospital Admin only.' });
  }
  next();
};

// Check if user belongs to the hospital
const belongsToHospital = (req, res, next) => {
  const hospitalId = parseInt(req.params.hospitalId || req.body.hospitalId);
  
  if (req.user.role === 'super_admin') {
    // Super admin can access any hospital
    return next();
  }

  if (req.user.hospital_id !== hospitalId) {
    return res.status(403).json({ error: 'Access denied. You can only access your own hospital data.' });
  }
  
  next();
};

// Check if user is hospital staff or admin
const isHospitalStaffOrAdmin = (req, res, next) => {
  if (!['hospital_admin', 'doctor', 'nurse', 'pharmacist', 'lab_staff', 'receptionist'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied. Hospital staff only.' });
  }
  next();
};

module.exports = {
  verifyToken,
  isSuperAdmin,
  isHospitalAdmin,
  belongsToHospital,
  isHospitalStaffOrAdmin
};