const Property = require('../../models/Property');
const User = require('../../models/User');
const contant = require('../../helper/constants');
const message = require('../../helper/admin/messages');

//Get All property
exports.getAllCount = async(req, res)=>{
    try {
        const propertiesCount = await Property.countDocuments();
        const usersCount = await User.countDocuments();
        res.json({
            status: true,
            allCount: {propertiesCount,usersCount},
            message: message.dashBoardCount
        })
        
    } catch (error) {
        console.log(error)
        res.status(contant.SERVER_ERROR).send(message.auth.serverError); 
    }
}
//end