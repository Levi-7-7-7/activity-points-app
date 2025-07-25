const Student = require('../models/Student');
const Tutor = require('../models/Tutor');
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

// 🔹 1. Send OTP to user's college email
exports.sendOtp = async (req, res) => {
  const { registerNumber } = req.body;

  if (!registerNumber) {
    return res.status(400).json({ message: 'Register number is required' });
  }

  // Try finding in Student
  let user = await Student.findOne({ registerNumber });
  let role = 'student';

  // If not found, check Tutor
  if (!user) {
    user = await Tutor.findOne({ registerNumber });
    role = 'tutor';
  }

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const otp = generateOTP();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 mins

  user.otp = otp;
  user.otpExpiry = expiry;
  await user.save();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
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

  let user = await Student.findOne({ registerNumber });
  let role = 'student';

  if (!user) {
    user = await Tutor.findOne({ registerNumber });
    role = 'tutor';
  }

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.otp !== otp || user.otpExpiry < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  return res.status(200).json({ message: 'Password set successfully. You can now login.' });
};

// 🔹 3. Login (Student or Tutor)
exports.login = async (req, res) => {
  const { registerNumber, password } = req.body;

  if (!registerNumber || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  let user = await Student.findOne({ registerNumber });
  let role = 'student';

  if (!user) {
    user = await Tutor.findOne({ registerNumber });
    role = 'tutor';
  }

  if (!user || !user.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user._id, registerNumber: user.registerNumber, role },
    process.env.JWT_SECRET
  );

  return res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      name: user.name,
      registerNumber: user.registerNumber,
      email: user.email,
      role
    }
  });
};

// 🔹 4. Get profile of the logged-in user
exports.getProfile = async (req, res) => {
  try {
    const { role } = req.user;
    let user;

    if (role === 'tutor') {
      user = await Tutor.findById(req.user.id).select('-password');
    } else {
      user = await Student.findById(req.user.id).select('-password');
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching user', error: err });
  }
};
