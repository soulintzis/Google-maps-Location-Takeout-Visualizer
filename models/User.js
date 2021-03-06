const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    user_id: {
        type: String
    },
    admin: {
        type: Boolean,
        default: false
    },
    lastUpload: {
        type: Date
    }},
    {
        timestamps: true
    }
);

const User = mongoose.exports = mongoose.model('User', userSchema);
module.exports = User;

