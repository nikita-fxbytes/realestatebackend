const {body, check,validationResult} = require('express-validator');
const message = require('../helper/admin/messages');
const Property = require('../models/Property')
//Create property
exports.createPropertyValidator = [
    body('name')
    .notEmpty().withMessage(message.name.required)
    .isLength({min:3}).withMessage(message.name.length),

    body('price')
    .notEmpty().withMessage(message.property.price),
    body('propertyRealtor')
    .notEmpty().withMessage(message.user.propertyRealtor)
]
//End
// Delete Property
exports.deleteAndEditPropertyValidator = [
    check('id').custom((value, { req }) => {
      return Property.findById(value).exec().then((property) => {
        if (!property) {
          throw new Error('ID not found');
        }
        // Attach property to request object for later use
        req.property = property;
        return true;
      });
    }),
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