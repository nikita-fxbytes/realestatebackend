const {body, check,validationResult} = require('express-validator');
const Inquiry = require('../models/Inquiry');
const message = require('../helper/admin/messages');
//Create user
exports.createInquiryValidator = [
    // Name
    body('name')
    .notEmpty().withMessage(message.name.required)
    .isLength({min:3}).withMessage(message.name.length),
    // Email
    body('email')
    .notEmpty().withMessage(message.email.required)
    .isEmail().withMessage(message.email.invalid),
    // Mobile
    body('mobile')
    .notEmpty().withMessage(message.mobile.required)
    .isMobilePhone('any').withMessage(message.mobile.invalid)
    .isLength({ min: 10, max: 15 }).withMessage(message.mobile.length),
    // Message
    body('message')
    .notEmpty().withMessage(message.inquiry.message),
    // Property
    body('property')
    .notEmpty().withMessage(message.inquiry.property)
];
//End

// Delete and Edit user
exports.deleteAndEditInquiryValidator = [
    check('id').custom(async (value, { req }) => {
      const user = await Inquiry.findById(value).exec();
        if (!user) {
            throw new Error(message.notFound);
        }
        // Attach user to request object for later use
        req.user = user;
        return true;
    }),
  ];
// End
// Update user
exports.updateInquiryValidator = [
    // Name
    body('name')
    .notEmpty().withMessage(message.name.required)
    .isLength({min:3}).withMessage(message.name.length),
    // Email
    body('email')
    .notEmpty().withMessage(message.email.required)
    .isEmail().withMessage(message.email.invalid),
    //Mobile
    body('mobile')
    .notEmpty().withMessage(message.mobile.required)
    .isMobilePhone('any').withMessage(message.mobile.invalid)
    .isLength({ min: 10, max: 15 }).withMessage(message.mobile.length),
    // Message
    body('message')
    .notEmpty().withMessage(message.inquiry.message),
    // Property
    body('property')
    .notEmpty().withMessage(message.inquiry.property)
];
// End

//check validator
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            message: errors.array(),
            status: false
        });
    }
    next();
};
//End
