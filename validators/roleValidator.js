const {body, check,validationResult} = require('express-validator');
const message = require('../helper/admin/messages');
const Role = require('../models/Role')
//Create Role
exports.createRoleValidator = [
    body('name')
    .notEmpty().withMessage(message.name.required)
    .isLength({min:3}).withMessage(message.name.length)
    .custom(async (value) => {
        const role = await Role.findOne({name: value});
        if(role){
            throw new Error(message.role.taken);
        }
        return true;
       }),
]
//End
// Delete Role
exports.deleteAndEditRoleValidator = [
    check('id').custom((value, { req }) => {
      return Role.findById(value).exec().then((role) => {
        if (!role) {
          throw new Error('ID not found');
        }
        // Attach role to request object for later use
        req.role = role;
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