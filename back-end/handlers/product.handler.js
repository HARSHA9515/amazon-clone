const { db, bucket } = require('../utils/admin'); // Adjust the path as needed

exports.getCategoriesObj = async (id) => {
    const categoryNameMap = {};
    
    if (id) {
      const categoryRef = db.collection('product_categories').doc(id);
      const categoryDoc = await categoryRef.get();
      if (categoryDoc.exists) {
        categoryNameMap[categoryRef.id] = categoryDoc.data().name;
      } else {
        console.error(`Category with ID ${id} not found`);
      }
    } else {
      const categoriesRef = db.collection('product_categories');
      const categoriesSnapshot = await categoriesRef.get();
      
      categoriesSnapshot.forEach(doc => {
        const category = doc.data();
        categoryNameMap[doc.id] = category.name;
      });
    }
    
    return categoryNameMap;
  }
  
  // Function to get product types as an object
  exports.getProductTypeObj = async (id) => {
    const productTypesMap = {};
    
    if (id) {
      const productTypeRef = db.collection('product_types').doc(id);
      const productTypeDoc = await productTypeRef.get();
      
      if (productTypeDoc.exists) {
        productTypesMap[productTypeRef.id] = productTypeDoc.data().name;
      } else {
        console.error(`Product type with ID ${id} not found`);
      }
    } else {
      const productTypesRef = db.collection('product_types');
      const productTypesSnapshot = await productTypesRef.get();
      
      productTypesSnapshot.forEach(doc => {
        const prType = doc.data();
        productTypesMap[doc.id] = prType.name;
      });
    }
    
    return productTypesMap;
  }
  
  // Function to get product brands as an object
  exports.getProductBrandObj = async (id) => {
    const brandsMap = {};
    
    if (id) {
      const brandRef = db.collection('product_brands').doc(id);
      const brandDoc = await brandRef.get();
      
      if (brandDoc.exists) {
        brandsMap[brandRef.id] = brandDoc.data().name;
      } else {
        console.error(`Product brand with ID ${id} not found`);
      }
    } else {
      const brandsRef = db.collection('product_brands');
      const brandsSnapshot = await brandsRef.get();
      
      brandsSnapshot.forEach(doc => {
        const prBrand = doc.data();
        brandsMap[doc.id] = prBrand.name;
      });
    }
    
    return brandsMap;
  }

exports.uploadImageToFirebase = (fileBuffer, fileName, contentType, resourceType="products") => {
    return new Promise((resolve, reject) => {
      const file = bucket.file(resourceType+"/"+fileName);
      const stream = file.createWriteStream({
        metadata: {
          contentType: contentType
        }
      });
  
      stream.on('error', (err) => {
        console.error('Error uploading image: ', err);
        reject('Error uploading image');
      });
  
      stream.on('finish', async () => {
        await file.makePublic();
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${resourceType}/${fileName}`;
        resolve(imageUrl);
      });
  
      stream.end(fileBuffer);
    });
  };
  