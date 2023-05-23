const express = require('express');
const router = express.Router();
const middleware = require('../../middleware/middleware')
const roleCountroller = require('../../controllers/adminpanel/roleController');
const {createRoleValidator, validate, deleteAndEditRoleValidator, updateRoleValidation} = require('../../validators/admin/roleValidator');

//Route 1: Get Role GET "api/roles" Login required
router.post('/roles',middleware, roleCountroller.getAllRoles);
//Route 2: Create Role POST "api/roles" Login required
router.post('/roles/create',middleware, createRoleValidator, validate, roleCountroller.createRole);
// Route 3 : Edit Role GET "api/roles" Login required
router.get('/roles/:id',middleware, deleteAndEditRoleValidator, validate, roleCountroller.editRole);
//Route 4: Update Role PUT "api/roles/:id". Login required
router.put('/roles/:id',middleware, deleteAndEditRoleValidator, updateRoleValidation, validate, roleCountroller.updateRole);
//Route 5: Delete Role DELETE "api/roles/:id",  Login required
router.delete('/roles/:id',middleware,deleteAndEditRoleValidator, validate, roleCountroller.deleteRole);
module.exports = router;