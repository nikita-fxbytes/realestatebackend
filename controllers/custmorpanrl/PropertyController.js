const Property = require('../../models/Property');
const message = require('../../helper/customer/messages');
const constants = require('../../helper/constants');
// Get all propery
exports.getAllProperties = async (req, res) => {
  try {
    const {  sortColumn, sortDirection, page, perPage,onlyActive } = req.body;
    const filter = {};
   
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
      .populate(
        {
          path: 'propertyRealtor',
          select: 'name email mobile'
        });
    res.json({
      status: true,
      properties: properties,
      totalPages: totalProperties,
      currentPage: page,
      message: message.property.getProperty
    });
  } catch (error) {
    res.json({
      status: false,
      message: message.serverError
    });
  }
};
//end
// Property details
exports.properyDetails = async(req, res) =>{
  try {
    //property Edit
   const property =  await Property.findOne({ slug: req.body.slug }).populate(
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
    res.json({
        status: false,
        message: message.serverError
    });   
}
}
// End