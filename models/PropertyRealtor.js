const mongoose = require('mongoose') ;
const { Schema } = mongoose;
const PropertyRealtorSchema = new Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    mobile: {
        type: Number,
        require: true,
        unique: true
    },
   
},{
    timestamps: true,
});

const PropertyRealtor = mongoose.model('propertyrealtor', PropertyRealtorSchema);
module.exports = PropertyRealtor;
