const { body } = require('express-validator');

//make sure input is valid
exports.registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address'),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),

    body('name')
        .notEmpty()
        .withMessage('Name is required'),
];
