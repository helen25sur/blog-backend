const fs = require('fs');
const path = require('path');
const { v4  } = require('uuid');

const p = path.join(path.dirname(require.main.filename), 'data', 'posts.json');

const getPostsFromFile = (cb) => {
  fs.readFile(p, (err, data) => {
    if (err) {
      return cb([]);
    }
    cb(JSON.parse(data));
  });
}

exports.getPosts = (req, res, next) => {
  const posts = getPostsFromFile((posts) => {
    res.json(posts);
  });
  return posts;
};

exports.postPost = (req, res, next) => {
  const posts = getPostsFromFile((posts) => {
    const { title, content, imageURL } = req.body;
    console.log(req.body);
    const newPost = { id: v4(), title, content, imageURL };
    posts.push(newPost);
    fs.writeFile(p, JSON.stringify(posts), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving post' });
      }
      res.status(201).json(newPost);
    });
  });
  return posts;
};

exports.getPostById = (req, res, next) => {
  const postId = req.params.id;

  getPostsFromFile((posts) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  });
};

exports.putEditPost = (req, res, next) => {
  const postId = req.params.id;
  const { title, content, imageURL } = req.body;
  console.log("Editing:", postId, req.body);

  getPostsFromFile((posts) => {
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex >= 0) {
      posts[postIndex] = { id: postId, title, content, imageURL };
      fs.writeFile(p, JSON.stringify(posts), (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error updating post' });
        }
        res.status(200).json(posts[postIndex]);
      });
    } else {
      res.status(404).json({ message: "Post not found" });
    } 
  });
}

exports.deletePost = (req, res, next) => {
  const postId = req.params.id;
  getPostsFromFile((posts) => {
    const updatedPosts = posts.filter(p => p.id !== postId);
    if (posts.length === updatedPosts.length) {
      return res.status(404).json({ message: "Post not found" });
    }
    fs.writeFile(p, JSON.stringify(updatedPosts), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting post' });
      }
      res.status(200).json({ message: "Post deleted" });
    });
  });
}