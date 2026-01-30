const Post = require('../models/post');

exports.getAllPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      console.error(err);
    })
};


exports.postPost = (req, res, next) => {
  const { title, content, imageURL } = req.body;
  // console.log('16', req.user._id);
  const newPost = new Post({ title: title, content: content, imageURL: imageURL });
  newPost.save()
    .then(() => {
      // console.log('Created product!');
      // res.redirect('/all');
      res.status(201).json(newPost);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: err.message });
    });
};

exports.getPostById = (req, res, next) => {
  const postId = req.params.id;
  Post.findById(postId)
    .then(post => {
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    })
    .catch(err => {
      console.error(err);
    })

};

exports.putEditPost = (req, res, next) => {
  const postId = req.params.id;
  const { title, content, imageURL } = req.body;
  console.log("Editing:", postId, req.body);
  // const updatedPost = new Post(title, content, imageURL, postId);
  Post.findById(postId)
    .then(product => {
      product.title = title;
      product.content = content;
      product.imageURL = imageURL;
      return product.save()
    })
    .then((product) => {
      console.log('59', product);
      if (product) {
        res.status(200).json(product);
        console.log('62', 'Updating post');
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ message: 'Error updating post' });
    })
}

exports.deletePost = (req, res, next) => {
  const postId = req.params.id;
  Post.findByIdAndDelete(postId)
    .then(() => {
      console.log(postId);
      console.log('Destroyed post');
      res.status(200).json({ message: "Post deleted" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ message: err.message });
    })

  // return res.status(404).json({ message: "Post not found" });
}