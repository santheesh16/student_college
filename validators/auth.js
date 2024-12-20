const { check } = require('express-validator');

exports.userSignupValidator = [
    check('rollNumber')
        .not()
        .isEmpty()
        .withMessage('RollNumber is required'),
    check('registerNumber')
        .not()
        .isEmpty()
        .withMessage('RegisterNumber is required'),
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least  6 characters long')
];

exports.userSigninValidator = [
    check('roll_number')
        .not()
        .isEmpty()
        .withMessage('Employee ID is required'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least  6 characters long')
];

exports.forgotPasswordValidator = [
    check('email')
        .not()
        .isEmpty()
        .isEmail()
        .withMessage('Must be a valid email address')
];

exports.resetPasswordValidator = [
    check('newPassword')
        .not()
        .isEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must be at least  6 characters long')
];