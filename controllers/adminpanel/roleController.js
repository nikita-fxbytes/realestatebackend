const Role = require('../../models/Role');
const contant = require('../../helper/constants');
const message = require('../../helper/admin/messages');

//Get All role
exports.getAllRoles = async(req, res)=>{
    try {
        const roles = await Role.find();
        res.json({
            status: true,
            roles: roles,
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