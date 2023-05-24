const express = require('express');
const router = express.Router();
const inquiryCountroller = require('../../controllers/custmorpanrl/InquiryController');
const {createInquiryValidator, validate} = require('../../validators/customer/inquiryValidators');


//Route 2: Create Inquiry POST "api/inquiry" Login required
router.post('/inquiries', createInquiryValidator, validate, inquiryCountroller.createInquiry);

router.post('/retator',inquiryCountroller.getRealtorsWithMostInquiries);
module.exports = router;