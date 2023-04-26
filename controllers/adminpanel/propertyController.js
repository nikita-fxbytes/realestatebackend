const Property = require('../../models/Property');
const User = require('../../models/User');
const contant = require('../../helper/constants');
const message = require('../../helper/admin/messages');

//Get All property
exports.getAllProperties = async(req, res)=>{
    try {
        const properties = await Property.find().populate([
            {
                path: 'propertyRealtor',
                select: 'name email, mobile'
            },
            {
                path: 'user',
                select: 'name email, mobile'
            }
        ]);
        res.json({
            status: true,
            properties: properties,
            message: message.property.getProperty
        })
        
    } catch (error) {
        res.status(contant.SERVER_ERROR).send(message.auth.serverError); 
    }
}
//end
//Create Property
exports.createProperty = async(req, res)=>{
    try {
        const {name, price, location, squareFeet, garage, bedrooms, bathrooms,propertyRealtor} = req.body;
        const saveProperty = new Property({
            name, 
            price, 
            garage, 
            bedrooms, 
            location,
            bathrooms,
            squareFeet, 
            propertyRealtor,
            user: req.user.id
        });
        const property = await saveProperty.save();
        res.json({
            status: true,
            property: property,
            message: message.property.createProperty
        })
    } catch (error) {
        res.status(contant.SERVER_ERROR).send(message.auth.serverError);
    }
}
//End
//Update property
exports.updateProperty = async(req, res) => {
    try {
        const {name, price, location, squareFeet, garage, bedrooms, bathrooms, propertyRealtor} = req.body;
        const property = await Property.findByIdAndUpdate(req.params.id, {$set:{
            name, 
            price, 
            garage, 
            bedrooms, 
            bathrooms,
            location, 
            squareFeet,
            propertyRealtor
        } 
        }, {new: true});
        res.json({
            status: true,
            property: property,
            message: message.property.updateProperty
        });
    } catch (error) {
        res.status(contant.SERVER_ERROR).send(message.auth.serverError); 
    }
}
// End
// Update property 
exports.editProperty = async (req, res) =>{
    try {
        //property Edit
       const property =  await Property.findById(req.params.id).populate(
        {
            path: 'propertyRealtor',
            select: 'name email, mobile'
        });
        res.json({
            status: true,
            property: property,
            message:message.property.getProperty
        });
        //End
    } catch (error) {
        res.status(contant.SERVER_ERROR).send(message.auth.serverError);   
    }
}
// End 
//Delete Property
exports.deleteProperty = async(req, res) =>{
    try {
        //Propery delete
        await Property.findByIdAndDelete(req.params.id);
        res.json({
            status: true,
            message: message.property.deleteProperty
        });
        //End
        
    } catch (error) {
        res.status(contant.SERVER_ERROR).send(message.auth.serverError);   
    }
}
// End