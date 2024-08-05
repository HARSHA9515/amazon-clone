const express = require('express');
const multer = require('multer');
const { db, bucket } = require('../utils/admin');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { isAdminLoggedIn } = require('./../utils/auth')
const { getCategoriesObj,getProductTypeObj, getProductBrandObj, uploadImageToFirebase} = require('../handlers/product.handler');
const router = express.Router();
// Set up multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a new product
router.post('/products',isAdminLoggedIn, upload.single('productImage'), async (req, res) => {
  try {
    const { productName, productPrice, categoryId, productDescription, productTypeId, brandNameId} = req.body;
    const productImage = req.file;

    if (!productName || !productPrice || !categoryId) {
      return res.status(400).json({ error: 'Product name, price, and category ID are required' });
    }

    const id = uuidv4();
    const productData = { id, productName, productPrice, categoryId, productDescription, productTypeId, brandNameId};

    if (productImage) {
      const fileName = `${id}_${path.basename(productImage.originalname)}`;
      try {
        const imageUrl = await uploadImageToFirebase(productImage.buffer, fileName, productImage.mimetype);
        productData.productImageUrl = imageUrl;
      } catch (error) {
        return res.status(500).json({ error: 'Error uploading image' });
      }
    }

    const productRef = db.collection('products').doc(id);
    await productRef.set(productData);

    res.status(201).json(productData);
  } catch (error) {
    console.error('Error creating product: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update product details
router.put('/products/:id', isAdminLoggedIn, upload.single('productImage'), async (req, res) => {
  try {
    const id = req.params.id;
    const { productName, productPrice, categoryId, productDescription, brandNameId, productTypeId } = req.body;
    const productImage = req.file;

    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();
    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updates = {};
    if (productName) updates.productName = productName;
    if (productPrice) updates.productPrice = productPrice;
    if (categoryId) updates.categoryId = categoryId;
    if (brandNameId) updates.brandNameId = brandNameId;
    if (productTypeId) updates.productTypeId = productTypeId;
    if (productDescription) updates.productDescription = productDescription;

    if (productImage) {
      const fileName = `${id}_${path.basename(productImage.originalname)}`;
      try {
        const imageUrl = await uploadImageToFirebase(productImage.buffer, fileName, productImage.mimetype);
        updates.productImageUrl = imageUrl;
      } catch (error) {
        return res.status(500).json({ error: 'Error uploading image' });
      }
    }

    await productRef.update(updates);
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all products with category names
router.get('/products', async (req, res) => {
  try {
    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();
    const products = [];

    // const categoryNameMap = await getCategoriesObj();
    // const productTypeMap = await getProductTypeObj();
    // const productBrandMap = await getProductBrandObj();
    snapshot.forEach(doc => {
      const product = doc.data();
      product.id = doc.id;
      // product.categoryName = categoryNameMap[product.categoryId] || '-';
      // product.brandName = productBrandMap[product.brandNameId] || '-';
      // product.productType = productTypeMap[product.productTypeId] || '-';
      products.push(product);
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error getting products: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get single product by ID with category name
router.get('/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const productRef = db.collection('products').doc(id);
    const doc = await productRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = doc.data();
    product.id = doc.id;

    const [categoryNameMap, productTypeMap, brandNameMap] = await Promise.all([
      getCategoriesObj(product.categoryId),
      getProductTypeObj(product.productTypeId),
      getProductBrandObj(product.brandNameId)
    ]);
    
    product.categoryName = categoryNameMap[product.categoryId] || "-";
    product.productType = productTypeMap[product.productTypeId] || "-";
    product.brandName = brandNameMap[product.brandNameId] || "-";
    res.status(200).json(product);
  } catch (error) {
    console.error('Error getting product: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a product by ID
router.delete('/products/:id',isAdminLoggedIn, async (req, res) => {
  try {
    const id = req.params.id;
    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();
    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await productRef.delete();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
