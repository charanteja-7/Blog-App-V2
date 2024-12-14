const mongoose = require('mongoose');

const postSchema  = new mongoose.Schema({
    title:{
        type:String,
        required : true,
        unique : true
    },
    description:{
        type:String,
        required : true,
    },
    coverImageURL : {
        type:String,
        default : "https://res.cloudinary.com/dl61xv85e/image/upload/v1734198459/Cloudinary-React/nom3c5wo4sli2ygvy8ti.png",
        required : true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: String,
        enum: ["Technology", "Life Style", "Education", "Entertainment", "Business", "Arts and Culture", "Society and Politics"],
    },
    
    likes:[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
    }],
    views: {
        type: Number,
        default: 0
    },
},{timestamps: true});


const Post = mongoose.model('Post', postSchema);

module.exports = Post;