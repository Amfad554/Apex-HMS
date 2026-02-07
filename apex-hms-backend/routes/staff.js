const express = require('express');
const router = express.Router();

// Placeholder - implement CRUD operations similar to patients
router.get('/hospital/:hospitalId', (req, res) => {
  res.json({ message: 'Get all staff - to be implemented' });
});

router.post('/hospital/:hospitalId', (req, res) => {
  res.json({ message: 'Create staff - to be implemented' });
});

module.exports = router;