const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AnswerSchema = new Schema({
    answer: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    questionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Answer', AnswerSchema);