const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const decoded = jwt.verify(req.session.token, 'secret_key');
    const user = await User.findById(decoded.userId);
    res.render('profile', { user });
  } catch (err) {
    console.error(err);
    res.redirect('/auth/login');
  }
});
router.get('/home', verifyToken, async (req, res) => {
  res.render('loggedin home');  
});

router.get('/doctorpage', async (req, res) => {
  res.render('doctorspage');
});


router.get('/video', verifyToken, async (req, res) => {
  res.render('videos');
});

function verifyToken(req, res, next) {
  const token = req.session.token;
  if (!token) return res.redirect('/auth/login');
  next();
}

module.exports = router;