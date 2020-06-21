const Post = require('../models/post.js');

exports.getPosts = (req, res, next) => {
  // console.log(req.query);
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.pagenum;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then(docs => {
      fetchedPosts = docs
      return Post.count();
    }).then(count => {
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: fetchedPosts,
      maxPosts: count
    });
  })
    .catch(error => {
      res.status(500).json({
        message: "Technical error occurred"
      })
    });

}

exports.getPostById = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({message: "Post not found"});
      }
    })
}

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  post.save();
  // console.log(req.body);
  res.status(201).json({
    message: "Post Added Successfully..",
    data: post
  });
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePreview;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  })
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({message: "Update Successful.."})
      } else {
        res.status(401).json({message: "NOT AUTHORIZED.."})
      }
      // console.log(result)
    })
    .catch(error => {
      res.status(500).json({
        message: "Could't update the post"
      })
    })
}

exports.deletePost = (req, res, next) => {
  // console.log(req.params.id);
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({message: "Deletion Successful.."})
      } else {
        res.status(401).json({message: "NOT AUTHORIZED.."})
      }
    })

}
