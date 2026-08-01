const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

const authControllers = require('../controllers/auth');

router.get('/status', authControllers.getStatus);

router.get('/login', authControllers.getLogin);

router.post('/login', authControllers.postLogin);

router.post('/logout', authControllers.postLogout);

router.get('/signup', authControllers.getSignup);

router.post('/signup', authControllers.postSignup);

router.get('/current-user', isAuth, authControllers.getProfile);

router.put('/current-user', isAuth, authControllers.putProfile);

router.get('/reset', authControllers.getResetPassword);

router.get('/reset/:token', authControllers.getNewPassword);

router.post('/reset', authControllers.postResetPassword);

router.post('/reset/:token', authControllers.postNewPassword);

module.exports = router;