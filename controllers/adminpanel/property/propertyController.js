const Property = require('../../../models/Property');
const contant = require('../../../helper/constants');
const message = require('../../../helper/messages');

//Get All property
exports.getAllProperties = async(req, res)=>{
    try {
        const properties = await Property.find();
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
        const {name, price, location, squareFeet, garage, bedrooms, bathrooms} = req.body;
        const saveProperty = new Property({
            name, 
            price, 
            garage, 
            bedrooms, 
            location,
            bathrooms,
            squareFeet, 
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
        const {name, price, location, squareFeet, garage, bedrooms, bathrooms} = req.body;
        const property = await Property.findByIdAndUpdate(req.params.id, {$set:{
            name, 
            price, 
            garage, 
            bedrooms, 
            bathrooms,
            location, 
            squareFeet
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