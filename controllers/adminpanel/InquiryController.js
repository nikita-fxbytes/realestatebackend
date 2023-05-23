const Inquiry = require('../../models/Inquiry');
const Property = require('../../models/Property');
const messages = require('../../helper/admin/messages');
const contant = require('../../helper/constants');
// Get all inquiry
exports.getAllInquiries = async (req, res) => {
    try {
      const {searchTerm, status, sortColumn, sortDirection, page, perPage } = req.body;
      const filter = {};
      // Add search term filter if provided
      if (searchTerm) {
          const searchTermRegex = /^[0-9]+$/; // Regular expression to match numbers only
          if (searchTermRegex.test(searchTerm)) {
            filter.mobile = parseInt(searchTerm); // Convert the valid number search term to a number
          } else {
            filter.$or = [
              { name: { $regex: searchTerm, $options: 'i' } },
              { email: { $regex: searchTerm, $options: 'i' } },
              { property: { $in: await Property.find({ name: { $regex: searchTerm, $options: 'i' } }).distinct('_id') } } // Include role name search
            ];
          }
        }

        if (status !== "") {
          if (status) {
              filter.read = status;
          } else {
              filter.read = status;
          }
        }
      const totalInquiry = await Inquiry.countDocuments(filter);
      const sortOrder = sortDirection === 'desc' ? -1 : 1;
      const sortOptions = { [sortColumn]: sortOrder };
      const inquiry = await Inquiry.find(filter)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .populate([
          {
            path: 'property',
            select: 'name'
          }
        ]);
        const inquiryWithStatusText = inquiry.map(inquiry => {
          return {
          ...inquiry._doc,
          statusText: inquiry.statusText
          };
      });
      res.json({
        status: true,
        inquiries: inquiryWithStatusText,
        totalPages: Math.ceil(totalInquiry / perPage),
        currentPage: page,
        message: messages.inquiry.getInquiry
      });
    } catch (error) {
      res.json({
            status: false,
            message: messages.auth.serverError
        });
    }
  };
//End
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
            message: messages.auth.serverError
        });
    }
}
//End
//Update inquiry
exports.updateInquiry = async(req, res) => {
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
        const inquiries =  await Inquiry.findById(req.params.id);
        const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, {$set:{
            name, email, mobile, message, property, read: inquiries.read
        } 
        }, {new: true});
        res.json({
            status: true,
            inquiry: inquiry,
            message: messages.inquiry.updateInquiry
        });
    } catch (error) {
        res.json({
            status: false,
            message: messages.auth.serverError
        }); 
    }
}
// End
// Update Inquiry 
exports.editInquiry = async (req, res) =>{
    try {
        //Inquiry Edit
       const inquiry =  await Inquiry.findById(req.params.id).populate(
        {
            path: 'property',
            select: 'name'
        });
        res.json({
            status: true,
            inquiry: inquiry,
            message:messages.inquiry.getInquiry
        });
        //End
    } catch (error) {
        res.json({
            status: false,
            message: messages.auth.serverError
        });   
    }
}
// End 
//Delete Inquiry
exports.deleteInquiry = async(req, res) =>{
    try {
        //Inquiry delete
        await Inquiry.findByIdAndDelete(req.params.id);
        res.json({
            status: true,
            message: messages.inquiry.deleteInquiry
        });
        //End
        
    } catch (error) {
        res.json({
            status: false,
            message: messages.auth.serverError
        });   
    }
}
// End
//Update inquiry
exports.updateReadInquiry = async(req, res) => {
    try {
        const inquiries =  await Inquiry.findById(req.params.id);
        inquiries.read = !inquiries.read;
        const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, {$set:{
         read:inquiries.read
        } 
        }, {new: true});
        res.json({
            status: true,
            inquiry: inquiry,
            message: messages.inquiry.updateInquiry
        });
    } catch (error) {
        res.json({
            status: false,
            message: messages.auth.serverError
        }); 
    }
}
// End


// exports.getRealtorsWithMostInquiries = async (req, res) => {
//     try {
//         const inquiriesByRealtorCount = await Inquiry.aggregate([
//             { $group: { _id: '$property', count: { $sum: 1 } } },
//             { $sort: { count: -1 } },
//             { $limit: 10 },
//             { $lookup: { from: 'properties', localField: '_id', foreignField: '_id', as: 'propertyDetails' } },
//             { $unwind: '$propertyDetails' },
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: 'propertyDetails.propertyRealtor',
//                     foreignField: '_id',
//                     as: 'realtorDetails'
//                 }
//             },
//             { $unwind: '$realtorDetails' },
//             {
//                 $group: {
//                     _id: '$realtorDetails._id',
//                     realtor: { $first: '$realtorDetails' },
//                     totalInquiries: { $sum: '$count' }
//                 }
//             },
//             { $sort: { totalInquiries: -1 } },
//             { $project: { '_id': 0 } }
//         ]);

//         if (inquiriesByRealtorCount.length === 0) {
//             // return res.json({ message: 'No realtors found.' });
//             return  res.json({
//                 status: contant.STATUSCODE.NOT_FOUND,
//                 realtors: realtors,
//                 message: messages.inquiry.notRealtorFound
//             });
//         }

//         const realtors = inquiriesByRealtorCount.map(item => item.realtor);
//         res.json({
//             status: true,
//             realtors: realtors,
//             message: messages.inquiry.getRealtors
//         });
//     } catch (error) {
//         res.json({
//             status: false,
//             message: messages.auth.serverError
//         }); 
//     }
// };

exports.getRealtorsWithMostInquiries = async (req, res) => {
    try {
        const { searchTerm, sortColumn, sortDirection, page, perPage } = req.body;

        const pipeline = [
            { $group: { _id: '$property', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
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
        ];

        if (searchTerm) {
            const searchTermRegex = /^[0-9]+$/; // Regular expression to match numbers only
            if (searchTermRegex.test(searchTerm)) {
                pipeline.push({
                    $match: {
                        'realtorDetails.mobile': parseInt(searchTerm)
                    }
                });
            } else {
                pipeline.push({
                    $match: {
                        $or: [
                            { 'realtorDetails.name': { $regex: searchTerm, $options: 'i' } },
                            { 'realtorDetails.email': { $regex: searchTerm, $options: 'i' } }
                        ]
                    }
                });
            }
        }

        pipeline.push(
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
            { $sort: { totalInquiries: sortDirection === 'desc' ? -1 : 1 } },
            { $skip: (page - 1) * perPage },
            { $limit: perPage },
            { $project: { _id: 0 } }
        );

        const inquiriesByRealtorCount = await Inquiry.aggregate(pipeline);
        const totalInquiries = inquiriesByRealtorCount.length;
        const totalPages = Math.ceil(totalInquiries / perPage);

        if (inquiriesByRealtorCount.length === 0) {
            return res.json({
                status: contant.STATUSCODE.NOT_FOUND,
                realtors: [],
                totalPages: 0,
                currentPage: page,
                message: messages.inquiry.notRealtorFound
            });
        }

        const realtors = inquiriesByRealtorCount.map(item => item.realtor);

        res.json({
            status: true,
            realtors: realtors,
            totalPages: totalPages,
            currentPage: page,
            message: messages.inquiry.getRealtors
        });
    } catch (error) {
        res.json({
            status: false,
            message: messages.auth.serverError
        });
    }
};





