const Post = require('../models/post');

exports.getAllPosts = (req, res, next) => {
  Post.find()
    .populate('userId')
    .then(posts => res.json(posts))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: err.message });
    });
};


exports.postPost = (req, res, next) => {
  const { title, content, imageURL } = req.body;
  console.log('18', req.user);
  console.log('SESSION в postPost:', req.session);
  const newPost = new Post({ title: title, content: content, imageURL: imageURL, userId: req.user._id });
  newPost.save()
    .then(post => {
      return Post.findById(post._id).populate('userId');
    })
    .then(populatedPost => {
      res.status(201).json(populatedPost);
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

exports.getAddPost = (req, res, next) => {
  res.json({ message: "Add Post Page" });
}

exports.putEditPost = async (req, res, next) => {
  const postId = req.params.id;
  const { title, content, imageURL } = req.body;
  console.log("Editing:", postId, req.user);

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not the owner of this post" });
    }

    post.title = title;
    post.content = content;
    post.imageURL = imageURL;

    const updatedPost = await post.save();

    if (updatedPost) {
      res.status(200).json(updatedPost);
      console.log('62', 'Updating post');
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error updating post' })
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (post.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You are not the owner of this post" });
  }
  try {
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (deletedPost) {
      res.status(200).json({ message: "Post deleted" });
      console.log('Destroyed post');
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error deleting post' });
  }

}
