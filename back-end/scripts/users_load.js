const bcrypt = require('bcryptjs');
const { db } = require('../utils/admin'); // Adjust the path as needed

const SALT_ROUNDS = 10;

const users = [
  {
    id: "1",
    username: 'admin',
    password: bcrypt.hashSync('admin123', SALT_ROUNDS),
    role: 'admin',
    isActive: false,
  },
  {
    id: "2",
    username: 'user1',
    password: bcrypt.hashSync('user123', SALT_ROUNDS),
    role: 'user',
    isActive: false,
  },
  {
    id: "3",
    username: 'user2',
    password: bcrypt.hashSync('user123', SALT_ROUNDS),
    role: 'user',
    isActive: false,
  },
];

// Function to upload data to Firestore
const uploadData = async () => {
  const collectionRef = db.collection('users');

  for (const user of users) {
    const docRef = collectionRef.doc(user.id.toString()); // Use id as the document ID
    await docRef.set(user);
    console.log(`Uploaded user: ${user.username}`);
  }

  console.log('All users uploaded successfully.');
};

uploadData().catch(console.error);
