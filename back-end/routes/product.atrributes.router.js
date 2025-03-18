const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); 
const { db } = require('../utils/admin'); // Adjust the path as needed
const { uploadImageToFirebase } = require('../handlers/product.handler');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// Create a new category
router.post('/product_attributes/categories',upload.single('categoryImg'), async (req, res) => {
    try {
      const newCategory = req.body;
      if (!newCategory.name) {
        return res.status(400).json({ error: 'Category name is required' });
      }
      
      // Generate a unique category ID
      const id = uuidv4();
      const categoryData = { id, ...newCategory };
      
      const categoryImg = req.file;
      if (categoryImg) {
        const fileName = `${id}_${path.basename(categoryImg.originalname)}`;
        try {
          const imageUrl = await uploadImageToFirebase(categoryImg.buffer, fileName, categoryImg.mimetype, "categories");
          categoryData.imageUrl = imageUrl;
        } catch (error) {
          console.log("error",error)
          return res.status(500).json({ error: 'Error uploading image' });
        }
      }
  
      const categoryRef = db.collection('product_categories').doc(id);
      await categoryRef.set(categoryData);
  
      res.status(201).json(categoryData);
    } catch (error) {
      console.error('Error creating category: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Get all categories
router.get('/product_attributes/categories', async (req, res) => {
  try {
    const categoriesRef = db.collection('product_categories');
    const snapshot = await categoriesRef.get();
    const categories = [];
    snapshot.forEach(doc => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error getting categories: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a single category by ID
router.get('/product_attributes/categories/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const categoryRef = db.collection('product_categories').doc(id);
    const doc = await categoryRef.get();
    if (!doc.exists) {
      res.status(404).json({ error: 'Category not found' });
    } else {
      res.status(200).json({ id: doc.id, ...doc.data() });
    }
  } catch (error) {
    console.error('Error getting category: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a category
router.put('/product_attributes/categories/:id', upload.single('categoryImg'), async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No data provided for update' });
    }

    const categoryImg = req.file;
      if (categoryImg) {
        const fileName = `${id}_${path.basename(categoryImg.originalname)}`;
        try {
          const imageUrl = await uploadImageToFirebase(categoryImg.buffer, fileName, categoryImg.mimetype, "categories");
          updates.imageUrl = imageUrl;
        } catch (error) {
          console.log("error",error)
          return res.status(500).json({ error: 'Error uploading image' });
        }
      }

    const categoryRef = db.collection('product_categories').doc(id);
    const categoryDoc = await categoryRef.get();
    if (!categoryDoc.exists) {
      return res.status(404).json({ error: 'Category not found' });
    }
    await categoryRef.update(updates);
    res.status(200).json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a category by ID
router.delete('/product_attributes/categories/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const categoryRef = db.collection('product_categories').doc(id);
    const categoryDoc = await categoryRef.get();
    if (!categoryDoc.exists) {
      return res.status(404).json({ error: 'Category not found' });
    }
    await categoryRef.delete();
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/product_attributes/brands', async (req, res) => {
  try {
    const brandsRef = db.collection('product_brands');
    const snapshot = await brandsRef.get();
    const categories = [];
    snapshot.forEach(doc => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error getting categories: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/product_attributes/product_types', async (req, res) => {
  try {
    const productTypesRef = db.collection('product_types');
    const snapshot = await productTypesRef.get();
    const categories = [];
    snapshot.forEach(doc => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error getting categories: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

