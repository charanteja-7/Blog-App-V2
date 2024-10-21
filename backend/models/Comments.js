const mongoose = require('mongoose');

const commentSchema  = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,  
        required: true,
        ref: 'Post',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,  
        required: true,
        ref: 'User',
    },
}, { timestamps: true });

const Comments = mongoose.model('Comment', commentSchema);

module.exports = Comments;
