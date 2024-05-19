const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const { exec } = require('child_process');
const path = require('path');

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

app.get('/predict', (req, res) => {
  res.render('predict');
});

app.get('/predict-disease', (req, res) => {
  const symptoms = req.query.symptoms;
  exec(`python model_predict.py "${symptoms}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    try {
      const predictions = JSON.parse(stdout);
      res.json(predictions);
    } catch (parseError) {
      console.error(`JSON parse error: ${parseError}`);
      res.status(500).json({ error: 'Error parsing prediction data' });
    }
  });
});

app.listen(4000, () => {
  console.log('Server running on port 4000');
});
