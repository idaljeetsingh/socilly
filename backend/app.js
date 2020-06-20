const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const secrets = require('./proj_secrets');

const app = express();

//APP Middle-wares
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', "Origin, x-Requested, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS")
  next();
})
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//DataBase Connection
mongoose.connect(secrets.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(() => {
    console.log('Connection Failed!');
  })


// Allowing static access to images
app.use('/images', express.static(path.join('backend/images')));

//Routes
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
