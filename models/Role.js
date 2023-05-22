const mongoose = require('mongoose') ;
const { STATUS } = require('../helper/constants');
const { Schema } = mongoose;
const RoleSchema = new Schema({
    name:{
        type: String,
        require: true,
        unique: true
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 1
    }
},{
    timestamps: true,
});
RoleSchema.virtual('statusText').get(function() {
    return this.status === 1 ? STATUS.ACTIVETEXT : STATUS.INACTIVETEXT;
});
const Role = mongoose.model('role', RoleSchema);
module.exports = Role;
