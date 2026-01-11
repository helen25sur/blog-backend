const express = require('express');
const router = express.Router();

const postsControllers = require('../controllers/posts');

router.get('/:id', postsControllers.getPostById);
router.put('/post-edit/:id', postsControllers.putEditPost);
router.delete('/post-delete/:id', postsControllers.deletePost);
router.get('/posts', postsControllers.getPosts);
router.get('/', postsControllers.getPosts);
router.post('/', postsControllers.postPost);

module.exports = router;