// controllers/categoryController.js
const Category = require('../models/Category');

// Add new category
exports.addCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json({ message: 'Category added', category });
  } catch (err) {
    res.status(400).json({ message: 'Error adding category', error: err });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories', error: err });
  }
};

// Add subcategory to existing category
exports.addSubcategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name, points, level } = req.body;

  try {
    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    category.subcategories.push({ name, points, level });
    await category.save();

    res.status(200).json({ message: 'Subcategory added', category });
  } catch (err) {
    res.status(400).json({ message: 'Error adding subcategory', error: err });
  }
};
