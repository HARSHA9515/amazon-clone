const { db } = require('../utils/admin'); // Adjust the path as needed

exports.getCategoriesObj = async() => {
    const categoryNameMap = {};
    const categoriesRef = db.collection('product_categories');
    const categoriesSnapshot = await categoriesRef.get();
    categoriesSnapshot.forEach(doc => {
      const category = doc.data();
      categoryNameMap[category.id] = category.categoryName;
    });
    return categoryNameMap;
}

exports.getProductTypeObj = async() => {
    const productTypesMap = {};
    const productTypesRef = db.collection('product_types');
    const productTypesSnapshot = await productTypesRef.get();
    productTypesSnapshot.forEach(doc => {
      const prType = doc.data();
      productTypesMap[doc.id] = prType.name;
    });
    return productTypesMap;
}

exports.getProductBrandObj = async() => {
    const brandsMap = {};
    const brandsRef = db.collection('product_brands');
    const brandsSnapshot = await brandsRef.get();
    brandsSnapshot.forEach(doc => {
      const prBrand = doc.data();
      brandsMap[doc.id] = prBrand.name;
    });
    return brandsMap;
}