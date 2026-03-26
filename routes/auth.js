const express = require('express');
const authController = require('../controllers/auth');
const { registerValidation } = require('../validators/authValidators'); 
const validate = require('../middleware/validator'); 

const router = express.Router();

router.post('/signup', registerValidation, validate, authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;

//SIGNUP
//The request first passes through registerValidation and then the validate 
// middleware, which short-circuits with a 400 if anythings invalid. If it passes, the controller 
// checks for duplicate emails, creates a User instance, 
// hashes the password with bcrypt inside saveUser(), and writes to the users table.

//LOGIN
//The controller looks up the user by email, runs bcrypt.compare() on the password, and if valid, signs a 
// JWT containing { id, email, role } with a 7-day expiry. That token is returned to the frontend, 
// which stores in Zustand and sends it as a bearer token on every subsequent request.
//any protected route passes through authMiddleware, which reads the Authorization header, verifies the 
// JWT, and attaches the decoded payload to req.user. This is how userId flows into every cart and 
// product operation downstream.