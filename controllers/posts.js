const mongodb = require('mongodb');

const Post = require('../models/post');

exports.getAllPosts = (req, res, next) => {
  Post.getAll()
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      console.error(err);
    })
};


exports.postPost = (req, res, next) => {
  const { title, content, imageURL } = req.body;
  const newPost = new Post(title, content, imageURL);
  newPost.save()
    .then(() => {
      // console.log('Created product!');
      // res.redirect('/all');
      res.status(201).json(newPost);
    })
    .catch(err => {
      console.error(err);
    })
  // getPostsFromFile((posts) => {
  //   const { title, content, imageURL } = req.body;
  //   console.log(req.body);
  //   const newPost = { id: v4(), title, content, imageURL };
  //   posts.push(newPost);
  //   fs.writeFile(p, JSON.stringify(posts), (err) => {
  //     if (err) {
  //       return res.status(500).json({ message: 'Error saving post' });
  //     }
  //     res.status(201).json(newPost);
  //   });
  // });
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
  const updatedPost = new Post(title, content, imageURL, new mongodb.ObjectId(postId));
  updatedPost.save()
    .then(() => {
      if(updatedPost) {
        res.status(200).json(updatedPost);
        console.log('68', 'Updating post');
      } else {
        res.status(404).json({ message: "Post not found" });
      }      
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ message: 'Error updating post' });
    })
}

// exports.deletePost = (req, res, next) => {
//   const postId = req.params.id;
//   getPostsFromFile((posts) => {
//     const updatedPosts = posts.filter(p => p.id !== postId);
//     if (posts.length === updatedPosts.length) {
//       return res.status(404).json({ message: "Post not found" });
//     }
//     fs.writeFile(p, JSON.stringify(updatedPosts), (err) => {
//       if (err) {
//         return res.status(500).json({ message: 'Error deleting post' });
//       }
//       res.status(200).json({ message: "Post deleted" });
//     });
//   });
// }