const express = require('express');

const router = express.Router();

//import controller
const {signup, signin, forgotPassword, resetPassword} = require('../controllers/auth');

//import validators
const {userSignupValidator ,userSigninValidator } = require('../validators/auth');
const {runValidation } = require('../validators');

router.post('/signup', userSignupValidator, runValidation ,signup);
router.post('/signin', userSigninValidator, runValidation, signin);

router.post('/forget-password', forgotPassword);
router.put('/reset-password/:rollNumber/:token', resetPassword);

module.exports = router;