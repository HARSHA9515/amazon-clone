const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../utils/admin'); // Adjust the path as needed

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';

async function authenticateUser(username, password) {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('username', '==', username).get();
    if (snapshot.empty) return null;

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    if (bcrypt.compareSync(password, user.password)) {
      return { id: userDoc.id, ...user };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error authenticating user: ', error);
    return null;
  }
}

function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
  };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await authenticateUser(username, password);
  if (user) {
    req.session.user = { id: user.id, username: user.username, role: user.role };
    const token = generateToken(user);
    res.status(200).json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

router.get('/checkSession', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ ...req.session.user });
      } else {
        res.status(401).json({ message: 'Not authenticated' });
      }
});

module.exports = router;
