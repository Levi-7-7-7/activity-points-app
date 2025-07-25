// middleware/tutorMiddleware.js

const jwt = require('jsonwebtoken');
const Tutor = require('../models/Tutor');

const verifyTutor = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tutor = await Tutor.findById(decoded.id).select('-password'); // Exclude password

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    req.user = {
      id: tutor._id,
      name: tutor.name,
      email: tutor.email,
      role: 'tutor'
    };

    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = verifyTutor;
