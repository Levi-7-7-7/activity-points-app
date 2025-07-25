// middleware/verifyAdmin.js

module.exports = (req, res, next) => {
  if (req.headers['x-admin-key'] === process.env.ADMIN_KEY) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};
