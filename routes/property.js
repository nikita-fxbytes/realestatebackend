const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middleware')
const propertyCountroller = require('../controllers/property/propertyController');
const {createPropertyValidator, validate, deletePropertyValidator} = require('../validators/propertyValidators');

//Route 1: Get Property GET "api/property/properties" Login required
router.get('/properties',middleware, propertyCountroller.getAllProperties);

//Route 2: Create Property POST "api/property/create-property" Login required
router.post('/create-property',middleware, createPropertyValidator, validate, propertyCountroller.createProperty);

//Route 3: Update Property PUT "api/property/update-property/:id". Login required
router.put('/update-property/:id',middleware, createPropertyValidator, validate, propertyCountroller.updateProperty);

//Route 4: Delete property DELETE "api/property/delete-property/:id"
router.delete('/delete-property/:id',middleware,deletePropertyValidator, validate, propertyCountroller.deleteProperty);

module.exports = router;