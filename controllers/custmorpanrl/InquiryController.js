const Inquiry = require('../../models/Inquiry');
const Property = require('../../models/Property');
const messages = require('../../helper/admin/messages');
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
            message: messages.auth.serverError
        });
    }
}
//End


// exports.getRealtorsWithMostInquiries = async (req, res) => {
//     try {
//         const { searchTerm, sortColumn, sortDirection, page, perPage } = req.body;

//         const pipeline = [
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
//         ];

//         if (searchTerm) {
//             const searchTermRegex = /^[0-9]+$/; // Regular expression to match numbers only
//             if (searchTermRegex.test(searchTerm)) {
//                 pipeline.push({
//                     $match: {
//                         'realtorDetails.mobile': parseInt(searchTerm)
//                     }
//                 });
//             } else {
//                 pipeline.push({
//                     $match: {
//                         $or: [
//                             { 'realtorDetails.name': { $regex: searchTerm, $options: 'i' } },
//                             { 'realtorDetails.email': { $regex: searchTerm, $options: 'i' } }
//                         ]
//                     }
//                 });
//             }
//         }

//         pipeline.push(
//             {
//                 $group: {
//                     _id: '$realtorDetails._id',
//                     realtor: {
//                         $first: {
//                             name: '$realtorDetails.name',
//                             email: '$realtorDetails.email',
//                             mobile: '$realtorDetails.mobile',
//                             id: '$realtorDetails._id'
//                         }
//                     },
//                     totalInquiries: { $sum: '$count' }
//                 }
//             },
//             { $sort: { totalInquiries: sortDirection === 'desc' ? -1 : 1 } },
//             { $skip: (page - 1) * perPage },
//             { $limit: perPage },
//             { $project: { _id: 0 } }
//         );

//         const inquiriesByRealtorCount = await Inquiry.aggregate(pipeline);
//         const totalInquiries = inquiriesByRealtorCount.length;
//         const totalPages = Math.ceil(totalInquiries / perPage);

//         if (inquiriesByRealtorCount.length === 0) {
//             return res.json({
//                 status: contant.STATUSCODE.NOT_FOUND,
//                 realtors: [],
//                 totalPages: 0,
//                 currentPage: page,
//                 message: messages.inquiry.notRealtorFound
//             });
//         }

//         const realtors = inquiriesByRealtorCount.map(item => item.realtor);

//         res.json({
//             status: true,
//             realtors: realtors,
//             totalPages: totalPages,
//             currentPage: page,
//             message: messages.inquiry.getRealtors
//         });
//     } catch (error) {
//         res.json({
//             status: false,
//             message: messages.auth.serverError
//         });
//     }
// };





