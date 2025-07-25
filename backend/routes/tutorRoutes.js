const express = require('express');
const router = express.Router();

const { loginTutor, addTutor } = require('../controllers/tutorController');
const { getPendingCertificates, reviewCertificate } = require('../controllers/certificateController');

const verifyAdmin = require('../middleware/verifyAdmin');
const tutorMiddleware = require('../middleware/tutorMiddleware');

const Tutor = require('../models/Tutor');

// 🔹 Add tutor (Admin-only)
router.post('/add', verifyAdmin, addTutor);

// 🔹 Tutor login
router.post('/login', loginTutor);

// 🔹 Get all pending certificates
router.get('/certificates/pending', tutorMiddleware, getPendingCertificates);

// 🔹 Review a certificate (approve/reject)
router.put('/certificates/:certificateId/review', tutorMiddleware, reviewCertificate);

// 🔹 Update tutor email
router.patch('/update-email', tutorMiddleware, async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const updated = await Tutor.findByIdAndUpdate(
      req.user.id,
      { email },
      { new: true }
    ).select('-password');

    res.status(200).json({ message: 'Email updated successfully', user: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating email', error: err });
  }
});

module.exports = router;
