const express = require('express');
const router = express.Router();
const authController = require('../../controllers/adminpanel/authController');
const {createUserValidator, validate, logInValidator, deleteAndEditUserValidator, updateUserValidator, updateProfileValidator} = require('../../validators/admin/authValidators');
const middleware = require('../../middleware/middleware')
//Route 1 : Create a user using POST "/api/auth/create-user". no login required
router.post('/users/create', createUserValidator, validate,  authController.createUser);

//Route 2 : Login a user using: POST "/api/auth/login". no login required.
router.post('/login', logInValidator, validate, authController.logInUser);
// Route 3 : Get All user using: GET "api/users". no login required.
router.post('/users', middleware,  authController.getAllUsers);
// Route 3 : Edit User GET "api/users" Login required
router.get('/users/:id',middleware, deleteAndEditUserValidator, validate, authController.editUser);
//Route 4: Update User PUT "api/users/:id". Login required
router.put('/users/:id',middleware, deleteAndEditUserValidator, updateUserValidator, validate, authController.updateUser);
//Route 5: Delete User DELETE "api/users/:id".  Login required
router.delete('/users/:id', middleware, deleteAndEditUserValidator, validate, authController.deleteUser);
// Route 6: Get login user details using GET "api/profile" Login required
router.get('/profile', middleware, authController.getLoggedInUser);
// Route 7: Get login user details using GET "api/profile" Login required
router.put('/profile', middleware,updateProfileValidator, validate, authController.updateProfile);

module.exports = router;