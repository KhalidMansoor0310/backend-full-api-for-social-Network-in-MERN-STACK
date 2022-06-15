const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Client',
        required:true
    },
    name:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Client'
        }
    ]
},{
    timestamps:true
})

module.exports = mongoose.model('Post',postSchema);