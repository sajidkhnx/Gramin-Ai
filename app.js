const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

const app = express();

mongoose.connect('mongodb://localhost/gramin ', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.set('view engine', 'ejs');

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.get('/home', async (req, res) => {
  res.render('logout home');
});
app.listen(4000, () => {
  console.log('Server running on port 4000');
});