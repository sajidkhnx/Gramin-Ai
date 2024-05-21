const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      address: req.body.address,
      name:req.body.name,
      age:req.body.age,
      mobile:req.body.mobile,
    });
    await user.save();
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    res.redirect('/auth/signup');
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });
    req.session.token = token;
    res.redirect('/profile/home');
  } else {
    res.redirect('/auth/login');
  }
});

router.get('/doctorpage', async (req, res) => {
  res.render('doctorspage');
});

router.get('/videocall', async (req, res) => {
  res.render('videoscall');
});
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/auth/login');
});

module.exports = router;