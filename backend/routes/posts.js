const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/post.js');
const secrets = require('../proj_secrets');

const router = express.Router();

mongoose.connect(secrets.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(() => {
    console.log('Connection Failed!');
  })


//APP Endpoints
router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  // console.log(req.body);
  res.status(201).json({
    message: "Post Added Successfully..",
    data: post
  });
});

router.get('', (req, res, next) => {
  Post.find()
    .then(docs => {
      // console.log(docs)
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: docs
      });
    });

});

router.delete('/:id', (req, res, next) => {
  // console.log(req.params.id);
  Post.deleteOne({_id: req.params.id})
    .then(result => {
      // console.log(result)
      res.status(200).json({
        message: 'Post deleted'
      });
    })

})
router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({_id: req.params.id}, post)
    .then(result => {
      // console.log(result)
      res.status(200).json({message: "Update Successfull.."})
    })
})

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({message: "Post not found"});
      }
    })
})

module.exports = router;
