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
    }
   
},{
    timestamps: true,
});

const Property = mongoose.model('property', PropertySchema);
module.exports = Property;
