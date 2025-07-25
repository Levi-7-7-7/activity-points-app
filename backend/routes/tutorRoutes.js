// routes/tutorRoutes.js
const express = require('express');
const router = express.Router();
const { loginTutor, addTutor } = require('../controllers/tutorController');
const verifyAdmin = require('../middleware/verifyAdmin');
const { getPendingCertificates, reviewCertificate } = require('../controllers/certificateController');
const tutorMiddleware = require('../middleware/tutorMiddleware');

router.post('/add', verifyAdmin, addTutor); // Already exists
router.post('/login', loginTutor);          // Add this
router.get('/certificates/pending', tutorMiddleware, getPendingCertificates);
router.put('/certificates/:certificateId/review', tutorMiddleware, reviewCertificate);


module.exports = router;
