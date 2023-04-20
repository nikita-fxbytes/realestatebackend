const mongoose = require('mongoose') ;
const { Schema } = mongoose;
const RoleSchema = new Schema({
    name:{
        type: String,
        require: true,
        unique: true
    }
},{
    timestamps: true,
});

const Role = mongoose.model('role', RoleSchema);
module.exports = Role;
