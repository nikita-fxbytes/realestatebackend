const User = require("../../../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const contant = require('../../../helper/constants')
const message = require('../../../helper/messages')
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
            password: setSecurePassword
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