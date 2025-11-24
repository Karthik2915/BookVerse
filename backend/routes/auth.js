const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const pool = require('../database');
const { protect } = require('../middleware/auth');

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return res.status(400).json({ error: 'Please enter all fields' });
  }

  try {
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const id = uuidv4();
    const avatar = `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(name)}`;

    await pool.execute(
      'INSERT INTO users (id, name, email, username, password, avatar) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, email, username, hashedPassword, avatar]
    );

    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({
      token,
      user: { id, name, email, username, avatar },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Authenticate a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, username: user.username, avatar: user.avatar },
      });
    } else {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get the current user
router.get('/me', protect, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;
