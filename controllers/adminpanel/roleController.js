const Role = require('../../models/Role');
const contant = require('../../helper/constants');
const message = require('../../helper/admin/messages');
const constants = require('../../helper/constants');

//Get All role
exports.getAllRoles = async (req, res) => {
    try {
      const { searchTerm, sortColumn, sortDirection, page, perPage, onlyActive, status } = req.body;
      let roles;
      let totalRoles;
      const skip = (page - 1) * perPage;
  
      const searchQuery = {};
  
      if (searchTerm) {
        searchQuery.name = { $regex: searchTerm, $options: "i" };
      }
   
      if (status !== "") {
        if (status === constants.STATUS.ACTIVE) {
            searchQuery.status = status;;
        } else {
            searchQuery.status = status;
        }
      }

      if (onlyActive !== "") {
        if (onlyActive === constants.STATUS.ACTIVE) {
          searchQuery.status = onlyActive;
        } else {
          searchQuery.status = onlyActive;
        }
      }
  
      roles = await Role.find(searchQuery)
        .sort({ [sortColumn]: sortDirection })
        .skip(skip)
        .limit(perPage);
      totalRoles = await Role.countDocuments(searchQuery);
  
      const totalPages = Math.ceil(totalRoles / perPage);
      // Map roles to include the statusText property
      const rolesWithStatusText = roles.map(role => {
          return {
          ...role._doc,
          statusText: role.statusText
          };
      });
      res.json({
        status: true,
        roles: rolesWithStatusText,
        totalRoles: totalRoles,
        totalPages: totalPages,
        currentPage: page,
        message: message.role.getRole,
      });
    } catch (error) {
      res.json({
            status: false,
            message: message.auth.serverError
        });
    }
  };
//end
//Create role
exports.createRole = async(req, res)=>{
    try {
        const {name, status} = req.body;
        const saveRole = new Role({
            name, status
        });
        const role = await saveRole.save();
        res.json({
            status: true,
            role: role,
            message: message.role.createRole
        })
    } catch (error) {
        res.json({
            status: false,
            message: message.auth.serverError
        });
    }
}
//End
//Update role
exports.updateRole = async(req, res) => {
    try {
        const {name, status} = req.body;
        const role = await Role.findByIdAndUpdate(req.params.id, {$set:{
            name, status
        } 
        }, {new: true});
        res.json({
            status: true,
            role: role,
            message: message.role.updateRole
        });
    } catch (error) {
        res.json({
            status: false,
            message: message.auth.serverError
        }); 
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
        res.json({
            status: false,
            message: message.auth.serverError
        });   
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
        res.json({
            status: false,
            message: message.auth.serverError
        });   
    }
}
// End