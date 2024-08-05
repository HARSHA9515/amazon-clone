const { admin, db } = require('../utils/admin'); // Adjust the path as needed

const categories = [
  {
    id: "55",
    categoryName: 'Electronics',
    description: 'Electronics',
  },
  {
    id: "59",
    categoryName: 'Clothes',
    description: 'Electronics',
  },
  // Add more categories as needed
];

const uploadCategories = async () => {
  try {
    const collectionRef = db.collection('categories');

    for (const category of categories) {
      const docRef = collectionRef.doc(category.id.toString());
      await docRef.set(category);
      console.log(`Uploaded category: ${docRef.id}`);
    }

    console.log('All categories uploaded successfully.');
  } catch (error) {
    console.error('Error uploading categories: ', error);
  }
};

uploadCategories();
