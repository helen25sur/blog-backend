const express = require('express');
const router = express.Router();
const { query, body, validationResult } = require('express-validator');
const isAuth = require('../middleware/is-auth');

const authControllers = require('../controllers/auth');

router.get('/status', authControllers.getStatus);

router.get('/login', authControllers.getLogin);

router.post('/login',
  body('email', 'Please enter the valid email.').isEmail(),
  body('password', 'Password is required.').notEmpty(),
  authControllers.postLogin);

router.post('/logout', authControllers.postLogout);

router.get('/signup', authControllers.getSignup);

router.post('/signup',
  body('username', 'Username can contain only letters, numbers, underscore and must be 4-20 characters.').matches(/^[\p{L}0-9_]+$/u).isLength({ min: 4, max: 20 }),
  body('email', 'Please enter the valid email.').isEmail(),
  body('password', 'Please enter strong password with minimum 6 characters. In password should be minimum 1 lowercase letter, 1 uppercase letter, 1 numbers, 1 symbol.').isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
  body('confirmPassword', 'Please enter the same password.').custom((value, { req }) => {
    return value === req.body.password;
  }),
  authControllers.postSignup);

router.get('/current-user', isAuth, authControllers.getProfile);

router.put('/current-user', isAuth, authControllers.putProfile);

router.get('/reset', authControllers.getResetPassword);

router.get('/reset/:token', authControllers.getNewPassword);

router.post('/reset', authControllers.postResetPassword);

router.post('/reset/:token', authControllers.postNewPassword);

module.exports = router;