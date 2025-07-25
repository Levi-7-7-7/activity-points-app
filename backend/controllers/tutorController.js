const Tutor = require('../models/Tutor');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.addTutor = async (req, res) => {
  const { name, email, password, adminKey } = req.body;

  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ message: 'Unauthorized: Invalid admin key' });
  }

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existing = await Tutor.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Tutor already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const tutor = new Tutor({
      name,
      email,
      password: hashedPassword
    });

    await tutor.save();
    res.status(201).json({ message: 'Tutor added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding tutor', error: err });
  }
};


exports.loginTutor = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  const tutor = await Tutor.findOne({ email });
  if (!tutor)
    return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, tutor.password);
  if (!isMatch)
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: tutor._id, role: 'tutor' }, process.env.JWT_SECRET);

  res.status(200).json({
    message: 'Tutor login successful',
    token,
    tutor: {
      id: tutor._id,
      name: tutor.name,
      email: tutor.email,
    },
  });
};
