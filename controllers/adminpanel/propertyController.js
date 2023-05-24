const Property = require('../../models/Property');
const User = require('../../models/User');
const message = require('../../helper/admin/messages');
const constants = require('../../helper/constants');
const { generateUniqueSlug } = require('../../helper/sluggenerator/slugUtils');

//Get All property
exports.getAllProperties = async (req, res) => {
    try {
      const { searchTerm, sortColumn, sortDirection, page, perPage,onlyActive, status } = req.body;
      const filter = {};
  
      if (searchTerm) {
        const searchTermRegex = /^[0-9]+$/; // Regular expression to match numbers only
  
        if (searchTermRegex.test(searchTerm)) {
          // If the search term is a number, search on the price field
          filter.price = parseInt(searchTerm);
        } else {
          // If the search term is a string, search on the name and propertyRealtor fields
          filter.$or = [
            { name: { $regex: searchTerm, $options: 'i' } },
            {
              propertyRealtor: {
                $in: await User.find({
                  name: { $regex: searchTerm, $options: 'i' }
                }).distinct('_id')
              }
            }
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
      const totalProperties = await Property.countDocuments(filter);
  
      const sortOrder = sortDirection === 'desc' ? -1 : 1;
      const sortOptions = { [sortColumn]: sortOrder };
  
      const properties = await Property.find(filter)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .populate([
          {
            path: 'propertyRealtor',
            select: 'name email mobile'
          },
          {
            path: 'user',
            select: 'name email mobile'
          }
        ]);
        const propertiesWithStatusText = properties.map(property => {
          return {
          ...property._doc,
          statusText: property.statusText
          };
      });
      res.json({
        status: true,
        properties: propertiesWithStatusText,
        totalPages: Math.ceil(totalProperties / perPage),
        currentPage: page,
        message: message.property.getProperty
      });
    } catch (error) {
      res.json({
            status: false,
            message: message.auth.serverError
        });
    }
  };
//end
//Create Property
exports.createProperty = async(req, res)=>{
    try {
        const {name, price, location, squareFeet, garage, bedrooms, bathrooms,propertyRealtor, status, description} = req.body;
        const slug = await generateUniqueSlug(name, Property);
        // Check if the role ID exists
        const existingpropertyRealtor = await User.findById(propertyRealtor);
        if (!existingpropertyRealtor) {
          return res.status(constants.STATUSCODE.NOT_FOUND).json({
              status: false,
              message: message.property.notFound,
          });
        }
        const saveProperty = new Property({
            name, 
            price, 
            garage, 
            bedrooms, 
            location,
            bathrooms,
            squareFeet, 
            propertyRealtor,
            user: req.user.id,
            description,
            status,
            slug
        });

        const property = await saveProperty.save();
        res.json({
            status: true,
            property: property,
            message: message.property.createProperty
        })
    } catch (error) {
        res.json({
            status: false,
            message: message.auth.serverError
        });
    }
}
//End
//Update property
exports.updateProperty = async(req, res) => {
    try {

        const {name, price, location, squareFeet, garage, bedrooms, bathrooms, propertyRealtor, status, description} = req.body;
        // Check if the role ID exists
        const existingpropertyRealtor = await User.findById(propertyRealtor);
        if (!existingpropertyRealtor) {
          return res.status(constants.STATUSCODE.NOT_FOUND).json({
              status: false,
              message: message.property.notFound,
          });
        }
        const property = await Property.findByIdAndUpdate(req.params.id, {$set:{
            name, 
            price, 
            garage, 
            bedrooms, 
            bathrooms,
            location, 
            squareFeet,
            propertyRealtor,
            description,
            status
        } 
        }, {new: true});
        res.json({
            status: true,
            property: property,
            message: message.property.updateProperty
        });
    } catch (error) {
        res.json({
            status: false,
            message: message.auth.serverError
        }); 
    }
}
// End
// Update property 
exports.editProperty = async (req, res) => {
  try {
      const property = await Property.findById(req.params.id).populate({
          path: 'propertyRealtor',
          select: 'name email mobile'
      });

      // Add statusText to the property object
      const propertyWithStatusText = property.toObject();
      propertyWithStatusText.statusText = property.statusText;

      res.json({
          status: true,
          property: propertyWithStatusText,
          message: message.property.getProperty
      });
  } catch (error) {
      res.json({
          status: false,
          message: message.auth.serverError
      });
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
        res.json({
            status: false,
            message: message.auth.serverError
        });   
    }
}
// End