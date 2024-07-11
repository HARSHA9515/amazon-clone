const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// Environment variables
const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';
const SALT_ROUNDS = 10;

// Mock data for products
const products = [
  {
    id: 1,
    name: 'Product 1',
    description: 'This is a description of product 1',
    image: 'https://example.com/product1.jpg',
    price: 450,
    stock: 10,
  },
  {
    id: 2,
    name: 'Product 2',
    description: 'This is a description of product 2',
    image: 'https://example.com/product2.jpg',
    price: 259,
    stock: 20,
  },
  {
    id: 3,
    name: 'Product 3',
    description: 'This is a description of product 3',
    image: 'https://example.com/product3.jpg',
    price: 236,
    stock: 15,
  },
];

// Mock data for users
const users = [
  {
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync('admin123', SALT_ROUNDS),
    role: 'admin',
  },
  {
    id: 2,
    username: 'user1',
    password: bcrypt.hashSync('user123', SALT_ROUNDS),
    role: 'user',
  },
  {
    id: 3,
    username: 'user2',
    password: bcrypt.hashSync('user123', SALT_ROUNDS),
    role: 'user',
  },
];

// Mock data for orders
const orders = [];

// Function to authenticate user
function authenticateUser(username, password) {
  const user = users.find((u) => u.username === username);
  if (user && bcrypt.compareSync(password, user.password)) {
    return user;
  } else {
    return null;
  }
}

// Function to generate token
function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
  };
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: '1h',
  });
  return token;
}

// API to login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username ||!password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  const user = authenticateUser(username, password);
  if (user) {
    const token = generateToken(user);
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

// API to get products
app.get('/api/products', (req, res) => {
  res.status(200).json(products);
});

// API to get product by id
app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const product = products.find((p) => p.id === parseInt(id));
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// API to create order
app.post('/api/orders', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1] || '';
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const { productId, quantity } = req.body;
    const product = products.find((p) => p.id === productId);
    if (product && product.stock >= quantity) {
      const order = {
        id: orders.length + 1,
        userId: decoded.id,
        productId,
        quantity,
        status: 'pending',
      };
      orders.push(order);
      res.status(201).json(order);
    } else {
      res.status(400).json({ message: 'Product out of stock' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// API to get orders
app.get('/api/orders', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1] || '';
  try {
    const decoded= jwt.verify(token, SECRET_KEY);
    const userOrders = orders.filter((o) => o.userId === decoded.id);
    res.status(200).json(userOrders);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// API to update order status
app.put('/api/orders/:id', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1] || '';
  const id = req.params.id;
  const { status } = req.body;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const order = orders.find((o) => o.id === parseInt(id));
    if (order && decoded.role === 'admin') {
      order.status = status;
      res.status(200).json(order);
    } else {
      res.status(403).json({ message: 'Only admin can update order status' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// API to get users
app.get('/api/users', (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }
  const user = users.find((u) => u.username === username);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});