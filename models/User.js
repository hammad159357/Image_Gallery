const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    email: String,
    password: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
