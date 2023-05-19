const User = require('../../models/User');
const Role = require("../../models/Role");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const contant = require('../../helper/constants');
const message = require('../../helper/admin/messages');
const constants = require('../../helper/constants');

//Create User
exports.createUser = async(req, res)=>{
    try {
        const {name, email, mobile, password, roleId, status} =req.body;
        // Check if the role ID exists
        const existingRole = await Role.findById(roleId);
        if (!existingRole) {
            return res.status(contant.STATUSCODE.NOT_FOUND).json({
                status: false,
                message: message.auth.notFound,
            });
        }
        //Store password encyp form
        const salt = await bcrypt.genSalt(contant.LIMIT.ITEMTEN);
        const setSecurePassword = await bcrypt.hash(password, salt);
        //End
        //User create
        let user = await User.create({
            name,
            email,
            mobile,
            password: setSecurePassword,
            roleId,
            status
        });
        //End
        //Create auth token
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, contant.JWT_SECRET);
        //End
        //Send responce
        res.json({
            status: true,
            authToken: authToken,
            message: message.auth.createUser
        });
        //End

    } catch (error) {
        res.json({
            status: false,
            message: message.auth.serverError
        });
    }
}
//End
//Login user
exports.logInUser = async(req, res) =>{
    try {
        let user = await User.findOne({email:req.body.email});
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, contant.JWT_SECRET);
        res.json({
            status: true,
            authToken: authToken,
            message: message.auth.loginUser
        })
        
    } catch (error) {
        res.json({
            status: false,
            message: message.auth.serverError
        }); 
    }
}
//End
// get all user
//Get All property
exports.getAllUsers = async(req, res)=>{
    try {
        const{searchTerm, roleName, sortColumn, sortDirection, page, perPage, onlyActive, status} =req.body;
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
              message: message.user.getUser
            })
            return;
          }
        }
    
        // Add search term filter if provided
        if (searchTerm) {
            const searchTermRegex = /^[0-9]+$/; // Regular expression to match numbers only
            if (searchTermRegex.test(searchTerm)) {
              filter.mobile = parseInt(searchTerm); // Convert the valid number search term to a number
            } else {
              filter.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } },
                { roleId: { $in: await Role.find({ name: { $regex: searchTerm, $options: 'i' } }).distinct('_id') } } // Include role name search
              ];
            }
          }

          if (status !== "") {
            if (status === constants.STATUS.ACTIVE) {
                filter.status = status;;
            } else {
                filter.status = status;
            }
          }
    
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
            message: message.user.getUser,
          });
        
    } catch (error) {
        res.json({
            status: false,
            message: message.auth.serverError
        }); 
    }
}
//end
//Update user
exports.updateUser = async(req, res) => {
    try {
        const {name, email, mobile, password, roleId, status} = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, {$set:{
            name, email, mobile, password, roleId, status
        } 
        }, {new: true});
        res.json({
            status: true,
            user: user,
            message: message.user.updateUser
        });
    } catch (error) {
        res.json({
            status: false,
            message: message.auth.serverError
        }); 
    }
}
// End
// Update user
exports.editUser = async (req, res) =>{
    try {
        //user Edit
       const user =  await User.findById(req.params.id);
        res.json({
            status: true,
            user: user,
            message:message.user.getUser
        });
        //End
    } catch (error) {
        res.json({
            status: false,
            message: message.auth.serverError
        });   
    }
}
// End 
//Delete User
exports.deleteUser = async(req, res) =>{
    try {
        //Propery delete
        await User.findByIdAndDelete(req.params.id);
        res.json({
            status: true,
            message: message.user.deleteUser
        });
        //End
        
    } catch (error) {
        res.json({
            status: false,
            message: message.auth.serverError
        });   
    }
}
// End
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
        message: message.user.getUser,
      });
    } catch (error) {
      return res.json({
        status: false,
        message: message.auth.serverError,
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