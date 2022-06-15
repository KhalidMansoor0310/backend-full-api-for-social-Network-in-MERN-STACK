const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', commentSchema);