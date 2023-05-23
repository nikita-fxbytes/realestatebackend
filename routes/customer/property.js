const express = require('express');
const router = express.Router();
const propertyCountroller = require('../../controllers/custmorpanrl/PropertyController');
const { propertyDetailsValidator, validate } = require('../../validators/customer/propertyValidator');
// Route 1: Get Property GET "api/properties"  no login required
router.post('/properties', propertyCountroller.getAllProperties);
// Route 2 :  Property details GET "api/properties" Login required
router.post('/properties/details', propertyDetailsValidator, validate, propertyCountroller.properyDetails)
module.exports = router;