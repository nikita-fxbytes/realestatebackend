const User = require('../../models/User');
const Role = require("../../models/Role");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const contant = require('../../helper/constants');
const message = require('../../helper/admin/messages');

//Create User
exports.createUser = async(req, res)=>{
    try {
        //Store password encyp form
        const salt = await bcrypt.genSalt(10);
        const setSecurePassword = await bcrypt.hash(req.body.password, salt);
        //End
        //User create
        let user = await User.create({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: setSecurePassword,
            roleId: req.body.roleId
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
        res.status(contant.SERVER_ERROR).send(message.auth.serverError);
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
        res.status(contant.SERVER_ERROR).send(message.auth.serverError); 
    }
}
//End
// get all user
//Get All property
exports.getAllUsers = async(req, res)=>{
    // try {
        const searchTerm = req.body.searchTerm;
        const roleName = req.body.roleName;
        const sortColumn = req.body.sortColumn || 'createdAt';
        const sortDirection = req.body.sortDirection || 'desc';
        const page = req.body.page || 1;
        const perPage = req.body.perPage || 10;
        
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
          filter.$or = [
            { firstName: { $regex: searchTerm, $options: 'i' } },
            { lastName: { $regex: searchTerm, $options: 'i' } },
            { email: { $regex: searchTerm, $options: 'i' } }
          ];
        }
    
        // Count the total number of users matching the filter
        const totalUsers = await User.countDocuments(filter);
    
        // Find the users matching the filter, sorted and paginated
        const users = await User.find(filter)
          .sort({ [sortColumn]: sortDirection })
          .skip((page - 1) * perPage)
          .limit(perPage)
          .populate({
            path: 'roleId',
            select: 'name'
          });

          res.json({
            status: true,
            users: users,
            totalPages: Math.ceil(totalUsers / perPage),
            currentPage: page,
            message: message.user.getUser,
          });
        
    // } catch (error) {
    //     res.status(contant.SERVER_ERROR).send(message.auth.serverError); 
    // }
}
//end
//Update user
exports.updateUser = async(req, res) => {
    try {
        const {name, email, mobile, password, roleId} = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, {$set:{
            name, email, mobile, password, roleId
        } 
        }, {new: true});
        res.json({
            status: true,
            user: user,
            message: message.user.updateUser
        });
    } catch (error) {
        res.status(contant.SERVER_ERROR).send(message.auth.serverError); 
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
        res.status(contant.SERVER_ERROR).send(message.auth.serverError);   
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
        res.status(contant.SERVER_ERROR).send(message.auth.serverError);   
    }
}
// En