const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const message = require('../helper/messages');
const bcrypt = require('bcryptjs');
//Create user
exports.createUserValidator = [
    body('name')
    .notEmpty().withMessage(message.name.required)
    .isLength({min:3}).withMessage(message.name.length),

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
   body('mobile')
   .notEmpty().withMessage(message.mobile.required)
   .isMobilePhone('any').withMessage(message.mobile.invalid)
   .isLength({ min: 10, max: 15 }).withMessage(message.mobile.length)
   .custom(async (value) => {
    const user = await User.findOne({mobile: value});
    if(user){
        throw new Error(message.mobile.taken);
    }
    return true;
   }),
   body('password')
    .notEmpty().withMessage(message.password.required)
    .isLength({ min: 6 }).withMessage(message.password.length)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage(message.password.match)
];
//End

//Login user
exports.logInValidator = [
    body('email')
    .notEmpty().withMessage(message.email.required)
    .isEmail().withMessage(message.email.invalid),
    body('password')
    .notEmpty().withMessage(message.password.required)
    .custom(async (value, {req})=>{
        const user = await User.findOne({email: req.body.email});
        if(!user){
            throw new Error(message.auth.invalidCredentials)
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);;
        if(!isMatch){
            throw new Error(message.auth.invalidCredentials);
        }
        return true
    })
]
//End

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