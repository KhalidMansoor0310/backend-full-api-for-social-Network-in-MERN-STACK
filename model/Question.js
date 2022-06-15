const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const questionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
    ,
    author:{
        type:String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    
}, {
    timestamps: true
    });
module.exports = mongoose.model('Question', questionSchema);
    