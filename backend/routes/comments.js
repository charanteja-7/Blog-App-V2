const express = require('express')
const router = express.Router();
const Comments = require('../models/Comments');
const verifyToken = require('../verifyToken');



//create comment
router.post('/', verifyToken, async(req, res)=>{
    try {
        const newComment = new Comments(req.body);
        const savedComment = await newComment.save();
        return res.status(200).json(savedComment);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})


//update comment
router.put('/:id', verifyToken, async(req, res)=>{
    try {
        const updatedComment = await Comments.findByIdAndUpdate(req.params.id, 
                                {$set: req.body}, {new : true});
        return res.status(200).json(updatedComment);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})


//delete comment
router.delete('/:id', verifyToken, async(req, res)=>{
    try {
        await Comments.findByIdAndDelete(req.params.id);
        return res.status(200).json('Comment deleted Successfully');
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})


//get the comments
router.get('/post/:postId', async(req, res)=>{
    try {
        const comments = await Comments.find({ postId: req.params.postId }).populate('userId', 'username profileImageUrl');
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})


module.exports = router;