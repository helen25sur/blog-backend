const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

const authControllers = require('../controllers/auth');

router.get('/status', isAuth, authControllers.getStatus);

router.get('/login', authControllers.getLogin);

router.post('/login', authControllers.postLogin);

router.post('/logout', authControllers.postLogout);

router.get('/signup', authControllers.getSignup);

router.post('/signup', authControllers.postSignup);

router.get('/current-user', isAuth, authControllers.getProfile);

router.put('/current-user', isAuth, authControllers.putProfile);

module.exports = router;