const express = require('express');
const router = express.Router();

const postsControllers = require('../controllers/posts');

// router.get('/all', postsControllers.getAllPosts);
// router.get('/:id', postsControllers.getPostById);
// router.get('/', postsControllers.getAllPosts);

router.post('/', postsControllers.postPost);
// router.put('/post-edit/:id', postsControllers.putEditPost);
// router.delete('/post-delete/:id', postsControllers.deletePost);

module.exports = router;