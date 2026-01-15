const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const jwtauth = require('../auth/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, password } = req.body;
        if (!name || !password) {
            return res.status(400).json({ error: 'Name and password are required' });
        }

        const exist = await Admin.findOne({ name });
        if (exist) {
            return res.status(409).json({ error: 'already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await Admin.create({ name, password: hashedPassword });
        res.status(201).json({ message: 'Admin registered successfully', adminId: admin._id, name: admin.name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body

    const admin = await Admin.findOne({ name })
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      {
        id: admin._id,
        name: admin.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.json({ token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/me', jwtauth, async (req, res) => {
  const admin = await Admin.findById(req.user.id).select('-password')
  res.json(admin)
})

module.exports = router
