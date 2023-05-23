const {body, check,validationResult} = require('express-validator');
const message = require('../../helper/customer/messages');
const Property = require('../../models/Property')

// Details Property
exports.propertyDetailsValidator = [
    check('slug').custom((value, { req }) => {
      return Property.findOne({ slug: value }).exec().then((property) => {
        if (!property) {
          throw new Error('slug not found');
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