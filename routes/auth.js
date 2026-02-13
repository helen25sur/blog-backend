const express = require('express');
const router = express.Router();

const authControllers = require('../controllers/auth');

router.get('/login', authControllers.getLogin);

router.post('/login', authControllers.postLogin);

module.exports = router;