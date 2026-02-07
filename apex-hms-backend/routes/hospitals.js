const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma'); // Import Prisma client
const { verifyToken, isHospitalAdmin, belongsToHospital } = require('../middleware/authMiddleware');

// GET hospital profile
router.get('/:hospitalId', verifyToken, belongsToHospital, async (req, res) => {
  try {
    const { hospitalId } = req.params;
    
    // Prisma equivalent of SELECT
    const hospital = await prisma.hospital.findUnique({
      where: { id: parseInt(hospitalId) },
      select: {
        id: true,
        hospitalName: true,
        hospitalType: true,
        address: true,
        phone: true,
        email: true,
        licenseNumber: true,
      }
    });

    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    res.json({ hospital });
  } catch (error) {
    console.error('Error fetching hospital:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE hospital profile
router.put('/:hospitalId', verifyToken, isHospitalAdmin, belongsToHospital, async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { hospitalName, address, phone } = req.body;

    // Prisma equivalent of UPDATE
    const updatedHospital = await prisma.hospital.update({
      where: { id: parseInt(hospitalId) },
      data: {
        hospitalName: hospitalName,
        address: address,
        phone: phone,
      },
    });

    res.json({ 
      message: 'Hospital updated successfully',
      hospital: updatedHospital 
    });
  } catch (error) {
    console.error('Prisma Update Error:', error);
    res.status(500).json({ error: 'Failed to update hospital' });
  }
});

module.exports = router;