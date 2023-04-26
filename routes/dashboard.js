const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middleware')
const dashBoardCountroller = require('../controllers/adminpanel/DashBoardController');

//Route 1: Get Property GET "api/properties" Login required
router.get('/counts',middleware, dashBoardCountroller.getAllCount);
module.exports = router;