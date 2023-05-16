const Role = require('../../models/Role');
const contant = require('../../helper/constants');
const message = require('../../helper/admin/messages');
const constants = require('../../helper/constants');

//Get All role
exports.getAllRoles = async(req, res)=>{
    try {
        const searchTerm =  req.body.searchTerm;
        const sortColumn = req.body.sortColumn || constants.ORDERBY.CREATEDAT;
        const sortDirection = req.body.sortDirection || constants.ORDERBY.DESC;
        const page = req.body.page || constants.LIMIT.ITEMONE; // Get the current page number from the query params
        const perPage = req.body.perPage || constants.LIMIT.ITEMTEN; // Get the number of results per page from the query params
        let roles;
        let totalRoles;
        const skip = (page - 1) * perPage; // Calculate the number of results to skip
        if (searchTerm) {
            roles = await Role.find({ name: { $regex: searchTerm, $options: "i" } }).sort({ [sortColumn]: sortDirection }).skip(skip).limit(perPage);
            totalRoles = await Role.countDocuments({ name: { $regex: searchTerm, $options: "i" } });
        } else {
            roles = await Role.find().sort({ [sortColumn]: sortDirection }).skip(skip).limit(perPage);
            totalRoles = await Role.countDocuments();
        }
        const totalPages = Math.ceil(totalRoles / perPage); // Calculate the total number of pages
        res.json({
            status: true,
            roles: roles,
            totalRoles: totalRoles,
            totalPages: totalPages,
            currentPage: page,
            message: message.role.getRole
        })
        
    } catch (error) {
        res.status(contant.SERVER_ERROR).send(message.auth.serverError); 
    }
}
//end
//Create role
exports.createRole = async(req, res)=>{
    try {
        const {name} = req.body;
        const saveRole = new Role({
            name
        });
        const role = await saveRole.save();
        res.json({
            status: true,
            role: role,
            message: message.role.createRole
        })
    } catch (error) {
        res.status(contant.SERVER_ERROR).send(message.auth.serverError);
    }
}
//End
//Update role
exports.updateRole = async(req, res) => {
    try {
        const {name} = req.body;
        const role = await Role.findByIdAndUpdate(req.params.id, {$set:{
            name
        } 
        }, {new: true});
        res.json({
            status: true,
            role: role,
            message: message.role.updateRole
        });
    } catch (error) {
        res.status(contant.SERVER_ERROR).send(message.auth.serverError); 
    }
}
// End
// Update role realtor
exports.editRole = async (req, res) =>{
    try {
        //Task Edit
       const role =  await Role.findById(req.params.id);
        res.json({
            status: true,
            role: role,
            message:message.role.getRole
        });
        //End
    } catch (error) {
        res.status(contant.SERVER_ERROR).send(message.auth.serverError);   
    }
}
// End 
//Delete role
exports.deleteRole = async(req, res) =>{
    try {
        //Propery delete
        await Role.findByIdAndDelete(req.params.id);
        res.json({
            status: true,
            message: message.role.deleteRole
        });
        //End
        
    } catch (error) {
        res.status(contant.SERVER_ERROR).send(message.auth.serverError);   
    }
}
// End