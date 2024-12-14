const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    profileImageUrl:{
        type:String,
        default : "https://res.cloudinary.com/dl61xv85e/image/upload/v1734198328/Cloudinary-React/p0qjdhzeorqu0csqibdl.png"
    },
    bio : {
        type:String,
        default: "One blog at a time"
    }
},{timestamps: true});


const User = mongoose.model('User', userSchema);

module.exports = User;