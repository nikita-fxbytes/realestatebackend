const {body, check,validationResult} = require('express-validator');
const User = require('../../models/User');
const message = require('../../helper/admin/messages');
const bcrypt = require('bcryptjs');
//Create user
exports.createUserValidator = [
    // Name
    body('name')
    .notEmpty().withMessage(message.name.required)
    .isLength({min:3}).withMessage(message.name.length),
    // Email
    body('email')
    .notEmpty().withMessage(message.email.required)
    .isEmail().withMessage(message.email.invalid)
    .custom(async (value)=>{
        const user = await User.findOne({
            email: value
        });
        if(user){
            throw new Error(message.email.taken);
        }
        return true;
    }),
    // Mobile
    body('mobile')
    .notEmpty().withMessage(message.mobile.required)
    .isMobilePhone('any').withMessage(message.mobile.invalid)
    .isLength({ min: 10, max: 15 }).withMessage(message.mobile.length)
    .custom(async (value) => {
        const user = await User.findOne({
            mobile: value
        });
        if(user){
            throw new Error(message.mobile.taken);
        }
        return true;
    }),
    // Password
    body('password')
    .notEmpty().withMessage(message.password.required)
    .isLength({ min: 6 }).withMessage(message.password.length)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage(message.password.match),
    // Role Id
    body('roleId')
    .notEmpty().withMessage(message.role.required),
    // Status
    body('status')
    .notEmpty().withMessage(message.status.required)
];
//End

//Login user
exports.logInValidator = [
    // Email
    body('email')
    .notEmpty().withMessage(message.email.required)
    .isEmail().withMessage(message.email.invalid),
    // Password
    body('password')
    .notEmpty().withMessage(message.password.required)
    .custom(async (value, {req})=>{
        const user = await User.findOne({
            email: req.body.email
        });
        if(!user){
            throw new Error(message.auth.invalidCredentials)
        }
        const isMatch = bcrypt.compare(req.body.password, user.password);;
        if(!isMatch){
            throw new Error(message.auth.invalidCredentials);
        }
        return true
    })
];
//End
// Delete and Edit user
exports.deleteAndEditUserValidator = [
    check('id').custom(async (value, { req }) => {
      const user = await User.findById(value).exec();
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
exports.updateUserValidator = [
    // Name
    body('name')
    .notEmpty().withMessage(message.name.required)
    .isLength({min:3}).withMessage(message.name.length),
    // Email
    body('email')
    .notEmpty().withMessage(message.email.required)
    .isEmail().withMessage(message.email.invalid)
    .custom(async (value, {req})=>{
        const user = await User.findOne({
            email: value
        });
        if(user && user._id.toString() !== req.params.id){
            throw new Error(message.email.taken);
        }
        return true;
    }),
    //Mobile
    body('mobile')
    .notEmpty().withMessage(message.mobile.required)
    .isMobilePhone('any').withMessage(message.mobile.invalid)
    .isLength({ min: 10, max: 15 }).withMessage(message.mobile.length)
    .custom(async (value, {req}) => {
        const user = await User.findOne({
            mobile: value
        });
        if(user && user._id.toString() !== req.params.id){
            throw new Error(message.mobile.taken);
        }
        return true;
    }),
    // Role Id
    body('roleId')
    .notEmpty().withMessage(message.role.required),
    // Status
    body('status')
    .notEmpty().withMessage(message.status.required)
];
// End
// Update profile
exports.updateProfileValidator = [
    // Name
    body('name')
    .notEmpty().withMessage(message.name.required)
    .isLength({min:3}).withMessage(message.name.length),
    // Email
    body('email')
    .notEmpty().withMessage(message.email.required)
    .isEmail().withMessage(message.email.invalid)
      .custom(async (value, { req }) => {
        if (value) {
            const user = await User.findOne({ 
                email: value 
            });
            if (user && user._id.toString() !== req.user.id.toString()) {
                throw new Error(message.email.taken);
            }
        }
        return true;
    }),
    // Mobile
    body('mobile')
    .notEmpty().withMessage(message.mobile.required)
    .isMobilePhone('any').withMessage(message.mobile.invalid)
    .isLength({ min: 10, max: 15 }).withMessage(message.mobile.length)
    .custom(async (value, { req }) => {
        if (value) {
            const user = await User.findOne({
                mobile: value 
            });
            if (user && user._id.toString() !== req.user.id.toString()) {
                throw new Error(message.mobile.taken);
            }
        }
        return true;
    })
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
