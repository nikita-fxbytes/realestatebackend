const mongoose = require('mongoose') ;
const { STATUS } = require('../helper/constants');
const { Schema } = mongoose;
const InquirySchema = new Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    mobile: {
        type: Number,
        require: true
    },
    message: {
        type: String,
        require: true
    },
    property:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'property',
        require: true
    },
    read: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true,
});
InquirySchema.virtual('statusText').get(function() {
    return this.read === false ? STATUS.UNREAD : STATUS.READ;
});
const Inquiry = mongoose.model('inquiry', InquirySchema);
module.exports = Inquiry;
