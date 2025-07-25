// routes/certificateRoutes.js
const express = require('express');
const router = express.Router();
const { uploadCertificate, getMyCertificates } = require('../controllers/certificateController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/upload', authMiddleware, uploadCertificate);
router.get('/my-certificates', authMiddleware, getMyCertificates);

module.exports = router;
