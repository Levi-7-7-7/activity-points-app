// controllers/certificateController.js
const Certificate = require('../models/Certificate');
const Category = require('../models/Category');
const Student = require('../models/Student');

// Upload new certificate
exports.uploadCertificate = async (req, res) => {
  const { categoryId, subcategoryName, documentUrl, level } = req.body;

  if (!categoryId || !subcategoryName || !documentUrl) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const category = await Category.findById(categoryId);
  if (!category) return res.status(404).json({ message: 'Category not found' });

  const sub = category.subcategories.find(s => s.name === subcategoryName && (!level || s.level === level));
  if (!sub) return res.status(404).json({ message: 'Subcategory not found' });

  const certificate = new Certificate({
    student: req.user.id,
    category: category._id,
    subcategory: {
      name: sub.name,
      points: sub.points,
      level: sub.level || ''
    },
    documentUrl,
    assignedPoints: sub.points
  });

  await certificate.save();

  res.status(201).json({ message: 'Certificate uploaded successfully', certificate });
};

// Get student certificates
exports.getMyCertificates = async (req, res) => {
  const certs = await Certificate.find({ student: req.user.id }).populate('category');
  res.status(200).json(certs);
};






// Get all pending certificates
exports.getPendingCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ status: 'Pending' })
      .populate('student', 'name registerNumber email')
      .populate('category', 'name');
    res.status(200).json(certificates);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching certificates', error: err });
  }
};

// Approve or Reject a certificate
exports.reviewCertificate = async (req, res) => {
  const { certificateId } = req.params;
  const { status, remarks, updatedPoints } = req.body;

  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const cert = await Certificate.findById(certificateId);
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });

    cert.status = status;
    cert.tutorRemarks = remarks || '';
    cert.assignedPoints = updatedPoints || cert.assignedPoints;
    await cert.save();

    if (status === 'Approved') {
      const student = await Student.findById(cert.student);
      student.totalPoints += cert.assignedPoints;
      await student.save();
    }

    res.status(200).json({ message: `Certificate ${status.toLowerCase()} successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Review failed', error: err });
  }
};
