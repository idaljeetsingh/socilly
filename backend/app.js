const express = require('express');
const mongoose = require('mongoose');
const Post = require('./models/post.js');
const app = express();
const secrets = require('./proj_secrets');

mongoose.connect(secrets.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(() => {
    console.log('Connection Failed!');
  })

//APP Middle-wares
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', "Origin, x-Requested, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS")
  next();
})
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//APP Endpoints
app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  console.log(req.body);
  res.status(201).json({
    message: "Post Added Successfully..",
    data: post
  });
});

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(docs => {
      // console.log(docs)
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: docs
      });
    });

});

app.delete('/api/posts/:id', (req, res, next) => {
  // console.log(req.params.id);
  Post.deleteOne({_id: req.params.id})
    .then(result => {
      // console.log(result)
      res.status(200).json({
        message: 'Post deleted'
      });
    })

})

module.exports = app;
