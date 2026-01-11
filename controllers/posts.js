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