const { validationResult } = require('express-validator');
const { check } = require('express-validator');

exports.runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    next();
};

exports.searchCheck = [
    check('roll_number')
    .not()
    .isEmpty()
    .withMessage('RollNumber is required'),
];

