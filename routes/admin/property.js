const express = require('express');
const router = express.Router();
const middleware = require('../../middleware/middleware')
const propertyCountroller = require('../../controllers/adminpanel/propertyController');
const {createPropertyValidator, validate, deleteAndEditPropertyValidator} = require('../../validators/admin/propertyValidator');

//Route 1: Get Property GET "api/properties" Login required
router.post('/properties',middleware, propertyCountroller.getAllProperties);
//Route 2: Create Property POST "api/properties" Login required
router.post('/properties/create',middleware, createPropertyValidator, validate, propertyCountroller.createProperty);
// Route 3 : Edit Property GET "api/properties" Login required
router.get('/properties/:id',middleware, deleteAndEditPropertyValidator, validate, propertyCountroller.editProperty);
//Route 4: Update Property PUT "api/properties/:id". Login required
router.put('/properties/:id',middleware, deleteAndEditPropertyValidator, createPropertyValidator, validate, propertyCountroller.updateProperty);
//Route 5: Delete property DELETE "api/properties/:id".  Login required
router.delete('/properties/:id',middleware,deleteAndEditPropertyValidator, validate, propertyCountroller.deleteProperty);
module.exports = router;