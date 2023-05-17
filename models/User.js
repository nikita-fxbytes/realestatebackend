const mongoose = require('mongoose') ;
const { Schema } = mongoose;
const UserSchema = new Schema({
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
    password: {
        type: String,
        require: true
    },
    roleId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role',
        require: true
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 1
    }
   
},{
    timestamps: true,
});
UserSchema.virtual('statusText').get(function() {
    return this.status === 1 ? 'Active' : 'Inactive';
});
const User = mongoose.model('user', UserSchema);
module.exports = User;
