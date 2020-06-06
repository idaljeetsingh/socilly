const path = require('path');
const express = require('express');
const app = express();
const postsRoutes = require('./routes/posts')

//APP Middle-wares
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', "Origin, x-Requested, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS")
  next();
})
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Allowing static access to images
app.use('/images', express.static(path.join('backend/images')));

//Routes
app.use("/api/posts", postsRoutes)

module.exports = app;
