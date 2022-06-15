const mongoose = require('mongoose');
const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
    },
    company: {
        type: String,
        required: true,
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    status: {
        type: String,
        required: true,
    },
   
    bio: {
        type: String,
    },
    githubusername: {
        type: String,
    },
        youtube: {
            type: String,
        },
        twitter: {
            type: String,
        },
        facebook: {
            type: String,
        },
        linkedin: {
            type: String,
        },
        instagram: {
            type: String,
        },
    
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Profile', profileSchema);
