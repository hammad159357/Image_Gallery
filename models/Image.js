const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    imageUrl: String,
    title: String,
    description: String,
    isPublic: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

imageSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.imageUrl = `${process.env.BASE_URL || 'http://localhost:5000'}${ret.imageUrl}`;
        return ret;
    }
});


module.exports = mongoose.model('Image', imageSchema);
