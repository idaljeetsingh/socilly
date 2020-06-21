const express = require('express');
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const PostController = require('../controllers/posts');
const router = express.Router();


//APP Endpoints
router.post("", checkAuth, extractFile, PostController.createPost);
router.get('', PostController.getPosts);
router.get('/:id', PostController.getPostById);
router.delete('/:id', checkAuth, PostController.deletePost);
router.put('/:id', checkAuth, extractFile, PostController.updatePost);


module.exports = router;
