const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../utils/admin');
const { isAdminLoggedIn } = require('../utils/auth');

const router = express.Router();

// Middleware to log session user
router.use('/users',isAdminLoggedIn);

router.get('/users', async (req, res) => {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting users: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get single user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();
    if (!doc.exists) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(200).json({ id: doc.id, ...doc.data() });
    }
  } catch (error) {
    console.error('Error getting user: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create new user
router.post('/users', async (req, res) => {
  try {
    const { username, password, role, isActive } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Username, password, and role are required' });
    }

    // Generate a unique user ID
    const userId = uuidv4();
    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);

    const newUser = {
      id: userId,
      username,
      password: hashedPassword,
      role,
      isActive: isActive || false, // Default isActive to false if not provided
    };

    const userRef = db.collection('users').doc(userId);
    await userRef.set(newUser);

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update user by ID
router.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, password, role, isActive } = req.body;
    const userRef = db.collection('users').doc(userId);
    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (password !== undefined) updateData.password = bcrypt.hashSync(password, SALT_ROUNDS);
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    await userRef.update(updateData);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete user by ID
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const userRef = db.collection('users').doc(userId);
    await userRef.delete();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
