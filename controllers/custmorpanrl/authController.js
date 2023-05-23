const User = require('../../models/User');
const Role = require("../../models/Role");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const message = require('../../helper/customer/messages');
const constants = require('../../helper/constants');
const { STATUS,ROLENAME } = require('../../helper/constants');
//Create User
exports.createUser = async(req, res)=>{
    try {
        let {name, email, mobile, password} =req.body;
        // Check if the role ID exists
        // const existingRole = await Role.findById(roleId);
        const role = await Role.findOne({ name: ROLENAME.CUSTOMER });
        if (!role) {
            return res.status(constants.STATUSCODE.NOT_FOUND).json({
                status: false,
                message: message.role.notFound,
            });
        }
        //Store password encyp form
        const salt = await bcrypt.genSalt(constants.LIMIT.ITEMTEN);
        const setSecurePassword = await bcrypt.hash(password, salt);
        //End
        //User create
        let user = await User.create({
            name,
            email,
            mobile,
            password: setSecurePassword,
            roleId:role._id,
            status: STATUS.ACTIVE
        });
        //End
        //Create auth token
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, constants.JWT_SECRET);
        //End
        //Send responce
        res.json({
            status: true,
            authToken: authToken,
            user: {
                id: user._id,
                name: user.name,
              },
            message: message.auth.createUser
        });
        //End

    } catch (error) {
        console.log(error)
        res.json({
            status: false,
            message: message.serverError
        });
    }
}
//End
//Login user
exports.logInUser = async (req, res) => {
    try {
      let user = await User.findOne({ email: req.body.email }).populate("roleId");
      if (!user || user.roleId.name !== ROLENAME.CUSTOMER) {
        return res.json({
          status: false,
          message: message.auth.invalidCredentials,
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, constants.JWT_SECRET);
      res.json({
        status: true,
        authToken: authToken,
        user: {
            id: user._id,
            name: user.name,
          },
        message: message.auth.loginUser,
      });
    } catch (error) {
      res.json({
        status: false,
        message: message.serverError,
      });
    }
  };
//End
// get all user
//Get All property
exports.getRealtorUsers = async(req, res)=>{
    try {
        const{ roleName, sortColumn, sortDirection, page, perPage, onlyActive} =req.body;
        // Create an empty filter object
        let filter = {};
        // Add roleName filter if provided
        if (roleName) {
          const role = await Role.findOne({ name: roleName });
          if (role) {
            filter.roleId = role._id;
          } else {
            res.json({
              status: true,
              users: [],
              message: message.auth.getUser
            })
            return;
          }
        }
    
        // Add search term filter if provided
          if (onlyActive !== "") {
            if (onlyActive === constants.STATUS.ACTIVE) {
                filter.status = onlyActive;
            } else {
                filter.status = onlyActive;
            }
          }
        // Count the total number of users matching the filter
        const totalUsers = await User.countDocuments(filter);
          // Map roles to include the statusText property
       
        // Find the users matching the filter, sorted and paginated
        const users = await User.find(filter)
          .sort({ [sortColumn]: sortDirection })
          .skip((page - 1) * perPage)
          .limit(perPage)
          .populate({
            path: 'roleId',
            select: 'name'
          });
          const userWithStatusText = users.map(user => {
                return {
                ...user._doc,
                statusText: user.statusText
                };
            });
          res.json({
            status: true,
            users: userWithStatusText,
            totalPages: Math.ceil(totalUsers / perPage),
            currentPage: page,
            message: message.auth.getUser,
          });
        
    } catch (error) {
        res.json({
            status: false,
            message: message.serverError
        }); 
    }
}
//end



// Get logged-in user details
exports.getLoggedInUser = async (req, res) => {
    try {
      const userId = req.user.id; // Get the user ID from the authenticated token
      console.log(req);
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.json({
          status: false,
          message: message.auth.userNotFound,
        });
      }
      return res.json({
        status: true,
        user: user,
        message: message.auth.getUser,
      });
    } catch (error) {
      return res.json({
        status: false,
        message: message.serverError,
      });
    }
  };
// End
// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    const userId = req.user.id; // Get the user ID from the authenticated token

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        status: false,
        message: message.auth.userNotFound
      });
    }

    // Update the user's profile properties
    user.name = name || user.name;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;

    // Check if email is provided and update it
    // if (email) {
    //   if (email !== user.email) {
    //     user.email = email || user.email;
    //     return res.json({
    //       status: constants.STATUSCODE.UNAUTHENTICATED,
    //       message: 'Unauthorized email update'
    //     });
    //   }
      
    // }

    // Save the updated user
    const updatedUser = await user.save();

    return res.json({
      status: true,
      user: updatedUser,
      message: 'Profile updated'
    });
  } catch (error) {
    console.log(error, "error");
    return res.json({
      status: false,
      message: message.auth.serverError
    });
  }
};
  
  // Get logged-in user details

