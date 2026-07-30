const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/is-auth');
const postsControllers = require('../controllers/posts');

router.get('/', postsControllers.getAllPosts);
router.get('/:id', postsControllers.getPostById);
router.get('/add-post', isAuth, postsControllers.getAddPost);
// router.get('/', postsControllers.getAllPosts);

router.post('/', isAuth, postsControllers.postPost);
router.put('/post-edit/:id', isAuth, postsControllers.putEditPost);
router.delete('/post-delete/:id', isAuth, postsControllers.deletePost);


module.exports = router;