// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const { addCategory, getCategories, addSubcategory } = require('../controllers/categoryController');
const tutorAuth = require('../middleware/tutorMiddleware');

router.post('/', tutorAuth, addCategory); // Add category
router.get('/', getCategories); // View categories (open to all)
router.post('/:categoryId/subcategory', tutorAuth, addSubcategory); // Add subcategory

module.exports = router;
