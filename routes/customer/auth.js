const express = require('express');
const router = express.Router();
const authController = require('../../controllers/custmorpanrl/authController');
const {createUserValidator, validate, logInValidator, updateProfileValidator} = require('../../validators/customer/authValidators');
const middleware = require('../../middleware/middleware')
//Route 1 : Create a user using POST "/api/auth/create-user". no login required
router.post('/users/create', createUserValidator, validate,  authController.createUser);

//Route 2 : Login a user using: POST "/api/auth/login". no login required.
router.post('/login', logInValidator, validate, authController.logInUser);
// Route 3 : Get All user using: GET "api/users".  login required.
router.post('/users',  authController.getRealtorUsers);
// Route 4: Get login user details using GET "api/profile" Login required
router.get('/profile', middleware, authController.getLoggedInUser);
// Route 5: Get login user details using GET "api/profile" Login required
router.put('/profile', middleware,updateProfileValidator, validate, authController.updateProfile);

module.exports = router;