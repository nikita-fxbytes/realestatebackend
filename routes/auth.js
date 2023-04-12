const express = require('express');
const router = express.Router();
const authController = require('../controllers/admin/authController')
const {createUserValidator, validate, logInValidator} = require('../validators/authValidators')
//Route 1 : Create a user using POST "/api/auth/create-user". no login required
router.post('/create-user', createUserValidator, validate,  authController.createUser);

//Route 2 : Login a user using: POST "/api/auth/login". no login required.
router.post('/login', logInValidator, validate, authController.logInUser)
module.exports = router;