const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Make sure to require jwt
const authRouter = require('./routes/auth.router'); 
const productRouter = require('./routes/products.router'); 
const usersRouter = require('./routes/users.router');
const { isAuthenticated } = require('./utils/auth')
const productAttributesRouter = require('./routes/product.atrributes.router'); 
const app = express();
const PORT = 3000;

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:4200',
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization, withCredentials',
  credentials: true
}));

app.use(session({
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(async(req,res, next) => {
  console.log(req.url)
  next();
});

// Place the session middleware before any route handlers
app.use('/api/auth', authRouter); // Use the authentication routes with /api/auth prefix
app.use('/api', isAuthenticated, usersRouter);
app.use('/api', isAuthenticated, productRouter);
app.use('/api', isAuthenticated, productAttributesRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
