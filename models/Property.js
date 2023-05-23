const mongoose = require('mongoose') ;
const { Schema } = mongoose;
const PropertySchema = new Schema({
    name:{
        type: String,
        require: true
    },
    price: {
        type: Number,
        required: true,
        min: 0.01
    },
    location:{
        type: String
    },
    squareFeet: {
        type: String
    },
    garage: {
        type: String
    },
    bedrooms: {
        type: String
    },
    bathrooms: {
        type: String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    propertyRealtor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 1
    },
    slug: {
        type: String,
        unique: true,
        required: true,
    },
    description:{
        type: String
    },
   
},{
    timestamps: true,
});
PropertySchema.virtual('statusText').get(function() {
    return this.status === 1 ? 'Active' : 'Inactive';
});
const Property = mongoose.model('property', PropertySchema);
module.exports = Property;
