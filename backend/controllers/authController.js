const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 🔹 1. Send OTP to student's college email
exports.sendOtp = async (req, res) => {
  const { registerNumber } = req.body;

  if (!registerNumber) {
    return res.status(400).json({ message: 'Register number is required' });
  }

  const student = await Student.findOne({ registerNumber });
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const otp = generateOTP();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 mins

  student.otp = otp;
  student.otpExpiry = expiry;
  await student.save();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: student.email,
    subject: 'Your OTP for Activity Points App',
    text: `Your OTP is: ${otp}. It is valid for 10 minutes.`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to send OTP', error: err });
    }
    return res.status(200).json({ message: 'OTP sent successfully to your college email' });
  });
};

// 🔹 2. Verify OTP and allow password setup
exports.verifyOtpAndSetPassword = async (req, res) => {
  const { registerNumber, otp, password } = req.body;

  if (!registerNumber || !otp || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const student = await Student.findOne({ registerNumber });
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  if (student.otp !== otp || student.otpExpiry < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  student.password = hashedPassword;
  student.otp = null;
  student.otpExpiry = null;
  await student.save();

  return res.status(200).json({ message: 'Password set successfully. You can now login.' });
};

// 🔹 3. Login Student
exports.login = async (req, res) => {
  const { registerNumber, password } = req.body;

  if (!registerNumber || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const student = await Student.findOne({ registerNumber });

  if (!student || !student.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // ✅ JWT token with no expiry time
  const token = jwt.sign(
    { id: student._id, registerNumber: student.registerNumber },
    process.env.JWT_SECRET
  );

  return res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      name: student.name,
      registerNumber: student.registerNumber,
      email: student.email,
      role: student.role,
    },
  });
};


// 🔹 4. Get logged-in student profile (for token-protected access)
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user: student });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching user', error: err });
  }
};
