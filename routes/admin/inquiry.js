const express = require('express');
const router = express.Router();
const middleware = require('../../middleware/middleware')
const inquiryCountroller = require('../../controllers/adminpanel/InquiryController');
const {createInquiryValidator, validate, deleteAndEditInquiryValidator} = require('../../validators/admin/inquiryValidators');

//Route 1: Get Inquiry GET "api/inquiry" Login required
router.post('/inquiries',middleware, inquiryCountroller.getAllInquiries);
//Route 2: Create Inquiry POST "api/inquiry" Login required
router.post('/inquiries/create',middleware, createInquiryValidator, validate, inquiryCountroller.createInquiry);
// Route 3 : Edit Inquiry GET "api/inquiry" Login required
router.get('/inquiries/:id',middleware, deleteAndEditInquiryValidator, validate, inquiryCountroller.editInquiry);
//Route 4: Update Inquiry PUT "api/inquiry/:id". Login required
router.put('/inquiries/:id',middleware, deleteAndEditInquiryValidator, createInquiryValidator, validate, inquiryCountroller.updateInquiry);
//Route 5: Delete Inquiry DELETE "api/inquiry/:id".  Login required
router.delete('/inquiries/:id',middleware,deleteAndEditInquiryValidator, validate, inquiryCountroller.deleteInquiry);
//Route 6: update read Inquiry read "api/inquiry/:id".  Login required
router.put('/inquiries/:id/mark-as-read',middleware,deleteAndEditInquiryValidator, validate, inquiryCountroller.updateReadInquiry);
//Route 7: retator "api/retator/".  Login required
router.post('/retator', middleware,inquiryCountroller.getRealtorsWithMostInquiries);
module.exports = router;