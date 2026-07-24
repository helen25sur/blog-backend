const express = require('express');
const router = express.Router();

const authControllers = require('../controllers/auth');

router.get('/status', authControllers.getStatus);

router.get('/login', authControllers.getLogin);

router.post('/login', authControllers.postLogin);

router.post('/logout', authControllers.postLogout);

router.get('/signup', authControllers.getSignup);

router.post('/signup', authControllers.postSignup);

module.exports = router;