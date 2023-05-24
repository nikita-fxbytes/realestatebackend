const Inquiry = require('../../models/Inquiry');
const Property = require('../../models/Property');
const messages = require('../../helper/customer/messages');
const contant = require('../../helper/constants');
//Create Inquiry
exports.createInquiry = async(req, res)=>{
    try {
        const {name, email, mobile, message, property} = req.body;
        // Check if the role ID exists
        const existingproperty = await Property.findById(property);
        if (!existingproperty) {
          return res.status(contant.STATUSCODE.NOT_FOUND).json({
              status: false,
              message: messages.inquiry.notFound,
          });
        }
        const saveInquiry = new Inquiry({
            name, 
            email, 
            mobile, 
            message, 
            property,
            read: false
        });

        const inquiry = await saveInquiry.save();
        res.json({
            status: true,
            inquiry: inquiry,
            message: messages.inquiry.createInquiry
        })
    } catch (error) {
        res.json({
            status: false,
            message: messages.serverError
        });
    }
}
//End


exports.getRealtorsWithMostInquiries = async (req, res) => {
    try {
      const { searchTerm, sortColumn, sortDirection, page, perPage } = req.body;
  
      const pipeline = [
        { $group: { _id: '$property', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $lookup: { from: 'properties', localField: '_id', foreignField: '_id', as: 'propertyDetails' } },
        { $unwind: '$propertyDetails' },
        {
          $lookup: {
            from: 'users',
            localField: 'propertyDetails.propertyRealtor',
            foreignField: '_id',
            as: 'realtorDetails'
          }
        },
        { $unwind: '$realtorDetails' },
        {
          $group: {
            _id: '$realtorDetails._id',
            realtor: {
              $first: {
                name: '$realtorDetails.name',
                email: '$realtorDetails.email',
                mobile: '$realtorDetails.mobile',
                id: '$realtorDetails._id'
              }
            },
            totalInquiries: { $sum: '$count' }
          }
        },
        { $sort: { totalInquiries: -1 } } // Sort by totalInquiries in descending order
      ];
  
      if (searchTerm) {
        const searchTermRegex = /^[0-9]+$/; // Regular expression to match numbers only
        if (searchTermRegex.test(searchTerm)) {
          pipeline.push({
            $match: {
              'realtor.mobile': parseInt(searchTerm)
            }
          });
        } else {
          pipeline.push({
            $match: {
              $or: [
                { 'realtor.name': { $regex: searchTerm, $options: 'i' } },
                { 'realtor.email': { $regex: searchTerm, $options: 'i' } }
              ]
            }
          });
        }
      }
  
      pipeline.push(
        { $sort: { [sortColumn]: sortDirection === 'desc' ? -1 : 1 } },
        {
          $facet: {
            paginatedResults: [
              { $skip: (page - 1) * perPage },
              { $limit: perPage }
            ],
            totalCount: [
              { $count: 'count' }
            ]
          }
        }
      );
  
      const [result] = await Inquiry.aggregate(pipeline);
      const realtors = result.paginatedResults.map(item => item.realtor);
      const totalCount = result.totalCount.length > 0 ? result.totalCount[0].count : 0;
  
      res.json({
        status: true,
        realtors: realtors,
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        message: messages.inquiry.getRealtors
      });
    } catch (error) {
      res.json({
        status: false,
        message: messages.serverError
    });
    }
  };





